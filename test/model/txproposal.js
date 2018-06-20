'use strict';

var _ = require('lodash');
var chai = require('chai');
var sinon = require('sinon');
var should = chai.should();
var TxProposal = require('../../lib/model/txproposal');
var Bitcore = require('@axerunners/axecore-lib');

describe('TxProposal', function() {
  describe('#create', function() {
    it('should create a TxProposal', function() {
      var txp = TxProposal.create(aTxpOpts());
      should.exist(txp);
      txp.outputs.length.should.equal(2);
      txp.amount.should.equal(30000000);
      txp.network.should.equal('livenet');
    });
  });

  describe('#fromObj', function() {
    it('should copy a TxProposal', function() {
      var txp = TxProposal.fromObj(aTXP());
      should.exist(txp);
      txp.amount.should.equal(aTXP().amount);
    });
    it('should default to BTC coin', function() {
      var txp = TxProposal.fromObj(aTXP());
      should.exist(txp);
      txp.coin.should.equal('btc');
    });
  });

  describe('#getBitcoreTx', function() {
    it('should create a valid bitcore TX', function() {
      var txp = TxProposal.fromObj(aTXP());
      var t = txp.getBitcoreTx();
      should.exist(t);
    });
    it('should order outputs as specified by outputOrder', function() {
      var txp = TxProposal.fromObj(aTXP());

      txp.outputOrder = [0, 1, 2];
      var t = txp.getBitcoreTx();
      t.getChangeOutput().should.deep.equal(t.outputs[2]);

      txp.outputOrder = [2, 0, 1];
      var t = txp.getBitcoreTx();
      t.getChangeOutput().should.deep.equal(t.outputs[0]);
    });
  });

  describe('#getTotalAmount', function() {
    it('should compute total amount', function() {
      var x = TxProposal.fromObj(aTXP());
      var total = x.getTotalAmount();
      total.should.equal(x.amount);
    });
  });

  describe('#getEstimatedSize', function() {
    it('should return estimated size in bytes', function() {
      var x = TxProposal.fromObj(aTXP());
      x.getEstimatedSize().should.equal(396);
    });
  });

  describe('#sign', function() {
    it('should sign 2-2', function() {
      var txp = TxProposal.fromObj(aTXP());
      txp.sign('1', theSignatures2, theXPub2);
      txp.isAccepted().should.equal(false);
      txp.isRejected().should.equal(false);
      txp.sign('2', theSignatures2, theXPub2);
      txp.isAccepted().should.equal(true);
      txp.isRejected().should.equal(false);
    });
  });

  describe('#getRawTx', function() {
    it('should generate correct raw transaction for signed 2-2', function() {
      var txp = TxProposal.fromObj(aTXP());
      txp.sign('1', theSignatures1, theXPub1);
      txp.sign('2', theSignatures2, theXPub2);
      txp.getRawTx().should.equal(theRawTx);
    });
  });

  describe('#reject', function() {
    it('should reject 2-2', function() {
      var txp = TxProposal.fromObj(aTXP());
      txp.reject('1');
      txp.isAccepted().should.equal(false);
      txp.isRejected().should.equal(true);
    });
  });

  describe('#reject & #sign', function() {
    it('should finally reject', function() {
      var txp = TxProposal.fromObj(aTXP());
      txp.sign('1', theSignatures2);
      txp.isAccepted().should.equal(false);
      txp.isRejected().should.equal(false);
      txp.reject('2');
      txp.isAccepted().should.equal(false);
      txp.isRejected().should.equal(true);
    });
  });

});

var theXPriv1 = 'tprv8ZgxMBicQKsPeHCsHwzRrTjL6HMsS7rozDWtQvCYNjuDBjgFQJTUKrfjPmj8gDmLa2tH7ZSc4Z4e8xLAP7Cy49v2EiW3mJpqkuxA2gSAUNA';
var theXPub1 = 'tpubDDTaaaSM1Ga2NKTdr8i3NYRanNsQga3q57pfNrRNB8hqz7RMvSiQohu38HNEmSFWiPHbuPNbvKYfSWQZFTfAhxYy1icWwVVvxAjNeWpubwS';
var theSignatures1 = ['304502210089951aa097679be899866973826b1402f08efc10ba38a169a6262a6b17b0dab302206f5a2d840b225137503596f6350929fe7b36897dddcb3cf55e7defb2410be6bf'];
var theXPriv2 = 'tprv8ZgxMBicQKsPdELFtySdCVwuwQnN1xmvDZ67S5TQCSBNPeGWgju8XxSBotbbfkmvDEvCsDrBuUjye4iTLANwRze8auAZ1raBxnduHPASf5Z';
var theXPub2 = 'tpubDDb5nCWVNuPEbm9ztztimbb5PfZQmMJx4d1r4WaXfkTeTu6kVfToQL2CK5sGgyNPRcr9SmisQTe8kcd2jEh74i4N2UqfGthYvZgTkfRczFX';
var theSignatures2 = ['3045022100da1d7e668ca6da193a56dcad9fc65c968b754519b0844fd59a3be2cf003de9a50220025bd2d1f7dedff569e0ac3e685eea999d2cfb7378a6483c3233cdb4110fb68c'];
var theRawTx = '01000000013768fb3473c0f10758abc1fda4ef8c54f059003f2d448968c0ad804c4dcf0b4800000000db00483045022100da1d7e668ca6da193a56dcad9fc65c968b754519b0844fd59a3be2cf003de9a50220025bd2d1f7dedff569e0ac3e685eea999d2cfb7378a6483c3233cdb4110fb68c0148304502210089951aa097679be899866973826b1402f08efc10ba38a169a6262a6b17b0dab302206f5a2d840b225137503596f6350929fe7b36897dddcb3cf55e7defb2410be6bf01475221029153fd3f81a098634e7439fe7acf18a0464b6518fbf693b4c9f17b599a079ad82103f39e325ed77e2a95986f595042b8b3208382d1e74ea5b24831c67280a21ace6752aeffffffff0380969800000000001976a914f4d7feb11bc143018d55a463e3690703a9d9352188ac002d3101000000001976a914f4d7feb11bc143018d55a463e3690703a9d9352188acd0e6e2441700000017a91403d4b30b14cafa3047955b2764586d40b105733c8700000000';
var aTxpOpts = function(type) {

  var opts = {
    coin: 'btc',
    network: 'livenet',
    message: 'some message'
  };
  opts.outputs = [{
    toAddress: "XqHSiRAXd3EmNUPCAqok6ch5XzVWqKg7VD",
    amount: 10000000,
    message: "first message"
  }, {
    toAddress: "XqHSiRAXd3EmNUPCAqok6ch5XzVWqKg7VD",
    amount: 20000000,
    message: "second message"
  }, ];

  return opts;
};

var aTXP = function() {
  var txp = {
    "version": 3,
    "createdOn": 1475385140,
    "id": "fbb49acc-ca2b-43ff-a4a5-670dcfcd3653",
    "walletId": "31b6260b-61d8-4df6-84de-8c3eebd87fe5",
    "creatorId": "c239da924f98a90a804330ff7d021a1413a02c8e2effb8c65b7860e365068a72",
    "network": "testnet",
    "amount": 30000000,
    "message": 'some message',
    "proposalSignature": '304402201cf9f446d9d0cbcf075186ce1df2ac0e25a1f76a939518f2e0e365eefd729c4602203503fb852619d62697624d42960f2c03784cd2d47a7a8005e44c937ffab09600',
    "changeAddress": {
      "version": '1.0.0',
      "createdOn": 1475385139,
      "address": '8emiYFa4FG2CrY2YKbdbUNdWV2EEtw3swq',
      "path": 'm/1/9',
      "publicKeys": ['0297e50b5db89d18f1115e2c35b3c101ac2812658ba95a1a84fe2505b52a0aa655',
        '02406072e42e4f03940de60ad3386ed243d718f8ae0e5ae8a28d6418be95034f3a'
      ]
    },
    "inputs": [{
      "txid": "480bcf4d4c80adc06889442d3f0059f0548cefa4fdc1ab5807f1c07334fb6837",
      "vout": 0,
      "satoshis": 99969984360,
      "scriptPubKey": "a91422cece6b0e08688ba7c7ad4e1b1f6dbb0ad80cb987",
      "address": "8hbWRjx1CWXx1J65ZmZxUShb2PYMXWNok4",
      "path": "m/1/4",
      "publicKeys":['03f39e325ed77e2a95986f595042b8b3208382d1e74ea5b24831c67280a21ace67', '029153fd3f81a098634e7439fe7acf18a0464b6518fbf693b4c9f17b599a079ad8']
    }],
    "inputPaths": [ 'm/1/4'],
    "requiredSignatures": 2,
    "requiredRejections": 1,
    "walletN": 2,
    "addressType": "P2SH",
    "status": "pending",
    "actions": [],
    "fee": 15640,
    "outputs": [{
      "toAddress": "yie4Ubd2ieCdzqwNyAc8QRutfri3E9ChTm",
      "amount": 10000000,
      "message": "first message"
    }, {
      "toAddress": "yie4Ubd2ieCdzqwNyAc8QRutfri3E9ChTm",
      "amount": 20000000,
      "message": "second message"
    }, ],
    "outputOrder": [0, 1, 2]
  };

  return txp;
};
