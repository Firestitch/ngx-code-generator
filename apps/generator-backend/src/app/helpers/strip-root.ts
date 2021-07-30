import { rootPath } from '../../main';

export function stripRoot(path: string) {
  return path.replace(new RegExp(`/^${rootPath}\/`), '');
}
