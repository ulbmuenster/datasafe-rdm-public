// Copyright (C) 2023-2026 University of Münster.
//
// datasafe-rdm is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see LICENSE file for more
// details.

import React, { useContext, useState } from "react";

import { Accordion, AccordionContent, AccordionTitle, Button, Card, Checkbox, Icon } from "semantic-ui-react";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { RecordsAndDraftsContext } from "../../UserDashboard";
import { i18next } from "../../../../translations/datasafe_rdm/i18next";

const DashboardFilter = (props) => {
  /* -------------------------------------------------------------------------------- */
  /*                            Props, state and hooks                                */
  /* -------------------------------------------------------------------------------- */
  const {
    filters,
    handleResetFilters,
    handleDatasetFilter,
    handleStatusFilter,
    handleParticipantsFilter,
    handleSubjectsFilter,
    handleDatesFilter,
    showFilter,
    showResetFilterButton,
    toggleShowFilters,
  } = props;

  const { recordsAndDrafts } = useContext(RecordsAndDraftsContext);
  const { windowWidth } = useWindowDimensions();
  const [activeAccordions, setActiveAccordions] = useState({ 0: true, 1: true, 2: false, 3: false });

  /* -------------------------------------------------------------------------------- */
  /*                                   Handlers                                       */
  /* -------------------------------------------------------------------------------- */
  const handleAccordionClick = (e, titleProps) => {
    const { index } = titleProps;
    setActiveAccordions(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  /* -------------------------------------------------------------------------------- */
  /*                           Variables and Functions                                */
  /* -------------------------------------------------------------------------------- */
  const headerHeight = document.querySelector("header.theme.header").offsetHeight;

  const isCheckedParticipant = (label) => {
    return filters.participants.includes(label);
  };
  const isCheckedsubject = (label) => {
    return filters.subjects.includes(label);
  };
  const isCheckedDate = (value) => {
    return filters.dates.includes(value);
  };
  const getParticipantsNameCounts = (records) => {
    return records.reduce((acc, record) => {
      if (record.metadata && record.metadata.creators) {
        record.metadata.creators.forEach(creator => {
          const name = creator.person_or_org.name;
          if (acc[name]) {
            acc[name] += 1;
          } else {
            acc[name] = 1;
          }
        });
      }
      return acc;
    }, {});
  };

  const getSubjectsCounts = (records) => {
    return records.reduce((acc, record) => {
      if (record.metadata && record.metadata.subjects) {
        record.metadata.subjects.forEach(subject => {
          const subjectName = subject.subject;
          if (acc[subjectName]) {
            acc[subjectName] += 1;
          } else {
            acc[subjectName] = 1;
          }
        });
      }
      return acc;
    }, {});
  };
  const isEmptyList = recordsAndDrafts.length === 0;
  const countOfParticipants = getParticipantsNameCounts(recordsAndDrafts);
  const countOfParticipantsItems = Object.entries(countOfParticipants).sort((a, b) => a[0].localeCompare(b[0])).map(([name]) => (
    <div className="entry" key={name}>
      <Checkbox label={name}
                onChange={handleParticipantsFilter}
                checked={isCheckedParticipant(name)}
      />
    </div>
  ));

  const countOfSubjects = getSubjectsCounts(recordsAndDrafts);
  const countOfSubjectsItems = Object.entries(countOfSubjects).sort((a, b) => a[0].localeCompare(b[0])).map(([name]) => (
    <div className="entry" key={name}>
      <Checkbox label={name}
                onChange={handleSubjectsFilter}
                checked={isCheckedsubject(name)}
      />
    </div>
  ));

  const publicationDates = recordsAndDrafts.map(item => {
    return item.metadata.publication_date ? item.metadata.publication_date.slice(0, 4) : "1970";
  });
  const publicationDatesCounts = publicationDates.reduce((acc, date) => {
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  const publicationDatesCountItems = Object.entries(publicationDatesCounts).sort((a, b) => b[0] - a[0]).map(([date]) => (
    <div className="entry" key={date}>
      <Checkbox label={date} value={date} onChange={handleDatesFilter}
                checked={isCheckedDate(date)}
      />
    </div>
  ));
  const showToggleFilterButton = windowWidth < 1280;
  /* -------------------------------------------------------------------------------- */
  /*                                Return statement                                  */
  /* -------------------------------------------------------------------------------- */
  return (
    <>
      <aside id="dashboard-filter" className={`${showFilter ? "active" : ""}`}
             style={{ top: `${headerHeight}px` }}>

        <div className="filter-heading">
          {i18next.t("Filter")}
          {showResetFilterButton && <Button className="greybg" size="small" onClick={handleResetFilters}>
            {i18next.t("Reset filters")}
          </Button>}
          {showToggleFilterButton && <Button className={"toggle-filter-button"} size={"small"} icon={"bars"}
                                             onClick={toggleShowFilters}></Button>}
        </div>

        {/*Dataset filter*/}
        <Card raised fluid>
          <Accordion>
            <AccordionTitle
              className={"ui"}
              active={activeAccordions[0]}
              index={0}
              onClick={handleAccordionClick}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAccordionClick(e, { index: 0 });
                }
              }}>
              {i18next.t("Datasets")}
              <Icon circular name="arrow right" size="small" />
            </AccordionTitle>
            <AccordionContent active={activeAccordions[0]}>
              <div className="horizontal ruler"></div>
              <div className={"entry"}>
                <Checkbox radio
                          label={i18next.t("All")}
                          name="datasetFilter"
                          checked={filters.dataset === "all"}
                          onChange={handleDatasetFilter}
                          value="all" />

              </div>

              <div className={"entry"}>
                <Checkbox radio
                          label={i18next.t("Mine")}
                          name="datasetFilter"
                          checked={filters.dataset === "mine"}
                          onChange={handleDatasetFilter}
                          value="mine" />

              </div>

              <div className={"entry"}>
                <Checkbox radio
                          label={i18next.t("Shared with me")}
                          name="datasetFilter"
                          checked={filters.dataset === "shared"}
                          onChange={handleDatasetFilter}
                          value="shared" />

              </div>

            </AccordionContent>
          </Accordion>
        </Card>

        {/*Status filter*/}
        <Card raised fluid>
          <Accordion>
            <AccordionTitle
              className={"ui"}
              active={activeAccordions[1]}
              index={1}
              onClick={handleAccordionClick}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAccordionClick(e, { index: 1 });
                }
              }}
            >
              {i18next.t("Status")}
              <Icon circular name="arrow right" size="small"
              />
            </AccordionTitle>
            <AccordionContent active={activeAccordions[1]}>
              <div className="horizontal ruler"></div>
              <div className="entry">
                <Checkbox radio label={i18next.t("All")} name="all" onChange={handleStatusFilter}
                          checked={filters.status === "all"} />
              </div>
              <div className="entry">
                <Checkbox radio label={i18next.t("Dataset")} name="published" onChange={handleStatusFilter}
                          checked={filters.status === "published"} />
              </div>
              <div className="entry">
                <Checkbox radio label={i18next.t("Draft")} name="draft" onChange={handleStatusFilter}
                          checked={filters.status === "draft"} />
              </div>

            </AccordionContent>
          </Accordion>
        </Card>

        {!isEmptyList && (
          //Participants filter
          <Card raised fluid>
            <Accordion>
              <AccordionTitle
                className={"ui"}
                active={activeAccordions[2]}
                index={2}
                onClick={handleAccordionClick}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAccordionClick(e, { index: 2 });
                  }
                }}
              >
                {i18next.t("Creators")}
                <Icon circular name="arrow right" size="small" />
              </AccordionTitle>
              <AccordionContent active={activeAccordions[2]}>
                <div className="horizontal ruler"></div>
                {countOfParticipantsItems}
              </AccordionContent>
            </Accordion>
          </Card>)}
        {!isEmptyList && countOfSubjectsItems.length > 0 && (
          //Tags filter
          <Card raised fluid>
            <Accordion>
              <AccordionTitle
                className={"ui"}
                active={activeAccordions[3]}
                index={3}
                onClick={handleAccordionClick}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAccordionClick(e, { index: 3 });
                  }
                }}
              >
                {i18next.t("Tags")}
                <Icon circular name="arrow right" size="small" />
              </AccordionTitle>
              <AccordionContent active={activeAccordions[3]}>
                <div className="horizontal ruler"></div>
                {countOfSubjectsItems}
              </AccordionContent>
            </Accordion>
          </Card>)}
        {!isEmptyList && (
          // Dates Filter
          <Card raised fluid>
            <Accordion
              className={""}>
              <AccordionTitle
                className={"ui"}
                active={activeAccordions[4]}
                index={4}
                onClick={handleAccordionClick}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAccordionClick(e, { index: 4 });
                  }
                }}
              >
                {i18next.t("Year of archiving")}
                <Icon circular name="arrow right" size="small" />
              </AccordionTitle>
              <AccordionContent active={activeAccordions[4]}>
                <div className="horizontal ruler"></div>
                {publicationDatesCountItems}
              </AccordionContent>
            </Accordion>
          </Card>
        )}

      </aside>
      <div id="backdrop" className={`${showFilter ? "active" : ""}`} onClick={toggleShowFilters}></div>
    </>
  );
};

export default DashboardFilter;
