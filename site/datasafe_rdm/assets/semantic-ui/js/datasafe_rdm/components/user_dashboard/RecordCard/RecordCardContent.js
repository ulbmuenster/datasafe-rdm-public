// Copyright (C) 2023-2026 University of Münster.
//
// datasafe-RDM is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see LICENSE file for more
// details.

import React from "react";

import { CardContent, CardDescription, CardHeader, CardMeta } from "semantic-ui-react";
import { i18next } from "../../../../../translations/datasafe_rdm/i18next";

const RecordCardContent = (props) => {
  const { title, creators, description, version, status, publicationDate, filters } = props;

  let committedString;
  if (publicationDate && status === "published") {
    committedString = `${i18next.t("Version")} ${version}, ${i18next.t("archived")} ${publicationDate}`;
  }
if (status === "draft") {
    committedString = publicationDate
        ? `${i18next.t("Draft")}, ${i18next.t("saved")} ${publicationDate}`
        : `${i18next.t("Draft")}`;
} else if (status === "new_version_draft") {
    committedString = publicationDate
        ? `${i18next.t("Draft of version")} ${version}, ${i18next.t("saved")} ${publicationDate}`
        : `${i18next.t("Draft of version")} ${version}`;
}

  const creatorsText = formatCreators(creators);

  function formatCreators(creatorsArray) {
    let text = "";
    const numberOfCreators = creatorsArray.length;

    if (numberOfCreators === 0) {
      return i18next.t("This draft has no creators yet");
    }
    for (let i = 0; i < numberOfCreators && i < 3; i++) {
      text += `${creatorsArray[i]}`;
      if (i !== numberOfCreators - 1 && i < 2) text += "; ";
    }

    if (numberOfCreators === 4) text += i18next.t(" there is one other creator");
    if (numberOfCreators > 4) text += `${i18next.t(" there are")} ${numberOfCreators - 3} ${i18next.t("other creators")}`;

    return text;
  }

  /**
   * Highlights occurrences of search terms within a given text.
   *
   * @param {string} text - The text to search within.
   * @param {string} searchTerm - The search term(s) to highlight. Multiple terms should be separated by spaces.
   * @returns {JSX.Element} A JSX element containing the text with highlighted search terms.
   */
  function highlightText(text, searchTerm) {
    if (!searchTerm) return text;

    const searchTerms = searchTerm.split(" ");
    let parts = [text];

    searchTerms.forEach(term => {
      let newParts = [];
      parts.forEach(part => {
        if (typeof part === "string") {
          let index;
          let lastIndex = 0;
          while ((index = part.toLowerCase().indexOf(term.toLowerCase(), lastIndex)) !== -1) {
            if (index > lastIndex) {
              newParts.push(part.substring(lastIndex, index));
            }
            newParts.push(<span
              className="highlight-search-color">{part.substring(index, index + term.length)}</span>);
            lastIndex = index + term.length;
          }
          if (lastIndex < part.length) {
            newParts.push(part.substring(lastIndex));
          }
        } else {
          newParts.push(part);
        }
      });
      parts = newParts;
    });

    return <span>{parts}</span>;
  }


  return (
    <CardContent textAlign="left">
      <CardHeader className="card-header">{highlightText(title, filters.search)}</CardHeader>
      <CardMeta className="card-meta">{<span>{highlightText(creatorsText, filters.search)}</span>}</CardMeta>
      <CardDescription className="card-description">{highlightText(description, filters.search)}</CardDescription>
      <CardContent className="card-extra" extra>
        {committedString}
      </CardContent>
    </CardContent>

  );
};

export default RecordCardContent;
