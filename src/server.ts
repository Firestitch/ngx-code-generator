import * as errorHandler from 'errorhandler';
import app from './app';

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

const args = require('minimist')(process.argv.slice(2))

/**
 * Start Express server.
 */

export const rootPath = args.root || '';
export const srcPath = rootPath ? rootPath + '/src' : 'src';

const server = app.listen(app.get('port'), () => {
  console.log(
    "  App is running at http://localhost:%d in %s mode",
    app.get('port'),
    app.get('env')
  );
  console.log("  Press CTRL-C to stop\n");
});

export default server;
