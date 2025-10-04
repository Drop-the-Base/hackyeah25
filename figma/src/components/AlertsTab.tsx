import React from 'react';
import { AlertTriangle, CloudRain, Wind, Thermometer, Zap, Mountain, Clock } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

export const mockAlerts = [
  {
    id: 1,
    title: 'Severe Weather Warning',
    message: 'Heavy thunderstorms expected in your area. Seek shelter immediately.',
    type: 'weather',
    severity: 'high',
    timestamp: '2 minutes ago',
    icon: CloudRain,
    location: 'Your Area'
  },
  {
    id: 2,
    title: 'Flash Flood Watch',
    message: 'Flash flooding possible in low-lying areas. Avoid crossing streams.',
    type: 'weather',
    severity: 'high',
    timestamp: '15 minutes ago',
    icon: AlertTriangle,
    location: 'Valley Region'
  },
  {
    id: 3,
    title: 'High Wind Advisory',
    message: 'Winds up to 45 mph expected. Secure loose objects and avoid exposed areas.',
    type: 'weather',
    severity: 'medium',
    timestamp: '1 hour ago',
    icon: Wind,
    location: 'Mountain Ridge'
  },
  {
    id: 4,
    title: 'Temperature Drop',
    message: 'Temperatures falling rapidly. Hypothermia risk increased.',
    type: 'health',
    severity: 'medium',
    timestamp: '2 hours ago',
    icon: Thermometer,
    location: 'All Areas'
  },
  {
    id: 5,
    title: 'Lightning Strike Nearby',
    message: 'Lightning activity detected within 5 miles. Take immediate shelter.',
    type: 'weather',
    severity: 'high',
    timestamp: '3 hours ago',
    icon: Zap,
    location: 'North Trail'
  },
  {
    id: 6,
    title: 'Rockfall Warning',
    message: 'Unstable conditions on mountain face. Avoid climbing routes.',
    type: 'terrain',
    severity: 'medium',
    timestamp: '4 hours ago',
    icon: Mountain,
    location: 'East Face'
  },
  {
    id: 7,
    title: 'Search and Rescue Update',
    message: 'Missing hiker found safe. All search operations concluded.',
    type: 'rescue',
    severity: 'low',
    timestamp: '6 hours ago',
    icon: AlertTriangle,
    location: 'South Ridge'
  },
  {
    id: 8,
    title: 'Trail Closure Notice',
    message: 'Main trail closed due to bridge damage. Use alternate route.',
    type: 'trail',
    severity: 'low',
    timestamp: '1 day ago',
    icon: Mountain,
    location: 'Main Trail'
  }
];

export function AlertsTab() {
  const getSeverityColor = (severity: string) => {
    const colors: { [key: string]: string } = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      weather: 'bg-blue-500',
      health: 'bg-red-500',
      terrain: 'bg-yellow-500',
      rescue: 'bg-green-500',
      trail: 'bg-purple-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  return (
    <div className="h-full p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2>Emergency Alerts</h2>
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            {mockAlerts.filter(alert => alert.severity === 'high').length} Active
          </Badge>
        </div>

        <div className="space-y-3">
          {mockAlerts.map((alert) => {
            const IconComponent = alert.icon;
            return (
              <Card key={alert.id} className={`p-4 border-l-4 ${alert.severity === 'high' ? 'border-l-red-500 bg-red-50' : alert.severity === 'medium' ? 'border-l-yellow-500 bg-yellow-50' : 'border-l-blue-500 bg-blue-50'}`}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`${getTypeColor(alert.type)} rounded-full p-2 mt-1`}>
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-medium">{alert.title}</p>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getSeverityColor(alert.severity)}`}
                          >
                            {alert.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{alert.timestamp}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Mountain className="w-3 h-3" />
                            <span>{alert.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {mockAlerts.length === 0 && (
          <Card className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No active alerts</p>
            <p className="text-sm text-gray-400 mt-1">You'll be notified of any emergency situations</p>
          </Card>
        )}
      </div>
    </div>
  );
}