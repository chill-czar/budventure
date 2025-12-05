import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const StatsSkeleton = React.memo(() => (
  <div className="mb-8">
    <Skeleton className="h-6 w-48 mb-4" />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <Skeleton className="h-8 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(2)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <Skeleton className="h-5 w-1/3 mb-2" />
            <div className="space-y-2">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="flex justify-between">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
));

StatsSkeleton.displayName = 'StatsSkeleton';

const StatsOverview = React.memo(({ taskStats, statsLoading, hasErrors }) => {
  if (statsLoading) {
    return <StatsSkeleton />;
  }

  if (hasErrors || !taskStats?.data?.stats) {
    return (
      <Alert className="mb-8">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Unable to load task statistics. You can still use the task management features below.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Statistics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <Badge variant="secondary" className="text-lg font-bold text-blue-600 mb-2">
              {taskStats.data.stats.basic?.total || 0}
            </Badge>
            <div className="text-sm text-gray-500">Total Tasks</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Badge variant="secondary" className="text-lg font-bold text-yellow-600 mb-2">
              {taskStats.data.stats.basic?.pending || 0}
            </Badge>
            <div className="text-sm text-gray-500">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Badge variant="secondary" className="text-lg font-bold text-purple-600 mb-2">
              {taskStats.data.stats.basic?.inProgress || 0}
            </Badge>
            <div className="text-sm text-gray-500">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Badge variant="secondary" className="text-lg font-bold text-green-600 mb-2">
              {taskStats.data.stats.basic?.completed || 0}
            </Badge>
            <div className="text-sm text-gray-500">Completed</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-2">Alerts</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Overdue Tasks:</span>
                <Badge variant="destructive">{taskStats.data.stats.alerts?.overdue || 0}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Due Today:</span>
                <Badge variant="secondary" className="text-orange-600">{taskStats.data.stats.alerts?.dueToday || 0}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Due This Week:</span>
                <Badge variant="secondary" className="text-blue-600">{taskStats.data.stats.alerts?.dueThisWeek || 0}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-2">Analytics</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Completion Rate:</span>
                <Badge variant="secondary" className="text-green-600">{taskStats.data.stats.analytics?.completionRate || 0}%</Badge>
              </div>
              <div className="mt-2">
                <div className="text-sm text-gray-600 mb-2">Priority Distribution:</div>
                {taskStats.data.stats.analytics?.priorityDistribution ?
                  <div className="space-y-2">
                    {Object.entries(taskStats.data.stats.analytics.priorityDistribution).map(([priority, count]) => (
                      <div key={priority} className="flex justify-between">
                        <span className="capitalize text-sm">{priority}:</span>
                        <Badge variant="outline">{count || 0}</Badge>
                      </div>
                    ))}
                  </div> :
                  <div className="text-sm text-gray-500">No data available</div>
                }
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

StatsOverview.displayName = 'StatsOverview';

export default StatsOverview;
