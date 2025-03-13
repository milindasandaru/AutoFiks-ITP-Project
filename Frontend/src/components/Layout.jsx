import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from './sideBar';
import Header from './Header';

const Layout = () => {
  return (
    <div>
      <div className='flex'>
        <SideBar />
        <div className='w-full ml-16 md:ml-72'>
          <Header />
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout;
