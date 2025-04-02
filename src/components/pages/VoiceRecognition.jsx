import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/auth.service';

const API_BASE_URL = 'http://localhost:5000/api';

const VoiceRecognition = () => {
    const navigate = useNavigate();
    const { isLoggedIn, user } = useAuth();
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState('');
    const [recognition, setRecognition] = useState(null);
    const [conversation, setConversation] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const conversationEndRef = useRef(null);

    useEffect(() => {
        const validateAuth = async () => {
            if (!isLoggedIn()) {
                navigate('/login');
                return;
            }
            
            // Forcer un rafraîchissement du token avant de charger l'historique
            await authService.refreshToken();
        };
        
        validateAuth();

        loadHistory();

        // Initialisation de la reconnaissance vocale
        if ('webkitSpeechRecognition' in window) {
            try {
                const recognition = new window.webkitSpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = 'fr-FR';

                recognition.onstart = () => {
                    setIsListening(true);
                    setError('');
                };

                recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    setTranscript(transcript);
                    processTranscript(transcript);
                };

                recognition.onerror = (event) => {
                    console.error('Erreur de reconnaissance vocale:', event.error);
                    setError('Erreur lors de la reconnaissance vocale: ' + event.error);
                    setIsListening(false);
                };

                recognition.onend = () => {
                    setIsListening(false);
                };

                setRecognition(recognition);
            } catch (error) {
                console.error('Erreur lors de l\'initialisation de la reconnaissance vocale:', error);
                setError('Erreur lors de l\'initialisation de la reconnaissance vocale');
            }
        } else {
            setError('La reconnaissance vocale n\'est pas supportée par votre navigateur');
        }

        // Initialisation de la synthèse vocale
        if ('speechSynthesis' in window) {
            // Charger les voix disponibles
            window.speechSynthesis.onvoiceschanged = () => {
                const voices = window.speechSynthesis.getVoices();
                const frenchVoice = voices.find(voice => voice.lang.includes('fr'));
                if (frenchVoice) {
                    console.log('Voix française trouvée:', frenchVoice.name);
                }
            };
        }

        // Cleanup
        return () => {
            if (recognition) {
                recognition.stop();
            }
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, [navigate, isLoggedIn]);

    // Faire défiler automatiquement vers le bas lorsque de nouveaux messages sont ajoutés
    useEffect(() => {
        if (conversationEndRef.current) {
            conversationEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [conversation]);

    const loadHistory = async () => {
        try {
            if (!user || !user.token) {
                throw new Error('Non authentifié');
            }
            
            const response = await fetch(`${API_BASE_URL}/voice/history`, {
                headers: { 
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const data = await response.json();
            if (data.success && data.history) {
                setConversation(data.history);
            }
        } catch (error) {
            console.error('Erreur lors du chargement de l\'historique:', error);
            setError(`Erreur lors du chargement de l'historique: ${error.message}`);
        }
    };

    const speakText = (text) => {
        if ('speechSynthesis' in window && !isSpeaking) {
            try {
                // Annuler toute synthèse vocale en cours
                window.speechSynthesis.cancel();

                // Découper le texte en phrases
                const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
                let currentIndex = 0;

                const speakNextSentence = () => {
                    if (currentIndex < sentences.length) {
                        const utterance = new SpeechSynthesisUtterance(sentences[currentIndex].trim());
                
                        // Trouver une voix française
                        const voices = window.speechSynthesis.getVoices();
                        const frenchVoice = voices.find(voice => voice.lang.includes('fr'));
                        if (frenchVoice) {
                            utterance.voice = frenchVoice;
                        }

                        utterance.lang = 'fr-FR';
                        utterance.rate = 1.0;  // Vitesse normale
                        utterance.pitch = 1.0; // Hauteur normale
                        utterance.volume = 1.0; // Volume maximum

                        utterance.onstart = () => {
                            console.log('Début de la synthèse vocale de la phrase', currentIndex + 1);
                            setIsSpeaking(true);
                        };

                        utterance.onend = () => {
                            console.log('Fin de la synthèse vocale de la phrase', currentIndex + 1);
                            currentIndex++;
                            if (currentIndex < sentences.length) {
                                speakNextSentence();
                            } else {
                                setIsSpeaking(false);
                            }
                        };

                        utterance.onerror = (event) => {
                            console.error('Erreur de synthèse vocale:', event);
                            setError('Erreur lors de la synthèse vocale');
                            setIsSpeaking(false);
                        };

                        window.speechSynthesis.speak(utterance);
                    }
                };

                speakNextSentence();
            } catch (error) {
                console.error('Erreur lors de la synthèse vocale:', error);
                setError('Erreur lors de la synthèse vocale');
                setIsSpeaking(false);
            }
        } else if (!('speechSynthesis' in window)) {
            setError('La synthèse vocale n\'est pas supportée par votre navigateur');
        }
    };

    const processTranscript = async (text) => {
        if (!text.trim()) return;

        setIsProcessing(true);
        setError('');
        
        try {
            console.log('Envoi de la requête au serveur:', text);
            
            if (!user || !user.token) {
                throw new Error('Non authentifié');
            }
            
            // Récupérer le contexte récent de la conversation
            const conversationContext = conversation.slice(-4).map(msg => ({ 
                role: msg.sender === 'Utilisateur' ? 'user' : 'assistant', 
                content: msg.text 
            }));
            
            // Ajouter une instruction système si le contexte est vide
            if (conversationContext.length === 0) {
                conversationContext.unshift({
                    role: 'system',
                    content: 'Tu es un assistant virtuel qui répond TOUJOURS en français. Ne réponds jamais en anglais.'
                });
            }
            
            const response = await fetch(`${API_BASE_URL}/voice/process`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    message: text,
                    context: conversationContext
                })
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const data = await response.json();
            console.log('Réponse du serveur:', data);

            if (data.success && data.reply) {
                // Mettre à jour la conversation avec le nouveau message
                const newMessages = [
                    { sender: 'Utilisateur', text },
                    { sender: 'Assistant', text: data.reply }
                ];
                
                setConversation(prev => [...prev, ...newMessages]);
                
                // Sauvegarder la conversation dans l'historique
                saveConversationToHistory(text, data.reply);

                // Attendre un court instant avant de lire la réponse
                setTimeout(() => {
                    speakText(data.reply);
                }, 500);
            } else {
                throw new Error(data.error || 'Réponse invalide du serveur');
            }
        } catch (error) {
            console.error('Erreur lors du traitement:', error);
            setError(`Erreur lors du traitement: ${error.message}`);
            setConversation(prev => [...prev, { sender: 'Utilisateur', text }]);
        } finally {
            setIsProcessing(false);
            setTranscript('');
        }
    };

    const startListening = () => {
        if (recognition && !isListening) {
            setTranscript('');
            setError('');
            recognition.start();
        }
    };

    const stopListening = () => {
        if (recognition && isListening) {
            recognition.stop();
        }
    };

    const stopSpeaking = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    const goToDashboard = () => {
        navigate('/dashboard');
    };

    // Fonction pour sauvegarder la conversation dans l'historique
    const saveConversationToHistory = async (userMessage, assistantReply) => {
        try {
            if (!user || !user.token) return;
            
            await fetch(`${API_BASE_URL}/voice/save-history`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userMessage,
                    assistantReply
                })
            });
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de l\'historique:', error);
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
            {/* En-tête fixe avec boutons de contrôle */}
            <div className="bg-white dark:bg-gray-800 shadow-md py-4 px-6 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto flex flex-col sm:flex-row justify-between items-center">
                    <div className="flex items-center mb-4 sm:mb-0">
                        <div className="fixed top-4 left-4 z-50">
                            <button
                                onClick={goToDashboard}
                                className="flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg shadow-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
                                aria-label="Retour au tableau de bord"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                            </div>
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Reconnaissance Vocale
                        </h1>
                    </div>
                    
                    <div className="flex space-x-2">
                        <button
                            onClick={startListening}
                            disabled={isListening || isProcessing}
                            className={`px-4 py-2 rounded-md text-white ${
                                isListening || isProcessing
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                            {isListening ? 'En écoute...' : 'Commencer l\'écoute'}
                        </button>
                        <button
                            onClick={stopListening}
                            disabled={!isListening}
                            className={`px-4 py-2 rounded-md text-white ${
                                !isListening
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-red-600 hover:bg-red-700'
                            }`}
                        >
                            Arrêter l'écoute
                        </button>
                        {isSpeaking && (
                            <button
                                onClick={stopSpeaking}
                                className="px-4 py-2 rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
                            >
                                Arrêter la voix
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Contenu principal avec défilement */}
            <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                            {error}
                        </div>
                    )}

                    {transcript && (
                        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
                            <p className="text-gray-900 dark:text-gray-100">{transcript}</p>
                        </div>
                    )}

                    {/* Conteneur de la conversation avec hauteur maximale et défilement */}
                    <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-4">
                        <div className="space-y-4 max-h-[calc(100vh-240px)] overflow-y-auto">
                            {conversation.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    <p>Aucune conversation pour le moment.</p>
                                    <p>Commencez à parler pour interagir avec l'assistant vocal.</p>
                                </div>
                            ) : (
                                conversation.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`p-4 rounded-lg ${
                                            msg.sender === 'Utilisateur'
                                                ? 'bg-blue-100 dark:bg-blue-900 ml-auto'
                                                : 'bg-gray-100 dark:bg-gray-700 mr-auto'
                                        } max-w-[80%] ${msg.sender === 'Utilisateur' ? 'ml-auto' : 'mr-auto'}`}
                                    >
                                        <p className="font-semibold mb-1 text-gray-900 dark:text-white">
                                            {msg.sender}
                                        </p>
                                        <p className="text-gray-800 dark:text-gray-200">{msg.text}</p>
                                    </div>
                                ))
                            )}
                            <div ref={conversationEndRef} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoiceRecognition;