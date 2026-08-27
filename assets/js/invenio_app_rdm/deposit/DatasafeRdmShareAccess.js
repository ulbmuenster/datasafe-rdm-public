import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { AccessUsersGroups } from "../landing_page/ShareOptions/AccessUsersGroups/AccessUsersGroups";
import { withCancel } from "react-invenio-forms";
import { http } from "react-invenio-forms";


const DatasafeRdmShareAccess = (props) => {

  const { record, permissions } = props;

  const [state, setState] = useState({
    record: record,
    usersResults: undefined,
    loading: false,
    error: undefined,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const onUserAddedOrDeleted = async () => {
    await fetchUsers(true);
  };
  const onPermissionChanged = (id, permission) => {
    state.usersResults.forEach((result) => {
      if (result.subject.id === id) {
        result.permission = permission;
      }
    });
  };
  const fetchUsers = async (isDataChanged) => {
    if (state.usersResults && !isDataChanged) return;

    setState(prev => ({ ...prev, loading: true }));
    try {
      const cancellableAction = withCancel(
        http.get(`${record.links.access_users}?expand=true`),
      );
      const response = await cancellableAction.promise;
      setState(prev => ({
        ...prev, loading: false, error: undefined,
      }));
      updateUsersState(response.data.hits.hits, isDataChanged);
    } catch (error) {
      if (error === "UNMOUNTED") return;
      setState({
        loading: false,
        error: error,
      });
      console.error(error);
    }
  };
  const updateUsersState = (results, isDataChanged) => {
    setState(prev => ({ ...prev, usersResults: results }));

    if (isDataChanged) {
      const updatedRecord = record?.parent?.access?.grants
        ?.filter((grant) => grant?.subject?.type !== "user")
        .concat(results);
      record.parent.access.grants = updatedRecord;

      setState(prev => ({ ...prev, record: record }));
    }
  };

  return (
    <AccessUsersGroups
      searchType="user"
      record={record}
      permissions={permissions}
      endpoint={`${record.links["access_users"]}`}
      results={state.usersResults}
      loading={state.loading}
      error={state.error}
      onGrantAddedOrDeleted={onUserAddedOrDeleted}
      onPermissionChanged={onPermissionChanged}
    />
  );
};

export default DatasafeRdmShareAccess;
