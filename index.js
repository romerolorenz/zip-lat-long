const { CsvUtil, zipcode, logger } = require('./src/utilities/');
csv = new CsvUtil()

csv.readCsv('orders')
  .then(result => {
    // console.log(result)
    for (let i = 0; i < result.length; i++) {
      result[i].location = zipcode.find(result[i].zip)
    }

    header = [
      'OrderNumber', 
      'OrderDate', 
      'CustomerID', 
      'Address', 
      'zip',
      'location', 
      'Tags', 
      'Note', 
      'CustomerNote'
    ]

    csv.saveCsv(header, result, 'processed')
      .then(result => {
        console.log('Done...')
      })
  })