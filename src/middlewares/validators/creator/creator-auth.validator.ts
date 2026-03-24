import { validateRequest } from '..';
import { isRequired } from '../../../utils/validator.utils';

export const creatorSignupValidator = [
  isRequired('email'),
  isRequired('password'),
  isRequired('phoneNumber', true),
  isRequired('isdCode', true),
  ...validateRequest,
];

export const creatorLoginValidator = [
  isRequired('email'),
  isRequired('password'),
  ...validateRequest,
];

export const creatorPhoneLoginValidator = [
  isRequired('phoneNumber'),
  isRequired('password'),
  ...validateRequest,
];

export const creatorRefreshTokenValidator = [
  isRequired('refreshToken'),
  ...validateRequest,
];

export const creatorForgotPasswordValidator = [
  isRequired('email'),
  ...validateRequest,
];

export const creatorVerifyOtpValidator = [
  isRequired('email'),
  isRequired('otp'),
  ...validateRequest,
];

export const creatorResetPasswordValidator = [
  isRequired('email'),
  isRequired('otp'),
  isRequired('newPassword'),
  ...validateRequest,
];
