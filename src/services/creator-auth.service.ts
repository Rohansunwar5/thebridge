import config from '../config';
import { BadRequestError } from '../errors/bad-request.error';
import { InternalServerError } from '../errors/internal-server.error';
import { NotFoundError } from '../errors/not-found.error';
import { UnauthorizedError } from '../errors/unauthorized.error';
import { CreatorRepository } from '../repository/creator.repository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { encode, encryptionKey } from './crypto.service';
import {
  creatorAccessTokenCache,
  creatorRefreshTokenCache,
  creatorOtpCache,
} from './cache/entities';

class CreatorAuthService {
  constructor(private readonly _creatorRepository: CreatorRepository) {}

  async signup(params: {
    email: string;
    password: string;
    phoneNumber?: string;
    isdCode?: string;
  }) {
    const { email, password, phoneNumber, isdCode } = params;

    const existing = await this._creatorRepository.getByEmail(email);
    if (existing) throw new BadRequestError('Email address already exists');

    const hashedPassword = await this.hashPassword(password);

    const creator = await this._creatorRepository.create({
      email,
      password: hashedPassword,
      authProvider: 'email',
      phoneNumber,
      isdCode,
    });
    if (!creator) throw new InternalServerError('Failed to create creator');

    const { accessToken, refreshToken } = await this.generateTokenPair(creator._id);

    return {
      accessToken,
      refreshToken,
      user: {
        _id: creator._id,
        email: creator.email,
        role: 'creator',
        onboardingComplete: creator.onboardingComplete,
      },
      msg: 'Signup successful',
      statusCode: 201,
    };
  }

  async login(params: { email: string; password: string }) {
    const { email, password } = params;

    const creator = await this._creatorRepository.getByEmail(email);
    if (!creator) throw new NotFoundError('Creator not found');
    if (creator.deletedAccount) throw new BadRequestError('Account has been deleted');
    if (!creator.password) throw new BadRequestError('Please use social login or reset your password');

    const isValid = await this.verifyHashPassword(password, creator.password);
    if (!isValid) throw new UnauthorizedError('Invalid email or password');

    const { accessToken, refreshToken } = await this.generateTokenPair(creator._id);

    return {
      accessToken,
      refreshToken,
      user: {
        _id: creator._id,
        email: creator.email,
        role: 'creator',
        onboardingComplete: creator.onboardingComplete,
      },
      msg: 'Login successful',
    };
  }

  async loginWithPhone(params: { phoneNumber: string; password: string }) {
    const { phoneNumber, password } = params;

    const creator = await this._creatorRepository.getByPhone(phoneNumber);
    if (!creator) throw new NotFoundError('Creator not found');
    if (creator.deletedAccount) throw new BadRequestError('Account has been deleted');
    if (!creator.password) throw new BadRequestError('Please use social login or reset your password');

    const isValid = await this.verifyHashPassword(password, creator.password);
    if (!isValid) throw new UnauthorizedError('Invalid phone number or password');

    const { accessToken, refreshToken } = await this.generateTokenPair(creator._id);

    return {
      accessToken,
      refreshToken,
      user: {
        _id: creator._id,
        email: creator.email,
        role: 'creator',
        onboardingComplete: creator.onboardingComplete,
      },
      msg: 'Login successful',
    };
  }

  async refreshAccessToken(token: string) {
    try {
      const payload = jwt.verify(token, config.JWT_REFRESH_SECRET) as { _id: string; role: string };
      if (payload.role !== 'creator') throw new UnauthorizedError('Invalid refresh token');

      const cachedToken = await creatorRefreshTokenCache.get({ userId: payload._id });
      if (!cachedToken || cachedToken !== token) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      const creator = await this._creatorRepository.getById(payload._id);
      if (!creator) throw new NotFoundError('Creator not found');

      const { accessToken, refreshToken } = await this.generateTokenPair(creator._id);

      return { accessToken, refreshToken, msg: 'Token refreshed' };
    } catch (error) {
      if (error instanceof UnauthorizedError || error instanceof NotFoundError) throw error;
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }

  async logout(userId: string) {
    await creatorRefreshTokenCache.remove({ userId });
    await creatorAccessTokenCache.remove({ userId });

    return { msg: 'Logged out successfully' };
  }

  async forgotPassword(email: string) {
    const creator = await this._creatorRepository.getByEmail(email);
    if (!creator) throw new NotFoundError('Creator not found');

    await creatorOtpCache.set({ userId: creator._id }, { code: config.STATIC_OTP });

    return { msg: 'OTP sent successfully' };
  }

  async verifyOtp(params: { email: string; otp: string }) {
    const { email, otp } = params;

    const creator = await this._creatorRepository.getByEmail(email);
    if (!creator) throw new NotFoundError('Creator not found');

    const cached = await creatorOtpCache.get({ userId: creator._id });
    if (!cached || cached.code !== otp) {
      throw new BadRequestError('Invalid or expired OTP');
    }

    return { userId: creator._id, msg: 'OTP verified' };
  }

  async resetPassword(params: { email: string; otp: string; newPassword: string }) {
    const { email, otp, newPassword } = params;

    const creator = await this._creatorRepository.getByEmail(email);
    if (!creator) throw new NotFoundError('Creator not found');

    const cached = await creatorOtpCache.get({ userId: creator._id });
    if (!cached || cached.code !== otp) {
      throw new BadRequestError('Invalid or expired OTP');
    }

    const hashedPassword = await this.hashPassword(newPassword);
    const updated = await this._creatorRepository.updatePassword(creator._id, hashedPassword);
    if (!updated) throw new InternalServerError('Failed to reset password');

    await creatorOtpCache.remove({ userId: creator._id });
    await creatorRefreshTokenCache.remove({ userId: creator._id });
    await creatorAccessTokenCache.remove({ userId: creator._id });

    return { msg: 'Password reset successful' };
  }

  async getProfile(userId: string) {
    const creator = await this._creatorRepository.getById(userId);
    if (!creator) throw new NotFoundError('Creator not found');

    return creator;
  }

  // ----- Private helpers -----

  private async verifyHashPassword(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }

  private async hashPassword(plain: string): Promise<string> {
    return bcrypt.hash(plain, 10);
  }

  private async generateTokenPair(userId: string) {
    const accessToken = jwt.sign(
      { _id: userId.toString(), role: 'creator' },
      config.JWT_ACCESS_SECRET,
      { expiresIn: config.JWT_ACCESS_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { _id: userId.toString(), role: 'creator' },
      config.JWT_REFRESH_SECRET,
      { expiresIn: config.JWT_REFRESH_EXPIRY }
    );

    await creatorRefreshTokenCache.set({ userId: userId.toString() }, refreshToken);

    const key = await encryptionKey(config.JWT_CACHE_ENCRYPTION_KEY);
    const encryptedData = await encode(accessToken, key);
    await creatorAccessTokenCache.set({ userId: userId.toString() }, encryptedData);

    return { accessToken, refreshToken };
  }
}

export default new CreatorAuthService(new CreatorRepository());
