const { dbConfigNames } = require('../config/db.config')
const { substring } = require('../helpers/commonFunctions')

function executeQuery(query) {
    // 1. connect to DB, with 'mssql' module for example
    // 2. execute query and return result
    return []
}

function generateSelectInValuesQuery(tableName, columnName, values) {
    valuesToSQLFormat = ''
    values.forEach(v => valuesToSQLFormat += `'${v}', `)
    return `SELECT * FROM '${dbConfigNames["dbSchemeName"]}'.'${tableName}' WHERE '${columnName}' IN (${substring(valuesToSQLFormat, 2)})`
}

function generateSelectMaxQuery(tableName, columnName) {
    let query = `SELECT MAX(${columnName}) FROM '${dbConfigNames["usersTableName"]}'.'${tableName}'`
    const res = executeQuery(query) // res returns result as array, we want res[0]
    return 1 // should return res[0] after execute select
}

function checkIfDuplicateExistsInDB(values) {
    const duplicateValue = (new Set(values)).size !== values.length;
    if (duplicateValue) {
        console.log("\nDuplicates are not allowed!");
        process.exit(1);
    }

    const query = generateSelectInValuesQuery(dbConfigNames["usersTableName"], dbConfigNames["uniqueColumn"], values)
    const res = executeQuery(query)

    if (res.length !== 0) {
        console.log("\nOne user or more already exist");
        process.exit(1);
    }
}

module.exports = {
    generateSelectInValuesQuery,
    generateSelectMaxQuery,
    checkIfDuplicateExistsInDB
}