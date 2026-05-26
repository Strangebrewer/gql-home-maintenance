import app from './app';
import database from './database';
import pubsub from './pubsub';
import rube from './rube';
import tracer from './tracer';

export default () => ({
  app: app(),
  database: database(),
  pubsub: pubsub(),
  rube: rube(),
  tracer: tracer(),
});
