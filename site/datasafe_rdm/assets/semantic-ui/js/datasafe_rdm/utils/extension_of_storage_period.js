// Copyright (C) 2023-2026 University of Münster.
//
// datasafe-RDM is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see LICENSE file for more
// details.

import { i18next } from "@datasafe_translations/i18next";

const today = new Date();

document.addEventListener("DOMContentLoaded", function() {
  const urlParts = window.location.pathname.split("/");
  const recordId = urlParts[urlParts.length - 1];

  let purgeDate = null;
  let dateCommitted = null;

  fetch(`/api/records/${recordId}/versions?size=1000`)
    .then(response => response.json())
    .then(data => {
      if (data.hits && data.hits.total > 0) {
        // Note: If there is only one version of the record oldestVersion is the same as latestVersion

        // get the last entry of the hits.hits array, which is the oldest version
        const oldestVersion = data.hits.hits[data.hits.hits.length - 1];
        dateCommitted = new Date(oldestVersion.metadata.publication_date);

        // get the first entry of the hits.hits array, which is the latest version
        const latestVersion = data.hits.hits[0];
        purgeDate = new Date(latestVersion.custom_fields["datasafe:planned_purge_date"]);
      }

      displayExtendButton();
      showExtensionCard(purgeDate, dateCommitted);
      extendStoragePeriod();
    })
    .catch(error => {
      console.error("Error fetching record versions:", error);
    });
});

// This Functions checks if the extension button should be displayed and adds it to the DOM
function displayExtendButton() {
  const extensionButtonDiv = document.getElementById("extension-button-div");

  if (extensionButtonDiv) {
    const recordVersion = extensionButtonDiv.getAttribute("data-record-version") === "True";
    const showButton = extensionButtonDiv.getAttribute("data-show-button") === "True";

    if (recordVersion && showButton) {
      const button = document.createElement("button");
      button.className = "ui primary mini button";
      button.id = "extend-storage-period-button";
      button.textContent = i18next.t("Extend archiving period");

      extensionButtonDiv.appendChild(button);
    }
  }
}

// Function to create the text until the planned purge date for translation
function timeUntilPurgeText(purgeDate, extended, isOwner) {
  const daysUntilPurge = Math.ceil(Math.abs(purgeDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  let textContent;

  if (daysUntilPurge > 180) {
    const totalMonthsUntilPurge = Math.ceil(daysUntilPurge / 30);

    const remainingYears = Math.floor(totalMonthsUntilPurge / 12);
    const remainingMonths = totalMonthsUntilPurge % 12;

    if (remainingYears > 0) {
      textContent = i18next.t("In {{ remainingYears }} years and {{ remainingMonths }} month(s) the archiving period of this dataset expires.",
        { remainingYears: remainingYears, remainingMonths: remainingMonths });
    } else {
      textContent = i18next.t("In {{ remainingMonths }} months the archiving period of this dataset expires.",
        { remainingMonths: remainingMonths });
    }
  } else {
    textContent = i18next.t("In {{ daysUntilPurge }} day(s) the archiving period of this dataset expires.",
      { daysUntilPurge: daysUntilPurge });
  }

  if (!extended) {
    if (isOwner) {
      textContent += i18next.t(" You can extend it once by 5 years.");
    } else {
      textContent += i18next.t(" The owner or manager of the dataset can extend it once by 5 years.");
    }
  }

  return textContent;
}

// Control the display of the storage extension card
function showExtensionCard(purgeDate, dateCommitted) {
  // Convert 10 years to milliseconds for next comparison
  const tenYearsInMilliseconds = (10 * 365.25 * 24 * 60 * 60 * 1000) + (24 * 60 * 60 * 1000); // Account for leap years and add one day

  // To find out if the storage period was extended, calculate the difference between the planned purge date and the date the record was committed and compare it to 10 years
  // If the difference is greater than 10 years, we assume that the storage period was extended
  const isStoragePeriodExtended = Math.abs(purgeDate.getTime() - dateCommitted.getTime()) > tenYearsInMilliseconds;

  const isPurgeDateWithin180Days = purgeDate <= new Date(today.getTime() + 180 * 24 * 60 * 60 * 1000);

  // When the page is loaded, check if the storage period was extended and if the planned purge date is within 180 days and displays the storage extension card accordingly
  const storageExtensionCard = document.getElementById("storage-extension");
  const storageExtensionText = document.getElementById("storage-extension-text");
  const storageExtensionPeriodHeader = document.getElementById("extend-storage-period-header");
  const storageExtensionPeriodButton = document.getElementById("extend-storage-period-button");
  const isOwner =
    document.getElementById("extension-button-div").getAttribute("data-show-button") ===
    "True";

  // if the StoragePeriod has already been extended once, we won't show the card again
  if (isPurgeDateWithin180Days && isStoragePeriodExtended === false) {
    // offer the user to extend the storage period
    storageExtensionText.innerHTML = timeUntilPurgeText(purgeDate, false, isOwner);

    storageExtensionPeriodHeader.innerHTML = i18next.t("Extend archiving period");
    storageExtensionCard.style.display = "block";
  } else if (isStoragePeriodExtended === true) {
    // show the card but with different text
    storageExtensionCard.style.display = "block";
    storageExtensionPeriodHeader.innerHTML = i18next.t("Archiving period has been extended");
    storageExtensionText.innerHTML = timeUntilPurgeText(purgeDate, true, isOwner);
    storageExtensionText.parentElement.parentElement.style.paddingBottom = "0";

    // do not display the button
    if (storageExtensionPeriodButton) {
      storageExtensionPeriodButton.remove();
    } else {
      console.log("storageExtensionPeriodButton not found");
    }
  } else {
    // hide the card completely. This triggers if the planned purge date is more than 180 days in the future and the storage period was not extended yet
    storageExtensionCard.style.display = "none";
  }
}

// Function to extend the storage period using API calls
function extendStoragePeriod() {
  const extendStoragePeriodButton = document.getElementById("extend-storage-period-button");

  function getRecordIdFromUrl() {
    const pathParts = window.location.pathname.split("/");
    const recordIndex = pathParts.indexOf("records");
    return recordIndex !== -1 && pathParts[recordIndex + 1]
      ? pathParts[recordIndex + 1]
      : null;
  }

  function addYearsToDate(dateString, years) {
    const date = new Date(dateString);
    date.setFullYear(date.getFullYear() + years);
    return date.toISOString().split("T")[0];
  }

  if (extendStoragePeriodButton) {
    extendStoragePeriodButton.addEventListener("click", async function() {
      try {
        // Show loading state
        this.classList.add("loading", "disabled");

        // Show loading placeholder
        const container = document.getElementById("storage-extension");
        container.innerHTML = `
        <div class="ui placeholder">
          <div class="image header">
            <div class="line"></div>
            <div class="line"></div>
          </div>
          <div class="paragraph">
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
          </div>
        </div>
      `;

        // get record id from URL
        const recordId = getRecordIdFromUrl();
        if (!recordId) {
          throw new Error("Could not determine record ID from URL");
        }

        // Get CSRF token from cookie
        function getCookie(name) {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop().split(";").shift();
        }

        const csrfToken = getCookie("csrftoken");
        const headers = {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        };

        // First, fetch the current record data
        const recordResponse = await fetch(`/api/records/${recordId}`);
        if (!recordResponse.ok) {
          throw new Error("Failed to fetch record data");
        }

        const recordData = await recordResponse.json();

        // Second: Enable editing
        const draftResponse = await fetch(`/api/records/${recordId}/draft`, {
          method: "POST",
          headers: headers,
        });
        if (draftResponse.status !== 201) {
          throw new Error("Failed to enable editing of record");
        }

        // Third, update the record with extended purge date
        const updatedRecordData = { ...recordData };
        const currentPurgeDate = recordData.custom_fields["datasafe:planned_purge_date"];
        updatedRecordData.custom_fields["datasafe:planned_purge_date"] = addYearsToDate(
          currentPurgeDate,
          5,
        );
        // Add storage period extended flag
        updatedRecordData.custom_fields["datasafe:storageperiod_extended"] = true;

        const updateRequest = {
          method: "PUT",
          headers: headers,
          body: JSON.stringify(updatedRecordData),
        };
        const updateResponse = await fetch(
          `/api/records/${recordId}/draft`,
          updateRequest,
        );

        if (!updateResponse.ok) {
          throw new Error("Failed to update record");
        }

        // Lastly publish the draft
        const publishResponse = await fetch(
          `/api/records/${recordId}/draft/actions/publish`,
          {
            method: "POST",
            headers: headers,
          },
        );

        if (publishResponse.status !== 202) {
          throw new Error("Failed to publish draft");
        }

        const publishData = await publishResponse.json();

        // Replace container content without page reload
        container.innerHTML = `
          <h2 class="ui medium top attached header mt-0 extended" id="extend-storage-period-header">${i18next.t("Archiving Period was extended")}</h2>
          <div class="card-divider"></div>
          <div class="ui segment rdm-sidebar bottom attached pl-0 pr-0 pt-0">
            <div id="storage-extension-content" class="content">
              <p id="storage-extension-text">${i18next.t("The storage period has been successfully extended.")}</p>
            </div>
          </div>
      `;

        this.classList.remove("loading", "disabled");
      } catch (error) {
        // Remove loading state in case of error
        this.classList.remove("loading", "disabled");
        console.error("Error:", error);
        const container = document.getElementById("storage-extension"); // Replace with your container ID
        container.innerHTML = `
          <h2 class="ui medium top attached header mt-0 error" id="extend-storage-period-header">${i18next.t("Error extending storage period")}</h2>
          <div class="card-divider"></div>
          <div class="ui segment rdm-sidebar bottom attached pl-0 pr-0 pt-0">
            <div id="storage-extension-content" class="content">
              <p id="storage-extension-text">${i18next.t("There was an error extending the storage period.")}</p>
            </div>
          </div>
      `;
      }
    });
  }
}