const mockStory = {};
['trace', 'debug', 'info', 'warn', 'error'].forEach((level) => {
  mockStory[level] = () => {};
});

module.exports = mockStory;
