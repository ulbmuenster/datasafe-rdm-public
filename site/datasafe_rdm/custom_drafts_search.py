# Copyright (C) 2023-2026 University of Münster.
#
# datasafe-RDM is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.


# --------------------------------------------------------
# Custom drafts search options
# --------------------------------------------------------

from invenio_access.permissions import authenticated_user
from invenio_drafts_resources.services.records.config import SearchDraftsOptions
from invenio_rdm_records.services import facets
from invenio_records_resources.services.base.config import SearchOptionsMixin
from invenio_records_resources.services.records.params.base import ParamInterpreter


class CustomMyDraftsParam(ParamInterpreter):
    """Evaluates the include_deleted parameter."""

    def apply(self, identity, search, params):
        """Evaluate the include_deleted parameter on the search."""
        value = params.pop("include_deleted", None)

        # Filter prevents from other users' drafts from displaying on Moderator's
        # dashboard
        def is_user_authenticated():
            return authenticated_user in identity.provides

        if value is None and is_user_authenticated():
            search = search.filter("term", **{"is_published": False})
        return search


class CustomRDMSearchDraftsOptions(SearchDraftsOptions, SearchOptionsMixin):
    """Search options for drafts search."""

    facets = {
        "resource_type": facets.resource_type,
        "languages": facets.language,
        "access_status": facets.access_status,
        "is_published": facets.is_published,
    }

    params_interpreters_cls = [
        CustomMyDraftsParam
    ] + SearchDraftsOptions.params_interpreters_cls
