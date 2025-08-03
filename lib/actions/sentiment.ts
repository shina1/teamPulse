'use server';

import { getSessionUserId } from '../auth';
import { prisma } from '../prisma';
import { UpdateSentimentSchema } from '../validation';

type SentimentType = {
  memberId: string;
  sentiment: 'happy' | 'neutral' | 'sad';
};

export const addSentiment = async (formData: SentimentType) => {
  //   const data = Object.fromEntries(formData.entries());
  const parsedData = UpdateSentimentSchema.safeParse(formData);

  if (!parsedData.success) return { error: 'Invalid input' };

  const userId = getSessionUserId();
  if (!userId) return { error: 'Not authenticated' };

  const sentimentUpdate = await prisma.member.update({
    where: { id: parsedData.data.memberId },
    data: { sentiment: parsedData.data.sentiment },
  });

  console.log('sentimentUpdate', sentimentUpdate);

  // Log sentiment change for trends
  await prisma.sentimentLog.create({
    data: {
      sentiment: parsedData.data.sentiment,
      memberId: parsedData.data.memberId,
      teamId: sentimentUpdate.teamId,
    },
  });

  return {
    success: true,
    message: 'Sentiment updated',
    status: 201,
    data: sentimentUpdate,
  };
};
