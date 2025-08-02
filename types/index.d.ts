/* eslint-disable @typescript-eslint/no-explicit-any */
export interface User {
  id: string;
  email: string;
  password: string;
}

export interface Team {
  id: string;
  name: string;
  averageSentiment?: 'happy' | 'neutral' | 'sad';
  memberCount?: number;
  createdAt?: Date;
}

export interface AddTeamResp {
  success: boolean;
  data: {
    id: string;
    name: string;
    averageSentiment: string;
    memberCount: number;
    createdAt: Date;
  };
  error?: undefined;
  status?: undefined;
}

export type FetchAllTeamsResponse =
  | { success: true; status: 200; data: any[]; count: number }
  | { status: 401; error: string };
