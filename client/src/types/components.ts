// Component Props Types

import { ReactNode } from 'react';
import { IProperty, ILead, IContact, IUser } from './models';

// Layout Props
export interface LayoutProps {
  children: ReactNode;
  variant?: string;
}

// Card Props
export interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
  variant?: 'default' | 'stat' | 'property' | 'lead';
  onClick?: () => void;
}

// Modal Props
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

// Form Props
export interface FormProps<T = any> {
  initialValues: T;
  onSubmit: (values: T) => void;
  validationSchema?: any;
  children: ReactNode;
  isSubmitting?: boolean;
}

// Table Props
export interface TableProps {
  columns: any[];
  data: any[];
  isLoading?: boolean;
  onRowClick?: (row: any) => void;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}

// Property Card Props
export interface PropertyCardProps {
  property: IProperty;
  onSelect?: (property: IProperty) => void;
  variant?: 'grid' | 'list' | 'compact';
}

// Lead Card Props
export interface LeadCardProps {
  lead: ILead;
  onSelect?: (lead: ILead) => void;
  variant?: 'grid' | 'list' | 'kanban';
}

// Search Props
export interface SearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

// Filter Props
export interface FilterProps {
  filters: Record<string, any>;
  onFilterChange: (filters: Record<string, any>) => void;
  options: Record<string, { label: string; value: any }[]>;
}

// Chart Props
export interface ChartProps {
  data: any[];
  title?: string;
  type: 'line' | 'bar' | 'pie' | 'area';
  height?: number;
}

// Stat Props
export interface StatProps {
  label: string;
  value: number | string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

// Animation Props
export interface AnimationProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  easing?: string;
  trigger?: 'scroll' | 'hover' | 'always';
}

// SEO Props
export interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
}
