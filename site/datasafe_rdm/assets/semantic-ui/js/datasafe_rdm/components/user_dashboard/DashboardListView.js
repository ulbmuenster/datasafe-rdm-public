// Copyright (C) 2023-2026 University of Münster.
//
// datasafe-rdm is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see LICENSE file for more
// details.

import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Dropdown,
  Grid,
  GridColumn,
  GridRow,
  Message,
  MessageHeader,
  Pagination,
} from "semantic-ui-react";

import { i18next } from "../../../../translations/datasafe_rdm/i18next";

import RecordCard from "./RecordCard/RecordCard";
import LoadingSpinner from "../LoadingSpinner";
import { RecordsAndDraftsContext } from "../../UserDashboard";


const DashboardListView = (props) => {
  /* -------------------------------------------------------------------------------- */
  /*                        Props and state and hooks                                 */
  /* -------------------------------------------------------------------------------- */
  const {
    error,
    filters,
    isSearchOrFilter,
    sortBy,
    userId,
  } = props;

  const {
    recordsAndDrafts,
    totalHits,
    isLoading,
    isBackgroundLoading,
    filteredRecordsAndDrafts,
  } = useContext(RecordsAndDraftsContext);

  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [activePage, setActivePage] = useState(0);

  useEffect(() => {
    setActivePage(1);
  }, [sortBy, entriesPerPage]);
  /* -------------------------------------------------------------------------------- */
  /*                           Variables and Functions                                */
  /* -------------------------------------------------------------------------------- */
  const handlePageChange = (event, props) => {
    setActivePage(props.activePage);
  };
  const handleEntriesperPageChange = (event, props) => {
    setEntriesPerPage(props.value);
  };

  const isEmptyRecordList = recordsAndDrafts.length === 0;
  const errorMessage = (
    <Message warning size={"large"}>
      <MessageHeader>Error fetching data</MessageHeader> <br />
      <p>{error?.name}: {error?.message}</p> <br />
      <p>{i18next.t("If his error persists please contact support@example.org")}.</p><br />
    </Message>
  );

  const showContent = !error && !isLoading;
  const totalPagesOptions = [
    { key: 5, text: 5, value: 5 },
    { key: 10, text: 10, value: 10 },
    { key: 15, text: 15, value: 15 },
    { key: 20, text: 20, value: 20 },
    { key: 25, text: 25, value: 25 },
  ];
  const filteredAndSortedRecordsAndDrafts = (() => {
    // Sort by newest date first
    if (sortBy === "ldf") {
      return filteredRecordsAndDrafts.sort((a, b) => {
        const dateA = new Date(a.updated);
        const dateB = new Date(b.updated);
        return dateB - dateA;
      });
    }
    // Sort by oldest date first
    if (sortBy === "odf") {
      return filteredRecordsAndDrafts.sort((a, b) => {
        const dateA = new Date(a.updated);
        const dateB = new Date(b.updated);
        return dateA - dateB;
      });
    }
    // Sort by title - ascending
    if (sortBy === "ta") {
      return filteredRecordsAndDrafts.sort((a, b) => {
        const titleA = a.metadata.title ? a.metadata.title.toLowerCase() : "";
        const titleB = b.metadata.title ? b.metadata.title.toLowerCase() : "";
        if (titleA === "") return 1;
        if (titleB === "") return -1;
        if (titleA < titleB) {
          return -1; // a comes first
        }
        if (titleA > titleB) {
          return 1;  // b comes first
        }
        return 0;  // titles are equal
      });
    }
    // Sort by title - descending
    if (sortBy === "td") {
      return filteredRecordsAndDrafts.sort((a, b) => {
        const titleA = a.metadata.title ? a.metadata.title.toLowerCase() : "";
        const titleB = b.metadata.title ? b.metadata.title.toLowerCase() : "";
        if (titleA > titleB) {
          return -1; // b comes first
        }
        if (titleA < titleB) {
          return 1;  // a comes first
        }
        return 0;  // titles are equal
      });
    }
  })();
  const paginatedFilteredandSortedRecordsAndDrafts = (() => {
    const sliceStart = (activePage - 1) * entriesPerPage;
    const sliceEnd = activePage * entriesPerPage;
    return filteredAndSortedRecordsAndDrafts.slice(sliceStart, sliceEnd);
  })();
  const paginatedFilteredAndSortedRecordsAndDraftsItems = (() => {

    if (showContent && isEmptyRecordList) {
      return (
        // <Card fluid>
        <Message info size={"large"}>
          <p>{i18next.t("No datasets have been archived or shared with you yet.")}</p>
          <p>{i18next.t("Start archiving now.")}</p>
          <Button primary href={"/archive/new"}>{i18next.t("Archive dataset")}</Button>
          <br />
        </Message>
        // </Card>
      );
    }

    if (showContent && filteredRecordsAndDrafts.length === 0 && isSearchOrFilter) {
      return (
        <Message info size={"large"}>
          <MessageHeader>{i18next.t("No results")}</MessageHeader> <br />
          <p>
            {i18next.t(
              "No datasets were found that match your search.",
            )}
          </p>
          <p>{i18next.t("Please try different combinations of search terms and filters.")}</p>
          <br />
        </Message>
      );
    }

    if (showContent && paginatedFilteredandSortedRecordsAndDrafts.length > 0) {
      return paginatedFilteredandSortedRecordsAndDrafts.map((item, index) => {
        return (
          <RecordCard key={index}
                      fluid
                      raised
                      recordOrDraft={item}
                      userId={userId}
                      filters={filters}
                      uncommittedChanges={item.uncommittedChanges} // Pass the uncommittedChanges property
          />
        );
      });
    }
  })();
  const totalPages = (() => {
    if (isLoading || isBackgroundLoading) {
      return Math.ceil(totalHits / entriesPerPage);
    } else {
      return Math.ceil(filteredAndSortedRecordsAndDrafts.length / entriesPerPage);
    }
  })();
  let paginationProps = {
    nextItem: {
      disabled: (activePage >= totalPages || isLoading || isBackgroundLoading),
      content: ">",
    },
    prevItem: {
      disabled: (activePage <= 1),
      content: "<",
    },
    firstItem: {
      disabled: (activePage <= 1),
      content: "<<",
    },
    lastItem: {
      disabled: (activePage >= totalPages || isLoading || isBackgroundLoading),
      icon: true,
      content: ">>",
    },
  };
  const updatedPaginationProps = (() => {
    if (totalPages <= 10) {
      paginationProps.lastItem = null;
      paginationProps.firstItem = null;
    }
    return paginationProps;
  })();

  const paginationItemElements = document.querySelectorAll("[type=pageItem]");

  // Disable paginationItems if its page content is not already fetched
  for (const paginationItemElement of paginationItemElements) {
    const alreadyFetchedPages = Math.ceil(filteredAndSortedRecordsAndDrafts.length / entriesPerPage);
    const pageValue = parseInt(paginationItemElement.getAttribute("value"), 10);

    if (alreadyFetchedPages < pageValue) {
      paginationItemElement.classList.add("disabled");
    } else {
      paginationItemElement.classList.remove("disabled");
    }
  }

  /* -------------------------------------------------------------------------------- */
  /*                                Return statement                                  */
  /* -------------------------------------------------------------------------------- */
  return (
    <div id="dashboard-listview">
      {isLoading && <LoadingSpinner />}
      {(error && !isBackgroundLoading) ? errorMessage : paginatedFilteredAndSortedRecordsAndDraftsItems}

      {(!isEmptyRecordList &&
        <Grid stackable columns={2}>
          <GridRow id="pagination-row">
            {showContent && totalPages > 1 &&
              <GridColumn width={12} floated="left">
                <Pagination id="dashboard-pagination"
                            {...updatedPaginationProps}
                            activePage={activePage}
                            totalPages={totalPages}
                            boundaryRange={2}
                            ellipsisItem={totalPages > 10 ? undefined : null}
                            siblingRange={1}
                            onPageChange={handlePageChange}
                />
              </GridColumn>}
            <GridColumn width={4} floated="right">
              <span>{i18next.t("Results per page")}</span>
              <Dropdown id="dashboard-pagination-dropdown"
                        button
                        compact
                        selection
                        options={totalPagesOptions}
                        value={entriesPerPage}
                        onChange={handleEntriesperPageChange} />
            </GridColumn>
          </GridRow>
        </Grid>)}
    </div>
  );
};

export default DashboardListView;
