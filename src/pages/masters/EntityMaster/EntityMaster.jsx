import React, { useEffect } from 'react';
import GlobalTable from '../../../components/Table';
import { useState } from 'react';
import axios from 'axios';


function EntityMaster() {
  const columns =[
        { id: 'entity_code', label: 'Entity Code' },
        { id: 'entity_name', label: 'Entity Name' },
        { id: 'gst_code', label: 'GST Code' },
      ] 

       const [rows, setRows] = useState([]);

       useEffect(() => {
        // console.log( axios.get('/api/division'))
        axios.get('//13.126.114.161:3000/api/entity')
        .then((response) => {
          setRows(response.data.data)
          
          
        })
        .catch((error) => {
          console.log(error)
        })
       },[]);

       const navAddButtonLink="/entity-master-page";
       const edit ="/entity-master-page/:slug";
       const editValue="entity_code";
       const deleteUrl='entity';
  if (!rows) return <div>Loading...</div>;
  return (
    <div className="py-5 px-5">
    <GlobalTable columns={columns} rows={rows} navAddButtonLink ={navAddButtonLink} editValue={editValue} deleteUrl={deleteUrl}  />
    </div>
  )
}

export default EntityMaster