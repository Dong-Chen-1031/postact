export type StateUpdateDispatch<T> = (prev: T) => T;
export type StateUpdate<T> = T | StateUpdateDispatch<T>;

function isUpdater<T>(
  a: T | StateUpdateDispatch<T>,
): a is StateUpdateDispatch<T> {
  return typeof a == "function";
}

function getStateUpdateResult<T>(current: T, item: StateUpdate<T>) {
  return isUpdater(item) ? item(current) : item;
}

interface StateSubscription {
  /**
   * Unsubsribes from state updates.
   */
  unsubscribe: () => any;
}

export class State<T> {
  private _value: T;
  private _subscribers: (((_: T) => any) | null)[];

  constructor(defaultValue: T) {
    this._value = defaultValue;
    this._subscribers = [];
  }

  /**
   * Gets the current value.
   */
  get value(): T {
    return this._value;
  }

  /**
   * Updates the state and dispatch all subscribers without checking equality.
   *
   * @param item Either a function that takes the current value as argument (`(T) => T`) or just the value to replace with.
   */
  updateEagerly(item: StateUpdate<T>): void {
    this._value = getStateUpdateResult(this._value, item);
    this.dispatch();
  }

  /**
   * Subscribe to state updates.
   *
   * @param listener The listener. Takes an argument, which is the updated value.
   */
  subscribe(listener: (_: T) => any): StateSubscription {
    const ln = this._subscribers.push(listener);
    return { unsubscribe: () => (this._subscribers[ln - 1] = null) };
  }

  /**
   * Dispatch all subscribers.
   */
  dispatch() {
    this._subscribers.forEach((item) => item && item(this._value));
  }
}

interface HasUpdate<T> {
  /**
   * Updates the state and dispatch all subscribers if old/assigned values aren't the same.
   * @param item Either a function that takes the current value as argument (`(T) => T`) or just the value to replace with.
   */
  update: (item: StateUpdate<T>) => void;
}

interface StateEntrypoint {
  <T>(defaultValue: T): State<T>;

  /**
   * Create a state manager designed for numbers.
   * @param defaultValue
   */
  number(defaultValue: number): NumberState;

  string(defaultValue: string): StringState;
}

class NumberState extends State<number> {
  add(by?: number) {
    if (by == 0) return;
    this.updateEagerly(super.value + (by || 1));
  }

  sub(by?: number) {
    if (by == 0) return;
    this.updateEagerly(super.value - (by || 1));
  }

  mul(by: number) {
    if (by == 1) return;
    this.updateEagerly(super.value * by);
  }

  div(by: number) {
    if (by == 1) return;
    this.updateEagerly(super.value / by);
  }

  [Symbol.toPrimitive](hint: string) {
    if (hint == "string") return this.value.toString();
    // if (hint == "number")
    return this.value;
  }

  update(item: StateUpdate<number>) {
    const expected = getStateUpdateResult(super.value, item);
    if (expected == super.value) return;
    super.updateEagerly(expected);
  }

  override toString(): string {
    return super.value.toString();
  }
}

class StringState extends State<string> {
  constructor(df: string) {
    super(df);
  }

  update(item: StateUpdate<string>) {
    const expected = getStateUpdateResult(super.value, item);
    if (super.value == expected) return;
    super.updateEagerly(expected);
  }

  /**
   *
   * @param part Push a string part to the back to the string.
   */
  push(part: string) {
    if (!part) return;
    super.updateEagerly(super.value + part);
  }

  override toString(): string {
    return super.value.toString();
  }
}

/**
 * State management.
 */
export const state: StateEntrypoint = Object.assign(
  <T>(df: T): State<T> => new State(df),
  {
    number: (df: number) => new NumberState(df),
    string: (df: string) => new StringState(df),
  },
);
