# download-checksum
Checksums plugin for [download](https://github.com/kevva/download)

Allow to check the downloads by using any of the accepted checksums of the
Node.js [crypto](https://nodejs.org/api/crypto.html) module and PGP signatures.
It allow to check several algorythms for a single file, too.

## Usage

```Javascript
var Download = require('download')
var checksum = require('download-checksum')

var downloads =
[
  {
    url: 'http://example.com/foo.zip',
    sha256: '<hex string>'
  },
  {
    url: 'http://example.com/cat.jpg',
    md5: '<hex string>'
  },
  {
    url: 'http://example.com/Windows_10.tar.gz',
    pgp:
    {
      ascFile: 'path/to/signature.asc',
      pubFile: 'path/to/publicKey.pub'
    }
  }
]

new Download({mode: '755'})
    .get(downloads[0].url)
    .get(downloads[1].url)
    .get(downloads[2].url)
    .dest('dest')
    .use(checksum(downloads))
    .run();
```
