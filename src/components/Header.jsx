import React from 'react';
import Button from './ui/Button';
import assets from '../assets/assets';
import Navbar from './Navbar';
import AnalysisCard from './ui/AnalysisCard';
import LearnersBadges from './ui/LearnersBadges';
import { Link, useNavigate } from 'react-router-dom';
 
const Header = () => {
const navigate = useNavigate();


    return (
        <>
            <Navbar />
            <div className="py-10 px-4 md:px-6 lg:px-10 mx-auto flex flex-col md:flex-row gap-8 bg-white shadow-md dark:bg-gray-800 dark:text-white">
                <div className="py-10 w-full md:w-1/2 flex flex-col items-start justify-center">
                    <div className='flex flex-col items-start justify-start gap-2 lg:gap-4'>
                        <div className='rounded-2xl flex items-center gap-2 px-3 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm'>
                            <div className='w-2 h-2 rounded-full bg-gray-50 dark:bg-black'></div>
                            <p>AI au service de la formation professionelle</p>
                        </div>
                        
                        <h1 className="text-4xl lg:text-6xl font-bold max-w-2xl">
                            Formez vos talents avec l'intelligence artificielle
                        </h1>
                        <p className="max-w-2xl text-base lg:text-xl text-zinc-500 dark:text-zinc-400 font-bold">
                            SkillMentor est votre assistant en intelligence artificielle durant tout votre formation.
                        </p>
                    </div>
                    <div className='mt-4 md:mt-6 flex items-center justify-start gap-4'>
                        <Button 
                            className="text-white dark:text-gray-900 bg-gray-800 dark:bg-gray-200 flex items-center gap-2 hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors" 
                            text={<>
                                {assets.graduationIconWhite}
                                <span>Essayer gratuitement</span>
                            </>} 
                            onClick={() => {navigate('/login')}} 
                        />
                        <Button 
                            className="border border-gray-800 dark:border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors" 
                            text="Nous Contacter" 
                            onClick={() => {}} 
                        />
                    </div>

                    <LearnersBadges />
                </div>
                <div className="w-full md:w-1/2 h-[400px] md:h-auto rounded-lg overflow-hidden relative">
                    <img 
                        className="absolute w-full h-full object-cover" 
                        src="src/assets/header_img.jpg" 
                        alt="IA reconnaissance faciale" 
                    />
                    <AnalysisCard />
                </div>
            </div>
        </>
    );
};

export default Header;