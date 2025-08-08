import { FiHeart, FiMessageCircle, FiSend } from 'react-icons/fi';
import { FaBookmark } from 'react-icons/fa';

export default function PostActions() {
  return (
    <div className="p-3 flex justify-between items-center">
      <div className="flex space-x-4">
        <button className="text-xl">
          <FiHeart />
        </button>
        <button className="text-xl">
          <FiMessageCircle />
        </button>
        <button className="text-xl">
          <FiSend />
        </button>
      </div>
      <button className="text-xl">
        <FaBookmark />
      </button>
    </div>
  );
}