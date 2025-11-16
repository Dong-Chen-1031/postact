import { select, state } from "./src/index.ts";

const btn = select<HTMLButtonElement>("button");
const $count = state.number(0);

btn.on("click", () => console.log(10)).remove();
btn.on("click", () => console.log(100));
console.log($count);

$count.subscribe(() => {
  btn.render($count.toString());
});
