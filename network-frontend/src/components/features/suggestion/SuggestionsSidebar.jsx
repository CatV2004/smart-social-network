export default function SuggestionsSidebar({ suggestions }) {
  return (
    <div className="text-base text-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-gray-900 text-lg">Gợi ý cho bạn</h2>
        <button className="text-blue-500 text-sm font-medium hover:underline">Xem tất cả</button>
      </div>

      <ul className="space-y-5">
        {suggestions.map((user) => (
          <li key={user.username} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div>
                <p className="font-semibold text-[15px]">{user.username}</p>
                <p className="text-gray-500 text-sm">{user.note}</p>
              </div>
            </div>
            <button className="text-blue-500 text-sm font-semibold hover:underline">Theo dõi</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
