import { promises as fs } from 'fs';
import * as ts from 'typescript';
import { getFileContent } from './get-file-content';
import { findNodes } from './ast/find-nodes';

export async function getEnumKeysList(path: string) {
  const fileExists = await fs.stat(path);

  if (!fileExists) { throw Error(`File ${path} not exists`) }

  const text = await getFileContent(path);

  const source = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true);

  const enumDeclaration = findNodes(source, ts.SyntaxKind.EnumDeclaration);
  const enumMembersDeclaration = findNodes(source, ts.SyntaxKind.EnumMember);

  const enumName = (Array.isArray(enumDeclaration)) ? (enumDeclaration[0] as any).name.text : null;
  const enumMembers = (Array.isArray(enumMembersDeclaration))
    ? enumMembersDeclaration.map((node: any) => node.name.text)
    : [];

  return {
    name: enumName,
    members: enumMembers,
  }
}
