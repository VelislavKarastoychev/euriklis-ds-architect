"use strict";
import * as errors from "../../Errors";

import type {
  AbstractAttributesType,
  GraphValuesDomain,
  MatrixType,
  NumericMatrix,
  TypedArray,
} from "../../../Types";
import type { GraphDataNode } from "../../DataNode";
import {
  IsMatrix,
  IsNumber,
  IsTypedArrayOrArray,
} from "../../../Matrix/Conditions";
import { Matrix } from "../../../Matrix";

const SetEdgesToAverage = (G: Map<string, GraphDataNode>): void => {
  for (const [s, u] of G) {
    for (const [t, uv] of u.outputs) {
      const vNode = G.get(t) as GraphDataNode;
      const vu = vNode.outputs.get(s);
      let attributes: AbstractAttributesType & { weight: GraphValuesDomain };
      if (!vu) {
        attributes = { weight: uv.data.weight };
        vNode.addOutgoingEdge({
          target: s,
          attributes,
        });
        u.addIncommingEdge({ source: t, attributes });
      } else {
        const uvWeight = uv.data.weight;
        const vuWeight = vu.data.weight;
        if (IsNumber(uvWeight) && IsNumber(vuWeight)) {
          attributes = {
            weight: 0.5 * ((uvWeight as number) + (vuWeight as number)),
          };
        } else if (
          IsTypedArrayOrArray(uvWeight) && IsTypedArrayOrArray(vuWeight)
        ) {
          attributes = {
            weight: Matrix.times(
              Matrix.plus([uvWeight as TypedArray], [vuWeight as TypedArray]),
              0.5,
            )[0],
          };
        } else if (IsMatrix(vuWeight) && IsMatrix(uvWeight)) {
          attributes = {
            weight: Matrix.times(
              Matrix.plus(
                uvWeight as MatrixType | NumericMatrix,
                vuWeight as MatrixType | NumericMatrix,
              ),
              0.5,
            ),
          };
        } else errors.InappropriateWeightDeclarationInSymmetrize();
      }
    }
  }
};

const SetEdgesToGeometric = (G: Map<string, GraphDataNode>): void => {
  for (const [s, u] of G) {
    for (const [t, uv] of u.outputs) {
      const vNode = G.get(t) as GraphDataNode;
      const vu = vNode.outputs.get(s);
      let attributes: AbstractAttributesType & { weight: GraphValuesDomain };
      if (!vu) {
        attributes = { weight: uv.data.weight };
        vNode.addOutgoingEdge({
          target: s,
          attributes,
        });
        u.addIncommingEdge({ source: t, attributes });
      } else {
        const uvWeight = uv.data.weight;
        const vuWeight = vu.data.weight;
        if (IsNumber(uvWeight) && IsNumber(vuWeight)) {
          attributes = {
            weight: Math.sqrt((uvWeight as number) * (vuWeight as number)),
          };
        } else if (
          IsTypedArrayOrArray(uvWeight) && IsTypedArrayOrArray(vuWeight)
        ) {
          attributes = {
            weight: Matrix.sqrt(
              Matrix.Hadamard([uvWeight as TypedArray], [
                vuWeight as TypedArray,
              ]),
            )[0],
          };
        } else if (IsMatrix(vuWeight) && IsMatrix(uvWeight)) {
          attributes = {
            weight: Matrix.sqrt(
              Matrix.Hadamard(
                uvWeight as MatrixType | NumericMatrix,
                vuWeight as MatrixType | NumericMatrix,
              ),
            ),
          };
        } else errors.InappropriateWeightDeclarationInSymmetrize();
      }
    }
  }
};

const SetEdgesToExp = (G: Map<string, GraphDataNode>): void => {
  for (const [s, u] of G) {
    for (const [t, uv] of u.outputs) {
      const vNode = G.get(t) as GraphDataNode;
      const vu = vNode.outputs.get(s);
      let attributes: AbstractAttributesType & { weight: GraphValuesDomain };
      if (!vu) {
        attributes = { weight: uv.data.weight };
        vNode.addOutgoingEdge({
          target: s,
          attributes,
        });
        u.addIncommingEdge({ source: t, attributes });
      } else {
        const uvWeight = uv.data.weight;
        const vuWeight = vu.data.weight;
        if (IsNumber(uvWeight) && IsNumber(vuWeight)) {
          attributes = {
            weight: Math.exp((uvWeight as number) + (vuWeight as number)),
          };
        } else if (
          IsTypedArrayOrArray(uvWeight) && IsTypedArrayOrArray(vuWeight)
        ) {
          attributes = {
            weight: Matrix.exp(
              Matrix.plus([uvWeight as TypedArray], [vuWeight as TypedArray]),
            )[0],
          };
        } else if (IsMatrix(vuWeight) && IsMatrix(uvWeight)) {
          attributes = {
            weight: Matrix.exp(
              Matrix.plus(
                uvWeight as MatrixType | NumericMatrix,
                vuWeight as MatrixType | NumericMatrix,
              ),
            ),
          };
        } else errors.InappropriateWeightDeclarationInSymmetrize();
      }
    }
  }
};

const SetEdgesToLog = (G: Map<string, GraphDataNode>): void => {
  for (const [s, u] of G) {
    for (const [t, uv] of u.outputs) {
      const vNode = G.get(t) as GraphDataNode;
      const vu = vNode.outputs.get(s);
      let attributes: AbstractAttributesType & { weight: GraphValuesDomain };
      if (!vu) {
        attributes = { weight: uv.data.weight };
        vNode.addOutgoingEdge({
          target: s,
          attributes,
        });
        u.addIncommingEdge({ source: t, attributes });
      } else {
        const uvWeight = uv.data.weight;
        const vuWeight = vu.data.weight;
        if (IsNumber(uvWeight) && IsNumber(vuWeight)) {
          attributes = {
            weight: Math.log((uvWeight as number) * (vuWeight as number)),
          };
        } else if (
          IsTypedArrayOrArray(uvWeight) && IsTypedArrayOrArray(vuWeight)
        ) {
          attributes = {
            weight: Matrix.log(
              Matrix.Hadamard([uvWeight as TypedArray], [
                vuWeight as TypedArray,
              ]),
            )[0],
          };
        } else if (IsMatrix(vuWeight) && IsMatrix(uvWeight)) {
          attributes = {
            weight: Matrix.log(
              Matrix.Hadamard(
                uvWeight as MatrixType | NumericMatrix,
                vuWeight as MatrixType | NumericMatrix,
              ),
            ),
          };
        } else errors.InappropriateWeightDeclarationInSymmetrize();
      }
    }
  }
};

export const Symmetrize = (
  G: Map<string, GraphDataNode>,
  type: "average" | "geometric" | "exp" | "log",
): void => {
  switch (type) {
    case "average":
      return SetEdgesToAverage(G);
    case "geometric":
      return SetEdgesToGeometric(G);
    case "exp":
      return SetEdgesToExp(G);
    case "log":
      return SetEdgesToLog(G);
  }
};
