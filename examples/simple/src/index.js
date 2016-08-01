var chalk = require('chalk');
var _t = require('mady');

function exampleMessages() {
  console.log(_t('someContext_This is a simple message'));
  console.log(_t('someContext_Number of hamburgers: {NUM}', { NUM: 3 }));
  for (var i = 0; i < 4; i++) {
    console.log(_t('exampleContext_{NUM, plural, one{1 hamburger} other{# hamburgers} }', { NUM: i }));
  }
}

try {
  var locales = require('../locales/en');
  _t.setLocales(locales);
  console.log('\nEnglish:\n')
  exampleMessages();
} catch (err) {
  console.log(`It looks like you've never run Mady. Just type ${chalk.yellow.bold('npm run mady')}`);
  console.log('Say yes to all defaults for this example.');
  console.log(`Then open your browser and refresh the list of messages.`);
  process.exit();
}

try {
  var locales = require('../locales/es');
  _t.setLocales(locales);
  console.log('\nEspañol:\n')
  exampleMessages();
} catch (err) {
  console.log('It looks like you haven\'t created the Spanish (es) language.');
  console.log(`Run Mady (${chalk.yellow.bold('npm run mady')}) and click on the wheel icon to create a language`);
  console.log('Then use Mady to translate your messages.');
}
