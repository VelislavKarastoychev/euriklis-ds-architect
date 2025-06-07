"use strict";
import { DataNode } from "./DataNode";
export class HeapDataNode<T = unknown> extends DataNode<T> {
  constructor(data: T) {
    super(data);
  }
}
