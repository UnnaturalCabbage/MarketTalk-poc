export default function InputHandler({ gui, vui, tag }){
  return function (target) {
    class DecotratedTarget extends target {
      constructor() {
        super();
        this._render();
      }

      connectedCallback() {
        this.onConnectedCallback && this.onConnectedCallback();
        let observer = new MutationObserver(() => {
          this.querySelectorAll("*").forEach((el) => {
            Object.entries(el.dataset).forEach(([event, func]) => {
              if (event.indexOf("on") === 0) {
                let eventName = event.toLowerCase();
                el[eventName] = (e) => eval(`try { this.${ func.replace("$event", JSON.stringify(e))} } catch {}`);
              }
            });
          });
        });
        observer.observe(this,  { childList: true, subtree: true });
      }

      _render() {
        this.innerHTML = `
          ${gui.call(this)}
          ${vui.call(this)}
        `;
      }
    }
    customElements.define(tag, DecotratedTarget);
    return DecotratedTarget;
  }
}