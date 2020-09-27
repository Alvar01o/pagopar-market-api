// import fs from 'fs';
// import https from 'https';

// const httpsOptions = {
//   cert: fs.readFileSync('./config/cert.pem'),
//   key: fs.readFileSync('./config/key.pem')
// };

// https.createServer(httpsOptions, app).listen(PORT, () => {
//   logger.info('Express server listening on port ' + PORT);
// });

import chalk from 'chalk';
import config from 'config';
import moment from 'moment-timezone';
import packageJson from './../package.json';
import app from './app';
import { logger } from './utils';

const PORT = process.env.PORT || 3003;
const HOST = app.get('env').toUpperCase() == 'DEVELOPMENT' ? 'localhost' : config.get('host');

process.on('unhandledRejection', (reason, promise) => {
  const msg = `
--------------------------------------------
UNHANDLED REJECTION AT: ${chalk.yellow(JSON.stringify(promise))}
REASON OBJECT: ${chalk.red(JSON.stringify(reason))}
REASON STRING: ${chalk.red(String(reason))}
--------------------------------------------\n`;

  logger.error(msg);
});

app.listen(PORT, () => {
  const now = moment().tz('America/Asuncion');

  const startedMsg = `${now.format('MMM D, YYYY')} at ${now.format('hh:mm:ss a')}`.toUpperCase();
  const routeMsg = `http://${HOST}:${PORT}`;
  const envMsg = app.get('env').toUpperCase();
  const nameMsg = packageJson.name
    .toUpperCase()
    .split('-')
    .join(' ');

  const msg = `
--------------------------------------------
STARTED: ${chalk.yellow(startedMsg)}
VERSION: ${chalk.cyan(packageJson.version)}
NAME: ${chalk.cyan(nameMsg)}
ENVIRONMENT: ${chalk.green(envMsg)}
--------------------------------------------
APPLICATION STARTED ON ${chalk.yellow(routeMsg)}
--------------------------------------------\n`;

  logger.info(msg);
});
