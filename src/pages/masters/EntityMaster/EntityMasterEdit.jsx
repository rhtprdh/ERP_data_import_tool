import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import EntityMasterTwo from './EntityMasterTwo'

function EntityMasterEdit() {
    const entity_code =useParams()
    const navigate =useNavigate()

    const [rows_data, setRows_data] =useState(null)
   
    //  if(editMode === "true"){
      useEffect(() =>{
        axios.get(`/api/entity/${entity_code.slug}`)
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
    <EntityMasterTwo rows_data={rows_data}/>
  )
}

export default EntityMasterEdit