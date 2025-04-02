import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import assets from '../../assets/assets';
import { useAuth } from '../../context/AuthContext';

const ForgotPassword = () => {
    const { forgotPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email) {
            setStatus({
                type: 'error',
                message: "Veuillez entrer votre adresse email"
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setStatus({
                type: 'error',
                message: "Format d'email invalide"
            });
            return;
        }

        setIsLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await forgotPassword(email);
            
            if (response.success) {
                setStatus({
                    type: 'success',
                    message: "Si un compte existe avec cette adresse email, vous recevrez les instructions de réinitialisation."
                });
                setEmail('');
            } else {
                setStatus({
                    type: 'error',
                    message: response.message || "Une erreur est survenue. Veuillez réessayer."
                });
            }
        } catch (error) {
            setStatus({
                type: 'error',
                message: "Une erreur est survenue lors de la connexion au serveur. Veuillez réessayer."
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-200 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                <div className="text-center">
                    <div className="w-12 h-12 bg-indigo-600 dark:bg-indigo-500 rounded-xl mx-auto flex items-center justify-center mb-4">
                        <span className="text-white text-xl font-bold">SM</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Mot de passe oublié ?
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Entrez votre email pour recevoir les instructions de réinitialisation
                    </p>
                </div>

                {status.message && (
                    <div className={`${
                        status.type === 'error' 
                            ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                            : 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    } p-3 rounded-lg text-sm`}>
                        {status.message}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Adresse email
                        </label>
                        <div className="mt-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 dark:text-gray-500">
                                {assets.email}
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                placeholder="vous@exemple.com"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                               assets.isLoadingIcon
                            ) : (
                                'Envoyer les instructions'
                            )}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link 
                            to="/login"
                            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                            Retour à la connexion
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;