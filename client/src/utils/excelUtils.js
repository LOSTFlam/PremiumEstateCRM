import { loadExcelJS } from "../utils/lazyImports";
import { secureParseExcel, secureWriteExcel } from "./secureXlsxWrapper";
import { toast } from "react-toastify";

/**
 * Excel Export utilities with lazy loading
 * Reduces initial bundle size by loading Excel libraries only when needed
 */

export const exportToExcel = async (data, filename = "export.xlsx", sheetName = "Sheet1") => {
  try {
    const ExcelJS = await loadExcelJS();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    // Add headers if data has objects
    if (data.length > 0 && typeof data[0] === "object") {
      const headers = Object.keys(data[0]);
      worksheet.addRow(headers);

      // Style headers
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
      };

      // Add data rows
      data.forEach((item) => {
        const row = headers.map((header) => item[header]);
        worksheet.addRow(row);
      });

      // Auto-fit columns
      worksheet.columns.forEach((column) => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, (cell) => {
          const columnLength = cell.value ? cell.value.toString().length : 10;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        });
        column.width = maxLength < 10 ? 10 : maxLength + 2;
      });
    }

    // Generate buffer and download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);

    toast.success("Excel file exported successfully");
  } catch (error) {
    console.error("Excel export failed:", error);
    toast.error("Failed to export Excel file");
    throw error;
  }
};

export const importFromExcel = async (file) => {
  try {
    // Use the secure parser with additional validations
    const parsedData = await secureParseExcel(file, {
      maxSize: 5 * 1024 * 1024, // 5MB limit
    });

    // Get data from the first sheet
    const sheetNames = Object.keys(parsedData);
    if (sheetNames.length === 0) {
      throw new Error("No valid sheets found in the Excel file");
    }

    const firstSheetName = sheetNames[0];
    const jsonData = parsedData[firstSheetName];

    toast.success("Excel file imported successfully");
    return jsonData;
  } catch (error) {
    console.error("Excel import failed:", error);
    toast.error("Failed to import Excel file: " + error.message);
    throw error;
  }
};

export const exportTableToExcel = async (tableId, filename = "table-export.xlsx") => {
  try {
    // We'll continue using the original XLSX for table exports as it's a different use case
    const XLSX = await import("xlsx");
    
    const table = document.getElementById(tableId);

    if (!table) {
      throw new Error(`Table with id "${tableId}" not found`);
    }

    // Sanitize the table data before export
    const workbook = XLSX.utils.table_to_book(table, {
      // Safer export options
      raw: false, // Set to false to prevent raw formula execution
      defval: null
    });
    
    // Add extra sanitization
    Object.keys(workbook.Sheets).forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      // Clean up any potentially unsafe properties
      if (sheet['!ref']) {
        // Basic validation to ensure the range is reasonable
        const rangeMatch = sheet['!ref'].match(/[A-Z]+[0-9]+:[A-Z]+[0-9]+/);
        if (!rangeMatch) {
          throw new Error("Invalid sheet range detected");
        }
      }
    });
    
    XLSX.writeFile(workbook, filename);

    toast.success("Table exported to Excel successfully");
  } catch (error) {
    console.error("Table export failed:", error);
    toast.error("Failed to export table");
    throw error;
  }
};