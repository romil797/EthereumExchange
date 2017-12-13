App = {
  web3Provider: null,
  contracts: {},

  init: function () {
      var interviewJustHappened = false;
      var questionsAsked = [4, 5]; // use Truffle. this should be handed somehow

      if (interviewJustHappened) {
          $.getJSON('../questions.json', function (data) {
              for (i = 0; i < data.length; i++) {
                  if (questionsAsked.includes(data[i].id)) {
                      var qsBought = $('#qsBought');
                      var qBought = $('#qBought');
                      $('#qPrompt').css('display', 'block');
                      qBought.find('input').attr('id', 'qId' + data[i].id);
                      qBought.find('label').text(data[i].question);
                      qsBought.append(qBought.html());
                  }
              }
          });
      }
      else {
          // Load questions from JSON.
          $.getJSON('../questions.json', function (data) {
              var qRow = $('#qRow');
              var qbRow = $('#qBRow');
              var qTemplate = $('#qTemplate');
              var idBought = [1, 3]; // use Truffle, pass account to get all questions bought
              for (i = 0; i < data.length; i++) {
                  qTemplate.find('.panel-title').text(data[i].company);
                  qTemplate.find('.q-rating').text(data[i].rating);
                  qTemplate.find('.q-date').text(data[i].date);
                  if (idBought.includes(data[i].id)) {
                      qTemplate.find('.qspan').css('display', 'block');
                      qTemplate.find('.q-question').text(data[i].question);
                      qbRow.append(qTemplate.html());
                  }
                  else {
                      qTemplate.find('.btn-buy').attr('data-id', data[i].id);
                      qTemplate.find('.btn-buy').css('display', 'block');
                      qRow.append(qTemplate.html());
                  }
                  qTemplate.find('.btn-buy').css('display', 'none');
                  qTemplate.find('.qspan').css('display', 'none');
              }
          });
      }

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
      $(document).on('click', '.btn-buy', App.handlePurchase);
      $(document).on('click', '.after-interview', App.handleAfterInterview);
  },

  markBought: function(purchasers, account) {
      var paymentInstance;

      App.contracts.QuestionPurchase.deployed().then(function (instance) {
          paymentInstance = instance;

          return paymentInstance.getQuestionLength.call({ from: account });
      }).then(function (questionAccessLength) {
          idBought = [1,3];
          
          for (i = 0; i < questionAccessLength; i++) {
              paymentInstance.getQuestionAtIndex(i, { from: account }).then(function (val) {
                  idBought.push(val['c'][0]);
                  if (i == questionAccessLength) {
                      $.getJSON('../questions.json', function (data) {
                          var qRow = $('#qRow');
                          var qbRow = $('#qBRow');
                          qRow.html(''); qbRow.html('');
                          var qTemplate = $('#qTemplate');
                          for (i = 0; i < data.length; i++) {
                              qTemplate.find('.panel-title').text(data[i].company);
                              qTemplate.find('.q-rating').text(data[i].rating);
                              qTemplate.find('.q-date').text(data[i].date);
                              if (idBought.includes(data[i].id)) {
                                  qTemplate.find('.qspan').css('display', 'block');
                                  qTemplate.find('.q-question').text(data[i].question);
                                  qbRow.append(qTemplate.html());
                              }
                              else {
                                  qTemplate.find('.btn-buy').attr('data-id', data[i].id);
                                  qTemplate.find('.btn-buy').css('display', 'block');
                                  qRow.append(qTemplate.html());
                              }
                              qTemplate.find('.btn-buy').css('display', 'none');
                              qTemplate.find('.qspan').css('display', 'none');
                          }
                      });
                  }

              });
              //$('.panel-q').eq(i).find('button').text('Success').attr('disabled', true);
          }
          




      }).catch(function (err) {
          console.log(err.message);
      });
  },
  handleAfterInterview: function(event) {
      event.preventDefault();
      
      checked = [];
      $('.seenQs:checked').each(function () {
          checked.push(parseInt(this.id.substring(3)));
      });
      newQs = [];
      $('.qAdd').each(function () {
          newQs.push($(this).val());
      });
      if (newQs.length + checked.length > 5)
          alert('Please only enter 5');
      // Truffle something with checked and newQs !!!
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
