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
let Local = {
  name: 'localName'
};

$.extend({
  _find: $.find
});
$.extend({
  find(sel, ctx, res, seed) {
    if (sel == null) {
      return $(document.activeElement);
    }
    return $._find(...arguments);
  }
});

$.fn.extend({ 
  _width: $.fn.width,
  _height: $.fn.height,
  _offset: $.fn.offset,
  _css: $.fn.css,
  _toggleClass: $.fn.toggleClass
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
  },
  toggleClass(value, cb=_.noop) {
    if (this.hasClass(value)) {
      this.removeClass(value);
      cb.call(this, false);
    } else {
      this.addClass(value);
      cb.call(this, true);
    }
    return this;
  },
  local(key) {
    return this.prop(Local[key] || key);
  },
  type() {
    return this.attr('type');
  },
  name() {
    return this.attr('name');
  },
  has(spec) {
    return Object.entries(spec).every(([k, v]) => this[k]() == v);
  }
});

$('.Root').on('keydown.search', ({ ctrlKey: c, altKey: a, shiftKey: s, which }) => {
  if ((which > 64 && which < 91 || which == 32) && !c && !a) {
    $('.Header-search').focus();
  }
});
  
$('.Header-logo').click(({ }) => {
  $('.Root').toggleClass('is-configOpen', (on) => {
    $('.Header-logo').attr('title', `${ on ? 'Close' : 'Open' } settings`);
  });
});

$('.Header-search')
  .on('focus', ({ }) => {
    $('.Header').addClass('is-focused');
  })
  .on('blur', ({ }) => {
    $('.Header').removeClass('is-focused');
  })
  .on('keydown', ({ ctrlKey: c, altKey: a, shiftKey: s, which }) => {
    if (which == 27) {     // Esc
      $('.Header-search').blur();
      return false;
    }
  });

let theme = $('.Root').css('#--themeCycle');
$('.Header-themes').click(({ }) => {
  $('.Root').toggleClass('is-dark').css('--themeCycle', `${ ++theme }`);
});

$('.Catalog-root section').click(({ }) => {
  $('.Article').addClass('is-enabled').addClass('is-visible');
});

$('.Article-close').click(({ }) => {
  // TODO: Use transition duration from CSS
  $('.Article').one('transitionend', ({ }) => {
    let self = $('.Article');          //let c=0;
    let timer = setInterval(() => {
      if (self.css('opacity') == 0) {
        self.removeClass('is-enabled');
        clearInterval(timer);         //console.log(c);
      }                               //else c++;
    }, 230);
  }).removeClass('is-visible');
});
