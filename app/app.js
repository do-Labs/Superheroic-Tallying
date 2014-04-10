'use strict';
angular.module('app', [])

.controller('AppVM', function(){
  this.count = 0;

  this.tally = function(){
    this.count += 1;
  };

  this.reset = function(){
    this.count = 0;
  };
});
