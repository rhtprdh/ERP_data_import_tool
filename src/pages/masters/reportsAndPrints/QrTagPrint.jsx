import React, { useEffect, useState } from 'react';
import qrcode from 'qrcode';
import jsPDF from 'jspdf';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { useNavigate } from 'react-router-dom';
import SearchableTable from '../../../selectComponents/SearchableTable';
import { useSelector, useDispatch } from 'react-redux';
import { removeTodo } from '../../../app/features/todo/todoSlice';

const QrTagPrint = () => {
    const navigate = useNavigate();

    const [division, setDivision] = useState('');
    const [entity, setEntity] = useState('');
    const [batchNumber, setBatchNumber] = useState(null);
    const [fromBatch, setFromBatch] = useState('');
    const [toBatch, setToBatch] = useState('');
    const [data, setData] = useState([]);
    const[div_code, setDiv_code] =useState('');
    const[div_name, setDiv_name] =useState('');
    const[batchno, setBatchno] =useState('');
    const [isTableOpen, setIsTableOpen] = useState(false);
    const [slugValue, setSlugValue] = useState();

    function sleep(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    }

  function generateQRCode1(qr_data) {
    return new Promise((resolve, reject) => {
      qrcode.toDataURL(qr_data, {
        type: 'image/png',
        quietZone: 0,
        version: 4,
      }, (err, base64QRCode) => {
        if (err) {
          reject(err);
        } else {
          resolve(base64QRCode);
        }
      });
    });
  }

  const generatePDF = async (event) => {
    event.preventDefault();
    if(batchno === null){return;} 
    console.log(batchno)

    fetch(`/api/qrtag/:${batchno}`)
  .then((response) => response.json())
  .then(async (data) => {
    // console.log(data)
      if (!Array.isArray(data.data)) {
          console.error('Data fetched from API is not an array');
          return;
        }
          const dataOption =await data.data.map((item) => ({
              label: "This Heading For Division Name",
              data: item.batchno_ref,
              batchno: item.batchno
            }));

    setData(dataOption);
  });

    const doc = new jsPDF('p', 'mm', 'a4');
    let x = 35;
    let y = 20;
    let rowWidth = 40;
    let margin = 10;

    // await sleep(1000)
    for (const item of data) {
      const qrCode =await generateQRCode1(item.data)
      doc.text(x-10 ,y+8,item.label );
       doc.addImage(qrCode, 'JPEG', x, y+10, rowWidth, rowWidth);

      // QR details text below the image
      const qrDetailsText = `Batch No: ${item.batchno}`
      doc.text(x-10, y + rowWidth + 15, qrDetailsText, { align: 'left' });

      // Move to the next row or page if necessary
      x += rowWidth + margin + 40; // Adjust margin to account for QR details text width
      if (x + rowWidth > doc.internal.pageSize.width) {
        x = 35;
        y += 40 + 30; // Adjust margin to account for QR details text height
        if (y + 40 > doc.internal.pageSize.height) {
          doc.addPage();
          y = 20;
        }
      }
    }
    setBatchNumber('')
    await sleep(1000)
     doc.save(`QR Tag batch.pdf`);
    
  };

  const findDivision =() =>{
    console.log("finding division....")
    setDivision('MD')
    
  }
  // const [optionsUrl, setOptionsUrl] = useState('/api/division')
  const optionsUrl = '/api/division'
  const BatchNumberUrl = '/api/qrtag'
  

const handleChange = (selectedOption) => {
  console.log('Selected option:', selectedOption);
  setDivision(selectedOption.value)
};
const [options, setOptions]=useState([])
useEffect(() => {
  
  fetch('/api/qrtag')
  .then((response) => response.json())
  
  .then((data) => {
    console.log(data)
      if (!Array.isArray(data.data)) {
          console.error('Data fetched from API is not an array');
          return;
        }
    const dataOption = data.data.map((item) => ({
      value: item.batchno,
      label: item.batchno,
    }));

    setOptions(dataOption);
  });
}, [optionsUrl]);


const handleBatchnoChange = (event) => {
  console.log(event)
  setBatchNumber(event.value);
 
};

  const handleInputClick = () => {
    // navigate('/search-table/:division')
    setSlugValue('division')
    setIsTableOpen(true);
  };
  const handleBatchnoClick =()=>{
    setSlugValue('qrtag')
    setIsTableOpen(true);
  }

  const handleCloseTable = () => {
    setIsTableOpen(false);
  };
const handleTable=(e)=>{
  console.log('click for false :', e)
  // setSlugValue('')
  setIsTableOpen(false)
}
const todos = useSelector(state => state.todos)
const dispatch = useDispatch()
useEffect(()=>{
  if(slugValue ==='division'){
    todos.map((todo)=>{
      setDiv_code(todo.text.id)
      setDiv_name(todo.text.name)
      dispatch(removeTodo(todo.id))
    })
  } else if(slugValue ==='qrtag'){
    todos.map((todo)=>{
      setBatchno(todo.text.id)
      // setDiv_name(todo.text.name)
      dispatch(removeTodo(todo.id))
    })
  }
 
 
  // setDiv_code(todos)
},[todos])

  return (
    <>
      {isTableOpen &&
   <div>
    <SearchableTable 
    onClick={handleTable}
    slugValue={slugValue}/>
   </div>
    }
    {!isTableOpen &&
    <form onSubmit={generatePDF}>
      <div className=" flex">
        <div className=" w-3/12">
      <Input
          label ='Division'
          value={div_code}
          onClick={handleInputClick}
          onChange={handleChange}
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
      <div className="flex">
      <Input
          label ='Batch Number'
          value={batchno}
          onClick={handleBatchnoClick}
          onChange={handleChange}
      />
      </div>
      
      {/* <label htmlFor="label">Batch Number</label>
    <Select 
    onChange={handleBatchnoChange} 
    options={options}
    required
     /> */}
    
     
 
    <div className="flex ">
        <Button type="submit" onClick={generatePDF} className="w-full m-5" >Generate QR Tag </Button>
        <Button type=""  className="w-full m-5">Clear </Button>
        <Button type="" onClick={() => navigate(-1)} className="w-full m-5">Exit </Button>
        </div>
    </form>
    }
    </>
  );
};

export default QrTagPrint;
