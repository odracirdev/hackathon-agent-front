// Text-to-Speech utility using browser's SpeechSynthesis API
export const speakText = (text: string, lang: string = 'es-ES'): void => {
	if ('speechSynthesis' in window) {
		// Cancel any ongoing speech
		window.speechSynthesis.cancel();

		const utterance = new SpeechSynthesisUtterance(text);
		utterance.lang = lang;
		utterance.rate = 1.0; // Speed
		utterance.pitch = 1.0; // Pitch
		utterance.volume = 1.0; // Volume

		// Try to select a female voice
		const voices = window.speechSynthesis.getVoices();
		const femaleVoice = voices.find(voice => 
			voice.lang.startsWith('es') && 
			(voice.name.toLowerCase().includes('female') || 
			 voice.name.toLowerCase().includes('femenina') ||
			 voice.name.toLowerCase().includes('woman') ||
			 voice.name.toLowerCase().includes('monica') ||
			 voice.name.toLowerCase().includes('paulina') ||
			 voice.name.toLowerCase().includes('google español'))
		);
		
		if (femaleVoice) {
			utterance.voice = femaleVoice;
		}

		window.speechSynthesis.speak(utterance);
	} else {
		console.warn('Text-to-Speech no está soportado en este navegador');
	}
};

export const stopSpeaking = (): void => {
	if ('speechSynthesis' in window) {
		window.speechSynthesis.cancel();
	}
};

// Speech-to-Text utility using browser's SpeechRecognition API
export const startListening = (
	onResult: (transcript: string) => void,
	onError?: (error: string) => void,
	lang: string = 'es-ES'
): any | null => {
	const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

	if (!SpeechRecognition) {
		const errorMsg = 'Speech-to-Text no está soportado en este navegador';
		console.warn(errorMsg);
		onError?.(errorMsg);
		return null;
	}

	const recognition = new SpeechRecognition();
	recognition.lang = lang;
	recognition.continuous = false;
	recognition.interimResults = false;
	recognition.maxAlternatives = 1;

	recognition.onresult = (event: any) => {
		const transcript = event.results[0][0].transcript;
		onResult(transcript);
	};

	recognition.onerror = (event: any) => {
		console.error('Error en reconocimiento de voz:', event.error);
		onError?.(event.error);
	};

	recognition.start();
	return recognition;
};
