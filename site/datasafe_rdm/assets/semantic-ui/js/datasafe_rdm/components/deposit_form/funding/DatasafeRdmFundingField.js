// Copyright (C) 2023-2026 University of Münster.
//
// datasafe-RDM is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see LICENSE file for more
// details.

import React, { useEffect, useState } from "react";
import { useFormikContext } from "formik";
import { i18next } from "../../../../../translations/datasafe_rdm/i18next";
import { FundingField } from "./FundingField.js";

const DatasafeRdmFundingField = () => {
  const [currentLocale, setCurrentLocale] = useState(null);
  const { values } = useFormikContext();

  useEffect(() => {
    const depositForm = document.getElementById("deposit-form");
    if (depositForm) {
      const locale = depositForm.getAttribute("data-current-locale");
      setCurrentLocale(locale);
    }
  }, []);

  return (

    <div id={"datasafe-funding-field"}>
      <label
        htmlFor="metadata.funding"
        className="field-label-class invenio-field-label"
      >
        {i18next.t("Funding")}
      </label>
      <FundingField
        fieldPath="metadata.funding"
        label=""
        labelIcon=""
        deserializeAward={(award) => {
          return {
            title: award.title_l10n,
            number: award.number,
            funder: award.funder ?? "",
            id: award.id,
            ...(award.identifiers && {
              identifiers: award.identifiers,
            }),
            ...(award.acronym && { acronym: award.acronym }),
          };
        }}
        deserializeFunder={(funder) => {
          return {
            id: funder.id,
            name: funder.name,
            ...(funder.title_l10n && { title: funder.title_l10n }),
            ...(funder.pid && { pid: funder.pid }),
            ...(funder.country && { country: funder.country }),
            ...(funder.identifiers && {
              identifiers: funder.identifiers,
            }),
          };
        }}
        computeFundingContents={(funding) => {
          let headerContent,
            descriptionContent,
            awardOrFunder = "";

          if (funding.funder) {
            const funderName =
              funding.funder?.name ??
              funding.funder?.title ??
              funding.funder?.id ??
              "";
            awardOrFunder = "funder";
            headerContent = funderName;
            descriptionContent = "";

            // there cannot be an award without a funder
            if (funding.award) {
              const { acronym, title } = funding.award;
              awardOrFunder = "award";
              descriptionContent = "";
              headerContent = funderName;
              // headerContent = acronym ? `${acronym} — ${title}` : title;
            }
          }

          return { headerContent, descriptionContent, awardOrFunder };
        }}
        currentLocale={currentLocale}  // Pass currentLocale to FundingField
      />
    </div>
  );
};

export default DatasafeRdmFundingField;
