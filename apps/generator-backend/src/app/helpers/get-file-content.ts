import { promises as fs } from 'fs';


export async function getFileContent(file: string) {
  return await fs.readFile(file, 'utf8');
}
