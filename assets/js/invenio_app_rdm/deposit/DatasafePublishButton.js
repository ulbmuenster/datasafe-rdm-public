// This file is part of Invenio-RDM-Records
// Copyright (C) 2020-2023 CERN.
// Copyright (C) 2020-2022 Northwestern University.
//
// Invenio-RDM-Records is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { i18next } from "@datasafe_translations/i18next";
import { connect as connectFormik } from "formik";
import _get from "lodash/get";
import _omit from "lodash/omit";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Checkbox, Button, Icon, Message, Modal } from "semantic-ui-react";
import {
  DepositFormSubmitActions,
  DepositFormSubmitContext,
} from "@js/invenio_rdm_records/src/deposit/api/DepositFormSubmitContext";
import { DRAFT_PUBLISH_FAILED_WITH_VALIDATION_ERRORS } from "@js/invenio_rdm_records/src/deposit/state/types";
import { DRAFT_PUBLISH_STARTED } from "@js/invenio_rdm_records/src/deposit/state/types";

class PublishButtonComponent extends Component {
  state = {
    isConfirmModalOpen: false,
    isCheckboxChecked: false, // First checkbox state
    isSecondCheckboxChecked: false, // Second checkbox state
  };

  static contextType = DepositFormSubmitContext;

  openConfirmModal = () => this.setState({ isConfirmModalOpen: true });

  closeConfirmModal = () => this.setState({ isConfirmModalOpen: false });

  handleTermsCheckboxChange = (event) => {
    this.setState({ isCheckboxChecked: event.target.checked });
  };

  handleNoPersonalDataCheckboxChange = (event) => {
    this.setState({ isSecondCheckboxChecked: event.target.checked });
  };

  handlePublish = (event, handleSubmit, publishWithoutCommunity) => {
    const { setSubmitContext } = this.context;
    const { formik, raiseDOINeededButNotReserved, isDOIRequired, noINeedDOI } = this.props;
    const { isCheckboxChecked, isSecondCheckboxChecked } = this.state;

    if (!isCheckboxChecked || !isSecondCheckboxChecked) {
      return; // Prevent publishing if either checkbox is not checked
    }

    const shouldCheckForExplicitDOIReservation =
      isDOIRequired !== undefined && // isDOIRequired is undefined when no value was provided from Invenio-app-rdm
      // isDOIRequired is undefined when no value was provided from Invenio-app-rdm !isDOIRequired &&
      noINeedDOI &&
      Object.keys(formik?.values?.pids).length === 0;
    if (shouldCheckForExplicitDOIReservation) {
      const errors = {
        pids: {
          doi: i18next.t("DOI is needed. You need to reserve a DOI before archiving."),
        },
      };
      formik.setErrors(errors);
      raiseDOINeededButNotReserved(formik?.values, errors);
      this.closeConfirmModal();
    } else {
      setSubmitContext(
        publishWithoutCommunity
          ? DepositFormSubmitActions.PUBLISH_WITHOUT_COMMUNITY
          : DepositFormSubmitActions.PUBLISH,
      );
      handleSubmit(event);
      this.closeConfirmModal();
    }
    // scroll top to show the global error
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  isDisabled = (values, isSubmitting, filesState) => {
    if (isSubmitting) {
      return true;
    }

    const filesEnabled = _get(values, "files.enabled", false);
    const filesArray = Object.values(filesState.entries ?? {});
    const filesMissing = filesEnabled && filesArray.length === 0;

    if (filesMissing) {
      return true;
    }

    // All files must be finished uploading
    const allCompleted = filesArray.every((file) => file.status === "finished");

    return !allCompleted;
  };

  render() {
    const {
      actionState,
      filesState,
      buttonLabel,
      publishWithoutCommunity,
      formik,
      publishModalExtraContent,
      raiseDOINeededButNotReserved,
      noINeedDOI,
      isDOIRequired,
      ...ui
    } = this.props;
    const {
      isConfirmModalOpen,
      isCheckboxChecked: isTermsCheckboxChecked,
      isSecondCheckboxChecked: isNoPersonalDataCheckboxChecked,
    } = this.state;
    const { values, isSubmitting, handleSubmit } = formik;

    const uiProps = _omit(ui, ["dispatch"]);
    return (
      <>
        <Button
          disabled={this.isDisabled(values, isSubmitting, filesState)}
          name="publish"
          onClick={this.openConfirmModal}
          primary
          loading={isSubmitting && actionState === DRAFT_PUBLISH_STARTED}
          content={buttonLabel}
          {...uiProps}
          type="button" // needed so the formik form doesn't handle it as submit button i.e enable HTML validation on required input fields
        />
        {isConfirmModalOpen && (
          <Modal
            open={isConfirmModalOpen}
            onClose={this.closeConfirmModal}
            size="small"
            closeIcon
            closeOnDimmerClick={false}
          >
            <Modal.Header>
              {i18next.t("Do you want to archive this dataset?")}
            </Modal.Header>
            {/* the modal text should only ever come from backend configuration */}
            <Modal.Content>
              <Message visible warning>
                <p>
                  <Icon name="warning sign" />{" "}
                  {i18next.t(
                    "Once the dataset has been archived, you can no longer change the associated files. However, you can update the metadata of the dataset at a later date.",
                  )}
                </p>
              </Message>
              {publishModalExtraContent && (
                <div dangerouslySetInnerHTML={{ __html: publishModalExtraContent }} />
              )}
              <div className="mb-5">
                <Checkbox
                  type="checkbox"
                  id="terms-checkbox"
                  label={
                    <label htmlFor="terms-checkbox">
                      {i18next.t(" I accept the ")}
                      <a href="/terms" target="_blank">{i18next.t(" terms of service ")}</a>
                      {i18next.t(" and ")}
                      <a href="/privacy" target="_blank">{i18next.t(" privacy policy ")}</a>
                      {i18next.t(" and confirm that the research dataset will be archived for ten years.")}
                    </label>
                  }
                  checked={isTermsCheckboxChecked}
                  onChange={this.handleTermsCheckboxChange}
                />

              </div>
              <div>
                <Checkbox
                  type="checkbox"
                  id="no-personal-data-checkbox"
                  label={
                    <label htmlFor="no-personal-data-checkbox">
                      {i18next.t(" I confirm that the research data does not contain any personal or pseudonymized data, or - if such data is contained - that it has been fully encrypted in accordance with current security standards. This does not apply to patient data, which must not be archived in datasafe.")}
                    </label>
                  }
                  checked={isNoPersonalDataCheckboxChecked}
                  onChange={this.handleNoPersonalDataCheckboxChange}
                />

              </div>
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={this.closeConfirmModal} floated="left">
                {i18next.t("Cancel")}
              </Button>
              <Button
                onClick={(event) =>
                  this.handlePublish(event, handleSubmit, publishWithoutCommunity)
                }
                primary
                content={buttonLabel}
                disabled={!isTermsCheckboxChecked || !isNoPersonalDataCheckboxChecked} // Disable the button if either checkbox is not checked
              />
            </Modal.Actions>
          </Modal>
        )}
      </>
    );
  }
}

PublishButtonComponent.propTypes = {
  buttonLabel: PropTypes.string,
  publishWithoutCommunity: PropTypes.bool,
  actionState: PropTypes.string,
  formik: PropTypes.object.isRequired,
  publishModalExtraContent: PropTypes.string,
  filesState: PropTypes.object,
  raiseDOINeededButNotReserved: PropTypes.func.isRequired,
  isDOIRequired: PropTypes.bool,
  noINeedDOI: PropTypes.bool,
};

PublishButtonComponent.defaultProps = {
  buttonLabel: i18next.t("Archive"),
  publishWithoutCommunity: false,
  actionState: undefined,
  publishModalExtraContent: undefined,
  filesState: undefined,
  isDOIRequired: undefined,
  noINeedDOI: undefined,
};

const mapStateToProps = (state) => ({
  actionState: state.deposit.actionState,
  publishModalExtraContent: state.deposit.config.publish_modal_extra,
  filesState: state.files,
  isDOIRequired: state.deposit.config.is_doi_required,
  noINeedDOI: state.deposit.noINeedDOI,
});

export const DatasafePublishButton = connect(mapStateToProps, (dispatch) => {
  return {
    raiseDOINeededButNotReserved: (data, errors) =>
      dispatch({
        type: DRAFT_PUBLISH_FAILED_WITH_VALIDATION_ERRORS,
        payload: { data: data, errors: errors },
      }),
  };
})(connectFormik(PublishButtonComponent));
