// deno task copier --except=v0.1.0
import { copy, emptyDir } from "https://deno.land/std@0.212.0/fs/mod.ts";

const f = Deno.args[0].split("=");
f[0] = f[0].slice(2);

// console.log(f);

const folder = `release/${f[0]}@${f[1]}`;

await emptyDir(folder);
// await Deno.mkdir(`release/${f[0]}@${f[1]}`);

await copy(f[0], folder, {
  overwrite: true,
  preserveTimestamps: true
});

const copignore = new TextDecoder().decode(await Deno.readFile(`${f[0]}/.copignore`)).split('\n');

copignore.map(async (v) => {
  await Deno.remove(`${folder}/${v}`);
});