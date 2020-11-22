import http from 'http';
import { mainStory } from 'storyboard';
import express, { Express } from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import {
  getConfig,
  updateConfig,
  parseSrcFiles,
  getKeys,
  createKey,
  updateKey,
  getLangTranslations,
  createTranslation,
  updateTranslation,
} from './db';

const SRC = 'mady-api';

// ==============================================
// Main
// ==============================================
type Options = {
  port?: number;
  expressApp?: Express;
  httpServer?: http.Server;
};

const init = (options: Options) => {
  mainStory.info(SRC, 'Initializing mady server...');

  // Create Express app if needed
  let { expressApp } = options;
  if (!expressApp) {
    expressApp = express();
    expressApp.use(compression());
    expressApp.use(bodyParser.json());
    expressApp.use(bodyParser.urlencoded({ extended: false }));
  }

  // Add Mady endpoints
  addEndpoints(expressApp);

  // Create HTTP server if needed
  let { httpServer } = options;
  if (!httpServer) {
    httpServer = http.createServer(expressApp);
    httpServer.listen(options.port);
  }
  return httpServer;
};

// ==============================================
// Endpoints
// ==============================================
const addEndpoints = (app: Express) => {
  app.get('/mady-api/config', apiGetConfig);
  app.post('/mady-api/config', apiUpdateConfig);
  app.get('/mady-api/parse', apiParse);
  app.get('/mady-api/keys', apiGetKeys);
  app.post('/mady-api/key', apiCreateKey);
  app.patch('/mady-api/key/:id', apiUpdateKey);
  app.get('/mady-api/translations/:lang', apiGetTranslations);
  app.post('/mady-api/translation', apiCreateTranslation);
  app.patch('/mady-api/translation/:id', apiUpdateTranslation);

  // Update translation
  // Get translations
};

// Config
const apiGetConfig: express.RequestHandler = async (_req, res) => {
  res.json(getConfig());
};

const apiUpdateConfig: express.RequestHandler = async (req, res) => {
  const config = await updateConfig(req.body);
  res.json(config);
};

// Parse
const apiParse: express.RequestHandler = async (_req, res) => {
  const keys = await parseSrcFiles();
  res.json(keys);
};

// Keys
const apiGetKeys: express.RequestHandler = async (_req, res) => {
  res.json(getKeys());
};

const apiCreateKey: express.RequestHandler = async (req, res) => {
  const newKey = await createKey(req.body);
  res.json(newKey);
};

const apiUpdateKey: express.RequestHandler = async (req, res) => {
  const { id } = req.params;
  const key = req.body;
  const updatedKey = await updateKey(id, key);
  res.json(updatedKey);
};

// Translations
const apiGetTranslations: express.RequestHandler = async (req, res) => {
  res.json(getLangTranslations(req.params.lang));
};

const apiCreateTranslation: express.RequestHandler = async (req, res) => {
  const newTranslation = await createTranslation(req.body);
  res.json(newTranslation);
};

const apiUpdateTranslation: express.RequestHandler = async (req, res) => {
  const { id } = req.params;
  const translation = req.body;
  const updatedTranslation = await updateTranslation(id, translation);
  res.json(updatedTranslation);
};

// ==============================================
// Public
// ==============================================
export { init };
