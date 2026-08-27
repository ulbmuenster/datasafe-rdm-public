// Copyright (C) 2023-2026 University of Münster.
//
// datasafe-RDM is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see LICENSE file for more
// details.

import React, { useEffect, useState } from "react";
import { useFormikContext } from "formik";
import { i18next } from "../../../translations/datasafe_rdm/i18next.js";

// Component to override DatesField
const DatasafeRdmDatesField = () => {
  /* -------------------------------------------------------------------------------- */
  /*                            Props, state and hooks                                */
  /* -------------------------------------------------------------------------------- */
  const { values, setFieldValue, errors, initialErrors } = useFormikContext();


  /* -------------------------------------------------------------------------------- */
  /*                           Variables and Functions                                */
  /* -------------------------------------------------------------------------------- */
  let dateFromFormik = values.metadata?.dates?.[0]?.date;
  let initialErrorsFromFormik = initialErrors.metadata?.dates?.[0]?.date;
  let DateErrorErrorMessage = errors.metadata?.dates?.[0]?.date;
  let ErrorMessage = initialErrorsFromFormik !== undefined || DateErrorErrorMessage !== undefined ? initialErrorsFromFormik || DateErrorErrorMessage : false;
  /* -------------------------------------------------------------------------------- */
  /*                                   Handlers                                       */
  /* -------------------------------------------------------------------------------- */
  const [date, setDate] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [validationTimeout, setValidationTimeout] = useState(null);

  const validateDate = (value) => {
    if (!value) return true;

    // Split into start and end dates if range is provided
    const dates = value.split("/").map(d => d.trim());
    if (dates.length > 2) return false;

    // Validate each date
    const isValid = dates.every(date => {
      // YYYY format
      if (/^\d{4}$/.test(date)) {
        const year = parseInt(date);
        return year >= 1000 && year <= 9999;
      }
      // YYYY-MM format
      if (/^\d{4}-(?:0[1-9]|1[0-2])$/.test(date)) {
        return true;
      }
      // YYYY-MM-DD format
      if (/^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/.test(date)) {
        return true;
      }
      return false;
    });

    if (!isValid) return false;

    // Check if the second date is not before the first date
    if (dates.length === 2) {
      const [startDate, endDate] = dates;
      return new Date(startDate) <= new Date(endDate);
    }

    return true;
  };


  const inputChangeHandler = (event) => {
    const value = event.target.value;
    setDate(value);

    // Clear the previous timeout
    if (validationTimeout) {
      clearTimeout(validationTimeout);
    }

    // Set a new timeout for validation
    const timeout = setTimeout(() => {
      setIsValid(validateDate(value));
    }, 1000);

    setValidationTimeout(timeout);

    setFieldValue("metadata.dates[0].date", event.target.value);
  };

  const onBlurHandler = (event) => {
    const value = event.target.value;
    setFieldValue("metadata.dates", [
      {
        __key: 0,
        date: value,
        description: "",
        type: value ? "collected" : "",
      },
    ]);
  };
  /* -------------------------------------------------------------------------------- */
  /*                                Return statement                                  */
  /* -------------------------------------------------------------------------------- */
  return (
    <>
      <div className={`${ErrorMessage ? "error " : ""}sixteen wide bg-white field`}>
        <label htmlFor="metadata.dates" className="field-label-class invenio-field-label">
          {i18next.t("Period of data collection")}
        </label>
        <input
          id="metadata.dates.0.date"
          value={dateFromFormik}
          onChange={inputChangeHandler}
          onBlur={onBlurHandler}
          className={`w-full p-2 border rounded-md outline-none ${isValid ? "" : "invalidInputField"
          }`}

          placeholder={i18next.t("YYYY-MM-DD / YYYY-MM-DD")}
        />
        {ErrorMessage && (
          <div
            className="ui pointing above prompt label"
            id="metadata.dates.0.date-error-message"
            role="alert"
            aria-atomic="true"
          >
            {ErrorMessage}
          </div>
        )}
      </div>
      <label className="helptext">
        {i18next.t("Format: YYYY or YYYY-MM or YYYY-MM-DD | For a date range: DATE/DATE (e.g., 2024-01-01/2024-09-30)")}
      </label>
    </>
  );
};

export default DatasafeRdmDatesField;