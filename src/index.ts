import { FdpStorage } from '@fairdatasociety/fdp-storage'
import { BeeSon } from '@fairdatasociety/beeson'
import { codec, hasher } from '@fairdatasociety/beeson-multiformats'
import * as Block from 'multiformats/block'
import { JsonValue } from '@fairdatasociety/beeson/dist/types'
import { Reference } from '@ethersphere/swarm-cid'
import { CID } from 'multiformats/cid'
import { FeedDB } from './feeddb'
import { getCidFromBeeson } from '@fairdatasociety/fdp-storage-blockstore'

export interface SaveDatabaseCallbackArgs {
  reference: Reference
  cid: CID
}

export interface LoadDatabaseCallbackArgs {
  data: BeeSon<JsonValue>
}

/**
 * fdp storage Loki DB Adapter
 */
export class LokiFDPAdapter {
  db: FeedDB
  constructor(private fdp: FdpStorage, private username: string, private namespace: string) {
    this.db = new FeedDB(this.fdp, this.username, namespace)
  }

  async saveDatabase(
    key: string,
    value: BeeSon<JsonValue>,
    callback: (err: Error | null, args?: SaveDatabaseCallbackArgs) => void,
  ) {
    try {
      // encode a block
      const res = await this.db.getTopic().put(value)
      const cid = await getCidFromBeeson(value)

      callback(null, { reference: res as Reference, cid })
    } catch (err) {
      callback(err as Error)
    }
  }

  async loadDatabase(dbname: string, callback: (err: Error | null, args?: LoadDatabaseCallbackArgs) => void) {
    try {
      const bytes = await this.db.getTopic().get(dbname as Reference)
      const block = await Block.decode({ bytes, codec, hasher })

      callback(null, { data: block.value })
    } catch (err) {
      callback(err as Error)
    }
  }
}
