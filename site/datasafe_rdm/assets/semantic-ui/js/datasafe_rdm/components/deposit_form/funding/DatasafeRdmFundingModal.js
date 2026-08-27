// This file is part of InvenioVocabularies
// Copyright (C) 2021-2024 CERN.
// Copyright (C) 2021 Northwestern University.
//
// Invenio is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { i18next } from "../../../../../translations/datasafe_rdm/i18next";
import { Formik, Field } from "formik";
import PropTypes from "prop-types";
import React, { useState, useRef, useEffect } from "react";
import { Grid, Modal, Button, Form, Icon } from "semantic-ui-react";
import * as Yup from "yup";
import AsyncCreatableSelect from "react-select/async-creatable";
import axios from "axios";
import { components } from "react-select";

const Input = (props) => <components.Input {...props} isHidden={false} />;

const ModalActions = {
  ADD: "add",
  EDIT: "edit",
};

const CustomFundingSchema = Yup.object().shape({
  selectedFunding: Yup.object().shape({
    funder: Yup.object().shape({
      name: Yup.string().required(i18next.t("Funder is required.")),
    }),
    award: Yup.object().shape({
      number: Yup.string(),
    }),
  }),
});

function FundingModal({
                        action,
                        mode: initialMode,
                        trigger,
                        onAwardChange,
                        searchConfig,
                        ...props
                      }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(initialMode);
  const [largeResultSet, setLargeResultSet] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const selectRef = useRef();
  const setFieldValueRef = useRef();

  // Set initial values when the modal opens
  useEffect(() => {
    if (initialFunding && initialFunding.selectedFunding) {
      const funder = initialFunding.selectedFunding.funder;
      if (funder) {
        setSelectedOption({
          value: funder.id,
          label: funder.name, // Assuming funder.name contains the name
        });
        setInputValue(funder.name); // Set the input value to the funder's name
      }
    }
  }, [initialFunding]);

  const openModal = () => setOpen(true);
  const closeModal = () => {
    setMode(initialMode);
    setOpen(false);
  };
  const onSubmit = (values, formikBag) => {
    formikBag.setSubmitting(false);
    formikBag.resetForm();
    setMode(initialMode);
    closeModal();
    onAwardChange(values.selectedFunding);
  };

  const initialFunding = {
    selectedFunding: action === ModalActions.EDIT ? props.initialFunding : {},
  };

  const FundingSchema = CustomFundingSchema;

  const loadOptions = async (inputValue) => {
    const response = await axios.get(`/api/funders?q=${inputValue}`);
    const totalHits = response.data.hits.total;
    const currentLocale = props.currentLocale;

    let newOptions = response.data.hits.hits.map((funder) => ({
      label: funder.acronym
        ? `${
          funder.title && funder.title[currentLocale]
            ? funder.title[currentLocale]
            : funder.name
        } [${funder.acronym}]${funder.country ? ` (${funder.country})` : ""}`
        : (funder.title && funder.title[currentLocale]
        ? funder.title[currentLocale]
        : funder.name) + (funder.country ? ` [${funder.country}]` : ""),
      value: funder.id,
    }));

    return newOptions;
  };

  const onInputChange = (inputValue, { action }) => {
    if (action === "input-change") {
      setInputValue(inputValue);
    }
  };

  const onChange = (option) => {
    setSelectedOption(option);
    setInputValue(option ? option.label : "");
    if (setFieldValueRef.current) {
      // Assuming option contains the funder object with a name property
      setFieldValueRef.current("selectedFunding.funder", {
        id: option ? option.value : "",
        name: option ? option.label : "", // Include the name here
      });
    }
  };

  const onFocus = () => selectedOption && selectRef.current.select.inputRef.select();

  return (
    <Formik
      initialValues={initialFunding}
      onSubmit={onSubmit}
      validationSchema={FundingSchema}
      validateOnChange={false}
      validateOnBlur={false}
      enableReinitialize
    >
      {({ values, resetForm, handleSubmit, setFieldValue }) => {
        setFieldValueRef.current = setFieldValue;

        return (
          <Modal
            role="dialog"
            centered={true}
            onOpen={openModal}
            open={open}
            trigger={React.cloneElement(trigger, {
              "aria-expanded": open,
              "aria-haspopup": "dialog",
            })}
            onClose={closeModal}
            closeIcon
            closeOnDimmerClick={false}
          >
            <Modal.Header as="h2" className="pt-10 pb-10">
              {i18next.t("Add funding")}
            </Modal.Header>
            <Modal.Content>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={16}>
                    <label>
                      {i18next.t("Select a funder ")}
                      <span>*</span>
                    </label>
                    <AsyncCreatableSelect
                      placeholder={i18next.t("Select...")}
                      ref={selectRef}
                      cacheOptions
                      loadOptions={loadOptions}
                      value={selectedOption}
                      inputValue={inputValue}
                      onInputChange={onInputChange}
                      onChange={onChange}
                      onFocus={onFocus}
                      controlShouldRenderValue={false}
                      components={{ Input }}
                      isClearable
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
                          backgroundColor: state.isFocused ? "#dcdbdb" : "white",
                          color: "black",
                        }),
                      }}
                      noOptionsMessage={() =>
                        i18next.t(
                          "Type the first letters of a funder to start searching.",
                        )
                      }
                      maxMenuHeight={200}
                      formatCreateLabel={(inputValue) => (
                        <div>
                          <Icon name="plus" />
                          <strong>
                            {i18next.t("Use \"{{inputValue}}\" as a new funder", {
                              inputValue,
                            })}
                          </strong>
                        </div>
                      )}
                      // isValidNewOption={(inputValue) => !!inputValue}
                      onCreateOption={(inputValue) => {
                        const newOption = { label: inputValue, value: inputValue };
                        setSelectedOption(newOption);
                        setInputValue(inputValue);
                        if (setFieldValueRef.current) {
                          setFieldValueRef.current("selectedFunding.funder", {
                            id: "",
                            name: inputValue,
                          });
                        }
                      }}
                    />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2}>
                  <Grid.Column width={8}>
                    <Form.Field>
                      <label>{i18next.t("Funding ID")}</label>
                      <Field name="selectedFunding.award.number">
                        {({ field }) => (
                          <Form.Input {...field} placeholder={i18next.t("Funding ID")} />
                        )}
                      </Field>
                    </Form.Field>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Modal.Content>
            <Modal.Actions>
              <Button
                onClick={() => {
                  resetForm();
                  closeModal();
                }}
                content={i18next.t("Cancel")}
                floated="left"
              />
              <Button
                onClick={(event) => handleSubmit(event)}
                primary
                content={
                  action === ModalActions.ADD ? i18next.t("Add") : i18next.t("Change")
                }
                disabled={!selectedOption} // Pass selectedOption and values
              />
            </Modal.Actions>
          </Modal>
        );
      }}
    </Formik>
  );
}

FundingModal.propTypes = {
  mode: PropTypes.oneOf(["standard", "custom"]).isRequired,
  action: PropTypes.oneOf(["add", "edit"]).isRequired,
  currentLocale: PropTypes.string,
  trigger: PropTypes.object.isRequired,
  onAwardChange: PropTypes.func.isRequired,
  searchConfig: PropTypes.shape({
    searchApi: PropTypes.shape({
      axios: PropTypes.shape({
        headers: PropTypes.object,
      }),
    }).isRequired,
    initialQueryState: PropTypes.object,
  }),
  initialFunding: PropTypes.object,
};

FundingModal.defaultProps = {
  initialFunding: undefined,
  mode: "custom",
  action: "edit",
  currentLocale: "de",
};

export default FundingModal;
