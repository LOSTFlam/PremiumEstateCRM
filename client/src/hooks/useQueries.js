import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApi, postApi, putApi, deleteApi } from 'services/api';

/**
 * Hook for fetching properties
 */
export const useProperties = (filters = {}) => {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      const response = await getApi('api/property/public');
      return Array.isArray(response) ? response : response?.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for fetching a single property by ID
 */
export const useProperty = (id) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const response = await getApi(`api/property/public/${id}`);
      return response?.data || response;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook for creating a property
 */
export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      const response = await postApi('api/property/add', data, false, true);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['properties']);
    },
  });
};

/**
 * Hook for updating a property
 */
export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await putApi(`api/property/edit/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['properties']);
      queryClient.invalidateQueries(['property']);
    },
  });
};

/**
 * Hook for deleting a property
 */
export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      await deleteApi('api/property/delete/', id);
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries(['properties']);
      queryClient.removeQueries(['property', deletedId]);
    },
  });
};

/**
 * Hook for fetching users
 */
export const useUsers = (filters = {}) => {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: async () => {
      const response = await getApi('api/user/');
      return response?.user || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for fetching leads
 */
export const useLeads = (filters = {}) => {
  return useQuery({
    queryKey: ['leads', filters],
    queryFn: async () => {
      const response = await getApi('api/lead/');
      return Array.isArray(response) ? response : response?.data || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook for fetching contacts
 */
export const useContacts = (filters = {}) => {
  return useQuery({
    queryKey: ['contacts', filters],
    queryFn: async () => {
      const response = await getApi('api/contact/');
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
