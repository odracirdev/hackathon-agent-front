import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

// Initialize ElevenLabs client
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const client = new ElevenLabsClient({ apiKey: ELEVENLABS_API_KEY });

// Voice ID for Spanish female voice
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Sarah - Female voice

let currentAudio: HTMLAudioElement | null = null;

// Text-to-Speech using ElevenLabs
export const speakText = async (text: string): Promise<void> => {
	if (!ELEVENLABS_API_KEY) {
		console.warn('ElevenLabs API Key no está configurada');
		return;
	}

	try {
		// Stop any currently playing audio
		stopSpeaking();

		// Generate audio stream
		const audioStream = await client.textToSpeech.convert(VOICE_ID, {
			text: text,
			modelId: "eleven_multilingual_v2",
			voiceSettings: {
				stability: 0.5,
				similarityBoost: 0.75,
				style: 0.0,
				useSpeakerBoost: true
			}
		});

		// Convert stream to blob
		const chunks: Uint8Array[] = [];
		const reader = audioStream.getReader();
		
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			chunks.push(value);
		}
		
		const blob = new Blob(chunks as BlobPart[], { type: 'audio/mpeg' });
		const audioUrl = URL.createObjectURL(blob);

		// Play audio
		currentAudio = new Audio(audioUrl);
		await currentAudio.play();

		// Cleanup after playback
		currentAudio.onended = () => {
			URL.revokeObjectURL(audioUrl);
			currentAudio = null;
		};
	} catch (error) {
		console.error('Error con ElevenLabs TTS:', error);
		throw error;
	}
};

export const stopSpeaking = (): void => {
	if (currentAudio) {
		currentAudio.pause();
		currentAudio.currentTime = 0;
		currentAudio = null;
	}
};

// Speech-to-Text using ElevenLabs Conversational AI (WebSocket)
export const startListeningElevenLabs = (
	onResult: (transcript: string) => void,
	onError?: (error: string) => void
): MediaRecorder | null => {
	if (!ELEVENLABS_API_KEY) {
		const errorMsg = 'ElevenLabs API Key no está configurada';
		console.warn(errorMsg);
		onError?.(errorMsg);
		return null;
	}

	// Request microphone access
	navigator.mediaDevices.getUserMedia({ audio: true })
		.then((stream) => {
			const mediaRecorder = new MediaRecorder(stream);
			const audioChunks: Blob[] = [];

			mediaRecorder.ondataavailable = (event) => {
				audioChunks.push(event.data);
			};

			mediaRecorder.onstop = async () => {
				const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
				
				try {
					// Convert to base64
					const reader = new FileReader();
					reader.readAsDataURL(audioBlob);
					reader.onloadend = async () => {
						const base64Audio = reader.result?.toString().split(',')[1];
						
						// Send to ElevenLabs Speech-to-Text API
						const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
							method: 'POST',
							headers: {
								'xi-api-key': ELEVENLABS_API_KEY!,
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								audio: base64Audio,
								model_id: 'eleven_multilingual_v2',
							}),
						});

						if (!response.ok) {
							throw new Error('Error en Speech-to-Text');
						}

						const data = await response.json();
						onResult(data.text || '');
					};
				} catch (error) {
					console.error('Error con ElevenLabs STT:', error);
					onError?.('Error al transcribir audio');
				}

				// Stop all tracks
				stream.getTracks().forEach(track => track.stop());
			};

			mediaRecorder.start();
			
			// Auto-stop after 5 seconds
			setTimeout(() => {
				if (mediaRecorder.state === 'recording') {
					mediaRecorder.stop();
				}
			}, 5000);

			return mediaRecorder;
		})
		.catch((error) => {
			console.error('Error al acceder al micrófono:', error);
			onError?.('Error al acceder al micrófono');
		});

	return null;
};

// Speech-to-Text using browser's SpeechRecognition API (fallback)
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
