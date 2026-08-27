// This file is part of datasafe-RDM
// Copyright (C) 2024 CERN.
// Copyright (C) 2024 KTH Royal Institute of Technology.
// Copyright (C) 2023-2026 University of Münster.
//
// datasafe-RDM is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see LICENSE file for more
// details.

import React, { Component } from "react";
import { Button, Modal, Checkbox } from "semantic-ui-react";
import { i18next } from "@datasafe_translations/i18next";
import PropTypes from "prop-types";
import { SearchWithRoleSelection } from "@js/invenio_communities/members";
import { GrantAccessApi } from "../api/api";
import { UsersApi } from "@js/invenio_communities/api";
import { GroupsApi } from "@js/invenio_communities/api";

export class AddUserGroupAccessModal extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false, message: undefined };
  }

  onSuccess = () => {
    const { onGrantAddedOrDeleted, endpoint, searchType } = this.props;
    onGrantAddedOrDeleted(`${endpoint}?expand=true`, searchType);
    this.handleCloseModal();
  };

  updateMessage = (message) => {
    this.setState({ message: message });
  };

  handleOpenModal = () => this.setState({ open: true });
  handleCloseModal = () => {
    this.setState({ open: false });
  };

  searchEntities = () => {
    const { searchType } = this.props;
    if (searchType === "user") {
      const usersClient = new UsersApi();
      return usersClient.suggestUsers;
    }
    if (searchType === "role") {
      const groupsClient = new GroupsApi();
      return groupsClient.getGroups;
    }
  };

  render() {
    const { results, record, isComputer, accessDropdownOptions, searchType } =
      this.props;
    const { open, message } = this.state;

    const api = new GrantAccessApi(record);

    const existingIds = [record.parent?.access?.owned_by?.user];
    results.forEach((result) => {
      existingIds.push(result?.subject?.id);
    });

    let addButtonText = "";
    let searchBarTitle = "";
    let searchBarTooltip = "";
    let searchBarPlaceholder = "";
    let doneButtonTipType = "";
    if (searchType === "user") {
      addButtonText = i18next.t("Add people");
      searchBarTitle = "";
      searchBarTooltip = "";
      searchBarPlaceholder = i18next.t("Search for name or e-mail address");
      doneButtonTipType = i18next.t("users");
    }
    if (searchType === "role") {
      addButtonText = i18next.t("Add groups");
      searchBarTitle = i18next.t("Group");
      searchBarPlaceholder = i18next.t("Search for groups");
      doneButtonTipType = i18next.t("groups");
    }

    return (
      <Modal
        id="add-people-modal"
        role="dialog"
        closeIcon
        onClose={this.handleCloseModal}
        onOpen={this.handleOpenModal}
        closeOnDimmerClick={false}
        open={open}
        aria-label={addButtonText}
        trigger={
          <Button
            className={!isComputer ? "mobile only tablet only mb-15" : ""}
            content={addButtonText}
            primary
            size="mini"
            type="button"
            floated={!isComputer ? "right" : undefined}
          />
        }
      >
        <Modal.Header as="h2">{addButtonText}</Modal.Header>
        <SearchWithRoleSelection
          key="access-users"
          roleOptions={accessDropdownOptions}
          modalClose={this.handleCloseModal}
          action={api.createGrants}
          fetchMembers={this.searchEntities()}
          onSuccessCallback={this.onSuccess}
          searchBarTitle={<label>{searchBarTitle}</label>}
          searchBarTooltip={searchBarTooltip}
          doneButtonText={i18next.t("Add")}
          doneButtonIcon="plus"
          radioLabel={i18next.t("Access rights")}
          message={message}
          searchType={searchType}
          notify={false}
          doneButtonTip={i18next.t("You are about to add")}
          doneButtonTipType={doneButtonTipType}
          existingEntities={existingIds}
          existingEntitiesDescription={i18next.t("Access already granted")}
          searchBarPlaceholder={searchBarPlaceholder}
        />
      </Modal>
    );
  }
}

AddUserGroupAccessModal.propTypes = {
  record: PropTypes.object.isRequired,
  results: PropTypes.array.isRequired,
  isComputer: PropTypes.bool.isRequired,
  accessDropdownOptions: PropTypes.array.isRequired,
  onGrantAddedOrDeleted: PropTypes.func.isRequired,
  endpoint: PropTypes.string.isRequired,
  searchType: PropTypes.oneOf(["group", "role", "user"]).isRequired,
};