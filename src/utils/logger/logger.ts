import { createLogger, format, transports } from 'winston';

// Configure the Winston logger. For the complete documentation see https://github.com/winstonjs/winston
export default createLogger({
  format: format.combine(format.splat(), format.simple()),
  level: 'info',
  transports: [new transports.Console()]
});
