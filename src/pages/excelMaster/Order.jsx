import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import Button from '../../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import SearchableTable from '../../selectComponents/SearchableTable';
import { removeTodo } from '../../features/todo/todoSlice';
import Input from '../../components/Input';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Order() {
  let headVrSeq=0;
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const[tranType, setTranType]=useState('');
  const[gstType, setGstType]=useState('');
  const[seriesType, setSeriesType]=useState('');
  const[div_code, setDiv_code] =useState('');
  const[div_name, setDiv_name] =useState('');
  const[entity_code, setEntity_code] =useState('');
  const[entity_name, setEntity_name] =useState('');
  const[series_code, setSeries_code] =useState('');
  const[series_name, setSeries_name] =useState('');
  const[addon_code, setAddon_code] =useState('');
  const[addon_name, setAddon_name] =useState(''); 
  const[addonData, setAddonData] = useState([]);
  
//   const[AFCODE2, setAFCODE2] = useState(null);
//   const[AFCODE3, setAFCODE3] = useState(null);
//   const[AFCODE4, setAFCODE4] = useState(null);
//   const[AFCODE5, setAFCODE5] = useState(null);
//   const[AFCODE6, setAFCODE6] = useState(null);
//   const[AFCODE7, setAFCODE7] = useState(null);
//   const[AFCODE8, setAFCODE8] = useState(null);
//   const[AFCODE9, setAFCODE9] = useState(null);
//   const[AFCODE10, setAFCODE10] = useState(null);
//   const[AFCODE11, setAFCODE11] = useState(null);
//   const[AFCODE12, setAFCODE12] = useState(null);
//   const[AFCODE13, setAFCODE13] = useState(null);
//   const[AFCODE14, setAFCODE14] = useState(null);
//   const[AFCODE15, setAFCODE15] = useState(null);

//   const[AFRATEI2, setAFRATEI2] = useState(null);
// const[AFRATEI3, setAFRATEI3] = useState(null);
// const[AFRATEI4, setAFRATEI4] = useState(null);
// const[AFRATEI5, setAFRATEI5] = useState(null);
// const[AFRATEI6, setAFRATEI6] = useState(null);
// const[AFRATEI7, setAFRATEI7] = useState(null);
// const[AFRATEI8, setAFRATEI8] = useState(null);
// const[AFRATEI9, setAFRATEI9] = useState(null);
// const[AFRATEI10, setAFRATEI10] = useState(null);
// const[AFRATEI11, setAFRATEI11] = useState(null);
// const[AFRATEI12, setAFRATEI12] = useState(null);
// const[AFRATEI13, setAFRATEI13] = useState(null);
// const[AFRATEI14, setAFRATEI14] = useState(null);
// const[AFRATEI15, setAFRATEI15] = useState(null);

// const[AFLOGIC2, setAFLOGIC2] = useState(null);
// const[AFLOGIC3, setAFLOGIC3] = useState(null);
// const[AFLOGIC4, setAFLOGIC4] = useState(null);
// const[AFLOGIC5, setAFLOGIC5] = useState(null);
// const[AFLOGIC6, setAFLOGIC6] = useState(null);
// const[AFLOGIC7, setAFLOGIC7] = useState(null);
// const[AFLOGIC8, setAFLOGIC8] = useState(null);
// const[AFLOGIC9, setAFLOGIC9] = useState(null);
// const[AFLOGIC10, setAFLOGIC10] = useState(null);
// const[AFLOGIC11, setAFLOGIC11] = useState(null);
// const[AFLOGIC12, setAFLOGIC12] = useState(null);
// const[AFLOGIC13, setAFLOGIC13] = useState(null);
// const[AFLOGIC14, setAFLOGIC14] = useState(null);
// const[AFLOGIC15, setAFLOGIC15] = useState(null);
// const[AFLOGIC16, setAFLOGIC16] = useState(null);
// const[AFLOGIC17, setAFLOGIC17] = useState(null);
// const[AFLOGIC18, setAFLOGIC18] = useState(null);



  
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
  }
  const csvFormate= ()=>{
        csvFormateData.push({
                            'Voucher_Date' : '* = Mendatory',
                            'Voucher_Number' : '',
                            'Account_Name':null,
                            'Gst_number' : '* =This is mandatory, if GST number is not available the result will be incorrect data',
                            'Acc_code_erp' : '*',
                            'Acc_address_code_erp' :null,
                            'Transporter_code_erp' : null,
                            'Broker_code_erp' : null,
                            'Department_code_erp' : null,
                            'Item_code_erp' : '*',
                            'Cost_center_erp' : null,
                            'Division_code_erp' : null,
                            'Stock_type_code' : '* R or C',
                            'Quantity_Balance' : '*',
                            'Rate_GST_exclusive' : '*',
                            'GST_Rate' : '*',
                            'HSN_code' : '*',
                            'Unit_code_erp' : '*',
                      
          
        });
        csvFormateData.push({
          
        });
        const newWorksheeta = XLSX.utils.json_to_sheet(csvFormateData);
    const newWorkbooka = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbooka, newWorksheeta, 'Sheet1');

    // Write the new workbook to a file
    XLSX.writeFile(newWorkbooka, 'Order_Import_Format.xlsx');

    alert(`Order Import to Erp template downloaded`);
   
    
   
  }


 
  const processData =async() => {
    
    if (!file) {
      alert("Please select an Excel file.");
      return;
    } else  if (!entity_code || !div_code || !tranType || !addon_code) {
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

        // let jsonLength = jsonData.length;

        // const worksheet = workbook.Sheets[workbook.SheetNames[0]];

            const order_head = [];
            const order_body = [];
            const addonDataExport = [];
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
             if((Number(`${year}${month}${day}`) <= 24331 && Number(`${year}${month}${day}`) >= 24101) || (Number(`${year}${month}${day}`) <= 25331 && Number(`${year}${month}${day}`) >= 25101)) {
               year = year-1;
             }
             
              if(month==10){
                month ='O';
              }else if (month ==11){
                month ='N';
              }else if(month ==12){
                month='D';
              }
              if(seriesType){
              if(seriesType ==='D'){
              return `${year}${month}${day}`;
              } else if(seriesType ==='Y'){
                return `${year}Y`;
              }
            }
          };
        
        
   
          

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

          const staxCode = async(tran_gst_type) => {
            try {
              const response = await fetch(`/api/stax/:${tran_gst_type}`);
              const data = await response.json();
               const  stax_code = data.data.stax_code;
             return stax_code;
            } catch (error) {
              console.log(error);
          }
          }


    



        const gst_basic_rate_qty = (item_rate, qty, gst_rate) => {
           const gst_value = (qty*item_rate) * (gst_rate/100);
           return gst_value;
        }
        const processDrAmt = async(index, vrno) =>{
          let gross_val =0;
          for (let k = index; k < jsonData.length; k++) {
            if(jsonData[k].Voucher_Number === vrno){
              gross_val +=(jsonData[k].Quantity_Balance * jsonData[k].Rate_GST_exclusive)+  gst_basic_rate_qty(jsonData[k].Rate_GST_exclusive, jsonData[k].Quantity_Balance, jsonData[k].GST_Rate);
            
            }else if(jsonData[k].Voucher_Number !== vrno){
              k=jsonData.length; 
              // return;
            }
          }
          return gross_val;
        }
          
          setTotal_rows(jsonData.length);

                for (let index = 0; index < jsonData.length; index++) {
                  let indexTwo = index;
                  setRow_process(++indexTwo);
                    const row = jsonData[index];
                   
                    if(index>0){
                       const row1= jsonData[index-1]; 
                        indent_number_last=row1.Voucher_Number;
                    }
                    if(row.Voucher_Number !== indent_number_last){
                       
                        setHead(true);
                    vrno = await vrnoNumber('',row.Voucher_Date);
                      let l=jsonData.length;
                      console.log(tranType);
                    if(vrno){

                        
                                order_head.push({ 
                                    'row num': ++headVrSeq,
                                    'ENTITY_CODE' : entity_code,
                                    'TCODE' : 'E',
                                    'VRNO' : vrno,
                                    'AMENDNO' : 0,
                                    'VRDATE' : await dateFormate(row.Voucher_Date),
                                    'AMENDDATE' : await dateFormate(row.Voucher_Date),
                                    'TRANTYPE' : 'SD',
                                    'ACC_CODE' : row.Acc_code_erp,
                                    'SUB_ACC_CODE' : null,
                                    'ADDON_CODE' : addon_code,
                                    'STAX_CODE' : gstType.slice(0,2) === row.Gst_number.slice(0,2)?await staxCode('SGST_CGST'): await staxCode('IGST'),
                                    'ETAX_CODE' : null,
                                    'PAYMENT_MODE' : null,
                                    'PAYMENT_DUE_BASIS' : null,
                                    'PAYMENT_DUEDAYS' : null,
                                    'VALIDUPTO_DATE' : null,
                                    'CONSIGNEE_CODE' : row.Acc_code_erp,
                                    'BROKER_CODE' : row.Broker_code_erp,
                                    'FREIGHT_BASIS' : null,
                                    'TRPT_CODE' : row.Transporter_code_erp,
                                    'FROM_PLACE' : null,
                                    'TO_PLACE' : null,
                                    'TRUCKTYPE' : null,
                                    'VEHICLE_TYPE' : null,
                                    'DELIVERY_TO_SLNO' : row.Acc_address_code_erp,
                                    'DELIVERY_FROM_SLNO' : null,
                                    'BILL_PASS_TYPE' : null,
                                    'CATALOG_FLAG' : null,
                                    'INVOICE_FLAG' : null,
                                    'MANUAL_FLAG' : null,
                                    'CERTIFICATE_FLAG' : null,
                                    'OTHERDOC_FLAG' : null,
                                    'IBR_FLAG' : null,
                                    'FILE_CODE' : null,
                                    'PARTYREFNO' : row.Voucher_Number,
                                    'PARTYREFDATE' : await dateFormate(row.Voucher_Date),
                                    'OLD_VRNO' : null,
                                    'BROKERAGE_BASIS' : null,
                                    'BROKERAGE_RATE' : null,
                                    'CURRENCY_CODE' : 'INR',
                                    'EXCHANGE_RATE' : 1,
                                    'EMP_CODE' : null,
                                    'CONTACT_PERSON' : null,
                                    'CONTACT_DETAIL' : null,
                                    'CONTACT_EMAIL' : null,
                                    'IRFIELD1' : null,
                                    'IRFIELD2' : null,
                                    'IRFIELD3' : null,
                                    'IRFIELD4' : null,
                                    'IRFIELD5' : null,
                                    'IRFIELD6' : null,
                                    'IRFIELD7' : null,
                                    'IRFIELD8' : null,
                                    'IRFIELD9' : null,
                                    'IRFIELD10' : null,
                                    'IRFIELD11' : null,
                                    'IRFIELD12' : null,
                                    'IRFIELD13' : null,
                                    'IRFIELD14' : null,
                                    'IRFIELD15' : null,
                                    'IRFIELD16' : null,
                                    'IRFIELD17' : null,
                                    'IRFIELD18' : null,
                                    'IRFIELD19' : null,
                                    'IRFIELD20' : null,
                                    'CRAMT' : null,
                                    // 'DRAMT' : (row.Quantity_Balance * row.Rate_GST_exclusive)+  gst_basic_rate_qty(row.Rate_GST_exclusive, row.Quantity_Balance, row.GST_Rate),
                                    'DRAMT'    : await processDrAmt(index,row.Voucher_Number),
                                    'VALRECD' : null,
                                    'VALISSUED' : (row.Quantity_Balance * row.Rate_GST_exclusive),
                                    // 'AFCODE2' :  AFCODE2,
                                    // 'AFCODE3' : AFCODE3,
                                    // 'AFCODE4' : AFCODE4,
                                    // 'AFCODE5' : AFCODE5,
                                    // 'AFCODE6' : AFCODE6,
                                    // 'AFCODE7' : AFCODE7,
                                    // 'AFCODE8' : AFCODE8,
                                    // 'AFCODE9' : AFCODE9,
                                    // 'AFCODE10' : AFCODE10,
                                    // 'AFCODE11' : AFCODE11,
                                    // 'AFCODE12' : AFCODE12,
                                    // 'AFCODE13' : AFCODE13,
                                    // 'AFCODE14' : AFCODE14,
                                    // 'AFCODE15' : AFCODE15,
                                    'AFCODE2' :  addonData.AFCODE2,
                                    'AFCODE3' :  addonData.AFCODE3,
                                    'AFCODE4' :  addonData.AFCODE4,
                                    'AFCODE5' :  addonData.AFCODE5,
                                    'AFCODE6' :  addonData.AFCODE6,
                                    'AFCODE7' :  addonData.AFCODE7,
                                    'AFCODE8' :  addonData.AFCODE8,
                                    'AFCODE9' :  addonData.AFCODE9,
                                    'AFCODE10' :  addonData.AFCODE10,
                                    'AFCODE11' :  addonData.AFCODE11,
                                    'AFCODE12' :  addonData.AFCODE12,
                                    'AFCODE13' :  addonData.AFCODE13,
                                    'AFCODE14' :  addonData.AFCODE14,
                                    'AFCODE15' :  addonData.AFCODE15,

                                    'AFCODE16' : null,
                                    'AFCODE17' : null,
                                    'AFCODE18' : null,
                                    'AFRATE2' : null,
                                    'AFRATE3' : null,
                                    'AFRATE4' : null,
                                    'AFRATE5' : null,
                                    'AFRATE6' : null,
                                    'AFRATE7' : null,
                                    'AFRATE8' : null,
                                    'AFRATE9' : null,
                                    'AFRATE10' : null,
                                    'AFRATE11' : null,
                                    'AFRATE12' : null,
                                    'AFRATE13' : null,
                                    'AFRATE14' : null,
                                    'AFRATE15' : null,
                                    'AFRATE16' : null,
                                    'AFRATE17' : null,
                                    'AFRATE18' : null,
                                    // 'AFRATEI2' : AFRATEI2,
                                    // 'AFRATEI3' : AFRATEI2,
                                    // 'AFRATEI4' : AFRATEI3,
                                    // 'AFRATEI5' : AFRATEI4,
                                    // 'AFRATEI6' : AFRATEI5,
                                    // 'AFRATEI7' : AFRATEI6,
                                    // 'AFRATEI8' : AFRATEI7,
                                    // 'AFRATEI9' : AFRATEI8,
                                    // 'AFRATEI10' : AFRATEI9,
                                    // 'AFRATEI11' : AFRATEI10,
                                    // 'AFRATEI12' : AFRATEI12,
                                    // 'AFRATEI13' : AFRATEI13,
                                    // 'AFRATEI14' : AFRATEI14,
                                    // 'AFRATEI15' : AFRATEI15,
                                    'AFRATEI2' :  addonData.AFRATEI2,
                                    'AFRATEI3' :  addonData.AFRATEI3,
                                    'AFRATEI4' :  addonData.AFRATEI4,
                                    'AFRATEI5' :  addonData.AFRATEI5,
                                    'AFRATEI6' :  addonData.AFRATEI6,
                                    'AFRATEI7' :  addonData.AFRATEI7,
                                    'AFRATEI8' :  addonData.AFRATEI8,
                                    'AFRATEI9' :  addonData.AFRATEI9,
                                    'AFRATEI10' :  addonData.AFRATEI10,
                                    'AFRATEI11' :  addonData.AFRATEI11,
                                    'AFRATEI12' :  addonData.AFRATEI12,
                                    'AFRATEI13' :  addonData.AFRATEI13,
                                    'AFRATEI14' :  addonData.AFRATEI14,
                                    'AFRATEI15' :  addonData.AFRATEI15,

                                    'AFRATEI16' : null,
                                    'AFRATEI17' : null,
                                    'AFRATEI18' : null,
                                    'PARTY_ACK_REQ_FLAG' : null,
                                    'PARTY_ACK_REFNO' : null,
                                    'PARTY_ACK_DATE' : null,
                                    'AMEND_REMARK' : null,
                                    'AMENDBY' : null,
                                    'AMENDBYDATE' : null,
                                    'CLOSED_REMARK' : null,
                                    'CLOSEDBY' : null,
                                    'CLOSEDDATE' : null,
                                    'APPROVEDBY' : null,
                                    'APPROVEDDATE' : null,
                                    'LASTUPDATE' : null,
                                    'USER_CODE' : null,
                                    'FLAG' : null,
                                    // 'AFLOGIC2' : AFLOGIC2,
                                    // 'AFLOGIC3' : AFLOGIC3,
                                    // 'AFLOGIC4' : AFLOGIC4,
                                    // 'AFLOGIC5' : AFLOGIC5,
                                    // 'AFLOGIC6' : AFLOGIC6,
                                    // 'AFLOGIC7' : AFLOGIC7,
                                    // 'AFLOGIC8' : AFLOGIC8,
                                    // 'AFLOGIC9' : AFLOGIC9,
                                    // 'AFLOGIC10' : AFLOGIC10,
                                    // 'AFLOGIC11' : AFLOGIC11,
                                    // 'AFLOGIC12' : AFLOGIC12,
                                    // 'AFLOGIC13' : AFLOGIC13,
                                    // 'AFLOGIC14' : AFLOGIC14,
                                    // 'AFLOGIC15' : AFLOGIC15,
                                    // 'AFLOGIC16' : AFLOGIC16,
                                    // 'AFLOGIC17' : AFLOGIC17,
                                    // 'AFLOGIC18' : AFLOGIC18,
                                    'AFLOGIC2' :  addonData.AFLOGIC2,
                                    'AFLOGIC3' :  addonData.AFLOGIC3,
                                    'AFLOGIC4' :  addonData.AFLOGIC4,
                                    'AFLOGIC5' :  addonData.AFLOGIC5,
                                    'AFLOGIC6' :  addonData.AFLOGIC6,
                                    'AFLOGIC7' :  addonData.AFLOGIC7,
                                    'AFLOGIC8' :  addonData.AFLOGIC8,
                                    'AFLOGIC9' :  addonData.AFLOGIC9,
                                    'AFLOGIC10' :  addonData.AFLOGIC10,
                                    'AFLOGIC11' :  addonData.AFLOGIC11,
                                    'AFLOGIC12' :  addonData.AFLOGIC12,
                                    'AFLOGIC13' :  addonData.AFLOGIC13,
                                    'AFLOGIC14' :  addonData.AFLOGIC14,
                                    'AFLOGIC15' :  addonData.AFLOGIC15,
                                    'AFLOGIC16' :  addonData.AFLOGIC16,
                                    'AFLOGIC17' :  addonData.AFLOGIC17,
                                    'AFLOGIC18' :  addonData.AFLOGIC18,

                                    'APP_REMARK' : null,
                                    'QC_CALC_TYPE' : null,
                                    'CLOSED_FLAG' : null,
                                    'ENTRY_REMARK' : null,
                                    'FREIGHT_RATE' : null,
                                    'CONSIGNEE_ADDRESS_SLNO' : null,
                                    'CREATEDBY' : 'ADMIN',
                                    'CREATEDDATE' : await dateFormate(row.Voucher_Date),
                                    'HEAD_TRAN_SEQ' : null,
                                    'OTHER_ITEM_CODE' : null,
                                    'LIFTER_CODE' : null,
                                    'LIFTER_ADDRESS_SLNO' : null,

                                    
                                    
                              });
                            }
                            // setValueIssued(0)
                        }
                        if(vrno){
                                order_body.push({
                                  'row num': row_process,
                                  'ENTITY_CODE' : entity_code,
                                  'TCODE' : 'E',
                                  'VRNO' : vrno,
                                  'AMENDNO' : 0,
                                  'AMENDDATE' : await dateFormate(row.Voucher_Date),
                                    'SLNO' : 1,
                                    'DIV_CODE' : div_code,
                                    'ITEM_CODE' : row.Item_code_erp,
                                    'REMARK' : null,
                                    'UM' : row.Unit_code_erp,
                                    'QTYORDER' : row.Quantity_Balance,
                                    'QTYCANCELLED' : null,
                                    'QTYPERMIT' : null,
                                    'TOLERANCE_BASIS' : null,
                                    'TOLERANCE_QTY' : null,
                                    'AUM' : row.Unit_code_erp,
                                    'AQTYORDER' : row.Quantity_Balance,
                                    'RATE_UM' : row.Unit_code_erp,
                                    'RATE' : row.Rate_GST_exclusive,
                                    'ARATE' : row.Rate_GST_exclusive,
                                    'FC_RATE' : row.Rate_GST_exclusive,
                                    'AUMTOUM' : 1,
                                    'IRATE' : null,
                                    'IRATEI' : null,
                                    'TAX_RATE' : gstType.slice(0,2) === row.Gst_number.slice(0,2)? parseFloat(row.GST_Rate)/2 :'',
                                    'TAX_AMOUNT' : gstType.slice(0,2) === row.Gst_number.slice(0,2)?gst_basic_rate_qty(row.Rate_GST_exclusive, row.Quantity_Balance, row.GST_Rate)/2 :'',
                                    'TAX_ONAMOUNT' : (row.Quantity_Balance * row.Rate_GST_exclusive),
                                    'CRAMT' : null,
                                    'DRAMT' : (row.Quantity_Balance * row.Rate_GST_exclusive)+  gst_basic_rate_qty(row.Rate_GST_exclusive, row.Quantity_Balance, row.GST_Rate),
                                    'VALRECD' : null,
                                    'VALISSUED' : (row.Quantity_Balance * row.Rate_GST_exclusive),
                                    'FROM_DATE' : null,
                                    'TO_DATE' : null,
                                    'DUEDATE' : null,
                                    'MAKE_CODE' : null,
                                    'COST_CODE' : row.Cost_center_erp,
                                    'DEPT_CODE' : row.Department_code_erp,
                                    'AFIELD1' : (row.Quantity_Balance * row.Rate_GST_exclusive),
                                    'AFIELD2' : null,
                                    'AFIELD3' : null,
                                    'AFIELD4' : null,
                                    'AFIELD5' : null,
                                    'AFIELD6' : null,
                                    'AFIELD7' : null,
                                    'AFIELD8' : null,
                                    'AFIELD9' : gstType.slice(0,2) === row.Gst_number.slice(0,2)?gst_basic_rate_qty(row.Rate_GST_exclusive, row.Quantity_Balance, row.GST_Rate)/2 :'',
                                    'AFIELD10' : gstType.slice(0,2) === row.Gst_number.slice(0,2)?gst_basic_rate_qty(row.Rate_GST_exclusive, row.Quantity_Balance, row.GST_Rate)/2 :'',
                                    'AFIELD11' : gstType.slice(0,2) !== row.Gst_number.slice(0,2)?gst_basic_rate_qty(row.Rate_GST_exclusive, row.Quantity_Balance, row.GST_Rate) :'',
                                    'AFIELD12' : null,
                                    'AFIELD13' : null,
                                    'AFIELD14' : null,
                                    'AFIELD15' : null,
                                    'AFIELD16' : null,
                                    'AFIELD17' : null,
                                    'AFIELD18' : null,
                                    'INDENT_TCODE' : null,
                                    'INDENT_VRNO' : null,
                                    'INDENT_SLNO' : null,
                                    'ENQUIRY_TCODE' : null,
                                    'ENQUIRY_VRNO' : null,
                                    'ENQUIRY_SLNO' : null,
                                    'QUOTATION_TCODE' : null,
                                    'QUOTATION_VRNO' : null,
                                    'QUOTATION_SLNO' : null,
                                    'FLAG' : null,
                                    'RATE_BASIS' : null,
                                    'VRDATE' : await dateFormate(row.Voucher_Date),
                                    'REVIEW_FLAG' : null,
                                    'REVIEWBY' : null,
                                    'REVIEWDATE' : null,
                                    'STOCK_TYPE' : row.Stock_type_code,
                                    'CONTRACT_TCODE' : null,
                                    'CONTRACT_VRNO' : null,
                                    'CONTRACT_AMENDNO' : null,
                                    'CONTRACT_SLNO' : null,
                                    'NET_RATE' : null,
                                    'BOM_ID' : null,
                                    'SHIFT_CODE' : null,
                                    'PLANT_CODE' : null,
                                    'GODOWN_CODE' : null,
                                    'BATCHNO' : null,
                                    'UNIT_EXCISE_RATE' : null,
                                    'UNIT_FREIGHT_RATE' : null,
                                    'QUOTATION_AMENDNO' : null,
                                    'INPUT_ITEM_CODE' : null,
                                    'PARTYRATE' : null,
                                    'REVIEW_REMARK' : null,
                                    'CANCELLEDDATE' : null,
                                    'CANCELLED_FLAG' : null,
                                    'CANCELLEDBY' : null,
                                    'RATE_CALC_STR' : null,
                                    'TAX_RATE1' : gstType.slice(0,2) === row.Gst_number.slice(0,2)? row.GST_Rate/2 :row.GST_Rate,
                                    'TAX_AMOUNT1' : gstType.slice(0,2) === row.Gst_number.slice(0,2)? gst_basic_rate_qty(row.Rate_GST_exclusive, row.Quantity_Balance, row.GST_Rate)/2 :gst_basic_rate_qty(row.Rate_GST_exclusive, row.Quantity_Balance, row.GST_Rate),
                                    'TAX_RATE2' : null,
                                    'TAX_AMOUNT2' : null,
                                    'GST_CODE' : row.HSN_code,
                                    'RATEAUMTOUM' : null,
                                    'AQTY2' : null,
                                    'TRAN_SEQ' : null,
                                    'OTHER_ITEM_CODE' : null,
                                });
                        }
                        
                    
                 

                   
            }

          
         
  setTimeout(() => {
    addonDataExport.push({
            ' ' : 1,
            'ADDON_CODE' : addonData.ADDON_CODE,
            'ADDON_NAME' : addonData.ADDON_NAME,
            'FROM_DATE' : addonData.FROM_DATE,
            'TO_DATE' : addonData.TO_DATE,
            'AFCODE2' : addonData.AFCODE2,
            'AFCODE3' : addonData.AFCODE3,
            'AFCODE4' : addonData.AFCODE4,
            'AFCODE5' : addonData.AFCODE5,
            'AFCODE6' : addonData.AFCODE6,
            'AFCODE7' : addonData.AFCODE7,
            'AFCODE8' : addonData.AFCODE8,
            'AFCODE9' : addonData.AFCODE9,
            'AFCODE10' : addonData.AFCODE10,
            'AFCODE11' : addonData.AFCODE11,
            'AFCODE12' : addonData.AFCODE12,
            'AFCODE13' : addonData.AFCODE13,
            'AFCODE14' : addonData.AFCODE14,
            'AFCODE15' : addonData.AFCODE15,
            'AFCODE16' : addonData.AFCODE16,
            'AFCODE17' : addonData.AFCODE17,
            'AFCODE18' : addonData.AFCODE18,
            'AFRATE2' : addonData.AFRATE2,
            'AFRATE3' : addonData.AFRATE3,
            'AFRATE4' : addonData.AFRATE4,
            'AFRATE5' : addonData.AFRATE5,
            'AFRATE6' : addonData.AFRATE6,
            'AFRATE7' : addonData.AFRATE7,
            'AFRATE8' : addonData.AFRATE8,
            'AFRATE9' : addonData.AFRATE9,
            'AFRATE10' : addonData.AFRATE10,
            'AFRATE11' : addonData.AFRATE11,
            'AFRATE12' : addonData.AFRATE12,
            'AFRATE13' : addonData.AFRATE13,
            'AFRATE14' : addonData.AFRATE14,
            'AFRATE15' : addonData.AFRATE15,
            'AFRATE16' : addonData.AFRATE16,
            'AFRATE17' : addonData.AFRATE17,
            'AFRATE18' : addonData.AFRATE18,
            'AFRATEI2' : addonData.AFRATEI2,
            'AFRATEI3' : addonData.AFRATEI3,
            'AFRATEI4' : addonData.AFRATEI4,
            'AFRATEI5' : addonData.AFRATEI5,
            'AFRATEI6' : addonData.AFRATEI6,
            'AFRATEI7' : addonData.AFRATEI7,
            'AFRATEI8' : addonData.AFRATEI8,
            'AFRATEI9' : addonData.AFRATEI9,
            'AFRATEI10' : addonData.AFRATEI10,
            'AFRATEI11' : addonData.AFRATEI11,
            'AFRATEI12' : addonData.AFRATEI12,
            'AFRATEI13' : addonData.AFRATEI13,
            'AFRATEI14' : addonData.AFRATEI14,
            'AFRATEI15' : addonData.AFRATEI15,
            'AFRATEI16' : addonData.AFRATEI16,
            'AFRATEI17' : addonData.AFRATEI17,
            'AFRATEI18' : addonData.AFRATEI18,
            'AFLOGIC2' : addonData.AFLOGIC2,
            'AFLOGIC3' : addonData.AFLOGIC3,
            'AFLOGIC4' : addonData.AFLOGIC4,
            'AFLOGIC5' : addonData.AFLOGIC5,
            'AFLOGIC6' : addonData.AFLOGIC6,
            'AFLOGIC7' : addonData.AFLOGIC7,
            'AFLOGIC8' : addonData.AFLOGIC8,
            'AFLOGIC9' : addonData.AFLOGIC9,
            'AFLOGIC10' : addonData.AFLOGIC10,
            'AFLOGIC11' : addonData.AFLOGIC11,
            'AFLOGIC12' : addonData.AFLOGIC12,
            'AFLOGIC13' : addonData.AFLOGIC13,
            'AFLOGIC14' : addonData.AFLOGIC14,
            'AFLOGIC15' : addonData.AFLOGIC15,
            'AFLOGIC16' : addonData.AFLOGIC16,
            'AFLOGIC17' : addonData.AFLOGIC17,
            'AFLOGIC18' : addonData.AFLOGIC18,
            'AFSYS2' : addonData.AFSYS2,
            'AFSYS3' : addonData.AFSYS3,
            'AFSYS4' : addonData.AFSYS4,
            'AFSYS5' : addonData.AFSYS5,
            'AFSYS6' : addonData.AFSYS6,
            'AFSYS7' : addonData.AFSYS7,
            'AFSYS8' : addonData.AFSYS8,
            'AFSYS9' : addonData.AFSYS9,
            'AFSYS10' : addonData.AFSYS10,
            'AFSYS11' : addonData.AFSYS11,
            'AFSYS12' : addonData.AFSYS12,
            'AFSYS13' : addonData.AFSYS13,
            'AFSYS14' : addonData.AFSYS14,
            'AFSYS15' : addonData.AFSYS15,
            'AFSYS16' : addonData.AFSYS16,
            'AFSYS17' : addonData.AFSYS17,
            'AFSYS18' : addonData.AFSYS18,
            'STAX_CODE' : addonData.STAX_CODE,
            'ETAX_CODE' : addonData.ETAX_CODE,
            'USER_CODE' : addonData.USER_CODE,
            'LASTUPDATE' : addonData.LASTUPDATE,
            'FLAG' : addonData.FLAG,
            'AFACC_CODE2' : addonData.AFACC_CODE2,
            'AFACC_CODE3' : addonData.AFACC_CODE3,
            'AFACC_CODE4' : addonData.AFACC_CODE4,
            'AFACC_CODE5' : addonData.AFACC_CODE5,
            'AFACC_CODE6' : addonData.AFACC_CODE6,
            'AFACC_CODE7' : addonData.AFACC_CODE7,
            'AFACC_CODE8' : addonData.AFACC_CODE8,
            'AFACC_CODE9' : addonData.AFACC_CODE9,
            'AFACC_CODE10' : addonData.AFACC_CODE10,
            'AFACC_CODE11' : addonData.AFACC_CODE11,
            'AFACC_CODE12' : addonData.AFACC_CODE12,
            'AFACC_CODE13' : addonData.AFACC_CODE13,
            'AFACC_CODE14' : addonData.AFACC_CODE14,
            'AFACC_CODE15' : addonData.AFACC_CODE15,
            'AFACC_CODE16' : addonData.AFACC_CODE16,
            'AFACC_CODE17' : addonData.AFACC_CODE17,
            'AFACC_CODE18' : addonData.AFACC_CODE18,

    });
 
    const newWorksheeta = XLSX.utils.json_to_sheet(order_head);
    const newWorkbooka = XLSX.utils.book_new();
    if(newWorkbooka){    
    XLSX.utils.book_append_sheet(newWorkbooka, newWorksheeta, 'order_head');

    // Create sheet 2
    const worksheet2 = XLSX.utils.json_to_sheet(order_body);
    XLSX.utils.book_append_sheet(newWorkbooka, worksheet2, 'order_body');
    
    const worksheet3 = XLSX.utils.json_to_sheet(addonDataExport);
    XLSX.utils.book_append_sheet(newWorkbooka, worksheet3, 'Addon');


    // Write the new workbook to a file
    XLSX.writeFile(newWorkbooka, `${tranType.toUpperCase()}_REGISTER_ERP_FORMAT.xlsx`);
    alert(`Data proccessing is done`);
    setDiv_code('');
    setDiv_name('');
    setEntity_code('');
    setEntity_name('');
    setSeries_code('');
    setSeries_name('');
    setTranType('');
    setAddon_code('');
    setAddon_name('');
    setIsFormTrue(false);
    }
  }, 1000);
  }

    reader.readAsArrayBuffer(file);

  }



  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`The name you entered was: ${entity_code} - ${entity_name}`);
    setIsFormTrue(true);
  }
const handleTranTypeChange = (event) => {
  setTranType(event.target.value);
}
const handleInputClick = () => {
  // navigate('/search-table/:division')
  setSlugValue('division');
  setIsTableOpen(true);
}
const handleEntityClick = () => {
  // navigate('/search-table/:division')
  setSlugValue('entity');
  setIsTableOpen(true);
}
const handleSeriesClick = () => {
  // navigate('/search-table/:division')
  setSlugValue('series' );
  setIsTableOpen(true);
}
const handleAddonClick = () => {
  // navigate('/search-table/:division')
  setSlugValue('addon' );
  setIsTableOpen(true);
}
const handleBatchnoClick =()=>{
  setSlugValue('qrtag');
  setIsTableOpen(true);
}

const handleTable=(e)=>{
  setIsTableOpen(false);
}
const handleChange = (selectedOption) => {
  setDivision(selectedOption.value);
}


useEffect(()=>{
  if(slugValue ==='division'){
    todos.map((todo)=>{
      setDiv_code(todo.text.id);
      setDiv_name(todo.text.name);
      dispatch(removeTodo(todo.id));
    });
  } 
  else if(slugValue ==='entity'){
    todos.map((todo)=>{
      setEntity_code(todo.text.id);
      setEntity_name(todo.text.name);
      dispatch(removeTodo(todo.id));
    });
  }  else if(slugValue ==='series'){
    todos.map((todo)=>{
      setSeries_code(todo.text.id);
      setSeries_name(todo.text.name);
      dispatch(removeTodo(todo.id));
    });
  } else if(slugValue ==='addon'){
    todos.map((todo)=>{
      setAddon_code(todo.text.id);
      setAddon_name(todo.text.name);
      dispatch(removeTodo(todo.id));
    });
  }

},[todos]);

useEffect( () =>{
  async function fetchData(){
    if(series_code){
      axios.get(`/api/series/:${series_code}`)
      .then((response) => {
        setTranType(response.data.data.tran_type);    
        setSeriesType(response.data.data.series_type);  
      })
      .catch((error) => {
        console.log(error);
      })
    }else if(entity_code){
     await axios.get(`/api/entity/:${entity_code}`)
      .then((response) => {
        // setGstType(response.data.data.gst_code); 
        setGstType(response.data.data.state_code); 
        console.log(response.data.data.state_code);
      })
      .catch((error) => {
        console.log(error);
      });
    }else if(addon_code){
      await axios.get(`/api/addon/:${addon_code}`)
      .then((response) => {
        setAddonData(response.data.data);
        
        // setAFCODE2(response.data.data.AFCODE2);
        // setAFCODE3(response.data.data.AFCODE3);
        // setAFCODE4(response.data.data.AFCODE4);
        // setAFCODE5(response.data.data.AFCODE5);
        // setAFCODE6(response.data.data.AFCODE6);
        // setAFCODE7(response.data.data.AFCODE7);
        // setAFCODE8(response.data.data.AFCODE8);
        // setAFCODE9(response.data.data.AFCODE9);
        // setAFCODE10(response.data.data.AFCODE10);
        // setAFCODE11(response.data.data.AFCODE11);
        // setAFCODE12(response.data.data.AFCODE12);
        // setAFCODE13(response.data.data.AFCODE13);
        // setAFCODE14(response.data.data.AFCODE14);
        // setAFCODE15(response.data.data.AFCODE15);
  
        // setAFRATEI2(response.data.data.AFRATEI2);
        // setAFRATEI3(response.data.data.AFRATEI3);
        // setAFRATEI4(response.data.data.AFRATEI4);
        // setAFRATEI5(response.data.data.AFRATEI5);
        // setAFRATEI6(response.data.data.AFRATEI6);
        // setAFRATEI7(response.data.data.AFRATEI7);
        // setAFRATEI8(response.data.data.AFRATEI8);
        // setAFRATEI9(response.data.data.AFRATEI9);
        // setAFRATEI10(response.data.data.AFRATEI10);
        // setAFRATEI11(response.data.data.AFRATEI11);
        // setAFRATEI12(response.data.data.AFRATEI12);
        // setAFRATEI13(response.data.data.AFRATEI13);
        // setAFRATEI14(response.data.data.AFRATEI14);
        // setAFRATEI15(response.data.data.AFRATEI15);
  
        // setAFLOGIC2(response.data.data.AFLOGIC2);
        // setAFLOGIC3(response.data.data.AFLOGIC3);
        // setAFLOGIC4(response.data.data.AFLOGIC4);
        // setAFLOGIC5(response.data.data.AFLOGIC5);
        // setAFLOGIC6(response.data.data.AFLOGIC6);
        // setAFLOGIC7(response.data.data.AFLOGIC7);
        // setAFLOGIC8(response.data.data.AFLOGIC8);
        // setAFLOGIC9(response.data.data.AFLOGIC9);
        // setAFLOGIC10(response.data.data.AFLOGIC10);
        // setAFLOGIC11(response.data.data.AFLOGIC11);
        // setAFLOGIC12(response.data.data.AFLOGIC12);
        // setAFLOGIC13(response.data.data.AFLOGIC13);
        // setAFLOGIC14(response.data.data.AFLOGIC14);
        // setAFLOGIC15(response.data.data.AFLOGIC15);
        // setAFLOGIC16(response.data.data.AFLOGIC16);
        // setAFLOGIC17(response.data.data.AFLOGIC17);
        // setAFLOGIC18(response.data.data.AFLOGIC18);
  
  
      
        // setSeriesType(response.data.data.gst_code); 
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }
  fetchData();
  
},[series_code, entity_code, addon_code]);


  const filters = {
    entity_code: entity_code,
    div_code: div_code,
    series_code: series_code,
      }


  return (
    // <div>
    // {isFormTrue &&
    //     <div className="flex justify-center items-center h-screen">
    //      <div className="flex flex-col items-center">
    //       <div className="flex space-x-2">
    //         <div className="loader-dot bg-blue-500 rounded-full h-3 w-3 animate-bounce"></div>
    //         <div className="loader-dot bg-blue-500 rounded-full h-3 w-3 animate-bounce"></div>
    //         <div className="loader-dot bg-blue-500 rounded-full h-3 w-3 animate-bounce"></div>
    //       </div>
    //       <div className=" text-white text-xl mt-2">{`Total ${row_process} rows processed of ${total_rows} rows`}</div>
    //       <div className=" text-white text-xl mt-2">Please wait...</div>
    //       </div>
    //          </div>}
    //  {!isFormTrue &&

    //      <div>
    //       {isTableOpen &&
    //       <div>
    //         <SearchableTable 
    //         onClick={handleTable}
    //         slugValue={slugValue}
    //         filters={filters}/>
    //       </div>
    //         }
    //         {!isTableOpen &&
    //         <>
    //            <div className=" m-2 min-h-[100px] rounded shadow-xl sm:col-span-4 bg-slate-300  justify-center items-center">

    //       <form onSubmit={handleSubmit} className="mr-1">
    //       <div className=" flex">
    //             <div className=" w-5/12 sm:w-3/12 ">
    //           <Input
    //               label ='Addon'
    //               value={addon_code}
    //               onClick={handleAddonClick}
    //               onChange={handleChange}
    //               required
    //           />
    //           </div>
    //           <div className="w-7/12 sm:w-9/12">
    //           <Input
    //           value={addon_name}
    //           onClick={handleAddonClick}
    //           onChange={handleChange}
              
    //           />
    //           </div>
    //           </div>

    //         <div className=" flex">
    //           <div className="  w-5/12 sm:w-3/12 ">
    //             <Input
    //                 label ='Entity'
    //                 value={entity_code}
    //                 onClick={handleEntityClick}
    //                 onChange={handleChange}
    //                 required
    //             />
    //            </div>
    //           <div className=" w-7/12 sm:w-9/12">
    //               <Input
    //                 value={entity_name}
    //                 onClick={handleEntityClick}
    //                 onChange={handleChange}
                    
    //               />
    //           </div>
    //           </div>
    //             <div className=" flex">
    //             <div className="  w-5/12 sm:w-3/12 ">
    //           <Input
    //               label ='Division'
    //               value={div_code}
    //               onClick={handleInputClick}
    //               onChange={handleChange}
    //               required
    //           />
    //           </div>
    //           <div className=" w-7/12 sm:w-9/12">
    //           <Input
    //           value={div_name}
    //           onClick={handleInputClick}
    //           onChange={handleChange}
    //           />
    //           </div>
    //           </div>
    //           <div className=" flex">
    //             <div className="  w-5/12 sm:w-3/12 ">
    //           <Input 
    //               label ='Series'
    //               value={series_code}
    //               onClick={handleSeriesClick}
    //               onChange={handleChange}
    //               required
    //           />
    //           </div>
    //           <div className=" w-7/12 sm:w-9/12">
    //           <Input
    //           value={series_name}
    //           onClick={handleSeriesClick}
    //           onChange={handleChange}
              
    //           />
    //           </div>
    //           </div>
        



    //           <div className="w-full flex mt-2 mb-1">
    //                 <label className=" w-64">
    //                 Tran Type
    //                 </label>
    //                     <select
    //                     value={tranType}
    //                     className={`px-3 py-1 bg-blue-200 text-black outline-blue-500 focus:bg-gray-50 duration-200 border border-blue-400 w-full`}
    //                     onChange={handleTranTypeChange}
    //                     required
    //                     >
    //                     <option></option>
    //                     <option>Sales Contract</option>
    //                     {/* <option>Receipt</option>
    //                     <option>Journal</option>
    //                     <option>Purchase</option>
    //                     <option>Sales</option>
    //                     <option>Cash</option> */}
                       
    //                     </select>
    //                 </div>

    //             <div className="flex">
    //              <div className="w-6/12">
    //             <input type="file" accept=".xlsx" onChange={handleFileChange} />
    //             </div>
    //             <div className="w-6/12 flex justify-end">
    //             <Button className="ml-5" children='Process' onClick={processData}/>
 
    //             </div>
    //             </div>
    //             <div className="flex">File must be in .CSV</div>
               
              
                      
    //         </form >
                
    //                 {/* <Button className="float-right ml-5 mr-5" children='Download Formate' onClick={csvFormate}/>
    //                 <Button
    //                 children='Exit'
    //                 className="float-right ml-5 mr-5 px-10 text-lg"
    //                 onClick={() => navigate(-1)}
    //                 /> */}
    //                     <div className="flex justify-end">
    //                   <Button className="ml-5 mb-5 " children='Download Format' onClick={csvFormate} />
    //                   <Button className="ml-5 mb-5 px-6 text-lg" children='Exit' onClick={() => navigate(-1)} />
    //                 </div>
    //                 </div>
    //               </>      
    //                     }
    //                      </div>
    //                   }
    // </div>
    <div>
      <h1>hello</h1>
    </div>
  );
}

export default Order;
