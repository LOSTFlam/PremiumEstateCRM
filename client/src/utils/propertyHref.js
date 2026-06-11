export const resolvePropertySlug = (property) =>
  property?.publicSlugResolved ||
  property?.publicSlug ||
  property?.seo?.slug ||
  property?.seoSlug ||
  "";

export const buildPropertyHref = (property) => {
  const slug = resolvePropertySlug(property);
  const id = property?._id;
  if (slug) return `/property/${slug}`;
  if (id) return `/offers/${id}`;
  return "#";
};

export const buildPropertyShareUrl = (property) => {
  if (typeof window === "undefined") return buildPropertyHref(property);
  return `${window.location.origin}${buildPropertyHref(property)}`;
};
