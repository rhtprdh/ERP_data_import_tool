import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import StaxMasterTwo from './StaxMasterTwo'

function StaxMasterEdit() {
    const stax =useParams()
    const navigate =useNavigate()

    const [rows_data, setRows_data] =useState(null)
   
    //  if(editMode === "true"){
      useEffect(() =>{
        axios.get(`/api/stax/${stax.slug}`)
        .then((response) => {
          if(response){
            console.log(response.data);
            setRows_data(response.data.data);
          }
        })
        .catch((error) => {
            navigate('/')
          console.log(error)
          
        })
      },[])
      if (!rows_data) return <div>Loading...</div>;
  return (
    <StaxMasterTwo rows_data={rows_data}/>
  )
}

export default StaxMasterEdit