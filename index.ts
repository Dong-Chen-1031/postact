import { select, html, type VirtualItem, state, dependent } from "./src";

function createApp(): VirtualItem {
  return html` <div>Hello</div> `;
}

select("#app").render(createApp());
html`<h1 onclick='alert(123)'></h1>`
