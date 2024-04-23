import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import {Select, Input, Button} from '../../../components/Index';
import { useNavigate, useParams } from 'react-router-dom';
import Axios from 'axios';

function EntityMasterTwo({ rows_data  }) {
  const { register, handleSubmit, watch, setValue,reset, control, getValues } = useForm({
    defaultValues: {
        entity_code: rows_data?.entity_code || "",
        entity_name: rows_data?.entity_name || "",
        gst_code: rows_data?.gst_code || "",
    },
});

    const navigate= useNavigate();
  
    
      const submit = (data) => {
        if(rows_data){
          Axios.post(`/api/entity/${rows_data.entity_code}`, data)
          .then((response) => {
            alert(`Entity updated Successfully`);
            reset();
            navigate(-1);
          })
          .catch((error) => {
            console.error('Error adding data:', error);
          });

        }else if(!rows_data){
        Axios.post(`/api/entity`, data)
      .then((response) => {
        alert(`Entity Added Successfully`);
        reset();
      })
      .catch((error) => {
        console.error('Error adding data:', error);
      });
      }
    }
        const handleInputChange = (event, length) => {
        const value = event.target.value.slice(0, length).toUpperCase();
        event.target.value = value;
      };
   

      
  return (
    <>
    <div className=" m-2 min-h-[100px] rounded shadow-xl sm:col-span-4 bg-slate-300  justify-center items-center">

    <form onSubmit={handleSubmit(submit)} className="mr-1">
    <div className="flex">
        <div className="w-1/3">
        <Input
        label='Entity'
        {...register("entity_code", { required: true } )}
        onChange={(event) => handleInputChange(event,2)}
        />
        </div>
        <div className="w-2/3">
        <Input 
        {...register("entity_name", { required: true })}
        onChange ={(event) =>{ handleInputChange(event,150)}}
        />
        </div>
        {/* <div className="flex w-1/2">
        <div className="w-1/3">
        <Input
        label='Division'
        {...register("div_code", { required: true, maxLength:2, max:2 } )}
        />
        </div>
        <div className="w-2/3">
        <Input 
        {...register("div_name", {required:true})}
        />
        </div>
        </div> */}
    </div>

    <div className="flex">
        <div className="w-2/3">
        <Input 
        label="GST Number"
        {...register("gst_code", { required: true })}
        onChange ={(event) =>{ handleInputChange(event,15)}}
        />
        </div>
    </div>


    {/* <div className="flex">
      <div className="w-6/12 ">
    <Input
    label='Address'
    className=""
    {...register("add1",{ required:true})}
    />
     <Input
    label='Address2'
    className=""
    {...register("add2")}
    />
     <Input
    label='Address3'
    className=""
    {...register("add3")}
    />

      </div>
      <div className="w-6/12 ">
    <Input
    label='Pin'
    className=""
    {...register("pin",{ required:true})}
    />
       <Input
    label='Phone No'
    className=""
    {...register("phone_no")}
    />
        <Input
    label='Email'
    className=""
    {...register("email")}
    />
      </div>
    </div> */}
      <div className="flex">
      <Button type="submit"  className="w-full m-5">
            {rows_data ? "Update" : "Submit"}
        </Button>
      </div>
       
    
</form>
          <div className="flex ">
                  
          <Button type=""  className="w-full m-5">
              {/* {post ? "Update" : "Submit"} */}Clear
          </Button>
          <Button type="" onClick={() => navigate(-1)} className="w-full m-5">
              {/* {post ? "Update" : "Submit"} */}Exit
          </Button>
          </div>
          </div>
</>
  )
}

export default EntityMasterTwo