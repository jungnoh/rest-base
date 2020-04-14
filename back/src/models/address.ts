/**
 * @description 주소 스키마. 별도 모델을 생성하지 않고 nested document로 이용합니다.
 */
const addressSchema = {
  name: {required: true, type: String},
  phone: {required: true, type: String},
  address1: {required: true, type: String},
  address2: {type: String},
  postalCode: {required: true, type: String}
};

export default addressSchema;
