import * as path from 'path';
import { promises as fs } from 'fs';
import { srcPath, rootPath } from '../server';
import { sanitizepath } from './sanitize-path';


export async function findAllModules(dir: string) {
  const fileList: any = [];
  const files = await fs.readdir(dir);
  const moduleRe = /\.module\.ts$/;
  const routingModuleRe = /-routing\.module\.ts/;

  for (const file of files) {

    const stat = await fs.stat(path.join(dir, file));

    const filePath = path.join(dir, file);

    if (stat.isDirectory()) {
      fileList.push(...await findAllModules(filePath));
    }
    else {

      if (moduleRe.test(file) && !routingModuleRe.test(file)) {
        fileList.push({
          name: sanitizepath(dir.toString())
                .concat('/', file.replace(/\.ts$/, ''))
                .replace(new RegExp(`^${srcPath}/`), ''),
          modulePath: dir
                      .toString()
                      .replace(/\\/g, '/'),
          moduleFullPath: filePath.replace(/\\/g, '/'),
          moduleName: file
        });
      }
    }
  }

  return fileList;
}
