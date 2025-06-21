import { GraphDataElement } from "./GraphDataElement";
import type { AbstractAttributesType, ComputationNodeOptionsType, GraphValuesDomain, ComputationGraphGradientType, GradientCallbackType } from "../../../Types";
export declare class ComputationGraphDataNode extends GraphDataElement {
    protected _inputs: Map<string, ComputationGraphDataNode>;
    protected _outputs: Map<string, ComputationGraphDataNode>;
    constructor(options: ComputationNodeOptionsType);
    get value(): GraphValuesDomain | null;
    set value(v: GraphValuesDomain);
    get f(): (args: AbstractAttributesType) => GraphValuesDomain;
    set f(callback: (args: AbstractAttributesType) => GraphValuesDomain);
    get gradient(): GradientCallbackType;
    set gradient(g: GradientCallbackType);
    get type(): "constant" | "variable" | "operation";
    set type(t: string);
    get inputs(): Map<string, ComputationGraphDataNode>;
    get outputs(): Map<string, ComputationGraphDataNode>;
    get g(): ComputationGraphGradientType | null;
    set g(grad: ComputationGraphGradientType);
    get gm1(): ComputationGraphGradientType | null;
    set gm1(grad: ComputationGraphGradientType);
    get init(): (params: AbstractAttributesType) => GraphValuesDomain | void;
    set init(callback: (params: AbstractAttributesType) => GraphValuesDomain | void);
    get params(): AbstractAttributesType;
    set params(params: AbstractAttributesType);
    get name(): string;
    set name(name: string);
}
