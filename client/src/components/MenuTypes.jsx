import React from 'react'
import { useNavigate } from 'react-router-dom';

function MenuTypes({imgSource, wSize, menuType}) {
const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/menu?type=${encodeURIComponent(menuType)}`);
  };

  return (
    <div onClick={handleClick} className='w-[7rem] h-[7rem] md:w-[12rem] md:h-[12rem] 2xl:h-[14rem] 2xl:w-[14rem] flex flex-col items-center justify-between'>
      <div className="w-[80%] h-[80%] bg-darkBrown flex rounded-full items-center justify-center overflow-visible relative hover:scale-110 transition-all duration-300 cursor-pointer">
        <img src={imgSource} className={`${wSize} object-contain bottom-2 absolute`} alt={menuType} />
      </div>
      <p className="font-libre uppercase text-center text-[15px] lg:text-[17px]">{menuType}</p>
    </div>
  )
}

export default MenuTypes