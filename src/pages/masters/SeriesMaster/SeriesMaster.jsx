import React, { useEffect } from 'react'
import GlobalTable from '../../../components/Table'
import {Button, Search} from '../../../components/Index'
import { useState } from 'react'
import axios from 'axios'


function SeriesMaster() {
  const columns =[
        { id: 'series_code', label: 'Series Code' },
        { id: 'series_name', label: 'Series Name' },
        { id: 'entity_code', label: 'Entity Code' },
        { id: 'entity_name', label: 'Entity Name' },
       { id: 'div_code', label: 'Div  code'},
       { id: 'div_name', label: 'Div Name'},
       { id: 'post_code', label: 'Post  code'},
       { id: 'bankId', label: 'BankId'},
     
       
       ] 

       const [rows, setRows] = useState([]);

       useEffect(() => {
        // console.log( axios.get('/api/division'))
        axios.get('/api/series')
        .then((response) => {
          setRows(response.data.data)
          
          
        })
        .catch((error) => {
          console.log(error)
        })
       },[])
    
       const navAddButtonLink="/Series-master-page"
       const edit ="/Series-master-page/:slug"
       const editValue="series_code"
       const deleteUrl='series';
  if (!rows) return <div>Loading...</div>;
  return (
    <div className="py-5 px-5">
    <GlobalTable columns={columns} rows={rows} navAddButtonLink ={navAddButtonLink}  editValue={editValue} deleteUrl={deleteUrl}  />
    
    </div>
  )
}

export default SeriesMaster