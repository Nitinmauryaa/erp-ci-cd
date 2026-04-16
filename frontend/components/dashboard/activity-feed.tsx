import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Activity } from "@/types";

// ============================================
// ACTIVITY FEED COMPONENT
// ============================================
interface ActivityFeedProps {
  activities: Activity[];
  title?: string;
  maxHeight?: string;
}

export function ActivityFeed({
  activities,
  title = "Recent Activity",
  maxHeight = "h-[400px]",
}: ActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className={maxHeight}>
          <div className="space-y-4">
            {activities.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">
                No recent activity
              </p>
            ) : (
              activities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// ============================================
// ACTIVITY ITEM COMPONENT
// ============================================
interface ActivityItemProps {
  activity: Activity;
}

function ActivityItem({ activity }: ActivityItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
        {activity.userName.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm">
          <span className="font-medium">{activity.userName}</span>{" "}
          <span className="text-muted-foreground">{activity.message}</span>
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDate(activity.createdAt)}
        </p>
      </div>
    </div>
  );
}
