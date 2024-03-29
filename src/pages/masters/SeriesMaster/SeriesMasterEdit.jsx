import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import SeriesMasterTwo from './SeriesMasterTwo'

function SeriesMasterEdit() {
    const series_code =useParams();
    const navigate =useNavigate();

    const [rows_data, setRows_data] =useState(null)
   
      useEffect(() =>{
        axios.get(`/api/series/${series_code.slug}`)
        .then((response) => {
          if(response){
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
    <SeriesMasterTwo rows_data={rows_data}/>
  )
}

export default SeriesMasterEdit