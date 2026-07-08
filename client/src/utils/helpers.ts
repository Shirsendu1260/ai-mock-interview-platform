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

        // Try to find a female English voice (common names across OS/Browsers)
        const femaleNames = ['google us english', 'zira', 'samantha', 'moira', 'hazel', 'susan', 'female'];
        let voice = voices.find((v) =>
            v.lang.startsWith('en') &&
            femaleNames.some(name => v.name.toLowerCase().includes(name))
        );

        // Prefer US english voice (If previous female voice wasn't found)
        if(!voice) {
            voice = voices.find((v) => (v.lang === 'en-US'));
        }

        // If that english voice is not found, fall back to any English voice
        if(!voice) {
            voice = voices.find((v) => (v.lang.startsWith('en')));
        }

        // Stop what is currently speaking
        window.speechSynthesis.cancel();

        // Initialize text-to-speech APi
        const utterance = new SpeechSynthesisUtterance(text);

        // Assign preferred voice and match its specific language code dynamically
        if(voice) {
            utterance.voice = voice;
            utterance.lang = voice.lang;
        }
        else {
            utterance.lang = 'en-US';
        }

        utterance.rate = 1; // Normal speed
        utterance.pitch = 1.1;
        utterance.volume = 1; // 100% volume

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
        return { title: "Outstanding", color: "#16a34a", class: "bg-green-100 text-green-700" };
    }

    if(score >= 75) {
        return { title: "Excellent", color: "#2563eb", class: "bg-blue-100 text-blue-700" };
    }

    if(score >= 60) {
        return { title: "Good", color: "#f59e0b", class: "bg-yellow-100 text-yellow-700" };
    }

    if(score >= 40) {
        return { title: "Needs Improvement", color: "#ea580c", class: "bg-orange-100 text-orange-700" };
    }

    return { title: "Keep Practicing", color: "#dc2626", class: "bg-red-100 text-red-700" };
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
