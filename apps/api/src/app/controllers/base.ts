import { Request, Response } from 'express';
import { exec } from 'child_process';
import * as path from 'path';
import {
  findAllModules,
  findAllServices,
  getFileContent,
  getEnumKeysList,
  findAllEnums,
} from '../helpers';
import { fixErrorResponseMessage } from '../helpers/fix-error-response-message';
import { dasherize } from '@angular-devkit/core/src/utils/strings';
import { getSrcPath, getProjects } from '../../main';
import { sanitizepath } from '../helpers/sanitize-path';
import { PatternType } from '../enums/pattern-type.enum';
import { findDirectoryModules } from '../helpers/find-directory-modules';

/**
 * GET /
 * Home page.
 */
export const generate = (req: Request, res: Response) => {
  const execHandler = (err: any, stdout: any, stderr: any) => {
    if (err) {
      res.status(500).json({
        message: fixErrorResponseMessage(stderr),
      });
    } else {
      res.json({
        message: stdout,
      });
    }
    console.log(`${stdout}`);
    console.log(`${stderr}`);
  };

  const params = req.body;

  if (!params.module) {
    res.status(400).json({
      message: 'Module requierd',
    });

    return;
  }

  let command = `\
  --name=${params.componentName} \
  --module=${params.module.moduleName} \
  --path=/${params.module.modulePath} \
  --included-module-exports=${params.includedModuleExports} \
  --routable-component=${params.routableComponent} \
  --route-observer=${params.routeObserver} \
  --titled-component=${params.titledComponent || false}`;

  let schema = '';
  switch (params.interfacePattern) {
    case PatternType.List:
      {
        schema = 'list';
        command += `\
      --service=${params.service.singularName} \
      --service-path=/${params.service.servicePath} \
      --plural-model=${params.pluralModelName} \
      --single-model=${params.singularModelName}`;
      }
      break;

    case PatternType.ListCreateEdit:
      {
        schema = 'list';
        command += `\
      --mode=${params.createEditInterfacePattern}\
      --parent-name=${params.componentName} \
      --single-name=${params.createEditComponentName} \
      --service=${params.service.singularName} \
      --service-path=/${params.service.servicePath} \
      --plural-model=${params.pluralModelName} \
      --single-model=${params.singularModelName} \
      --titled-create-component=${params.titledCreateComponent || false} \
      --routable-create-component=${params.routableCreateComponent}`;
      }
      break;

    case PatternType.CreateEdit:
      {
        if (params.createEditInterfacePattern === 'dialog') {
          schema = 'create-edit-dialog';
        } else {
          schema = 'create-edit-page';
        }

        command = `\
      --mode=${params.createEditInterfacePattern}\
      --module=/${params.module.moduleFullPath} \
      --second-level=true \
      --path=/${params.module.modulePath} \
      --parent-name=${params.componentName} \
      --parent-type=${params.relatedParentType} \
      --name=${params.createEditComponentName} \
      --service=${params.service.singularName} \
      --service-path=/${params.service.servicePath} \
      --single-model=${params.singularModelName} \
      --titled-create-component=${params.titledCreateComponent || false} \
      --routable-create-component=${params.routableCreateComponent} \
      --titled-component=${params.titledComponent || false}`;
      }
      break;

    case PatternType.Basic:
      {
        schema = 'basic';
      }
      break;

    case PatternType.Dialog:
      {
        schema = 'dialog';
      }
      break;

    case PatternType.Tabs:
      {
        schema = 'tabs';
      }
      break;
  }

  const cmd = makeCMD(schema, command);
  console.log(cmd);
  exec(cmd, execHandler);
};

/**
 * GET /create-enum
 */
export const createEnum = (req: Request, res: Response) => {
  const execHandler = (err: any, stdout: any, stderr: any) => {
    if (stderr) {
      res.status(500).json({
        message: fixErrorResponseMessage(stderr),
      });
    } else {
      const name = dasherize(params.name);
      const filePath = path.join(
        process.cwd(),
        params.module.modulePath,
        'enums',
        `${name}.enum.ts`
      );

      try {
        getFileContent(filePath).then((content) => {
          res.json({
            code: content,
            path: path.join(
              params.module.modulePath,
              'enums',
              `${name}.enum.ts`
            ),
          });
        });
      } catch (e) {
        res.status(500).json({
          message: e,
        });
      }
    }
    console.log(`${stdout}`);
    console.log(`${stderr}`);
  };

  const params = req.body;

  if (!params.name || !params.module) {
    res.status(400).json({
      message: 'Component and Module are requierd',
    });

    return;
  }

  const keys: any = [];
  const values: any = [];

  params.enums.forEach((en: any) => {
    keys.push(en.name);
    values.push(en.value);
  });

  const command = `\
  --name=${params.name} \
  --path=/${params.module.modulePath} \
  --keys=${keys.join()} \
  --values="${values.join()}"`;

  const cmd = makeCMD('enum', command);
  console.log(cmd);
  exec(cmd, execHandler);
};

export const createConst = (req: Request, res: Response) => {
  const execHandler = (err: any, stdout: any, stderr: any) => {
    if (err) {
      res.status(500).json({
        message: fixErrorResponseMessage(stderr),
      });
    } else {
      const name = dasherize(params.name);
      const filePath = path.join(
        process.cwd(),
        params.module.modulePath,
        'consts',
        `${name}.const.ts`
      );

      try {
        getFileContent(filePath).then((content) => {
          res.json({
            code: content,
            path: path.join(
              params.module.modulePath,
              'consts',
              `${name}.const.ts`
            ),
          });
        });
      } catch (e) {
        res.status(500).json({
          message: e,
        });
      }
    }
    console.log(`${stdout}`);
    console.log(`${stderr}`);
  };

  const params = req.body;

  if (!params.name || !params.module) {
    res.status(400).json({
      message: 'Component and Module are requierd',
    });

    return;
  }

  const keys: any = [];
  const values: any = [];

  let idx = 0;
  params.enumData.members.forEach((en: any) => {
    keys.push(en);
    values.push(params.consts[idx]);
    idx++;
  });

  const command = `\
  --name=${params.name} \
  --path=/${params.module.modulePath} \
  --enum-name=${params.enumData.name} \
  --enum-path=/${params.enum.enumPath} \
  --keys=${keys.join()} \
  --values="${values.join()}"`;

  const schema = 'const';

  const cmd = makeCMD(schema, command);
  console.log(cmd);
  exec(cmd, { }, execHandler);
};

export const modulesList = async (req: Request, res: Response) => {
  try {
    const project = String(req.query.project);
    const modules = await getModulesList(project);
    res.json({
      modules,
    });
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
};

export const projectsList = async (req: Request, res: Response) => {
  try {
    const projects = await getProjectsList();
    res.json({
      projects,
    });
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
};

export const servicesList = async (req: Request, res: Response) => {
  const project = req.body.project?.name;
  const modules = await getModulesList(project);

  findAllServices(modules).then((services) => {
    try {
      res.json({
        services: services,
      });
    } catch (err) {
      res.status(500).json({
        message: fixErrorResponseMessage(err),
      });
    }
  });
};

export const generateService = (req: Request, res: Response) => {
  const execHandler = (err: any, stdout: any, stderr: any) => {
    if (err) {
      res.status(500).json({
        message: fixErrorResponseMessage(stderr),
      });
    } else {
      res.json({
        message: stdout,
      });
    }
    console.log(`${stdout}`);
    console.log(`${stderr}`);
  };

  const params = req.body;

  if (!params.singularName || !params.pluralName || !params.module) {
    res.status(400).json({
      message: 'Name and Module are required',
    });

    return;
  }

  const command = `\
  --name=${params.singularName} \
  --module=${params.module.moduleName} \
  --path=/${params.module.modulePath} \
  --subdirectory=${params.subdirectory} \
  --plural-name=${params.pluralName} \
  --menu-service`;

  const cmd = makeCMD('service', command);
  console.log(cmd);
  exec(cmd, execHandler);
};

export const generateModule = (req: Request, res: Response) => {
  const execHandler = async (err: any, stdout: any, stderr: any) => {
    if (err) {
      res.status(500).json({
        message: fixErrorResponseMessage(stderr),
      });
    } else {

      const project = req.body.project?.name;
      const modules = await getModulesList(project);
      const search = params.modulePath
        .replace(/^\//, '')
        .concat(params.name, '/', params.name, '.module');

      // try to find module that was already created
      module = modules.find((m: any) => {
        return m.name === search;
      });

      console.log(search, module);

      try {
        res.json({
          module: module,
          modules: modules,
        });
      } catch (err) {
        res.status(500).json({
          message: err,
        });
      }
    }
    console.log(`${stdout}`);
    console.log(`${stderr}`);
  };

  const params = req.body;
  console.log(params);

  if (!params.name) {
    res.status(400).json({
      message: 'Name is required',
    });

    return;
  }

  const modulePath = path.join(getSrcPath(params.project?.name), params.modulePath);

  const command = `\
  --name=${params.name} \
  --path=${modulePath} \
  --routing=${params.routing}`;

  const cmd = makeCMD('module', command);
  exec(cmd, execHandler);
  console.log(cmd);
};

export const enumKeysList = (req: any, res: Response) => {
  const params = req.query;

  if (!params.enumPath) {
    res.status(400).json({
      message: 'Name is required',
    });
  }

  const currentPath = path.relative(process.cwd(), params.enumPath);

  try {
    getEnumKeysList(currentPath).then((data) => {
      res.json(data);
    });
  } catch (e) {
    res.status(500).json({
      message: e,
    });
  }
};

export const enumsList = (req: any, res: Response) => {
  const params = req.query;

  if (!params.enumPath) {
    res.status(400).json({
      message: 'Name is required',
    });
  }

  const currentPath = sanitizepath(
    path.relative(process.cwd(), path.join(params.enumPath, 'enums'))
  );

  try {
    findAllEnums(currentPath).then((data) => {
      res.json(data);
    });
  } catch (e) {
    res.status(500).json({
      message: e,
    });
  }
};

export const getModulesFor = (req: any, res: Response) => {
  const params = req.query;

  if (!params.currentPath) {
    res.status(400).json({
      message: 'Name is required',
    });
  }

  try {
    findDirectoryModules(params.currentPath).then((data) => {
      res.json(data);
    });
  } catch (e) {
    res.status(500).json({
      message: e,
    });
  }
};

async function getProjectsList(): Promise<any[]> {
  const modules = getProjects();

  return modules;
}

async function getModulesList(project: string): Promise<any[]> {
  const currentPath = path.relative(process.cwd() || '', getSrcPath(project) || '');

  const projectModules = await findAllModules(currentPath)
  const modules = [
    ...projectModules,
  ];

  return modules;
}

function makeCMD(schema: string, command: string): string {
  const executor = 'npx schematics';

  const schematic = process.env.NODE_ENV === 'development'
    ? '.'
    : '@firestitch/codegenerator';

  let cmd = `${executor} ${schematic}:${schema} ${command}`;

  if (process.env.NODE_ENV === 'development') {
    cmd += ' --dry-run=false'
  }

  return cmd;
}
