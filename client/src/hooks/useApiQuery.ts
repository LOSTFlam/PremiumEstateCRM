import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import { getApi, postApi, putApi, deleteApi, deleteManyApi, postApiBlob } from "services/api";
import type { AxiosResponse } from "axios";
import { ApiResponse, PaginatedResponse } from "types/api";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

interface UseApiQueryOptions<TData = unknown> extends Omit<
  UseQueryOptions<TData, Error, TData>,
  "queryKey" | "queryFn"
> {
  params?: Record<string, unknown>;
  useCache?: boolean;
}

interface UseApiMutationOptions<TData = unknown, TVariables = unknown> extends Omit<
  UseMutationOptions<TData, Error, TVariables>,
  "mutationFn"
> {
  showSuccessToast?: boolean;
  successMessage?: string;
  invalidateKeys?: string[][];
}

export const useApiQuery = <TData = unknown>(
  queryKey: string[],
  endpoint: string,
  options?: UseApiQueryOptions<TData>
) => {
  const { params, useCache, ...queryOptions } = options || {};
  return useQuery<TData, Error>({
    queryKey,
    queryFn: async () => {
      const response = (await getApi(endpoint, {
        ...(params || {}),
        useCache,
      })) as ApiResponse<TData>;
      return (response?.data || response) as TData;
    },
    ...queryOptions,
  });
};

export const useApiMutation = <TData = unknown, TVariables = unknown>(
  endpoint: string,
  method: "post" | "put" | "delete" = "post",
  options?: UseApiMutationOptions<TData, TVariables>
) => {
  const queryClient = useQueryClient();

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables: TVariables) => {
      let response: AxiosResponse | unknown;

      switch (method) {
        case "post":
          response = await postApi(endpoint, variables);
          break;
        case "put":
          response = await putApi(endpoint, variables);
          break;
        case "delete":
          response = await deleteApi(endpoint, String(variables));
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      return (response as { data?: TData })?.data || (response as TData);
    },
    onSuccess: (data, variables, context) => {
      if (options?.invalidateKeys) {
        options.invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
      if (options?.onSuccess) {
        (options.onSuccess as any)(data, variables, context);
      }
    },
  });
};

export const useApiPaginatedQuery = <TData = unknown>(
  queryKey: string[],
  endpoint: string,
  page: number,
  limit: number,
  filters?: Record<string, unknown>
) => {
  return useQuery<PaginatedResponse<TData>, Error>({
    queryKey: [...queryKey, page, limit, filters],
    queryFn: async () => {
      const response = (await getApi(endpoint, {
        page,
        limit,
        ...filters,
      })) as ApiResponse<PaginatedResponse<TData>>;
      return (response?.data || {
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
        success: true,
      }) as PaginatedResponse<TData>;
    },
    placeholderData: (previousData) => previousData,
  });
};

export const useApiBulkDelete = (
  endpoint: string,
  options?: UseApiMutationOptions<unknown, { ids: string[] }>
) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, { ids: string[] }>({
    mutationFn: async ({ ids }) => {
      return deleteManyApi(endpoint, { ids });
    },
    onSuccess: (data, variables, context) => {
      if (options?.invalidateKeys) {
        options.invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
      if (options?.onSuccess) {
        (options.onSuccess as any)(data, variables, context);
      }
    },
  });
};

export const useApiDownload = (endpoint: string, _filename: string) => {
  return useMutation({
    mutationFn: async () => {
      return postApiBlob(endpoint);
    },
  });
};

export { queryClient };

export default {
  useApiQuery,
  useApiMutation,
  useApiPaginatedQuery,
  useApiBulkDelete,
  useApiDownload,
  queryClient,
};
