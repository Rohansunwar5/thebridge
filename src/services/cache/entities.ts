import CacheManager from './manager';

interface ITokenCacheParams {
  userId: string;
}

interface IEncodedJWTCacheResponse {
  iv: string;
  encryptedData: string;
}

interface IOTPCacheParams {
  userId: string;
}

interface IProfileCacheParams {
  userId: string;
}

// ---- Creator cache ----
const creatorRefreshTokenCache = CacheManager<ITokenCacheParams, string>('creator-refresh-token', 604800);
const creatorAccessTokenCache = CacheManager<ITokenCacheParams, IEncodedJWTCacheResponse>('creator-access-token', 86400);
const creatorOtpCache = CacheManager<IOTPCacheParams, { code: string }>('creator-otp', 600);
const creatorProfileCache = CacheManager<IProfileCacheParams>('creator-profile', 600);

// ---- Brand cache ----
const brandRefreshTokenCache = CacheManager<ITokenCacheParams, string>('brand-refresh-token', 604800);
const brandAccessTokenCache = CacheManager<ITokenCacheParams, IEncodedJWTCacheResponse>('brand-access-token', 86400);
const brandOtpCache = CacheManager<IOTPCacheParams, { code: string }>('brand-otp', 600);
const brandProfileCache = CacheManager<IProfileCacheParams>('brand-profile', 600);

export {
  // Creator
  creatorRefreshTokenCache,
  creatorAccessTokenCache,
  creatorOtpCache,
  creatorProfileCache,
  // Brand
  brandRefreshTokenCache,
  brandAccessTokenCache,
  brandOtpCache,
  brandProfileCache,
};
