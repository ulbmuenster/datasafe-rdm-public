import React, { useEffect } from "react";
import { useFormikContext } from "formik";


const DatasafePublicationDateField = () => {
  
    const { values, setFieldValue } = useFormikContext();
    useEffect(() => {
      const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
      setFieldValue("metadata.publication_date", today);
    }, [setFieldValue]);
  
    return (
      <div></div>
    );
  }

export default DatasafePublicationDateField;
