import { ObjectId } from 'bson';
import ProductModel, { ProductDoc } from 'models/product';
import ProductOptionModel, { ProductOptionDoc } from 'models/productOption';
import { ServiceResult } from 'util/types';
import { ProductOption, Product } from '@common/models';
import { ProductType } from '@common/models/product';

/**
 * @description 새로운 상품 옵션을 생성합니다.
 * @param doc 생성할 옵션의 정보
 */
async function createOption(doc: {
  name: string;
  originalPrice: number;
  price: number;
  stockCount: number;
}): ServiceResult<void, ProductOptionDoc> {
  const ret = await ProductOptionModel.create(doc);
  return {result: ret, success: true};
}

/**
 * @description 상품 옵션을 제거합니다.
 * @param id 제거할 옵션의 ObjectId
 */
async function removeOption(id: ObjectId):
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
async function updateOption(id: ObjectId, doc: Partial<ProductOption>):
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

/**
 * @description 상품을 조회합니다.
 * @param id 상품의 ObjectId
 */
export async function viewProduct(id: ObjectId):
ServiceResult<'PRODUCT_NEXIST', ProductDoc & {options: ProductOption[]}> {
  const result = await ProductModel.findById(id).populate('options');
  if (!result) {
    return {reason: 'PRODUCT_NEXIST', success: false};
  }
  return {result: result as any, success: true};
}

/**
 * @description 상품을 생성합니다.
 * @param product 상품 정보
 */
export async function createProduct(product: {
  type: ProductType;
  title: string;
  description: string;
  basePrice: number;
  options: {
    name: string;
    originalPrice: number;
    price: number;
    stockCount: number;
  }[];
}): ServiceResult<'OPTION_ERROR', ProductDoc> {
  const optionIDs: ObjectId[] = [];
  const revertOptionAdd = async () => {
    for (const option of optionIDs) {
      await removeOption(option);
    }
  };
  try {
    for (const option of product.options) {
      const {result} = await createOption(option);
      optionIDs.push(result!._id);
    }
  } catch {
    await revertOptionAdd();
    return {reason: 'OPTION_ERROR', success: false};
  }
  const productObj = await ProductModel.create({
    title: product.title,
    type: product.type,
    description: product.description,
    basePrice: product.basePrice,
    options: optionIDs
  });
  return {result: productObj, success: true};
}

/**
 * @description 상품을 삭제합니다.
 * @param id 상품의 ObjectId
 */
export async function removeProduct(id: ObjectId):
ServiceResult<'PRODUCT_NEXIST'> {
  const ret = await ProductModel.findByIdAndDelete(id);
  if (!ret) {
    return {reason: 'PRODUCT_NEXIST', success: false};
  }
  return {success: true};
}
