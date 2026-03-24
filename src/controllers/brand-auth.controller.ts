import { NextFunction, Request, Response } from 'express';
import brandAuthService from '../services/brand-auth.service';

export const brandSignup = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, phoneNumber, isdCode } = req.body;
  const response = await brandAuthService.signup({ email, password, phoneNumber, isdCode });

  next(response);
};

export const brandLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const response = await brandAuthService.login({ email, password });

  next(response);
};

export const brandLoginWithPhone = async (req: Request, res: Response, next: NextFunction) => {
  const { phoneNumber, password } = req.body;
  const response = await brandAuthService.loginWithPhone({ phoneNumber, password });

  next(response);
};

export const brandRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body;
  const response = await brandAuthService.refreshAccessToken(refreshToken);

  next(response);
};

export const brandLogout = async (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.user;
  const response = await brandAuthService.logout(_id);

  next(response);
};

export const brandForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const response = await brandAuthService.forgotPassword(email);

  next(response);
};

export const brandVerifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  const { email, otp } = req.body;
  const response = await brandAuthService.verifyOtp({ email, otp });

  next(response);
};

export const brandResetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email, otp, newPassword } = req.body;
  const response = await brandAuthService.resetPassword({ email, otp, newPassword });

  next(response);
};

export const brandGetProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.user;
  const response = await brandAuthService.getProfile(_id);

  next(response);
};
