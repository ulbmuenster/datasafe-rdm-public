import { getCookie } from "../utils/helperFunctions";
import $ from "jquery";
/*******************************************************************************/
/*  Add functionality to "Create new version" button when page is loaded fully */
/*******************************************************************************/
document.addEventListener("DOMContentLoaded", function () {
  addEventListenerToNewVersionButton();

  // Initialize popup for versioning help icon using imported jQuery
  $("#versioning-help").popup({
    on: "hover",
  });
});

function addEventListenerToNewVersionButton() {
  const newVersionButton = document.getElementById("datasafe-new-version-button");

  if (newVersionButton) {
    newVersionButton.addEventListener("click", async function() {

      const newVersionWrapper = document.getElementById("recordVersions");
      const record = JSON.parse(newVersionWrapper.getAttribute("data-record"));

      // Show loading state
      newVersionButton.classList.add("loading", "disabled");

      // Build the call
      const url = record.links.versions;
      const csrfToken = getCookie("csrftoken");
      const headers = {
        "Accept": "application/vnd.inveniordm.v1+json",
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      };
      const options = {
        method: "POST",
        withCredentials: true,
        xsrfCookieName: "csrftoken",
        xsrfHeaderName: "X-CSRFToken",
        headers: headers,
      };

      try {
        const response = await fetch(url, options);
        const data = await response.json();
        window.location = data.links.self_html;
      } catch (error) {
        console.error(error);
        // revoke loading state
        newVersionButton.classList.remove("loading", "disabled");
      }
    });
  }
  return undefined;
}
