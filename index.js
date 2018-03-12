/**
 * Wews - The friendly news aggregator
 * 
 * @author denim2x <cristian.tudorache91@hotmail.com>
 * @license MIT
 **/
 
/* global $ _ */
'use strict';

let Client = {
  width: 'clientWidth',
  height: 'clientHeight'
};
let Offset = {
  width: 'offsetWidth',
  height: 'offsetHeight'
};
let Scrollbar = /^scrollbar-([xy])$/;
let Border = /^border$/;
let CSSProp = /^#((?:--)?[a-z][a-zA-Z-]*)$/;


$.fn.extend({ 
  _width: $.fn.width,
  _height: $.fn.height,
  _offset: $.fn.offset,
  _css: $.fn.css
});
$.fn.extend({
  client(key) {
    return this.prop(Client[key]);
  },
  offset(key, ...rest) {
    if (arguments.length < 1) {
      return this._offset();
    }
    let prop = Offset[key];
    if (prop != null) {
      return this.prop(prop);
    }
    return this._offset(key, ...rest);
  },
  width(value) {
    if (arguments.length < 1) {
      return this._width();
    }
    if (Border.test(value)) {
      return this.css('#border-left-width') + this.css('#border-right-width');
    }
    let m = Scrollbar.exec(value);
    if (m != null) {
      switch (m[1]) {
        case 'x':
          return;
        case 'y':
          return this.offset('width') - this.width('border') - this.client('width');
      }
    }
    return this._width(value);
  },
  css(key, ...rest) {
    if (this.none()) {
      return;
    }
    if (arguments.length < 1) {
      return getComputedStyle(this[0]);
    }
    
    let m = CSSProp.exec(key);
    if (m != null) {
      return parseFloat(this._css(m[1]));
    }
    
    let [fn, ...args] = rest;
    if (_.isFunction(fn)) {
      let val = fn.call(this, parseFloat(this._css(key)), this, ...args);
      if (_.isFinite(val) || _.isString(val)) {
        this._css(key, val);
      }
      return this;
    }

    return this._css(key, ...rest);
  },
  none() {
    return this.length == 0;
  }
});

$('#config [name="close"]').click(({ }) => {
  $('body').removeClass('config');
})
  
$('header').css('--offset', $('#listing').width('scrollbar-y'));

$('header [name="config"]').click(({ }) => {
  $('body').addClass('config');
});

let theme = $('#main').css('#--theme-cycle');
$('header [name="theme"]').click(({ }) => {
  $('#main').toggleClass('theme');
  $('#main').css('--theme-cycle', `${ ++theme }`);
});

  
$('#listing section').click(({ }) => {
  $('#main').addClass('article').addClass('article-visible');
  $('header').css('--offset', $('article').width('scrollbar-y'));
});

$('article [name="close"]').click(({ }) => {
  $('header').css('--offset', $('#listing').width('scrollbar-y'));
  // TODO: Use transition duration from CSS
  $('article').one('transitionend', ({ }) => {
    let self = $('article');          //let c=0;
    let timer = setInterval(() => {
      if (self.css('opacity') == 0) {
        $('#main').removeClass('article');
        clearInterval(timer);         //console.log(c);
      }                               //else c++;
    }, 230);
  });
  $('#main').removeClass('article-visible');
});
