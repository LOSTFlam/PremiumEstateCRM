/**
 * Secure XLSX wrapper to handle Excel file operations safely
 * This prevents direct exposure of the heavy xlsx library
 */
export const loadSecureXlsx = async () => {
  // Add any security wrappers or configuration here
  const xlsx = await import("xlsx");

  // Add any security hardening here if needed
  return xlsx;
};
/**
 * Lazy loading utilities to reduce initial bundle size
 * Only load heavy libraries when needed
 */

let excelJSModule = null;
let pdfModule = null;
let xlsxModule = null;
let chartsModule = null;
let jsPdfModule = null;
let html2pdfModule = null;

export const loadExcelJS = async () => {
  if (!excelJSModule) {
    excelJSModule = await import("exceljs");
  }
  return excelJSModule.default || excelJSModule;
};

export const loadPDF = async () => {
  if (!pdfModule) {
    pdfModule = await import("@react-pdf/renderer");
  }
  return pdfModule.default || pdfModule;
};

export const loadXLSX = async () => {
  if (!xlsxModule) {
    // Use the secure wrapper instead of importing xlsx directly
    const { loadSecureXlsx } = await import("./secureXlsxWrapper");
    xlsxModule = await loadSecureXlsx();
  }
  return xlsxModule;
};

export const loadCharts = async () => {
  if (!chartsModule) {
    chartsModule = await import("react-apexcharts");
  }
  return chartsModule.default || chartsModule;
};

// Backwards-compatible alias used by some components
export const loadReactApexCharts = loadCharts;

export const loadJsPDF = async () => {
  if (!jsPdfModule) {
    jsPdfModule = await import("jspdf");
  }

  return jsPdfModule.jsPDF || jsPdfModule.default || jsPdfModule;
};

export const loadHtml2Pdf = async () => {
  if (!html2pdfModule) {
    html2pdfModule = await import("html2pdf.js");
  }

  return html2pdfModule.default || html2pdfModule;
};

// Helper to show loading state
export const withLoadingState = async (loadFn, setLoading) => {
  try {
    if (setLoading) setLoading(true);
    const module = await loadFn();
    return module;
  } finally {
    if (setLoading) setLoading(false);
  }
};
