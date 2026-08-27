// Copyright (C) 2023-2026 University of Münster.
//
// datasafe-RDM is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see LICENSE file for more
// details.

/*
 * In this file we directly edit the overrideStore to configure our overrides.
 */

import { overrideStore } from "react-overridable";
import { addToOverrideStore } from "./utils/helperFunctions";
// import our own components
import DatasafeRdmSubjectsField from "./components/DatasafeRdmSubjectsField";
import DatasafeRdmDatesField from "./components/DatasafeRdmDatesField";
import DatasafeRdmFundingField from "./components/deposit_form/funding/DatasafeRdmFundingField";
import DatasafeRdmPublicationDateField from "./components/DatasafeRdmPublicationdateField";

// import empty components
import hiddenComponentsByOverride from "./hiddenComponentsByOverride";

// Override components that should not be shown
addToOverrideStore(hiddenComponentsByOverride);
// Override fields in CommunityProfileForm
overrideStore.add("InvenioAppRdm.Deposit.SubjectsField.container", DatasafeRdmSubjectsField);
// Override Date fields in Deposit form
overrideStore.add("InvenioAppRdm.Deposit.DateField.container", DatasafeRdmDatesField);
// Override Funding field in Deposit form
overrideStore.add("InvenioAppRdm.Deposit.FundingField.container", DatasafeRdmFundingField);
// Overrdide PublicationDateField in Deposit form
overrideStore.add("InvenioAppRdm.Deposit.PublicationDateField.container", DatasafeRdmPublicationDateField);
