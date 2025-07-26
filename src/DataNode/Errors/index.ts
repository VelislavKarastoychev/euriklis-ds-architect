"use strict";

import { errorGenerator } from "../../utils";

const runError = errorGenerator("@euriklis/graphworlds Graph node error");

export const EdgeAlreadyExists = (link: string): never =>
  runError(`The edge ${link} already exists.`);

export const NameIsRequired = (): never =>
  runError("The name is required in order to create a node.");
