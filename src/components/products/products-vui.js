export default function() {
  return `
    <speech-input
      data-on-recognized="setMainProducts()"
      data-gestures="главная">
      </speech-input>
    <speech-input
      data-gestures="поиск | найти">
      <tts-output data-rate="1.3" data-lang="ru-RU" data-block-speech>
        Что вы хотите найти?
        <speech-input
        data-on-userinput="updateSearchInput($event)"
        data-on-recognized="findProducts($event)"
        data-gestures="*"
        data-once></speech-input>
      </tts-output>
    </speech-input>
  `;
}