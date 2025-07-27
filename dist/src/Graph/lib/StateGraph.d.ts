import { Vertex, Edge } from "../../DataNode/Models";
import { BaseGraph } from "./BaseGraph";
import { Graph } from "./Graph";
import { BaseNetwork } from "./BaseNetwork";
/**
 * Lightweight graph structure exposing only CRUD operations for nodes and
 * edges. Useful for state machines or situations where advanced algorithms
 * from the `Graph` class are unnecessary.
 */
export declare class StateGraph<D = unknown, // The data type of the nodes.
T = unknown, // The data type of the edges.
S = unknown> extends BaseGraph<Vertex<D>, Edge<T>, D, T, S> {
    protected createNode({ name, data, }: {
        name: string;
        data: D;
    }): Vertex<D>;
    clone(): StateGraph<D, T, S>;
    upgradeToGraph(): Graph<D, T, S>;
    upgradeToBaseNetwork(): BaseNetwork<D, T, S>;
    /** Serialize graph to an object with nodes, edges and state. */
    toJSON(): {
        nodes: {
            name: string;
            data: D | null;
        }[];
        edges: {
            source: string;
            target: string;
            data: T | null;
        }[];
        state: S | null;
    };
    [Symbol.iterator](): Iterator<Vertex<D>>;
}
