"use strict";

export type GraphNodeType<NData = unknown> = {
  name: string;
  data: NData | null;
  value: number;
};

export type GraphEdgeType<EData = unknown> = {
  source: string;
  target: string;
  data: EData | null;
  weight: number;
};
