const { CsvUtil, zipcode, logger } = require('./src/utilities/');

const sleep = (ms) => new Promise((resolve, reject) => setTimeout(resolve, ms));

const axios = require('axios');
require('dotenv').config();

csv = new CsvUtil()

let records

csv.readCsv('orders')
  .then(async result => {
    records = result
    let promises = []
    for (let i = 0; i < records.length; i++) {
      records[i].location = zipcode.find(result[i].zip)

      console.log(String(i) + '...')

      // sleep to avoid rate limit
      await sleep(50)

      // promise array
      promises.push(axios.get(process.env.GEOCODING, {
        params: {
          address: `${records[i].location} Philippines`,
          key: process.env.GOOGLE_KEY
        }
      }))
    }
    return Promise.all(promises)
  })
  .then(result => {
    console.log('processing')
    for (let i = 0; i < result.length; i++) {
      tempData = result[i].data

      // if location was found get lat long
      if(tempData.status == 'OK') {
        records[i].lat = tempData.results[0].geometry.location.lat
        records[i].lng = tempData.results[0].geometry.location.lng
      }
    }
    console.log('saving')
    header = [
      'OrderNumber',
      'OrderDate',
      'CustomerID',
      'Address',
      'zip',
      'location',
      'lat',
      'lng',
      'Tags',
      'Note',
      'CustomerNote'
    ]

    csv.saveCsv(header, records, 'latlong')
      .then(result => {
        console.log('Done...')
      })
  }).catch(error => {
    console.error(error)
  })