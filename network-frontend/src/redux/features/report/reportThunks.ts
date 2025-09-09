import { createAsyncThunk } from "@reduxjs/toolkit";
import { Report, ReportStatus } from "@/types/report";
import { ListResponse } from "@/types/pagination-meta";
import reportApi from "@/lib/api/report.api";

export interface FetchReportsParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    status?: string;
    type?: string;
}

export const fetchReports = createAsyncThunk<
    ListResponse<Report>,
    FetchReportsParams | undefined
>(
    "reports/fetchReports",
    async (params, { rejectWithValue }) => {
        try {
            const page = params?.page || 1;
            const limit = params?.limit || 10;
            const sortBy = params?.sortBy || 'createdAt';
            const sortOrder = params?.sortOrder || 'DESC';
            const status = params?.status;
            const type = params?.type;

            const response = await reportApi.getReports(
                page,
                limit,
                sortBy,
                sortOrder,
                status,
                type
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue({
                data: [],
                meta: {
                    page: params?.page || 1,
                    limit: params?.limit || 10,
                    total: 0,
                    totalPages: 0,
                },
            } as ListResponse<Report>);
        }
    }
);

export const updateReportStatus = createAsyncThunk<
    Report,
    { id: string; status: ReportStatus }
>(
    "reports/updateReportStatus",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await reportApi.updateReportStatus(id, status);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


export const approveReport = createAsyncThunk<Report, string>(
    "reports/approveReport",
    async (id, { rejectWithValue }) => {
        try {
            const response = await reportApi.approveReport(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const rejectReport = createAsyncThunk<Report, string>(
    "reports/rejectReport",
    async (id, { rejectWithValue }) => {
        try {
            const response = await reportApi.rejectReport(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);