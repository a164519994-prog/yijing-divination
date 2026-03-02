import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from './Icon';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Unified color scheme: Always use Cinnabar for active state to match the "Ink & Seal" aesthetic
  const activeColor = 'text-cinnabar';

  const navItems = [
    {
      id: 'divination',
      path: '/',
      icon: 'temple_buddhist',
      label: '测算',
      subLabel: 'Divination'
    },
    {
      id: 'book',
      path: '/book',
      icon: 'auto_stories',
      label: '周易',
      subLabel: 'Book of Changes'
    },
    {
      id: 'profile',
      path: '/profile',
      icon: 'person',
      label: '我的',
      subLabel: 'Profile'
    }
  ];

  return (
    <nav className="relative z-20 flex justify-between items-center px-8 py-3 pb-6 bg-white/90 dark:bg-[#151829] border-t border-stone-200 dark:border-white/5 backdrop-blur-sm">
      {navItems.map((item) => {
        const isActive = currentPath === item.path;
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 group transition-all duration-300 ${
              isActive 
                ? activeColor 
                : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'
            }`}
          >
            <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}>
              <Icon 
                name={item.icon} 
                filled={isActive} 
                className={isActive ? "drop-shadow-sm" : ""} 
              />
            </div>
            <div className="flex flex-col items-center leading-none">
              <span className={`text-[11px] font-bold transition-colors ${isActive ? 'text-ink dark:text-white' : ''}`}>{item.label}</span>
              <span className="text-[9px] font-medium scale-90 opacity-80">{item.subLabel}</span>
            </div>
          </button>
        );
      })}
    </nav>
  );
};