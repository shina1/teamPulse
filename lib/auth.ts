import { cookies } from 'next/headers';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();
const SESSION_KEY = 'session_user';

export async function loginUser(email: string, password: string) {
  console.log('credentials', email, password);

  const user = await prisma.user.findUnique({ where: { email } });
  console.log('user', user);

  if (!user || user.password !== password) return null;

  (await cookies()).set(SESSION_KEY, user.id, {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  });

  return user;
}

export async function getSessionUserId(): Promise<string | null> {
  return (await cookies()).get(SESSION_KEY)?.value || null;
}

export async function getSessionUser(): Promise<User | null> {
  const userId: string | null = await getSessionUserId();
  if (!userId) return null;

  return await prisma.user.findUnique({ where: { id: userId } });
}

export async function logoutUser() {
  (await cookies()).delete(SESSION_KEY);
}
