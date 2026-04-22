import { loadJsPDF, loadHtml2Pdf } from "../utils/lazyImports";
import { toast } from "react-toastify";

/**
 * PDF Export utilities with lazy loading
 * Reduces initial bundle size by loading PDF libraries only when needed
 */

export const exportToPDF = async (element, filename = "document.pdf", options = {}) => {
  try {
    const html2pdf = await loadHtml2Pdf();

    const defaultOptions = {
      margin: 10,
      filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      ...options,
    };

    await html2pdf().set(defaultOptions).from(element).save();
    toast.success("PDF exported successfully");
  } catch (error) {
    console.error("PDF export failed:", error);
    toast.error("Failed to export PDF");
    throw error;
  }
};

export const generatePDFFromHTML = async (htmlContent, filename = "document.pdf") => {
  try {
    const jsPDF = await loadJsPDF();
    const doc = new jsPDF();

    doc.html(htmlContent, {
      callback: (doc) => {
        doc.save(filename);
        toast.success("PDF generated successfully");
      },
      x: 10,
      y: 10,
    });
  } catch (error) {
    console.error("PDF generation failed:", error);
    toast.error("Failed to generate PDF");
    throw error;
  }
};

export const createSimplePDF = async (content, filename = "document.pdf") => {
  try {
    const jsPDF = await loadJsPDF();
    const doc = new jsPDF();

    doc.text(content, 10, 10);
    doc.save(filename);
    toast.success("PDF created successfully");
  } catch (error) {
    console.error("PDF creation failed:", error);
    toast.error("Failed to create PDF");
    throw error;
  }
};
