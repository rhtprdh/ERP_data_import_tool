import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import {Select, Input, Button} from '../../../components/Index'
import { useNavigate, useParams } from 'react-router-dom'
import Axios from 'axios';
import SearchableTable from '../../../selectComponents/SearchableTable';
import { useDispatch, useSelector } from 'react-redux';
import { removeTodo } from '../../../features/todo/todoSlice';

function SeriesSeqTwo({ rows_data  }) {

  const[div_code, setDiv_code] =useState('');
  const[div_name, setDiv_name] =useState('');
  const[entity_code, setEntity_code] =useState('');
  const[entity_name, setEntity_name] =useState('');
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [slugValue, setSlugValue] = useState();
  const dispatch = useDispatch();
  const todos = useSelector(state => state.todos);
  const { register, handleSubmit, watch, setValue, reset, control, getValues } = useForm({
    defaultValues: {
        vrSeq: rows_data?.vrSeq || "",
        lastVrno: rows_data?.lastVrno || "",
        entity_code: rows_data?.entity_code || entity_code,
        entity_name: rows_data?.entity_name || "",
        div_code: rows_data?.div_code || div_code,
        div_name: rows_data?.div_name || "",
    
    },
});

    const navigate= useNavigate();
  
    
      const submitSeries = (data) => {
        if(!rows_data){
         data = { ...data, entity_code: entity_code, div_code: div_code };
        }
        if(rows_data){
          // console.log(`/api/vrseq/${rows_data.vrSeq}` );
          Axios.post(`/api/vrseq/m/:${rows_data.vrSeq}`, data)
          .then((response) => {
            alert(`Series Updated Successfully`);
            setDiv_code('');
            setDiv_name('');
            setEntity_code('');
            setEntity_name('');
            rows_data.vrSeq='';
            rows_data.lastVrno='';
            reset();
          })
          .catch((error) => {
            console.error('Error adding data:', error);
          });

        }else{
        Axios.post(`/api/vrseq`, data)
      .then((response) => {
        alert(`Voucher Sequence Added Successfully`);
        // Clear form fields after successful submission
        // setPostData({ name: '', email: '' });
        setDiv_code('');
        setDiv_name('');
        setEntity_code('');
        setEntity_name('');
        reset();
      })
      .catch((error) => {
        console.error('Error adding data:', error);
      });
      }
      reset();
    }

    
      // console.log(watch("div_code")) // watch input value by passing the name of it
      const handleInputChange = (event) => {
        const value = event.target.value.slice(0, 2).toUpperCase();
        event.target.value = value;
      };
      const handleInputChangeFiveChar = (event) => {
        const value = event.target.value.slice(0, 5).toUpperCase();
        event.target.value = value;
      };

      const handleInputClick = (e) => {
        // navigate('/search-table/:division')
        setDiv_code(e.target.value);
        setSlugValue('division')
        setIsTableOpen(true);
      };
      const handleEntityClick = () => {
        // navigate('/search-table/:division')
        setSlugValue('entity')
        setIsTableOpen(true);
      };
      const handleTable=(e)=>{
        // setSlugValue('')
        setIsTableOpen(false)
      }
      const handleChange = (selectedOption) => {
        setDivision(selectedOption.value)
      };
      useEffect(()=>{
        if(slugValue ==='division'){
          todos.map((todo)=>{
            setDiv_code(todo.text.id)
            setDiv_name(todo.text.name)
            dispatch(removeTodo(todo.id))
          })
        } 
        else if(slugValue ==='entity'){
          todos.map((todo)=>{
            setEntity_code(todo.text.id)
            setEntity_name(todo.text.name)
            dispatch(removeTodo(todo.id))
          })
        }
      },[todos])

      
  return (
    <div>
    {isTableOpen &&
    <div>
      <SearchableTable 
      onClick={handleTable}
      slugValue={slugValue}/>
    </div>
      }
      {!isTableOpen &&
      <div>
           <div className=" m-2 min-h-[100px] rounded shadow-xl sm:col-span-4 bg-slate-300  justify-center items-center">

    <form onSubmit={handleSubmit(submitSeries)} className="m-1">
    {/* <div className="sm:flex">
    <div className="flex sm:w-1/2 ">
        <div className="w-5/12 sm:w-4/12">
               <Input
               label="Entity"
          type="text"
          id="entityCodeInput"
          value={entity_code}
          onChange={handleChange}
          onClick={handleEntityClick}
          {...register("entity_code",)}
          // required
        />
        </div>
        <div className="w-7/12 sm:w-8/12">
        <Input
              value={entity_name}
              onClick={handleEntityClick}
              onChange={handleChange}
              {...register("entity_name",)}
              />
        </div>
        </div>
        <div className="flex sm:w-1/2">
     
     <div className="w-5/12 sm:w-4/12">
                   <Input
          label ='Devision'
          type="text"
          id="divCodeInput"
          value={div_code}
          onClick={handleInputClick}
          onChange={handleChange}
          {...register("div_code",)}
          // required
        />
        </div>
        <div className="w-7/12 sm:w-8/12">
        <Input
              value={div_name}
              onClick={handleInputClick}
              onChange={handleChange}
              {...register("div_name",)}
              />
        </div>
        </div>
    </div> */}
    <div className="flex">
        <div className="flex w-1/2">
        {/* <div className="w-1/2"> */}
        <Input
        label='Series Seq.'
        {...register("vrSeq", { required: true } )}
        onChange={handleInputChange}
        />
        
        </div>
        <div className="flex w-1/2">
        {/* <div className="w-2/2"> */}
        <Input
        label='Last Vrno'
        {...register("lastVrno", { required: true, 
        } )}
        onChange={handleInputChangeFiveChar}
        />
        {/* </div> */}
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
<div className="flex ">
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
        </div>
        }
    </div>
  )
}

export default SeriesSeqTwo