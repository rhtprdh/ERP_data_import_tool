import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import Button from '../../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import SearchableTable from '../../selectComponents/SearchableTable';
import { removeTodo } from '../../features/todo/todoSlice';
import Input from '../../components/Input';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function IndentImport() {
  let headVrSeq=0;
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const[tranType, setTranType]=useState('');
  const[seriesType, setSeriesType]=useState('');
  const[div_code, setDiv_code] =useState('');
  const[div_name, setDiv_name] =useState('');
  const[entity_code, setEntity_code] =useState('');
  const[entity_name, setEntity_name] =useState('');
  const[series_code, setSeries_code] =useState('');
  const[series_name, setSeries_name] =useState('');
  
  const [head, setHead] =useState(false);
//   const [vrno, setVrno] =useState(null);
 let vrno =null;

  const dispatch = useDispatch();
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [isFormTrue, setIsFormTrue] = useState(false);
  const [slugValue, setSlugValue] = useState();
  const todos = useSelector(state => state.todos);
  const csvFormateData =[];
  const [row_process, setRow_process] = useState(0);
  const [total_rows, setTotal_rows] = useState(0);
  

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const csvFormate= ()=>{
        csvFormateData.push({
            'Voucher_Date' : null,
            'Voucher_Number' : null,
            'Indent_Remark':null,
            'Voucher_Type' : null,
            'Department_code_erp' : null,
            'Cost_center_erp' : null,
            'Division_code_erp' : null, 
            'Item_code' : null,
            'Quantity_Balance' : null,
            'Unit_Code_erp' : null,
            'Stock_type_code' : null            
          
        });
        csvFormateData.push({
          
        });
        const newWorksheeta = XLSX.utils.json_to_sheet(csvFormateData);
    const newWorkbooka = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbooka, newWorksheeta, 'Sheet1');

    // Write the new workbook to a file
    XLSX.writeFile(newWorkbooka, 'Indent_Import_Format.csv');

    alert(`Indent Import to Erp template downloaded`);
   
    
   
  }


 
  const processData =async() => {
    
    if (!file) {
      alert("Please select an Excel file.");
      return;
    } else  if (!entity_code || !div_code || !tranType) {
      return;
    }

    const reader = new FileReader();




    reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        // const jsonData = XLSX.utils.sheet_to_json(sheet);
        // const jsonData = XLSX.utils.sheet_to_json(sheet, { raw: true });
        const jsonData = [];
        const parseCellValue = (cell) => {
          if (cell && cell.t === 'n') { // Check if the cell type is numeric
              // Customize how you want to format numeric values
              return `${cell.v} ${cell.w}`; // Include both value and formatted text
          } else if (cell && cell.t === 's') { // Check if the cell type is a string
              // Preserve string values as-is
              return cell.v;
          } else {
              return ''; // Handle other cell types as needed
          }
      };
      XLSX.utils.sheet_to_json(sheet, {
        raw: true,
        range: sheet['!ref'],
        cellValue: (cell, cellRef) => {
            const parsedValue = parseCellValue(cell);
            return parsedValue;
        }
    }).forEach(row => {
        jsonData.push(row);
    });

        // console.log(jsonData[1].Gross_Total);
        // let jsonLength = jsonData.length;

        // const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        // const cell = worksheet[XLSX.utils.encode_cell({ r: 0, c: 39 })]; // OLD C: 23
        // const PostCodeValue = cell ? cell.v : undefined;

        //     console.log(PostCodeValue);
        //     const range = XLSX.utils.decode_range(worksheet['!ref']);
        //     const lastColumnIndex = range.e.c;

            // const acc_code_clm_a = [];
            // const acc_code_clm = [];

            // // Assuming jsonData contains the data from the Excel file // OLD COLiNDEX IS 22
            // for (let colIndex = 38; colIndex <= lastColumnIndex; colIndex++) {
            //     const cellAddress = { r: 0, c: colIndex }; // Row 0, current column index
            //     const cell = worksheet[XLSX.utils.encode_cell(cellAddress)]; // Get cell object
            //     const value = cell ? cell.v : undefined; // Get cell value or undefined if cell is empty
            //     acc_code_clm_a.push(value); // Store cell value in the array
            // }

            // const occurrences = {}; // Object to store the occurrences of each label

            //   for (const label of acc_code_clm_a) {
            //       if (occurrences[label]) {
            //           // If the label has occurred before, increment the counter and append the counter to the label
            //           const count = occurrences[label]++;
            //           acc_code_clm.push(`${label}_${count}`);
            //       } else {
            //           // If the label is occurring for the first time, add it directly
            //           occurrences[label] = 1;
            //           acc_code_clm.push(label);
            //       }
            //   }
            
            // console.log(acc_code_clm);

            const indent_head = [];
            const indent_body = [];
            let indent_number_last='blank';
            const vrSeqData=[];
            const formatDate = (excelDate) => {
              // const date = new Date(excelDate);
              const serialDate = parseInt(excelDate);
              const baseDate = new Date('1899-12-30');
              // const date = new Date((serialDate - 1) * 24 * 3600 * 1000);
              const date = new Date(baseDate.getTime() + serialDate * 24 * 3600 * 1000);
              const day = String(date.getDate()).padStart(2, '0');
              let month = String(date.getMonth() + 1);
              let year = String(date.getFullYear()).substring(2);
              // const dt = 
              // console.log(`${Number(`${year}${month}${day}`)} <24331`); //24101
             if((Number(`${year}${month}${day}`) <= 24331 && Number(`${year}${month}${day}`) >= 24101) || (Number(`${year}${month}${day}`) <= 25331 && Number(`${year}${month}${day}`) >= 25101)) {
               year = year-1;
              // console.log(`year  is ${year}`);
             }
             
              if(month==10){
                month ='O';
              }else if (month ==11){
                month ='N';
              }else if(month ==12){
                month='D';
              }
              if(seriesType){
              // console.log(`SERIES TYPE:- ${seriesType}`);
              if(seriesType ==='D'){
              return `${year}${month}${day}`;
              } else if(seriesType ==='Y'){
                return `${year}Y`;
              }
            }
          };
        
        
          const vrSeqDatafn =(vrData)=> {
          if(vrSeqData.length ==0){
            vrSeqData.push({vrseq:vrData, lastvrno:1});
            return (`${vrData}-1`);
            }else{
              for(let i=0; vrSeqData.length>i; i++){
                 if(vrSeqData[i].vrseq == vrData){
                    vrSeqData[i].lastvrno++;
                    return (`${vrData}-${vrSeqData[i].lastvrno}`)
                }else if(vrSeqData[i].vrseq != vrData){
                 vrSeqData.push({vrseq:vrData, lastvrno:1});
                  return (`${vrData}-1`);
                }
                
              }
            }
          }
          

           const vrSeqNumber=(postCode,date) =>{
          return (`${series_code}${date}`);
          }
          const dateFormate =async(value) =>{
            // const milliseconds = (value - 1) * 24 * 60 * 60 * 1000;
            const excelEpoch = Date.UTC(1899, 11, 30); // December 30, 1899 in milliseconds since Unix epoch
            const milliseconds = excelEpoch + value * 24 * 60 * 60 * 1000;

            // const milliseconds = value * 24 * 60 * 60 * 1000;
            // const milliseconds = Date.parse(value);

              // Create a new Date object using the milliseconds
              const dateObject = new Date(milliseconds);

              // Format the date as "MM/DD/YYYY"
              const formattedDate = dateObject.toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
              });
              return formattedDate;

          }

          const vrnoNumber= async(acc_code,date) =>{
                            const vrnoDate = formatDate(date);
                            const sqdataEx={vrSeq:  vrSeqNumber(acc_code, vrnoDate), lastVrno:100};
                            if(sqdataEx.vrSeq != undefined){
                                try {
                                  const response = await fetch(`/api/vrseq/:${sqdataEx.vrSeq}`);
                                  const data = await response.json();
                                   const  vrno = data.data.updatedVrno;
                                 return vrno;
                                } catch (error) {
                                  console.log(error);
                              }
                              }
          }

//           const tokenNumber = async(trimVrno) =>{
//             try {
//                 const response = await fetch(`/api/vrseq/:${trimVrno}`);
//                 const data = await response.json();
//                  const  tokenVrno = data.data.updatedVrno;
//                return tokenVrno;
//               } catch (error) {
//                 console.log(error);
//             }
//           }

//           const bankId= async() =>{
//                 try {
//                   const response = await fetch(`/api/series/:${series_code}`);
//                   // const response =  await axios.get(`/api/series/:${series_code}`);
//                   const data = await response.json();
//                    const  bank = data.data.bankId;
//                  return bank
//                 } catch (error) {
//                   console.log(error);
//               }
// }
         
          
          setTotal_rows(jsonData.length);
          
          let slno = 1;
                for (let index = 0; index < jsonData.length; index++) {
                  let indexTwo = index;
                  setRow_process(++indexTwo);
                    const row = jsonData[index];
                   
                    if(index>0){
                       const row1= jsonData[index-1];
                    // let voucherNo=row.Voucher_Number;
                        indent_number_last=row1.Voucher_Number;
                        // indent_number_last =voucherNo[index-1]
                    }
                  
                    if(row.Voucher_Number !== indent_number_last){
                        slno=1;
                        setHead(true);
                    
                    vrno = await vrnoNumber('',row.Voucher_Date);
                    // console.log(vrno); 
                    if(vrno){
                        
                                indent_head.push({ 
                                  'row num': headVrSeq++,
                                    'ENTITY_CODE' : entity_code,
                                    'TCODE' : 'I',
                                    'VRNO' : vrno,
                                    'VRDATE' : await dateFormate(row.Voucher_Date),
                                    'DEPT_CODE' : row.Department_code_erp,
                                    'INDENT_REMARK' : row.Voucher_Number,
                                    'REFNO' : null,
                                    'AUTOINDENT_FLAG' : null,
                                    'USER_CODE' : 'ADMIN',
                                    'LASTUPDATE' : await dateFormate(row.Voucher_Date),
                                    'FLAG' : null,
                                    'CURRENCY_CODE' : 'INR',
                                    'EXCHANGE_RATE' : 1,
                                    'CREATEDBY' : 'ADMIN',
                                    'CREATEDDATE' : await dateFormate(row.Voucher_Date),
                                    'HEAD_TRAN_SEQ' : null,
                                    
                                    
                              });
                            }
                        }
                        if(vrno){
                                indent_body.push({
                                  'row num': index,
                                    'ENTITY_CODE' : entity_code,
                                    'TCODE' : 'I',
                                    'VRNO' : vrno,
                                    'SLNO' : slno++,
                                    'VRDATE' : await dateFormate(row.Voucher_Date),
                                    'DIV_CODE' : row.Division_code_erp,
                                    'ITEM_CODE' : row.Item_code,
                                    'UM' : row.Unit_Code_erp,
                                    'QTYINDENT' : row.Quantity_Balance,
                                    'QTYCANCELLED' : null,
                                    'AUM' : row.Unit_Code_erp,
                                    'AQTYINDENT' : row.Quantity_Balance,
                                    'RATE' : 1,
                                    'REMARK' : null,
                                    'PURPOSE_REMARK' : null,
                                    'DUEDATE' : await dateFormate(row.Voucher_Date),
                                    'PRIORITY_INDEX' : 'H',
                                    'COST_CODE' : row.Cost_center_erp,
                                    'EQPT_CODE' : null,
                                    'MAKE_CODE' : null,
                                    'MERGE_VRNO' : null,
                                    'MERGE_SLNO' : null,
                                    'MERGEBY' : null,
                                    'MERGEDATE' : null,
                                    'ACKNOWLEDGEBY' : null,
                                    'ACKNOWLEDGEDATE' : null,
                                    'ACKNOWLEDGE_REMARK' : null,
                                    'CANCELLEDBY' : null,
                                    'CANCELLEDDATE' : null,
                                    'CANCELLED_REMARK' : null,
                                    'PURCHASE_DUEDATE' : null,
                                    'PURCHASE_LOCATION' : null,
                                    'PURCHASE_EMP_CODE' : null,
                                    'PURCHASE_TYPE' : null,
                                    'CBP_FLAG' : null,
                                    'CBPBY' : null,
                                    'CBPDATE' : null,
                                    'CBP_REMARK' : null,
                                    'APPROVEDBY' : null,
                                    'APPROVEDDATE' : null,
                                    'APP_REMARK' : null,
                                    'FLAG' : null,
                                    'AUMTOUM' : null,
                                    'QTYREQ' : row.Quantity_Balance,
                                    'STOCK_TYPE' : row.Stock_type_code,
                                    'PLANT_CODE' : null,
                                    'FC_RATE' : 1,
                                    'TRAN_SEQ' : null,

                                });
                        }
                        
                    
                 

                   
            }

          
        
  setTimeout(() => {
    const newWorksheeta = XLSX.utils.json_to_sheet(indent_head);
    const newWorkbooka = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbooka, newWorksheeta, 'indent_head');

    // Create sheet 2
    const worksheet2 = XLSX.utils.json_to_sheet(indent_body);
    XLSX.utils.book_append_sheet(newWorkbooka, worksheet2, 'indent_body');

    // Write the new workbook to a file
    XLSX.writeFile(newWorkbooka, `${tranType.toUpperCase()}_Register_ERP_FORMAT.xlsx`);
    alert(`Data proccessing is done`);
    setDiv_code('');
    setDiv_name('');
    setEntity_code('');
    setEntity_name('');
    setSeries_code('');
    setSeries_name('');
    setTranType('');
    setIsFormTrue(false);
  }, 1000);
  }
    reader.readAsArrayBuffer(file);
    
  };



  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(event)
    alert(`The name you entered was: ${entity_code} - ${entity_name}`);
    setIsFormTrue(true);
  }
const handleTranTypeChange = (event) => {
  setTranType(event.target.value);
};
const handleInputClick = () => {
  // navigate('/search-table/:division')
  setSlugValue('division');
  setIsTableOpen(true);
};
const handleEntityClick = () => {
  // navigate('/search-table/:division')
  setSlugValue('entity');
  setIsTableOpen(true);
};
const handleSeriesClick = () => {
  // navigate('/search-table/:division')
  setSlugValue('series' );
  setIsTableOpen(true);
};
// const handleBatchnoClick =()=>{
//   setSlugValue('qrtag')
//   setIsTableOpen(true);
// }

const handleTable=(e)=>{
  setIsTableOpen(false);
}
const handleChange = (selectedOption) => {
  setDivision(selectedOption.value);
};


useEffect(()=>{
  if(slugValue ==='division'){
    todos.map((todo)=>{
      setDiv_code(todo.text.id);
      setDiv_name(todo.text.name);
      dispatch(removeTodo(todo.id));
    })
  } 
  else if(slugValue ==='entity'){
    todos.map((todo)=>{
      setEntity_code(todo.text.id);
      setEntity_name(todo.text.name);
      dispatch(removeTodo(todo.id));
    })
  }  else if(slugValue ==='series'){
    todos.map((todo)=>{
      setSeries_code(todo.text.id);
      setSeries_name(todo.text.name);
      dispatch(removeTodo(todo.id));
    });
  }
},[todos])

useEffect(() =>{
  if(series_code){
    axios.get(`/api/series/:${series_code}`)
    .then((response) => {
      setTranType(response.data.data.tran_type);    
      setSeriesType(response.data.data.series_type);  
    })
    .catch((error) => {
      console.log(error);
    })
  }
},[series_code]);


  const filters = {
    entity_code: entity_code,
    div_code: div_code,
    series_code: series_code,
      };


  return (
    <div>
    {isFormTrue &&
        <div className="flex justify-center items-center h-screen">
         <div className="flex flex-col items-center">
          <div className="flex space-x-2">
            <div className="loader-dot bg-blue-500 rounded-full h-3 w-3 animate-bounce"></div>
            <div className="loader-dot bg-blue-500 rounded-full h-3 w-3 animate-bounce"></div>
            <div className="loader-dot bg-blue-500 rounded-full h-3 w-3 animate-bounce"></div>
          </div>
          <div className=" text-white text-xl mt-2">{`Total ${row_process} rows processed of ${total_rows} rows`}</div>
          <div className=" text-white text-xl mt-2">Please wait...</div>
          </div>
             </div>}
     {!isFormTrue &&

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
            <>
                <div className=" m-2 min-h-[100px] rounded shadow-xl sm:col-span-4 bg-slate-300  justify-center items-center">

          <form onSubmit={handleSubmit} className="mr-1">
            <div className=" flex ">
              <div className=" w-5/12 sm:w-3/12">
                <Input
                    label ='Entity'
                    value={entity_code}
                    onClick={handleEntityClick}
                    onChange={handleChange}
                    required
                />
               </div>
              <div className=" w-7/12 sm:w-7/12 sm:w-9/12">
                  <Input
                    value={entity_name}
                    onClick={handleEntityClick}
                    onChange={handleChange}
                    
                  />
              </div>
              </div>
                <div className=" flex">
                <div className=" w-5/12 sm:w-3/12">
              <Input
                  label ='Division'
                  value={div_code}
                  onClick={handleInputClick}
                  onChange={handleChange}
                  required
              />
              </div>
              <div className=" w-7/12 sm:w-7/12 sm:w-9/12">
              <Input
              value={div_name}
              onClick={handleInputClick}
              onChange={handleChange}
              />
              </div>
              </div>
              <div className=" flex">
                <div className=" w-5/12 sm:w-3/12">
              <Input
                  label ='Series'
                  value={series_code}
                  onClick={handleSeriesClick}
                  onChange={handleChange}
                  required
              />
              </div>
              <div className=" w-7/12 sm:w-9/12">
              <Input
              value={series_name}
              onClick={handleSeriesClick}
              onChange={handleChange}
              
              />
              </div>
              </div>
              <div className="w-full flex mt-2 mb-1">
                    <label className=" w-64">
                    Tran Type
                    </label>
                        <select
                        value={tranType}
                        className={`px-3 py-1 bg-blue-200 text-black outline-blue-500 focus:bg-gray-50 duration-200 border border-blue-400 w-full`}
                        onChange={handleTranTypeChange}
                        required
                        >
                        <option></option>
                        <option>Indent</option>
                        </select>
                    </div>

                <div className="flex">
                 <div className="w-6/12">
                <input type="file" accept=".csv" onChange={handleFileChange} />
                </div>
                <div className="w-6/12 flex justify-end">
                <Button className=" ml-5" children='Process' onClick={processData}/>
 
                </div>
                </div>
                <div className="flex">File must be in .CSV</div>
               
              
                      
            </form>
                       <div className="flex justify-end">
                      <Button className="ml-5 mb-5 " children='Download Format' onClick={csvFormate} />
                      <Button className="ml-5 mb-5 px-6 text-lg" children='Exit' onClick={() => navigate(-1)} />
                    </div>
                        
             </div>
                  </>      
                        }
                         </div>
                      }
    </div>
  );
}

export default IndentImport;
