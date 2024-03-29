import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import SeriesSeqTwo from './SeriesSeqTwo';

function SeriesSeqEdit() {
    const vrSeq =useParams();
    const navigate =useNavigate();

    const [rows_data, setRows_data] =useState(null)
   
      useEffect(() =>{
        // console.log(`/api/vrseq/seq/${vrSeq.slug}`);
        axios.get(`/api/vrseq/seq/${vrSeq.slug}`)
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
    <SeriesSeqTwo rows_data={rows_data}/>
  )
}

export default SeriesSeqEdit