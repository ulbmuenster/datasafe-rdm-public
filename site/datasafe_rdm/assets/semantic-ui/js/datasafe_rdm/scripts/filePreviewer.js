const previewerRow = document.getElementById("previewer-tr");
const previewLinkButtons = document.querySelectorAll("a.button.preview-link");


function removeActiveClassFromAllInteractRows() {
  const interactRows = document.querySelectorAll(".interact-row");
  for (const interactRow of interactRows) {
    if (interactRow.classList.contains("active")) {
      interactRow.classList.remove("active");
    }
  }
}

function removeSelectedClassFromAllPreviewLinkButtons() {
  for (const previewLinkButton of previewLinkButtons) {
    if (previewLinkButton.classList.contains("selected")) {
      previewLinkButton.classList.remove("selected");
    }
  }
}

function addEventlistenersToPreviewButtons() {
  for (const button of previewLinkButtons) {
    const buttonsInteractRow = button.parentElement.parentElement.parentElement;

    button.addEventListener("click", function() {

      if (buttonsInteractRow.classList.contains("active")) {
        event.preventDefault();
        removeActiveClassFromAllInteractRows();
        removeSelectedClassFromAllPreviewLinkButtons();
        previewerRow?.remove();
        return;
      }
      previewerRow?.remove();
      removeSelectedClassFromAllPreviewLinkButtons();
      removeActiveClassFromAllInteractRows();
      buttonsInteractRow?.classList.add("active");
      button.classList.add("selected");
      buttonsInteractRow?.after(previewerRow);
      if (window.innerWidth < 1280) {
        previewerRow.classList.remove("table-row");
        previewerRow.classList.add("block");
      } else {
        previewerRow?.classList.remove("block");
        previewerRow?.classList.add("table-row");
      }
    });
  }
}

addEventlistenersToPreviewButtons();