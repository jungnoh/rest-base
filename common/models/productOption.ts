import Product from "./product";

/**
 * @description 상품 옵션
 */
export default interface ProductOption {
  // pk
  id: number;
  // 상품
  product?: Product;
  // 옵션명
  name: string;
  // 원래 가격 (표시 용도)
  originalPrice: number;
  // 할인 가격 (실제 구매가격)
  discountPrice: number;
  // 재고량
  stockCount: number;
}
