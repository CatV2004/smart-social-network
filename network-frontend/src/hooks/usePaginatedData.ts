// hooks/usePaginatedData.ts
"use client";
import { useCallback, useEffect, useState, useRef } from "react";

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type ApiResponse<T> = {
  data: {
    data: T[];
    meta: PaginationMeta;
  };
};

type FetchFn<T> = (page: number, limit: number) => Promise<ApiResponse<T>>;

/**
 * T extends { id?: string } vì chúng ta dùng `id` để dedupe.
 * Nếu data của bạn không có id, cân nhắc truyền keyExtractor vào hook.
 */
export function usePaginatedData<T extends { id?: string }>(
  fetchFn: FetchFn<T>,
  enabled: boolean = true,
  deps: any[] = [],
  initialLimit = 3
) {
  const [items, setItems] = useState<T[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: initialLimit,
    total: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const limitRef = useRef(initialLimit);

  const loadPage = useCallback(
    async (page: number, replace = false) => {
      if (!enabled) return;
      setIsLoading(true);
      try {
        const res = await fetchFn(page, limitRef.current);
        const newItems = res.data.data || [];
        const meta = res.data.meta;

        setPagination(meta);
        setHasMore(meta.page < meta.totalPages);

        setItems((prev) => {
          const combined = replace ? newItems : [...prev, ...newItems];

          // Dedupe theo `id`. Nếu item không có `id`, tạo key tạm (không khuyến khích).
          const map = new Map<string, T>();
          for (const it of combined) {
            const id = (it as any).id ?? `__no_id_${Math.random().toString(36).slice(2)}`;
            // last occurrence wins (mới sẽ ghi đè cũ)
            map.set(id, it);
          }
          return Array.from(map.values());
        });
      } catch (err) {
        // bạn có thể thêm setError nếu cần
        console.error("usePaginatedData loadPage error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchFn, enabled]
  );

  // Load page 1 khi enabled hoặc bất kỳ deps nào thay đổi
  useEffect(() => {
    if (!enabled) {
      // reset khi không enabled
      setItems([]);
      setPagination({
        page: 1,
        limit: initialLimit,
        total: 0,
        totalPages: 1,
      });
      setHasMore(false);
      return;
    }
    // load trang đầu (replace = true)
    loadPage(1, true);
  }, [enabled, loadPage, ...deps]); // fetchFn nên được memo hóa bởi caller (vd: useCallback)

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    loadPage(pagination.page + 1);
  }, [isLoading, hasMore, pagination.page, loadPage]);

  const reload = useCallback(() => {
    loadPage(1, true);
  }, [loadPage]);

  return {
    items,
    isLoading,
    hasMore,
    loadMore,
    reload,
    pagination,
  };
}
