import { ListResponse } from '@/types/pagination-meta';
import axiosClient from './axiosClient';
import { AxiosResponse } from 'axios';
import { CreateReportPayload, Report, ReportStatus } from '@/types/report';

const reportApi = {
  getReports: (
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    status?: string,
    type?: string
  ): Promise<AxiosResponse<ListResponse<Report>>> => {
    return axiosClient.get('/reports', {
      params: { page, limit, sortBy, sortOrder, status, type },
    });
  },

  getReportById: (id: string): Promise<AxiosResponse<Report>> => {
    return axiosClient.get(`/reports/${id}`);
  },

  updateReportStatus: (
    id: string,
    status: ReportStatus
  ): Promise<AxiosResponse<Report>> => {
    return axiosClient.patch(`/reports/${id}/status`, { status });
  },

  deleteReport: (id: string): Promise<AxiosResponse<void>> => {
    return axiosClient.delete(`/reports/${id}`);
  },

  approveReport: (id: string): Promise<AxiosResponse<Report>> => {
    return axiosClient.patch(`/reports/${id}/approve`);
  },

  rejectReport: (id: string): Promise<AxiosResponse<Report>> => {
    return axiosClient.patch(`/reports/${id}/reject`);
  },

  createReport: (
    payload: CreateReportPayload
  ): Promise<AxiosResponse<Report>> => {
    return axiosClient.post('/reports', payload);
  },
};

export default reportApi;