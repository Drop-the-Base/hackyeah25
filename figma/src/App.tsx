import React from 'react';
import { MapPin, AlertTriangle, BookOpen, Bell, Package, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { MapTab } from './components/MapTab';
import { EmergencyTab } from './components/EmergencyTab';
import { GuidesTab } from './components/GuidesTab';
import { AlertsTab, mockAlerts } from './components/AlertsTab';
import { ChecklistTab } from './components/ChecklistTab';
import { Button } from './components/ui/button';

export default function App() {
  const [alertDismissed, setAlertDismissed] = React.useState(false);
  
  // Get the most urgent alert (highest severity, most recent)
  const urgentAlert = mockAlerts.find(alert => alert.severity === 'high');
  const IconComponent = urgentAlert?.icon;

  return (
    <div className="h-screen bg-background flex flex-col max-w-md mx-auto border-x border-border">
      {/* Urgent Alert Banner */}
      {urgentAlert && !alertDismissed && (
        <div className="bg-red-600 text-white px-4 py-3 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {IconComponent && <IconComponent className="w-5 h-5 flex-shrink-0" />}
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">{urgentAlert.title}</p>
              <p className="text-xs opacity-90 truncate">{urgentAlert.message}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAlertDismissed(true)}
            className="ml-2 h-8 w-8 p-0 hover:bg-red-700 text-white flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="map" className="h-full flex flex-col">
          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            <TabsContent value="map" className="h-full m-0 overflow-y-auto">
              <MapTab />
            </TabsContent>
            
            <TabsContent value="emergency" className="h-full m-0 overflow-y-auto">
              <EmergencyTab />
            </TabsContent>
            
            <TabsContent value="guides" className="h-full m-0 overflow-y-auto">
              <GuidesTab />
            </TabsContent>
            
            <TabsContent value="gear" className="h-full m-0 overflow-y-auto">
              <ChecklistTab />
            </TabsContent>
            
            <TabsContent value="alerts" className="h-full m-0 overflow-y-auto">
              <AlertsTab />
            </TabsContent>
          </div>

          {/* Bottom Navigation */}
          <div className="border-t border-border bg-card">
            <TabsList className="grid w-full grid-cols-5 h-16 bg-transparent rounded-none">
              <TabsTrigger 
                value="map" 
                className="flex flex-col items-center space-y-1 p-2 h-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                <MapPin className="w-4 h-4" />
                <span className="text-xs">Map</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="emergency" 
                className="flex flex-col items-center space-y-1 p-2 h-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs">Emergency</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="guides" 
                className="flex flex-col items-center space-y-1 p-2 h-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                <BookOpen className="w-4 h-4" />
                <span className="text-xs">Guides</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="gear" 
                className="flex flex-col items-center space-y-1 p-2 h-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                <Package className="w-4 h-4" />
                <span className="text-xs">Gear</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="alerts" 
                className="flex flex-col items-center space-y-1 p-2 h-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary relative"
              >
                <div className="relative">
                  <Bell className="w-4 h-4" />
                  {/* Alert badge */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-[8px] text-white">3</span>
                  </div>
                </div>
                <span className="text-xs">Alerts</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </div>
    </div>
  );
}