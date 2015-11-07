#!/usr/bin/env node

var assert   = require('assert')
var Readable = require('stream').Readable

var plugin = require('./index')


const downloads =
[
  {
    url: '',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  },
  {
    url: 'hello world',
    sha256: 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9'
  },
  {
    url: 'splitted',
    sha256: '4c002331eeef56ff91890b777426ed3b3d5291b35892041191e04df2b4fc8499'
  },
  {
    url: 'failure',
    sha256: 'failure'
  }
]


function noop(){}


var checksum = plugin(downloads)

// <empty>
var response = new Readable
checksum(response, '', noop)

response.push('')
response.push(null)

// hello world
var response = new Readable
checksum(response, 'hello world', noop)

response.push('hello world')
response.push(null)

// splitted
var response = new Readable
checksum(response, 'splitted', noop)

response.push('split')
response.push('ted')
response.push(null)

// failure
var response = new Readable
checksum(response, 'failure', noop)

response.push('failure')
response.push(null)
