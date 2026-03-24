import { Router } from 'express';
import { asyncHandler } from '../utils/asynchandler';
import {
  brandSignup,
  brandLogin,
  brandLoginWithPhone,
  brandRefreshToken,
  brandLogout,
  brandForgotPassword,
  brandVerifyOtp,
  brandResetPassword,
  brandGetProfile,
} from '../controllers/brand-auth.controller';
import {
  brandSignupValidator,
  brandLoginValidator,
  brandPhoneLoginValidator,
  brandRefreshTokenValidator,
  brandForgotPasswordValidator,
  brandVerifyOtpValidator,
  brandResetPasswordValidator,
} from '../middlewares/validators/brand/brand-auth.validator';
import isBrandLoggedIn from '../middlewares/brand/isBrandLoggedIn.middleware';

const brandAuthRouter = Router();

// Public
brandAuthRouter.post('/signup', brandSignupValidator, asyncHandler(brandSignup));
brandAuthRouter.post('/login', brandLoginValidator, asyncHandler(brandLogin));
brandAuthRouter.post('/login/phone', brandPhoneLoginValidator, asyncHandler(brandLoginWithPhone));
brandAuthRouter.post('/refresh-token', brandRefreshTokenValidator, asyncHandler(brandRefreshToken));
brandAuthRouter.post('/forgot-password', brandForgotPasswordValidator, asyncHandler(brandForgotPassword));
brandAuthRouter.post('/verify-otp', brandVerifyOtpValidator, asyncHandler(brandVerifyOtp));
brandAuthRouter.post('/reset-password', brandResetPasswordValidator, asyncHandler(brandResetPassword));

// Protected
brandAuthRouter.get('/profile', isBrandLoggedIn, asyncHandler(brandGetProfile));
brandAuthRouter.post('/logout', isBrandLoggedIn, asyncHandler(brandLogout));

export default brandAuthRouter;
