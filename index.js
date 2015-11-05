var crypto = require('crypto')

const hashes = crypto.getHashes()


function addChecksum(response, download, checksum)
{
  if(!download[checksum]) return

  response[checksum] = crypto.createHash(checksum)

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


function plugin(dpwnloads)
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
      if(!dpwnloads.url) dpwnloads.url = url

      addChecksums(dpwnloads)
    }

    next()
  }
}


module.exports = plugin
