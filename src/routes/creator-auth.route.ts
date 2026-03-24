import { Router } from 'express';
import { asyncHandler } from '../utils/asynchandler';
import {
  creatorSignup,
  creatorLogin,
  creatorLoginWithPhone,
  creatorRefreshToken,
  creatorLogout,
  creatorForgotPassword,
  creatorVerifyOtp,
  creatorResetPassword,
  creatorGetProfile,
} from '../controllers/creator-auth.controller';
import {
  creatorSignupValidator,
  creatorLoginValidator,
  creatorPhoneLoginValidator,
  creatorRefreshTokenValidator,
  creatorForgotPasswordValidator,
  creatorVerifyOtpValidator,
  creatorResetPasswordValidator,
} from '../middlewares/validators/creator/creator-auth.validator';
import isCreatorLoggedIn from '../middlewares/creator/isCreatorLoggedIn.middleware';

const creatorAuthRouter = Router();

// Public
creatorAuthRouter.post('/signup', creatorSignupValidator, asyncHandler(creatorSignup));
creatorAuthRouter.post('/login', creatorLoginValidator, asyncHandler(creatorLogin));
creatorAuthRouter.post('/login/phone', creatorPhoneLoginValidator, asyncHandler(creatorLoginWithPhone));
creatorAuthRouter.post('/refresh-token', creatorRefreshTokenValidator, asyncHandler(creatorRefreshToken));
creatorAuthRouter.post('/forgot-password', creatorForgotPasswordValidator, asyncHandler(creatorForgotPassword));
creatorAuthRouter.post('/verify-otp', creatorVerifyOtpValidator, asyncHandler(creatorVerifyOtp));
creatorAuthRouter.post('/reset-password', creatorResetPasswordValidator, asyncHandler(creatorResetPassword));

// Protected
creatorAuthRouter.get('/profile', isCreatorLoggedIn, asyncHandler(creatorGetProfile));
creatorAuthRouter.post('/logout', isCreatorLoggedIn, asyncHandler(creatorLogout));

export default creatorAuthRouter;
