import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { BookOpen, Droplets, Home, Zap, Wind, Flame } from "lucide-react";

const articles = [
  {
    id: 1,
    title: "Earthquake Preparedness: Essential Steps",
    category: "Earthquake",
    icon: Zap,
    excerpt: "Learn how to prepare your home and family for seismic events. Includes emergency kit essentials and safety procedures.",
    readTime: "5 min read",
    color: "bg-orange-500",
  },
  {
    id: 2,
    title: "Flood Safety and Evacuation Guide",
    category: "Flood",
    icon: Droplets,
    excerpt: "Understanding flood risks, creating evacuation plans, and protecting your property during flooding events.",
    readTime: "7 min read",
    color: "bg-blue-500",
  },
  {
    id: 3,
    title: "Hurricane Survival Handbook",
    category: "Hurricane",
    icon: Wind,
    excerpt: "Complete guide to hurricane preparedness, from boarding up windows to post-storm safety measures.",
    readTime: "10 min read",
    color: "bg-cyan-500",
  },
  {
    id: 4,
    title: "Wildfire Defense: Protecting Your Home",
    category: "Wildfire",
    icon: Flame,
    excerpt: "Create defensible space around your property and learn evacuation procedures for wildfire zones.",
    readTime: "6 min read",
    color: "bg-red-500",
  },
  {
    id: 5,
    title: "Emergency Shelter Setup",
    category: "General",
    icon: Home,
    excerpt: "How to quickly establish emergency shelter and maintain safe living conditions during disasters.",
    readTime: "8 min read",
    color: "bg-purple-500",
  },
  {
    id: 6,
    title: "Water Purification During Emergencies",
    category: "General",
    icon: Droplets,
    excerpt: "Methods for making water safe to drink when clean water supplies are compromised.",
    readTime: "4 min read",
    color: "bg-teal-500",
  },
];

export function ArticlesPage() {
  return (
    <div className="h-full overflow-y-auto pb-20 pt-4 px-4 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="mb-2">Survival Guides</h1>
        <p className="text-muted-foreground">
          Essential information for natural disasters and emergency situations
        </p>
      </div>

      <div className="space-y-4">
        {articles.map((article) => {
          const Icon = article.icon;
          return (
            <Card
              key={article.id}
              className="p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex gap-3">
                <div className={`${article.color} rounded-lg p-3 h-fit`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="flex-1">{article.title}</h3>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {article.category}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <BookOpen className="h-3 w-3" />
                    <span>{article.readTime}</span>
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
