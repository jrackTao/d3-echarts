import { Injectable } from '@nestjs/common';
import { join } from 'path';

const datastore = require('nedb-promises')
import { ROOT_PATH, } from 'src/constants'

// const DEFAULT_OPTIONS: Options = {};

// Root path of database
const DB_ROOT = join(ROOT_PATH, 'db');

@Injectable()
export class DivisionService {
  private division;

  constructor() {
    this.division = datastore.create({ filename: `${DB_ROOT}/division.db` });
    this.division.ensureIndex({ fieldName: 'id', unique: true });
  }

  async findDivision(id: string) {
    return await this.division.findOne({ id: id });
  }

}
