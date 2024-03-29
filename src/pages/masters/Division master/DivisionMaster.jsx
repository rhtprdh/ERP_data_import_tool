import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import {Select, Input, Button} from '../../../components/Index'
import { useNavigate, useParams } from 'react-router-dom'
import Axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import SearchableTable from '../../../selectComponents/SearchableTable';
import { removeTodo } from '../../../features/todo/todoSlice';
// import { reset } from 'nodemon';

function DivisionMaster({ rows_data  }) {
  const[entity_code, setEntity_code] =useState('');
  const[entity_name, setEntity_name] =useState('');
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [slugValue, setSlugValue] = useState();
  const dispatch = useDispatch();
  const todos = useSelector(state => state.todos);
  // rows_data ={
    // div_code : "FsadG" ,div_name:  " dasdasFINKAL GRAND DIVISION", entity_code:"ER"}
  const { register, handleSubmit, watch, setValue,reset, control, getValues } = useForm({
    defaultValues: {
        div_code: rows_data?.div_code || "",
        div_name: rows_data?.div_name || "",
        entity_code: rows_data?.entity_code || "",
        entity_name: rows_data?.entity_name || "",
    },
});

    const navigate= useNavigate();

  

    
      const submit = (data) => {
        if(entity_code){
          data = { ...data, entity_code: entity_code};
         }
        if(rows_data){
          Axios.post(`/api/division/${rows_data.div_code}`, data)
          .then((response) => {
            alert(`Devision updated Successfully`);
            setEntity_code('');
            setEntity_name('');
            reset();
            navigate(-1)
          })
          .catch((error) => {
            console.error('Error adding data:', error);
          });

        }else{
        Axios.post('/api/division', data)
      .then((response) => {
        alert(`Devision Added Successfully`);
        setEntity_code('');
        setEntity_name('');
        reset();
        // Clear form fields after successful submission
        // setPostData({ name: '', email: '' });
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
         if(slugValue ==='entity'){
          todos.map((todo)=>{
            setEntity_code(todo.text.id)
            setEntity_name(todo.text.name)
            dispatch(removeTodo(todo.id))
          })
        }
      },[todos])
  
      const filters = {
        entity_code: entity_code,
      //  div_code: div_code,
        // series_code: series_code,
          };

      
  return (
    <div>
    {isTableOpen &&
    <div>
      <SearchableTable 
      onClick={handleTable}
      slugValue={slugValue}
      filters={filters}/>
    </div>
      }
         {!isTableOpen &&
         <div className=" m-2 min-h-[100px] rounded shadow-xl sm:col-span-4 bg-slate-300  justify-center items-center">

         
    <form onSubmit={handleSubmit(submit)} className="mr-1">
    <div className="sm:flex">
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
          required
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
        label='Division'
        {...register("div_code", { required: true, maxLength:2, max:2 } )}
        onChange={(event) =>{handleInputChange(event,2)}}
        />
        </div>
        <div className="w-7/12 sm:w-8/12">
        <Input 
        {...register("div_name", {required:true})}
        onChange={(event) =>{handleInputChange(event,150)}}
        />
        </div>
        </div>
    </div>
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
}
    </div>
  )
}

export default DivisionMaster