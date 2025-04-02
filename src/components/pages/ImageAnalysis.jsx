import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as faceapi from 'face-api.js';
import { createWorker } from 'tesseract.js';
import ImageAnalysisForm from './ImageAnalysisForm';
import ImageAnalysisResults from './ImageAnalysisResults';
import axios from 'axios';
import ImageAnalysisHistory from './ImageAnalysisHistory';
import authService from '../../services/auth.service';

const API_BASE_URL = 'http://localhost:5000/api';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const ImageAnalysis = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [showHistory, setShowHistory] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedAnalysis, setSelectedAnalysis] = useState(null);
    const [userAnalyses, setUserAnalyses] = useState([]);
    const [loadingAnalyses, setLoadingAnalyses] = useState(false);
    const [notification, setNotification] = useState(null);

    // Afficher une notification
    const showNotification = useCallback((message, type = 'error') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    }, []);

    // Validation du fichier
    const validateFile = (file) => {
        if (!file) return 'Veuillez sélectionner un fichier';
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
            return 'Type de fichier non supporté. Utilisez JPG, PNG ou WebP';
        }
        if (file.size > MAX_FILE_SIZE) {
            return 'Fichier trop volumineux. Maximum 5MB';
        }
        return null;
    };

    // Gestion du changement de fichier
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log('Fichier sélectionné:', file.name);
            const validationError = validateFile(file);
            if (validationError) {
                setError(validationError);
                setSelectedFile(null);
            } else {
                setSelectedFile(file);
                setError(null);
                if (!title) {
                    setTitle(file.name.split('.')[0]);
                }
            }
        } else {
            setSelectedFile(null);
            setError('Aucun fichier sélectionné');
        }
    };

    // Soumission du formulaire
    

    // Vérification du statut de l'analyse
    const checkAnalysisStatus = (id) => {
        try {
            const analysis = userAnalyses.find(a => a.id === id);
            if (analysis) {
                setSelectedAnalysis(analysis);
                setLoading(false);
            } else {
                setError('Analyse non trouvée');
                setLoading(false);
            }
        } catch (error) {
            console.error('Erreur lors de la vérification du statut:', error);
            setError('Erreur lors de la vérification du statut');
            setLoading(false);
        }
    };

    // Récupération des analyses de l'utilisateur
    const fetchUserAnalyses = useCallback(async () => {
        try {
            const token = authService.getCurrentUser()?.token;
            console.log('Token pour fetchUserAnalyses:', !!token);
            setLoadingAnalyses(true);
            const response = await axios.get(`${API_BASE_URL}/vision/user-analyses`, {
                headers: {
                    'Authorization': `Bearer ${authService.getCurrentUser()?.token}`
                }
            });
            
            if (response.data.success) {
                setUserAnalyses(response.data.analyses);
            } else {
                throw new Error(response.data.error);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des analyses:', error);
            showNotification('Erreur lors de la récupération des analyses', 'error');
        } finally {
            setLoadingAnalyses(false);
        }
    }, [showNotification]);

    // Basculer entre l'historique et le formulaire
    const toggleHistory = useCallback(() => {
        setShowHistory(!showHistory);
        setSelectedAnalysis(null);
        setError(null);
    }, [showHistory]);

    // Vérification de l'authentification et chargement initial
    useEffect(() => {
        const checkAuth = async () => {
            const currentUser = authService.getCurrentUser();
            if (!currentUser || !currentUser.token) {
                navigate('/login');
                return;
            }
            
            try {
                await axios.get(`${API_BASE_URL}/auth/verify`, {
                    headers: {
                        'Authorization': `Bearer ${currentUser.token}`
                    }
                });
                fetchUserAnalyses();
            } catch (error) {
                console.error('Erreur de vérification:', error);
                navigate('/login');
            }
        };
        
        checkAuth();
    }, [navigate, fetchUserAnalyses]);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12">
            {/* Bouton de retour */}
            <div className="fixed top-4 left-4 z-50">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                    aria-label="Retour au tableau de bord"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            {/* Notifications */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md shadow-lg ${
                    notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                }`}>
                    {notification.message}
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Analyse d'images
                    </h1>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                {showHistory ? 'Historique des analyses' : 'Nouvelle analyse d\'image'}
                            </h2>
                            <button
                                onClick={toggleHistory}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors shadow-md hover:shadow-lg"
                            >
                                {showHistory ? 'Nouvelle analyse' : 'Voir mes analyses'}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {showHistory ? (
                                <>
                                    <ImageAnalysisHistory
                                        userAnalyses={userAnalyses}
                                        loadingAnalyses={loadingAnalyses}
                                        selectedAnalysis={selectedAnalysis}
                                        setSelectedAnalysis={setSelectedAnalysis}
                                        toggleHistory={toggleHistory}
                                    />
                                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                                            Résultats d'analyse
                                        </h2>
                                        <ImageAnalysisResults results={selectedAnalysis} />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <ImageAnalysisForm
                                        title={title}
                                        setTitle={setTitle}
                                        selectedFile={selectedFile}
                                        handleFileChange={handleFileChange}
                                        loading={loading}
                                        uploadProgress={uploadProgress}
                                        error={error}
                                    />
                                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                                            Résultats de l'analyse
                                        </h2>
                                        <ImageAnalysisResults results={selectedAnalysis} />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageAnalysis;