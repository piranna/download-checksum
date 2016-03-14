var crypto      = require('crypto')
var strictEqual = require('assert').strictEqual

var applyEach = require('async').applyEach

var VerifyPGP = require('./VerifyPGP')


const hashes = crypto.getHashes().map(function(hash)
{
  return addChecksum.bind(null, hash)
})
.concat(addPGP)


function onerror(error)
{
  throw error
}


function addChecksum(hashName, response, download, callback)
{
  var expected = download[hashName]
  if(!expected) return callback()

  var hash = crypto.createHash(hashName)

  // [Hack] First data chunk get consumed and lost on `duplixify`, so we recover
  // it from somewhere and inject if on the hash algorythm. A really nasty hack.
  var pipes = response._readableState.pipes
  if(pipes) pipes.buffer.forEach(hash.update.bind(hash))

  response.pipe(hash).on('data', function(data)
  {
    if(data.toString('hex') === expected) return callback()

    var url = download.url

    var error = new Error('Checksum failed for url "'+url+'"')
        error.url = url

    callback(error)
  })
}

function addPGP(response, download, callback)
{
  var pgp = download.pgp
  if(!pgp) return callback()

  response.pipe(VerifyPGP(pgp)).on('data', function(data)
  {
    data.forEach(function(verification)
    {
      if(verification.valid) return callback()

      var url = download.url

      var error = new Error('Invalid signature for url "'+url+'"')
          error.url = url

      callback(error)
    })
  })
}


const checksums = applyEach.bind(null, hashes)

/**
 * Plugin for `download` module
 */
function plugin(downloads)
{
  return function(response, url, next)
  {
    function addChecksums(download)
    {
      if(download.url === url) checksums(response, download, onerror)
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
plugin.checksums = checksums
