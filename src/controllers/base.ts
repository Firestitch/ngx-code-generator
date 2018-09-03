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

  let command = `--name=${params.componentName} --module=${params.module.moduleName} --path=${params.module.modulePath}`;
  let schema = '';

  switch (params.interfacePattern) {
    case ListCreationType.list: {
      schema = 'list';
      // console.log(`ng g @firestitch/schematics:${schema} ${command}`);
      exec(`ng g @firestitch/schematics:${schema} ${command}`, execHandler);
    } break;
    case ListCreationType.listCreateEditFull: {
      schema = 'list';
      command += ' --create --edit';
      exec(`ng g @firestitch/schematics:${schema} ${command}`, execHandler);
    } break;
    case ListCreationType.listCreateEditDialog: {
      schema = 'list';
      command += ` --dialog --singleName=${params.singularComponentName}`;
      // console.log(`ng g @firestitch/schematics:${schema} ${command}`);
      exec(`ng g @firestitch/schematics:${schema} ${command}`, execHandler);
    } break;
    case ListCreationType.CreateEditFull: {
      schema = 'list-create-edit';
      command = ` --parentName=${params.componentName} --module=${params.module.moduleFullPath} --secondLevel=true --path=${params.module.modulePath}/${params.componentName} --childName=create --childRoute=true`;
      const command2 = ` --parentName=${params.componentName} --module=${params.module.moduleFullPath} --secondLevel=true --path=${params.module.modulePath}/${params.componentName} --childName=edit --childRoute=true`;

      exec(`ng g @firestitch/schematics:${schema} ${command} && ng g @firestitch/schematics:${schema} ${command2}`, execHandler);//ng g @firestitch/schematics:list-create-edit --parentName=users --create --edit --module=/src/app/module1/module1.module.ts --project=test-app secondLevel=true --path=/src/app/module1/users --childName=create
    } break;

    case ListCreationType.CreateEditDialog: {
      schema = 'list-create-edit-dialog';
      command = ` --dialog --parentName=${params.componentName} --module=${params.module.moduleFullPath} --secondLevel=true --path=${params.module.modulePath}/${params.componentName} --singleName=${params.singularComponentName} --childName=${params.singularComponentName} --childRoute=true`;
      // console.log(`ng g @firestitch/schematics:${schema} ${command}`);
      exec(`ng g @firestitch/schematics:${schema} ${command}`, execHandler);
    } break;
  }
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
