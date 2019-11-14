const cheerio = require('cheerio')
const agent = require('superagent')
const util = require('./utils');
const datastore = require('nedb-promises')

this.pagesDb = datastore.create({filename: `./db/page.db`});
this.pagesDb.ensureIndex({fieldName: 'id', unique: true});

const PRE_URL = 'http://www.cwl.gov.cn'

let cookie = 'UniqueID=NKl4fnqdtg2E6iaj1562224669566; Sites=_21; _ga=GA1.3.1840206270.1562145829; _gid=GA1.3.344329787.1562145829; FSSBBIl1UgzbN7N80S=0VFzqkDZLtkabJ_F8yPXv3agE5XUwb1Tp9QTOhKliu7jw7Rw0wGvxL_e4Anm_gOM; 21_vq=24; FSSBBIl1UgzbN7N80T=3VeiB30zJSQg2j_W2kPsUuLKrovehIRI_RC_EROyITZnMKcmuWVRpp.UFxU7H3tQ1e.wQXmdxl9Nr9PwX0dU7s7l003gQqtcDvNQ4.F1YUXD4P0RFBpg9j6.WaYuhwN.mt7ePz3dBU2fgwGnyJjP_ejJE8QChwfsN0WTd7DpfcRT_O28U9UVY3fpCExKuONrgrj4fPVfh7m6M.Zei_yy4nw6d8Qa_vWxo6U7LNeJtmEj3_4sRlRCQbx.FCnqSc4QsrGKqWmPJi5FdvL7dYNZu6h1._T78CX1SaqvAv6Yt2kQP2ZsJ.yN.RolYZDO7AHV2GUmg9MsEOKieaoKOr3ghBmCbEjdn3rigvMbf2Tbbd5kWDG'

const start = async (url, index = 0) => {
  const {text} = await agent.get(url)
    .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36')
    .set('Cookie', cookie)
    .set('Host', 'www.cwl.gov.cn')
  const $ = cheerio.load(text);
  const urls = []

  $('.container .list-group-item .white_space a').each((i, a) => {
    urls.push($(a)['0'].attribs['href']);
  });

  if(urls.length === 0) {
    console.error('出错')
    return;
  }

  const newUrl = urls[index];
  const uri = PRE_URL + newUrl
  const hash = util.makeStringHash(uri)
  const row = await this.pagesDb.findOne({id: hash});
  if(row) {
    console.log('存在了', uri);
    return;
  }
  await this.pagesDb.update({id: hash}, {
    id: hash,
    uri: uri,
    status: 0
  }, {upsert: true});

  console.log(`爬虫完毕: ` + url)
}

const go = async () => {
  for(let i of [0, 1, 2, 3])
    await start(`http://www.cwl.gov.cn/kjxx/ssq/kjgg/list.shtml`, i)
}

go()
