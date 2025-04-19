'use server';

import axios from 'axios';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { RedirectType, redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

const key = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256']
  });
  return payload;
}

export async function login(formData: any) {
  const user = {
    email: formData.email,
    password: formData.password
  };
  debugger;
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/Auth/Login`,
      user
    );
    const accessToken = res.data.accessToken;
    cookies().set('session', accessToken.token, {
      expires: new Date(accessToken.expirationDate),
      httpOnly: false
    });
  } catch (error: any) {
    return error.response.data;
  }
  redirect('/dashboard');
}
