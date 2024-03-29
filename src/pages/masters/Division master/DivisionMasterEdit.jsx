import React, { useEffect, useState } from 'react'
import DivisionMaster from './DivisionMaster'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

function DivisionMasterEdit() {
    const div_code =useParams()
    const navigate =useNavigate()

    const [rows_data, setRows_data] =useState(null)
   
      useEffect(() =>{
        axios.get(`/api/division/${div_code.slug}`)
        .then((response) => {
          if(response){
            setRows_data(response.data.data)
          }
        })
        .catch((error) => {
            navigate('/')
          console.log(error)
          
        })
      },[])
      if (!rows_data) return <div>Loading...</div>;
  return (
    <DivisionMaster rows_data={rows_data}/>
  )
}

export default DivisionMasterEdit