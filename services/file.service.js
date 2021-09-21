fs = require('fs')

function writeToFile(fileName, data) {
    fs.writeFile(fileName, data, function (err) {
       if (err) return console.log(err)
       console.log(`data > ${fileName}`)
       process.exit(0)
    });
 }

 module.exports = {
     writeToFile
 }