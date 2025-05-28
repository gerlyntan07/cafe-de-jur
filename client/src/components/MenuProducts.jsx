import React from 'react'

function MenuProducts({imgSource, wSize}) {
  return (
    <div className='w-[5rem] h-[5rem] md:w-[8rem] md:h-[7rem] bg-darkBrown rounded-full flex items-center justify-center overflow-visible relative hover:scale-110 cursor-pointer transition-transform duration-300 ease-in-out'>
      <img src={imgSource} className={`${wSize} absolute overflow-visible object-contain bottom-2`} alt="" />
    </div>
  )
}

export default MenuProducts
