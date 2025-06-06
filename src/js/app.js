App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("EHR.json", function(EHR) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.EHR = TruffleContract(EHR);
      // Connect provider to interact with contract
      App.contracts.EHR.setProvider(App.web3Provider);

      return App.render();
    });
  },

  render: function() {
    var EHRInstance;
    var loader = $("#loader");
    var content = $("#content");
  
    loader.show();
    content.hide();
  
    // Load account data
    web3.eth.getAccounts(function(err, accounts) {
      if (err === null) {
        App.account = accounts[0]; //switch accounts here
        $("#accountAddress").html("Your Account: " + App.account);
      }
    });
  
    // Load contract data
    App.contracts.EHR.deployed().then(function(instance) {
      EHRInstance = instance;
      return true;
    });
  },
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});