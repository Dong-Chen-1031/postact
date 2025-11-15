export interface VirtualElement {
  tag: string;
  children?: (VirtualElement | string)[];
  attributes?: Record<string, string>;
  listeners?: Record<string, any>;
}
