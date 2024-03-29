import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios'

// const options = [
//   { value: 'chocolate', label: 'Chocolate' },
//   { value: 'strawberry', label: 'Strawberry' },
//   { value: 'vanilla', label: 'Vanilla' },
// ];


const SelectAutocomplite = ({label, optionsUrl, onChange}) => {
    const [options, setOptions]=useState([])
    const [selectedOption, setSelectedOption] = useState(null);

   
    useEffect(() => {
        // console.log(optionsUrl)
        fetch(optionsUrl)
        .then((response) => response.json())
        
        .then((data) => {
            if (!Array.isArray(data.data)) {
                console.error('Data fetched from API is not an array');
                return;
              }
          const dataOption = data.data.map((item) => ({
            value: item.div_code,
            label: item.div_name,
          }));
    
          setOptions(dataOption);
        });
      }, [optionsUrl]);


    const handleChange = (event) => {
        // console.log(event)
        setSelectedOption(event);
        if (onChange) {
          onChange(event);
        }
      };
return (
    <div className=" row-auto">
    <label htmlFor="label">{label}</label>
    <Select 
    onChange={handleChange} options={options}
    value={selectedOption}
     />
  </div>
)
}



export default SelectAutocomplite;
