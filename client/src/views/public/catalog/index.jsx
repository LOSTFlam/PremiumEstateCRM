import PublicCatalogShell from "./PublicCatalogShell";

export default function PublicCatalog({ forcedType = null }) {
  return <PublicCatalogShell forcedType={forcedType} />;
}
