import * as XLSX from 'xlsx';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function AddSplitter(){
    const navigate = useNavigate()
    const [file, setFile] = useState(null);
    let accCodeProcess={};
    const addSplitData = [];
    const csvFormateData =[];
    const [isFormTrue, setIsFormTrue] = useState(false);
    const [row_process, setRow_process] = useState(0);
    const [total_rows, setTotal_rows] = useState(0);

 function   addSplit(add) {
    let result = {};
    if(add){
        if(add.length > 0){
            add= `${add}${' '}`
            const addFifty = add.substring(0,50);

            const lastFiftyIndex = addFifty.lastIndexOf(' ');

            result.add1 = addFifty.substring(0,lastFiftyIndex);
            
            const addFifty2 = add.substring(lastFiftyIndex,100);
            const lastFiftyIndex2 = addFifty2.lastIndexOf(' ');
          
            result.add2 = addFifty2.substring(0,lastFiftyIndex2);
            const addFifty3 = add.substring(lastFiftyIndex+lastFiftyIndex2,150);
            const lastFiftyIndex3 = addFifty3.lastIndexOf(' ');
          
            result.add3 = addFifty3.substring(0,lastFiftyIndex3);

              const addFifty4 = add.substring(lastFiftyIndex+lastFiftyIndex2+lastFiftyIndex3,add.length);
            const lastFiftyIndex4 = addFifty4.lastIndexOf(' ');
          
            result.add4 = addFifty4.substring(0,lastFiftyIndex4);

        }
    }
        return result;
    }

    const  pinNumber = async(pin) =>{
        let result = {};
        const regex = /\b\d{6}\b/g;
        if(pin){
        try {
           
            const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
            const data = await response.json();
            if(data[0].Status==='Success'){
                result.state= data[0].PostOffice[0].State;
                result.district= data[0].PostOffice[0].District;
            }
            
          } catch (error) {
            console.error('Error fetching pincode data:', error);
          }
        }
        
        return result;
        
    }

    function accCode(codeType,accName) {
        let accCodeData = accName.substring(0,15).replace(/[^\w\s]/gi, '').replace(/\s+/g, '').toUpperCase();
        const data =`${codeType}${accCodeData.substring(0,2)}`
        if(accCodeProcess[data]){
            accCodeProcess[data]++;
            let count = accCodeProcess[data] < 10 ? `0${accCodeProcess[data]}` : accCodeProcess[data];
            return `${data}${count}`;
        }else{
            accCodeProcess[data]=1
            return `${codeType}${accCodeData.substring(0,2)}01`
        }
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
      };

    const csvFormate =()=> {
        csvFormateData.push({
            code_type :'Acc code Schedule EX:- C ',
            Particulars : 'Account name Ex:- A M K Bearings India Pvt Ltd',
            Address    :'address Ax:- 85, Netaji Subhash Road, 3rd Floor, Room No. 309, 700001 Kolkata'
        })
        
            const newWorksheeta = XLSX.utils.json_to_sheet(csvFormateData);
            const newWorkbooka = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(newWorkbooka, newWorksheeta, 'Sheet1');

            // Write the new workbook to a file
            XLSX.writeFile(newWorkbooka, 'Address_Split_Format.xlsx');

            alert(`Address split template downloaded`);
    }

     
  const processData =async() => {
    setIsFormTrue(true);
    if (!file) {
      alert("Please select an Excel file.");
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

    setTotal_rows(jsonData.length);
    for (let index = 0; index < jsonData.length; index++) {
        let indexTwo = index;
        setRow_process(++indexTwo);
        const row = jsonData[index];
        const pinCode =parseFloat(row.Address.match(/\b\d{6}\b/g));
        const {district, state} = await pinNumber(row.Address.match(/\b\d{6}\b/g));
        const acc_code = accCode(row.code_type, row.Particulars);
        const { add1, add2, add3, add4 } = addSplit(row.Address);
         addSplitData.push({
            'acc_code': acc_code,
            'acc_name' : row.Particulars,
            'add1' : add1.replace(pinCode?pinCode:'?','').replace(district,'').replace(state,''),
            'add2' : add2.replace(pinCode?pinCode:'?','').replace(district,'').replace(state,''),
            'add3' : add3.replace(pinCode?pinCode:'?','').replace(district,'').replace(state,''),
            'add4' : add4.replace(pinCode?pinCode:'?','').replace(district,'').replace(state,''),
            'pinj'  : pinCode?pinCode:'',
            'district' : district,
            'state_code' : state
                 })
    }
    setTimeout(() => {
 
        const newWorksheeta = XLSX.utils.json_to_sheet(addSplitData);
        const newWorkbooka = XLSX.utils.book_new();
        if(newWorkbooka){    
        XLSX.utils.book_append_sheet(newWorkbooka, newWorksheeta, 'order_head');
    
        // Write the new workbook to a file
        XLSX.writeFile(newWorkbooka, `ACC_ADD_SPLIT.xlsx`);
        alert(`Data proccessing is done`);
        // console.log('excel downloading start');
        setIsFormTrue(false);
        }
      }, 1000);
      }
    
        reader.readAsArrayBuffer(file);

}

    return(
        <>
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
        <div className=" mt-5  m-2 min-h-[100px] rounded shadow-xl sm:col-span-4 bg-slate-300  justify-center items-center">
      

                <div className="flex mr-2">
                 <div className="w-6/12">
                <input type="file" accept=".xlsx" onChange={handleFileChange} />
                </div>
                <div className="w-6/12 flex justify-end">
                <Button className="ml-5" children='Process' onClick={processData}/>
 
                </div>
                </div>
                    <div className="flex justify-end mt-5 mr-2">
                      <Button className="ml-5 mb-5 " children='Download Format' onClick={csvFormate} />
                      <Button className="ml-5 mb-5 px-6 text-lg" children='Exit' onClick={() => navigate(-1)} />
                    </div>
        </div>
     }
        </>
    )
}

export default AddSplitter;