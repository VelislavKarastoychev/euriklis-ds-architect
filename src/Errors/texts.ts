"use strict";
export const IncorrectParameterInPushManyTxt =
  "Incorrect parameter in the pushMany method of the current Stack instance. Note that this parameter has to be an array of arbitrary elements.";

export const StackOverflowTxt: (method: string) => string = (name) =>
  `Stack overflow in method ${name}. The data structure limit size was achieved.`;

export const StackUnderflowTxt: (method: string) => string = (method) =>
  `Stack underflow in method ${method}. The data structure is empty.`;

export const IncorrectEdgeDeclarationTxt: (methodName: string) => string = (
  methodName,
) =>
  `Incorrect edge declaration in the ${methodName} method. Probably the source or target nodes does not exist.`;
export const IncorrectNodeNameTxt =
  "Incorrect node name in the addNode method. Node with this name already exists. Use updateNode if you want to change the data of that node.";

export const IncorrectNodesDeclarationTxt =
  "Incorrect nodes declaration in the generateGraphNodes static method.";
export const NodeAlreadyExistsTxt =
  "The node inserted with the method addNode already exists. If you want to change some data of this node, please use the method updateNode.";
export const InappropriateWeightDeclarationInSymmetrizeTxt =
  "Inappropriate type of the weights in the symmetric method. All the weight pairs have to be with the same type. The types which are allowed are number, number array, typed array, typed matrixand numeric matrix.";
export const InappropriateValuesTypeDefinitionTxt =
  "Inappropriate values type of the graph in the assignNodeValuesToNumber method. The valuesType has to be set to 'Numeric'.";
export const InappropriateWeightsTypeTxt = (name: string) =>
  `Inappropriate weights type in ${name} method.`;
export const InappropriateNodeValuesTypeTxt = (name: string) =>
  `Inappropriate node valuesType property in ${name} method of the Graph library.`;
export const InappropriateNodesDeclarationTxt = (title: string): string =>
  `Inappropriate nodes declaration in the ${title} method of the ComputationGraph library.`;
export const IncorrectComputationGraphTypeTxt = (title: string): string =>
  `Incorrect type of the ComputationGraph instance in ${title} method. Please check the types of the nodes and the edges.`;
export const InappropriatelyDefinedComputationGraphTxt = (
  title: string,
): string =>
  `Inappropriately defined / constructed ComputationGraph instance in ${title} method.`;
export const IncorrectNodeDeclarationInMethodTxt: (title: string) => string = (
  title,
) => `Incorrectly defined node parameter in the ${title} method.`;
