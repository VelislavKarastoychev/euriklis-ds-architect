import validator from "@euriklis/validator-ts";
export const max = Math.max;
export const errorGenerator =
  (name: string) =>
  (text: string): never => {
    const error: Error = new Error();
    error.name = name;
    error.message = text;
    throw error;
  };
export const IsSame = (a: any, b: any) => new validator(a).isSame(b).answer;
export const IsIntegerArray = (item: any) =>
  new validator(item).isIntegerArray.answer;
