import type { VirtualElement } from "./element";
import { transcribe } from "./transcribe";

interface SelectedListener {
  readonly type: keyof HTMLElementEventMap;
  readonly listener: (...args: any) => any;

  /**
   * Postact - Removes the listener.
   */
  remove: () => void;
}

interface SelectedElement<T extends HTMLElement> {
  /**
   * Postact - Registers a listener.
   *
   * @param type  The type of the listener.
   * @param fn The handler.
   */
  readonly on: <K extends keyof HTMLElementEventMap>(
    type: K,
    fn: (event: HTMLElementEventMap[K], element: SelectedElement<T>) => any,
  ) => SelectedListener;

  /**
   * Postact - Render children within this element, replacing the old ones.
   */
  readonly render: (
    ele: VirtualElement | string | (VirtualElement | string)[],
  ) => void;

  /**
   * Postact - Checks whether this element exists in `where`.
   * @param where Defaults to the `document`.
   */
  readonly exists: <K extends HTMLElement>(
    where?: (SelectedElement<K> & HTMLElement) | HTMLElement,
  ) => void;
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
): SelectedElement<T> & T {
  const result = window.document.querySelector(query);
  if (!result)
    throw new ReferenceError(`Could not find element with query: ${query}`);

  return Object.assign(result, {
    on(t: any, fn: any) {
      result.addEventListener(t, fn);
      return {
        type: t,
        listener: fn,
        remove: () => result.removeEventListener(t, fn),
      };
    },

    render(ele: any) {
      if (typeof ele == "string") {
        return result.replaceChildren(window.document.createTextNode(ele));
      }

      if (typeof ele == "object") {
        if ("tag" in ele) {
          return result.replaceChildren(transcribe([ele]));
        } else {
          return result.replaceChildren(transcribe(ele));
        }
      }

      throw new Error("unreachable");
    },

    exists(where?: any) {
      return where ? where.contains(result) : window.document.contains(result);
    },
  }) as any;
}
