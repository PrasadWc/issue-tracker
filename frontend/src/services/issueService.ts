import apiClient, { type PaginatedResponse } from "./apiClient";

export const IssueStatus = {
  Open: 1,
  InProgress: 2,
  Closed: 3,
} as const;

export type IssueStatus = (typeof IssueStatus)[keyof typeof IssueStatus];

export const IssuePriority = {
  Low: 1,
  Medium: 2,
  High: 3,
} as const;

export type IssuePriority = (typeof IssuePriority)[keyof typeof IssuePriority];

export interface Issue {
  _id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  createdBy: { _id: string; name: string; email: string };
  assignee?: string | { _id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface CreateIssueData {
  title: string;
  description: string;
  status?: IssueStatus;
  priority?: IssuePriority;
  assignee?: string;
}

export interface UpdateIssueData extends Partial<CreateIssueData> {}

const issueService = {
  getIssues: async (
    page = 1,
    limit = 10,
    filters?: { status?: number; priority?: number; searchKey?: string },
  ) => {
    const response = await apiClient.get<PaginatedResponse<Issue>>("/issues", {
      params: { page, limit, ...filters },
    });
    return response.data;
  },

  getIssue: async (id: string) => {
    const response = await apiClient.get<Issue>(`/issues/${id}`);
    return response.data;
  },

  createIssue: async (data: CreateIssueData) => {
    const response = await apiClient.post<Issue>("/issues", data);
    return response.data;
  },

  updateIssue: async (id: string, data: UpdateIssueData) => {
    const response = await apiClient.put<Issue>(`/issues/${id}`, data);
    return response.data;
  },

  deleteIssue: async (id: string) => {
    const response = await apiClient.delete(`/issues/${id}`);
    return response.data;
  },
};

export default issueService;
