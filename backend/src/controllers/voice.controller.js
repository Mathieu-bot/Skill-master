const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
require('dotenv').config();

// Initialisation d'OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Initialisation de Gemini
const geminiApi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

let conversationHistory = new Map();

// Détection de salutation simple
const isSimpleGreeting = (text) => {
    return /^(bonjour|salut|hello|coucou|bonsoir|hey)(\s|$)/i.test(text.trim());
};

// Réponses prédéfinies pour les salutations simples
const getGreetingResponse = () => {
    const greetings = [
        "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
        "Bonjour ! Que puis-je faire pour vous ?",
        "Bonjour ! Je suis là pour répondre à vos questions."
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
};

// Fonction pour nettoyer et vérifier que la réponse est bien en français
const sanitizeResponse = (response) => {
    // Si la réponse commence en anglais, la rejeter
    if (/^(hello|hi|welcome|good morning|good afternoon|dear)/i.test(response.substring(0, 20).toLowerCase())) {
        return "Désolé, je n'ai pas pu générer une réponse appropriée. Comment puis-je vous aider aujourd'hui?";
    }
    
    // Limiter la longueur de la réponse
    if (response.length > 500) {
        return response.substring(0, 500) + "...";
    }
    
    return response;
};

const processVoiceInput = async (req, res) => {
    try {
        const { message, context } = req.body;
        const userId = req.user.id;

        if (!message) {
            return res.status(400).json({ error: 'Message requis' });
        }

        // Pour les salutations simples, retourner une réponse prédéfinie
        if (isSimpleGreeting(message)) {
            const reply = getGreetingResponse();
            
            if (!conversationHistory.has(userId)) {
                conversationHistory.set(userId, []);
            }
            
            const userHistory = conversationHistory.get(userId);
            userHistory.push(
                { sender: 'Utilisateur', text: message },
                { sender: 'Assistant', text: reply }
            );
            
            return res.json({ success: true, reply, history: userHistory, source: 'predefined' });
        }

        if (!conversationHistory.has(userId)) {
            conversationHistory.set(userId, []);
        }

        const userHistory = conversationHistory.get(userId);
        let reply = null;
        let apiError = null;
        let apiSource = null;

        try {
            const useOpenAI = process.env.USE_OPENAI === 'true';
            const useGemini = process.env.USE_GEMINI === 'true';
            const useHuggingFace = process.env.USE_HUGGINGFACE === 'true';

            // Déterminer la longueur maximale de la réponse en fonction de la complexité du message
            const maxTokens = message.length < 10 ? 50 : message.length < 30 ? 100 : 250;

            if (useOpenAI && process.env.OPENAI_API_KEY) {
                try {
                    const messages = [
                        { 
                            role: 'system', 
                            content: `Vous êtes un assistant virtuel qui répond de manière concise et pertinente. 
                            Adaptez la longueur de votre réponse à la complexité de la question. 
                            Pour une question simple, répondez en 1-2 phrases. 
                            Ne fournissez pas d'informations non demandées.
                            Répondez TOUJOURS en français, quelle que soit la langue de la question.`
                        }
                    ];

                    if (userHistory.length > 0) {
                        const recentHistory = userHistory.slice(-6); // Réduit à 6 messages récents
                        for (const entry of recentHistory) {
                            messages.push({
                                role: entry.sender === 'Utilisateur' ? 'user' : 'assistant',
                                content: entry.text
                            });
                        }
                    }

                    messages.push({ role: 'user', content: message });

                    const response = await openai.chat.completions.create({
                        model: 'gpt-3.5-turbo',
                        messages: messages,
                        max_tokens: maxTokens,
                        temperature: 0.7
                    });

                    if (response.choices && response.choices.length > 0) {
                        reply = sanitizeResponse(response.choices[0].message.content);
                        apiSource = 'openai';
                        userHistory.push(
                            { sender: 'Utilisateur', text: message },
                            { sender: 'Assistant', text: reply }
                        );
                        return res.json({ success: true, reply, history: userHistory, source: apiSource });
                    }
                } catch (error) {
                    console.error('Erreur OpenAI:', error);
                    apiError = error;
                }
            }

            if (useHuggingFace && process.env.HUGGINGFACE_API_KEY) {
                try {
                    // Construction d'un prompt plus intelligent
                    let contextPrompt;
                    
                    if (message.endsWith('?')) {
                        contextPrompt = `Réponds de façon concise en français à cette question: ${message}`;
                    } else {
                        contextPrompt = `Réponds brièvement en français au message suivant: ${message}`;
                    }
                    
                    const response = await axios.post(
                        `https://api-inference.huggingface.co/models/${process.env.HUGGINGFACE_MODEL}`,
                        { inputs: contextPrompt },
                        {
                            headers: {
                                'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    );

                    if (response.data && response.data.length > 0) {
                        // Extraction d'une réponse plus propre
                        let responseText = response.data[0].generated_text.trim();
                        
                        // Supprimer la répétition du prompt dans la réponse
                        if (responseText.includes(contextPrompt)) {
                            responseText = responseText.replace(contextPrompt, '').trim();
                        }
                        
                        // Supprimer les instructions de type "Réponse:" ou "Voici ma réponse:"
                        responseText = responseText.replace(/^(Réponse\s*:|Voici ma réponse\s*:|En français\s*:)/i, '').trim();
                        
                        reply = sanitizeResponse(responseText);
                        apiSource = 'huggingface';
                        userHistory.push(
                            { sender: 'Utilisateur', text: message },
                            { sender: 'Assistant', text: reply }
                        );
                        return res.json({ success: true, reply, history: userHistory, source: apiSource });
                    }
                } catch (error) {
                    console.error('Erreur Hugging Face:', error);
                    apiError = error;
                }
            }

            if (useGemini && process.env.GEMINI_API_KEY) {
                try {
                    const model = geminiApi.getGenerativeModel({ model: "gemini-pro" });
                    
                    // Instructions plus précises pour Gemini
                    const systemInstruction = "Tu es un assistant virtuel amical et efficace. Tes réponses doivent être concises, pertinentes et toujours en français. Adapte la longueur de ta réponse à la complexité de la question.";
                    
                    // Crée un chat avec des instructions initiales en français
                    const chat = model.startChat({ 
                        history: [
                            {
                                role: "user",
                                parts: [{ text: systemInstruction }]
                            },
                            {
                                role: "model",
                                parts: [{ text: "Compris. Je vais communiquer en français de façon concise et adaptée. Comment puis-je vous aider?" }]
                            }
                        ],
                        generationConfig: {
                            maxOutputTokens: maxTokens,
                            temperature: 0.7
                        }
                    });
                    
                    const result = await chat.sendMessage(message);
                    const response = await result.response;

                    if (response && response.text) {
                        reply = sanitizeResponse(response.text());
                        apiSource = 'gemini';
                        userHistory.push(
                            { sender: 'Utilisateur', text: message },
                            { sender: 'Assistant', text: reply }
                        );
                        return res.json({ success: true, reply, history: userHistory, source: apiSource });
                    }
                } catch (error) {
                    console.error('Erreur Gemini:', error);
                    apiError = error;
                }
            }

            // Si toutes les API ont échoué, utilisez une réponse de secours
            reply = "Désolé, je ne peux pas traiter votre demande pour le moment. Veuillez réessayer plus tard.";
            userHistory.push(
                { sender: 'Utilisateur', text: message },
                { sender: 'Assistant', text: reply }
            );
            return res.json({ success: true, reply, history: userHistory, source: 'fallback' });

        } catch (error) {
            console.error('Erreur lors du traitement:', error);
            res.status(500).json({ error: error.message });
        }
    } catch (error) {
        console.error('Erreur générale:', error);
        res.status(500).json({ error: 'Erreur serveur', details: error.message });
    }
};

const getHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const userHistory = conversationHistory.get(userId) || [];
        res.json({ success: true, history: userHistory });
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'historique:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

const saveHistory = async (req, res) => {
    try {
        const { userMessage, assistantReply } = req.body;
        const userId = req.user.id;

        if (!userMessage || !assistantReply) {
            return res.status(400).json({ error: 'Messages requis' });
        }

        if (!conversationHistory.has(userId)) {
            conversationHistory.set(userId, []);
        }

        const userHistory = conversationHistory.get(userId);
        userHistory.push(
            { sender: 'Utilisateur', text: userMessage },
            { sender: 'Assistant', text: assistantReply }
        );

        if (userHistory.length > 50) {
            userHistory.splice(0, 2);
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Erreur lors de la sauvegarde de l\'historique:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

module.exports = {
    processVoiceInput,
    getHistory,
    saveHistory
};