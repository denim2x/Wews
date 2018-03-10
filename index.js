/**
 * Wews - The friendly news aggregator
 * 
 * @author denim2x <cristian.tudorache91@hotmail.com>
 * @license MIT
 **/
 
/* global $ */
'use strict';

let Animate = new WeakMap;
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
let CSSProp = /^#([a-z][a-zA-Z-]*)$/;


$.fn.extend({ 
  _animate: $.fn.animate,
  _width: $.fn.width,
  _height: $.fn.height,
  _offset: $.fn.offset,
  _css: $.fn.css
});
$.fn.extend({
  animate(id, frames, init) {
    return this.each((i, self) => {
      if (!Animate.has(self)) {
        Animate.set(self, new Map);
      }
      //let anim = new Animation(new KeyframeEffect(self, frames, init));
      let anim = self.animate(frames, init);
      anim.cancel();
      anim.anchor = 0;
      anim.swing = false;
      Animate.get(self).set(id, anim);
    });
  },
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

    return this._css(key, ...rest);
  },
  none() {
    return this.length == 0;
  }
});

for (let key of ['play', 'reverse', 'swing']) {
  $.fn.extend({ 
    [key](id, cb) {
      return this.each((i, self) => {
        let map = Animate.get(self);
        if (map != null) {
          let anim = map.get(id);
          if (anim != null) {
            if ($.isFunction(cb)) {
              anim.onfinish = () => {
                if (cb.call(self, anim) === false) {
                  anim.cancel();
                }
              };
            } else {
              anim.onfinish = null;
            }

            switch (key) {
              case 'swing':
                key = anim.swing ? 'reverse' : 'play';
                anim.anchor = 1 - anim.anchor;
                anim.swing = true;
                break;
              case 'play':
                key = anim.anchor == 0 ? 'play' : 'reverse';
                anim.anchor = 0;
                anim.swing = false;
                break;
              case 'reverse':
                key = anim.anchor == 0 ? 'reverse' : 'play';
                anim.anchor = 1;
                anim.swing = false;
                break;
            }
            anim[key]();
          }
        }
      });
    }
  });
}
  
$('header').css('--offset', $('#listing').width('scrollbar-y'));
$('header [name="theme"]').click(({ }) => {
  $('body').toggleClass('theme');
});
  
$('#listing section').click(({ }) => {
  $('body').addClass('article');
  $('header').css('--offset', $('article').width('scrollbar-y'));
  $('article').play('fade');
});

$('article').animate('fade', { opacity: [0, 1] }, 
  { duration: 300, easing: 'ease-out', fill: 'forwards' });
$('article .close').click(({ }) => {
  $('header').css('--offset', $('#listing').width('scrollbar-y'));
  $('article').reverse('fade', () => {
    $('body').removeClass('article');
  });
});
