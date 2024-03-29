import React, { useEffect } from 'react'
import GlobalTable from '../../../components/Table'
import {Button, Search} from '../../../components/Index'
import { useState } from 'react'
import axios from 'axios'


function EntityMaster() {
  const columns =[
        { id: 'entity_code', label: 'Entity Code' },
        { id: 'entity_name', label: 'Entity Name' },
        { id: 'gst_code', label: 'GST Code' },
      //  { id: 'div_code', label: 'Div  code'},
      //  { id: 'div_name', label: 'Div Name'},
     
       
       ] 

       const [rows, setRows] = useState([]);

       useEffect(() => {
        // console.log( axios.get('/api/division'))
        axios.get('/api/entity')
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
      // console.log(rows)
       const navAddButtonLink="/entity-master-page"
       const edit ="/entity-master-page/:slug"
       const editValue="entity_code"
       const deleteUrl='entity';
  if (!rows) return <div>Loading...</div>;
  return (
    <div className="py-5 px-5">
    <GlobalTable columns={columns} rows={rows} navAddButtonLink ={navAddButtonLink} editValue={editValue} deleteUrl={deleteUrl}  />
    </div>
  )
}

export default EntityMaster