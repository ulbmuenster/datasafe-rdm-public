// Copyright (C) 2023-2026 University of Münster.
//
// datasafe-RDM is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see LICENSE file for more
// details.

import { useEffect, useState } from "react";

export function useUserRecordsAndDrafts(userId, pageSize = 5) {
  const [recordsAndDrafts, setRecordsAndDrafts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBackgroundLoading, setIsBackgroundLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalHits, setTotalHits] = useState(0); // from accumulated from initial Fetch

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        /* -------------------------------------------------------------------------------- */
        /*    Phase 1: Fetch first page quickly                                            */
        /* -------------------------------------------------------------------------------- */
        const [firstRecords, firstDrafts] = await Promise.all([
          fetchDraftsOfRecords(
            fetchRecords(
              `/api/records?q=access.record%3Arestricted&sort=updated-desc&size=${pageSize}`,
              signal,
              true,
              setTotalHits,
            ),
            signal,
          ),
          fetchRecords(
            `/api/user/records?sort=updated-desc&size=${pageSize}`,
            signal,
            true,
            setTotalHits,
          ),
        ]);

        let mergedFirstRecordsAndDrafts = dedupeAndSortRecords(
          [...firstRecords.records, ...firstDrafts.records].filter(
            (r) => r.versions?.is_latest || r.versions?.is_latest_draft,
          ),
        );

        // Display first page
        const itemsForFirstPage = mergedFirstRecordsAndDrafts.slice(0, pageSize);
        // Rest of the items will be re-added in phase 2
        const restItemsFromInitialFetch = mergedFirstRecordsAndDrafts.slice(pageSize);

        setRecordsAndDrafts(itemsForFirstPage);
        setIsLoading(false);

        /* -------------------------------------------------------------------------------- */
        /*    Phase 2: Load in background page by page (pageSize Records + Drafts)         */
        /* -------------------------------------------------------------------------------- */
        setIsBackgroundLoading(true);

        // Step 1: re-add remaining records/drafts from initial fetch
        if (restItemsFromInitialFetch.length > 0) {
          setRecordsAndDrafts((prev) =>
            dedupeAndSortRecords([...prev, ...restItemsFromInitialFetch]),
          );
        }

        // Step 2: fetch next pages (records + drafts)
        let recordsNextUrl = firstRecords.nextUrl;
        let draftsNextUrl = firstDrafts.nextUrl;

        while (recordsNextUrl || draftsNextUrl) {
          const [recordsChunk, draftsChunk] = await Promise.all([
            recordsNextUrl
              ? fetchDraftsOfRecords(
                fetchRecords(recordsNextUrl, signal, false),
                signal,
              )
              : Promise.resolve({ records: [], nextUrl: null }),
            draftsNextUrl
              ? fetchRecords(draftsNextUrl, signal, false)
              : Promise.resolve({ records: [], nextUrl: null }),
          ]);

          const mergedChunk = dedupeAndSortRecords(
            [...recordsChunk.records, ...draftsChunk.records].filter(
              (r) => r.versions?.is_latest || r.versions?.is_latest_draft,
            ),
          );

          setRecordsAndDrafts((prev) =>
            dedupeAndSortRecords([...prev, ...mergedChunk]),
          );

          recordsNextUrl = recordsChunk.nextUrl;
          draftsNextUrl = draftsChunk.nextUrl;
        }

        setIsBackgroundLoading(false);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching records:", error);
          setError(error);
          setIsLoading(false);
          setIsBackgroundLoading(false);
        }
      }
    }

    fetchData();
    return () => controller.abort();
  }, [userId, pageSize]);

  return { recordsAndDrafts, totalHits, isLoading, isBackgroundLoading, error };
}

/* ------------------------------------------------------------------------------- */
/*                                  Helpers                                        */
/* ------------------------------------------------------------------------------- */

function dedupeAndSortRecords(records) {
  return records.reduce((acc, current) => {
    const existing = acc.find(item => item.id === current.id);
    if (!existing) {
      acc.push(current);
    } else if (current.status === "draft") {
      existing.uncommittedChanges = true;
    }
    return acc;
  }, [])
    .sort((a, b) => new Date(b.updated) - new Date(a.updated),
    );
  ;
}

async function fetchRecords(apiUrl, signal, initialOnly = false, setTotalHits) {
  const response = await fetch(apiUrl, { signal });
  if (!response.ok) throw new Error(`Failed to fetch ${apiUrl}`);

  const data = await response.json();
  const records = data?.hits?.hits || [];
  const nextUrl = data?.links?.next || null;

  if (initialOnly && setTotalHits) {
    setTotalHits((prev) => prev + (data?.hits?.total || 0));
  }

  return { records, nextUrl };
}

async function fetchDraftsOfRecords(allRecordsPromise, signal) {
  const { records, nextUrl } = await allRecordsPromise;

  // Helper to fetch draft for a single record
  async function fetchDraft(record) {
    if (record.is_published === true && record.versions["is_latest_draft"] === true) {
    try {

      const response = await fetch(`/api/records/${record.id}/draft`, { signal });

      if (response.status === 404) return null; // Draft does not exist
      if (!response.ok) {
        console.error(`Failed to fetch draft for record ${record.id}: ${response.status}`);
        return null;
      }

      const draftData = await response.json();
      draftData.status = "draft";
      draftData.isDraftOfPublishedRecord = true;
      return draftData;
    } catch (err) {
      console.error(`Error fetching draft for record ${record.id}:`, err);
      return null;
    }
    }
  }

  // Fetch drafts in parallel for all records
  const draftResults = await Promise.allSettled(records.map(fetchDraft));

  // Keep only successful drafts
  const successfulDrafts = draftResults
    .filter(result => result.status === "fulfilled" && result.value)
    .map(result => result.value);

  // Merge original records with drafts, then deduplicate and sort
  const mergedRecords = dedupeAndSortRecords([...records, ...successfulDrafts]);

  return { records: mergedRecords, nextUrl };
}