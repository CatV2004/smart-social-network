import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Report } from "@/types/report";
import { PaginationMeta } from "@/types/pagination-meta";
import { approveReport, fetchReports, rejectReport, updateReportStatus } from "./reportThunks";

interface ReportState {
    reports: Report[];
    loading: boolean;
    error: string | null;
    pagination: PaginationMeta | null;
    filters: {
        status?: string;
        type?: string;
        sortBy: string;
        sortOrder: 'ASC' | 'DESC';
    };
    reportLoading: { [reportId: string]: boolean }

}

const initialState: ReportState = {
    reports: [],
    loading: false,
    error: null,
    pagination: null,
    filters: {
        sortBy: 'createdAt',
        sortOrder: 'DESC',
    },
    reportLoading: {},
};

export const reportSlice = createSlice({
    name: "reports",
    initialState,
    reducers: {
        setReports: (state, action: PayloadAction<Report[]>) => {
            state.reports = action.payload;
        },
        addReport: (state, action: PayloadAction<Report>) => {
            state.reports.unshift(action.payload);
        },
        updateReport: (state, action: PayloadAction<Report>) => {
            const index = state.reports.findIndex(r => r.id === action.payload.id);
            if (index !== -1) {
                state.reports[index] = action.payload;
            }
        },
        removeReport: (state, action: PayloadAction<string>) => {
            const reportId = action.payload;
            const reportIndex = state.reports.findIndex(r => r.id === reportId);

            if (reportIndex !== -1) {
                state.reports.splice(reportIndex, 1);

                if (state.pagination) {
                    state.pagination.total = Math.max(0, state.pagination.total - 1);
                    state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.limit);
                }
            }
        },
        setFilters: (state, action: PayloadAction<Partial<ReportState['filters']>>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = {
                sortBy: 'createdAt',
                sortOrder: 'DESC',
            };
        },
        resetReports: (state) => {
            state.reports = [];
            state.loading = false;
            state.error = null;
            state.pagination = null;
            state.filters = {
                sortBy: 'createdAt',
                sortOrder: 'DESC',
            };
        },
        setReportLoading: (state, action: PayloadAction<{ reportId: string; loading: boolean }>) => {
            const { reportId, loading } = action.payload;
            state.reportLoading[reportId] = loading;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch reports
            .addCase(fetchReports.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReports.fulfilled, (state, action) => {
                state.loading = false;

                const data = action.payload?.data || [];
                const meta = action.payload?.meta || {
                    page: 1,
                    limit: 10,
                    total: 0,
                    totalPages: 0,
                };

                if (meta.page === 1) {
                    state.reports = data;
                } else {
                    // For load more functionality
                    state.reports.push(...data);
                }

                state.pagination = meta;
            })
            .addCase(fetchReports.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch reports";

                state.pagination = state.pagination || {
                    page: 1,
                    limit: 10,
                    total: 0,
                    totalPages: 0,
                };
            });
        builder
            .addCase(updateReportStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateReportStatus.fulfilled, (state, action) => {
                state.loading = false;
                const updatedReport = action.payload;
                const index = state.reports.findIndex(r => r.id === updatedReport.id);
                if (index !== -1) {
                    state.reports[index].status = updatedReport.status;
                }
            })
            .addCase(updateReportStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to update report status";
            });
        builder
            .addCase(approveReport.pending, (state, action) => {
                const reportId = action.meta.arg;
                state.reportLoading[reportId] = true;
            })
            .addCase(approveReport.fulfilled, (state, action) => {
                const updatedReport = action.payload;
                const index = state.reports.findIndex(r => r.id === updatedReport.id);

                if (index !== -1) {
                    state.reports[index].status = updatedReport.status;
                }

                delete state.reportLoading[updatedReport.id];
            })
            .addCase(approveReport.rejected, (state, action) => {
                const reportId = action.meta.arg;
                delete state.reportLoading[reportId];
                state.error = action.error.message || "Failed to approve report";
            });
        builder
            .addCase(rejectReport.pending, (state, action) => {
                const reportId = action.meta.arg;
                state.reportLoading[reportId] = true;
            })
            .addCase(rejectReport.fulfilled, (state, action) => {
                const updated = action.payload;
                const index = state.reports.findIndex(r => r.id === updated.id);
                if (index !== -1) {
                    state.reports[index].status = updated.status;
                }
                delete state.reportLoading[updated.id];
            })
            .addCase(rejectReport.rejected, (state, action) => {
                const reportId = action.meta.arg;
                delete state.reportLoading[reportId];
                state.error = action.error.message || "Failed to reject report";
            });
    },
});

export const {
    setReports,
    addReport,
    updateReport,
    removeReport,
    setFilters,
    resetFilters,
    resetReports,
    setReportLoading,
} = reportSlice.actions;

export default reportSlice.reducer;