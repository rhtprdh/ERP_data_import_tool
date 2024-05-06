import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import {Select, Input, Button} from '../../../components/Index'
import { useNavigate, useParams } from 'react-router-dom'
import Axios from 'axios';
import SearchableTable from '../../../selectComponents/SearchableTable';
import { useDispatch, useSelector } from 'react-redux';
import { removeTodo } from '../../../features/todo/todoSlice';

function SeriesMasterTwo({ rows_data  }) {
  const [isBankIdVisible, setIsBankIdVisible] = useState(rows_data? true : false);

  const[div_code, setDiv_code] =useState('');
  const[div_name, setDiv_name] =useState('');
  const[entity_code, setEntity_code] =useState();
  const[entity_name, setEntity_name] =useState();
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [slugValue, setSlugValue] = useState();
  const dispatch = useDispatch();
  let divEntityCheck=true;
  const todos = useSelector(state => state.todos);
  // rows_data ={
    // div_code : "FsadG" ,div_name:  " dasdasFINKAL GRAND DIVISION", entity_code:"ER"}
  const { register, handleSubmit, watch, setValue, reset, control, getValues } = useForm({
    defaultValues: {
        series_code: rows_data?.series_code || "",
        series_name: rows_data?.series_name || "",
        entity_code: rows_data?.entity_code || entity_code,
        entity_name: rows_data?.entity_name || "",
        div_code: rows_data?.div_code || div_code,
        div_name: rows_data?.div_name || "",
        post_code: rows_data?.post_code || "",
        bankId : rows_data?.bankId || "",
        tran_type : rows_data?.tran_type || "",
        series_type : rows_data?.series_type || "",
        state_code : rows_data?.state_code || "",
    
    },
});

    const navigate= useNavigate();

    const stateCodes = [
      { value: '', label: '' },
      { value: 'AD', label: 'Andhra Pradesh' },
      { value: 'AR', label: 'Arunachal Pradesh' },
      { value: 'AS', label: 'Assam' },
      { value: 'BR', label: 'Bihar' },
      { value: 'CG', label: 'Chattisgarh' },
      { value: 'DL', label: 'Delhi' },
      { value: 'GA', label: 'Goa' },
      { value: 'GJ', label: 'Gujarat' },
      { value: 'HR', label: 'Haryana' },
      { value: 'HP', label: 'Himachal Pradesh' },
      { value: 'JK', label: 'Jammu and Kashmir' },
      { value: 'JH', label: 'Jharkhand' },
      { value: 'KA', label: 'Karnataka' },
      { value: 'KL', label: 'Kerala' },
      { value: 'LD', label: 'Lakshadweep Islands' },
      { value: 'MP', label: 'Madhya Pradesh' },
      { value: 'MH', label: 'Maharashtra' },
      { value: 'MN', label: 'Manipur' },
      { value: 'ML', label: 'Meghalaya' },
      { value: 'MZ', label: 'Mizoram' },
      { value: 'NL', label: 'Nagaland' },
      { value: 'OD', label: 'Odisha' },
      { value: 'PY', label: 'Pondicherry' },
      { value: 'PB', label: 'Punjab' },
      { value: 'RJ', label: 'Rajasthan' },
      { value: 'SK', label: 'Sikkim' },
      { value: 'TN', label: 'Tamil Nadu' },
      { value: 'TS', label: 'Telangana' },
      { value: 'TR', label: 'Tripura' },
      { value: 'UP', label: 'Uttar Pradesh' },
      { value: 'UK', label: 'Uttarakhand' },
      { value: 'WB', label: 'West Bengal' }
    ];
  
    
      const submitSeries = (data) => {
        // if(!entity_code){
        //   alert(`Please select Entity`);
        //   return;
        // }else if(!div_code){
        //   alert(`Please select Devision`)
        //   return;
        // }
        if(!rows_data){
         data = { ...data, entity_code: entity_code, div_code: div_code };
        }
        
        
        if(rows_data){
          console.log(data);
          Axios.post(`/api/series/${rows_data.series_code}`, data)
          .then((response) => {
             alert(`Series Updated Successfully`)
            setDiv_code('');
            setDiv_name('');
            setEntity_code('');
            setEntity_name('');
            reset();
            navigate(-1)
          })
          .catch((error) => {
            console.error('Error adding data:', error);
          });

        }else{
        Axios.post(`/api/series`, data)
      .then((response) => {
        alert(`Series Added Successfully`);
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
     
    }

    
      // console.log(watch("div_code")) // watch input value by passing the name of it
      const handleInputChange = (event, charLength) => {
        const value = event.target.value.slice(0, charLength).toUpperCase();
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
      },[todos]);
      useEffect(()=>{
        if(!div_code? div_code: rows_data?.div_code || div_code){
        Axios.get(`/api/division/:${div_code? div_code: rows_data?.div_code || div_code}`)
        .then((response) => {
          if(response){
            if(response.data.data.entity_code !== entity_code? entity_code: rows_data?.entity_code|| entity_code){
              alert(`The selected division ${div_code? div_code: rows_data?.div_code || div_code}: ${div_code? div_name: rows_data?.div_name|| div_name} is not in entity ${entity_code? entity_code: rows_data?.entity_code|| entity_code}: ${entity_code? entity_name: rows_data?.entity_name|| entity_name}, Please correct the division.`);
              divEntityCheck=false;
              
            setDiv_code('')
            setDiv_name('')
              return;
            }
          }
        })
        .catch((error) => {
            // navigate('/')
          console.log(error)
          
        })
      }
      },[entity_code])

      const filters = {
        // entity_code: entity_code,
        entity_code: entity_code? entity_code: rows_data?.entity_code ||entity_code,
        // div_code:rows_data?.div_code || div_code,
        div_code: div_code? div_code: rows_data?.div_code || div_code,
        // div_code: div_code,
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
      <div>
          <div className=" m-2 min-h-[100px] rounded shadow-xl sm:col-span-4 bg-slate-300  justify-center items-center">

    <form onSubmit={handleSubmit(submitSeries)} className="mr-1">
    <div className="sm:flex">
        <div className="flex sm:w-1/2">
        <div className="w-5/12 sm:w-1/3">
        {/* <Input
            label ='Entity'
            value={entity_code}
            onClick={handleEntityClick}
            onChange={handleChange}
            {...register("entity_code", { required: true })}
          /> */}
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
        <div className="w-7/12 sm:w-2/3">
        <Input
              value={entity_name}
              onClick={handleEntityClick}
              onChange={handleChange}
              {...register("entity_name",)}
              />
        </div>
        </div>
        <div className="flex sm:w-1/2">
        <div className="w-5/12 sm:w-1/3">
        {/* <Input
            label ='Devision'
            value={div_code}
            onClick={handleInputClick}
            onChange={handleChange}
            {...register("div_code", { required: true })}
          /> */}
                   <Input
          label ='Division'
          type="text"
          id="divCodeInput"
          value={div_code}
          onClick={handleInputClick}
          onChange={handleChange}
          {...register("div_code",)}
          required
        />
        {/* <Input
                  label ='Division'
                  value={div_code}
                  onClick={handleInputClick}
                  onChange={handleChange}
                  required
              /> */}
        </div>
        <div className="w-7/12 sm:w-2/3">
        <Input
              value={div_name}
              onClick={handleInputClick}
              onChange={handleChange}
              {...register("div_name",)}
              />
        </div>
        </div>
    </div>
    <div className="sm:flex">
        <div className="flex sm:w-1/2">
        <div className="w-5/12 sm:w-1/3">
        <Input
        label='Series'
        {...register("series_code", { required: true } )}
        onChange={()=>handleInputChange(event,2)}
        />
        
        </div>
        <div className="w-7/12 sm:w-2/3">
        <Input 
        {...register("series_name", undefined)}
        />
        </div>
        </div>
        <div className="flex sm:w-1/2">
        <div className="w-6/12 sm:w-6/12">
        <Input
        label='Post Code'
        {...register("post_code", {} )}
        onChange={()=>handleInputChange(event,5)}
        />
        </div>
        <div className="w-6/12 sm:w-6/12">
        {isBankIdVisible && (
        <Input
          label='Bank Id'
          {...register("bankId", { })}
          onChange={()=>handleInputChange(event,2)}
        />
      )}
        </div>
        </div>
    </div>
    <div className="flex">
        <div className="flex w-1/2">
        {/* <div className="w-7/12 sm:w-2/3"> */}
        <label>
                    Tran Type
                    </label>
                        <select
                       {...register("tran_type", { required: true })}
                        className={`px-3 py-1 bg-blue-200 text-black outline-blue-500 focus:bg-gray-50 duration-200 border border-blue-400 w-full`}
                        // onChange={handleTranTypeChange}
                        required
                        >
                        <option></option>
                        <option>Payment</option>
                        <option>Receipt</option>
                        <option>Journal</option>
                        <option>Purchase</option>
                        <option>Sales</option>
                        <option>Cash</option>
                        <option>Indent</option>
                        <option>Sales_Contract</option>
                       
                        </select>
        {/* </div> */}
        </div>
        <div className="flex w-1/2">
        {/* <div className="w-7/12 sm:w-2/3"> */}
        <label>
                    Series Type
                    </label>
                        <select
                        // value={tranType}
                        {...register("series_type", { required: true })}
                        className={`px-3 py-1 bg-blue-200 text-black outline-blue-500 focus:bg-gray-50 duration-200 border border-blue-400 w-full`}
                        // onChange={handleTranTypeChange}
                        required
                        >
                        <option></option>
                        <option value='Y'>Yearly</option>
                        <option value='D'>Daily</option>
                       
                        </select>
      
        {/* </div> */}
        </div>
          </div>
          <div className="flex mt-2">
            <div>
          <label htmlFor="state_code" className="pr-12 sm:pr-20">
        State
      </label>
      </div>
      
      <select
        {...register("state_code")}
        // className={`block w-full mt-1 px-3 py-2 bg-blue-200 text-black outline-blue-500 focus:bg-gray-50 duration-200 border border-blue-400 rounded-md`}
        className={`px-3 py-1 bg-blue-200 text-black outline-blue-500 focus:bg-gray-50 duration-200 border border-blue-400 w-full`}
      
      >
        {stateCodes.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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

export default SeriesMasterTwo