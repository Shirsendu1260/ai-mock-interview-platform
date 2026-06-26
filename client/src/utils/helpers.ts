import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (date: Date | string) => {
    const joinedDate = new Date(date);
    const formattedDate = format(joinedDate, 'MMM d, yyyy');
    const timeAgo = formatDistanceToNow(joinedDate, {
        addSuffix: true
    });

    return `${formattedDate} (${timeAgo})`;
}

export const formatRemainingTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
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
