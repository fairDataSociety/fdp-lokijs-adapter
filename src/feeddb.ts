import { FdpStorage } from '@fairdatasociety/fdp-storage'
import { FeedSequencer, FeedSequencerOptions } from './feedsequencer'

export class FeedDB {
  constructor(private fdp: FdpStorage, public dbName: string, public options: FeedSequencerOptions) {}

  getTopic(): FeedSequencer {
    const topic = this.fdp.connection.bee.makeFeedTopic(`${this.dbName}`)

    return new FeedSequencer(this.fdp, topic, this.options)
  }
}
