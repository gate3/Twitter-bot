const GoogleSpreadsheet = require('google-spreadsheet')

class SpreadsheetHelper {
  constructor () {
    this.spreadSheet = new GoogleSpreadsheet(process.env.SPREADSHEET_KEY)
  }

  authenticate () {
    const creds = require(`../${process.env.SHEETS_CRED_LOCATION}`)
    return new Promise((resolve, reject) => {
      this.spreadSheet.useServiceAccountAuth(creds, e => {
        if (e) {
          reject(e)
        } else {
          resolve(true)
        }
      })
    })
  }

  async save (name, followers) {
    const handleSave = async () => {
      try {
        const wRes = await this.doesWorkSheetExist()

        const handleSave = async (sheetId) => {
          const storedRes = await this.storeData(name, followers, sheetId)
        }

        if (wRes.status) { // it exists already use it
          handleSave(wRes.worksheet)
        } else { // doesn't exist create it
          const newSheet = await this.CreateWorksheet()
          handleSave(newSheet)
        }
      } catch (e) {
        throw new Error(e)
      }
    }

    // if not currently authenticated, we should first authenticate
    if (!this.spreadSheet.isAuthActive()) {
      const res = await this.authenticate()
      handleSave()
    } else {
      handleSave()
    }
  }

  storeData (name, followers, worksheetId) {
    const newRow = {}
    newRow[CONSTANTS.WORKSHEET.HEADER_NAME] = name
    newRow[CONSTANTS.WORKSHEET.HEADER_FOLLOWER] = followers
    
    return new Promise((resolve, reject) => {
      this.spreadSheet.addRow(worksheetId, newRow, function (err, succ) {
        if (err) {
          reject(err)
        } else {
          resolve(succ)
        }
      })
    })
  }

  CreateWorksheet () {
    return new Promise((resolve, reject) => {
      this.spreadSheet.addWorksheet({title: CONSTANTS.WORKSHEET.NAME}, function (err, sheet) {
        if (err) {
          reject(err)
        } else {
          sheet.setHeaderRow([CONSTANTS.WORKSHEET.HEADER_NAME, CONSTANTS.WORKSHEET.HEADER_FOLLOWER], function (e, s) {
            if (e) {
              reject(e)
            } else {
              resolve(sheet.id)
            }
          })
        }
      })
    })
  }

  doesWorkSheetExist () {
    return new Promise((resolve, reject) => {
      this.spreadSheet.getInfo((err, info) => {
        if (err) {
          reject(err)
        } else {
          const {worksheets} = info
          const resolvePromise = (status = false, worksheet = null) => resolve({status, worksheet})

          if (worksheets.length < 1) {
            resolvePromise()
          } else {
            const findWorksheet = worksheets.filter(w => w.title === CONSTANTS.WORKSHEET.NAME)

            if (findWorksheet.length < 1) {
              resolvePromise()
            } else {
              resolvePromise(true, findWorksheet[0].id)
            }
          }
        }
      })
    })
  }
}

module.exports = new SpreadsheetHelper()
