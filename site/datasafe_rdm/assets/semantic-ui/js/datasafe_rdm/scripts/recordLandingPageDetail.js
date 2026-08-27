// Copyright (C) 2023-2026 University of Münster.
//
// datasafe-RDM is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { i18next } from "../../../translations/datasafe_rdm/i18next";
import {
  getCookie,
  removeFirstChildIconfromElement,
  addPeopleModalMutationsObserver,
} from "../utils/helperFunctions";

/****************************************/
/*  Do things when page is loaded fully */

/****************************************/
addPeopleModalMutationsObserver();

document.addEventListener("DOMContentLoaded", function() {
  // Add event listener to "edit metadata" button
  const editButton = document.getElementById("datasaferdm-editbutton");
  if (editButton !== null) {
    editButton.addEventListener("click", async function() {
      this.disabled = true;
      const recid = this.dataset.recid;
      const url = `/api/records/${recid}/draft`;
      const csrfToken = getCookie("csrftoken");

      const requestOptions = {
        method: "POST",
        headers: {
          "Accept": "application/vnd.inveniordm.v1+json",
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({}),
      };

      try {
        await fetch(url, requestOptions);
        window.location = `/uploads/${recid}`;
      } catch (error) {
        console.error("Fetch error:", error.message);
        this.disabled = false; // Enable button if fetch fails
      }
    });
  }
  // Remove classes and the icon from share button
  const shareButton = document.querySelector("#datasaferdm-sharebutton button");
  shareButton.classList.remove("labeled", "icon", "fluid", "medium", "left");
  shareButton.classList.add("mini");
  removeFirstChildIconfromElement(shareButton);
  // Remove first and last divider in main card -> Additional details
  const firstDivider = document.querySelector(
    "#additional-details div.ui.divider:first-of-type",
  );
  firstDivider?.remove();

  const lastDivider = document.querySelector(
    "#additional-details div.ui.divider:last-of-type",
  );
  lastDivider?.remove();

  // Remove handle links in additional details for migrated datasets
  document.querySelectorAll(".details-list > dt + dd > a").forEach(link => {
    if (!link.innerHTML.includes("wwurdm")) return;

    const span = document.createElement("span");

    // Take over classes and ids
    if (link.className) span.className = link.className;
    if (link.id) span.id = link.id;

    span.innerHTML = link.innerHTML;

    link.replaceWith(span);
  });

  try {
    const subjectsRow = document.querySelector("div#keywords-and-subjects");
    if (subjectsRow) {
      const subjectsTitle = subjectsRow.previousElementSibling.previousElementSibling;
      if (subjectsTitle.tagName === "H2") {
        subjectsTitle.textContent = i18next.t("Tags");
      }
    } else {
      // pass = nothing happens
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
})
;

/*****************************************************/
/* Create an observer to react on changes to the dom */
/*****************************************************/
const targetNode = document.body;
const config = { attributes: true, childList: true, subtree: true };
const observer = new MutationObserver(applyChangesToPageDynamically);

function applyChangesToPageDynamically(mutationsList) {
  for (let mutation of mutationsList) {
    if (mutation.type === "childList") {
      // Remove link to view all versions
      const viewAllVersionsLink = document.querySelector("#recordVersions div.ui.grid.mt-0");
      viewAllVersionsLink?.remove();

      // Change share button's text
      const shareButton = document.querySelector("#datasaferdm-sharebutton > div > button");
      if (shareButton && !shareButton.classList.contains("changed")) {
        shareButton.classList.add("changed");
        shareButton.textContent = i18next.t("Change access rights");
      }

      // Adjust top style of the fullscreen file preview to not be overlayed by the header
      // To mask the margin-top when not in fullscreen give the wrapper a negative margin-top
      // This has to be done due to the top style being set vie an event
      const headerHeight = document.querySelector("header.theme.header").offsetHeight;
      const previewIframe = document.querySelector("#preview-iframe");
      const iframeWrapper = document.querySelector("#previewer-tr #files-preview-accordion-panel");

      if (!previewIframe?.getAttribute("margin-top")) {
        if (iframeWrapper) iframeWrapper.setAttribute("style", `margin-top:-${headerHeight}px`);
        if (previewIframe) previewIframe.setAttribute("style", `margin-top:${headerHeight}px`);
      }

      addPeopleModalMutationsObserver();
      // Remove small elements from preview table (hash value)
      // const smallElementsInTable = document.querySelectorAll("table small");
      // if (smallElementsInTable) {
      //   for (const smallElement of smallElementsInTable) {
      //     smallElement.remove();
      //   }
      // }
      // observer.disconnect();

      // Add claSS bg-white to a dropdown
      const addPeopleModal = document.getElementById("add-people-modal");
      const peopleSearch = addPeopleModal?.querySelector(".ui.multiple.search.selection.dropdown");
      if (!peopleSearch?.classList.contains("bg-white")) {
        peopleSearch?.classList.add("bg-white");
      }
    }
  }
}

observer.observe(targetNode, config);
