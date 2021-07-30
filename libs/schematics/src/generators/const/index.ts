import {
  apply,
  branchAndMerge,
  chain,
  filter,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  Tree,
  url,
  template,
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';

import { Config } from './config';
import { getWorkspace } from '../../utils/get-workspace';
import { updateIndexFile } from '../../utils/ng-module-utils';
import { ExpansionType } from '../../utils/models';
import {
  buildRelativePathForEnum,
} from '../../utils/build-correct-path';


function filterTemplates(options: any): Rule {
  return filter(path => !path.match(/\.bak$/));
}

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function create(options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const workspace = getWorkspace(tree);
    const config: Config = { ...options };

    if (!config.project) {
      config.project = Object.keys(workspace.projects)[0];
    }

    const keys = options.keys.split(',');
    const values = options.values.split(',');

    if (keys.length !== values.length) {
      throw new Error('Key != Values');
    }

    config.name = String(config.name);
    config.enums = [];

    keys.forEach((key, index) => {
      config.enums.push({
        key: String(values[index]),
        value: String(key),
      });
    });

    config.componentPath = '/' + config.path + '/consts';

    config.relativeEnumPath = buildRelativePathForEnum(config);

    const templateSource = apply(url('./files'), [
      filterTemplates(config),
      template({
        ...strings,
        ...config
      }),
      () => { console.debug('path', config.componentPath )},
      move(config.componentPath)
    ]);


    const rule = chain([
      branchAndMerge(chain([
        mergeWith(templateSource),
        updateIndexFile(config, ExpansionType.Const)
      ]))
    ]);

    return rule(tree, _context);
  };
}
