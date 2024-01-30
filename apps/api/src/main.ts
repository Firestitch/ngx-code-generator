import * as errorHandler from 'errorhandler';
import * as fs from 'fs';
import { app } from './app/app';

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

const args = require('minimist')(process.argv.slice(2));

/**
 * Start Express server.
 */

const [configRootPath, configSrcPath, configCommonPath] = getPaths(args.project || '');

export const rootPath = args.root || configRootPath || '';
export const commonPath = configCommonPath;

console.log('RootPath is set to ', rootPath);
console.log('commonPath is set to ', commonPath);

const defaultSrcPath = rootPath ? rootPath + '/src' : 'src'

export const srcPath = configSrcPath || defaultSrcPath;

const server = app.listen(app.get('port'), () => {
  console.log(
    '  App is running at http://localhost:%d in %s mode',
    app.get('port'),
    app.get('env')
  );
  console.log('  Press CTRL-C to stop\n');
});

function getPaths(targetProject: string): [string, string, string] {
  const angularConfig = readAngularJSON();
  const generatorConfig = readConfigJSON();


  if (!targetProject) {
    targetProject = angularConfig?.defaultProject
      || (!!angularConfig?.projects && Object.keys(angularConfig.projects)[0])
      || generatorConfig?.defaultProject
      || (!!generatorConfig?.projects && Object.keys(generatorConfig.projects)[0]);

    if (!targetProject) {
      throw new Error(`Can not find "defaultProject" or "projects" configured in angular.json or codegenerator.json`)
    }
  }

  const projectData = generatorConfig?.projects[targetProject] || angularConfig?.projects[targetProject];
  const commonPath = generatorConfig?.commonModule?.root;

  if (!projectData) {
    throw new Error(`Project "${targetProject}" does not exist`)
  } else {
    return [projectData.root, projectData.sourceRoot, commonPath];
  }
}

function readAngularJSON(): Record<string, any> | null{
  try {
    const config = fs.readFileSync('angular.json');
    return JSON.parse(config.toString())
  } catch (e) {
    // console.error(`Can not read angular.json: `, e);
  }

  return null;
}

function readConfigJSON(): Record<string, any> | null{
  try {
    const config = fs.readFileSync('codegenerator.json');
    return JSON.parse(config.toString())
  } catch (e) {
    // console.error(`Can not read codegenerator.json: `, e);
  }

  return null;
}

export default server;
