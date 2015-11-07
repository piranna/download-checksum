#!/usr/bin/env node

var assert   = require('assert')
var Readable = require('stream').Readable

var plugin = require('./lib')


const pgpKey =
[
  '-----BEGIN PGP PUBLIC KEY BLOCK-----',
  'Version: GnuPG v1',
  '',
  'mQENBFY+VNEBCAC2MRfhAWlQUGzBQvfZHTZBslnlGR5noK94V3JoJwDROgz0eTsg',
  'wi3ut4Jr45pq9AtOrPCYZmfgHyaGpTHCkEpd4zp9QY2BvUHclY2Z4TWkDHXHX2nY',
  'SfF0Uucn7uinJL82nsuQhVUzqGuwBEOsLO74c/UBWXuwp/K/kG81zkFMs6sw7yXV',
  'WrmApx/rm07C//URFZEt4ILCNJkUQDuy50acNRczGgcWz50hxGQqv+nkdRs8q2Rm',
  '6lKTNQ+UGhP5Ut5B/oYBnDYrkbBxTlTZ4mKd+wBbYIogsK7hc3Lol4SWNkHtrJvf',
  'GfWuVoTTubVcM/BBP8y0QvsOdUa3K6jFaYuVABEBAAG0EWRvd25sb2FkLWNoZWNr',
  'c3VtiQE4BBMBAgAiBQJWPlTRAhsDBgsJCAcDAgYVCAIJCgsEFgIDAQIeAQIXgAAK',
  'CRC4ghiey9FJypX+B/9q8o2fW075TEmajxhZoATWktBfpiiGqF71Id2EZbUP5e39',
  '4P2Y+U9DMVwPEe0XbY3DeEsn1FifQdP4Zn2S0KALEbKQMXhQuKrdkmTY+YW2C+cT',
  'Y/F+zPpP6M91nBdzRm39oOk38t2btSfacqbrGavC4VJs95r2dNq3HVqyMr9lBVrL',
  'iqjyEP2rkMzNXql6l1WOTStvzi4kd4f/A+5AXKCixXIR/LvYO6Tbun92vyirth6k',
  'hcajdg5cQXNFmod4sugRutI8hgFnSA7eEMNIM+/TQpRpWA06EIEH0IdpVlHV3QzT',
  '/QGge7y/m7qdgl/ClvHwi5XiGEQXQW4p3l3JsZIsuQENBFY+VNEBCADaKkiDzw3Y',
  'QuHbHWmY4W/g79yZj0p4pCRyz3XibPJktLqQgZs9n4NuSkQGHUR+eIvFwGjtRNiM',
  'BAG+RUK935+vCi1ak1lbdW3M5HNFGkMCAOy7UCEtDDUU2gWvJIGuqbWJttePtBFm',
  'FyuWGxUsdpf32gLxmuj2gsJurxfcslXvHaF1UGR+W6rfhrt48OvcR+8GRi1bIJ2/',
  '9Ae2zAVJrIRmWolBRQKtk82KzBivWBCg1A4JEO7q3Dm6JzrgrJDGz6loB7kL2gke',
  'SeyC7F+MoSpazethVmNmGfRH1i28yGwc7AHw3/60yj1Sok/35h9A9lPT41AhGU1Q',
  'uPPYWrfyzZTrABEBAAGJAR8EGAECAAkFAlY+VNECGwwACgkQuIIYnsvRScojLgf/',
  'aLmv1oXBqcYm5zBgqhtlz69GgjP8IgtH3BO12JaJ9IJNwKQjXVL4hwVCMQ0FypXD',
  'gQBZ3woHo9Hfu0Ao9xuG8hQTyrPh+jVReDqWOrM23aojDYL+QEHdFEUDhPMl1Bs6',
  'zlKWGBgenFRUsIGu6FetdRIrVLtJhaBMLc+hsWbZQWug4ayVxInkUqqrudaDJ+6d',
  'QOWmpVsj7STPjbF5csDKg6EzNT4z7hH7IfvYjRfEUzvkiceQ7lT1siSj0XwpI1QE',
  'QeTFvIz/cbE3XcIPWf6sxIRLTjSVzrLRvFSSrZgP8Te0LdTxfTdtWu9bgnp/vjod',
  'SXuipIGE3uvNaVqjh7iZUw==',
  '=dEdo',
  '-----END PGP PUBLIC KEY BLOCK-----'
].join('\n')

const pgpSignature =
[
  '-----BEGIN PGP SIGNATURE-----',
  'Version: GnuPG v1',
  '',
  'iQEcBAEBAgAGBQJWPlkGAAoJELiCGJ7L0UnK/hIH/0mv54LV4I0RrYlshH+mIKuO',
  'RhnRD7J9Yu9XBKsr3IohclplE9F4i397/FoPwtcSqViIe/MO6Cxm0ftxRwds2UhT',
  'qHIDqtUfwf/qFXlqnsp/8EDf75nqBAdET9SGeZ2rh3iEL3U0rxpxCwjmbLf4O7To',
  '1x1K4cKnyhjzLnNS2sLLipYOQTm14GufbrM2RMjFd0y5QGNCDhCs0yWqpNIHSv++',
  'K9GN0nJgSx6ZaZ0yvC7rAGj0rTWlBwNRDse3BNnsEBKnKU3eTq6h3c6W3/hVYntW',
  'wrqewflnpFbgGXcK4z5TOH/KTHpThqI/0CpdjQBGeGAhOeV7viZQMXQr3pKNFck=',
  '=MFuO',
  '-----END PGP SIGNATURE-----'
].join('\n')


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
    url: 'pgp',
    pgp:
    {
      keys: pgpKey,
      signature: pgpSignature
    }
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

// pgp
var response = new Readable
checksum(response, 'pgp', noop)

response.push('pgp')
response.push(null)

// failure
var response = new Readable
checksum(response, 'failure', noop)

response.push('failure')
response.push(null)
