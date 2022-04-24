import { Injectable } from '@nestjs/common'
import { RedisService } from '@liaoliaots/nestjs-redis'
import { Redis } from 'ioredis'
@Injectable()
export class CommonRedisService {
  private client: Redis
  constructor(private redisService: RedisService) {
    this.client = this.redisService.getClient()
  }

  /**
   * @Description: 封装设置redis缓存的方法
   * @param key {String} key值
   * @param value {String} key的值
   * @param seconds {Number} 过期时间
   * @return: Promise<any>
   */
  async set(key: string, value: any, seconds?: number): Promise<any> {
    if (!seconds) {
      await this.client.set(key, value)
    } else {
      await this.client.set(key, value, 'EX', seconds)
    }
  }

  /**
   * @Description: 设置获取redis缓存中的值
   * @param key {String}
   */
  get(key: string): Promise<any> {
    return this.client.get(key)
  }

  /**
   * @Description: 根据key删除redis缓存数据
   * @param key {String}
   * @return:
   */
  async del(key: string): Promise<any> {
    await this.client.del(key)
  }

  /**
   * @Description: 清空redis的缓存
   * @param {type}
   * @return:
   */
  async flushall(): Promise<any> {
    await this.client.flushall()
  }
}
