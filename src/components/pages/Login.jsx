import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import assets from '../../assets/assets';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        general: ''
    });
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Charger les identifiants sauvegardés au chargement
    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
            setFormData(prev => ({
                ...prev,
                email: savedEmail,
                rememberMe: true
            }));
        }
    }, []);

    // Afficher le message de succès de réinitialisation si présent
    useEffect(() => {
        const message = location.state?.message;
        if (message) {
            setErrors(prev => ({
                ...prev,
                general: message
            }));
            // Nettoyer le message après l'avoir affiché
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            return "L'email est requis";
        }
        if (!emailRegex.test(email)) {
            return "Format d'email invalide";
        }
        return "";
    };

    const validatePassword = (password) => {
        if (!password) {
            return "Le mot de passe est requis";
        }
        if (password.length < 6) {
            return "Le mot de passe doit contenir au moins 6 caractères";
        }
        return "";
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setFormData(prev => ({
            ...prev,
            [name]: newValue
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
        
        const emailError = validateEmail(formData.email);
        const passwordError = validatePassword(formData.password);
        
        if (emailError || passwordError) {
            setErrors({
                email: emailError,
                password: passwordError,
                general: ''
            });
            return;
        }

        setIsLoading(true);
        setErrors({ email: '', password: '', general: '' });

        try {
            const result = await login(formData.email, formData.password);
            
            if (result.success) {
                // Gérer "Se souvenir de moi"
                if (formData.rememberMe) {
                    localStorage.setItem('rememberedEmail', formData.email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }
                
                navigate('/dashboard');
            } else {
                setErrors({
                    email: '',
                    password: '',
                    general: result.message || 'Email ou mot de passe incorrect'
                });
            }
        } catch (error) {
            setErrors({
                email: '',
                password: '',
                general: 'Une erreur est survenue. Veuillez réessayer.'
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
                        Connexion
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Ou{' '}
                        <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                            créer un nouveau compte
                        </Link>
                    </p>
                </div>

                {errors.general && (
                    <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm text-center">
                        {errors.general}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email
                            </label>
                            <div className="mt-1 relative flex items-center">
                                <div className='absolute left-3 text-gray-500'>{assets.email}</div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    placeholder='exemple@exemple.com'
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`appearance-none block w-full px-3 py-2 pl-10 border ${
                                        errors.email ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm`}
                                />
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Mot de passe
                            </label>
                            <div className="mt-1 relative flex items-center">
                                <div className='absolute left-3 text-gray-500'>{assets.lock}</div>
                                <input
                                    id="password"
                                    name="password"
                                    placeholder='........'
                                    type={isPasswordOpen ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`appearance-none block w-full px-3 py-2 pl-10 border ${
                                        errors.password ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm pr-10`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsPasswordOpen(!isPasswordOpen)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {isPasswordOpen ? assets.eyeOpen : assets.eyeClosed}
                                </button>
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="rememberMe"
                                name="rememberMe"
                                type="checkbox"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                            />
                            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900 dark:text-gray-300 cursor-pointer">
                                Se souvenir de moi
                            </label>
                        </div>

                        <div className="text-sm">
                            <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                                Mot de passe oublié ?
                            </Link>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {isLoading ? 'Connexion...' : 'Se connecter'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
