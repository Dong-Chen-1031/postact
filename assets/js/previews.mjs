// highlighting purposes only LMFAO
const js = (one, ...args) => one;

const script = document.createElement("script");

script.type = "module";
script.innerHTML = js`
import { select, state, html } from "https://unpkg.com/@ramptix/postact@0.0.3/dist/index.mjs";

function get(query) {
  if (typeof document.querySelector(query) == "undefined") return null;
  return select(query);
}

// showcase-1
function showcase1() {
  const result = get('[data-preview="1"]');
  if (!result) return;

  const $count = state(0);

  function onClick() {
    $count.update(v => v + 1)
  }

  result.render(
    html\`<button style="font-size: 16px;" onclick=\${onClick}>\${$count}</button>\`
  )
}
showcase1();
`;

document.body.appendChild(script);
