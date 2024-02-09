export type Runner = (body: Body, v: any) => any;
export type Structure = Record<string, Block>;

export type Block = { func?: Function, execs?: Function[] };
export type Body = Record<string, any>;

/**
 * @param struct A `Record<string, { func?: Function, execs?: Function[] }>` representation of the structure of the incoming data.
 * 
 * The `func` property is optional, and is a function, which runs at the very end of the check-chain. Before that runs the `execs` array, which is also optional.
 * 
 * All functions above get 3 parameters.
 *  - `value`: The value of the current key from the body.
 *  - `body`: The whole body object.
 *  - `v`: A global `expect` function variable, which can store and carry data set in any of the functions above.
 * 
 * Below is an example of how the structure should look like. 
 * @example
 * ```
 * let structure: Structure = {
 *   username: { 
 *     func: (value, body, v) => {
 *       value.length > 8 ? v.username = value : 
 *       stop({ message: `The value ${value} with lenght ${value.length} of username is not longer than 8.` 
 *     })}
 *   },
 *   password: {
 *     execs: [
 *       (value, body, v) => {v.username == value && stop({ message: `Username ${v.username} is equal to password ${value}. Not recommended.`, warn: true })}, 
 *       (value, body, v) => {value.length < 8 && stop({ message: `Password ${value} with length ${value.lenght} is shorter than 8.`})}
 *     ]
 *   }
 * }
 * ```
 * 
 * @param body The body represented in a `Record<string, any>` type. This is data which will be used against the struct.
 * @example
 * ```
 * let body: Body = {
 *   username: "admincyla",
 *   password: "cyladmin"
 * };
 * ```
 * 
 * @param runner The function running after the body passed the struct's conditions.
 * 
 * The runner get's the parameters below.
 *  - `body`: The whole body object.
 *  - `v`: A global `expect` function variable, which can store and carry data set in any of the functions above.
 * @example
 * ```
 * let runner: Runner = (body, v) => {
 *   // run the logic, eg. log in to a system, etc.
 * }
 * ```
 * 
 * Putting all together, this is how the function should be invoked.
 * @example
 * ```
 * expect(structure, body, runner);
 * ```
 * 
 * Note, that async-await can be used on `func`, `execs` functions and `runner`, but then, the `expect` needs to be awaited.
 * 
 * @returns It returns what the `runner` returns.
 * 
 * The module also has an additional `stop` function, which can be used to throw error or just warn.
 * @example
 * ```
 * // Note that warn can be left out, if it's a breaking stop.
 * stop({ message: `Username ${v.username} is equal to password ${value}. Not recommended.`, warn: true })
 * ```
 * 
 * @link https://github.com/reited/silly
 */
export async function expect(struct: Structure, body: Body, runner: Runner) {

  let v: any = {};
  Object.entries(struct).map(async ([key, value]) => {
    if (!body[key]) {
      stop({ message: `Built-in Error: body doesn't contain key ${key} defined in struct.` })
    }
    value.execs?.map(async exec => await exec(body[key], body, v));
    if (value.func) {
      await value.func(body[key], body, v);
    }
  });

  return await runner(body, v);

}

export function stop({ message, warn }: { message: string, warn?: boolean }) {
  let error = `${message || ""}`;
  if (!warn) {
    throw new Error(error);
  } else {
    console.warn(error);
  }
}