import { select, state, dependent, html } from "./src";

function createApp() {
  const $count = state(0);
  const $message = dependent($count, (count) => {
    if (count < 10) {
      return "Click!";
    } else if (count < 20) {
      return "Go on, let's see what you've got.";
    } else if (count == 20) {
      return "I'm tired. I'll just count for you at this point.";
    } else {
      return `${count}...`;
    }
  });

  function onClick() {
    $count.update((v) => v + 1);
  }

  return html`
    <h1>${$message}</h1>
    <button onclick=${onClick}>${$count}</button>
  `;
}

select("#app").render(createApp());
