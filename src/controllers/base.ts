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

  if (!params.pluralComponentName || !params.module) {
    res.status(400).json({
      message: 'Component and Module are requierd'
    });

    return;
  }

  let command = `\
  --name=${params.pluralComponentName} \
  --module=${params.module.moduleName} \
  --path=${params.module.modulePath} \ `;

  let schema = '';

  switch (params.interfacePattern) {
    case ListCreationType.list: {
      schema = 'list';
      command += `\
      --service=${params.service.singularName} \
      --servicePath=${params.service.servicePath}`
    } break;

    case ListCreationType.listCreateEditFull: {
      schema = 'list';
      command += `\
      --mode=full\
      --singleName=${params.singularComponentName} \
      --service=${params.service.singularName} \
      --servicePath=${params.service.servicePath}`;
    } break;

    case ListCreationType.listCreateEditDialog: {
      schema = 'list';

      command += `\
      --mode=dialog \
      --singleName=${params.singularComponentName} \
      --service=${params.service.singularName} \
      --servicePath=${params.service.servicePath}`;

    } break;

    case ListCreationType.CreateEditFull: {
      schema = 'list-create';

      command = `\
      --mode='full'\
      --parentName=${params.pluralComponentName} \
      --module=${params.module.moduleFullPath} \
      --secondLevel=true \
      --path=${params.module.modulePath}/${params.pluralComponentName} \
      --singleName=${params.singularComponentName}\
      --name=${params.singularComponentName} \
      --service=${params.service.singularName} \
      --servicePath=${params.service.servicePath}`;
    } break;

    case ListCreationType.CreateEditDialog: {
      schema = 'list-create-dialog';

      command = `\
      --mode='dialog'\
      --parentName=${params.pluralComponentName} \
      --module=${params.module.moduleFullPath} \
      --secondLevel=true \
      --path=${params.module.modulePath}/${params.pluralComponentName} \
      --singleName=${params.singularComponentName}\
      --name=${params.singularComponentName}
      --service=${params.service.singularName} \
      --servicePath=${params.service.servicePath}`;

    } break;

    case ListCreationType.Basic: {
      schema = 'base';
    }
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

export let servicesList = (req: Request, res: Response) => {
  exec(`ng g @firestitch/schematics:services-list`, (err, stdout, stderr) => {
    if (err) {
      res.status(500).json({
        message: stderr
      });
    } else {
      try {
        const list = JSON.parse(stdout.replace('Nothing to be done.', ''));

        res.json({
          services: list
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

export let generateService = (req: Request, res: Response) => {
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

  if (!params.singularName || !params.pluralName || !params.module) {
    res.status(400).json({
      message: 'Name and Module are required'
    });

    return;
  }

  let command = `\
  --name=${params.singularName} \
  --module=${params.module.moduleName} \
  --path=${params.module.modulePath} \
  --subdirectory=${params.subdirectory} \
  --pluralName=${params.pluralName} \
  --menuService`;

  let schema = 'service';

  exec(`ng g @firestitch/schematics:${schema} ${command}`, execHandler);

};

export let generateModule = (req: Request, res: Response) => {
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
  console.log(params);

  if (!params.name) {
    res.status(400).json({
      message: 'Name is required'
    });

    return;
  }

  let command = `\
  --name=${params.name} \
  --path=${params.module.modulePath} \
  --module=${params.module.moduleName} \
  --routing=${params.routing}`;

  let schema = 'module';

  exec(`ng g @firestitch/schematics:${schema} ${command}`, execHandler);
};
