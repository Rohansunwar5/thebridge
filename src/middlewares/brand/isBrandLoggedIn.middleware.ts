import requireAuth from '../auth/require-auth.middleware';
import getVerifyTokenMiddleware from '../auth/verify-token.middleware';

const isBrandLoggedIn = [
  getVerifyTokenMiddleware('brand'),
  requireAuth,
];

export default isBrandLoggedIn;
