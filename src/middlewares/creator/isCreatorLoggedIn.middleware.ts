import requireAuth from '../auth/require-auth.middleware';
import getVerifyTokenMiddleware from '../auth/verify-token.middleware';

const isCreatorLoggedIn = [
  getVerifyTokenMiddleware('creator'),
  requireAuth,
];

export default isCreatorLoggedIn;
