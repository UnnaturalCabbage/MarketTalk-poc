export default function() {
   return `
      <speech-input data-gestures="фильтр">
         <tts-output data-rate="1.3" data-lang="ru-RU">
            Укажите критерии фильтра
            <speech-input
               data-on-recognized="filterProducts($event)"
               data-gestures="*"
               data-once></speech-input>
         </tts-output>
      </speech-input>
   `;
};