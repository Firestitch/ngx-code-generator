import { promises as fs } from 'fs';
import { stripRoot } from './strip-root';

export async function findAllEnums(dir: any) {

  console.log('findAllEnums', dir);

  const enums: any = [];
  const targetDirStat = await fs.stat(dir);
  const enumsRe = /\.enum\.ts$/;

  if (!targetDirStat || !targetDirStat.isDirectory()) { throw Error(`Directory ${dir} not exists`) }

  const files = await fs.readdir(dir);

  for (const file of files) {

    if (enumsRe.test(file)) {
      enums.push({
        enumPath: dir,
        enumFile: file,
        enumFullPath: dir + '/' + file,
        name: file.replace(/\.ts$/, '')
      })
    }
  }

  return enums;
}
