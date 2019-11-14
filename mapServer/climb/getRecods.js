const cheerio = require('cheerio')
const agent = require('superagent')
const util = require('./utils');
const datastore = require('nedb-promises')

this.pagesDb = datastore.create({filename: `./db/page.db`});
this.pagesDb.ensureIndex({fieldName: 'id', unique: true});

this.recordDb = datastore.create({filename: `./db/record.db`});
this.recordDb.ensureIndex({fieldName: 'id', unique: true});

const PRE_URL = 'http://www.cwl.gov.cn'

let cookie = 'UniqueID=NKl4fnqdtg2E6iaj1562224669566; Sites=_21; _ga=GA1.3.1840206270.1562145829; _gid=GA1.3.344329787.1562145829; FSSBBIl1UgzbN7N80S=0VFzqkDZLtkabJ_F8yPXv3agE5XUwb1Tp9QTOhKliu7jw7Rw0wGvxL_e4Anm_gOM; FSSBBIl1UgzbN7N80T=34K0p6IUu86cMmpCM7xNNQk7dLWoTan2lCwqCCEkfFUE2yNdJOdOB5qz9bZKS6fb71qvPrXm6.HsdhxvAMVz1Zo5teWrUJRVfir4JovwR7UTs0sDEc8jIU4DBdco8ZRe.vH1yJd.vDD1oLUhIJ53np0alvNSZYSmkv_nVam3.hBM5_4D4QUC.dpWwbrQPRumiYtZmgf_TgWG7nsUZE2O4BXL55mcgSxLa9xWUAIUfzWWji8kq0TxRYkBDiShIwv2wwY6jY4RNimahPwYRB0VursdE; 21_vq=33'

const start = async (url) => {
  const {text} = await agent.get(url)
    .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36')
    .set('Cookie', cookie)
    .set('Host', 'www.cwl.gov.cn')
  const $ = cheerio.load(text);
  // console.log(text);
  const record = {}
  const result = /var khHq = (\S+);/.exec(text);

  if(!result) throw '出错'

  const numb = eval(result[1].replace(/"/g, ''))
  record.numb = numb;
  const urls = []

  const con = $('.kjggZw');
  const title = con.find('h2').text();
  // console.log('title:', title);
  record.batch = /\d+/.exec(title)[0]
  con.find('.kjxx tr').each((i, item) => {
    if(i === 0) {
      const time = $(item).find('td').text();
      // console.log('time', time);
      record.time = time;
    } else if(i === 1) {
      const m1 = $(item).find('td').eq(0).text();
      const m2 = $(item).find('td').eq(1).text();
      // console.log(m1, m2);
      record.inMoney = ~~/\d+/.exec(m1.replace(/,/g, ''))[0]
      record.pond = ~~/\d+/.exec(m2.replace(/,/g, ''))[0]
    }
  })

  const nl = con.find('.kjhmNr .qiuL').text()
  record.numb.push(~~nl)

  const addr = con.find('.zjqkzy dd').text();
  // console.log('一等奖地点', addr);
  const addrs = addr.split(/,共\d+注/)[0].split(',');
  console.log(url, addrs);
  if(addrs.length) {
    record.address = []
    addrs.forEach(item => {

      const ress = /(\S+[^\d])(\d+)注/.exec(item)
      if(!ress || ress[1] === '共') return;
      record.address.push({
        name: ress[1],
        count: ~~ress[2],
      })
    })

  }
  const hash = util.makeStringHash(record.batch)
  // console.log(record);

  await this.recordDb.update({id: hash}, {
    id: hash,
    ...record,
  }, {upsert: true});

  await this.pagesDb.update({id: util.makeStringHash(url)}, {
    $set: {status: 1}
  })

  console.log(`爬虫完毕: ` + url)
}



const go = async () => {
  // await start(`http://www.cwl.gov.cn/c/2019-07-02/455074.shtml`)


  const all = await this.pagesDb.find()

  // all.forEach(item => {
  //   console.log(item);
  //   this.pagesDb.update({id: item.id}, {
  //     $set: {
  //       status: 0
  //     }
  //   })
  // })
  // return 

  const pages = await this.pagesDb.find({status: 0});
  let i = 1
  for(let page of pages) {
    try {
      console.log(`共${all.length},本批${pages.length},现在${i++}`);
      await start(page.uri)
      // util.sleep(0.1)
    } catch(err) {
      console.log(err);
    }
  }
}

go()

