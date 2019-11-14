import * as crypto from 'crypto';

export function makeStringHash(str: string): string {
  return crypto.createHash('md5').update(str).digest('hex');
}