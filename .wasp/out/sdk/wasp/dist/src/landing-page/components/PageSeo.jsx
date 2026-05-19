import { useEffect } from 'react';
const SITE_URL = 'https://thehelper.ca';
const DEFAULT_OG_IMAGE = 'https://thehelper.ca/og-banner.webp';
/**
 * PageSeo — lightweight per-page SEO helper (no extra dependencies).
 *
 * Sets <title>, <meta name="description">, OG tags, Twitter cards, canonical
 * <link>, and JSON-LD structured data by directly mutating document.head elements.
 * Previous values injected by this component are restored on unmount so navigating
 * back to the home page doesn't leave stale tags in place.
 */
export default function PageSeo({ title, description, ogTitle, ogDescription, ogImage, ogType = 'website', canonicalPath, structuredData, keywords, }) {
    const resolvedOgTitle = ogTitle ?? title;
    const resolvedOgDescription = ogDescription ?? description;
    const resolvedOgImage = ogImage ?? DEFAULT_OG_IMAGE;
    useEffect(() => {
        // ── <title> ──────────────────────────────────────────────────────────────
        const prevTitle = document.title;
        document.title = title;
        // ── Helper: upsert a <meta> by selector ─────────────────────────────────
        function upsertMeta(selector, attr, value) {
            let el = document.querySelector(selector);
            let created = false;
            let prevContent = null;
            if (!el) {
                el = document.createElement('meta');
                // Set the identifying attribute from the selector (e.g. name="description")
                const match = selector.match(/\[([^=\]]+)=['"]([^'"]+)['"]\]/);
                if (match)
                    el.setAttribute(match[1], match[2]);
                document.head.appendChild(el);
                created = true;
            }
            else {
                prevContent = el.getAttribute(attr);
            }
            el.setAttribute(attr, value);
            return () => {
                if (created) {
                    el?.parentNode?.removeChild(el);
                }
                else if (el && prevContent !== null) {
                    el.setAttribute(attr, prevContent);
                }
            };
        }
        // ── Helper: upsert a <link rel="canonical"> ──────────────────────────────
        function upsertCanonical(path) {
            let el = document.querySelector("link[rel='canonical']");
            let created = false;
            let prevHref = null;
            const href = `${SITE_URL}${path}`;
            if (!el) {
                el = document.createElement('link');
                el.setAttribute('rel', 'canonical');
                document.head.appendChild(el);
                created = true;
            }
            else {
                prevHref = el.getAttribute('href');
            }
            el.setAttribute('href', href);
            return () => {
                if (created) {
                    el?.parentNode?.removeChild(el);
                }
                else if (el && prevHref !== null) {
                    el.setAttribute('href', prevHref);
                }
            };
        }
        // ── Helper: upsert JSON-LD structured data ───────────────────────────────
        function upsertStructuredData(data) {
            const existingScript = document.querySelector("script[data-seo-page='true']");
            if (existingScript) {
                existingScript.parentNode?.removeChild(existingScript);
            }
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.setAttribute('data-seo-page', 'true');
            script.textContent = JSON.stringify(data);
            document.head.appendChild(script);
            return () => {
                script.parentNode?.removeChild(script);
            };
        }
        // ── Apply all tags ────────────────────────────────────────────────────────
        const cleanups = [];
        // Standard meta tags
        cleanups.push(upsertMeta("[name='description']", 'content', description));
        // Keywords (if provided)
        if (keywords) {
            cleanups.push(upsertMeta("[name='keywords']", 'content', keywords));
        }
        // Open Graph tags
        cleanups.push(upsertMeta("[property='og:title']", 'content', resolvedOgTitle), upsertMeta("[property='og:description']", 'content', resolvedOgDescription), upsertMeta("[property='og:image']", 'content', resolvedOgImage), upsertMeta("[property='og:type']", 'content', ogType));
        // Add og:url if canonical path is provided
        if (canonicalPath) {
            cleanups.push(upsertMeta("[property='og:url']", 'content', `${SITE_URL}${canonicalPath}`));
        }
        // Twitter Card tags
        cleanups.push(upsertMeta("[name='twitter:card']", 'content', 'summary_large_image'), upsertMeta("[name='twitter:title']", 'content', resolvedOgTitle), upsertMeta("[name='twitter:description']", 'content', resolvedOgDescription), upsertMeta("[name='twitter:image']", 'content', resolvedOgImage));
        // Canonical URL
        if (canonicalPath) {
            cleanups.push(upsertCanonical(canonicalPath));
        }
        // Structured data (JSON-LD)
        if (structuredData) {
            cleanups.push(upsertStructuredData(structuredData));
        }
        return () => {
            document.title = prevTitle;
            cleanups.forEach((fn) => fn());
        };
    }, [title, description, resolvedOgTitle, resolvedOgDescription, resolvedOgImage, ogType, canonicalPath, structuredData, keywords]);
    // Renders nothing — side-effect only
    return null;
}
// ── Helper function to create LocalBusiness structured data ──────────────────
export function createLocalBusinessSchema(options) {
    return {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: options.name ?? 'The Helper Home Services',
        description: options.description ?? 'Home services marketplace connecting GTA homeowners with vetted local service providers.',
        url: options.url ?? 'https://thehelper.ca',
        areaServed: options.areaServed ?? ['Milton', 'Oakville', 'Burlington'],
        serviceType: options.serviceType ?? ['HVAC', 'Plumbing', 'Electrical', 'Handyman', 'Appliance Repair', 'Smart Home'],
        priceRange: options.priceRange ?? '$$',
        ...(options.telephone && { telephone: options.telephone }),
        ...(options.address && {
            address: {
                '@type': 'PostalAddress',
                ...options.address,
                addressCountry: options.address.addressCountry ?? 'CA',
            },
        }),
    };
}
// ── Helper function to create Service structured data ────────────────────────
export function createServiceSchema(options) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: options.name,
        description: options.description,
        provider: {
            '@type': 'LocalBusiness',
            name: options.provider ?? 'The Helper Home Services',
            url: 'https://thehelper.ca',
        },
        areaServed: (options.areaServed ?? ['Milton', 'Oakville', 'Burlington']).map(area => ({
            '@type': 'City',
            name: area,
            containedInPlace: {
                '@type': 'AdministrativeArea',
                name: 'Greater Toronto Area',
            },
        })),
        ...(options.url && { url: options.url }),
    };
}
// ── Helper function to create FAQ structured data ────────────────────────────
export function createFaqSchema(faqs) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };
}
// ── Helper function to create BreadcrumbList structured data ─────────────────
export function createBreadcrumbSchema(items) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}
//# sourceMappingURL=PageSeo.jsx.map