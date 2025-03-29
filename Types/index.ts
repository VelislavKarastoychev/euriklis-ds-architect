export type Integer = number;
export type GraphDataType = null;
export type AbstractAttributesType = {
  [property: string]: unknown;
};

export type NodeType = {
  id: string | number;
  name: string;
  data: {
    value: number | string | number[] | number[][] | string[] | string[][];
    [property: string]: unknown;
  };
};
