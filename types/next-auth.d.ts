import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  // type UserSession = DefaultSession['user'];
  type UserSession = {
    accessToken: {
      token: string;
    };
    exp: number;
    iat: number;
    id: string;
    jti: string;
    requiredAuthenticatorType: any;
    sub: string;
  };
  interface Session {
    user: UserSession;
  }

  interface CredentialsInputs {
    email: string;
    password: string;
  }
}
