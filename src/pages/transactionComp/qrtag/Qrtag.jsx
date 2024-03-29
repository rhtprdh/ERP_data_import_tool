import React, { useEffect, useRef, useState } from 'react'
import { useForm } from "react-hook-form"
import {Select, Input, Button} from '../../../components/Index'
import {Navigate, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import qrcode from 'qrcode';
import { Await } from 'react-router-dom';
import SearchableTable from '../../../selectComponents/SearchableTable';
import { useSelector, useDispatch } from 'react-redux';
import {removeTodo} from '../../../app/features/todo/todoSlice.js'

function Qrtag() {
  const todos = useSelector(state => state.todos)
  const dispatch = useDispatch()
 
  const[div_code, setDiv_code] =useState('');
  const[div_name, setDiv_name] =useState('');
  const[to_batch, setTo_batch] =useState('');
  const[from_batch, setFrom_batch] =useState('');
  useEffect(()=>{
    // setDiv_code(todos[0].text.id)
    todos.map((todo)=>{
      setDiv_code(todo.text.id)
      setDiv_name(todo.text.name)
      dispatch(removeTodo(todo.id))
    })
    // setDiv_code(todos)
  },[todos])
  
  const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
    defaultValues: {
        // div_code: "MD",
        // div_name: rows_data?.div_name || "",
        // entity_code: rows_data?.entity_code || "",
        // entity_name: rows_data?.entity_name || "",
    },
});

    const navigate= useNavigate();
    const [batchData, setBatchData] = useState();
    const currentYear =23
    const [isDisabled, setIsDisabled] = useState(false);
    let updatedData=[]

    // useEffect(() => {
  
    //   fetch('/api/division')
    //   .then((response) => response.json())
      
    //   .then((data) => {
    //     console.log(data)
    //       if (!Array.isArray(data.data)) {
    //           console.error('Data fetched from API is not an array');
    //           return;
    //         }
    //     const dataOption = data.data.map((item) => ({
    //       value: item.batchno,
    //       label: item.batchno,
    //     }));
    
    //     setOptions(dataOption);
    //   });
    // }, []);
    
      const submit = (dataProcess) => {
        console.log(div_code, from_batch, to_batch)
        setIsDisabled(true);
        if(div_code !== '' || from_batch !=='' || to_batch!==''){
        if(to_batch ==='' || to_batch === null){
         updatedData.push({ 
                  batch: div_code +'23'+from_batch.toString().padStart(5, '0'), 
                  qty: 100 });
                  setBatchData(updatedData);
        } else if(to_batch !== '' || to_batch!== null){
          for(let batch= from_batch; batch <= to_batch; batch++){
             updatedData.push({ 
              batch: div_code+'23'+batch.toString().padStart(5, '0'), 
              qty: 100 });
          }
          setBatchData(updatedData);
        } 
      }else{
        setIsDisabled(false);
      return;
      }
    }
      
      const generateQRCode = (qr_data) => {
        const base64QRCode = qrcode.toDataURL(qr_data, {
        type: 'image/png',
        quietZone: 0,
        version: 4,
        });
        return base64QRCode;
        };
        async function getgenerateQRCode(get_qr_data) {
         return generateQRCode(get_qr_data).then(function(base64Image) {
             return base64Image
            });
            
        }
      
      
          const submitBatch = async () => {
          
          const dataToInsert = [];
          for(var batch =0; batch< batchData.length; batch++){
          // for (var qty = 1; qty <= batchData[batch].qty; qty++) {
            // console.log("loop started",  batchData.qty)
          dataToInsert.push({
                    div_code: div_code ,
                    entity_code: 'RA',
                    // slno:qty,
                    // batchno_ref: `${batchData[0].batch+'-'+qty.toString().padStart(3, '0') }`,
                    batchno: batchData[batch].batch,
                    batch_qty: batchData[batch].qty,
                  //  qr_file:getgenerateQRCode(`${batchData[0].batch+'-'+qty.toString().padStart(3,'0') }`)
          });
          }
            
             axios.post('/api/qrtag', dataToInsert)
             .then((response) => {
               setRows(response.data)
             })
             .catch((error) => {
               console.log(error)
             })
             alert('Data saved successfully!');
          };
    
      const handleEdit = (rowBatch, fieldName, newValue) => {
        const updatedData = batchData.map((row) => {
          if (row.batch === rowBatch) {
            return { ...row, [fieldName]: newValue };
          }
          return row;
        });
        setBatchData(updatedData);
        console.log(batchData)
      };
      const inputRef = useRef();
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [slugValue, setSlugValue] = useState();
  const handleInputClick = () => {
    // navigate('/search-table/:division')
    setSlugValue('division')
    setIsTableOpen(true);
  };

  const handleCloseTable = () => {
    setIsTableOpen(false);
  };
  const handleChange= (event)=>{
    event.target.value
  }
  const handleTable=(e)=>{
    console.log('click for false :', e)
    setIsTableOpen(false)
  }
 
      
  return (
   <>
   {isTableOpen &&
   <div>
    <SearchableTable 
    onClick={handleTable}
    slugValue='division'/>
   </div>
    }
    {!isTableOpen &&
   <div>
   <form onSubmit={handleSubmit(submit)}>
    <div className="">
        <div className="flex">
        <div className="w-1/3">
          <Input
          label ='Division'
          value={div_code}
          onClick={handleInputClick}
          onChange={handleChange}
          />
        {/* <Input
        label='Division'
        ref={inputRef}
        onClick={handleInputClick}
        onChange={handleChange}
        {...register("div_code", { required: true } )}
        /> */}
        </div>
        <div className="w-2/3">
        <Input
          value={div_name}
          onClick={handleInputClick}
          onChange={handleChange}
          />
        {/* <Input 
        {...register("div_name", )}
        /> */}
        </div>
        {isTableOpen && (
         <SearchableTable data={sampleData} onClose={handleCloseTable} inputRef={inputRef} />
        )}
        </div>
        <div className="flex">
        <div className="flex w-1/2">
          <Input
           label='From Batch'
           type='number'
           value={from_batch}
          //  onChange={handleChange}
           onChange={(e)=>{setFrom_batch(e.target.value)}}
           />
        {/* <Input
       
        {...register("from_batch",  { required: true } )}
        /> */}
        </div>
        <div className=" w-1/2">
          <Input
           label='To Batch'
           type='number'
           value={to_batch}
           onChange={(e)=>{setTo_batch(e.target.value)}}
          />
        {/* <Input 
       
        {...register("to_batch", )}
        /> */}
        </div>
        </div>
        <div className="ml-5 float-right px-7 mx-10">       
         <Button type="submit" disabled={isDisabled} >
          Process
        </Button>
        </div>
    </div>
    </form>
      <form onSubmit={handleSubmit()}>
    {batchData &&
    <div className="mt-50 ">
    <table className=" m-auto mt-5">
        <thead>
          <tr>
            <th>Batch number</th>
            <th>Quantity Per Batch</th>
          </tr>
         
        </thead>
        <tbody>
          {batchData.map((row) => (
            <tr key={row.batch}>
              <td>{row.batch}</td>
              <td>
                <input
                  type="text"
                  value={row.qty}
                  onChange={(event) => handleEdit(row.batch, 'qty', event.target.value)}
                  // {...register("qty" )}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
}
      <div className="flex ">
        <Button type="" onClick={submitBatch} className="w-full m-5">
            {/* {rows_data ? "Update" : "Submit"} */} Submit
        </Button>
        <Button type=""  className="w-full m-5">
            {/* {post ? "Update" : "Submit"} */}Clear
        </Button>
        <Button type="" onClick={() => navigate(-1)} className="w-full m-5">
            {/* {post ? "Update" : "Submit"} */}Exit
        </Button>
        </div>
    
      </form>
   </div>
    }
  
   </>
  )
}

export default Qrtag