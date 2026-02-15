import { MapPin, Heart, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

type Tab = 'explore' | 'favorites' | 'settings';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs = [
  { id: 'explore' as Tab, icon: MapPin, label: 'Explore' },
  { id: 'favorites' as Tab, icon: Heart, label: 'Favorites' },
  { id: 'settings' as Tab, icon: Settings, label: 'Settings' },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border safe-area-bottom z-40">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center gap-1 py-2 px-6 relative"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-2 w-12 h-1 bg-gradient-hero rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                size={24}
                className={isActive ? 'text-primary' : 'text-muted-foreground'}
              />
              <span
                className={`text-xs font-medium ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
