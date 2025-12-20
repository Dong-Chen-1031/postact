// highlighting purposes only LMFAO
const js = (one, ...args) => one;

const script = document.createElement("script");

script.type = "module";
script.innerHTML = js`
import { state } from "https://unpkg.com/@ramptix/postact@0.0.2/dist/index.mjs";

console.log(state);
`;

document.body.appendChild(script);
