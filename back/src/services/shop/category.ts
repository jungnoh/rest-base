import { ObjectId } from 'bson';
import CategoryModel, { CategoryDoc } from 'models/category';
import { ServiceResult } from 'util/types';
import { Category } from '@common/models';

async function removeEl(id: ObjectId, recursive: boolean, updateParent = false): Promise<boolean> {
  const el = await CategoryModel.findById(id);
  if (!el) return false;
  if (updateParent && el.parent) {
    const parent = await CategoryModel.findById(el.parent);
    if (parent) {
      parent.children = parent.children.filter(x => !(x as ObjectId).equals(id));
      await parent.save();
    }
  }
  if (recursive) {
    for (const child of el.children) {
      await removeEl(child as ObjectId, true);
    }
  }
  await CategoryModel.updateMany({ancestors: el._id}, {$pull: {ancestors: el._id}});
  await el.remove();
  return true;
}

/**
 * @description 카테고리 항목을 삭제합니다. 모든 하위 카테고리도 삭제됩니다.
 * @param id 삭제할 카테고리의 ObjectId
 */
export async function remove(id: ObjectId):
ServiceResult<'NEXIST'> {
  const removed = await removeEl(id, true, true);
  if (!removed) {
    return {reason: 'NEXIST', success: false};
  }
  return {success: true};
}

/**
 * @description 새로운 카테고리를 생성합니다.
 * @param name 새로운 카테고리의 제목
 * @param parent 새로운 카테고리의 부모 ObjectId
 */
export async function create(name: string, parent?: ObjectId):
ServiceResult<'PARENT_NEXIST', Category> {
  const parentEl = parent ? (await CategoryModel.findById(parent)) : null;
  if (parent && (parentEl !== null)) {
    return {reason: 'PARENT_NEXIST', success: false};
  }
  const el = await CategoryModel.create({
    ancestors: (parentEl ? [...parentEl.ancestors, parent] : []),
    name,
    parent
  });
  if (parentEl) {
    parentEl.children.push(el._id);
    await parentEl.save();
  }
  return {result: el, success: true};
}

/**
 * @description 카테고리의 이름을 변경합니다.
 * @param id 대상 카테고리 ObjectId
 * @param name 새 이름
 */
export async function rename(id: ObjectId, name: string):
ServiceResult<'NEXIST'> {
  const el = await CategoryModel.findByIdAndUpdate(id, {name});
  if (!el) {
    return {reason: 'NEXIST', success: false};
  }
  return {success: true};
}

/**
 * @description 카테고리의 부모 노드를 변경합니다.
 * @param id 대상 카테고리의 ObjectId
 * @param parent 새 부모의 ObjectId
 */
export async function updateParent(id: ObjectId, parent: ObjectId | undefined):
ServiceResult<'NEXIST'|'PARENT_NEXIST'> {
  const el = await CategoryModel.findById(id);
  if (!el) {
    return {reason: 'NEXIST', success: false};
  }
  const updateOldParent = async () => {
    if (el.parent) {
      const oldParent = await CategoryModel.findById(el.parent);
      if (oldParent) {
        oldParent.children = oldParent.children.filter(x => !(x as ObjectId).equals(id));
        await oldParent.save();
      }
    }
  };
  const oldAncestors = el.ancestors;
  let newAncestors: ObjectId[] = [];
  if (parent) {
    const newParent = await CategoryModel.findById(parent);
    if (!newParent) {
      return {reason: 'PARENT_NEXIST', success: false};
    }
    newParent.children.push(id);
    await newParent.save();
    await updateOldParent();
    newAncestors = [...(newParent.ancestors as ObjectId[]), parent];
  } else {
    await updateOldParent();
  }
  el.parent = parent;
  await el.save();
  await CategoryModel.updateMany(
    {ancestors: el},
    {$pull: {ancestors: {$in: oldAncestors}}, $push: { scores: { $each: newAncestors}}}
  );
  return {success: true};
}

/**
 * @description 카테고리를 가져옵니다. 부모와 자식 노드는 populate 됩니다.
 * @param id 카테고리의 ObjectId
 */
export async function view(id: ObjectId):
ServiceResult<'NEXIST', CategoryDoc> {
  const el = await CategoryModel.findById(id).populate('parent children');
  if (!el) {
    return {reason: 'NEXIST', success: false};
  }
  return {result: el, success: true};
}