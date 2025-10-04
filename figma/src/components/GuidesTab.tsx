import React, { useState, useMemo } from 'react';
import { ChevronRight, Search, X } from 'lucide-react';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

const survivalGuides = [
  {
    id: 1,
    title: 'How to Start a Fire',
    image: 'https://images.unsplash.com/photo-1756633231526-c3fc524fe9b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1wZmlyZSUyMGZsYW1lcyUyMHN1cnZpdmFsfGVufDF8fHx8MTc1OTU4NjMzOHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Fire',
    difficulty: 'Easy',
    time: '15 min',
    description: 'Learn the basics of fire starting in survival situations',
    steps: [
      'Gather dry tinder (birch bark, dry grass, paper)',
      'Collect kindling (pencil-thin dry twigs)',
      'Prepare fuel wood (thumb to wrist thick branches)',
      'Create a fire lay: tinder nest surrounded by kindling tepee',
      'Use matches, lighter, or friction method to ignite tinder',
      'Blow gently on flames to help them catch',
      'Gradually add larger pieces of wood'
    ]
  },
  {
    id: 2,
    title: 'Finding Clean Water',
    image: 'https://images.unsplash.com/photo-1670343740825-ffe84fe9a448?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMHdhdGVyJTIwc3RyZWFtJTIwbmF0dXJlfGVufDF8fHx8MTc1OTU4NjMzOHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Water',
    difficulty: 'Medium',
    time: '30 min',
    description: 'Locate and purify water sources in the wilderness',
    steps: [
      'Look for running water sources (streams, rivers)',
      'Check for clear, odorless water',
      'Avoid stagnant water with algae or bad smell',
      'Boil water for at least 1 minute to kill pathogens',
      'Use water purification tablets if available',
      'Filter through cloth to remove debris',
      'Collect rainwater with clean containers'
    ]
  },
  {
    id: 3,
    title: 'Basic Navigation',
    image: 'https://images.unsplash.com/photo-1553695776-6a5b8cb9b171?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wYXNzJTIwbmF2aWdhdGlvbiUyMGhpa2luZ3xlbnwxfHx8fDE3NTk1ODYzMzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Navigation',
    difficulty: 'Medium',
    time: '20 min',
    description: 'Navigate without GPS using natural methods',
    steps: [
      'Use the sun: rises in east, sets in west',
      'Find the North Star using the Big Dipper',
      'Moss typically grows on north side of trees',
      'Rivers generally flow toward civilization',
      'Mark your path with stones or broken branches',
      'Create a simple compass with magnetized needle',
      'Study topographic features for landmarks'
    ]
  },
  {
    id: 4,
    title: 'Emergency Shelter',
    image: 'https://images.unsplash.com/photo-1646928987117-c2c65845f869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXJ2aXZhbCUyMHNoZWx0ZXIlMjB3aWxkZXJuZXNzfGVufDF8fHx8MTc1OTU4NjMzOHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Shelter',
    difficulty: 'Hard',
    time: '60 min',
    description: 'Build a weatherproof shelter using natural materials',
    steps: [
      'Find a dry location protected from wind',
      'Look for natural windbreaks (rocks, trees)',
      'Build frame using fallen branches',
      'Create a debris hut with thick insulation',
      'Use pine needles, leaves for bedding',
      'Ensure shelter is just big enough for your body',
      'Leave ventilation gap near entrance'
    ]
  },
  {
    id: 5,
    title: 'Signaling for Help',
    image: 'https://images.unsplash.com/photo-1530413288975-7bb4812760f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxyZXNjdWUlMjBzaWduYWwlMjBmbGFyZSUyMGVtZXJnZW5jeXxlbnwxfHx8fDE3NTk1ODYzMzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Rescue',
    difficulty: 'Easy',
    time: '10 min',
    description: 'Attract attention from rescue teams',
    steps: [
      'Use mirror or reflective surface to signal aircraft',
      'Create smoke signals during day (green vegetation)',
      'Build bright fires at night',
      'Use whistle: 3 sharp blasts repeatedly',
      'Arrange rocks/logs in large X or SOS pattern',
      'Wear bright colored clothing',
      'Save phone battery for emergency calls'
    ]
  },
  {
    id: 6,
    title: 'Foraging Basics',
    image: 'https://images.unsplash.com/photo-1697852441303-155c98be9ef4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx3aWxkJTIwYmVycmllcyUyMGZvcmFnaW5nJTIwZm9vZHxlbnwxfHx8fDE3NTk1ODYzNDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Food',
    difficulty: 'Hard',
    time: '45 min',
    description: 'Safely identify edible plants and insects',
    steps: [
      'Never eat anything you cannot 100% identify',
      'Learn local edible plants before trips',
      'Avoid plants with milky sap or three-leaf patterns',
      'Test unknown plants: rub on skin, then lips, then tongue',
      'Focus on nuts, berries, and green leaves',
      'Insects: avoid bright colors and strong smells',
      'Cook all food when possible to kill parasites'
    ]
  }
];

export function GuidesTab() {
  const [selectedGuide, setSelectedGuide] = useState<typeof survivalGuides[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Fire: 'bg-red-500',
      Water: 'bg-blue-500',
      Navigation: 'bg-green-500',
      Shelter: 'bg-yellow-500',
      Rescue: 'bg-purple-500',
      Food: 'bg-orange-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: { [key: string]: string } = {
      Easy: 'text-green-600 bg-green-100',
      Medium: 'text-yellow-600 bg-yellow-100',
      Hard: 'text-red-600 bg-red-100'
    };
    return colors[difficulty] || 'text-gray-600 bg-gray-100';
  };

  // Filter guides based on search query
  const filteredGuides = useMemo(() => {
    if (!searchQuery.trim()) {
      return survivalGuides;
    }

    const query = searchQuery.toLowerCase();
    return survivalGuides.filter((guide) => {
      return (
        guide.title.toLowerCase().includes(query) ||
        guide.description.toLowerCase().includes(query) ||
        guide.category.toLowerCase().includes(query) ||
        guide.steps.some(step => step.toLowerCase().includes(query))
      );
    });
  }, [searchQuery]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="h-full p-4">
      <div className="space-y-4">
        <h2>Survival Guides</h2>
        
        {/* Search Bar */}
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search guides, categories, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Search Results Info */}
        {searchQuery && (
          <div className="text-sm text-gray-500">
            {filteredGuides.length > 0 
              ? `Found ${filteredGuides.length} guide${filteredGuides.length === 1 ? '' : 's'} matching "${searchQuery}"`
              : `No guides found matching "${searchQuery}"`
            }
          </div>
        )}
        
        <div className="space-y-3">
          {filteredGuides.length === 0 && searchQuery ? (
            <Card className="p-8 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No guides found</p>
              <p className="text-sm text-gray-400 mt-1">
                Try searching for different keywords like "fire", "water", "shelter", or "navigation"
              </p>
              <Button
                variant="outline"
                onClick={clearSearch}
                className="mt-4"
              >
                Clear search
              </Button>
            </Card>
          ) : (
            filteredGuides.map((guide) => {
              return (
                <Dialog key={guide.id}>
                  <DialogTrigger asChild>
                    <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <ImageWithFallback
                              src={guide.image}
                              alt={guide.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p>{guide.title}</p>
                            <p className="text-sm text-gray-500">{guide.description}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(guide.difficulty)}`}>
                                {guide.difficulty}
                              </span>
                              <span className="text-xs text-gray-500">{guide.time}</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </Card>
                  </DialogTrigger>
                
                <DialogContent className="max-w-md max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100">
                        <ImageWithFallback
                          src={guide.image}
                          alt={guide.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span>{guide.title}</span>
                    </DialogTitle>
                  </DialogHeader>
                  
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">{guide.description}</p>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(guide.difficulty)}`}>
                          {guide.difficulty}
                        </span>
                        <span className="text-xs text-gray-500">⏱️ {guide.time}</span>
                      </div>
                      
                      <div>
                        <h4 className="mb-2">Step-by-step instructions:</h4>
                        <ol className="space-y-2">
                          {guide.steps.map((step, index) => (
                            <li key={index} className="text-sm flex">
                              <span className="bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">
                                {index + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </ScrollArea>
                </DialogContent>
                </Dialog>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}