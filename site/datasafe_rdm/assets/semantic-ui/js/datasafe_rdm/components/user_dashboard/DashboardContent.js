// Copyright (C) 2023-2026 University of Münster.
//
// datasafe-rdm is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see LICENSE file for more
// details.

import React from "react";
import DashboardSearchbar from "./DashboardSearchbar";
import DashboardListView from "./DashboardListView";

const DashboardContent = (props) => {
  /* -------------------------------------------------------------------------------- */
  /*                          Props, state and hooks                                  */
  /* -------------------------------------------------------------------------------- */
  const {
    error,
    filters,
    handleRemoveDatasetPill,
    handleRemoveStatusPill,
    handleRemoveParticipantsPill,
    handleRemoveSubjectsPill,
    handleRemoveDatesPill,
    handleRemoveSearchPill,
    handleSearchEnter,
    handleSortChange,
    isLoading,
    isBackgroundLoading,
    isSearchOrFilter,
    sortBy,
    toggleShowFilters,
    userId,
  } = props;
  /* -------------------------------------------------------------------------------- */
  /*                                Return statement                                  */
  /* -------------------------------------------------------------------------------- */
  return (
    <div id="dashboard-content" className="container">
      <DashboardSearchbar
        filters={filters}
        handleRemoveDatasetPill={handleRemoveDatasetPill}
        handleRemoveStatusPill={handleRemoveStatusPill}
        handleRemoveParticipantsPill={handleRemoveParticipantsPill}
        handleRemoveSubjectsPill={handleRemoveSubjectsPill}
        handleRemoveDatesPill={handleRemoveDatesPill}
        handleRemoveSearchPill={handleRemoveSearchPill}
        handleSearchEnter={handleSearchEnter}
        handleSortChange={handleSortChange}
        sortBy={sortBy}
        toggleShowFilters={toggleShowFilters} />
      <DashboardListView
        filters={filters}
        isSearchOrFilter={isSearchOrFilter}
        sortBy={sortBy}
        error={error}
        userId={userId} />
    </div>
  );
};

export default DashboardContent;
