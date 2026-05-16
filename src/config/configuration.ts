import app from './app';
import database from './database';
import rube from './rube';
import tracer from './tracer';

export default () => ({
  app: app(),
  database: database(),
  rube: rube(),
  tracer: tracer(),
});
