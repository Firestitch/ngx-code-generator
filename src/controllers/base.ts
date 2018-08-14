import { Request, Response } from 'express';
import { exec } from 'child_process';

/**
 * GET /
 * Home page.
 */
export let index = (req: Request, res: Response) => {
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
    case 'list-standalone': {
      schema = 'list';
    } break;
    case 'list-create-edit': {
      schema = 'list';
      command += ' --create --edit'
    } break;
  }


  exec(`ng g fs-schematics:${schema} ${command}`, (err, stdout, stderr) => {
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
  });
};

export let modulesList = (req: Request, res: Response) => {


  exec(`ng g fs-schematics:modules-list`, (err, stdout, stderr) => {
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
