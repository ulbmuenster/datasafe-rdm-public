// This file is part of Invenio-RDM-Records
// Copyright (C) 2020-2023 CERN.
// Copyright (C) 2020-2022 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
// Copyright (C) 2024 KTH Royal Institute of Technology.
//
// Invenio-RDM-Records is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Form, Icon } from "semantic-ui-react";

import { ArrayField, GroupField, SelectField, TextField } from "react-invenio-forms";
import { emptyAdditionalTitle } from "./initialValues";
import { LanguagesField } from "../LanguagesField";
import { i18next } from "@datasafe_translations/i18next";

export class AdditionalTitlesField extends Component {
  render() {
    const { fieldPath, options, recordUI } = this.props;
    return (
      <ArrayField
        addButtonLabel={i18next.t("Add titles")}
        defaultNewValue={emptyAdditionalTitle}
        fieldPath={fieldPath}
        className="additional-titles"
      >
        {({ arrayHelpers, indexPath }) => {
          const fieldPathPrefix = `${fieldPath}.${indexPath}`;

          return (
            <GroupField className={"invenio-group-field additional-title-item ui two column grid"}
                        classfieldPath={fieldPath}
                        optimized>
              <div className="fifteen wide column">
                <TextField
                  fieldPath={`${fieldPathPrefix}.title`}
                  label={i18next.t("Additional title")}
                  required
                  width={16}
                />
                <div className="ui two column grid">
                  <div className="eight wide column">
                    <SelectField
                      fieldPath={`${fieldPathPrefix}.type`}
                      label={i18next.t("Type")}
                      optimized
                      options={options.type}
                      required
                      width={16}
                    />
                  </div>
                  <div className="eight wide column">
                    <LanguagesField
                      serializeSuggestions={(suggestions) =>
                        suggestions.map((item) => ({
                          text: item.title_l10n,
                          value: item.id,
                          fieldPathPrefix: item.id,
                        }))
                      }
                      initialOptions={
                        recordUI?.additional_titles &&
                        recordUI.additional_titles[indexPath]?.lang
                          ? [recordUI.additional_titles[indexPath].lang]
                          : []
                      }
                      fieldPath={`${fieldPathPrefix}.lang`}
                      label={i18next.t("Language")}
                      multiple={false}
                      placeholder={i18next.t("Select language")}
                      labelIcon={null}
                      clearable
                      selectOnBlur={false}
                      width={16}
                    />
                  </div>
                </div>
              </div>
              <div className="one wide column">
                <Form.Field>
                  <Icon
                    aria-label={i18next.t("Remove field")}
                    className="close-btn"
                    icon
                    onClick={() => arrayHelpers.remove(indexPath)}
                  >
                    <Icon name="close" />
                  </Icon>
                </Form.Field>
              </div>

            </GroupField>
          );
        }}
      </ArrayField>
    );
  }
}

AdditionalTitlesField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  options: PropTypes.shape({
    type: PropTypes.arrayOf(
      PropTypes.shape({
        icon: PropTypes.string,
        text: PropTypes.string,
        value: PropTypes.string,
      }),
    ),
    lang: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string,
        value: PropTypes.string,
      }),
    ),
  }),
  recordUI: PropTypes.object,
};

AdditionalTitlesField.defaultProps = {
  options: undefined,
  recordUI: undefined,
};