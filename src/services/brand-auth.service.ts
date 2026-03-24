import config from '../config';
import { BadRequestError } from '../errors/bad-request.error';
import { InternalServerError } from '../errors/internal-server.error';
import { NotFoundError } from '../errors/not-found.error';
import { UnauthorizedError } from '../errors/unauthorized.error';
import { BrandRepository } from '../repository/brand.repository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { encode, encryptionKey } from './crypto.service';
import {
  brandAccessTokenCache,
  brandRefreshTokenCache,
  brandOtpCache,
} from './cache/entities';

class BrandAuthService {
  constructor(private readonly _brandRepository: BrandRepository) { }

  async signup(params: {
    email: string;
    password: string;
    phoneNumber?: string;
    isdCode?: string;
  }) {
    const { email, password, phoneNumber, isdCode } = params;

    const existing = await this._brandRepository.getByEmail(email);
    if (existing) throw new BadRequestError('Email address already exists');

    const hashedPassword = await this.hashPassword(password);

    const brand = await this._brandRepository.create({
      email,
      password: hashedPassword,
      authProvider: 'email',
      phoneNumber,
      isdCode,
    });
    if (!brand) throw new InternalServerError('Failed to create brand');

    const { accessToken, refreshToken } = await this.generateTokenPair(brand._id);

    return {
      accessToken,
      refreshToken,
      user: {
        _id: brand._id,
        email: brand.email,
        role: 'brand',
        onboardingComplete: brand.onboardingComplete,
      },
      msg: 'Signup successful',
      statusCode: 201,
    };
  }

  async login(params: { email: string; password: string }) {
    const { email, password } = params;

    const brand = await this._brandRepository.getByEmail(email);
    if (!brand) throw new NotFoundError('Brand not found');
    if (brand.deletedAccount) throw new BadRequestError('Account has been deleted');
    if (!brand.password) throw new BadRequestError('Please use social login or reset your password');

    const isValid = await this.verifyHashPassword(password, brand.password);
    if (!isValid) throw new UnauthorizedError('Invalid email or password');

    const { accessToken, refreshToken } = await this.generateTokenPair(brand._id);

    return {
      accessToken,
      refreshToken,
      user: {
        _id: brand._id,
        email: brand.email,
        role: 'brand',
        onboardingComplete: brand.onboardingComplete,
      },
      msg: 'Login successful',
    };
  }

  async loginWithPhone(params: { phoneNumber: string; password: string }) {
    const { phoneNumber, password } = params;

    const brand = await this._brandRepository.getByPhone(phoneNumber);
    if (!brand) throw new NotFoundError('Brand not found');
    if (brand.deletedAccount) throw new BadRequestError('Account has been deleted');
    if (!brand.password) throw new BadRequestError('Please use social login or reset your password');

    const isValid = await this.verifyHashPassword(password, brand.password);
    if (!isValid) throw new UnauthorizedError('Invalid phone number or password');

    const { accessToken, refreshToken } = await this.generateTokenPair(brand._id);

    return {
      accessToken,
      refreshToken,
      user: {
        _id: brand._id,
        email: brand.email,
        role: 'brand',
        onboardingComplete: brand.onboardingComplete,
      },
      msg: 'Login successful',
    };
  }

  async refreshAccessToken(token: string) {
    try {
      const payload = jwt.verify(token, config.JWT_REFRESH_SECRET) as { _id: string; role: string };
      if (payload.role !== 'brand') throw new UnauthorizedError('Invalid refresh token');

      const cachedToken = await brandRefreshTokenCache.get({ userId: payload._id });
      if (!cachedToken || cachedToken !== token) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      const brand = await this._brandRepository.getById(payload._id);
      if (!brand) throw new NotFoundError('Brand not found');

      const { accessToken, refreshToken } = await this.generateTokenPair(brand._id);

      return { accessToken, refreshToken, msg: 'Token refreshed' };
    } catch (error) {
      if (error instanceof UnauthorizedError || error instanceof NotFoundError) throw error;
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }

  async logout(userId: string) {
    await brandRefreshTokenCache.remove({ userId });
    await brandAccessTokenCache.remove({ userId });

    return { msg: 'Logged out successfully' };
  }

  async forgotPassword(email: string) {
    const brand = await this._brandRepository.getByEmail(email);
    if (!brand) throw new NotFoundError('Brand not found');

    await brandOtpCache.set({ userId: brand._id }, { code: config.STATIC_OTP });

    return { msg: 'OTP sent successfully' };
  }

  async verifyOtp(params: { email: string; otp: string }) {
    const { email, otp } = params;

    const brand = await this._brandRepository.getByEmail(email);
    if (!brand) throw new NotFoundError('Brand not found');

    const cached = await brandOtpCache.get({ userId: brand._id });
    if (!cached || cached.code !== otp) {
      throw new BadRequestError('Invalid or expired OTP');
    }

    return { userId: brand._id, msg: 'OTP verified' };
  }

  async resetPassword(params: { email: string; otp: string; newPassword: string }) {
    const { email, otp, newPassword } = params;

    const brand = await this._brandRepository.getByEmail(email);
    if (!brand) throw new NotFoundError('Brand not found');

    const cached = await brandOtpCache.get({ userId: brand._id });
    if (!cached || cached.code !== otp) {
      throw new BadRequestError('Invalid or expired OTP');
    }

    const hashedPassword = await this.hashPassword(newPassword);
    const updated = await this._brandRepository.updatePassword(brand._id, hashedPassword);
    if (!updated) throw new InternalServerError('Failed to reset password');

    await brandOtpCache.remove({ userId: brand._id });
    await brandRefreshTokenCache.remove({ userId: brand._id });
    await brandAccessTokenCache.remove({ userId: brand._id });

    return { msg: 'Password reset successful' };
  }

  async getProfile(userId: string) {
    const brand = await this._brandRepository.getById(userId);
    if (!brand) throw new NotFoundError('Brand not found');

    return brand;
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
      { _id: userId.toString(), role: 'brand' },
      config.JWT_ACCESS_SECRET,
      { expiresIn: config.JWT_ACCESS_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { _id: userId.toString(), role: 'brand' },
      config.JWT_REFRESH_SECRET,
      { expiresIn: config.JWT_REFRESH_EXPIRY }
    );

    await brandRefreshTokenCache.set({ userId: userId.toString() }, refreshToken);

    const key = await encryptionKey(config.JWT_CACHE_ENCRYPTION_KEY);
    const encryptedData = await encode(accessToken, key);
    await brandAccessTokenCache.set({ userId: userId.toString() }, encryptedData);

    return { accessToken, refreshToken };
  }
}

export default new BrandAuthService(new BrandRepository());
