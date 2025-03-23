"use strict";

import validator from "@euriklis/validator-ts";

export const IsObject = (item: any) => new validator(item).isObject.answer;
