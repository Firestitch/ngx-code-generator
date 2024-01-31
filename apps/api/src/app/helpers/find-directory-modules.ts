import { promises as fs } from 'fs';
import * as path from 'path';
import { getSrcPath } from '../../main';

export async function findDirectoryModules(project, modulePath: string) {
  if (modulePath[modulePath.length - 1] !== '/') {
    modulePath += '/';
  }

  return getChildDirectories(project, modulePath);
}

async function getChildDirectories(project, targetPath: string) {
  const fullPath = path.join(getSrcPath(project), targetPath);

  console.debug(fullPath);

  let targetDirStat;

  try {
    targetDirStat = await fs.stat(fullPath);
  } catch (e) {
    return [];
  }

  if (!targetDirStat || !targetDirStat.isDirectory()) {
    throw Error(`Directory ${fullPath} not exists`);
  }

  const files = await fs.readdir(fullPath, { withFileTypes: true });

  return files.filter((target) => target.isDirectory()).map((dir) => dir.name);
}
