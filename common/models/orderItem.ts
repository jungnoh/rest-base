import Product from "./product";
import ProductOption from "./productOption";
import Referral from "./referral";

/**
 * @description 주문 세부상품 모델
 */
export default interface OrderItem {
  // 상품 수
  count: number;
  // 상품 개당 가격
  itemPrice: number;
  // 해당 상품 (삭제시 set null)
  product: Product;
  // 해당 상품명
  productName: string;
  // 해당 옵션 (삭제시 set null)
  option: ProductOption;
  // 해당 옵션명
  optionName: string;
  // 마케팅 리퍼럴 키
  referral?: Referral;
}