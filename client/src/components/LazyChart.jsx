import React, { useState, useEffect, Suspense as _Suspense } from "react";
import { Spinner, Center, Box } from "@chakra-ui/react";
import { loadReactApexCharts } from "../utils/lazyImports";

/**
 * Lazy-loaded chart component wrapper
 * Reduces initial bundle size by loading ApexCharts only when needed
 */
const LazyChart = ({ options, series, type = "line", height = 350, ...props }) => {
  const [ChartComponent, setChartComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadChart = async () => {
      try {
        setLoading(true);
        const Chart = await loadReactApexCharts();
        if (mounted) {
          setChartComponent(() => Chart);
        }
      } catch (err) {
        if (mounted) {
          setError(err);
          console.error("Failed to load chart library:", err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadChart();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <Center h={height}>
        <Spinner size="lg" color="blue.500" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h={height}>
        <Box color="red.500">Failed to load chart</Box>
      </Center>
    );
  }

  if (!ChartComponent) {
    return null;
  }

  return (
    <ChartComponent options={options} series={series} type={type} height={height} {...props} />
  );
};

export default LazyChart;
