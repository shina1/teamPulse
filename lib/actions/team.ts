/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';
import { getSessionUserId } from '../auth';
import { AddTeamSchema } from '../validation';
import { prisma } from '../prisma';
import { TeamFormData } from '../schemas';

type FetchAllTeamsResponse =
  | { success: true; status: 200; data: any[]; count: number }
  | { status: 401; error: string };

export const addTeamsAction = async (formData: TeamFormData) => {
  //   const data = Object.fromEntries(formData.entries());
  const parsedData = AddTeamSchema.safeParse(formData);

  if (!parsedData.success) {
    return { error: 'Invalid credentials' };
  }

  const userId = getSessionUserId();
  if (!userId) return { status: 401, error: 'Not authenticated' };

  const team = await prisma.team.create({
    data: {
      name: parsedData.data.name,
    },
  });

  return { success: true, data: team };
};

export const fetchAllTeams = async (): Promise<FetchAllTeamsResponse> => {
  const userId = getSessionUserId();
  if (!userId) return { status: 401, error: 'Not authenticated' };

  const teams = await prisma.team.findMany();

  return {
    success: true,
    status: 200,
    data: teams,
    count: teams.length,
  };
};

export const deleteTeamAction = async (teamId: string) => {
  if (!teamId) return { error: 'Team id is required' };
  await prisma.team.delete({ where: { id: teamId } });
};
