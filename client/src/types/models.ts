// MongoDB Schema Types

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IProperty {
  _id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  type: "sale" | "rent" | "lease";
  category: "apartment" | "house" | "commercial" | "land";
  status: "available" | "sold" | "rented" | "reserved";
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    area: number;
    yearBuilt?: number;
    parking?: number;
    floor?: number;
    totalFloors?: number;
  };
  images: string[];
  videos?: string[];
  documents?: string[];
  agent: string | IUser;
  createdAt: string;
  updatedAt: string;
}

export interface ILead {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  status: "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "won" | "lost";
  source: "website" | "referral" | "social" | "advertising" | "other";
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo?: string | IUser;
  properties?: (string | IProperty)[];
  notes?: string;
  activities?: IActivity[];
  createdAt: string;
  updatedAt: string;
}

export interface IContact {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  type: "client" | "agent" | "owner" | "partner" | "vendor";
  tags?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IActivity {
  _id: string;
  type: "call" | "email" | "meeting" | "note" | "task";
  description: string;
  date: string;
  lead?: string | ILead;
  contact?: string | IContact;
  property?: string | IProperty;
  createdBy: string | IUser;
  createdAt: string;
  updatedAt: string;
}

export interface IDeal {
  _id: string;
  title: string;
  lead: string | ILead;
  property: string | IProperty;
  value: number;
  stage: "discovery" | "qualification" | "proposal" | "negotiation" | "closed";
  probability: number;
  expectedCloseDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITask {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in_progress" | "completed" | "cancelled";
  assignedTo: string | IUser;
  relatedTo?: {
    type: "lead" | "contact" | "property" | "deal";
    id: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IRole {
  _id: string;
  name: string;
  description?: string;
  permissions: string[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IAnalytics {
  totalProperties: number;
  totalLeads: number;
  totalDeals: number;
  totalRevenue: number;
  conversionRate: number;
  averageDealValue: number;
  propertiesByStatus: Record<string, number>;
  leadsBySource: Record<string, number>;
  dealsByStage: Record<string, number>;
  revenueByMonth: { month: string; revenue: number }[];
}
