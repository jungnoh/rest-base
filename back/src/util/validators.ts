import { body } from 'express-validator';

export const userSignupVal = [
  body('name').exists(),
  body('phone').exists(),
  body('email').exists().isEmail(),
  body('allowSMS').exists().isBoolean().toBoolean(),
  body('allowPush').exists().isBoolean().toBoolean(),
  body('username').exists().isLength({min: 8}),
  body('password').exists().isLength({min: 8})
];

export const addressVal = [
  body('address.name').exists().isLength({max: 40}),
  body('address.phone').exists().isLength({max: 40}),
  body('address.address1').exists().isLength({max: 80}),
  body('address.address2').exists().isLength({max: 80}),
  body('address.postalCode').exists().matches(/(\d{5,6})|(\d{3}-\d{3})/)
];
