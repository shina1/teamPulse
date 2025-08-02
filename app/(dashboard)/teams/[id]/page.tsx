"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Search, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { mockFetchTeam, mockFetchMembers, type Team, type Member } from "@/lib/mock-data"
import { memberSchema, type MemberFormData } from "@/lib/schemas"
import { SentimentBadge } from "@/components/sentiment-badge"
import { MemberRowSkeleton } from "@/components/loading-skeleton"
import { useDebounce } from "@/hooks/use-debounce"

const MEMBERS_PER_PAGE = 10

export default function TeamDetailsPage() {
  const params = useParams()
  const teamId = params.id as string
  const { toast } = useToast()

  const [team, setTeam] = useState<Team | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  const form = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: "",
      email: "",
      sentiment: "neutral",
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamData, membersData] = await Promise.all([mockFetchTeam(teamId), mockFetchMembers(teamId)])
        setTeam(teamData)
        setMembers(membersData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load team data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [teamId, toast])

  const filteredMembers = useMemo(() => {
    return members.filter(
      (member) =>
        member.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
    )
  }, [members, debouncedSearchQuery])

  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * MEMBERS_PER_PAGE
    return filteredMembers.slice(startIndex, startIndex + MEMBERS_PER_PAGE)
  }, [filteredMembers, currentPage])

  const totalPages = Math.ceil(filteredMembers.length / MEMBERS_PER_PAGE)

  const onSubmit = async (data: MemberFormData) => {
    const newMember: Member = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      sentiment: data.sentiment,
      teamId: teamId,
    }

    setMembers((prev) => [...prev, newMember])
    toast({
      title: "Success",
      description: "Member added successfully!",
    })
    setIsDialogOpen(false)
    form.reset()
  }

  const handleDeleteMember = (memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId))
    toast({
      title: "Success",
      description: "Member removed successfully!",
    })
  }

  const handleSentimentChange = (memberId: string, newSentiment: "happy" | "neutral" | "sad") => {
    setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, sentiment: newSentiment } : m)))
    toast({
      title: "Success",
      description: "Sentiment updated!",
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <MemberRowSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold">Team not found</h2>
        <p className="text-muted-foreground mt-2">The team you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{team.name}</h1>
          <p className="text-muted-foreground">Manage team members and track their sentiment</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Member</DialogTitle>
              <DialogDescription>Add a new member to the {team.name} team</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter member name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sentiment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Sentiment</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sentiment" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="happy">Happy</SelectItem>
                          <SelectItem value="neutral">Neutral</SelectItem>
                          <SelectItem value="sad">Sad</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Member</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            {filteredMembers.length} {filteredMembers.length === 1 ? "member" : "members"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="max-w-sm"
            />
          </div>

          <div className="space-y-4">
            {paginatedMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <SentimentBadge sentiment={member.sentiment} />
                  <Select
                    value={member.sentiment}
                    onValueChange={(value: "happy" | "neutral" | "sad") => handleSentimentChange(member.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="happy">Happy</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="sad">Sad</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteMember(member.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchQuery ? "No members found matching your search." : "No members in this team yet."}
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * MEMBERS_PER_PAGE + 1} to{" "}
                {Math.min(currentPage * MEMBERS_PER_PAGE, filteredMembers.length)} of {filteredMembers.length} members
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
