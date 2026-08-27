// Copyright (C) 2021 Graz University of Technology.
// Copyright (C) 2023-2026 University of Münster.
//
// datasafe-RDM is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import i18n from "i18next";
import { i18next as i18next_rdm_records } from "@translations/invenio_rdm_records/i18next";
import { i18next as i18next_requests } from "@translations/invenio_requests/i18next";
import { i18next as i18next_app_rdm } from "@translations/invenio_app_rdm/i18next";

import LanguageDetector from "i18next-browser-languagedetector";
import {
  translations,
  translations_rdm_records,
  translations_requests,
  translations_app_rdm,
} from "./messages";
import { initReactI18next } from "react-i18next";

const options = {
  fallbackLng: "en", // fallback keys
  returnEmptyString: false,
  debug: process.env.NODE_ENV === "development",
  resources: translations,
  keySeparator: false,
  nsSeparator: false,
  // specify language detection order
  detection: {
    order: ["htmlTag"],
    // cache user language off
    caches: [],
  },
  react: {
    // Set empty - to allow html tags convert to trans tags
    // HTML TAG | Trans TAG
    //  <span>  | <1>
    transKeepBasicHtmlNodesFor: [],
  },
};

const i18next = i18n.createInstance();
i18next.use(LanguageDetector).use(initReactI18next).init(options);

i18next_rdm_records.addResourceBundle("en", "translation", translations_rdm_records["en"]["translation"], true, true);
i18next_rdm_records.addResourceBundle("de", "translation", translations_rdm_records["de"]["translation"], true, true);

i18next_requests.addResourceBundle("en", "translation", translations_requests["en"]["translation"], true, true);
i18next_requests.addResourceBundle("de", "translation", translations_requests["de"]["translation"], true, true);

i18next_app_rdm.addResourceBundle("en", "translation", translations_app_rdm["en"]["translation"], true, true);
i18next_app_rdm.addResourceBundle("de", "translation", translations_app_rdm["de"]["translation"], true, true);


export { i18next };
