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
  email_verified: string;
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
    return jwtDecode<TokenPayload>(token);
  }
  return {
    decodeToken
  }
}
