var _ = require('lodash');

var provider = {
  name: 'BitPay',
  url: 'https://bitpay.com/api/rates/',
  parseFn: function(raw, data) {
    var price_btc = parseFloat(data[0].price_btc);
    var rates = _.compact(_.map(raw, function(d) {
      if (!d.code || !d.rate) return null;
      return {
        code: d.code,
        value: (d.rate * price_btc).toFixed(2),
      };
    }));
    return rates;
  },
};

module.exports = provider;
