import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApi, postApi, putApi, deleteApi } from "services/api";
import { IProperty, ILead, IContact, IUser } from "types/models";

interface PropertyFilters {
  type?: string;
  category?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  [key: string]: unknown;
}

export const useProperties = (filters: PropertyFilters = {}) => {
  return useQuery<IProperty[]>({
    queryKey: ["properties", filters],
    queryFn: async () => {
      const response = (await getApi("api/property/public")) as
        | { data?: IProperty[] }
        | IProperty[];
      return Array.isArray(response) ? response : response?.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useProperty = (id: string | undefined) => {
  return useQuery<IProperty | null>({
    queryKey: ["property", id],
    queryFn: async () => {
      const response = (await getApi(`api/property/public/${id}`)) as
        | { data?: IProperty }
        | IProperty;
      return (response as { data?: IProperty })?.data || (response as IProperty) || null;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await postApi("api/property/add", data, false, true);
      return (response as { data?: unknown })?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      const response = await putApi(`api/property/edit/${id}`, data);
      return (response as { data?: unknown })?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["property"] });
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteApi("api/property/delete/", id);
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.removeQueries({ queryKey: ["property", deletedId] });
    },
  });
};

export const useUsers = (filters: Record<string, unknown> = {}) => {
  return useQuery<IUser[]>({
    queryKey: ["users", filters],
    queryFn: async () => {
      const response = (await getApi("api/user/")) as { user?: IUser[] } | IUser[];
      return (response as { user?: IUser[] })?.user || [];
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useLeads = (filters: Record<string, unknown> = {}) => {
  return useQuery<ILead[]>({
    queryKey: ["leads", filters],
    queryFn: async () => {
      const response = (await getApi("api/lead/")) as { data?: ILead[] } | ILead[];
      return Array.isArray(response) ? response : response?.data || [];
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useContacts = (filters: Record<string, unknown> = {}) => {
  return useQuery<IContact[]>({
    queryKey: ["contacts", filters],
    queryFn: async () => {
      const response = (await getApi("api/contact/")) as { data?: IContact[] } | IContact[];
      return Array.isArray(response) ? response : response?.data || [];
    },
    staleTime: 2 * 60 * 1000,
  });
};

export default {
  useProperties,
  useProperty,
  useCreateProperty,
  useUpdateProperty,
  useDeleteProperty,
  useUsers,
  useLeads,
  useContacts,
};
