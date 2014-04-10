'use strict';
describe('Superheroic Tally Counting', function(){
  var page = $(
  );
  beforeEach(function(){
    module('app', 'index.html');
    inject(function($compile, $rootScope, $templateCache){
      page = $compile(
        $templateCache.get('index.html')
      )($rootScope);
      $rootScope.$digest();
    });
  });
  describe('FEATURE: a tally count display', function(){
    it('SCENARIO: initially zero', function(){
      expect(page.find('.count').text()).toBe('0');
    });
    it('SCENARiO: after two tally clicks', function(){
      page.find('.tally').click();
      page.find('.tally').click();
      expect(page.find('.count').text()).toBe('2');
    });
    it('SCENARIO: after a tally click and then a reset click', function(){
      page.find('.tally').click();
      page.find('.reset').click();
      expect(page.find('.count').text()).toBe('0');
    });
  });
});
