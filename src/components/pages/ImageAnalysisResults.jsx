import React from 'react';

const ImageAnalysisResults = ({ results }) => {
    if (!results) return null;

    return (
        <div className="space-y-6">
            {/* Description */}
            {results.description && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                        Description
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <p className="text-gray-700 dark:text-gray-300">{results.description}</p>
                    </div>
                </div>
            )}

            {/* Détection de texte */}
            {results.textDetection && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Texte détecté
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{results.textDetection.text}</p>
                        {results.textDetection.words && results.textDetection.words.length > 0 && (
                            <div className="mt-4">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Mots détectés</h4>
                                <div className="flex flex-wrap gap-2">
                                    {results.textDetection.words.map((word, index) => (
                                        <span 
                                            key={index}
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                            title={`Confiance: ${Math.round(word.confidence)}%`}
                                        >
                                            {word.text}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Détection de visages */}
            {results.faceDetection && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Détection de visages
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <p className="text-gray-700 dark:text-gray-300">
                            {results.faceDetection.count} visage{results.faceDetection.count !== 1 ? 's' : ''} détecté{results.faceDetection.count !== 1 ? 's' : ''}
                        </p>
                        {results.faceDetection.faces.map((face, index) => (
                            <div key={index} className="mt-2 p-2 bg-gray-100 dark:bg-gray-600 rounded">
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Position: ({Math.round(face.box.x)}, {Math.round(face.box.y)})
                                    <br />
                                    Taille: {Math.round(face.box.width)}x{Math.round(face.box.height)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Propriétés de l'image */}
            {results.imageProperties && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Propriétés de l'image
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        {/* Score de qualité */}
                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Score de qualité</h4>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                                <div 
                                    className="bg-blue-600 h-2.5 rounded-full" 
                                    style={{ width: `${results.imageProperties.score}%` }}
                                ></div>
                            </div>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                {results.imageProperties.score}/100
                            </p>
                        </div>

                        {/* Dimensions et format */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Dimensions</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {results.imageProperties.width} × {results.imageProperties.height} pixels
                                </p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Format</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {results.imageProperties.format.toUpperCase()}
                                </p>
                            </div>
                        </div>

                        {/* Couleurs dominantes */}
                        {results.imageProperties.colors && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Couleurs dominantes</h4>
                                <div className="flex gap-2">
                                    {Object.entries(results.imageProperties.colors.dominant).map(([channel, value], index) => (
                                        <div 
                                            key={channel}
                                            className="flex flex-col items-center"
                                        >
                                            <div 
                                                className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600"
                                                style={{ backgroundColor: `rgb(${value}, ${value}, ${value})` }}
                                            />
                                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {channel}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}


            {/* Image analysée */}
            {results.imageUrl && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Image analysée
                    </h3>
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                        <img
                            src={results.imageUrl}
                            alt="Image analysée"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageAnalysisResults;
