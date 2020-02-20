//此框架借鉴了《javascript设计模式》张容铭著一书中的A框架，
//以A框架为基础上增强了选择器功能，添加了组合选择器，后代选择器，上下文可为dom数组特性
//修复了原来根据类名获取元素不正确的问题
//添加了each方法
~(function (window) {
    var P = function (selector, context) {
        if (typeof selector == 'function') {
            P(window).on('load', selector);
        } else {
            return new P.fn.init(selector, context);
        }
    }
    var _each = function (arr, fn) {
        for (var i = 0; i < arr.length; i ++) {
            if (fn.call(arr[i], i, arr[i]) === false) break;
        }
    }
    P.fn = P.prototype = {
        constructor: P,
        init: function (selector, context) {
            if (typeof selector === 'undefined') {
                this.length = 0;
                this.selector = [];
                this.context = [];
                return this;
            }
            var that = this;
            if (typeof selector === 'object') {
                this[0] = selector;
                this.length = 1;
                return this;
            }
            this.length = 0;
            selector = P.trim(selector);
            context = context || document;
            if (typeof context == 'string') {
                context = new P.fn.init(context);
            }
            if (context.nodeType) {
                context = [context];
            }
            var result = new P.fn.init();
            var sltarr = selector.split(',');
            var sltspace = selector.split(' ');
            if (sltarr.length !== 1) {
                _each(sltarr, function (index, slt) {
                    var j = result.length, i = 0;
                    var p = new P.fn.init(slt);
                    while (result[j ++] = p[i ++]) {}
                    result.length = j - 1;
                    (!result.selector instanceof Array) && (result.selector = [result.selector])
                    (!result.context instanceof Array) && (result.context = [result.context])
                    result.selector.push(p.selector);
                    result.context.push(p.context);
                })
                return result;
            } else if (sltarr.length === 1 && sltspace.length !== 1 ) {
                var c = context;
                var j = result.length, i = 0;
                _each(sltspace, function (index, slt) {
                    if (slt !== '') c = new P.fn.init(slt, c);
                    (!result.selector instanceof Array) && (result.selector = [result.selector]);
                    (!result.context instanceof Array) && (result.context = [result.context]);
                    result.selector.push(c.selector);
                    result.context.push(c.context);
                })
                while (result[j ++] = c[i ++]) {}
                result.length = j - 1;
                return result;
            }
            _each(context, function (index, ct) {
                if (~selector.indexOf('#')) {
                    that[0] = document.getElementById(selector.slice(1));
                    that.length = 1;
                } else if (~selector.indexOf('.')) {
                    var doms = [], className = selector.slice(1);
                    if (ct.getElementsByClassName) {
                        doms = ct.getElementsByClassName(className);
                    } else {
                        doms = ct.getElementsByTagName('*');
                    }
                    for (var i = 0, len = doms.length; i < len; i ++) {
                        if (doms[i].className && !!~(' ' + doms[i].className + ' ').indexOf(' ' + className + ' ')) {
                            that[that.length] = doms[i];
                            that.length ++;
                        }
                    }
                } else {
                    var doms = ct.getElementsByTagName(selector),
                    i = 0, len = doms.length;
                    for (; i < len; i ++) {
                        that[i] = doms[i];
                    }
                    that.length = len;
                }
            }) 
            this.context = context;
            this.selector = selector;
            return this;
        },
        length: 0,
        size: function () {
            return this.length;
        }
    }

    P.fn.init.prototype = P.fn;
    
    P.extend = P.fn.extend = function () {
        var i = 1, j, len = arguments.length, target = arguments[0];
        if (i === len) {
            target = this;
            i --;
        }
        for (j in arguments[i]) {
            target[j] = arguments[i][j];
        }
        return target;
    }

    P.extend({
        camelCase: function (str) {
            return str.replace(/\-(\w)/g, function (all, letter) {
                return letter.toUpperCase;
            })
        },
        trim: function (str) {
            return str.replace(/^\s+|s+$/g, '');
        },
    })
    var _on = (function () {
        if (document.addEventListener) {
            return function (dom, type, fn, data) {
                dom.addEventListener(type, function(e){
                    fn.call(dom, e, data);
                }, false)
            }
        } else if (document.attachEvent) {
            return function (dom, type, fn, data) {
                dom.attachEvent('on' + type, function (e) {
                    fn.call(dom, e, data);
                })
            }
        } else {
            return function(dom, type, fn, data) {
                dom['on' + type] = function(e) {
                    fn.call(dom, e, data);
                }
            }
        }
    })();
    P.fn.extend({
        each: function (fn) {
            _each(this, fn);
        },
        on: function (type, fn, data) {
            for (var i = this.length; i >= 0; i --) {
                _on(this[i], type, fn, data);
            }
            return this;
        },
        css: function () {
            var arg = arguments, len = arg.length;
            if (this.length < 1) {
                return this;
            }
            if (len === 1) {
                if (typeof arg[0] === 'string') {
                    if (this[0].currentStyle) {
                        return this[0].currentStyle[name];
                    } else {
                        return getComputedStyle(this[0], false)[name];
                    }
                } else if (typeof arg[0] === 'object') {
                    for (var i in arg[0]) {
                        for (var j = this.length - 1; j >= 0; j --) {
                            this[j].style[P.camelCase(i)] = arg[0][i];
                        }
                    }
                }
            } else if (len === 2) {
                for (var j = this.length - 1; j >= 0; j --) {
                    this[j].style[P.camelCase(arg[0])] = arg[1];
                }
            }
            return this;
        },
        attr: function () {
            var arg = arguments, len = arg.length;
            if (this.length < 1) {
                return this;
            }
            if (len === 1) {
                if (typeof arg[0] === 'string') {
                    return this[0].getAttribute(arg[0]);
                } else if (typeof arg[0] === 'object') {
                    for (var i in arg[0]) {
                        for (var j = this.length - 1; j >= 0; j --) {
                            this[j].setAttribute(i, arg[0][i]);
                        }
                    }
                }
            } else if (len === 2) {
                for (var j = this.length; j >= 0; j --) {
                    this[j].setAttribute(arg[0], arg[1]);
                }
            }
            return this;
        },
        html: function () {
            var arg = arguments, len = arg.length;
            if (len === 0) {
                return this[0] && this[0].innerHTML;
            } else {
                for (var i = this.length - 1; i >= 0; i --) {
                    this[i].innerHTML = arg[0];
                }
            }
            return this;
        },
        hasClass: function (val) {
            if (!this[0]) {
                return;
            }
            var value = P.trim(val);
            return this[0].className && !!~(' ' + doms[i].className + ' ').indexOf(' ' + className + ' ');
        },
        addClass: function (val) {
            var value = P.trim(val), str = '';
            for (var i = this.length; i >= 0; i --) {
                str = this[i].className;
                if (!~(' ' + str.className + ' ').indexOf(' ' + value + ' ')) {
                    this[i].className += ' ' + value;
                }
            }
            return this;
        },
        appendTo: function (parent) {
            if (doms.length) {
                for (var i = this.length - 1; i >= 0; j --) {
                    doms[0].appendChild(this[j]);
                }
            }
        },
        append: function (child) {
            this[0].appendChild(child);
        }
    })
    P.noConflict = function (library) {
        if (library) {
            window.$ = library;
        } else {
            window.$ = null;
            delete window.$;
        }
        return P;
    }
    window.$ = window.P = P;
})(window)