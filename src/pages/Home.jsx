import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';

function Home({dashboardType}) {
  const navigate = useNavigate();
  if(dashboardType === 'main'){
      return(
        <div className="grid gap-4 m-4 sm:grid-cols-12">
          <Link to="/mast" className="text-center text-4xl min-h-[100px] rounded shadow-xl sm:col-span-4 bg-blue-300 flex justify-center items-center" >
        <div >
          Masters
        </div>
        </Link>
        <Link to="/tran" className="text-center text-4xl min-h-[100px] rounded shadow-xl sm:col-span-4 bg-blue-300 flex justify-center items-center" >
        <div >
          Data Import
        </div>
        </Link>
      </div>
      );
  }
 if(dashboardType === 'mast'){
  return (
<div >
    <div className="flex justify-end">
    <Button className="mt-5 ml-5 mr-5 mb-5 px-6 text-lg" children='Back' onClick={() => navigate(-1)} />
  </div>
    <div className="grid gap-4 m-4 sm:grid-cols-12">
        {/* <Link to="/crop-year-master">
  <div className="col-end-5 col-span-2 bg-blue-300 text-center py-3">Crop Year Master</div>
  </Link>  */}
  <Link to="/entity-master" className=" min-h-[100px] rounded shadow-xl sm:col-span-4 bg-blue-300 flex justify-center items-center">
  <div className=" text-center text-2xl"  >Entity Master</div>
  </Link>
 
  
 
  <Link to="/division-master" className="min-h-[100px] rounded shadow-xl sm:col-span-4 bg-blue-300 flex justify-center items-center">
  <div className=" text-center text-2xl" >Division Master</div>
  </Link>
  <Link to="/stax-master" className="min-h-[100px] rounded shadow-xl sm:col-span-4 bg-blue-300 flex justify-center items-center">
  <div className=" text-center text-2xl" >Sale Tax Master</div>
  </Link>
  <Link to="/series-master" className="min-h-[100px] rounded shadow-xl sm:col-span-4 bg-blue-300 flex justify-center items-center">
  <div className="mtext-center text-2xl">Series Master</div>
  </Link>
  <Link to="/vrseq-master" className="min-h-[100px] rounded shadow-xl sm:col-span-4 bg-blue-300 flex justify-center items-center">
  <div className="text-center text-2xl">Series Sequence Master</div>
  </Link>
    </div>
</div>
  ) 
}
if(dashboardType === 'tran'){
  return (
<div >
  
  <div>
    <div className="flex justify-end">
    <Button className="mt-5 ml-5 mr-5 mb-5 px-6 text-lg" children='Back' onClick={() => navigate(-1)} />
  </div>
   <div className="grid gap-4 m-4 sm:grid-cols-12">
     {/* <Link to="/qr-tag">
  <div className="col-start-1 col-end-3 bg-blue-300 text-center py-3">QR Tag Generation</div>
  </Link>
  <Link to="/qr-tag-print">
  <div className="col-end-7 col-span-2  bg-blue-300 text-center py-3">QR Tag Print</div>
  </Link>
  <Link to="/qr-tag-weight">
  <div className="col-end-7 col-span-2  bg-blue-300 text-center py-3">QR Tag Weight</div>
  </Link>
  
  <Link  to="/cbj_excel"> 
  <div className="col-start-1 col-end-7  bg-blue-300 text-center py-3">CBJ Excel</div>
  </Link>
  <Link  to="/cbj_excel_daybook/"> 
  <div className="col-start-1 col-end-7  bg-blue-300 text-center py-3">CBJ Excel Daybook</div>
  </Link> */}
  <Link  to="/cbj_excel_daybook/j" className="min-h-[100px] rounded shadow-xl sm:col-span-4 bg-blue-300 flex justify-center items-center"> 
  <div className="text-center text-2xl">Account Tran Import</div>
  </Link>
  <Link  to="/indent/" className="min-h-[100px] rounded shadow-xl sm:col-span-4 bg-blue-300 flex justify-center items-center"> 
  <div className="text-center text-2xl">Indent Import</div>
  </Link>
  <Link  to="/order/" className="min-h-[100px] rounded shadow-xl sm:col-span-4 bg-blue-300 flex justify-center items-center"> 
  <div className="text-center text-2xl">Sales Contract Import</div>
  </Link>
  <Link  to="/prod/" className="min-h-[100px] rounded shadow-xl sm:col-span-4 bg-blue-300 flex justify-center items-center"> 
  <div className="text-center text-2xl">Production Import</div>
  </Link>
  <Link  to="/add_splitter/" className="min-h-[100px] rounded shadow-xl sm:col-span-4 bg-blue-300 flex justify-center items-center"> 
  <div className="text-center text-2xl">Address Spliter</div>
  </Link>

  </div>
   </div>
 
</div>
  ) 
}
}

export default Home;