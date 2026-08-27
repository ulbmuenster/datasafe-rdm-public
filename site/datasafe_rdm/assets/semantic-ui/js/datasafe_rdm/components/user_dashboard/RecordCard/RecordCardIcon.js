import React from "react";
import {Image} from "semantic-ui-react";
import recordIcon from "../../../static/images/archived.svg";
import draftIcon from "../../../static/images/draft.svg";
import unsavedChangesIcon from "../../../static/images/archived_edit.svg";

const RecordCardIcon = (props) => {
    const {isPublished, status, uncommittedChanges} = props;

    let icon;
    if (uncommittedChanges) {
        icon = unsavedChangesIcon;
    } else {
        icon = status === "published" ? recordIcon : draftIcon;
    }

    return <Image className={"card-icon"} centered src={icon}/>;
};

export default RecordCardIcon;
