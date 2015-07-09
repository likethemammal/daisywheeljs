module.exports = {
    init: function() {
        //Taken from https://gist.github.com/eirikbacker/2864711 on 12/23/14
        //addEventListener polyfill 1.0 / Eirik Backer / MIT Licence
        (function(win, doc){
            if(win.addEventListener)return;		//No need to polyfill

            function docHijack(p){var old = doc[p];doc[p] = function(v){return addListen(old(v))}}
            function addEvent(on, fn, self){
                return (self = this).attachEvent('on' + on, function(e){
                    var e = e || win.event;
                    e.preventDefault  = e.preventDefault  || function(){e.returnValue = false}
                    e.stopPropagation = e.stopPropagation || function(){e.cancelBubble = true}
                    fn.call(self, e);
                });
            }
            function addListen(obj, i){
                if(i = obj.length)while(i--)obj[i].addEventListener = addEvent;
                else obj.addEventListener = addEvent;
                return obj;
            }

            addListen([doc, win]);
            if('Element' in win)win.Element.prototype.addEventListener = addEvent;			//IE8
            else{		//IE < 8
                doc.attachEvent('onreadystatechange', function(){addListen(doc.all)});		//Make sure we also init at domReady
                docHijack('getElementsByTagName');
                docHijack('getElementById');
                docHijack('createElement');
                addListen(doc.all);
            }
        })(window, document);

        //Taken from https://github.com/remy/polyfills/blob/master/classList.js on 12/23/14
        //Classlist Polyfill
        (function () {

            if (typeof window.Element === "undefined" || "classList" in document.documentElement) return;

            var prototype = Array.prototype,
                push = prototype.push,
                splice = prototype.splice,
                join = prototype.join;

            function DOMTokenList(el) {
                this.el = el;
                // The className needs to be trimmed and split on whitespace
                // to retrieve a list of classes.
                var classes = el.className.replace(/^\s+|\s+$/g,'').split(/\s+/);
                for (var i = 0; i < classes.length; i++) {
                    push.call(this, classes[i]);
                }
            };

            DOMTokenList.prototype = {
                add: function(token) {
                    if(this.contains(token)) return;
                    push.call(this, token);
                    this.el.className = this.toString();
                },
                contains: function(token) {
                    return this.el.className.indexOf(token) != -1;
                },
                item: function(index) {
                    return this[index] || null;
                },
                remove: function(token) {
                    if (!this.contains(token)) return;
                    for (var i = 0; i < this.length; i++) {
                        if (this[i] == token) break;
                    }
                    splice.call(this, i, 1);
                    this.el.className = this.toString();
                },
                toString: function() {
                    return join.call(this, ' ');
                },
                toggle: function(token) {
                    if (!this.contains(token)) {
                        this.add(token);
                    } else {
                        this.remove(token);
                    }

                    return this.contains(token);
                }
            };

            window.DOMTokenList = DOMTokenList;

            function defineElementGetter (obj, prop, getter) {
                if (Object.defineProperty) {
                    Object.defineProperty(obj, prop,{
                        get : getter
                    });
                } else {
                    obj.__defineGetter__(prop, getter);
                }
            }

            defineElementGetter(Element.prototype, 'classList', function () {
                return new DOMTokenList(this);
            });

        })();
    }
};