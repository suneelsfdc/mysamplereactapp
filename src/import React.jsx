import React, { useState, useEffect } from "react";

const FieldFilter = ( {fields, disabled, updateFieldFilterState, id} ) => {
  /*useEffect(() => {
    console.log('Calling func');
    //onDelete();
  }, [onInsert]);*/
    //const {updateFieldFilterState} = props;
    const handleFieldChange = (val) => {
      console.log('in handleFieldChange-'+val);
      updateFieldFilterState(val);
      if(val.equals("none")){
        
        //raise event to deactivate subsequent field filters

      }else{
        // if previous values is 
      }
    }
    return (
        <p>
        <select className='m-2' onChange={e => handleFieldChange(e.target.value)} disabled={disabled} > 
          <option value="none"> -- Select a field -- </option>
                {/* Mapping through each fruit object in our fruits array
              and returning an option element with the appropriate attributes / values.
            */}
          {fields.map((field) => <option key={field} value={field}>{field}</option>)}
        </select>
        <span> </span>&nbsp;&nbsp;
        <select disabled={disabled}> 
          <option value="="> = </option>
          <option value=">"> &gt; </option>
          <option value="<"> &lt; </option>
          <option value="contains"> contains </option>
          <option value="startswith"> starts with </option>
          <option value="endswith"> ends with </option>
        </select>
        <span> </span>&nbsp;&nbsp;
        <input type="text" id="fieldValue" name="fieldValue" disabled={disabled}></input>
        <span> </span>&nbsp;&nbsp;
        
        </p>
    );
}

export default FieldFilter;