"use strict";

import { NodeAlreadyExistsTxt, NodeNotExistsTxt } from "./errorMessages.ts";
import { errorGenerator } from "../../utils";

const runError: (text: string) => never = errorGenerator(
  "@euriklis/dataStructures Graph error message",
);

export const NodeAlreadyExists = (name: string): never =>
  runError(NodeAlreadyExistsTxt(name));

export const NodeNotExists = (name: string): never =>
  runError(NodeNotExistsTxt(name));
