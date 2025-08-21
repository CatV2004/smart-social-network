"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faTimes,
  faArrowRight,
  faFileLines,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useCallback } from "react";
import searchApi from "@/lib/api/search.api";
import { SearchResultDto, UserSearchDto, PostSearchDto } from "@/types/search";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  "data-overlay"?: string;
}

export function SearchOverlay({
  isOpen,
  onClose,
  ...props
}: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultDto[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // debounce để tránh gọi API quá nhiều
  const fetchResults = useCallback(
    debounce(async (query: string) => {
      if (!query) {
        setSearchResults([]);
        return;
      }
      try {
        setLoading(true);
        const res = await searchApi.searchAll({ q: query });
        setSearchResults(res.data);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (isOpen) {
      fetchResults(searchQuery);
    }
  }, [searchQuery, isOpen, fetchResults]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Hàm xử lý khi nhấn vào user
  const handleUserClick = (username: string) => {
    router.push(`/in/${username}`);
    onClose();
  };

  // Hàm xử lý khi nhấn vào kết quả bài viết - ĐÃ SỬA
  const handlePostResultsClick = () => {
    // Lấy danh sách IDs từ kết quả bài post
    const postIds = searchResults
      .filter((result) => result.type === "post")
      .map((result) => (result.data as PostSearchDto).id);

    // Chuyển hướng với danh sách IDs dưới dạng query parameter
    router.push(
      `/search/posts?ids=${encodeURIComponent(
        postIds.join(",")
      )}&q=${encodeURIComponent(searchQuery)}`
    );
    onClose();
  };

  // Hàm xử lý khi nhấn vào nút "Xem tất cả" - ĐÃ SỬA
  const handleViewAll = () => {
    // Lấy danh sách IDs từ tất cả kết quả
    const allIds = searchResults.map((result) => result.id);
    router.push(
      `/search?ids=${encodeURIComponent(
        allIds.join(",")
      )}&q=${encodeURIComponent(searchQuery)}`
    );
    onClose();
  };

  if (!isOpen) return null;

  // Đếm số lượng kết quả theo loại
  const userResults = searchResults.filter((result) => result.type === "user");
  const postResults = searchResults.filter((result) => result.type === "post");

  return (
    <>
      {/* Overlay background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/30 z-10 md:hidden"
        onClick={onClose}
      />

      {/* Container chính */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 left-20 h-full w-100 bg-white shadow-xl z-20 border-r border-gray-200 flex flex-col"
        {...props}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center bg-white sticky top-0">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl font-bold text-gray-800 flex-1"
          >
            Tìm kiếm
          </motion.h2>

          <motion.button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FontAwesomeIcon icon={faTimes} className="w-4 h-4 text-gray-600" />
          </motion.button>
        </div>

        {/* Search input */}
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon
                icon={faSearch}
                className="h-4 w-4 text-gray-400"
              />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm người dùng, hashtag, bài viết..."
              value={searchQuery}
              onChange={handleSearch}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl bg-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              autoFocus
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Đang tải...</div>
            ) : searchResults.length > 0 ? (
              <>
                {/* Nút Xem tất cả - chỉ hiển thị khi có kết quả */}
                <div className="p-3 border-b border-gray-100">
                  <button
                    onClick={handleViewAll}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  >
                    <span className="font-medium">Xem tất cả kết quả</span>
                    <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
                  </button>
                </div>

                {/* Kết quả người dùng */}
                {userResults.length > 0 && (
                  <div className="py-2">
                    <h3 className="px-4 py-2 text-sm font-medium text-gray-500">
                      Người dùng
                    </h3>
                    {userResults.slice(0, 3).map((result, index) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 + 0.2 }}
                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                        onClick={() =>
                          handleUserClick(
                            (result.data as UserSearchDto).username
                          )
                        }
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <FontAwesomeIcon
                              icon={faUser}
                              className="w-4 h-4 text-gray-600"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {(result.data as UserSearchDto).fullName}
                            </p>
                            <p className="text-sm text-gray-600 truncate">
                              @{(result.data as UserSearchDto).username}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Kết quả bài viết (gom thành một mục) */}
                {postResults.length > 0 && (
                  <div className="py-2">
                    <h3 className="px-4 py-2 text-sm font-medium text-gray-500">
                      Bài viết
                    </h3>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                      onClick={handlePostResultsClick}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FontAwesomeIcon
                            icon={faFileLines}
                            className="w-4 h-4 text-blue-600"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900">
                            {postResults.length} bài viết phù hợp
                          </p>
                          <p className="text-sm text-gray-600">
                            Nhấn để xem tất cả bài viết liên quan đến "
                            {searchQuery}"
                          </p>
                        </div>
                        <FontAwesomeIcon
                          icon={faArrowRight}
                          className="w-4 h-4 text-gray-400"
                        />
                      </div>
                    </motion.div>
                  </div>
                )}
              </>
            ) : searchQuery ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="p-8 text-center text-gray-500"
              >
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="w-6 h-6 text-gray-400"
                  />
                </div>
                <p className="font-medium">Không tìm thấy kết quả</p>
                <p className="text-sm mt-1">Thử tìm kiếm với từ khóa khác</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="p-8 text-center text-gray-500"
              >
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="w-6 h-6 text-gray-400"
                  />
                </div>
                <p className="font-medium">Tìm kiếm người dùng và bài viết</p>
                <p className="text-sm mt-1">Nhập từ khóa để bắt đầu tìm kiếm</p>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
