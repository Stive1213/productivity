import {NavLink} from 'react-router-dom';
import React from 'react'

const Sidebar = () => {
  return (
    <div className='h-screeen w-64 bg-gary-800 text-white flex flex-col'>
        <div className='p-4 text-2xl font-bold border-b border-gary-700'>
            Lifehub

        </div>
        <nav className='flex-1 p-4'>
            <ul className='space-y-4'>
                <li>
                <NavLink 
                to="/dashboard"
                className={({ isActive}) =>
                    isActive
                ? "block p-2 bg-gray-700 rounded"
                : "block p-2 hover:bg-gray-700 rounded text-black "
                }
                >
                    Dashboared

                </NavLink>
                </li>
                <li>

                <NavLink 
                to="/profile"
                className={({ isActive}) =>
                    isActive
                ? "block p-2 bg-gray-700 rounded"
                : "block p-2 hover:bg-gray-700 rounded text-black"
                }   
                >
                    Profile
                </NavLink>
                </li>
                <li>
                <NavLink
                to="/settings"  
                className={({ isActive}) =>
                    isActive
                ? "block p-2 bg-gray-700 rounded"
                : "block p-2 hover:bg-gray-700 rounded text-black"
                }
                >
                    Settings
                </NavLink>

                </li>
            </ul>

        </nav>
        <div className='p-4 border-t border-gray-700'>
            <button className='w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'>
                Logout
            </button>

        </div>

    </div>
  );
}

export default Sidebar;