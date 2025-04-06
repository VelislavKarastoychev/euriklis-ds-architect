"use strict";

import { DataNode } from "./DataNode";
import {
  DirectedGraphDataNode,
  UndirectedGraphDataNode,
} from "./GraphDataNode";

export class GraphDataEdge<
  NData = unknown,
  EData = unknown,
> extends DataNode<EData> {
  protected _link?:
    | DirectedGraphDataNode<NData, EData>
    | UndirectedGraphDataNode<NData, EData>;
  protected __weight__?: number = 1;
  constructor({
    link,
    data,
    weight,
  }: {
    link:
      | DirectedGraphDataNode<NData, EData>
      | UndirectedGraphDataNode<NData, EData>;
    data: EData;
    weight?: number;
  }) {
    super(data);
    this.link = link;
    this.__weight__ = weight;
  }

  get link():
    | DirectedGraphDataNode<NData, EData>
    | UndirectedGraphDataNode<NData, EData>
    | undefined {
    return this._link;
  }

  set link(
    link:
      | DirectedGraphDataNode<NData, EData>
      | UndirectedGraphDataNode<NData, EData>,
  ) {
    this._link = link;
  }

  get data(): EData | null {
    return this._data;
  }

  set data(d: EData) {
    this._data = d;
  }

  get weight(): number | undefined {
    return this.__weight__;
  }

  set wight(w: number) {
    this.__weight__ = w;
  }
}
