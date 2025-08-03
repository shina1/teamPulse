'use server';

import { getSessionUserId } from '../auth';
import { prisma } from '../prisma';
import { MemberFormData } from '../schemas';
import { AddMemberSchema } from '../validation';

export const addMemberAction = async (formData: MemberFormData) => {
  //   const data = Object.fromEntries(formData.entries());
  const parsedData = AddMemberSchema.safeParse(formData);

  if (!parsedData.success) {
    console.error(parsedData.error.flatten());
    return { error: 'Invalid input' };
  }

  const userId = getSessionUserId();
  if (!userId) return { error: 'Not authenticated' };

  const newMember = await prisma.member.create({
    data: {
      name: parsedData.data.name,
      email: parsedData.data.email,
      sentiment: parsedData.data.sentiment,
      teamId: parsedData.data.teamId,
    },
  });

  return { success: true, status: 201, data: newMember };
};

export const deleteMemberAction = async (memberId: string) => {
  if (!memberId) return { error: 'id is required' };
  await prisma.sentimentLog.deleteMany({
    where: { memberId },
  });
  await prisma.member.delete({ where: { id: memberId } });
  return { success: true, status: 204 };
};
