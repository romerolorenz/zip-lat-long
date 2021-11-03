const zipcodes = require('zipcodes-ph');

function formatZip(zip) {
  return String(zip).padStart(4, '0')
}

zipcodes.find(formatZip);