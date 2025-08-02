'use server';

import { redirect } from 'next/navigation';
import { loginUser } from '../auth';
import { LoginSchema } from '../validation';

export const LoginAction = async (formData: FormData) => {
  const data = Object.fromEntries(formData.entries());
  const parsedData = LoginSchema.safeParse(data);

  if (!parsedData.success) {
    return { error: 'Invalid credentials' };
  }

  const user = await loginUser(parsedData.data.email, parsedData.data.password);
  if (!user) {
    return { error: 'Invalid email or password' };
  }
  redirect('/dashboard');
};