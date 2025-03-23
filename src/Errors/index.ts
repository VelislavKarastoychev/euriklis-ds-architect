"use strict";
import { errorGenerator } from "../../utils";
import {
  InappropriateNodeValuesTypeTxt,
  InappropriateNodesDeclarationTxt,
  InappropriateValuesTypeDefinitionTxt,
  InappropriateWeightDeclarationInSymmetrizeTxt,
  InappropriateWeightsTypeTxt,
  InappropriatelyDefinedComputationGraphTxt,
  IncorrectComputationGraphTypeTxt,
  IncorrectEdgeDeclarationTxt,
  IncorrectNodeDeclarationInMethodTxt,
  IncorrectNodeNameTxt,
  IncorrectNodesDeclarationTxt,
  IncorrectParameterInPushManyTxt,
  NodeAlreadyExistsTxt,
  StackOverflowTxt,
  StackUnderflowTxt,
} from "./texts";
const runError = errorGenerator(
  "@euriklis/mathematics DataStructures library error message",
);
export const IncorrectParameterInPushMany: () => never = () =>
  runError(IncorrectParameterInPushManyTxt);
export const StackUnderflow: (methodName: string) => () => never =
  (methodName) => () =>
    runError(StackUnderflowTxt(methodName));
export const StackOverflow: (methodName: string) => () => never =
  (methodName) => () =>
    runError(StackOverflowTxt(methodName));
export const IncorrectEdgeDeclaration: (methodName: string) => () => never =
  (methodName) => () =>
    runError(IncorrectEdgeDeclarationTxt(methodName));
export const IncorrectNodeName: () => never = () =>
  runError(IncorrectNodeNameTxt);
export const IncorrectNodesDeclaration: () => never = () =>
  runError(IncorrectNodesDeclarationTxt);
export const NodeAlreadyExists: () => never = () =>
  runError(NodeAlreadyExistsTxt);
export const InappropriateWeightDeclarationInSymmetrize: () => never = () =>
  runError(InappropriateWeightDeclarationInSymmetrizeTxt);
export const InappropriateValuesTypeDefinition: () => never = () =>
  runError(InappropriateValuesTypeDefinitionTxt);
export const InappropriateWeightsType: (name: string) => () => never =
  (name) => () =>
    runError(InappropriateWeightsTypeTxt(name));
export const InappropriateNodeValuesType: (name: string) => () => never =
  (name) => () =>
    runError(InappropriateNodeValuesTypeTxt(name));
export const InappropriateNodesDeclaration: (name: string) => () => never =
  (name) => () =>
    runError(InappropriateNodesDeclarationTxt(name));
export const IncorrectComputationGraphType: (name: string) => () => never =
  (name) => () =>
    runError(IncorrectComputationGraphTypeTxt(name));
export const InappropriatelyDefinedComputationGraph: (
  name: string,
) => () => never = (name) => () =>
  runError(InappropriatelyDefinedComputationGraphTxt(name));
export const IncorrectNodeDeclarationInMethod: (name: string) => () => never =
  (name) => () =>
    runError(IncorrectNodeDeclarationInMethodTxt(name));
