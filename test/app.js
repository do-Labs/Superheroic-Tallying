'use strict';
describe('AppVM', function(){
  var vm = {};
  beforeEach(function(){
    module('app');
    inject(function($controller){
      vm = $controller('AppVM');
    });
  });
  it('should expose an initially zero count', function(){
    expect(vm.count).toBe(0);
  });
  describe('tally()', function(){
    it('should set count to 1, on one click', function(){
      vm.tally();
      expect(vm.count).toBe(1);
    });
    it('should set count to 2, on two clicks', function(){
      vm.tally();
      vm.tally();
      expect(vm.count).toBe(2);
    });
  });
  describe('reset()', function(){
    it('should set count to 0', function(){
      vm.count = +Infinity;
      vm.reset();
      expect(vm.count).toBe(0);
    });
  });
});
