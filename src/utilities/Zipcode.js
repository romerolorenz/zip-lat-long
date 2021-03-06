const zipcodes = require('zipcodes-ph');

function formatZip(zip) {
  return String(zip).padStart(4, '0')
}

function find(zip) {
  places = zipcodes.find(formatZip(zip))
  if(typeof places == 'object' ) {
    // placeholder TODO: improve
    if(places == null) return 'Manila CPO - Ermita'
    // randomize place within array
    var place = places[Math.floor(Math.random() * places.length)];
    return place
  } else {
    return places
  }
}

module.exports = {
  find
}