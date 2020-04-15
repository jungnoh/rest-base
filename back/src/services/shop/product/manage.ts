/**
 * 
 * Option
 * - create
 * - update
 * 
 * Product
 * - view
 * - create
 * - update
 * - delete
 * 
 */

import { ObjectId } from 'bson';
import ProductModel, { ProductDoc } from 'models/product';
import ProductOptionModel, { ProductOptionDoc } from 'models/productOption';
import { ServiceResult } from 'util/types';
import { ProductOption, Product } from '@common/models';

/**
 * @description 새로운 상품 옵션을 생성합니다.
 * @param doc 생성할 옵션의 정보
 */
export async function createOption(doc: ProductOption):
ServiceResult<void, ProductOptionDoc> {
  const ret = await ProductOptionModel.create(doc);
  return {result: ret, success: true};
}

/**
 * @description 상품 옵션을 제거합니다.
 * @param id 제거할 옵션의 ObjectId
 */
export async function removeOption(id: ObjectId):
ServiceResult<'OPTION_NEXIST'> {
  const ret = await ProductOptionModel.findByIdAndDelete(id);
  if (!ret) {
    return {reason: 'OPTION_NEXIST', success: false};
  }
  return {success: true};
}

/**
 * @description 옵션을 변경합니다.
 * @param id 변경할 옵션의 ObjectId
 * @param doc 변경할 정보
 */
export async function updateOption(id: ObjectId, doc: Partial<ProductOption>):
ServiceResult<'OPTION_NEXIST', ProductOptionDoc> {
  const ret = await ProductOptionModel.findByIdAndUpdate(id, doc);
  if (!ret) {
    return {reason: 'OPTION_NEXIST', success: false};
  }
  return {success: true};
}

/**
 * 
 * @param id 변경할 상품의 ObjectId
 * @param doc 변경할 정보. `option` 필드는 무시됩니다.
 * @param options 변경할 옵션 정보. 기존에 존재하는 옵션이었다면 _id를 기입하고, 새로운 옵션이라면 _id를 undefined로 합니다.
 */
export async function updateProduct(
  id: ObjectId,
  doc: Partial<Product>,
  options: (ProductOption & {id?: ObjectId})[]
):
ServiceResult<'PRODUCT_NEXIST', ProductDoc> {
  let productObj = await ProductModel.findById(id);
  if (!productObj) {
    return {reason: 'PRODUCT_NEXIST', success: false};
  }
  const optionUsageCheck: {[key: string]: boolean} = {};
  productObj.options.forEach(x => optionUsageCheck[(x as ObjectId).toHexString()]=false);
  // Update options
  const newOptions: ObjectId[] = [];
  for (const option of options) {
    if (option.id) {
      // Don't care if the option doesn't exist
      await updateOption(option.id, option);
      newOptions.push(option.id);
      optionUsageCheck[option.id.toHexString()] = true;
    } else {
      const {result} = await createOption(option);
      newOptions.push(result!._id);
    }
  }
  // Remove unused options
  for (let [key, value] of Object.entries(optionUsageCheck)) {
    if (!value) {
      await removeOption(new ObjectId(key));
    }
  }
  // Update all other fields
  productObj = Object.assign(productObj, doc);
  productObj.options = newOptions;
  await productObj.save();
  return {
    result: productObj,
    success: true
  };
}
