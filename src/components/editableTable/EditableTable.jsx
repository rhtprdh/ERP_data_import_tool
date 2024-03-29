// import React from 'react'

// function EditableTable() {
//   return (
//     <Paper sx={{ width: '100%', overflow: 'hidden' }}>
//     <TableContainer sx={{ maxHeight: 440 }} >

//       <Table stickyHeader aria-label="table" >
    
//         <TableHead>
//           <TableRow>
//               <TableCell key='1' >  Batch Number </TableCell>
//               <TableCell key='2' >  QTY Per Batch </TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//                 {data.map((row) => (
//                 <TableRow key={row.id}>
//                     <TableCell>{row.split(',')[0]}</TableCell> // Display the first element
//                     <EditableTableCell row={row}  /> // Editable cell for the second element
//                     <TableCell>{row.split(',')[2]}</TableCell> // Display the third element
//                     {/* ... and so on for other elements */}
//                 </TableRow>
//                 ))}
            
//         </TableBody>
//       </Table>
//     </TableContainer>
  
//   </Paper>
//   )
// }

// export default EditableTable