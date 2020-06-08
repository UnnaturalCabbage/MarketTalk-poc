export default function() {
  let { filters } = this;

  return `
    <div class="card filters">
      <article class="card-group-item">
        ${Object.values(filters).reduce((acc, [_, { name, options }]) => `${acc}
          <header class="card-header">
            <h6 class="title">${name}</h6>
          </header>
          <div class="filter-content">
            <div class="card-body">
            <form>
              ${options.reduce((acc, opt) => `${acc}
                <label class="form-check">
                  <input class="form-check-input" type="checkbox" value="">
                  <span class="form-check-label">
                    ${opt}
                  </span>
                </label>
              `, "")}
            </form>
            </div>
        </div>
        `, "")}
      </article>
    </div>
  `;
};