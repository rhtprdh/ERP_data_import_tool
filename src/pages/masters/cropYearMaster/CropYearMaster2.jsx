
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import {
  randomId,
} from '@mui/x-data-grid-generator';
import { useEffect } from 'react';
import axios, { Axios } from 'axios';
import { useState } from 'react';
import dateLibrary from '../../../library/dateLibrary';
import SearchableTable from '../../../selectComponents/SearchableTable';

// const initialRows = [
//   {
//     id: 1,
//     name: randomTraderName(),
//     age: 25,
//     joinDate: randomCreatedDate(),
//     role: randomRole(),
//   },
//   {
//     id: 2,
//     name: randomTraderName(),
//     age: 36,
//     joinDate: randomCreatedDate(),
//     role: randomRole(),
//   },
//   {
//     id: 3,
//     name: randomTraderName(),
//     age: 19,
//     joinDate: randomCreatedDate(),
//     role: randomRole(),
//   },
//   {
//     id: 4,
//     name: randomTraderName(),
//     age: 28,
//     joinDate: randomCreatedDate(),
//     role: randomRole(),
//   },
// ];

function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    // console.log("handle click")
    const id = randomId();
    setRows((oldRows) => [...oldRows, { id, name: '', age: '', isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbarContainer
    >
      <Button color="primary"
      background-color= "red !important" 
       startIcon={<AddIcon />} 
       onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}


export default function CropYearMaster2() {
  const [cropApiData, setCropApiDate] = useState();
  const [rows, setRows] = React.useState([]);
  const [devOptions, setDevOptions] = useState([]);
  const [editID, setEditId] = useState(null);
  const [div_name, setDiv_name] = useState(['FG', 'KI', 'GH','MD']);
  const [isEditModeForDev, setEditModeForDev] = useState(false);
  const [selectedDivCode, setSelectedDivCode] = useState();
  const [divName, setDivName] = useState();
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [updatedRow, setUpdatedRow] = useState([])

  useEffect(() => {
    // console.log( axios.get('/api/division'))
    axios.get('/api/crop-year')
    .then((response) => {
      setCropApiDate(response.data.data)
      // console.log(response.data.data)   
      const initialRows = response.data.data.map((item) => ({
        // id: item[slugApiDataId],
        // name: item[slugApiDataName],
        id: item.id,
        div_code: item.div_code,
        entity_code: item.entity_code,
        crop_year: item.crop_year,
        from_date: new Date(item.from_date),
        to_date: new Date(item.to_date),
        role: '',
    }));
    setRows(initialRows)
    })
    .catch((error) => {
      console.log(error)
    })
   },[])
 

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setEditId(id)
    // updateArrayItem(editID, { div_name: "rf" })
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    // console.log(id)
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    //from here send data to api for add and edit
    const updatedRow = { ...newRow, isNew: false };
    // setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    newRow.from_date= dateLibrary(newRow.from_date)
    newRow.to_date= dateLibrary(newRow.to_date)
   
    if(updatedRow.isNew === false){
    axios.post(`/api/crop-year/${newRow.id}`, newRow)
    .then((response) => {
      console.log('Data updated successfully:', response);
    })
    .catch((error) => {
      console.error('Error adding data:', error);
    });
  }else{
    axios.post(`/api/crop-year`, newRow)
    .then((response) => {
      console.log('Data added successfully:', response);
    })
    .catch((error) => {
      console.error('Error adding data:', error);
    });
  }
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

 
 
  useEffect( ()=>{
    console.log(`dev edit is run`)
    fetch(`/api/division`)
    .then((response) => response.json()) 
    .then((data) =>{
      console.log(data.data)
      setDevOptions(data.data.map((devData)=>{
        return data = devData.div_code
    }));
    })
  },[])

  const updateArrayItem = (indexLength, newValue) => {
    setRows(prevState => {
      const updatedEntity = [...prevState]; // Create a copy of the array
      updatedEntity[indexLength] = { ...updatedEntity[indexLength], ...newValue }; // Update the desired index with the new value
      return updatedEntity; // Return the updated array
    });
  }

  
 

  const handleChangeOne = (event) => {
    const newValue = event.target.value;
    setSelectedDivCode(newValue);
    // Call your method here with the selected value, e.g., sendDataToMethod(newValue);
    console.log('Selected div_code:', newValue);
    // updateArrayItem(arrLength,  { divName: 'rag devision' } )
  };

  useEffect( ()=>{
    console.log(`function me aaya re`);
    console.log((editID-1))
    let arrLength= (editID-1)
    updateArrayItem(arrLength,  {div_code:selectedDivCode, div_name: 'rag devision' } )
    console.log(rows);
  },[selectedDivCode])
  
  const columns = [
    { field: 'div_code', headerName: 'Devision', width: 130, editable: true, type: 'singleSelect',
    valueOptions: devOptions,
    renderEditCell: (params) => {
        return (
          <select value={selectedDivCode} onChange={handleChangeOne}>
            {devOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))} 
          </select>
        );
      },
   },
    { field: 'div_name', headerName: 'Devision Name', width: 280,  editable: true,
    // renderCell: (params) => <div>{divName}</div>
   },
    {
      field: 'entity_code',
      headerName: 'Entity',
      // type: 'number',
      width: 130,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'entity_name',
      headerName: 'Entity Name',
      // type: 'number',
      width: 280,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'from_date',
      headerName: 'From Date',
      type: 'date',
      width: 140,
      editable: true,
    },
    {
      field: 'to_date',
      headerName: 'to Date',
      type: 'date',
      width: 130,
      editable: true,
    },
    {
      field: 'crop_year',
      headerName: 'Crop Year',
      width: 150,
      editable: true,
      // type: 'singleSelect',
      // valueOptions: ['Market', 'Finance', 'Development'],
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 80,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;  
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [slugValue, setSlugValue] = useState();
  const handleInputClick = () => {
    // navigate('/search-table/:division')
    setSlugValue('division')
    setIsTableOpen(true);
  };

  const handleCloseTable = () => {
    setIsTableOpen(false);
  };
  const handleChange= (event)=>{
    event.target.value
  }
  const handleTable=(e)=>{
    console.log('click for false :', e)
    setIsTableOpen(false)
  }

  return (
    <>
      {isTableOpen &&
   <div>
    <SearchableTable 
    onClick={handleTable}
    slugValue='division'/>
   </div>
    }
    {!isTableOpen &&
    <Box
      sx={{
        height: 500,
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
      />
    </Box>
      }
      </>
  );
}