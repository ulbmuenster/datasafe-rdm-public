// This file is part of InvenioVocabularies
// Copyright (C) 2021-2023 CERN.
// Copyright (C) 2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// Invenio is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { i18next } from "../../../../../translations/datasafe_rdm/i18next";
import React from "react";
import { Button, Icon, List } from "semantic-ui-react";
import FundingModal from "./DatasafeRdmFundingModal";
import PropTypes from "prop-types";

export const FundingFieldItem = ({
                                   compKey,
                                   index,
                                   fundingItem,
                                   awardType,
                                   replaceFunding,
                                   removeFunding,
                                   searchConfig,
                                   deserializeAward,
                                   deserializeFunder,
                                   computeFundingContents,
                                 }) => {
  let { headerContent, descriptionContent, awardOrFunder } =
    computeFundingContents(fundingItem);

  return (
    <List.Item key={compKey} className="funding-field-item">
      <List.Content floated="right">
        <FundingModal
          searchConfig={searchConfig}
          onAwardChange={(selectedFunding) => {
            replaceFunding(index, selectedFunding);
          }}
          mode={awardType}
          action="edit"
          trigger={
            <Button size="mini" type="button" className={"tertiary bg-white"}>
              <Icon name="pencil alternate" aria-hidden="true" />
              {i18next.t("Edit")}
            </Button>
          }
          deserializeAward={deserializeAward}
          deserializeFunder={deserializeFunder}
          computeFundingContents={computeFundingContents}
          initialFunding={fundingItem}
        />
        <Button size="mini" type="button" className={"tertiary bg-white"} onClick={() => removeFunding(index)}>
          <Icon name="trash alternate outline" aria-hidden="true" />
          {i18next.t("Remove")}
        </Button>
      </List.Content>

      <List.Content>
        <List.Header>
          <>
            {headerContent ? <span className="mr-5 funder-name">{headerContent}</span> : ""}
            {awardOrFunder === "award"
              ? fundingItem?.award?.number && (
              <div basic="true" className="mr-5 text-muted fundingid">
                {fundingItem?.award?.number}
              </div>
            )
              : ""}
          </>
        </List.Header>
        <List.Description>
          {descriptionContent ? descriptionContent : null}
        </List.Description>
      </List.Content>
    </List.Item>
  );
};

FundingFieldItem.propTypes = {
  compKey: PropTypes.any,
  index: PropTypes.number,
  fundingItem: PropTypes.object,
  awardType: PropTypes.string,
  replaceFunding: PropTypes.func.isRequired,
  removeFunding: PropTypes.func.isRequired,
  searchConfig: PropTypes.object,
  deserializeAward: PropTypes.func.isRequired,
  deserializeFunder: PropTypes.func.isRequired,
  computeFundingContents: PropTypes.func.isRequired,
};

FundingFieldItem.defaultProps = {
  compKey: undefined,
  index: undefined,
  fundingItem: undefined,
  awardType: undefined,
};
