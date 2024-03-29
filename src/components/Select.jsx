import React, {useId} from 'react'

function Select({
    options,
    label,
    className,
    ...props
}, ref) {
    const id = useId()
    // console.log("Select label: "+label)
  return (
    <div className='w-full flex ml-4 mt-2'>
        {label && <label htmlFor={id} className='inline-block mb-1 ml-1 w-3/12'>{label}</label>}
        <select
        {...props}
        id={id}
        ref={ref}
        className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
        >
            {options?.map((option) => (
                <option key={option.div_code} value={option.div_code} >
                    {option.div_code} : {option.div_name}
                </option>
            ))}
        </select>
    </div>
  )
}

export default React.forwardRef(Select)