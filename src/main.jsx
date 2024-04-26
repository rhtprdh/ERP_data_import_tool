import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home.jsx';
import DivisionMaster1 from './pages/masters/Division master/DivisionMaster1.jsx';
import DivisionMaster from './pages/masters/Division master/DivisionMaster.jsx';
import DivisionMasterEdit from './pages/masters/Division master/DivisionMasterEdit.jsx';
import Qrtag from './pages/transactionComp/qrtag/Qrtag.jsx';
import QrTagPrint from './pages/masters/reportsAndPrints/QrTagPrint.jsx';
import CropYearMaster from './pages/masters/cropYearMaster/CropYearMaster.jsx';
import SearchableTable from './selectComponents/SearchableTable.jsx';
import { Provider } from 'react-redux';
import { store } from './app/Store.js';
import CropYearMaster2 from './pages/masters/cropYearMaster/CropYearMaster2.jsx';
import CbjExcel from './pages/excelMaster/CbjExcel.jsx';
import EntityMaster from './pages/masters/EntityMaster/EntityMaster.jsx';
import EntityMasterTwo from './pages/masters/EntityMaster/EntityMasterTwo.jsx';
import EntityMasterEdit from './pages/masters/EntityMaster/EntityMasterEdit.jsx';
import CbjExcelDaybook from './pages/excelMaster/CbjExcelDaybook.jsx';
import CbjExcelDaybookDrCr from './pages/excelMaster/CbjExcelDaybookDrCr.jsx';
import SeriesMaster from './pages/masters/SeriesMaster/SeriesMaster.jsx';
import SeriesMasterTwo from './pages/masters/SeriesMaster/SeriesMasterTwo.jsx';
import SeriesMasterEdit from './pages/masters/SeriesMaster/SeriesMasterEdit.jsx';
import SeriesSeq from './pages/masters/seriesSeq/SeriesSeq.jsx';
import SeriesSeqEdit from './pages/masters/seriesSeq/SeriesSeqEdit.jsx';
import CbjExcelDaybookDrCrBackUp from './pages/excelMaster/CbjExcelDaybookDrCrBackUp.jsx';
import IndentImport from './pages/excelMaster/IndentImport.jsx';
import Order from './pages/excelMaster/Order.jsx';
import StaxMaster from './pages/masters/StaxMaster/StaxMaster.jsx';
import StaxMasterTwo from './pages/masters/StaxMaster/StaxMasterTwo.jsx';
import StaxMasterEdit from './pages/masters/StaxMaster/StaxMasterEdit.jsx';
import AddSplitter from './pages/excelMaster/AddSplitter.jsx';
import SeriesSeqTwo from './pages/masters/seriesSeq/SeriesSeqTwo.jsx';
import ProductionImport from './pages/excelMaster/ProductionImport.jsx';

const editMode="true";
let viewMode=true;

const router = createBrowserRouter([
  {
    path:"/",
    element: <App/>,
    children: [
      {
        path:"/",
        element: <Home dashboardType="main"/>
      },
      {
        path:"/mast",
        element: <Home dashboardType="mast"/>
      },
      {
        path:"/tran",
        element: <Home dashboardType="tran"/>
      },
      {
        path:"/division-master",
        element: <DivisionMaster1/>
      },
       {
        path:"/division-master-page",
        element: <DivisionMaster/>
      },
      {
        path: "/division-master-page/:slug",
        element: 
          <DivisionMasterEdit/>  
      },
      {
        path:"/entity-master",
        element: <EntityMaster/>
      },  
      {
        path:"/entity-master-page",
        element: <EntityMasterTwo/>
      },
      {
        path:"/entity-master-page/:slug",
        element: <EntityMasterEdit/>
      },
      {
        path:"/series-master",
        element: <SeriesMaster/>
      },  
      {
        path:"/series-master-page",
        element: <SeriesMasterTwo/>
      },
      {
        path:"/series-master-page/:slug",
        element: <SeriesMasterEdit/>
      },
      {
        path:"/stax-master",
        element: <StaxMaster/>
      },  
      {
        path:"/stax-master-page",
        element: <StaxMasterTwo/>
      },
      {
        path:"/stax-master-page/:slug",
        element: <StaxMasterEdit/>
      },
      {
        path:"/vrseq-master",
        element: <SeriesSeq/>
      },  
      {
        path:"/vrseq-master-page",
        element: <SeriesSeqTwo/>
      },
      {
        path:"/vrseq-master-page/:slug",
        element: <SeriesSeqEdit/>
      },

      // {
      //   path: "/qr-tag",
      //   element: 
      //     <Qrtag/>  
      // },
      // {
      //   path: "/qr-tag-print",
      //   element: 
      //     <QrTagPrint/>  
      // },
      // {
      //   path: "/crop-year-master",
      //   element: 
      //     <CropYearMaster/>
      // },
      // {
      //   path: "/crop-year-master-page",
      //   element: 
      //     <CropYearMaster2/>
      // },
      // {
      //   path: "/search-table/:slug",
      //   element: 
      //   <SearchableTable />
      // },
      // // {
      // //   path: "/qr-tag-weight/",
      // //   element: 
      // //   <QrTagWeightCapture/>
      // // },
      // {
      //   path: "/cbj_excel/",
      //   element: 
      //   <CbjExcel/>
      // },
      // {
      //   path: "/cbj_excel_daybook/",
      //   element: 
      //   <CbjExcelDaybook/>
      // },
      {
        path: "/cbj_excel_daybook/j",
        element: 
        <CbjExcelDaybookDrCrBackUp/>
      },
      {
        path: "/indent/",
        element: 
        <IndentImport/>
      },
      {
        path: "/order/",
        element: 
        <Order/>
      },
      {
        path: "/add_splitter/",
        element: 
        <AddSplitter/>
      },
      // {
      //   path: "/prod/",
      //   element: 
      //   <ProductionImport/>
      // },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <Provider store={store}>
    <RouterProvider router={router}/>,
  {/* </React.StrictMode>, */}
  </Provider>
);
