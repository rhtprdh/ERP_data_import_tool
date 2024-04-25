import React, {useId} from 'react';

const Input = React.forwardRef( function Input({
    label,
    type="text",
    className = "",
    ...props

}, ref) {
    const id = useId()
    let width =null;
    if(label){
      width="w-80"
    }
  return (
    <div className="w-full flex mt-2 mb-1">
        {label && 
        <label
        className={`inline-block mb-1 px-2 ${width}`}
        htmlFor={id}>
            {label}
        </label>
        
        }
        <input type={type}
        // className={`px-3 py-1 bg-blue-200 text-black outline-blue-500 focus:bg-gray-50 duration-200 border border-blue-400 w-full ${className}`}
        className={`px-3 py-1 bg-blue-200 text-black outline-blue-500 focus:bg-gray-50 duration-200 border border-blue-400 w-full text-base sm:text-sm ${className}`}
        ref={ref}
        {...props}
        id={id}
         />
       
    </div>
  )
})

export default Input