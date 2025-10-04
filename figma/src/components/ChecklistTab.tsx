import React, { useState } from 'react';
import { Package, Check, Clock, AlertTriangle, Star } from 'lucide-react';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface ChecklistItem {
  id: number;
  name: string;
  category: string;
  priority: 'essential' | 'important' | 'useful';
  description: string;
  quantity?: string;
}

const survivalItems: ChecklistItem[] = [
  // Essential items
  { id: 1, name: 'First Aid Kit', category: 'Medical', priority: 'essential', description: 'Bandages, antiseptic, pain relievers', quantity: '1 complete kit' },
  { id: 2, name: 'Water Purification Tablets', category: 'Water', priority: 'essential', description: 'Purify contaminated water sources', quantity: '20-30 tablets' },
  { id: 3, name: 'Emergency Whistle', category: 'Signaling', priority: 'essential', description: 'Signal for rescue teams', quantity: '1-2 whistles' },
  { id: 4, name: 'Fire Starter Kit', category: 'Fire', priority: 'essential', description: 'Waterproof matches, lighter, tinder', quantity: '1 kit' },
  { id: 5, name: 'Emergency Blanket', category: 'Shelter', priority: 'essential', description: 'Reflective thermal blanket', quantity: '2-3 blankets' },
  { id: 6, name: 'Knife/Multi-tool', category: 'Tools', priority: 'essential', description: 'Fixed blade or folding knife with tools', quantity: '1 primary tool' },
  { id: 7, name: 'Flashlight', category: 'Light', priority: 'essential', description: 'LED flashlight with extra batteries', quantity: '1-2 lights' },
  { id: 8, name: 'Water Bottles', category: 'Water', priority: 'essential', description: 'Durable water containers', quantity: '2-3 bottles' },

  // Important items
  { id: 9, name: 'Rope/Paracord', category: 'Tools', priority: 'important', description: '50ft+ of strong cordage', quantity: '50-100 feet' },
  { id: 10, name: 'Compass', category: 'Navigation', priority: 'important', description: 'Backup navigation tool', quantity: '1 compass' },
  { id: 11, name: 'Emergency Food Bars', category: 'Food', priority: 'important', description: 'High-calorie survival bars', quantity: '6-12 bars' },
  { id: 12, name: 'Duct Tape', category: 'Tools', priority: 'important', description: 'Repairs and emergency fixes', quantity: '1 roll' },
  { id: 13, name: 'Signal Mirror', category: 'Signaling', priority: 'important', description: 'Heliograph for aircraft signaling', quantity: '1 mirror' },
  { id: 14, name: 'Plastic Sheeting', category: 'Shelter', priority: 'important', description: 'Waterproof shelter material', quantity: '6x8 feet' },
  { id: 15, name: 'Water Filter', category: 'Water', priority: 'important', description: 'Portable water filtration system', quantity: '1 filter' },

  // Useful items
  { id: 16, name: 'Fishing Kit', category: 'Food', priority: 'useful', description: 'Hooks, line, small weights', quantity: '1 compact kit' },
  { id: 17, name: 'Sewing Kit', category: 'Tools', priority: 'useful', description: 'Needle, thread, buttons', quantity: '1 small kit' },
  { id: 18, name: 'Playing Cards', category: 'Mental', priority: 'useful', description: 'Morale and mental health', quantity: '1 deck' },
  { id: 19, name: 'Notebook & Pencil', category: 'Communication', priority: 'useful', description: 'Record information, leave messages', quantity: '1 set' },
  { id: 20, name: 'Solar Charger', category: 'Electronics', priority: 'useful', description: 'Charge small devices', quantity: '1 charger' },
  { id: 21, name: 'Binoculars', category: 'Navigation', priority: 'useful', description: 'Scout terrain and resources', quantity: '1 pair' },
  { id: 22, name: 'Hand Sanitizer', category: 'Medical', priority: 'useful', description: 'Prevent infections', quantity: '1-2 bottles' },
  { id: 23, name: 'Cash', category: 'Emergency', priority: 'useful', description: 'Emergency funds in small bills', quantity: '$100-200' },
];

export function ChecklistTab() {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleItemCheck = (itemId: number) => {
    const newCheckedItems = new Set(checkedItems);
    if (newCheckedItems.has(itemId)) {
      newCheckedItems.delete(itemId);
    } else {
      newCheckedItems.add(itemId);
    }
    setCheckedItems(newCheckedItems);
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      essential: 'bg-red-100 text-red-800 border-red-200',
      important: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      useful: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const categories = ['all', ...Array.from(new Set(survivalItems.map(item => item.category)))];
  const filteredItems = selectedCategory === 'all' 
    ? survivalItems 
    : survivalItems.filter(item => item.category === selectedCategory);

  const completionStats = {
    essential: {
      total: survivalItems.filter(item => item.priority === 'essential').length,
      checked: survivalItems.filter(item => item.priority === 'essential' && checkedItems.has(item.id)).length
    },
    important: {
      total: survivalItems.filter(item => item.priority === 'important').length,
      checked: survivalItems.filter(item => item.priority === 'important' && checkedItems.has(item.id)).length
    },
    useful: {
      total: survivalItems.filter(item => item.priority === 'useful').length,
      checked: survivalItems.filter(item => item.priority === 'useful' && checkedItems.has(item.id)).length
    }
  };

  return (
    <div className="h-full p-4 space-y-4">
      <div className="space-y-4">
        <h2>Survival Gear Checklist</h2>
        
        {/* Progress Overview */}
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Essential Items</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {completionStats.essential.checked}/{completionStats.essential.total}
                </span>
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 transition-all duration-300"
                    style={{ width: `${(completionStats.essential.checked / completionStats.essential.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Important Items</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {completionStats.important.checked}/{completionStats.important.total}
                </span>
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500 transition-all duration-300"
                    style={{ width: `${(completionStats.important.checked / completionStats.important.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span>Useful Items</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {completionStats.useful.checked}/{completionStats.useful.total}
                </span>
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${(completionStats.useful.checked / completionStats.useful.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Category Filter */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="Medical">Medical</TabsTrigger>
            <TabsTrigger value="Water">Water</TabsTrigger>
            <TabsTrigger value="Tools">Tools</TabsTrigger>
          </TabsList>

          <div className="space-y-3">
            {filteredItems.map((item) => (
              <Card key={item.id} className={`p-4 transition-all duration-200 ${checkedItems.has(item.id) ? 'bg-green-50 border-green-200' : ''}`}>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id={`item-${item.id}`}
                    checked={checkedItems.has(item.id)}
                    onCheckedChange={() => handleItemCheck(item.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <label 
                        htmlFor={`item-${item.id}`}
                        className={`cursor-pointer ${checkedItems.has(item.id) ? 'line-through text-gray-500' : ''}`}
                      >
                        {item.name}
                      </label>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPriorityColor(item.priority)}`}
                        >
                          {item.priority === 'essential' && <Star className="w-3 h-3 mr-1" />}
                          {item.priority.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600">{item.description}</p>
                    
                    {item.quantity && (
                      <p className="text-xs text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Tabs>

        {/* Completion Summary */}
        {checkedItems.size > 0 && (
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-green-800">
                  {checkedItems.size} of {survivalItems.length} items completed
                </p>
                <p className="text-sm text-green-600">
                  {completionStats.essential.checked === completionStats.essential.total 
                    ? "✅ All essential items ready!" 
                    : `${completionStats.essential.total - completionStats.essential.checked} essential items remaining`}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}