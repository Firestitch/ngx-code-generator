import * as errorHandler from 'errorhandler';
import * as fs from 'fs';
import { app } from './app/app';

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

const clog = console.log;
const elog = console.error;
const dlog = console.debug;

console.log = (...value) => {
  clog(...[GREEN, ...value, RESET]);
}

console.error = (...value) => {
  elog(...[RED, ...value, RESET]);
}

console.debug = (...value) => {
  dlog(...[BLUE, ...value, RESET]);
}


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

console.debug('RootPath is set to', `"${rootPath}"`);
console.debug('angular.json path is set to', `"${angularJsonPath()}"`);

const server = app.listen(app.get('port'), () => {
  console.debug(
    `App is running at http://localhost:${app.get('port')} in ${app.get('env')} mode`
    
  );
  console.debug('Press CTRL-C to stop\n');
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

  return Object.keys(angularConfig?.projects || [])
    .map((name) => {
      return {
        name,
        root: angularConfig.projects[name].root,
        sourceRoot: angularConfig.projects[name].sourceRoot,
      }
    });
}

function angularJsonPath(): string {
  return getRootPath() ? path.join(getRootPath(), 'angular.json') : 'angular.json';
}

function readAngularJSON(): Record<string, any> | null {
  try {
    const file = angularJsonPath();

    if(!fs.existsSync(file)) {
      return null;
    }

    const config = fs.readFileSync(file);

    return JSON.parse(config.toString())
  } catch (e) {
    console.error(`Can not read angular.json: `, e);
  }

  return null;
}

export default server;


