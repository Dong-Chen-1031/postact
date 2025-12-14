export interface VirtualElement {
  readonly __postactItem: `virtual-element`;

  tag: string;
  attributes: Record<string, string>;
  children: VirtualItem[];
  listeners: [
    keyof HTMLElementEventMap,
    (event: HTMLElementEventMap[keyof HTMLElementEventMap]) => void,
  ][];
}

export type VirtualItem = string | null | undefined | VirtualElement[];
