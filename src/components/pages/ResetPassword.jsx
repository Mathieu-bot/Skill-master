import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import assets from '../../assets/assets';
import { useAuth } from '../../context/AuthContext';

const ResetPassword = () => {
    const { resetPassword } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({
        password: '',
        confirmPassword: '',
        general: ''
    });
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);
    const [isConfirmPasswordOpen, setIsConfirmPasswordOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Vérifier si un token est présent
    if (!token) {
        return (
            <div className="min-h-screen bg-gray-200 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center">
                    <div className="text-red-600 dark:text-red-400">
                        Lien de réinitialisation invalide ou expiré.
                        <div className="mt-4">
                            <Link 
                                to="/forgot-password"
                                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                                Demander un nouveau lien
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const validateForm = () => {
        const newErrors = {
            password: '',
            confirmPassword: '',
            general: ''
        };

        if (!formData.password) {
            newErrors.password = 'Le mot de passe est requis';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== '');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setErrors({ password: '', confirmPassword: '', general: '' });

        try {
            const response = await resetPassword(token, formData.password);
            
            if (response.success) {
                navigate('/login', { 
                    state: { 
                        message: 'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.' 
                    }
                });
            } else {
                setErrors(prev => ({
                    ...prev,
                    general: response.message || 'Une erreur est survenue lors de la réinitialisation. Veuillez réessayer.'
                }));
            }
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                general: 'Une erreur est survenue lors de la connexion au serveur. Veuillez réessayer.'
            }));
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
                        Réinitialiser le mot de passe
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Choisissez un nouveau mot de passe sécurisé
                    </p>
                </div>

                {errors.general && (
                    <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
                        {errors.general}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Nouveau mot de passe */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Nouveau mot de passe
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 dark:text-gray-500">
                                    {assets.lock}
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={isPasswordOpen ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`appearance-none block w-full pl-10 pr-10 py-2 border ${
                                        errors.password ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsPasswordOpen(!isPasswordOpen)}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                >
                                    {isPasswordOpen ? assets.eyeOpen : assets.eyeClosed}
                                </button>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                                )}
                            </div>
                        </div>

                        {/* Confirmer le nouveau mot de passe */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Confirmer le nouveau mot de passe
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 dark:text-gray-500">
                                    {assets.lock}
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={isConfirmPasswordOpen ? "text" : "password"}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`appearance-none block w-full pl-10 pr-10 py-2 border ${
                                        errors.confirmPassword ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsConfirmPasswordOpen(!isConfirmPasswordOpen)}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                >
                                    {isConfirmPasswordOpen ? assets.eyeOpen : assets.eyeClosed}
                                </button>
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                'Réinitialiser le mot de passe'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;