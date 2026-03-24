import creatorModel, { ICreator } from '../models/creator.model';

export class CreatorRepository {
  private _model = creatorModel;

  async getByEmail(email: string) {
    return this._model.findOne({ email }) as unknown as ICreator | null;
  }

  async getByPhone(phoneNumber: string) {
    return this._model.findOne({ phoneNumber }) as unknown as ICreator | null;
  }

  async getById(id: string) {
    return this._model.findById(id).select('-password -instagramToken') as unknown as ICreator | null;
  }

  async getByIdWithPassword(id: string) {
    return this._model.findById(id) as unknown as ICreator | null;
  }

  async create(params: {
    email: string;
    password?: string;
    authProvider?: 'email' | 'google' | 'apple';
    verified?: boolean;
    phoneNumber?: string;
    isdCode?: string;
  }) {
    return this._model.create(params) as unknown as ICreator;
  }

  async updatePassword(id: string, hashedPassword: string) {
    return this._model.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    ) as unknown as ICreator | null;
  }

  async markOnboardingComplete(id: string) {
    return this._model.findByIdAndUpdate(
      id,
      { onboardingComplete: true },
      { new: true }
    ) as unknown as ICreator | null;
  }

  async markVerified(id: string) {
    return this._model.findByIdAndUpdate(
      id,
      { verified: true },
      { new: true }
    ) as unknown as ICreator | null;
  }

  async deleteAccount(id: string) {
    return this._model.findByIdAndUpdate(
      id,
      {
        email: `deleted_creator_${Date.now()}@deleted.com`,
        phoneNumber: null,
        password: null,
        deletedAccount: true,
        verified: false,
      },
      { new: true }
    ) as unknown as ICreator | null;
  }
}
