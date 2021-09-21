const { clubNameToId, dbColumnsTypes, mapDBColumnsToObjectAttributes } = require('../config/db.config')

function substring(str, toSub) {
    return str.substring(0, str.length - toSub)
}

function headersToString(headers, ignoreFirstHeader = false) {
    let headersString = ''
    if (ignoreFirstHeader)
        headers.shift()

    headers.forEach(h => {
        headersString += `'${h}', `
    });

    return substring(headersString, 2)
}

function getIdByName(name) {
    if (clubNameToId[name] === undefined) {
        maxExistedId = Math.max(...Object.values(clubNameToId))
        clubNameToId[name] = maxExistedId + 1
    }

    return clubNameToId[name]
}

function generateValuesForQuery(headers, data) {
    let valuesStringFromData = ''

    headers.forEach(h => {
        const str = dbColumnsTypes[h] !== "string" ? data[mapDBColumnsToObjectAttributes[h]] : `'${data[mapDBColumnsToObjectAttributes[h]]}'`
        valuesStringFromData += `${str}, `
    })

    return `(${substring(valuesStringFromData, 2)}),\n`
}

module.exports = {
    substring,
    headersToString,
    getIdByName,
    generateValuesForQuery
}