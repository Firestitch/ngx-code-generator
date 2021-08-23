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
import { srcPath, rootPath } from '../../main';
import { sanitizepath } from '../helpers/sanitize-path';
import { PatternType } from '../enums/pattern-type.enum';
import { findDirectoryModules } from '../helpers/find-directory-modules';

const executor = process.env.NODE_ENV === 'development'
  ? '$(which schematics)'
  : 'ng g';

/**
 * GET /
 * Home page.
 */
export let index = (req: Request, res: Response) => {
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
  --includedModuleExports=${params.includedModuleExports} \
  --routableComponent=${params.routableComponent} \
  --titledComponent=${params.titledComponent || false}`;

  let schema = '';
  switch (params.interfacePattern) {
    case PatternType.List:
      {
        schema = 'list';
        command += `\
      --service=${params.service.singularName} \
      --servicePath=/${params.service.servicePath} \
      --pluralModel=${params.pluralModelName} \
      --singleModel=${params.singularModelName} \
      --titledComponent=${params.titledComponent || false}`;
      }
      break;

    case PatternType.ListCreateEdit:
      {
        schema = 'list';
        command += `\
      --mode=${params.createEditInterfacePattern}\
      --parentName=${params.componentName} \
      --singleName=${params.createEditComponentName} \
      --service=${params.service.singularName} \
      --servicePath=/${params.service.servicePath} \
      --pluralModel=${params.pluralModelName} \
      --singleModel=${params.singularModelName} \
      --titledComponent=${params.titledComponent || false} \
      --titledCreateComponent=${params.titledCreateComponent || false} \
      --routableCreateComponent=${params.routableCreateComponent}`;
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
      --secondLevel=true \
      --path=/${params.module.modulePath} \
      --parentName=${params.componentName} \
      --parentType=${params.relatedParentType} \
      --name=${params.createEditComponentName} \
      --service=${params.service.singularName} \
      --servicePath=/${params.service.servicePath} \
      --singleModel=${params.singularModelName} \
      --titledCreateComponent=${params.titledCreateComponent || false} \
      --routableCreateComponent=${params.routableCreateComponent}`;
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

  const cmd = `${executor} @firestitch/codegenerator:${schema} ${command}`;
  console.log(cmd);
  exec(cmd, execHandler);
};

/**
 * GET /create-enum
 */
export let createEnum = (req: Request, res: Response) => {
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
  --values=${values.join()}`;

  const cmd = `${executor} @firestitch/codegenerator:enum ${command}`;
  console.log(cmd);
  exec(cmd, execHandler);
};

export let createConst = (req: Request, res: Response) => {
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
  --enumName=${params.enumData.name} \
  --enumPath=/${params.enum.enumPath} \
  --keys=${keys.join()} \
  --values="${values.join()}"`;

  const schema = 'const';

  const cmd = `${executor} @firestitch/codegenerator:${schema} ${command}`;
  console.log(cmd);
  exec(cmd, { cwd: rootPath }, execHandler);
};

export let modulesList = (req: Request, res: Response) => {
  const currentPath = path.relative(process.cwd(), srcPath);

  findAllModules(currentPath).then((modules) => {
    try {
      res.json({
        modules: modules,
      });
    } catch (err) {
      res.status(500).json({
        message: err,
      });
    }
  });
};

export let servicesList = (req: Request, res: Response) => {
  const currentPath = path.relative(process.cwd(), srcPath);

  findAllModules(currentPath).then((modules) => {
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
  });
};

export let generateService = (req: Request, res: Response) => {
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
  --pluralName=${params.pluralName} \
  --menuService`;

  const cmd = `${executor} @firestitch/codegenerator:service ${command}`;
  console.log(cmd);
  exec(cmd, execHandler);
};

export let generateModule = (req: Request, res: Response) => {
  const execHandler = (err: any, stdout: any, stderr: any) => {
    if (err) {
      res.status(500).json({
        message: fixErrorResponseMessage(stderr),
      });
    } else {
      const currentPath = path.relative(process.cwd(), srcPath);

      findAllModules(currentPath).then((modules) => {
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
      });
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

  const command = `\
  --name=${params.name} \
  --path=${params.modulePath} \
  --routing=${params.routing}`;

  const cmd = `${executor} @firestitch/codegenerator:module ${command}`;
  exec(cmd, execHandler);
  console.log(cmd);
};

export let enumKeysList = (req: any, res: Response) => {
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

export let enumsList = (req: any, res: Response) => {
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

export let getModulesFor = (req: any, res: Response) => {
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
