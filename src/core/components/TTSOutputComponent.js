import TextToSpeech from "../TextToSpeech";

export default class TTSOutputComponent extends HTMLElement {
    _text = "";
    _tts = null;
    _params = {
        rate: 1,
        pitch: 0.5,
        lang: "en-EN",
        voiceNow: false,
        activateOnce: false,
        clearNext: false,
    };
    _innerContent = "";

    constructor() {
        super();
        this.style.display = 'none';
        this._text = Array.prototype.reduce.call(this.childNodes, (acc, node) =>
            node.nodeType === Node.TEXT_NODE ? acc + node.nodeValue : acc,
            "");
        this._innerContent = this.innerHTML;
        this.innerHTML = "";

        for (let key in this._params) {
            this._params[key] = (key in this.dataset && this.dataset[key] || key in this.dataset) || this._params[key];
        }

        let { rate, pitch, lang } = this.params;
        this._tts = new TextToSpeech({ rate, pitch, lang });

        if (this.params.voiceNow) {
            this.voice(this.text);
        }
    }

    get text() {
        return this._text;
    }

    get tts() {
        return this._tts;
    }

    get params() {
        return this._params;
    }

    get innerContent() {
        return this._innerContent;
    }

    voice = async () => {
        let voiceParams = {
            text: this.text,
        };
        let onStart = []
        let onEnd = [];

        if (this.params.activateOnce) {
            onStart.push(() => {
                this.innerHTML = this._innerContent;
            });
            onEnd.push(() => {
                this.innerHTML = "";
            });
        } else {
            onEnd.push(() => {
                this.innerHTML = this._innerContent;
            });
        }
        if (this.params.clearNext) {
            onEnd.push(() => {
                this.tts.clearQueue();
            });
        }

        voiceParams.onStart = onStart;
        voiceParams.onEnd = onEnd;
        let parentTTSCount = 0;
        for (let parentTTS = this.parentElement.closest("tts-output"); parentTTS; parentTTS = parentTTS.parentElement.closest("tts-output")) {
            parentTTSCount++;
            if (parentTTSCount > 10) break;
        }
        voiceParams.weight = parentTTSCount;
        this.tts.voiceText(voiceParams);
    }
};
customElements.define("tts-output", TTSOutputComponent);