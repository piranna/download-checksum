var crypto      = require('crypto')
var strictEqual = require('assert').strictEqual


const hashes = crypto.getHashes()


function addChecksum(response, download, hashName)
{
  if(!download[hashName]) return

  var hash = crypto.createHash(hashName)

  // [Hack] First data chunk get consumed and lost on `duplixify`, so we recover
  // it from somewhere and inject if on the hash algorythm. A really nasty hack.
  if(response._readableState.pipes)
    hash.update(response._readableState.pipes.buffer[0])

  response.pipe(hash).on('data', function(data)
  {
    var actual   = data.toString('hex')
    var expected = download[hashName]
    var url      = download.url

    strictEqual(actual, expected, 'Checksum failed for url "'+url+'"')
  })
}

  response.on('data', function(data)
  {
    this[checksum].update(data)
  })
  response.on('end', function()
  {
    var actual = this[checksum].digest('hex')
    var expected = download[checksum]

    if(actual !== expected)
    {
      var error = new Error('Checksum failed')
          error.url      = download.url
          error.actual   = actual
          error.expected = expected

      throw error
    }
  })
}


function plugin(downloads)
{
  return function(response, url, next)
  {
    function addChecksums(download)
    {
      if(download.url === url)
        hashes.forEach(addChecksum.bind(undefined, response, download))
    }

    if(downloads instanceof Array)
      downloads.forEach(addChecksums)
    else
    {
      if(!downloads.url) downloads.url = url

      addChecksums(downloads)
    }

    next()
  }
}


module.exports = plugin
