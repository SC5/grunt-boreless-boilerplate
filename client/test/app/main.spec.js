define(['chai', 'jquery'],
  function(chai, $) {

  describe('Rendering', function() {
    // TODO Check app bootstrapping
    it('renders', function() {
      $('#status').should.exist;
    });
  });
});