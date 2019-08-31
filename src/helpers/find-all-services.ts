import * as path from 'path';
import * as fs from 'fs';
import { srcPath } from '../server';
import { sanitizepath } from './sanitize-path';


export async function findAllServices(modules: any) {
  const servicesList: any = [];
  const serviceRe = /\.service\.ts$/;
  const dataRe = /\.data\.ts$/;


  for (const module of modules) {
    const files = [];
    // Make relative path
    const modulePath = module.modulePath;

    const servicesPath = path.join(modulePath, 'services');
    const dataServicesPath = path.join(modulePath, 'data');

    if (fs.existsSync(servicesPath)) {
      const serviceFiles = await fs.promises.readdir(servicesPath);

      files.push(
        ...serviceFiles.map((file) => {
          return {
            servicePath: sanitizepath(servicesPath),
            singularName: file,
            name: servicesPath
                  .toString()
                  .concat('/', file.replace(/\.ts$/, ''))
                  .replace(/\\/g, '/')
                  .replace(new RegExp(`^${srcPath}/`), ''),
          };
        })
      );
    }

    if (fs.existsSync(dataServicesPath)) {
      const dataServiceFiles = await fs.promises.readdir(dataServicesPath);

      files.push(
        ...dataServiceFiles.map((file) => {
          return {
            servicePath: sanitizepath(dataServicesPath),
            singularName: file,
            name: dataServicesPath
                  .toString()
                  .concat('/', file.replace(/\.ts$/, ''))
                  .replace(/\\/g, '/')
                  .replace(new RegExp(`^${srcPath}/`), ''),
          };
        })
      );
    }

    const services = [];

    for (const file of files) {
      const stat = await fs.promises.stat(path.join(file.servicePath, file.singularName));

      if (stat.isFile() && (serviceRe.test(file.singularName) || dataRe.test(file.singularName))) {
        services.push(file);
      }
    }

    if (services.length > 0) {
      servicesList.push({
        module: module.moduleName,
        services: [...services],
      });
    }
  }

  return servicesList;
}
