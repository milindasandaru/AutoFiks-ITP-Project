import React, { useState } from 'react'
import { HiOutlineSquares2X2, HiOutlineChatBubbleBottomCenterText, HiOutlineDocumentCurrencyDollar, HiOutlineUser, HiOutlinePhone, HiOutlineClipboardDocumentList, HiArrowUturnLeft, HiOutlineCog8Tooth } from 'react-icons/hi2'
import AMS_logo2 from '../assets/AMS_logo2.png'
import AMS_logo_mini from '../assets/AMS_logo_mini.png'
import { Link } from 'react-router-dom'

const SideBar = () => {

  const [ActiveLink, setActiveLink] = useState(0)

  const handleLinkClick = (index) => {
    setActiveLink(index)
  }

  const SIDEBAR_LINKS1 = [
    { id: 1, path: "/", name: "Overview", icon: HiOutlineSquares2X2 },
    { id: 2, path: "/service_ticket", name: "Service Ticket", icon: HiOutlineClipboardDocumentList},
    { id: 3, path: "/employee", name: "Employee", icon: HiOutlineChatBubbleBottomCenterText },
    { id: 4, path: "/customer", name: "Customer", icon: HiOutlineDocumentCurrencyDollar },
    { id: 5, path: "/billing", name: "Billing", icon: HiOutlineDocumentCurrencyDollar },
    { id: 6, path: "/spare_parts", name: "Spare Parts", icon: HiOutlineDocumentCurrencyDollar },
    { id: 7, path: "/analytics", name: "Analytics", icon: HiOutlineDocumentCurrencyDollar },

  ];
  const SIDEBAR_LINKS2 = [
    { id: 8, path: "/profile", name: "Profile", icon: HiOutlineUser },
    { id: 9, path: "/setting", name: "Setting", icon: HiOutlinePhone },
  ];

  return (
    <div className='w-16 md:w-72 fixed left-0 top-0 z-10 h-screen border-r-3 border-gray-200 pt-8 px-4 bg-white'>

      {/**Logo */}
      <div className='mb-9'>
        <img src={AMS_logo2} alt="logo" className='w-48 hidden md:flex' />
        <img src={AMS_logo_mini} alt="logo" className='w-8 flex justify-center md:justify-start md:hidden' />
      </div>

      {/**Navigation Links */}
      <ul className='mt-6 space-y-3 text-gray-400'>
        <p className='text-xs font-medium text-gray-400 hidden md:flex'>MENU</p>
        {SIDEBAR_LINKS1.map((link, index) => (
          <li key={index} className={`font-medium rounded-md py-2 px-5 hover:text-blue-500 ${ActiveLink === index ? "text-blue-500" : ""}`}>
            <Link to={link.path} className='flex justify-center md:justify-start items-center md:space-x-5'
              onClick={() => handleLinkClick(index)}
            >
              <span>{link.icon()}</span>
              <span className='text-sm hidden md:flex'>{link.name}</span>
            </Link>
          </li>
        ))}

        <p className='text-xs font-medium text-gray-400 hidden md:flex'>SETTING</p>
        {SIDEBAR_LINKS2.map((link, index) => (
          <li key={index} className={`font-medium rounded-md py-2 px-5 hover:text-blue-500 ${ActiveLink === index + SIDEBAR_LINKS1.length ? "text-blue-500" : ""}`}>
            <Link to={link.path} className='flex justify-center md:justify-start items-center md:space-x-5'
              onClick={() => handleLinkClick(index + SIDEBAR_LINKS1.length)}
            >
              <span>{link.icon()}</span>
              <span className='text-sm hidden md:flex'>{link.name}</span>
            </Link>
          </li>
        ))}
      </ul>

    </div>
  )
}

export default SideBar


