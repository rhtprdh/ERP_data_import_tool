import React, { useEffect } from 'react'
import GlobalTable from '../../../components/Table'
import {Button, Search} from '../../../components/Index'
import { useState } from 'react'
import axios from 'axios'


function SeriesSeq() {
  const columns =[
        { id: 'vrSeq', label: 'Series Sequence' },
        { id: 'lastVrno', label: 'Last Voucher' },
        { id: 'entity_code', label: 'Entity Code' },
        { id: 'entity_name', label: 'Entity Name' },
       { id: 'div_code', label: 'Div  code'},
       { id: 'div_name', label: 'Div Name'},
     
       
       ] 

       const [rows, setRows] = useState([]);

       useEffect(() => {
        axios.get('/api/vrseq')
        .then((response) => {
          setRows(response.data.data)
          
          
        })
        .catch((error) => {
          console.log(error)
        })
       },[])
    
       const navAddButtonLink="/vrseq-master-page"
       const edit ="/vrseq-master-page/:slug"
       const editValue="vrSeq"
       const deleteUrl='vrseq';
  if (!rows) return <div>Loading...</div>;
  return (
    <div className="py-5 px-5">
    <GlobalTable columns={columns} rows={rows} navAddButtonLink ={navAddButtonLink} deleteAllButton editValue={editValue} deleteUrl={deleteUrl} />
    </div>
  )
}

export default SeriesSeq