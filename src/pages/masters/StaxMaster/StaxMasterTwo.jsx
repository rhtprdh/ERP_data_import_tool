import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import {Select, Input, Button} from '../../../components/Index'
import { useNavigate, useParams } from 'react-router-dom'
import Axios from 'axios';

function StaxMasterTwo({ rows_data  }) {
  // rows_data ={
    // div_code : "FsadG" ,div_name:  " dasdasFINKAL GRAND DIVISION", entity_code:"ER"}
  const { register, handleSubmit, watch, setValue,reset, control, getValues } = useForm({
    defaultValues: {
        stax_code: rows_data?.stax_code || "",
        stax_name: rows_data?.stax_name || "",
        stax_for: rows_data?.stax_for || "",
        // div_code: rows_data?.div_code || "",
        // div_name: rows_data?.div_name || "",
    
    },
});
  

    const navigate= useNavigate();
  
    
      const submit = (data) => {
        if(rows_data){
          Axios.post(`/api/stax/${rows_data.stax_code}`, data)
          .then((response) => {
            alert(`Sale Tax updated Successfully`);
            reset();
            navigate(-1)
          })
          .catch((error) => {
            console.error('Error adding data:', error);
          });

        }else if(!rows_data){
        Axios.post(`/api/stax`, data)
      .then((response) => {
        alert(`Sale Tax Added Successfully`)
        // Clear form fields after successful submission
        // setPostData({ name: '', email: '' });
      
        reset();
      })
      .catch((error) => {
        console.error('Error adding data:', error);
      });
      }
    }

    
      // console.log(watch("div_code")) // watch input value by passing the name of it
    
      const handleInputChange = (event, length) => {
        const value = event.target.value.slice(0, length).toUpperCase();
        event.target.value = value;
      };
   

      
  return (
    <>
    <div className=" m-2 min-h-[100px] rounded shadow-xl sm:col-span-4 bg-slate-300  justify-center items-center">

    <form onSubmit={handleSubmit(submit)} className="mr-1">
    <div className="flex">
        {/* <div className="flex w-1/2"> */}
        <div className=" w-5/12 sm:w-3/12 ">
        <Input
        label='Entity'
        {...register("stax_code", { required: true } )}
        onChange={(event) => handleInputChange(event,4)}
        />
        </div>
        <div className="w-7/12 sm:w-9/12">
        <Input 
        {...register("stax_name", { required: true })}
        onChange ={(event) =>{ handleInputChange(event,100)}}
        />
        {/* </div> */}
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

    {/* <div className="flex"> */}
        <div className="flex">
          {/* <div > */}
          <label className="w-5/12 sm:w-3/12 ">
                    Sale Tax For
                    </label>
         
        
                        <select

                       {...register("stax_for", { required: true })}
                        className={`w-7/12 sm:w-9/12 px-3 py-1 bg-blue-200 text-black outline-blue-500 focus:bg-gray-50 duration-200 border border-blue-400 w-full`}
                        // onChange={handleTranTypeChange}
                        required
                        >
                        <option>IGST</option>
                        <option>SGST_CGST</option>
                        
                       
                        </select>
                        {/* </div> */}
        </div>
    {/* </div> */}


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
        <Button type="submit"  className=" w-full m-5">
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

export default StaxMasterTwo