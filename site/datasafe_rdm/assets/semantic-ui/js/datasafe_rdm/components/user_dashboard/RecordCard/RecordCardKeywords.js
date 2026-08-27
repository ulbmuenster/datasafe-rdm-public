import React from "react";
import { capitalizeFirstLetter } from "../../../utils/helperFunctions";
import { i18next } from "../../../../../translations/datasafe_rdm/i18next";

const RecordCardKeywords = (props) => {
  /* -------------------------------------------------------------------------------- */
  /*                        Props and state and hooks                                 */
  /* -------------------------------------------------------------------------------- */
  const { isPublished, status, restricted, dataType } = props;
  /* -------------------------------------------------------------------------------- */
  /*                           Variables and Functions                                */
  /* -------------------------------------------------------------------------------- */
  //TODO here an entity can have isDraft=false AND status=Draft =(
  const statusPill = (() => {
    if (isPublished) {
      return (
        <div className="ui label green">
          {i18next.t("Archived dataset")}
        </div>
      );
    }
    if (status === "draft") {
      return (
        <div className="ui label ">
          {i18next.t("Draft")}
        </div>
      );
    }
  })();
  const restrictedPill = (() => {
    if (restricted === "restricted") {
      return (
        <div className="ui label red">
          {i18next.t("Restricted")}
        </div>
      );
    }
  })();
  const dataTypePill = (() => {
    return (
      <div className="ui label">
        {capitalizeFirstLetter(dataType)}
      </div>
    );
  })();
  /* -------------------------------------------------------------------------------- */
  /*                                Return statement                                  */
  /* -------------------------------------------------------------------------------- */
  return (
    <>
      {statusPill}
      {/*{restrictedPill}*/}
      {/*{dataTypePill}*/}
    </>
  );
};

export default RecordCardKeywords;
