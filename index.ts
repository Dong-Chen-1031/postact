import { select, state } from "./src/index.ts";

const $count = state<number>(0);
const btn = select<HTMLButtonElement>("button");

btn.on("click", () => {
  $count.update((i) => i + 1);

  if ($count.value > 9) {
    btn.remove();
    console.log(btn.exists());
  }

  btn.render({
    tag: "h1",
    children: [`${$count.value}`],
  });
});
