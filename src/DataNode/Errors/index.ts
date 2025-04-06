"use strict";

import { errorGenerator } from "../../utils";

const runError = errorGenerator("@euriklis/graphworlds Graph node error");

export const EdgeAlreadyExists: (link: string) => () => never = (
  link: string,
): never => runError(`The edge ${link} already exists.`);
