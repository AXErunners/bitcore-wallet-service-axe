'use strict';

var _ = require('lodash');
var $ = require('preconditions').singleton();
var log = require('npmlog');
log.debug = log.verbose;

var Insight = require('./blockchainexplorers/insight');
var Common = require('./common');
var Constants = Common.Constants,
  Defaults = Common.Defaults,
  Utils = Common.Utils;

var PROVIDERS = {
  'insight': {
    'btc': {
      'livenet': 'https://insight.axerunners.org:443',
      'testnet': 'https://testnet-insight.axerunners.org:443',
    },
    'bch': {
      'livenet': 'https://insight.axerunners.org:443',
    },
  },
};

function BlockChainExplorer(opts) {
  $.checkArgument(opts);
  
  if(!opts.hasOwnProperty('url'))
    throw new Error('Missing URL in config file');
  if(!opts.hasOwnProperty('provider'))
    throw new Error('Missing provider in config file');
  if(!opts.hasOwnProperty('network'))
      throw new Error('Missing network in config file');  
      
  var url = opts.url;
  var provider = opts.provider || 'insight';
  var coin = opts.coin || Defaults.COIN;
  var network = opts.network || 'livenet';

  $.checkState(PROVIDERS[provider], 'Provider ' + provider + ' not supported');
  $.checkState(_.contains(_.keys(PROVIDERS[provider]), coin), 'Coin ' + coin + ' not supported by this provider');
  $.checkState(_.contains(_.keys(PROVIDERS[provider][coin]), network), 'Network ' + network + ' not supported by this provider for coin ' + coin);

  var url = opts.url || PROVIDERS[provider][coin][network];

  switch (provider) {
    case 'insight':
      return new Insight({
        coin: coin,
        network: network,
        url: url,
        apiPrefix: opts.apiPrefix,
        userAgent: opts.userAgent,
        translateAddresses: opts.translateAddresses,
      });
    default:
      throw new Error('Provider ' + provider + ' not supported.');
  };
};

module.exports = BlockChainExplorer;
