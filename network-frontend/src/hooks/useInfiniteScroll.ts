import { useState, useRef, useEffect, useCallback } from "react";

interface UseInfiniteScrollOptions {
    hasMore: boolean;
    loading?: boolean;
    onLoadMore: () => void;
    threshold?: number;
}

export function useInfiniteScroll<T extends HTMLElement>({
    hasMore,
    loading = false,
    onLoadMore,
    threshold = 100,
}: UseInfiniteScrollOptions) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const isLoadingRef = useRef(false);
    const scrollHeightBeforeLoadRef = useRef<number>(0);
    const scrollTopBeforeLoadRef = useRef<number>(0);
    const isRestoringScrollRef = useRef(false);
    const lastLoadTimeRef = useRef<number>(0);

    // Đồng bộ ref với state
    useEffect(() => {
        isLoadingRef.current = isLoadingMore;
    }, [isLoadingMore]);

    const handleScroll = useCallback(() => {
        const now = Date.now();
        if (!containerRef.current || !hasMore || loading || isLoadingRef.current ||
            isRestoringScrollRef.current || (now - lastLoadTimeRef.current < 500)) {
            return;
        }

        const { scrollTop } = containerRef.current;

        // Chỉ load more khi scroll lên gần đầu
        if (scrollTop < threshold && hasMore && !loading && !isLoadingRef.current) {
            // Lưu vị trí scroll hiện tại trước khi load
            scrollHeightBeforeLoadRef.current = containerRef.current.scrollHeight;
            scrollTopBeforeLoadRef.current = containerRef.current.scrollTop;

            isLoadingRef.current = true;
            setIsLoadingMore(true);
            lastLoadTimeRef.current = now;
            onLoadMore();
        }
    }, [hasMore, loading, onLoadMore, threshold]);

    // Khôi phục vị trí scroll sau khi load more
    useEffect(() => {
        if (isLoadingMore && containerRef.current) {
            isRestoringScrollRef.current = true;

            // Sử dụng requestAnimationFrame để đảm bảo DOM đã update
            requestAnimationFrame(() => {
                if (containerRef.current) {
                    const scrollHeightAfterLoad = containerRef.current.scrollHeight;
                    const heightDifference = scrollHeightAfterLoad - scrollHeightBeforeLoadRef.current;

                    // Giữ nguyên vị trí scroll bằng cách thêm độ chênh lệch chiều cao
                    containerRef.current.scrollTop = scrollTopBeforeLoadRef.current + heightDifference;
                }

                setIsLoadingMore(false);
                isLoadingRef.current = false;

                // Cho phép scroll lại sau khi đã khôi phục xong
                requestAnimationFrame(() => {
                    isRestoringScrollRef.current = false;
                });
            });
        }
    }, [isLoadingMore]);

    return { containerRef, handleScroll, isLoadingMore };
}