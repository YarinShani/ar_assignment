const reader = require('xlsx')
const readline = require('readline')
const { setTableNames, dbConfigNames } = require('./config/db.config')
const { writeToFile } = require('./services/file.service')
const { substring, getIdByName, generateValuesForQuery, headersToString } = require('./helpers/commonFunctions')
const sqlService = require('./services/sql.service')

const rl = readline.createInterface({
   input: process.stdin,
   output: process.stdout
})

function getHeaders(workbookHeaders) {
   const sheets = workbookHeaders.SheetNames
   const headers1 = reader.utils.sheet_to_json(workbookHeaders.Sheets[sheets[0]], { header: 1 })[0]
   const headers2 = reader.utils.sheet_to_json(workbookHeaders.Sheets[sheets[1]], { header: 1 })[0]
   return { headers1, headers2 }
}

console.log("Hello and welcome to our system!\nThe file name should be your_club_name.xlsx\n")
rl.question("Please enter your club name: ", function (clubName) {
   const clubId = getIdByName(clubName)
   const dbSchemeName = dbConfigNames["dbSchemeName"]
   let workbookHeaders = ''
   try {
      workbookHeaders = reader.readFile(`./${dbSchemeName}.xlsx`, { sheetRows: 1 });
   } catch (error) {
      console.log(`${dbSchemeName}.xlsx file doesn't exist`)
      process.exit(0);
   }
   
   setTableNames(workbookHeaders.SheetNames)
   const { headers1, headers2 } = getHeaders(workbookHeaders)

   const headersString1 = headersToString(headers1)
   const headersString2 = headersToString(headers2, true)

   const table1 = dbConfigNames["usersTableName"]
   const table2 = dbConfigNames["membershipsTableName"]

   let sqlQuery1 = `INSERT INTO '${dbSchemeName}'.'${table1}' (${headersString1}) VALUES\n`
   let sqlQuery2 = `INSERT INTO '${dbSchemeName}'.'${table2}' (${headersString2}) VALUES\n`

   let file = ''
   try {
      file = reader.readFile(`./${clubName}.xlsx`)
   } catch (error) {
      console.log(`${clubName}.xlsx file doesn't exist`)
      process.exit(0);
   }

   const sheets = file.SheetNames
   let userId = sqlService.generateSelectMaxQuery(table1, 'user_id')

   for (let i = 0; i < sheets.length; i++) {
      //if raw is true then the date is formatted wrongly
      const temp = reader.utils.sheet_to_json(file.Sheets[sheets[i]], { raw: false })
      let valuesToCheck = []

      temp.forEach((res) => {
         res["club_id"] = clubId
         res["user_id"] = userId
         sqlQuery1 += generateValuesForQuery(headers1, res)
         sqlQuery2 += generateValuesForQuery(headers2, res)
         valuesToCheck.push(res[dbConfigNames["uniqueColumn"]])
         userId++
      })

      sqlService.checkIfDuplicateExistsInDB(valuesToCheck)
   }

   const data = substring(sqlQuery1, 2) + ';\n\n' + substring(sqlQuery2, 2) + ';'
   writeToFile(`${clubName}.sql`, data)
});

rl.on("close", function () {
   console.log("\nBYE BYE !!!");
   process.exit(0);
});