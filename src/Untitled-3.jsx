import logo from './logo.svg';
import React, { useState, useEffect } from "react";
import FieldFilter from "./FieldFilter";
import './App.css';

const OBJECT_API_URL = "http://localhost:8080/getObjectList?username=suneelcpqextramile@gmail.com&password=U2FsZXNmb3JjZSMx";
const FIELD_API_URL = "http://localhost:8080/getQueryableFieldList?username=suneelcpqextramile@gmail.com&password=U2FsZXNmb3JjZSMx";
const DATASEED_API_URL = "http://localhost:8080/seedData?username=suneelcpqextramile@gmail.com&password=U2FsZXNmb3JjZSMx";

function App() {
  const [objects, setObjects] = useState([]);
  const [selObject, setSelObject] = useState([]);
  const [fields, setFields] = useState([]);
  const [fieldFilters, setFieldFilters] = useState([]);
  const [ showSeedButton, setShowSeedButton ] = useState([]);
  const [results, setResults] = useState([]);

  let handleObjectChange = (e) => {
    console.log('e.target.value:'+e.target.value);
    console.log('-->'+typeof objects);
    console.log('-->'+typeof selObject);
    setSelObject(e.target.value);
    console.log('-->'+selObject);

  }

  let seedData = (e) => {
    console.log('in seedData');
    seedDataFromSourceToTarget();

  }

  useEffect(() => {
    // this will be triggered whenever user will be updated
    console.log('useeffect-->'+selObject);
    if(selObject){
      getFieldList();
      //setFields();
      //setShowSeedButton(true);
    }
  }, [selObject]);

  useEffect(() => {
    setShowSeedButton(false);
    getObjectList();
  }, []);

  const getObjectList = async () => {
    const response = await fetch(`${OBJECT_API_URL}`);
    const data = await response.json();
    setObjects(data);
    console.log(data);
  };

  const seedDataFromSourceToTarget = async () => {
    console.log('seedDataFromSourceToTarget-->'+selObject);
    const response = await fetch(`${DATASEED_API_URL}&object=${selObject}`);
    const data = await response.json();
    setResults(data);
    console.log(results);
  };

  const getFieldList = async () => {
    const response = await fetch(`${FIELD_API_URL}&object=${selObject}`);
    const data = await response.json();
    setFields(data);
    setFieldFilters([ {id:1, value:0}, {id:2, value:0}]);
    console.log(data);
  };

  const handleDelete = () => {
    console.log('Event Handler Called');
  }

  
  const handleFieldChange = async () => {
    console.log('-->in handleFieldChange');
  };

  return (
    <div className="App">
      <span className="m-2">Object List</span>
      <span> </span>&nbsp;&nbsp;
      {objects?.length > 0 ? (
        <select onChange={handleObjectChange}> 
          <option value="⬇️ Select a fruit ⬇️"> -- Select an object -- </option>
                {/* Mapping through each fruit object in our fruits array
              and returning an option element with the appropriate attributes / values.
            */}
          {objects.map((object) => <option key={object} value={object}>{object}</option>)}
        </select>
      ) : (
        <div className="empty">
          <h2>No object found</h2>
        </div>
      )}
      
      {fields?.length > 0 ? (
        <>
        <p>Filter Results By</p>
        {fieldFilters.map((fieldFilter) => <FieldFilter key={fieldFilter.id} fields={fields} id={fieldFilter.id} onDelete={handleDelete}/>)}
        </>
          
      ) : (
        <div className="empty">
          
        </div>
      )}
      {showSeedButton ?(
          <button onClick={seedData}>Seed Data</button>
        ):(
          <div></div>
        )}
      {results?.length > 0 ? (
          <div className="container">
            {results.map((result) => <p>{result}</p>)}
          </div>
        ) : (
          <div></div>
        )}
    </div>
  );
}

export default App;
