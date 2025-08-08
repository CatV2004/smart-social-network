import localFont from 'next/font/local'

export const playwrite = localFont({
  src: [
    {
      path: '../../public/fonts/PlaywriteHU-Regular.woff2',
    },
  ],
  variable: '--font-playwrite',
  display: 'swap',
});

export const Inter = localFont({
   src: [
    {
      path: '../../public/fonts/Inter24pt-ExtraLight.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-Inter',
  display: 'swap',
});

