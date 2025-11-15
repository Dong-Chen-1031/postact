import type { VirtualElement } from "./element";
import { transcribe } from "./transcribe";

class SelectedElement<T extends HTMLElement> {
  readonly inner: T;

  constructor(inner: T) {
    this.inner = inner;
  }

  /**
   * Registers a listener.
   *
   * @param type  The type of the listener.
   * @param fn The handler.
   */
  on<K extends keyof HTMLElementEventMap>(
    type: K,
    fn: (event: HTMLElementEventMap[K]) => any,
  ) {
    this.inner.addEventListener(type, fn);
  }

  /**
   *
   * @param ele Render children within this element, replacing the old ones.
   */
  render(ele: VirtualElement | string | (VirtualElement | string)[]) {
    if (typeof ele == "string") {
      return this.inner.replaceChildren(window.document.createTextNode(ele));
    }

    if (typeof ele == "object") {
      if ("tag" in ele) {
        return this.inner.replaceChildren(transcribe([ele]));
      } else {
        return this.inner.replaceChildren(transcribe(ele));
      }
    }

    throw new Error("unreachable");
  }

  /**
   * Removes the selected element from the DOM.
   */
  remove() {
    this.inner.remove();
  }

  /**
   * Checks whether this element exists in `where`.
   * If not specified, checks if exists in `window.document`.
   *
   * @param where The location to check.
   */
  exists(where?: HTMLElement): boolean {
    if (where) return where.contains(this.inner);
    else return window.document.contains(this.inner);
  }
}

/**
 * Selects one element in the document with a query.
 *
 * Instead of returning `T | null`, this function throws an error
 * if nothing's found.
 *
 * @param {string} query Hello, World
 * @returns {SelectedElement<T>} Element control with Postact as the backend.
 * @throws {ReferenceError} The element was not found.
 */
export function select<T extends HTMLElement = HTMLElement>(
  query: string,
): SelectedElement<T> {
  const result = window.document.querySelector(query);
  if (!result)
    throw new ReferenceError(`Could not find element with query: ${query}`);

  return new SelectedElement(result as T);
}
