import React, { Component } from "react";
import { ShareButton } from "@js/invenio_app_rdm/landing_page/ShareOptions/ShareButton";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
export class ShareButtonApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: "",
        };
    }
    render() {
        const {
            record,
            permissions,
            isDraft,
            isPreviewSubmissionRequest,
            currentUserId,
            recordOwnerID,
            groupsEnabled,
        } = this.props;

        return (
            <div>

                <ShareButton
                    disabled={!permissions.can_update_draft}
                    record={record}
                    permissions={permissions}
                    groupsEnabled={groupsEnabled}
                />
            </div>
        );
    }
}


const datasaferdmSharebuttonDiv = document.getElementById("datasaferdm-sharebutton");

if (datasaferdmSharebuttonDiv) {
    ReactDOM.render(<ShareButtonApp
        record={JSON.parse(datasaferdmSharebuttonDiv.dataset.record)}
        permissions={JSON.parse(datasaferdmSharebuttonDiv.dataset.permissions)}
        isDraft={JSON.parse(datasaferdmSharebuttonDiv.dataset.isDraft)}
        isPreviewSubmissionRequest={JSON.parse(
            datasaferdmSharebuttonDiv.dataset.isPreviewSubmissionRequest
        )}
        currentUserId={datasaferdmSharebuttonDiv.dataset.currentUserId}
        recordOwnerID={datasaferdmSharebuttonDiv.dataset.recordOwnerId}
        groupsEnabled={JSON.parse(datasaferdmSharebuttonDiv.dataset.groupsEnabled)}
    />, datasaferdmSharebuttonDiv);
}
else {
    console.error("ShareButtonApp: Element with id 'datasaferdm-sharebutton' not found.");
}

ShareButtonApp.propTypes = {
    record: PropTypes.object.isRequired,
    permissions: PropTypes.object.isRequired,
    isDraft: PropTypes.bool.isRequired,
    groupsEnabled: PropTypes.bool.isRequired,
    isPreviewSubmissionRequest: PropTypes.bool.isRequired,
    currentUserId: PropTypes.string.isRequired,
    recordOwnerID: PropTypes.string.isRequired,
};