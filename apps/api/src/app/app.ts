import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as path from 'path';
import * as baseController from './controllers/base';

const compare = require('node-version-compare');
const result = compare(process.version, '10.10.0');

if (result < 0) {
  console.error('Code Genetator requires NodeJs version >= 10.10.0');
  process.exit();
}

export const app = express();
app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 })
);

app.post('/api/generate', baseController.index);
app.post('/api/generate/service', baseController.generateService);
app.post('/api/generate/module', baseController.generateModule);
app.post('/api/generate/enum', baseController.createEnum);
app.post('/api/generate/const', baseController.createConst);
app.get('/api/generate/enums-list', baseController.enumsList);
app.get('/api/generate/enum-keys-list', baseController.enumKeysList);
app.get('/api/modules', baseController.modulesList);
app.get('/api/get-modules-for', baseController.getModulesFor);
app.get('/api/services', baseController.servicesList);
app.get('*', (req, res) => {
  res.redirect('/');
});
