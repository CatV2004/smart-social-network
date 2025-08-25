"use client"
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 transition-all duration-300">
      <div className="max-w-[1024px] mx-auto w-full p-4">{children}</div>
    </main>
  );
}
