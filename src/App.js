// convert GET calls to POST
// test data seeding
//


import logo from './logo.svg';
import React, { useState, useEffect } from "react";
import {Buffer} from 'buffer';
import { Children } from 'react'
import FieldFilter from "./FieldFilter";
import './App.css';
import e from 'cors';


//http://mysecondawsapp-env.eba-idgthgnq.us-east-2.elasticbeanstalk.com


//const LOGIN_API_URL = "http://localhost:8080/getLoginResult?";
//const OBJECT_API_URL = "http://localhost:8080/getObjectList?";
//const FIELD_API_URL = "http://localhost:8080/getQueryableFieldList?";
//const DATASEED_API_URL = "http://localhost:8080/seedData?";

const LOGIN_API_URL = "http://mysecondawsapp-env.eba-idgthgnq.us-east-2.elasticbeanstalk.com/getLoginResult?";
const OBJECT_API_URL = "http://mysecondawsapp-env.eba-idgthgnq.us-east-2.elasticbeanstalk.com/getObjectList?";
const FIELD_API_URL = "http://mysecondawsapp-env.eba-idgthgnq.us-east-2.elasticbeanstalk.com/getQueryableFieldList?";
const DATASEED_API_URL = "http://mysecondawsapp-env.eba-idgthgnq.us-east-2.elasticbeanstalk.com/seedData?";

function App() {
  //this.childRef= React.createRef();
  const collectRefs = [];
  
  const [isLoggedIn, setIsLoggedIn] = useState([]);
  const [username, setUsername] = useState([]);
  const [password, setPassword] = useState([]);
  const [statusMesg, setStatusMesg] = useState([]);
  const [isSandbox, setIsSandbox] = useState([]);
  const [targetUsername, setTargetUsername] = useState([]);
  const [targetPassword, setTargetPassword] = useState([]);
  const [isTargetSandbox, setIsTargetSandbox] = useState([]);
  const [objects, setObjects] = useState([]);
  const [selObject, setSelObject] = useState([]);
  const [fields, setFields] = useState([]);
  const [fieldFilters, setFieldFilters] = useState([]);
  const [ showSeedButton, setShowSeedButton ] = useState([]);
  const [ fieldFilterKey, setFieldFilterKey ] = useState([]);
  const [results, setResults] = useState([]);
  const [isAdvancedFilter, setIsAdvancedFilter] = useState([]);
  let [expression, setExpression] = useState([]);
  const [whereClause, setWhereClause] = useState([]);
  const [ advancedFilterDisabled, setAdvancedFilterDisabled ] = useState([]);
  const [ isLoggedInToTargetOrg, setIsLoggedInToTargetOrg ] = useState([]);
  let [ queryString, setQueryString ] = useState([]);
  let [errorMessage, setErrorMessage] = useState([]);
  let [targetLoginErrorMessage, setTargetLoginErrorMessage] = useState([]);
  
  const handleLoginClick = () => {
    console.log('username:'+username);
    console.log('password:'+password);
    setErrorMessage("");
    doLogin();
  }

  const doLogin = async () => {
    setFieldFilterKey(2);

    if(username.length < 5 || password.length < 5){
      setErrorMessage("Invalid Username or Password. Enter valid Username or Password.");
      return;
    }else{
      setErrorMessage("");
    }
    let jsonBody = { username: `${username}`,
                      password: `${password}`,
                      isSandbox: `${isSandbox}`
                    };
    console.log('JSON.stringify(jsonBody):'+JSON.stringify(jsonBody));
    const requestOptions = {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(jsonBody)
                          };
    const response = await fetch(`${LOGIN_API_URL}`,requestOptions );
    //const response = await fetch(`${LOGIN_API_URL}username=${username}&password=${password}&isSandbox=${isSandbox}`);
    
    let data = await response.json();
    console.log('login response:'+data);
    console.log('login response json:'+JSON.stringify(data));
    data = data.toString().substring(0,165);
    console.log('login response:'+response.toString());
    console.log('login response json:'+JSON.stringify(response));
    console.log('login response:'+data);
    console.log('login response json:'+JSON.stringify(data));
    if(data === 'Success'){
      setIsLoggedIn(true);
      setStatusMesg('Login Successful');
      setErrorMessage("");
      getObjectList();
      setStatusMesg("");
      setIsTargetSandbox(true);
      setIsLoggedInToTargetOrg(false);
      //await setTimeout(() => {  console.log("Continuing..!"); }, 5000);
    }else{
      setErrorMessage(data);
    }
    
    
  };

  const updateUsername = (e) => {
    setUsername(e.target.value);
  }

  const updatePassword = (e) => {
    setPassword(Buffer.from(e.target.value).toString('base64'));
  }

  const handleIsSandboxChange = (e) => {
    setIsSandbox(!isSandbox);
  }

  const handleTargetLoginClick = () => {
    console.log('username:'+username);
    console.log('password:'+password);
    setErrorMessage("");
    doTargetLogin();
  }

  const doTargetLogin = async () => {

    if(username.length < 5 || password.length < 5){
      setTargetLoginErrorMessage("Invalid Username or Password. Enter valid Username or Password.");
      return;
    }else{
      setTargetLoginErrorMessage("");
    }
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: `${targetUsername}`,
                              password: `${targetPassword}`,
                              isSandbox: `${isTargetSandbox}`
                            })
    };
    const response = await fetch(`${LOGIN_API_URL}`,requestOptions );
    //const response = await fetch(`${LOGIN_API_URL}username=${targetUsername}&password=${targetPassword}&isSandbox=${isTargetSandbox}`);
    
    let data = await response.json();
    console.log('login response:'+data);
    console.log('login response json:'+JSON.stringify(data));
    data = data.toString().substring(0,165);
    console.log('login response:'+response.toString());
    console.log('login response json:'+JSON.stringify(response));
    console.log('login response:'+data);
    console.log('login response json:'+JSON.stringify(data));
    if(data === 'Success'){
      setStatusMesg('Login Successful');
      setTargetLoginErrorMessage("");
      setIsLoggedInToTargetOrg(true);
      //await setTimeout(() => {  console.log("Continuing..!"); }, 5000);
    }else{
      setTargetLoginErrorMessage(data);
    }
    
    
  };

  const handleDiffUserLoginClick = async () => {
    setIsLoggedInToTargetOrg(false);
    setTargetUsername("");
    setTargetPassword("");
    setStatusMesg("");
  }

  const updateTargetUsername = (e) => {
    setTargetUsername(e.target.value);
  }

  const updateTargetPassword = (e) => {
    setTargetPassword(Buffer.from(e.target.value).toString('base64'));
  }

  const handleIsTargetSandboxChange = (e) => {
    setIsTargetSandbox(!isTargetSandbox);
  }


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
    console.log('in first useEffect');
    setIsLoggedIn(false);
    setShowSeedButton(false);
    setIsSandbox(true);
    
    //getObjectList();
  }, []);

  useEffect(() => {
    // this will be triggered whenever user will be updated
    console.log('in selObject useeffect-->'+selObject);
    if(selObject.length > 0){
      getFieldList();
      //setFields();
      setShowSeedButton(true);
    }
  }, [selObject]);

  useEffect(() => {
    // this will be triggered whenever user will be updated
    console.log('useeffect-->in field filter:'+JSON.stringify(fieldFilters));
    //console.log('useeffect-->in field filter.length:'+fieldFilters.length);
    if(fieldFilters.length !== 0 && fieldFilters[0].selField !== "none"){
      buildWhereClause();
    }
    // when field filters array is empty add a filter
    /*if(fieldFilters.length === 0){
      setFieldFilters([ {id:1, disabled:false, fields:fields, selField:"none", operator:"=", selValue:"", showAnd:false}]);
    }*/

    
    // evaluate filter
    //handleAdvancedFilterValueChange();
  }, [fieldFilters]);

  

  useEffect(() => {
    setWhereClause("WHERE "+queryString);
  }, [queryString]);

  /*useEffect(() => {
    // this will be triggered whenever user will be updated
    console.log('useeffect-fieldFilters-->'+fieldFilters.length);
    console.log('fieldFilters.json:'+JSON.stringify(fieldFilters));
    
  }, [fieldFilters]);*/



  useEffect(() => {
    if(isAdvancedFilter){
      evaluateExpression();
      setQueryString("");
    }
    if(isAdvancedFilter){
      setAdvancedFilterDisabled(false);
      if(expression !== null && expression !== '' && expression.length > 0){
        setErrorMessage("");
      }
      
      const newFieldFilters = [...fieldFilters];
      for(let i = 0; i < newFieldFilters.length; i++){
        newFieldFilters[i].showAnd=false;
      }
      setFieldFilters(newFieldFilters);
    }else{
      setAdvancedFilterDisabled(true);
      setErrorMessage("");
      const newFieldFilters = [...fieldFilters];
      for(let i = 0; i < newFieldFilters.length; i++){
        newFieldFilters[i].showAnd=true;
        if(i === newFieldFilters.length-1){
          newFieldFilters[i].showAnd=false;
        }
      }
      setFieldFilters(newFieldFilters);
    }
  }, [isAdvancedFilter]);

  useEffect(() => {
    // this will be triggered whenever user will be updated
    console.log('useeffect-->'+expression);
    if(expression !== null && expression !== '' && expression.length > 0){
      setErrorMessage("");
      evaluateExpression();
      buildWhereClause();
    }
  }, [expression]);

  const getObjectList = async () => {
    setFieldFilterKey(2);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: `${username}`,
                              password: `${password}`,
                              isSandbox: `${isSandbox}`
                            })
    };
    const response = await fetch(`${OBJECT_API_URL}`,requestOptions );
    //const response = await fetch(`${OBJECT_API_URL}&username=${username}&password=${password}&isSandbox=${isSandbox}`);
    const data = await response.json();
    setObjects(data);
    setIsLoggedIn(true);
    console.log(data);
  };

  const seedDataFromSourceToTarget = async () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: `${username}`,
                              password: `${password}`,
                              isSandbox: `${isSandbox}`,
                              targetusername: `${targetUsername}`,
                              targetpassword: `${targetPassword}`,
                              istargetsandbox: `${isTargetSandbox}`,
                              object: `${selObject}`,
                              whereclause: `${whereClause}`
                            })
    };
    const response = await fetch(`${DATASEED_API_URL}`,requestOptions );
    console.log('seedDataFromSourceToTarget-->'+selObject);
    //const response = await fetch(`${DATASEED_API_URL}username=${username}&password=${password}&isSandbox=${isSandbox}&targetusername=${targetUsername}&targetpassword=${targetPassword}&istargetsandbox=${isTargetSandbox}&object=${selObject}&whereclause=${whereClause}`);
    const data = await response.json();
    setResults(data);
    console.log(results);
  };

  const getFieldList = async () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: `${username}`,
                              password: `${password}`,
                              isSandbox: `${isSandbox}`,
                              object: `${selObject}`
                            })
    };
    const response = await fetch(`${FIELD_API_URL}`,requestOptions );
    //const response = await fetch(`${FIELD_API_URL}username=${username}&password=${password}&isSandbox=${isSandbox}&object=${selObject}`);
    const data = await response.json();
    setFields(data);
    setIsAdvancedFilter(false);
    setAdvancedFilterDisabled(true);
    setQueryString('');
    setWhereClause('');
    setFieldFilters([ {id:1, disabled:false, fields:fields, selField:"none", operator:"=", selValue:"", showAnd:false}]);
    
    
    console.log(data);
  };

  const handleInsert = () => {
    
    console.log('Insert Handler Called-'+fieldFilterKey);
    setFieldFilterKey(fieldFilterKey+1);

    const newFieldFilters = [...fieldFilters];
    for(let i = 0; i < newFieldFilters.length; i++){
        newFieldFilters[i].showAnd=true;
    }
    newFieldFilters.push({id:fieldFilterKey, 
                          disabled:true, 
                          fields:{fields}, 
                          selField:"none", 
                          operator:"=", 
                          selValue:"", 
                          showAnd:false});
    setFieldFilters(newFieldFilters);
  }

  const handleFieldFilterDropdownChange = (id, value) => {
    console.log('inmn handleFieldFilterState-'+id+'--'+value);
    const newFieldFilters = [...fieldFilters];
    newFieldFilters.filter(fieldFilter => fieldFilter.id === id).map(filteredFieldFilter =>filteredFieldFilter.selField={value});
    if(value != "none"){
      for(let i = 0; i < newFieldFilters.length; i++){
        if(newFieldFilters[i].id === id+1){
          newFieldFilters[i].disabled=false;
          break;
        }
      }
      setFieldFilters(newFieldFilters);
    }else{
      for(let i = 0; i < newFieldFilters.length; i++){
        if(newFieldFilters[i].id > id){
          newFieldFilters[i].disabled=true;
        }
      }
      setFieldFilters(newFieldFilters);
    }
    //buildWhereClause();
    // evaluate filter
    setErrorMessage("");
    evaluateExpression();
    //handleAdvancedFilterValueChange();
  }

  const handleFieldFilterOperatorChange = (id, value) => {
    console.log('inmn handleFieldFilterState-'+id+'--'+value);
    const newFieldFilters = [...fieldFilters];
    newFieldFilters.filter(fieldFilter => fieldFilter.id === id).map(filteredFieldFilter =>filteredFieldFilter.operator={value});
    setFieldFilters(newFieldFilters);
    console.log('fieldFilters.json:'+JSON.stringify(fieldFilters));
    //buildWhereClause();
    //evaluateExpression();
    // evaluate filter
    //handleAdvancedFilterValueChange();
  }

  const handleFieldFilterValueChange = (id, value) => {
    console.log('inmn handleFieldFilterState-'+id+'--'+value);
    const newFieldFilters = [...fieldFilters];
    newFieldFilters.filter(fieldFilter => fieldFilter.id === id).map(filteredFieldFilter =>filteredFieldFilter.selValue={value});
    setFieldFilters(newFieldFilters);
    console.log('fieldFilters.json:'+JSON.stringify(fieldFilters));
    //buildWhereClause();
    //evaluateExpression();
    // evaluate filter
    //handleAdvancedFilterValueChange();
  }

  const handleAdvancedFilterValueChange = (e) => {
    
    console.log('in handleAdvancedFilterValueChange--'+e.target.value);
    setExpression(e.target.value);
    //evaluateExpression();
  }
  const evaluateExpression = () =>{
    if(expression === '' || expression === undefined || expression.length === 0){
      return;
    }
    let expArray = [];
    /*let index = expression.indexOf(" ");
    if(index === -1){
      setErrorMessage("");
      console.log("there is no space in the expression");
    }else{
      setErrorMessage("Expression is invalid. There is space in the expression.");
    }
    console.log('-->'+expression.indexOf(" "));*/
    console.log('console.log-->'+expression);
    expression = expression.toUpperCase();
    expArray = splitExpression(expression);
    console.log('**-->expArray:'+expArray);
    let filterIds = getFieldFilterIds();
    //const newFieldFilters = [...fieldFilters];
    //console.log('newFieldFilters:'+JSON.stringify(newFieldFilters));
    //newFieldFilters.filter(fieldFilter => !fieldFilter.disabled && fieldFilter.selField !== "none"&& fieldFilter.selField.value !== "none").map(filteredFieldFilter =>filterIds.push(filteredFieldFilter.id));
    console.log('-->filterIds.length:'+filterIds.length+' filterIds:'+filterIds);
    console.log('expArray:'+expArray);
    if(expArray !== undefined){
      validateExpression(filterIds, expArray);
    }
    
  }

  const getFieldFilterIds = () => {
    let filterIds = [];
    const newFieldFilters = [...fieldFilters];
    newFieldFilters.filter(fieldFilter => !fieldFilter.disabled && fieldFilter.selField !== "none"&& fieldFilter.selField.value !== "none").map(filteredFieldFilter =>filterIds.push(filteredFieldFilter.id));
    return filterIds;
  }

  const validateExpression = (filterIds, expArray) => {
    // only filters in filterIds should be present in expression
    // 24 is not present in filterIds
    let stack = [], open = 0, close = 0;
    for(let i = 0; i < expArray.length; i++){
      if(typeof(expArray[i]) === "number"){
        if(!filterIds.includes(expArray[i])){
          console.log('-->numcheck:'+expArray[i]+' ::');
          setErrorMessage("Expression is invalid. Filter number does not exist in the above crieria.");
          setQueryString("");
          console.log("1** Expression is invalid. Please check syntax.");
          return;
        }
        
      }
      if(expArray[i] === ')'){
        close++;
        let expr = '';
        let numOfOperators = 0, numOfFields = 0;
        while(stack.length > 0){
          let elem = stack.pop();
          if(elem === '('){
            break;
          }
          if(Array.from(elem)[0] === 'A' || Array.from(elem)[0] === 'O'){
            numOfOperators++;
            
          }else{
            numOfFields++;
          }
          expr = expr+elem;
          console.log('expr:'+expr+' stack:'+stack);
        }
        console.log('numOfOperators:'+numOfOperators+' numOfFields:'+numOfFields);
        if((numOfOperators === 1 && numOfFields === 2) || (numOfOperators === 0 && numOfFields === 1)){
          stack.push(expr);
        }else{
          setErrorMessage("2** Expression is invalid. Please check syntax.");
          setQueryString("");
          console.log("Expression is invalid. Please check syntax.");
          return;
        }
      }else{
        if(expArray[i] === '('){
          open++;
        }
        stack.push(expArray[i]);
      }
    }
    if(open !== close){
      setErrorMessage("Expression is invalid. Number of Open paranthesis doesn't match Number of Close paranthesis. Please check syntax.");
      setQueryString("");
      return;
    }
    console.log('stack.length:'+stack.length);
    if(stack.length !== 1 && stack.length !== 3){
      setErrorMessage("3** Expression is invalid. Please check syntax.");
      setQueryString("");
      console.log("Expression is invalid. Please check syntax.");
      return;
    }
  }

  const splitExpression = (exp) => {
    console.log('exp:'+exp+' len:'+exp.length);
    let expArray = [];
    let queryString = '';
    const filterMap = getFilterMap();
    for(let i = 0; i < exp.length; i++){
      console.log('iiii:'+i);
      if(exp[i] === ' '){
        continue;
      }else if(exp[i] === '('){
        
        expArray.push('(');
        queryString += '(';
        console.log('i:'+i+' exp[i]:'+exp[i]);
        console.log('expArray:'+expArray);
      }else if(exp[i] === ')'){
        expArray.push(')');
        queryString += ')';
        console.log('i:'+i+' exp[i]:'+exp[i]);
        console.log('expArray:'+expArray);
      }else if(exp[i] === 'A'){
        if(i+1 < exp.length && exp[i+1] === 'N' && i+2 < exp.length && exp[i+2] === 'D'){
          //console.log('valid AND');
          expArray.push('AND');
          i = i+2;
          queryString += ' AND ';
        }else{
          setErrorMessage("4** Expression is invalid. Valid expression is (1 AND 2) OR 3");
          return;
        }
      }else if(exp[i] === 'O'){
        if(i+1 < exp.length && exp[i+1] === 'R'){
          console.log('valid OR');
          expArray.push('OR');
          i = i+1;
          queryString += ' OR ';
        }else{
          setErrorMessage("5** Expression is invalid. Valid expression is (1 AND 2) OR 3");
          return;
        }
      }else if(exp[i] >= 0 && exp[i] <= 9){
        let j = i;
        let numString = '';
        while(j < exp.length && exp[j] >= 0 && exp[j] <= 9){
          numString += exp[j];
          j++;
        }
        if(j !== exp.length-1 && exp[j] === ' '){
          setErrorMessage("5** Expression is invalid. Valid expression is (1 AND 2) OR 3");
          return;
        }
        //console.log('i:'+i+' j:'+j);
        i = i + (j-i)-1;
        //console.log('**i:'+i+' j:'+j);
        let fieldNumber = parseInt(numString);
        expArray.push(fieldNumber);
        queryString += filterMap.get(fieldNumber);
        console.log('i:'+i+' exp[i]:'+exp[i]);
        console.log('expArray:'+expArray);
      }else{
        setErrorMessage("6** Expression is invalid. Valid expression is (1 AND 2) OR 3");
        return;
      }
    }
    setQueryString(queryString);
    console.log('-->'+expArray);
    console.log('-->queryString:'+queryString);
    return expArray;
  }

  const getFilterMap = () => {
    const filterMap = new Map();
    for(let i = 0; i < fieldFilters.length; i++){
      let filterExpression = '';
      if(!fieldFilters[i].disabled && fieldFilters[i].selField !== "none" && fieldFilters[i].selField.value !== "none"){
        let selField, operator, selValue;
        if(fieldFilters[i].selField.value != undefined){
          selField = fieldFilters[i].selField.value;
        }else{
          selField = fieldFilters[i].selField;
        }
        if(fieldFilters[i].operator.value != undefined){
          operator = fieldFilters[i].operator.value;
        }else{
          operator = fieldFilters[i].operator;
        }
        if(fieldFilters[i].selValue.value != undefined){
          selValue = fieldFilters[i].selValue.value;
          console.log('if selValue:'+selValue);
        }else{
          console.log('else selValue:'+selValue);
          selValue = fieldFilters[i].selValue;
        }
        filterExpression = selField+" "+operator+" "+selValue;
        filterMap.set(fieldFilters[i].id, filterExpression);
      }
    }
    return filterMap;
  }

  const buildWhereClause = () => {
    console.log('in buildWhereClause::: '+expression);
    const filterMap = new Map();
    // leading zeroes should be removed
    // below error should be removed
    // #1 billingpostalcode = 4
    // #2 billingcountry = 1
    // #3 shippingstreet = 6
    // 2 OR 3
    //else if queryString:BillingCountry = BillingPostalCode = 4 OR ShippingStreet = 6

    //const newFieldFilters = [...fieldFilters];
    let fieldFiltersArray = [];
    for(let i = 0; i < fieldFilters.length; i++){
      let filterExpression = '';
      if(!fieldFilters[i].disabled && fieldFilters[i].selField !== "none" && fieldFilters[i].selField.value !== "none"){
        let selField, operator, selValue;
        if(fieldFilters[i].selField.value != undefined){
          selField = fieldFilters[i].selField.value;
        }else{
          selField = fieldFilters[i].selField;
        }
        if(fieldFilters[i].operator.value != undefined){
          operator = fieldFilters[i].operator.value;
        }else{
          operator = fieldFilters[i].operator;
        }
        if(fieldFilters[i].selValue.value != undefined){
          selValue = fieldFilters[i].selValue.value;
          console.log('if selValue:'+selValue);
        }else{
          console.log('else selValue:'+selValue);
          selValue = fieldFilters[i].selValue;
        }
        filterExpression = selField+" "+operator+" "+selValue;
        if(advancedFilterDisabled){
          fieldFiltersArray.push(filterExpression);
        }else{
          filterMap.set(fieldFilters[i].id, filterExpression);
        }
      }
    }
    console.log('-->'+fieldFiltersArray);
    if(advancedFilterDisabled && fieldFiltersArray.length > 0){
      console.log('--:'+fieldFiltersArray.join(" AND "));
      //let string = ;
      //console.log('string:'+string);
      setQueryString(fieldFiltersArray.join(" AND "));
      console.log('queryString:'+queryString);
      console.log('queryString:'+JSON.stringify(queryString));
      
    }

  }

  const handleEnableAdvacedFilterChange = () =>{
    console.log('-->before-checkbox:'+isAdvancedFilter);
    console.log('queryString:'+queryString);
    console.log('whereClause:'+whereClause);
    setIsAdvancedFilter(!isAdvancedFilter);
    console.log('-->after-checkbox:'+isAdvancedFilter);

  }

  
  const handleFieldChange = async () => {
    console.log('-->in handleFieldChange');
  };

  return (
    <div className="App">
      <h1>Salesforce Data Seeding Tool</h1>
      {!isLoggedIn ? <div >
        <div>Username: <input type="text" id="usernameField" onChange={(e) => updateUsername(e)} ></input></div>
        <div><span> </span>&nbsp;</div>
        <div>Password: <input type="password" id="passwordField" onChange={(e) => updatePassword(e)} ></input></div>
        <div><span> </span>&nbsp;</div>
        Is Sandbox? <input type="checkbox" id="isSandbox" 
                                checked={isSandbox}
                                onChange={handleIsSandboxChange}></input>
        <div><span> </span>&nbsp;</div>
        <button onClick={handleLoginClick}>Login</button>
        <p>{statusMesg}</p>
        <p style={{ color: 'red' }}>{errorMessage}</p>
        </div>
      :
      <>
      <span className="m-2">Object List</span>
      <span> </span>&nbsp;&nbsp;
      {objects?.length > 0 ? (
        <select onChange={handleObjectChange}> 
          <option value="none"> -- Select an object -- </option>
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
        <p>Filter Results By <button onClick={() => handleInsert()}>Add</button></p> 
        
        {fieldFilters.map((fieldFilter) => <FieldFilter 
                                              key={fieldFilter.id} 
                                              fields={fields} 
                                              id={fieldFilter.id} 
                                              disabled={fieldFilter.disabled} 
                                              operator={fieldFilter.operator}
                                              updateFieldFilterDropdownChange={handleFieldFilterDropdownChange} 
                                              updateFieldFilterOperatorChange={handleFieldFilterOperatorChange}
                                              updateFieldFilterValueChange={handleFieldFilterValueChange}
                                              showAnd={fieldFilter.showAnd}
                                              />)}
        <input type="checkbox" id="enabledAdvancedFilter" 
                                name="enableAdvancedFilter" 
                                checked={isAdvancedFilter}
                                onChange={handleEnableAdvacedFilterChange}></input>
        <input type="text" id="advancedFilter" onChange={(e) => handleAdvancedFilterValueChange(e)} disabled={advancedFilterDisabled}></input>
        <p style={{ color: 'red' }}>{errorMessage}</p>
        <p>{queryString.length > 0 && whereClause}</p>
        </>
          
      ) : (
        <div className="empty">
          
        </div>
      )}
      <h2>Target Org Login</h2>
      { !isLoggedInToTargetOrg ? (
          <div >
            <div>Username: <input type="text" id="usernameField" onChange={(e) => updateTargetUsername(e)} ></input></div>
            <div><span> </span>&nbsp;</div>
            <div>Password: <input type="password" id="passwordField" onChange={(e) => updateTargetPassword(e)} ></input></div>
            <div><span> </span>&nbsp;</div>
            Is Sandbox? <input type="checkbox" id="isSandbox" 
                                    checked={isTargetSandbox}
                                    onChange={handleIsTargetSandboxChange}></input>
            <div><span> </span>&nbsp;</div>
            <button onClick={handleTargetLoginClick}>Login</button>
            <p>{statusMesg}</p>
            <p style={{ color: 'red' }}>{targetLoginErrorMessage}</p>
          </div>)
        : (
          <div >
            <button onClick={handleDiffUserLoginClick}>Login to a different Org</button> Logged in as {targetUsername}
          </div>
        )
      }

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
        </>
      }

    </div>
    
  );
}

export default App;
