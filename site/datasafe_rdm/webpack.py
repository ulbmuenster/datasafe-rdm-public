# Copyright (C) 2023-2026 University of Münster.
#
# datasafe-RDM is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.


"""JS/CSS Webpack bundles for datasafe-rdm."""

from invenio_assets.webpack import WebpackThemeBundle

theme = WebpackThemeBundle(
    __name__,
    "assets",
    default="semantic-ui",
    themes={
        "semantic-ui": {
            "entry": {
                "configure-overridestore": "./js/datasafe_rdm/reactoverrides.js",
                "add-translations": "./translations/datasafe_rdm/i18next.js",
                "ArchiveRecord": "./js/datasafe_rdm/ArchiveRecord.js",
                "UserDashboard": "./js/datasafe_rdm/UserDashboard.js",
                "datasaferdm-sharebutton": "./js/datasafe_rdm/sharebutton.js",
                "datasafe-rdm-extend-storage-period": "./js/datasafe_rdm/utils/extension_of_storage_period.js",
                "recordLandingPageDetail": "./js/datasafe_rdm/scripts/recordLandingPageDetail.js",
                "filePreviewer": "./js/datasafe_rdm/scripts/filePreviewer.js",
                "deposit": "./js/datasafe_rdm/scripts/deposit.js",
                "datasafe-rdm-versions": "./js/datasafe_rdm/scripts/versions.js",
                "record_landing_page_authorized_users": "./js/datasafe_rdm/scripts/record_landing_page_authorized_users.js",
            },
            "dependencies": {
                "react-select": "^5.3.2",
                "fuse.js": "7.0.0",
            },
            "aliases": {
                "@datasafe_translations": "./translations/datasafe_rdm",
                "@datasafeRdmAccordionField": "./js/datasafe_rdm/components/DatasafeRdmAccordionField.js",
            },
        },
    },
)
