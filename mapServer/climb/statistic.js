const util = require('./utils');
const datastore = require('nedb-promises')
const agent = require('superagent')

this.recordDb = datastore.create({
  filename: `./db/record.db`
});
this.recordDb.ensureIndex({
  fieldName: 'id',
  unique: true
});

this.statisticDb = datastore.create({
  filename: `./db/statistic.db`
});
// this.statisticDb.removeIndex({});
this.statisticDb.ensureIndex({
  fieldName: 'type',
  unique: true
});

/* 城市幸运儿 */

this.recordDb.update({
  id: '92aedda2beef9d8b385352067c3d9913'
}, {
  $set: {
    address: []
  }
})


const getLocation = async (location) => {
  const {
    text
  } = await agent.get(`http://api.map.baidu.com/geocoding/v3/?address=${encodeURIComponent(location)}&output=json&ak=MQIZkLOO9Tool4GtfFj1RdjCTzsGW2Mv`)

  const {
    result: {
      location: {
        lng,
        lat
      }
    }
  } = JSON.parse(text)
  // console.log(lng, lat);
  return [lng, lat]
}

const lucky = async () => {
  const records = await this.recordDb.find()
  const luckey = {};
  // console.log(records);
  records.forEach(row => {
    row.address && row.address.forEach(addr => {
      const {
        name,
        count
      } = addr
      if (luckey[name]) {
        luckey[name] += count;
      } else
        luckey[name] = count;
    })
  })

  const luckArr = []
  const map = {}

  const keys = Object.keys(luckey);

  for (let key of keys) {

    map[key] = await getLocation(key)

    luckArr.push({
      name: key,
      value: luckey[key]
    })
  }
  // console.log(luckArr);
  // console.log(map);
  this.statisticDb.update({
    type: 'location',
    id: 0,
  }, {
    id: 0,
    type: 'location',
    location: luckArr,
    map
  }, {
    upsert: true
  })
}



/* 各数字出现次数 */
numbCount = async () => {
  const records = await this.recordDb.find()
  const numbRed = {};
  const numbBlue = {}
  // console.log(records);
  records.forEach(row => {
    for (let i = 0; i <= 5; i++) {
      if (numbRed[row.numb[i]]) {
        numbRed[row.numb[i]]++;
      } else {
        numbRed[row.numb[i]] = 1
      }
    }
    if (numbBlue[row.numb[6]]) {
      numbBlue[row.numb[6]]++;
    } else {
      numbBlue[row.numb[6]] = 1
    }
  })
  console.log(numbRed, numbBlue);
  this.statisticDb.update({
    type: 'number',
    id: 1
  }, {
    id: 1,
    type: 'number',
    numbRed,
    numbBlue,
  }, {
    upsert: true
  })
}

/* 个数字连续出现次数 */

const sameNext = async () => {
  const records = await this.recordDb.find().sort({
    batch: true
  })
  // console.log(records);
  let numbRedPre = {};
  let countRed = {};
  let numbBluePre = {}
  let countBlue = {};
  // console.log(records);
  records.forEach(row => {
    for (let i = 0; i <= 5; i++) {
      if (numbRedPre[row.numb[i]]) {
        countRed[row.numb[i]] = ~~countRed[row.numb[i]] + 1;
      }
    }
    if (numbBluePre[row.numb[6]]) {
      countBlue[row.numb[6]] = ~~countBlue[row.numb[6]] + 1;
    }

    numbBluePre = {}
    numbRedPre = {}
    for (let i = 0; i <= 5; i++) {
      numbRedPre[row.numb[i]] = true;
    }
    numbBluePre[row.numb[6]] = true
  })
  console.log(countRed, countBlue)
  this.statisticDb.update({
    type: 'sameNext',
    id: 2
  }, {
    id: 2,
    type: 'sameNext',
    countRed,
    countBlue,
  }, {
    upsert: true
  })
}

/* 销售额 奖池变动 */
const moneyChange = async () => {
  const records = await this.recordDb.find().sort({
    batch: true
  })
  const inMoney = {}
  const pond = {}
  records.forEach(row => {
    inMoney[row.batch] = row.inMoney;
    pond[row.batch] = row.pond;
  })
  console.log(inMoney, pond);
  this.statisticDb.update({
    type: 'moneyChange',
    id: 3
  }, {
    id: 3,
    type: 'moneyChange',
    inMoney,
    pond,
  }, {
    upsert: true
  })
}
/* 每2数字联动次数 */

const twoNumbs = async () => {
  const records = await this.recordDb.find().sort({
    batch: true
  })
  const twoNumbRed = {}
  const twoNumbBlue = {}
  records.forEach(row => {

    for (let i = 0; i <= 5; i++) {
      for (let j = i + 1; j <= 5; j++) {
        const key = [row.numb[i], row.numb[j]].sort((a, b) => a - b);
        twoNumbRed[key.join('-')] = ~~twoNumbRed[key.join('-')] + 1;

      }
    }

    for (let i = 0; i <= 5; i++) {
      const key = [row.numb[i], row.numb[6]];
      twoNumbBlue[key.join('-')] = ~~twoNumbBlue[key.join('-')] + 1;
    }

  })
  console.log(twoNumbRed, twoNumbBlue);
  this.statisticDb.update({
    type: 'twoNumbs',
    id: 4
  }, {
    id: 4,
    type: 'twoNumbs',
    twoNumbRed,
    twoNumbBlue,
  }, {
    upsert: true
  })
}

/* 每3数字联动次数 */
const threeNumbs = async () => {
  const records = await this.recordDb.find().sort({
    batch: true
  })
  const threeNumbRed = {}
  const threeNumbBlue = {}
  records.forEach(row => {

    for (let i = 0; i <= 5; i++) {
      for (let j = i + 1; j <= 5; j++) {
        for (let k = j + 1; k <= 5; k++) {
          const key = [~~row.numb[i], ~~row.numb[j], ~~row.numb[k]].sort((a, b) => a - b);
          console.log(key);
          threeNumbRed[key.join('-')] = ~~threeNumbRed[key.join('-')] + 1;
        }

        const key2 = [row.numb[i], row.numb[j]].sort((a, b) => a - b).concat(row.numb[6]);
        threeNumbBlue[key2.join('-')] = ~~threeNumbBlue[key2.join('-')] + 1;
      }
    }



  })
  // console.log(threeNumbRed, threeNumbBlue);
  await this.statisticDb.update({
    type: 'threeNumbs',
    id: 5
  }, {
    id: 5,
    type: 'threeNumbs',
    threeNumbRed,
    threeNumbBlue,
  }, {
    upsert: true
  })
  console.log('每3数字联动次数 完成');
}

/* 数字最新未出现次数 */

const countDisplay = async () => {
  const records = await this.recordDb.find().sort({
    batch: -1
  })
  const countDisplayRed = {};
  let countRed = 0;
  const countDisplayBlue = {};
  let countBlue = 0;
  records.forEach(row => {
    for (let i = 1; i <= 33; i++) {
      if ([...row.numb].slice(0,5).includes(i)) {
        if (countDisplayRed[i] === undefined)
          countDisplayRed[i] = countRed;
      }
    }
    for (let i = 1; i <= 16; i++) {
      if ([...row.numb][6] === i) {
        if (countDisplayBlue[i] === undefined)
        countDisplayBlue[i] = countBlue;
      }
    }
    countRed++;
    countBlue++;
    if (Object.keys(countDisplayRed).length === 33 && Object.keys(countDisplayBlue).length === 16) {
      return;
    }
  })
  await this.statisticDb.update({
    type: 'countDisplay',
    id: 6
  }, {
    id: 6,
    type: 'countDisplay',
    countDisplayRed,
    countDisplayBlue,
  }, {
    upsert: true
  })
  console.log('各数字未出现次数');
}

lucky();
/* 个数字出现次数 */
numbCount();
/* 个数字连续出现次数 */
sameNext();
/* 销售额 奖池变动 */
moneyChange();
/* 每2数字联动次数 */
twoNumbs();
/* 每3数字联动次数 */
threeNumbs();
/* 数字最新未出现次数 */
countDisplay();