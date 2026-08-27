// Copyright (C) 2023-2026 University of Münster.
//
// datasafe-RDM is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see LICENSE file for more
// details.

/*
 * Add Overridable ID of components that should not be displayed here
 */
const hiddenComponentsByOverride = {
  // Override fields in the deposit form
  "InvenioAppRdm.Deposit.AccessRightField.container": () => null,
  "InvenioAppRdm.Deposit.AccordionFieldAlternateIdentifiers.container": () => null,
  "InvenioAppRdm.Deposit.AccordionFieldReferences.container": () => null,
  "InvenioAppRdm.Deposit.AccordionFieldRelatedWorks.container": () => null,
  "InvenioAppRdm.Deposit.CommunityHeader.container": () => null,
  "InvenioAppRdm.Deposit.ContributorsField.container": () => null,
  "InvenioAppRdm.Deposit.LanguagesField.container": () => null,
  "InvenioAppRdm.Deposit.LicenseField.container": () => null,
  "InvenioAppRdm.Deposit.PublisherField.container": () => null,
  "InvenioAppRdm.Deposit.ResourceTypeField.container": () => null,
  "InvenioAppRdm.Deposit.VersionField.container": () => null,
  "InvenioVocabularies.FundingField.AddAwardFundingModal.Container": () => null,
  "InvenioVocabularies.CustomAwardForm.AwardUrlTextField.Container": () => null,
};

export default hiddenComponentsByOverride;
