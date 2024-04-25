import React, { useEffect, useState } from 'react';
import Input from '../components/Input';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import { addTodo } from '../app/features/todo/todoSlice';
import Button from '../components/Button';


const SearchableTable = ({slugValue, onClick, filters}) => {
  const navigate= useNavigate();
    // const history = useHistory();
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [slugApiDataId, setSlugApiDataId] =useState('');
    const [slugApiDataName, setSlugApiDataName] =useState('');
   
    
    useEffect(() => {
     
      // Constructing the query string from the filters object
      const queryString = Object.keys(filters)
      .filter(key => filters[key] !== undefined && filters[key] !== null && filters[key] !== '')
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(filters[key])}`)
      .join('&');
      
      // Appending the query string to the URL
      const apiUrl = `/api/${slugValue}?${queryString}`;
      fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
          if (!Array.isArray(data.data)) {
              console.error('Data fetched from API is not an array');
              return;
            }
          if(slugValue === 'division'){
            setSlugApiDataId('div_code');
            setSlugApiDataName('div_name');
          }else if(slugValue === 'qrtag'){
              setSlugApiDataId('batchno');
              setSlugApiDataName('batchno');
            }else if(slugValue === 'entity'){
              setSlugApiDataId('entity_code');
              setSlugApiDataName('entity_name');
            }else if(slugValue === 'series'){
              setSlugApiDataId('series_code');
              setSlugApiDataName('series_name');
            }else if(slugValue === 'addon'){
              setSlugApiDataId('ADDON_CODE');
              setSlugApiDataName('ADDON_NAME');
            }
          const dataReady = data.data.map((item) => ({
              id: item[slugApiDataId],
              name: item[slugApiDataName],
          }));
    setData(dataReady);
      })
      .catch((error) => {
        console.log(error);
      });

       },[slugApiDataId, slugApiDataName]);
  const [sortedField, setSortedField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (field) => {
    setSortedField(field);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const sortedData = () => {
    if (!sortedField) {
      return data;
    }

    return data.slice().sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1;
      return a[sortedField] > b[sortedField] ? order : -order;
    });
  }

  const filteredData = () => {
    if (!searchTerm) {
      return sortedData();
    }

    return sortedData().filter(item =>
      Object.values(item).some(value =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }

  const [selectedOption, setSelectedOption] = useState('');

  const handleChange=(event) =>{
      dispatch(addTodo(event));
      onClick(false);
    };
    const handleBlankChange=() =>{
      const data= {id:'',name:''};
      dispatch(addTodo(data)); 
      onClick(false);
    }
    const handleBack=(event) =>{
      onClick(false);
    }
  
 
    if (!filteredData()) return <div>Loading...</div>;
    if (filteredData()){
  return (
    <div>
      <div className="flex">
      <Input
        type="search"
        placeholder="Search here"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
        <Button
                      children='Back'
                      className=" flex items-center justify-center h-9 mt-2 mb-1"
                      onClick={() => handleBack()}
                      />
      
      </div>
      <Table stickyHeader aria-label="table">
        <TableHead>
          <TableRow>
            <TableCell onClick={() => handleSort('id')}>Code</TableCell>
            <TableCell onClick={() => handleSort('name')}>Code Name</TableCell>
          </TableRow>
        </TableHead>
       
        <TableBody>
          <TableRow onClick={() => handleBlankChange()}>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
          {filteredData().map((item) => (
            <TableRow key={Math.random()}
            onClick={() => handleChange(item)}
            // value={selectedOption}
            >
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              {/* <TableCell>{item.age}</TableCell> */}
              {/* Add more cells based on your data structure */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );}
};

export default SearchableTable;
