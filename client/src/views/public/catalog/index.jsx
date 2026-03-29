import PublicCatalogShell from "./PublicCatalogShell";

export default function PublicCatalog({ forcedType = null }) {
  return <PublicCatalogShell mode="catalog" forcedType={forcedType} />;
}
