import { promises as fs } from 'fs';
import * as path from 'path';
import { srcPath } from '../server';

export async function findDirectoryModules(modulePath: string) {

  const level = modulePath.split('/')
    .filter((val) => !!val).length;

  if (modulePath[modulePath.length - 1] !== '/') {
    modulePath += '/';
  }

  if (level === 0) {
    return await ['/app', '/libs'];
  } else {
    return getChildDirectories(modulePath);
   }
}

async function getChildDirectories(targetPath: string) {
  const fullPath = path.join(srcPath, targetPath);

  let targetDirStat;

  try {
    targetDirStat = await fs.stat(fullPath);
  } catch (e) {
    return [];
  }

  if (!targetDirStat || !targetDirStat.isDirectory()) { throw Error(`Directory ${fullPath} not exists`) }

  const files = await fs.readdir(fullPath, { withFileTypes: true });

  return  files
    .filter((target) => target.isDirectory())
    .map((dir) => dir.name);
}
