import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'API_KEY';

const genAI = new GoogleGenerativeAI(API_KEY);

export const translateText = async (text, sourceLang, targetLang) => {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Translate this text from ${sourceLang} to ${targetLang}. Only return the translation: "${text}"`
                    }]
                }]
            })
        });

        const data = await response.json();
        console.log('API Response:', data);

        if (!response.ok) {
            throw new Error(data.error?.message || 'API yanıt hatası');
        }

        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text.trim();
        } else {
            throw new Error('Çeviri sonucu bulunamadı');
        }

    } catch (error) {
        console.error('Translation error details:', {
            message: error.message,
            stack: error.stack,
            details: error.details || 'No additional details'
        });

        if (error.message.includes('API key')) {
            throw new Error('API anahtarı geçersiz veya eksik');
        } else if (error.message.includes('network')) {
            throw new Error('İnternet bağlantısı hatası');
        } else if (error.message.includes('quota')) {
            throw new Error('API kullanım limiti aşıldı');
        } else if (error.message.includes('permission') || error.message.includes('unauthorized')) {
            throw new Error('API erişim izni hatası');
        } else {
            throw new Error(`Çeviri hatası: ${error.message}`);
        }
    }
}; 