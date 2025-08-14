import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="bg-red-600 text-white p-4 rounded-md text-center max-w-md mx-auto">
      <p className="mb-3 font-semibold">Lỗi: {message}</p>
      <button
        onClick={onRetry}
        className="bg-white text-red-600 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition"
      >
        Thử lại
      </button>
    </div>
  );
}
