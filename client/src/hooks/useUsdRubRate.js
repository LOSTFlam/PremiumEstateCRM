import { useQuery } from "@tanstack/react-query";
import { getApi } from "services/api";
import { getStoredUsdRubRate, storeUsdRubRate } from "utils/pricing";

export const useUsdRubRate = () =>
  useQuery({
    queryKey: ["usd-rub-rate"],
    queryFn: async () => {
      try {
        const response = await getApi("api/currency/usd-rub", {
          useCache: true,
          cacheKey: "api/currency/usd-rub",
        });
        const rateData = response?.data || response;

        if (rateData?.rate) {
          storeUsdRubRate(rateData);
          return rateData;
        }
      } catch (error) {
        const stored = getStoredUsdRubRate();
        if (stored?.rate) {
          return stored;
        }
        throw error;
      }

      return getStoredUsdRubRate();
    },
    initialData: getStoredUsdRubRate() || undefined,
    staleTime: 60 * 60 * 1000,
    refetchInterval: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
