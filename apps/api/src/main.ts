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

const targetProject = args.project || '';
let angularJSONRoot, angularJSONSource;

if (targetProject !== '') {
  [angularJSONRoot, angularJSONSource] = getAngularProjectPaths();
}

export const rootPath = args.root || angularJSONRoot || '';
const defaultSrcPath = rootPath ? rootPath + '/src' : 'src'

export const srcPath = angularJSONSource || defaultSrcPath;

const server = app.listen(app.get('port'), () => {
  console.log(
    '  App is running at http://localhost:%d in %s mode',
    app.get('port'),
    app.get('env')
  );
  console.log('  Press CTRL-C to stop\n');
});

function getAngularProjectPaths(): [string, string] {
  const rawAngularJSON = fs.readFileSync('angular.json');
  const angularJSONData = JSON.parse(rawAngularJSON.toString())
  const projectData = angularJSONData.projects[targetProject];

  if (!projectData) {
    throw new Error(`Project "${targetProject}" does not exist`)
  } else {
    return [projectData.root, projectData.sourceRoot];
  }
}

export default server;
