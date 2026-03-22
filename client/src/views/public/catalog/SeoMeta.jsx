import { useEffect } from "react";

const upsertMeta = (attribute, key, content) => {
  if (typeof document === "undefined" || !content) return;

  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
};

export default function SeoMeta({ title, description, keywords, canonicalPath = "", image = "" }) {
  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    if (title) document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("name", "keywords", keywords);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", "website");
    if (image) upsertMeta("property", "og:image", image);

    if (canonicalPath) {
      const canonicalUrl = `${window.location.origin}${canonicalPath}`;
      let link = document.head.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonicalUrl);
      upsertMeta("property", "og:url", canonicalUrl);
    }

    return undefined;
  }, [canonicalPath, description, image, keywords, title]);

  return null;
}
