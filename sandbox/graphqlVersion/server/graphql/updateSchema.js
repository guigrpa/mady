// @flow

import fs from 'fs';
import path from 'path';
import { addListener, mainStory, chalk } from 'storyboard';
import consoleListener from 'storyboard-listener-console';
import * as gqlServer from './gqlServer';

addListener(consoleListener);

const outputPath = path.join(__dirname, '../../../src/common/');
gqlServer.init();

const run = async () => {
  mainStory.info('gqlUpdate', 'Introspecting...');
  const result = await gqlServer.runIntrospect();
  let filePath = path.join(outputPath, 'gqlSchema.json');
  mainStory.info('gqlUpdate', `Writing ${chalk.cyan(filePath)}...`);
  fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
  filePath = path.join(outputPath, 'gqlSchema.graphql');
  mainStory.info('gqlUpdate', `Writing ${chalk.cyan(filePath)}...`);
  fs.writeFileSync(filePath, gqlServer.getSchemaShorthand());
  mainStory.info('gqlUpdate', 'Done!');
};

run();
