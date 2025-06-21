import type { Integer } from "../../../Types";
import type { HeapDataNode } from "../../DataNode";
export declare const PrimaryShiftUp: <T = unknown>(heap: HeapDataNode<T>[], i: Integer, type: "max" | "min") => void;
