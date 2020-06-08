import { map } from 'rxjs/operators'
import { getSentensesEquality } from '../utils';

/*
  == NOTES == 
  speech-input modes:
    - 

*/

export default class SpeechInputComponent extends HTMLElement {
  _voiceSubscription = null;
  _gestures = [];
  _isBlocked = false;
  _innerContent = "";
  _params = {
    once: false
  };
  
  constructor() {
    super();
    this.style.display = "none";
    this._gestures = (this.dataset.gestures || "").split("|").map((str) => str.trim().toLowerCase());
    this._innerContent = this.innerHTML;
    this.innerHTML = "";

    for (let key in this._params) {
      this._params[key] = (key in this.dataset && this.dataset[key] || key in this.dataset) || this._params[key];
    }
  }
  
  get voiceSubscription() {
    return this._voiceSubscription;
  }
  
  get gestures() {
    return this._gestures;
  }
  
  get isBlocked() {
    return this._isBlocked;
  }

  get innerContent() {
    return this._innerContent;
  }

  get params(){
    return this._params;
  }
  
  connectedCallback() {
    this._sendVoiceRequest();
  }
  
  disconnectedCallback() {
    this.voiceSubscription && this.voiceSubscription.unsubscribe();
  }
  
  _block() {
    const BLOCK_TIME = 3000;
    
    this._isBlocked = true;
    setTimeout(() => {
      this._isBlocked = false;
    }, BLOCK_TIME);
  }
  
  _sendVoiceRequest = () => {
    let voiceRequest = new CustomEvent("voiceRequest", {
      bubbles: true,
      composed: true,
      detail: this
    });
    this.dispatchEvent(voiceRequest);
  }

  _sendUserInput = (input) => {
    this.onuserinput && this.onuserinput(input);
    let userInput = new CustomEvent("userinput", {
      bubbles: true,
      composed: true,
      detail: input
    });
    this.dispatchEvent(userInput);
  }

  _sendRecognized = (input) => {
    this.onrecognized && this.onrecognized(input);
    let recognized = new CustomEvent("recognized", {
      bubbles: true,
      composed: true,
      detail: input
    });
    this.dispatchEvent(recognized);
  }

  _recognized = (input) => {
    this._sendRecognized(input);
    this.innerHTML = this.innerContent;
    this.querySelectorAll("tts-output").forEach((el) => {
      el.voice();
    });

    let { once } = this.params;
    if (once) {
      this.remove();
    }
  }
    
  bindSpeech = (voiceObservable) => {
    const MIN_EQUALITY = 0.87;
    this._voiceSubscription = voiceObservable
      .pipe(map((event) => {
        let last = event.results.length - 1;
        let userInput = event.results[last][0].transcript.trim().toLowerCase();
        let isFinal = event.results[last].isFinal;
        return { userInput, isFinal };
      }))
      .subscribe(({userInput, isFinal}) => {
        this._sendUserInput({userInput, isFinal});
        for (let gesture of this.gestures) {
          if (!this.isBlocked) {
            if (gesture === "*" && isFinal) {
              this._block();
              this._recognized({userInput});
              break;
            } else if (getSentensesEquality(gesture, userInput) >= MIN_EQUALITY) {
              this._block();
              this._recognized({userInput});
              break;
            }
          }
        }
      });
  }
};
customElements.define('speech-input', SpeechInputComponent);