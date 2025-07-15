import {jwtDecode} from "jwt-decode";

export interface TokenPayload {
  exp: number;
  iat: number;
  aud: string[];
  sub: string;
  typ: string;
  sid: string;
  realm_access: {
    roles: string[];
  },
  resource_access: {
    realm_management: {
      roles: string[];
    }
  },
  scope: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
}


export const useJWTDecoder = () => {
  const decodeToken = (token: string | null | undefined): TokenPayload | null => {
    if (!token) {
      console.log('invalid token');
      return null
    }
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTime) {
        console.log('Token has expired');
        return null;
      }
      return decoded;
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  }

  const isTokenExpired = (token: string | null | undefined): boolean => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true; // If we can't decode the token or it has no expiration, consider it expired
    }
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp ? decoded.exp < currentTime : true;
  }

  const getTokenExpirationTime = (token: string | null | undefined): Date | null => {
    if (!token) return null;

    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return null;
    return decoded?.exp ? new Date(decoded.exp * 1000) : null;
  }

  const getRemainingTime = (token: string | null | undefined): number => {
    if (!token) return 0;

    const decoded = decodeToken(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded?.exp ? Math.max(0, decoded.exp - currentTime) : 0;
  }

  return {
    decodeToken,
    isTokenExpired,
    getTokenExpirationTime,
    getRemainingTime
  }
}
