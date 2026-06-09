// Utility Function Types

// Form Validation Types
export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  email?: boolean;
  phone?: boolean;
  custom?: (_value: any) => boolean | string;
}

export interface FormFieldConfig {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "select"
    | "textarea"
    | "date"
    | "file"
    | "checkbox"
    | "radio";
  placeholder?: string;
  validation?: ValidationRule;
  options?: { label: string; value: any }[];
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
}

// API Helper Types
export interface ApiConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface ApiRequestConfig {
  params?: Record<string, any>;
  data?: any;
  headers?: Record<string, string>;
}

// Animation Helper Types
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: string;
  iterations?: number;
}

export interface ScrollAnimationConfig {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

// Storage Helper Types
export interface StorageConfig {
  prefix?: string;
  expiration?: number;
}

// Date Helper Types
export type DateFormat = "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD" | "DD.MM.YYYY" | "relative";

// Currency Helper Types
export interface CurrencyConfig {
  symbol: string;
  code: string;
  decimals: number;
  locale: string;
}

// Pagination Helper Types
export interface PaginationConfig {
  page: number;
  limit: number;
  total: number;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Sort Helper Types
export interface SortConfig {
  field: string;
  order: "asc" | "desc";
}

// Filter Helper Types
export interface FilterOption {
  label: string;
  value: any;
}

export interface FilterConfig {
  field: string;
  label: string;
  type: "select" | "multiselect" | "range" | "text" | "date";
  options?: FilterOption[];
}

// Theme Helper Types
export type ThemeMode = "light" | "dark";

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor?: string;
  fontFamily?: string;
}

// Error Helper Types
export interface AppError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

// Notification Types
export interface NotificationConfig {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number;
}
