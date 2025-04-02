import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import assets from '../assets/assets';

const Navbar = () => {
    const navigate = useNavigate();
    const [menu, setMenu] = useState([
        {id: 2, name: 'Pricing', link: '/'},
        {id: 3, name: 'Team', link: '#'},
        {id: 4, name: 'Download', link: '#'}
    ]);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenu = (menu) => {
        return menu.map(item => (
            <li key={item.id}>
                {item.link.startsWith('/') ? (
                    <Link 
                        to={item.link} 
                        className='text-gray-600 hover:text-gray-800 cursor-pointer transition-colors dark:text-white dark:hover:text-gray-300 hover:underline hover:underline-offset-4'
                    >
                        {item.name}
                    </Link>
                ) : (
                    <a 
                        href={item.link} 
                        className='text-gray-600 hover:text-gray-800 cursor-pointer transition-colors dark:text-white dark:hover:text-gray-300 hover:underline hover:underline-offset-4'
                    >
                        {item.name}
                    </a>
                )}
            </li>
        ));
    };

    return (
        <div className='sticky top-0 z-50 flex items-center justify-between px-2 md:px-6 py-4 lg:px-10 bg-white shadow-md dark:bg-gray-800 dark:text-white'>
            <Link to="/" className='text-xl md:text-2xl lg:text-4xl font-bold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>
                SkillMentor
            </Link>
            
            <div className='hidden md:block'>
                <ul className="flex gap-8 items-center justify-center">
                    {handleMenu(menu)}
                </ul>
            </div>

            <div className='flex items-center gap-4'>
                <Button 
                    text="Connexion" 
                    className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600" 
                    onClick={() => navigate('/login')}
                />
            </div>

            {/* Menu mobile */}
            <div className='md:hidden'>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className='text-gray-600 hover:text-gray-800 dark:text-white dark:hover:text-gray-300'
                >
                    {isMenuOpen ? assets.menuClose : assets.menuOpen}
                </button>
            </div>

            {/* Menu mobile dropdown */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 shadow-lg p-4 space-y-4 md:hidden">
                    <ul className="space-y-4">
                        {handleMenu(menu)}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Navbar;