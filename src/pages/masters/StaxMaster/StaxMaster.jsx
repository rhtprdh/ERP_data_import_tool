import React, { useEffect } from 'react'
import GlobalTable from '../../../components/Table'
import {Button, Search} from '../../../components/Index'
import { useState } from 'react'
import axios from 'axios'


function StaxMaster() {
  const columns =[
        { id: 'stax_code', label: 'Stax Code' },
        { id: 'stax_name', label: 'Stax Name' },
        { id: 'stax_for', label: 'Stax For' },
      //  { id: 'div_code', label: 'Div  code'},
      //  { id: 'div_name', label: 'Div Name'},
     
       
       ] 

       const [rows, setRows] = useState([]);

       useEffect(() => {
        // console.log( axios.get('/api/division'))
        axios.get('/api/stax')
        .then((response) => {
          setRows(response.data.data)
          
          
        })
        .catch((error) => {
          console.log(error)
        })
       },[])
      //  const rows = [
      //  { div_code:'FD', div_name:'fixed unit 1', entity_code:'GH', entity_name:'Global Heart Pvt Ltd'},
      //  { div_code:'FS', div_name:'fixed sale unit 2'},
      //  { div_code:'Fg', div_name:'fixed sale unit 2'}
      //  ]
       const navAddButtonLink="/stax-master-page"
       const edit ="/stax-master-page/:slug"
       const editValue="stax_code"
       const deleteUrl='stax';
  if (!rows) return <div>Loading...</div>;
  return (
    <div className="py-5 px-5">
    <GlobalTable columns={columns} rows={rows} navAddButtonLink ={navAddButtonLink} editValue={editValue} deleteUrl={deleteUrl}  />
    </div>
  )
}

export default StaxMaster