import { AxiosError } from 'axios';
import { format, formatDistanceToNow } from 'date-fns';
import { ApiError } from './ApiError';

export const formatDate = (date: Date | string) => {
    const joinedDate = new Date(date);
    const formattedDate = format(joinedDate, 'MMM d, yyyy');
    const timeAgo = formatDistanceToNow(joinedDate, {
        addSuffix: true
    });

    return `${formattedDate} (${timeAgo})`;
}

export const formatRemainingTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const hoursStr = String(hours).padStart(2, '0');
    const minutesStr = String(minutes).padStart(2, '0');
    const secondsStr = String(seconds).padStart(2, '0');

    if(hours > 0) {
        return `${hoursStr}h ${minutesStr}m ${secondsStr}s`;
    }

    if(minutes > 0) {
        return `${minutesStr}m ${secondsStr}s`;
    }

    return `${secondsStr}s`;
};

// Web Speech API helper used for text-to-speech
export const speakQuestion = (text: string) => {
    if(!text.trim()) return;

    const speak = () => {
        // Get browser voices that come from OS
        const voices = window.speechSynthesis.getVoices();
        if(voices.length === 0) return;

        // Prefer Indian english voice
        let voice = voices.find((v) => (v.lang === 'en-IN'));

        // If Indian english voice is not found, fall back to any English voice
        if(!voice) {
            voice = voices.find((v) => (v.lang.startsWith('en')));
        }

        // Stop what is currently speaking
        window.speechSynthesis.cancel();

        // Initialize text-to-speech APi
        const utterance = new SpeechSynthesisUtterance(text);

        utterance.lang = 'en-IN'; // Indian english
        utterance.rate = 1; // Normal speed
        utterance.pitch = 1.1;
        utterance.volume = 1; // 100% volume

        // Assign preferred voice
        if(voice) {
            utterance.voice = voice;
        }

        // Speak out loud
        window.speechSynthesis.speak(utterance);
    };

    // Check if the browser has loaded the voices yet or not
    if(window.speechSynthesis.getVoices().length === 0) {
        // If no voices are ready, wait for the 'voicechanged' event
        // When voices are ready, run speak()
        window.speechSynthesis.onvoiceschanged = speak;
    }
    else {
        // Voices are already ready, run speak() now
        speak();
    }
};

// Immediately stops any ongoing speech
export const stopSpeaking = () => {
    window.speechSynthesis.cancel();
};

export const getPerformance = (score: number) => {
    if(score >= 90) {
        return { title: "Outstanding", color: "#16a34a" };
    }

    if(score >= 75) {
        return { title: "Excellent", color: "#2563eb" };
    }

    if(score >= 60) {
        return { title: "Good", color: "#f59e0b" };
    }

    if(score >= 40) {
        return { title: "Needs Improvement", color: "#ea580c" };
    }

    return { title: "Keep Practicing", color: "#dc2626" };
};

export const getScoreColor = (score: number) => {
    if(score >= 9) {
        return "bg-green-100 text-green-700";
    }

    if(score >= 7.5) {
        return "bg-blue-100 text-blue-700";
    }

    if(score >= 6) {
        return "bg-yellow-100 text-yellow-700";
    }

    if(score >= 4) {
        return "bg-orange-100 text-orange-700";
    }

    return "bg-red-100 text-red-700";
};

export const handleAxiosError = (error: unknown): never => {
    if(error instanceof AxiosError && error.response) {
        throw new ApiError(
            error.response.data.statusCode,
            error.response.data.message,
            error.response.data.errors
        );
    }

    throw error;
};
