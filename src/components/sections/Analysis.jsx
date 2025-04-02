import React from 'react';

const FeaturePoint = ({ title, description }) => (
    <div className="flex gap-3 items-start">
        <div className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mt-1">
            <div className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
        </div>
        <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
        </div>
    </div>
);

const Analysis = () => {
    const features = [
        {
            title: "Détection précise des mouvements",
            description: "Capture des mouvements avec une précision de 98%, même dans des conditions d'éclairage variables."
        },
        {
            title: "Comparaison avec les experts",
            description: "Analyse comparative entre les gestes de l'apprenant et ceux des experts du domaine."
        },
        {
            title: "Suggestions d'amélioration",
            description: "Recommandations personnalisées pour corriger et perfectionner les techniques professionnelles."
        }
    ];

    const metrics = [
        { label: "Position des mains", status: "Correct" },
        { label: "Angle du poignet", status: "Ajustement nécessaire" },
        { label: "Pression appliquée", status: "Correct" }
    ];

    return (
        <section className="py-20 px-4 md:px-6 lg:px-10 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left side - Image and Analysis Card */}
                    <div className="relative">
                        <div className="rounded-2xl flex items-center overflow-hidden shadow-xl max-h-[500px]">
                            <img 
                                src="src/assets/analysis.jpg" 
                                alt="Analyse de gestes techniques" 
                                className="w-full"
                            />
                            {/* Analysis Overlay */}
                            <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Analyse en cours...
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {metrics.map((metric, index) => (
                                        <div key={index} className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {metric.label}
                                            </span>
                                            <span className={`text-sm font-medium ${
                                                metric.status === "Correct" 
                                                    ? "text-green-500" 
                                                    : "text-yellow-500"
                                            }`}>
                                                {metric.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Text Content */}
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                            Analyse de gestes techniques en temps réel
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            Notre technologie de vision par ordinateur analyse chaque mouvement et fournit un feedback instantané pour améliorer la précision et l'efficacité des gestes techniques.
                        </p>
                        <div className="space-y-6">
                            {features.map((feature, index) => (
                                <FeaturePoint key={index} {...feature} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Analysis;
