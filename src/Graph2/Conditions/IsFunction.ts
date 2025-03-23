"use strict";

import validator from "@euriklis/validator-ts";

export const IsFunction = (item: any) => new validator(item).isFunction.answer;
