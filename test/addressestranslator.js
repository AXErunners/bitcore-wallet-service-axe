
var _ = require('lodash');
var chai = require('chai');
var sinon = require('sinon');
var assert = require('assert');
var should = chai.should;

var AddressTranslator = require('../lib/addresstranslator');

describe('#AddressTranslator', function() {
  it('should translate address from btc to bch', function() {
    var res = AddressTranslator.translate('XqHSiRAXd3EmNUPCAqok6ch5XzVWqKg7VD', 'bch');
    assert( res == 'CX4VTCrhYNzi7fh2zhpSpbdKKn8EdYGGPe');
  });
  it('should translate address from bch to btc', function() {
    var res = AddressTranslator.translateInput('HBf8isgS8EXG1r3X6GP89FmooUmiJ42wHS');
    assert(res=='7XYf6GXX5uQEPShSWCPUWFEvhNb5Ez2JrE');
  });

  it('should keep the address if there is nothing to do (bch)', function() {
    var res = AddressTranslator.translate('CcJ4qUfyQ8x5NwhAeCQkrBSWVeXxXghcNz', 'bch');
    assert(res=='CcJ4qUfyQ8x5NwhAeCQkrBSWVeXxXghcNz');
  });
  it('should keep the address if there is nothing to do (btc)', function() {
    var res = AddressTranslator.translate('XqHSiRAXd3EmNUPCAqok6ch5XzVWqKg7VD', 'btc');
    assert(res=='XqHSiRAXd3EmNUPCAqok6ch5XzVWqKg7VD');
  });
  it('should support 3 params NOK', function() {

    var a;
    try {
      var res = AddressTranslator.translate('XqHSiRAXd3EmNUPCAqok6ch5XzVWqKg7VD', 'btc', 'bch');
    } catch (e) {
      a=e.toString();
      assert(a.match(/Address has mismatched network type/));
    };
  });
  it('should support 3 params OK', function() {
    var res = AddressTranslator.translate('HBf8isgS8EXG1r3X6GP89FmooUmiJ42wHS', 'btc', 'bch');
    assert(res=='7XYf6GXX5uQEPShSWCPUWFEvhNb5Ez2JrE');
  });

  it('should work with arrays also', function() {
    var res = AddressTranslator.translateOutput(['XqHSiRAXd3EmNUPCAqok6ch5XzVWqKg7VD', '7XYf6GXX5uQEPShSWCPUWFEvhNb5Ez2JrE', 'XvhExSNNr97U1ZenWFjJmgD8wc7v88ZUF7']);
    assert(res[0] == 'CX4VTCrhYNzi7fh2zhpSpbdKKn8EdYGGPe');
    assert(res[1] == 'HBf8isgS8EXG1r3X6GP89FmooUmiJ42wHS');
    assert(res[2] == 'CcUHhE4YmUsQkkxdL7k1Vf9NjPkdvwjY5H');
  });
 

});


