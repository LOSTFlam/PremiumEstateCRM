import jsPDF from "jspdf";
import "jspdf-autotable";
import { formatPrice } from "views/public/catalog/catalogData";

export const buildSavedSearchPath = (search) => {
  const pathname = search?.pathname || "/offers";
  const query = search?.search ? `?${search.search}` : "";
  return `${pathname}${query}`;
};

export const exportFavoritesPdf = ({ properties, t, locale, toast }) => {
  if (!properties?.length) return;

  const doc = new jsPDF();
  const isRu = locale?.startsWith("ru");

  doc.setFontSize(20);
  doc.setTextColor(34, 120, 80);
  doc.text(t("cabinet.export.pdfTitle"), 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(
    `${t("cabinet.export.generatedOn")}: ${new Date().toLocaleDateString(isRu ? "ru-RU" : "en-US")}`,
    14,
    28
  );

  const tableData = properties.map((property, index) => [
    index + 1,
    property.name || property.propertyAddress || t("cabinet.export.propertyFallback"),
    formatPrice(property.listingPrice, t, locale) || t("cabinet.export.onRequest"),
    `${property.squareFootage || "—"} m²`,
    `${property.numberofBedrooms || "—"}`,
    `${property.numberofBathrooms || "—"}`,
  ]);

  doc.autoTable({
    startY: 35,
    head: [
      [
        "#",
        t("cabinet.export.colName"),
        t("cabinet.export.colPrice"),
        t("cabinet.export.colArea"),
        t("cabinet.export.colBedrooms"),
        t("cabinet.export.colBathrooms"),
      ],
    ],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [34, 120, 80] },
  });

  doc.save(`favorites-${Date.now()}.pdf`);

  toast?.({
    title: t("cabinet.export.pdfDone"),
    status: "success",
    duration: 3000,
  });
};

export const shareFavorites = async ({ count, t, toast }) => {
  const url = `${window.location.origin}/favorites`;
  const shareData = {
    title: t("cabinet.export.shareTitle"),
    text: t("cabinet.export.shareText", { count }),
    url,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }
    await navigator.clipboard.writeText(url);
    toast?.({
      title: t("cabinet.export.linkCopied"),
      status: "success",
      duration: 2000,
    });
  } catch {
    // user cancelled share
  }
};
