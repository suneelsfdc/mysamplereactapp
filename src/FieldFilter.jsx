import React, { useState, useEffect } from "react";

const FieldFilter = ( {fields, disabled, updateFieldFilterDropdownChange, updateFieldFilterOperatorChange, updateFieldFilterValueChange, operator, id, showAnd} ) => {
  /*useEffect(() => {
    console.log('Calling func');
    //onDelete();
  }, [onInsert]);*/
  /*useEffect((val) => {
    console.log('Calling func'+val);
    updateFieldFilterState({val});
  }, [updateFieldFilterState]);*/
    //const {updateFieldFilterState} = props;
    /*const handleFieldChange = (val) => {
      console.log('in handleFieldChange-'+val);
      updateFieldFilterState(val);
      if(val.equals("none")){
        
        //raise event to deactivate subsequent field filters

      }else{
        // if value is non none, set next dropdown value to be enabled
      }
    }*/
    const handleFieldFilterDropdownChange = (e) =>{
      console.log('value:'+e.target.value);
      //console.log('value:'+JSON.stringify(value));
      updateFieldFilterDropdownChange(id, e.target.value);
    }
    const handleFieldFilterOperatorChange = (e) =>{
      console.log('value:'+e.target.value);
      updateFieldFilterOperatorChange(id, e.target.value);
    }
    const handleFieldFilterValueChange = (e) =>{
      console.log('value:'+e.target.value);
      updateFieldFilterValueChange(id, e.target.value);
    }
    return (
        <p><span style={{ color: disabled?'red':'green' }}> {id}</span> <span> </span>&nbsp;
        <select className='m-2' onChange={(e) => handleFieldFilterDropdownChange(e)} disabled={disabled}> 
          <option value="none"> -- Select a field -- </option>
                {/* Mapping through each fruit object in our fruits array
              and returning an option element with the appropriate attributes / values.
            */}
          {fields.map((field) => <option key={field} value={field}>{field}</option>)}
        </select>
        <span> </span>&nbsp;&nbsp;
        <select  onChange={(e) => handleFieldFilterOperatorChange(e)} disabled={disabled} selectedvalue={operator}> 
          <option value="="> = </option>
          <option value=">"> &gt; </option>
          <option value="<"> &lt; </option>
          <option value="contains"> contains </option>
          <option value="startswith"> starts with </option>
          <option value="endswith"> ends with </option>
        </select>
        <span> </span>&nbsp;&nbsp;
        <input type="text" onChange={(e) => handleFieldFilterValueChange(e)} name="fieldValue" disabled={disabled}></input>
        <span> </span>&nbsp;&nbsp; {showAnd && <span>AND</span>}
        
        </p>
    );
}

export default FieldFilter;