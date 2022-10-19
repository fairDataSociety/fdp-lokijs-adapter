# fdp-lokijs-adapter

FDP LokiJS DB Adapter

## Usage

```typescript
import { BatchId } from '@ethersphere/bee-js'
import { BeeSon, Type } from '@fairdatasociety/beeson'
import * as Block from 'multiformats/block'

import { FdpStorage } from '@fairdatasociety/fdp-storage'
import { codec, hasher } from '@fairdatasociety/beeson-multiformats'
import { FdpStorageBlockstore } from '@fairdatasociety/fdp-storage-blockstore'

const id = `54ed0da82eb85ab72f9b8c37fdff0013ac5ba0bf96ead71d4a51313ed831b9e5` as BatchId
const client = new FdpStorage('http://localhost:1633', id)

const fdpBlockstore = new FdpStorageBlockstore(client);

const json = [0, 1, 2, 3, 5, 6]
const beeson = new BeeSon({ json })

// encode a block
const block = await Block.encode({ value, codec, hasher })
await fdpBlockstore.put(block.cid, block.bytes)

// get block
const resp = await fdpBlockstore.get(block.cid)

// Helpers

// put block
const cid = await fdpBlockstore.putBeesonBlock(beeson)

// get block
const resp = await fdpBlockstore.getBeesonBlock(cid)
```


## Maintainers

- [molekilla](https://github.com/molekilla)

## License

[MIT](./LICENSE)
