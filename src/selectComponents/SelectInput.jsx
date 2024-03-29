import React, { useState, useEffect } from 'react';
import axios from 'axios'
import Select from '../components/Select';

const SelectInput = ({ label, optionsUrl, onChange }) => {
  const [options, setOptions] = useState([
    
// {div_code: 'FG', div_name: 'FINKAL GRAND DIVISION'},
// {div_code: 'gh', div_name: 'global div trft'},
// {div_code: 'sa', div_name: 'wqqewq'}
  ]);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    fetch(optionsUrl)
    .then((response) => response.json())
    
    .then((data) => {
    //    const data = data1.data
        console.log(data.data)
        if (!Array.isArray(data.data)) {
            console.error('Data fetched from API is not an array');
            return;
          }
      // Convert data into options format
      
      const options = data.data.map((item) => ({
        div_code: item.div_code,
        div_name: item.div_name,
      }));

      setOptions(options);
    });
  }, [optionsUrl]);

  const handleChange = (event) => {
    console.log(event.target.value)
    setSelectedOption(event.target.value);
    if (onChange) {
      onChange(event.target.value);
    }
  };
//   console.log(options);
//   console.log(selectedOption);

  return (
    <div>
        {/* <Select   
        label='division'
        options={options}
        value={selectedOption}
        onChange={handleChange}/> */}

        <select onChange={handleChange}>
            <option></option>
            {options?.map((option) => (
                <option key={option.div_code} value={selectedOption} >
                    {option.div_code} : {option.div_name}
                </option>
            ))}
        </select>
    </div>
  );
};

export default SelectInput;
