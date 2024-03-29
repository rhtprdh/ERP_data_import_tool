// import React, { useState } from 'react';
// import { Table, TableBody, TableCell, TableRow, TextField } from '@mui/material';

// const EditableTableCell = ({ row, index }) => {
//   const [editedValue, setEditedValue] = useState(row.split(',')[1]); // Extract the second element from the row

//   const handleEditChange = (event) => {
//     setEditedValue(event.target.value);
//   };

//   return (
//     <TableCell>
//       <TextField
//         value={editedValue}
//         onChange={handleEditChange}
//       />
//     </TableCell>
//   );
// };

// export default EditableTableCell