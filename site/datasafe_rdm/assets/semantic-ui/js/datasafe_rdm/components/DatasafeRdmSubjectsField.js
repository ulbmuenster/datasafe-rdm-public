// Copyright (C) 2023-2026 University of Münster.
//
// datasafe-RDM is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see LICENSE file for more
// details.

import React, { useState } from "react";
import { useFormikContext } from "formik";
import { i18next } from "../../../translations/datasafe_rdm/i18next.js";
import Pill from "./ui/Pill";
import { GridRow } from "semantic-ui-react";
import { createSubjectArray } from "../utils/helperFunctions";

// Component to override SubjectsField
const DatasafeRdmSubjectsField = () => {
  // values from formik
  const { values, setFieldValue } = useFormikContext();

  // states
  const [textfieldvalue, setTextfieldvalue] = useState("");

  // handler
  const inputChangeHandler = (event) => {
    setTextfieldvalue(event.target.value);
  };
  const addKeyword = (keyword) => {

    let newSubject = textfieldvalue.trim();

    if (newSubject !== "") {
      let newSubjects = [...values.metadata.subjects];
      const isAlreadyPresent = newSubjects.some(
        (subject) => subject.subject === newSubject,
      );

      if (!isAlreadyPresent) {
        newSubjects.push(createSubjectArray(newSubject));
        setFieldValue("metadata.subjects", newSubjects);
        setTextfieldvalue("");
      }
    }
  };
  const onEnterHandler = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      addKeyword();
    }
  };

  const removeSubject = (subject) => {
    // remove object from array values.metadata.subjects where subject == subject
    let newSubjects = values.metadata.subjects.filter((obj) => obj.subject !== subject);
    setFieldValue("metadata.subjects", newSubjects);
  };

  return (
    <div className="ui field bg-white fluid multiple">
      <label
        htmlFor="metadata.subjects"
        className="field-label-class invenio-field-label"
      >
        {i18next.t("Tags")}
      </label>
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          className=""
          id="ownmetadata.subjects"
          value={textfieldvalue}
          onChange={inputChangeHandler}
          onKeyDown={onEnterHandler}
          placeholder={i18next.t("Add tags with ENTER")}
          style={{ flex: 1 }}
        />
        <button
          type="button"
          onClick={addKeyword}
          className="ui button"
          style={{ marginLeft: "10px", flex: "0 0 auto" }}
        >
          {i18next.t("Add Tag")}
        </button>
      </div>

      <GridRow id={"subjects-row"} className="pill-row">
        {values.metadata.subjects.map((obj) => (
          <Pill
            key={obj.subject}
            value={obj.subject}
            removePill={() => removeSubject(obj.subject)}
            type="subject"
          ></Pill>
        ))}
      </GridRow>
    </div>
  );
};

export default DatasafeRdmSubjectsField;
