import { rootPath } from '../server';

export function stripRoot(path: string) {
  return path.replace(new RegExp(`/^${rootPath}\/`), '');
}
