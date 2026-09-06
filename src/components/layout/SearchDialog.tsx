"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { searchIndex, type SearchIndexEntry } from "@/lib/search";
import type { LocaleUiLabels } from "@/types/localization";

function isSearchIndexEntry(value: unknown): value is SearchIndexEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Record<string, unknown>;
  return ["id", "locale", "url", "title", "summary", "text"].every(
    (key) => typeof entry[key] === "string",
  );
}

export function SearchDialog({
  locale,
  indexUrl,
  labels,
}: {
  locale: string;
  indexUrl: string;
  labels: LocaleUiLabels;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<SearchIndexEntry[] | null>(null);
  const [loadedIndexUrl, setLoadedIndexUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const requestUrl = useRef<string | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    if (!open || loadedIndexUrl === indexUrl || requestUrl.current === indexUrl) return;

    let cancelled = false;
    const currentRequestId = requestId.current + 1;
    requestId.current = currentRequestId;
    requestUrl.current = indexUrl;
    setLoading(true);
    setError(false);
    fetch(indexUrl)
      .then(async (response) => {
        if (!response.ok) throw new Error(`Search index request failed: ${response.status}`);
        const payload: unknown = await response.json();
        if (!Array.isArray(payload) || !payload.every(isSearchIndexEntry)) {
          throw new Error("Search index response is invalid");
        }
        return payload;
      })
      .then((nextEntries) => {
        if (cancelled) return;
        setEntries(nextEntries);
        setLoadedIndexUrl(indexUrl);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (requestId.current !== currentRequestId) return;
        requestUrl.current = null;
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      if (requestId.current === currentRequestId) requestUrl.current = null;
    };
  }, [indexUrl, loadedIndexUrl, open]);

  const results = useMemo(
    () => searchIndex(loadedIndexUrl === indexUrl ? entries || [] : [], query),
    [entries, indexUrl, loadedIndexUrl, query],
  );

  function close() {
    setOpen(false);
    setQuery("");
  }

  return (
    <div className="site-search" data-locale={locale}>
      <button
        type="button"
        className="search-toggle"
        aria-expanded={open}
        aria-controls="site-search-panel"
        onClick={() => setOpen((current) => !current)}
      >
        {open ? labels.searchClose : labels.searchOpen}
      </button>
      {open ? (
        <section id="site-search-panel" className="search-panel" aria-label={labels.searchOpen}>
          <form
            className="search-form"
            onSubmit={(event) => event.preventDefault()}
          >
            <label htmlFor="site-search-input" className="sr-only">
              {labels.searchOpen}
            </label>
            <input
              id="site-search-input"
              type="search"
              value={query}
              placeholder={labels.searchPlaceholder}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type="submit" className="btn search-submit">
              {labels.searchSubmit}
            </button>
          </form>
          {loading ? <p className="search-status">{labels.searchLoading}</p> : null}
          {error ? <p className="search-status">{labels.searchError}</p> : null}
          {!loading && !error && query.trim() ? (
            results.length ? (
              <ul className="search-results">
                {results.map((result) => (
                  <li key={result.id}>
                    <Link href={result.url} onClick={close}>
                      <strong>{result.title}</strong>
                      <span>{result.summary}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="search-empty">{labels.searchNoResults}</p>
            )
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
