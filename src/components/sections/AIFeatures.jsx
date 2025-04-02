import React from 'react';

const FeatureCard = ({ icon, title, description, techDescription }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
        <div className="text-sm text-gray-500 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
            {techDescription}
        </div>
    </div>
);

const AIFeatures = () => {
    const features = [
        {
            icon: (
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 5V3M12 21V19M5 12H3M21 12H19M18.364 18.364L16.95 16.95M7.05 7.05L5.636 5.636M18.364 5.636L16.95 7.05M7.05 16.95L5.636 18.364" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            ),
            title: "Computer Vision",
            description: "Analyse et traitement d'images en temps réel pour évaluer les gestes techniques",
            techDescription: "Utilisation d'algorithmes de détection de mouvements et de posture pour une analyse précise des gestes professionnels"
        },
        {
            icon: (
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 10V12C19 15.866 15.866 19 12 19M5 10V12C5 15.866 8.13401 19 12 19M12 19V22M8 22H16M12 15C10.3431 15 9 13.6569 9 12V5C9 3.34315 10.3431 2 12 2C13.6569 2 15 3.34315 15 5V12C15 13.6569 13.6569 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            ),
            title: "IA Vocale",
            description: "Génération et compréhension vocale avancée pour un feedback interactif",
            techDescription: "Technologie de traitement du langage naturel pour des interactions vocales fluides et personnalisées"
        },
        {
            icon: (
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 7.5L12 2L3 7.5M21 7.5L12 13M21 7.5V16.5L12 22M12 13L3 7.5M12 13V22M3 7.5V16.5L12 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            ),
            title: "3D Interactive",
            description: "Présentation et interaction en 3D pour une expérience immersive",
            techDescription: "Modélisation 3D interactive permettant une visualisation détaillée des techniques et mouvements"
        }
    ];

    return (
        <section className="py-20 px-4 md:px-6 lg:px-10">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-block px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-6">
                        Technologies Intégrées
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                        Les technologies au cœur de notre solution
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Notre plateforme combine trois technologies d'IA avancées pour offrir une expérience d'apprentissage complète et interactive
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <div className="inline-flex items-center px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-full text-sm text-indigo-600 dark:text-indigo-400">
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        Toutes nos technologies respectent les standards de l'industrie
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AIFeatures;
