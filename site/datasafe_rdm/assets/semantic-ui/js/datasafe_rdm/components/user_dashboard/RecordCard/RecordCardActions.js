import React from "react";
import { http } from "react-invenio-forms";
import {
  Button,
  Header,
  Icon,
  Modal,
  ModalActions,
  ModalContent,
  ModalDescription,
  ModalHeader,
} from "semantic-ui-react";
import { i18next } from "../../../../../translations/datasafe_rdm/i18next";

const RecordCardActions = (props) => {
  /* -------------------------------------------------------------------------------- */
  /*                        Props, state and hooks                                 */
  /* -------------------------------------------------------------------------------- */
  const { isDraft, isOwner, uncommittedChanges, link, recordOrDraftId } = props;
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const showDeleteButton = isDraft && isOwner;
  /* -------------------------------------------------------------------------------- */
  /*                           Variables and Functions                                */
  /* -------------------------------------------------------------------------------- */
  const handleDeleteDraft = async (draftID) => {
    // send  DELETE to "/api/records/" + draftID + "/draft"
    const apiUrl = "/api/records/" + draftID + "/draft";
    try {
      await http.delete(apiUrl);
    } catch (error) {
      console.error("Error deleting draft:", error);
      return null;
    } finally {
      setOpenDeleteModal(false);
      window.location.reload();
    }
  };
  /* -------------------------------------------------------------------------------- */
  /*                                Return statement                                  */
  /* -------------------------------------------------------------------------------- */
  return (
    <>
      {!isDraft && (
        <Button size={"mini"} primary href={link} draggable="false">
          <Icon name="eye" />
          {i18next.t("View")}
        </Button>
      )}
      {isDraft && (
        <Button size={"mini"} href={link.replace("/records/", "/uploads/")} draggable="false">
          <Icon name="pencil alternate" />
          {i18next.t("Edit")}
        </Button>
      )}
      {uncommittedChanges && (

        <Button size={"mini"} href={link.replace("/records/", "/uploads/")} draggable="false">
          <Icon name="pencil alternate" />
          {i18next.t("Edit pending")}
        </Button>
      )}
      {showDeleteButton && (
        <Modal
          closeIcon
          size={"tiny"}
          onClose={() => setOpenDeleteModal(false)}
          onOpen={() => setOpenDeleteModal(true)}
          open={openDeleteModal}
          trigger={
            <Button size={"mini"} className="tertiary bg-white" draggable="false">
              <Icon name="trash alternate outline" />
              {i18next.t("Delete")}
            </Button>
          }
        >
          <ModalHeader>
            {i18next.t("Do you really want to delete this draft?")}
          </ModalHeader>
          <ModalContent>
            <ModalDescription>
              {i18next.t("Deleted drafts cannot be restored!")}
            </ModalDescription>
          </ModalContent>
          <ModalActions>
            <Button
              className="left floated"
              onClick={() => setOpenDeleteModal(false)}
            >
              {/*<Icon name="remove" />*/}
              {i18next.t("Cancel")}
            </Button>
            <Button
              primary
              onClick={() => handleDeleteDraft(recordOrDraftId)}
            >
              {/*<Icon name="trash alternate outline" />*/}
              {i18next.t("Delete")}
            </Button>
          </ModalActions>
        </Modal>
      )}
    </>
  );
};

export default RecordCardActions;
