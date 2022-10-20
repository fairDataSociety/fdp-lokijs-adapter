import { Signer } from '@ethersphere/bee-js'
import { FeedUploadOptions } from '@ethersphere/bee-js/dist/src/feed'
import { Reference } from '@ethersphere/swarm-cid'
import { BeeSon } from '@fairdatasociety/beeson'
import { JsonValue } from '@fairdatasociety/beeson/dist/types'
import { FdpStorage } from '@fairdatasociety/fdp-storage'
import { SwarmStreamingFeedR, SwarmStreamingFeedRW } from './swarm-feeds/streaming'
import { StreamingFeed } from './swarm-feeds/streaming-feed'

export interface FeedSequencerOptions {
  init: number
  updateInterval: number
}

/**
 * Feed sequence helper class
 */
export class FeedSequencer {
  private writer: SwarmStreamingFeedRW
  private reader: SwarmStreamingFeedR

  constructor(private fdp: FdpStorage, public topic: string, private options: FeedSequencerOptions) {
    const streamingFeed = new StreamingFeed(fdp.connection.bee as any, 'fault-tolerant-stream')
    this.reader = streamingFeed.makeFeedR(topic, fdp.account.wallet?.address as string)
    this.writer = streamingFeed.makeFeedRW(topic, fdp.connection.bee.signer as Signer)
  }

  /**
   * Uploads a beeson block and writes it to a topic
   * @param data beeson block
   * @param options feed upload options
   * @returns feed response
   */
  async put(data: BeeSon<JsonValue>, options: FeedUploadOptions) {
    const d = data.serialize()
    const { reference } = await this.fdp.connection.bee.uploadData(this.fdp.connection.postageBatchId, d)

    return this.writer.setLastUpdate(
      this.fdp.connection.postageBatchId,
      reference,
      options?.at as number,
      this.options.updateInterval,
    )
  }

  /**
   * Reads data by swarm reference
   * @param ref swarm reference
   * @returns
   */
  async get(ref: Reference): Promise<any> {
    return this.fdp.connection.bee.downloadData(ref, undefined)
  }

  /**
   * Reads latest data
   * @param ref swarm reference
   * @returns
   */
  async getLatest(): Promise<any> {
    const feedUpdate = await this.writer.findLastUpdate(this.options.init, this.options.updateInterval)

    return feedUpdate.data
  }

  /**
   * Reads latest data
   * @param ref swarm reference
   * @returns
   */
  async getUpdate(at: number): Promise<any> {
    const feedUpdate = await this.writer.getUpdate(this.options.init, this.options.updateInterval, at)

    return feedUpdate.data
  }
}
