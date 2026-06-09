import { Stack, Skeleton, Box } from "@chakra-ui/react";

export const KanbanColumnSkeleton = () => (
  <Box minW="280px" flex="1">
    <Skeleton height="32px" mb={4} borderRadius="md" />
    <Stack spacing={3}>
      <Skeleton height="120px" borderRadius="xl" />
      <Skeleton height="120px" borderRadius="xl" />
      <Skeleton height="120px" borderRadius="xl" />
    </Stack>
  </Box>
);

export const KanbanBoardSkeleton = () => (
  <Stack direction="row" spacing={4} overflowX="auto" p={4}>
    <KanbanColumnSkeleton />
    <KanbanColumnSkeleton />
    <KanbanColumnSkeleton />
    <KanbanColumnSkeleton />
  </Stack>
);

export const DashboardStatSkeleton = () => (
  <Box p={6} borderRadius="2xl" boxShadow="sm" borderWidth="1px">
    <Skeleton height="14px" width="120px" mb={3} />
    <Skeleton height="36px" width="180px" mb={2} />
    <Skeleton height="12px" width="80px" />
  </Box>
);

export const DashboardGridSkeleton = () => (
  <Stack spacing={6} p={6}>
    <Stack direction="row" spacing={4}>
      <DashboardStatSkeleton />
      <DashboardStatSkeleton />
      <DashboardStatSkeleton />
      <DashboardStatSkeleton />
    </Stack>
    <Skeleton height="300px" borderRadius="2xl" />
    <Stack direction="row" spacing={4}>
      <Skeleton height="200px" flex="1" borderRadius="2xl" />
      <Skeleton height="200px" flex="1" borderRadius="2xl" />
    </Stack>
  </Stack>
);

export const LeadCardSkeleton = () => (
  <Box p={4} borderRadius="xl" borderWidth="1px" boxShadow="sm">
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Skeleton height="20px" width="150px" />
        <Skeleton height="24px" width="60px" borderRadius="full" />
      </Stack>
      <Skeleton height="14px" width="100px" />
      <Skeleton height="14px" width="120px" />
      <Stack direction="row" spacing={2}>
        <Skeleton height="28px" width="60px" borderRadius="md" />
        <Skeleton height="28px" width="60px" borderRadius="md" />
      </Stack>
    </Stack>
  </Box>
);

export const PropertyDetailSkeleton = () => (
  <Stack spacing={8} p={6}>
    <Skeleton height="400px" borderRadius="2xl" />
    <Stack direction="row" spacing={8}>
      <Box flex="2">
        <Skeleton height="32px" width="60%" mb={4} />
        <Skeleton height="16px" width="100%" mb={2} />
        <Skeleton height="16px" width="80%" mb={2} />
        <Skeleton height="16px" width="90%" mb={6} />
        <Stack direction="row" spacing={4} mb={6}>
          <Skeleton height="40px" width="100px" borderRadius="full" />
          <Skeleton height="40px" width="100px" borderRadius="full" />
          <Skeleton height="40px" width="100px" borderRadius="full" />
        </Stack>
      </Box>
      <Box flex="1">
        <Skeleton height="200px" borderRadius="xl" mb={4} />
        <Skeleton height="48px" borderRadius="xl" />
      </Box>
    </Stack>
  </Stack>
);

export const TableHeaderSkeleton = () => (
  <Stack direction="row" spacing={4} p={4} borderBottom="1px" borderColor="gray.200">
    <Skeleton height="16px" width="200px" />
    <Skeleton height="16px" width="120px" />
    <Skeleton height="16px" width="100px" />
    <Skeleton height="16px" width="80px" />
    <Skeleton height="16px" width="100px" />
  </Stack>
);

export const TableRowSkeleton = () => (
  <Stack direction="row" spacing={4} p={4} _hover={{ bg: "gray.50" }}>
    <Skeleton height="40px" width="40px" borderRadius="full" />
    <Stack flex="1" spacing={2}>
      <Skeleton height="16px" width="150px" />
      <Skeleton height="12px" width="100px" />
    </Stack>
    <Skeleton height="24px" width="80px" borderRadius="full" />
    <Skeleton height="32px" width="80px" borderRadius="md" />
  </Stack>
);

export const TableSkeleton = ({ rows = 5 } = {}) => (
  <Box>
    <TableHeaderSkeleton />
    {Array.from({ length: rows }).map((_, i) => (
      <TableRowSkeleton key={i} />
    ))}
  </Box>
);

export const PropertyCardSkeleton = () => (
  <Box borderRadius="24px" overflow="hidden" boxShadow="sm" borderWidth="1px">
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

export const FormSkeleton = ({ fields = 5 } = {}) => (
  <Stack spacing={4}>
    {Array.from({ length: fields }).map((_, i) => (
      <Stack key={i} spacing={2}>
        <Skeleton height="12px" width="100px" />
        <Skeleton height="40px" />
      </Stack>
    ))}
  </Stack>
);

export const StatSkeleton = () => (
  <Box p={4}>
    <Skeleton height="16px" width="100px" mb={2} />
    <Skeleton height="32px" width="150px" />
  </Box>
);

export default {
  KanbanColumnSkeleton,
  KanbanBoardSkeleton,
  DashboardStatSkeleton,
  DashboardGridSkeleton,
  LeadCardSkeleton,
  PropertyDetailSkeleton,
  TableHeaderSkeleton,
  TableRowSkeleton,
  TableSkeleton,
  PropertyCardSkeleton,
  FormSkeleton,
  StatSkeleton,
};
