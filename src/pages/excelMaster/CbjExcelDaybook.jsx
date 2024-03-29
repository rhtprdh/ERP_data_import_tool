import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import Button from '../../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import SearchableTable from '../../selectComponents/SearchableTable';
import { removeTodo } from '../../features/todo/todoSlice';
import Input from '../../components/Input';
import axios from 'axios';

function CbjExcelDaybook() {
  const [file, setFile] = useState(null);
  const [processedData, setProcessedData] = useState(null);
  const [serieses, setSerieses] = useState([
{bankid:'A1'  , series:'WA'  , postCode:'BE003'    ,beheading:'PNB CC A/C-0412008700006723'},
{bankid:'A1'  , series:'RA'  , postCode:'BE003'    ,beheading:'PNB CC A/C-0412008700006723'},
{bankid:'F1'  , series:'WF'  , postCode:'AI206'    ,beheading:'CANARA BANK - 0413201028518'},
{bankid:'F1'  , series:'RF'  , postCode:'AI206'    ,beheading:'CANARA BANK - 0413201028518'},
{bankid:'G1'  , series:'RG'  , postCode:'AI207'    ,beheading:'DDCC BANK - 710893122'},
{bankid:'G1'  , series:'WG'  , postCode:'AI207'    ,beheading:'DDCC BANK - 710893122'},
{bankid:'D1'  , series:'WD'  , postCode:'AI204'    ,beheading:'ICICI BANK - 164805000174'},
{bankid:'D1'  , series:'RD'  , postCode:'AI204'    ,beheading:'ICICI BANK - 164805000174'},
{bankid:'C1'  , series:'WC'  , postCode:'AI203'    ,beheading:'IDFC FIRST BANK - 10052188306'},
{bankid:'C1'  , series:'RC'  , postCode:'AI203'    ,beheading:'IDFC FIRST BANK - 10052188306'},
{bankid:'B1'  , series:'WB'  , postCode:'AI202'    ,beheading:'KOTAK MAHINDRA BANK - 2347110480'},
{bankid:'B1'  , series:'RB'  , postCode:'AI202'    ,beheading:'KOTAK MAHINDRA BANK - 2347110480'},
{bankid:'E1'  , series:'WE'  , postCode:'AI205'    ,beheading:'STATE BANK OF INDIA - 38137378645'},
{bankid:'E1'  , series:'RE'  , postCode:'AI205'    ,beheading:'STATE BANK OF INDIA - 38137378645'},

]);
  const [vrseq, setVrseq] = useState(0);
  const [tokenSeq, setTokenSeq] = useState(0);
  const[tranType, setTranType]=useState('');
  const [name,setName] = useState("");
  const [selectedSeries, setSelectedSeries] = useState('');
  const [entityCode, setentityCode] = useState('');
  const[div_code, setDiv_code] =useState('');
  const[div_name, setDiv_name] =useState('');
  const[entity_code, setEntity_code] =useState('');
  const[entity_name, setEntity_name] =useState('');
  const [seriesVrSeq, setSeriesVrSeq] = useState('');
  const [tokenVrSeq, setTokenVrSeq] = useState('');
  const [vrSeqPhase, setVrSeqPhase] = useState([]);

  const dispatch = useDispatch();
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [isFormTrue, setIsFormTrue] = useState(false);
  const [slugValue, setSlugValue] = useState();
  const todos = useSelector(state => state.todos);
  let ikm =0;
  let excelDownload = false;
  

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const processData = () => {
    
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

        console.log(jsonData[1].Gross_Total);
        let jsonLength = jsonData.length;

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        const cell = worksheet[XLSX.utils.encode_cell({ r: 0, c: 21 })];
        const PostCodeValue = cell ? cell.v : undefined;

            // console.log(PostCodeValue);
            const range = XLSX.utils.decode_range(worksheet['!ref']);
            const lastColumnIndex = range.e.c;

            const acc_code_clm = [];

            // Assuming jsonData contains the data from the Excel file
            for (let colIndex = 22; colIndex <= lastColumnIndex; colIndex++) {
                const cellAddress = { r: 0, c: colIndex }; // Row 0, current column index
                const cell = worksheet[XLSX.utils.encode_cell(cellAddress)]; // Get cell object
                const value = cell ? cell.v : undefined; // Get cell value or undefined if cell is empty
                acc_code_clm.push(value); // Store cell value in the array
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
              return `${year}${month}${day}`;
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
           
            for (let i = 0; i < serieses.length; i++) {
              if(postCode == serieses[i].postCode){
                    i++
                  // vrSeqData.push(`${serieses[i-1].series}${date}-${i}`)
                  // console.log(vrSeqDatafn(`${serieses[i-1].series}${date}`))
                  // console.log(`trantype:- ${tranType}`);
                  if(tranType ==='Payment'){
                    return (`${serieses[i-1].series}${date}`)
                    serieses[i-1].replace(/^./, 'R');
                  } else if(tranType ==='Receipt'){
                    let vr = serieses[i-1].series;
                    let vr2 = vr.replace(/^./, 'R')
                    // console.log(vr2);
                    // serieses[i-1].replace(/^./, 'R');
                    return (`${vr2}${date}`)
                  }

                  // return (`${serieses[i-1].series}${date}`)
                
                   
                //  const vrno = `${serieses[i-1].series}${date}`
                //   // return `${serieses[i-1].series}${date}-${i}`;
                //   return vrno
              }
            }
          }

          const vrnoNumber= async(acc_code,date) =>{
                            const vrnoDate = formatDate(date)
                            // console.log(vrnoDate);
                            // console.log(`${acc_code}`);
                            // console.log(`${ vrSeqNumber(acc_code, vrnoDate)}`);
                            const sqdataEx={vrSeq:  vrSeqNumber(acc_code, vrnoDate), lastVrno:100}

                            // console.log(sqdataEx);
                            if(sqdataEx.vrSeq != undefined){
                                try {
                                  const response = await fetch(`/api/vrseq/:${sqdataEx.vrSeq}`);
                                  const data = await response.json();
                                  // console.log(data.data.updatedVrno);
                                   const  vrno = data.data.updatedVrno;
                                 return vrno
                                //   vrnoUpdated = vrno;
                                 
                                //   console.log(vrnoUpdated);
                                } catch (error) {
                                  console.log(error);
                              }
                              }
          }

          const tokenNumber = async(trimVrno) =>{
            try {
                const response = await fetch(`/api/vrseq/:${trimVrno}`);
                const data = await response.json();
                // console.log(data.data.updatedVrno);
                 const  tokenVrno = data.data.updatedVrno;
               return tokenVrno
              //   vrnoUpdated = vrno;
               
              //   console.log(vrnoUpdated);
              } catch (error) {
                console.log(error);
            }
        //         for (let i = 0; i < newTokenVrnoArray.length; i++) {
        //           // console.log(newTokenVrnoArray[i].vrno);
        //           if(i==0){
        //             try {
        //               const response = await fetch(`/api/vrseq/token/daybook/:${newTokenVrnoArray[i].vrno}`);
        //               const data = await response.json();
        //               // console.log(data.data.updatedVrno);
        //               lastvrno = data.data;
        //               // console.log(data.data);
        //               newTokenVrnoArrayUpdated.push({'vrno':`${newTokenVrnoArray[i].vrno}`, 'lastVrno': parseInt(lastvrno)})
        //               // console.log(vrnoUpdated);
        //             } catch (error) {
        //               console.log(error);
        //           }

        //           }else if(i !=0){

        //           if(newTokenVrnoArray[i-1].vrno !=newTokenVrnoArray[i].vrno ){
        //         try {
        //           // console.log(`/api/vrseq/token/:${newTokenVrnoArray[i].vrno}`);
        //           const response = await fetch(`/api/vrseq/token/:${newTokenVrnoArray[i].vrno}`);
        //           const data = await response.json();
        //           // console.log(data.data.updatedVrno);
        //           lastvrno = data.data;
        //           // console.log(data.data);
        //           newTokenVrnoArrayUpdated.push({'vrno':`${newTokenVrnoArray[i].vrno}`, 'lastVrno': parseInt(lastvrno)})
        //           // console.log(vrnoUpdated);
        //         } catch (error) {
        //           console.log(error);
        //       }
        //     }else{
        //       // console.log(`last vr no :- ${newTokenVrnoArrayUpdated[i-1].lastVrno}`);
        //       let vr = parseInt(newTokenVrnoArrayUpdated[i-1].lastVrno)+1
        //       // console.log(`vr number :- ${vr}`);
        //       newTokenVrnoArrayUpdated.push({'vrno':`${newTokenVrnoArray[i].vrno}`, 'lastVrno':vr})
        //     }
        //     }
        //   }
          
          }

          const bankId= (postCode) =>{
            for (let i = 0; i < serieses.length; i++) {
              if(postCode == serieses[i].postCode){
                    i++
                  // vrSeqData.push(`${serieses[i-1].series}${date}-${i}`)
                  // console.log(vrSeqDatafn(`${serieses[i-1].series}${date}`))
                
                   return (`${serieses[i-1].bankid}`)
                //  const vrno = `${serieses[i-1].series}${date}`
                //   // return `${serieses[i-1].series}${date}-${i}`;
                //   return vrno
              }
            }
          }

         
         

          let lastValidDate = '';
          let slno = 1;
          let lastIsDebit = false;
          let date = null;
          let TokenDate =null;
          let bankDate=null;
          let vrnoPhaseTwo=null;

            // jsonData.forEach(async (row, index) => {
            
                for (let index = 0; index < jsonData.length; index++) {
                    const row = jsonData[index];

                    let formattedValue = parseFloat(row.Gross_Total).toFixed(2);
        // Append "Cr" or "Dr" based on the value of the 'Type' column
        formattedValue += row.Gross_Total === 'Dr' ? ' Dr' : ' Cr';
        console.log(formattedValue);

                    console.log(row.Gross_Total);
                    if(row.acc_code === PostCodeValue){
                      const vrno = await vrnoNumber(PostCodeValue,row.Date);
                      const tokenNo = await tokenNumber(vrno.slice(0, 4))
                      // let acc_code_value_count = 0;
                      let slno =2
                      if(row.Voucher_Type ==='Payment'){
                      for (let is = 0; is < acc_code_clm.length; is++) {

                        

                        let acc_code_value_chk= acc_code_clm[is];

                        console.log(row[acc_code_value_chk]);

                        if(row[acc_code_value_chk]){

                          // acc_code_value_count++
                          // console.log(`acc_code_value_count ${acc_code_value_count}`);
                            // console.log(`vrno- ${await vrnoNumber(PostCodeValue,row.Date)}, postcodedata- ${PostCodeValue}, date- ${row.Date}`);
                       
                          

                          
                           
                            
                              if(vrno){
                              //  console.log(vrno);
                            //    let tokemVrno = await tokenNumber(vrno.slice(0, 4))
                          // for (let acc_count = 0; acc_count < acc_code_value_count; acc_count++) {
                            //const element = array[acc_count];
                            
                            newData.push({ 
                              'entity_code' :entity_code,
                              'div_code' : div_code,
                              'vrno' :  vrno,
                              'slno' :  slno++,
                               'vrdate' :  row.Date,
                               'tokenno' :  tokenNo,
                               'tekendate' :  row.Date,
                               'acc_code' :  acc_code_value_chk,
                               'dramt' : row[acc_code_value_chk],
                               'cramt' :null,
                               'particular' : row.Narration,
                               'tcode' : 'B',
                               'base_tcode' : null,
                               'evrdate' : null,
                               'durdate' : null,
                               'dralloc' : row[acc_code_value_chk],
                               'cralloc' : null,
                               'ASDRALLOC' : null,
                               'ASCRALLOC' : null,
                               'BANKID' :  bankId(PostCodeValue),
                               'INSTYPE' : 'NA',
                               'CHQNO' : null,
                               'CHQDATE' : null,
                               'BANKDATE' : row.Date,
                               'LASTUPDATE' : row.Date,
                               'QTYISSUED' : null,
                               'QTYRECD' : null,
                               'REVACC_CODE' : PostCodeValue,
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
                               'APPROVEDDATE' : row.Date,
                               'APPROVEDREMARK' :'OK',
                               'USER_CODE' : 'ADMIN',
                               'FLAG' : null,
                               'PARTYBILLNO' : row.partybillno,
                               'PARTYBILLDATE' : null,
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
                               'CREATEDBY' : null,
                               'CREATEDDATE' : null,
                               'VALUE_DATE' : null,
                        });
                        // slno++;
                          // }
                           
                    
                           }
                        }
                        
                      }
                      newData.push({ 
                        'entity_code' :entity_code,
                        'div_code' : div_code,
                        'vrno' :   vrno,
                        'slno' :  1,
                         'vrdate' :  row.Date,
                         'tokenno' :  null,
                         'tekendate' :  null,
                         'acc_code' :  PostCodeValue,
                         'dramt' : null,
                         'cramt' : row.Gross_Total,
                         'particular' : `By Amount Withdrawn For the voucher ${vrno}`,
                         'tcode' : 'T',
                         'base_tcode' : 'B',
                         'evrdate' : null,
                         'durdate' : null,
                         'dralloc' : null,
                         'cralloc' :  row.Gross_Total,
                         'ASDRALLOC' : null,
                         'ASCRALLOC' : null,
                         'BANKID' : null,
                         'INSTYPE' : null,
                         'CHQNO' : null,
                         'CHQDATE' : null,
                         'BANKDATE' : null,
                         'LASTUPDATE' : row.Date,
                         'QTYISSUED' : null,
                         'QTYRECD' : null,
                         'REVACC_CODE' : '',
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
                         'APPROVED' : null,
                         'APPROVEDBY' : null,
                         'APPROVEDDATE' : null,
                         'APPROVEDREMARK' :null,
                         'USER_CODE' : 'ADMIN',
                         'FLAG' : null,
                         'PARTYBILLNO' : null,
                         'PARTYBILLDATE' : null,
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
                         'CREATEDBY' : null,
                         'CREATEDDATE' : null,
                         'VALUE_DATE' : null,
                  });
                }else if(row.Voucher_Type === 'Receipt' ){
                  newData.push({ 
                    'entity_code' :entity_code,
                    'div_code' : div_code,
                    'vrno' :   vrno,
                    'slno' :  1,
                     'vrdate' :  row.Date,
                     'tokenno' :  null,
                     'tekendate' :  null,
                     'acc_code' :  PostCodeValue,
                     'dramt' : row.Gross_Total,
                     'cramt' : null,
                     'particular' : `By Amount Withdrawn For the voucher ${vrno}`,
                     'tcode' : 'T',
                     'base_tcode' : 'B',
                     'evrdate' : null,
                     'durdate' : null,
                     'dralloc' : null,
                     'cralloc' :  row.Gross_Total,
                     'ASDRALLOC' : null,
                     'ASCRALLOC' : null,
                     'BANKID' : null,
                     'INSTYPE' : null,
                     'CHQNO' : null,
                     'CHQDATE' : null,
                     'BANKDATE' : null,
                     'LASTUPDATE' : row.Date,
                     'QTYISSUED' : null,
                     'QTYRECD' : null,
                     'REVACC_CODE' : '',
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
                     'APPROVED' : null,
                     'APPROVEDBY' : null,
                     'APPROVEDDATE' : null,
                     'APPROVEDREMARK' :null,
                     'USER_CODE' : 'ADMIN',
                     'FLAG' : null,
                     'PARTYBILLNO' : null,
                     'PARTYBILLDATE' : null,
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
                     'CREATEDBY' : null,
                     'CREATEDDATE' : null,
                     'VALUE_DATE' : null,
              });

              for (let is = 0; is < acc_code_clm.length; is++) {

                        

                let acc_code_value_chk= acc_code_clm[is];

                console.log(row[acc_code_value_chk]);

                if(row[acc_code_value_chk]){

                  // acc_code_value_count++
                  // console.log(`acc_code_value_count ${acc_code_value_count}`);
                    // console.log(`vrno- ${await vrnoNumber(PostCodeValue,row.Date)}, postcodedata- ${PostCodeValue}, date- ${row.Date}`);
               
                  

                  
                   
                    
                      if(vrno){
                      //  console.log(vrno);
                    //    let tokemVrno = await tokenNumber(vrno.slice(0, 4))
                  // for (let acc_count = 0; acc_count < acc_code_value_count; acc_count++) {
                    //const element = array[acc_count];
                    
                    newData.push({ 
                      'entity_code' :entity_code,
                      'div_code' : div_code,
                      'vrno' :  vrno,
                      'slno' :  slno++,
                       'vrdate' :  row.Date,
                       'tokenno' :  tokenNo,
                       'tekendate' :  row.Date,
                       'acc_code' :  acc_code_value_chk,
                       'dramt' :null,
                       'cramt' :null,
                       'particular' : row.Narration,
                       'tcode' : 'B',
                       'base_tcode' : null,
                       'evrdate' : null,
                       'durdate' : null,
                       'dralloc' : null,
                       'cralloc' :  row[acc_code_value_chk],
                       'ASDRALLOC' : null,
                       'ASCRALLOC' : null,
                       'BANKID' :  bankId(PostCodeValue),
                       'INSTYPE' : null,
                       'CHQNO' : null,
                       'CHQDATE' : null,
                       'BANKDATE' : row.Date,
                       'LASTUPDATE' : row.Date,
                       'QTYISSUED' : null,
                       'QTYRECD' : null,
                       'REVACC_CODE' : PostCodeValue,
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
                       'APPROVEDDATE' : row.Date,
                       'APPROVEDREMARK' :'OK',
                       'USER_CODE' : 'ADMIN',
                       'FLAG' : null,
                       'PARTYBILLNO' : row.partybillno,
                       'PARTYBILLDATE' : null,
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
                       'CREATEDBY' : null,
                       'CREATEDDATE' : null,
                       'VALUE_DATE' : null,
                });
                // slno++;
                  // }
                   
            
                   }
                }
                
              }

                }

                    }else if (row.acc_code !== PostCodeValue){
                        // console.log(`vrno- ${await vrnoNumber(PostCodeValue,row.Date)}, postcodedata- ${PostCodeValue}, date- ${row.Date}`);
                        let vrno = await vrnoNumber(PostCodeValue,row.Date) 
                        // console.log(vrno);
                        const tokenNo = await tokenNumber(vrno.slice(0, 4))
                        let slno =2
                        if(row.Voucher_Type ==='Payment'){

                     

                        if(vrno){
                          //  console.log(vrno);
                        //    let tokemVrno = await tokenNumber(vrno.slice(0, 4))
                            newData.push({ 
                                'entity_code' :entity_code,
                                'div_code' : div_code,
                                'vrno' :  vrno,
                                'slno' :  slno,
                                 'vrdate' :  row.Date,
                                 'tokenno' :  tokenNo,
                                 'tekendate' :  row.Date,
                                 'acc_code' :  row.acc_code,
                                 'dramt' :  row.Gross_Total,
                                 'cramt' : null,
                                 'particular' :  row.Narration,
                                 'tcode' : 'B',
                                 'base_tcode' : null,
                                 'evrdate' : null,
                                 'durdate' : null,
                                 'dralloc' : row.Gross_Total,
                                 'cralloc' : null,
                                 'ASDRALLOC' : null,
                                 'ASCRALLOC' : null,
                                 'BANKID' : bankId(PostCodeValue),
                                 'INSTYPE' : 'NA',
                                 'CHQNO' : null,
                                 'CHQDATE' : null,
                                 'BANKDATE' : row.Date,
                                 'LASTUPDATE' : row.Date,
                                 'QTYISSUED' : null,
                                 'QTYRECD' : null,
                                 'REVACC_CODE' : PostCodeValue,
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
                                 'APPROVEDDATE' : row.Date,
                                 'APPROVEDREMARK' :'OK',
                                 'USER_CODE' :'ADMIN',
                                 'FLAG' : null,
                                 'PARTYBILLNO' : null,
                                 'PARTYBILLDATE' : null,
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
                                 'CREATEDBY' : null,
                                 'CREATEDDATE' : null,
                                 'VALUE_DATE' : null,
                          });
                        }

                        for (let is = 0; is < acc_code_clm.length; is++) {
  
                          
  
                          let acc_code_value_chk= acc_code_clm[is];
  
                          console.log(row[acc_code_value_chk]);
  
                          if(row[acc_code_value_chk]){


                        
                        if(vrno){
                          //  console.log(vrno);
                        //    let tokemVrno = await tokenNumber(vrno.slice(0, 4))
                            newData.push({ 
                                'entity_code' :entity_code,
                                'div_code' : div_code,
                                'vrno' :  vrno,
                                'slno' :  ++slno,
                                 'vrdate' :  row.Date,
                                 'tokenno' :  tokenNo,
                                 'tekendate' :  row.Date,
                                 'acc_code' :  acc_code_value_chk,
                                 'dramt' :  row[acc_code_value_chk],
                                 'cramt' : null,
                                 'particular' :  row.Narration,
                                 'tcode' : 'B',
                                 'base_tcode' : null,
                                 'evrdate' : null,
                                 'durdate' : null,
                                 'dralloc' :  row[acc_code_value_chk],
                                 'cralloc' : null,
                                 'ASDRALLOC' : null,
                                 'ASCRALLOC' : null,
                                 'BANKID' : bankId(PostCodeValue),
                                 'INSTYPE' : 'NA',
                                 'CHQNO' : null,
                                 'CHQDATE' : null,
                                 'BANKDATE' : row.Date,
                                 'LASTUPDATE' : row.Date,
                                 'QTYISSUED' : null,
                                 'QTYRECD' : null,
                                 'REVACC_CODE' : PostCodeValue,
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
                                 'APPROVED' : null,
                                 'APPROVEDBY' : null,
                                 'APPROVEDDATE' : null,
                                 'APPROVEDREMARK' :null,
                                 'USER_CODE' : 'ADMIN',
                                 'FLAG' : null,
                                 'PARTYBILLNO' : null,
                                 'PARTYBILLDATE' : null,
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
                                 'CREATEDBY' : null,
                                 'CREATEDDATE' : null,
                                 'VALUE_DATE' : null,
                          });
                        }
                      }
                      
                    }

                          newData.push({ 
                            'entity_code' :entity_code,
                            'div_code' : div_code,
                            'vrno' :  vrno,
                            'slno' :  1,
                             'vrdate' :  row.Date,
                             'tokenno' :  null,
                             'tekendate' :  null,
                             'acc_code' :  PostCodeValue,
                             'dramt' : null,
                             'cramt' : row[PostCodeValue],
                             'particular' : `By Amount Withdrawn For the voucher ${vrno}`,
                             'tcode' : 'T',
                             'base_tcode' : 'B',
                             'evrdate' : null,
                             'durdate' : null,
                             'dralloc' : null,
                             'cralloc' :  row[PostCodeValue],
                             'ASDRALLOC' : null,
                             'ASCRALLOC' : null,
                             'BANKID' : null,
                             'INSTYPE' : null,
                             'CHQNO' : null,
                             'CHQDATE' : null,
                             'BANKDATE' : null,
                             'LASTUPDATE' : row.Date,
                             'QTYISSUED' : null,
                             'QTYRECD' : null,
                             'REVACC_CODE' : '',
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
                             'APPROVED' : null,
                             'APPROVEDBY' : null,
                             'APPROVEDDATE' : null,
                             'APPROVEDREMARK' :null,
                             'USER_CODE' : 'ADMIN',
                             'FLAG' : null,
                             'PARTYBILLNO' : null,
                             'PARTYBILLDATE' : null,
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
                             'CREATEDBY' : null,
                             'CREATEDDATE' : null,
                             'VALUE_DATE' : null,
                      });
                    }else if(row.Voucher_Type === 'Receipt' ){
                      if(vrno){
                        newData.push({ 
                          'entity_code' :entity_code,
                          'div_code' : div_code,
                          'vrno' :  vrno,
                          'slno' :  1,
                           'vrdate' :  row.Date,
                           'tokenno' :  null,
                           'tekendate' :  null,
                           'acc_code' :  PostCodeValue,
                           'dramt' : row[PostCodeValue],
                           'cramt' : null,
                           'particular' : `By Amount Withdrawn For the voucher ${vrno}`,
                           'tcode' : 'T',
                           'base_tcode' : 'B',
                           'evrdate' : null,
                           'durdate' : null,
                           'dralloc' : row[PostCodeValue],
                           'cralloc' :  null,
                           'ASDRALLOC' : null,
                           'ASCRALLOC' : null,
                           'BANKID' : null,
                           'INSTYPE' : null,
                           'CHQNO' : null,
                           'CHQDATE' : null,
                           'BANKDATE' : null,
                           'LASTUPDATE' : row.Date,
                           'QTYISSUED' : null,
                           'QTYRECD' : null,
                           'REVACC_CODE' : '',
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
                           'APPROVED' : null,
                           'APPROVEDBY' : null,
                           'APPROVEDDATE' : null,
                           'APPROVEDREMARK' :null,
                           'USER_CODE' : 'ADMIN',
                           'FLAG' : null,
                           'PARTYBILLNO' : null,
                           'PARTYBILLDATE' : null,
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
                           'CREATEDBY' : null,
                           'CREATEDDATE' : null,
                           'VALUE_DATE' : null,
                    });
                        //  console.log(vrno);
                      //    let tokemVrno = await tokenNumber(vrno.slice(0, 4))
                          newData.push({ 
                              'entity_code' :entity_code,
                              'div_code' : div_code,
                              'vrno' :  vrno,
                              'slno' :  slno,
                               'vrdate' :  row.Date,
                               'tokenno' :  tokenNo,
                               'tekendate' :  row.Date,
                               'acc_code' :  row.acc_code,
                               'dramt' :null,
                               'cramt' : row.Gross_Total,
                               'particular' :  row.Narration,
                               'tcode' : 'B',
                               'base_tcode' : null,
                               'evrdate' : null,
                               'durdate' : null,
                               'dralloc' : null,
                               'cralloc' : row.Gross_Total,
                               'ASDRALLOC' : null,
                               'ASCRALLOC' : null,
                               'BANKID' : bankId(PostCodeValue),
                               'INSTYPE' : 'NA',
                               'CHQNO' : null,
                               'CHQDATE' : null,
                               'BANKDATE' : row.Date,
                               'LASTUPDATE' : row.Date,
                               'QTYISSUED' : null,
                               'QTYRECD' : null,
                               'REVACC_CODE' : PostCodeValue,
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
                               'APPROVEDDATE' : row.Date,
                               'APPROVEDREMARK' :'OK',
                               'USER_CODE' :'ADMIN',
                               'FLAG' : null,
                               'PARTYBILLNO' : null,
                               'PARTYBILLDATE' : null,
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
                               'CREATEDBY' : null,
                               'CREATEDDATE' : null,
                               'VALUE_DATE' : null,
                        });
                      }

                      for (let is = 0; is < acc_code_clm.length; is++) {

                        

                        let acc_code_value_chk= acc_code_clm[is];

                        // console.log(row[acc_code_value_chk]);

                        if(row[acc_code_value_chk]){


                      
                      if(vrno){
                        //  console.log(vrno);
                      //    let tokemVrno = await tokenNumber(vrno.slice(0, 4))
                          newData.push({ 
                              'entity_code' :entity_code,
                              'div_code' : div_code,
                              'vrno' :  vrno,
                              'slno' :  ++slno,
                               'vrdate' :  row.Date,
                               'tokenno' :  tokenNo,
                               'tekendate' :  row.Date,
                               'acc_code' :  acc_code_value_chk,
                               'dramt' :  null,
                               'cramt' : row[acc_code_value_chk],
                               'particular' :  row.Narration,
                               'tcode' : 'B',
                               'base_tcode' : null,
                               'evrdate' : null,
                               'durdate' : null,
                               'dralloc' :  null,
                               'cralloc' : row[acc_code_value_chk],
                               'ASDRALLOC' : null,
                               'ASCRALLOC' : null,
                               'BANKID' : bankId(PostCodeValue),
                               'INSTYPE' : 'NA',
                               'CHQNO' : null,
                               'CHQDATE' : null,
                               'BANKDATE' : row.Date,
                               'LASTUPDATE' : row.Date,
                               'QTYISSUED' : null,
                               'QTYRECD' : null,
                               'REVACC_CODE' : PostCodeValue,
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
                               'APPROVED' : null,
                               'APPROVEDBY' : null,
                               'APPROVEDDATE' : null,
                               'APPROVEDREMARK' :null,
                               'USER_CODE' : 'ADMIN',
                               'FLAG' : null,
                               'PARTYBILLNO' : null,
                               'PARTYBILLDATE' : null,
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
                               'CREATEDBY' : null,
                               'CREATEDDATE' : null,
                               'VALUE_DATE' : null,
                        });
                      }
                    }
                    
                  }

                    
                    }
                        
                    }
                
                    // newDataPhaseTwo = newData.map( async (item, index) => {
                    //     // if(newVrnoArray[index]){
                    //         const vrnoDate = formatDate(item.Date)
                    //         console.log(vrnoDate);
                    //         console.log(`${PostCodeValue}`);
                    //         console.log(`${ vrSeqNumber(PostCodeValue, vrnoDate)}`);
                    //         const sqdataEx={vrSeq:  vrSeqNumber(PostCodeValue, vrnoDate), lastVrno:100}

                    //         console.log(sqdataEx);
                    //         if(sqdataEx.vrSeq != undefined){
                    //             try {
                    //               const response = await fetch(`/api/vrseq/:${sqdataEx.vrSeq}`);
                    //               const data = await response.json();
                    //               // console.log(data.data.updatedVrno);
                    //                const  vrno = data.data.updatedVrno;
              
                    //               vrnoUpdated.push(vrno);
                                 
                    //               console.log(vrnoUpdated);
                    //             } catch (error) {
                    //               console.log(error);
                    //           }
                    //           }
                    //     // }
                    //         })
                    
                    // console.log(vrnoUpdated);
                    
            //        newData.push({ 
            //           'entity_code' :entity_code,
            //           'div_code' : div_code,
            //           'vrno' :  '',
            //           'slno' :  slno,
            //            'vrdate' :  date,
            //            'tokenno' :  null,
            //            'tekendate' : TokenDate,
            //            'acc_code' :  row.ACC_CODE,
            //            'dramt' : row.Debit,
            //            'cramt' : row.Credit,
            //            'particular' : null,
            //            'tcode' : tcode,
            //            'base_tcode' : baseCode,
            //            'evrdate' : null,
            //            'durdate' : null,
            //            'dralloc' : row.Debit,
            //            'cralloc' : row.Credit,
            //            'ASDRALLOC' : null,
            //            'ASCRALLOC' : null,
            //            'BANKID' : null,
            //            'INSTYPE' : null,
            //            'CHQNO' : null,
            //            'CHQDATE' : null,
            //            'BANKDATE' : row.Debit ?  date : '',
            //            'LASTUPDATE' : '',
            //            'QTYISSUED' : null,
            //            'QTYRECD' : null,
            //            'REVACC_CODE' : '',
            //            'COST_CODE' : null,
            //            'CONSIGNEE_CODE' : null,
            //            'STAX_CODE' : null,
            //            'ETAX_CODE' : null,
            //            'TDSACC_CODE' : null,
            //            'TDS_CODE' : null,
            //            'TDSAMT' : null,
            //            'TDS_RATE' : null,
            //            'TDS_SLNO' : null,
            //            'TDS_CHALLANNO' : null,
            //            'TDS_CHALLANDATE' : null,
            //            'TDS_BANK_CODE' : null,
            //            'TDS_BANK_BRANCH' : null,
            //            'HUNDI_NO' : null,
            //            'DEPT_CODE' : null,
            //            'EMP_CODE' : null,
            //            'BANK_CODE' : null,
            //            'OLD_VRNO' : null,
            //            'APPROVED' : null,
            //            'APPROVEDBY' : null,
            //            'APPROVEDDATE' : null,
            //            'APPROVEDREMARK' :null,
            //            'USER_CODE' : 'ADMIN',
            //            'FLAG' : null,
            //            'PARTYBILLNO' : null,
            //            'PARTYBILLDATE' : null,
            //            'LOAN_CODE' : null,
            //            'ROUND_OFF' : null,
            //            'LOAN_DATE' : null,
            //            'TAXABLE_AMT' : null,
            //            'LASTUPDATEDBY' : null,
            //            'PAYMENT_NATURE' : null,
            //            'ORDER_VRNO' : null,
            //            'BANKSTMT_FLAG' : null,
            //            'TDS_FLAG' : null,
            //            'EXPENSE_VRNO' : null,
            //            'EXPENSE_SLNO' : null,
            //            'APPROVED_FLAG' : null,
            //            'HOLD_AMT' : null,
            //            'CURRENCY_CODE' : 'INR',
            //            'EXCHANGE_RATE' : '1',
            //            'PARTY_RECO_DATE' : null,
            //            'PARTY_RECO_AMT' : null,
            //            'PARTY_RECO_STMT_DATE' : null,
            //            'RECO_USER_CODE' : null,
            //            'RECO_LASTUPDATE' : null,
            //            'SUB_ACC_CODE' : null,
            //            'LC_TCODE' : null,
            //            'LC_VRNO' : null,
            //            'BANK_REF_NO' : null,
            //            'DELIVERY_TO_SLNO' : null,
            //            'DELIVERY_FROM_SLNO' : null,
            //            'GST_CODE' : null,
            //            'MIS_CODE' : null,
            //            'TRANTYPE' : null,
            //            'API_PAYMENT_ROWID_SEQ' : null,
            //            'CREATEDBY' : null,
            //            'CREATEDDATE' : null,
            //            'VALUE_DATE' : null,
            //     });
             

            //     if(sqdataEx.vrSeq != undefined){
            //       try {
            //         const response = await fetch(`/api/vrseq/:${sqdataEx.vrSeq}`);
            //         const data = await response.json();
            //         // console.log(data.data.updatedVrno);
            //         vrno = data.data.updatedVrno;

            //         vrnoUpdated.push({'vrno':vrno});
                   
            //         // console.log(vrnoUpdated);
            //       } catch (error) {
            //         console.log(error);
            //     }
            //     }
            //         let newVrnoArray = [];
            //         let newTokenVrnoArray = [];
            //         let newTokenVrnoArrayUpdated = [];
            //         let newTokenVrnoArrayUpdatedPhaseTwo = [];
            //         let newTokenVrnoArrayUpdatedPhaseThree = [];
            //         let bankIdArrayUpdatedPhaseTwo = [];
            //         let revAccCodePhaseTwo = [];
                    
            //         // vrDateUpdated.forEach(date => {
            //         //   newVrDateArray.push(date, date);
            //         // });
            //         // console.log(newVrDateArray);
    
            //         vrnoUpdated.forEach(item => {
            //           // newVrnoArray.push(item, item);
            //           const originalString = item.vrno;
            //           const trimmedString = {vrno: `${originalString.slice(0, 4)}A`};
            //           newTokenVrnoArray.push(trimmedString)

            //         });
                  
            //         let lastvrno=''
            //         // console.log(newTokenVrnoArray);
            //         if(newTokenVrnoArray.length !=0){
            //         for (let i = 0; i < newTokenVrnoArray.length; i++) {
            //           // console.log(newTokenVrnoArray[i].vrno);
            //           if(i==0){
            //             try {
            //               const response = await fetch(`/api/vrseq/token/:${newTokenVrnoArray[i].vrno}`);
            //               const data = await response.json();
            //               // console.log(data.data.updatedVrno);
            //               lastvrno = data.data;
            //               // console.log(data.data);
            //               newTokenVrnoArrayUpdated.push({'vrno':`${newTokenVrnoArray[i].vrno}`, 'lastVrno': parseInt(lastvrno)})
            //               // console.log(vrnoUpdated);
            //             } catch (error) {
            //               console.log(error);
            //           }

            //           }else if(i !=0){

            //           if(newTokenVrnoArray[i-1].vrno !=newTokenVrnoArray[i].vrno ){
            //         try {
            //           // console.log(`/api/vrseq/token/:${newTokenVrnoArray[i].vrno}`);
            //           const response = await fetch(`/api/vrseq/token/:${newTokenVrnoArray[i].vrno}`);
            //           const data = await response.json();
            //           // console.log(data.data.updatedVrno);
            //           lastvrno = data.data;
            //           // console.log(data.data);
            //           newTokenVrnoArrayUpdated.push({'vrno':`${newTokenVrnoArray[i].vrno}`, 'lastVrno': parseInt(lastvrno)})
            //           // console.log(vrnoUpdated);
            //         } catch (error) {
            //           console.log(error);
            //       }
            //     }else{
            //       // console.log(`last vr no :- ${newTokenVrnoArrayUpdated[i-1].lastVrno}`);
            //       let vr = parseInt(newTokenVrnoArrayUpdated[i-1].lastVrno)+1
            //       // console.log(`vr number :- ${vr}`);
            //       newTokenVrnoArrayUpdated.push({'vrno':`${newTokenVrnoArray[i].vrno}`, 'lastVrno':vr})
            //     }
            //     }
            //   }
            //   }

            //   newTokenVrnoArrayUpdated.forEach(item => {
            //     let tokenPhaseTwo = (`${item.vrno}-${item.lastVrno}`)
            //     newTokenVrnoArrayUpdatedPhaseTwo.push({vrno: `${tokenPhaseTwo}`});
            //   });
            
            //     // console.log(newTokenVrnoArrayUpdated);
            //     const bankIdData=bankId(row.ACC_CODE)
            //     if(bankIdData != undefined){
            //       bankIdAcc.push(bankIdData)
            //     }
              

            //     // bankIdAcc.forEach(item =>{
            //     //   bankIdArrayUpdatedPhaseTwo.push(item,'')
            //     // })
            //     ikm++
            //     console.log(`i count ${ikm}`);
            //     console.log(`jsonLength ===i ${jsonLength} ===${ikm}`);
            //     if(jsonLength ===ikm){
            //       console.log(`data proccess start`);
            //       excelDownload = true;
            //       console.log(`update excel downloading:- ${excelDownload}`);
            //     let inf =0;
            //     let revAccCount =0;
            //     setTimeout(() => {
            //       newDataPhaseTwo = newData.map((item, i) => {
                 
            //         // console.log(vrnoUpdated);
            //         if(item.dramt){
            //           newVrnoArray.push(vrnoUpdated[inf]);
            //           // newTokenVrnoArrayUpdatedPhaseTwo.push({vrno: `$${item.vrno}-${item.lastVrno}`});
            //           newTokenVrnoArrayUpdatedPhaseThree.push(newTokenVrnoArrayUpdatedPhaseTwo[inf]);
            //           bankIdArrayUpdatedPhaseTwo.push(bankIdAcc[inf]);
            //           revAccCodePhaseTwo.push(revAccCode[inf])
            //           revAccCount +=1;
            //         } else if(item.cramt){
            //           newVrnoArray.push(vrnoUpdated[inf]);
            //           // newTokenVrnoArrayUpdatedPhaseTwo.push({vrno: ''});
            //           newTokenVrnoArrayUpdatedPhaseThree.push({vrno: ''});
            //           bankIdArrayUpdatedPhaseTwo.push(' ');
            //           revAccCodePhaseTwo.push(' ')
            //           inf +=1;
            //           // console.log(inf);
            //           revAccCount =0;
            //       }
                
            //       })
            //     }, 2000);
            //     console.log(`token proccessing done`);
            //     // console.log(revAccCodePhaseTwo);
            //     setTimeout(() => {
            //        newDataPhaseTwo = newData.map((item, index) => {
            //         if(newVrnoArray[index]){
            //           if(newTokenVrnoArrayUpdatedPhaseThree[index]){
            //         return {
            //             'entity_code' :item.entity_code,
            //             'div_code' :item.div_code,
            //             'vrno': newVrnoArray[index].vrno,
            //             'slno': item.slno,
            //             'vrdate': item.vrdate,
            //             'tokenno': newTokenVrnoArrayUpdatedPhaseThree[index].vrno,
            //             'tekendate' :  item.tekendate,
            //             'acc_code' :  item.acc_code,
            //             'dramt' : item.dramt,
            //             'cramt' : item.cramt,
            //             'particular' : item.particular,
            //             'tcode' : item.tcode,
            //             'base_tcode' : item.base_tcode,
            //             'evrdate' : item.evrdate,
            //             'durdate' : item.durdate,
            //             'dralloc' : item.dralloc,
            //             'cralloc' : item.cralloc,
            //             'ASDRALLOC' : item.ASDRALLOC,
            //             'ASCRALLOC' : item.ASCRALLOC,
            //             'BANKID' : bankIdArrayUpdatedPhaseTwo[index],
            //             'INSTYPE' : item.INSTYPE,
            //             'CHQNO' : item.CHQNO,
            //             'CHQDATE' : item.CHQDATE,
            //             'BANKDATE' : item.BANKDATE,
            //             'LASTUPDATE' :  item.vrdate,
            //             'QTYISSUED' : item.QTYISSUED,
            //             'QTYRECD' : item.QTYRECD,
            //             'REVACC_CODE' : revAccCodePhaseTwo[index],
            //             'COST_CODE' : item.COST_CODE,
            //             'CONSIGNEE_CODE' : item.CONSIGNEE_CODE,
            //             'STAX_CODE' : item.STAX_CODE,
            //             'ETAX_CODE' : item.ETAX_CODE,
            //             'TDSACC_CODE' : item.TDSACC_CODE,
            //             'TDS_CODE' : item.TDS_CODE,
            //             'TDSAMT' : item.TDSAMT,
            //             'TDS_RATE' : item.TDS_RATE,
            //             'TDS_SLNO' : item.TDS_SLNO,
            //             'TDS_CHALLANNO' : item.TDS_CHALLANNO,
            //             'TDS_CHALLANDATE' : item.TDS_CHALLANDATE,
            //             'TDS_BANK_CODE' : item.TDS_BANK_CODE,
            //             'TDS_BANK_BRANCH' : item.TDS_BANK_BRANCH,
            //             'HUNDI_NO' : item.HUNDI_NO,
            //             'DEPT_CODE' : item.DEPT_CODE,
            //             'EMP_CODE' : item.EMP_CODE,
            //             'BANK_CODE' : item.BANK_CODE,
            //             'OLD_VRNO' : item.OLD_VRNO,
            //             'APPROVED' : item.APPROVED,
            //             'APPROVEDBY' : item.APPROVEDBY,
            //             'APPROVEDDATE' : item.APPROVEDBY,
            //             'APPROVEDREMARK' : item.APPROVEDREMARK,
            //             'USER_CODE' : 'ADMIN',
            //             'FLAG' : item.FLAG,
            //             'PARTYBILLNO' : item.PARTYBILLNO,
            //             'PARTYBILLDATE' : item.PARTYBILLDATE,
            //             'LOAN_CODE' :  item.LOAN_CODE,
            //             'ROUND_OFF' : item.ROUND_OFF,
            //             'LOAN_DATE' : item.LOAN_DATE,
            //             'TAXABLE_AMT' : item.TAXABLE_AMT,
            //             'LASTUPDATEDBY' : item.LASTUPDATEDBY,
            //             'PAYMENT_NATURE' : item.PAYMENT_NATURE,
            //             'ORDER_VRNO' : item.ORDER_VRNO,
            //             'BANKSTMT_FLAG' : item.BANKSTMT_FLAG,
            //             'TDS_FLAG' : item.TDS_FLAG,
            //             'EXPENSE_VRNO' : item.EXPENSE_VRNO,
            //             'EXPENSE_SLNO' : item.EXPENSE_SLNO,
            //             'APPROVED_FLAG' : item.APPROVED_FLAG,
            //             'HOLD_AMT' : item.HOLD_AMT,
            //             'CURRENCY_CODE' : item.CURRENCY_CODE,
            //             'EXCHANGE_RATE' : item.EXCHANGE_RATE,
            //             'PARTY_RECO_DATE' : item.PARTY_RECO_DATE,
            //             'PARTY_RECO_AMT' : item.PARTY_RECO_AMT,
            //             'PARTY_RECO_STMT_DATE' : item.PARTY_RECO_STMT_DATE,
            //             'RECO_USER_CODE' : item.RECO_USER_CODE,
            //             'RECO_LASTUPDATE' : item.RECO_LASTUPDATE,
            //             'SUB_ACC_CODE' : item.SUB_ACC_CODE,
            //             'LC_TCODE' : item.LC_TCODE,
            //             'LC_VRNO' : item.LC_VRNO,
            //             'BANK_REF_NO' : item.BANK_REF_NO,
            //             'DELIVERY_TO_SLNO' : item.DELIVERY_TO_SLNO,
            //             'DELIVERY_FROM_SLNO' : item.DELIVERY_FROM_SLNO,
            //             'GST_CODE' : item.GST_CODE,
            //             'MIS_CODE' : item.MIS_CODE,
            //             'TRANTYPE' : item.TRANTYPE,
            //             'API_PAYMENT_ROWID_SEQ' : item.API_PAYMENT_ROWID_SEQ,
            //             'CREATEDBY' : item.CREATEDBY,
            //             'CREATEDDATE' :  item.CREATEDDATE,
            //             'VALUE_DATE' : item.VALUE_DATE,
            //         };
            //       }
            //       }
            //     });
            
            //     console.log(`complete data proccessing done`);
            //     }, 7000);

            //     console.log(`Status excel downloading:- ${excelDownload}`);
            //     if(excelDownload){
            //       console.log(`Starting excel downloading:- ${excelDownload}`);
            //     setTimeout(() => {
            //     console.log('excel downloading start');
            //     // console.log(newDataArray);
            //       const newWorksheet = XLSX.utils.json_to_sheet(newDataPhaseTwo);
            
            //       // Create a new workbook and add the worksheet
            //       const newWorkbook = XLSX.utils.book_new();
            //       XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Sheet1');
            
            //       // Write the new workbook to a file
            //       XLSX.writeFile(newWorkbook, 'output.xlsx');
            //       console.log('excel downloading done');
            //     }, 10000);
             
            //     };

                
            //   } 
                // newData.push({ 'sr no': index + 2, 'acc_code': 'hay', 'cr amount': row.Credit });
            // });
            }

          
        
  setTimeout(() => {
      // //    // Convert processed data back to worksheet
    // //    const newWorksheet = XLSX.utils.json_to_sheet(processedData);
    const newWorksheeta = XLSX.utils.json_to_sheet(newData);

    // Create a new workbook and add the worksheet
    const newWorkbooka = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbooka, newWorksheeta, 'Sheet1');

    // Write the new workbook to a file
    XLSX.writeFile(newWorkbooka, 'output.xlsx');

    // console.log('excel downloading start');
    setIsFormTrue(false);
    alert(`Data proccessing is done`);
    setTimeout(() => {
      window.location.reload();
    }, 200);
   
  }, 1000);

   
  }
    reader.readAsArrayBuffer(file);

    setTimeout(() => {
      axios.delete('/api/vrseq/delete')  //, { data: { vrSeqArray } }
      .then(response => {
        console.log('Deleted successfully:', response.data);
        // Handle successful deletion
      })
      .catch(error => {
        console.error('Error deleting data:', error);
        // this.setState({ error: 'Error deleting data' });
      });
    }, 20000);





  };



  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(event)
    alert(`The name you entered was: ${entity_code} ${entity_name}`);
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
  }
},[todos])


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
          <div className=" text-white text-xl mt-2">Please wait...</div>
          </div>
             </div>}
     {!isFormTrue &&

         <div>
          {isTableOpen &&
          <div>
            <SearchableTable 
            onClick={handleTable}
            slugValue={slugValue}/>
          </div>
            }
            {!isTableOpen &&
              <form onSubmit={handleSubmit}>
                <div className=" flex">
                <div className=" w-3/12">
              <Input
                  label ='Division'
                  value={div_code}
                  onClick={handleInputClick}
                  onChange={handleChange}
                  required
              />
              </div>
              <div className=" w-9/12">
              <Input
              value={div_name}
              onClick={handleInputClick}
              onChange={handleChange}
              />
              </div>
              </div>
              <div className=" flex">
                <div className=" w-3/12">
              <Input
                  label ='Entity'
                  value={entity_code}
                  onClick={handleEntityClick}
                  onChange={handleChange}
                  required
              />
              </div>
              <div className=" w-9/12">
              <Input
              value={entity_name}
              onClick={handleEntityClick}
              onChange={handleChange}
              
              />
              </div>
              </div>
              {/* <label>Type
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label> */}
              {/* <Input label='type'
              value={name}
              onChange={(e) => setName(e.target.value)}/> */}
              <div className="w-full flex mt-2 mb-1">
                    <label>
                    Tran Type
                    </label>
                        <select
                        className={`px-3 py-1 bg-blue-200 text-black outline-blue-500 focus:bg-gray-50 duration-200 border border-blue-400 w-full`}
                        onChange={handleTranTypeChange}
                        required
                        >
                        <option></option>
                        <option>Payment</option>
                        <option>Receipt</option>
                       
                        </select>
                    </div>
                {/* <Input label='Vrno Seq'
              value={seriesVrSeq}
              onChange={(e) => setSeriesVrSeq(e.target.value)}/>
              <Input label='Token Seq'
              value={tokenVrSeq}
              onChange={(e) => setTokenVrSeq(e.target.value)}/> */}


                <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
                <Button children='Process' onClick={processData}/>
            </form>

            
                        
                        }
                         </div>
                      }
    </div>
  );
}

export default CbjExcelDaybook;
