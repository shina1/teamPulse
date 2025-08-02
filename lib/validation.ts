import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const AddTeamSchema = z.object({
  name: z.string().min(2),
});

export const AddMemberSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  sentiment: z.enum(['HAPPY', 'NEUTRAL', 'SAD']),
  teamId: z.string(),
});

export const UpdateSentimentSchema = z.object({
  memberId: z.string(),
  sentiment: z.enum(['HAPPY', 'NEUTRAL', 'SAD']),
});

export const SettingsSchema = z.object({
  checkInsEnabled: z.boolean(),
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']),
});
