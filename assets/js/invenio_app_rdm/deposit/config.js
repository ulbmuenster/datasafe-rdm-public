// This file is part of InvenioRDM
// Copyright (C) 2025 CERN.
// Copyright (C) 2023-2026 University of Münster.
//
// Invenio APP RDM is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import { i18next } from "@translations/invenio_app_rdm/i18next";

const depositFormSectionsConfig = {
  "files-section": ["files.enabled"],
  "access-rights-section": ["access.files", "access.embargo.until"],
  "metadata-section": [
    "metadata.resource_type",
    "metadata.title",
    "metadata.additional_titles",
    "metadata.publication_date",
    "metadata.creators",
    "metadata.description",
    "metadata.additional_descriptions",
    "metadata.rights",
    "metadata.subjects",
    "metadata.dates",
    "metadata.funding",
  ],
};

const severityChecksConfig = {
  info: {
    label: i18next.t("Recommendation"),
    description: i18next.t("This check is recommended but not mandatory."),
  },
  error: {
    label: i18next.t("Error"),
    description: i18next.t(
      "This check indicates a critical issue that must be addressed."
    ),
  },
  warning: {
    label: i18next.t("Warning"),
    description: i18next.t(
      "This check indicates an issue that should be addressed."
    ),
  },
};

export { depositFormSectionsConfig, severityChecksConfig };
