const crypto = require('crypto');
const makeStringHash = (str) => {
  return crypto.createHash('md5').update(str).digest('hex');
}

const sleep = time => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time * 1000)
  })
}


exports.makeStringHash = makeStringHash;
exports.sleep = sleep;