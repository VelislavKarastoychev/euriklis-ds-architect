"use strict";

import type { Integer } from "../../../Types";
import type { GraphDataNode } from "../../DataNode";
// import { Matrix } from "../../../Matrix";

export const AssignRandomValueToNodes = (
  G: Map<string, GraphDataNode>,
  from: number,
  to: number,
  seed: Integer,
): void => {
  let k: Integer;

  for (const [_, node] of G) {
    seed <<= 0;
    k = (seed / 127773) >> 0;
    seed = (16807 * (seed - k * 127773) - k * 2836) >> 0;
    if (seed < 0) seed += 2147483647;
    node.data.value = from + (to - from) * seed * 4.656612875e-10;
  }
};

export const AssignUniqueRandomValueToNodes = (
  G: Map<string, GraphDataNode>,
  from: number,
  to: number,
): void => {
  for (const [_, node] of G) {
    node.data.value = from + (to - from) * Math.random();
  }
};

export const AssignRandomVectorToNodes = (
  G: Map<string, GraphDataNode>,
  size: Integer,
  from: number,
  to: number,
  seed: Integer,
): void => {
  for (const [_, node] of G) {
    const vector = Array.from({ length: size }).map(Math.random);
    node.data.value = vector;
  }
};

export const AssignUniqueRandomVectorToNodes = (
  G: Map<string, GraphDataNode>,
  size: Integer,
  from: number,
  to: number,
): void => {
  for (const [_, node] of G) {
    const vector = Array.from({ length: size }).map(Math.random);
    node.data.value = vector;
  }
};

export const AssignRandomMatrixToNodes = (
  G: Map<string, GraphDataNode>,
  rows: Integer,
  columns: Integer,
  from: number,
  to: number,
  seed: Integer,
): void => {
  for (const [_, node] of G) {
    const matrix = [[]];
    node.data.value = matrix;
  }
};

export const AssignUniqueRandomMatrixToNodes = (
  G: Map<string, GraphDataNode>,
  rows: Integer,
  columns: Integer,
  from: number,
  to: number,
): void => {
  for (const [_, node] of G) {
    const matrix = [[]];
    node.data.value = matrix;
  }
};

export const AssignRandomValueToEdgeWeights = (
  G: Map<string, GraphDataNode>,
  from: number,
  to: number,
  seed: Integer,
): void => {
  //
};

export const AssignUniqueRandomValueToEdgeWeights = (
  G: Map<string, GraphDataNode>,
  from: number,
  to: number,
): void => {
  //
};

export const AssignRandomVectorToEdgeWeights = (
  G: Map<string, GraphDataNode>,
  from: number,
  to: number,
  seed: Integer,
): void => {
  //
};

export const AssignUniqueRandomVectorToEdgeWeights = (
  G: Map<string, GraphDataNode>,
  from: number,
  to: number,
): void => {};

export const AssignRandomMatrixToEdgeWeights = (
  G: Map<string, GraphDataNode>,
  from: number,
  to: number,
  seed: Integer,
): void => {
  //
};

export const AssignUniqueRandomMatrixToEdgeWeights = (
  G: Map<string, GraphDataNode>,
  from: number,
  to: number,
): void => {
  //
};
