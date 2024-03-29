import React, { useEffect, useState } from 'react'
import Search from '../../../components/Search';
import { GlobalTable } from '../../../components/Index';
import axios from 'axios'

function CropYearMaster() {
    const columns =[
        { id: 'div_code', label: 'Div  code'},
        { id: 'div_name', label: 'Div Name'},
        { id: 'entity_code', label: 'Entity Code' },
        { id: 'entity_name', label: 'Entity Name' },
        { id: 'crop_year', label: 'Crop Year' },
        
        ] 
 
        const [rows, setRows] = useState([]);
 
        useEffect(() => {
         // console.log( axios.get('/api/division'))
         axios.get('/api/crop-year')
         .then((response) => {
           setRows(response.data.data)   
         })
         .catch((error) => {
           console.log(error)
         })
        },[])
       console.log(rows)
        const navAddButtonLink="/crop-year-master-page"
        const edit ="/crop-year-master-page/:slug"
        const editValue="batchno"
        if (!rows) return <div>Loading...</div>;
   return (
     <div className="py-5 px-5">
     <GlobalTable columns={columns} rows={rows} navAddButtonLink ={navAddButtonLink} editValue={editValue}  />
     </div>
   )
 
}

export default CropYearMaster