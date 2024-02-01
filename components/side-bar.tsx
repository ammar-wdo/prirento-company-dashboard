import React from 'react'
import AsideLinks from './aside-links'


type Props = {}

const SideBar = (props: Props) => {
  
  return (
    <div className='w-72 border-r fixed top-0 left-0 min-h-screen flex flex-col bg-white'>
        <h3 className='p-6 text-center capitalize text-xl font-bold border-b '>Super admin</h3>
        <AsideLinks/>
    </div>
  )
}

export default SideBar