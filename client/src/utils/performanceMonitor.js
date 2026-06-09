/**
 * Performance monitoring utilities
 * Tracks page load times, component render times, and user interactions
 */

import React from "react";

class PerformanceMonitor {
  constructor() {
    this.metrics = [];
    this.enabled = process.env.NODE_ENV === "production";
  }

  // Measure page load performance
  measurePageLoad() {
    if (!this.enabled || typeof window === "undefined") return;

    window.addEventListener("load", () => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      const connectTime = perfData.responseEnd - perfData.requestStart;
      const renderTime = perfData.domComplete - perfData.domLoading;

      this.logMetric("page_load", {
        pageLoadTime,
        connectTime,
        renderTime,
        url: window.location.href,
      });
    });
  }

  // Measure component render time
  measureRender(componentName, startTime) {
    if (!this.enabled) return;

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    if (renderTime > 16) {
      // Log slow renders (> 16ms = 60fps threshold)
      this.logMetric("slow_render", {
        component: componentName,
        renderTime: Math.round(renderTime),
      });
    }
  }

  // Measure API call performance
  measureApiCall(endpoint, startTime, success = true) {
    if (!this.enabled) return;

    const endTime = performance.now();
    const duration = endTime - startTime;

    this.logMetric("api_call", {
      endpoint,
      duration: Math.round(duration),
      success,
      timestamp: new Date().toISOString(),
    });
  }

  // Measure user interaction
  measureInteraction(action, metadata = {}) {
    if (!this.enabled) return;

    this.logMetric("user_interaction", {
      action,
      ...metadata,
      timestamp: new Date().toISOString(),
    });
  }

  // Log metric
  logMetric(type, data) {
    const metric = {
      type,
      data,
      timestamp: Date.now(),
    };

    this.metrics.push(metric);

    // Send to analytics service
    this.sendToAnalytics(metric);

    // Keep only last 100 metrics in memory
    if (this.metrics.length > 100) {
      this.metrics.shift();
    }
  }

  // Send metrics to analytics service
  sendToAnalytics(metric) {
    // TODO: Integrate with analytics service (Google Analytics, Mixpanel, etc.)

    // For now, send to backend
    try {
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metric),
        keepalive: true,
      }).catch(() => {
        // Silently fail
      });
    } catch {
      // Ignore errors
    }
  }

  // Get Core Web Vitals
  getCoreWebVitals() {
    if (typeof window === "undefined") return;

    // Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.logMetric("core_web_vitals", {
        metric: "LCP",
        value: lastEntry.renderTime || lastEntry.loadTime,
      });
    }).observe({ entryTypes: ["largest-contentful-paint"] });

    // First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        this.logMetric("core_web_vitals", {
          metric: "FID",
          value: entry.processingStart - entry.startTime,
        });
      });
    }).observe({ entryTypes: ["first-input"] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      this.logMetric("core_web_vitals", {
        metric: "CLS",
        value: clsValue,
      });
    }).observe({ entryTypes: ["layout-shift"] });
  }

  // Get all metrics
  getMetrics() {
    return this.metrics;
  }

  // Clear metrics
  clearMetrics() {
    this.metrics = [];
  }

  // Enable/disable monitoring
  setEnabled(enabled) {
    this.enabled = enabled;
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export const usePerformanceMonitor = (componentName) => {
  const startTime = performance.now();

  React.useEffect(() => {
    return () => {
      performanceMonitor.measureRender(componentName, startTime);
    };
  }, [componentName, startTime]);
};

// HOC for performance monitoring
export const withPerformanceMonitor = (Component, componentName) => {
  const WrappedComponent = (props) => {
    usePerformanceMonitor(componentName || Component.displayName || Component.name);
    return <Component {...props} />;
  };
  WrappedComponent.displayName = `withPerformanceMonitor(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

export default performanceMonitor;
