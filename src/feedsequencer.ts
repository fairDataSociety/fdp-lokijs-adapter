import { FeedReader, FeedWriter } from '@ethersphere/bee-js'
import { FeedUploadOptions } from '@ethersphere/bee-js/dist/types/feed'
import { Reference } from '@ethersphere/swarm-cid'
import { BeeSon } from '@fairdatasociety/beeson'
import { JsonValue } from '@fairdatasociety/beeson/dist/types'
import { FdpStorage } from '@fairdatasociety/fdp-storage'

/**
 * Feed sequence helper class
 */
export class FeedSequencer {
  private writer: FeedWriter
  private reader: FeedReader

  constructor(topic: string, username: string, private fdp: FdpStorage) {
    this.reader = fdp.connection.bee.makeFeedReader('sequence', topic, username)
    this.writer = fdp.connection.bee.makeFeedWriter('sequence', topic, username)
  }

  /**
   * Uploads a beeson block and writes it to a topic
   * @param data beeson block
   * @param options feed upload options
   * @returns feed response
   */
  async put(data: BeeSon<JsonValue>, options?: FeedUploadOptions) {
    const d = data.serialize()
    const { reference } = await this.fdp.connection.bee.uploadData(this.fdp.connection.postageBatchId, d)

    return this.writer.upload(this.fdp.connection.postageBatchId, reference, options)
  }

  /**
   * Reads data by swarm reference
   * @param ref swarm reference
   * @returns
   */
  async get(ref: Reference) {
    return this.fdp.connection.bee.downloadData(ref, undefined)
  }

  /**
   * Reads latest data
   * @param ref swarm reference
   * @returns
   */
  async getLatest() {
    const latest = await this.reader.download()

    return this.get(latest.reference as Reference)
  }
}
