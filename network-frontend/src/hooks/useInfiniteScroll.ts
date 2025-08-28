// hooks/useInfiniteScroll.ts
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

        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const distanceFromTop = scrollTop;

        // Chỉ load more khi scroll lên gần đầu (trong vùng threshold)
        if (distanceFromTop < threshold && hasMore && !loading && !isLoadingRef.current) {
            // Lưu vị trí scroll và chiều cao hiện tại trước khi load
            scrollHeightBeforeLoadRef.current = scrollHeight;
            scrollTopBeforeLoadRef.current = scrollTop;

            isLoadingRef.current = true;
            setIsLoadingMore(true);
            lastLoadTimeRef.current = now;
            onLoadMore();
        }
    }, [hasMore, loading, onLoadMore, threshold]);

    // Khôi phục vị trí scroll sau khi load more xong
    useEffect(() => {
        if (isLoadingMore && !loading && containerRef.current) {
            isRestoringScrollRef.current = true;

            // Sử dụng requestAnimationFrame để đảm bảo DOM đã update
            requestAnimationFrame(() => {
                if (containerRef.current) {
                    const scrollHeightAfterLoad = containerRef.current.scrollHeight;
                    const heightDifference = scrollHeightAfterLoad - scrollHeightBeforeLoadRef.current;

                    // Khôi phục vị trí scroll bằng cách giữ nguyên khoảng cách từ top
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
    }, [isLoadingMore, loading]);

    return { containerRef, handleScroll, isLoadingMore };
}