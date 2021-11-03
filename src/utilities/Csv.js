require('dotenv').config();

const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { logger } = require('./Logger.js');

class CsvUtil {
  constructor() {
    this.basePath = './' || process.env.CSV_PATH
  }

  async saveCsv(header, records, fileName) {
    const csvWriter = createCsvWriter({
      path: this.basePath + fileName + '.csv',
      header: header
    });

    return new Promise((resolve, reject) => {
      csvWriter.writeRecords(records)       // returns a promise
        .then(() => {
          resolve()
        });
    })
  }

  async readCsv(fileName) {
    const res = [];
    return new Promise((resolve, reject) => {
      try {
        fs.createReadStream(this.basePath + fileName + '.csv')
          .pipe(csv())
          .on('data', (data) => res.push(data))
          .on('end', () => {
            resolve(res);
          })
      } catch (error) {
        reject(error)
      }
    });
  };
}

module.exports = {
  CsvUtil
}
