import { useState } from "react";
import { BottomNav } from "./components/BottomNav";
import { ArticlesPage } from "./components/ArticlesPage";
import { HelpPage } from "./components/HelpPage";
import { AlertsPage } from "./components/AlertsPage";

export default function App() {
  const [activeTab, setActiveTab] = useState("articles");

  return (
    <div className="size-full flex flex-col bg-background">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "articles" && <ArticlesPage />}
        {activeTab === "help" && <HelpPage />}
        {activeTab === "alerts" && <AlertsPage />}
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
