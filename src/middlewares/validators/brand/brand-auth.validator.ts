import { validateRequest } from '..';
import { isRequired } from '../../../utils/validator.utils';

export const brandSignupValidator = [
  isRequired('email'),
  isRequired('password'),
  isRequired('phoneNumber', true),
  isRequired('isdCode', true),
  ...validateRequest,
];

export const brandLoginValidator = [
  isRequired('email'),
  isRequired('password'),
  ...validateRequest,
];

export const brandPhoneLoginValidator = [
  isRequired('phoneNumber'),
  isRequired('password'),
  ...validateRequest,
];

export const brandRefreshTokenValidator = [
  isRequired('refreshToken'),
  ...validateRequest,
];

export const brandForgotPasswordValidator = [
  isRequired('email'),
  ...validateRequest,
];

export const brandVerifyOtpValidator = [
  isRequired('email'),
  isRequired('otp'),
  ...validateRequest,
];

export const brandResetPasswordValidator = [
  isRequired('email'),
  isRequired('otp'),
  isRequired('newPassword'),
  ...validateRequest,
];
