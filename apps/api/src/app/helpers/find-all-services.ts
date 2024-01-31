import * as path from 'path';
import * as fs from 'fs';
import { getRootPath, getSrcPath } from '../../main';
import { sanitizepath } from './sanitize-path';

export async function findAllServices(projectName: string, modulePath: string) {
  const servicesList: any = [];
  const serviceRe = /\.service\.ts$/;
  const dataRe = /\.data\.ts$/;

  const files = [];
  const dataServicesPath = path.join(getRootPath(), path.dirname(modulePath), 'data');
  const servicesPath = path.join(getRootPath(), path.dirname(modulePath), 'services');

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
            .replace(new RegExp(`^${getRootPath()}/`), ''),
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
            .replace(new RegExp(`^${getRootPath()}/`), ''),
        };
      })
    );
  }

  const services = [];

  for (const file of files) {
    const stat = await fs.promises.stat(
      path.join(file.servicePath, file.singularName)
    );

    if (
      stat.isFile() &&
      (serviceRe.test(file.singularName) || dataRe.test(file.singularName))
    ) {
      services.push(file);
    }
  }

  return services;
}
