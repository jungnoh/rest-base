/**
 * @description 주소지 정보 모델. 사용자 정보, 배송지 정보 저장에서 이용
 */
export default interface Address {
  // 받는 사람
  name: string;
  // 전화번호
  phone: string;
  // 주소란 1
  address1: string;
  // 주소란 2
  address2: string;
  // 우편번호
  postalCode: string;
}