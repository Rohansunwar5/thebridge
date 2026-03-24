declare namespace Express {
  export interface Request {
    user: {
      _id: string;
      role: 'creator' | 'brand';
    };
    access_token: string | null;
  }
}
