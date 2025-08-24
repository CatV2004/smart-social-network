interface NotificationFooterProps {
  hasNotifications: boolean;
  onViewAll: () => void;
}

export function NotificationFooter({
  hasNotifications,
  onViewAll,
}: NotificationFooterProps) {
  if (!hasNotifications) return null;

  return (
    <div className="p-4 border-t border-gray-200 bg-gray-50">
      <button
        onClick={onViewAll}
        className="w-full py-2 text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200"
      >
        Xem tất cả thông báo
      </button>
    </div>
  );
}
