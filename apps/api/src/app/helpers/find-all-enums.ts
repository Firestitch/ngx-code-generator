import { promises as fs, existsSync } from 'fs';

export async function findAllEnums(dir: any) {
  const enums: any = [];

  if(!existsSync(dir)) {
    return [];
  }
  
  const targetDirStat = await fs.stat(dir);
  const enumsRe = /\.enum\.ts$/;

  if (!targetDirStat || !targetDirStat.isDirectory()) {
    throw Error(`Directory ${dir} not exists`);
  }

  const files = await fs.readdir(dir);

  for (const file of files) {
    if (enumsRe.test(file)) {
      enums.push({
        enumPath: dir,
        enumFile: file,
        enumFullPath: dir + '/' + file,
        name: file.replace(/\.ts$/, ''),
      });
    }
  }

  return enums;
}
