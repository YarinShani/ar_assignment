let dbConfigNames = {
    dbSchemeName: 'ar_db',
    usersTableName: '',
    membershipsTableName: '',
    uniqueColumn: 'email'
}

let clubNameToId = {
    "jimalaya": 2400
}

let mapDBColumnsToObjectAttributes = {
    "first_name": "first_name",
    "last_name": "last_name",
    "email": "email",
    "phone": "phone",
    "club_id": "club_id",
    "user_id": "user_id",
    "id": "user_id",
    "joined_at": "membership_start_date",
    "start_date": "membership_start_date",
    "end_date": "membership_end_date",
    "membership_name": "membership_name"
}

let dbColumnsTypes = {
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "phone": "string",
    "club_id": "number",
    "joined_at": "date",
    "start_date": "date",
    "end_date": "date",
    "membership_name": "string"
}

function setTableNames(tableName) {
    dbConfigNames["usersTableName"] = tableName[0]
    dbConfigNames["membershipsTableName"] = tableName[1]
}

module.exports = {
    dbConfigNames,
    clubNameToId,
    mapDBColumnsToObjectAttributes,
    dbColumnsTypes,
    setTableNames
}