// Fix the time-zone for snapshot testing
// (otherwise, Travis will complain whenever tz-dependent snapshots
// are generated)
const moment = require('moment-timezone');

moment.tz.setDefault('Europe/Madrid');
