// components/layouts/MainLayout.tsx
"use client";

import { Sidebar } from "./Sidebar/Sidebar";

// import MobileNavbar from "./MobileNavbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [isMobile, setIsMobile] = useState(false);

  // useEffect(() => {
  //   const handleResize = () => {
  //     setIsMobile(window.innerWidth < 768);
  //   };

  //   handleResize();
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {" "}
      {/* Sidebar wrapper */}
      <div className="w-1/6 min-w-[88px] lg:w-1/6 lg:min-w-[280px]">
        <Sidebar />
      </div>
      {/* Main content */}
      <main className="flex-1 transition-all duration-300">
        <div className="max-w-[1024px] mx-auto w-full p-4">{children}</div>
      </main>
    </div>
  );
}
