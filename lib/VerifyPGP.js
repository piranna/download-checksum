var Transform = require('stream').Transform

var inherits = require('inherits')
var openpgp  = require('openpgp')

var readSignedContent = openpgp.message.readSignedContent
var readArmored       = openpgp.key.readArmored


function VerifyPGP(options)
{
  if(!(this instanceof VerifyPGP)) return new VerifyPGP(options)

  VerifyPGP.super_.call(this, {readableObjectMode: true})


  var content = ''
  this._transform = function(chunk, encoding, callback)
  {
    content += chunk
    callback()
  }
  this._flush = function(callback)
  {
    var keys = readArmored(options.keys).keys

    this.push(readSignedContent(content, options.signature).verify(keys))
    callback()
  }
}
inherits(VerifyPGP, Transform)


module.exports = VerifyPGP;
