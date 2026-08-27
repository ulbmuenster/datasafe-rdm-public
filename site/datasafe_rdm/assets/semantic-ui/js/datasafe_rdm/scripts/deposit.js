// This JS shows the share content container on the deposit form

// Dynamically removes the 'fixed-header' class from tables

// The script uses a MutationObserver to watch for changes in the DOM. When a table with the class 'ui table fixed-header' is added to the page, it removes the 'fixed-header' class.

// Key features:
// - Observes the entire document body for changes
// - Targets specifically tables with both 'ui table' and 'fixed-header' classes
// - Logs a message to the console when the class is removed

// # Share Content Styling

// The script also modifies the class of the element with the 'share-content' class. It adds additional classes to change its styling or layout.
import {
  removeChildWithTagName, removeFirstChildIconfromElement, addPeopleModalMutationsObserver,
} from "../utils/helperFunctions";
import { i18next } from "../../../translations/datasafe_rdm/i18next";

// Select the node where the mutations should be observed
const targetNode = document.body;

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

function changeClassOfShareTable() {
  let tables = document.querySelectorAll(".ui.table.fixed-header");
  if (tables.length > 0 && tables.length === 1) {
    tables.forEach((table) => {
      table.classList.remove("fixed-header");
    });
  }
}

function exchangeAccordionTitleIcons() {
  const AccordionIcons = document.querySelectorAll(".ui.accordion .title i.icon");
  if (AccordionIcons.length > 0) {
    for (const accordionIcon of AccordionIcons) {
      if (accordionIcon.classList.contains("angle")) {

        const icon = document.createElement("i");
        icon.classList.add("icon", "arrow", "right", "circular");
        accordionIcon.insertAdjacentElement("afterend", icon);
        accordionIcon.remove();
      }
    }
  }
}

function adjustDepositformStatusBox() {
  // Adjust positioning of the statusBox dynamically based on the header ( plus potential banners) height
  const siteHeader = document.querySelector("header.theme.header");
  const depositFormSidebar = document.getElementById("deposit-sidebar");
  const stickyStatusBoxWrapper = depositFormSidebar?.querySelector("div:first-child");
  const headerHeight = siteHeader?.offsetHeight || 137;
  const distanceToHeader = 24;
  stickyStatusBoxWrapper.style.top = `${headerHeight + distanceToHeader}px`;

  //  Remove icon with popup from status box header
  const depositFormStatusBox = document.querySelector(".center.aligned.sixteen.wide.column");
  if (depositFormStatusBox) {
    removeChildWithTagName(depositFormStatusBox, "I");
  }
}

function changeClassesOfDeleteButton() {
  const deleteButton = document.querySelector("button#delete-button");
  if (deleteButton) {
    deleteButton.classList.remove("labeled");
  }
}

function changeSaveButton() {
  const saveButton = document.querySelector("button#save-button");
  if (saveButton) {
    saveButton.classList.remove("labeled");
    removeFirstChildIconfromElement(saveButton);
    saveButton.setAttribute("type", "button");
    if (saveButton.textContent === "Save draft") {
      saveButton.textContent = i18next.t("Save");
    }
  }
}

function removePeoplesIconsFromShareAccessTable() {
  // Remove Peoples' Icons from access rights table
  const peoplesIcons = document.querySelectorAll("#access-rights table img");
  if (peoplesIcons.length > 0) {
    for (const peopleIcon of peoplesIcons) {
      peopleIcon.remove();
    }
  }
}

function adjustFilesComponent() {
//   Adjust buttons
  const addMoreButton = document.querySelector(".uppy-DashboardContent-addMoreCaption");
  const addMoreButtonIcon = document.querySelector(".uppy-DashboardContent-addMore > .uppy-c-icon");
  const backButton = document.querySelector(".uppy-DashboardContent-back");
  const uploadButton = document.querySelector(".uppy-StatusBar-actionBtn--upload");

  if (!backButton?.classList.contains("bg-white")) {
    backButton?.classList.add("ui", "small", "tertiary", "button", "bg-white");
  }
  if (addMoreButtonIcon) {
    addMoreButtonIcon?.remove();
  }
  if (!addMoreButton?.classList.contains("small")) {
    addMoreButton?.classList.add("ui", "small", "button");
    addMoreButton?.classList.remove("uppy-DashboardContent-addMoreCaption");
  }
  if (uploadButton && !uploadButton?.classList.contains("primary")) {
    uploadButton.className = "";
    uploadButton?.classList.add("ui", "small", "primary", "button");
  }

//     Adjust borders dynamically
  const uppyDashboardInner = document.querySelector(".uppy-Dashboard-inner");
  const uppyUploadedFilesTable = document.querySelector("#files-section  .ui.table");
  const isFileUploaded = !!uppyUploadedFilesTable;
  const isPreparingUpload = !!document.querySelector("#files-section .uppy-Dashboard-files");

  if (isFileUploaded) {
    uppyDashboardInner?.classList.add("connected");
    uppyUploadedFilesTable?.classList.add("connected");
  } else {
    uppyDashboardInner?.classList.remove("connected");
    uppyUploadedFilesTable?.classList.remove("connected");
  }
  if (isPreparingUpload) {
    uppyDashboardInner?.classList.add("preparing");
  } else {
    uppyDashboardInner?.classList.remove("preparing");
  }
  if (isFileUploaded && isPreparingUpload) {
    uppyDashboardInner?.classList.add("uploaded-and-preparing");
  } else {
    uppyDashboardInner?.classList.remove("uploaded-and-preparing");
  }

  //  Remove preview column from fiels table
  const removeFirstColumnFromFilesTable = (tableElement) => {
    const headerCells = tableElement?.querySelectorAll(" thead > tr > th");
    const bodyRows = tableElement?.querySelectorAll("tbody > tr");

    if (headerCells?.length === 5) {
      headerCells[0].remove();
    }


    for (let i = 0; i < bodyRows?.length; i++) {
      if (bodyRows[i].childElementCount === 5) {
        bodyRows[i].firstChild.remove();
      }

    }
  };
  removeFirstColumnFromFilesTable(uppyUploadedFilesTable);

//   Adjust "retry" button after upload error
  const retryButton = document.querySelector(".uppy-StatusBar-actionBtn--retry");
  if (retryButton && !retryButton?.classList.contains("primary")) {
    retryButton.className = "";
    retryButton?.classList.add("ui", "small", "button", "primary");
    retryButton.firstChild.remove();
  }
}

function adjustTitleComponent() {
  // Title
  const titleIcon = document.querySelector("div.required.field.title-field > label > i");
  if (titleIcon) {
    titleIcon.remove();
  }
  // Title input element
  const titleField = document.querySelector("div.field.title-field");
  if (titleField) {
    titleField.classList.add("bg-white");
  }
  // Add title button
  const addTitleButton = document.querySelector("div.field.additional-titles > div.fields button:last-of-type");
  if (addTitleButton) {
    addTitleButton.classList.remove("labeled", "icon", "left");
    addTitleButton.classList.add("tertiary", "bg-white");
    removeFirstChildIconfromElement(addTitleButton);
  }
}

function adjustCreatibutorsComponent() {
  const creatibutorIcon = document.querySelector("label[for='metadata.creators']");
  if (creatibutorIcon) {
    removeFirstChildIconfromElement(creatibutorIcon);
  }

  const editAndRemoveButtons = document.querySelectorAll("label[for='metadata.creators'] + div.ui.list button");
  if (editAndRemoveButtons.length > 0) {
    for (let i = 0; i < editAndRemoveButtons.length; i++) {
      if (i % 2 === 0) {
        editAndRemoveButtons[i].classList.add("tertiary", "bg-white");
        if (!editAndRemoveButtons[i].firstElementChild) {
          const newIcon = window.document.createElement("i");
          newIcon.setAttribute("class", "trash alternate outline icon");
          newIcon.setAttribute("aria-hidden", "true");
          editAndRemoveButtons[i].insertBefore(newIcon, editAndRemoveButtons[i].firstChild);
        }
      } else {
        editAndRemoveButtons[i].classList.remove("primary");
        editAndRemoveButtons[i].classList.add("tertiary", "bg-white");
        if (!editAndRemoveButtons[i].firstElementChild) {
          const newIcon = window.document.createElement("i");
          newIcon.setAttribute("class", "pencil alternate icon");
          newIcon.setAttribute("aria-hidden", "true");
          editAndRemoveButtons[i].insertBefore(newIcon, editAndRemoveButtons[i].firstChild);
        }
      }
    }
  }

  const addCreatorButton = document.querySelector("label[for='metadata.creators'] + div.ui.list + button:first-of-type");
  if (addCreatorButton) {
    removeFirstChildIconfromElement(addCreatorButton);
    addCreatorButton.classList.remove("icon", "left", "labeled");
    addCreatorButton.classList.add("primary");
  }
  const creatibutorsList = document.querySelectorAll("label[for='metadata.creators'] + div.ui.list ")[0];
  const isCreatibutorsListEmpty = creatibutorsList?.firstElementChild;
  if (creatibutorsList && !isCreatibutorsListEmpty) {
    creatibutorsList.classList.add("empty");
  } else {
    creatibutorsList.classList.remove("empty");
  }
  // Move the add-myself-button into the creatibutors component
  const addMyselfButton = document.querySelector("#add-myself-button");
  if (addMyselfButton?.parentElement.classList.contains("container")) {
    addMyselfButton.remove();
    creatibutorsList.parentElement.appendChild(addMyselfButton);
  }
}

function adjustDescriptionComponent() {

  const descriptionIcon = document.querySelector("label[for='metadata.description']");
  if (descriptionIcon) {
    removeFirstChildIconfromElement(descriptionIcon);
  }
  const addDescriptionButton = document.querySelector("div.additional-descriptions > .fields > .field > button:last-of-type");
  if (addDescriptionButton) {
    addDescriptionButton.classList.remove("icon", "labeled", "left");
    addDescriptionButton.classList.add("tertiary", "bg-white");
    removeFirstChildIconfromElement(addDescriptionButton);
  }
}

function adjustAllModals() {
  // Remove inline styles from all modal headings
  const modalHeader = document.querySelector(".ui.modal > h2.header:first-of-type");
  if (modalHeader) {
    modalHeader.classList.remove("pb-10");
    modalHeader.classList.remove("pt-10");
  }

  // Remove Icons from  all modal actions buttons
  const modalActionsButtons = document.querySelectorAll(".ui.modal > .actions > button");
  for (const button of modalActionsButtons) {
    removeFirstChildIconfromElement(button);
    button?.classList.remove("labeled", "icon", "mini", "small");
  }
}

function adjustDeleteDraftModal() {
  // Add a DOM elements element to mimik the Dashboard delete modal
  const depositDeleteModal = document.querySelector(".ui.tiny.modal");

  if (depositDeleteModal) {
    const existingHeader = depositDeleteModal.querySelector(".header");

    if (!existingHeader) {

      // Add a header
      const deleteModalHeader = document.createElement("div");
      const textContent = document.createTextNode(i18next.t("Do you really want to delete this draft?"));
      deleteModalHeader.classList.add("header");
      deleteModalHeader.appendChild(textContent);
      depositDeleteModal.insertBefore(deleteModalHeader, depositDeleteModal.firstChild);

      // Add the modal content
      const modalContent = depositDeleteModal.querySelector(".content");
      modalContent.textContent = i18next.t("Deleted drafts cannot be restored!");

      // Change the cancel button
      const cancelButton = depositDeleteModal.querySelector("button:first-of-type");
      cancelButton.textContent = i18next.t("Cancel");

      //  Change the delete button
      const deleteButton = depositDeleteModal.querySelector("button:last-of-type");
      deleteButton.classList.add("primary");
      deleteButton.classList.remove("negative");
      deleteButton.textContent = i18next.t("Delete");

      // Create the close Icon and emulate clicking on the close button
      const closeIcon = document.createElement("i");
      closeIcon.classList.add("icon", "close");
      const clickOnCancelButton = () => {
        const clickEvent = new MouseEvent("click", {
          view: window, bubbles: true, cancelable: true,
        });
        cancelButton.dispatchEvent(clickEvent);
      };
      closeIcon.addEventListener("click", clickOnCancelButton);
      depositDeleteModal.insertBefore(closeIcon, depositDeleteModal.firstChild);

    }
  }
}

function adjustAddCreatorsModal() {
  // Remove radio buttons from "Add creator" modal
  const addCreatorModalHeader = document.querySelector("h2.header");
  const addCreatorModalContent = addCreatorModalHeader?.nextElementSibling;
  const addCreatorModalFields = addCreatorModalContent?.firstElementChild?.firstElementChild;
  if (addCreatorModalFields?.classList[0] === "fields") {
    const addCreatorModalRadioButtons = addCreatorModalFields.querySelectorAll(".field.invenio-radio-field");
    addCreatorModalRadioButtons?.forEach((element) => element.remove());
  }

  // Remove Role select field from Creatibutors modal
  const selectField = document.querySelector("div.ui.fluid.selection.scrolling.dropdown");
  const selectFieldWrapper = selectField?.parentElement;
  if (selectFieldWrapper && selectFieldWrapper.tagName === "DIV" && selectFieldWrapper.classList.contains("field") && selectFieldWrapper.classList.contains("invenio-select-field")) {
    selectFieldWrapper.remove();
  }
}

function addCreatorModalMutattionsObserver(addCreatorModalForm, addCreatorModalDropdowns) {
  const mutationObserver = new MutationObserver(keepClassBgWhite);
  const targetNode = addCreatorModalForm;
  const config = { attributes: true, childList: true, subtree: true };
  let connected = false;

  if (addCreatorModalForm && !connected) {
    connected = true;
    mutationObserver.observe(targetNode, config);
  } else if (!addCreatorModalForm) {
    connected = false;
    mutationObserver.disconnect();
  }

  function keepClassBgWhite(mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.type === "attributes") {
        addCreatorModalDropdowns?.forEach((element) => {
          if (!element.classList.contains("bg-white")) {
            element.classList.add("bg-white");
          }
        });
      }
    }
  }
}

function addBgWhiteClasses() {
  const fundingModalInput = document.querySelector(".ui.input input[name='selectedFunding.award.number']");
  if (fundingModalInput) {
    if (!fundingModalInput.parentElement.classList.contains("bg-white")) {
      fundingModalInput.parentElement.classList.add("bg-white");
    }
  }
  const addPeopleModal = document.getElementById("add-people-modal");
  const peopleSearch = addPeopleModal?.querySelector(".ui.multiple.search.selection.dropdown");
  if (!peopleSearch?.classList.contains("bg-white")) {
    peopleSearch?.classList.add("bg-white");
  }

  const addCreatorFamilyNameInput = document.getElementById("person_or_org.family_name");
  const addCreatorGivenNameInput = document.getElementById("person_or_org.given_name");
  const addCreatorModalForm = addCreatorFamilyNameInput?.parentElement.parentElement.parentElement.parentElement;
  const addCreatorModalDropdowns = addCreatorModalForm?.querySelectorAll(".ui.dropdown");

  if (addCreatorFamilyNameInput) {
    if (!addCreatorFamilyNameInput.parentElement.parentElement.classList.contains("bg-white")) {
      addCreatorFamilyNameInput.parentElement.parentElement.classList.add("bg-white");
    }
  }
  if (addCreatorGivenNameInput) {
    if (!addCreatorGivenNameInput.parentElement.parentElement.classList.contains("bg-white")) {
      addCreatorGivenNameInput.parentElement.parentElement.classList.add("bg-white");
    }
  }
  addCreatorModalDropdowns?.forEach((element) => {
    if (!element.classList.contains("bg-white")) {
      element.classList.add("bg-white");
    }
  });

// Instantiaing a Mustationsobserver to keep the class "bg-white" from being overwritten
  addCreatorModalMutattionsObserver(addCreatorModalForm, addCreatorModalDropdowns);
  addPeopleModalMutationsObserver();
}

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      changeClassOfShareTable();
      exchangeAccordionTitleIcons();
      adjustDepositformStatusBox();
      changeClassesOfDeleteButton();
      changeSaveButton();
      adjustFilesComponent();
      removePeoplesIconsFromShareAccessTable();
      adjustTitleComponent();
      adjustCreatibutorsComponent();
      adjustDescriptionComponent();
      adjustAllModals();
      adjustDeleteDraftModal();
      adjustAddCreatorsModal();
      addBgWhiteClasses();


    }
  }

  // observer.disconnect(); // Optional: Disconnect observer after the desired changes are made
};

// Create an instance of MutationObserver with the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);

addPeopleModalMutationsObserver();