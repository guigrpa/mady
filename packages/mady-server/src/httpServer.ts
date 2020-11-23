import http from 'http';
import { mainStory } from 'storyboard';
import express, { Express } from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import {
  getConfig,
  parseSrcFiles,
  getKeys,
  createKey,
  updateKey,
  getLangTranslations,
  createTranslation,
  updateTranslation,
} from './db';

const SRC = 'mady-api';
const DEFAULT_API_BASE = '/mady-api';

// ==============================================
// Main
// ==============================================
type Options = {
  port?: number;
  expressApp?: Express;
  httpServer?: http.Server;
  apiBase?: string;
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
  const apiBase = options.apiBase || DEFAULT_API_BASE;
  addEndpoints(expressApp, apiBase);

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
const addEndpoints = (app: Express, base: string) => {
  app.get(`${base}/config`, apiGetConfig);
  app.get(`${base}/parse`, apiParse);
  app.get(`${base}/keys`, apiGetKeys);
  app.post(`${base}/key`, apiCreateKey);
  app.patch(`${base}/key/:id`, apiUpdateKey);
  app.get(`${base}/translations/:lang`, apiGetTranslations);
  app.post(`${base}/translation`, apiCreateTranslation);
  app.patch(`${base}/translation/:id`, apiUpdateTranslation);

  // Update translation
  // Get translations
};

// Config
const apiGetConfig: express.RequestHandler = async (_req, res) => {
  res.json(getConfig());
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
