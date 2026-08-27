// This file is part of datasafe-RDM
// Copyright (C) 2020 - 2024 CERN.
// Copyright (C) 2023-2026 University of Münster.
//
// datasafe-RDM is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see LICENSE file for more
// details.

import { i18next } from "@datasafe_translations/i18next";
import _isEmpty from "lodash/isEmpty";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Image } from "react-invenio-forms";
import { Button, Header, Icon, Label, Segment } from "semantic-ui-react";

export class SelectedMembers extends Component {
  removeMember = (id) => {
    const { selectedMembers, updateSelectedMembers } = this.props;
    delete selectedMembers[id];
    updateSelectedMembers(selectedMembers);
  };

  render() {
    const { selectedMembers, headerText } = this.props;

    return !_isEmpty(selectedMembers) ? (
      <Segment className="selected-members-header row pill-row">
        {Object.entries(selectedMembers).map(([memberId, member]) => (
          <Label
            key={memberId}
            className="pill search"
            onClick={() => this.removeMember(memberId)}
            aria-label={i18next.t("remove {{name}}", {
              name: member.name,
            })}
          >
            <span>
              {/*<Image src={member.avatar} alt="" aria-hidden />*/}
              {member.name.split("<")[0]}
            </span>
            <Icon size="large" aria-hidden="true" name="delete" tabIndex="0" onClick={() => removePill(value)}
                  onKeyDown={(e) => e.key === "Enter" && removePill(value)} />
          </Label>
        ))}
      </Segment>
    ) : (
      <Segment textAlign="center" className="selected-members-header mb-20" placeholder>
        <Header disabled>{headerText}</Header>
      </Segment>
    );
  }
}

SelectedMembers.propTypes = {
  selectedMembers: PropTypes.object.isRequired,
  updateSelectedMembers: PropTypes.func.isRequired,
  headerText: PropTypes.string,
};

SelectedMembers.defaultProps = {
  headerText: "",
};