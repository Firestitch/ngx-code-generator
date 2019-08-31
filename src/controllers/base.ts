import { Request, Response } from 'express';
import { exec } from 'child_process';
import * as path from 'path';
import { findAllModules, findAllServices, getFileContent, getEnumKeysList, findAllEnums } from '../helpers';
import { fixErrorResponseMessage } from '../helpers/fix-error-response-message';
import { dasherize } from '@angular-devkit/core/src/utils/strings';
import { srcPath, rootPath } from '../server';
import { sanitizepath } from '../helpers/sanitize-path';
import { PatternType } from '../enums/pattern-type.enum';

/**
 * GET /
 * Home page.
 */
export let index = (req: Request, res: Response) => {

  const execHandler = (err: any, stdout: any, stderr: any) => {
    if (err) {
      res.status(500).json({
        message: fixErrorResponseMessage(stderr)
      });
    } else {
      res.json({
        message: stdout
      })
    }
    console.log(`${stdout}`);
    console.log(`${stderr}`);
  };

  const params = req.body;

  if (!params.module) {
    res.status(400).json({
      message: 'Module requierd'
    });

    return;
  }

  let command = `\
  --name=${params.componentName} \
  --module=${params.module.moduleName} \
  --path=/${params.module.modulePath} \
  --routableComponent=${params.routableComponent}`;

  let schema = '';

  switch (params.interfacePattern) {
    case PatternType.List: {
      schema = 'list';
      command += `\
      --service=${params.service.singularName} \
      --servicePath=/${params.service.servicePath} \
      --pluralModel=${params.pluralModelName} \
      --singleModel=${params.singularModelName}`
    } break;

    case PatternType.ListCreateEdit: {
      schema = 'list';
      command += `\
      --mode=${params.createEditInterfacePattern}\
      --parentName=${params.componentName} \
      --singleName=${params.createEditComponentName} \
      --service=${params.service.singularName} \
      --servicePath=/${params.service.servicePath} \
      --pluralModel=${params.pluralModelName} \
      --singleModel=${params.singularModelName} \
      --routableCreateComponent=${params.routableCreateComponent}`;
    } break;

    case PatternType.CreateEdit: {
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
      --routableCreateComponent=${params.routableCreateComponent}`;
    } break;

    case PatternType.Basic: {
      schema = 'base';
    }
  }

  const cmd = `ng g @firestitch/schematics:${schema} ${command}`;
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
        message: fixErrorResponseMessage(stderr)
      });
    } else {
      const name = dasherize(params.name);
      const filePath = path.join(process.cwd(), params.module.modulePath, 'enums', `${name}.enum.ts`);

      try {
        getFileContent(filePath).then((content) => {
          res.json({
            code: content,
            path: path.join(params.module.modulePath, 'enums', `${name}.enum.ts`),
          })
        });

      } catch (e) {
        res.status(500).json({
          message: e
        });
      }
    }
    console.log(`${stdout}`);
    console.log(`${stderr}`);
  };

  const params = req.body;

  if (!params.name || !params.module) {
    res.status(400).json({
      message: 'Component and Module are requierd'
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

  const cmd = `ng g @firestitch/schematics:enum ${command}`;
  console.log(cmd);
  exec(cmd, execHandler);
};

export let createConst = (req: Request, res: Response) => {

  const execHandler = (err: any, stdout: any, stderr: any) => {
    if (err) {
      res.status(500).json({
        message: fixErrorResponseMessage(stderr)
      });
    } else {

      const name = dasherize(params.name);
      const filePath = path.join(process.cwd(), params.module.modulePath, 'consts', `${name}.const.ts`);

      try {
        getFileContent(filePath).then((content) => {
          res.json({
            code: content,
            path: path.join(params.module.modulePath, 'consts', `${name}.const.ts`),
          })
        });
      } catch (e) {
        res.status(500).json({
          message: e
        });
      }
    }
    console.log(`${stdout}`);
    console.log(`${stderr}`);
  };

  const params = req.body;

  if (!params.name || !params.module) {
    res.status(400).json({
      message: 'Component and Module are requierd'
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
  --values=${values.join()}`;

  const schema = 'const';

  const cmd = `ng g @firestitch/schematics:${schema} ${command}`;
  console.log(cmd);
  exec(cmd, { cwd: rootPath }, execHandler);
};

export let modulesList = (req: Request, res: Response) => {
  const currentPath = path.relative(process.cwd(), srcPath);

  findAllModules(currentPath).then((modules) => {
    try {
      res.json({
        modules: modules
      });

    } catch (err) {
      res.status(500).json({
        message: err
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
          services: services
        });

      } catch (err) {
        res.status(500).json({
          message: fixErrorResponseMessage(err)
        });
      }
    });
  });
};

export let generateService = (req: Request, res: Response) => {
  const execHandler = (err: any, stdout: any, stderr: any) => {
    if (err) {
      res.status(500).json({
        message: fixErrorResponseMessage(stderr)
      });
    } else {
      res.json({
        message: stdout
      })
    }
    console.log(`${stdout}`);
    console.log(`${stderr}`);
  };

  const params = req.body;

  if (!params.singularName || !params.pluralName || !params.module) {
    res.status(400).json({
      message: 'Name and Module are required'
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

  const cmd = `ng g @firestitch/schematics:service ${command}`;
  console.log(cmd);
  exec(cmd, execHandler);

};

export let generateModule = (req: Request, res: Response) => {
  const execHandler = (err: any, stdout: any, stderr: any) => {
    if (err) {
      res.status(500).json({
        message: fixErrorResponseMessage(stderr)
      });
    } else {
      res.json({
        message: stdout
      })
    }
    console.log(`${stdout}`);
    console.log(`${stderr}`);
  };

  const params = req.body;
  console.log(params);

  if (!params.name) {
    res.status(400).json({
      message: 'Name is required'
    });

    return;
  }

  const command = `\
  --name=${params.name} \
  --path=/${params.module.modulePath} \
  --module=/${params.module.moduleName} \
  --routing=${params.routing}`;

  const cmd = `ng g @firestitch/schematics:module ${command}`;
  exec(cmd, execHandler);
  console.log(cmd);
};

export let enumKeysList = (req: Request, res: Response) => {
  const params = req.query;

  if (!params.enumPath) {
    res.status(400).json({
      message: 'Name is required'
    });
  }

  const currentPath = path.relative(process.cwd(), params.enumPath);

  try {
    getEnumKeysList(currentPath).then((data) => {
      res.json(data);
    });
  } catch (e) {
    res.status(500).json({
      message: e
    });
  }
};

export let enumsList = (req: Request, res: Response) => {
  const params = req.query;

  if (!params.enumPath) {
    res.status(400).json({
      message: 'Name is required'
    });
  }

  const currentPath = sanitizepath(path.relative(process.cwd(), path.join(params.enumPath, 'enums')));

  try {
    findAllEnums(currentPath).then((data) => {
      res.json(data);
    });
  } catch (e) {
    res.status(500).json({
      message: e
    });
  }
};
