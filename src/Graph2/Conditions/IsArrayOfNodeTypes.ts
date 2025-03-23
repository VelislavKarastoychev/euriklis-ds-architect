"use strict";

import validator from "@euriklis/validator-ts";

export const IsArrayOfNodeTypes = (item: any) =>
  new validator(item).isArray.and.forEvery((node) => {
    return node.interface({
      name: (n) => n.isString,
      attributes: (attr) => attr.isObject,
    });
  }).answer;
