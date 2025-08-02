'use server';

import { getSessionUserId } from '../auth';
import { prisma } from '../prisma';
import { UpdateSentimentSchema } from '../validation';

export const addSentiment = async (formData: FormData) => {
  const data = Object.fromEntries(formData.entries());
  const parsedData = UpdateSentimentSchema.safeParse(data);

  if (!parsedData.success) return { error: 'Invalid input' };

  const userId = getSessionUserId();
  if (!userId) return { error: 'Not authenticated' };

  const sentimentUpdate = await prisma.member.update({
    where: { id: parsedData.data.memberId },
    data: { sentiment: parsedData.data.sentiment },
  });

  // Log sentiment change for trends
  await prisma.sentimentLog.create({
    data: {
      sentiment: parsedData.data.sentiment,
      memberId: parsedData.data.memberId,
      teamId: sentimentUpdate.teamId,
    },
  });

  return { success: true, message: 'Sentiment updated', data: sentimentUpdate };
};
