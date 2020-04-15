import { ObjectId } from 'bson';
import ProductModel, { ProductDoc } from 'models/product';
import ProductOptionModel, { ProductOptionDoc } from 'models/productOption';
import { ServiceResult } from 'util/types';

export async function findProduct(id: ObjectId):
ServiceResult<'PRODUCT_NEXIST', ProductDoc> {
  const ret = await ProductModel.findById(id).populate('options');
  if (!ret) {
    return {reason: 'PRODUCT_NEXIST', success: false};
  }
  return {result: ret, success: true};
}

/**
 * @description 옵션을 판매했을 때의 처리를 수행합니다. (재고량 감소 등)
 */
export async function handleOptionSold(option: ObjectId, count: number):
ServiceResult<'OPTION_NEXIST', ProductOptionDoc> {
  const result = await ProductOptionModel.findByIdAndUpdate(option, {stockCount: {$inc: -count}});
  if (!result) {
    return {reason: 'OPTION_NEXIST', success: false};
  }
  return {result, success: true};
}
