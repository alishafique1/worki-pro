import { useEffect } from 'react';

interface PageSeoProps {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalPath?: string;
}

/**
 * PageSeo — lightweight per-page SEO helper (no extra dependencies).
 *
 * Sets <title>, <meta name="description">, OG tags, and a canonical
 * <link> by directly mutating document.head elements. Previous values
 * injected by this component are restored on unmount so navigating back
 * to the home page doesn't leave stale tags in place.
 */
export default function PageSeo({
  title,
  description,
  ogTitle,
  ogDescription,
  canonicalPath,
}: PageSeoProps) {
  const resolvedOgTitle = ogTitle ?? title;
  const resolvedOgDescription = ogDescription ?? description;

  useEffect(() => {
    // ── <title> ──────────────────────────────────────────────────────────────
    const prevTitle = document.title;
    document.title = title;

    // ── Helper: upsert a <meta> by selector ─────────────────────────────────
    function upsertMeta(selector: string, attr: string, value: string): () => void {
      let el = document.querySelector<HTMLMetaElement>(selector);
      let created = false;
      let prevContent: string | null = null;

      if (!el) {
        el = document.createElement('meta');
        // Set the identifying attribute from the selector (e.g. name="description")
        const match = selector.match(/\[([^=\]]+)=['"]([^'"]+)['"]\]/);
        if (match) el.setAttribute(match[1], match[2]);
        document.head.appendChild(el);
        created = true;
      } else {
        prevContent = el.getAttribute(attr);
      }

      el.setAttribute(attr, value);

      return () => {
        if (created) {
          el?.parentNode?.removeChild(el);
        } else if (el && prevContent !== null) {
          el.setAttribute(attr, prevContent);
        }
      };
    }

    // ── Helper: upsert a <link rel="canonical"> ──────────────────────────────
    function upsertCanonical(path: string): () => void {
      let el = document.querySelector<HTMLLinkElement>("link[rel='canonical']");
      let created = false;
      let prevHref: string | null = null;

      const href = `https://thehelper.ca${path}`;

      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', 'canonical');
        document.head.appendChild(el);
        created = true;
      } else {
        prevHref = el.getAttribute('href');
      }

      el.setAttribute('href', href);

      return () => {
        if (created) {
          el?.parentNode?.removeChild(el);
        } else if (el && prevHref !== null) {
          el.setAttribute('href', prevHref);
        }
      };
    }

    // ── Apply all tags ────────────────────────────────────────────────────────
    const cleanups: Array<() => void> = [];

    cleanups.push(
      upsertMeta("[name='description']", 'content', description),
      upsertMeta("[property='og:title']", 'content', resolvedOgTitle),
      upsertMeta("[property='og:description']", 'content', resolvedOgDescription),
    );

    if (canonicalPath) {
      cleanups.push(upsertCanonical(canonicalPath));
    }

    return () => {
      document.title = prevTitle;
      cleanups.forEach((fn) => fn());
    };
  }, [title, description, resolvedOgTitle, resolvedOgDescription, canonicalPath]);

  // Renders nothing — side-effect only
  return null;
}
