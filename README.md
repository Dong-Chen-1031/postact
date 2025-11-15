# postact
web development for developers who procastinate like i do

postact aims to be a somewhat unopinionated library for building robust web applications.
that way, we can go back to the good old days of no weird ass frameworks... just as  
jquery intended.

currently you can select elements: -

```ts
import { select, state } from "postact";

const button = select("button");

// handle counting
const $count = state(0);
button.on("click", () => {
  $count.update(i => i + 1); // there should be a better way tho
  
  // render a virtual dom directly
  button.render([
    tag: "h1",
    children: [`${$count}`]
  ]);
});
```

it's intended to be that kind of simple. so you know... modern web development 
won't feel that bloated and no one has to obey to some fucking triangle company 
with their stupid fucking previous js.

anyway, if you're interested in this project, consider opening an issue on how
you think the design could be better. yeah, so i could procastinate more.
