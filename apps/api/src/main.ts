import * as errorHandler from 'errorhandler';
import * as fs from 'fs';
import { app } from './app/app';


/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

const args = require('minimist')(process.argv.slice(2));
const path = require('path');

/**
 * Start Express server.
 */
export const rootPath = getRootPath();

console.log('RootPath is set to ', rootPath);

const server = app.listen(app.get('port'), () => {
  console.log(
    '  App is running at http://localhost:%d in %s mode',
    app.get('port'),
    app.get('env')
  );
  console.log('  Press CTRL-C to stop\n');
});

export function getSrcPath(projectName?: string) {
  const project = getProjects()
  .find((item) => projectName === item.name);

  return path.join(getRootPath(),project?.sourceRoot || '');
}

export function getRootPath() {
  return args.root ? args.root : '';
}

export function getProjects(): { name: string, root: string, sourceRoot: string }[] {
  const angularConfig = readAngularJSON();

  return Object.keys(angularConfig.projects)
    .map((name) => {
      return {
        name,
        root: angularConfig.projects[name].root,
        sourceRoot: angularConfig.projects[name].sourceRoot,
      }
    });
}

// function getPaths(targetProject: string): [string, string] {
//   const angularConfig = readAngularJSON();

//   if (!targetProject) {
//     targetProject = angularConfig?.defaultProject
//       || (!!angularConfig?.projects && Object.keys(angularConfig.projects)[0]);

//     if (!targetProject) {
//       throw new Error(`Can not find "defaultProject" or "projects" configured in angular.json or codegenerator.json`)
//     }
//   }

//   const projectData = angularConfig?.projects[targetProject];

//   if (!projectData) {
//     throw new Error(`Project "${targetProject}" does not exist`)
//   } else {
//     return [projectData.root, projectData.sourceRoot];
//   }
// }

function readAngularJSON(): Record<string, any> | null{
  try {

    const file = getRootPath() ? path.join(getRootPath(), 'angular.json') : 'angular.json';
    const config = fs.readFileSync(file);

    return JSON.parse(config.toString())
  } catch (e) {
    console.error(`Can not read angular.json: `, e);

    throw e;
  }

  return null;
}

export default server;
