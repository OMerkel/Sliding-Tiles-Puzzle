//
// Copyright (c) 2014 Oliver Merkel
// All rights reserved.
//
// @author Oliver Merkel, <Merkel(dot)Oliver(at)web(dot)de>
//

var hmi;

function Hmi() {}

Hmi.SVGNAME = 'board';

Hmi.prototype.init = function() {
  $( document ).on( 'pagecontainershow',function(event, ui){
    if( 'game-page' == ui.toPage[0].id ) {
      hmi.reinit();
    }
  });
  this.element = this.getElements();
  this.newGame();
  this.enableControl();
  $('#new').click( this.newGame.bind(this) );
  var $window = $(window);
  $window.resize( this.resize.bind(this) );
  $window.resize();
}

Hmi.prototype.reinit = function() {
  this.element = this.getElements();
  this.setupGame();
  this.enableControl();
}


Hmi.prototype.newGame = function() {
  this.puzzle = new Sliding();
  this.setupGame();
}

Hmi.prototype.setupGame = function() {
  var state = this.puzzle.getState();
  for( var n=1; n<=Sliding.TILEAMOUNT; ++n ){
    this.element[n].setAttribute('x', state[n].x + 1);
    this.element[n].setAttribute('y', state[n].y + 1);
  }
}

Hmi.prototype.getSvgDocument = function() {
  var result = null;
  var svgEmbed = document.embeds[Hmi.SVGNAME];
  if (typeof svgEmbed != 'undefined') {
    if (typeof svgEmbed.getSVGDocument != 'undefined') {
      result = svgEmbed.getSVGDocument();
    }
  }
  return result;
};

Hmi.prototype.getElements = function() {
  var result = {}
  var svgDocument = this.getSvgDocument();
  for( var n=1; n<=Sliding.TILEAMOUNT; ++n ){
    result[n] = svgDocument.getElementById('tile-' +
      ((n-1) < 10 ? '0' + (n-1) : '' + (n-1)) );
  }
  return result;
};

Hmi.prototype.enableControl = function() {
  for( var n=1; n<=Sliding.TILEAMOUNT; ++n ) {
    this.element[n].onclick = this.clack.bind(this);
    this.element[n].ontouchstart = this.clack.bind(this);
  }
}

Hmi.prototype.animate = function() {
  var objects = this.animation.objects;
  for(var i=0; i<objects.length; ++i) {
    var object = this.element[objects[i]];
    var val = Number(object.getAttribute(this.animation.attribute));
    if (!('target' in this.animation)) {
      this.animation['target'] = Math.round(val + this.animation.amount);
    }
    object.setAttribute(this.animation.attribute, this.animation.amount>0 ?
      val + this.animation.delta : this.animation.target);
  }
  this.animation.amount -= Math.abs(this.animation.delta);
  if ( this.animation.amount>0 ) {
    setTimeout( this.animate.bind(this), this.animation.delay );
  }
  else {
    this.animation = null;
  }
}

Hmi.prototype.clack = function( e ) {
  var state = this.puzzle.getState();
  var gap = this.puzzle.getGap();
  var elementIndex = Number(e.target.id.slice(-2))+1;
  var element = this.element[elementIndex]
  if (null == this.animation &&
    ( gap.x == state[elementIndex].x ||
    gap.y == state[elementIndex].y ) ) {
    var move = this.puzzle.move(elementIndex);
    var attribute = Math.round(element.getAttribute('x')-1) == gap.x ?
      'y' : 'x';
    var direction = 'x' == attribute ? (
      Math.round(element.getAttribute('x')-1) < gap.x ? 1 : -1 ) : (
      Math.round(element.getAttribute('y')-1) < gap.y ? 1 : -1 );
    this.animation = {
      objects : move,
      attribute : attribute,
      amount : 1,
      delta : direction * 0.04,
      delay : 12,
    };
    this.animate();
  }
};

Hmi.prototype.resize = function() {
  var $window = $(window);
  var panelWidth = $window.innerWidth();
  var panelHeight = $window.innerHeight();
  var smallerValue = panelWidth < panelHeight ? panelWidth : panelHeight - 32;
  var svgEmbed = document.embeds[Hmi.SVGNAME];
  svgEmbed.height = (smallerValue * 0.9);
  svgEmbed.width = (smallerValue * 0.9);
};

function svgWait() {
  var svgEmbed = document.embeds[Hmi.SVGNAME];
  if (typeof svgEmbed != 'undefined') {
    if (typeof svgEmbed.getSVGDocument != 'undefined') {
      var svgDocument = svgEmbed.getSVGDocument();
      if (null != svgDocument) {
        hmi = new Hmi();
        hmi.init();
      }
      else {
        setTimeout( svgWait,5 );
      }
    }
  }
}

$( svgWait );
