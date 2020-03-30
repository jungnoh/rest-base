import { body } from 'express-validator';

// 사용자 정보 변경시 사용하는 validator (주소정보 제외)
export const userEditVal = [
  body('name').exists(),
  body('phone').exists(),
  body('email').exists().isEmail(),
  body('allowSMS').exists().isBoolean().toBoolean(),
  body('allowPush').exists().isBoolean().toBoolean(),
  body('username').exists().isLength({min: 8}),
  body('password').isLength({min: 8})
];

// 사용자 회원가입시 사용하는 validator (주소정보 제외)
export const userSignupVal = [
  ...userEditVal,
  body('password').exists().isLength({min: 8}),
  body('impIdentityKey').exists()
];

export const addressVal = [
  body('address.name').exists().isLength({max: 40}),
  body('address.phone').exists().isLength({max: 40}),
  body('address.address1').exists().isLength({max: 80}),
  body('address.address2').exists().isLength({max: 80}),
  body('address.postalCode').exists().matches(/(\d{5,6})|(\d{3}-\d{3})/)
];
