"use strict";
import { v4 as uuid } from "uuid";
import * as models from "./Models";
import { ComputationGraphDataNode, GraphDataNode } from "../DataNode";
import type {
  GradientCallbackType,
  ComputationNodeOptionsType,
  ComputationGraphCallback,
  GraphValuesDomain,
  Integer,
  AbstractAttributesType,
  ComputationGraphGradientType,
  NumericMatrix,
  MatrixType,
} from "../../Types";
import {
  ifNodeNotExistsInComputationGraphThrow,
  ifSourceOrTargetNodesNotExistThrow,
} from "../Decorators";

import * as errors from "../Errors";
import validator from "@euriklis/validator-ts";
// import { Matrix } from "../../Matrix";
// import { IsNumber } from "../../Matrix/Conditions";

/**
 * @class
 * This class implements the concept of the dynamic computation
 * graph. We assume the computation graph as a mathematical abstract
 * tool, which is a regular graph, in which each node is neither variable
 * or operation or constant type. The edges show the connections or
 * the order of the operations. The edges do not contain any significant
 * information. The operational nodes have a f and gradient fields or labels
 * and the constant types may have f field but never gradient.
 * In order to be avoided redundant operations we also insert the concept
 * of the status of a node. A node may have three types of status:
 * the "off" status, which means that this node was never reached,
 * the "updated" status which means that this node was successfully
 * reached and the operations which was needed to be executed was successfully
 * run and "pending" which means that this node was reached but some parameters
 * or inputs was incomplete so the node needs to be executed when the appropriate
 * data is computed from its inputs.
 */
export class ComputationGraph {
  public static generateComputationGraphWithNodes(options: {
    count?: Integer;
    nodes?: ComputationNodeOptionsType[];
  }) {
    const { nodes, count } = options;
    const g = new ComputationGraph();
    let node: ComputationNodeOptionsType;
    if (nodes) {
      const n: Integer = nodes.length;
      let i: Integer;
      for (i = n; i-- > 1; ) {
        node = nodes[i--];
        if (!node.id) node.id = uuid();
        if (!node.type) node.type = "variable";
        node.status = "off";
      }

      if (i === 0) {
        const node = nodes[0];
        if (!node.id) node.id = uuid();
        if (!node.type) node.type = "variable";
        node.status = "off";
      }

      g.nodes = nodes;
    }

    if (count) {
      const nodes: ComputationNodeOptionsType[] = [];
      let i: Integer;
      for (i = count; i-- > 1; ) {
        node = {
          id: `v${i--}`,
          type: "variable",
          status: "off",
        };
        nodes.push(node);
        node = {
          id: `v${i}`,
          type: "variable",
          status: "off",
        };
        nodes.push(node);
      }

      if (i === 0) {
        node = {
          id: `v0`,
          type: "variable",
          status: "off",
        };
        nodes.push(node);
      }

      g.nodes = nodes;
    }

    return g;
  }

  private __G__ = new Map<string, ComputationGraphDataNode>();
  constructor(options?: {
    nodes: ComputationNodeOptionsType[];
    edges: { source: string; target: string }[];
  }) {
    if (options) this.nodes = options.nodes;
  }

  get nodes(): ComputationGraphDataNode[] {
    const list: ComputationGraphDataNode[] = [];

    for (const [_, node] of this.__G__) {
      list.push(node);
    }

    return list;
  }

  set nodes(nodes: ComputationNodeOptionsType[]) {
    const G = this.__G__;
    for (const node of nodes) {
      const { id, ...attributes } = node;
      const computationGraphDataNode = new ComputationGraphDataNode({
        id,
        data: attributes,
      });
      G.set(node.id, computationGraphDataNode);
    }
  }

  get edges(): { source: string; target: string }[] {
    const G = this.__G__;
    const list: { source: string; target: string }[] = [];
    for (const [target, node] of G) {
      for (const [source, _] of node.inputs) {
        const edge = { source, target };
        list.push(edge);
      }
    }

    return list;
  }

  get order(): Integer {
    return this.__G__.size;
  }

  get size(): Integer {
    let size = 0;
    const G = this.__G__;
    for (const [_, node] of G) {
      size += node.inputs.size;
    }

    return size;
  }

  addNode(
    node: ComputationNodeOptionsType = {
      id: "",
      type: "variable",
      value: null,
      f: undefined,
      gradient: undefined,
    },
  ): ComputationGraph {
    let { id, ...attributes } = node;
    if (!id) id = uuid();
    //if (
    //  (attributes.type !== "variable" || attributes.type !== "constant") &&
    //  !attributes.f
    //) {
    //  throw new Error("The node is operator");
    //}
    const nodeInstance = new ComputationGraphDataNode({
      id,
      ...attributes,
    });
    this.__G__.set(id, nodeInstance);

    return this;
  }

  hasNode(id: string): boolean {
    return this.__G__.has(id);
  }

  @ifSourceOrTargetNodesNotExistThrow(
    errors.InappropriateNodesDeclaration("connect"),
  )
  connect(link: { source: string; target: string }): ComputationGraph {
    const G = this.__G__;
    const { source, target } = link;
    const sourceNode = G.get(source) as ComputationGraphDataNode;
    const targetNode = G.get(target) as ComputationGraphDataNode;
    targetNode.inputs.set(source, sourceNode);
    sourceNode.outputs.set(target, targetNode);

    return this;
  }

  @ifNodeNotExistsInComputationGraphThrow(
    errors.InappropriateNodesDeclaration("setNodeType"),
  )
  setNodeType(options: ComputationNodeOptionsType): ComputationGraph {
    const { id, type } = options;
    (this.__G__.get(id) as ComputationGraphDataNode).type = type as string;

    return this;
  }

  @ifNodeNotExistsInComputationGraphThrow(
    errors.InappropriateNodesDeclaration("setNodeValue"),
  )
  setNodeValue(options: ComputationNodeOptionsType): ComputationGraph {
    const G = this.__G__;
    const { id, value } = options;
    (G.get(id) as ComputationGraphDataNode).value = value as GraphValuesDomain;

    return this;
  }

  @ifNodeNotExistsInComputationGraphThrow(
    errors.InappropriateNodesDeclaration("setNodeFunction"),
  )
  setNodeFunction(options: ComputationNodeOptionsType): ComputationGraph {
    const G = this.__G__;
    const { id, f } = options;
    (G.get(id) as ComputationGraphDataNode).f = f as ComputationGraphCallback;

    return this;
  }

  @ifNodeNotExistsInComputationGraphThrow(
    errors.InappropriateNodesDeclaration("setNodeGradient"),
  )
  setNodeGradient(options: ComputationNodeOptionsType): ComputationGraph {
    const G = this.__G__;
    const { id, gradient } = options;
    (G.get(id) as ComputationGraphDataNode).gradient =
      gradient as GradientCallbackType;

    return this;
  }

  removeNodes(ids: string[]): ComputationGraph {
    const G = this.__G__;
    models.RemoveNodes(G, ids);

    return this;
  }

  removeEdges(edges: { source: string; target: string }[]): ComputationGraph {
    const G = this.__G__;
    for (const edge of edges) {
      const { source, target } = edge;
      models.RemoveEdge(G, source, target);
    }

    return this;
  }

  findNodes(
    callback: (node: ComputationGraphDataNode, g: ComputationGraph) => boolean,
  ): string[] {
    const list: string[] = [];
    const G = this.__G__;
    for (const [name, node] of G) {
      if (callback(node, this)) list.push(name);
    }

    return list;
  }

  @ifNodeNotExistsInComputationGraphThrow(
    errors.InappropriateNodesDeclaration("getNode"),
  )
  getNode(id: string): ComputationGraphDataNode {
    return this.__G__.get(id) as ComputationGraphDataNode;
  }

  @ifNodeNotExistsInComputationGraphThrow(
    errors.InappropriateNodesDeclaration("execute"),
  )
  forward(id: string): ComputationGraph {
    const node = this.getNode(id);
    if (node.type === "constant") {
      if (!node.value) {
        return this;
      }
    } else if (node.type === "variable") {
      if (!node.value) node.value = node.init(node.params) as GraphValuesDomain;
    } else if (node.type === "operation") {
      const args: AbstractAttributesType = {};
      for (const [_, n] of node.inputs) {
        if (n.type === "variable") {
          if (!n.value) n.value = n.init(n.params) as GraphValuesDomain;
        }
        args[n.name] = n.value as GraphValuesDomain;
      }
      node.value = node.f(args);
    }

    for (const [name, _] of node.outputs) {
      this.forward(name);
    }

    return this;
  }

  @ifNodeNotExistsInComputationGraphThrow(
    errors.InappropriateNodesDeclaration("backward"),
  )
  backward(options: {
    id: string;
    computeGrad?: boolean;
    storePreviousGrad?: boolean;
  }): ComputationGraph {
    const { id, computeGrad, storePreviousGrad } = options;
    const node = this.getNode(id) as ComputationGraphDataNode;
    if (node.type === "variable") {
      if (!node.value) {
        const params = node.params;
        node.value = node.init(params) as GraphValuesDomain;
      }
    } else if (node.type === "operation") {
      if (!node.value) {
        const args: AbstractAttributesType = {};
        for (const [_, inputNode] of node.inputs) {
          if (!inputNode.value)
            errors.InappropriatelyDefinedComputationGraph("backward")();
          args[inputNode.name] = inputNode.value;
        }
        node.value = node.f(args);
      }
    } else if (node.type === "constant") {
      if (!node.value) {
        const params = node.params;
        node.value = node.init(params) as GraphValuesDomain;
      }
    } else {
      errors.IncorrectComputationGraphType("backward")();
    }
    if (computeGrad && node.gradient) {
      if (storePreviousGrad) {
        if (node.gm1) {
          node.gm1 = node.g;
        }
        const args: AbstractAttributesType = {};
        for (const [name, target] of node.outputs) {
          args[name] = target.g;
        }
        for (const [name, source] of node.inputs) {
          args[name] = source.value;
        }
        args[node.name] = node.value;
        node.g = node.gradient(args);
      }
    }

    for (const [name, _] of node.inputs) {
      this.backward({ id: name, computeGrad, storePreviousGrad });
    }

    return this;
  }
}
