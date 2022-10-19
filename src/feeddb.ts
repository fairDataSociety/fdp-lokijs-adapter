import { FdpStorage } from '@fairdatasociety/fdp-storage'
import { FeedSequencer } from './feedsequencer'

export class FeedDB {
  constructor(private fdp: FdpStorage, public username: string, public dbName: string) {}

  getTopic(): FeedSequencer {
    const topic = this.fdp.connection.bee.makeFeedTopic(`${this.dbName}`)

    return new FeedSequencer(topic, this.username, this.fdp)
  }
}
