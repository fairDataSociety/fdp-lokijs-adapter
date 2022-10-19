# fdp-lokijs-adapter

FDP LokiJS DB Adapter, experimental database adapter on top of `fdp-storage` and compatible with `rxdb`

## Usage

```typescript
import { BatchId } from '@ethersphere/bee-js'
import { BeeSon, Type } from '@fairdatasociety/beeson'
import * as Block from 'multiformats/block'

import { FdpStorage } from '@fairdatasociety/fdp-storage'
import { LokiFDPAdapter } from '@fairdatasociety/fdp-lokijs-adapter'
import { LokiPartitioningAdapter } from 'lokijs'
import loki from 'lokijs'

const id = `54ed0da82eb85ab72f9b8c37fdff0013ac5ba0bf96ead71d4a51313ed831b9e5` as BatchId
const client = new FdpStorage('http://localhost:1633', id)

// TODO: Be sure to login first with your account or Blossom wallet

// Instantiate LokiFDPAdapter
// WIP is using streaming feeds
const lokifdp = new LokiFDPAdapter(client, 'swarmbee', {
    init: new Date().getTime(),
    updateInterval: 1000,
})

// autosave interval matches LokiFDPAdapter updateInterval
const pa = new LokiPartitioningAdapter(lokifdp, { paging: true })
const db = new loki('swarm.db', { adapter: pa, autosave: true, autosaveInterval: 1000 })

// Create and work with Loki DB
const users = await db.addCollection('users')
const odin = users.insert({
    name: 'Odin',
    age: 50,
    address: 'Asgard',
})

// alternatively, insert array of documents
users.insert([
    { name: 'Thor', age: 35 },
    { name: 'Loki', age: 30 },
])
const results = users.find({ age: { $gte: 35 } })

// returns 2 users

// Update
odin.age = 60
users.update(odin)

const results2 = users.find({ age: { $gte: 59 } })

// returns 1 user

```


## Maintainers

- [molekilla](https://github.com/molekilla)

## License

[MIT](./LICENSE)
