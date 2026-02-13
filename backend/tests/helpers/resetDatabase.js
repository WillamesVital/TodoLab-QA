const { resetAllData } = require('../../db');

function resetDatabase() {
  resetAllData();
}

module.exports = {
  resetDatabase,
};
