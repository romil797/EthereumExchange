var questionId;



App = {
  web3Provider: null,
  contracts: {},

  init: function () {

          // Load questions from JSON.
          $.getJSON('../questions.json', function (data) {
              var qRow = $('#qRow');
              var qbRow = $('#qBRow');
              var qTemplate = $('#qTemplate');
              var idBought = []; // use Truffle, pass account to get all questions bought
              var colors = ["#FF9999", "#F5FFFF", "#99FF99", "#9999FF", "#F5F5F5", "#FFF5FF"];
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
                  qTemplate.find('.panel-heading').css('background-color', colors[Math.round((data[i].company.charCodeAt(0) - 65.0) / (90.0 - 65.0) * 6.0)])
                  qTemplate.find('.btn-buy').css('display', 'none');
                  qTemplate.find('.qspan').css('display', 'none');
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

          // Use our contract to retrieve and mark the question
          return App.markBought();
      });

    return App.bindEvents();
  },

  bindEvents: function() {
      $(document).on('click', '.btn-buy', App.handlePurchase);
      $(document).on('click', '.after-interview', App.handleAfterInterview);
      $(document).on('click', '#addQ', App.handleAddQuestion);
  },

  markBought: function(purchasers, account) {
      var paymentInstance;

      App.contracts.QuestionPurchase.deployed().then(function (instance) {
          paymentInstance = instance;
          return paymentInstance.getQuestionLength.call({ from: account });
      }).then(function (questionAccessLength) {
          idBought = [];
          timesBought = []
          questionsAsked = [];
          questionAccessLength = questionAccessLength['c'][0];
          for (i = 0; i < questionAccessLength; i++) {
              paymentInstance.getQuestionAtIndex(i, { from: account }).then(function (val) {
                  idBought.push(val[0]['c'][0]);
                  timesBought.push(val[1]['c'][0]);
                  if (timesBought.push(val[1]['c'][0]) < Math.round((new Date()).getTime() / 1000)) {
                      $.getJSON('../questions.json', function (data) {
                          for (j = 0; j < data.length; j++) {
                              if (idBought.includes(data[j].id)) {
                                  var qsBought = $('#qsBought');
                                  var qBought = $('#qBought');
                                  $('#qPrompt').css('display', 'block');
                                  qBought.find('input').attr('id', 'qId' + data[j].id);
                                  qBought.find('label').text(data[j].question);
                                  qsBought.append(qBought.html());
                              }
                          }
                      });
                  }

                  if (i == questionAccessLength) {
                      $.getJSON('../questions.json', function (data) {
                          var colors = ["#FF9999", "#F5FFFF", "#99FF99", "#9999FF", "#F5F5F5", "#FFF5FF"];
                          //idBought.push(questionId);
                          var qRow = $('#qRow');
                          var qbRow = $('#qBRow');
                          qRow.html(''); qbRow.html('');
                          var qTemplate = $('#qTemplate');
                          for (j = 0; j < data.length; j++) {
                              qTemplate.find('.panel-title').text(data[j].company);
                              qTemplate.find('.panel-heading').css('background-color', colors[Math.round((data[j].company.charCodeAt(0) - 65.0) / (90.0 - 65.0) * 6.0)])
                              qTemplate.find('.q-rating').text(data[j].rating);
                              qTemplate.find('.q-date').text(data[j].date);
                              if (idBought.includes(data[j].id)) {
                                  qTemplate.find('.qspan').css('display', 'block');
                                  qTemplate.find('.q-question').text(data[j].question);
                                  qbRow.append(qTemplate.html());
                              }
                              else {
                                  qTemplate.find('.btn-buy').attr('data-id', data[j].id);
                                  qTemplate.find('.btn-buy').css('display', 'block');
                                  qRow.append(qTemplate.html());
                              }
                              qTemplate.find('.btn-buy').css('display', 'none');
                              qTemplate.find('.qspan').css('display', 'none');
                          }

                          for (j = 0; j < data.length; j++) {
                              if (questionsAsked.includes(data[j].id)) {
                                  var qsBought = $('#qsBought');
                                  var qBought = $('#qBought');
                                  $('#qPrompt').css('display', 'block');
                                  qBought.find('input').attr('id', 'qId' + data[j].id);
                                  qBought.find('label').text(data[j].question);
                                  qsBought.append(qBought.html());
                              }
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
      if ($('.seenQs').length/2 > $('.seenQs:checked').length + newQs.length)
      {
          return 0; // not enough questions
      }
      web3.eth.getAccounts(function (error, accounts) {
          if (error) {
              console.log(error);
          }
          var account = accounts[0];
          App.contracts.QuestionPurchase.deployed().then(function (instance) {
              paymentInstance = instance;

              return paymentInstance.reviewQuestions(checked, { from: account });
          }).then(function (result) {
              return App.markBought();
          }).catch(function (err) {
              console.log(err.message);
          });
      });

  },

  handleAddQuestion: function (event) {
    event.preventDefault();
    var qRow = $('#qRow');
    var qTemplate = $('#qTemplate');
    qTemplate.find('.panel-title').text($('#acompany')[0].value);
    qTemplate.find('.q-rating').text("4.0");
    qTemplate.find('.q-date').text($('#adate')[0].value);
    qTemplate.find('.qspan').css('display', 'block');
    qTemplate.find('.q-question').text($('#aquestion')[0].value);
    qRow.append(qTemplate.html());
  },
  handlePurchase: function(event) {
    event.preventDefault();
    questionId = parseInt($(event.target).data('id'));
    if ($(event.target.parentElement).find('.date-interviewspan').css('display') == 'none') {
        $(event.target.parentElement).find('.date-interviewspan').css('display', 'block');
        return;
    }
    var paymentInstance;
    
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            console.log(error);
        }
        var account = accounts[0];
        App.contracts.QuestionPurchase.deployed().then(function (instance) {
            paymentInstance = instance;

            // Execute adopt as a transaction by sending account
            qDate = parseInt(new Date($(event.target.parentElement).find('.date-interview')[0].value).getTime() / 1000);
            return paymentInstance.purchase(questionId, qDate, { from: account });
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
