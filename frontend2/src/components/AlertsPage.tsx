import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
} from "lucide-react";

const alerts = [
  {
    id: 1,
    title: "Severe Weather Warning",
    message:
      "Thunderstorms expected in your area. Strong winds and heavy rainfall possible. Stay indoors and avoid travel if possible.",
    severity: "high",
    icon: AlertTriangle,
    timestamp: "2 hours ago",
    location: "City Center, Downtown",
  },
  {
    id: 2,
    title: "Flash Flood Watch",
    message:
      "Potential flooding in low-lying areas. Monitor local conditions and be prepared to move to higher ground if necessary.",
    severity: "medium",
    icon: AlertCircle,
    timestamp: "4 hours ago",
    location: "River Valley District",
  },
  {
    id: 3,
    title: "Air Quality Alert",
    message:
      "Poor air quality due to wildfire smoke. Limit outdoor activities, especially for sensitive groups.",
    severity: "medium",
    icon: AlertCircle,
    timestamp: "6 hours ago",
    location: "North Region",
  },
  {
    id: 4,
    title: "Emergency Drill Notification",
    message:
      "Scheduled emergency response drill tomorrow at 10 AM. Test of emergency alert systems will occur.",
    severity: "low",
    icon: Info,
    timestamp: "1 day ago",
    location: "All Areas",
  },
  {
    id: 5,
    title: "Heat Advisory Issued",
    message:
      "Excessive heat expected over the next 48 hours. Stay hydrated and avoid prolonged sun exposure.",
    severity: "medium",
    icon: AlertCircle,
    timestamp: "1 day ago",
    location: "Metro Area",
  },
  {
    id: 6,
    title: "All Clear: Storm Warning Lifted",
    message:
      "Previous severe weather warning has been cancelled. Normal conditions have resumed.",
    severity: "resolved",
    icon: CheckCircle,
    timestamp: "2 days ago",
    location: "City Center",
  },
];

const severityConfig = {
  high: {
    color: "bg-red-500",
    badge: "destructive",
    text: "High Priority",
  },
  medium: {
    color: "bg-orange-500",
    badge: "secondary",
    text: "Medium Priority",
  },
  low: {
    color: "bg-blue-500",
    badge: "secondary",
    text: "Low Priority",
  },
  resolved: {
    color: "bg-green-500",
    badge: "secondary",
    text: "Resolved",
  },
};

export function AlertsPage() {
  return (
    <div className="h-full overflow-y-auto pb-20 pt-4 px-4 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="mb-2">Alerts & Warnings</h1>
        <p className="text-muted-foreground">
          Stay informed about emergency situations in your area
        </p>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => {
          const Icon = alert.icon;
          const config =
            severityConfig[alert.severity as keyof typeof severityConfig];

          return (
            <Card
              key={alert.id}
              className={`p-4 ${
                alert.severity === "high"
                  ? "border-destructive border-2"
                  : ""
              }`}
            >
              <div className="flex gap-3">
                <div className={`${config.color} rounded-lg p-3 h-fit`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="flex-1">{alert.title}</h3>
                    <Badge
                      variant={
                        config.badge as "destructive" | "secondary" | "default"
                      }
                      className="text-xs shrink-0"
                    >
                      {config.text}
                    </Badge>
                  </div>
                  <p className="text-sm mb-3">{alert.message}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{alert.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>📍</span>
                      <span>{alert.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
