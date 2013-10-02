var tests = Object.keys(window.__karma__.files).filter(function (file) {
  return (/.spec\.js$/).test(file);
});

require(['chai', 'chaiChanges', 'chaiJQuery', 'chaiBackbone', 'sinon', 'backbone'].concat(tests),
  function(chai, chaiChanges, chaiJQuery, chaiBackbone, sinon, Backbone) {
  // Configure chai to use the extra modules

  chai.use(chaiChanges);
  chai.use(chaiJQuery);
  chai.use(chaiBackbone);
  
  var should = chai.should(),
    expect = chai.expect;
  
  global.Backbone = Backbone;
  global.expect = chai.expect;
  global.sinon = sinon;
  
  // Run the tests
  window.__karma__.start();
});