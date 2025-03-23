"use strict";

import validator from "@euriklis/validator-ts";

export const IsStringArray = (item: any) =>
  new validator(item).isStringArray.answer;
