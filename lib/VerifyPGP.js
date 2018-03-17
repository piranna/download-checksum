const {readFileSync} = require('fs')
const {Transform}    = require('stream')

const inherits = require('inherits')
const {key: {readArmored}, message: {fromText}} = require('openpgp')


function VerifyPGP(options)
{
  if(!(this instanceof VerifyPGP)) return new VerifyPGP(options)

  VerifyPGP.super_.call(this, {readableObjectMode: true})

  var content = ''
  var armedSignature = options.signatureFile
                     ? readFileSync(options.signatureFile, 'utf8')
                     : options.signature
  var armedKeys = options.keysFile
                ? readFileSync(options.keysFile, 'utf8')
                : options.keys

  this._transform = function(chunk, encoding, callback)
  {
    content += chunk
    callback()
  }
  this._flush = function(callback)
  {
    const msg = fromText(content)
    msg.appendSignature(armedSignature)

    this.push(msg.verify(readArmored(armedKeys).keys))
    callback()
  }
}
inherits(VerifyPGP, Transform)


module.exports = VerifyPGP;
