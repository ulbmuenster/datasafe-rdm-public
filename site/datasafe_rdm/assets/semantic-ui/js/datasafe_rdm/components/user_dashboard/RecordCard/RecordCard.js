// Copyright (C) 2023-2026 University of Münster.
//
// datasafe-RDM is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see LICENSE file for more
// details.

import React, { useContext } from "react";

import { Card, Grid, GridColumn } from "semantic-ui-react";
import { i18next } from "../../../../../translations/datasafe_rdm/i18next";

import { UserContext } from "../../../UserDashboard";

import RecordCardIcon from "./RecordCardIcon";
import RecordCardContent from "./RecordCardContent";
import RecordCardActions from "./RecordCardActions";

const RecordCard = (props) => {
  /* -------------------------------------------------------------------------------- */
  /*                        Props and state and hooks                                 */
  /* -------------------------------------------------------------------------------- */
  const { filters, recordOrDraft, uncommittedChanges, userId } = props;
  const { currentLocale } = useContext(UserContext);
  /* -------------------------------------------------------------------------------- */
  /*                           Variables and Functions                                */
  /* -------------------------------------------------------------------------------- */

  // Function to show text correctly after sclicing
  function decodeHtmlEntities(text) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
  }

  function removeHtmlTags(text) {
    return text.replace(/<[^>]*>/g, "");
  }

  const maxDescriptionChars = 350;
  const isOwner = recordOrDraft.parent.access["owned_by"].user === userId;
  const isDraft =
    recordOrDraft["status"] === "draft" ||
    recordOrDraft["status"] === "new_version_draft";
  const recordOrDraftId = recordOrDraft.id;
  const status = recordOrDraft.status;
  const title =
    recordOrDraft.metadata.title || i18next.t("This draft has no title yet");
  const version = recordOrDraft.versions?.index;
  const creators = (() => {
    const creatorsArray = recordOrDraft.metadata.creators || [];
    let tempArray = [];
    creatorsArray.map((object) => tempArray.push(object.person_or_org.name || `${object.person_or_org["family_name"]}, ${object.person_or_org["given_name"]}`));
    return tempArray;
  })();
  const description = (() => {
    let updatedDescription =
      recordOrDraft.metadata.description || "";
    if (updatedDescription.length > maxDescriptionChars) {
      // Truncate and decode HTML if the description is too long
      updatedDescription = removeHtmlTags(
        decodeHtmlEntities(updatedDescription.slice(0, maxDescriptionChars) + "..."),
      );
    }
    return removeHtmlTags(decodeHtmlEntities(updatedDescription));
  })();
  const publicationDate = (() => {
    const date = recordOrDraft.metadata?.publication_date;

    if (!date) {
      return false;
    }

    if (date.split("-").length === 1) {
      return date;
    }

    const dateObj = new Date(date);
    let options;

    if (currentLocale === "de") {
      // German format options
      options = { day: "numeric", month: "numeric", year: "numeric" };
    } else if (currentLocale === "en") {
      // English format options
      options = { month: "short", day: "numeric", year: "numeric" };
    }
    if (date.split("-").length === 2) {
      // regardless of locale return this format when no day is given
      options = { month: "long", year: "numeric" };
    }

    // Use the Intl.DateTimeFormat to format the date
    return new Intl.DateTimeFormat(currentLocale, options).format(dateObj);
  })();
  /* -------------------------------------------------------------------------------- */
  /*                                Return statement                                  */
  /* -------------------------------------------------------------------------------- */
  return (
    <Card centered fluid raised>
      <Grid>
        <GridColumn width={2}>
          <RecordCardIcon isDraft={isDraft} status={status} uncommittedChanges={uncommittedChanges} />
        </GridColumn>
        <GridColumn width={9}>
          <RecordCardContent
            title={title}
            creators={creators}
            description={description}
            version={version}
            status={status}
            publicationDate={publicationDate}
            filters={filters}
          />
        </GridColumn>
        <GridColumn className={"record-card-actions wrap"} width={5}>
          <RecordCardActions
            link={recordOrDraft.links["self_html"]}
            isDraft={isDraft}
            isOwner={isOwner}
            uncommittedChanges={uncommittedChanges}
            recordOrDraftId={recordOrDraftId}
          />
        </GridColumn>
      </Grid>
    </Card>
  );
};

export default RecordCard;
