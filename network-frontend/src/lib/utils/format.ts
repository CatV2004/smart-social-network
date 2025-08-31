export const formatDate = (date: string | Date, format: "short" | "long" = "short") => {
    if (!date) return "-";
    const d = typeof date === "string" ? new Date(date) : date;

    if (format === "short") {
        return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    }

    return d.toLocaleDateString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};
