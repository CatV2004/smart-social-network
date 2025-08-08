'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes'; 
import { useEffect, useState } from 'react';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
   if (!mounted) {
    return <>{children}</>;
  }
  return (
    <NextThemesProvider
      attribute="class" 
      defaultTheme="system" // hoặc "light" \ "dark"
      enableSystem={true} // nếu bạn hỗ trợ system theme
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}