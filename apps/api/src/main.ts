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

const [configRootPath, configSrcPath] = getAngularProjectPaths(args.project || '');

export const rootPath = args.root || configRootPath || '';
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

function getAngularProjectPaths(targetProject: string): [string, string] {
  const rawAngularJSON = fs.readFileSync('angular.json');
  const angularJSONData = JSON.parse(rawAngularJSON.toString())
  if (!targetProject) {
    targetProject = angularJSONData.defaultProject;

    if (!targetProject) {
      targetProject = Object.keys(angularJSONData.projects)[0];
    }
  }

  const projectData = angularJSONData.projects[targetProject];

  if (!projectData) {
    throw new Error(`Project "${targetProject}" does not exist`)
  } else {
    return [projectData.root, projectData.sourceRoot];
  }
}

export default server;
