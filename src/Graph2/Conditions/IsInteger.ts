"use strict";

import validator from "@euriklis/validator-ts";

export const IsInteger = (item: any) => new validator(item).isInteger.answer;
