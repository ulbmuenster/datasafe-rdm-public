// This file is part of datasafe-RDM
// Copyright (C) 2023-2024 CERN.
// Copyright (C) 2023-2026 University of Münster.
//
// datasafe-RDM is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see LICENSE file for more
// details.

import _isEmpty from "lodash/isEmpty";
import React, { Component } from "react";
import { Modal, Loader, Container, Table, Grid, Item, Label } from "semantic-ui-react";
import PropTypes from "prop-types";
import { ErrorMessage, Image } from "react-invenio-forms";
import { i18next } from "@datasafe_translations/i18next";
import { AddUserGroupAccessModal } from "./AddUserGroupAccessModal";
import {
  accessDropdownOptions,
  UserGroupAccessSearchResultItem,
} from "./UserGroupAccessSearchResultItem";

export class AccessUsersGroups extends Component {
  componentWillUnmount() {
    this.cancellableAction && this.cancellableAction.cancel();
  }

  render() {
    const {
      record,
      permissions,
      endpoint,
      searchType,
      results,
      loading,
      error,
      onGrantAddedOrDeleted,
      onPermissionChanged,
    } = this.props;
    const recOwner = record?.expanded?.parent?.access?.owned_by;

    let emptyResultText = "";
    let tableHeaderText = "";
    if (searchType === "user") {
      emptyResultText = i18next.t("No user has access to this dataset yet.");
      tableHeaderText = i18next.t("Name");
    }
    if (searchType === "role") {
      emptyResultText = i18next.t("No group has access to this dataset yet.");
      tableHeaderText = i18next.t("Groups with access");
    }

    const versionIndex = record?.versions?.index;
    const isLatestVersion = record?.versions["is_latest"];
    const isLatestDraft = record?.versions["is_latest_draft"];
    const showVersionsWarning = versionIndex > 1 || (versionIndex === 1 && isLatestDraft === false && isLatestVersion === false);

    return (
      <>
        {error && (
          <ErrorMessage
            header={i18next.t("Something went wrong")}
            content={error?.response?.data?.message || error.message}
            icon="exclamation"
            className="text-align-left"
            negative
            size="mini"
          />
        )}
        <Modal.Content className="share-content">
          {loading && <Loader active />}
          {!loading && results !== undefined && (
            <>
              <AddUserGroupAccessModal
                isComputer={false}
                accessDropdownOptions={accessDropdownOptions}
                results={results}
                record={record}
                onGrantAddedOrDeleted={onGrantAddedOrDeleted}
                searchType={searchType}
                endpoint={endpoint}
              />
              <p id="access-helptext">
                {i18next.t("Add members of the University of Münster as authorized users.")} {i18next.t(" People with access will get an email if you archive this dataset.")}
                {showVersionsWarning && <br />}
                <strong>
                  {showVersionsWarning &&
                    <br /> && i18next.t("Changing access rights applies to all versions of a dataset.")}
                </strong>
              </p>
              <Table className="">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell width={8}>{tableHeaderText}</Table.HeaderCell>
                    <Table.HeaderCell data-label="Access" width={4}>
                      {i18next.t("Rights")}
                    </Table.HeaderCell>
                    <Table.HeaderCell textAlign="center" width={4}>
                      <AddUserGroupAccessModal
                        isComputer
                        accessDropdownOptions={accessDropdownOptions}
                        results={results}
                        record={record}
                        onGrantAddedOrDeleted={onGrantAddedOrDeleted}
                        searchType={searchType}
                        endpoint={endpoint}
                      />
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {searchType === "user" && recOwner && (
                    <Table.Row>
                      <Table.Cell width={4}>
                        <Grid textAlign="left" verticalAlign="middle">
                          <Grid.Column>
                            <Item className="flex">
                              {/*<Image*/}
                              {/*  src={recOwner.links.avatar}*/}
                              {/*  avatar*/}
                              {/*  className="rel-ml-1"*/}
                              {/*  alt=""*/}
                              {/*/>*/}
                              <Item.Content className="ml-10 p-0">
                                <Item.Header
                                  className={`flex align-items-center ${
                                    !recOwner.description ? "mt-5" : ""
                                  }`}
                                >
                                  <b className="mr-10">
                                    {recOwner.profile?.full_name || recOwner.username}
                                  </b>
                                  {recOwner.is_current_user && (
                                    <Label size="tiny" className="primary">
                                      {i18next.t("You")}
                                    </Label>
                                  )}
                                </Item.Header>
                                {recOwner.profile?.affiliations && (
                                  <Item.Meta>
                                    {recOwner.profile?.affiliations}
                                  </Item.Meta>
                                )}
                              </Item.Content>
                            </Item>
                          </Grid.Column>
                        </Grid>
                      </Table.Cell>

                      <Table.Cell
                        textAlign="left"
                        data-label={i18next.t("Access")}
                        width={8}
                      >
                        {i18next.t("Owner")}
                      </Table.Cell>
                      {/*  <Table.Cell width={3} />*/}
                    </Table.Row>
                  )}
                  {results.map((result) => (
                    <UserGroupAccessSearchResultItem
                      key={result.subject.id}
                      result={result}
                      permissions={permissions}
                      onGrantAddedOrDeleted={onGrantAddedOrDeleted}
                      onPermissionChanged={onPermissionChanged}
                      endpoint={endpoint}
                      searchType={searchType}
                    />
                  ))}
                </Table.Body>
              </Table>
            </>
          )}
          {!loading && !error && _isEmpty(results) && (
            <Container className="mt-10" textAlign="left">
              {/*<h5>{emptyResultText}</h5>*/}
            </Container>
          )}
        </Modal.Content>
      </>
    );
  }
}

AccessUsersGroups.propTypes = {
  record: PropTypes.object.isRequired,
  permissions: PropTypes.object.isRequired,
  endpoint: PropTypes.string.isRequired,
  searchType: PropTypes.oneOf(["group", "role", "user"]).isRequired,
  onGrantAddedOrDeleted: PropTypes.func.isRequired,
  onPermissionChanged: PropTypes.func.isRequired,
  results: PropTypes.array,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
};