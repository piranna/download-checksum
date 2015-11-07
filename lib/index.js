var crypto      = require('crypto')
var strictEqual = require('assert').strictEqual

var VerifyPGP = require('./VerifyPGP')


const hashes = crypto.getHashes()


function addChecksum(response, download, hashName)
{
  var expected = download[hashName]
  if(!expected) return

  var hash = crypto.createHash(hashName)

  // [Hack] First data chunk get consumed and lost on `duplixify`, so we recover
  // it from somewhere and inject if on the hash algorythm. A really nasty hack.
  if(response._readableState.pipes)
    hash.update(response._readableState.pipes.buffer[0])

  response.pipe(hash).on('data', function(data)
  {
    var actual = data.toString('hex')
    var url    = download.url

    strictEqual(actual, expected, 'Checksum failed for url "'+url+'"')
  })
}

function addPGP(response, download)
{
  var pgp = download.pgp
  if(!pgp) return

  response.pipe(VerifyPGP(pgp)).on('data', function(data)
  {
    data.forEach(function(verification)
    {
      if(verification.valid) return

      var error = new Error('Invalid signature')
          error.url = download.url

      throw error
    })
  })
}


function plugin(downloads)
{
  return function(response, url, next)
  {
    function addChecksums(download)
    {
      if(download.url === url)
      {
        hashes.forEach(addChecksum.bind(undefined, response, download))

        addPGP(response, download)
      }
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
