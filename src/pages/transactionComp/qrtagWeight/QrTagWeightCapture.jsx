import React, { useEffect, useState } from 'react'
import Input from '../../../components/Input'

function QrTagWeightCapture() {
  const [fileContent, setFileContent] = useState('');
  const [weighData, setWeighData] = useState('');

  useEffect(() => {
    // const filePath = 'B:\\wbdata.wbg'; // Update with the actual path

    // const readFile = async () => {
    //   try {
    //     const response = await fetch(filePath);
    //     const content = await response.text();
    //     console.log(content)
    //     setFileContent(content);
    //   } catch (error) {
    //     console.error('Error reading file:', error);
    //   }
    // };
    // readFile();
    fetch('/api/weight/readFile')
    .then((response) => response.json())
    
    .then((data) => {
    //    const data = data1.data
        console.log(data);
        setWeighData(data)
    });
  }, []);





  return (
    <>
     <div className="flex items-center justify-center h-screen ">
      <div className="flex gap-4 flex-col">
        <div className="flex">
        <label>Bales Number</label>
      <input type="text"  className="p-4 text-lg border border-gray-300 rounded-lg" />
      </div>
      <label>Bales Weghbridge Weight {fileContent}</label>
      <input type="text"  className="p-4 text-lg border border-gray-300 rounded-lg mt-4" value={weighData} />
         </div>
      <table className="w-4/12 border border-collapse m-5 ">
        <tbody>
          {/* Generate table rows with placeholder content */}
          {Array.from({ length: 10 }, (_, i) => (
            <tr key={i}>
              <td className="px-4 py-2 border border-gray-300 text-center">Cell {i * 2 + 1}</td>
              <td className="px-4 py-2 border border-gray-300 text-center">Cell {i * 2 + 2}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  )
}

export default QrTagWeightCapture