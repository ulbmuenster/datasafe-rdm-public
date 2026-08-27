// Copyright (C) 2023-2026 University of Münster.
//
// datasafe-RDM is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see LICENSE file for more
// details.

import { overrideStore } from "react-overridable";
import { http } from "react-invenio-forms";
import { i18next } from "../../../translations/datasafe_rdm/i18next";

export const createSubjectArray = (text) => {
  // if text is an array, create an obj for each element
  if (Array.isArray(text)) {
    let objArray = [];
    text.forEach((element) => {
      let obj = {
        key: element,
        subject: element,
        text: element,
        value: element,
      };
      objArray.push(obj);
    });
    return objArray;
  } else {
    return {
      key: text,
      subject: text,
      text: text,
      value: text,
    };
  }
};

export const addToOverrideStore = (emptyOverriddenComponents) => {
  for (const [key, value] of Object.entries(emptyOverriddenComponents))
    overrideStore.add(key, value);
};

// Function to add users to a project with specified roles
export async function addCrisUserPermissionsToInvenioDraft(members, draftID, accountID) {
  // Temp array to track processed users
  let temp_array = [];
  // Order roles in specific way to process them
  let ordered_roles = ["can_manage", "can_edit", "can_preview"];
  // Array to collect all grants
  let allGrants = [];

  // Loop through each role
  for (const role of ordered_roles) {
    console.log("Role: " + role);
    // Loop through each user belonging to the current role
    for (const user of members[role]) {
      const zivAccount = user["ziv_account"];
      console.log("  User: " + zivAccount);

      if (zivAccount === accountID || temp_array.includes(zivAccount)) {
        console.log(
          "Skipping adding user " +
          zivAccount +
          " to draft " +
          draftID +
          " with role " +
          role,
        );
      } else {
        // Add user to temp_array to avoid duplicates
        temp_array.push(zivAccount);

        // Fetch the Invenio user ID
        let user_id = await getUserIdFromInvenio(zivAccount);
        if (user_id === undefined || user_id === null) {
          console.error("The Invenio user ID for " + zivAccount + " cannot be fetched.");
        } else {
          // Collect grant information for this user
          allGrants.push({
            "subject": {
              "type": "user",
              "id": user_id,
            },
            "permission": role.split("_")[1],
          });
        }
      }
    }
  }

  // If there are any grants to process, send them in a single API call
  if (allGrants.length > 0) {
    await setPermissionsForInvenioDraft(draftID, allGrants);
  }
}

// New function to set permissions with a single API call
async function setPermissionsForInvenioDraft(draftID, grants) {
  console.log("Setting multiple grants for draft: " + draftID);

  const data = {
    grants: grants,
  };

  const apiUrl = "/api/records/" + draftID + "/access/grants";

  try {
    const response = await http.post(apiUrl, JSON.stringify(data));
    console.log("Successfully set permissions for draft " + draftID);
    return response;
  } catch (error) {
    console.error("Error setting permissions for draft:", error);
    return null;
  }
}

// Function to fetch user ID from InvenioRDM based on email
export async function getUserIdFromInvenio(userEmail) {
  const apiUrl = `/api/users?q=${userEmail}`;

  try {
    const response = await fetch(apiUrl);
    const userData = await response.json();
    return userData.hits.hits[0]?.id;
  } catch (error) {
    console.error("Error fetching user ID:", error);
    return null;
  }
}

// Function to fetch user options for project selection
export async function fetchProjectOptionsFromCris(accountID) {
  const apiUrl = "/api/user_projects?account_id=" + accountID;

  try {
    const response = await fetch(apiUrl);
    const projectData = await response.json();
    return mapProjectsToOptions(projectData);
  } catch (error) {
    console.error("Error fetching options:", error);
    return [];
  }
}

// Function determine if a user actually has CRIS projects
export async function userHasCrisProjects(accountID) {
  const apiUrl = "/api/user_projects?account_id=" + accountID;

  try {
    const response = await fetch(apiUrl);
    const projectData = await response.json();
    return projectData.length > 0;
  } catch (error) {
    console.error("Error checking CRIS projects:", error);
    return false;
  }
}

// Function to fetch project information from CRIS
export async function fetchProjectInformationFromCris(slug) {
  // extract the slug before the underscore from the slug
  const CRIS_ID = slug.split("_")[0];
  const apiUrl = `/api/project_metadata?project_id=${CRIS_ID}`;

  try {
    const response = await fetch(apiUrl);
    return await response.json();
  } catch (error) {
    console.error("Error fetching information from CRIS:", error);
    return null;
  }
}

// Function to map projects to options for select input
export function mapProjectsToOptions(projects) {
  return projects.map((project) => ({
    value: project.identifier,
    label: project.name,
  }));
}

// Function to add "No CRIS project import" option
export function addNoProjectOption(options) {
  options.unshift({ label: i18next.t("No CRIS project import"), value: "" });
  return options;
}

export function capitalizeFirstLetter(string) {
  if (string.length > 0) {
    return string[0].toUpperCase() + string.slice(1);

  }
}

// Retrieves a cookie from the browser --> getCookie("csrftoken")
export function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      let [cookieName, cookieVal] = cookie.trim().split("=", 2);
      if (cookieName === name) {
        cookieValue = decodeURIComponent(cookieVal);
        break;
      }
    }
  }
  return cookieValue;
}

/*
HTML/CSS Helper functions
 */
export function removeFirstChildIconfromElement(element) {
  if (element?.firstElementChild?.tagName === "I") {
    element.firstElementChild.remove();
  }
}

export function removeChildWithTagName(element, tagName) {
  if (element?.querySelector(`${tagName}:first-of-type`)) {
    element?.querySelector(`${tagName}:first-of-type`).remove();
  }
}

export function addPeopleModalMutationsObserver() {
  const mutationObserver = new MutationObserver(keepClassBgWhite);
  const targetNode = document.getElementById("add-people-modal");
  const dropdowns = targetNode?.querySelectorAll(".ui.dropdown");
  const config = { attributes: true, childList: true, subtree: true };
  let connected = false;

  if (targetNode && !connected) {
    connected = true;
    mutationObserver.observe(targetNode, config);
  } else if (!targetNode) {
    connected = false;
    mutationObserver.disconnect();
  }

  function keepClassBgWhite(mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.type === "attributes") {
        dropdowns?.forEach((element) => {
          if (!element.classList.contains("bg-white")) {
            element.classList.add("bg-white");
          }
        });
      }
    }
  }
}