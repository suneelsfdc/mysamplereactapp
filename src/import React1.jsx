import React, { useState, useEffect } from "react";

const FieldFilter = ( {fields, onDelete} ) => {
  useEffect(() => {
    console.log('Calling func');
    onDelete();
  }, [onDelete]);
    //const {fields, handleDelete} = props;
    return (
        <p>
        <select className='m-2'> 
          <option value="none"> -- Select a field -- </option>
                {/* Mapping through each fruit object in our fruits array
              and returning an option element with the appropriate attributes / values.
            */}
          {fields.map((field) => <option key={field} value={field}>{field}</option>)}
        </select>
        <span> </span>&nbsp;&nbsp;
        <select > 
          <option value="="> = </option>
          <option value=">"> &gt; </option>
          <option value="<"> &lt; </option>
          <option value="contains"> contains </option>
          <option value="startswith"> starts with </option>
          <option value="endswith"> ends with </option>
        </select>
        <span> </span>&nbsp;&nbsp;
        <input type="text" id="fieldValue" name="fieldValue"></input>
        <span> </span>&nbsp;&nbsp;
        <button onClick={onDelete}>Delete</button>
        </p>
    );
}

export default FieldFilter;