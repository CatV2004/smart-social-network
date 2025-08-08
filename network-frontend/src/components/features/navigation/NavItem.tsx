import { ReactNode } from 'react';
import Link from 'next/link';

type NavItemProps = {
  icon: ReactNode;
  text: string;
  active?: boolean;
};

export default function NavItem({ icon, text, active = false }: NavItemProps) {
  return (
    <li>
      <Link
        href="#"
        className={`flex items-center p-2 rounded-lg hover:bg-gray-100 ${active ? 'font-semibold' : ''}`}
      >
        <span className="mr-4">{icon}</span>
        <span>{text}</span>
      </Link>
    </li>
  );
}