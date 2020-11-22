import chokidar from 'chokidar';
import { mainStory, chalk } from 'storyboard';

const STR = 'mady-watch';

// ==============================================
// Declarations
// ==============================================
let watcher: chokidar.FSWatcher | null;

type Options = {
  paths: string[];
  onEvent: (eventType: string, filePath: string) => any;
};

// ==============================================
// Main
// ==============================================
const init = ({ paths, onEvent }: Options) => {
  shutDown();
  watcher = chokidar.watch(paths, {
    ignored: /[/\\]\./,
    ignoreInitial: true,
  });
  mainStory.info(STR, `Watching: ${chalk.cyan.bold(paths.join(', '))}`);
  ['change', 'add', 'unlink'].forEach((type) => {
    if (!watcher) return;
    watcher.on(type, (filePath) => {
      const typeStr = chalk.cyan.bold(type.toUpperCase());
      mainStory.info(STR, `${typeStr} event on ${chalk.cyan.bold(filePath)}`);
      onEvent(type, filePath);
    });
  });
};

const shutDown = () => {
  if (watcher) watcher.close();
  watcher = null;
};

// ==============================================
// Public
// ==============================================
export { init, shutDown };
