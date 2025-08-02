import { Badge } from "@/components/ui/badge"
import { Smile, Meh, Frown } from "lucide-react"

interface SentimentBadgeProps {
  sentiment: "happy" | "neutral" | "sad"
  showIcon?: boolean
}

export function SentimentBadge({ sentiment, showIcon = true }: SentimentBadgeProps) {
  const config = {
    happy: {
      label: "Happy",
      variant: "default" as const,
      className: "bg-green-100 text-green-800 hover:bg-green-100",
      icon: Smile,
    },
    neutral: {
      label: "Neutral",
      variant: "secondary" as const,
      className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      icon: Meh,
    },
    sad: {
      label: "Sad",
      variant: "destructive" as const,
      className: "bg-red-100 text-red-800 hover:bg-red-100",
      icon: Frown,
    },
  }

  const { label, className, icon: Icon } = config[sentiment]

  return (
    <Badge className={className}>
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {label}
    </Badge>
  )
}
