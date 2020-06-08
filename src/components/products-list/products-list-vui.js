export default function() {
  let { products } = this;

  return `
    <speech-input
      data-gestures="по очереди | прочитать">
      ${products.reduce((final, {id, title, brand, description, price}) => final + `
        <tts-output data-rate="1.3" data-lang="ru-RU" data-activate-once>
          ${brand} ${title}
          <speech-input
            data-on-recognized="openProduct(${id})"
            data-gestures="подробнее">
              <tts-output data-rate="1.9" data-lang="ru-RU" data-clear-next>
                Цена: ${price} грн
                ${description}
              </tts-output>
            </speech-input>
        </tts-output>
      `, "")}

    </speech-input>
  `;
}