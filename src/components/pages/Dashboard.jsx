import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import assets from '../../assets/assets';
import Button from '../ui/Button';

const DashboardNav = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                                SkillMaster
                            </Link>
                        </div>
                        <div className="hidden md:ml-6 md:flex md:space-x-8">
                            <Link
                                to='/image-analysis'
                                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
                            >
                               {assets.image}Analyse d'images
                            </Link>
                            <Link
                                to='/voice-recognition'
                                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
                            >
                               {assets.voiceAI} Reconnaissance Vocale
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none"
                        >
                            {isMenuOpen ? assets.menuClose : assets.menuOpen}
                        </button>
                    </div>
                    <div className='hidden md:flex items-center gap-4'>
                        <Button 
                            text="Déconnexion" 
                            className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600" 
                            onClick={handleLogout}
                        />
                    </div>
                </div>
            </div>

            {/* Menu déroulant mobile */}
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <Button
                        text="Analyse d'images"
                            onClick={() => {
                                onShowImageAnalysis();
                                setIsMenuOpen(false);
                            }}
                            className="block text-gray-900 dark:text-white w-full"   
                        />
                        <Button 
                            text='Reconnaissance Vocale'
                            className="block text-gray-900 dark:text-white w-full"
                            onClick={() => {
                                navigate('/voice-recognition');
                                setIsMenuOpen(false);
                            }}
                        />
                        <Button 
                            text="Déconnexion" 
                            className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 w-full" 
                            onClick={handleLogout}
                        />
                    </div>
                </div>
            )}
        </nav>
    );
};

const FeatureCard = ({ icon, title, description, subDescription, progress }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-4 mb-6">
            <div className="h-14 w-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                <div className="text-indigo-600 dark:text-indigo-400">{icon}</div>
            </div>
            <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
            </div>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            {subDescription}
        </p>
        <div className="mt-4">
            <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full">
                <div 
                    className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
                <span>Précision</span>
                <span>{progress}%</span>
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const { user, isLoggedIn } = useAuth();
    const navigate = useNavigate();
    
    // Utiliser useEffect pour la redirection
    useEffect(() => {
        if (!isLoggedIn()) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <DashboardNav/>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="grid grid-cols-1 gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <FeatureCard
                                icon={assets.vision}
                                title="Vision AI"
                                description="Analyse d'images"
                                subDescription="Détection d'objets, OCR, et plus encore"
                                progress={85}
                            />
                            <FeatureCard
                                icon={assets.voice}
                                title="Voice AI"
                                description="Analyse vocale"
                                subDescription="Reconnaissance vocale et analyse de sentiment"
                                progress={75}
                            />
                            <FeatureCard
                                icon={assets.model3d}
                                title="3D AI"
                                description="Modélisation 3D"
                                subDescription="Génération et analyse de modèles 3D"
                                progress={65}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;