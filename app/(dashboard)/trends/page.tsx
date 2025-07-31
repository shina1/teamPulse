"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { mockFetchTrends, mockFetchTeams, type SentimentTrend, type Team } from "@/lib/mock-data"
import { ChartSkeleton } from "@/components/loading-skeleton"
import { useToast } from "@/hooks/use-toast"

export default function TrendsPage() {
  const [trends, setTrends] = useState<SentimentTrend[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeam, setSelectedTeam] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendsData, teamsData] = await Promise.all([mockFetchTrends(), mockFetchTeams()])
        setTrends(trendsData)
        setTeams(teamsData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load trends data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const chartData = trends
    .filter((trend) => selectedTeam === "all" || trend.teamId === selectedTeam)
    .reduce((acc, trend) => {
      const existingDate = acc.find((item) => item.date === trend.date)
      if (existingDate) {
        existingDate[trend.teamName] = trend.sentiment
      } else {
        acc.push({
          date: trend.date,
          [trend.teamName]: trend.sentiment,
        })
      }
      return acc
    }, [] as any[])
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const uniqueTeams = Array.from(new Set(trends.map((t) => t.teamName)))
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00ff00"]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <ChartSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sentiment Trends</h1>
          <p className="text-muted-foreground">Track sentiment changes over the past 7 days</p>
        </div>
        <Select value={selectedTeam} onValueChange={setSelectedTeam}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select team" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Teams</SelectItem>
            {teams.map((team) => (
              <SelectItem key={team.id} value={team.id}>
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sentiment Over Time</CardTitle>
          <CardDescription>
            Daily sentiment scores (0-100 scale) for{" "}
            {selectedTeam === "all" ? "all teams" : teams.find((t) => t.id === selectedTeam)?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                <YAxis domain={[0, 100]} />
                <Tooltip
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => [`${value}%`, "Sentiment"]}
                />
                <Legend />
                {uniqueTeams.map((teamName, index) => (
                  <Line
                    key={teamName}
                    type="monotone"
                    dataKey={teamName}
                    stroke={colors[index % colors.length]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    connectNulls={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {teams
          .filter((team) => selectedTeam === "all" || team.id === selectedTeam)
          .map((team) => {
            const teamTrends = trends.filter((t) => t.teamId === team.id)
            const latestTrend = teamTrends[teamTrends.length - 1]
            const previousTrend = teamTrends[teamTrends.length - 2]
            const change = latestTrend && previousTrend ? latestTrend.sentiment - previousTrend.sentiment : 0

            return (
              <Card key={team.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{team.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{latestTrend ? `${latestTrend.sentiment}%` : "N/A"}</div>
                  <p
                    className={`text-sm ${change > 0 ? "text-green-600" : change < 0 ? "text-red-600" : "text-muted-foreground"}`}
                  >
                    {change > 0 ? "+" : ""}
                    {change.toFixed(1)}% from yesterday
                  </p>
                </CardContent>
              </Card>
            )
          })}
      </div>
    </div>
  )
}
