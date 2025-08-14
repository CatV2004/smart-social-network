import { cn } from '@/lib/utils/cn';

interface ProfileStatsProps {
  activeTab: 'posts' | 'saved' | 'tagged';
  onTabChange: (tab: 'posts' | 'saved' | 'tagged') => void;
}

export const ProfileStats = ({ 
  activeTab = 'posts',
  onTabChange
}: ProfileStatsProps) => {
  const tabs = [
    { 
      id: 'posts',
      name: 'Bài viết',
    },
    { 
      id: 'saved',
      name: 'Đã lưu',
    },
    { 
      id: 'tagged',
      name: 'Được gắn thẻ',
    },
  ];

  return (
    <div className="border-b">
      <div className="flex justify-center md:justify-start">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as 'posts' | 'saved' | 'tagged')}
              className={cn(
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
                'whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium cursor-pointer'
              )}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};