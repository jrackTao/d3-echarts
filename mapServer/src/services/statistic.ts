import { Injectable } from '@nestjs/common';
import { join } from 'path';

const datastore = require('nedb-promises')
import { ROOT_PATH, } from 'src/constants'

// const DEFAULT_OPTIONS: Options = {};

// Root path of database
const DB_ROOT = join(ROOT_PATH, 'db');

@Injectable()
export class StatisticService {
  private statistic;

  constructor() {
    this.statistic = datastore.create({ filename: `${DB_ROOT}/statistic.db` });
    this.statistic.ensureIndex({ fieldName: 'type', unique: true });
  }

  async findStatistic(type: string) {
    return await this.statistic.findOne({ type });
  }

}
