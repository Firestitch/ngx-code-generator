import { Request, Response } from 'express';
import { exec } from 'child_process';
import { ListCreationType } from '../common/list-creation-type';

/**
 * GET /
 * Home page.
 */
export let index = (req: Request, res: Response) => {

  const execHandler = (err: any, stdout: any, stderr: any) => {
    if (err) {
      res.status(500).json({
        message: stderr
      });
    } else {
      res.json({
        message: stdout
      })
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  };

  const params = req.body;

  if (!params.componentName || !params.module) {
    res.status(400).json({
      message: 'Component and Module are requierd'
    });

    return;
  }

  let command = `\
  --name=${params.componentName} \
  --module=${params.module.moduleName} \
  --path=${params.module.modulePath}`;

  let schema = '';

  switch (params.interfacePattern) {
    case ListCreationType.list: {
      schema = 'list';
    } break;

    case ListCreationType.listCreateEditFull: {
      schema = 'list';
      command += `\
      --mode=full\
      --singleName=${params.singularComponentName}`;
    } break;

    case ListCreationType.listCreateEditDialog: {
      schema = 'list';

      command += `\
      --mode=dialog \
      --singleName=${params.singularComponentName}`;

    } break;

    case ListCreationType.CreateEditFull: {
      schema = 'list-create';

      command = `\
      --mode='full'\
      --parentName=${params.componentName} \
      --module=${params.module.moduleFullPath} \
      --secondLevel=true \
      --path=${params.module.modulePath}/${params.componentName} \
      --singleName=${params.singularComponentName}\
      --name=${params.singularComponentName}`;
    } break;

    case ListCreationType.CreateEditDialog: {
      schema = 'list-create-dialog';

      command = `\
      --mode='dialog'\
      --parentName=${params.componentName} \
      --module=${params.module.moduleFullPath} \
      --secondLevel=true \
      --path=${params.module.modulePath}/${params.componentName} \
      --singleName=${params.singularComponentName}\
      --name=${params.singularComponentName}`;

    } break;
  }

  exec(`ng g @firestitch/schematics:${schema} ${command}`, execHandler);
};

export let modulesList = (req: Request, res: Response) => {


  exec(`ng g @firestitch/schematics:modules-list`, (err, stdout, stderr) => {
    if (err) {
      res.status(500).json({
        message: stderr
      });
    } else {
      try {
        const list = JSON.parse(stdout.replace('Nothing to be done.', ''));

        res.json({
          modules: list
        });
      } catch (e) {
        res
          .status(500)
          .json({
            message: e
          }) ;
      }
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
};
