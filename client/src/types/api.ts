// API Response Types

import { IProperty, ILead, IContact, IDeal, ITask, IAnalytics, IUser, IRole } from './models';

// Generic API Response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Paginated Response
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: IUser;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

// Property Types
export interface PropertyFilters {
  type?: string;
  category?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minArea?: number;
  maxArea?: number;
  city?: string;
  country?: string;
}

export interface PropertyCreateRequest {
  title: string;
  description: string;
  price: number;
  currency: string;
  type: string;
  category: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    area: number;
  };
}

export type PropertyUpdateRequest = Partial<PropertyCreateRequest>;

// Lead Types
export interface LeadFilters {
  status?: string;
  source?: string;
  priority?: string;
  assignedTo?: string;
  search?: string;
}

export interface LeadCreateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status?: string;
  source?: string;
  priority?: string;
}

export type LeadUpdateRequest = Partial<LeadCreateRequest>;

// Contact Types
export interface ContactFilters {
  type?: string;
  search?: string;
}

export interface ContactCreateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  type: string;
}

export type ContactUpdateRequest = Partial<ContactCreateRequest>;

// Deal Types
export interface DealCreateRequest {
  title: string;
  lead: string;
  property: string;
  value: number;
  stage?: string;
  probability?: number;
  expectedCloseDate: string;
}

export type DealUpdateRequest = Partial<DealCreateRequest>;

// Task Types
export interface TaskCreateRequest {
  title: string;
  description?: string;
  dueDate: string;
  priority: string;
  assignedTo: string;
}

export type TaskUpdateRequest = Partial<TaskCreateRequest>;

// Analytics Types
export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
}

// Search Types
export interface SearchQuery {
  query: string;
  type?: string;
  filters?: Record<string, any>;
}

export interface SearchResult {
  properties: IProperty[];
  leads: ILead[];
  contacts: IContact[];
}

// Bulk Operations
export interface BulkDeleteRequest {
  ids: string[];
}

export interface BulkUpdateRequest {
  ids: string[];
  updates: Record<string, any>;
}

// File Upload Types
export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}
