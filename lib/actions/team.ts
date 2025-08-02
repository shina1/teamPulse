'use server';
import { getSessionUserId } from '../auth';
import { AddTeamSchema } from '../validation';
import { prisma } from '../prisma';

export const addTeamsAction = async (formData: FormData) => {
  const data = Object.fromEntries(formData.entries());
  const parsedData = AddTeamSchema.safeParse(data);

  if (!parsedData.success) {
    return { error: 'Invalid credentials' };
  }

  const userId = getSessionUserId();
  if (!userId) return { error: 'Not authenticated' };

  const team = await prisma.team.create({
    data: { name: parsedData.data.name },
  });

  return { success: true, data: team };
};

export const deleteTeamAction = async (teamId: string) => {
  if (!teamId) return { error: 'Team id is required' };
  await prisma.team.delete({ where: { id: teamId } });
};
