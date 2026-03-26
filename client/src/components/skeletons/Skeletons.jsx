import { Box, Skeleton, SkeletonText, Stack } from "@chakra-ui/react";

/**
 * Loading skeleton for property cards
 */
export const PropertyCardSkeleton = () => {
  return (
    <Box
      borderRadius="24px"
      overflow="hidden"
      boxShadow="sm"
      borderWidth="1px"
    >
      <Skeleton height="280px" />
      <Box p={6}>
        <Stack spacing={4}>
          <Skeleton height="24px" width="80%" />
          <Skeleton height="16px" width="60%" />
          <Skeleton height="16px" width="40%" />
          <Skeleton height="40px" width="100%" />
        </Stack>
      </Box>
    </Box>
  );
};

/**
 * Loading skeleton for table rows
 */
export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <Stack spacing={4}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} height="60px" borderRadius="8px" />
      ))}
    </Stack>
  );
};

/**
 * Loading skeleton for dashboard stats
 */
export const StatSkeleton = () => {
  return (
    <Box p={4}>
      <Skeleton height="16px" width="100px" mb={2} />
      <Skeleton height="32px" width="150px" />
    </Box>
  );
};

/**
 * Loading skeleton for form fields
 */
export const FormSkeleton = ({ fields = 5 }) => {
  return (
    <Stack spacing={4}>
      {Array.from({ length: fields }).map((_, i) => (
        <Stack key={i} spacing={2}>
          <Skeleton height="12px" width="100px" />
          <Skeleton height="40px" />
        </Stack>
      ))}
    </Stack>
  );
};

export default {
  PropertyCardSkeleton,
  TableSkeleton,
  StatSkeleton,
  FormSkeleton,
};
