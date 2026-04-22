import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const commonUtils = {
  convertJsonToCsvOrExcel: async ({ jsonArray, csvColumns, fileName, extension }) => {
    const csvHeader = csvColumns?.length > 0 && csvColumns?.map((col) => col?.Header);

    if (extension === "csv") {
      // CSV export using simple format
      const csvContent = [
        csvHeader,
        ...(jsonArray || []).map(
          (row) =>
            csvColumns?.length > 0 &&
            csvColumns?.map((col) => {
              const cell = row[col?.accessor];
              // Escape quotes and wrap in quotes if contains comma
              if (typeof cell === "string" && cell.includes(",")) {
                return `"${cell.replace(/"/g, '""')}"`;
              }
              return cell ?? "";
            })
        ),
      ];

      const csv = csvContent.map((row) => row.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, `${fileName}.${extension}`);
    } else if (extension === "xlsx") {
      // Excel export using exceljs
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sheet 1");

      // Add headers
      worksheet.addRow(csvHeader);

      // Add data rows
      jsonArray?.forEach((row) => {
        const rowData = csvColumns?.length > 0 && csvColumns?.map((col) => row[col?.accessor]);
        worksheet.addRow(rowData);
      });

      // Auto-fit columns
      csvColumns?.forEach((col, index) => {
        worksheet.getColumn(index + 1).width = 15;
      });

      // Generate and download Excel file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `${fileName}.${extension}`);
    }
  },
};
