// Copyright (C) 2023-2026 University of Münster.
//
// datasafe-RDM is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see LICENSE file for more
// details.

import React, { useContext, useState } from "react";
import { RecordsAndDraftsContext } from "../../UserDashboard";
import { Button, Dropdown, Grid, GridColumn, GridRow, Icon, Input, Loader } from "semantic-ui-react";

import Pill from "../ui/Pill";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { i18next } from "../../../../translations/datasafe_rdm/i18next";

const DashboardSearchbar = (props) => {
  /* -------------------------------------------------------------------------------- */
  /*                        Props and state and hooks                                 */
  /* -------------------------------------------------------------------------------- */
  const {
    filters,
    handleRemoveDatasetPill,
    handleRemoveStatusPill,
    handleRemoveParticipantsPill,
    handleRemoveSubjectsPill,
    handleRemoveDatesPill,
    handleRemoveSearchPill,
    handleSearchEnter,
    handleSortChange,
    sortBy,
    toggleShowFilters,
  } = props;

  const { filteredRecordsAndDrafts, totalHits, isLoading, isBackgroundLoading } =
    useContext(RecordsAndDraftsContext);
  const { windowWidth } = useWindowDimensions();

  const [searchString, setSearchString] = useState("");
  /* -------------------------------------------------------------------------------- */
  /*                           Variables and Functions                                */
  /* -------------------------------------------------------------------------------- */
  const countOfResults = filteredRecordsAndDrafts.length;
  const sortingOptions = [
    { key: "Latest datasets", text: i18next.t("Latest datasets"), value: "ldf" },
    { key: "Oldest datasets", text: i18next.t("Oldest datasets"), value: "odf" },
    { key: "Title - ascending", text: i18next.t("Title - ascending"), value: "ta" },
    { key: "Title - descending", text: i18next.t("Title - descending"), value: "td" },
  ];

  const resultsString =
    countOfResults === 1 ? i18next.t("dataset found.") : i18next.t("datasets found.");
  const isTabletView = windowWidth < 1280;
  const showSortingLabel = !isTabletView;

  /* -------------------------------------------------------------------------------- */
  /*                                 Filter pills                                     */
  /* -------------------------------------------------------------------------------- */
  const datasetPills = (() => {
    let value;
    if (filters.dataset === "all") return null;
    if (filters.dataset === "mine") value = i18next.t("Mine");
    if (filters.dataset === "shared") value = i18next.t("Shared");
    return <Pill value={value} key={value} removePill={handleRemoveDatasetPill} />;
  })();

  const statusPills = (() => {
    const published = filters.status === "published";
    const draft = filters.status === "draft";
    if (!(published || draft)) return null;
    const pillString = published ? i18next.t("Datasets") : i18next.t("Drafts");
    return (
      <Pill
        value={pillString}
        key={pillString}
        removePill={() => handleRemoveStatusPill(pillString)}
      />
    );
  })();

  const participantPills = filters.participants.map((participant) => (
    <Pill
      value={participant}
      key={participant}
      removePill={handleRemoveParticipantsPill}
    />
  ));

  const subjectPills = filters.subjects.map((subject) => (
    <Pill
      value={subject}
      key={subject}
      removePill={handleRemoveSubjectsPill}
    />
  ));

  const datesPills = filters.dates.map((date) => (
    <Pill value={date} key={date} removePill={handleRemoveDatesPill} />
  ));

  const searchPill = (() => {
    if (filters.search.trim() === "") return null;
    return (
      <Pill
        value={filters.search}
        key={filters.search}
        removePill={handleRemoveSearchPill}
        type="search"
      />
    );
  })();

  const showPillRow =
    datasetPills ||
    statusPills ||
    participantPills.length > 0 ||
    subjectPills.length > 0 ||
    datesPills.length > 0 ||
    searchPill;

  /* -------------------------------------------------------------------------------- */
  /*                                  Handlers                                        */
  /* -------------------------------------------------------------------------------- */
  const handleSearchInputChange = (newSearchString) => setSearchString(newSearchString);

  const handleSearchEnterPress = (event, searchString) => {
    if (event.key === "Enter") {
      setSearchString("");
      handleSearchEnter(searchString);
    }
  };

  const handleSearchClick = (event, searchString) => {
    setSearchString("");
    handleSearchEnter(searchString);
  };
  /* -------------------------------------------------------------------------------- */
  /*                                Return statement                                  */
  /* -------------------------------------------------------------------------------- */
  return (
    <Grid id="dashboard-searchbar">
      <GridRow columns={3}>
        <GridColumn
          id={`search-results-column${isTabletView ? "" : "-computer"}`}
          verticalAlign="bottom"
          textAlign="left"
          width={isTabletView ? 16 : 5}
        >
          {isTabletView && <Button icon="bars" onClick={toggleShowFilters} />}
          {!isLoading && !isBackgroundLoading && (
            <span className="count-of-results">{`${countOfResults} ${resultsString}`}</span>
          )}
          {(isLoading || isBackgroundLoading) && (
            <span className="count-of-results">{`${countOfResults} ${i18next.t(
              "of",
            )} ${totalHits} ${i18next.t("datasets fetched")}`}</span>
          )}
          <Loader className={isBackgroundLoading ? "active" : ""} inline size="small" />
        </GridColumn>

        <GridColumn
          id={`search-column${isTabletView ? "" : "-computer"}`}
          textAlign={isTabletView ? "left" : "right"}
          verticalAlign="middle"
          computer={isTabletView ? 8 : 4}
        >
          <Input
            icon={
              <Icon
                name="search"
                size="large"
                link
                onClick={(event) => handleSearchClick(event, searchString)}
              />
            }
            value={searchString}
            onChange={(event) => handleSearchInputChange(event.target.value)}
            onKeyPress={(event) => handleSearchEnterPress(event, searchString)}
          />
        </GridColumn>

        <GridColumn id="sort-column" textAlign="right" mobile={16} tablet={8} computer={7}>
          {showSortingLabel && <span className="sorting-label">{i18next.t("Sort by")}</span>}
          <Dropdown
            selection
            placeholder=""
            options={sortingOptions}
            value={sortBy}
            onChange={handleSortChange}
          />
        </GridColumn>
      </GridRow>

      {showPillRow && (
        <GridRow id="pill-row" className="pill-row">
          {[
            datasetPills,
            statusPills,
            ...participantPills,
            ...subjectPills,
            ...datesPills,
            searchPill,
          ].filter(Boolean)}
        </GridRow>
      )}
    </Grid>
  );
};

export default DashboardSearchbar;
