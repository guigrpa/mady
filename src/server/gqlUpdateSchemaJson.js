import fs                   from 'fs-extra';
import path                 from 'path';
import { mainStory, chalk } from 'storyboard';
import * as gqlServer       from './gqlServer';

const outputPath = path.join(__dirname, '../common/');

Promise.resolve()
.then -> 
  mainStory.info('gqlUpdate', 'Introspecting...');
  gqlServer.runIntrospect()
.then (result) ->
  filePath = path.join(outputPath, 'gqlSchema.json')
  mainStory.info('gqlUpdate', 'Writing #{chalk.cyan filePath}...');
  fs.writeFileSync filePath, JSON.stringify(result, null, 2)
.then ->
  filePath = path.join(outputPath, 'gqlSchema.graphql')
  mainStory.info('gqlUpdate', 'Writing #{chalk.cyan filePath}...');
  fs.writeFileSync path.join(outputPath, 'gqlSchema.graphql'), 
    gqlServer.getSchemaShorthand()
.then ->
  mainStory.info('gqlUpdate', 'Done!');
