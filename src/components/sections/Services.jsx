import React from 'react';
import assets from '../../assets/assets';

const ServiceCard = ({ icon, title, description, longDescription }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-6">
            <div className="text-indigo-600 dark:text-indigo-400">{icon}</div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{description}</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{longDescription}</p>
    </div>
);

const Services = () => {
    const services = [
        {
            icon: assets.vision,
            title: "Vision par Ordinateur",
            description: "Analyse des gestes et mouvements techniques en temps réel",
            longDescription: "Notre technologie de vision par ordinateur capture et analyse les mouvements avec précision, permettant d'évaluer la qualité des gestes techniques dans divers métiers."
        },
        {
            icon: assets.feedback,
            title: "Feedback Intelligent",
            description: "Conseils personnalisés sur l'analyse des performances",
            longDescription: "L'IA analyse les performances et fournit des retours détaillés et personnalisés, identifiant les points forts et les axes d'amélioration spécifiques à chaque apprenant."
        },
        {
            icon: assets.progression,
            title: "Certification des Compétences",
            description: "Validation objective des compétences acquises",
            longDescription: "Notre système certifie les compétences de manière objective et standardisée, garantissant que les apprenants maîtrisent réellement les techniques professionnelles requises."
        }
    ];

    return (
        <section className="py-20 px-4 md:px-6 lg:px-10 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                        Comment l'IA révolutionne la formation professionnelle
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto dark:text-gray-400">
                        Notre plateforme utilise des technologies avancées pour offrir une expérience d'apprentissage unique
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <ServiceCard key={index} {...service} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
