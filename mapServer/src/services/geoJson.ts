import { Injectable } from '@nestjs/common';
import { join } from 'path';

const datastore = require('nedb-promises')
import { ROOT_PATH, } from 'src/constants'

// const DEFAULT_OPTIONS: Options = {};

// Root path of database
const DB_ROOT = join(ROOT_PATH, 'db');

@Injectable()
export class GeoJsonService {
  private geoJson;

  constructor() {
    this.geoJson = datastore.create({ filename: `${DB_ROOT}/geoJson.db` });
    this.geoJson.ensureIndex({ fieldName: 'id', unique: true });
  }

  async findGeoJson(id: string) {
    return await this.geoJson.findOne({ id: id });
  }

}
