
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import Button from '../../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import SearchableTable from '../../selectComponents/SearchableTable';
import { removeTodo } from '../../features/todo/todoSlice';
import Input from '../../components/Input';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ProductionImport() {
  let headVrSeq=0;
  const navigate = useNavigate()
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
            'VOUCHER_NO' : null,
            'VOUCHER_DATE' : null,
            'FG_ITEM_CODE' : null,
            'FG_QTY_RECD' : null,
            'FG_UM_CODE' : null,
            'FG_AQTYRECD' : null,
            'FG_AUM_CODE' : null,
            'FG_BATCH_NUMBER' : null,
            'FG_REF_NUMBER' : null,
            'FG_GODOWN_CODE' : null,
            'RM_ITEM_CODE' : null,
            'RM_QTY_RECD' : null,
            'RM_UM_CODE' : null,
            'RM_AQTYRECD' : null,
            'RM_AUM_CODE' : null,
            'RM_BATCH_NUMBER' : null,
            'RM_REF_NUMBER' : null,
            'RM_GODOWN_CODE' : null,
            'STORE_ITEM_CODE' : null,
            'STORE_QTY_RECD' : null,
            'STORE_UM_CODE' : null,
            'STORE_AQTYRECD' : null,
            'STORE_AUM_CODE' : null,
            'STORE_BATCH_NUMBER' : null,
            'STORE_REF_NUMBER' : null,
            'STORE_GODOWN_CODE' : null,
            
                      
          
        });
        csvFormateData.push({
          
        })
        const newWorksheeta = XLSX.utils.json_to_sheet(csvFormateData);
    const newWorkbooka = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbooka, newWorksheeta, 'Sheet1');

    // Write the new workbook to a file
    XLSX.writeFile(newWorkbooka, 'Prod_Import_Format.xlsx');

    alert(`Production Import to Erp template downloaded`);
   
    
   
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

        let jsonLength = jsonData.length;

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

            const itemtran_head = [];
            const itemtran_body = [];
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
                month ='O'
              }else if (month ==11){
                month ='N'
              }else if(month ==12){
                month='D'
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

          const staxCode = async(tran_gst_type) => {
            try {
              const response = await fetch(`/api/stax/:${tran_gst_type}`);
              const data = await response.json();
               const  stax_code = data.data.stax_code;
             return stax_code
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
              gross_val +=(jsonData[k].Quantity_Balance * jsonData[k].Rate_GST_exclusive)+  gst_basic_rate_qty(jsonData[k].Rate_GST_exclusive, jsonData[k].Quantity_Balance, jsonData[k].GST_Rate)
            
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
                    vrno = await vrnoNumber('',row.Voucher_Date)
                      let l=jsonData.length
                    if(vrno){

                        
                                itemtran_head.push({ 
                                    'ENTITY_CODE' : null,
                                    'TCODE' : null,
                                    'VRNO' : null,
                                    'TRANTYPE' : null,
                                    'VRDATE' : null,
                                    'ACC_CODE' : null,
                                    'SUB_ACC_CODE' : null,
                                    'BROKER_CODE' : null,
                                    'CONSIGNEE_CODE' : null,
                                    'ADDON_CODE' : null,
                                    'STAX_CODE' : null,
                                    'ETAX_CODE' : null,
                                    'PARTYBILLNO' : null,
                                    'PARTYBILLAMT' : null,
                                    'PARTYBILLDATE' : null,
                                    'CHALLANNO' : null,
                                    'CHALLANDATE' : null,
                                    'FREIGHT_BASIS' : null,
                                    'FREIGHT_RATE' : null,
                                    'FREIGHT_ADV' : null,
                                    'FREIGHT_AMT' : null,
                                    'FREIGHT_CREDIT' : null,
                                    'TRPT_CODE' : null,
                                    'TRUCKTYPE' : null,
                                    'VEHICLE_TYPE' : null,
                                    'TRUCKNO' : null,
                                    'LRNO' : null,
                                    'LRDATE' : null,
                                    'RAKENO' : null,
                                    'FROM_PLACE' : null,
                                    'TO_PLACE' : null,
                                    'LIFTER_CODE' : null,
                                    'CRAMT' : null,
                                    'DRAMT' : null,
                                    'VALRECD' : null,
                                    'VALISSUED' : null,
                                    'DUEDATE' : null,
                                    'APP_REMARK' : null,
                                    'APPROVEDBY' : null,
                                    'APPROVEDDATE' : null,
                                    'VALUATIONBY' : null,
                                    'VALUATIONDATE' : null,
                                    'TOKENNO' : null,
                                    'TOKENDATE' : null,
                                    'ACC_VRNO' : null,
                                    'ACC_SLNO' : null,
                                    'ACC_TCODE' : null,
                                    'OLD_VRNO' : null,
                                    'CATALOG_FLAG' : null,
                                    'INVOICE_FLAG' : null,
                                    'MANUAL_FLAG' : null,
                                    'CERTIFICATE_FLAG' : null,
                                    'OTHERDOC_FLAG' : null,
                                    'IBR_FLAG' : null,
                                    'CURRENCY_CODE' : null,
                                    'EXCHANGE_RATE' : null,
                                    'BROKERAGE_BASIS' : null,
                                    'BROKERAGE_RATE' : null,
                                    'PAYMENT_DUEDATE' : null,
                                    'WSLIPNO' : null,
                                    'GATE_TCODE' : null,
                                    'GATE_VRNO' : null,
                                    'WAYBILL_FORM_INITIAL' : null,
                                    'WAYBILLNO' : null,
                                    'GROSSWT' : null,
                                    'TEARWT' : null,
                                    'NETWT' : null,
                                    'BAGWT' : null,
                                    'BAGS' : null,
                                    'GATETIME' : null,
                                    'INTIME' : null,
                                    'OUTTIME' : null,
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
                                    'AFCODE2' : null,
                                    'AFCODE3' : null,
                                    'AFCODE4' : null,
                                    'AFCODE5' : null,
                                    'AFCODE6' : null,
                                    'AFCODE7' : null,
                                    'AFCODE8' : null,
                                    'AFCODE9' : null,
                                    'AFCODE10' : null,
                                    'AFCODE11' : null,
                                    'AFCODE12' : null,
                                    'AFCODE13' : null,
                                    'AFCODE14' : null,
                                    'AFCODE15' : null,
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
                                    'AFRATEI2' : null,
                                    'AFRATEI3' : null,
                                    'AFRATEI4' : null,
                                    'AFRATEI5' : null,
                                    'AFRATEI6' : null,
                                    'AFRATEI7' : null,
                                    'AFRATEI8' : null,
                                    'AFRATEI9' : null,
                                    'AFRATEI10' : null,
                                    'AFRATEI11' : null,
                                    'AFRATEI12' : null,
                                    'AFRATEI13' : null,
                                    'AFRATEI14' : null,
                                    'AFRATEI15' : null,
                                    'AFRATEI16' : null,
                                    'AFRATEI17' : null,
                                    'AFRATEI18' : null,
                                    'LASTUPDATE' : null,
                                    'USER_CODE' : null,
                                    'FLAG' : null,
                                    'AFLOGIC2' : null,
                                    'AFLOGIC3' : null,
                                    'AFLOGIC4' : null,
                                    'AFLOGIC5' : null,
                                    'AFLOGIC6' : null,
                                    'AFLOGIC7' : null,
                                    'AFLOGIC8' : null,
                                    'AFLOGIC9' : null,
                                    'AFLOGIC10' : null,
                                    'AFLOGIC11' : null,
                                    'AFLOGIC12' : null,
                                    'AFLOGIC13' : null,
                                    'AFLOGIC14' : null,
                                    'AFLOGIC15' : null,
                                    'AFLOGIC16' : null,
                                    'AFLOGIC17' : null,
                                    'AFLOGIC18' : null,
                                    'DELIVERY_TO_SLNO' : null,
                                    'DELIVERY_FROM_SLNO' : null,
                                    'BILL_PASS_TYPE' : null,
                                    'SHIFT_CODE' : null,
                                    'BOM_ID' : null,
                                    'CNTR_CODE' : null,
                                    'ARE_TCODE' : null,
                                    'ARE_VRNO' : null,
                                    'ARE_NO' : null,
                                    'ARE_DATE' : null,
                                    'FREIGHT_ORDER_TCODE' : null,
                                    'FREIGHT_ORDER_VRNO' : null,
                                    'FREIGHT_ORDER_SLNO' : null,
                                    'CT_TCODE' : null,
                                    'CT_VRNO' : null,
                                    'EMP_CODE' : null,
                                    'TP_BOOK_NO' : null,
                                    'TP_PAGE_NO' : null,
                                    'LC_TCODE' : null,
                                    'LC_VRNO' : null,
                                    'CONSIGNEE_ADDRESS_SLNO' : null,
                                    'WAYBILL_DATE' : null,
                                    'CREATEDBY' : null,
                                    'CREATEDDATE' : null,
                                    'HEAD_TRAN_SEQ' : null,
                                    'FREIGHT_ORDER_AMENDNO' : null,

                                    
                              });
                            }
                            // setValueIssued(0)
                        }
                        if(vrno){
                                itemtran_body.push({
                                    'ENTITY_CODE' : null,
                                    'TCODE' : null,
                                    'VRNO' : null,
                                    'SLNO' : null,
                                    'VRDATE' : null,
                                    'DIV_CODE' : null,
                                    'ITEM_CODE' : null,
                                    'UM' : null,
                                    'OTHER_DIV_CODE' : null,
                                    'COST_CODE' : null,
                                    'DEPT_CODE' : null,
                                    'PLANT_CODE' : null,
                                    'EQPT_CODE' : null,
                                    'MAKE_CODE' : null,
                                    'REMARK' : null,
                                    'STOCK_TYPE' : null,
                                    'GODOWN_CODE' : null,
                                    'BATCHNO' : null,
                                    'REF_SLNO' : null,
                                    'PARTYQTY' : null,
                                    'REACHEDQTY' : null,
                                    'QTYRECD' : null,
                                    'QTYISSUED' : null,
                                    'QTYBILLED' : null,
                                    'QTY1' : null,
                                    'QTY2' : null,
                                    'QTY3' : null,
                                    'QTY4' : null,
                                    'PARTYRATE' : null,
                                    'AUM' : null,
                                    'AQTYRECD' : null,
                                    'AQTYISSUED' : null,
                                    'RATE_UM' : null,
                                    'RATE' : null,
                                    'ARATE' : null,
                                    'FC_RATE' : null,
                                    'AUMTOUM' : null,
                                    'IRATE' : null,
                                    'IRATEI' : null,
                                    'TAX_RATE' : null,
                                    'TAX_AMOUNT' : null,
                                    'TAX_ONAMOUNT' : null,
                                    'PROVRATE' : null,
                                    'CRAMT' : null,
                                    'DRAMT' : null,
                                    'VALRECD' : null,
                                    'VALISSUED' : null,
                                    'AFIELD1' : null,
                                    'AFIELD2' : null,
                                    'AFIELD3' : null,
                                    'AFIELD4' : null,
                                    'AFIELD5' : null,
                                    'AFIELD6' : null,
                                    'AFIELD7' : null,
                                    'AFIELD8' : null,
                                    'AFIELD9' : null,
                                    'AFIELD10' : null,
                                    'AFIELD11' : null,
                                    'AFIELD12' : null,
                                    'AFIELD13' : null,
                                    'AFIELD14' : null,
                                    'AFIELD15' : null,
                                    'AFIELD16' : null,
                                    'AFIELD17' : null,
                                    'AFIELD18' : null,
                                    'INSP_REMARK' : null,
                                    'INSPECTEDBY' : null,
                                    'INSPECTEDDATE' : null,
                                    'NEXT_INSP_REQ_FLAG' : null,
                                    'NEXT_INSPECTEDBY' : null,
                                    'NEXT_INSPECTEDDATE' : null,
                                    'EXPIRY_DATE' : null,
                                    'ORDER_TCODE' : null,
                                    'ORDER_VRNO' : null,
                                    'ORDER_AMENDNO' : null,
                                    'ORDER_SLNO' : null,
                                    'INDENT_TCODE' : null,
                                    'INDENT_VRNO' : null,
                                    'INDENT_SLNO' : null,
                                    'REF1_TCODE' : null,
                                    'REF1_VRNO' : null,
                                    'REF1_SLNO' : null,
                                    'REF2_TCODE' : null,
                                    'REF2_VRNO' : null,
                                    'REF2_SLNO' : null,
                                    'REF3_TCODE' : null,
                                    'REF3_VRNO' : null,
                                    'REF3_SLNO' : null,
                                    'FLAG' : null,
                                    'APARTYQTY' : null,
                                    'VALUATION_DATE' : null,
                                    'INSP_DEPT_CODE' : null,
                                    'AREACHEDQTY' : null,
                                    'WSLIPNO' : null,
                                    'WSLIP_SLNO' : null,
                                    'QC_TCODE' : null,
                                    'QC_VRNO' : null,
                                    'POST_ACC_CODE' : null,
                                    'POST_SUB_ACC_CODE' : null,
                                    'TRANUM' : null,
                                    'OTHER_GODOWN_CODE' : null,
                                    'OTHER_COST_CODE' : null,
                                    'OTHER_ITEM_CODE' : null,
                                    'UNIT_FREIGHT_RATE' : null,
                                    'OTHER_STOCK_TYPE' : null,
                                    'OTHER_DEPT_CODE' : null,
                                    'OTHER_BATCHNO' : null,
                                    'OTHER_REF_SLNO' : null,
                                    'AQTY1' : null,
                                    'AQTY2' : null,
                                    'AQTY3' : null,
                                    'AQTY4' : null,
                                    'REF4_TCODE' : null,
                                    'REF4_VRNO' : null,
                                    'REF4_SLNO' : null,
                                    'REF5_TCODE' : null,
                                    'REF5_VRNO' : null,
                                    'REF5_SLNO' : null,
                                    'REF6_TCODE' : null,
                                    'REF6_VRNO' : null,
                                    'REF6_SLNO' : null,
                                    'TAX_CODE' : null,
                                    'TAX_RATE1' : null,
                                    'TAX_AMOUNT1' : null,
                                    'TAX_RATE2' : null,
                                    'TAX_AMOUNT2' : null,
                                    'GST_CODE' : null,
                                    'TRAN_SEQ' : null,
                                    'OTHER_STR' : null,
                                    'RATEAUMTOUM' : null,
                                    'QTY5' : null,
                                    'QTY6' : null,
                                    
                                })
                        }
                        
                    
                 

                   
            }

          
         
  setTimeout(() => {
   
 
    const newWorksheeta = XLSX.utils.json_to_sheet(itemtran_head);
    const newWorkbooka = XLSX.utils.book_new();
    if(newWorkbooka){    
    XLSX.utils.book_append_sheet(newWorkbooka, newWorksheeta, 'itemtran_head');

    // Create sheet 2
    const worksheet2 = XLSX.utils.json_to_sheet(itemtran_body);
    XLSX.utils.book_append_sheet(newWorkbooka, worksheet2, 'itemtran_body');
   

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
    setAddon_name('');
    setIsFormTrue(false);
    }
  }, 1000);
  }

    reader.readAsArrayBuffer(file);

  };



  const handleSubmit = (event) => {
    event.preventDefault();
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
const handleAddonClick = () => {
  // navigate('/search-table/:division')
  setSlugValue('addon' )
  setIsTableOpen(true);
};
const handleBatchnoClick =()=>{
  setSlugValue('qrtag')
  setIsTableOpen(true);
}

const handleTable=(e)=>{
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
  }  else if(slugValue ==='series'){
    todos.map((todo)=>{
      setSeries_code(todo.text.id)
      setSeries_name(todo.text.name)
      dispatch(removeTodo(todo.id))
    });
  } else if(slugValue ==='addon'){
    todos.map((todo)=>{
      setAddon_code(todo.text.id)
      setAddon_name(todo.text.name)
      dispatch(removeTodo(todo.id))
    });
  }

},[todos])

useEffect( () =>{
  async function fetchData(){
    if(series_code){
      axios.get(`/api/series/:${series_code}`)
      .then((response) => {
        setTranType(response.data.data.tran_type);    
        setSeriesType(response.data.data.series_type);  
      })
      .catch((error) => {
        console.log(error)
      })
    }else if(entity_code){
     await axios.get(`/api/entity/:${entity_code}`)
      .then((response) => {
        setGstType(response.data.data.gst_code); 
      })
      .catch((error) => {
        console.log(error)
      })
    }else if(addon_code){
      await axios.get(`/api/addon/:${addon_code}`)
      .then((response) => {
        setAddonData(response.data.data);
        
      })
      .catch((error) => {
        console.log(error)
      })
    };
  };
  fetchData();
  
},[series_code, entity_code, addon_code])


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
                <div className=" w-5/12 sm:w-3/12 ">
              <Input
                  label ='Addon'
                  value={addon_code}
                  onClick={handleAddonClick}
                  onChange={handleChange}
                  required
              />
              </div>
              <div className="w-7/12 sm:w-9/12">
              <Input
              value={addon_name}
              onClick={handleAddonClick}
              onChange={handleChange}
              
              />
              </div>
              </div>

            <div className=" flex">
              <div className="  w-5/12 sm:w-3/12 ">
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
                <div className="  w-5/12 sm:w-3/12 ">
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
                <div className="  w-5/12 sm:w-3/12 ">
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
                        <option>Sales Contract</option>
                        {/* <option>Receipt</option>
                        <option>Journal</option>
                        <option>Purchase</option>
                        <option>Sales</option>
                        <option>Cash</option> */}
                       
                        </select>
                    </div>

                <div className="flex">
                 <div className="w-6/12">
                <input type="file" accept=".xlsx" onChange={handleFileChange} />
                </div>
                <div className="w-6/12 flex justify-end">
                <Button className="ml-5" children='Process' onClick={processData}/>
 
                </div>
                </div>
                <div className="flex">File must be in .CSV</div>
               
              
                      
            </form >
                
                    {/* <Button className="float-right ml-5 mr-5" children='Download Formate' onClick={csvFormate}/>
                    <Button
                    children='Exit'
                    className="float-right ml-5 mr-5 px-10 text-lg"
                    onClick={() => navigate(-1)}
                    /> */}
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

export default ProductionImport;
