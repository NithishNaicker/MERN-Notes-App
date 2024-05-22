import React, { useState } from 'react'
import ProfileInfo from '../Cards/ProfileInfo'
import { useNavigate } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';

function Navbar({userInfo}) {

    const [SearchQuery,setSearchQuery]=useState("");


    const navigate=useNavigate();

    const onLogout=()=>{
        localStorage.clear();
        navigate("/login");
    }

    const onClearSearch=()=>{
        setSearchQuery("")
    };
    const handleSearch=()=>{
        
    }

  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow'>
        <h2 className='text-xl font-medium text-black py-2'>Notes</h2>
        {userInfo?( <SearchBar value={SearchQuery}
    onChange={({target})=>{
        setSearchQuery(target.value);
    }}
    handleSearch={handleSearch}
    onClearSearch={onClearSearch}
    
    />):("")}
    
    {userInfo?( <ProfileInfo userInfo={userInfo} onLogout={onLogout}/>):("")}
   
   
    
    </div>
  )
}

export default Navbar