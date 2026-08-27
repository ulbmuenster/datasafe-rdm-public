// Copyright (C) 2016-2022 CERN.
// Copyright (C) 2021-2022 Northwestern University.
// Copyright (C) 2023-2026 University of Münster.
//
// datasafe-RDM is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see LICENSE file for more
// details.

import { i18next } from "../../translations/datasafe_rdm/i18next.js";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { withCancel } from "react-invenio-forms";
import {
  Button,
  Checkbox,
  Form,
  FormField,
  FormGroup,
  FormInput,
  Grid,
  GridColumn,
  GridRow,
  Header,
  Icon,
  Message,
} from "semantic-ui-react";

import { RDMDepositDraftsService } from "@js/invenio_rdm_records/src/deposit/api/DepositDraftsService.js";
import { RDMDepositApiClient } from "@js/invenio_rdm_records/src/deposit/api/DepositApiClient.js";
import { RDMDepositRecordSerializer } from "@js/invenio_rdm_records/src/deposit/api/DepositRecordSerializer.js";

import PropTypes from "prop-types";
import Select from "react-select";
import {
  addCrisUserPermissionsToInvenioDraft,
  createSubjectArray,
  fetchProjectInformationFromCris,
  fetchProjectOptionsFromCris,
  userHasCrisProjects,
} from "./utils/helperFunctions";

class ArchiveRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      selectedOption: null,
      projectData: null,
      draftDescription: "",
      draftKeywords: [],
      draftDates: [],
      draftFunding: [],
      draftCreators: [],
      isImport: false,
      transferAccessRights: false,
      CrisFetchError: "",
      title: "",
      useCrisData: false,
      userHasCrisProjectsBool: "",
      titleError: false,
      titleErrorMessage: "",
      validationTimeout: null,
    };
  }

  async componentDidMount() {
    const userHasCrisProjectsBool = await userHasCrisProjects(accountID);

    if (userHasCrisProjectsBool) {
      const options = await fetchProjectOptionsFromCris(accountID);
      this.setState({
        options,
        userHasCrisProjectsBool: true,
      });
    } else {
      this.setState({ userHasCrisProjectsBool: false });
    }
  }

  componentWillUnmount() {
    this.cancellableCreate && this.cancellableCreate.cancel();
  }

  handleSelectChange = (selectedOption, { action }) => {
    let isImport = false;

    if (action === "select-option") {
      isImport = true;
      if (!this.state.title) {
        this.setState({ title: selectedOption.label });
      }
    } else if (action === "clear") {
      isImport = false;
    }

    this.setState({
      selectedOption,
      isImport,
    });
  };

  handleTitleChange = (event) => {
    const title = event.target.value;
    clearTimeout(this.state.validationTimeout);

    const validationTimeout = setTimeout(() => {
      let titleError = false;
      let titleErrorMessage = "";

      if (title.length > 0 && title.length < 3) {
        titleError = true;
        titleErrorMessage = i18next.t("Title must be at least 3 characters long.");
      }

      this.setState({ titleError, titleErrorMessage });
    }, 1500);

    this.setState({ title, validationTimeout });
  };

  handleUseCrisDataChange = (e, { checked }) => {
    this.setState({ useCrisData: checked });
  };

  handleTransferAccessRightsChange = (e, { checked }) => {
    this.setState({ transferAccessRights: checked });
  };

  handleSubmit = async (event) => {
    const { selectedOption, isImport, transferAccessRights, title } = this.state;
    const today = new Date().toISOString().split("T")[0];
    try {
      const defaultLocale = new Intl.Locale("en");
      const customFieldVocabularies = [];
      const recordSerializer = new RDMDepositRecordSerializer(
        defaultLocale,
        customFieldVocabularies,
      );
      const additionalApiConfig = {};
      const createDraftURL = "/api/records";
      const client = new RDMDepositApiClient(
        additionalApiConfig,
        createDraftURL,
        recordSerializer,
      );
      const service = new RDMDepositDraftsService(client);

      let draft;

      if (isImport) {
        try {
          const projectData = await fetchProjectInformationFromCris(
            selectedOption.value,
          );
          this.setState({ projectData });

          if (projectData) {
            let description = projectData["short_description"];
            let keywords = projectData["keywords"];
            let dateCollected = projectData["collection_period"];
            let funders = projectData["funders"][0];
            let awardNumber = projectData["award_number"];
            let members = projectData["members"];

            if (description) {
              this.setState({ draftDescription: description });
            }
            if (keywords) {
              this.setState({ draftKeywords: createSubjectArray(keywords) });
            }
            if (dateCollected) {
              this.setState({
                draftDates: [
                  { __key: 0, date: dateCollected, description: "", type: "collected" },
                ],
              });
            }
            if (funders) {
              this.setState({
                draftFunding: [
                  {
                    funder: {
                      id: "",
                      name: funders,
                    },
                    award: {
                      number: awardNumber,
                      title: awardNumber,
                    },
                  },
                ],
              });
            }
            if (members) {
              let ids = Object.values(members).reduce(
                (acc, val) => acc.concat(val),
                [],
              );

              let deduplicated = [
                ...new Map(ids.map((item) => [item["ziv_account"], item])).values(),
              ];

              let creators = [];
              deduplicated.forEach((d) => {
                creators.push({
                  person_or_org: {
                    type: "personal",
                    identifiers: [],
                    given_name: d["first_names"],
                    family_name: d["family_names"],
                  },
                  affiliations: [
                    {
                      id: "Q168426",
                      name: "University of Münster",
                    },
                  ],
                  role: "",
                });
              });

              this.setState({ draftCreators: creators });
            }
            draft = {
              access: {
                record: "restricted",
                files: "restricted",
              },
              files: {
                enabled: true,
              },
              custom_fields: {
                "datasafe:cris_id": selectedOption.value,
              },
              metadata: {
                creators: this.state.draftCreators,
                dates: this.state.draftDates,
                subjects: this.state.draftKeywords,
                publication_date: today,
                resource_type: { id: "dataset" },
                description: this.state.draftDescription,
                title: title,
                funding: this.state.draftFunding,
              },
            };
          }
        } catch (CrisFetchError) {
          console.log("Error fetching project data from CRIS:", CrisFetchError);
        }
      } else {
        draft = {
          access: {
            record: "restricted",
            files: "restricted",
          },
          files: {
            enabled: true,
          },
          metadata: {
            creators: this.state.draftCreators,
            dates: this.state.draftDates,
            subjects: this.state.draftKeywords,
            publication_date: today,
            resource_type: { id: "dataset" },
            description: this.state.draftDescription,
            title: title,
            funding: this.state.draftFunding,
          },
        };
      }

      this.cancellableCreate = withCancel(service.create(draft));
      const response = await this.cancellableCreate.promise;
      if (!response) {
        throw new Error("No response received from the server");
      }
      /*
       * Set Record Permissions if the user wants
       */

      if (isImport && transferAccessRights) {
        await addCrisUserPermissionsToInvenioDraft(
          this.state.projectData.members,
          response.data.id,
          accountID,
        );
      }

      window.location.href = response.data.links["self_html"];
    } catch (error) {
      this.setState({ error: error.message || i18next.t("An error occurred while creating the draft.") });
      console.error("Error creating draft:", error);
    }
  };

  handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      if (!this.state.title.trim()) {
        return;
      } else {
        this.handleSubmit();
      }
    }
  };

  render() {
    const {
      error,
      isImport,
      transferAccessRights,
      selectedOption,
      options,
      title,
      useCrisData,
      userHasCrisProjectsBool,
      titleError,
      titleErrorMessage,
    } = this.state;

    return (
      <>
        <Message hidden={!error} negative className="flashed">
          <Grid container centered>
            <GridColumn mobile={16} tablet={12} computer={12} textAlign="left">
              <strong>{error}</strong>
            </GridColumn>
          </Grid>
        </Message>

        <Grid container centered id="archive-grid">
          <GridRow>
            <GridColumn
              id="archive-card"
              className={"ui fluid raised card"}
              mobile={16}
              tablet={16}
              computer={8}
            >
              {/* header */}
              <Grid>
                <GridRow columns={2} id="headerrow">
                  <GridColumn width={13}>
                    <Header as="h4">{i18next.t("Archive a dataset")}</Header>
                  </GridColumn>
                  <GridColumn width={3} textAlign="right">
                    <Icon
                      id="close-icon"
                      aria-hidden="true"
                      name="close"
                      onClick={() => (window.location.href = "/me/home")}
                      // size={"large"}
                    />
                  </GridColumn>
                </GridRow>

                <GridRow>
                  <GridColumn textAlign="left">
                    <Form onSubmit={this.handleSubmit} onKeyDown={this.handleKeyDown}>
                      <FormGroup>
                        <FormInput
                          id="dataset-title"
                          value={title}
                          width={16}
                          label={i18next.t("Title")}
                          onChange={this.handleTitleChange}
                          required
                          className={`bg-white ${titleError ? "error" : ""}`}
                        />
                      </FormGroup>
                      {titleError && (
                        <div className="ui pointing red basic label title-error">
                          {titleErrorMessage}
                        </div>
                      )}
                      <FormGroup id="use-cris-data-checkbox">
                        {userHasCrisProjectsBool && (
                          <Checkbox
                            label={i18next.t(
                              "Import metadata from one of your CRIS projects",
                            )}
                            checked={useCrisData}
                            onChange={this.handleUseCrisDataChange}
                          />
                        )}
                      </FormGroup>
                      {useCrisData && (
                        <>
                          <FormGroup>
                            <FormField width={16}>
                              <Select
                                id="cris-datasets"
                                options={options}
                                width={16}
                                classNamePrefix="react-select-dropdown"
                                styles={{
                                  control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    border: state.isFocused
                                      ? "0px !important"
                                      : baseStyles.border,
                                    borderRadius: "8px",
                                    borderColor: "#b9b7b6",
                                    boxShadow: state.isFocused
                                      ? "0 0 0 1px #b9b7b6 !important"
                                      : baseStyles.boxShadow,

                                  }),

                                  menuList: (baseStyles, state) => ({
                                    ...baseStyles,
                                    borderTop: "none",
                                    border: state.isFocused
                                      ? "2px solid #b9b7b6 !important"
                                      : baseStyles.border,
                                    boxShadow: "0 0 0 1px #b9b7b6 !important",
                                    borderRadius: "8px",
                                  }),
                                  indicatorSeparator: () => ({
                                    display: "none",
                                  }),
                                  menu: (baseStyles, state) => ({
                                    ...baseStyles,
                                    marginTop: -2,
                                  }),
                                  option: (baseStyles, state) => ({
                                    ...baseStyles,
                                    backgroundColor: state.isFocused
                                      ? "#dcdbdb"
                                      : "white",
                                    color: "black",
                                  }),
                                }}
                                value={selectedOption}
                                placeholder={i18next.t(
                                  "Choose from your CRIS Projects",
                                )}
                                onChange={this.handleSelectChange}
                                isClearable
                              />
                            </FormField>
                          </FormGroup>
                          {isImport && (
                            <FormGroup id="transfer-access-rights-checkbox">
                              <Checkbox
                                label={i18next.t("Also transfer access rights")}
                                checked={transferAccessRights}
                                onChange={this.handleTransferAccessRightsChange}
                              />
                            </FormGroup>
                          )}
                        </>
                      )}

                      <FormGroup id={"archive-actions"}>
                        <Button
                          size={"medium"}
                          onClick={() => (window.location.href = "/me/home")}
                        >
                          {i18next.t("Cancel")}
                        </Button>
                        <Button
                          primary
                          size={"medium"}
                          disabled={
                            !title.trim() ||
                            title.length < 3 ||
                            (useCrisData && !selectedOption)
                          }
                          type="submit"
                        >
                          {i18next.t("Next")}
                        </Button>
                      </FormGroup>
                    </Form>
                  </GridColumn>
                </GridRow>
              </Grid>
            </GridColumn>
          </GridRow>
        </Grid>
      </>
    );
  }
}

ArchiveRecord.propTypes = {
  accountID: PropTypes.string.isRequired,
};

const domContainer = document.getElementById("archive-record");
const accountID = domContainer.dataset.userEmail.split("@")[0];

ReactDOM.render(<ArchiveRecord accountID={accountID} />, domContainer);
export default ArchiveRecord;
