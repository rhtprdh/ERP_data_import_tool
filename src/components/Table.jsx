import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Button, Input } from './Index';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
 
// const columns = [
//   { id: 'name', label: 'Name', minWidth: 170 },
//   { id: 'code', label: 'ISO\u00a0Code', minWidth: 100 },
//   {
//     id: 'population',
//     label: 'Population',
//     minWidth: 170,
//     align: 'right',
//     format: (value) => value.toLocaleString('en-US'),
//   },
//   {
//     id: 'size',
//     label: 'Size\u00a0(km\u00b2)',
//     minWidth: 170,
//     align: 'right',
//     format: (value) => value.toLocaleString('en-US'),
//   },
//   {
//     id: 'density',
//     label: 'Density',
//     minWidth: 170,
//     align: 'right',
//     format: (value) => value.toFixed(2),
//   },
// ];

// function createData(name, code, population, size) {
//   const density = population / size;
//   return { name, code, population, size, density };
// }




// const rows = [
//   createData('India', 'IN', 1324171354, 3287263),
//   createData('China', 'CN', 1403500365, 9596961),
//   createData('Italy', 'IT', 60483973, 301340),
//   createData('United States', 'US', 327167434, 9833520),
//   createData('Canada', 'CA', 37602103, 9984670),
//   createData('Australia', 'AU', 25475400, 7692024),
//   createData('Germany', 'DE', 83019200, 357578),
//   createData('Ireland', 'IE', 4857000, 70273),
//   createData('Mexico', 'MX', 126577691, 1972550),
//   createData('Japan', 'JP', 126317000, 377973),
//   createData('France', 'FR', 67022000, 640679),
//   createData('United Kingdom', 'GB', 67545757, 242495),
//   createData('Russia', 'RU', 146793744, 17098246),
//   createData('Nigeria', 'NG', 200962417, 923768),
//   createData('Brazil', 'BR', 210147125, 8515767),
// ];

export default function GlobalTable({columns, rows=[], navAddButtonLink,deleteAllButton, editValue, deleteUrl}) {
  const navigate = useNavigate();
  const handleEdit = (id) => {
    navigate(navAddButtonLink+"/:"+id)  }
  const[delId, setDelId] = useState(''); 
  const [dataType, setDataType] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

const handleDelete = (id) => {
  setDelId(id[0]);
  setShowConfirmation(true);
  setDataType('single');
 
  // alert(`Are you sure to delete ${id[0]}?`);
  // confirmAlert({
  //   title: 'Confirm to submit',
  //   message: `Are you sure to delete ${id[0]}?`,
  //   buttons: [
  //     {
  //       label: 'Yes',
  //       onClick: () => {alert('data is delete')
  //       axios.delete(`/api/${editValue}/delete/:${id[0]}`)  //, { data: { vrSeqArray } }
  //       .then(response => {
  //         console.log('Deleted successfully:', response.data);
  //         // Handle successful deletion
  //       })
  //       .catch(error => {
  //         console.error('Error deleting data:', error);
  //         // this.setState({ error: 'Error deleting data' });
  //       });
  //       window.location.reload();
  //     }
  //     },
  //     {
  //       label: 'No',
  //       onClick: () => {
  //         alert('data is not delete');
  //         // Your return function here
  //         return;
  //       }
  //     }
  //   ]
  // });

 

}
  // const {slug} = useParams()
  // the data need to send for columns and rows as belows formate
  //    columns =[
  //    { id: 'div_code', label: 'Div code'}
  //    { id: 'div_name', label: 'Div Name'}
  //    ] 
  //    const rows = [
  //    { div_code:'FD', div_name:'fixed unit 1'}
  //    ]
  
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  // const handleAddRecord = () => {console.log(navigate)}
  const [sortedField, setSortedField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const sortedData = () => {
    if (!sortedField) {
      return rows;
    }
    return rows.slice().sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1;
      return a[sortedField] > b[sortedField] ? order : -order;
    });
  };
  const filteredData = () => {
    if (!searchTerm) {
      return sortedData();
    }

    return sortedData().filter(item =>
      Object.values(item).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };




  // const handleDelete = () => {
  //   setShowConfirmation(true);
  // };

  const handleConfirm = () => {
    // console.log(dType);
    if(dataType === 'single'){
    // console.log(`/api/${deleteUrl}/delete/:${delId}`);
    axios.delete(`/api/${deleteUrl}/delete/:${delId}`)  //, { data: { vrSeqArray } }
        .then(response => {
          console.log('Deleted successfully:', response.data);
          // Handle successful deletion
        })
        .catch(error => {
          console.error('Error deleting data:', error);
          // this.setState({ error: 'Error deleting data' });
        });
        window.location.reload();
        window.location.reload(true);
        
    setShowConfirmation(false);
    alert("Item deleted!");
      }else if(dataType ==='multiple'){
        axios.delete(`/api/${deleteUrl}/delete/all/data`)  //, { data: { vrSeqArray } }
        .then(response => {
          console.log('Deleted successfully:', response.data);
          // Handle successful deletion
        })
        .catch(error => {
          console.error('Error deleting data:', error);
          // this.setState({ error: 'Error deleting data' });
        });
        window.location.reload();
        window.location.reload(true);
        
    setShowConfirmation(false);
    alert("All data are deleted!");
      }
  };

  const handleDeleteAll = () =>{
    setDelId('all data');
    setDataType('multiple')
    setShowConfirmation(true);
  }

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <>
       <Input
        type="search"
        placeholder="Search here"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
   
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {/* <TableContainer sx={{ maxHeight: 440 }} > */}
      <TableContainer className="max-h-[640px] md:max-h-[440px]" >
    
      
       <div className=" py-4 bg-slate-300  align-items-end ">
       {navAddButtonLink && 
          <Link to={navAddButtonLink}>
          <Button children=' +  Add Record' 
          textColor="text-blue-600"
          className="bg-white  text-lg mx-4"
          />
          </Link>
          }
          {deleteAllButton &&
             <Button children='Delete All' 
             textColor="text-blue-600"
             className="bg-white  text-lg mx-4"
             onClick={() =>(handleDeleteAll())}
             />
          }
          

          <Button
          children='Exit'
          className="float-right ml-5 mr-5 px-10 text-lg"
          onClick={() => navigate(-1)}
          />
      </div>
      
      
        
        <Table stickyHeader aria-label="table" >
      
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  // align={column.align}
                  // style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
                <TableCell className="max-w-xs text-center">Action</TableCell>
            {/* <TableCell >Delete</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData()
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row[editValue]}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id}>
                           {/* align={column.align} it is above code */}
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                           
                        </TableCell>
                        
                      );
                    })}

                      {/* {rows.map((row) => (
                      <TableCell key={row.div_code}>
                      <EditIcon
                      className="text-blue-600"
                      onClick={() => handleEdit(row.div_code)
                         
                        }
                      />
                      </TableCell>
                      ))} */}

                     {/* <TableCell> */}

              {/* </TableCell> */}
              <TableCell>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
              <EditIcon
                      className="text-blue-600"
                      onClick={() => handleEdit(row[editValue])
                        // navigate(naviget+"/:"+row.div_code)
                         
                        }
                      />
                <DeleteIcon className="text-red-600 ml-2" onClick={() => handleDelete(columns.map((column) => row[column.id]))} />
                <VisibilityIcon className="text-blue-600 ml-2"/>
                  </div>
              </TableCell>
                  </TableRow>
                );
              })}
              
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
    {showConfirmation && (
        <ConfirmationDialog
          message={`Are you sure you want to delete ${delId}?`}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}


function ConfirmationDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50 z-50">
    <div className="bg-white p-8 rounded-lg">
      <p className="mb-4">{message}</p>
      <div className="flex justify-between">
        <button
          className="px-4 py-2 mr-2 text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:bg-green-600"
          onClick={onConfirm}
        >
          Yes
        </button>
        <button
          className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:bg-red-600"
          onClick={onCancel}
        >
          No
        </button>
      </div>
    </div>
  </div>
  );
}