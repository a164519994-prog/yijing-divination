import React, { ReactNode } from 'react';
import { BottomNav } from './BottomNav';
import { BACKGROUND_TEXTURE } from '../constants';

interface LayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showNav = true }) => {
  return (
    <div className="bg-stone-100 dark:bg-black font-display text-ink dark:text-gray-100 antialiased selection:bg-royal-blue/20 selection:text-royal-blue h-[100dvh] w-full flex justify-center overflow-hidden">
      <div className="relative flex flex-col h-full w-full max-w-md bg-parchment dark:bg-background-dark shadow-2xl overflow-hidden border-x border-stone-200 dark:border-white/5">
        
        {/* Global Texture Overlay - The unifying element */}
        <div 
          className="absolute inset-0 opacity-40 z-0 mix-blend-multiply dark:mix-blend-overlay pointer-events-none" 
          style={{ backgroundImage: `url('${BACKGROUND_TEXTURE}')` }}
        ></div>

        {/* Ink Wash Mountain Background (From Login Aesthetic) */}
        <div className="absolute bottom-0 left-0 right-0 h-[50vh] z-0 opacity-20 dark:opacity-10 pointer-events-none mask-gradient-to-t">
           <img 
             src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgBViaJ02KiSlEaHXGh71imd9yRJLcO9bR7vWs5UAichWFu0mVbhyxqOYPynlgl7dflMFiUDT2HquXvYR5PCfo-07MIhpsWl-ippzE-zqJSPecSpW2SNpviJANpw24WaFy587AYVBmOiWp97wPn3GYo5qj60r-C9lPoJ3w0LQO-D1GAxvDzgAe_s7UHy05-J8VXgJ5oGqV_crlq4Tj5aG1U5-59eBkgDaiCxa_MXFcAhhnRpVaqXPk9VoeAAbvifnUE3GSREVii7dm" 
             className="w-full h-full object-cover object-bottom grayscale"
             alt="Ink Mountains"
           />
        </div>

        {/* Decorative Floating Blobs (From Login Aesthetic) */}
        <div className="absolute top-[-10%] right-[-10%] size-80 bg-cinnabar/5 rounded-full blur-3xl animate-pulse pointer-events-none z-0"></div>
        <div className="absolute top-[30%] left-[-20%] size-64 bg-ink/5 dark:bg-white/5 rounded-full blur-3xl pointer-events-none z-0"></div>
        
        {/* Global Vignette for depth */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_50%,rgba(168,162,158,0.1)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)]"></div>

        {/* Content - Takes remaining space and handles its own scrolling */}
        <div className="flex-1 flex flex-col relative z-10 w-full overflow-hidden">
          {children}
        </div>

        {/* Navigation - Fixed at bottom */}
        {showNav && <BottomNav />}
      </div>
    </div>
  );
};