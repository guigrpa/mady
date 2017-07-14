// @flow

import fs from 'fs-extra';
import path from 'path';
import { addListener, mainStory, chalk } from 'storyboard';
import consoleListener from 'storyboard-listener-console';
import Promise from 'bluebird';
import * as gqlServer from './gqlServer';

addListener(consoleListener);

const outputPath = path.join(__dirname, '../common/');
gqlServer.init();

Promise.resolve()
  .then(() => {
    mainStory.info('gqlUpdate', 'Introspecting...');
    return gqlServer.runIntrospect();
  })
  .then(result => {
    let filePath = path.join(outputPath, 'gqlSchema.json');
    mainStory.info('gqlUpdate', `Writing ${chalk.cyan(filePath)}...`);
    fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
    filePath = path.join(outputPath, 'gqlSchema.graphql');
    mainStory.info('gqlUpdate', `Writing ${chalk.cyan(filePath)}...`);
    fs.writeFileSync(filePath, gqlServer.getSchemaShorthand());
    mainStory.info('gqlUpdate', 'Done!');
  });
