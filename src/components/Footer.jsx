import React from 'react';
import assets from '../assets/assets';

const FooterSection = ({ title, links }) => (
    <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
        <ul className="space-y-3">
            {links.map((link, index) => (
                <li key={index}>
                    <a 
                        href={link.href} 
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                        {link.text}
                    </a>
                </li>
            ))}
        </ul>
    </div>
);

const Footer = () => {
    const sections = [
        {
            title: "Formations",
            links: [
                { text: "Catalogue des formations", href: "#" },
                { text: "Parcours personnalisés", href: "#" },
                { text: "Certifications", href: "#" },
                { text: "Formateurs experts", href: "#" }
            ]
        },
        {
            title: "Technologies",
            links: [
                { text: "Computer Vision", href: "#" },
                { text: "IA Vocale", href: "#" },
                { text: "3D Interactive", href: "#" },
                { text: "Analyse temps réel", href: "#" }
            ]
        },
        {
            title: "Entreprise",
            links: [
                { text: "À propos", href: "#" },
                { text: "Carrières", href: "#" },
                { text: "Blog", href: "#" },
                { text: "Contact", href: "#" }
            ]
        },
        {
            title: "Légal",
            links: [
                { text: "Conditions d'utilisation", href: "#" },
                { text: "Politique de confidentialité", href: "#" },
                { text: "Mentions légales", href: "#" },
                { text: "RGPD", href: "#" }
            ]
        }
    ];

    return (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {sections.map((section, index) => (
                        <FooterSection key={index} {...section} />
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        {/* Logo and Copyright */}
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center">
                                <span className="text-white font-bold">SM</span>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                © 2025 SkillMentor. Tous droits réservés.
                            </span>
                        </div>

                        {/* Social Links */}
                        <div className="flex space-x-4">
                            {['twitter', 'linkedin', 'github'].map((platform) => (
                                <a
                                    key={platform}
                                    href={`#${platform}`}
                                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                                >
                                    <span className="sr-only">{platform}</span>
                                    {assets[platform]}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
