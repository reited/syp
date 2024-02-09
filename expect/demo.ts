import { Structure, Body, Runner, expect, stop } from "./expect.ts";

let structure: Structure = {
  username: { 
    func: (value, body, v) => {
      value.length > 8 ? v.username = value : 
      stop({ message: `The value ${value} with lenght ${value.length} of username is not longer than 8.`
    })}
  },
  password: { 
    execs: [
      (value, body, v) => {v.username == value && stop({ message: `Username ${v.username} is equal to password ${value}. Not recommended.`, warn: true })}, 
      (value, body, v) => {value.length < 8 && stop({ message: `Password ${value} with length ${value.lenght} is shorter than 8.`})}
    ]
  }
}

let body: Body = {
  username: "admincyla",
  password: "cyladmin"
};

let runner: Runner = (body, v) => {
  // run the logic, eg. log in to a system, etc.
}

expect(structure, body, runner);