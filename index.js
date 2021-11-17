const { CsvUtil, zipcode } = require('./src/utilities/');

const sleep = (ms) => new Promise((resolve, reject) => setTimeout(resolve, ms));

const axios = require('axios');
require('dotenv').config();

csv = new CsvUtil()

let records

csv.readCsv('uni_zip')
  .then(async result => {
    records = result
    let promises = []
    for (let i = 0; i < records.length; i++) {
      records[i].location = zipcode.find(result[i].zip)

      console.log(String(i) + '...', records[i].location)

      // sleep to avoid rate limit
      await sleep(100)

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
      'SourceName',
      'OrderNumber',
      'CustomerID',
      'PaymentMethod',
      'PaymentStatus',
      'Total',
      'DiscountCodes',
      'Tags',
      'DeliveryMethod',
      'zip',
      'location',
      'lat',
      'lng',
      'TotalWeight'
    ]

    csv.saveCsv(header, records, 'latlong')
      .then(result => {
        console.log('Done...')
      })
  }).catch(error => {
    console.error(error)
  })