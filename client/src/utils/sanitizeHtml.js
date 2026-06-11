import DOMPurify from "dompurify";

/**
 * Sanitize HTML before dangerouslySetInnerHTML to mitigate stored XSS.
 */
export function sanitizeHtml(html) {
  if (!html || typeof html !== "string") return "";
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
  });
}
