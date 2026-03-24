import brandModel, { IBrand } from '../models/brand.model';

export class BrandRepository {
  private _model = brandModel;

  async getByEmail(email: string) {
    return this._model.findOne({ email }) as unknown as IBrand | null;
  }

  async getByPhone(phoneNumber: string) {
    return this._model.findOne({ phoneNumber }) as unknown as IBrand | null;
  }

  async getById(id: string) {
    return this._model.findById(id).select('-password') as unknown as IBrand | null;
  }

  async getByIdWithPassword(id: string) {
    return this._model.findById(id) as unknown as IBrand | null;
  }

  async create(params: {
    email: string;
    password?: string;
    authProvider?: 'email' | 'google' | 'apple';
    verified?: boolean;
    phoneNumber?: string;
    isdCode?: string;
  }) {
    return this._model.create(params) as unknown as IBrand;
  }

  async updatePassword(id: string, hashedPassword: string) {
    return this._model.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    ) as unknown as IBrand | null;
  }

  async markOnboardingComplete(id: string) {
    return this._model.findByIdAndUpdate(
      id,
      { onboardingComplete: true },
      { new: true }
    ) as unknown as IBrand | null;
  }

  async markVerified(id: string) {
    return this._model.findByIdAndUpdate(
      id,
      { verified: true },
      { new: true }
    ) as unknown as IBrand | null;
  }

  async deleteAccount(id: string) {
    return this._model.findByIdAndUpdate(
      id,
      {
        email: `deleted_brand_${Date.now()}@deleted.com`,
        phoneNumber: null,
        password: null,
        deletedAccount: true,
        verified: false,
      },
      { new: true }
    ) as unknown as IBrand | null;
  }
}
