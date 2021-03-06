import { Observable } from 'rxjs';
import { share  } from 'rxjs/operators';

export default class SpeechRecognitionComponent extends HTMLElement {
  _shadow = null;
  _recognition = null;
  _voiceObservable = null;
  _actionsGrammar = new Set();
  _isBlocked = false;
  
  constructor() {
    super();
    
    let { lang } = this.dataset;
    
    this._shadow = this.attachShadow({mode: 'open'});
    this.shadow.innerHTML = `
      <slot></slot>
    `;
    
    this._recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    this.recognition.lang = lang || 'ru-RU';
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;
    this._voiceObservable = Observable
      .create((observer) => {
        this.recognition.onresult = (e) => {
          let last = e.results.length - 1;
          let isFinal = e.results[last].isFinal;
          if (!this.isBlocked) {
            if (isFinal) {
              this.block(2000);
            }
            observer.next(e);
          }
        };
        
        return () => {
          this.recognition.onresult = null;
        };
      })
      .pipe(share());
    
    window.addEventListener("keypress", (e) => {
      if (e.which == 13) {
        this.recognition.start();
        window.currApp = window.currApp || {};
        window.currApp.isVoiceAvailabe = true;
      }
    });
  }
  
  get shadow() {
    return this._shadow;
  }
  
  get recognition() {
    return this._recognition;
  }
  
  get voiceObservable() {
    return this._voiceObservable;
  }

  get actionsGrammar() {
    return this._actionsGrammar;
  }

  get isBlocked() {
    return this._isBlocked;
  }

  set isBlocked(value) {
    this._isBlocked = value;
  }

  _addActionGrammar = (keys) => {
    keys.forEach((key) => {
      this.actionsGrammar.add(key);
    });
    let grammar = '#JSGF V1.0; grammar actions; public <actions> = ' + [...this.actionsGrammar].join(' | ') + ' ;';
    this.recognition.grammars = new (window.SpeechGrammarList || window.webkitSpeechGrammarList)();
    this.recognition.grammars.addFromString(grammar, 1);
  };
  
  connectedCallback() {
    this.addEventListener("voiceRequest", ({ detail : el }) => {
      el.bindSpeech(this.voiceObservable);
      // this._addActionGrammar(el.gestures);
    });
  }

  block = (timeout) => {
    this.isBlocked = true;
    if (timeout) {
      setTimeout(this.unblock, timeout)
    }
  };

  unblock = () => {
    this.isBlocked = false;
  }
};
customElements.define("speech-recognition", SpeechRecognitionComponent);