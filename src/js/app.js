App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load questions from JSON.
    $.getJSON('../questions.json', function(data) {
      var qRow = $('#qRow');
      var qTemplate = $('#qTemplate');

      for (i = 0; i < data.length; i ++) {
        qTemplate.find('.panel-title').text(data[i].company);
        qTemplate.find('.q-rating').text(data[i].rating);
        qTemplate.find('.q-date').text(data[i].date);
        qTemplate.find('.btn-adopt').attr('data-id', data[i].id);
        qRow.append(qTemplate.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function() {
      // Is there is an injected web3 instance?
      if (typeof web3 !== 'undefined') {
          App.web3Provider = web3.currentProvider;
      } else {
          // If no injected web3 instance is detected, fallback to the TestRPC
          App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      }
      web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
      $.getJSON('QuestionPurchase.json', function (data) {
          // Get the necessary contract artifact file and instantiate it with truffle-contract
          var QuestionPurchaseArtifact = data;
          App.contracts.QuestionPurchase = TruffleContract(QuestionPurchaseArtifact);

          // Set the provider for our contract
          App.contracts.QuestionPurchase.setProvider(App.web3Provider);

          // Use our contract to retrieve and mark the adopted pets
          return App.markBought();
      });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handlePurchase);
  },

  markBought: function(purchasers, account) {
      var paymentInstance;

      App.contracts.QuestionPurchase.deployed().then(function (instance) {
          paymentInstance = instance;

          return paymentInstance.getPurchasers.call();
      }).then(function (purchasers) {
          for (i = 0; i < purchasers.length; i++) {
              if (purchasers[i] !== '0x0000000000000000000000000000000000000000') {
                  $('.panel-q').eq(i).find('button').text('Success').attr('disabled', true);
              }
          }
      }).catch(function (err) {
          console.log(err.message);
      });
  },

  handlePurchase: function(event) {
    event.preventDefault();

    var questionId = parseInt($(event.target).data('id'));

    var paymentInstance;

    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            console.log(error);
        }

        var account = accounts[0];

        App.contracts.QuestionPurchase.deployed().then(function (instance) {
            paymentInstance = instance;

            // Execute adopt as a transaction by sending account
            return paymentInstance.purchase(questionId, { from: account });
        }).then(function (result) {
            return App.markBought();
        }).catch(function (err) {
            console.log(err.message);
        });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
