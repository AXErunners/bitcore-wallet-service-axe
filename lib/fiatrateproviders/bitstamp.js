var provider = {
  name: 'Bitstamp',
  url: 'https://www.bitstamp.net/api/ticker/',
  parseFn: function(raw, data) {
    var price_btc = parseFloat(data[0].price_btc);
    return [{
      code: 'USD',
      value: (parseFloat(raw.last) * price_btc).toFixed(2)
    }];
  }
};

module.exports = provider;
