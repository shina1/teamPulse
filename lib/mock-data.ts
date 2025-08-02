export interface Team {
  id: string
  name: string
  averageSentiment?: "happy" | "neutral" | "sad"
  memberCount?: number
}

export interface Member {
  id: string
  name: string
  email: string
  sentiment: "happy" | "neutral" | "sad"
  teamId: string
}

export interface SentimentTrend {
  date: string
  teamId: string
  teamName: string
  sentiment: number // 0-100 scale
}

export interface Settings {
  enableCheckins: boolean
  checkinFrequency: "daily" | "weekly" | "monthly"
}

export const mockTeams: Team[] = [
  { id: "1", name: "Engineering", averageSentiment: "happy", memberCount: 12 },
  { id: "2", name: "Design", averageSentiment: "neutral", memberCount: 8 },
  { id: "3", name: "Marketing", averageSentiment: "sad", memberCount: 6 },
  { id: "4", name: "Sales", averageSentiment: "happy", memberCount: 10 },
]

export const mockMembers: Member[] = [
  { id: "1", name: "John Doe", email: "john@example.com", sentiment: "happy", teamId: "1" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", sentiment: "neutral", teamId: "1" },
  { id: "3", name: "Bob Johnson", email: "bob@example.com", sentiment: "happy", teamId: "1" },
  { id: "4", name: "Alice Brown", email: "alice@example.com", sentiment: "sad", teamId: "1" },
  { id: "5", name: "Charlie Wilson", email: "charlie@example.com", sentiment: "happy", teamId: "1" },
  { id: "6", name: "Diana Davis", email: "diana@example.com", sentiment: "neutral", teamId: "1" },
  { id: "7", name: "Eve Miller", email: "eve@example.com", sentiment: "happy", teamId: "1" },
  { id: "8", name: "Frank Garcia", email: "frank@example.com", sentiment: "sad", teamId: "1" },
  { id: "9", name: "Grace Lee", email: "grace@example.com", sentiment: "happy", teamId: "1" },
  { id: "10", name: "Henry Taylor", email: "henry@example.com", sentiment: "neutral", teamId: "1" },
  { id: "11", name: "Ivy Anderson", email: "ivy@example.com", sentiment: "happy", teamId: "1" },
  { id: "12", name: "Jack Thomas", email: "jack@example.com", sentiment: "sad", teamId: "1" },
  { id: "13", name: "Sarah Connor", email: "sarah@example.com", sentiment: "happy", teamId: "2" },
  { id: "14", name: "Mike Ross", email: "mike@example.com", sentiment: "neutral", teamId: "2" },
]

export const mockTrends: SentimentTrend[] = [
  { date: "2024-01-01", teamId: "1", teamName: "Engineering", sentiment: 85 },
  { date: "2024-01-02", teamId: "1", teamName: "Engineering", sentiment: 82 },
  { date: "2024-01-03", teamId: "1", teamName: "Engineering", sentiment: 88 },
  { date: "2024-01-04", teamId: "1", teamName: "Engineering", sentiment: 90 },
  { date: "2024-01-05", teamId: "1", teamName: "Engineering", sentiment: 87 },
  { date: "2024-01-06", teamId: "1", teamName: "Engineering", sentiment: 85 },
  { date: "2024-01-07", teamId: "1", teamName: "Engineering", sentiment: 89 },
  { date: "2024-01-01", teamId: "2", teamName: "Design", sentiment: 75 },
  { date: "2024-01-02", teamId: "2", teamName: "Design", sentiment: 72 },
  { date: "2024-01-03", teamId: "2", teamName: "Design", sentiment: 78 },
  { date: "2024-01-04", teamId: "2", teamName: "Design", sentiment: 80 },
  { date: "2024-01-05", teamId: "2", teamName: "Design", sentiment: 77 },
  { date: "2024-01-06", teamId: "2", teamName: "Design", sentiment: 75 },
  { date: "2024-01-07", teamId: "2", teamName: "Design", sentiment: 79 },
]

export const mockSettings: Settings = {
  enableCheckins: true,
  checkinFrequency: "weekly",
}

// Mock API functions
export const mockLogin = async (email: string, password: string): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return email === "admin@teampulse.com" && password === "password"
}

export const mockFetchTeams = async (): Promise<Team[]> => {
  await new Promise((resolve) => setTimeout(resolve, 800))
  return mockTeams
}

export const mockFetchTeam = async (id: string): Promise<Team | null> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockTeams.find((team) => team.id === id) || null
}

export const mockFetchMembers = async (teamId: string): Promise<Member[]> => {
  await new Promise((resolve) => setTimeout(resolve, 600))
  return mockMembers.filter((member) => member.teamId === teamId)
}

export const mockFetchTrends = async (): Promise<SentimentTrend[]> => {
  await new Promise((resolve) => setTimeout(resolve, 700))
  return mockTrends
}

export const mockFetchSettings = async (): Promise<Settings> => {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return mockSettings
}
