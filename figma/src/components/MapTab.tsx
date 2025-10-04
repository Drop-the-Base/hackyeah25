import React, { useState, useEffect } from 'react';
import { MapPin, Mountain, TreePine, Waves, X, Navigation, Loader2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';

const mockLocations = [
  { 
    id: 1, 
    name: 'Emergency Shelter A', 
    type: 'shelter', 
    lat: 37.7749, 
    lng: -122.4194, 
    icon: Mountain,
    description: 'Protected emergency shelter with basic supplies',
    distance: '0.5 km away'
  },
  { 
    id: 2, 
    name: 'Water Source - Creek', 
    type: 'water', 
    lat: 37.7849, 
    lng: -122.4294, 
    icon: Waves,
    description: 'Fresh water creek - requires purification',
    distance: '1.2 km away'
  },
  { 
    id: 3, 
    name: 'Forest Camp Site', 
    type: 'camp', 
    lat: 37.7649, 
    lng: -122.4094, 
    icon: TreePine,
    description: 'Established camping area with fire pit',
    distance: '0.8 km away'
  },
  { 
    id: 4, 
    name: 'Ranger Station', 
    type: 'help', 
    lat: 37.7549, 
    lng: -122.4394, 
    icon: MapPin,
    description: 'Park ranger station - emergency assistance available',
    distance: '2.1 km away'
  },
  { 
    id: 5, 
    name: 'High Ground Point', 
    type: 'shelter', 
    lat: 37.7949, 
    lng: -122.4494, 
    icon: Mountain,
    description: 'Elevated area safe from flooding',
    distance: '1.7 km away'
  },
];

const getLocationColor = (type: string) => {
  const colors: { [key: string]: string } = {
    shelter: 'bg-orange-500',
    water: 'bg-blue-500',
    camp: 'bg-green-500',
    help: 'bg-red-500'
  };
  return colors[type] || 'bg-gray-500';
};

export function MapTab() {
  const [selectedLocation, setSelectedLocation] = useState<typeof mockLocations[0] | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    // Get user's current location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationError(null);
          setLocationLoading(false);
        },
        () => {
          // Error getting location - use fallback
          setLocationError('Using demo location');
          // Fallback to mock location for demonstration
          setUserLocation({
            lat: 37.7749,
            lng: -122.4194
          });
          setLocationLoading(false);
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setLocationError('Using demo location');
      // Fallback to mock location
      setUserLocation({
        lat: 37.7749,
        lng: -122.4194
      });
      setLocationLoading(false);
    }
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Your Location Info */}
      <div className="p-4 pb-0">
        <Card className="p-3 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary rounded-full p-2">
                <Navigation className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm">Your Location</p>
                {locationLoading ? (
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Getting location...</span>
                  </div>
                ) : userLocation ? (
                  <div>
                    <p className="text-xs text-gray-600">
                      {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                    </p>
                    {locationError && (
                      <p className="text-xs text-amber-600 mt-0.5">{locationError}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-red-600">Location unavailable</p>
                )}
              </div>
            </div>
            {!locationLoading && userLocation && (
              <Badge variant="outline" className={locationError ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-green-50 text-green-700 border-green-200"}>
                {locationError ? "Demo" : "Active"}
              </Badge>
            )}
          </div>
        </Card>
      </div>

      {/* Map Container */}
      <div className="relative h-96 overflow-hidden mt-4">
        {/* Map Background */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1730314737142-2f6bb293f893?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3BvZ3JhcGhpYyUyMG1hcCUyMHRlcnJhaW58ZW58MXx8fHwxNzU5NTkwMTkyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Topographic map"
            className="w-full h-full object-cover opacity-70"
          />
          {/* Overlay for better pin visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/30"></div>
        </div>

        {/* Location pins */}
        <div className="absolute inset-0">
          {/* User's current location pin */}
          {userLocation && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={{
                left: '50%',
                top: '50%',
              }}
            >
              <div className="relative">
                {/* Pulsing animation */}
                <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75"></div>
                {/* Main pin */}
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="relative bg-primary rounded-full p-3 shadow-xl border-3 border-white hover:scale-110 transition-all duration-200 ring-4 ring-primary/30"
                >
                  <Navigation className="w-6 h-6 text-primary-foreground" />
                </button>
              </div>
            </div>
          )}
          
          {/* Other location pins */}
          {mockLocations.map((location, index) => {
            const IconComponent = location.icon;
            const isSelected = selectedLocation?.id === location.id;
            return (
              <div
                key={location.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${20 + (index * 15)}%`,
                  top: `${30 + (index * 10)}%`,
                }}
              >
                <button
                  onClick={() => setSelectedLocation(location)}
                  className={`${getLocationColor(location.type)} rounded-full p-2.5 shadow-lg border-2 border-white hover:scale-110 transition-all duration-200 ${
                    isSelected ? 'scale-125 ring-4 ring-white/50' : ''
                  }`}
                >
                  <IconComponent className="w-5 h-5 text-white" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Selected Location Popup */}
        {selectedLocation && (
          <div className="absolute bottom-4 left-4 right-4">
            <Card className="p-4 shadow-xl border-2">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className={`${getLocationColor(selectedLocation.type)} rounded-full p-2 flex-shrink-0`}>
                    {React.createElement(selectedLocation.icon, { className: 'w-5 h-5 text-white' })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="truncate">{selectedLocation.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{selectedLocation.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>{selectedLocation.distance}</span>
                      <span>•</span>
                      <span>{selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedLocation(null)}
                  className="h-8 w-8 p-0 flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Location List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="flex items-center justify-between mb-3">
          <h3>Nearby Locations</h3>
          <span className="text-sm text-gray-500">{mockLocations.length} locations</span>
        </div>
        
        {mockLocations.map((location) => {
          const IconComponent = location.icon;
          const isSelected = selectedLocation?.id === location.id;
          return (
            <Card 
              key={location.id} 
              className={`p-3 cursor-pointer transition-all ${
                isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-accent'
              }`}
              onClick={() => setSelectedLocation(location)}
            >
              <div className="flex items-center space-x-3">
                <div className={`${getLocationColor(location.type)} rounded-full p-2 flex-shrink-0`}>
                  <IconComponent className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{location.name}</p>
                  <p className="text-xs text-gray-500 truncate">{location.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{location.distance}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
