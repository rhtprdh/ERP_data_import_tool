import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import Button from '../../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import SearchableTable from '../../selectComponents/SearchableTable';
import { removeTodo } from '../../features/todo/todoSlice';
import Input from '../../components/Input';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CbjExcelDaybookDrCrBackUp() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null);
//   const [serieses, setSerieses] = useState([
// {bankid:'A1'  , series:'WA'  , postCode:'BE003'    ,beheading:'PNB CC A/C-0412008700006723'},
// {bankid:'A1'  , series:'RA'  , postCode:'BE003'    ,beheading:'PNB CC A/C-0412008700006723'},
// {bankid:'F1'  , series:'WF'  , postCode:'AI206'    ,beheading:'CANARA BANK - 0413201028518'},
// {bankid:'F1'  , series:'RF'  , postCode:'AI206'    ,beheading:'CANARA BANK - 0413201028518'},
// {bankid:'G1'  , series:'RG'  , postCode:'AI207'    ,beheading:'DDCC BANK - 710893122'},
// {bankid:'G1'  , series:'WG'  , postCode:'AI207'    ,beheading:'DDCC BANK - 710893122'},
// {bankid:'D1'  , series:'WD'  , postCode:'AI204'    ,beheading:'ICICI BANK - 164805000174'},
// {bankid:'D1'  , series:'RD'  , postCode:'AI204'    ,beheading:'ICICI BANK - 164805000174'},
// {bankid:'C1'  , series:'WC'  , postCode:'AI203'    ,beheading:'IDFC FIRST BANK - 10052188306'},
// {bankid:'C1'  , series:'RC'  , postCode:'AI203'    ,beheading:'IDFC FIRST BANK - 10052188306'},
// {bankid:'B1'  , series:'WB'  , postCode:'AI202'    ,beheading:'KOTAK MAHINDRA BANK - 2347110480'},
// {bankid:'B1'  , series:'RB'  , postCode:'AI202'    ,beheading:'KOTAK MAHINDRA BANK - 2347110480'},
// {bankid:'E1'  , series:'WE'  , postCode:'AI205'    ,beheading:'STATE BANK OF INDIA - 38137378645'},
// {bankid:'E1'  , series:'RE'  , postCode:'AI205'    ,beheading:'STATE BANK OF INDIA - 38137378645'},

// ]);
  const[tranType, setTranType]=useState('');
  const[seriesType, setSeriesType]=useState('');
  const[div_code, setDiv_code] =useState('');
  const[div_name, setDiv_name] =useState('');
  const[entity_code, setEntity_code] =useState('');
  const[entity_name, setEntity_name] =useState('');
  const[series_code, setSeries_code] =useState('');
  const[series_name, setSeries_name] =useState('');

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
          'Date' : null,
          'Particulars' : null,
          'acc_code' : null,
          // 'Buyer_Supplier' : null,
          // 'Buyer_Supplier_Address' : null,
          // 'Consignee_Party' : null,
          // 'Consignee_Party_Address' : null,
          'Voucher_Type' : null,
          'partybillno' : null,
          'Voucher_Ref_No' : null,
          'Voucher_Ref_Date' : null,
          'GSTIN_UIN' : null,
          // 'Sales_Tax_No' : null,
          // 'Service_Tax_No' : null,
          // 'PAN_No' : null,
          // 'CST_No' : null,
          'Narration' : null,
          // 'Order_No_Date' : null,
          // 'Terms_of_Payment' : null,
          // 'Other_References' : null,
          // 'Terms_of_Delivery' : null,
          // 'Receipt_Note_No_Date' : null,
          // 'Receipt_Doc/LR_No' : null,
          // 'Despatch_Through' : null,
          // 'Destination' : null,
          // 'Place_of_Receipt_by_Shipper' : null,
          // 'Vessel/Flight_No' : null,
          // 'Port_of_Loading' : null,
          // 'Port_of_Discharge' : null,
          // 'Country_To' : null,
          // 'Bill_of_Entry_No' : null,
          // 'Bill_of_Entry_Date' : null,
          // 'Port_Code' : null,
          'Quantity' : null,
          // 'Alt_Units' : null,
          'Rate' : null,
          'Value' : null,
          // 'Addl_Cost' : null,
          'Gross_Total' : null,          
          'AAA01' : 'Purchase of abc item',
          'AAA02' : 'Input CGST - 9%',
          'AAA03' : 'Input SGST - 9%',
          'AAA04' : 'TDS Payable -194Q',
          'AAA05' : 'Round Off',
          'as Tally Excel' : ''
        });
        csvFormateData.push({
          'Date' : '4/1/2024',
          'Particulars' : 'example entry',
          'acc_code' : 'DSA03',
          'Voucher_Type' : 'Sales',
          'partybillno' : 'GY-0001',
          'Voucher_Ref_No' : 'GY-001',
          'Voucher_Ref_Date' : '4/1/2024',
          'GSTIN_UIN' : '2743RTYD43451Z5',
          'Narration' : 'SALE OF FG',
          'Quantity' : '30 MT',
          'Rate' : 61800,
          'Value' : null,
          'Gross_Total' : '971.38 Dr',          
          'AAA01' : '823.20 Cr',
          'AAA02' : '74.09 Cr',
          'AAA03' : '74.09 Cr',
          'AAA04' : '',
          'AAA05' : '',
          'as Tally Excel' : ''
        })
        const newWorksheeta = XLSX.utils.json_to_sheet(csvFormateData);
    const newWorkbooka = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbooka, newWorksheeta, 'Sheet1');

    // Write the new workbook to a file
    XLSX.writeFile(newWorkbooka, 'Tally_ERP_Data_Formate.csv');

    alert(`Tally to Erp template downloaded`);
   
    
   
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

      //   const jsonData = XLSX.utils.sheet_to_json(sheet, {
      //     raw: true,
      //     cellText: false, // Prevents number formatting and leaves cell values as strings
      //     // defval: "", // Set default value for blank cells
      //     // header: 1, // Treat first row as headers
      //     blankrows: false, // Exclude blank rows
      //     range: sheet["!ref"] // Use the entire sheet range
      // });
      XLSX.utils.sheet_to_json(sheet, {
        raw: true,
        // header: 1,
        // defval: "",
        // blankrows: false,
        range: sheet['!ref'],
        cellValue: (cell, cellRef) => {
            const parsedValue = parseCellValue(cell);
            return parsedValue;
        }
    }).forEach(row => {
        jsonData.push(row);
    });

        // console.log(jsonData[1].Gross_Total);
        let jsonLength = jsonData.length;

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        const cell = worksheet[XLSX.utils.encode_cell({ r: 0, c: 13 })]; // OLD C: 23 // OLD FORMATE 39
        const PostCodeValue = cell ? cell.v : undefined;

            // console.log(PostCodeValue);
            const range = XLSX.utils.decode_range(worksheet['!ref']);
            const lastColumnIndex = range.e.c;

            const acc_code_clm_a = [];
            const acc_code_clm = [];

            // Assuming jsonData contains the data from the Excel file // OLD COLiNDEX IS 22 // OLD FORMATE 38
            for (let colIndex = 12; colIndex <= lastColumnIndex; colIndex++) {
                const cellAddress = { r: 0, c: colIndex }; // Row 0, current column index
                const cell = worksheet[XLSX.utils.encode_cell(cellAddress)]; // Get cell object
                const value = cell ? cell.v : undefined; // Get cell value or undefined if cell is empty
                acc_code_clm_a.push(value); // Store cell value in the array
            }

            const occurrences = {}; // Object to store the occurrences of each label

              for (const label of acc_code_clm_a) {
                  if (occurrences[label]) {
                      // If the label has occurred before, increment the counter and append the counter to the label
                      const count = occurrences[label]++;
                      acc_code_clm.push(`${label}_${count}`);
                  } else {
                      // If the label is occurring for the first time, add it directly
                      occurrences[label] = 1;
                      acc_code_clm.push(label);
                  }
              }
            
            // console.log(acc_code_clm);

            const newData = [];
            let newDataPhaseTwo = [];
            const vrSeqData=[];
            let vrnoUpdated= [];
            let vrDateUpdated=[];
            let revAccCode=[];
            let bankIdAcc=[];
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
                month ='O'
              }else if (month ==11){
                month ='N'
              }else if(month ==12){
                month='D'
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
            // console.log(`vr data in fn vrSeqData if con :- ${vrData}`)
            vrSeqData.push({vrseq:vrData, lastvrno:1});
            return (`${vrData}-1`)
            }else{
              for(let i=0; vrSeqData.length>i; i++){
                // console.log( `${vrSeqData[i].vrseq} != ${vrData}`);
                 if(vrSeqData[i].vrseq == vrData){
                  // console.log( `${vrSeqData[i].vrseq} == ${vrData}`);
                    vrSeqData[i].lastvrno++
                    // console.log(vrSeqData[i]);
                    // console.log(`${vrData}-${vrSeqData[i].lastvrno}`);
                    return (`${vrData}-${vrSeqData[i].lastvrno}`)
                }else if(vrSeqData[i].vrseq != vrData){
                  // console.log(`vr data in fn vrSeqData if con which have data :-${vrSeqData[i].vrseq} == ${vrData}`)
                 vrSeqData.push({vrseq:vrData, lastvrno:1});
                 // i++
                  return (`${vrData}-1`);
                }
                
              }
            }
          }
          

           const vrSeqNumber=(postCode,date) =>{
            // console.log(`${postCode}  ${date}`);
          //  if(postCode !=='Journal'){
          //   for (let i = 0; i < serieses.length; i++) {
          //       if(postCode == serieses[i].postCode){
          //             i++
          //           if(tranType ==='Payment'){
          //             return (`${serieses[i-1].series}${date}`)
          //             serieses[i-1].replace(/^./, 'R');
          //           } else if(tranType ==='Receipt'){
          //             let vr = serieses[i-1].series;
          //             let vr2 = vr.replace(/^./, 'R');
          //             return (`${vr2}${date}`)
          //           } 
          //       }
          //     }
          //  } else if(postCode ==='Journal'){
          //   return (`JV${date}`)
          //  }
          return (`${series_code}${date}`)
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
              // console.log(formattedDate);
              return formattedDate

          }

          const vrnoNumber= async(acc_code,date) =>{
                            const vrnoDate = formatDate(date)
                            const sqdataEx={vrSeq:  vrSeqNumber(acc_code, vrnoDate), lastVrno:100}
                            if(sqdataEx.vrSeq != undefined){
                                try {
                                  const response = await fetch(`/api/vrseq/:${sqdataEx.vrSeq}`);
                                  const data = await response.json();
                                   const  vrno = data.data.updatedVrno;
                                 return vrno
                                } catch (error) {
                                  console.log(error);
                              }
                              }
          }

          const tokenNumber = async(trimVrno) =>{
            try {
                const response = await fetch(`/api/vrseq/:${trimVrno}`);
                const data = await response.json();
                 const  tokenVrno = data.data.updatedVrno;
               return tokenVrno
              } catch (error) {
                console.log(error);
            }
          }

          const bankId= async() =>{
                try {
                  const response = await fetch(`/api/series/:${series_code}`);
                  // const response =  await axios.get(`/api/series/:${series_code}`);
                  const data = await response.json();
                   const  bank = data.data.bankId;
                 return bank
                } catch (error) {
                  console.log(error);
              }
}
 
          // //for bank id from series master
          // const response =  await axios.get(`/api/series/:${series_code}`);
          // // console.log(response.data.data.bankId);
          // setBank_id(await response.data.data.bankId);
          // // console.log(bank_id);

     

         
         

          let lastValidDate = '';
       
          let lastIsDebit = false;
          let date = null;
          let TokenDate =null;
          let bankDate=null;
          let vrnoPhaseTwo=null;
          let vrno=null;
          let tokenNo=null;
          let bank_id=null;
          let particular_acc_code=null;
          
          setTotal_rows(jsonData.length);
          bank_id = await bankId();
          // console.log(jsonData);

                for (let index = 1; index < jsonData.length; index++) {
                  let indexTwo = index;
                  setRow_process(++indexTwo);
                    const row = jsonData[index];
                  
                    let slno = 1;
                    // console.log(tranType);
                   
                    // if(tranType ==='Journal'){
                    //  vrno = await vrnoNumber('Journal',row.Date);
                    //  tokenNo = await tokenNumber(vrno.slice(0, 4));
                    // } else {
                    //      vrno = await vrnoNumber(PostCodeValue,row.Date);
                    //  tokenNo = await tokenNumber(vrno.slice(0, 4));
                    // }
                    vrno = await vrnoNumber(PostCodeValue,row.Date);
                     tokenNo = await tokenNumber(vrno.slice(0, 4));
                    

                    if(vrno){
                        // if(row.acc_code){
                            for (let is = 0; is < acc_code_clm.length; is++) {
                                // console.log(jsonData[0]);
                            


                            if(row[acc_code_clm[is]] !== undefined){     
                            // if(row[acc_code_clm[is]].endsWith(' Dr')){
                                // console.log(row[acc_code_clm[is]].replace(/ Dr$/, ''));
                                let acc_code_value=null;
                                if(acc_code_clm[is] === 'Gross_Total' && row.Gross_Total !=='0.00 Dr'){
                                    acc_code_value= row.acc_code;
                                    particular_acc_code = row.Particulars;
                                } else {
                                    acc_code_value = acc_code_clm[is];
                                }
                                if(acc_code_value !== 'Gross_Total'){
                                // console.log(row.Particulars);
                                // console.log(`[acc_code_clm[is]] == 'Gross_Total'?  row.Particulars : [acc_code_clm[is]] != 'Gross_Total'? jsonData[0][acc_code_clm[is]] :'' ${[acc_code_clm[is]] == 'Gross_Total'?  row.Particulars : [acc_code_clm[is]] != 'Gross_Total'? jsonData[0][acc_code_clm[is]] :''}`); 
                                
                                newData.push({ 
                                    'no' :index,
                                    'entity_code' :entity_code,
                                    'div_code' : div_code,
                                    'vrno' :  vrno,
                                    'slno' :  slno++,
                                     'vrdate' : await dateFormate(row.Date),
                                     'tokenno' :  tokenNo,
                                     'tekendate' :   await dateFormate(row.Date),
                                     'acc_code' :  acc_code_value,
                                     'dramt' : row[acc_code_clm[is]].endsWith(' Dr')? parseFloat(row[acc_code_clm[is]].replace(/ Dr$/, '')):'',
                                     'cramt' :row[acc_code_clm[is]].endsWith(' Cr')? parseFloat(row[acc_code_clm[is]].replace(/ Cr$/, '')):'',
                                     'particular' : `TALLY_IMPORT#${tranType}#TALLY_VRNO#${row.Voucher_Ref_No?row.Voucher_Ref_No:''}#${row.Voucher_Ref_Date?row.Voucher_Ref_Date:''}#TALLY_ACC_NAME#${[acc_code_clm[is]] == 'Gross_Total'?  row.Particulars : [acc_code_clm[is]] != 'Gross_Total'? jsonData[0][acc_code_clm[is]] :''}#${row.Narration?row.Narration:''}#GSTNO#${row.GSTIN_UIN?row.GSTIN_UIN:''}#QTY-${row.Quantity?parseFloat(row.Quantity):''}`,
                                     'tcode' : row[acc_code_clm[is]].endsWith(' Dr')? tranType ==='Receipt'? 'T' : tranType ==='Payment'? 'B' : tranType ==='Journal'? 'J' : tranType ==='Purchase'?'P': tranType ==='Sale'?'S' : tranType ==='Cash'?'B':'' :row[acc_code_clm[is]].endsWith(' Cr')? tranType ==='Receipt'? 'B' : tranType ==='Payment'? 'T' : tranType ==='Journal'? 'J' : tranType ==='Purchase'?'P' : tranType ==='Sale'?'S' : tranType ==='Cash'?'T':'':'',
                                     'base_tcode' : row[acc_code_clm[is]].endsWith(' Dr')? tranType ==='Receipt'? 'B' : tranType ==='Purchase'?'P' : tranType ==='Sale'?'S':'' :row[acc_code_clm[is]].endsWith(' Cr')? tranType ==='Payment'? 'B' : tranType ==='Purchase'?'P': tranType ==='Sale'?'S' : tranType ==='Cash'?'B':'':'',
                                     'evrdate' : null,
                                     'durdate' : null,
                                     'dralloc' :  row[acc_code_clm[is]].endsWith(' Dr')? parseFloat(row[acc_code_clm[is]].replace(/ Dr$/, '')):'',
                                     'cralloc' : row[acc_code_clm[is]].endsWith(' Cr')? parseFloat(row[acc_code_clm[is]].replace(/ Cr$/, '')):'',
                                     'ASDRALLOC' : null,
                                     'ASCRALLOC' : null,
                                     'BANKID' : row[acc_code_clm[is]].endsWith(' Dr')? tranType ==='Payment'? bank_id : tranType ==='Cash'?bank_id : '': row[acc_code_clm[is]].endsWith(' Cr')?  tranType ==='Receipt'? bank_id :'':'',
                                     'INSTYPE' : row[acc_code_clm[is]].endsWith(' Dr')? tranType ==='Payment'? 'NA' : tranType ==='Journal'? 'NA' : tranType ==='Cash'?'NA' :'':row[acc_code_clm[is]].endsWith(' Cr')? tranType ==='Receipt'? 'NA' : tranType ==='Journal'? 'NA' :'':'',
                                     'CHQNO' : null,
                                     'CHQDATE' : null,
                                     'BANKDATE' : row[acc_code_clm[is]].endsWith(' Dr')? tranType ==='Payment'?  await dateFormate(row.Date) : '': row[acc_code_clm[is]].endsWith(' Cr')? tranType ==='Receipt'? await dateFormate(row.Date) : '':'',
                                     'LASTUPDATE' :  await dateFormate(row.Date),
                                     'QTYISSUED' : null,
                                     'QTYRECD' : row.Quantity? parseFloat(row.Quantity):'',
                                     'REVACC_CODE' : row[acc_code_clm[is]].endsWith(' Dr')? tranType ==='Payment'? PostCodeValue : tranType ==='Cash'?PostCodeValue : '' : row[acc_code_clm[is]].endsWith(' Cr')? tranType ==='Receipt'?  PostCodeValue :'':'' ,
                                     'COST_CODE' : null,
                                     'CONSIGNEE_CODE' : null,
                                     'STAX_CODE' : null,
                                     'ETAX_CODE' : null,
                                     'TDSACC_CODE' : null,
                                     'TDS_CODE' : null,
                                     'TDSAMT' : null,
                                     'TDS_RATE' : null,
                                     'TDS_SLNO' : null,
                                     'TDS_CHALLANNO' : null,
                                     'TDS_CHALLANDATE' : null,
                                     'TDS_BANK_CODE' : null,
                                     'TDS_BANK_BRANCH' : null,
                                     'HUNDI_NO' : null,
                                     'DEPT_CODE' : null,
                                     'EMP_CODE' : null,
                                     'BANK_CODE' : null,
                                     'OLD_VRNO' : null,
                                     'APPROVED' : 'Y',
                                     'APPROVEDBY' : 'ADMIN',
                                     'APPROVEDDATE' :await dateFormate(row.Date),
                                     'APPROVEDREMARK' :row.Narration,
                                     'USER_CODE' : 'ADMIN',
                                     'FLAG' : null,
                                     'PARTYBILLNO' : row.partybillno,
                                     'PARTYBILLDATE' :row.Voucher_Ref_Date? await dateFormate( row.Voucher_Ref_Date):'',
                                     'LOAN_CODE' : null,
                                     'ROUND_OFF' : null,
                                     'LOAN_DATE' : null,
                                     'TAXABLE_AMT' : null,
                                     'LASTUPDATEDBY' : null,
                                     'PAYMENT_NATURE' : null,
                                     'ORDER_VRNO' : null,
                                     'BANKSTMT_FLAG' : null,
                                     'TDS_FLAG' : null,
                                     'EXPENSE_VRNO' : null,
                                     'EXPENSE_SLNO' : null,
                                     'APPROVED_FLAG' : null,
                                     'HOLD_AMT' : null,
                                     'CURRENCY_CODE' : 'INR',
                                     'EXCHANGE_RATE' : '1',
                                     'PARTY_RECO_DATE' : null,
                                     'PARTY_RECO_AMT' : null,
                                     'PARTY_RECO_STMT_DATE' : null,
                                     'RECO_USER_CODE' : null,
                                     'RECO_LASTUPDATE' : null,
                                     'SUB_ACC_CODE' : null,
                                     'LC_TCODE' : null,
                                     'LC_VRNO' : null,
                                     'BANK_REF_NO' : null,
                                     'DELIVERY_TO_SLNO' : null,
                                     'DELIVERY_FROM_SLNO' : null,
                                     'GST_CODE' : null,
                                     'MIS_CODE' : null,
                                     'TRANTYPE' : null,
                                     'API_PAYMENT_ROWID_SEQ' : null,
                                     'CREATEDBY' : 'ADMIN',
                                     'CREATEDDATE' :  await dateFormate(row.Date),
                                     'VALUE_DATE' : null,
                              });
                            }
                            // } else if(row[acc_code_clm[is]].endsWith(' Cr')){
                            //     // console.log(row[acc_code_clm[is]].replace(/ Cr$/, ''));
                            //     let acc_code_value=null;
                            //     if(acc_code_clm[is] === 'Gross_Total'){
                            //         acc_code_value= row.acc_code;
                            //     } else {
                            //         acc_code_value = acc_code_clm[is];
                            //     }
                            //     // console.log(row.Particulars);
                            //     // console.log(`[acc_code_clm[is]] == 'Gross_Total'?  row.Particulars : [acc_code_clm[is]] != 'Gross_Total'? jsonData[0][acc_code_clm[is]] :'' ${[acc_code_clm[is]] == 'Gross_Total'?  row.Particulars : [acc_code_clm[is]] != 'Gross_Total'? jsonData[0][acc_code_clm[is]] :''}`); 
                                
                            //     newData.push({ 
                            //         'entity_code' :entity_code,
                            //         'div_code' : div_code,
                            //         'vrno' :  vrno,
                            //         'slno' :  slno++,
                            //          'vrdate' :  await dateFormate(row.Date),
                            //          'tokenno' :  tokenNo,
                            //          'tekendate' : await dateFormate(row.Date),
                            //          'acc_code' :  acc_code_value,
                            //          'dramt' : null,
                            //          'cramt' :parseFloat(row[acc_code_clm[is]].replace(/ Cr$/, '')),
                            //         //  'particular' : `TALLY_IMPORT#${tranType}#TALLY_VRNO#${row.Voucher_Ref_No}#${row.Voucher_Ref_Date}#TALLY_ACC_NAME#${[acc_code_clm[is]] == 'Gross_Total'?  row.Particulars : [acc_code_clm[is]] != 'Gross_Total'? jsonData[0][acc_code_clm[is]] :''}#${row.Narration}#GSTNO#${row.GSTIN_UIN}#QTY-${parseFloat(row.Quantity)}`,
                            //         'particular' : `TALLY_IMPORT#${tranType}#TALLY_VRNO#${row.Voucher_Ref_No?row.Voucher_Ref_No:''}#${row.Voucher_Ref_Date?row.Voucher_Ref_Date:''}#TALLY_ACC_NAME#${[acc_code_clm[is]] == 'Gross_Total'?  row.Particulars : [acc_code_clm[is]] != 'Gross_Total'? jsonData[0][acc_code_clm[is]] :''}#${row.Narration}#GSTNO#${row.GSTIN_UIN?row.GSTIN_UIN:''}#QTY-${row.Quantity?parseFloat(row.Quantity):''}`,
                            //          'tcode' : tranType ==='Receipt'? 'B' : tranType ==='Payment'? 'T' : tranType ==='Journal'? 'J' : tranType ==='Purchase'?'P' : tranType ==='Sale'?'S':'',
                            //          'base_tcode' : tranType ==='Payment'? 'B' : tranType ==='Purchase'?'P': tranType ==='Sale'?'S':'',
                            //          'evrdate' : null,
                            //          'durdate' : null,
                            //          'dralloc' : null,
                            //          'cralloc' : parseFloat(row[acc_code_clm[is]].replace(/ Cr$/, '')),
                            //          'ASDRALLOC' : null,
                            //          'ASCRALLOC' : null,
                            //          'BANKID' : tranType ==='Receipt'? bank_id :'',
                            //          'INSTYPE' : tranType ==='Receipt'? 'NA' : tranType ==='Journal'? 'NA' :'',
                            //          'CHQNO' : null,
                            //          'CHQDATE' : null,
                            //          'BANKDATE' : tranType ==='Receipt'? await dateFormate(row.Date) : '',
                            //          'LASTUPDATE' : await dateFormate(row.Date),
                            //          'QTYISSUED' : null,
                            //          'QTYRECD' : row.Quantity? parseFloat(row.Quantity):'',
                            //          'REVACC_CODE' : tranType ==='Receipt'? PostCodeValue :tranType ==='Payment'? PostCodeValue :'',
                            //          'COST_CODE' : null,
                            //          'CONSIGNEE_CODE' : null,
                            //          'STAX_CODE' : null,
                            //          'ETAX_CODE' : null,
                            //          'TDSACC_CODE' : null,
                            //          'TDS_CODE' : null,
                            //          'TDSAMT' : null,
                            //          'TDS_RATE' : null,
                            //          'TDS_SLNO' : null,
                            //          'TDS_CHALLANNO' : null,
                            //          'TDS_CHALLANDATE' : null,
                            //          'TDS_BANK_CODE' : null,
                            //          'TDS_BANK_BRANCH' : null,
                            //          'HUNDI_NO' : null,
                            //          'DEPT_CODE' : null,
                            //          'EMP_CODE' : null,
                            //          'BANK_CODE' : null,
                            //          'OLD_VRNO' : null,
                            //          'APPROVED' : 'Y',
                            //          'APPROVEDBY' : 'ADMIN',
                            //          'APPROVEDDATE' : await dateFormate(row.Date),
                            //          'APPROVEDREMARK' :row.Narration,
                            //          'USER_CODE' : 'ADMIN',
                            //          'FLAG' : null,
                            //          'PARTYBILLNO' : row.partybillno,
                            //          'PARTYBILLDATE' : row.Voucher_Ref_Date? await dateFormate( row.Voucher_Ref_Date):'',
                            //          'LOAN_CODE' : null,
                            //          'ROUND_OFF' : null,
                            //          'LOAN_DATE' : null,
                            //          'TAXABLE_AMT' : null,
                            //          'LASTUPDATEDBY' : null,
                            //          'PAYMENT_NATURE' : null,
                            //          'ORDER_VRNO' : null,
                            //          'BANKSTMT_FLAG' : null,
                            //          'TDS_FLAG' : null,
                            //          'EXPENSE_VRNO' : null,
                            //          'EXPENSE_SLNO' : null,
                            //          'APPROVED_FLAG' : null,
                            //          'HOLD_AMT' : null,
                            //          'CURRENCY_CODE' : 'INR',
                            //          'EXCHANGE_RATE' : '1',
                            //          'PARTY_RECO_DATE' : null,
                            //          'PARTY_RECO_AMT' : null,
                            //          'PARTY_RECO_STMT_DATE' : null,
                            //          'RECO_USER_CODE' : null,
                            //          'RECO_LASTUPDATE' : null,
                            //          'SUB_ACC_CODE' : null,
                            //          'LC_TCODE' : null,
                            //          'LC_VRNO' : null,
                            //          'BANK_REF_NO' : null,
                            //          'DELIVERY_TO_SLNO' : null,
                            //          'DELIVERY_FROM_SLNO' : null,
                            //          'GST_CODE' : null,
                            //          'MIS_CODE' : null,
                            //          'TRANTYPE' : null,
                            //          'API_PAYMENT_ROWID_SEQ' : null,
                            //          'CREATEDBY' : null,
                            //          'CREATEDDATE' : null,
                            //          'VALUE_DATE' : null,
                            //   });
                            // }
                            }
                        }
                        // } else if (!row.acc_code){

                        // }
                    }
                 

                   
            }

          
        
  setTimeout(() => {
    const newWorksheeta = XLSX.utils.json_to_sheet(newData);
    const newWorkbooka = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbooka, newWorksheeta, 'Sheet1');

    // Write the new workbook to a file
    XLSX.writeFile(newWorkbooka, `${tranType.toUpperCase()}_Register_ERP_FORMAT.xlsx`);
    alert(`Data proccessing is done`);
    // console.log('excel downloading start');
    setDiv_code('');
    setDiv_name('');
    setEntity_code('');
    setEntity_name('');
    setSeries_code('');
    setSeries_name('');
    setTranType('');
    setIsFormTrue(false);


    // setTimeout(() => {
    //     axios.delete('/api/vrseq/delete')  //, { data: { vrSeqArray } }
    //     .then(response => {
    //       console.log('Deleted successfully:', response.data);
    //       // Handle successful deletion
    //     })
    //     .catch(error => {
    //       console.error('Error deleting data:', error);
    //       // this.setState({ error: 'Error deleting data' });
    //     });
    //   }, 100); 
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
  setSlugValue('division')
  setIsTableOpen(true);
};
const handleEntityClick = () => {
  // navigate('/search-table/:division')
  setSlugValue('entity')
  setIsTableOpen(true);
};
const handleSeriesClick = () => {
  // navigate('/search-table/:division')
  setSlugValue('series' )
  setIsTableOpen(true);
};
const handleBatchnoClick =()=>{
  setSlugValue('qrtag')
  setIsTableOpen(true);
}

const handleTable=(e)=>{
  // console.log('click for false :', e)
  // setSlugValue('')
  setIsTableOpen(false)
}
const handleChange = (selectedOption) => {
  // console.log('Selected option:', selectedOption);
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
  }  else if(slugValue ==='series'){
    todos.map((todo)=>{
      setSeries_code(todo.text.id)
      setSeries_name(todo.text.name)
      dispatch(removeTodo(todo.id))
    });
  }
},[todos])

useEffect(() =>{
  if(series_code){
    axios.get(`/api/series/:${series_code}`)
    .then((response) => {
      // console.log(response.data.data.tran_type);
      setTranType(response.data.data.tran_type);    
      setSeriesType(response.data.data.series_type); 
      // console.log(seriesType);   
    })
    .catch((error) => {
      console.log(error)
    })
  }
},[series_code])


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
            <div className=" flex">
              <div className=" w-5/12 sm:w-3/12">
                <Input
                    label ='Entity'
                    value={entity_code}
                    onClick={handleEntityClick}
                    onChange={handleChange}
                    required
                />
               </div>
              <div className=" w-7/12 sm:w-9/12">
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
              <div className=" w-7/12 sm:w-9/12">
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
                        <option>Payment</option>
                        <option>Receipt</option>
                        <option>Journal</option>
                        <option>Purchase</option>
                        <option>Sales</option>
                        <option>Cash</option>
                       
                        </select>
                    </div>

                <div className="flex">
                 <div className="w-6/12">
                <input type="file" accept=".csv" onChange={handleFileChange} />
                </div>
                <div className="w-6/12 flex justify-end">
                <Button className="ml-5" children='Process' onClick={processData}/>
 
                </div>
                </div>
                <div className="flex">File must be in .CSV</div>
               
              
                      
            </form>
                  {/* <div className="flex ">
                      <Button className="float-left ml-5 mr-5" children='Download Formate' onClick={csvFormate}/>
                      <Button
                      children='Exit'
                      className="float-left ml-5 mr-5 px-10 text-lg"
                      onClick={() => navigate(-1)}
                  />
                  </div> */}
                    <div className="flex justify-end">
                      <Button className="ml-5 mb-5" children='Download Format' onClick={csvFormate} />
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

export default CbjExcelDaybookDrCrBackUp;
