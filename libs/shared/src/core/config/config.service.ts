import { resolve } from 'path';
import { parse } from 'dotenv';
import { readFileSync, existsSync } from 'fs';
import { Injectable, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
 
@Injectable()
export class ConfigService {
  private readonly logger = new Logger(ConfigService.name);
  private readonly envConfig: { [key: string]: string };
 
  constructor() {
    let envPath: string = null;
    let nodeEnv: string = process.env.NODE_ENV
      ? process.env.NODE_ENV.trim()
      : 'development';
    console.log(nodeEnv, 'nodeEnv');

    switch (nodeEnv) {
      case 'test':
        envPath = resolve(process.cwd(), 'env/test.env');
        break;
      case 'production':
        envPath = resolve(process.cwd(), 'env/production.env');
        break;
      case 'development':
        envPath = resolve(process.cwd(), 'env/development.env');
        break;
      default:
        throw new Error('Specify the NODE_ENV variable');
    }

    this.logger.log(envPath);
    try {
      if (existsSync(envPath)) {
        this.envConfig = parse(readFileSync(envPath));
      }
    } catch (err) {
      this.logger.error(err);
    }
  }

  get(key: string): string {
    let value = process.env[key];
    if (value == null || value === '') {
      if (this.envConfig[key]) value = this.envConfig[key];
    }

    this.logger.log(key + '=' + value);
    return value;
  }
  async decodeToken(token: string): Promise<any> {
    try {

      const tokenWithoutPrefix = token.replace('Bearer', '').trim();
      const data = jwt.verify(tokenWithoutPrefix, this.get('secretKey')) as {
        sub: string,
        id: string,
        iat: number,
        exp: number
      };
      return data
    } catch (error) {
      return error
    }
  }
}
