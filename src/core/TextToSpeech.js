let isSpeaking = false,
    globalQueue = {};

let execGlobalQueue = async () => {
  if (!isSpeaking && Object.keys(globalQueue).length > 0) {
    isSpeaking = true;
    let maxWeight = 0;
    for (let weight in globalQueue) {
      maxWeight = weight;
    }
    await globalQueue[maxWeight].shift()();
    if (globalQueue[maxWeight] && globalQueue[maxWeight].length === 0) {
      delete globalQueue[maxWeight];
    }
    isSpeaking = false;
    execGlobalQueue();
  }
};

let pushToQueue = (voiceText, weight) => {
  globalQueue[weight] = globalQueue[weight] || [];
  globalQueue[weight].push(voiceText);
  execGlobalQueue();
}

export default class TextToSpeech extends SpeechSynthesisUtterance {
  _isReady = false;
  
  constructor({ rate, pitch, lang } = {}) {
    super();
    this.rate = rate || 1.3;
    this.pitch = pitch || 1;
    
    // list of languages is probably not loaded, wait for it
    if (window.speechSynthesis.getVoices().length == 0) {
    	window.speechSynthesis.addEventListener('voiceschanged', () => {
        this.setVoice([lang]);
        this._isReady = true;
    	});
    } else {
      this.setVoice([lang]);
      this._isReady = true;
    }
  }

  /**
   * Speaks the text.
   * 
   * @param text The text that will be spoken
   * @example voice({ text: 'Hello World' }).then(...)
   * @returns A promise that successful if the text is voiced.
   */
  _voiceText = ({text, onStart, onEnd}) => {
    return new Promise((res) => {
      this.text = text;
      if (typeof onStart === "function") {
        onStart();
      } else if (Array.isArray(onStart)) {
        onStart.forEach((func) => func());
      }
      window.speechSynthesis.speak(this);
      this.text = '';
      this.onend = () => {
        this.onend = null;
        if (typeof onEnd === "function") {
          onEnd();
        } else if (Array.isArray(onEnd)) {
          onEnd.forEach((func) => func());
        }
        res();
      }
    });
  }

  /**
   * Sets default voice
   * 
   * @param langs Array of strings containing default language and fallbacks
   * @example setVoice(['en-BB', 'en-US']) // arr[0] - main lang; arr[n] - fallbacks
   * @returns undefind.
   */
  setVoice = (langs) => {
    let availableVoices = window.speechSynthesis.getVoices();
    for (let i = 0; i < langs.length; i++) {
      this.voice = availableVoices.find((item) => item.lang === langs[i]);
      if (this.voice) break;
    }
    if (!this.voice) {
        this.voice = availableVoices[0];
    }
  }

  voiceText = (params) => {
    pushToQueue(() => this._voiceText(params), params.weight);
  }

  clearQueue = () => {
    globalQueue = {};
  }
}