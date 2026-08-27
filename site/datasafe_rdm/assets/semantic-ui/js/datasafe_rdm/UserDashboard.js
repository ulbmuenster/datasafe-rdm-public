// Copyright (C) 2023-2026 University of Münster.
//
// datasafe-RDM is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see LICENSE file for more
// details.

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import ReactDOM from "react-dom";
import { isEqual } from "lodash";
import DashboardFilter from "./components/user_dashboard/DashboardFilter";
import DashboardContent from "./components/user_dashboard/DashboardContent";
import useWindowDimensions from "./hooks/useWindowDimensions";
import { useUserRecordsAndDrafts } from "./hooks/useUserRecordsAndDrafts";
import Fuse from "fuse.js";
/* -------------------------------------------------------------------------------- */
/*                                  Contexts                                        */
/* -------------------------------------------------------------------------------- */
export const RecordsAndDraftsContext = createContext(null);
export const UserContext = createContext(null);
/* -------------------------------------------------------------------------------- */
/*                               Hauptkomponente                                    */
/* -------------------------------------------------------------------------------- */
const UserDashboard = ({ userId, currentLocale }) => {
  const { recordsAndDrafts, totalHits, isLoading, isBackgroundLoading, error } = useUserRecordsAndDrafts(userId);
  const { windowWidth } = useWindowDimensions();
  const [filteredRecordsAndDrafts, setFilteredRecordsAndDrafts] = useState([]);

  const defaultFilters = {
    dataset: "all",
    status: "all",
    subjects: [],
    participants: [],
    dates: [],
    search: "",
  };
  const [filters, setFilters] = useState(defaultFilters);
  const [sortBy, setSortBy] = useState("ldf");
  const [showFilterOnTablet, setshowFilterOnTablet] = useState(false);

  /* -------------------------------------------------------------------------------- */
  /*      Scroll-Lock bei Filteranzeige in tablet view                                */
  /* -------------------------------------------------------------------------------- */
  useEffect(() => {
    document.body.style.overflowY = showFilterOnTablet ? "hidden" : "auto";
  }, [showFilterOnTablet]);

  /* -------------------------------------------------------------------------------- */
  /*      Automatisches Schließen der Sidebar bei großen Viewports                    */
  /* -------------------------------------------------------------------------------- */
  useEffect(() => {
    if (windowWidth >= 1280 && showFilterOnTablet) {
      setshowFilterOnTablet(false);
    }
  }, [windowWidth, showFilterOnTablet]);

  /* -------------------------------------------------------------------------------- */
  /*      Fuse.js vorbereiten (nur neu erstellen, wenn recordsAndDrafts sich ändern)  */
  /* -------------------------------------------------------------------------------- */
  const fuse = useMemo(() => {
    return new Fuse(recordsAndDrafts, {
      keys: [
        "metadata.title",
        "metadata.additional_titles.title",
        "metadata.description",
        "metadata.creators.person_or_org.name",
      ],
      threshold: 0.1,
      distance: 100,
      ignoreLocation: true,
    });
  }, [recordsAndDrafts]);

  /* -------------------------------------------------------------------------------- */
  /*      Filterlogik – wird zentral in useEffect ausgeführt                          */
  /* -------------------------------------------------------------------------------- */
  useEffect(() => {
    let result = [...recordsAndDrafts];

    // Dataset
    if (filters.dataset !== "all") {
      result = result.filter(record =>
        filters.dataset === "mine"
          ? record.parent.access?.owned_by?.user === userId
          : record.parent.access?.owned_by.user !== userId,
      );
    }

    // Status
    if (filters.status !== "all") {
      result = result.filter(record =>
        filters.status === "draft"
          ? record.status === "draft" || record.status === "new_version_draft"
          : record.status === "published",
      );
    }

    // Participants
    if (filters.participants.length > 0) {
      result = result.filter(record =>
        record.metadata.creators?.some(creator =>
          filters.participants.some(p =>
            creator.person_or_org?.name?.includes(p),
          ),
        ),
      );
    }

    // Subjects
    if (filters.subjects.length > 0) {
      result = result.filter(record =>
        record.metadata.subjects?.some(subject =>
          filters.subjects.some(s =>
            subject.subject?.includes(s),
          ),
        ),
      );
    }

    // Dates
    if (filters.dates.length > 0) {
      result = result.filter(record =>
        filters.dates.some(date => date.slice(0, 4) === record.metadata.publication_date?.slice(0, 4)),
      );
    }

    // Search
    if (filters.search.trim() !== "") {
      const searchKeys = filters.search.trim().split(" ");
      searchKeys.forEach(key => {
        const matches = fuse.search(key).map(r => r.item);
        result = result.filter(item => matches.includes(item));
      });
    }

    setFilteredRecordsAndDrafts(result);
  }, [filters, recordsAndDrafts, fuse, userId]);

  /* -------------------------------------------------------------------------------- */
  /*      Handler nur für State-Updates                                               */
  /* -------------------------------------------------------------------------------- */
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
    setSortBy("ldf");
  };

  const toggleShowFilters = () => setshowFilterOnTablet(prev => !prev);

  /* -------------------------------------------------------------------------------- */
  /*      DashboardFilter-Handler                                                     */
  /* -------------------------------------------------------------------------------- */
  const handleDatasetFilterChange = (_event, param) => {
    handleFilterChange("dataset", param.value);
  };

  const handleStatusFilterChange = (_event, param) => {
    handleFilterChange("status", param.name);
  };

  const handleParticipantsFilterChange = (_event, participant) => {
    const updatedFilter = participant.checked
      ? [...filters.participants, participant.label]
      : filters.participants.filter(participantName => participantName !== participant.label);
    handleFilterChange("participants", updatedFilter);
  };

  const handleSubjectsFilterChange = (_event, subject) => {
    const updatedFilter = subject.checked
      ? [...filters.subjects, subject.label]
      : filters.subjects.filter(subjectName => subjectName !== subject.label);
    handleFilterChange("subjects", updatedFilter);
  };

  const handleDatesFilterChange = (_event, date) => {
    const updatedFilter = date.checked
      ? [...filters.dates, date.value]
      : filters.dates.filter(x => x !== date.value);
    handleFilterChange("dates", updatedFilter);
  };

  /* -------------------------------------------------------------------------------- */
  /*      DashboardContent-Handler                                                    */
  /* -------------------------------------------------------------------------------- */
  const handleRemoveDataset = () => handleFilterChange("dataset", "all");
  const handleRemoveStatus = () => handleFilterChange("status", "all");
  const handleRemoveParticipant = (participant) =>
    handleFilterChange("participants", filters.participants.filter(x => x !== participant));
  const handleRemoveSubject = (subject) =>
    handleFilterChange("subjects", filters.subjects.filter(x => x !== subject));
  const handleRemoveDate = (date) =>
    handleFilterChange("dates", filters.dates.filter(x => x !== date));
  const handleRemoveSearch = () => handleFilterChange("search", "");

  const handleSearchEnterChange = (query) => handleFilterChange("search", query);
  const handleSortByChange = (_, param) => setSortBy(param.value);

  /* -------------------------------------------------------------------------------- */
  /*      Variablen für Anzeige                                                       */
  /* -------------------------------------------------------------------------------- */
  const showResetFilterButton = !isEqual(filters, defaultFilters);

  /* -------------------------------------------------------------------------------- */
  /*      JSX                                                                         */
  /* -------------------------------------------------------------------------------- */
  return (
    <UserContext.Provider value={{ userId, currentLocale }}>
      <RecordsAndDraftsContext.Provider
        value={{ recordsAndDrafts, totalHits, isLoading, isBackgroundLoading, filteredRecordsAndDrafts }}>
        <DashboardFilter
          filters={filters}
          handleResetFilters={handleResetFilters}
          handleDatasetFilter={handleDatasetFilterChange}
          handleStatusFilter={handleStatusFilterChange}
          handleParticipantsFilter={handleParticipantsFilterChange}
          handleSubjectsFilter={handleSubjectsFilterChange}
          handleDatesFilter={handleDatesFilterChange}
          showFilter={showFilterOnTablet}
          showResetFilterButton={showResetFilterButton}
          toggleShowFilters={toggleShowFilters}
        />

        <DashboardContent
          error={error}
          filters={filters}
          filteredRecordsAndDrafts={filteredRecordsAndDrafts}
          handleRemoveDatasetPill={handleRemoveDataset}
          handleRemoveStatusPill={handleRemoveStatus}
          handleRemoveParticipantsPill={handleRemoveParticipant}
          handleRemoveSubjectsPill={handleRemoveSubject}
          handleRemoveDatesPill={handleRemoveDate}
          handleRemoveSearchPill={handleRemoveSearch}
          handleSearchEnter={handleSearchEnterChange}
          handleSortChange={handleSortByChange}
          isSearchOrFilter={showResetFilterButton}
          sortBy={sortBy}
          toggleShowFilters={toggleShowFilters}
          userId={userId}
        />
      </RecordsAndDraftsContext.Provider>
    </UserContext.Provider>
  );
};

/* -------------------------------------------------------------------------------- */
/*      Mounting                                                                     */
/* -------------------------------------------------------------------------------- */
const domContainer = document.getElementById("dashboard");
ReactDOM.render(
  <UserDashboard
    userId={domContainer.dataset.userId}
    currentLocale={domContainer.dataset.currentLocale}
  />,
  domContainer,
);
