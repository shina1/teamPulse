'use server';

import { redirect } from 'next/navigation';
import { loginUser } from '../auth';
import { LoginSchema } from '../validation';

export const LoginAction = async (formData: FormData) => {
  console.log('login form data', formData);

  const data = Object.fromEntries(formData.entries());
  const parsedData = LoginSchema.safeParse(data);

  if (!parsedData.success) {
    return { status: 400, error: 'Invalid credentials' };
  }

  const user = await loginUser(parsedData.data.email, parsedData.data.password);
  if (!user) {
    return { status: 401, error: 'Invalid email or password' };
  }
  return { status: 200, data: user };
  redirect('/dashboard');
};
