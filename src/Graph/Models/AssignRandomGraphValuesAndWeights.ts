"use strict";

import { Matrix } from "../../../Matrix";
import type {
  __RandomGraphValuesDomainTypes__,
  GraphEdgeType,
  GraphNodeType,
  GraphType,
  Integer,
  MatrixType,
  NumericMatrix,
  NumericType,
  TypedArray,
} from "../../../Types";

const Randomize = (
  G: GraphType,
  from: number,
  to: number,
  seed: Integer = 123456,
  type: __RandomGraphValuesDomainTypes__,
  options?: { type: NumericType; rows: Integer; columns: Integer },
): void => {
  let i: Integer,
    temp: TypedArray | number[] | MatrixType | NumericMatrix,
    u: GraphNodeType,
    e: GraphEdgeType,
    _: any,
    s: string,
    t: string;
  switch (type) {
    case "constant numeric nodes":
      i = 0;
      temp = Matrix.random(1, G.size, from, to, undefined, seed)[0];
      for ([_, u] of G) u.attributes.value = temp[i++];
      break;
    case "constant matrix nodes":
      for ([_, u] of G) {
        u.attributes.value = Matrix.random(
          options?.rows || 1,
          options?.columns || 1,
          from,
          to,
          options?.type || "float64",
          seed++,
        );
      }
      break;
    case "unique numeric nodes":
      i = 0;
      temp = Matrix.uniqueRandom(1, G.size, from, to)[0];
      for ([_, u] of G) u.attributes.value = temp[i++];
      break;
    case "unique matrix nodes":
      for ([_, u] of G) {
        u.attributes.value = Matrix.uniqueRandom(
          options?.rows || 1,
          options?.columns || 1,
          from,
          to,
          options?.type || "float64",
        );
      }
      break;
    case "constant numeric weights":
      for ([s, u] of G) {
        i = 0;
        const outputs = u.outputs;
        const cols = outputs.size;
        temp = Matrix.random(1, cols, from, to, undefined, seed++)[0];
        for ([t, e] of outputs) {
          const w = temp[i++] as number;
          e.attributes.weight = w;
          const edge = (G.get(t) as GraphNodeType).inputs.get(s);
          (edge as GraphEdgeType).attributes.weight = w as number;
        }
      }
      break;
    case "unique numeric weights":
      for ([s, u] of G) {
        i = 0;
        const outputs = u.outputs;
        const cols = outputs.size;
        temp = Matrix.uniqueRandom(1, cols, from, to, undefined)[0];
        for ([t, e] of outputs) {
          const w = temp[i++] as number;
          e.attributes.weight = w;
          const edge = (G.get(t) as GraphNodeType).inputs.get(s);
          (edge as GraphEdgeType).attributes.weight = w;
        }
      }
      break;
    case "constant matrix weights":
      for ([s, u] of G) {
        i = 0;
        const outputs = u.outputs;
        const rows = options?.rows || 1;
        const cols = options?.columns || 1;
        for ([t, e] of outputs) {
          temp = Matrix.random(
            rows,
            cols,
            from,
            to,
            options?.type || "float64",
            seed++,
          ) as MatrixType | NumericMatrix;
          e.attributes.weight = temp;
          const edge = (G.get(t) as GraphNodeType).inputs.get(s);
          (edge as GraphEdgeType).attributes.weight = temp;
        }
      }
      break;
    case "unique matrix weights":
      for ([s, u] of G) {
        i = 0;
        const outputs = u.outputs;
        const rows = options?.rows || 1;
        const cols = options?.columns || 1;
        for ([t, e] of outputs) {
          temp = Matrix.uniqueRandom(
            rows,
            cols,
            from,
            to,
            options?.type || "float64",
          );
          e.attributes.weight = temp;
          const edge = (G.get(t) as GraphNodeType).inputs.get(s);
          (edge as GraphEdgeType).attributes.weight = temp;
        }
      }
      break;
  }
};

/**
 * Sets the values of all nodes in the graph
 * to random numbers within a specified range
 * using a constant numeric approach.
 *
 * This utility function updates each node's
 * value attribute in the graph to a random
 * number within the given range.
 * The random numbers are generated using the
 * specified seed for reproducibility.
 *
 * @param {GraphType} G - The graph whose
 * nodes' values will be set to random numbers.
 * @param {number} from - The minimum value
 * (inclusive) for the random numbers.
 * @param {number} to - The maximum value
 * (exclusive) for the random numbers.
 * @param {Integer} seed - The seed for the
 * random number generator.
 */
export const AssignRandomValuesToGraphNodes = (
  G: GraphType,
  from: number,
  to: number,
  seed: Integer,
) => Randomize(G, from, to, seed, "constant numeric nodes");

/**
 * Sets the values of all nodes in the graph
 * to random matrices within a specified range.
 *
 * This utility function updates each node's
 * value attribute in the graph to a random
 * matrix within the given range.
 * The matrix dimensions and type are specified
 * via the `options` parameter. The random matrices are generated
 * using the specified seed for reproducibility.
 *
 * @param {GraphType} G - The graph whose nodes' values will be set to random matrices.
 * @param {number} from - The minimum value (inclusive) for the random matrix elements.
 * @param {number} to - The maximum value (exclusive) for the random matrix elements.
 * @param {Integer} seed - The seed for the random number generator.
 * @param {Object} [options] - Options for matrix generation.
 * @param {NumericType} options.type - The numeric type of the matrix elements.
 * @param {Integer} options.rows - The number of rows in each matrix.
 * @param {Integer} options.columns - The number of columns in each matrix.
 */
export const AssignRandomMatrixValuesToGraphNodes = (
  G: GraphType,
  from: number,
  to: number,
  seed: Integer,
  options?: { type: NumericType; rows: Integer; columns: Integer },
) => Randomize(G, from, to, seed, "constant matrix nodes", options);

/**
 * Sets the values of all nodes in the graph
 * to unique random numbers within a specified range.
 *
 * This utility function updates each node's value
 * attribute in the graph to a unique random number within the given range.
 * Random numbers are unique across all nodes.
 *
 * @param {GraphType} G - The graph whose nodes' values will be set to unique random numbers.
 * @param {number} from - The minimum value (inclusive) for the random numbers.
 * @param {number} to - The maximum value (exclusive) for the random numbers.
 */
export const AssignUniqueRandomValuesToGraphNodes = (
  G: GraphType,
  from: number,
  to: number,
) => Randomize(G, from, to, undefined, "unique numeric nodes");

/**
 * Sets the values of all nodes in the graph to
 * unique random matrices within a specified range.
 *
 * This utility function updates each node's value
 * attribute in the graph to a unique random matrix
 * within the given range.The matrix dimensions and
 * type are specified via the `options` parameter.
 *
 * @param {GraphType} G - The graph whose nodes' values will be set to unique random matrices.
 * @param {number} from - The minimum value (inclusive) for the random matrix elements.
 * @param {number} to - The maximum value (exclusive) for the random matrix elements.
 * @param {Object} options - Options for matrix generation.
 * @param {NumericType} options.type - The numeric type of the matrix elements.
 * @param {Integer} options.rows - The number of rows in each matrix.
 * @param {Integer} options.columns - The number of columns in each matrix.
 */
export const AssignUniqueRandomMatrixValuesToGraphNodes = (
  G: GraphType,
  from: number,
  to: number,
  options: { type: NumericType; rows: Integer; columns: Integer },
) => Randomize(G, from, to, undefined, "unique matrix nodes", options);

/**
 * Sets the weights of all edges in the graph
 * to random numbers within a specified range.
 *
 * This utility function updates each edge's
 * weight attribute in the graph to a random
 * number within the given range.
 * The random numbers are generated using the
 * specified seed for reproducibility.
 *
 * @param {GraphType} G - The graph whose edges' weights will be set to random numbers.
 * @param {number} from - The minimum value (inclusive) for the random numbers.
 * @param {number} to - The maximum value (exclusive) for the random numbers.
 * @param {Integer} seed - The seed for the random number generator.
 */
export const AssignRandomWeightsToGraphEdges = (
  G: GraphType,
  from: number,
  to: number,
  seed: Integer,
) => Randomize(G, from, to, seed, "constant numeric weights");

/**
 * Sets the weights of all edges in the graph
 * to random matrices within a specified range.
 *
 * This utility function updates each edge's
 * weight attribute in the graph to a random
 * matrix within the given range.
 * The matrix dimensions and type are specified
 * via the `options` parameter. The random matrices are generated
 * using the specified seed for reproducibility.
 *
 * @param {GraphType} G - The graph whose edges' weights will be set to random matrices.
 * @param {number} from - The minimum value (inclusive) for the random matrix elements.
 * @param {number} to - The maximum value (exclusive) for the random matrix elements.
 * @param {Integer} seed - The seed for the random number generator.
 * @param {Object} [options] - Options for matrix generation.
 * @param {NumericType} options.type - The numeric type of the matrix elements.
 * @param {Integer} options.rows - The number of rows in each matrix.
 * @param {Integer} options.columns - The number of columns in each matrix.
 */
export const AssignRandomMatrixWeightsToGraphEdges = (
  G: GraphType,
  from: number,
  to: number,
  seed: Integer,
  options: { type: NumericType; rows: Integer; columns: Integer },
) => Randomize(G, from, to, seed, "constant matrix weights", options);

/**
 * Sets the weights of all edges in the graph 
 * to unique random numbers within a specified range.
 *
 * This utility function updates each edge's weight 
 * attribute in the graph to a unique random number within the given range.
 * Random numbers are unique across all edges.
 *
 * @param {GraphType} G - The graph whose edges' weights will be set to unique random numbers.
 * @param {number} from - The minimum value (inclusive) for the random numbers.
 * @param {number} to - The maximum value (exclusive) for the random numbers.
 */
export const AssignUniqueRandomWeightsToGraphEdges = (
  G: GraphType,
  from: number,
  to: number,
) => Randomize(G, from, to, undefined, "unique numeric weights");

/**
 * Sets the weights of all edges in the graph to unique random matrices within a specified range.
 *
 * This utility function updates each edge's weight attribute in the graph to a unique random matrix within the given range.
 * The matrix dimensions and type are specified via the `options` parameter.
 *
 * @param {GraphType} G - The graph whose edges' weights will be set to unique random matrices.
 * @param {number} from - The minimum value (inclusive) for the random matrix elements.
 * @param {number} to - The maximum value (exclusive) for the random matrix elements.
 * @param {Object} options - Options for matrix generation.
 * @param {NumericType} options.type - The numeric type of the matrix elements.
 * @param {Integer} options.rows - The number of rows in each matrix.
 * @param {Integer} options.columns - The number of columns in each matrix.
 */
export const AssignUniqueRandomMatrixWeightsToGraphEdges = (
  G: GraphType,
  from: number,
  to: number,
  options: { type: NumericType; rows: Integer; columns: Integer },
) => Randomize(G, from, to, undefined, "unique matrix weights", options);
