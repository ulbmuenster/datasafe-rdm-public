import { i18next } from "@datasafe_translations/i18next";
document.addEventListener("DOMContentLoaded", function () {
  const myself = document.getElementById("myself");
  const userListItems = document.querySelectorAll("#user-list li");
  const permissionMapping = {
    can_edit: i18next.t("Editor"),
    can_update_draft: i18next.t("Viewer"),
    can_view: i18next.t("Viewer"),
    edit: i18next.t("Editor"),
    manage: i18next.t("Manager"),
    preview: i18next.t("Viewer"),
    view: i18next.t("Viewer"),
    Owner: i18next.t("Owner"),
  };

  function getHighestPermission(permissions) {
    const permissionOrder = ["can_manage", "can_edit", "can_update_draft", "can_view"];
    for (const permission of permissionOrder) {
      if (permissions[permission]) {
        return permission;
      }
    }
    return null; // Return null if no permissions are found
  }

  userListItems.forEach(function (item) {
    const userId = item.getAttribute("data-user-id");
    const permission = item.getAttribute("data-permission");

    let permissionText;
    if (item.id === "myself") {
      const permissions = JSON.parse(permission);
      const highestPermission = getHighestPermission(permissions);
      permissionText = permissionMapping[highestPermission] || highestPermission;
    } else {
      permissionText = permissionMapping[permission] || permission;
    }

    fetch(`/api/users/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        const fullName = data.profile.full_name;
        item.innerHTML = `${fullName} <span class="text-muted">${permissionText}</span>`;
        if (item.id !== "myself") {
          const authorizedusersdiv = document.getElementById("authorized-users-div");
          authorizedusersdiv.classList.remove("loading");
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        item.innerHTML = "Error loading user data";
      });
  });
});
