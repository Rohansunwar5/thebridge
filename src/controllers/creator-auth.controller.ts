import { NextFunction, Request, Response } from 'express';
import creatorAuthService from '../services/creator-auth.service';

export const creatorSignup = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, phoneNumber, isdCode } = req.body;
  const response = await creatorAuthService.signup({ email, password, phoneNumber, isdCode });

  next(response);
};

export const creatorLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const response = await creatorAuthService.login({ email, password });

  next(response);
};

export const creatorLoginWithPhone = async (req: Request, res: Response, next: NextFunction) => {
  const { phoneNumber, password } = req.body;
  const response = await creatorAuthService.loginWithPhone({ phoneNumber, password });

  next(response);
};

export const creatorRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body;
  const response = await creatorAuthService.refreshAccessToken(refreshToken);

  next(response);
};

export const creatorLogout = async (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.user;
  const response = await creatorAuthService.logout(_id);

  next(response);
};

export const creatorForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const response = await creatorAuthService.forgotPassword(email);

  next(response);
};

export const creatorVerifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  const { email, otp } = req.body;
  const response = await creatorAuthService.verifyOtp({ email, otp });

  next(response);
};

export const creatorResetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email, otp, newPassword } = req.body;
  const response = await creatorAuthService.resetPassword({ email, otp, newPassword });

  next(response);
};

export const creatorGetProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.user;
  const response = await creatorAuthService.getProfile(_id);

  next(response);
};
