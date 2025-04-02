import React from 'react';
import { useNavigate } from 'react-router-dom';

const ImageAnalysisHistory = ({ 
    userAnalyses, 
    loadingAnalyses, 
    selectedAnalysis, 
    setSelectedAnalysis, 
    toggleHistory 
}) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Historique des analyses</h2>
            
            {loadingAnalyses ? (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                </div>
            ) : userAnalyses.length === 0 ? (
                <div className="text-center py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="text-gray-600 dark:text-gray-300">Aucune analyse d'image disponible.</p>
                    <button
                        onClick={toggleHistory}
                        className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors shadow-sm hover:shadow-md"
                    >
                        Créer une nouvelle analyse
                    </button>
                </div>
            ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    {userAnalyses.map((analysis) => (
                        <div 
                            key={analysis.id}
                            className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                                selectedAnalysis && selectedAnalysis.id === analysis.id 
                                ? 'bg-indigo-50 dark:bg-indigo-900/30 border-l-4 border-indigo-500 shadow-md' 
                                : 'bg-gray-50 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
                            }`}
                            onClick={() => setSelectedAnalysis(analysis)}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white">
                                        {analysis.title || "Sans titre"}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(analysis.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                    analysis.status === 'completed' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                    : analysis.status === 'failed'
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                }`}>
                                    {analysis.status === 'completed' ? 'Terminé' 
                                    : analysis.status === 'failed' ? 'Échoué' 
                                    : 'En cours'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageAnalysisHistory;
