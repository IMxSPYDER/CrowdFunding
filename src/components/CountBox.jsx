import React from 'react'

const CountBox = ({ title, value }) => {
  return (
    <div className="flex flex-col items-center w-[150px]">
      <h4 className="font-epilogue font-bold text-[30px] text-black p-3 bg-[#d4d4d4] rounded-[10px] w-full text-center truncate">{value}</h4>
      <p className="font-epilogue font-normal text-[16px] text-[#333333] bg-[#919191] px-3 py-2 w-full rouned-[10px] text-center">{title}</p>
    </div>
  )
}

export default CountBox