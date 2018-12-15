/*
Unobtrusive JavaScript
https://github.com/rails/rails/blob/master/actionview/app/assets/javascripts
Released under the MIT license
 */


(function() {
  var context = this;

  (function() {
    (function() {
      this.Rails = {
        linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]',
        buttonClickSelector: {
          selector: 'button[data-remote]:not([form]), button[data-confirm]:not([form])',
          exclude: 'form button'
        },
        inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',
        formSubmitSelector: 'form',
        formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])',
        formDisableSelector: 'input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled',
        formEnableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled',
        fileInputSelector: 'input[name][type=file]:not([disabled])',
        linkDisableSelector: 'a[data-disable-with], a[data-disable]',
        buttonDisableSelector: 'button[data-remote][data-disable-with], button[data-remote][data-disable]'
      };

    }).call(this);
  }).call(context);

  var Rails = context.Rails;

  (function() {
    (function() {
      var cspNonce;

      cspNonce = Rails.cspNonce = function() {
        var meta;
        meta = document.querySelector('meta[name=csp-nonce]');
        return meta && meta.content;
      };

    }).call(this);
    (function() {
      var expando, m;

      m = Element.prototype.matches || Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector;

      Rails.matches = function(element, selector) {
        if (selector.exclude != null) {
          return m.call(element, selector.selector) && !m.call(element, selector.exclude);
        } else {
          return m.call(element, selector);
        }
      };

      expando = '_ujsData';

      Rails.getData = function(element, key) {
        var ref;
        return (ref = element[expando]) != null ? ref[key] : void 0;
      };

      Rails.setData = function(element, key, value) {
        if (element[expando] == null) {
          element[expando] = {};
        }
        return element[expando][key] = value;
      };

      Rails.$ = function(selector) {
        return Array.prototype.slice.call(document.querySelectorAll(selector));
      };

    }).call(this);
    (function() {
      var $, csrfParam, csrfToken;

      $ = Rails.$;

      csrfToken = Rails.csrfToken = function() {
        var meta;
        meta = document.querySelector('meta[name=csrf-token]');
        return meta && meta.content;
      };

      csrfParam = Rails.csrfParam = function() {
        var meta;
        meta = document.querySelector('meta[name=csrf-param]');
        return meta && meta.content;
      };

      Rails.CSRFProtection = function(xhr) {
        var token;
        token = csrfToken();
        if (token != null) {
          return xhr.setRequestHeader('X-CSRF-Token', token);
        }
      };

      Rails.refreshCSRFTokens = function() {
        var param, token;
        token = csrfToken();
        param = csrfParam();
        if ((token != null) && (param != null)) {
          return $('form input[name="' + param + '"]').forEach(function(input) {
            return input.value = token;
          });
        }
      };

    }).call(this);
    (function() {
      var CustomEvent, fire, matches, preventDefault;

      matches = Rails.matches;

      CustomEvent = window.CustomEvent;

      if (typeof CustomEvent !== 'function') {
        CustomEvent = function(event, params) {
          var evt;
          evt = document.createEvent('CustomEvent');
          evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
          return evt;
        };
        CustomEvent.prototype = window.Event.prototype;
        preventDefault = CustomEvent.prototype.preventDefault;
        CustomEvent.prototype.preventDefault = function() {
          var result;
          result = preventDefault.call(this);
          if (this.cancelable && !this.defaultPrevented) {
            Object.defineProperty(this, 'defaultPrevented', {
              get: function() {
                return true;
              }
            });
          }
          return result;
        };
      }

      fire = Rails.fire = function(obj, name, data) {
        var event;
        event = new CustomEvent(name, {
          bubbles: true,
          cancelable: true,
          detail: data
        });
        obj.dispatchEvent(event);
        return !event.defaultPrevented;
      };

      Rails.stopEverything = function(e) {
        fire(e.target, 'ujs:everythingStopped');
        e.preventDefault();
        e.stopPropagation();
        return e.stopImmediatePropagation();
      };

      Rails.delegate = function(element, selector, eventType, handler) {
        return element.addEventListener(eventType, function(e) {
          var target;
          target = e.target;
          while (!(!(target instanceof Element) || matches(target, selector))) {
            target = target.parentNode;
          }
          if (target instanceof Element && handler.call(target, e) === false) {
            e.preventDefault();
            return e.stopPropagation();
          }
        });
      };

    }).call(this);
    (function() {
      var AcceptHeaders, CSRFProtection, createXHR, cspNonce, fire, prepareOptions, processResponse;

      cspNonce = Rails.cspNonce, CSRFProtection = Rails.CSRFProtection, fire = Rails.fire;

      AcceptHeaders = {
        '*': '*/*',
        text: 'text/plain',
        html: 'text/html',
        xml: 'application/xml, text/xml',
        json: 'application/json, text/javascript',
        script: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript'
      };

      Rails.ajax = function(options) {
        var xhr;
        options = prepareOptions(options);
        xhr = createXHR(options, function() {
          var ref, response;
          response = processResponse((ref = xhr.response) != null ? ref : xhr.responseText, xhr.getResponseHeader('Content-Type'));
          if (Math.floor(xhr.status / 100) === 2) {
            if (typeof options.success === "function") {
              options.success(response, xhr.statusText, xhr);
            }
          } else {
            if (typeof options.error === "function") {
              options.error(response, xhr.statusText, xhr);
            }
          }
          return typeof options.complete === "function" ? options.complete(xhr, xhr.statusText) : void 0;
        });
        if ((options.beforeSend != null) && !options.beforeSend(xhr, options)) {
          return false;
        }
        if (xhr.readyState === XMLHttpRequest.OPENED) {
          return xhr.send(options.data);
        }
      };

      prepareOptions = function(options) {
        options.url = options.url || location.href;
        options.type = options.type.toUpperCase();
        if (options.type === 'GET' && options.data) {
          if (options.url.indexOf('?') < 0) {
            options.url += '?' + options.data;
          } else {
            options.url += '&' + options.data;
          }
        }
        if (AcceptHeaders[options.dataType] == null) {
          options.dataType = '*';
        }
        options.accept = AcceptHeaders[options.dataType];
        if (options.dataType !== '*') {
          options.accept += ', */*; q=0.01';
        }
        return options;
      };

      createXHR = function(options, done) {
        var xhr;
        xhr = new XMLHttpRequest();
        xhr.open(options.type, options.url, true);
        xhr.setRequestHeader('Accept', options.accept);
        if (typeof options.data === 'string') {
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        }
        if (!options.crossDomain) {
          xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        }
        CSRFProtection(xhr);
        xhr.withCredentials = !!options.withCredentials;
        xhr.onreadystatechange = function() {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            return done(xhr);
          }
        };
        return xhr;
      };

      processResponse = function(response, type) {
        var parser, script;
        if (typeof response === 'string' && typeof type === 'string') {
          if (type.match(/\bjson\b/)) {
            try {
              response = JSON.parse(response);
            } catch (error) {}
          } else if (type.match(/\b(?:java|ecma)script\b/)) {
            script = document.createElement('script');
            script.setAttribute('nonce', cspNonce());
            script.text = response;
            document.head.appendChild(script).parentNode.removeChild(script);
          } else if (type.match(/\b(xml|html|svg)\b/)) {
            parser = new DOMParser();
            type = type.replace(/;.+/, '');
            try {
              response = parser.parseFromString(response, type);
            } catch (error) {}
          }
        }
        return response;
      };

      Rails.href = function(element) {
        return element.href;
      };

      Rails.isCrossDomain = function(url) {
        var e, originAnchor, urlAnchor;
        originAnchor = document.createElement('a');
        originAnchor.href = location.href;
        urlAnchor = document.createElement('a');
        try {
          urlAnchor.href = url;
          return !(((!urlAnchor.protocol || urlAnchor.protocol === ':') && !urlAnchor.host) || (originAnchor.protocol + '//' + originAnchor.host === urlAnchor.protocol + '//' + urlAnchor.host));
        } catch (error) {
          e = error;
          return true;
        }
      };

    }).call(this);
    (function() {
      var matches, toArray;

      matches = Rails.matches;

      toArray = function(e) {
        return Array.prototype.slice.call(e);
      };

      Rails.serializeElement = function(element, additionalParam) {
        var inputs, params;
        inputs = [element];
        if (matches(element, 'form')) {
          inputs = toArray(element.elements);
        }
        params = [];
        inputs.forEach(function(input) {
          if (!input.name || input.disabled) {
            return;
          }
          if (matches(input, 'select')) {
            return toArray(input.options).forEach(function(option) {
              if (option.selected) {
                return params.push({
                  name: input.name,
                  value: option.value
                });
              }
            });
          } else if (input.checked || ['radio', 'checkbox', 'submit'].indexOf(input.type) === -1) {
            return params.push({
              name: input.name,
              value: input.value
            });
          }
        });
        if (additionalParam) {
          params.push(additionalParam);
        }
        return params.map(function(param) {
          if (param.name != null) {
            return (encodeURIComponent(param.name)) + "=" + (encodeURIComponent(param.value));
          } else {
            return param;
          }
        }).join('&');
      };

      Rails.formElements = function(form, selector) {
        if (matches(form, 'form')) {
          return toArray(form.elements).filter(function(el) {
            return matches(el, selector);
          });
        } else {
          return toArray(form.querySelectorAll(selector));
        }
      };

    }).call(this);
    (function() {
      var allowAction, fire, stopEverything;

      fire = Rails.fire, stopEverything = Rails.stopEverything;

      Rails.handleConfirm = function(e) {
        if (!allowAction(this)) {
          return stopEverything(e);
        }
      };

      allowAction = function(element) {
        var answer, callback, message;
        message = element.getAttribute('data-confirm');
        if (!message) {
          return true;
        }
        answer = false;
        if (fire(element, 'confirm')) {
          try {
            answer = confirm(message);
          } catch (error) {}
          callback = fire(element, 'confirm:complete', [answer]);
        }
        return answer && callback;
      };

    }).call(this);
    (function() {
      var disableFormElement, disableFormElements, disableLinkElement, enableFormElement, enableFormElements, enableLinkElement, formElements, getData, matches, setData, stopEverything;

      matches = Rails.matches, getData = Rails.getData, setData = Rails.setData, stopEverything = Rails.stopEverything, formElements = Rails.formElements;

      Rails.handleDisabledElement = function(e) {
        var element;
        element = this;
        if (element.disabled) {
          return stopEverything(e);
        }
      };

      Rails.enableElement = function(e) {
        var element;
        element = e instanceof Event ? e.target : e;
        if (matches(element, Rails.linkDisableSelector)) {
          return enableLinkElement(element);
        } else if (matches(element, Rails.buttonDisableSelector) || matches(element, Rails.formEnableSelector)) {
          return enableFormElement(element);
        } else if (matches(element, Rails.formSubmitSelector)) {
          return enableFormElements(element);
        }
      };

      Rails.disableElement = function(e) {
        var element;
        element = e instanceof Event ? e.target : e;
        if (matches(element, Rails.linkDisableSelector)) {
          return disableLinkElement(element);
        } else if (matches(element, Rails.buttonDisableSelector) || matches(element, Rails.formDisableSelector)) {
          return disableFormElement(element);
        } else if (matches(element, Rails.formSubmitSelector)) {
          return disableFormElements(element);
        }
      };

      disableLinkElement = function(element) {
        var replacement;
        replacement = element.getAttribute('data-disable-with');
        if (replacement != null) {
          setData(element, 'ujs:enable-with', element.innerHTML);
          element.innerHTML = replacement;
        }
        element.addEventListener('click', stopEverything);
        return setData(element, 'ujs:disabled', true);
      };

      enableLinkElement = function(element) {
        var originalText;
        originalText = getData(element, 'ujs:enable-with');
        if (originalText != null) {
          element.innerHTML = originalText;
          setData(element, 'ujs:enable-with', null);
        }
        element.removeEventListener('click', stopEverything);
        return setData(element, 'ujs:disabled', null);
      };

      disableFormElements = function(form) {
        return formElements(form, Rails.formDisableSelector).forEach(disableFormElement);
      };

      disableFormElement = function(element) {
        var replacement;
        replacement = element.getAttribute('data-disable-with');
        if (replacement != null) {
          if (matches(element, 'button')) {
            setData(element, 'ujs:enable-with', element.innerHTML);
            element.innerHTML = replacement;
          } else {
            setData(element, 'ujs:enable-with', element.value);
            element.value = replacement;
          }
        }
        element.disabled = true;
        return setData(element, 'ujs:disabled', true);
      };

      enableFormElements = function(form) {
        return formElements(form, Rails.formEnableSelector).forEach(enableFormElement);
      };

      enableFormElement = function(element) {
        var originalText;
        originalText = getData(element, 'ujs:enable-with');
        if (originalText != null) {
          if (matches(element, 'button')) {
            element.innerHTML = originalText;
          } else {
            element.value = originalText;
          }
          setData(element, 'ujs:enable-with', null);
        }
        element.disabled = false;
        return setData(element, 'ujs:disabled', null);
      };

    }).call(this);
    (function() {
      var stopEverything;

      stopEverything = Rails.stopEverything;

      Rails.handleMethod = function(e) {
        var csrfParam, csrfToken, form, formContent, href, link, method;
        link = this;
        method = link.getAttribute('data-method');
        if (!method) {
          return;
        }
        href = Rails.href(link);
        csrfToken = Rails.csrfToken();
        csrfParam = Rails.csrfParam();
        form = document.createElement('form');
        formContent = "<input name='_method' value='" + method + "' type='hidden' />";
        if ((csrfParam != null) && (csrfToken != null) && !Rails.isCrossDomain(href)) {
          formContent += "<input name='" + csrfParam + "' value='" + csrfToken + "' type='hidden' />";
        }
        formContent += '<input type="submit" />';
        form.method = 'post';
        form.action = href;
        form.target = link.target;
        form.innerHTML = formContent;
        form.style.display = 'none';
        document.body.appendChild(form);
        form.querySelector('[type="submit"]').click();
        return stopEverything(e);
      };

    }).call(this);
    (function() {
      var ajax, fire, getData, isCrossDomain, isRemote, matches, serializeElement, setData, stopEverything,
        slice = [].slice;

      matches = Rails.matches, getData = Rails.getData, setData = Rails.setData, fire = Rails.fire, stopEverything = Rails.stopEverything, ajax = Rails.ajax, isCrossDomain = Rails.isCrossDomain, serializeElement = Rails.serializeElement;

      isRemote = function(element) {
        var value;
        value = element.getAttribute('data-remote');
        return (value != null) && value !== 'false';
      };

      Rails.handleRemote = function(e) {
        var button, data, dataType, element, method, url, withCredentials;
        element = this;
        if (!isRemote(element)) {
          return true;
        }
        if (!fire(element, 'ajax:before')) {
          fire(element, 'ajax:stopped');
          return false;
        }
        withCredentials = element.getAttribute('data-with-credentials');
        dataType = element.getAttribute('data-type') || 'script';
        if (matches(element, Rails.formSubmitSelector)) {
          button = getData(element, 'ujs:submit-button');
          method = getData(element, 'ujs:submit-button-formmethod') || element.method;
          url = getData(element, 'ujs:submit-button-formaction') || element.getAttribute('action') || location.href;
          if (method.toUpperCase() === 'GET') {
            url = url.replace(/\?.*$/, '');
          }
          if (element.enctype === 'multipart/form-data') {
            data = new FormData(element);
            if (button != null) {
              data.append(button.name, button.value);
            }
          } else {
            data = serializeElement(element, button);
          }
          setData(element, 'ujs:submit-button', null);
          setData(element, 'ujs:submit-button-formmethod', null);
          setData(element, 'ujs:submit-button-formaction', null);
        } else if (matches(element, Rails.buttonClickSelector) || matches(element, Rails.inputChangeSelector)) {
          method = element.getAttribute('data-method');
          url = element.getAttribute('data-url');
          data = serializeElement(element, element.getAttribute('data-params'));
        } else {
          method = element.getAttribute('data-method');
          url = Rails.href(element);
          data = element.getAttribute('data-params');
        }
        ajax({
          type: method || 'GET',
          url: url,
          data: data,
          dataType: dataType,
          beforeSend: function(xhr, options) {
            if (fire(element, 'ajax:beforeSend', [xhr, options])) {
              return fire(element, 'ajax:send', [xhr]);
            } else {
              fire(element, 'ajax:stopped');
              return false;
            }
          },
          success: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:success', args);
          },
          error: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:error', args);
          },
          complete: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:complete', args);
          },
          crossDomain: isCrossDomain(url),
          withCredentials: (withCredentials != null) && withCredentials !== 'false'
        });
        return stopEverything(e);
      };

      Rails.formSubmitButtonClick = function(e) {
        var button, form;
        button = this;
        form = button.form;
        if (!form) {
          return;
        }
        if (button.name) {
          setData(form, 'ujs:submit-button', {
            name: button.name,
            value: button.value
          });
        }
        setData(form, 'ujs:formnovalidate-button', button.formNoValidate);
        setData(form, 'ujs:submit-button-formaction', button.getAttribute('formaction'));
        return setData(form, 'ujs:submit-button-formmethod', button.getAttribute('formmethod'));
      };

      Rails.handleMetaClick = function(e) {
        var data, link, metaClick, method;
        link = this;
        method = (link.getAttribute('data-method') || 'GET').toUpperCase();
        data = link.getAttribute('data-params');
        metaClick = e.metaKey || e.ctrlKey;
        if (metaClick && method === 'GET' && !data) {
          return e.stopImmediatePropagation();
        }
      };

    }).call(this);
    (function() {
      var $, CSRFProtection, delegate, disableElement, enableElement, fire, formSubmitButtonClick, getData, handleConfirm, handleDisabledElement, handleMetaClick, handleMethod, handleRemote, refreshCSRFTokens;

      fire = Rails.fire, delegate = Rails.delegate, getData = Rails.getData, $ = Rails.$, refreshCSRFTokens = Rails.refreshCSRFTokens, CSRFProtection = Rails.CSRFProtection, enableElement = Rails.enableElement, disableElement = Rails.disableElement, handleDisabledElement = Rails.handleDisabledElement, handleConfirm = Rails.handleConfirm, handleRemote = Rails.handleRemote, formSubmitButtonClick = Rails.formSubmitButtonClick, handleMetaClick = Rails.handleMetaClick, handleMethod = Rails.handleMethod;

      if ((typeof jQuery !== "undefined" && jQuery !== null) && (jQuery.ajax != null)) {
        if (jQuery.rails) {
          throw new Error('If you load both jquery_ujs and rails-ujs, use rails-ujs only.');
        }
        jQuery.rails = Rails;
        jQuery.ajaxPrefilter(function(options, originalOptions, xhr) {
          if (!options.crossDomain) {
            return CSRFProtection(xhr);
          }
        });
      }

      Rails.start = function() {
        if (window._rails_loaded) {
          throw new Error('rails-ujs has already been loaded!');
        }
        window.addEventListener('pageshow', function() {
          $(Rails.formEnableSelector).forEach(function(el) {
            if (getData(el, 'ujs:disabled')) {
              return enableElement(el);
            }
          });
          return $(Rails.linkDisableSelector).forEach(function(el) {
            if (getData(el, 'ujs:disabled')) {
              return enableElement(el);
            }
          });
        });
        delegate(document, Rails.linkDisableSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.linkDisableSelector, 'ajax:stopped', enableElement);
        delegate(document, Rails.buttonDisableSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.buttonDisableSelector, 'ajax:stopped', enableElement);
        delegate(document, Rails.linkClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.linkClickSelector, 'click', handleConfirm);
        delegate(document, Rails.linkClickSelector, 'click', handleMetaClick);
        delegate(document, Rails.linkClickSelector, 'click', disableElement);
        delegate(document, Rails.linkClickSelector, 'click', handleRemote);
        delegate(document, Rails.linkClickSelector, 'click', handleMethod);
        delegate(document, Rails.buttonClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.buttonClickSelector, 'click', handleConfirm);
        delegate(document, Rails.buttonClickSelector, 'click', disableElement);
        delegate(document, Rails.buttonClickSelector, 'click', handleRemote);
        delegate(document, Rails.inputChangeSelector, 'change', handleDisabledElement);
        delegate(document, Rails.inputChangeSelector, 'change', handleConfirm);
        delegate(document, Rails.inputChangeSelector, 'change', handleRemote);
        delegate(document, Rails.formSubmitSelector, 'submit', handleDisabledElement);
        delegate(document, Rails.formSubmitSelector, 'submit', handleConfirm);
        delegate(document, Rails.formSubmitSelector, 'submit', handleRemote);
        delegate(document, Rails.formSubmitSelector, 'submit', function(e) {
          return setTimeout((function() {
            return disableElement(e);
          }), 13);
        });
        delegate(document, Rails.formSubmitSelector, 'ajax:send', disableElement);
        delegate(document, Rails.formSubmitSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.formInputClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.formInputClickSelector, 'click', handleConfirm);
        delegate(document, Rails.formInputClickSelector, 'click', formSubmitButtonClick);
        document.addEventListener('DOMContentLoaded', refreshCSRFTokens);
        return window._rails_loaded = true;
      };

      if (window.Rails === Rails && fire(document, 'rails:attachBindings')) {
        Rails.start();
      }

    }).call(this);
  }).call(this);

  if (typeof module === "object" && module.exports) {
    module.exports = Rails;
  } else if (typeof define === "function" && define.amd) {
    define(Rails);
  }
}).call(this);
(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define([ "exports" ], factory) : factory(global.ActiveStorage = {});
})(this, function(exports) {
  "use strict";
  function createCommonjsModule(fn, module) {
    return module = {
      exports: {}
    }, fn(module, module.exports), module.exports;
  }
  var sparkMd5 = createCommonjsModule(function(module, exports) {
    (function(factory) {
      {
        module.exports = factory();
      }
    })(function(undefined) {
      var hex_chr = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f" ];
      function md5cycle(x, k) {
        var a = x[0], b = x[1], c = x[2], d = x[3];
        a += (b & c | ~b & d) + k[0] - 680876936 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[1] - 389564586 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[2] + 606105819 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[3] - 1044525330 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[4] - 176418897 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[5] + 1200080426 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[6] - 1473231341 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[7] - 45705983 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[8] + 1770035416 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[9] - 1958414417 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[10] - 42063 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[11] - 1990404162 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[12] + 1804603682 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[13] - 40341101 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[14] - 1502002290 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[15] + 1236535329 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & d | c & ~d) + k[1] - 165796510 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[6] - 1069501632 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[11] + 643717713 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[0] - 373897302 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[5] - 701558691 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[10] + 38016083 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[15] - 660478335 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[4] - 405537848 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[9] + 568446438 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[14] - 1019803690 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[3] - 187363961 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[8] + 1163531501 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[13] - 1444681467 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[2] - 51403784 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[7] + 1735328473 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[12] - 1926607734 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b ^ c ^ d) + k[5] - 378558 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[8] - 2022574463 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[11] + 1839030562 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[14] - 35309556 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[1] - 1530992060 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[4] + 1272893353 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[7] - 155497632 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[10] - 1094730640 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[13] + 681279174 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[0] - 358537222 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[3] - 722521979 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[6] + 76029189 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[9] - 640364487 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[12] - 421815835 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[15] + 530742520 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[2] - 995338651 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (c ^ (b | ~d)) + k[0] - 198630844 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[7] + 1126891415 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[14] - 1416354905 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[5] - 57434055 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[12] + 1700485571 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[3] - 1894986606 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[10] - 1051523 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[1] - 2054922799 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[8] + 1873313359 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[15] - 30611744 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[6] - 1560198380 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[13] + 1309151649 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[4] - 145523070 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[11] - 1120210379 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[2] + 718787259 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[9] - 343485551 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        x[0] = a + x[0] | 0;
        x[1] = b + x[1] | 0;
        x[2] = c + x[2] | 0;
        x[3] = d + x[3] | 0;
      }
      function md5blk(s) {
        var md5blks = [], i;
        for (i = 0; i < 64; i += 4) {
          md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
        }
        return md5blks;
      }
      function md5blk_array(a) {
        var md5blks = [], i;
        for (i = 0; i < 64; i += 4) {
          md5blks[i >> 2] = a[i] + (a[i + 1] << 8) + (a[i + 2] << 16) + (a[i + 3] << 24);
        }
        return md5blks;
      }
      function md51(s) {
        var n = s.length, state = [ 1732584193, -271733879, -1732584194, 271733878 ], i, length, tail, tmp, lo, hi;
        for (i = 64; i <= n; i += 64) {
          md5cycle(state, md5blk(s.substring(i - 64, i)));
        }
        s = s.substring(i - 64);
        length = s.length;
        tail = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
        for (i = 0; i < length; i += 1) {
          tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
        }
        tail[i >> 2] |= 128 << (i % 4 << 3);
        if (i > 55) {
          md5cycle(state, tail);
          for (i = 0; i < 16; i += 1) {
            tail[i] = 0;
          }
        }
        tmp = n * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;
        tail[14] = lo;
        tail[15] = hi;
        md5cycle(state, tail);
        return state;
      }
      function md51_array(a) {
        var n = a.length, state = [ 1732584193, -271733879, -1732584194, 271733878 ], i, length, tail, tmp, lo, hi;
        for (i = 64; i <= n; i += 64) {
          md5cycle(state, md5blk_array(a.subarray(i - 64, i)));
        }
        a = i - 64 < n ? a.subarray(i - 64) : new Uint8Array(0);
        length = a.length;
        tail = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
        for (i = 0; i < length; i += 1) {
          tail[i >> 2] |= a[i] << (i % 4 << 3);
        }
        tail[i >> 2] |= 128 << (i % 4 << 3);
        if (i > 55) {
          md5cycle(state, tail);
          for (i = 0; i < 16; i += 1) {
            tail[i] = 0;
          }
        }
        tmp = n * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;
        tail[14] = lo;
        tail[15] = hi;
        md5cycle(state, tail);
        return state;
      }
      function rhex(n) {
        var s = "", j;
        for (j = 0; j < 4; j += 1) {
          s += hex_chr[n >> j * 8 + 4 & 15] + hex_chr[n >> j * 8 & 15];
        }
        return s;
      }
      function hex(x) {
        var i;
        for (i = 0; i < x.length; i += 1) {
          x[i] = rhex(x[i]);
        }
        return x.join("");
      }
      if (hex(md51("hello")) !== "5d41402abc4b2a76b9719d911017c592") ;
      if (typeof ArrayBuffer !== "undefined" && !ArrayBuffer.prototype.slice) {
        (function() {
          function clamp(val, length) {
            val = val | 0 || 0;
            if (val < 0) {
              return Math.max(val + length, 0);
            }
            return Math.min(val, length);
          }
          ArrayBuffer.prototype.slice = function(from, to) {
            var length = this.byteLength, begin = clamp(from, length), end = length, num, target, targetArray, sourceArray;
            if (to !== undefined) {
              end = clamp(to, length);
            }
            if (begin > end) {
              return new ArrayBuffer(0);
            }
            num = end - begin;
            target = new ArrayBuffer(num);
            targetArray = new Uint8Array(target);
            sourceArray = new Uint8Array(this, begin, num);
            targetArray.set(sourceArray);
            return target;
          };
        })();
      }
      function toUtf8(str) {
        if (/[\u0080-\uFFFF]/.test(str)) {
          str = unescape(encodeURIComponent(str));
        }
        return str;
      }
      function utf8Str2ArrayBuffer(str, returnUInt8Array) {
        var length = str.length, buff = new ArrayBuffer(length), arr = new Uint8Array(buff), i;
        for (i = 0; i < length; i += 1) {
          arr[i] = str.charCodeAt(i);
        }
        return returnUInt8Array ? arr : buff;
      }
      function arrayBuffer2Utf8Str(buff) {
        return String.fromCharCode.apply(null, new Uint8Array(buff));
      }
      function concatenateArrayBuffers(first, second, returnUInt8Array) {
        var result = new Uint8Array(first.byteLength + second.byteLength);
        result.set(new Uint8Array(first));
        result.set(new Uint8Array(second), first.byteLength);
        return returnUInt8Array ? result : result.buffer;
      }
      function hexToBinaryString(hex) {
        var bytes = [], length = hex.length, x;
        for (x = 0; x < length - 1; x += 2) {
          bytes.push(parseInt(hex.substr(x, 2), 16));
        }
        return String.fromCharCode.apply(String, bytes);
      }
      function SparkMD5() {
        this.reset();
      }
      SparkMD5.prototype.append = function(str) {
        this.appendBinary(toUtf8(str));
        return this;
      };
      SparkMD5.prototype.appendBinary = function(contents) {
        this._buff += contents;
        this._length += contents.length;
        var length = this._buff.length, i;
        for (i = 64; i <= length; i += 64) {
          md5cycle(this._hash, md5blk(this._buff.substring(i - 64, i)));
        }
        this._buff = this._buff.substring(i - 64);
        return this;
      };
      SparkMD5.prototype.end = function(raw) {
        var buff = this._buff, length = buff.length, i, tail = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], ret;
        for (i = 0; i < length; i += 1) {
          tail[i >> 2] |= buff.charCodeAt(i) << (i % 4 << 3);
        }
        this._finish(tail, length);
        ret = hex(this._hash);
        if (raw) {
          ret = hexToBinaryString(ret);
        }
        this.reset();
        return ret;
      };
      SparkMD5.prototype.reset = function() {
        this._buff = "";
        this._length = 0;
        this._hash = [ 1732584193, -271733879, -1732584194, 271733878 ];
        return this;
      };
      SparkMD5.prototype.getState = function() {
        return {
          buff: this._buff,
          length: this._length,
          hash: this._hash
        };
      };
      SparkMD5.prototype.setState = function(state) {
        this._buff = state.buff;
        this._length = state.length;
        this._hash = state.hash;
        return this;
      };
      SparkMD5.prototype.destroy = function() {
        delete this._hash;
        delete this._buff;
        delete this._length;
      };
      SparkMD5.prototype._finish = function(tail, length) {
        var i = length, tmp, lo, hi;
        tail[i >> 2] |= 128 << (i % 4 << 3);
        if (i > 55) {
          md5cycle(this._hash, tail);
          for (i = 0; i < 16; i += 1) {
            tail[i] = 0;
          }
        }
        tmp = this._length * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;
        tail[14] = lo;
        tail[15] = hi;
        md5cycle(this._hash, tail);
      };
      SparkMD5.hash = function(str, raw) {
        return SparkMD5.hashBinary(toUtf8(str), raw);
      };
      SparkMD5.hashBinary = function(content, raw) {
        var hash = md51(content), ret = hex(hash);
        return raw ? hexToBinaryString(ret) : ret;
      };
      SparkMD5.ArrayBuffer = function() {
        this.reset();
      };
      SparkMD5.ArrayBuffer.prototype.append = function(arr) {
        var buff = concatenateArrayBuffers(this._buff.buffer, arr, true), length = buff.length, i;
        this._length += arr.byteLength;
        for (i = 64; i <= length; i += 64) {
          md5cycle(this._hash, md5blk_array(buff.subarray(i - 64, i)));
        }
        this._buff = i - 64 < length ? new Uint8Array(buff.buffer.slice(i - 64)) : new Uint8Array(0);
        return this;
      };
      SparkMD5.ArrayBuffer.prototype.end = function(raw) {
        var buff = this._buff, length = buff.length, tail = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], i, ret;
        for (i = 0; i < length; i += 1) {
          tail[i >> 2] |= buff[i] << (i % 4 << 3);
        }
        this._finish(tail, length);
        ret = hex(this._hash);
        if (raw) {
          ret = hexToBinaryString(ret);
        }
        this.reset();
        return ret;
      };
      SparkMD5.ArrayBuffer.prototype.reset = function() {
        this._buff = new Uint8Array(0);
        this._length = 0;
        this._hash = [ 1732584193, -271733879, -1732584194, 271733878 ];
        return this;
      };
      SparkMD5.ArrayBuffer.prototype.getState = function() {
        var state = SparkMD5.prototype.getState.call(this);
        state.buff = arrayBuffer2Utf8Str(state.buff);
        return state;
      };
      SparkMD5.ArrayBuffer.prototype.setState = function(state) {
        state.buff = utf8Str2ArrayBuffer(state.buff, true);
        return SparkMD5.prototype.setState.call(this, state);
      };
      SparkMD5.ArrayBuffer.prototype.destroy = SparkMD5.prototype.destroy;
      SparkMD5.ArrayBuffer.prototype._finish = SparkMD5.prototype._finish;
      SparkMD5.ArrayBuffer.hash = function(arr, raw) {
        var hash = md51_array(new Uint8Array(arr)), ret = hex(hash);
        return raw ? hexToBinaryString(ret) : ret;
      };
      return SparkMD5;
    });
  });
  var classCallCheck = function(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };
  var createClass = function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function(Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();
  var fileSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
  var FileChecksum = function() {
    createClass(FileChecksum, null, [ {
      key: "create",
      value: function create(file, callback) {
        var instance = new FileChecksum(file);
        instance.create(callback);
      }
    } ]);
    function FileChecksum(file) {
      classCallCheck(this, FileChecksum);
      this.file = file;
      this.chunkSize = 2097152;
      this.chunkCount = Math.ceil(this.file.size / this.chunkSize);
      this.chunkIndex = 0;
    }
    createClass(FileChecksum, [ {
      key: "create",
      value: function create(callback) {
        var _this = this;
        this.callback = callback;
        this.md5Buffer = new sparkMd5.ArrayBuffer();
        this.fileReader = new FileReader();
        this.fileReader.addEventListener("load", function(event) {
          return _this.fileReaderDidLoad(event);
        });
        this.fileReader.addEventListener("error", function(event) {
          return _this.fileReaderDidError(event);
        });
        this.readNextChunk();
      }
    }, {
      key: "fileReaderDidLoad",
      value: function fileReaderDidLoad(event) {
        this.md5Buffer.append(event.target.result);
        if (!this.readNextChunk()) {
          var binaryDigest = this.md5Buffer.end(true);
          var base64digest = btoa(binaryDigest);
          this.callback(null, base64digest);
        }
      }
    }, {
      key: "fileReaderDidError",
      value: function fileReaderDidError(event) {
        this.callback("Error reading " + this.file.name);
      }
    }, {
      key: "readNextChunk",
      value: function readNextChunk() {
        if (this.chunkIndex < this.chunkCount || this.chunkIndex == 0 && this.chunkCount == 0) {
          var start = this.chunkIndex * this.chunkSize;
          var end = Math.min(start + this.chunkSize, this.file.size);
          var bytes = fileSlice.call(this.file, start, end);
          this.fileReader.readAsArrayBuffer(bytes);
          this.chunkIndex++;
          return true;
        } else {
          return false;
        }
      }
    } ]);
    return FileChecksum;
  }();
  function getMetaValue(name) {
    var element = findElement(document.head, 'meta[name="' + name + '"]');
    if (element) {
      return element.getAttribute("content");
    }
  }
  function findElements(root, selector) {
    if (typeof root == "string") {
      selector = root;
      root = document;
    }
    var elements = root.querySelectorAll(selector);
    return toArray$1(elements);
  }
  function findElement(root, selector) {
    if (typeof root == "string") {
      selector = root;
      root = document;
    }
    return root.querySelector(selector);
  }
  function dispatchEvent(element, type) {
    var eventInit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var disabled = element.disabled;
    var bubbles = eventInit.bubbles, cancelable = eventInit.cancelable, detail = eventInit.detail;
    var event = document.createEvent("Event");
    event.initEvent(type, bubbles || true, cancelable || true);
    event.detail = detail || {};
    try {
      element.disabled = false;
      element.dispatchEvent(event);
    } finally {
      element.disabled = disabled;
    }
    return event;
  }
  function toArray$1(value) {
    if (Array.isArray(value)) {
      return value;
    } else if (Array.from) {
      return Array.from(value);
    } else {
      return [].slice.call(value);
    }
  }
  var BlobRecord = function() {
    function BlobRecord(file, checksum, url) {
      var _this = this;
      classCallCheck(this, BlobRecord);
      this.file = file;
      this.attributes = {
        filename: file.name,
        content_type: file.type,
        byte_size: file.size,
        checksum: checksum
      };
      this.xhr = new XMLHttpRequest();
      this.xhr.open("POST", url, true);
      this.xhr.responseType = "json";
      this.xhr.setRequestHeader("Content-Type", "application/json");
      this.xhr.setRequestHeader("Accept", "application/json");
      this.xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      this.xhr.setRequestHeader("X-CSRF-Token", getMetaValue("csrf-token"));
      this.xhr.addEventListener("load", function(event) {
        return _this.requestDidLoad(event);
      });
      this.xhr.addEventListener("error", function(event) {
        return _this.requestDidError(event);
      });
    }
    createClass(BlobRecord, [ {
      key: "create",
      value: function create(callback) {
        this.callback = callback;
        this.xhr.send(JSON.stringify({
          blob: this.attributes
        }));
      }
    }, {
      key: "requestDidLoad",
      value: function requestDidLoad(event) {
        if (this.status >= 200 && this.status < 300) {
          var response = this.response;
          var direct_upload = response.direct_upload;
          delete response.direct_upload;
          this.attributes = response;
          this.directUploadData = direct_upload;
          this.callback(null, this.toJSON());
        } else {
          this.requestDidError(event);
        }
      }
    }, {
      key: "requestDidError",
      value: function requestDidError(event) {
        this.callback('Error creating Blob for "' + this.file.name + '". Status: ' + this.status);
      }
    }, {
      key: "toJSON",
      value: function toJSON() {
        var result = {};
        for (var key in this.attributes) {
          result[key] = this.attributes[key];
        }
        return result;
      }
    }, {
      key: "status",
      get: function get$$1() {
        return this.xhr.status;
      }
    }, {
      key: "response",
      get: function get$$1() {
        var _xhr = this.xhr, responseType = _xhr.responseType, response = _xhr.response;
        if (responseType == "json") {
          return response;
        } else {
          return JSON.parse(response);
        }
      }
    } ]);
    return BlobRecord;
  }();
  var BlobUpload = function() {
    function BlobUpload(blob) {
      var _this = this;
      classCallCheck(this, BlobUpload);
      this.blob = blob;
      this.file = blob.file;
      var _blob$directUploadDat = blob.directUploadData, url = _blob$directUploadDat.url, headers = _blob$directUploadDat.headers;
      this.xhr = new XMLHttpRequest();
      this.xhr.open("PUT", url, true);
      this.xhr.responseType = "text";
      for (var key in headers) {
        this.xhr.setRequestHeader(key, headers[key]);
      }
      this.xhr.addEventListener("load", function(event) {
        return _this.requestDidLoad(event);
      });
      this.xhr.addEventListener("error", function(event) {
        return _this.requestDidError(event);
      });
    }
    createClass(BlobUpload, [ {
      key: "create",
      value: function create(callback) {
        this.callback = callback;
        this.xhr.send(this.file.slice());
      }
    }, {
      key: "requestDidLoad",
      value: function requestDidLoad(event) {
        var _xhr = this.xhr, status = _xhr.status, response = _xhr.response;
        if (status >= 200 && status < 300) {
          this.callback(null, response);
        } else {
          this.requestDidError(event);
        }
      }
    }, {
      key: "requestDidError",
      value: function requestDidError(event) {
        this.callback('Error storing "' + this.file.name + '". Status: ' + this.xhr.status);
      }
    } ]);
    return BlobUpload;
  }();
  var id = 0;
  var DirectUpload = function() {
    function DirectUpload(file, url, delegate) {
      classCallCheck(this, DirectUpload);
      this.id = ++id;
      this.file = file;
      this.url = url;
      this.delegate = delegate;
    }
    createClass(DirectUpload, [ {
      key: "create",
      value: function create(callback) {
        var _this = this;
        FileChecksum.create(this.file, function(error, checksum) {
          if (error) {
            callback(error);
            return;
          }
          var blob = new BlobRecord(_this.file, checksum, _this.url);
          notify(_this.delegate, "directUploadWillCreateBlobWithXHR", blob.xhr);
          blob.create(function(error) {
            if (error) {
              callback(error);
            } else {
              var upload = new BlobUpload(blob);
              notify(_this.delegate, "directUploadWillStoreFileWithXHR", upload.xhr);
              upload.create(function(error) {
                if (error) {
                  callback(error);
                } else {
                  callback(null, blob.toJSON());
                }
              });
            }
          });
        });
      }
    } ]);
    return DirectUpload;
  }();
  function notify(object, methodName) {
    if (object && typeof object[methodName] == "function") {
      for (var _len = arguments.length, messages = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        messages[_key - 2] = arguments[_key];
      }
      return object[methodName].apply(object, messages);
    }
  }
  var DirectUploadController = function() {
    function DirectUploadController(input, file) {
      classCallCheck(this, DirectUploadController);
      this.input = input;
      this.file = file;
      this.directUpload = new DirectUpload(this.file, this.url, this);
      this.dispatch("initialize");
    }
    createClass(DirectUploadController, [ {
      key: "start",
      value: function start(callback) {
        var _this = this;
        var hiddenInput = document.createElement("input");
        hiddenInput.type = "hidden";
        hiddenInput.name = this.input.name;
        this.input.insertAdjacentElement("beforebegin", hiddenInput);
        this.dispatch("start");
        this.directUpload.create(function(error, attributes) {
          if (error) {
            hiddenInput.parentNode.removeChild(hiddenInput);
            _this.dispatchError(error);
          } else {
            hiddenInput.value = attributes.signed_id;
          }
          _this.dispatch("end");
          callback(error);
        });
      }
    }, {
      key: "uploadRequestDidProgress",
      value: function uploadRequestDidProgress(event) {
        var progress = event.loaded / event.total * 100;
        if (progress) {
          this.dispatch("progress", {
            progress: progress
          });
        }
      }
    }, {
      key: "dispatch",
      value: function dispatch(name) {
        var detail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        detail.file = this.file;
        detail.id = this.directUpload.id;
        return dispatchEvent(this.input, "direct-upload:" + name, {
          detail: detail
        });
      }
    }, {
      key: "dispatchError",
      value: function dispatchError(error) {
        var event = this.dispatch("error", {
          error: error
        });
        if (!event.defaultPrevented) {
          alert(error);
        }
      }
    }, {
      key: "directUploadWillCreateBlobWithXHR",
      value: function directUploadWillCreateBlobWithXHR(xhr) {
        this.dispatch("before-blob-request", {
          xhr: xhr
        });
      }
    }, {
      key: "directUploadWillStoreFileWithXHR",
      value: function directUploadWillStoreFileWithXHR(xhr) {
        var _this2 = this;
        this.dispatch("before-storage-request", {
          xhr: xhr
        });
        xhr.upload.addEventListener("progress", function(event) {
          return _this2.uploadRequestDidProgress(event);
        });
      }
    }, {
      key: "url",
      get: function get$$1() {
        return this.input.getAttribute("data-direct-upload-url");
      }
    } ]);
    return DirectUploadController;
  }();
  var inputSelector = "input[type=file][data-direct-upload-url]:not([disabled])";
  var DirectUploadsController = function() {
    function DirectUploadsController(form) {
      classCallCheck(this, DirectUploadsController);
      this.form = form;
      this.inputs = findElements(form, inputSelector).filter(function(input) {
        return input.files.length;
      });
    }
    createClass(DirectUploadsController, [ {
      key: "start",
      value: function start(callback) {
        var _this = this;
        var controllers = this.createDirectUploadControllers();
        var startNextController = function startNextController() {
          var controller = controllers.shift();
          if (controller) {
            controller.start(function(error) {
              if (error) {
                callback(error);
                _this.dispatch("end");
              } else {
                startNextController();
              }
            });
          } else {
            callback();
            _this.dispatch("end");
          }
        };
        this.dispatch("start");
        startNextController();
      }
    }, {
      key: "createDirectUploadControllers",
      value: function createDirectUploadControllers() {
        var controllers = [];
        this.inputs.forEach(function(input) {
          toArray$1(input.files).forEach(function(file) {
            var controller = new DirectUploadController(input, file);
            controllers.push(controller);
          });
        });
        return controllers;
      }
    }, {
      key: "dispatch",
      value: function dispatch(name) {
        var detail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return dispatchEvent(this.form, "direct-uploads:" + name, {
          detail: detail
        });
      }
    } ]);
    return DirectUploadsController;
  }();
  var processingAttribute = "data-direct-uploads-processing";
  var submitButtonsByForm = new WeakMap();
  var started = false;
  function start() {
    if (!started) {
      started = true;
      document.addEventListener("click", didClick, true);
      document.addEventListener("submit", didSubmitForm);
      document.addEventListener("ajax:before", didSubmitRemoteElement);
    }
  }
  function didClick(event) {
    var target = event.target;
    if ((target.tagName == "INPUT" || target.tagName == "BUTTON") && target.type == "submit" && target.form) {
      submitButtonsByForm.set(target.form, target);
    }
  }
  function didSubmitForm(event) {
    handleFormSubmissionEvent(event);
  }
  function didSubmitRemoteElement(event) {
    if (event.target.tagName == "FORM") {
      handleFormSubmissionEvent(event);
    }
  }
  function handleFormSubmissionEvent(event) {
    var form = event.target;
    if (form.hasAttribute(processingAttribute)) {
      event.preventDefault();
      return;
    }
    var controller = new DirectUploadsController(form);
    var inputs = controller.inputs;
    if (inputs.length) {
      event.preventDefault();
      form.setAttribute(processingAttribute, "");
      inputs.forEach(disable);
      controller.start(function(error) {
        form.removeAttribute(processingAttribute);
        if (error) {
          inputs.forEach(enable);
        } else {
          submitForm(form);
        }
      });
    }
  }
  function submitForm(form) {
    var button = submitButtonsByForm.get(form) || findElement(form, "input[type=submit], button[type=submit]");
    if (button) {
      var _button = button, disabled = _button.disabled;
      button.disabled = false;
      button.focus();
      button.click();
      button.disabled = disabled;
    } else {
      button = document.createElement("input");
      button.type = "submit";
      button.style.display = "none";
      form.appendChild(button);
      button.click();
      form.removeChild(button);
    }
    submitButtonsByForm.delete(form);
  }
  function disable(input) {
    input.disabled = true;
  }
  function enable(input) {
    input.disabled = false;
  }
  function autostart() {
    if (window.ActiveStorage) {
      start();
    }
  }
  setTimeout(autostart, 1);
  exports.start = start;
  exports.DirectUpload = DirectUpload;
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
/*
Turbolinks 5.2.0
Copyright © 2018 Basecamp, LLC
 */

(function(){var t=this;(function(){(function(){this.Turbolinks={supported:function(){return null!=window.history.pushState&&null!=window.requestAnimationFrame&&null!=window.addEventListener}(),visit:function(t,r){return e.controller.visit(t,r)},clearCache:function(){return e.controller.clearCache()},setProgressBarDelay:function(t){return e.controller.setProgressBarDelay(t)}}}).call(this)}).call(t);var e=t.Turbolinks;(function(){(function(){var t,r,n,o=[].slice;e.copyObject=function(t){var e,r,n;r={};for(e in t)n=t[e],r[e]=n;return r},e.closest=function(e,r){return t.call(e,r)},t=function(){var t,e;return t=document.documentElement,null!=(e=t.closest)?e:function(t){var e;for(e=this;e;){if(e.nodeType===Node.ELEMENT_NODE&&r.call(e,t))return e;e=e.parentNode}}}(),e.defer=function(t){return setTimeout(t,1)},e.throttle=function(t){var e;return e=null,function(){var r;return r=1<=arguments.length?o.call(arguments,0):[],null!=e?e:e=requestAnimationFrame(function(n){return function(){return e=null,t.apply(n,r)}}(this))}},e.dispatch=function(t,e){var r,o,i,s,a,u;return a=null!=e?e:{},u=a.target,r=a.cancelable,o=a.data,i=document.createEvent("Events"),i.initEvent(t,!0,r===!0),i.data=null!=o?o:{},i.cancelable&&!n&&(s=i.preventDefault,i.preventDefault=function(){return this.defaultPrevented||Object.defineProperty(this,"defaultPrevented",{get:function(){return!0}}),s.call(this)}),(null!=u?u:document).dispatchEvent(i),i},n=function(){var t;return t=document.createEvent("Events"),t.initEvent("test",!0,!0),t.preventDefault(),t.defaultPrevented}(),e.match=function(t,e){return r.call(t,e)},r=function(){var t,e,r,n;return t=document.documentElement,null!=(e=null!=(r=null!=(n=t.matchesSelector)?n:t.webkitMatchesSelector)?r:t.msMatchesSelector)?e:t.mozMatchesSelector}(),e.uuid=function(){var t,e,r;for(r="",t=e=1;36>=e;t=++e)r+=9===t||14===t||19===t||24===t?"-":15===t?"4":20===t?(Math.floor(4*Math.random())+8).toString(16):Math.floor(15*Math.random()).toString(16);return r}}).call(this),function(){e.Location=function(){function t(t){var e,r;null==t&&(t=""),r=document.createElement("a"),r.href=t.toString(),this.absoluteURL=r.href,e=r.hash.length,2>e?this.requestURL=this.absoluteURL:(this.requestURL=this.absoluteURL.slice(0,-e),this.anchor=r.hash.slice(1))}var e,r,n,o;return t.wrap=function(t){return t instanceof this?t:new this(t)},t.prototype.getOrigin=function(){return this.absoluteURL.split("/",3).join("/")},t.prototype.getPath=function(){var t,e;return null!=(t=null!=(e=this.requestURL.match(/\/\/[^\/]*(\/[^?;]*)/))?e[1]:void 0)?t:"/"},t.prototype.getPathComponents=function(){return this.getPath().split("/").slice(1)},t.prototype.getLastPathComponent=function(){return this.getPathComponents().slice(-1)[0]},t.prototype.getExtension=function(){var t,e;return null!=(t=null!=(e=this.getLastPathComponent().match(/\.[^.]*$/))?e[0]:void 0)?t:""},t.prototype.isHTML=function(){return this.getExtension().match(/^(?:|\.(?:htm|html|xhtml))$/)},t.prototype.isPrefixedBy=function(t){var e;return e=r(t),this.isEqualTo(t)||o(this.absoluteURL,e)},t.prototype.isEqualTo=function(t){return this.absoluteURL===(null!=t?t.absoluteURL:void 0)},t.prototype.toCacheKey=function(){return this.requestURL},t.prototype.toJSON=function(){return this.absoluteURL},t.prototype.toString=function(){return this.absoluteURL},t.prototype.valueOf=function(){return this.absoluteURL},r=function(t){return e(t.getOrigin()+t.getPath())},e=function(t){return n(t,"/")?t:t+"/"},o=function(t,e){return t.slice(0,e.length)===e},n=function(t,e){return t.slice(-e.length)===e},t}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.HttpRequest=function(){function r(r,n,o){this.delegate=r,this.requestCanceled=t(this.requestCanceled,this),this.requestTimedOut=t(this.requestTimedOut,this),this.requestFailed=t(this.requestFailed,this),this.requestLoaded=t(this.requestLoaded,this),this.requestProgressed=t(this.requestProgressed,this),this.url=e.Location.wrap(n).requestURL,this.referrer=e.Location.wrap(o).absoluteURL,this.createXHR()}return r.NETWORK_FAILURE=0,r.TIMEOUT_FAILURE=-1,r.timeout=60,r.prototype.send=function(){var t;return this.xhr&&!this.sent?(this.notifyApplicationBeforeRequestStart(),this.setProgress(0),this.xhr.send(),this.sent=!0,"function"==typeof(t=this.delegate).requestStarted?t.requestStarted():void 0):void 0},r.prototype.cancel=function(){return this.xhr&&this.sent?this.xhr.abort():void 0},r.prototype.requestProgressed=function(t){return t.lengthComputable?this.setProgress(t.loaded/t.total):void 0},r.prototype.requestLoaded=function(){return this.endRequest(function(t){return function(){var e;return 200<=(e=t.xhr.status)&&300>e?t.delegate.requestCompletedWithResponse(t.xhr.responseText,t.xhr.getResponseHeader("Turbolinks-Location")):(t.failed=!0,t.delegate.requestFailedWithStatusCode(t.xhr.status,t.xhr.responseText))}}(this))},r.prototype.requestFailed=function(){return this.endRequest(function(t){return function(){return t.failed=!0,t.delegate.requestFailedWithStatusCode(t.constructor.NETWORK_FAILURE)}}(this))},r.prototype.requestTimedOut=function(){return this.endRequest(function(t){return function(){return t.failed=!0,t.delegate.requestFailedWithStatusCode(t.constructor.TIMEOUT_FAILURE)}}(this))},r.prototype.requestCanceled=function(){return this.endRequest()},r.prototype.notifyApplicationBeforeRequestStart=function(){return e.dispatch("turbolinks:request-start",{data:{url:this.url,xhr:this.xhr}})},r.prototype.notifyApplicationAfterRequestEnd=function(){return e.dispatch("turbolinks:request-end",{data:{url:this.url,xhr:this.xhr}})},r.prototype.createXHR=function(){return this.xhr=new XMLHttpRequest,this.xhr.open("GET",this.url,!0),this.xhr.timeout=1e3*this.constructor.timeout,this.xhr.setRequestHeader("Accept","text/html, application/xhtml+xml"),this.xhr.setRequestHeader("Turbolinks-Referrer",this.referrer),this.xhr.onprogress=this.requestProgressed,this.xhr.onload=this.requestLoaded,this.xhr.onerror=this.requestFailed,this.xhr.ontimeout=this.requestTimedOut,this.xhr.onabort=this.requestCanceled},r.prototype.endRequest=function(t){return this.xhr?(this.notifyApplicationAfterRequestEnd(),null!=t&&t.call(this),this.destroy()):void 0},r.prototype.setProgress=function(t){var e;return this.progress=t,"function"==typeof(e=this.delegate).requestProgressed?e.requestProgressed(this.progress):void 0},r.prototype.destroy=function(){var t;return this.setProgress(1),"function"==typeof(t=this.delegate).requestFinished&&t.requestFinished(),this.delegate=null,this.xhr=null},r}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.ProgressBar=function(){function e(){this.trickle=t(this.trickle,this),this.stylesheetElement=this.createStylesheetElement(),this.progressElement=this.createProgressElement()}var r;return r=300,e.defaultCSS=".turbolinks-progress-bar {\n  position: fixed;\n  display: block;\n  top: 0;\n  left: 0;\n  height: 3px;\n  background: #0076ff;\n  z-index: 9999;\n  transition: width "+r+"ms ease-out, opacity "+r/2+"ms "+r/2+"ms ease-in;\n  transform: translate3d(0, 0, 0);\n}",e.prototype.show=function(){return this.visible?void 0:(this.visible=!0,this.installStylesheetElement(),this.installProgressElement(),this.startTrickling())},e.prototype.hide=function(){return this.visible&&!this.hiding?(this.hiding=!0,this.fadeProgressElement(function(t){return function(){return t.uninstallProgressElement(),t.stopTrickling(),t.visible=!1,t.hiding=!1}}(this))):void 0},e.prototype.setValue=function(t){return this.value=t,this.refresh()},e.prototype.installStylesheetElement=function(){return document.head.insertBefore(this.stylesheetElement,document.head.firstChild)},e.prototype.installProgressElement=function(){return this.progressElement.style.width=0,this.progressElement.style.opacity=1,document.documentElement.insertBefore(this.progressElement,document.body),this.refresh()},e.prototype.fadeProgressElement=function(t){return this.progressElement.style.opacity=0,setTimeout(t,1.5*r)},e.prototype.uninstallProgressElement=function(){return this.progressElement.parentNode?document.documentElement.removeChild(this.progressElement):void 0},e.prototype.startTrickling=function(){return null!=this.trickleInterval?this.trickleInterval:this.trickleInterval=setInterval(this.trickle,r)},e.prototype.stopTrickling=function(){return clearInterval(this.trickleInterval),this.trickleInterval=null},e.prototype.trickle=function(){return this.setValue(this.value+Math.random()/100)},e.prototype.refresh=function(){return requestAnimationFrame(function(t){return function(){return t.progressElement.style.width=10+90*t.value+"%"}}(this))},e.prototype.createStylesheetElement=function(){var t;return t=document.createElement("style"),t.type="text/css",t.textContent=this.constructor.defaultCSS,t},e.prototype.createProgressElement=function(){var t;return t=document.createElement("div"),t.className="turbolinks-progress-bar",t},e}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.BrowserAdapter=function(){function r(r){this.controller=r,this.showProgressBar=t(this.showProgressBar,this),this.progressBar=new e.ProgressBar}var n,o,i;return i=e.HttpRequest,n=i.NETWORK_FAILURE,o=i.TIMEOUT_FAILURE,r.prototype.visitProposedToLocationWithAction=function(t,e){return this.controller.startVisitToLocationWithAction(t,e)},r.prototype.visitStarted=function(t){return t.issueRequest(),t.changeHistory(),t.loadCachedSnapshot()},r.prototype.visitRequestStarted=function(t){return this.progressBar.setValue(0),t.hasCachedSnapshot()||"restore"!==t.action?this.showProgressBarAfterDelay():this.showProgressBar()},r.prototype.visitRequestProgressed=function(t){return this.progressBar.setValue(t.progress)},r.prototype.visitRequestCompleted=function(t){return t.loadResponse()},r.prototype.visitRequestFailedWithStatusCode=function(t,e){switch(e){case n:case o:return this.reload();default:return t.loadResponse()}},r.prototype.visitRequestFinished=function(t){return this.hideProgressBar()},r.prototype.visitCompleted=function(t){return t.followRedirect()},r.prototype.pageInvalidated=function(){return this.reload()},r.prototype.showProgressBarAfterDelay=function(){return this.progressBarTimeout=setTimeout(this.showProgressBar,this.controller.progressBarDelay)},r.prototype.showProgressBar=function(){return this.progressBar.show()},r.prototype.hideProgressBar=function(){return this.progressBar.hide(),clearTimeout(this.progressBarTimeout)},r.prototype.reload=function(){return window.location.reload()},r}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.History=function(){function r(e){this.delegate=e,this.onPageLoad=t(this.onPageLoad,this),this.onPopState=t(this.onPopState,this)}return r.prototype.start=function(){return this.started?void 0:(addEventListener("popstate",this.onPopState,!1),addEventListener("load",this.onPageLoad,!1),this.started=!0)},r.prototype.stop=function(){return this.started?(removeEventListener("popstate",this.onPopState,!1),removeEventListener("load",this.onPageLoad,!1),this.started=!1):void 0},r.prototype.push=function(t,r){return t=e.Location.wrap(t),this.update("push",t,r)},r.prototype.replace=function(t,r){return t=e.Location.wrap(t),this.update("replace",t,r)},r.prototype.onPopState=function(t){var r,n,o,i;return this.shouldHandlePopState()&&(i=null!=(n=t.state)?n.turbolinks:void 0)?(r=e.Location.wrap(window.location),o=i.restorationIdentifier,this.delegate.historyPoppedToLocationWithRestorationIdentifier(r,o)):void 0},r.prototype.onPageLoad=function(t){return e.defer(function(t){return function(){return t.pageLoaded=!0}}(this))},r.prototype.shouldHandlePopState=function(){return this.pageIsLoaded()},r.prototype.pageIsLoaded=function(){return this.pageLoaded||"complete"===document.readyState},r.prototype.update=function(t,e,r){var n;return n={turbolinks:{restorationIdentifier:r}},history[t+"State"](n,null,e)},r}()}.call(this),function(){e.HeadDetails=function(){function t(t){var e,r,n,s,a,u;for(this.elements={},n=0,a=t.length;a>n;n++)u=t[n],u.nodeType===Node.ELEMENT_NODE&&(s=u.outerHTML,r=null!=(e=this.elements)[s]?e[s]:e[s]={type:i(u),tracked:o(u),elements:[]},r.elements.push(u))}var e,r,n,o,i;return t.fromHeadElement=function(t){var e;return new this(null!=(e=null!=t?t.childNodes:void 0)?e:[])},t.prototype.hasElementWithKey=function(t){return t in this.elements},t.prototype.getTrackedElementSignature=function(){var t,e;return function(){var r,n;r=this.elements,n=[];for(t in r)e=r[t].tracked,e&&n.push(t);return n}.call(this).join("")},t.prototype.getScriptElementsNotInDetails=function(t){return this.getElementsMatchingTypeNotInDetails("script",t)},t.prototype.getStylesheetElementsNotInDetails=function(t){return this.getElementsMatchingTypeNotInDetails("stylesheet",t)},t.prototype.getElementsMatchingTypeNotInDetails=function(t,e){var r,n,o,i,s,a;o=this.elements,s=[];for(n in o)i=o[n],a=i.type,r=i.elements,a!==t||e.hasElementWithKey(n)||s.push(r[0]);return s},t.prototype.getProvisionalElements=function(){var t,e,r,n,o,i,s;r=[],n=this.elements;for(e in n)o=n[e],s=o.type,i=o.tracked,t=o.elements,null!=s||i?t.length>1&&r.push.apply(r,t.slice(1)):r.push.apply(r,t);return r},t.prototype.getMetaValue=function(t){var e;return null!=(e=this.findMetaElementByName(t))?e.getAttribute("content"):void 0},t.prototype.findMetaElementByName=function(t){var r,n,o,i;r=void 0,i=this.elements;for(o in i)n=i[o].elements,e(n[0],t)&&(r=n[0]);return r},i=function(t){return r(t)?"script":n(t)?"stylesheet":void 0},o=function(t){return"reload"===t.getAttribute("data-turbolinks-track")},r=function(t){var e;return e=t.tagName.toLowerCase(),"script"===e},n=function(t){var e;return e=t.tagName.toLowerCase(),"style"===e||"link"===e&&"stylesheet"===t.getAttribute("rel")},e=function(t,e){var r;return r=t.tagName.toLowerCase(),"meta"===r&&t.getAttribute("name")===e},t}()}.call(this),function(){e.Snapshot=function(){function t(t,e){this.headDetails=t,this.bodyElement=e}return t.wrap=function(t){return t instanceof this?t:"string"==typeof t?this.fromHTMLString(t):this.fromHTMLElement(t)},t.fromHTMLString=function(t){var e;return e=document.createElement("html"),e.innerHTML=t,this.fromHTMLElement(e)},t.fromHTMLElement=function(t){var r,n,o,i;return o=t.querySelector("head"),r=null!=(i=t.querySelector("body"))?i:document.createElement("body"),n=e.HeadDetails.fromHeadElement(o),new this(n,r)},t.prototype.clone=function(){return new this.constructor(this.headDetails,this.bodyElement.cloneNode(!0))},t.prototype.getRootLocation=function(){var t,r;return r=null!=(t=this.getSetting("root"))?t:"/",new e.Location(r)},t.prototype.getCacheControlValue=function(){return this.getSetting("cache-control")},t.prototype.getElementForAnchor=function(t){try{return this.bodyElement.querySelector("[id='"+t+"'], a[name='"+t+"']")}catch(e){}},t.prototype.getPermanentElements=function(){return this.bodyElement.querySelectorAll("[id][data-turbolinks-permanent]")},t.prototype.getPermanentElementById=function(t){return this.bodyElement.querySelector("#"+t+"[data-turbolinks-permanent]")},t.prototype.getPermanentElementsPresentInSnapshot=function(t){var e,r,n,o,i;for(o=this.getPermanentElements(),i=[],r=0,n=o.length;n>r;r++)e=o[r],t.getPermanentElementById(e.id)&&i.push(e);return i},t.prototype.findFirstAutofocusableElement=function(){return this.bodyElement.querySelector("[autofocus]")},t.prototype.hasAnchor=function(t){return null!=this.getElementForAnchor(t)},t.prototype.isPreviewable=function(){return"no-preview"!==this.getCacheControlValue()},t.prototype.isCacheable=function(){return"no-cache"!==this.getCacheControlValue()},t.prototype.isVisitable=function(){return"reload"!==this.getSetting("visit-control")},t.prototype.getSetting=function(t){return this.headDetails.getMetaValue("turbolinks-"+t)},t}()}.call(this),function(){var t=[].slice;e.Renderer=function(){function e(){}var r;return e.render=function(){var e,r,n,o;return n=arguments[0],r=arguments[1],e=3<=arguments.length?t.call(arguments,2):[],o=function(t,e,r){r.prototype=t.prototype;var n=new r,o=t.apply(n,e);return Object(o)===o?o:n}(this,e,function(){}),o.delegate=n,o.render(r),o},e.prototype.renderView=function(t){return this.delegate.viewWillRender(this.newBody),t(),this.delegate.viewRendered(this.newBody)},e.prototype.invalidateView=function(){return this.delegate.viewInvalidated()},e.prototype.createScriptElement=function(t){var e;return"false"===t.getAttribute("data-turbolinks-eval")?t:(e=document.createElement("script"),e.textContent=t.textContent,e.async=!1,r(e,t),e)},r=function(t,e){var r,n,o,i,s,a,u;for(i=e.attributes,a=[],r=0,n=i.length;n>r;r++)s=i[r],o=s.name,u=s.value,a.push(t.setAttribute(o,u));return a},e}()}.call(this),function(){var t,r,n=function(t,e){function r(){this.constructor=t}for(var n in e)o.call(e,n)&&(t[n]=e[n]);return r.prototype=e.prototype,t.prototype=new r,t.__super__=e.prototype,t},o={}.hasOwnProperty;e.SnapshotRenderer=function(e){function o(t,e,r){this.currentSnapshot=t,this.newSnapshot=e,this.isPreview=r,this.currentHeadDetails=this.currentSnapshot.headDetails,this.newHeadDetails=this.newSnapshot.headDetails,this.currentBody=this.currentSnapshot.bodyElement,this.newBody=this.newSnapshot.bodyElement}return n(o,e),o.prototype.render=function(t){return this.shouldRender()?(this.mergeHead(),this.renderView(function(e){return function(){return e.replaceBody(),e.isPreview||e.focusFirstAutofocusableElement(),t()}}(this))):this.invalidateView()},o.prototype.mergeHead=function(){return this.copyNewHeadStylesheetElements(),this.copyNewHeadScriptElements(),this.removeCurrentHeadProvisionalElements(),this.copyNewHeadProvisionalElements()},o.prototype.replaceBody=function(){var t;return t=this.relocateCurrentBodyPermanentElements(),this.activateNewBodyScriptElements(),this.assignNewBody(),this.replacePlaceholderElementsWithClonedPermanentElements(t)},o.prototype.shouldRender=function(){return this.newSnapshot.isVisitable()&&this.trackedElementsAreIdentical()},o.prototype.trackedElementsAreIdentical=function(){return this.currentHeadDetails.getTrackedElementSignature()===this.newHeadDetails.getTrackedElementSignature()},o.prototype.copyNewHeadStylesheetElements=function(){var t,e,r,n,o;for(n=this.getNewHeadStylesheetElements(),o=[],e=0,r=n.length;r>e;e++)t=n[e],o.push(document.head.appendChild(t));return o},o.prototype.copyNewHeadScriptElements=function(){var t,e,r,n,o;for(n=this.getNewHeadScriptElements(),o=[],e=0,r=n.length;r>e;e++)t=n[e],o.push(document.head.appendChild(this.createScriptElement(t)));return o},o.prototype.removeCurrentHeadProvisionalElements=function(){var t,e,r,n,o;for(n=this.getCurrentHeadProvisionalElements(),o=[],e=0,r=n.length;r>e;e++)t=n[e],o.push(document.head.removeChild(t));return o},o.prototype.copyNewHeadProvisionalElements=function(){var t,e,r,n,o;for(n=this.getNewHeadProvisionalElements(),o=[],e=0,r=n.length;r>e;e++)t=n[e],o.push(document.head.appendChild(t));return o},o.prototype.relocateCurrentBodyPermanentElements=function(){var e,n,o,i,s,a,u;for(a=this.getCurrentBodyPermanentElements(),u=[],e=0,n=a.length;n>e;e++)i=a[e],s=t(i),o=this.newSnapshot.getPermanentElementById(i.id),r(i,s.element),r(o,i),u.push(s);return u},o.prototype.replacePlaceholderElementsWithClonedPermanentElements=function(t){var e,n,o,i,s,a,u;for(u=[],o=0,i=t.length;i>o;o++)a=t[o],n=a.element,s=a.permanentElement,e=s.cloneNode(!0),u.push(r(n,e));return u},o.prototype.activateNewBodyScriptElements=function(){var t,e,n,o,i,s;for(i=this.getNewBodyScriptElements(),s=[],e=0,o=i.length;o>e;e++)n=i[e],t=this.createScriptElement(n),s.push(r(n,t));return s},o.prototype.assignNewBody=function(){return document.body=this.newBody},o.prototype.focusFirstAutofocusableElement=function(){var t;return null!=(t=this.newSnapshot.findFirstAutofocusableElement())?t.focus():void 0},o.prototype.getNewHeadStylesheetElements=function(){return this.newHeadDetails.getStylesheetElementsNotInDetails(this.currentHeadDetails)},o.prototype.getNewHeadScriptElements=function(){return this.newHeadDetails.getScriptElementsNotInDetails(this.currentHeadDetails)},o.prototype.getCurrentHeadProvisionalElements=function(){return this.currentHeadDetails.getProvisionalElements()},o.prototype.getNewHeadProvisionalElements=function(){return this.newHeadDetails.getProvisionalElements()},o.prototype.getCurrentBodyPermanentElements=function(){return this.currentSnapshot.getPermanentElementsPresentInSnapshot(this.newSnapshot)},o.prototype.getNewBodyScriptElements=function(){return this.newBody.querySelectorAll("script")},o}(e.Renderer),t=function(t){var e;return e=document.createElement("meta"),e.setAttribute("name","turbolinks-permanent-placeholder"),e.setAttribute("content",t.id),{element:e,permanentElement:t}},r=function(t,e){var r;return(r=t.parentNode)?r.replaceChild(e,t):void 0}}.call(this),function(){var t=function(t,e){function n(){this.constructor=t}for(var o in e)r.call(e,o)&&(t[o]=e[o]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t},r={}.hasOwnProperty;e.ErrorRenderer=function(e){function r(t){var e;e=document.createElement("html"),e.innerHTML=t,this.newHead=e.querySelector("head"),this.newBody=e.querySelector("body")}return t(r,e),r.prototype.render=function(t){return this.renderView(function(e){return function(){return e.replaceHeadAndBody(),e.activateBodyScriptElements(),t()}}(this))},r.prototype.replaceHeadAndBody=function(){var t,e;return e=document.head,t=document.body,e.parentNode.replaceChild(this.newHead,e),t.parentNode.replaceChild(this.newBody,t)},r.prototype.activateBodyScriptElements=function(){var t,e,r,n,o,i;for(n=this.getScriptElements(),i=[],e=0,r=n.length;r>e;e++)o=n[e],t=this.createScriptElement(o),i.push(o.parentNode.replaceChild(t,o));return i},r.prototype.getScriptElements=function(){return document.documentElement.querySelectorAll("script")},r}(e.Renderer)}.call(this),function(){e.View=function(){function t(t){this.delegate=t,this.htmlElement=document.documentElement}return t.prototype.getRootLocation=function(){return this.getSnapshot().getRootLocation()},t.prototype.getElementForAnchor=function(t){return this.getSnapshot().getElementForAnchor(t)},t.prototype.getSnapshot=function(){return e.Snapshot.fromHTMLElement(this.htmlElement)},t.prototype.render=function(t,e){var r,n,o;return o=t.snapshot,r=t.error,n=t.isPreview,this.markAsPreview(n),null!=o?this.renderSnapshot(o,n,e):this.renderError(r,e)},t.prototype.markAsPreview=function(t){return t?this.htmlElement.setAttribute("data-turbolinks-preview",""):this.htmlElement.removeAttribute("data-turbolinks-preview")},t.prototype.renderSnapshot=function(t,r,n){return e.SnapshotRenderer.render(this.delegate,n,this.getSnapshot(),e.Snapshot.wrap(t),r)},t.prototype.renderError=function(t,r){return e.ErrorRenderer.render(this.delegate,r,t)},t}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.ScrollManager=function(){function r(r){this.delegate=r,this.onScroll=t(this.onScroll,this),this.onScroll=e.throttle(this.onScroll)}return r.prototype.start=function(){return this.started?void 0:(addEventListener("scroll",this.onScroll,!1),this.onScroll(),this.started=!0)},r.prototype.stop=function(){return this.started?(removeEventListener("scroll",this.onScroll,!1),this.started=!1):void 0},r.prototype.scrollToElement=function(t){return t.scrollIntoView()},r.prototype.scrollToPosition=function(t){var e,r;return e=t.x,r=t.y,window.scrollTo(e,r)},r.prototype.onScroll=function(t){return this.updatePosition({x:window.pageXOffset,y:window.pageYOffset})},r.prototype.updatePosition=function(t){var e;return this.position=t,null!=(e=this.delegate)?e.scrollPositionChanged(this.position):void 0},r}()}.call(this),function(){e.SnapshotCache=function(){function t(t){this.size=t,this.keys=[],this.snapshots={}}var r;return t.prototype.has=function(t){var e;return e=r(t),e in this.snapshots},t.prototype.get=function(t){var e;if(this.has(t))return e=this.read(t),this.touch(t),e},t.prototype.put=function(t,e){return this.write(t,e),this.touch(t),e},t.prototype.read=function(t){var e;return e=r(t),this.snapshots[e]},t.prototype.write=function(t,e){var n;return n=r(t),this.snapshots[n]=e},t.prototype.touch=function(t){var e,n;return n=r(t),e=this.keys.indexOf(n),e>-1&&this.keys.splice(e,1),this.keys.unshift(n),this.trim()},t.prototype.trim=function(){var t,e,r,n,o;for(n=this.keys.splice(this.size),o=[],t=0,r=n.length;r>t;t++)e=n[t],o.push(delete this.snapshots[e]);return o},r=function(t){return e.Location.wrap(t).toCacheKey()},t}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.Visit=function(){function r(r,n,o){this.controller=r,this.action=o,this.performScroll=t(this.performScroll,this),this.identifier=e.uuid(),this.location=e.Location.wrap(n),this.adapter=this.controller.adapter,this.state="initialized",this.timingMetrics={}}var n;return r.prototype.start=function(){return"initialized"===this.state?(this.recordTimingMetric("visitStart"),this.state="started",this.adapter.visitStarted(this)):void 0},r.prototype.cancel=function(){var t;return"started"===this.state?(null!=(t=this.request)&&t.cancel(),this.cancelRender(),this.state="canceled"):void 0},r.prototype.complete=function(){var t;return"started"===this.state?(this.recordTimingMetric("visitEnd"),this.state="completed","function"==typeof(t=this.adapter).visitCompleted&&t.visitCompleted(this),this.controller.visitCompleted(this)):void 0},r.prototype.fail=function(){var t;return"started"===this.state?(this.state="failed","function"==typeof(t=this.adapter).visitFailed?t.visitFailed(this):void 0):void 0},r.prototype.changeHistory=function(){var t,e;return this.historyChanged?void 0:(t=this.location.isEqualTo(this.referrer)?"replace":this.action,e=n(t),this.controller[e](this.location,this.restorationIdentifier),this.historyChanged=!0)},r.prototype.issueRequest=function(){return this.shouldIssueRequest()&&null==this.request?(this.progress=0,this.request=new e.HttpRequest(this,this.location,this.referrer),this.request.send()):void 0},r.prototype.getCachedSnapshot=function(){var t;return!(t=this.controller.getCachedSnapshotForLocation(this.location))||null!=this.location.anchor&&!t.hasAnchor(this.location.anchor)||"restore"!==this.action&&!t.isPreviewable()?void 0:t},r.prototype.hasCachedSnapshot=function(){return null!=this.getCachedSnapshot()},r.prototype.loadCachedSnapshot=function(){var t,e;return(e=this.getCachedSnapshot())?(t=this.shouldIssueRequest(),this.render(function(){var r;return this.cacheSnapshot(),this.controller.render({snapshot:e,isPreview:t},this.performScroll),"function"==typeof(r=this.adapter).visitRendered&&r.visitRendered(this),t?void 0:this.complete()})):void 0},r.prototype.loadResponse=function(){return null!=this.response?this.render(function(){var t,e;return this.cacheSnapshot(),this.request.failed?(this.controller.render({error:this.response},this.performScroll),"function"==typeof(t=this.adapter).visitRendered&&t.visitRendered(this),this.fail()):(this.controller.render({snapshot:this.response},this.performScroll),"function"==typeof(e=this.adapter).visitRendered&&e.visitRendered(this),this.complete())}):void 0},r.prototype.followRedirect=function(){return this.redirectedToLocation&&!this.followedRedirect?(this.location=this.redirectedToLocation,this.controller.replaceHistoryWithLocationAndRestorationIdentifier(this.redirectedToLocation,this.restorationIdentifier),this.followedRedirect=!0):void 0},r.prototype.requestStarted=function(){var t;return this.recordTimingMetric("requestStart"),"function"==typeof(t=this.adapter).visitRequestStarted?t.visitRequestStarted(this):void 0},r.prototype.requestProgressed=function(t){var e;return this.progress=t,"function"==typeof(e=this.adapter).visitRequestProgressed?e.visitRequestProgressed(this):void 0},r.prototype.requestCompletedWithResponse=function(t,r){return this.response=t,null!=r&&(this.redirectedToLocation=e.Location.wrap(r)),this.adapter.visitRequestCompleted(this)},r.prototype.requestFailedWithStatusCode=function(t,e){return this.response=e,this.adapter.visitRequestFailedWithStatusCode(this,t)},r.prototype.requestFinished=function(){var t;return this.recordTimingMetric("requestEnd"),"function"==typeof(t=this.adapter).visitRequestFinished?t.visitRequestFinished(this):void 0},r.prototype.performScroll=function(){return this.scrolled?void 0:("restore"===this.action?this.scrollToRestoredPosition()||this.scrollToTop():this.scrollToAnchor()||this.scrollToTop(),this.scrolled=!0)},r.prototype.scrollToRestoredPosition=function(){var t,e;return t=null!=(e=this.restorationData)?e.scrollPosition:void 0,null!=t?(this.controller.scrollToPosition(t),!0):void 0},r.prototype.scrollToAnchor=function(){return null!=this.location.anchor?(this.controller.scrollToAnchor(this.location.anchor),!0):void 0},r.prototype.scrollToTop=function(){return this.controller.scrollToPosition({x:0,y:0})},r.prototype.recordTimingMetric=function(t){var e;return null!=(e=this.timingMetrics)[t]?e[t]:e[t]=(new Date).getTime()},r.prototype.getTimingMetrics=function(){return e.copyObject(this.timingMetrics)},n=function(t){switch(t){case"replace":return"replaceHistoryWithLocationAndRestorationIdentifier";case"advance":case"restore":return"pushHistoryWithLocationAndRestorationIdentifier"}},r.prototype.shouldIssueRequest=function(){return"restore"===this.action?!this.hasCachedSnapshot():!0},r.prototype.cacheSnapshot=function(){return this.snapshotCached?void 0:(this.controller.cacheSnapshot(),this.snapshotCached=!0)},r.prototype.render=function(t){return this.cancelRender(),this.frame=requestAnimationFrame(function(e){return function(){return e.frame=null,t.call(e)}}(this))},r.prototype.cancelRender=function(){return this.frame?cancelAnimationFrame(this.frame):void 0},r}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.Controller=function(){function r(){this.clickBubbled=t(this.clickBubbled,this),this.clickCaptured=t(this.clickCaptured,this),this.pageLoaded=t(this.pageLoaded,this),this.history=new e.History(this),this.view=new e.View(this),this.scrollManager=new e.ScrollManager(this),this.restorationData={},this.clearCache(),this.setProgressBarDelay(500)}return r.prototype.start=function(){return e.supported&&!this.started?(addEventListener("click",this.clickCaptured,!0),addEventListener("DOMContentLoaded",this.pageLoaded,!1),this.scrollManager.start(),this.startHistory(),this.started=!0,this.enabled=!0):void 0},r.prototype.disable=function(){return this.enabled=!1},r.prototype.stop=function(){return this.started?(removeEventListener("click",this.clickCaptured,!0),removeEventListener("DOMContentLoaded",this.pageLoaded,!1),this.scrollManager.stop(),this.stopHistory(),this.started=!1):void 0},r.prototype.clearCache=function(){return this.cache=new e.SnapshotCache(10)},r.prototype.visit=function(t,r){var n,o;return null==r&&(r={}),t=e.Location.wrap(t),this.applicationAllowsVisitingLocation(t)?this.locationIsVisitable(t)?(n=null!=(o=r.action)?o:"advance",this.adapter.visitProposedToLocationWithAction(t,n)):window.location=t:void 0},r.prototype.startVisitToLocationWithAction=function(t,r,n){var o;return e.supported?(o=this.getRestorationDataForIdentifier(n),this.startVisit(t,r,{restorationData:o})):window.location=t},r.prototype.setProgressBarDelay=function(t){return this.progressBarDelay=t},r.prototype.startHistory=function(){return this.location=e.Location.wrap(window.location),this.restorationIdentifier=e.uuid(),this.history.start(),this.history.replace(this.location,this.restorationIdentifier)},r.prototype.stopHistory=function(){return this.history.stop()},r.prototype.pushHistoryWithLocationAndRestorationIdentifier=function(t,r){return this.restorationIdentifier=r,this.location=e.Location.wrap(t),this.history.push(this.location,this.restorationIdentifier)},r.prototype.replaceHistoryWithLocationAndRestorationIdentifier=function(t,r){return this.restorationIdentifier=r,this.location=e.Location.wrap(t),this.history.replace(this.location,this.restorationIdentifier)},r.prototype.historyPoppedToLocationWithRestorationIdentifier=function(t,r){var n;return this.restorationIdentifier=r,this.enabled?(n=this.getRestorationDataForIdentifier(this.restorationIdentifier),this.startVisit(t,"restore",{restorationIdentifier:this.restorationIdentifier,restorationData:n,historyChanged:!0}),this.location=e.Location.wrap(t)):this.adapter.pageInvalidated()},r.prototype.getCachedSnapshotForLocation=function(t){var e;return null!=(e=this.cache.get(t))?e.clone():void 0},r.prototype.shouldCacheSnapshot=function(){return this.view.getSnapshot().isCacheable();
},r.prototype.cacheSnapshot=function(){var t,r;return this.shouldCacheSnapshot()?(this.notifyApplicationBeforeCachingSnapshot(),r=this.view.getSnapshot(),t=this.lastRenderedLocation,e.defer(function(e){return function(){return e.cache.put(t,r.clone())}}(this))):void 0},r.prototype.scrollToAnchor=function(t){var e;return(e=this.view.getElementForAnchor(t))?this.scrollToElement(e):this.scrollToPosition({x:0,y:0})},r.prototype.scrollToElement=function(t){return this.scrollManager.scrollToElement(t)},r.prototype.scrollToPosition=function(t){return this.scrollManager.scrollToPosition(t)},r.prototype.scrollPositionChanged=function(t){var e;return e=this.getCurrentRestorationData(),e.scrollPosition=t},r.prototype.render=function(t,e){return this.view.render(t,e)},r.prototype.viewInvalidated=function(){return this.adapter.pageInvalidated()},r.prototype.viewWillRender=function(t){return this.notifyApplicationBeforeRender(t)},r.prototype.viewRendered=function(){return this.lastRenderedLocation=this.currentVisit.location,this.notifyApplicationAfterRender()},r.prototype.pageLoaded=function(){return this.lastRenderedLocation=this.location,this.notifyApplicationAfterPageLoad()},r.prototype.clickCaptured=function(){return removeEventListener("click",this.clickBubbled,!1),addEventListener("click",this.clickBubbled,!1)},r.prototype.clickBubbled=function(t){var e,r,n;return this.enabled&&this.clickEventIsSignificant(t)&&(r=this.getVisitableLinkForNode(t.target))&&(n=this.getVisitableLocationForLink(r))&&this.applicationAllowsFollowingLinkToLocation(r,n)?(t.preventDefault(),e=this.getActionForLink(r),this.visit(n,{action:e})):void 0},r.prototype.applicationAllowsFollowingLinkToLocation=function(t,e){var r;return r=this.notifyApplicationAfterClickingLinkToLocation(t,e),!r.defaultPrevented},r.prototype.applicationAllowsVisitingLocation=function(t){var e;return e=this.notifyApplicationBeforeVisitingLocation(t),!e.defaultPrevented},r.prototype.notifyApplicationAfterClickingLinkToLocation=function(t,r){return e.dispatch("turbolinks:click",{target:t,data:{url:r.absoluteURL},cancelable:!0})},r.prototype.notifyApplicationBeforeVisitingLocation=function(t){return e.dispatch("turbolinks:before-visit",{data:{url:t.absoluteURL},cancelable:!0})},r.prototype.notifyApplicationAfterVisitingLocation=function(t){return e.dispatch("turbolinks:visit",{data:{url:t.absoluteURL}})},r.prototype.notifyApplicationBeforeCachingSnapshot=function(){return e.dispatch("turbolinks:before-cache")},r.prototype.notifyApplicationBeforeRender=function(t){return e.dispatch("turbolinks:before-render",{data:{newBody:t}})},r.prototype.notifyApplicationAfterRender=function(){return e.dispatch("turbolinks:render")},r.prototype.notifyApplicationAfterPageLoad=function(t){return null==t&&(t={}),e.dispatch("turbolinks:load",{data:{url:this.location.absoluteURL,timing:t}})},r.prototype.startVisit=function(t,e,r){var n;return null!=(n=this.currentVisit)&&n.cancel(),this.currentVisit=this.createVisit(t,e,r),this.currentVisit.start(),this.notifyApplicationAfterVisitingLocation(t)},r.prototype.createVisit=function(t,r,n){var o,i,s,a,u;return i=null!=n?n:{},a=i.restorationIdentifier,s=i.restorationData,o=i.historyChanged,u=new e.Visit(this,t,r),u.restorationIdentifier=null!=a?a:e.uuid(),u.restorationData=e.copyObject(s),u.historyChanged=o,u.referrer=this.location,u},r.prototype.visitCompleted=function(t){return this.notifyApplicationAfterPageLoad(t.getTimingMetrics())},r.prototype.clickEventIsSignificant=function(t){return!(t.defaultPrevented||t.target.isContentEditable||t.which>1||t.altKey||t.ctrlKey||t.metaKey||t.shiftKey)},r.prototype.getVisitableLinkForNode=function(t){return this.nodeIsVisitable(t)?e.closest(t,"a[href]:not([target]):not([download])"):void 0},r.prototype.getVisitableLocationForLink=function(t){var r;return r=new e.Location(t.getAttribute("href")),this.locationIsVisitable(r)?r:void 0},r.prototype.getActionForLink=function(t){var e;return null!=(e=t.getAttribute("data-turbolinks-action"))?e:"advance"},r.prototype.nodeIsVisitable=function(t){var r;return(r=e.closest(t,"[data-turbolinks]"))?"false"!==r.getAttribute("data-turbolinks"):!0},r.prototype.locationIsVisitable=function(t){return t.isPrefixedBy(this.view.getRootLocation())&&t.isHTML()},r.prototype.getCurrentRestorationData=function(){return this.getRestorationDataForIdentifier(this.restorationIdentifier)},r.prototype.getRestorationDataForIdentifier=function(t){var e;return null!=(e=this.restorationData)[t]?e[t]:e[t]={}},r}()}.call(this),function(){!function(){var t,e;if((t=e=document.currentScript)&&!e.hasAttribute("data-turbolinks-suppress-warning"))for(;t=t.parentNode;)if(t===document.body)return console.warn("You are loading Turbolinks from a <script> element inside the <body> element. This is probably not what you meant to do!\n\nLoad your application\u2019s JavaScript bundle inside the <head> element instead. <script> elements in <body> are evaluated with each page change.\n\nFor more information, see: https://github.com/turbolinks/turbolinks#working-with-script-elements\n\n\u2014\u2014\nSuppress this warning by adding a `data-turbolinks-suppress-warning` attribute to: %s",e.outerHTML)}()}.call(this),function(){var t,r,n;e.start=function(){return r()?(null==e.controller&&(e.controller=t()),e.controller.start()):void 0},r=function(){return null==window.Turbolinks&&(window.Turbolinks=e),n()},t=function(){var t;return t=new e.Controller,t.adapter=new e.BrowserAdapter(t),t},n=function(){return window.Turbolinks===e},n()&&e.start()}.call(this)}).call(this),"object"==typeof module&&module.exports?module.exports=e:"function"==typeof define&&define.amd&&define(e)}).call(this);
/*! jQuery v3.1.1 | (c) jQuery Foundation | jquery.org/license */

!function(a,b){"use strict";"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){"use strict";var c=[],d=a.document,e=Object.getPrototypeOf,f=c.slice,g=c.concat,h=c.push,i=c.indexOf,j={},k=j.toString,l=j.hasOwnProperty,m=l.toString,n=m.call(Object),o={};function p(a,b){b=b||d;var c=b.createElement("script");c.text=a,b.head.appendChild(c).parentNode.removeChild(c)}var q="3.1.1",r=function(a,b){return new r.fn.init(a,b)},s=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,t=/^-ms-/,u=/-([a-z])/g,v=function(a,b){return b.toUpperCase()};r.fn=r.prototype={jquery:q,constructor:r,length:0,toArray:function(){return f.call(this)},get:function(a){return null==a?f.call(this):a<0?this[a+this.length]:this[a]},pushStack:function(a){var b=r.merge(this.constructor(),a);return b.prevObject=this,b},each:function(a){return r.each(this,a)},map:function(a){return this.pushStack(r.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(f.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(a<0?b:0);return this.pushStack(c>=0&&c<b?[this[c]]:[])},end:function(){return this.prevObject||this.constructor()},push:h,sort:c.sort,splice:c.splice},r.extend=r.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||r.isFunction(g)||(g={}),h===i&&(g=this,h--);h<i;h++)if(null!=(a=arguments[h]))for(b in a)c=g[b],d=a[b],g!==d&&(j&&d&&(r.isPlainObject(d)||(e=r.isArray(d)))?(e?(e=!1,f=c&&r.isArray(c)?c:[]):f=c&&r.isPlainObject(c)?c:{},g[b]=r.extend(j,f,d)):void 0!==d&&(g[b]=d));return g},r.extend({expando:"jQuery"+(q+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===r.type(a)},isArray:Array.isArray,isWindow:function(a){return null!=a&&a===a.window},isNumeric:function(a){var b=r.type(a);return("number"===b||"string"===b)&&!isNaN(a-parseFloat(a))},isPlainObject:function(a){var b,c;return!(!a||"[object Object]"!==k.call(a))&&(!(b=e(a))||(c=l.call(b,"constructor")&&b.constructor,"function"==typeof c&&m.call(c)===n))},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?j[k.call(a)]||"object":typeof a},globalEval:function(a){p(a)},camelCase:function(a){return a.replace(t,"ms-").replace(u,v)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,b){var c,d=0;if(w(a)){for(c=a.length;d<c;d++)if(b.call(a[d],d,a[d])===!1)break}else for(d in a)if(b.call(a[d],d,a[d])===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(s,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(w(Object(a))?r.merge(c,"string"==typeof a?[a]:a):h.call(c,a)),c},inArray:function(a,b,c){return null==b?-1:i.call(b,a,c)},merge:function(a,b){for(var c=+b.length,d=0,e=a.length;d<c;d++)a[e++]=b[d];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;f<g;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,e,f=0,h=[];if(w(a))for(d=a.length;f<d;f++)e=b(a[f],f,c),null!=e&&h.push(e);else for(f in a)e=b(a[f],f,c),null!=e&&h.push(e);return g.apply([],h)},guid:1,proxy:function(a,b){var c,d,e;if("string"==typeof b&&(c=a[b],b=a,a=c),r.isFunction(a))return d=f.call(arguments,2),e=function(){return a.apply(b||this,d.concat(f.call(arguments)))},e.guid=a.guid=a.guid||r.guid++,e},now:Date.now,support:o}),"function"==typeof Symbol&&(r.fn[Symbol.iterator]=c[Symbol.iterator]),r.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(a,b){j["[object "+b+"]"]=b.toLowerCase()});function w(a){var b=!!a&&"length"in a&&a.length,c=r.type(a);return"function"!==c&&!r.isWindow(a)&&("array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a)}var x=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+1*new Date,v=a.document,w=0,x=0,y=ha(),z=ha(),A=ha(),B=function(a,b){return a===b&&(l=!0),0},C={}.hasOwnProperty,D=[],E=D.pop,F=D.push,G=D.push,H=D.slice,I=function(a,b){for(var c=0,d=a.length;c<d;c++)if(a[c]===b)return c;return-1},J="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",K="[\\x20\\t\\r\\n\\f]",L="(?:\\\\.|[\\w-]|[^\0-\\xa0])+",M="\\["+K+"*("+L+")(?:"+K+"*([*^$|!~]?=)"+K+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+L+"))|)"+K+"*\\]",N=":("+L+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+M+")*)|.*)\\)|)",O=new RegExp(K+"+","g"),P=new RegExp("^"+K+"+|((?:^|[^\\\\])(?:\\\\.)*)"+K+"+$","g"),Q=new RegExp("^"+K+"*,"+K+"*"),R=new RegExp("^"+K+"*([>+~]|"+K+")"+K+"*"),S=new RegExp("="+K+"*([^\\]'\"]*?)"+K+"*\\]","g"),T=new RegExp(N),U=new RegExp("^"+L+"$"),V={ID:new RegExp("^#("+L+")"),CLASS:new RegExp("^\\.("+L+")"),TAG:new RegExp("^("+L+"|[*])"),ATTR:new RegExp("^"+M),PSEUDO:new RegExp("^"+N),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+K+"*(even|odd|(([+-]|)(\\d*)n|)"+K+"*(?:([+-]|)"+K+"*(\\d+)|))"+K+"*\\)|)","i"),bool:new RegExp("^(?:"+J+")$","i"),needsContext:new RegExp("^"+K+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+K+"*((?:-\\d)?\\d*)"+K+"*\\)|)(?=[^-]|$)","i")},W=/^(?:input|select|textarea|button)$/i,X=/^h\d$/i,Y=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,$=/[+~]/,_=new RegExp("\\\\([\\da-f]{1,6}"+K+"?|("+K+")|.)","ig"),aa=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:d<0?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)},ba=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,ca=function(a,b){return b?"\0"===a?"\ufffd":a.slice(0,-1)+"\\"+a.charCodeAt(a.length-1).toString(16)+" ":"\\"+a},da=function(){m()},ea=ta(function(a){return a.disabled===!0&&("form"in a||"label"in a)},{dir:"parentNode",next:"legend"});try{G.apply(D=H.call(v.childNodes),v.childNodes),D[v.childNodes.length].nodeType}catch(fa){G={apply:D.length?function(a,b){F.apply(a,H.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function ga(a,b,d,e){var f,h,j,k,l,o,r,s=b&&b.ownerDocument,w=b?b.nodeType:9;if(d=d||[],"string"!=typeof a||!a||1!==w&&9!==w&&11!==w)return d;if(!e&&((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,p)){if(11!==w&&(l=Z.exec(a)))if(f=l[1]){if(9===w){if(!(j=b.getElementById(f)))return d;if(j.id===f)return d.push(j),d}else if(s&&(j=s.getElementById(f))&&t(b,j)&&j.id===f)return d.push(j),d}else{if(l[2])return G.apply(d,b.getElementsByTagName(a)),d;if((f=l[3])&&c.getElementsByClassName&&b.getElementsByClassName)return G.apply(d,b.getElementsByClassName(f)),d}if(c.qsa&&!A[a+" "]&&(!q||!q.test(a))){if(1!==w)s=b,r=a;else if("object"!==b.nodeName.toLowerCase()){(k=b.getAttribute("id"))?k=k.replace(ba,ca):b.setAttribute("id",k=u),o=g(a),h=o.length;while(h--)o[h]="#"+k+" "+sa(o[h]);r=o.join(","),s=$.test(a)&&qa(b.parentNode)||b}if(r)try{return G.apply(d,s.querySelectorAll(r)),d}catch(x){}finally{k===u&&b.removeAttribute("id")}}}return i(a.replace(P,"$1"),b,d,e)}function ha(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function ia(a){return a[u]=!0,a}function ja(a){var b=n.createElement("fieldset");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function ka(a,b){var c=a.split("|"),e=c.length;while(e--)d.attrHandle[c[e]]=b}function la(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&a.sourceIndex-b.sourceIndex;if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function ma(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function na(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function oa(a){return function(b){return"form"in b?b.parentNode&&b.disabled===!1?"label"in b?"label"in b.parentNode?b.parentNode.disabled===a:b.disabled===a:b.isDisabled===a||b.isDisabled!==!a&&ea(b)===a:b.disabled===a:"label"in b&&b.disabled===a}}function pa(a){return ia(function(b){return b=+b,ia(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function qa(a){return a&&"undefined"!=typeof a.getElementsByTagName&&a}c=ga.support={},f=ga.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return!!b&&"HTML"!==b.nodeName},m=ga.setDocument=function(a){var b,e,g=a?a.ownerDocument||a:v;return g!==n&&9===g.nodeType&&g.documentElement?(n=g,o=n.documentElement,p=!f(n),v!==n&&(e=n.defaultView)&&e.top!==e&&(e.addEventListener?e.addEventListener("unload",da,!1):e.attachEvent&&e.attachEvent("onunload",da)),c.attributes=ja(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=ja(function(a){return a.appendChild(n.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=Y.test(n.getElementsByClassName),c.getById=ja(function(a){return o.appendChild(a).id=u,!n.getElementsByName||!n.getElementsByName(u).length}),c.getById?(d.filter.ID=function(a){var b=a.replace(_,aa);return function(a){return a.getAttribute("id")===b}},d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c=b.getElementById(a);return c?[c]:[]}}):(d.filter.ID=function(a){var b=a.replace(_,aa);return function(a){var c="undefined"!=typeof a.getAttributeNode&&a.getAttributeNode("id");return c&&c.value===b}},d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c,d,e,f=b.getElementById(a);if(f){if(c=f.getAttributeNode("id"),c&&c.value===a)return[f];e=b.getElementsByName(a),d=0;while(f=e[d++])if(c=f.getAttributeNode("id"),c&&c.value===a)return[f]}return[]}}),d.find.TAG=c.getElementsByTagName?function(a,b){return"undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName(a):c.qsa?b.querySelectorAll(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){if("undefined"!=typeof b.getElementsByClassName&&p)return b.getElementsByClassName(a)},r=[],q=[],(c.qsa=Y.test(n.querySelectorAll))&&(ja(function(a){o.appendChild(a).innerHTML="<a id='"+u+"'></a><select id='"+u+"-\r\\' msallowcapture=''><option selected=''></option></select>",a.querySelectorAll("[msallowcapture^='']").length&&q.push("[*^$]="+K+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+K+"*(?:value|"+J+")"),a.querySelectorAll("[id~="+u+"-]").length||q.push("~="),a.querySelectorAll(":checked").length||q.push(":checked"),a.querySelectorAll("a#"+u+"+*").length||q.push(".#.+[+~]")}),ja(function(a){a.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var b=n.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+K+"*[*^$|!~]?="),2!==a.querySelectorAll(":enabled").length&&q.push(":enabled",":disabled"),o.appendChild(a).disabled=!0,2!==a.querySelectorAll(":disabled").length&&q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=Y.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&ja(function(a){c.disconnectedMatch=s.call(a,"*"),s.call(a,"[s!='']:x"),r.push("!=",N)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=Y.test(o.compareDocumentPosition),t=b||Y.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===n||a.ownerDocument===v&&t(v,a)?-1:b===n||b.ownerDocument===v&&t(v,b)?1:k?I(k,a)-I(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,e=a.parentNode,f=b.parentNode,g=[a],h=[b];if(!e||!f)return a===n?-1:b===n?1:e?-1:f?1:k?I(k,a)-I(k,b):0;if(e===f)return la(a,b);c=a;while(c=c.parentNode)g.unshift(c);c=b;while(c=c.parentNode)h.unshift(c);while(g[d]===h[d])d++;return d?la(g[d],h[d]):g[d]===v?-1:h[d]===v?1:0},n):n},ga.matches=function(a,b){return ga(a,null,null,b)},ga.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(S,"='$1']"),c.matchesSelector&&p&&!A[b+" "]&&(!r||!r.test(b))&&(!q||!q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return ga(b,n,null,[a]).length>0},ga.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},ga.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&C.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},ga.escape=function(a){return(a+"").replace(ba,ca)},ga.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},ga.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=ga.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=ga.selectors={cacheLength:50,createPseudo:ia,match:V,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(_,aa),a[3]=(a[3]||a[4]||a[5]||"").replace(_,aa),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||ga.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&ga.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return V.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&T.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(_,aa).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+K+")"+a+"("+K+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||"undefined"!=typeof a.getAttribute&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=ga.attr(d,a);return null==e?"!="===b:!b||(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e.replace(O," ")+" ").indexOf(c)>-1:"|="===b&&(e===c||e.slice(0,c.length+1)===c+"-"))}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h,t=!1;if(q){if(f){while(p){m=b;while(m=m[p])if(h?m.nodeName.toLowerCase()===r:1===m.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){m=q,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n&&j[2],m=n&&q.childNodes[n];while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if(1===m.nodeType&&++t&&m===b){k[a]=[w,n,t];break}}else if(s&&(m=b,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n),t===!1)while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if((h?m.nodeName.toLowerCase()===r:1===m.nodeType)&&++t&&(s&&(l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),k[a]=[w,t]),m===b))break;return t-=e,t===d||t%d===0&&t/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||ga.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?ia(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=I(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:ia(function(a){var b=[],c=[],d=h(a.replace(P,"$1"));return d[u]?ia(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),b[0]=null,!c.pop()}}),has:ia(function(a){return function(b){return ga(a,b).length>0}}),contains:ia(function(a){return a=a.replace(_,aa),function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:ia(function(a){return U.test(a||"")||ga.error("unsupported lang: "+a),a=a.replace(_,aa).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:oa(!1),disabled:oa(!0),checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return X.test(a.nodeName)},input:function(a){return W.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:pa(function(){return[0]}),last:pa(function(a,b){return[b-1]}),eq:pa(function(a,b,c){return[c<0?c+b:c]}),even:pa(function(a,b){for(var c=0;c<b;c+=2)a.push(c);return a}),odd:pa(function(a,b){for(var c=1;c<b;c+=2)a.push(c);return a}),lt:pa(function(a,b,c){for(var d=c<0?c+b:c;--d>=0;)a.push(d);return a}),gt:pa(function(a,b,c){for(var d=c<0?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=ma(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=na(b);function ra(){}ra.prototype=d.filters=d.pseudos,d.setFilters=new ra,g=ga.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){c&&!(e=Q.exec(h))||(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=R.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(P," ")}),h=h.slice(c.length));for(g in d.filter)!(e=V[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?ga.error(a):z(a,i).slice(0)};function sa(a){for(var b=0,c=a.length,d="";b<c;b++)d+=a[b].value;return d}function ta(a,b,c){var d=b.dir,e=b.next,f=e||d,g=c&&"parentNode"===f,h=x++;return b.first?function(b,c,e){while(b=b[d])if(1===b.nodeType||g)return a(b,c,e);return!1}:function(b,c,i){var j,k,l,m=[w,h];if(i){while(b=b[d])if((1===b.nodeType||g)&&a(b,c,i))return!0}else while(b=b[d])if(1===b.nodeType||g)if(l=b[u]||(b[u]={}),k=l[b.uniqueID]||(l[b.uniqueID]={}),e&&e===b.nodeName.toLowerCase())b=b[d]||b;else{if((j=k[f])&&j[0]===w&&j[1]===h)return m[2]=j[2];if(k[f]=m,m[2]=a(b,c,i))return!0}return!1}}function ua(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function va(a,b,c){for(var d=0,e=b.length;d<e;d++)ga(a,b[d],c);return c}function wa(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;h<i;h++)(f=a[h])&&(c&&!c(f,d,e)||(g.push(f),j&&b.push(h)));return g}function xa(a,b,c,d,e,f){return d&&!d[u]&&(d=xa(d)),e&&!e[u]&&(e=xa(e,f)),ia(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||va(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:wa(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=wa(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?I(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=wa(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):G.apply(g,r)})}function ya(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=ta(function(a){return a===b},h,!0),l=ta(function(a){return I(b,a)>-1},h,!0),m=[function(a,c,d){var e=!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d));return b=null,e}];i<f;i++)if(c=d.relative[a[i].type])m=[ta(ua(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;e<f;e++)if(d.relative[a[e].type])break;return xa(i>1&&ua(m),i>1&&sa(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(P,"$1"),c,i<e&&ya(a.slice(i,e)),e<f&&ya(a=a.slice(e)),e<f&&sa(a))}m.push(c)}return ua(m)}function za(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,o,q,r=0,s="0",t=f&&[],u=[],v=j,x=f||e&&d.find.TAG("*",k),y=w+=null==v?1:Math.random()||.1,z=x.length;for(k&&(j=g===n||g||k);s!==z&&null!=(l=x[s]);s++){if(e&&l){o=0,g||l.ownerDocument===n||(m(l),h=!p);while(q=a[o++])if(q(l,g||n,h)){i.push(l);break}k&&(w=y)}c&&((l=!q&&l)&&r--,f&&t.push(l))}if(r+=s,c&&s!==r){o=0;while(q=b[o++])q(t,u,g,h);if(f){if(r>0)while(s--)t[s]||u[s]||(u[s]=E.call(i));u=wa(u)}G.apply(i,u),k&&!f&&u.length>0&&r+b.length>1&&ga.uniqueSort(i)}return k&&(w=y,j=v),t};return c?ia(f):f}return h=ga.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=ya(b[c]),f[u]?d.push(f):e.push(f);f=A(a,za(e,d)),f.selector=a}return f},i=ga.select=function(a,b,c,e){var f,i,j,k,l,m="function"==typeof a&&a,n=!e&&g(a=m.selector||a);if(c=c||[],1===n.length){if(i=n[0]=n[0].slice(0),i.length>2&&"ID"===(j=i[0]).type&&9===b.nodeType&&p&&d.relative[i[1].type]){if(b=(d.find.ID(j.matches[0].replace(_,aa),b)||[])[0],!b)return c;m&&(b=b.parentNode),a=a.slice(i.shift().value.length)}f=V.needsContext.test(a)?0:i.length;while(f--){if(j=i[f],d.relative[k=j.type])break;if((l=d.find[k])&&(e=l(j.matches[0].replace(_,aa),$.test(i[0].type)&&qa(b.parentNode)||b))){if(i.splice(f,1),a=e.length&&sa(i),!a)return G.apply(c,e),c;break}}}return(m||h(a,n))(e,b,!p,c,!b||$.test(a)&&qa(b.parentNode)||b),c},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=ja(function(a){return 1&a.compareDocumentPosition(n.createElement("fieldset"))}),ja(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||ka("type|href|height|width",function(a,b,c){if(!c)return a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&ja(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||ka("value",function(a,b,c){if(!c&&"input"===a.nodeName.toLowerCase())return a.defaultValue}),ja(function(a){return null==a.getAttribute("disabled")})||ka(J,function(a,b,c){var d;if(!c)return a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),ga}(a);r.find=x,r.expr=x.selectors,r.expr[":"]=r.expr.pseudos,r.uniqueSort=r.unique=x.uniqueSort,r.text=x.getText,r.isXMLDoc=x.isXML,r.contains=x.contains,r.escapeSelector=x.escape;var y=function(a,b,c){var d=[],e=void 0!==c;while((a=a[b])&&9!==a.nodeType)if(1===a.nodeType){if(e&&r(a).is(c))break;d.push(a)}return d},z=function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c},A=r.expr.match.needsContext,B=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i,C=/^.[^:#\[\.,]*$/;function D(a,b,c){return r.isFunction(b)?r.grep(a,function(a,d){return!!b.call(a,d,a)!==c}):b.nodeType?r.grep(a,function(a){return a===b!==c}):"string"!=typeof b?r.grep(a,function(a){return i.call(b,a)>-1!==c}):C.test(b)?r.filter(b,a,c):(b=r.filter(b,a),r.grep(a,function(a){return i.call(b,a)>-1!==c&&1===a.nodeType}))}r.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?r.find.matchesSelector(d,a)?[d]:[]:r.find.matches(a,r.grep(b,function(a){return 1===a.nodeType}))},r.fn.extend({find:function(a){var b,c,d=this.length,e=this;if("string"!=typeof a)return this.pushStack(r(a).filter(function(){for(b=0;b<d;b++)if(r.contains(e[b],this))return!0}));for(c=this.pushStack([]),b=0;b<d;b++)r.find(a,e[b],c);return d>1?r.uniqueSort(c):c},filter:function(a){return this.pushStack(D(this,a||[],!1))},not:function(a){return this.pushStack(D(this,a||[],!0))},is:function(a){return!!D(this,"string"==typeof a&&A.test(a)?r(a):a||[],!1).length}});var E,F=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,G=r.fn.init=function(a,b,c){var e,f;if(!a)return this;if(c=c||E,"string"==typeof a){if(e="<"===a[0]&&">"===a[a.length-1]&&a.length>=3?[null,a,null]:F.exec(a),!e||!e[1]&&b)return!b||b.jquery?(b||c).find(a):this.constructor(b).find(a);if(e[1]){if(b=b instanceof r?b[0]:b,r.merge(this,r.parseHTML(e[1],b&&b.nodeType?b.ownerDocument||b:d,!0)),B.test(e[1])&&r.isPlainObject(b))for(e in b)r.isFunction(this[e])?this[e](b[e]):this.attr(e,b[e]);return this}return f=d.getElementById(e[2]),f&&(this[0]=f,this.length=1),this}return a.nodeType?(this[0]=a,this.length=1,this):r.isFunction(a)?void 0!==c.ready?c.ready(a):a(r):r.makeArray(a,this)};G.prototype=r.fn,E=r(d);var H=/^(?:parents|prev(?:Until|All))/,I={children:!0,contents:!0,next:!0,prev:!0};r.fn.extend({has:function(a){var b=r(a,this),c=b.length;return this.filter(function(){for(var a=0;a<c;a++)if(r.contains(this,b[a]))return!0})},closest:function(a,b){var c,d=0,e=this.length,f=[],g="string"!=typeof a&&r(a);if(!A.test(a))for(;d<e;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&r.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?r.uniqueSort(f):f)},index:function(a){return a?"string"==typeof a?i.call(r(a),this[0]):i.call(this,a.jquery?a[0]:a):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(r.uniqueSort(r.merge(this.get(),r(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function J(a,b){while((a=a[b])&&1!==a.nodeType);return a}r.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return y(a,"parentNode")},parentsUntil:function(a,b,c){return y(a,"parentNode",c)},next:function(a){return J(a,"nextSibling")},prev:function(a){return J(a,"previousSibling")},nextAll:function(a){return y(a,"nextSibling")},prevAll:function(a){return y(a,"previousSibling")},nextUntil:function(a,b,c){return y(a,"nextSibling",c)},prevUntil:function(a,b,c){return y(a,"previousSibling",c)},siblings:function(a){return z((a.parentNode||{}).firstChild,a)},children:function(a){return z(a.firstChild)},contents:function(a){return a.contentDocument||r.merge([],a.childNodes)}},function(a,b){r.fn[a]=function(c,d){var e=r.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=r.filter(d,e)),this.length>1&&(I[a]||r.uniqueSort(e),H.test(a)&&e.reverse()),this.pushStack(e)}});var K=/[^\x20\t\r\n\f]+/g;function L(a){var b={};return r.each(a.match(K)||[],function(a,c){b[c]=!0}),b}r.Callbacks=function(a){a="string"==typeof a?L(a):r.extend({},a);var b,c,d,e,f=[],g=[],h=-1,i=function(){for(e=a.once,d=b=!0;g.length;h=-1){c=g.shift();while(++h<f.length)f[h].apply(c[0],c[1])===!1&&a.stopOnFalse&&(h=f.length,c=!1)}a.memory||(c=!1),b=!1,e&&(f=c?[]:"")},j={add:function(){return f&&(c&&!b&&(h=f.length-1,g.push(c)),function d(b){r.each(b,function(b,c){r.isFunction(c)?a.unique&&j.has(c)||f.push(c):c&&c.length&&"string"!==r.type(c)&&d(c)})}(arguments),c&&!b&&i()),this},remove:function(){return r.each(arguments,function(a,b){var c;while((c=r.inArray(b,f,c))>-1)f.splice(c,1),c<=h&&h--}),this},has:function(a){return a?r.inArray(a,f)>-1:f.length>0},empty:function(){return f&&(f=[]),this},disable:function(){return e=g=[],f=c="",this},disabled:function(){return!f},lock:function(){return e=g=[],c||b||(f=c=""),this},locked:function(){return!!e},fireWith:function(a,c){return e||(c=c||[],c=[a,c.slice?c.slice():c],g.push(c),b||i()),this},fire:function(){return j.fireWith(this,arguments),this},fired:function(){return!!d}};return j};function M(a){return a}function N(a){throw a}function O(a,b,c){var d;try{a&&r.isFunction(d=a.promise)?d.call(a).done(b).fail(c):a&&r.isFunction(d=a.then)?d.call(a,b,c):b.call(void 0,a)}catch(a){c.call(void 0,a)}}r.extend({Deferred:function(b){var c=[["notify","progress",r.Callbacks("memory"),r.Callbacks("memory"),2],["resolve","done",r.Callbacks("once memory"),r.Callbacks("once memory"),0,"resolved"],["reject","fail",r.Callbacks("once memory"),r.Callbacks("once memory"),1,"rejected"]],d="pending",e={state:function(){return d},always:function(){return f.done(arguments).fail(arguments),this},"catch":function(a){return e.then(null,a)},pipe:function(){var a=arguments;return r.Deferred(function(b){r.each(c,function(c,d){var e=r.isFunction(a[d[4]])&&a[d[4]];f[d[1]](function(){var a=e&&e.apply(this,arguments);a&&r.isFunction(a.promise)?a.promise().progress(b.notify).done(b.resolve).fail(b.reject):b[d[0]+"With"](this,e?[a]:arguments)})}),a=null}).promise()},then:function(b,d,e){var f=0;function g(b,c,d,e){return function(){var h=this,i=arguments,j=function(){var a,j;if(!(b<f)){if(a=d.apply(h,i),a===c.promise())throw new TypeError("Thenable self-resolution");j=a&&("object"==typeof a||"function"==typeof a)&&a.then,r.isFunction(j)?e?j.call(a,g(f,c,M,e),g(f,c,N,e)):(f++,j.call(a,g(f,c,M,e),g(f,c,N,e),g(f,c,M,c.notifyWith))):(d!==M&&(h=void 0,i=[a]),(e||c.resolveWith)(h,i))}},k=e?j:function(){try{j()}catch(a){r.Deferred.exceptionHook&&r.Deferred.exceptionHook(a,k.stackTrace),b+1>=f&&(d!==N&&(h=void 0,i=[a]),c.rejectWith(h,i))}};b?k():(r.Deferred.getStackHook&&(k.stackTrace=r.Deferred.getStackHook()),a.setTimeout(k))}}return r.Deferred(function(a){c[0][3].add(g(0,a,r.isFunction(e)?e:M,a.notifyWith)),c[1][3].add(g(0,a,r.isFunction(b)?b:M)),c[2][3].add(g(0,a,r.isFunction(d)?d:N))}).promise()},promise:function(a){return null!=a?r.extend(a,e):e}},f={};return r.each(c,function(a,b){var g=b[2],h=b[5];e[b[1]]=g.add,h&&g.add(function(){d=h},c[3-a][2].disable,c[0][2].lock),g.add(b[3].fire),f[b[0]]=function(){return f[b[0]+"With"](this===f?void 0:this,arguments),this},f[b[0]+"With"]=g.fireWith}),e.promise(f),b&&b.call(f,f),f},when:function(a){var b=arguments.length,c=b,d=Array(c),e=f.call(arguments),g=r.Deferred(),h=function(a){return function(c){d[a]=this,e[a]=arguments.length>1?f.call(arguments):c,--b||g.resolveWith(d,e)}};if(b<=1&&(O(a,g.done(h(c)).resolve,g.reject),"pending"===g.state()||r.isFunction(e[c]&&e[c].then)))return g.then();while(c--)O(e[c],h(c),g.reject);return g.promise()}});var P=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;r.Deferred.exceptionHook=function(b,c){a.console&&a.console.warn&&b&&P.test(b.name)&&a.console.warn("jQuery.Deferred exception: "+b.message,b.stack,c)},r.readyException=function(b){a.setTimeout(function(){throw b})};var Q=r.Deferred();r.fn.ready=function(a){return Q.then(a)["catch"](function(a){r.readyException(a)}),this},r.extend({isReady:!1,readyWait:1,holdReady:function(a){a?r.readyWait++:r.ready(!0)},ready:function(a){(a===!0?--r.readyWait:r.isReady)||(r.isReady=!0,a!==!0&&--r.readyWait>0||Q.resolveWith(d,[r]))}}),r.ready.then=Q.then;function R(){d.removeEventListener("DOMContentLoaded",R),
a.removeEventListener("load",R),r.ready()}"complete"===d.readyState||"loading"!==d.readyState&&!d.documentElement.doScroll?a.setTimeout(r.ready):(d.addEventListener("DOMContentLoaded",R),a.addEventListener("load",R));var S=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===r.type(c)){e=!0;for(h in c)S(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,r.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(r(a),c)})),b))for(;h<i;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f},T=function(a){return 1===a.nodeType||9===a.nodeType||!+a.nodeType};function U(){this.expando=r.expando+U.uid++}U.uid=1,U.prototype={cache:function(a){var b=a[this.expando];return b||(b={},T(a)&&(a.nodeType?a[this.expando]=b:Object.defineProperty(a,this.expando,{value:b,configurable:!0}))),b},set:function(a,b,c){var d,e=this.cache(a);if("string"==typeof b)e[r.camelCase(b)]=c;else for(d in b)e[r.camelCase(d)]=b[d];return e},get:function(a,b){return void 0===b?this.cache(a):a[this.expando]&&a[this.expando][r.camelCase(b)]},access:function(a,b,c){return void 0===b||b&&"string"==typeof b&&void 0===c?this.get(a,b):(this.set(a,b,c),void 0!==c?c:b)},remove:function(a,b){var c,d=a[this.expando];if(void 0!==d){if(void 0!==b){r.isArray(b)?b=b.map(r.camelCase):(b=r.camelCase(b),b=b in d?[b]:b.match(K)||[]),c=b.length;while(c--)delete d[b[c]]}(void 0===b||r.isEmptyObject(d))&&(a.nodeType?a[this.expando]=void 0:delete a[this.expando])}},hasData:function(a){var b=a[this.expando];return void 0!==b&&!r.isEmptyObject(b)}};var V=new U,W=new U,X=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,Y=/[A-Z]/g;function Z(a){return"true"===a||"false"!==a&&("null"===a?null:a===+a+""?+a:X.test(a)?JSON.parse(a):a)}function $(a,b,c){var d;if(void 0===c&&1===a.nodeType)if(d="data-"+b.replace(Y,"-$&").toLowerCase(),c=a.getAttribute(d),"string"==typeof c){try{c=Z(c)}catch(e){}W.set(a,b,c)}else c=void 0;return c}r.extend({hasData:function(a){return W.hasData(a)||V.hasData(a)},data:function(a,b,c){return W.access(a,b,c)},removeData:function(a,b){W.remove(a,b)},_data:function(a,b,c){return V.access(a,b,c)},_removeData:function(a,b){V.remove(a,b)}}),r.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=W.get(f),1===f.nodeType&&!V.get(f,"hasDataAttrs"))){c=g.length;while(c--)g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=r.camelCase(d.slice(5)),$(f,d,e[d])));V.set(f,"hasDataAttrs",!0)}return e}return"object"==typeof a?this.each(function(){W.set(this,a)}):S(this,function(b){var c;if(f&&void 0===b){if(c=W.get(f,a),void 0!==c)return c;if(c=$(f,a),void 0!==c)return c}else this.each(function(){W.set(this,a,b)})},null,b,arguments.length>1,null,!0)},removeData:function(a){return this.each(function(){W.remove(this,a)})}}),r.extend({queue:function(a,b,c){var d;if(a)return b=(b||"fx")+"queue",d=V.get(a,b),c&&(!d||r.isArray(c)?d=V.access(a,b,r.makeArray(c)):d.push(c)),d||[]},dequeue:function(a,b){b=b||"fx";var c=r.queue(a,b),d=c.length,e=c.shift(),f=r._queueHooks(a,b),g=function(){r.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return V.get(a,c)||V.access(a,c,{empty:r.Callbacks("once memory").add(function(){V.remove(a,[b+"queue",c])})})}}),r.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?r.queue(this[0],a):void 0===b?this:this.each(function(){var c=r.queue(this,a,b);r._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&r.dequeue(this,a)})},dequeue:function(a){return this.each(function(){r.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=r.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=V.get(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var _=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,aa=new RegExp("^(?:([+-])=|)("+_+")([a-z%]*)$","i"),ba=["Top","Right","Bottom","Left"],ca=function(a,b){return a=b||a,"none"===a.style.display||""===a.style.display&&r.contains(a.ownerDocument,a)&&"none"===r.css(a,"display")},da=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e};function ea(a,b,c,d){var e,f=1,g=20,h=d?function(){return d.cur()}:function(){return r.css(a,b,"")},i=h(),j=c&&c[3]||(r.cssNumber[b]?"":"px"),k=(r.cssNumber[b]||"px"!==j&&+i)&&aa.exec(r.css(a,b));if(k&&k[3]!==j){j=j||k[3],c=c||[],k=+i||1;do f=f||".5",k/=f,r.style(a,b,k+j);while(f!==(f=h()/i)&&1!==f&&--g)}return c&&(k=+k||+i||0,e=c[1]?k+(c[1]+1)*c[2]:+c[2],d&&(d.unit=j,d.start=k,d.end=e)),e}var fa={};function ga(a){var b,c=a.ownerDocument,d=a.nodeName,e=fa[d];return e?e:(b=c.body.appendChild(c.createElement(d)),e=r.css(b,"display"),b.parentNode.removeChild(b),"none"===e&&(e="block"),fa[d]=e,e)}function ha(a,b){for(var c,d,e=[],f=0,g=a.length;f<g;f++)d=a[f],d.style&&(c=d.style.display,b?("none"===c&&(e[f]=V.get(d,"display")||null,e[f]||(d.style.display="")),""===d.style.display&&ca(d)&&(e[f]=ga(d))):"none"!==c&&(e[f]="none",V.set(d,"display",c)));for(f=0;f<g;f++)null!=e[f]&&(a[f].style.display=e[f]);return a}r.fn.extend({show:function(){return ha(this,!0)},hide:function(){return ha(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){ca(this)?r(this).show():r(this).hide()})}});var ia=/^(?:checkbox|radio)$/i,ja=/<([a-z][^\/\0>\x20\t\r\n\f]+)/i,ka=/^$|\/(?:java|ecma)script/i,la={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};la.optgroup=la.option,la.tbody=la.tfoot=la.colgroup=la.caption=la.thead,la.th=la.td;function ma(a,b){var c;return c="undefined"!=typeof a.getElementsByTagName?a.getElementsByTagName(b||"*"):"undefined"!=typeof a.querySelectorAll?a.querySelectorAll(b||"*"):[],void 0===b||b&&r.nodeName(a,b)?r.merge([a],c):c}function na(a,b){for(var c=0,d=a.length;c<d;c++)V.set(a[c],"globalEval",!b||V.get(b[c],"globalEval"))}var oa=/<|&#?\w+;/;function pa(a,b,c,d,e){for(var f,g,h,i,j,k,l=b.createDocumentFragment(),m=[],n=0,o=a.length;n<o;n++)if(f=a[n],f||0===f)if("object"===r.type(f))r.merge(m,f.nodeType?[f]:f);else if(oa.test(f)){g=g||l.appendChild(b.createElement("div")),h=(ja.exec(f)||["",""])[1].toLowerCase(),i=la[h]||la._default,g.innerHTML=i[1]+r.htmlPrefilter(f)+i[2],k=i[0];while(k--)g=g.lastChild;r.merge(m,g.childNodes),g=l.firstChild,g.textContent=""}else m.push(b.createTextNode(f));l.textContent="",n=0;while(f=m[n++])if(d&&r.inArray(f,d)>-1)e&&e.push(f);else if(j=r.contains(f.ownerDocument,f),g=ma(l.appendChild(f),"script"),j&&na(g),c){k=0;while(f=g[k++])ka.test(f.type||"")&&c.push(f)}return l}!function(){var a=d.createDocumentFragment(),b=a.appendChild(d.createElement("div")),c=d.createElement("input");c.setAttribute("type","radio"),c.setAttribute("checked","checked"),c.setAttribute("name","t"),b.appendChild(c),o.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,b.innerHTML="<textarea>x</textarea>",o.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue}();var qa=d.documentElement,ra=/^key/,sa=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,ta=/^([^.]*)(?:\.(.+)|)/;function ua(){return!0}function va(){return!1}function wa(){try{return d.activeElement}catch(a){}}function xa(a,b,c,d,e,f){var g,h;if("object"==typeof b){"string"!=typeof c&&(d=d||c,c=void 0);for(h in b)xa(a,h,c,d,b[h],f);return a}if(null==d&&null==e?(e=c,d=c=void 0):null==e&&("string"==typeof c?(e=d,d=void 0):(e=d,d=c,c=void 0)),e===!1)e=va;else if(!e)return a;return 1===f&&(g=e,e=function(a){return r().off(a),g.apply(this,arguments)},e.guid=g.guid||(g.guid=r.guid++)),a.each(function(){r.event.add(this,b,e,d,c)})}r.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q=V.get(a);if(q){c.handler&&(f=c,c=f.handler,e=f.selector),e&&r.find.matchesSelector(qa,e),c.guid||(c.guid=r.guid++),(i=q.events)||(i=q.events={}),(g=q.handle)||(g=q.handle=function(b){return"undefined"!=typeof r&&r.event.triggered!==b.type?r.event.dispatch.apply(a,arguments):void 0}),b=(b||"").match(K)||[""],j=b.length;while(j--)h=ta.exec(b[j])||[],n=p=h[1],o=(h[2]||"").split(".").sort(),n&&(l=r.event.special[n]||{},n=(e?l.delegateType:l.bindType)||n,l=r.event.special[n]||{},k=r.extend({type:n,origType:p,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&r.expr.match.needsContext.test(e),namespace:o.join(".")},f),(m=i[n])||(m=i[n]=[],m.delegateCount=0,l.setup&&l.setup.call(a,d,o,g)!==!1||a.addEventListener&&a.addEventListener(n,g)),l.add&&(l.add.call(a,k),k.handler.guid||(k.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,k):m.push(k),r.event.global[n]=!0)}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q=V.hasData(a)&&V.get(a);if(q&&(i=q.events)){b=(b||"").match(K)||[""],j=b.length;while(j--)if(h=ta.exec(b[j])||[],n=p=h[1],o=(h[2]||"").split(".").sort(),n){l=r.event.special[n]||{},n=(d?l.delegateType:l.bindType)||n,m=i[n]||[],h=h[2]&&new RegExp("(^|\\.)"+o.join("\\.(?:.*\\.|)")+"(\\.|$)"),g=f=m.length;while(f--)k=m[f],!e&&p!==k.origType||c&&c.guid!==k.guid||h&&!h.test(k.namespace)||d&&d!==k.selector&&("**"!==d||!k.selector)||(m.splice(f,1),k.selector&&m.delegateCount--,l.remove&&l.remove.call(a,k));g&&!m.length&&(l.teardown&&l.teardown.call(a,o,q.handle)!==!1||r.removeEvent(a,n,q.handle),delete i[n])}else for(n in i)r.event.remove(a,n+b[j],c,d,!0);r.isEmptyObject(i)&&V.remove(a,"handle events")}},dispatch:function(a){var b=r.event.fix(a),c,d,e,f,g,h,i=new Array(arguments.length),j=(V.get(this,"events")||{})[b.type]||[],k=r.event.special[b.type]||{};for(i[0]=b,c=1;c<arguments.length;c++)i[c]=arguments[c];if(b.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,b)!==!1){h=r.event.handlers.call(this,b,j),c=0;while((f=h[c++])&&!b.isPropagationStopped()){b.currentTarget=f.elem,d=0;while((g=f.handlers[d++])&&!b.isImmediatePropagationStopped())b.rnamespace&&!b.rnamespace.test(g.namespace)||(b.handleObj=g,b.data=g.data,e=((r.event.special[g.origType]||{}).handle||g.handler).apply(f.elem,i),void 0!==e&&(b.result=e)===!1&&(b.preventDefault(),b.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,b),b.result}},handlers:function(a,b){var c,d,e,f,g,h=[],i=b.delegateCount,j=a.target;if(i&&j.nodeType&&!("click"===a.type&&a.button>=1))for(;j!==this;j=j.parentNode||this)if(1===j.nodeType&&("click"!==a.type||j.disabled!==!0)){for(f=[],g={},c=0;c<i;c++)d=b[c],e=d.selector+" ",void 0===g[e]&&(g[e]=d.needsContext?r(e,this).index(j)>-1:r.find(e,this,null,[j]).length),g[e]&&f.push(d);f.length&&h.push({elem:j,handlers:f})}return j=this,i<b.length&&h.push({elem:j,handlers:b.slice(i)}),h},addProp:function(a,b){Object.defineProperty(r.Event.prototype,a,{enumerable:!0,configurable:!0,get:r.isFunction(b)?function(){if(this.originalEvent)return b(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[a]},set:function(b){Object.defineProperty(this,a,{enumerable:!0,configurable:!0,writable:!0,value:b})}})},fix:function(a){return a[r.expando]?a:new r.Event(a)},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==wa()&&this.focus)return this.focus(),!1},delegateType:"focusin"},blur:{trigger:function(){if(this===wa()&&this.blur)return this.blur(),!1},delegateType:"focusout"},click:{trigger:function(){if("checkbox"===this.type&&this.click&&r.nodeName(this,"input"))return this.click(),!1},_default:function(a){return r.nodeName(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}}},r.removeEvent=function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c)},r.Event=function(a,b){return this instanceof r.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?ua:va,this.target=a.target&&3===a.target.nodeType?a.target.parentNode:a.target,this.currentTarget=a.currentTarget,this.relatedTarget=a.relatedTarget):this.type=a,b&&r.extend(this,b),this.timeStamp=a&&a.timeStamp||r.now(),void(this[r.expando]=!0)):new r.Event(a,b)},r.Event.prototype={constructor:r.Event,isDefaultPrevented:va,isPropagationStopped:va,isImmediatePropagationStopped:va,isSimulated:!1,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=ua,a&&!this.isSimulated&&a.preventDefault()},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=ua,a&&!this.isSimulated&&a.stopPropagation()},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=ua,a&&!this.isSimulated&&a.stopImmediatePropagation(),this.stopPropagation()}},r.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,"char":!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:function(a){var b=a.button;return null==a.which&&ra.test(a.type)?null!=a.charCode?a.charCode:a.keyCode:!a.which&&void 0!==b&&sa.test(a.type)?1&b?1:2&b?3:4&b?2:0:a.which}},r.event.addProp),r.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){r.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return e&&(e===d||r.contains(d,e))||(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),r.fn.extend({on:function(a,b,c,d){return xa(this,a,b,c,d)},one:function(a,b,c,d){return xa(this,a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,r(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return b!==!1&&"function"!=typeof b||(c=b,b=void 0),c===!1&&(c=va),this.each(function(){r.event.remove(this,a,c,b)})}});var ya=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,za=/<script|<style|<link/i,Aa=/checked\s*(?:[^=]|=\s*.checked.)/i,Ba=/^true\/(.*)/,Ca=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function Da(a,b){return r.nodeName(a,"table")&&r.nodeName(11!==b.nodeType?b:b.firstChild,"tr")?a.getElementsByTagName("tbody")[0]||a:a}function Ea(a){return a.type=(null!==a.getAttribute("type"))+"/"+a.type,a}function Fa(a){var b=Ba.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function Ga(a,b){var c,d,e,f,g,h,i,j;if(1===b.nodeType){if(V.hasData(a)&&(f=V.access(a),g=V.set(b,f),j=f.events)){delete g.handle,g.events={};for(e in j)for(c=0,d=j[e].length;c<d;c++)r.event.add(b,e,j[e][c])}W.hasData(a)&&(h=W.access(a),i=r.extend({},h),W.set(b,i))}}function Ha(a,b){var c=b.nodeName.toLowerCase();"input"===c&&ia.test(a.type)?b.checked=a.checked:"input"!==c&&"textarea"!==c||(b.defaultValue=a.defaultValue)}function Ia(a,b,c,d){b=g.apply([],b);var e,f,h,i,j,k,l=0,m=a.length,n=m-1,q=b[0],s=r.isFunction(q);if(s||m>1&&"string"==typeof q&&!o.checkClone&&Aa.test(q))return a.each(function(e){var f=a.eq(e);s&&(b[0]=q.call(this,e,f.html())),Ia(f,b,c,d)});if(m&&(e=pa(b,a[0].ownerDocument,!1,a,d),f=e.firstChild,1===e.childNodes.length&&(e=f),f||d)){for(h=r.map(ma(e,"script"),Ea),i=h.length;l<m;l++)j=e,l!==n&&(j=r.clone(j,!0,!0),i&&r.merge(h,ma(j,"script"))),c.call(a[l],j,l);if(i)for(k=h[h.length-1].ownerDocument,r.map(h,Fa),l=0;l<i;l++)j=h[l],ka.test(j.type||"")&&!V.access(j,"globalEval")&&r.contains(k,j)&&(j.src?r._evalUrl&&r._evalUrl(j.src):p(j.textContent.replace(Ca,""),k))}return a}function Ja(a,b,c){for(var d,e=b?r.filter(b,a):a,f=0;null!=(d=e[f]);f++)c||1!==d.nodeType||r.cleanData(ma(d)),d.parentNode&&(c&&r.contains(d.ownerDocument,d)&&na(ma(d,"script")),d.parentNode.removeChild(d));return a}r.extend({htmlPrefilter:function(a){return a.replace(ya,"<$1></$2>")},clone:function(a,b,c){var d,e,f,g,h=a.cloneNode(!0),i=r.contains(a.ownerDocument,a);if(!(o.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||r.isXMLDoc(a)))for(g=ma(h),f=ma(a),d=0,e=f.length;d<e;d++)Ha(f[d],g[d]);if(b)if(c)for(f=f||ma(a),g=g||ma(h),d=0,e=f.length;d<e;d++)Ga(f[d],g[d]);else Ga(a,h);return g=ma(h,"script"),g.length>0&&na(g,!i&&ma(a,"script")),h},cleanData:function(a){for(var b,c,d,e=r.event.special,f=0;void 0!==(c=a[f]);f++)if(T(c)){if(b=c[V.expando]){if(b.events)for(d in b.events)e[d]?r.event.remove(c,d):r.removeEvent(c,d,b.handle);c[V.expando]=void 0}c[W.expando]&&(c[W.expando]=void 0)}}}),r.fn.extend({detach:function(a){return Ja(this,a,!0)},remove:function(a){return Ja(this,a)},text:function(a){return S(this,function(a){return void 0===a?r.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=a)})},null,a,arguments.length)},append:function(){return Ia(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=Da(this,a);b.appendChild(a)}})},prepend:function(){return Ia(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=Da(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return Ia(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return Ia(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},empty:function(){for(var a,b=0;null!=(a=this[b]);b++)1===a.nodeType&&(r.cleanData(ma(a,!1)),a.textContent="");return this},clone:function(a,b){return a=null!=a&&a,b=null==b?a:b,this.map(function(){return r.clone(this,a,b)})},html:function(a){return S(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a&&1===b.nodeType)return b.innerHTML;if("string"==typeof a&&!za.test(a)&&!la[(ja.exec(a)||["",""])[1].toLowerCase()]){a=r.htmlPrefilter(a);try{for(;c<d;c++)b=this[c]||{},1===b.nodeType&&(r.cleanData(ma(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=[];return Ia(this,arguments,function(b){var c=this.parentNode;r.inArray(this,a)<0&&(r.cleanData(ma(this)),c&&c.replaceChild(b,this))},a)}}),r.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){r.fn[a]=function(a){for(var c,d=[],e=r(a),f=e.length-1,g=0;g<=f;g++)c=g===f?this:this.clone(!0),r(e[g])[b](c),h.apply(d,c.get());return this.pushStack(d)}});var Ka=/^margin/,La=new RegExp("^("+_+")(?!px)[a-z%]+$","i"),Ma=function(b){var c=b.ownerDocument.defaultView;return c&&c.opener||(c=a),c.getComputedStyle(b)};!function(){function b(){if(i){i.style.cssText="box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%",i.innerHTML="",qa.appendChild(h);var b=a.getComputedStyle(i);c="1%"!==b.top,g="2px"===b.marginLeft,e="4px"===b.width,i.style.marginRight="50%",f="4px"===b.marginRight,qa.removeChild(h),i=null}}var c,e,f,g,h=d.createElement("div"),i=d.createElement("div");i.style&&(i.style.backgroundClip="content-box",i.cloneNode(!0).style.backgroundClip="",o.clearCloneStyle="content-box"===i.style.backgroundClip,h.style.cssText="border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute",h.appendChild(i),r.extend(o,{pixelPosition:function(){return b(),c},boxSizingReliable:function(){return b(),e},pixelMarginRight:function(){return b(),f},reliableMarginLeft:function(){return b(),g}}))}();function Na(a,b,c){var d,e,f,g,h=a.style;return c=c||Ma(a),c&&(g=c.getPropertyValue(b)||c[b],""!==g||r.contains(a.ownerDocument,a)||(g=r.style(a,b)),!o.pixelMarginRight()&&La.test(g)&&Ka.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f)),void 0!==g?g+"":g}function Oa(a,b){return{get:function(){return a()?void delete this.get:(this.get=b).apply(this,arguments)}}}var Pa=/^(none|table(?!-c[ea]).+)/,Qa={position:"absolute",visibility:"hidden",display:"block"},Ra={letterSpacing:"0",fontWeight:"400"},Sa=["Webkit","Moz","ms"],Ta=d.createElement("div").style;function Ua(a){if(a in Ta)return a;var b=a[0].toUpperCase()+a.slice(1),c=Sa.length;while(c--)if(a=Sa[c]+b,a in Ta)return a}function Va(a,b,c){var d=aa.exec(b);return d?Math.max(0,d[2]-(c||0))+(d[3]||"px"):b}function Wa(a,b,c,d,e){var f,g=0;for(f=c===(d?"border":"content")?4:"width"===b?1:0;f<4;f+=2)"margin"===c&&(g+=r.css(a,c+ba[f],!0,e)),d?("content"===c&&(g-=r.css(a,"padding"+ba[f],!0,e)),"margin"!==c&&(g-=r.css(a,"border"+ba[f]+"Width",!0,e))):(g+=r.css(a,"padding"+ba[f],!0,e),"padding"!==c&&(g+=r.css(a,"border"+ba[f]+"Width",!0,e)));return g}function Xa(a,b,c){var d,e=!0,f=Ma(a),g="border-box"===r.css(a,"boxSizing",!1,f);if(a.getClientRects().length&&(d=a.getBoundingClientRect()[b]),d<=0||null==d){if(d=Na(a,b,f),(d<0||null==d)&&(d=a.style[b]),La.test(d))return d;e=g&&(o.boxSizingReliable()||d===a.style[b]),d=parseFloat(d)||0}return d+Wa(a,b,c||(g?"border":"content"),e,f)+"px"}r.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=Na(a,"opacity");return""===c?"1":c}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":"cssFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=r.camelCase(b),i=a.style;return b=r.cssProps[h]||(r.cssProps[h]=Ua(h)||h),g=r.cssHooks[b]||r.cssHooks[h],void 0===c?g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:i[b]:(f=typeof c,"string"===f&&(e=aa.exec(c))&&e[1]&&(c=ea(a,b,e),f="number"),null!=c&&c===c&&("number"===f&&(c+=e&&e[3]||(r.cssNumber[h]?"":"px")),o.clearCloneStyle||""!==c||0!==b.indexOf("background")||(i[b]="inherit"),g&&"set"in g&&void 0===(c=g.set(a,c,d))||(i[b]=c)),void 0)}},css:function(a,b,c,d){var e,f,g,h=r.camelCase(b);return b=r.cssProps[h]||(r.cssProps[h]=Ua(h)||h),g=r.cssHooks[b]||r.cssHooks[h],g&&"get"in g&&(e=g.get(a,!0,c)),void 0===e&&(e=Na(a,b,d)),"normal"===e&&b in Ra&&(e=Ra[b]),""===c||c?(f=parseFloat(e),c===!0||isFinite(f)?f||0:e):e}}),r.each(["height","width"],function(a,b){r.cssHooks[b]={get:function(a,c,d){if(c)return!Pa.test(r.css(a,"display"))||a.getClientRects().length&&a.getBoundingClientRect().width?Xa(a,b,d):da(a,Qa,function(){return Xa(a,b,d)})},set:function(a,c,d){var e,f=d&&Ma(a),g=d&&Wa(a,b,d,"border-box"===r.css(a,"boxSizing",!1,f),f);return g&&(e=aa.exec(c))&&"px"!==(e[3]||"px")&&(a.style[b]=c,c=r.css(a,b)),Va(a,c,g)}}}),r.cssHooks.marginLeft=Oa(o.reliableMarginLeft,function(a,b){if(b)return(parseFloat(Na(a,"marginLeft"))||a.getBoundingClientRect().left-da(a,{marginLeft:0},function(){return a.getBoundingClientRect().left}))+"px"}),r.each({margin:"",padding:"",border:"Width"},function(a,b){r.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];d<4;d++)e[a+ba[d]+b]=f[d]||f[d-2]||f[0];return e}},Ka.test(a)||(r.cssHooks[a+b].set=Va)}),r.fn.extend({css:function(a,b){return S(this,function(a,b,c){var d,e,f={},g=0;if(r.isArray(b)){for(d=Ma(a),e=b.length;g<e;g++)f[b[g]]=r.css(a,b[g],!1,d);return f}return void 0!==c?r.style(a,b,c):r.css(a,b)},a,b,arguments.length>1)}});function Ya(a,b,c,d,e){return new Ya.prototype.init(a,b,c,d,e)}r.Tween=Ya,Ya.prototype={constructor:Ya,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||r.easing._default,this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(r.cssNumber[c]?"":"px")},cur:function(){var a=Ya.propHooks[this.prop];return a&&a.get?a.get(this):Ya.propHooks._default.get(this)},run:function(a){var b,c=Ya.propHooks[this.prop];return this.options.duration?this.pos=b=r.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):this.pos=b=a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):Ya.propHooks._default.set(this),this}},Ya.prototype.init.prototype=Ya.prototype,Ya.propHooks={_default:{get:function(a){var b;return 1!==a.elem.nodeType||null!=a.elem[a.prop]&&null==a.elem.style[a.prop]?a.elem[a.prop]:(b=r.css(a.elem,a.prop,""),b&&"auto"!==b?b:0)},set:function(a){r.fx.step[a.prop]?r.fx.step[a.prop](a):1!==a.elem.nodeType||null==a.elem.style[r.cssProps[a.prop]]&&!r.cssHooks[a.prop]?a.elem[a.prop]=a.now:r.style(a.elem,a.prop,a.now+a.unit)}}},Ya.propHooks.scrollTop=Ya.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},r.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2},_default:"swing"},r.fx=Ya.prototype.init,r.fx.step={};var Za,$a,_a=/^(?:toggle|show|hide)$/,ab=/queueHooks$/;function bb(){$a&&(a.requestAnimationFrame(bb),r.fx.tick())}function cb(){return a.setTimeout(function(){Za=void 0}),Za=r.now()}function db(a,b){var c,d=0,e={height:a};for(b=b?1:0;d<4;d+=2-b)c=ba[d],e["margin"+c]=e["padding"+c]=a;return b&&(e.opacity=e.width=a),e}function eb(a,b,c){for(var d,e=(hb.tweeners[b]||[]).concat(hb.tweeners["*"]),f=0,g=e.length;f<g;f++)if(d=e[f].call(c,b,a))return d}function fb(a,b,c){var d,e,f,g,h,i,j,k,l="width"in b||"height"in b,m=this,n={},o=a.style,p=a.nodeType&&ca(a),q=V.get(a,"fxshow");c.queue||(g=r._queueHooks(a,"fx"),null==g.unqueued&&(g.unqueued=0,h=g.empty.fire,g.empty.fire=function(){g.unqueued||h()}),g.unqueued++,m.always(function(){m.always(function(){g.unqueued--,r.queue(a,"fx").length||g.empty.fire()})}));for(d in b)if(e=b[d],_a.test(e)){if(delete b[d],f=f||"toggle"===e,e===(p?"hide":"show")){if("show"!==e||!q||void 0===q[d])continue;p=!0}n[d]=q&&q[d]||r.style(a,d)}if(i=!r.isEmptyObject(b),i||!r.isEmptyObject(n)){l&&1===a.nodeType&&(c.overflow=[o.overflow,o.overflowX,o.overflowY],j=q&&q.display,null==j&&(j=V.get(a,"display")),k=r.css(a,"display"),"none"===k&&(j?k=j:(ha([a],!0),j=a.style.display||j,k=r.css(a,"display"),ha([a]))),("inline"===k||"inline-block"===k&&null!=j)&&"none"===r.css(a,"float")&&(i||(m.done(function(){o.display=j}),null==j&&(k=o.display,j="none"===k?"":k)),o.display="inline-block")),c.overflow&&(o.overflow="hidden",m.always(function(){o.overflow=c.overflow[0],o.overflowX=c.overflow[1],o.overflowY=c.overflow[2]})),i=!1;for(d in n)i||(q?"hidden"in q&&(p=q.hidden):q=V.access(a,"fxshow",{display:j}),f&&(q.hidden=!p),p&&ha([a],!0),m.done(function(){p||ha([a]),V.remove(a,"fxshow");for(d in n)r.style(a,d,n[d])})),i=eb(p?q[d]:0,d,m),d in q||(q[d]=i.start,p&&(i.end=i.start,i.start=0))}}function gb(a,b){var c,d,e,f,g;for(c in a)if(d=r.camelCase(c),e=b[d],f=a[c],r.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=r.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function hb(a,b,c){var d,e,f=0,g=hb.prefilters.length,h=r.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=Za||cb(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;g<i;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),f<1&&i?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:r.extend({},b),opts:r.extend(!0,{specialEasing:{},easing:r.easing._default},c),originalProperties:b,originalOptions:c,startTime:Za||cb(),duration:c.duration,tweens:[],createTween:function(b,c){var d=r.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;c<d;c++)j.tweens[c].run(1);return b?(h.notifyWith(a,[j,1,0]),h.resolveWith(a,[j,b])):h.rejectWith(a,[j,b]),this}}),k=j.props;for(gb(k,j.opts.specialEasing);f<g;f++)if(d=hb.prefilters[f].call(j,a,k,j.opts))return r.isFunction(d.stop)&&(r._queueHooks(j.elem,j.opts.queue).stop=r.proxy(d.stop,d)),d;return r.map(k,eb,j),r.isFunction(j.opts.start)&&j.opts.start.call(a,j),r.fx.timer(r.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}r.Animation=r.extend(hb,{tweeners:{"*":[function(a,b){var c=this.createTween(a,b);return ea(c.elem,a,aa.exec(b),c),c}]},tweener:function(a,b){r.isFunction(a)?(b=a,a=["*"]):a=a.match(K);for(var c,d=0,e=a.length;d<e;d++)c=a[d],hb.tweeners[c]=hb.tweeners[c]||[],hb.tweeners[c].unshift(b)},prefilters:[fb],prefilter:function(a,b){b?hb.prefilters.unshift(a):hb.prefilters.push(a)}}),r.speed=function(a,b,c){var e=a&&"object"==typeof a?r.extend({},a):{complete:c||!c&&b||r.isFunction(a)&&a,duration:a,easing:c&&b||b&&!r.isFunction(b)&&b};return r.fx.off||d.hidden?e.duration=0:"number"!=typeof e.duration&&(e.duration in r.fx.speeds?e.duration=r.fx.speeds[e.duration]:e.duration=r.fx.speeds._default),null!=e.queue&&e.queue!==!0||(e.queue="fx"),e.old=e.complete,e.complete=function(){r.isFunction(e.old)&&e.old.call(this),e.queue&&r.dequeue(this,e.queue)},e},r.fn.extend({fadeTo:function(a,b,c,d){return this.filter(ca).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=r.isEmptyObject(a),f=r.speed(b,c,d),g=function(){var b=hb(this,r.extend({},a),f);(e||V.get(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=r.timers,g=V.get(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&ab.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));!b&&c||r.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=V.get(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=r.timers,g=d?d.length:0;for(c.finish=!0,r.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;b<g;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),r.each(["toggle","show","hide"],function(a,b){var c=r.fn[b];r.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(db(b,!0),a,d,e)}}),r.each({slideDown:db("show"),slideUp:db("hide"),slideToggle:db("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){r.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),r.timers=[],r.fx.tick=function(){var a,b=0,c=r.timers;for(Za=r.now();b<c.length;b++)a=c[b],a()||c[b]!==a||c.splice(b--,1);c.length||r.fx.stop(),Za=void 0},r.fx.timer=function(a){r.timers.push(a),a()?r.fx.start():r.timers.pop()},r.fx.interval=13,r.fx.start=function(){$a||($a=a.requestAnimationFrame?a.requestAnimationFrame(bb):a.setInterval(r.fx.tick,r.fx.interval))},r.fx.stop=function(){a.cancelAnimationFrame?a.cancelAnimationFrame($a):a.clearInterval($a),$a=null},r.fx.speeds={slow:600,fast:200,_default:400},r.fn.delay=function(b,c){return b=r.fx?r.fx.speeds[b]||b:b,c=c||"fx",this.queue(c,function(c,d){var e=a.setTimeout(c,b);d.stop=function(){a.clearTimeout(e)}})},function(){var a=d.createElement("input"),b=d.createElement("select"),c=b.appendChild(d.createElement("option"));a.type="checkbox",o.checkOn=""!==a.value,o.optSelected=c.selected,a=d.createElement("input"),a.value="t",a.type="radio",o.radioValue="t"===a.value}();var ib,jb=r.expr.attrHandle;r.fn.extend({attr:function(a,b){return S(this,r.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){r.removeAttr(this,a)})}}),r.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return"undefined"==typeof a.getAttribute?r.prop(a,b,c):(1===f&&r.isXMLDoc(a)||(e=r.attrHooks[b.toLowerCase()]||(r.expr.match.bool.test(b)?ib:void 0)),
void 0!==c?null===c?void r.removeAttr(a,b):e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:(a.setAttribute(b,c+""),c):e&&"get"in e&&null!==(d=e.get(a,b))?d:(d=r.find.attr(a,b),null==d?void 0:d))},attrHooks:{type:{set:function(a,b){if(!o.radioValue&&"radio"===b&&r.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}},removeAttr:function(a,b){var c,d=0,e=b&&b.match(K);if(e&&1===a.nodeType)while(c=e[d++])a.removeAttribute(c)}}),ib={set:function(a,b,c){return b===!1?r.removeAttr(a,c):a.setAttribute(c,c),c}},r.each(r.expr.match.bool.source.match(/\w+/g),function(a,b){var c=jb[b]||r.find.attr;jb[b]=function(a,b,d){var e,f,g=b.toLowerCase();return d||(f=jb[g],jb[g]=e,e=null!=c(a,b,d)?g:null,jb[g]=f),e}});var kb=/^(?:input|select|textarea|button)$/i,lb=/^(?:a|area)$/i;r.fn.extend({prop:function(a,b){return S(this,r.prop,a,b,arguments.length>1)},removeProp:function(a){return this.each(function(){delete this[r.propFix[a]||a]})}}),r.extend({prop:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return 1===f&&r.isXMLDoc(a)||(b=r.propFix[b]||b,e=r.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){var b=r.find.attr(a,"tabindex");return b?parseInt(b,10):kb.test(a.nodeName)||lb.test(a.nodeName)&&a.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),o.optSelected||(r.propHooks.selected={get:function(a){var b=a.parentNode;return b&&b.parentNode&&b.parentNode.selectedIndex,null},set:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex)}}),r.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){r.propFix[this.toLowerCase()]=this});function mb(a){var b=a.match(K)||[];return b.join(" ")}function nb(a){return a.getAttribute&&a.getAttribute("class")||""}r.fn.extend({addClass:function(a){var b,c,d,e,f,g,h,i=0;if(r.isFunction(a))return this.each(function(b){r(this).addClass(a.call(this,b,nb(this)))});if("string"==typeof a&&a){b=a.match(K)||[];while(c=this[i++])if(e=nb(c),d=1===c.nodeType&&" "+mb(e)+" "){g=0;while(f=b[g++])d.indexOf(" "+f+" ")<0&&(d+=f+" ");h=mb(d),e!==h&&c.setAttribute("class",h)}}return this},removeClass:function(a){var b,c,d,e,f,g,h,i=0;if(r.isFunction(a))return this.each(function(b){r(this).removeClass(a.call(this,b,nb(this)))});if(!arguments.length)return this.attr("class","");if("string"==typeof a&&a){b=a.match(K)||[];while(c=this[i++])if(e=nb(c),d=1===c.nodeType&&" "+mb(e)+" "){g=0;while(f=b[g++])while(d.indexOf(" "+f+" ")>-1)d=d.replace(" "+f+" "," ");h=mb(d),e!==h&&c.setAttribute("class",h)}}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):r.isFunction(a)?this.each(function(c){r(this).toggleClass(a.call(this,c,nb(this),b),b)}):this.each(function(){var b,d,e,f;if("string"===c){d=0,e=r(this),f=a.match(K)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else void 0!==a&&"boolean"!==c||(b=nb(this),b&&V.set(this,"__className__",b),this.setAttribute&&this.setAttribute("class",b||a===!1?"":V.get(this,"__className__")||""))})},hasClass:function(a){var b,c,d=0;b=" "+a+" ";while(c=this[d++])if(1===c.nodeType&&(" "+mb(nb(c))+" ").indexOf(b)>-1)return!0;return!1}});var ob=/\r/g;r.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=r.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,r(this).val()):a,null==e?e="":"number"==typeof e?e+="":r.isArray(e)&&(e=r.map(e,function(a){return null==a?"":a+""})),b=r.valHooks[this.type]||r.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=r.valHooks[e.type]||r.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(ob,""):null==c?"":c)}}}),r.extend({valHooks:{option:{get:function(a){var b=r.find.attr(a,"value");return null!=b?b:mb(r.text(a))}},select:{get:function(a){var b,c,d,e=a.options,f=a.selectedIndex,g="select-one"===a.type,h=g?null:[],i=g?f+1:e.length;for(d=f<0?i:g?f:0;d<i;d++)if(c=e[d],(c.selected||d===f)&&!c.disabled&&(!c.parentNode.disabled||!r.nodeName(c.parentNode,"optgroup"))){if(b=r(c).val(),g)return b;h.push(b)}return h},set:function(a,b){var c,d,e=a.options,f=r.makeArray(b),g=e.length;while(g--)d=e[g],(d.selected=r.inArray(r.valHooks.option.get(d),f)>-1)&&(c=!0);return c||(a.selectedIndex=-1),f}}}}),r.each(["radio","checkbox"],function(){r.valHooks[this]={set:function(a,b){if(r.isArray(b))return a.checked=r.inArray(r(a).val(),b)>-1}},o.checkOn||(r.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})});var pb=/^(?:focusinfocus|focusoutblur)$/;r.extend(r.event,{trigger:function(b,c,e,f){var g,h,i,j,k,m,n,o=[e||d],p=l.call(b,"type")?b.type:b,q=l.call(b,"namespace")?b.namespace.split("."):[];if(h=i=e=e||d,3!==e.nodeType&&8!==e.nodeType&&!pb.test(p+r.event.triggered)&&(p.indexOf(".")>-1&&(q=p.split("."),p=q.shift(),q.sort()),k=p.indexOf(":")<0&&"on"+p,b=b[r.expando]?b:new r.Event(p,"object"==typeof b&&b),b.isTrigger=f?2:3,b.namespace=q.join("."),b.rnamespace=b.namespace?new RegExp("(^|\\.)"+q.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=e),c=null==c?[b]:r.makeArray(c,[b]),n=r.event.special[p]||{},f||!n.trigger||n.trigger.apply(e,c)!==!1)){if(!f&&!n.noBubble&&!r.isWindow(e)){for(j=n.delegateType||p,pb.test(j+p)||(h=h.parentNode);h;h=h.parentNode)o.push(h),i=h;i===(e.ownerDocument||d)&&o.push(i.defaultView||i.parentWindow||a)}g=0;while((h=o[g++])&&!b.isPropagationStopped())b.type=g>1?j:n.bindType||p,m=(V.get(h,"events")||{})[b.type]&&V.get(h,"handle"),m&&m.apply(h,c),m=k&&h[k],m&&m.apply&&T(h)&&(b.result=m.apply(h,c),b.result===!1&&b.preventDefault());return b.type=p,f||b.isDefaultPrevented()||n._default&&n._default.apply(o.pop(),c)!==!1||!T(e)||k&&r.isFunction(e[p])&&!r.isWindow(e)&&(i=e[k],i&&(e[k]=null),r.event.triggered=p,e[p](),r.event.triggered=void 0,i&&(e[k]=i)),b.result}},simulate:function(a,b,c){var d=r.extend(new r.Event,c,{type:a,isSimulated:!0});r.event.trigger(d,null,b)}}),r.fn.extend({trigger:function(a,b){return this.each(function(){r.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];if(c)return r.event.trigger(a,b,c,!0)}}),r.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(a,b){r.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),r.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),o.focusin="onfocusin"in a,o.focusin||r.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){r.event.simulate(b,a.target,r.event.fix(a))};r.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=V.access(d,b);e||d.addEventListener(a,c,!0),V.access(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=V.access(d,b)-1;e?V.access(d,b,e):(d.removeEventListener(a,c,!0),V.remove(d,b))}}});var qb=a.location,rb=r.now(),sb=/\?/;r.parseXML=function(b){var c;if(!b||"string"!=typeof b)return null;try{c=(new a.DOMParser).parseFromString(b,"text/xml")}catch(d){c=void 0}return c&&!c.getElementsByTagName("parsererror").length||r.error("Invalid XML: "+b),c};var tb=/\[\]$/,ub=/\r?\n/g,vb=/^(?:submit|button|image|reset|file)$/i,wb=/^(?:input|select|textarea|keygen)/i;function xb(a,b,c,d){var e;if(r.isArray(b))r.each(b,function(b,e){c||tb.test(a)?d(a,e):xb(a+"["+("object"==typeof e&&null!=e?b:"")+"]",e,c,d)});else if(c||"object"!==r.type(b))d(a,b);else for(e in b)xb(a+"["+e+"]",b[e],c,d)}r.param=function(a,b){var c,d=[],e=function(a,b){var c=r.isFunction(b)?b():b;d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(null==c?"":c)};if(r.isArray(a)||a.jquery&&!r.isPlainObject(a))r.each(a,function(){e(this.name,this.value)});else for(c in a)xb(c,a[c],b,e);return d.join("&")},r.fn.extend({serialize:function(){return r.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=r.prop(this,"elements");return a?r.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!r(this).is(":disabled")&&wb.test(this.nodeName)&&!vb.test(a)&&(this.checked||!ia.test(a))}).map(function(a,b){var c=r(this).val();return null==c?null:r.isArray(c)?r.map(c,function(a){return{name:b.name,value:a.replace(ub,"\r\n")}}):{name:b.name,value:c.replace(ub,"\r\n")}}).get()}});var yb=/%20/g,zb=/#.*$/,Ab=/([?&])_=[^&]*/,Bb=/^(.*?):[ \t]*([^\r\n]*)$/gm,Cb=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Db=/^(?:GET|HEAD)$/,Eb=/^\/\//,Fb={},Gb={},Hb="*/".concat("*"),Ib=d.createElement("a");Ib.href=qb.href;function Jb(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(K)||[];if(r.isFunction(c))while(d=f[e++])"+"===d[0]?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function Kb(a,b,c,d){var e={},f=a===Gb;function g(h){var i;return e[h]=!0,r.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function Lb(a,b){var c,d,e=r.ajaxSettings.flatOptions||{};for(c in b)void 0!==b[c]&&((e[c]?a:d||(d={}))[c]=b[c]);return d&&r.extend(!0,a,d),a}function Mb(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===d&&(d=a.mimeType||b.getResponseHeader("Content-Type"));if(d)for(e in h)if(h[e]&&h[e].test(d)){i.unshift(e);break}if(i[0]in c)f=i[0];else{for(e in c){if(!i[0]||a.converters[e+" "+i[0]]){f=e;break}g||(g=e)}f=f||g}if(f)return f!==i[0]&&i.unshift(f),c[f]}function Nb(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}r.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:qb.href,type:"GET",isLocal:Cb.test(qb.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Hb,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":r.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?Lb(Lb(a,r.ajaxSettings),b):Lb(r.ajaxSettings,a)},ajaxPrefilter:Jb(Fb),ajaxTransport:Jb(Gb),ajax:function(b,c){"object"==typeof b&&(c=b,b=void 0),c=c||{};var e,f,g,h,i,j,k,l,m,n,o=r.ajaxSetup({},c),p=o.context||o,q=o.context&&(p.nodeType||p.jquery)?r(p):r.event,s=r.Deferred(),t=r.Callbacks("once memory"),u=o.statusCode||{},v={},w={},x="canceled",y={readyState:0,getResponseHeader:function(a){var b;if(k){if(!h){h={};while(b=Bb.exec(g))h[b[1].toLowerCase()]=b[2]}b=h[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return k?g:null},setRequestHeader:function(a,b){return null==k&&(a=w[a.toLowerCase()]=w[a.toLowerCase()]||a,v[a]=b),this},overrideMimeType:function(a){return null==k&&(o.mimeType=a),this},statusCode:function(a){var b;if(a)if(k)y.always(a[y.status]);else for(b in a)u[b]=[u[b],a[b]];return this},abort:function(a){var b=a||x;return e&&e.abort(b),A(0,b),this}};if(s.promise(y),o.url=((b||o.url||qb.href)+"").replace(Eb,qb.protocol+"//"),o.type=c.method||c.type||o.method||o.type,o.dataTypes=(o.dataType||"*").toLowerCase().match(K)||[""],null==o.crossDomain){j=d.createElement("a");try{j.href=o.url,j.href=j.href,o.crossDomain=Ib.protocol+"//"+Ib.host!=j.protocol+"//"+j.host}catch(z){o.crossDomain=!0}}if(o.data&&o.processData&&"string"!=typeof o.data&&(o.data=r.param(o.data,o.traditional)),Kb(Fb,o,c,y),k)return y;l=r.event&&o.global,l&&0===r.active++&&r.event.trigger("ajaxStart"),o.type=o.type.toUpperCase(),o.hasContent=!Db.test(o.type),f=o.url.replace(zb,""),o.hasContent?o.data&&o.processData&&0===(o.contentType||"").indexOf("application/x-www-form-urlencoded")&&(o.data=o.data.replace(yb,"+")):(n=o.url.slice(f.length),o.data&&(f+=(sb.test(f)?"&":"?")+o.data,delete o.data),o.cache===!1&&(f=f.replace(Ab,"$1"),n=(sb.test(f)?"&":"?")+"_="+rb++ +n),o.url=f+n),o.ifModified&&(r.lastModified[f]&&y.setRequestHeader("If-Modified-Since",r.lastModified[f]),r.etag[f]&&y.setRequestHeader("If-None-Match",r.etag[f])),(o.data&&o.hasContent&&o.contentType!==!1||c.contentType)&&y.setRequestHeader("Content-Type",o.contentType),y.setRequestHeader("Accept",o.dataTypes[0]&&o.accepts[o.dataTypes[0]]?o.accepts[o.dataTypes[0]]+("*"!==o.dataTypes[0]?", "+Hb+"; q=0.01":""):o.accepts["*"]);for(m in o.headers)y.setRequestHeader(m,o.headers[m]);if(o.beforeSend&&(o.beforeSend.call(p,y,o)===!1||k))return y.abort();if(x="abort",t.add(o.complete),y.done(o.success),y.fail(o.error),e=Kb(Gb,o,c,y)){if(y.readyState=1,l&&q.trigger("ajaxSend",[y,o]),k)return y;o.async&&o.timeout>0&&(i=a.setTimeout(function(){y.abort("timeout")},o.timeout));try{k=!1,e.send(v,A)}catch(z){if(k)throw z;A(-1,z)}}else A(-1,"No Transport");function A(b,c,d,h){var j,m,n,v,w,x=c;k||(k=!0,i&&a.clearTimeout(i),e=void 0,g=h||"",y.readyState=b>0?4:0,j=b>=200&&b<300||304===b,d&&(v=Mb(o,y,d)),v=Nb(o,v,y,j),j?(o.ifModified&&(w=y.getResponseHeader("Last-Modified"),w&&(r.lastModified[f]=w),w=y.getResponseHeader("etag"),w&&(r.etag[f]=w)),204===b||"HEAD"===o.type?x="nocontent":304===b?x="notmodified":(x=v.state,m=v.data,n=v.error,j=!n)):(n=x,!b&&x||(x="error",b<0&&(b=0))),y.status=b,y.statusText=(c||x)+"",j?s.resolveWith(p,[m,x,y]):s.rejectWith(p,[y,x,n]),y.statusCode(u),u=void 0,l&&q.trigger(j?"ajaxSuccess":"ajaxError",[y,o,j?m:n]),t.fireWith(p,[y,x]),l&&(q.trigger("ajaxComplete",[y,o]),--r.active||r.event.trigger("ajaxStop")))}return y},getJSON:function(a,b,c){return r.get(a,b,c,"json")},getScript:function(a,b){return r.get(a,void 0,b,"script")}}),r.each(["get","post"],function(a,b){r[b]=function(a,c,d,e){return r.isFunction(c)&&(e=e||d,d=c,c=void 0),r.ajax(r.extend({url:a,type:b,dataType:e,data:c,success:d},r.isPlainObject(a)&&a))}}),r._evalUrl=function(a){return r.ajax({url:a,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,"throws":!0})},r.fn.extend({wrapAll:function(a){var b;return this[0]&&(r.isFunction(a)&&(a=a.call(this[0])),b=r(a,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstElementChild)a=a.firstElementChild;return a}).append(this)),this},wrapInner:function(a){return r.isFunction(a)?this.each(function(b){r(this).wrapInner(a.call(this,b))}):this.each(function(){var b=r(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=r.isFunction(a);return this.each(function(c){r(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(a){return this.parent(a).not("body").each(function(){r(this).replaceWith(this.childNodes)}),this}}),r.expr.pseudos.hidden=function(a){return!r.expr.pseudos.visible(a)},r.expr.pseudos.visible=function(a){return!!(a.offsetWidth||a.offsetHeight||a.getClientRects().length)},r.ajaxSettings.xhr=function(){try{return new a.XMLHttpRequest}catch(b){}};var Ob={0:200,1223:204},Pb=r.ajaxSettings.xhr();o.cors=!!Pb&&"withCredentials"in Pb,o.ajax=Pb=!!Pb,r.ajaxTransport(function(b){var c,d;if(o.cors||Pb&&!b.crossDomain)return{send:function(e,f){var g,h=b.xhr();if(h.open(b.type,b.url,b.async,b.username,b.password),b.xhrFields)for(g in b.xhrFields)h[g]=b.xhrFields[g];b.mimeType&&h.overrideMimeType&&h.overrideMimeType(b.mimeType),b.crossDomain||e["X-Requested-With"]||(e["X-Requested-With"]="XMLHttpRequest");for(g in e)h.setRequestHeader(g,e[g]);c=function(a){return function(){c&&(c=d=h.onload=h.onerror=h.onabort=h.onreadystatechange=null,"abort"===a?h.abort():"error"===a?"number"!=typeof h.status?f(0,"error"):f(h.status,h.statusText):f(Ob[h.status]||h.status,h.statusText,"text"!==(h.responseType||"text")||"string"!=typeof h.responseText?{binary:h.response}:{text:h.responseText},h.getAllResponseHeaders()))}},h.onload=c(),d=h.onerror=c("error"),void 0!==h.onabort?h.onabort=d:h.onreadystatechange=function(){4===h.readyState&&a.setTimeout(function(){c&&d()})},c=c("abort");try{h.send(b.hasContent&&b.data||null)}catch(i){if(c)throw i}},abort:function(){c&&c()}}}),r.ajaxPrefilter(function(a){a.crossDomain&&(a.contents.script=!1)}),r.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(a){return r.globalEval(a),a}}}),r.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET")}),r.ajaxTransport("script",function(a){if(a.crossDomain){var b,c;return{send:function(e,f){b=r("<script>").prop({charset:a.scriptCharset,src:a.url}).on("load error",c=function(a){b.remove(),c=null,a&&f("error"===a.type?404:200,a.type)}),d.head.appendChild(b[0])},abort:function(){c&&c()}}}});var Qb=[],Rb=/(=)\?(?=&|$)|\?\?/;r.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=Qb.pop()||r.expando+"_"+rb++;return this[a]=!0,a}}),r.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(Rb.test(b.url)?"url":"string"==typeof b.data&&0===(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&Rb.test(b.data)&&"data");if(h||"jsonp"===b.dataTypes[0])return e=b.jsonpCallback=r.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(Rb,"$1"+e):b.jsonp!==!1&&(b.url+=(sb.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||r.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){void 0===f?r(a).removeProp(e):a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,Qb.push(e)),g&&r.isFunction(f)&&f(g[0]),g=f=void 0}),"script"}),o.createHTMLDocument=function(){var a=d.implementation.createHTMLDocument("").body;return a.innerHTML="<form></form><form></form>",2===a.childNodes.length}(),r.parseHTML=function(a,b,c){if("string"!=typeof a)return[];"boolean"==typeof b&&(c=b,b=!1);var e,f,g;return b||(o.createHTMLDocument?(b=d.implementation.createHTMLDocument(""),e=b.createElement("base"),e.href=d.location.href,b.head.appendChild(e)):b=d),f=B.exec(a),g=!c&&[],f?[b.createElement(f[1])]:(f=pa([a],b,g),g&&g.length&&r(g).remove(),r.merge([],f.childNodes))},r.fn.load=function(a,b,c){var d,e,f,g=this,h=a.indexOf(" ");return h>-1&&(d=mb(a.slice(h)),a=a.slice(0,h)),r.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(e="POST"),g.length>0&&r.ajax({url:a,type:e||"GET",dataType:"html",data:b}).done(function(a){f=arguments,g.html(d?r("<div>").append(r.parseHTML(a)).find(d):a)}).always(c&&function(a,b){g.each(function(){c.apply(this,f||[a.responseText,b,a])})}),this},r.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){r.fn[b]=function(a){return this.on(b,a)}}),r.expr.pseudos.animated=function(a){return r.grep(r.timers,function(b){return a===b.elem}).length};function Sb(a){return r.isWindow(a)?a:9===a.nodeType&&a.defaultView}r.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=r.css(a,"position"),l=r(a),m={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=r.css(a,"top"),i=r.css(a,"left"),j=("absolute"===k||"fixed"===k)&&(f+i).indexOf("auto")>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),r.isFunction(b)&&(b=b.call(a,c,r.extend({},h))),null!=b.top&&(m.top=b.top-h.top+g),null!=b.left&&(m.left=b.left-h.left+e),"using"in b?b.using.call(a,m):l.css(m)}},r.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){r.offset.setOffset(this,a,b)});var b,c,d,e,f=this[0];if(f)return f.getClientRects().length?(d=f.getBoundingClientRect(),d.width||d.height?(e=f.ownerDocument,c=Sb(e),b=e.documentElement,{top:d.top+c.pageYOffset-b.clientTop,left:d.left+c.pageXOffset-b.clientLeft}):d):{top:0,left:0}},position:function(){if(this[0]){var a,b,c=this[0],d={top:0,left:0};return"fixed"===r.css(c,"position")?b=c.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),r.nodeName(a[0],"html")||(d=a.offset()),d={top:d.top+r.css(a[0],"borderTopWidth",!0),left:d.left+r.css(a[0],"borderLeftWidth",!0)}),{top:b.top-d.top-r.css(c,"marginTop",!0),left:b.left-d.left-r.css(c,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent;while(a&&"static"===r.css(a,"position"))a=a.offsetParent;return a||qa})}}),r.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,b){var c="pageYOffset"===b;r.fn[a]=function(d){return S(this,function(a,d,e){var f=Sb(a);return void 0===e?f?f[b]:a[d]:void(f?f.scrollTo(c?f.pageXOffset:e,c?e:f.pageYOffset):a[d]=e)},a,d,arguments.length)}}),r.each(["top","left"],function(a,b){r.cssHooks[b]=Oa(o.pixelPosition,function(a,c){if(c)return c=Na(a,b),La.test(c)?r(a).position()[b]+"px":c})}),r.each({Height:"height",Width:"width"},function(a,b){r.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){r.fn[d]=function(e,f){var g=arguments.length&&(c||"boolean"!=typeof e),h=c||(e===!0||f===!0?"margin":"border");return S(this,function(b,c,e){var f;return r.isWindow(b)?0===d.indexOf("outer")?b["inner"+a]:b.document.documentElement["client"+a]:9===b.nodeType?(f=b.documentElement,Math.max(b.body["scroll"+a],f["scroll"+a],b.body["offset"+a],f["offset"+a],f["client"+a])):void 0===e?r.css(b,c,h):r.style(b,c,e,h)},b,g?e:void 0,g)}})}),r.fn.extend({bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)}}),r.parseJSON=JSON.parse,"function"==typeof define&&define.amd&&define("jquery",[],function(){return r});var Tb=a.jQuery,Ub=a.$;return r.noConflict=function(b){return a.$===r&&(a.$=Ub),b&&a.jQuery===r&&(a.jQuery=Tb),r},b||(a.jQuery=a.$=r),r});
/*! jQuery UI - v1.12.1 - 2016-11-04
* http://jqueryui.com
* Includes: widget.js, data.js, disable-selection.js, scroll-parent.js, widgets/draggable.js, widgets/droppable.js, widgets/resizable.js, widgets/selectable.js, widgets/sortable.js, widgets/mouse.js
* Copyright jQuery Foundation and other contributors; Licensed MIT */


(function(t){"function"==typeof define&&define.amd?define(["jquery"],t):t(jQuery)})(function(t){t.ui=t.ui||{},t.ui.version="1.12.1";var e=0,i=Array.prototype.slice;t.cleanData=function(e){return function(i){var s,n,o;for(o=0;null!=(n=i[o]);o++)try{s=t._data(n,"events"),s&&s.remove&&t(n).triggerHandler("remove")}catch(a){}e(i)}}(t.cleanData),t.widget=function(e,i,s){var n,o,a,r={},l=e.split(".")[0];e=e.split(".")[1];var h=l+"-"+e;return s||(s=i,i=t.Widget),t.isArray(s)&&(s=t.extend.apply(null,[{}].concat(s))),t.expr[":"][h.toLowerCase()]=function(e){return!!t.data(e,h)},t[l]=t[l]||{},n=t[l][e],o=t[l][e]=function(t,e){return this._createWidget?(arguments.length&&this._createWidget(t,e),void 0):new o(t,e)},t.extend(o,n,{version:s.version,_proto:t.extend({},s),_childConstructors:[]}),a=new i,a.options=t.widget.extend({},a.options),t.each(s,function(e,s){return t.isFunction(s)?(r[e]=function(){function t(){return i.prototype[e].apply(this,arguments)}function n(t){return i.prototype[e].apply(this,t)}return function(){var e,i=this._super,o=this._superApply;return this._super=t,this._superApply=n,e=s.apply(this,arguments),this._super=i,this._superApply=o,e}}(),void 0):(r[e]=s,void 0)}),o.prototype=t.widget.extend(a,{widgetEventPrefix:n?a.widgetEventPrefix||e:e},r,{constructor:o,namespace:l,widgetName:e,widgetFullName:h}),n?(t.each(n._childConstructors,function(e,i){var s=i.prototype;t.widget(s.namespace+"."+s.widgetName,o,i._proto)}),delete n._childConstructors):i._childConstructors.push(o),t.widget.bridge(e,o),o},t.widget.extend=function(e){for(var s,n,o=i.call(arguments,1),a=0,r=o.length;r>a;a++)for(s in o[a])n=o[a][s],o[a].hasOwnProperty(s)&&void 0!==n&&(e[s]=t.isPlainObject(n)?t.isPlainObject(e[s])?t.widget.extend({},e[s],n):t.widget.extend({},n):n);return e},t.widget.bridge=function(e,s){var n=s.prototype.widgetFullName||e;t.fn[e]=function(o){var a="string"==typeof o,r=i.call(arguments,1),l=this;return a?this.length||"instance"!==o?this.each(function(){var i,s=t.data(this,n);return"instance"===o?(l=s,!1):s?t.isFunction(s[o])&&"_"!==o.charAt(0)?(i=s[o].apply(s,r),i!==s&&void 0!==i?(l=i&&i.jquery?l.pushStack(i.get()):i,!1):void 0):t.error("no such method '"+o+"' for "+e+" widget instance"):t.error("cannot call methods on "+e+" prior to initialization; "+"attempted to call method '"+o+"'")}):l=void 0:(r.length&&(o=t.widget.extend.apply(null,[o].concat(r))),this.each(function(){var e=t.data(this,n);e?(e.option(o||{}),e._init&&e._init()):t.data(this,n,new s(o,this))})),l}},t.Widget=function(){},t.Widget._childConstructors=[],t.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{classes:{},disabled:!1,create:null},_createWidget:function(i,s){s=t(s||this.defaultElement||this)[0],this.element=t(s),this.uuid=e++,this.eventNamespace="."+this.widgetName+this.uuid,this.bindings=t(),this.hoverable=t(),this.focusable=t(),this.classesElementLookup={},s!==this&&(t.data(s,this.widgetFullName,this),this._on(!0,this.element,{remove:function(t){t.target===s&&this.destroy()}}),this.document=t(s.style?s.ownerDocument:s.document||s),this.window=t(this.document[0].defaultView||this.document[0].parentWindow)),this.options=t.widget.extend({},this.options,this._getCreateOptions(),i),this._create(),this.options.disabled&&this._setOptionDisabled(this.options.disabled),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:function(){return{}},_getCreateEventData:t.noop,_create:t.noop,_init:t.noop,destroy:function(){var e=this;this._destroy(),t.each(this.classesElementLookup,function(t,i){e._removeClass(i,t)}),this.element.off(this.eventNamespace).removeData(this.widgetFullName),this.widget().off(this.eventNamespace).removeAttr("aria-disabled"),this.bindings.off(this.eventNamespace)},_destroy:t.noop,widget:function(){return this.element},option:function(e,i){var s,n,o,a=e;if(0===arguments.length)return t.widget.extend({},this.options);if("string"==typeof e)if(a={},s=e.split("."),e=s.shift(),s.length){for(n=a[e]=t.widget.extend({},this.options[e]),o=0;s.length-1>o;o++)n[s[o]]=n[s[o]]||{},n=n[s[o]];if(e=s.pop(),1===arguments.length)return void 0===n[e]?null:n[e];n[e]=i}else{if(1===arguments.length)return void 0===this.options[e]?null:this.options[e];a[e]=i}return this._setOptions(a),this},_setOptions:function(t){var e;for(e in t)this._setOption(e,t[e]);return this},_setOption:function(t,e){return"classes"===t&&this._setOptionClasses(e),this.options[t]=e,"disabled"===t&&this._setOptionDisabled(e),this},_setOptionClasses:function(e){var i,s,n;for(i in e)n=this.classesElementLookup[i],e[i]!==this.options.classes[i]&&n&&n.length&&(s=t(n.get()),this._removeClass(n,i),s.addClass(this._classes({element:s,keys:i,classes:e,add:!0})))},_setOptionDisabled:function(t){this._toggleClass(this.widget(),this.widgetFullName+"-disabled",null,!!t),t&&(this._removeClass(this.hoverable,null,"ui-state-hover"),this._removeClass(this.focusable,null,"ui-state-focus"))},enable:function(){return this._setOptions({disabled:!1})},disable:function(){return this._setOptions({disabled:!0})},_classes:function(e){function i(i,o){var a,r;for(r=0;i.length>r;r++)a=n.classesElementLookup[i[r]]||t(),a=e.add?t(t.unique(a.get().concat(e.element.get()))):t(a.not(e.element).get()),n.classesElementLookup[i[r]]=a,s.push(i[r]),o&&e.classes[i[r]]&&s.push(e.classes[i[r]])}var s=[],n=this;return e=t.extend({element:this.element,classes:this.options.classes||{}},e),this._on(e.element,{remove:"_untrackClassesElement"}),e.keys&&i(e.keys.match(/\S+/g)||[],!0),e.extra&&i(e.extra.match(/\S+/g)||[]),s.join(" ")},_untrackClassesElement:function(e){var i=this;t.each(i.classesElementLookup,function(s,n){-1!==t.inArray(e.target,n)&&(i.classesElementLookup[s]=t(n.not(e.target).get()))})},_removeClass:function(t,e,i){return this._toggleClass(t,e,i,!1)},_addClass:function(t,e,i){return this._toggleClass(t,e,i,!0)},_toggleClass:function(t,e,i,s){s="boolean"==typeof s?s:i;var n="string"==typeof t||null===t,o={extra:n?e:i,keys:n?t:e,element:n?this.element:t,add:s};return o.element.toggleClass(this._classes(o),s),this},_on:function(e,i,s){var n,o=this;"boolean"!=typeof e&&(s=i,i=e,e=!1),s?(i=n=t(i),this.bindings=this.bindings.add(i)):(s=i,i=this.element,n=this.widget()),t.each(s,function(s,a){function r(){return e||o.options.disabled!==!0&&!t(this).hasClass("ui-state-disabled")?("string"==typeof a?o[a]:a).apply(o,arguments):void 0}"string"!=typeof a&&(r.guid=a.guid=a.guid||r.guid||t.guid++);var l=s.match(/^([\w:-]*)\s*(.*)$/),h=l[1]+o.eventNamespace,c=l[2];c?n.on(h,c,r):i.on(h,r)})},_off:function(e,i){i=(i||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,e.off(i).off(i),this.bindings=t(this.bindings.not(e).get()),this.focusable=t(this.focusable.not(e).get()),this.hoverable=t(this.hoverable.not(e).get())},_delay:function(t,e){function i(){return("string"==typeof t?s[t]:t).apply(s,arguments)}var s=this;return setTimeout(i,e||0)},_hoverable:function(e){this.hoverable=this.hoverable.add(e),this._on(e,{mouseenter:function(e){this._addClass(t(e.currentTarget),null,"ui-state-hover")},mouseleave:function(e){this._removeClass(t(e.currentTarget),null,"ui-state-hover")}})},_focusable:function(e){this.focusable=this.focusable.add(e),this._on(e,{focusin:function(e){this._addClass(t(e.currentTarget),null,"ui-state-focus")},focusout:function(e){this._removeClass(t(e.currentTarget),null,"ui-state-focus")}})},_trigger:function(e,i,s){var n,o,a=this.options[e];if(s=s||{},i=t.Event(i),i.type=(e===this.widgetEventPrefix?e:this.widgetEventPrefix+e).toLowerCase(),i.target=this.element[0],o=i.originalEvent)for(n in o)n in i||(i[n]=o[n]);return this.element.trigger(i,s),!(t.isFunction(a)&&a.apply(this.element[0],[i].concat(s))===!1||i.isDefaultPrevented())}},t.each({show:"fadeIn",hide:"fadeOut"},function(e,i){t.Widget.prototype["_"+e]=function(s,n,o){"string"==typeof n&&(n={effect:n});var a,r=n?n===!0||"number"==typeof n?i:n.effect||i:e;n=n||{},"number"==typeof n&&(n={duration:n}),a=!t.isEmptyObject(n),n.complete=o,n.delay&&s.delay(n.delay),a&&t.effects&&t.effects.effect[r]?s[e](n):r!==e&&s[r]?s[r](n.duration,n.easing,o):s.queue(function(i){t(this)[e](),o&&o.call(s[0]),i()})}}),t.widget,t.extend(t.expr[":"],{data:t.expr.createPseudo?t.expr.createPseudo(function(e){return function(i){return!!t.data(i,e)}}):function(e,i,s){return!!t.data(e,s[3])}}),t.fn.extend({disableSelection:function(){var t="onselectstart"in document.createElement("div")?"selectstart":"mousedown";return function(){return this.on(t+".ui-disableSelection",function(t){t.preventDefault()})}}(),enableSelection:function(){return this.off(".ui-disableSelection")}}),t.fn.scrollParent=function(e){var i=this.css("position"),s="absolute"===i,n=e?/(auto|scroll|hidden)/:/(auto|scroll)/,o=this.parents().filter(function(){var e=t(this);return s&&"static"===e.css("position")?!1:n.test(e.css("overflow")+e.css("overflow-y")+e.css("overflow-x"))}).eq(0);return"fixed"!==i&&o.length?o:t(this[0].ownerDocument||document)},t.ui.ie=!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase());var s=!1;t(document).on("mouseup",function(){s=!1}),t.widget("ui.mouse",{version:"1.12.1",options:{cancel:"input, textarea, button, select, option",distance:1,delay:0},_mouseInit:function(){var e=this;this.element.on("mousedown."+this.widgetName,function(t){return e._mouseDown(t)}).on("click."+this.widgetName,function(i){return!0===t.data(i.target,e.widgetName+".preventClickEvent")?(t.removeData(i.target,e.widgetName+".preventClickEvent"),i.stopImmediatePropagation(),!1):void 0}),this.started=!1},_mouseDestroy:function(){this.element.off("."+this.widgetName),this._mouseMoveDelegate&&this.document.off("mousemove."+this.widgetName,this._mouseMoveDelegate).off("mouseup."+this.widgetName,this._mouseUpDelegate)},_mouseDown:function(e){if(!s){this._mouseMoved=!1,this._mouseStarted&&this._mouseUp(e),this._mouseDownEvent=e;var i=this,n=1===e.which,o="string"==typeof this.options.cancel&&e.target.nodeName?t(e.target).closest(this.options.cancel).length:!1;return n&&!o&&this._mouseCapture(e)?(this.mouseDelayMet=!this.options.delay,this.mouseDelayMet||(this._mouseDelayTimer=setTimeout(function(){i.mouseDelayMet=!0},this.options.delay)),this._mouseDistanceMet(e)&&this._mouseDelayMet(e)&&(this._mouseStarted=this._mouseStart(e)!==!1,!this._mouseStarted)?(e.preventDefault(),!0):(!0===t.data(e.target,this.widgetName+".preventClickEvent")&&t.removeData(e.target,this.widgetName+".preventClickEvent"),this._mouseMoveDelegate=function(t){return i._mouseMove(t)},this._mouseUpDelegate=function(t){return i._mouseUp(t)},this.document.on("mousemove."+this.widgetName,this._mouseMoveDelegate).on("mouseup."+this.widgetName,this._mouseUpDelegate),e.preventDefault(),s=!0,!0)):!0}},_mouseMove:function(e){if(this._mouseMoved){if(t.ui.ie&&(!document.documentMode||9>document.documentMode)&&!e.button)return this._mouseUp(e);if(!e.which)if(e.originalEvent.altKey||e.originalEvent.ctrlKey||e.originalEvent.metaKey||e.originalEvent.shiftKey)this.ignoreMissingWhich=!0;else if(!this.ignoreMissingWhich)return this._mouseUp(e)}return(e.which||e.button)&&(this._mouseMoved=!0),this._mouseStarted?(this._mouseDrag(e),e.preventDefault()):(this._mouseDistanceMet(e)&&this._mouseDelayMet(e)&&(this._mouseStarted=this._mouseStart(this._mouseDownEvent,e)!==!1,this._mouseStarted?this._mouseDrag(e):this._mouseUp(e)),!this._mouseStarted)},_mouseUp:function(e){this.document.off("mousemove."+this.widgetName,this._mouseMoveDelegate).off("mouseup."+this.widgetName,this._mouseUpDelegate),this._mouseStarted&&(this._mouseStarted=!1,e.target===this._mouseDownEvent.target&&t.data(e.target,this.widgetName+".preventClickEvent",!0),this._mouseStop(e)),this._mouseDelayTimer&&(clearTimeout(this._mouseDelayTimer),delete this._mouseDelayTimer),this.ignoreMissingWhich=!1,s=!1,e.preventDefault()},_mouseDistanceMet:function(t){return Math.max(Math.abs(this._mouseDownEvent.pageX-t.pageX),Math.abs(this._mouseDownEvent.pageY-t.pageY))>=this.options.distance},_mouseDelayMet:function(){return this.mouseDelayMet},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return!0}}),t.ui.plugin={add:function(e,i,s){var n,o=t.ui[e].prototype;for(n in s)o.plugins[n]=o.plugins[n]||[],o.plugins[n].push([i,s[n]])},call:function(t,e,i,s){var n,o=t.plugins[e];if(o&&(s||t.element[0].parentNode&&11!==t.element[0].parentNode.nodeType))for(n=0;o.length>n;n++)t.options[o[n][0]]&&o[n][1].apply(t.element,i)}},t.ui.safeActiveElement=function(t){var e;try{e=t.activeElement}catch(i){e=t.body}return e||(e=t.body),e.nodeName||(e=t.body),e},t.ui.safeBlur=function(e){e&&"body"!==e.nodeName.toLowerCase()&&t(e).trigger("blur")},t.widget("ui.draggable",t.ui.mouse,{version:"1.12.1",widgetEventPrefix:"drag",options:{addClasses:!0,appendTo:"parent",axis:!1,connectToSortable:!1,containment:!1,cursor:"auto",cursorAt:!1,grid:!1,handle:!1,helper:"original",iframeFix:!1,opacity:!1,refreshPositions:!1,revert:!1,revertDuration:500,scope:"default",scroll:!0,scrollSensitivity:20,scrollSpeed:20,snap:!1,snapMode:"both",snapTolerance:20,stack:!1,zIndex:!1,drag:null,start:null,stop:null},_create:function(){"original"===this.options.helper&&this._setPositionRelative(),this.options.addClasses&&this._addClass("ui-draggable"),this._setHandleClassName(),this._mouseInit()},_setOption:function(t,e){this._super(t,e),"handle"===t&&(this._removeHandleClassName(),this._setHandleClassName())},_destroy:function(){return(this.helper||this.element).is(".ui-draggable-dragging")?(this.destroyOnClear=!0,void 0):(this._removeHandleClassName(),this._mouseDestroy(),void 0)},_mouseCapture:function(e){var i=this.options;return this.helper||i.disabled||t(e.target).closest(".ui-resizable-handle").length>0?!1:(this.handle=this._getHandle(e),this.handle?(this._blurActiveElement(e),this._blockFrames(i.iframeFix===!0?"iframe":i.iframeFix),!0):!1)},_blockFrames:function(e){this.iframeBlocks=this.document.find(e).map(function(){var e=t(this);return t("<div>").css("position","absolute").appendTo(e.parent()).outerWidth(e.outerWidth()).outerHeight(e.outerHeight()).offset(e.offset())[0]})},_unblockFrames:function(){this.iframeBlocks&&(this.iframeBlocks.remove(),delete this.iframeBlocks)},_blurActiveElement:function(e){var i=t.ui.safeActiveElement(this.document[0]),s=t(e.target);s.closest(i).length||t.ui.safeBlur(i)},_mouseStart:function(e){var i=this.options;return this.helper=this._createHelper(e),this._addClass(this.helper,"ui-draggable-dragging"),this._cacheHelperProportions(),t.ui.ddmanager&&(t.ui.ddmanager.current=this),this._cacheMargins(),this.cssPosition=this.helper.css("position"),this.scrollParent=this.helper.scrollParent(!0),this.offsetParent=this.helper.offsetParent(),this.hasFixedAncestor=this.helper.parents().filter(function(){return"fixed"===t(this).css("position")}).length>0,this.positionAbs=this.element.offset(),this._refreshOffsets(e),this.originalPosition=this.position=this._generatePosition(e,!1),this.originalPageX=e.pageX,this.originalPageY=e.pageY,i.cursorAt&&this._adjustOffsetFromHelper(i.cursorAt),this._setContainment(),this._trigger("start",e)===!1?(this._clear(),!1):(this._cacheHelperProportions(),t.ui.ddmanager&&!i.dropBehaviour&&t.ui.ddmanager.prepareOffsets(this,e),this._mouseDrag(e,!0),t.ui.ddmanager&&t.ui.ddmanager.dragStart(this,e),!0)},_refreshOffsets:function(t){this.offset={top:this.positionAbs.top-this.margins.top,left:this.positionAbs.left-this.margins.left,scroll:!1,parent:this._getParentOffset(),relative:this._getRelativeOffset()},this.offset.click={left:t.pageX-this.offset.left,top:t.pageY-this.offset.top}},_mouseDrag:function(e,i){if(this.hasFixedAncestor&&(this.offset.parent=this._getParentOffset()),this.position=this._generatePosition(e,!0),this.positionAbs=this._convertPositionTo("absolute"),!i){var s=this._uiHash();if(this._trigger("drag",e,s)===!1)return this._mouseUp(new t.Event("mouseup",e)),!1;this.position=s.position}return this.helper[0].style.left=this.position.left+"px",this.helper[0].style.top=this.position.top+"px",t.ui.ddmanager&&t.ui.ddmanager.drag(this,e),!1},_mouseStop:function(e){var i=this,s=!1;return t.ui.ddmanager&&!this.options.dropBehaviour&&(s=t.ui.ddmanager.drop(this,e)),this.dropped&&(s=this.dropped,this.dropped=!1),"invalid"===this.options.revert&&!s||"valid"===this.options.revert&&s||this.options.revert===!0||t.isFunction(this.options.revert)&&this.options.revert.call(this.element,s)?t(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){i._trigger("stop",e)!==!1&&i._clear()}):this._trigger("stop",e)!==!1&&this._clear(),!1},_mouseUp:function(e){return this._unblockFrames(),t.ui.ddmanager&&t.ui.ddmanager.dragStop(this,e),this.handleElement.is(e.target)&&this.element.trigger("focus"),t.ui.mouse.prototype._mouseUp.call(this,e)},cancel:function(){return this.helper.is(".ui-draggable-dragging")?this._mouseUp(new t.Event("mouseup",{target:this.element[0]})):this._clear(),this},_getHandle:function(e){return this.options.handle?!!t(e.target).closest(this.element.find(this.options.handle)).length:!0},_setHandleClassName:function(){this.handleElement=this.options.handle?this.element.find(this.options.handle):this.element,this._addClass(this.handleElement,"ui-draggable-handle")},_removeHandleClassName:function(){this._removeClass(this.handleElement,"ui-draggable-handle")},_createHelper:function(e){var i=this.options,s=t.isFunction(i.helper),n=s?t(i.helper.apply(this.element[0],[e])):"clone"===i.helper?this.element.clone().removeAttr("id"):this.element;return n.parents("body").length||n.appendTo("parent"===i.appendTo?this.element[0].parentNode:i.appendTo),s&&n[0]===this.element[0]&&this._setPositionRelative(),n[0]===this.element[0]||/(fixed|absolute)/.test(n.css("position"))||n.css("position","absolute"),n},_setPositionRelative:function(){/^(?:r|a|f)/.test(this.element.css("position"))||(this.element[0].style.position="relative")},_adjustOffsetFromHelper:function(e){"string"==typeof e&&(e=e.split(" ")),t.isArray(e)&&(e={left:+e[0],top:+e[1]||0}),"left"in e&&(this.offset.click.left=e.left+this.margins.left),"right"in e&&(this.offset.click.left=this.helperProportions.width-e.right+this.margins.left),"top"in e&&(this.offset.click.top=e.top+this.margins.top),"bottom"in e&&(this.offset.click.top=this.helperProportions.height-e.bottom+this.margins.top)},_isRootNode:function(t){return/(html|body)/i.test(t.tagName)||t===this.document[0]},_getParentOffset:function(){var e=this.offsetParent.offset(),i=this.document[0];return"absolute"===this.cssPosition&&this.scrollParent[0]!==i&&t.contains(this.scrollParent[0],this.offsetParent[0])&&(e.left+=this.scrollParent.scrollLeft(),e.top+=this.scrollParent.scrollTop()),this._isRootNode(this.offsetParent[0])&&(e={top:0,left:0}),{top:e.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:e.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if("relative"!==this.cssPosition)return{top:0,left:0};var t=this.element.position(),e=this._isRootNode(this.scrollParent[0]);return{top:t.top-(parseInt(this.helper.css("top"),10)||0)+(e?0:this.scrollParent.scrollTop()),left:t.left-(parseInt(this.helper.css("left"),10)||0)+(e?0:this.scrollParent.scrollLeft())}},_cacheMargins:function(){this.margins={left:parseInt(this.element.css("marginLeft"),10)||0,top:parseInt(this.element.css("marginTop"),10)||0,right:parseInt(this.element.css("marginRight"),10)||0,bottom:parseInt(this.element.css("marginBottom"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var e,i,s,n=this.options,o=this.document[0];return this.relativeContainer=null,n.containment?"window"===n.containment?(this.containment=[t(window).scrollLeft()-this.offset.relative.left-this.offset.parent.left,t(window).scrollTop()-this.offset.relative.top-this.offset.parent.top,t(window).scrollLeft()+t(window).width()-this.helperProportions.width-this.margins.left,t(window).scrollTop()+(t(window).height()||o.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top],void 0):"document"===n.containment?(this.containment=[0,0,t(o).width()-this.helperProportions.width-this.margins.left,(t(o).height()||o.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top],void 0):n.containment.constructor===Array?(this.containment=n.containment,void 0):("parent"===n.containment&&(n.containment=this.helper[0].parentNode),i=t(n.containment),s=i[0],s&&(e=/(scroll|auto)/.test(i.css("overflow")),this.containment=[(parseInt(i.css("borderLeftWidth"),10)||0)+(parseInt(i.css("paddingLeft"),10)||0),(parseInt(i.css("borderTopWidth"),10)||0)+(parseInt(i.css("paddingTop"),10)||0),(e?Math.max(s.scrollWidth,s.offsetWidth):s.offsetWidth)-(parseInt(i.css("borderRightWidth"),10)||0)-(parseInt(i.css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left-this.margins.right,(e?Math.max(s.scrollHeight,s.offsetHeight):s.offsetHeight)-(parseInt(i.css("borderBottomWidth"),10)||0)-(parseInt(i.css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top-this.margins.bottom],this.relativeContainer=i),void 0):(this.containment=null,void 0)},_convertPositionTo:function(t,e){e||(e=this.position);var i="absolute"===t?1:-1,s=this._isRootNode(this.scrollParent[0]);return{top:e.top+this.offset.relative.top*i+this.offset.parent.top*i-("fixed"===this.cssPosition?-this.offset.scroll.top:s?0:this.offset.scroll.top)*i,left:e.left+this.offset.relative.left*i+this.offset.parent.left*i-("fixed"===this.cssPosition?-this.offset.scroll.left:s?0:this.offset.scroll.left)*i}},_generatePosition:function(t,e){var i,s,n,o,a=this.options,r=this._isRootNode(this.scrollParent[0]),l=t.pageX,h=t.pageY;return r&&this.offset.scroll||(this.offset.scroll={top:this.scrollParent.scrollTop(),left:this.scrollParent.scrollLeft()}),e&&(this.containment&&(this.relativeContainer?(s=this.relativeContainer.offset(),i=[this.containment[0]+s.left,this.containment[1]+s.top,this.containment[2]+s.left,this.containment[3]+s.top]):i=this.containment,t.pageX-this.offset.click.left<i[0]&&(l=i[0]+this.offset.click.left),t.pageY-this.offset.click.top<i[1]&&(h=i[1]+this.offset.click.top),t.pageX-this.offset.click.left>i[2]&&(l=i[2]+this.offset.click.left),t.pageY-this.offset.click.top>i[3]&&(h=i[3]+this.offset.click.top)),a.grid&&(n=a.grid[1]?this.originalPageY+Math.round((h-this.originalPageY)/a.grid[1])*a.grid[1]:this.originalPageY,h=i?n-this.offset.click.top>=i[1]||n-this.offset.click.top>i[3]?n:n-this.offset.click.top>=i[1]?n-a.grid[1]:n+a.grid[1]:n,o=a.grid[0]?this.originalPageX+Math.round((l-this.originalPageX)/a.grid[0])*a.grid[0]:this.originalPageX,l=i?o-this.offset.click.left>=i[0]||o-this.offset.click.left>i[2]?o:o-this.offset.click.left>=i[0]?o-a.grid[0]:o+a.grid[0]:o),"y"===a.axis&&(l=this.originalPageX),"x"===a.axis&&(h=this.originalPageY)),{top:h-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+("fixed"===this.cssPosition?-this.offset.scroll.top:r?0:this.offset.scroll.top),left:l-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+("fixed"===this.cssPosition?-this.offset.scroll.left:r?0:this.offset.scroll.left)}},_clear:function(){this._removeClass(this.helper,"ui-draggable-dragging"),this.helper[0]===this.element[0]||this.cancelHelperRemoval||this.helper.remove(),this.helper=null,this.cancelHelperRemoval=!1,this.destroyOnClear&&this.destroy()},_trigger:function(e,i,s){return s=s||this._uiHash(),t.ui.plugin.call(this,e,[i,s,this],!0),/^(drag|start|stop)/.test(e)&&(this.positionAbs=this._convertPositionTo("absolute"),s.offset=this.positionAbs),t.Widget.prototype._trigger.call(this,e,i,s)},plugins:{},_uiHash:function(){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs}}}),t.ui.plugin.add("draggable","connectToSortable",{start:function(e,i,s){var n=t.extend({},i,{item:s.element});s.sortables=[],t(s.options.connectToSortable).each(function(){var i=t(this).sortable("instance");i&&!i.options.disabled&&(s.sortables.push(i),i.refreshPositions(),i._trigger("activate",e,n))})},stop:function(e,i,s){var n=t.extend({},i,{item:s.element});s.cancelHelperRemoval=!1,t.each(s.sortables,function(){var t=this;t.isOver?(t.isOver=0,s.cancelHelperRemoval=!0,t.cancelHelperRemoval=!1,t._storedCSS={position:t.placeholder.css("position"),top:t.placeholder.css("top"),left:t.placeholder.css("left")},t._mouseStop(e),t.options.helper=t.options._helper):(t.cancelHelperRemoval=!0,t._trigger("deactivate",e,n))})},drag:function(e,i,s){t.each(s.sortables,function(){var n=!1,o=this;o.positionAbs=s.positionAbs,o.helperProportions=s.helperProportions,o.offset.click=s.offset.click,o._intersectsWith(o.containerCache)&&(n=!0,t.each(s.sortables,function(){return this.positionAbs=s.positionAbs,this.helperProportions=s.helperProportions,this.offset.click=s.offset.click,this!==o&&this._intersectsWith(this.containerCache)&&t.contains(o.element[0],this.element[0])&&(n=!1),n})),n?(o.isOver||(o.isOver=1,s._parent=i.helper.parent(),o.currentItem=i.helper.appendTo(o.element).data("ui-sortable-item",!0),o.options._helper=o.options.helper,o.options.helper=function(){return i.helper[0]},e.target=o.currentItem[0],o._mouseCapture(e,!0),o._mouseStart(e,!0,!0),o.offset.click.top=s.offset.click.top,o.offset.click.left=s.offset.click.left,o.offset.parent.left-=s.offset.parent.left-o.offset.parent.left,o.offset.parent.top-=s.offset.parent.top-o.offset.parent.top,s._trigger("toSortable",e),s.dropped=o.element,t.each(s.sortables,function(){this.refreshPositions()}),s.currentItem=s.element,o.fromOutside=s),o.currentItem&&(o._mouseDrag(e),i.position=o.position)):o.isOver&&(o.isOver=0,o.cancelHelperRemoval=!0,o.options._revert=o.options.revert,o.options.revert=!1,o._trigger("out",e,o._uiHash(o)),o._mouseStop(e,!0),o.options.revert=o.options._revert,o.options.helper=o.options._helper,o.placeholder&&o.placeholder.remove(),i.helper.appendTo(s._parent),s._refreshOffsets(e),i.position=s._generatePosition(e,!0),s._trigger("fromSortable",e),s.dropped=!1,t.each(s.sortables,function(){this.refreshPositions()}))})}}),t.ui.plugin.add("draggable","cursor",{start:function(e,i,s){var n=t("body"),o=s.options;n.css("cursor")&&(o._cursor=n.css("cursor")),n.css("cursor",o.cursor)},stop:function(e,i,s){var n=s.options;n._cursor&&t("body").css("cursor",n._cursor)}}),t.ui.plugin.add("draggable","opacity",{start:function(e,i,s){var n=t(i.helper),o=s.options;n.css("opacity")&&(o._opacity=n.css("opacity")),n.css("opacity",o.opacity)},stop:function(e,i,s){var n=s.options;n._opacity&&t(i.helper).css("opacity",n._opacity)}}),t.ui.plugin.add("draggable","scroll",{start:function(t,e,i){i.scrollParentNotHidden||(i.scrollParentNotHidden=i.helper.scrollParent(!1)),i.scrollParentNotHidden[0]!==i.document[0]&&"HTML"!==i.scrollParentNotHidden[0].tagName&&(i.overflowOffset=i.scrollParentNotHidden.offset())},drag:function(e,i,s){var n=s.options,o=!1,a=s.scrollParentNotHidden[0],r=s.document[0];a!==r&&"HTML"!==a.tagName?(n.axis&&"x"===n.axis||(s.overflowOffset.top+a.offsetHeight-e.pageY<n.scrollSensitivity?a.scrollTop=o=a.scrollTop+n.scrollSpeed:e.pageY-s.overflowOffset.top<n.scrollSensitivity&&(a.scrollTop=o=a.scrollTop-n.scrollSpeed)),n.axis&&"y"===n.axis||(s.overflowOffset.left+a.offsetWidth-e.pageX<n.scrollSensitivity?a.scrollLeft=o=a.scrollLeft+n.scrollSpeed:e.pageX-s.overflowOffset.left<n.scrollSensitivity&&(a.scrollLeft=o=a.scrollLeft-n.scrollSpeed))):(n.axis&&"x"===n.axis||(e.pageY-t(r).scrollTop()<n.scrollSensitivity?o=t(r).scrollTop(t(r).scrollTop()-n.scrollSpeed):t(window).height()-(e.pageY-t(r).scrollTop())<n.scrollSensitivity&&(o=t(r).scrollTop(t(r).scrollTop()+n.scrollSpeed))),n.axis&&"y"===n.axis||(e.pageX-t(r).scrollLeft()<n.scrollSensitivity?o=t(r).scrollLeft(t(r).scrollLeft()-n.scrollSpeed):t(window).width()-(e.pageX-t(r).scrollLeft())<n.scrollSensitivity&&(o=t(r).scrollLeft(t(r).scrollLeft()+n.scrollSpeed)))),o!==!1&&t.ui.ddmanager&&!n.dropBehaviour&&t.ui.ddmanager.prepareOffsets(s,e)}}),t.ui.plugin.add("draggable","snap",{start:function(e,i,s){var n=s.options;s.snapElements=[],t(n.snap.constructor!==String?n.snap.items||":data(ui-draggable)":n.snap).each(function(){var e=t(this),i=e.offset();this!==s.element[0]&&s.snapElements.push({item:this,width:e.outerWidth(),height:e.outerHeight(),top:i.top,left:i.left})})},drag:function(e,i,s){var n,o,a,r,l,h,c,u,d,p,f=s.options,g=f.snapTolerance,m=i.offset.left,_=m+s.helperProportions.width,v=i.offset.top,b=v+s.helperProportions.height;for(d=s.snapElements.length-1;d>=0;d--)l=s.snapElements[d].left-s.margins.left,h=l+s.snapElements[d].width,c=s.snapElements[d].top-s.margins.top,u=c+s.snapElements[d].height,l-g>_||m>h+g||c-g>b||v>u+g||!t.contains(s.snapElements[d].item.ownerDocument,s.snapElements[d].item)?(s.snapElements[d].snapping&&s.options.snap.release&&s.options.snap.release.call(s.element,e,t.extend(s._uiHash(),{snapItem:s.snapElements[d].item})),s.snapElements[d].snapping=!1):("inner"!==f.snapMode&&(n=g>=Math.abs(c-b),o=g>=Math.abs(u-v),a=g>=Math.abs(l-_),r=g>=Math.abs(h-m),n&&(i.position.top=s._convertPositionTo("relative",{top:c-s.helperProportions.height,left:0}).top),o&&(i.position.top=s._convertPositionTo("relative",{top:u,left:0}).top),a&&(i.position.left=s._convertPositionTo("relative",{top:0,left:l-s.helperProportions.width}).left),r&&(i.position.left=s._convertPositionTo("relative",{top:0,left:h}).left)),p=n||o||a||r,"outer"!==f.snapMode&&(n=g>=Math.abs(c-v),o=g>=Math.abs(u-b),a=g>=Math.abs(l-m),r=g>=Math.abs(h-_),n&&(i.position.top=s._convertPositionTo("relative",{top:c,left:0}).top),o&&(i.position.top=s._convertPositionTo("relative",{top:u-s.helperProportions.height,left:0}).top),a&&(i.position.left=s._convertPositionTo("relative",{top:0,left:l}).left),r&&(i.position.left=s._convertPositionTo("relative",{top:0,left:h-s.helperProportions.width}).left)),!s.snapElements[d].snapping&&(n||o||a||r||p)&&s.options.snap.snap&&s.options.snap.snap.call(s.element,e,t.extend(s._uiHash(),{snapItem:s.snapElements[d].item})),s.snapElements[d].snapping=n||o||a||r||p)}}),t.ui.plugin.add("draggable","stack",{start:function(e,i,s){var n,o=s.options,a=t.makeArray(t(o.stack)).sort(function(e,i){return(parseInt(t(e).css("zIndex"),10)||0)-(parseInt(t(i).css("zIndex"),10)||0)});a.length&&(n=parseInt(t(a[0]).css("zIndex"),10)||0,t(a).each(function(e){t(this).css("zIndex",n+e)}),this.css("zIndex",n+a.length))}}),t.ui.plugin.add("draggable","zIndex",{start:function(e,i,s){var n=t(i.helper),o=s.options;n.css("zIndex")&&(o._zIndex=n.css("zIndex")),n.css("zIndex",o.zIndex)},stop:function(e,i,s){var n=s.options;n._zIndex&&t(i.helper).css("zIndex",n._zIndex)}}),t.ui.draggable,t.widget("ui.droppable",{version:"1.12.1",widgetEventPrefix:"drop",options:{accept:"*",addClasses:!0,greedy:!1,scope:"default",tolerance:"intersect",activate:null,deactivate:null,drop:null,out:null,over:null},_create:function(){var e,i=this.options,s=i.accept;this.isover=!1,this.isout=!0,this.accept=t.isFunction(s)?s:function(t){return t.is(s)},this.proportions=function(){return arguments.length?(e=arguments[0],void 0):e?e:e={width:this.element[0].offsetWidth,height:this.element[0].offsetHeight}},this._addToManager(i.scope),i.addClasses&&this._addClass("ui-droppable")},_addToManager:function(e){t.ui.ddmanager.droppables[e]=t.ui.ddmanager.droppables[e]||[],t.ui.ddmanager.droppables[e].push(this)},_splice:function(t){for(var e=0;t.length>e;e++)t[e]===this&&t.splice(e,1)},_destroy:function(){var e=t.ui.ddmanager.droppables[this.options.scope];this._splice(e)},_setOption:function(e,i){if("accept"===e)this.accept=t.isFunction(i)?i:function(t){return t.is(i)};else if("scope"===e){var s=t.ui.ddmanager.droppables[this.options.scope];this._splice(s),this._addToManager(i)}this._super(e,i)},_activate:function(e){var i=t.ui.ddmanager.current;this._addActiveClass(),i&&this._trigger("activate",e,this.ui(i))
},_deactivate:function(e){var i=t.ui.ddmanager.current;this._removeActiveClass(),i&&this._trigger("deactivate",e,this.ui(i))},_over:function(e){var i=t.ui.ddmanager.current;i&&(i.currentItem||i.element)[0]!==this.element[0]&&this.accept.call(this.element[0],i.currentItem||i.element)&&(this._addHoverClass(),this._trigger("over",e,this.ui(i)))},_out:function(e){var i=t.ui.ddmanager.current;i&&(i.currentItem||i.element)[0]!==this.element[0]&&this.accept.call(this.element[0],i.currentItem||i.element)&&(this._removeHoverClass(),this._trigger("out",e,this.ui(i)))},_drop:function(e,i){var s=i||t.ui.ddmanager.current,o=!1;return s&&(s.currentItem||s.element)[0]!==this.element[0]?(this.element.find(":data(ui-droppable)").not(".ui-draggable-dragging").each(function(){var i=t(this).droppable("instance");return i.options.greedy&&!i.options.disabled&&i.options.scope===s.options.scope&&i.accept.call(i.element[0],s.currentItem||s.element)&&n(s,t.extend(i,{offset:i.element.offset()}),i.options.tolerance,e)?(o=!0,!1):void 0}),o?!1:this.accept.call(this.element[0],s.currentItem||s.element)?(this._removeActiveClass(),this._removeHoverClass(),this._trigger("drop",e,this.ui(s)),this.element):!1):!1},ui:function(t){return{draggable:t.currentItem||t.element,helper:t.helper,position:t.position,offset:t.positionAbs}},_addHoverClass:function(){this._addClass("ui-droppable-hover")},_removeHoverClass:function(){this._removeClass("ui-droppable-hover")},_addActiveClass:function(){this._addClass("ui-droppable-active")},_removeActiveClass:function(){this._removeClass("ui-droppable-active")}});var n=t.ui.intersect=function(){function t(t,e,i){return t>=e&&e+i>t}return function(e,i,s,n){if(!i.offset)return!1;var o=(e.positionAbs||e.position.absolute).left+e.margins.left,a=(e.positionAbs||e.position.absolute).top+e.margins.top,r=o+e.helperProportions.width,l=a+e.helperProportions.height,h=i.offset.left,c=i.offset.top,u=h+i.proportions().width,d=c+i.proportions().height;switch(s){case"fit":return o>=h&&u>=r&&a>=c&&d>=l;case"intersect":return o+e.helperProportions.width/2>h&&u>r-e.helperProportions.width/2&&a+e.helperProportions.height/2>c&&d>l-e.helperProportions.height/2;case"pointer":return t(n.pageY,c,i.proportions().height)&&t(n.pageX,h,i.proportions().width);case"touch":return(a>=c&&d>=a||l>=c&&d>=l||c>a&&l>d)&&(o>=h&&u>=o||r>=h&&u>=r||h>o&&r>u);default:return!1}}}();t.ui.ddmanager={current:null,droppables:{"default":[]},prepareOffsets:function(e,i){var s,n,o=t.ui.ddmanager.droppables[e.options.scope]||[],a=i?i.type:null,r=(e.currentItem||e.element).find(":data(ui-droppable)").addBack();t:for(s=0;o.length>s;s++)if(!(o[s].options.disabled||e&&!o[s].accept.call(o[s].element[0],e.currentItem||e.element))){for(n=0;r.length>n;n++)if(r[n]===o[s].element[0]){o[s].proportions().height=0;continue t}o[s].visible="none"!==o[s].element.css("display"),o[s].visible&&("mousedown"===a&&o[s]._activate.call(o[s],i),o[s].offset=o[s].element.offset(),o[s].proportions({width:o[s].element[0].offsetWidth,height:o[s].element[0].offsetHeight}))}},drop:function(e,i){var s=!1;return t.each((t.ui.ddmanager.droppables[e.options.scope]||[]).slice(),function(){this.options&&(!this.options.disabled&&this.visible&&n(e,this,this.options.tolerance,i)&&(s=this._drop.call(this,i)||s),!this.options.disabled&&this.visible&&this.accept.call(this.element[0],e.currentItem||e.element)&&(this.isout=!0,this.isover=!1,this._deactivate.call(this,i)))}),s},dragStart:function(e,i){e.element.parentsUntil("body").on("scroll.droppable",function(){e.options.refreshPositions||t.ui.ddmanager.prepareOffsets(e,i)})},drag:function(e,i){e.options.refreshPositions&&t.ui.ddmanager.prepareOffsets(e,i),t.each(t.ui.ddmanager.droppables[e.options.scope]||[],function(){if(!this.options.disabled&&!this.greedyChild&&this.visible){var s,o,a,r=n(e,this,this.options.tolerance,i),l=!r&&this.isover?"isout":r&&!this.isover?"isover":null;l&&(this.options.greedy&&(o=this.options.scope,a=this.element.parents(":data(ui-droppable)").filter(function(){return t(this).droppable("instance").options.scope===o}),a.length&&(s=t(a[0]).droppable("instance"),s.greedyChild="isover"===l)),s&&"isover"===l&&(s.isover=!1,s.isout=!0,s._out.call(s,i)),this[l]=!0,this["isout"===l?"isover":"isout"]=!1,this["isover"===l?"_over":"_out"].call(this,i),s&&"isout"===l&&(s.isout=!1,s.isover=!0,s._over.call(s,i)))}})},dragStop:function(e,i){e.element.parentsUntil("body").off("scroll.droppable"),e.options.refreshPositions||t.ui.ddmanager.prepareOffsets(e,i)}},t.uiBackCompat!==!1&&t.widget("ui.droppable",t.ui.droppable,{options:{hoverClass:!1,activeClass:!1},_addActiveClass:function(){this._super(),this.options.activeClass&&this.element.addClass(this.options.activeClass)},_removeActiveClass:function(){this._super(),this.options.activeClass&&this.element.removeClass(this.options.activeClass)},_addHoverClass:function(){this._super(),this.options.hoverClass&&this.element.addClass(this.options.hoverClass)},_removeHoverClass:function(){this._super(),this.options.hoverClass&&this.element.removeClass(this.options.hoverClass)}}),t.ui.droppable,t.widget("ui.resizable",t.ui.mouse,{version:"1.12.1",widgetEventPrefix:"resize",options:{alsoResize:!1,animate:!1,animateDuration:"slow",animateEasing:"swing",aspectRatio:!1,autoHide:!1,classes:{"ui-resizable-se":"ui-icon ui-icon-gripsmall-diagonal-se"},containment:!1,ghost:!1,grid:!1,handles:"e,s,se",helper:!1,maxHeight:null,maxWidth:null,minHeight:10,minWidth:10,zIndex:90,resize:null,start:null,stop:null},_num:function(t){return parseFloat(t)||0},_isNumber:function(t){return!isNaN(parseFloat(t))},_hasScroll:function(e,i){if("hidden"===t(e).css("overflow"))return!1;var s=i&&"left"===i?"scrollLeft":"scrollTop",n=!1;return e[s]>0?!0:(e[s]=1,n=e[s]>0,e[s]=0,n)},_create:function(){var e,i=this.options,s=this;this._addClass("ui-resizable"),t.extend(this,{_aspectRatio:!!i.aspectRatio,aspectRatio:i.aspectRatio,originalElement:this.element,_proportionallyResizeElements:[],_helper:i.helper||i.ghost||i.animate?i.helper||"ui-resizable-helper":null}),this.element[0].nodeName.match(/^(canvas|textarea|input|select|button|img)$/i)&&(this.element.wrap(t("<div class='ui-wrapper' style='overflow: hidden;'></div>").css({position:this.element.css("position"),width:this.element.outerWidth(),height:this.element.outerHeight(),top:this.element.css("top"),left:this.element.css("left")})),this.element=this.element.parent().data("ui-resizable",this.element.resizable("instance")),this.elementIsWrapper=!0,e={marginTop:this.originalElement.css("marginTop"),marginRight:this.originalElement.css("marginRight"),marginBottom:this.originalElement.css("marginBottom"),marginLeft:this.originalElement.css("marginLeft")},this.element.css(e),this.originalElement.css("margin",0),this.originalResizeStyle=this.originalElement.css("resize"),this.originalElement.css("resize","none"),this._proportionallyResizeElements.push(this.originalElement.css({position:"static",zoom:1,display:"block"})),this.originalElement.css(e),this._proportionallyResize()),this._setupHandles(),i.autoHide&&t(this.element).on("mouseenter",function(){i.disabled||(s._removeClass("ui-resizable-autohide"),s._handles.show())}).on("mouseleave",function(){i.disabled||s.resizing||(s._addClass("ui-resizable-autohide"),s._handles.hide())}),this._mouseInit()},_destroy:function(){this._mouseDestroy();var e,i=function(e){t(e).removeData("resizable").removeData("ui-resizable").off(".resizable").find(".ui-resizable-handle").remove()};return this.elementIsWrapper&&(i(this.element),e=this.element,this.originalElement.css({position:e.css("position"),width:e.outerWidth(),height:e.outerHeight(),top:e.css("top"),left:e.css("left")}).insertAfter(e),e.remove()),this.originalElement.css("resize",this.originalResizeStyle),i(this.originalElement),this},_setOption:function(t,e){switch(this._super(t,e),t){case"handles":this._removeHandles(),this._setupHandles();break;default:}},_setupHandles:function(){var e,i,s,n,o,a=this.options,r=this;if(this.handles=a.handles||(t(".ui-resizable-handle",this.element).length?{n:".ui-resizable-n",e:".ui-resizable-e",s:".ui-resizable-s",w:".ui-resizable-w",se:".ui-resizable-se",sw:".ui-resizable-sw",ne:".ui-resizable-ne",nw:".ui-resizable-nw"}:"e,s,se"),this._handles=t(),this.handles.constructor===String)for("all"===this.handles&&(this.handles="n,e,s,w,se,sw,ne,nw"),s=this.handles.split(","),this.handles={},i=0;s.length>i;i++)e=t.trim(s[i]),n="ui-resizable-"+e,o=t("<div>"),this._addClass(o,"ui-resizable-handle "+n),o.css({zIndex:a.zIndex}),this.handles[e]=".ui-resizable-"+e,this.element.append(o);this._renderAxis=function(e){var i,s,n,o;e=e||this.element;for(i in this.handles)this.handles[i].constructor===String?this.handles[i]=this.element.children(this.handles[i]).first().show():(this.handles[i].jquery||this.handles[i].nodeType)&&(this.handles[i]=t(this.handles[i]),this._on(this.handles[i],{mousedown:r._mouseDown})),this.elementIsWrapper&&this.originalElement[0].nodeName.match(/^(textarea|input|select|button)$/i)&&(s=t(this.handles[i],this.element),o=/sw|ne|nw|se|n|s/.test(i)?s.outerHeight():s.outerWidth(),n=["padding",/ne|nw|n/.test(i)?"Top":/se|sw|s/.test(i)?"Bottom":/^e$/.test(i)?"Right":"Left"].join(""),e.css(n,o),this._proportionallyResize()),this._handles=this._handles.add(this.handles[i])},this._renderAxis(this.element),this._handles=this._handles.add(this.element.find(".ui-resizable-handle")),this._handles.disableSelection(),this._handles.on("mouseover",function(){r.resizing||(this.className&&(o=this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i)),r.axis=o&&o[1]?o[1]:"se")}),a.autoHide&&(this._handles.hide(),this._addClass("ui-resizable-autohide"))},_removeHandles:function(){this._handles.remove()},_mouseCapture:function(e){var i,s,n=!1;for(i in this.handles)s=t(this.handles[i])[0],(s===e.target||t.contains(s,e.target))&&(n=!0);return!this.options.disabled&&n},_mouseStart:function(e){var i,s,n,o=this.options,a=this.element;return this.resizing=!0,this._renderProxy(),i=this._num(this.helper.css("left")),s=this._num(this.helper.css("top")),o.containment&&(i+=t(o.containment).scrollLeft()||0,s+=t(o.containment).scrollTop()||0),this.offset=this.helper.offset(),this.position={left:i,top:s},this.size=this._helper?{width:this.helper.width(),height:this.helper.height()}:{width:a.width(),height:a.height()},this.originalSize=this._helper?{width:a.outerWidth(),height:a.outerHeight()}:{width:a.width(),height:a.height()},this.sizeDiff={width:a.outerWidth()-a.width(),height:a.outerHeight()-a.height()},this.originalPosition={left:i,top:s},this.originalMousePosition={left:e.pageX,top:e.pageY},this.aspectRatio="number"==typeof o.aspectRatio?o.aspectRatio:this.originalSize.width/this.originalSize.height||1,n=t(".ui-resizable-"+this.axis).css("cursor"),t("body").css("cursor","auto"===n?this.axis+"-resize":n),this._addClass("ui-resizable-resizing"),this._propagate("start",e),!0},_mouseDrag:function(e){var i,s,n=this.originalMousePosition,o=this.axis,a=e.pageX-n.left||0,r=e.pageY-n.top||0,l=this._change[o];return this._updatePrevProperties(),l?(i=l.apply(this,[e,a,r]),this._updateVirtualBoundaries(e.shiftKey),(this._aspectRatio||e.shiftKey)&&(i=this._updateRatio(i,e)),i=this._respectSize(i,e),this._updateCache(i),this._propagate("resize",e),s=this._applyChanges(),!this._helper&&this._proportionallyResizeElements.length&&this._proportionallyResize(),t.isEmptyObject(s)||(this._updatePrevProperties(),this._trigger("resize",e,this.ui()),this._applyChanges()),!1):!1},_mouseStop:function(e){this.resizing=!1;var i,s,n,o,a,r,l,h=this.options,c=this;return this._helper&&(i=this._proportionallyResizeElements,s=i.length&&/textarea/i.test(i[0].nodeName),n=s&&this._hasScroll(i[0],"left")?0:c.sizeDiff.height,o=s?0:c.sizeDiff.width,a={width:c.helper.width()-o,height:c.helper.height()-n},r=parseFloat(c.element.css("left"))+(c.position.left-c.originalPosition.left)||null,l=parseFloat(c.element.css("top"))+(c.position.top-c.originalPosition.top)||null,h.animate||this.element.css(t.extend(a,{top:l,left:r})),c.helper.height(c.size.height),c.helper.width(c.size.width),this._helper&&!h.animate&&this._proportionallyResize()),t("body").css("cursor","auto"),this._removeClass("ui-resizable-resizing"),this._propagate("stop",e),this._helper&&this.helper.remove(),!1},_updatePrevProperties:function(){this.prevPosition={top:this.position.top,left:this.position.left},this.prevSize={width:this.size.width,height:this.size.height}},_applyChanges:function(){var t={};return this.position.top!==this.prevPosition.top&&(t.top=this.position.top+"px"),this.position.left!==this.prevPosition.left&&(t.left=this.position.left+"px"),this.size.width!==this.prevSize.width&&(t.width=this.size.width+"px"),this.size.height!==this.prevSize.height&&(t.height=this.size.height+"px"),this.helper.css(t),t},_updateVirtualBoundaries:function(t){var e,i,s,n,o,a=this.options;o={minWidth:this._isNumber(a.minWidth)?a.minWidth:0,maxWidth:this._isNumber(a.maxWidth)?a.maxWidth:1/0,minHeight:this._isNumber(a.minHeight)?a.minHeight:0,maxHeight:this._isNumber(a.maxHeight)?a.maxHeight:1/0},(this._aspectRatio||t)&&(e=o.minHeight*this.aspectRatio,s=o.minWidth/this.aspectRatio,i=o.maxHeight*this.aspectRatio,n=o.maxWidth/this.aspectRatio,e>o.minWidth&&(o.minWidth=e),s>o.minHeight&&(o.minHeight=s),o.maxWidth>i&&(o.maxWidth=i),o.maxHeight>n&&(o.maxHeight=n)),this._vBoundaries=o},_updateCache:function(t){this.offset=this.helper.offset(),this._isNumber(t.left)&&(this.position.left=t.left),this._isNumber(t.top)&&(this.position.top=t.top),this._isNumber(t.height)&&(this.size.height=t.height),this._isNumber(t.width)&&(this.size.width=t.width)},_updateRatio:function(t){var e=this.position,i=this.size,s=this.axis;return this._isNumber(t.height)?t.width=t.height*this.aspectRatio:this._isNumber(t.width)&&(t.height=t.width/this.aspectRatio),"sw"===s&&(t.left=e.left+(i.width-t.width),t.top=null),"nw"===s&&(t.top=e.top+(i.height-t.height),t.left=e.left+(i.width-t.width)),t},_respectSize:function(t){var e=this._vBoundaries,i=this.axis,s=this._isNumber(t.width)&&e.maxWidth&&e.maxWidth<t.width,n=this._isNumber(t.height)&&e.maxHeight&&e.maxHeight<t.height,o=this._isNumber(t.width)&&e.minWidth&&e.minWidth>t.width,a=this._isNumber(t.height)&&e.minHeight&&e.minHeight>t.height,r=this.originalPosition.left+this.originalSize.width,l=this.originalPosition.top+this.originalSize.height,h=/sw|nw|w/.test(i),c=/nw|ne|n/.test(i);return o&&(t.width=e.minWidth),a&&(t.height=e.minHeight),s&&(t.width=e.maxWidth),n&&(t.height=e.maxHeight),o&&h&&(t.left=r-e.minWidth),s&&h&&(t.left=r-e.maxWidth),a&&c&&(t.top=l-e.minHeight),n&&c&&(t.top=l-e.maxHeight),t.width||t.height||t.left||!t.top?t.width||t.height||t.top||!t.left||(t.left=null):t.top=null,t},_getPaddingPlusBorderDimensions:function(t){for(var e=0,i=[],s=[t.css("borderTopWidth"),t.css("borderRightWidth"),t.css("borderBottomWidth"),t.css("borderLeftWidth")],n=[t.css("paddingTop"),t.css("paddingRight"),t.css("paddingBottom"),t.css("paddingLeft")];4>e;e++)i[e]=parseFloat(s[e])||0,i[e]+=parseFloat(n[e])||0;return{height:i[0]+i[2],width:i[1]+i[3]}},_proportionallyResize:function(){if(this._proportionallyResizeElements.length)for(var t,e=0,i=this.helper||this.element;this._proportionallyResizeElements.length>e;e++)t=this._proportionallyResizeElements[e],this.outerDimensions||(this.outerDimensions=this._getPaddingPlusBorderDimensions(t)),t.css({height:i.height()-this.outerDimensions.height||0,width:i.width()-this.outerDimensions.width||0})},_renderProxy:function(){var e=this.element,i=this.options;this.elementOffset=e.offset(),this._helper?(this.helper=this.helper||t("<div style='overflow:hidden;'></div>"),this._addClass(this.helper,this._helper),this.helper.css({width:this.element.outerWidth(),height:this.element.outerHeight(),position:"absolute",left:this.elementOffset.left+"px",top:this.elementOffset.top+"px",zIndex:++i.zIndex}),this.helper.appendTo("body").disableSelection()):this.helper=this.element},_change:{e:function(t,e){return{width:this.originalSize.width+e}},w:function(t,e){var i=this.originalSize,s=this.originalPosition;return{left:s.left+e,width:i.width-e}},n:function(t,e,i){var s=this.originalSize,n=this.originalPosition;return{top:n.top+i,height:s.height-i}},s:function(t,e,i){return{height:this.originalSize.height+i}},se:function(e,i,s){return t.extend(this._change.s.apply(this,arguments),this._change.e.apply(this,[e,i,s]))},sw:function(e,i,s){return t.extend(this._change.s.apply(this,arguments),this._change.w.apply(this,[e,i,s]))},ne:function(e,i,s){return t.extend(this._change.n.apply(this,arguments),this._change.e.apply(this,[e,i,s]))},nw:function(e,i,s){return t.extend(this._change.n.apply(this,arguments),this._change.w.apply(this,[e,i,s]))}},_propagate:function(e,i){t.ui.plugin.call(this,e,[i,this.ui()]),"resize"!==e&&this._trigger(e,i,this.ui())},plugins:{},ui:function(){return{originalElement:this.originalElement,element:this.element,helper:this.helper,position:this.position,size:this.size,originalSize:this.originalSize,originalPosition:this.originalPosition}}}),t.ui.plugin.add("resizable","animate",{stop:function(e){var i=t(this).resizable("instance"),s=i.options,n=i._proportionallyResizeElements,o=n.length&&/textarea/i.test(n[0].nodeName),a=o&&i._hasScroll(n[0],"left")?0:i.sizeDiff.height,r=o?0:i.sizeDiff.width,l={width:i.size.width-r,height:i.size.height-a},h=parseFloat(i.element.css("left"))+(i.position.left-i.originalPosition.left)||null,c=parseFloat(i.element.css("top"))+(i.position.top-i.originalPosition.top)||null;i.element.animate(t.extend(l,c&&h?{top:c,left:h}:{}),{duration:s.animateDuration,easing:s.animateEasing,step:function(){var s={width:parseFloat(i.element.css("width")),height:parseFloat(i.element.css("height")),top:parseFloat(i.element.css("top")),left:parseFloat(i.element.css("left"))};n&&n.length&&t(n[0]).css({width:s.width,height:s.height}),i._updateCache(s),i._propagate("resize",e)}})}}),t.ui.plugin.add("resizable","containment",{start:function(){var e,i,s,n,o,a,r,l=t(this).resizable("instance"),h=l.options,c=l.element,u=h.containment,d=u instanceof t?u.get(0):/parent/.test(u)?c.parent().get(0):u;d&&(l.containerElement=t(d),/document/.test(u)||u===document?(l.containerOffset={left:0,top:0},l.containerPosition={left:0,top:0},l.parentData={element:t(document),left:0,top:0,width:t(document).width(),height:t(document).height()||document.body.parentNode.scrollHeight}):(e=t(d),i=[],t(["Top","Right","Left","Bottom"]).each(function(t,s){i[t]=l._num(e.css("padding"+s))}),l.containerOffset=e.offset(),l.containerPosition=e.position(),l.containerSize={height:e.innerHeight()-i[3],width:e.innerWidth()-i[1]},s=l.containerOffset,n=l.containerSize.height,o=l.containerSize.width,a=l._hasScroll(d,"left")?d.scrollWidth:o,r=l._hasScroll(d)?d.scrollHeight:n,l.parentData={element:d,left:s.left,top:s.top,width:a,height:r}))},resize:function(e){var i,s,n,o,a=t(this).resizable("instance"),r=a.options,l=a.containerOffset,h=a.position,c=a._aspectRatio||e.shiftKey,u={top:0,left:0},d=a.containerElement,p=!0;d[0]!==document&&/static/.test(d.css("position"))&&(u=l),h.left<(a._helper?l.left:0)&&(a.size.width=a.size.width+(a._helper?a.position.left-l.left:a.position.left-u.left),c&&(a.size.height=a.size.width/a.aspectRatio,p=!1),a.position.left=r.helper?l.left:0),h.top<(a._helper?l.top:0)&&(a.size.height=a.size.height+(a._helper?a.position.top-l.top:a.position.top),c&&(a.size.width=a.size.height*a.aspectRatio,p=!1),a.position.top=a._helper?l.top:0),n=a.containerElement.get(0)===a.element.parent().get(0),o=/relative|absolute/.test(a.containerElement.css("position")),n&&o?(a.offset.left=a.parentData.left+a.position.left,a.offset.top=a.parentData.top+a.position.top):(a.offset.left=a.element.offset().left,a.offset.top=a.element.offset().top),i=Math.abs(a.sizeDiff.width+(a._helper?a.offset.left-u.left:a.offset.left-l.left)),s=Math.abs(a.sizeDiff.height+(a._helper?a.offset.top-u.top:a.offset.top-l.top)),i+a.size.width>=a.parentData.width&&(a.size.width=a.parentData.width-i,c&&(a.size.height=a.size.width/a.aspectRatio,p=!1)),s+a.size.height>=a.parentData.height&&(a.size.height=a.parentData.height-s,c&&(a.size.width=a.size.height*a.aspectRatio,p=!1)),p||(a.position.left=a.prevPosition.left,a.position.top=a.prevPosition.top,a.size.width=a.prevSize.width,a.size.height=a.prevSize.height)},stop:function(){var e=t(this).resizable("instance"),i=e.options,s=e.containerOffset,n=e.containerPosition,o=e.containerElement,a=t(e.helper),r=a.offset(),l=a.outerWidth()-e.sizeDiff.width,h=a.outerHeight()-e.sizeDiff.height;e._helper&&!i.animate&&/relative/.test(o.css("position"))&&t(this).css({left:r.left-n.left-s.left,width:l,height:h}),e._helper&&!i.animate&&/static/.test(o.css("position"))&&t(this).css({left:r.left-n.left-s.left,width:l,height:h})}}),t.ui.plugin.add("resizable","alsoResize",{start:function(){var e=t(this).resizable("instance"),i=e.options;t(i.alsoResize).each(function(){var e=t(this);e.data("ui-resizable-alsoresize",{width:parseFloat(e.width()),height:parseFloat(e.height()),left:parseFloat(e.css("left")),top:parseFloat(e.css("top"))})})},resize:function(e,i){var s=t(this).resizable("instance"),n=s.options,o=s.originalSize,a=s.originalPosition,r={height:s.size.height-o.height||0,width:s.size.width-o.width||0,top:s.position.top-a.top||0,left:s.position.left-a.left||0};t(n.alsoResize).each(function(){var e=t(this),s=t(this).data("ui-resizable-alsoresize"),n={},o=e.parents(i.originalElement[0]).length?["width","height"]:["width","height","top","left"];t.each(o,function(t,e){var i=(s[e]||0)+(r[e]||0);i&&i>=0&&(n[e]=i||null)}),e.css(n)})},stop:function(){t(this).removeData("ui-resizable-alsoresize")}}),t.ui.plugin.add("resizable","ghost",{start:function(){var e=t(this).resizable("instance"),i=e.size;e.ghost=e.originalElement.clone(),e.ghost.css({opacity:.25,display:"block",position:"relative",height:i.height,width:i.width,margin:0,left:0,top:0}),e._addClass(e.ghost,"ui-resizable-ghost"),t.uiBackCompat!==!1&&"string"==typeof e.options.ghost&&e.ghost.addClass(this.options.ghost),e.ghost.appendTo(e.helper)},resize:function(){var e=t(this).resizable("instance");e.ghost&&e.ghost.css({position:"relative",height:e.size.height,width:e.size.width})},stop:function(){var e=t(this).resizable("instance");e.ghost&&e.helper&&e.helper.get(0).removeChild(e.ghost.get(0))}}),t.ui.plugin.add("resizable","grid",{resize:function(){var e,i=t(this).resizable("instance"),s=i.options,n=i.size,o=i.originalSize,a=i.originalPosition,r=i.axis,l="number"==typeof s.grid?[s.grid,s.grid]:s.grid,h=l[0]||1,c=l[1]||1,u=Math.round((n.width-o.width)/h)*h,d=Math.round((n.height-o.height)/c)*c,p=o.width+u,f=o.height+d,g=s.maxWidth&&p>s.maxWidth,m=s.maxHeight&&f>s.maxHeight,_=s.minWidth&&s.minWidth>p,v=s.minHeight&&s.minHeight>f;s.grid=l,_&&(p+=h),v&&(f+=c),g&&(p-=h),m&&(f-=c),/^(se|s|e)$/.test(r)?(i.size.width=p,i.size.height=f):/^(ne)$/.test(r)?(i.size.width=p,i.size.height=f,i.position.top=a.top-d):/^(sw)$/.test(r)?(i.size.width=p,i.size.height=f,i.position.left=a.left-u):((0>=f-c||0>=p-h)&&(e=i._getPaddingPlusBorderDimensions(this)),f-c>0?(i.size.height=f,i.position.top=a.top-d):(f=c-e.height,i.size.height=f,i.position.top=a.top+o.height-f),p-h>0?(i.size.width=p,i.position.left=a.left-u):(p=h-e.width,i.size.width=p,i.position.left=a.left+o.width-p))}}),t.ui.resizable,t.widget("ui.selectable",t.ui.mouse,{version:"1.12.1",options:{appendTo:"body",autoRefresh:!0,distance:0,filter:"*",tolerance:"touch",selected:null,selecting:null,start:null,stop:null,unselected:null,unselecting:null},_create:function(){var e=this;this._addClass("ui-selectable"),this.dragged=!1,this.refresh=function(){e.elementPos=t(e.element[0]).offset(),e.selectees=t(e.options.filter,e.element[0]),e._addClass(e.selectees,"ui-selectee"),e.selectees.each(function(){var i=t(this),s=i.offset(),n={left:s.left-e.elementPos.left,top:s.top-e.elementPos.top};t.data(this,"selectable-item",{element:this,$element:i,left:n.left,top:n.top,right:n.left+i.outerWidth(),bottom:n.top+i.outerHeight(),startselected:!1,selected:i.hasClass("ui-selected"),selecting:i.hasClass("ui-selecting"),unselecting:i.hasClass("ui-unselecting")})})},this.refresh(),this._mouseInit(),this.helper=t("<div>"),this._addClass(this.helper,"ui-selectable-helper")},_destroy:function(){this.selectees.removeData("selectable-item"),this._mouseDestroy()},_mouseStart:function(e){var i=this,s=this.options;this.opos=[e.pageX,e.pageY],this.elementPos=t(this.element[0]).offset(),this.options.disabled||(this.selectees=t(s.filter,this.element[0]),this._trigger("start",e),t(s.appendTo).append(this.helper),this.helper.css({left:e.pageX,top:e.pageY,width:0,height:0}),s.autoRefresh&&this.refresh(),this.selectees.filter(".ui-selected").each(function(){var s=t.data(this,"selectable-item");s.startselected=!0,e.metaKey||e.ctrlKey||(i._removeClass(s.$element,"ui-selected"),s.selected=!1,i._addClass(s.$element,"ui-unselecting"),s.unselecting=!0,i._trigger("unselecting",e,{unselecting:s.element}))}),t(e.target).parents().addBack().each(function(){var s,n=t.data(this,"selectable-item");return n?(s=!e.metaKey&&!e.ctrlKey||!n.$element.hasClass("ui-selected"),i._removeClass(n.$element,s?"ui-unselecting":"ui-selected")._addClass(n.$element,s?"ui-selecting":"ui-unselecting"),n.unselecting=!s,n.selecting=s,n.selected=s,s?i._trigger("selecting",e,{selecting:n.element}):i._trigger("unselecting",e,{unselecting:n.element}),!1):void 0}))},_mouseDrag:function(e){if(this.dragged=!0,!this.options.disabled){var i,s=this,n=this.options,o=this.opos[0],a=this.opos[1],r=e.pageX,l=e.pageY;return o>r&&(i=r,r=o,o=i),a>l&&(i=l,l=a,a=i),this.helper.css({left:o,top:a,width:r-o,height:l-a}),this.selectees.each(function(){var i=t.data(this,"selectable-item"),h=!1,c={};i&&i.element!==s.element[0]&&(c.left=i.left+s.elementPos.left,c.right=i.right+s.elementPos.left,c.top=i.top+s.elementPos.top,c.bottom=i.bottom+s.elementPos.top,"touch"===n.tolerance?h=!(c.left>r||o>c.right||c.top>l||a>c.bottom):"fit"===n.tolerance&&(h=c.left>o&&r>c.right&&c.top>a&&l>c.bottom),h?(i.selected&&(s._removeClass(i.$element,"ui-selected"),i.selected=!1),i.unselecting&&(s._removeClass(i.$element,"ui-unselecting"),i.unselecting=!1),i.selecting||(s._addClass(i.$element,"ui-selecting"),i.selecting=!0,s._trigger("selecting",e,{selecting:i.element}))):(i.selecting&&((e.metaKey||e.ctrlKey)&&i.startselected?(s._removeClass(i.$element,"ui-selecting"),i.selecting=!1,s._addClass(i.$element,"ui-selected"),i.selected=!0):(s._removeClass(i.$element,"ui-selecting"),i.selecting=!1,i.startselected&&(s._addClass(i.$element,"ui-unselecting"),i.unselecting=!0),s._trigger("unselecting",e,{unselecting:i.element}))),i.selected&&(e.metaKey||e.ctrlKey||i.startselected||(s._removeClass(i.$element,"ui-selected"),i.selected=!1,s._addClass(i.$element,"ui-unselecting"),i.unselecting=!0,s._trigger("unselecting",e,{unselecting:i.element})))))}),!1}},_mouseStop:function(e){var i=this;return this.dragged=!1,t(".ui-unselecting",this.element[0]).each(function(){var s=t.data(this,"selectable-item");i._removeClass(s.$element,"ui-unselecting"),s.unselecting=!1,s.startselected=!1,i._trigger("unselected",e,{unselected:s.element})}),t(".ui-selecting",this.element[0]).each(function(){var s=t.data(this,"selectable-item");i._removeClass(s.$element,"ui-selecting")._addClass(s.$element,"ui-selected"),s.selecting=!1,s.selected=!0,s.startselected=!0,i._trigger("selected",e,{selected:s.element})}),this._trigger("stop",e),this.helper.remove(),!1}}),t.widget("ui.sortable",t.ui.mouse,{version:"1.12.1",widgetEventPrefix:"sort",ready:!1,options:{appendTo:"parent",axis:!1,connectWith:!1,containment:!1,cursor:"auto",cursorAt:!1,dropOnEmpty:!0,forcePlaceholderSize:!1,forceHelperSize:!1,grid:!1,handle:!1,helper:"original",items:"> *",opacity:!1,placeholder:!1,revert:!1,scroll:!0,scrollSensitivity:20,scrollSpeed:20,scope:"default",tolerance:"intersect",zIndex:1e3,activate:null,beforeStop:null,change:null,deactivate:null,out:null,over:null,receive:null,remove:null,sort:null,start:null,stop:null,update:null},_isOverAxis:function(t,e,i){return t>=e&&e+i>t},_isFloating:function(t){return/left|right/.test(t.css("float"))||/inline|table-cell/.test(t.css("display"))},_create:function(){this.containerCache={},this._addClass("ui-sortable"),this.refresh(),this.offset=this.element.offset(),this._mouseInit(),this._setHandleClassName(),this.ready=!0},_setOption:function(t,e){this._super(t,e),"handle"===t&&this._setHandleClassName()},_setHandleClassName:function(){var e=this;this._removeClass(this.element.find(".ui-sortable-handle"),"ui-sortable-handle"),t.each(this.items,function(){e._addClass(this.instance.options.handle?this.item.find(this.instance.options.handle):this.item,"ui-sortable-handle")})},_destroy:function(){this._mouseDestroy();for(var t=this.items.length-1;t>=0;t--)this.items[t].item.removeData(this.widgetName+"-item");return this},_mouseCapture:function(e,i){var s=null,n=!1,o=this;return this.reverting?!1:this.options.disabled||"static"===this.options.type?!1:(this._refreshItems(e),t(e.target).parents().each(function(){return t.data(this,o.widgetName+"-item")===o?(s=t(this),!1):void 0}),t.data(e.target,o.widgetName+"-item")===o&&(s=t(e.target)),s?!this.options.handle||i||(t(this.options.handle,s).find("*").addBack().each(function(){this===e.target&&(n=!0)}),n)?(this.currentItem=s,this._removeCurrentsFromItems(),!0):!1:!1)},_mouseStart:function(e,i,s){var n,o,a=this.options;if(this.currentContainer=this,this.refreshPositions(),this.helper=this._createHelper(e),this._cacheHelperProportions(),this._cacheMargins(),this.scrollParent=this.helper.scrollParent(),this.offset=this.currentItem.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},t.extend(this.offset,{click:{left:e.pageX-this.offset.left,top:e.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.helper.css("position","absolute"),this.cssPosition=this.helper.css("position"),this.originalPosition=this._generatePosition(e),this.originalPageX=e.pageX,this.originalPageY=e.pageY,a.cursorAt&&this._adjustOffsetFromHelper(a.cursorAt),this.domPosition={prev:this.currentItem.prev()[0],parent:this.currentItem.parent()[0]},this.helper[0]!==this.currentItem[0]&&this.currentItem.hide(),this._createPlaceholder(),a.containment&&this._setContainment(),a.cursor&&"auto"!==a.cursor&&(o=this.document.find("body"),this.storedCursor=o.css("cursor"),o.css("cursor",a.cursor),this.storedStylesheet=t("<style>*{ cursor: "+a.cursor+" !important; }</style>").appendTo(o)),a.opacity&&(this.helper.css("opacity")&&(this._storedOpacity=this.helper.css("opacity")),this.helper.css("opacity",a.opacity)),a.zIndex&&(this.helper.css("zIndex")&&(this._storedZIndex=this.helper.css("zIndex")),this.helper.css("zIndex",a.zIndex)),this.scrollParent[0]!==this.document[0]&&"HTML"!==this.scrollParent[0].tagName&&(this.overflowOffset=this.scrollParent.offset()),this._trigger("start",e,this._uiHash()),this._preserveHelperProportions||this._cacheHelperProportions(),!s)for(n=this.containers.length-1;n>=0;n--)this.containers[n]._trigger("activate",e,this._uiHash(this));return t.ui.ddmanager&&(t.ui.ddmanager.current=this),t.ui.ddmanager&&!a.dropBehaviour&&t.ui.ddmanager.prepareOffsets(this,e),this.dragging=!0,this._addClass(this.helper,"ui-sortable-helper"),this._mouseDrag(e),!0},_mouseDrag:function(e){var i,s,n,o,a=this.options,r=!1;for(this.position=this._generatePosition(e),this.positionAbs=this._convertPositionTo("absolute"),this.lastPositionAbs||(this.lastPositionAbs=this.positionAbs),this.options.scroll&&(this.scrollParent[0]!==this.document[0]&&"HTML"!==this.scrollParent[0].tagName?(this.overflowOffset.top+this.scrollParent[0].offsetHeight-e.pageY<a.scrollSensitivity?this.scrollParent[0].scrollTop=r=this.scrollParent[0].scrollTop+a.scrollSpeed:e.pageY-this.overflowOffset.top<a.scrollSensitivity&&(this.scrollParent[0].scrollTop=r=this.scrollParent[0].scrollTop-a.scrollSpeed),this.overflowOffset.left+this.scrollParent[0].offsetWidth-e.pageX<a.scrollSensitivity?this.scrollParent[0].scrollLeft=r=this.scrollParent[0].scrollLeft+a.scrollSpeed:e.pageX-this.overflowOffset.left<a.scrollSensitivity&&(this.scrollParent[0].scrollLeft=r=this.scrollParent[0].scrollLeft-a.scrollSpeed)):(e.pageY-this.document.scrollTop()<a.scrollSensitivity?r=this.document.scrollTop(this.document.scrollTop()-a.scrollSpeed):this.window.height()-(e.pageY-this.document.scrollTop())<a.scrollSensitivity&&(r=this.document.scrollTop(this.document.scrollTop()+a.scrollSpeed)),e.pageX-this.document.scrollLeft()<a.scrollSensitivity?r=this.document.scrollLeft(this.document.scrollLeft()-a.scrollSpeed):this.window.width()-(e.pageX-this.document.scrollLeft())<a.scrollSensitivity&&(r=this.document.scrollLeft(this.document.scrollLeft()+a.scrollSpeed))),r!==!1&&t.ui.ddmanager&&!a.dropBehaviour&&t.ui.ddmanager.prepareOffsets(this,e)),this.positionAbs=this._convertPositionTo("absolute"),this.options.axis&&"y"===this.options.axis||(this.helper[0].style.left=this.position.left+"px"),this.options.axis&&"x"===this.options.axis||(this.helper[0].style.top=this.position.top+"px"),i=this.items.length-1;i>=0;i--)if(s=this.items[i],n=s.item[0],o=this._intersectsWithPointer(s),o&&s.instance===this.currentContainer&&n!==this.currentItem[0]&&this.placeholder[1===o?"next":"prev"]()[0]!==n&&!t.contains(this.placeholder[0],n)&&("semi-dynamic"===this.options.type?!t.contains(this.element[0],n):!0)){if(this.direction=1===o?"down":"up","pointer"!==this.options.tolerance&&!this._intersectsWithSides(s))break;
this._rearrange(e,s),this._trigger("change",e,this._uiHash());break}return this._contactContainers(e),t.ui.ddmanager&&t.ui.ddmanager.drag(this,e),this._trigger("sort",e,this._uiHash()),this.lastPositionAbs=this.positionAbs,!1},_mouseStop:function(e,i){if(e){if(t.ui.ddmanager&&!this.options.dropBehaviour&&t.ui.ddmanager.drop(this,e),this.options.revert){var s=this,n=this.placeholder.offset(),o=this.options.axis,a={};o&&"x"!==o||(a.left=n.left-this.offset.parent.left-this.margins.left+(this.offsetParent[0]===this.document[0].body?0:this.offsetParent[0].scrollLeft)),o&&"y"!==o||(a.top=n.top-this.offset.parent.top-this.margins.top+(this.offsetParent[0]===this.document[0].body?0:this.offsetParent[0].scrollTop)),this.reverting=!0,t(this.helper).animate(a,parseInt(this.options.revert,10)||500,function(){s._clear(e)})}else this._clear(e,i);return!1}},cancel:function(){if(this.dragging){this._mouseUp(new t.Event("mouseup",{target:null})),"original"===this.options.helper?(this.currentItem.css(this._storedCSS),this._removeClass(this.currentItem,"ui-sortable-helper")):this.currentItem.show();for(var e=this.containers.length-1;e>=0;e--)this.containers[e]._trigger("deactivate",null,this._uiHash(this)),this.containers[e].containerCache.over&&(this.containers[e]._trigger("out",null,this._uiHash(this)),this.containers[e].containerCache.over=0)}return this.placeholder&&(this.placeholder[0].parentNode&&this.placeholder[0].parentNode.removeChild(this.placeholder[0]),"original"!==this.options.helper&&this.helper&&this.helper[0].parentNode&&this.helper.remove(),t.extend(this,{helper:null,dragging:!1,reverting:!1,_noFinalSort:null}),this.domPosition.prev?t(this.domPosition.prev).after(this.currentItem):t(this.domPosition.parent).prepend(this.currentItem)),this},serialize:function(e){var i=this._getItemsAsjQuery(e&&e.connected),s=[];return e=e||{},t(i).each(function(){var i=(t(e.item||this).attr(e.attribute||"id")||"").match(e.expression||/(.+)[\-=_](.+)/);i&&s.push((e.key||i[1]+"[]")+"="+(e.key&&e.expression?i[1]:i[2]))}),!s.length&&e.key&&s.push(e.key+"="),s.join("&")},toArray:function(e){var i=this._getItemsAsjQuery(e&&e.connected),s=[];return e=e||{},i.each(function(){s.push(t(e.item||this).attr(e.attribute||"id")||"")}),s},_intersectsWith:function(t){var e=this.positionAbs.left,i=e+this.helperProportions.width,s=this.positionAbs.top,n=s+this.helperProportions.height,o=t.left,a=o+t.width,r=t.top,l=r+t.height,h=this.offset.click.top,c=this.offset.click.left,u="x"===this.options.axis||s+h>r&&l>s+h,d="y"===this.options.axis||e+c>o&&a>e+c,p=u&&d;return"pointer"===this.options.tolerance||this.options.forcePointerForContainers||"pointer"!==this.options.tolerance&&this.helperProportions[this.floating?"width":"height"]>t[this.floating?"width":"height"]?p:e+this.helperProportions.width/2>o&&a>i-this.helperProportions.width/2&&s+this.helperProportions.height/2>r&&l>n-this.helperProportions.height/2},_intersectsWithPointer:function(t){var e,i,s="x"===this.options.axis||this._isOverAxis(this.positionAbs.top+this.offset.click.top,t.top,t.height),n="y"===this.options.axis||this._isOverAxis(this.positionAbs.left+this.offset.click.left,t.left,t.width),o=s&&n;return o?(e=this._getDragVerticalDirection(),i=this._getDragHorizontalDirection(),this.floating?"right"===i||"down"===e?2:1:e&&("down"===e?2:1)):!1},_intersectsWithSides:function(t){var e=this._isOverAxis(this.positionAbs.top+this.offset.click.top,t.top+t.height/2,t.height),i=this._isOverAxis(this.positionAbs.left+this.offset.click.left,t.left+t.width/2,t.width),s=this._getDragVerticalDirection(),n=this._getDragHorizontalDirection();return this.floating&&n?"right"===n&&i||"left"===n&&!i:s&&("down"===s&&e||"up"===s&&!e)},_getDragVerticalDirection:function(){var t=this.positionAbs.top-this.lastPositionAbs.top;return 0!==t&&(t>0?"down":"up")},_getDragHorizontalDirection:function(){var t=this.positionAbs.left-this.lastPositionAbs.left;return 0!==t&&(t>0?"right":"left")},refresh:function(t){return this._refreshItems(t),this._setHandleClassName(),this.refreshPositions(),this},_connectWith:function(){var t=this.options;return t.connectWith.constructor===String?[t.connectWith]:t.connectWith},_getItemsAsjQuery:function(e){function i(){r.push(this)}var s,n,o,a,r=[],l=[],h=this._connectWith();if(h&&e)for(s=h.length-1;s>=0;s--)for(o=t(h[s],this.document[0]),n=o.length-1;n>=0;n--)a=t.data(o[n],this.widgetFullName),a&&a!==this&&!a.options.disabled&&l.push([t.isFunction(a.options.items)?a.options.items.call(a.element):t(a.options.items,a.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),a]);for(l.push([t.isFunction(this.options.items)?this.options.items.call(this.element,null,{options:this.options,item:this.currentItem}):t(this.options.items,this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),this]),s=l.length-1;s>=0;s--)l[s][0].each(i);return t(r)},_removeCurrentsFromItems:function(){var e=this.currentItem.find(":data("+this.widgetName+"-item)");this.items=t.grep(this.items,function(t){for(var i=0;e.length>i;i++)if(e[i]===t.item[0])return!1;return!0})},_refreshItems:function(e){this.items=[],this.containers=[this];var i,s,n,o,a,r,l,h,c=this.items,u=[[t.isFunction(this.options.items)?this.options.items.call(this.element[0],e,{item:this.currentItem}):t(this.options.items,this.element),this]],d=this._connectWith();if(d&&this.ready)for(i=d.length-1;i>=0;i--)for(n=t(d[i],this.document[0]),s=n.length-1;s>=0;s--)o=t.data(n[s],this.widgetFullName),o&&o!==this&&!o.options.disabled&&(u.push([t.isFunction(o.options.items)?o.options.items.call(o.element[0],e,{item:this.currentItem}):t(o.options.items,o.element),o]),this.containers.push(o));for(i=u.length-1;i>=0;i--)for(a=u[i][1],r=u[i][0],s=0,h=r.length;h>s;s++)l=t(r[s]),l.data(this.widgetName+"-item",a),c.push({item:l,instance:a,width:0,height:0,left:0,top:0})},refreshPositions:function(e){this.floating=this.items.length?"x"===this.options.axis||this._isFloating(this.items[0].item):!1,this.offsetParent&&this.helper&&(this.offset.parent=this._getParentOffset());var i,s,n,o;for(i=this.items.length-1;i>=0;i--)s=this.items[i],s.instance!==this.currentContainer&&this.currentContainer&&s.item[0]!==this.currentItem[0]||(n=this.options.toleranceElement?t(this.options.toleranceElement,s.item):s.item,e||(s.width=n.outerWidth(),s.height=n.outerHeight()),o=n.offset(),s.left=o.left,s.top=o.top);if(this.options.custom&&this.options.custom.refreshContainers)this.options.custom.refreshContainers.call(this);else for(i=this.containers.length-1;i>=0;i--)o=this.containers[i].element.offset(),this.containers[i].containerCache.left=o.left,this.containers[i].containerCache.top=o.top,this.containers[i].containerCache.width=this.containers[i].element.outerWidth(),this.containers[i].containerCache.height=this.containers[i].element.outerHeight();return this},_createPlaceholder:function(e){e=e||this;var i,s=e.options;s.placeholder&&s.placeholder.constructor!==String||(i=s.placeholder,s.placeholder={element:function(){var s=e.currentItem[0].nodeName.toLowerCase(),n=t("<"+s+">",e.document[0]);return e._addClass(n,"ui-sortable-placeholder",i||e.currentItem[0].className)._removeClass(n,"ui-sortable-helper"),"tbody"===s?e._createTrPlaceholder(e.currentItem.find("tr").eq(0),t("<tr>",e.document[0]).appendTo(n)):"tr"===s?e._createTrPlaceholder(e.currentItem,n):"img"===s&&n.attr("src",e.currentItem.attr("src")),i||n.css("visibility","hidden"),n},update:function(t,n){(!i||s.forcePlaceholderSize)&&(n.height()||n.height(e.currentItem.innerHeight()-parseInt(e.currentItem.css("paddingTop")||0,10)-parseInt(e.currentItem.css("paddingBottom")||0,10)),n.width()||n.width(e.currentItem.innerWidth()-parseInt(e.currentItem.css("paddingLeft")||0,10)-parseInt(e.currentItem.css("paddingRight")||0,10)))}}),e.placeholder=t(s.placeholder.element.call(e.element,e.currentItem)),e.currentItem.after(e.placeholder),s.placeholder.update(e,e.placeholder)},_createTrPlaceholder:function(e,i){var s=this;e.children().each(function(){t("<td>&#160;</td>",s.document[0]).attr("colspan",t(this).attr("colspan")||1).appendTo(i)})},_contactContainers:function(e){var i,s,n,o,a,r,l,h,c,u,d=null,p=null;for(i=this.containers.length-1;i>=0;i--)if(!t.contains(this.currentItem[0],this.containers[i].element[0]))if(this._intersectsWith(this.containers[i].containerCache)){if(d&&t.contains(this.containers[i].element[0],d.element[0]))continue;d=this.containers[i],p=i}else this.containers[i].containerCache.over&&(this.containers[i]._trigger("out",e,this._uiHash(this)),this.containers[i].containerCache.over=0);if(d)if(1===this.containers.length)this.containers[p].containerCache.over||(this.containers[p]._trigger("over",e,this._uiHash(this)),this.containers[p].containerCache.over=1);else{for(n=1e4,o=null,c=d.floating||this._isFloating(this.currentItem),a=c?"left":"top",r=c?"width":"height",u=c?"pageX":"pageY",s=this.items.length-1;s>=0;s--)t.contains(this.containers[p].element[0],this.items[s].item[0])&&this.items[s].item[0]!==this.currentItem[0]&&(l=this.items[s].item.offset()[a],h=!1,e[u]-l>this.items[s][r]/2&&(h=!0),n>Math.abs(e[u]-l)&&(n=Math.abs(e[u]-l),o=this.items[s],this.direction=h?"up":"down"));if(!o&&!this.options.dropOnEmpty)return;if(this.currentContainer===this.containers[p])return this.currentContainer.containerCache.over||(this.containers[p]._trigger("over",e,this._uiHash()),this.currentContainer.containerCache.over=1),void 0;o?this._rearrange(e,o,null,!0):this._rearrange(e,null,this.containers[p].element,!0),this._trigger("change",e,this._uiHash()),this.containers[p]._trigger("change",e,this._uiHash(this)),this.currentContainer=this.containers[p],this.options.placeholder.update(this.currentContainer,this.placeholder),this.containers[p]._trigger("over",e,this._uiHash(this)),this.containers[p].containerCache.over=1}},_createHelper:function(e){var i=this.options,s=t.isFunction(i.helper)?t(i.helper.apply(this.element[0],[e,this.currentItem])):"clone"===i.helper?this.currentItem.clone():this.currentItem;return s.parents("body").length||t("parent"!==i.appendTo?i.appendTo:this.currentItem[0].parentNode)[0].appendChild(s[0]),s[0]===this.currentItem[0]&&(this._storedCSS={width:this.currentItem[0].style.width,height:this.currentItem[0].style.height,position:this.currentItem.css("position"),top:this.currentItem.css("top"),left:this.currentItem.css("left")}),(!s[0].style.width||i.forceHelperSize)&&s.width(this.currentItem.width()),(!s[0].style.height||i.forceHelperSize)&&s.height(this.currentItem.height()),s},_adjustOffsetFromHelper:function(e){"string"==typeof e&&(e=e.split(" ")),t.isArray(e)&&(e={left:+e[0],top:+e[1]||0}),"left"in e&&(this.offset.click.left=e.left+this.margins.left),"right"in e&&(this.offset.click.left=this.helperProportions.width-e.right+this.margins.left),"top"in e&&(this.offset.click.top=e.top+this.margins.top),"bottom"in e&&(this.offset.click.top=this.helperProportions.height-e.bottom+this.margins.top)},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var e=this.offsetParent.offset();return"absolute"===this.cssPosition&&this.scrollParent[0]!==this.document[0]&&t.contains(this.scrollParent[0],this.offsetParent[0])&&(e.left+=this.scrollParent.scrollLeft(),e.top+=this.scrollParent.scrollTop()),(this.offsetParent[0]===this.document[0].body||this.offsetParent[0].tagName&&"html"===this.offsetParent[0].tagName.toLowerCase()&&t.ui.ie)&&(e={top:0,left:0}),{top:e.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:e.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if("relative"===this.cssPosition){var t=this.currentItem.position();return{top:t.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:t.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.currentItem.css("marginLeft"),10)||0,top:parseInt(this.currentItem.css("marginTop"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var e,i,s,n=this.options;"parent"===n.containment&&(n.containment=this.helper[0].parentNode),("document"===n.containment||"window"===n.containment)&&(this.containment=[0-this.offset.relative.left-this.offset.parent.left,0-this.offset.relative.top-this.offset.parent.top,"document"===n.containment?this.document.width():this.window.width()-this.helperProportions.width-this.margins.left,("document"===n.containment?this.document.height()||document.body.parentNode.scrollHeight:this.window.height()||this.document[0].body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top]),/^(document|window|parent)$/.test(n.containment)||(e=t(n.containment)[0],i=t(n.containment).offset(),s="hidden"!==t(e).css("overflow"),this.containment=[i.left+(parseInt(t(e).css("borderLeftWidth"),10)||0)+(parseInt(t(e).css("paddingLeft"),10)||0)-this.margins.left,i.top+(parseInt(t(e).css("borderTopWidth"),10)||0)+(parseInt(t(e).css("paddingTop"),10)||0)-this.margins.top,i.left+(s?Math.max(e.scrollWidth,e.offsetWidth):e.offsetWidth)-(parseInt(t(e).css("borderLeftWidth"),10)||0)-(parseInt(t(e).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,i.top+(s?Math.max(e.scrollHeight,e.offsetHeight):e.offsetHeight)-(parseInt(t(e).css("borderTopWidth"),10)||0)-(parseInt(t(e).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top])},_convertPositionTo:function(e,i){i||(i=this.position);var s="absolute"===e?1:-1,n="absolute"!==this.cssPosition||this.scrollParent[0]!==this.document[0]&&t.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,o=/(html|body)/i.test(n[0].tagName);return{top:i.top+this.offset.relative.top*s+this.offset.parent.top*s-("fixed"===this.cssPosition?-this.scrollParent.scrollTop():o?0:n.scrollTop())*s,left:i.left+this.offset.relative.left*s+this.offset.parent.left*s-("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():o?0:n.scrollLeft())*s}},_generatePosition:function(e){var i,s,n=this.options,o=e.pageX,a=e.pageY,r="absolute"!==this.cssPosition||this.scrollParent[0]!==this.document[0]&&t.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,l=/(html|body)/i.test(r[0].tagName);return"relative"!==this.cssPosition||this.scrollParent[0]!==this.document[0]&&this.scrollParent[0]!==this.offsetParent[0]||(this.offset.relative=this._getRelativeOffset()),this.originalPosition&&(this.containment&&(e.pageX-this.offset.click.left<this.containment[0]&&(o=this.containment[0]+this.offset.click.left),e.pageY-this.offset.click.top<this.containment[1]&&(a=this.containment[1]+this.offset.click.top),e.pageX-this.offset.click.left>this.containment[2]&&(o=this.containment[2]+this.offset.click.left),e.pageY-this.offset.click.top>this.containment[3]&&(a=this.containment[3]+this.offset.click.top)),n.grid&&(i=this.originalPageY+Math.round((a-this.originalPageY)/n.grid[1])*n.grid[1],a=this.containment?i-this.offset.click.top>=this.containment[1]&&i-this.offset.click.top<=this.containment[3]?i:i-this.offset.click.top>=this.containment[1]?i-n.grid[1]:i+n.grid[1]:i,s=this.originalPageX+Math.round((o-this.originalPageX)/n.grid[0])*n.grid[0],o=this.containment?s-this.offset.click.left>=this.containment[0]&&s-this.offset.click.left<=this.containment[2]?s:s-this.offset.click.left>=this.containment[0]?s-n.grid[0]:s+n.grid[0]:s)),{top:a-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+("fixed"===this.cssPosition?-this.scrollParent.scrollTop():l?0:r.scrollTop()),left:o-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():l?0:r.scrollLeft())}},_rearrange:function(t,e,i,s){i?i[0].appendChild(this.placeholder[0]):e.item[0].parentNode.insertBefore(this.placeholder[0],"down"===this.direction?e.item[0]:e.item[0].nextSibling),this.counter=this.counter?++this.counter:1;var n=this.counter;this._delay(function(){n===this.counter&&this.refreshPositions(!s)})},_clear:function(t,e){function i(t,e,i){return function(s){i._trigger(t,s,e._uiHash(e))}}this.reverting=!1;var s,n=[];if(!this._noFinalSort&&this.currentItem.parent().length&&this.placeholder.before(this.currentItem),this._noFinalSort=null,this.helper[0]===this.currentItem[0]){for(s in this._storedCSS)("auto"===this._storedCSS[s]||"static"===this._storedCSS[s])&&(this._storedCSS[s]="");this.currentItem.css(this._storedCSS),this._removeClass(this.currentItem,"ui-sortable-helper")}else this.currentItem.show();for(this.fromOutside&&!e&&n.push(function(t){this._trigger("receive",t,this._uiHash(this.fromOutside))}),!this.fromOutside&&this.domPosition.prev===this.currentItem.prev().not(".ui-sortable-helper")[0]&&this.domPosition.parent===this.currentItem.parent()[0]||e||n.push(function(t){this._trigger("update",t,this._uiHash())}),this!==this.currentContainer&&(e||(n.push(function(t){this._trigger("remove",t,this._uiHash())}),n.push(function(t){return function(e){t._trigger("receive",e,this._uiHash(this))}}.call(this,this.currentContainer)),n.push(function(t){return function(e){t._trigger("update",e,this._uiHash(this))}}.call(this,this.currentContainer)))),s=this.containers.length-1;s>=0;s--)e||n.push(i("deactivate",this,this.containers[s])),this.containers[s].containerCache.over&&(n.push(i("out",this,this.containers[s])),this.containers[s].containerCache.over=0);if(this.storedCursor&&(this.document.find("body").css("cursor",this.storedCursor),this.storedStylesheet.remove()),this._storedOpacity&&this.helper.css("opacity",this._storedOpacity),this._storedZIndex&&this.helper.css("zIndex","auto"===this._storedZIndex?"":this._storedZIndex),this.dragging=!1,e||this._trigger("beforeStop",t,this._uiHash()),this.placeholder[0].parentNode.removeChild(this.placeholder[0]),this.cancelHelperRemoval||(this.helper[0]!==this.currentItem[0]&&this.helper.remove(),this.helper=null),!e){for(s=0;n.length>s;s++)n[s].call(this,t);this._trigger("stop",t,this._uiHash())}return this.fromOutside=!1,!this.cancelHelperRemoval},_trigger:function(){t.Widget.prototype._trigger.apply(this,arguments)===!1&&this.cancel()},_uiHash:function(e){var i=e||this;return{helper:i.helper,placeholder:i.placeholder||t([]),position:i.position,originalPosition:i.originalPosition,offset:i.positionAbs,item:i.currentItem,sender:e?e.element:null}}})});
/*!
 * jQuery contextMenu v2.2.4-dev - Plugin for simple contextMenu handling
 *
 * Version: v2.2.4-dev
 *
 * Authors: Björn Brala (SWIS.nl), Rodney Rehm, Addy Osmani (patches for FF)
 * Web: http://swisnl.github.io/jQuery-contextMenu/
 *
 * Copyright (c) 2011-2016 SWIS BV and contributors
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *   GPL v3 http://opensource.org/licenses/GPL-3.0
 *
 * Date: 2016-07-17T19:45:35.567Z
 */

!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):e("object"==typeof exports?require("jquery"):jQuery)}(function(e){"use strict";function t(e){for(var t,n=e.split(/\s+/),a=[],o=0;t=n[o];o++)t=t.charAt(0).toUpperCase(),a.push(t);return a}function n(t){return t.id&&e('label[for="'+t.id+'"]').val()||t.name}function a(t,o,s){return s||(s=0),o.each(function(){var o,i,c=e(this),r=this,l=this.nodeName.toLowerCase();switch("label"===l&&c.find("input, textarea, select").length&&(o=c.text(),c=c.children().first(),r=c.get(0),l=r.nodeName.toLowerCase()),l){case"menu":i={name:c.attr("label"),items:{}},s=a(i.items,c.children(),s);break;case"a":case"button":i={name:c.text(),disabled:!!c.attr("disabled"),callback:function(){return function(){c.click()}}()};break;case"menuitem":case"command":switch(c.attr("type")){case void 0:case"command":case"menuitem":i={name:c.attr("label"),disabled:!!c.attr("disabled"),icon:c.attr("icon"),callback:function(){return function(){c.click()}}()};break;case"checkbox":i={type:"checkbox",disabled:!!c.attr("disabled"),name:c.attr("label"),selected:!!c.attr("checked")};break;case"radio":i={type:"radio",disabled:!!c.attr("disabled"),name:c.attr("label"),radio:c.attr("radiogroup"),value:c.attr("id"),selected:!!c.attr("checked")};break;default:i=void 0}break;case"hr":i="-------";break;case"input":switch(c.attr("type")){case"text":i={type:"text",name:o||n(r),disabled:!!c.attr("disabled"),value:c.val()};break;case"checkbox":i={type:"checkbox",name:o||n(r),disabled:!!c.attr("disabled"),selected:!!c.attr("checked")};break;case"radio":i={type:"radio",name:o||n(r),disabled:!!c.attr("disabled"),radio:!!c.attr("name"),value:c.val(),selected:!!c.attr("checked")};break;default:i=void 0}break;case"select":i={type:"select",name:o||n(r),disabled:!!c.attr("disabled"),selected:c.val(),options:{}},c.children().each(function(){i.options[this.value]=e(this).text()});break;case"textarea":i={type:"textarea",name:o||n(r),disabled:!!c.attr("disabled"),value:c.val()};break;case"label":break;default:i={type:"html",html:c.clone(!0)}}i&&(s++,t["key"+s]=i)}),s}e.support.htmlMenuitem="HTMLMenuItemElement"in window,e.support.htmlCommand="HTMLCommandElement"in window,e.support.eventSelectstart="onselectstart"in document.documentElement,e.ui&&e.widget||(e.cleanData=function(t){return function(n){var a,o,s;for(s=0;null!=n[s];s++){o=n[s];try{a=e._data(o,"events"),a&&a.remove&&e(o).triggerHandler("remove")}catch(i){}}t(n)}}(e.cleanData));var o=null,s=!1,i=e(window),c=0,r={},l={},u={},d={selector:null,appendTo:null,trigger:"right",autoHide:!1,delay:200,reposition:!0,classNames:{hover:"context-menu-hover",disabled:"context-menu-disabled",visible:"context-menu-visible",notSelectable:"context-menu-not-selectable",icon:"context-menu-icon",iconEdit:"context-menu-icon-edit",iconCut:"context-menu-icon-cut",iconCopy:"context-menu-icon-copy",iconPaste:"context-menu-icon-paste",iconDelete:"context-menu-icon-delete",iconAdd:"context-menu-icon-add",iconQuit:"context-menu-icon-quit"},determinePosition:function(t){if(e.ui&&e.ui.position)t.css("display","block").position({my:"center top",at:"center bottom",of:this,offset:"0 5",collision:"fit"}).css("display","none");else{var n=this.offset();n.top+=this.outerHeight(),n.left+=this.outerWidth()/2-t.outerWidth()/2,t.css(n)}},position:function(e,t,n){var a;if(!t&&!n)return void e.determinePosition.call(this,e.$menu);a="maintain"===t&&"maintain"===n?e.$menu.position():{top:n,left:t};var o=i.scrollTop()+i.height(),s=i.scrollLeft()+i.width(),c=e.$menu.outerHeight(),r=e.$menu.outerWidth();a.top+c>o&&(a.top-=c),a.top<0&&(a.top=0),a.left+r>s&&(a.left-=r),a.left<0&&(a.left=0),e.$menu.css(a)},positionSubmenu:function(t){if(e.ui&&e.ui.position)t.css("display","block").position({my:"left top",at:"right top",of:this,collision:"flipfit fit"}).css("display","");else{var n={top:0,left:this.outerWidth()};t.css(n)}},zIndex:1,animation:{duration:50,show:"slideDown",hide:"slideUp"},events:{show:e.noop,hide:e.noop},callback:null,items:{}},m={timer:null,pageX:null,pageY:null},p=function(e){for(var t=0,n=e;;)if(t=Math.max(t,parseInt(n.css("z-index"),10)||0),n=n.parent(),!n||!n.length||"html body".indexOf(n.prop("nodeName").toLowerCase())>-1)break;return t},f={abortevent:function(e){e.preventDefault(),e.stopImmediatePropagation()},contextmenu:function(t){var n=e(this);if("right"===t.data.trigger&&(t.preventDefault(),t.stopImmediatePropagation()),!("right"!==t.data.trigger&&"demand"!==t.data.trigger&&t.originalEvent||!(void 0===t.mouseButton||!t.data||"left"===t.data.trigger&&0===t.mouseButton||"right"===t.data.trigger&&2===t.mouseButton)||n.hasClass("context-menu-active")||n.hasClass("context-menu-disabled"))){if(o=n,t.data.build){var a=t.data.build(o,t);if(a===!1)return;if(t.data=e.extend(!0,{},d,t.data,a||{}),!t.data.items||e.isEmptyObject(t.data.items))throw window.console&&(console.error||console.log).call(console,"No items specified to show in contextMenu"),new Error("No Items specified");t.data.$trigger=o,h.create(t.data)}var s=!1;for(var i in t.data.items)if(t.data.items.hasOwnProperty(i)){var c;c=e.isFunction(t.data.items[i].visible)?t.data.items[i].visible.call(e(t.currentTarget),i,t.data):"undefined"==typeof i.visible||t.data.items[i].visible===!0,c&&(s=!0)}s&&h.show.call(n,t.data,t.pageX,t.pageY)}},click:function(t){t.preventDefault(),t.stopImmediatePropagation(),e(this).trigger(e.Event("contextmenu",{data:t.data,pageX:t.pageX,pageY:t.pageY}))},mousedown:function(t){var n=e(this);o&&o.length&&!o.is(n)&&o.data("contextMenu").$menu.trigger("contextmenu:hide"),2===t.button&&(o=n.data("contextMenuActive",!0))},mouseup:function(t){var n=e(this);n.data("contextMenuActive")&&o&&o.length&&o.is(n)&&!n.hasClass("context-menu-disabled")&&(t.preventDefault(),t.stopImmediatePropagation(),o=n,n.trigger(e.Event("contextmenu",{data:t.data,pageX:t.pageX,pageY:t.pageY}))),n.removeData("contextMenuActive")},mouseenter:function(t){var n=e(this),a=e(t.relatedTarget),s=e(document);a.is(".context-menu-list")||a.closest(".context-menu-list").length||o&&o.length||(m.pageX=t.pageX,m.pageY=t.pageY,m.data=t.data,s.on("mousemove.contextMenuShow",f.mousemove),m.timer=setTimeout(function(){m.timer=null,s.off("mousemove.contextMenuShow"),o=n,n.trigger(e.Event("contextmenu",{data:m.data,pageX:m.pageX,pageY:m.pageY}))},t.data.delay))},mousemove:function(e){m.pageX=e.pageX,m.pageY=e.pageY},mouseleave:function(t){var n=e(t.relatedTarget);if(!n.is(".context-menu-list")&&!n.closest(".context-menu-list").length){try{clearTimeout(m.timer)}catch(t){}m.timer=null}},layerClick:function(t){var n,a,o=e(this),s=o.data("contextMenuRoot"),c=t.button,r=t.pageX,l=t.pageY;t.preventDefault(),t.stopImmediatePropagation(),setTimeout(function(){var o,u="left"===s.trigger&&0===c||"right"===s.trigger&&2===c;if(document.elementFromPoint&&s.$layer&&(s.$layer.hide(),n=document.elementFromPoint(r-i.scrollLeft(),l-i.scrollTop()),s.$layer.show()),s.reposition&&u)if(document.elementFromPoint){if(s.$trigger.is(n)||s.$trigger.has(n).length)return void s.position.call(s.$trigger,s,r,l)}else if(a=s.$trigger.offset(),o=e(window),a.top+=o.scrollTop(),a.top<=t.pageY&&(a.left+=o.scrollLeft(),a.left<=t.pageX&&(a.bottom=a.top+s.$trigger.outerHeight(),a.bottom>=t.pageY&&(a.right=a.left+s.$trigger.outerWidth(),a.right>=t.pageX))))return void s.position.call(s.$trigger,s,r,l);n&&u&&s.$trigger.one("contextmenu:hidden",function(){e(n).contextMenu({x:r,y:l,button:c})}),null!=s&&null!=s.$menu&&s.$menu.trigger("contextmenu:hide")},50)},keyStop:function(e,t){t.isInput||e.preventDefault(),e.stopPropagation()},key:function(e){var t={};o&&(t=o.data("contextMenu")||{}),void 0===t.zIndex&&(t.zIndex=0);var n=0,a=function(e){""!==e.style.zIndex?n=e.style.zIndex:null!==e.offsetParent&&void 0!==e.offsetParent?a(e.offsetParent):null!==e.parentElement&&void 0!==e.parentElement&&a(e.parentElement)};if(a(e.target),!(n>t.zIndex)){switch(e.keyCode){case 9:case 38:if(f.keyStop(e,t),t.isInput){if(9===e.keyCode&&e.shiftKey)return e.preventDefault(),t.$selected&&t.$selected.find("input, textarea, select").blur(),void t.$menu.trigger("prevcommand");if(38===e.keyCode&&"checkbox"===t.$selected.find("input, textarea, select").prop("type"))return void e.preventDefault()}else if(9!==e.keyCode||e.shiftKey)return void t.$menu.trigger("prevcommand");break;case 40:if(f.keyStop(e,t),!t.isInput)return void t.$menu.trigger("nextcommand");if(9===e.keyCode)return e.preventDefault(),t.$selected&&t.$selected.find("input, textarea, select").blur(),void t.$menu.trigger("nextcommand");if(40===e.keyCode&&"checkbox"===t.$selected.find("input, textarea, select").prop("type"))return void e.preventDefault();break;case 37:if(f.keyStop(e,t),t.isInput||!t.$selected||!t.$selected.length)break;if(!t.$selected.parent().hasClass("context-menu-root")){var s=t.$selected.parent().parent();return t.$selected.trigger("contextmenu:blur"),void(t.$selected=s)}break;case 39:if(f.keyStop(e,t),t.isInput||!t.$selected||!t.$selected.length)break;var i=t.$selected.data("contextMenu")||{};if(i.$menu&&t.$selected.hasClass("context-menu-submenu"))return t.$selected=null,i.$selected=null,void i.$menu.trigger("nextcommand");break;case 35:case 36:return t.$selected&&t.$selected.find("input, textarea, select").length?void 0:((t.$selected&&t.$selected.parent()||t.$menu).children(":not(."+t.classNames.disabled+", ."+t.classNames.notSelectable+")")[36===e.keyCode?"first":"last"]().trigger("contextmenu:focus"),void e.preventDefault());case 13:if(f.keyStop(e,t),t.isInput){if(t.$selected&&!t.$selected.is("textarea, select"))return void e.preventDefault();break}return void("undefined"!=typeof t.$selected&&null!==t.$selected&&t.$selected.trigger("mouseup"));case 32:case 33:case 34:return void f.keyStop(e,t);case 27:return f.keyStop(e,t),void t.$menu.trigger("contextmenu:hide");default:var c=String.fromCharCode(e.keyCode).toUpperCase();if(t.accesskeys&&t.accesskeys[c])return void t.accesskeys[c].$node.trigger(t.accesskeys[c].$menu?"contextmenu:focus":"mouseup")}e.stopPropagation(),"undefined"!=typeof t.$selected&&null!==t.$selected&&t.$selected.trigger(e)}},prevItem:function(t){t.stopPropagation();var n=e(this).data("contextMenu")||{},a=e(this).data("contextMenuRoot")||{};if(n.$selected){var o=n.$selected;n=n.$selected.parent().data("contextMenu")||{},n.$selected=o}for(var s=n.$menu.children(),i=n.$selected&&n.$selected.prev().length?n.$selected.prev():s.last(),c=i;i.hasClass(a.classNames.disabled)||i.hasClass(a.classNames.notSelectable)||i.is(":hidden");)if(i=i.prev().length?i.prev():s.last(),i.is(c))return;n.$selected&&f.itemMouseleave.call(n.$selected.get(0),t),f.itemMouseenter.call(i.get(0),t);var r=i.find("input, textarea, select");r.length&&r.focus()},nextItem:function(t){t.stopPropagation();var n=e(this).data("contextMenu")||{},a=e(this).data("contextMenuRoot")||{};if(n.$selected){var o=n.$selected;n=n.$selected.parent().data("contextMenu")||{},n.$selected=o}for(var s=n.$menu.children(),i=n.$selected&&n.$selected.next().length?n.$selected.next():s.first(),c=i;i.hasClass(a.classNames.disabled)||i.hasClass(a.classNames.notSelectable)||i.is(":hidden");)if(i=i.next().length?i.next():s.first(),i.is(c))return;n.$selected&&f.itemMouseleave.call(n.$selected.get(0),t),f.itemMouseenter.call(i.get(0),t);var r=i.find("input, textarea, select");r.length&&r.focus()},focusInput:function(){var t=e(this).closest(".context-menu-item"),n=t.data(),a=n.contextMenu,o=n.contextMenuRoot;o.$selected=a.$selected=t,o.isInput=a.isInput=!0},blurInput:function(){var t=e(this).closest(".context-menu-item"),n=t.data(),a=n.contextMenu,o=n.contextMenuRoot;o.isInput=a.isInput=!1},menuMouseenter:function(){var t=e(this).data().contextMenuRoot;t.hovering=!0},menuMouseleave:function(t){var n=e(this).data().contextMenuRoot;n.$layer&&n.$layer.is(t.relatedTarget)&&(n.hovering=!1)},itemMouseenter:function(t){var n=e(this),a=n.data(),o=a.contextMenu,s=a.contextMenuRoot;return s.hovering=!0,t&&s.$layer&&s.$layer.is(t.relatedTarget)&&(t.preventDefault(),t.stopImmediatePropagation()),(o.$menu?o:s).$menu.children("."+s.classNames.hover).trigger("contextmenu:blur").children(".hover").trigger("contextmenu:blur"),n.hasClass(s.classNames.disabled)||n.hasClass(s.classNames.notSelectable)?void(o.$selected=null):void n.trigger("contextmenu:focus")},itemMouseleave:function(t){var n=e(this),a=n.data(),o=a.contextMenu,s=a.contextMenuRoot;return s!==o&&s.$layer&&s.$layer.is(t.relatedTarget)?("undefined"!=typeof s.$selected&&null!==s.$selected&&s.$selected.trigger("contextmenu:blur"),t.preventDefault(),t.stopImmediatePropagation(),void(s.$selected=o.$selected=o.$node)):void n.trigger("contextmenu:blur")},itemClick:function(t){var n,a=e(this),o=a.data(),s=o.contextMenu,i=o.contextMenuRoot,c=o.contextMenuKey;if(s.items[c]&&!a.is("."+i.classNames.disabled+", .context-menu-submenu, .context-menu-separator, ."+i.classNames.notSelectable)){if(t.preventDefault(),t.stopImmediatePropagation(),e.isFunction(s.callbacks[c])&&Object.prototype.hasOwnProperty.call(s.callbacks,c))n=s.callbacks[c];else{if(!e.isFunction(i.callback))return;n=i.callback}n.call(i.$trigger,c,i)!==!1?i.$menu.trigger("contextmenu:hide"):i.$menu.parent().length&&h.update.call(i.$trigger,i)}},inputClick:function(e){e.stopImmediatePropagation()},hideMenu:function(t,n){var a=e(this).data("contextMenuRoot");h.hide.call(a.$trigger,a,n&&n.force)},focusItem:function(t){t.stopPropagation();var n=e(this),a=n.data(),o=a.contextMenu,s=a.contextMenuRoot;n.hasClass(s.classNames.disabled)||n.hasClass(s.classNames.notSelectable)||(n.addClass([s.classNames.hover,s.classNames.visible].join(" ")).parent().find(".context-menu-item").not(n).removeClass(s.classNames.visible).filter("."+s.classNames.hover).trigger("contextmenu:blur"),o.$selected=s.$selected=n,o.$node&&s.positionSubmenu.call(o.$node,o.$menu))},blurItem:function(t){t.stopPropagation();var n=e(this),a=n.data(),o=a.contextMenu,s=a.contextMenuRoot;o.autoHide&&n.removeClass(s.classNames.visible),n.removeClass(s.classNames.hover),o.$selected=null}},h={show:function(t,n,a){var s=e(this),i={};if(e("#context-menu-layer").trigger("mousedown"),t.$trigger=s,t.events.show.call(s,t)===!1)return void(o=null);if(h.update.call(s,t),t.position.call(s,t,n,a),t.zIndex){var c=t.zIndex;"function"==typeof t.zIndex&&(c=t.zIndex.call(s,t)),i.zIndex=p(s)+c}h.layer.call(t.$menu,t,i.zIndex),t.$menu.find("ul").css("zIndex",i.zIndex+1),t.$menu.css(i)[t.animation.show](t.animation.duration,function(){s.trigger("contextmenu:visible")}),s.data("contextMenu",t).addClass("context-menu-active"),e(document).off("keydown.contextMenu").on("keydown.contextMenu",f.key),t.autoHide&&e(document).on("mousemove.contextMenuAutoHide",function(e){var n=s.offset();n.right=n.left+s.outerWidth(),n.bottom=n.top+s.outerHeight(),!t.$layer||t.hovering||e.pageX>=n.left&&e.pageX<=n.right&&e.pageY>=n.top&&e.pageY<=n.bottom||setTimeout(function(){t.hovering||null==t.$menu||t.$menu.trigger("contextmenu:hide")},50)})},hide:function(t,n){var a=e(this);if(t||(t=a.data("contextMenu")||{}),n||!t.events||t.events.hide.call(a,t)!==!1){if(a.removeData("contextMenu").removeClass("context-menu-active"),t.$layer){setTimeout(function(e){return function(){e.remove()}}(t.$layer),10);try{delete t.$layer}catch(s){t.$layer=null}}o=null,t.$menu.find("."+t.classNames.hover).trigger("contextmenu:blur"),t.$selected=null,t.$menu.find("."+t.classNames.visible).removeClass(t.classNames.visible),e(document).off(".contextMenuAutoHide").off("keydown.contextMenu"),t.$menu&&t.$menu[t.animation.hide](t.animation.duration,function(){t.build&&(t.$menu.remove(),e.each(t,function(e){switch(e){case"ns":case"selector":case"build":case"trigger":return!0;default:t[e]=void 0;try{delete t[e]}catch(n){}return!0}})),setTimeout(function(){a.trigger("contextmenu:hidden")},10)})}},create:function(n,a){function o(t){var n=e("<span></span>");if(t._accesskey)t._beforeAccesskey&&n.append(document.createTextNode(t._beforeAccesskey)),e("<span></span>").addClass("context-menu-accesskey").text(t._accesskey).appendTo(n),t._afterAccesskey&&n.append(document.createTextNode(t._afterAccesskey));else if(t.isHtmlName){if("undefined"!=typeof t.accesskey)throw new Error("accesskeys are not compatible with HTML names and cannot be used together in the same item");n.html(t.name)}else n.text(t.name);return n}void 0===a&&(a=n),n.$menu=e('<ul class="context-menu-list"></ul>').addClass(n.className||"").data({contextMenu:n,contextMenuRoot:a}),e.each(["callbacks","commands","inputs"],function(e,t){n[t]={},a[t]||(a[t]={})}),a.accesskeys||(a.accesskeys={}),e.each(n.items,function(s,i){var c=e('<li class="context-menu-item"></li>').addClass(i.className||""),r=null,l=null;if(c.on("click",e.noop),"string"!=typeof i&&"cm_separator"!==i.type||(i={type:"cm_seperator"}),i.$node=c.data({contextMenu:n,contextMenuRoot:a,contextMenuKey:s}),"undefined"!=typeof i.accesskey)for(var d,m=t(i.accesskey),p=0;d=m[p];p++)if(!a.accesskeys[d]){a.accesskeys[d]=i;var x=i.name.match(new RegExp("^(.*?)("+d+")(.*)$","i"));x&&(i._beforeAccesskey=x[1],i._accesskey=x[2],i._afterAccesskey=x[3]);break}if(i.type&&u[i.type])u[i.type].call(c,i,n,a),e.each([n,a],function(t,a){a.commands[s]=i,!e.isFunction(i.callback)||void 0!==a.callbacks[s]&&void 0!==n.type||(a.callbacks[s]=i.callback)});else{switch("cm_seperator"===i.type?c.addClass("context-menu-separator "+a.classNames.notSelectable):"html"===i.type?c.addClass("context-menu-html "+a.classNames.notSelectable):i.type?(r=e("<label></label>").appendTo(c),o(i).appendTo(r),c.addClass("context-menu-input"),n.hasTypes=!0,e.each([n,a],function(e,t){t.commands[s]=i,t.inputs[s]=i})):i.items&&(i.type="sub"),i.type){case"cm_seperator":break;case"text":l=e('<input type="text" value="1" name="" value="">').attr("name","context-menu-input-"+s).val(i.value||"").appendTo(r);break;case"textarea":l=e('<textarea name=""></textarea>').attr("name","context-menu-input-"+s).val(i.value||"").appendTo(r),i.height&&l.height(i.height);break;case"checkbox":l=e('<input type="checkbox" value="1" name="" value="">').attr("name","context-menu-input-"+s).val(i.value||"").prop("checked",!!i.selected).prependTo(r);break;case"radio":l=e('<input type="radio" value="1" name="" value="">').attr("name","context-menu-input-"+i.radio).val(i.value||"").prop("checked",!!i.selected).prependTo(r);break;case"select":l=e('<select name="">').attr("name","context-menu-input-"+s).appendTo(r),i.options&&(e.each(i.options,function(t,n){e("<option></option>").val(t).text(n).appendTo(l)}),l.val(i.selected));break;case"sub":o(i).appendTo(c),i.appendTo=i.$node,h.create(i,a),c.data("contextMenu",i).addClass("context-menu-submenu"),i.callback=null;break;case"html":e(i.html).appendTo(c);break;default:e.each([n,a],function(t,a){a.commands[s]=i,!e.isFunction(i.callback)||void 0!==a.callbacks[s]&&void 0!==n.type||(a.callbacks[s]=i.callback)}),o(i).appendTo(c)}i.type&&"sub"!==i.type&&"html"!==i.type&&"cm_seperator"!==i.type&&(l.on("focus",f.focusInput).on("blur",f.blurInput),i.events&&l.on(i.events,n)),i.icon&&(e.isFunction(i.icon)?i._icon=i.icon.call(this,this,c,s,i):"string"==typeof i.icon&&"fa-"==i.icon.substring(0,3)?i._icon=a.classNames.icon+" "+a.classNames.icon+"--fa fa "+i.icon:i._icon=a.classNames.icon+" "+a.classNames.icon+"-"+i.icon,c.addClass(i._icon))}i.$input=l,i.$label=r,c.appendTo(n.$menu),!n.hasTypes&&e.support.eventSelectstart&&c.on("selectstart.disableTextSelect",f.abortevent)}),n.$node||n.$menu.css("display","none").addClass("context-menu-root"),n.$menu.appendTo(n.appendTo||document.body)},resize:function(t,n){var a;t.css({position:"absolute",display:"block"}),t.data("width",(a=t.get(0)).getBoundingClientRect?Math.ceil(a.getBoundingClientRect().width):t.outerWidth()+1),t.css({position:"static",minWidth:"0px",maxWidth:"100000px"}),t.find("> li > ul").each(function(){h.resize(e(this),!0)}),n||t.find("ul").addBack().css({position:"",display:"",minWidth:"",maxWidth:""}).outerWidth(function(){return e(this).data("width")})},update:function(t,n){var a=this;void 0===n&&(n=t,h.resize(t.$menu)),t.$menu.children().each(function(){var o,s=e(this),i=s.data("contextMenuKey"),c=t.items[i],r=e.isFunction(c.disabled)&&c.disabled.call(a,i,n)||c.disabled===!0;if(o=e.isFunction(c.visible)?c.visible.call(a,i,n):"undefined"==typeof c.visible||c.visible===!0,s[o?"show":"hide"](),s[r?"addClass":"removeClass"](n.classNames.disabled),e.isFunction(c.icon)&&(s.removeClass(c._icon),c._icon=c.icon.call(this,a,s,i,c),s.addClass(c._icon)),c.type)switch(s.find("input, select, textarea").prop("disabled",r),c.type){case"text":case"textarea":c.$input.val(c.value||"");break;case"checkbox":case"radio":c.$input.val(c.value||"").prop("checked",!!c.selected);break;case"select":c.$input.val(c.selected||"")}c.$menu&&h.update.call(a,c,n)})},layer:function(t,n){var a=t.$layer=e('<div id="context-menu-layer" style="position:fixed; z-index:'+n+'; top:0; left:0; opacity: 0; filter: alpha(opacity=0); background-color: #000;"></div>').css({height:i.height(),width:i.width(),display:"block"}).data("contextMenuRoot",t).insertBefore(this).on("contextmenu",f.abortevent).on("mousedown",f.layerClick);return void 0===document.body.style.maxWidth&&a.css({position:"absolute",height:e(document).height()}),a}};e.fn.contextMenu=function(t){var n=this,a=t;if(this.length>0)if(void 0===t)this.first().trigger("contextmenu");else if(void 0!==t.x&&void 0!==t.y)this.first().trigger(e.Event("contextmenu",{pageX:t.x,pageY:t.y,mouseButton:t.button}));else if("hide"===t){var o=this.first().data("contextMenu")?this.first().data("contextMenu").$menu:null;o&&o.trigger("contextmenu:hide")}else"destroy"===t?e.contextMenu("destroy",{context:this}):e.isPlainObject(t)?(t.context=this,e.contextMenu("create",t)):t?this.removeClass("context-menu-disabled"):t||this.addClass("context-menu-disabled");else e.each(l,function(){this.selector===n.selector&&(a.data=this,e.extend(a.data,{trigger:"demand"}))}),f.contextmenu.call(a.target,a);return this},e.contextMenu=function(t,n){"string"!=typeof t&&(n=t,t="create"),"string"==typeof n?n={selector:n}:void 0===n&&(n={});var a=e.extend(!0,{},d,n||{}),o=e(document),i=o,u=!1;switch(a.context&&a.context.length?(i=e(a.context).first(),a.context=i.get(0),u=a.context!==document):a.context=document,t){case"create":if(!a.selector)throw new Error("No selector specified");if(a.selector.match(/.context-menu-(list|item|input)($|\s)/))throw new Error('Cannot bind to selector "'+a.selector+'" as it contains a reserved className');if(!a.build&&(!a.items||e.isEmptyObject(a.items)))throw new Error("No Items specified");if(c++,a.ns=".contextMenu"+c,u||(r[a.selector]=a.ns),l[a.ns]=a,a.trigger||(a.trigger="right"),!s){var m="click"===a.itemClickEvent?"click.contextMenu":"mouseup.contextMenu",p={"contextmenu:focus.contextMenu":f.focusItem,"contextmenu:blur.contextMenu":f.blurItem,"contextmenu.contextMenu":f.abortevent,"mouseenter.contextMenu":f.itemMouseenter,"mouseleave.contextMenu":f.itemMouseleave};p[m]=f.itemClick,o.on({"contextmenu:hide.contextMenu":f.hideMenu,"prevcommand.contextMenu":f.prevItem,"nextcommand.contextMenu":f.nextItem,"contextmenu.contextMenu":f.abortevent,"mouseenter.contextMenu":f.menuMouseenter,"mouseleave.contextMenu":f.menuMouseleave},".context-menu-list").on("mouseup.contextMenu",".context-menu-input",f.inputClick).on(p,".context-menu-item"),s=!0}switch(i.on("contextmenu"+a.ns,a.selector,a,f.contextmenu),u&&i.on("remove"+a.ns,function(){e(this).contextMenu("destroy")}),a.trigger){case"hover":i.on("mouseenter"+a.ns,a.selector,a,f.mouseenter).on("mouseleave"+a.ns,a.selector,a,f.mouseleave);break;case"left":i.on("click"+a.ns,a.selector,a,f.click)}a.build||h.create(a);break;case"destroy":var x;if(u){var v=a.context;e.each(l,function(t,n){if(n.context!==v)return!0;x=e(".context-menu-list").filter(":visible"),x.length&&x.data().contextMenuRoot.$trigger.is(e(n.context).find(n.selector))&&x.trigger("contextmenu:hide",{force:!0});try{l[n.ns].$menu&&l[n.ns].$menu.remove(),delete l[n.ns]}catch(a){l[n.ns]=null}return e(n.context).off(n.ns),!0})}else if(a.selector){if(r[a.selector]){x=e(".context-menu-list").filter(":visible"),x.length&&x.data().contextMenuRoot.$trigger.is(a.selector)&&x.trigger("contextmenu:hide",{force:!0});try{l[r[a.selector]].$menu&&l[r[a.selector]].$menu.remove(),delete l[r[a.selector]]}catch(g){l[r[a.selector]]=null}o.off(r[a.selector])}}else o.off(".contextMenu .contextMenuAutoHide"),e.each(l,function(t,n){e(n.context).off(n.ns)}),r={},l={},c=0,s=!1,e("#context-menu-layer, .context-menu-list").remove();break;case"html5":(!e.support.htmlCommand&&!e.support.htmlMenuitem||"boolean"==typeof n&&n)&&e('menu[type="context"]').each(function(){this.id&&e.contextMenu({selector:"[contextmenu="+this.id+"]",items:e.contextMenu.fromMenu(this)})}).css("display","none");break;default:throw new Error('Unknown operation "'+t+'"')}return this},e.contextMenu.setInputValues=function(t,n){void 0===n&&(n={}),e.each(t.inputs,function(e,t){switch(t.type){case"text":case"textarea":t.value=n[e]||"";break;case"checkbox":t.selected=!!n[e];break;case"radio":t.selected=(n[t.radio]||"")===t.value;break;case"select":t.selected=n[e]||""}})},e.contextMenu.getInputValues=function(t,n){return void 0===n&&(n={}),e.each(t.inputs,function(e,t){switch(t.type){case"text":case"textarea":case"select":n[e]=t.$input.val();break;case"checkbox":n[e]=t.$input.prop("checked");break;case"radio":t.$input.prop("checked")&&(n[t.radio]=t.value)}}),n},e.contextMenu.fromMenu=function(t){var n=e(t),o={};return a(o,n.children()),o},e.contextMenu.defaults=d,e.contextMenu.types=u,e.contextMenu.handle=f,e.contextMenu.op=h,e.contextMenu.menus=l});
//# sourceMappingURL=jquery.contextMenu.min.js.map
;
/*! jQuery UI - v1.12.0 - 2016-07-15
 * http://jqueryui.com
 * Includes: position.js
 * Copyright jQuery Foundation and other contributors; Licensed MIT */


(function(t){"function"==typeof define&&define.amd?define(["jquery"],t):t(jQuery)})(function(t){t.ui=t.ui||{},t.ui.version="1.12.0",function(){function e(t,e,i){return[parseFloat(t[0])*(p.test(t[0])?e/100:1),parseFloat(t[1])*(p.test(t[1])?i/100:1)]}function i(e,i){return parseInt(t.css(e,i),10)||0}function s(e){var i=e[0];return 9===i.nodeType?{width:e.width(),height:e.height(),offset:{top:0,left:0}}:t.isWindow(i)?{width:e.width(),height:e.height(),offset:{top:e.scrollTop(),left:e.scrollLeft()}}:i.preventDefault?{width:0,height:0,offset:{top:i.pageY,left:i.pageX}}:{width:e.outerWidth(),height:e.outerHeight(),offset:e.offset()}}var n,o,a=Math.max,r=Math.abs,h=Math.round,l=/left|center|right/,c=/top|center|bottom/,u=/[\+\-]\d+(\.[\d]+)?%?/,d=/^\w+/,p=/%$/,f=t.fn.position;o=function(){var e=t("<div>").css("position","absolute").appendTo("body").offset({top:1.5,left:1.5}),i=1.5===e.offset().top;return e.remove(),o=function(){return i},i},t.position={scrollbarWidth:function(){if(void 0!==n)return n;var e,i,s=t("<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),o=s.children()[0];return t("body").append(s),e=o.offsetWidth,s.css("overflow","scroll"),i=o.offsetWidth,e===i&&(i=s[0].clientWidth),s.remove(),n=e-i},getScrollInfo:function(e){var i=e.isWindow||e.isDocument?"":e.element.css("overflow-x"),s=e.isWindow||e.isDocument?"":e.element.css("overflow-y"),n="scroll"===i||"auto"===i&&e.width<e.element[0].scrollWidth,o="scroll"===s||"auto"===s&&e.height<e.element[0].scrollHeight;return{width:o?t.position.scrollbarWidth():0,height:n?t.position.scrollbarWidth():0}},getWithinInfo:function(e){var i=t(e||window),s=t.isWindow(i[0]),n=!!i[0]&&9===i[0].nodeType,o=!s&&!n;return{element:i,isWindow:s,isDocument:n,offset:o?t(e).offset():{left:0,top:0},scrollLeft:i.scrollLeft(),scrollTop:i.scrollTop(),width:i.outerWidth(),height:i.outerHeight()}}},t.fn.position=function(n){if(!n||!n.of)return f.apply(this,arguments);n=t.extend({},n);var p,g,m,_,v,b,y=t(n.of),w=t.position.getWithinInfo(n.within),k=t.position.getScrollInfo(w),x=(n.collision||"flip").split(" "),C={};return b=s(y),y[0].preventDefault&&(n.at="left top"),g=b.width,m=b.height,_=b.offset,v=t.extend({},_),t.each(["my","at"],function(){var t,e,i=(n[this]||"").split(" ");1===i.length&&(i=l.test(i[0])?i.concat(["center"]):c.test(i[0])?["center"].concat(i):["center","center"]),i[0]=l.test(i[0])?i[0]:"center",i[1]=c.test(i[1])?i[1]:"center",t=u.exec(i[0]),e=u.exec(i[1]),C[this]=[t?t[0]:0,e?e[0]:0],n[this]=[d.exec(i[0])[0],d.exec(i[1])[0]]}),1===x.length&&(x[1]=x[0]),"right"===n.at[0]?v.left+=g:"center"===n.at[0]&&(v.left+=g/2),"bottom"===n.at[1]?v.top+=m:"center"===n.at[1]&&(v.top+=m/2),p=e(C.at,g,m),v.left+=p[0],v.top+=p[1],this.each(function(){var s,l,c=t(this),u=c.outerWidth(),d=c.outerHeight(),f=i(this,"marginLeft"),b=i(this,"marginTop"),D=u+f+i(this,"marginRight")+k.width,I=d+b+i(this,"marginBottom")+k.height,T=t.extend({},v),P=e(C.my,c.outerWidth(),c.outerHeight());"right"===n.my[0]?T.left-=u:"center"===n.my[0]&&(T.left-=u/2),"bottom"===n.my[1]?T.top-=d:"center"===n.my[1]&&(T.top-=d/2),T.left+=P[0],T.top+=P[1],o()||(T.left=h(T.left),T.top=h(T.top)),s={marginLeft:f,marginTop:b},t.each(["left","top"],function(e,i){t.ui.position[x[e]]&&t.ui.position[x[e]][i](T,{targetWidth:g,targetHeight:m,elemWidth:u,elemHeight:d,collisionPosition:s,collisionWidth:D,collisionHeight:I,offset:[p[0]+P[0],p[1]+P[1]],my:n.my,at:n.at,within:w,elem:c})}),n.using&&(l=function(t){var e=_.left-T.left,i=e+g-u,s=_.top-T.top,o=s+m-d,h={target:{element:y,left:_.left,top:_.top,width:g,height:m},element:{element:c,left:T.left,top:T.top,width:u,height:d},horizontal:0>i?"left":e>0?"right":"center",vertical:0>o?"top":s>0?"bottom":"middle"};u>g&&g>r(e+i)&&(h.horizontal="center"),d>m&&m>r(s+o)&&(h.vertical="middle"),h.important=a(r(e),r(i))>a(r(s),r(o))?"horizontal":"vertical",n.using.call(this,t,h)}),c.offset(t.extend(T,{using:l}))})},t.ui.position={fit:{left:function(t,e){var i,s=e.within,n=s.isWindow?s.scrollLeft:s.offset.left,o=s.width,r=t.left-e.collisionPosition.marginLeft,h=n-r,l=r+e.collisionWidth-o-n;e.collisionWidth>o?h>0&&0>=l?(i=t.left+h+e.collisionWidth-o-n,t.left+=h-i):t.left=l>0&&0>=h?n:h>l?n+o-e.collisionWidth:n:h>0?t.left+=h:l>0?t.left-=l:t.left=a(t.left-r,t.left)},top:function(t,e){var i,s=e.within,n=s.isWindow?s.scrollTop:s.offset.top,o=e.within.height,r=t.top-e.collisionPosition.marginTop,h=n-r,l=r+e.collisionHeight-o-n;e.collisionHeight>o?h>0&&0>=l?(i=t.top+h+e.collisionHeight-o-n,t.top+=h-i):t.top=l>0&&0>=h?n:h>l?n+o-e.collisionHeight:n:h>0?t.top+=h:l>0?t.top-=l:t.top=a(t.top-r,t.top)}},flip:{left:function(t,e){var i,s,n=e.within,o=n.offset.left+n.scrollLeft,a=n.width,h=n.isWindow?n.scrollLeft:n.offset.left,l=t.left-e.collisionPosition.marginLeft,c=l-h,u=l+e.collisionWidth-a-h,d="left"===e.my[0]?-e.elemWidth:"right"===e.my[0]?e.elemWidth:0,p="left"===e.at[0]?e.targetWidth:"right"===e.at[0]?-e.targetWidth:0,f=-2*e.offset[0];0>c?(i=t.left+d+p+f+e.collisionWidth-a-o,(0>i||r(c)>i)&&(t.left+=d+p+f)):u>0&&(s=t.left-e.collisionPosition.marginLeft+d+p+f-h,(s>0||u>r(s))&&(t.left+=d+p+f))},top:function(t,e){var i,s,n=e.within,o=n.offset.top+n.scrollTop,a=n.height,h=n.isWindow?n.scrollTop:n.offset.top,l=t.top-e.collisionPosition.marginTop,c=l-h,u=l+e.collisionHeight-a-h,d="top"===e.my[1],p=d?-e.elemHeight:"bottom"===e.my[1]?e.elemHeight:0,f="top"===e.at[1]?e.targetHeight:"bottom"===e.at[1]?-e.targetHeight:0,g=-2*e.offset[1];0>c?(s=t.top+p+f+g+e.collisionHeight-a-o,(0>s||r(c)>s)&&(t.top+=p+f+g)):u>0&&(i=t.top-e.collisionPosition.marginTop+p+f+g-h,(i>0||u>r(i))&&(t.top+=p+f+g))}},flipfit:{left:function(){t.ui.position.flip.left.apply(this,arguments),t.ui.position.fit.left.apply(this,arguments)},top:function(){t.ui.position.flip.top.apply(this,arguments),t.ui.position.fit.top.apply(this,arguments)}}}}(),t.ui.position});
(function() {
  var context = this;

  (function() {
    (function() {
      var slice = [].slice;

      this.ActionCable = {
        INTERNAL: {
          "message_types": {
            "welcome": "welcome",
            "ping": "ping",
            "confirmation": "confirm_subscription",
            "rejection": "reject_subscription"
          },
          "default_mount_path": "/cable",
          "protocols": ["actioncable-v1-json", "actioncable-unsupported"]
        },
        WebSocket: window.WebSocket,
        logger: window.console,
        createConsumer: function(url) {
          var ref;
          if (url == null) {
            url = (ref = this.getConfig("url")) != null ? ref : this.INTERNAL.default_mount_path;
          }
          return new ActionCable.Consumer(this.createWebSocketURL(url));
        },
        getConfig: function(name) {
          var element;
          element = document.head.querySelector("meta[name='action-cable-" + name + "']");
          return element != null ? element.getAttribute("content") : void 0;
        },
        createWebSocketURL: function(url) {
          var a;
          if (url && !/^wss?:/i.test(url)) {
            a = document.createElement("a");
            a.href = url;
            a.href = a.href;
            a.protocol = a.protocol.replace("http", "ws");
            return a.href;
          } else {
            return url;
          }
        },
        startDebugging: function() {
          return this.debugging = true;
        },
        stopDebugging: function() {
          return this.debugging = null;
        },
        log: function() {
          var messages, ref;
          messages = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          if (this.debugging) {
            messages.push(Date.now());
            return (ref = this.logger).log.apply(ref, ["[ActionCable]"].concat(slice.call(messages)));
          }
        }
      };

    }).call(this);
  }).call(context);

  var ActionCable = context.ActionCable;

  (function() {
    (function() {
      var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

      ActionCable.ConnectionMonitor = (function() {
        var clamp, now, secondsSince;

        ConnectionMonitor.pollInterval = {
          min: 3,
          max: 30
        };

        ConnectionMonitor.staleThreshold = 6;

        function ConnectionMonitor(connection) {
          this.connection = connection;
          this.visibilityDidChange = bind(this.visibilityDidChange, this);
          this.reconnectAttempts = 0;
        }

        ConnectionMonitor.prototype.start = function() {
          if (!this.isRunning()) {
            this.startedAt = now();
            delete this.stoppedAt;
            this.startPolling();
            document.addEventListener("visibilitychange", this.visibilityDidChange);
            return ActionCable.log("ConnectionMonitor started. pollInterval = " + (this.getPollInterval()) + " ms");
          }
        };

        ConnectionMonitor.prototype.stop = function() {
          if (this.isRunning()) {
            this.stoppedAt = now();
            this.stopPolling();
            document.removeEventListener("visibilitychange", this.visibilityDidChange);
            return ActionCable.log("ConnectionMonitor stopped");
          }
        };

        ConnectionMonitor.prototype.isRunning = function() {
          return (this.startedAt != null) && (this.stoppedAt == null);
        };

        ConnectionMonitor.prototype.recordPing = function() {
          return this.pingedAt = now();
        };

        ConnectionMonitor.prototype.recordConnect = function() {
          this.reconnectAttempts = 0;
          this.recordPing();
          delete this.disconnectedAt;
          return ActionCable.log("ConnectionMonitor recorded connect");
        };

        ConnectionMonitor.prototype.recordDisconnect = function() {
          this.disconnectedAt = now();
          return ActionCable.log("ConnectionMonitor recorded disconnect");
        };

        ConnectionMonitor.prototype.startPolling = function() {
          this.stopPolling();
          return this.poll();
        };

        ConnectionMonitor.prototype.stopPolling = function() {
          return clearTimeout(this.pollTimeout);
        };

        ConnectionMonitor.prototype.poll = function() {
          return this.pollTimeout = setTimeout((function(_this) {
            return function() {
              _this.reconnectIfStale();
              return _this.poll();
            };
          })(this), this.getPollInterval());
        };

        ConnectionMonitor.prototype.getPollInterval = function() {
          var interval, max, min, ref;
          ref = this.constructor.pollInterval, min = ref.min, max = ref.max;
          interval = 5 * Math.log(this.reconnectAttempts + 1);
          return Math.round(clamp(interval, min, max) * 1000);
        };

        ConnectionMonitor.prototype.reconnectIfStale = function() {
          if (this.connectionIsStale()) {
            ActionCable.log("ConnectionMonitor detected stale connection. reconnectAttempts = " + this.reconnectAttempts + ", pollInterval = " + (this.getPollInterval()) + " ms, time disconnected = " + (secondsSince(this.disconnectedAt)) + " s, stale threshold = " + this.constructor.staleThreshold + " s");
            this.reconnectAttempts++;
            if (this.disconnectedRecently()) {
              return ActionCable.log("ConnectionMonitor skipping reopening recent disconnect");
            } else {
              ActionCable.log("ConnectionMonitor reopening");
              return this.connection.reopen();
            }
          }
        };

        ConnectionMonitor.prototype.connectionIsStale = function() {
          var ref;
          return secondsSince((ref = this.pingedAt) != null ? ref : this.startedAt) > this.constructor.staleThreshold;
        };

        ConnectionMonitor.prototype.disconnectedRecently = function() {
          return this.disconnectedAt && secondsSince(this.disconnectedAt) < this.constructor.staleThreshold;
        };

        ConnectionMonitor.prototype.visibilityDidChange = function() {
          if (document.visibilityState === "visible") {
            return setTimeout((function(_this) {
              return function() {
                if (_this.connectionIsStale() || !_this.connection.isOpen()) {
                  ActionCable.log("ConnectionMonitor reopening stale connection on visibilitychange. visbilityState = " + document.visibilityState);
                  return _this.connection.reopen();
                }
              };
            })(this), 200);
          }
        };

        now = function() {
          return new Date().getTime();
        };

        secondsSince = function(time) {
          return (now() - time) / 1000;
        };

        clamp = function(number, min, max) {
          return Math.max(min, Math.min(max, number));
        };

        return ConnectionMonitor;

      })();

    }).call(this);
    (function() {
      var i, message_types, protocols, ref, supportedProtocols, unsupportedProtocol,
        slice = [].slice,
        bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
        indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

      ref = ActionCable.INTERNAL, message_types = ref.message_types, protocols = ref.protocols;

      supportedProtocols = 2 <= protocols.length ? slice.call(protocols, 0, i = protocols.length - 1) : (i = 0, []), unsupportedProtocol = protocols[i++];

      ActionCable.Connection = (function() {
        Connection.reopenDelay = 500;

        function Connection(consumer) {
          this.consumer = consumer;
          this.open = bind(this.open, this);
          this.subscriptions = this.consumer.subscriptions;
          this.monitor = new ActionCable.ConnectionMonitor(this);
          this.disconnected = true;
        }

        Connection.prototype.send = function(data) {
          if (this.isOpen()) {
            this.webSocket.send(JSON.stringify(data));
            return true;
          } else {
            return false;
          }
        };

        Connection.prototype.open = function() {
          if (this.isActive()) {
            ActionCable.log("Attempted to open WebSocket, but existing socket is " + (this.getState()));
            return false;
          } else {
            ActionCable.log("Opening WebSocket, current state is " + (this.getState()) + ", subprotocols: " + protocols);
            if (this.webSocket != null) {
              this.uninstallEventHandlers();
            }
            this.webSocket = new ActionCable.WebSocket(this.consumer.url, protocols);
            this.installEventHandlers();
            this.monitor.start();
            return true;
          }
        };

        Connection.prototype.close = function(arg) {
          var allowReconnect, ref1;
          allowReconnect = (arg != null ? arg : {
            allowReconnect: true
          }).allowReconnect;
          if (!allowReconnect) {
            this.monitor.stop();
          }
          if (this.isActive()) {
            return (ref1 = this.webSocket) != null ? ref1.close() : void 0;
          }
        };

        Connection.prototype.reopen = function() {
          var error;
          ActionCable.log("Reopening WebSocket, current state is " + (this.getState()));
          if (this.isActive()) {
            try {
              return this.close();
            } catch (error1) {
              error = error1;
              return ActionCable.log("Failed to reopen WebSocket", error);
            } finally {
              ActionCable.log("Reopening WebSocket in " + this.constructor.reopenDelay + "ms");
              setTimeout(this.open, this.constructor.reopenDelay);
            }
          } else {
            return this.open();
          }
        };

        Connection.prototype.getProtocol = function() {
          var ref1;
          return (ref1 = this.webSocket) != null ? ref1.protocol : void 0;
        };

        Connection.prototype.isOpen = function() {
          return this.isState("open");
        };

        Connection.prototype.isActive = function() {
          return this.isState("open", "connecting");
        };

        Connection.prototype.isProtocolSupported = function() {
          var ref1;
          return ref1 = this.getProtocol(), indexOf.call(supportedProtocols, ref1) >= 0;
        };

        Connection.prototype.isState = function() {
          var ref1, states;
          states = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          return ref1 = this.getState(), indexOf.call(states, ref1) >= 0;
        };

        Connection.prototype.getState = function() {
          var ref1, state, value;
          for (state in WebSocket) {
            value = WebSocket[state];
            if (value === ((ref1 = this.webSocket) != null ? ref1.readyState : void 0)) {
              return state.toLowerCase();
            }
          }
          return null;
        };

        Connection.prototype.installEventHandlers = function() {
          var eventName, handler;
          for (eventName in this.events) {
            handler = this.events[eventName].bind(this);
            this.webSocket["on" + eventName] = handler;
          }
        };

        Connection.prototype.uninstallEventHandlers = function() {
          var eventName;
          for (eventName in this.events) {
            this.webSocket["on" + eventName] = function() {};
          }
        };

        Connection.prototype.events = {
          message: function(event) {
            var identifier, message, ref1, type;
            if (!this.isProtocolSupported()) {
              return;
            }
            ref1 = JSON.parse(event.data), identifier = ref1.identifier, message = ref1.message, type = ref1.type;
            switch (type) {
              case message_types.welcome:
                this.monitor.recordConnect();
                return this.subscriptions.reload();
              case message_types.ping:
                return this.monitor.recordPing();
              case message_types.confirmation:
                return this.subscriptions.notify(identifier, "connected");
              case message_types.rejection:
                return this.subscriptions.reject(identifier);
              default:
                return this.subscriptions.notify(identifier, "received", message);
            }
          },
          open: function() {
            ActionCable.log("WebSocket onopen event, using '" + (this.getProtocol()) + "' subprotocol");
            this.disconnected = false;
            if (!this.isProtocolSupported()) {
              ActionCable.log("Protocol is unsupported. Stopping monitor and disconnecting.");
              return this.close({
                allowReconnect: false
              });
            }
          },
          close: function(event) {
            ActionCable.log("WebSocket onclose event");
            if (this.disconnected) {
              return;
            }
            this.disconnected = true;
            this.monitor.recordDisconnect();
            return this.subscriptions.notifyAll("disconnected", {
              willAttemptReconnect: this.monitor.isRunning()
            });
          },
          error: function() {
            return ActionCable.log("WebSocket onerror event");
          }
        };

        return Connection;

      })();

    }).call(this);
    (function() {
      var slice = [].slice;

      ActionCable.Subscriptions = (function() {
        function Subscriptions(consumer) {
          this.consumer = consumer;
          this.subscriptions = [];
        }

        Subscriptions.prototype.create = function(channelName, mixin) {
          var channel, params, subscription;
          channel = channelName;
          params = typeof channel === "object" ? channel : {
            channel: channel
          };
          subscription = new ActionCable.Subscription(this.consumer, params, mixin);
          return this.add(subscription);
        };

        Subscriptions.prototype.add = function(subscription) {
          this.subscriptions.push(subscription);
          this.consumer.ensureActiveConnection();
          this.notify(subscription, "initialized");
          this.sendCommand(subscription, "subscribe");
          return subscription;
        };

        Subscriptions.prototype.remove = function(subscription) {
          this.forget(subscription);
          if (!this.findAll(subscription.identifier).length) {
            this.sendCommand(subscription, "unsubscribe");
          }
          return subscription;
        };

        Subscriptions.prototype.reject = function(identifier) {
          var i, len, ref, results, subscription;
          ref = this.findAll(identifier);
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            this.forget(subscription);
            this.notify(subscription, "rejected");
            results.push(subscription);
          }
          return results;
        };

        Subscriptions.prototype.forget = function(subscription) {
          var s;
          this.subscriptions = (function() {
            var i, len, ref, results;
            ref = this.subscriptions;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              s = ref[i];
              if (s !== subscription) {
                results.push(s);
              }
            }
            return results;
          }).call(this);
          return subscription;
        };

        Subscriptions.prototype.findAll = function(identifier) {
          var i, len, ref, results, s;
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            s = ref[i];
            if (s.identifier === identifier) {
              results.push(s);
            }
          }
          return results;
        };

        Subscriptions.prototype.reload = function() {
          var i, len, ref, results, subscription;
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            results.push(this.sendCommand(subscription, "subscribe"));
          }
          return results;
        };

        Subscriptions.prototype.notifyAll = function() {
          var args, callbackName, i, len, ref, results, subscription;
          callbackName = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            results.push(this.notify.apply(this, [subscription, callbackName].concat(slice.call(args))));
          }
          return results;
        };

        Subscriptions.prototype.notify = function() {
          var args, callbackName, i, len, results, subscription, subscriptions;
          subscription = arguments[0], callbackName = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
          if (typeof subscription === "string") {
            subscriptions = this.findAll(subscription);
          } else {
            subscriptions = [subscription];
          }
          results = [];
          for (i = 0, len = subscriptions.length; i < len; i++) {
            subscription = subscriptions[i];
            results.push(typeof subscription[callbackName] === "function" ? subscription[callbackName].apply(subscription, args) : void 0);
          }
          return results;
        };

        Subscriptions.prototype.sendCommand = function(subscription, command) {
          var identifier;
          identifier = subscription.identifier;
          return this.consumer.send({
            command: command,
            identifier: identifier
          });
        };

        return Subscriptions;

      })();

    }).call(this);
    (function() {
      ActionCable.Subscription = (function() {
        var extend;

        function Subscription(consumer, params, mixin) {
          this.consumer = consumer;
          if (params == null) {
            params = {};
          }
          this.identifier = JSON.stringify(params);
          extend(this, mixin);
        }

        Subscription.prototype.perform = function(action, data) {
          if (data == null) {
            data = {};
          }
          data.action = action;
          return this.send(data);
        };

        Subscription.prototype.send = function(data) {
          return this.consumer.send({
            command: "message",
            identifier: this.identifier,
            data: JSON.stringify(data)
          });
        };

        Subscription.prototype.unsubscribe = function() {
          return this.consumer.subscriptions.remove(this);
        };

        extend = function(object, properties) {
          var key, value;
          if (properties != null) {
            for (key in properties) {
              value = properties[key];
              object[key] = value;
            }
          }
          return object;
        };

        return Subscription;

      })();

    }).call(this);
    (function() {
      ActionCable.Consumer = (function() {
        function Consumer(url) {
          this.url = url;
          this.subscriptions = new ActionCable.Subscriptions(this);
          this.connection = new ActionCable.Connection(this);
        }

        Consumer.prototype.send = function(data) {
          return this.connection.send(data);
        };

        Consumer.prototype.connect = function() {
          return this.connection.open();
        };

        Consumer.prototype.disconnect = function() {
          return this.connection.close({
            allowReconnect: false
          });
        };

        Consumer.prototype.ensureActiveConnection = function() {
          if (!this.connection.isActive()) {
            return this.connection.open();
          }
        };

        return Consumer;

      })();

    }).call(this);
  }).call(this);

  if (typeof module === "object" && module.exports) {
    module.exports = ActionCable;
  } else if (typeof define === "function" && define.amd) {
    define(ActionCable);
  }
}).call(this);
// Action Cable provides the framework to deal with WebSockets in Rails.
// You can generate new channels where WebSocket features live using the `rails generate channel` command.
//




(function() {
  this.App || (this.App = {});

  App.cable = ActionCable.createConsumer();

}).call(this);
(function(target) {
  if (!target || !target.prototype)
    return;
  target.prototype.arrow = function(startX, startY, endX, endY, controlPoints) {
    var dx = endX - startX;
    var dy = endY - startY;
    var len = Math.sqrt(dx * dx + dy * dy);
    var sin = dy / len;
    var cos = dx / len;
    var a = [];
    a.push(0, 0);
    for (var i = 0; i < controlPoints.length; i += 2) {
      var x = controlPoints[i];
      var y = controlPoints[i + 1];
      a.push(x < 0 ? len + x : x, y);
    }
    a.push(len, 0);
    for (var i = controlPoints.length; i > 0; i -= 2) {
      var x = controlPoints[i - 2];
      var y = controlPoints[i - 1];
      a.push(x < 0 ? len + x : x, -y);
    }
    a.push(0, 0);
    for (var i = 0; i < a.length; i += 2) {
      var x = a[i] * cos - a[i + 1] * sin + startX;
      var y = a[i] * sin + a[i + 1] * cos + startY;
      if (i === 0) this.moveTo(x, y);
      else this.lineTo(x, y);
    }
  };
})(CanvasRenderingContext2D);
/**
 * jQuery.gpFloat 1.0
 * http://ginpen.com/jquery/gpfloat/
 * https://github.com/ginpei/jQuery.gpFloat
 *
 * Copyright (c) 2011 Takanashi Ginpei
 * http://ginpen.com
 *
 * Released under the MIT License.
 * http://www.opensource.org/licenses/mit-license.php
 */

;(function($) {
    try {
        if (window.com.ginpen.gpFloat) { return; }
    } catch (e) {}

    if (!window.com) { window.com = {}; }
    if (!com.ginpen) { com.ginpen = {}; }
    var gpFloat = com.ginpen.gpFloat = {
        targets: [],

        init: function() {
            // bind
            $(window).scroll($.proxy(this.onscroll, this));
        },

        onscroll: function(event) {
            var targets = this.targets;
            for (var i = 0, l = targets.length; i < l; i++) {
                this.updatePosition(targets[i]);
            }
        },

        /**
         * Update target's position.
         * @param {Object} target The object containing elements and settings.
         */
        updatePosition: function(target) {
            var $els = target.$el;
            var settings = target.settings;
            var scrollTop = this._getScrollTop();
            var scrollLeft = this._getScrollLeft();

            for (var i = 0, l = $els.length; i < l; i++) {
                var $el = $els.eq(i);
                $el.css({
                    left: this._getLeft($el, scrollLeft, settings),
                    top: this._getTop($el, scrollTop, settings)
                });
            }
        },

        _getScrollTop: function() {
            return document.documentElement.scrollTop
                || document.body.scrollTop;
        },

        _getScrollLeft: function() {
            return document.documentElement.scrollLeft
                || document.body.scrollLeft;
        },

        /**
         * Calclate element X position.
         * @param {HtmlElement} $el
         * @param {Number} scrollLeft
         * @param {Object} settings
         */
        _getLeft: function($el, scrollLeft, settings) {
            var left = null;

            if (settings.direction.indexOf('x') >= 0) {
                if ($.isFunction(settings.getLeft)) {
                    left = settings.getLeft($el.data('gpFloat.originalX'), scrollLeft, $el);
                }
                else {
                    left = this._getLeftDefault($el, scrollLeft);
                }
            }

            return left;
        },

        /**
         * Default calclation for element X position.
         * @param {HtmlElement} $el
         * @param {Number} scrollLeft
         */
        _getLeftDefault: function($el, scrollLeft) {
            return $el.data('gpFloat.originalX') - scrollLeft;
        },

        /**
         * Calclate element Y position.
         * @param {HtmlElement} $el
         * @param {Number} scrollTop
         * @param {Object} settings
         */
        _getTop: function($el, scrollTop, settings) {
            var top = null;

            if (settings.direction.indexOf('y') >= 0) {
                if ($.isFunction(settings.getTop)) {
                    top = settings.getTop($el.data('gpFloat.originalY'), scrollTop, $el);
                }
                else {
                    top = this._getTopDefault($el, scrollTop);
                }
            }

            return top;
        },

        /**
         * Default calclation for element Y position.
         * @param {HtmlElement} $el
         * @param {Number} scrollTop
         */
        _getTopDefault: function($el, scrollTop) {
            return $el.data('gpFloat.originalY') - scrollTop;
        },

        /**
         * Add observe item(s).
         * @param {HtmlElement} $el HTML elements to be observed.
         * @param {Object} settings Settings for $el.
         */
        push: function($els, settings) {
            for (var i = 0, l = $els.length; i < l; i++) {
                this._initTarget($els.eq(i), settings);
            }

            this.targets.push({ $el: $els, settings: settings });
        },

        /**
         * @param {HtmlElement} $el
         * @param {Object} settings
         */
        _initTarget: function($el, settings) {
            var offset = $el.offset();
            var originalX = offset.left;
            var originalY = offset.top;

            // normalize settings
            settings = settings || {};
            if (settings.direction && $.isFunction(settings.direction.toLowerCase)) {
                settings.direction = settings.direction.toLowerCase();
            }
            else {
                settings.direction = '';
            }

            // remember original position
            $el.data('gpFloat.originalX', originalX);
            $el.data('gpFloat.originalY', originalY);

            // add fixed style
            $el.css({
                left: originalX,
                position: 'fixed',
                top: originalY
            });
        }
    };

    // init
    $(function() { gpFloat.init(); });

    // jQuery method interface
    $.fn.gpFloat = function(settings) {
        gpFloat.push(this, settings);
    };

    // Shortcut interface
    $.fn.gpFloatX = function(settings) {
        settings = settings || {};
        settings.direction = 'x';
        this.gpFloat(settings);
    };
    $.fn.gpFloatY = function(settings) {
        settings = settings || {};
        settings.direction = 'y';
        this.gpFloat(settings);
    };
});
//by Michalis Tzikas
//thanks to www.webhoster.gr & www.michalistzikas.com
//27-04-2011
//v1.3
//web site: http://www.jquery.gr/introtzikas
/*
Copyright (C) 2011 by Michalis Tzikas

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

(function( $ ){
  $.fn.introtzikas = function(options) {

		var defaults = {
			line   : '#F00',
			speedwidth	 : 2000,
			speedheight	 : 1000,
			speedopacity : 800,
			bg : '#333',
			lineheight : 2
		};
		var options = $.extend(defaults, options);

  		$('iframe').hide();
		$('body').css('overflow-y','hidden');
		$('<div class="introtzikas_bg" style="visibility:visible"><div class="introtzikas" style="visibility:visible"></div></div>').appendTo('#nsf-all');

  		$('.introtzikas_bg').css('background-color',options.bg);
  		$('.introtzikas_bg').css('position','fixed');
  		$('.introtzikas_bg').css('height',$('#nsf-all')[0].offsetHeight);
  		$('.introtzikas_bg').css('width',$('#nsf-all')[0].offsetWidth);
  		$('.introtzikas_bg').css('top',$('#nsf-all')[0].offsetTop);
  		$('.introtzikas_bg').css('left',$('#nsf-all')[0].offsetLeft);
  		$('.introtzikas_bg').css('visibility','visible');

		$('body').css('visibility','hidden');
		$('.introtzikas').css('background-color',options.line);
		$('.introtzikas').css('position','fixed');
		$('.introtzikas').css('top','50%');
		$('.introtzikas').css('height',options.lineheight+'px');
		$('.introtzikas').css('width','0%');
		$('.introtzikas').css('visibility','visible');
		$('.introtzikas').animate({
			width: '+=100%'
		  }, options.speedwidth, function() {
				$('.introtzikas').animate({
					height: '+=100%',
					top: '-=50%'
				  }, options.speedheight, function() {
					  	$('body').attr('style','');
						$('body').css('visibility','visible');
						$('.introtzikas_bg').css('visibility','hidden');
						$('.introtzikas').animate({
							opacity: 0
						  }, options.speedopacity, function(){
							  $('.introtzikas_bg').remove();
							  $('iframe').show();
							  $('body').css('overflow-y','visible');

						  });

				  });

		  });
  };
});
(function() {


}).call(this);
//変数を宣言するファイル

$(function() {
  //変数の定義
  if ( typeof NS === "undefined" ) NS = {};

  // ns-all var
  NS.pcNode = 0;  // PCの数
  NS.ruNode = 0;  // Routerの数
  NS.busNode = 0; //busの数
  NS.swNode = 0;  // Switchの数
  NS.svNode = 0;  // Serverの数
  NS.lanNode = 0; // LanNodeの数

  // ns-main var
  NS.mainDropFlg     = true; // Draggableのフラグ
  NS.dropNodeInt     = 0;    // DropNodeの個数
  NS.dropNodeName    = "";   // DropNodeの名前
  NS.dropContextName = "";   // DropNodeのContextMenuの名前

  // ns-canvas var
  NS.points          = []; // ドラッグ時のマウスの座標の配列
  NS.lanArrClass     = []; // ns-main-canvasのクラスの配列
  NS.lanArrWidth     = []; // LANの帯域幅の配列
  NS.lanWidth        = 2;  // LANの幅
  NS.lanFlag         = false;  // LANのフラグ   (画像に乗っているとき)
  NS.busFlag        = false;
  NS.busDrawFrag    = false;
  NS.lanFlaglink;          // LANのフラグ2  (lanLinkがあるとき)
  NS.lanFlagPoint;         // LANのフラグ3  (lanDownが実行されたとき)
  NS.lanFlagDelet;         // LANのフラグ4  (lanDownの削除するとき)
  NS.lanFlagMove;          // LANのフラグ5  (lanMoveDownが実行されたとき)
  NS.elLanMoveThis;        // LANMoveのクエリのキャッシュ
  NS.addCtx;               // 追加したCanvasのAPIにアクセスできるオブジェクト
  NS.addCanvas;            // 追加したCanvasを格納
  NS.canvasWidth      = $('#ns-main').width();  // ns-mainの幅
  NS.canvasHeight     = $('#ns-main').height(); // ns-mainの高さ
  NS.mainCanvasWidth  = $('#ns-main-canvas')[0].getBoundingClientRect().left - 35;
  NS.mainCanvasHeight = $('#ns-main-canvas')[0].getBoundingClientRect().top - 35;
  NS.mainCanvasX      = $('#ns-main-canvas')[0].getBoundingClientRect().left;
  NS.mainCanvasY      = $('#ns-main-canvas')[0].getBoundingClientRect().top;
  NS.questionCanvasX  = $('#ns-main-canvas')[0].getBoundingClientRect().left + 150;
  NS.questionCanvasY  = $('#ns-main-canvas')[0].getBoundingClientRect().top + 60;
  NS.mainCtx          = $('#ns-main-canvas')[0].getContext('2d'); // ns-main-canvasをAPIにアクセスできるオブジェクト
  NS.mainCtx.strokeStyle = '#2fb9fe';                              // 線の色を青色に設定

  // ns-glay var
  NS.bGlayFladg = false; // glayLayerのフラグ

  //animecanvasのフラグ
  NS.animecanvasFlag = false;

  //urlパラメータを取得
  var arg = new Object;
  var pair=location.search.substring(1).split('&');
  for(var i=0;pair[i];i++) {
      var kv = pair[i].split('=');
      NS.urlparameter=kv[1];
  }

  //ns-mainのxy
  $('#ns-main-canvas').attr('data-x', NS.mainCanvasWidth);
  $('#ns-main-canvas').attr('data-y', NS.mainCanvasHeight);
});
//simuMainで使われる関数のファイル

//右クリック時に実行
fncontextmenu = function(element) {
  if (true) {
    var count = 0;
    var split_lan = [];

    var lan_info = $(element).attr('data-ifnum');


    //console.log(element);
    var nodeName = $("img[alt='" + $(element)[0].alt +  "']")[0].alt;

    $.contextMenu( 'destroy' );

    //contextMenuを生成
    $('#contextMenuTemplate').html('');

    $('#contextMenuTemplate').append('<form action="#"/>');

    $('#contextMenuTemplate form').append('<table class="context-IPSMIF" width="200"><tr align="center"></tr></table>');

    $('#contextMenuTemplate form .context-IPSMIF tr').append('<th><label class="IF">IF</label></th>');

    $('#contextMenuTemplate form .context-IPSMIF tr').append('<th><label class="IP">IPアドレス</label></th>');

    $('#contextMenuTemplate form .context-IPSMIF tr').append('<th><label class="SM">SM</label></th>');

    //自由描画モード
    if ($(element).hasClass('context-menu-Router')) {
      var selectorType = '.context-menu-Router';

      //ifの数だけIPアドレスとSM入力欄を生成
      for(i = 0; i < $(element).attr('data-ifnum'); i++){
        num = $('#ns-right dt:contains(' + nodeName + ') + dd p:contains(IP-'  + i + ') span:nth-of-type(2)').attr('id').split('_')[1];
        //$('#ns-right:contains').attr
        createIP_SM(nodeName.slice(6), num, 'Router');
      }

      $('#contextMenuTemplate form').append('<li class="context-menu-separator"></li>');

      $('#contextMenuTemplate form .context-menu-separator').after('<table class="context-RoutingTable" width="300"><tr align="center"></tr></table>');

      //ルーティングテーブル作成
      $('#contextMenuTemplate form .context-RoutingTable tr').append('<th><label>RoutingTable</label></th>');
      $('#contextMenuTemplate form .context-RoutingTable tr').append('<img src="/assets/plus.jpg" class="' + nodeName + '" onClick="return addRoutingTable(this)">');
      $('#contextMenuTemplate form .context-RoutingTable tr:last-child').after('<tr align="center"></tr>')
      $('#contextMenuTemplate form .context-RoutingTable tr:last-child').append('<th><label class="routingtable-IPSM">宛先ルート</label></th>');
      $('#contextMenuTemplate form .context-RoutingTable tr:last-child').append('<th><label class="routingtable-NHA">NHA</label></th>');
      $('#contextMenuTemplate form .context-RoutingTable tr:last-child').append('<th><label class="routingtable-IF">IF</label></th>');

      //ifの数だけ生成
      for (i = 0; i <= $(element).attr('data-routingtablenum'); i++) {
        createRoutingTable(nodeName.slice(6), i);
      }

      $('#contextMenuTemplate').append('<li class="context-menu-separator"></li>');

      $('#contextMenuTemplate').append(
        $('<menuitem>').attr({
          label: '削除',
          class: nodeName,
          onclick: 'return nodeDel(this);'
        }));

      $('#contextMenuTemplate').append(
        $('<menuitem>').attr({
          label: '閉じる'
        }));

      }

    else if ($(element).hasClass('context-menu-PC')) {
      var selectorType = '.context-menu-PC';

      //IPアドレスとSM入力欄を生成
      createIP_SM(nodeName.slice(2), 0, 'PC');


      $('#contextMenuTemplate form').append('<li class="context-menu-separator"></li>');

      $('#contextMenuTemplate form .context-menu-separator').after('<table class="context-RoutingTable" width="300"><tr align="center"></tr></table>');

      //ルーティングテーブル作成
      $('#contextMenuTemplate form .context-RoutingTable tr').append('<th><label>RoutingTable</label></th>');
      $('#contextMenuTemplate form .context-RoutingTable tr:last-child').after('<tr align="center"></tr>')
      $('#contextMenuTemplate form .context-RoutingTable tr:last-child').append('<th><label class="routingtable-IPSM">宛先ルート</label></th>');
      $('#contextMenuTemplate form .context-RoutingTable tr:last-child').append('<th><label class="routingtable-NHA">NHA</label></th>');
      $('#contextMenuTemplate form .context-RoutingTable tr:last-child').append('<th><label class="routingtable-IF">IF</label></th>');

      //ifの数だけ生成
      $('#contextMenuTemplate form .context-RoutingTable tr:last-child').after('<tr align="center"></tr>');
      $('#contextMenuTemplate .context-RoutingTable tr:last-child')
      .append('<td><input id="PCroutingtable-IP' + nodeName.slice(2) + '_' + 0 + '"  type="text" size="13" value="' + document.getElementById('rightInfo-PCroutingtable-IP' + nodeName.slice(2) + '_' + 0).innerHTML + '" onKeyUp="return fCopy(this);"/>/' +
      '<input id="PCroutingtable-SM' + nodeName.slice(2) + '_' + 0 +'" type="text" size="1" value="' + document.getElementById('rightInfo-PCroutingtable-SM' + nodeName.slice(2) + '_' + 0).innerHTML + '" onKeyUp="return fCopy(this);"/>→</td>');
      $('#contextMenuTemplate .context-RoutingTable tr:last-child')
      .append('<td><input id="PCroutingtable-NHA' + nodeName.slice(2) + '_' + 0 + '" type="text" size="13" value="' + document.getElementById('rightInfo-PCroutingtable-NHA' + nodeName.slice(2) + '_' + 0).innerHTML + '" onKeyUp="return fCopy(this);"/></td>');
      $('#contextMenuTemplate .context-RoutingTable tr:last-child')
      .append('<td>if<input id="PCroutingtable-IF' + nodeName.slice(2) + '_' + 0 + '" type="text" size="1" value="' + document.getElementById('rightInfo-PCroutingtable-IF' + nodeName.slice(2) + '_' + 0).innerHTML + '" onKeyUp="return fCopy(this);"></td>');

      $('#contextMenuTemplate').append('<li class="context-menu-separator"></li>');


      $('#contextMenuTemplate').append(
        $('<menuitem>').attr({
          label: '削除',
          class: nodeName,
          onclick: 'return nodeDel(this);'
        }));

      $('#contextMenuTemplate').append(
        $('<menuitem>').attr({
          label: '閉じる'
        }));
    }

    //問題演習モードの場合
    else if ($(element).hasClass('q-context-menu-Router')) {
      var selectorType = '.q-context-menu-Router';

      //ifの数だけIPアドレスとSM入力欄を生成
      for(i = 0; i < $(element).attr('data-ifnum'); i++){
        num = $('#ns-right dt:contains(' + nodeName + ') + dd p:contains(IP-'  + i + ') span:nth-of-type(2)').attr('id').split('_')[1];
        //$('#ns-right:contains').attr
        createIP_SM(nodeName.slice(6), num, 'Router');
      }

      $('#contextMenuTemplate form').append('<li class="context-menu-separator"></li>');

      $('#contextMenuTemplate form .context-menu-separator').after('<table class="context-RoutingTable" width="300"><tr align="center"></tr></table>');

      //ルーティングテーブル作成
      $('#contextMenuTemplate form .context-RoutingTable tr').append('<th><label>RoutingTable</label></th>');
      $('#contextMenuTemplate form .context-RoutingTable tr').append('<img src="/assets/plus.jpg" class="' + nodeName + '" onClick="return addRoutingTable(this)">');
      $('#contextMenuTemplate form .context-RoutingTable tr:last-child').after('<tr align="center"></tr>')
      $('#contextMenuTemplate form .context-RoutingTable tr:last-child').append('<th><label class="routingtable-IPSM">宛先ルート</label></th>');
      $('#contextMenuTemplate form .context-RoutingTable tr:last-child').append('<th><label class="routingtable-NHA">NHA</label></th>');
      $('#contextMenuTemplate form .context-RoutingTable tr:last-child').append('<th><label class="routingtable-IF">IF</label></th>');

      //ifの数だけ生成
      for (i = 0; i <= $(element).attr('data-routingtablenum'); i++) {
        createRoutingTable(nodeName.slice(6), i);
      }

      $('#contextMenuTemplate').append('<li class="context-menu-separator"></li>');


      $('#contextMenuTemplate').append(
        $('<menuitem>').attr({
          label: '閉じる'
        }));


    }

    else if ($(element).hasClass('q-context-menu-PC')) {
      var selectorType = '.q-context-menu-PC';

      //IPアドレスとSM入力欄を生成
      createIP_SM(nodeName.slice(2), 0, 'PC');


      $('#contextMenuTemplate form').append('<li class="context-menu-separator"></li>');

      $('#contextMenuTemplate form .context-menu-separator').after('<table class="context-RoutingTable" width="300"><tr align="center"></tr></table>');

      //ルーティングテーブル作成
      $('#contextMenuTemplate form .context-RoutingTable tr').append('<th><label>RoutingTable</label></th>');
      $('#contextMenuTemplate form .context-RoutingTable tr:last-child').after('<tr align="center"></tr>')
      $('#contextMenuTemplate form .context-RoutingTable tr:last-child').append('<th><label class="routingtable-IPSM">宛先ルート</label></th>');
      $('#contextMenuTemplate form .context-RoutingTable tr:last-child').append('<th><label class="routingtable-NHA">NHA</label></th>');
      $('#contextMenuTemplate form .context-RoutingTable tr:last-child').append('<th><label class="routingtable-IF">IF</label></th>');

      //ifの数だけ生成
      $('#contextMenuTemplate form .context-RoutingTable tr:last-child').after('<tr align="center"></tr>');
      $('#contextMenuTemplate .context-RoutingTable tr:last-child')
      .append('<td><input id="PCroutingtable-IP' + nodeName.slice(2) + '_' + 0 + '"  type="text" size="13" value="' + document.getElementById('rightInfo-PCroutingtable-IP' + nodeName.slice(2) + '_' + 0).innerHTML + '" onKeyUp="return fCopy(this);"/>/' +
      '<input id="PCroutingtable-SM' + nodeName.slice(2) + '_' + 0 +'" type="text" size="1" value="' + document.getElementById('rightInfo-PCroutingtable-SM' + nodeName.slice(2) + '_' + 0).innerHTML + '" onKeyUp="return fCopy(this);"/>→</td>');
      $('#contextMenuTemplate .context-RoutingTable tr:last-child')
      .append('<td><input id="PCroutingtable-NHA' + nodeName.slice(2) + '_' + 0 + '" type="text" size="13" value="' + document.getElementById('rightInfo-PCroutingtable-NHA' + nodeName.slice(2) + '_' + 0).innerHTML + '" onKeyUp="return fCopy(this);"/></td>');
      $('#contextMenuTemplate .context-RoutingTable tr:last-child')
      .append('<td>if<input id="PCroutingtable-IF' + nodeName.slice(2) + '_' + 0 + '" type="text" size="1" value="' + document.getElementById('rightInfo-PCroutingtable-IF' + nodeName.slice(2) + '_' + 0).innerHTML + '" onKeyUp="return fCopy(this);"></td>');

      $('#contextMenuTemplate').append('<li class="context-menu-separator"></li>');



      $('#contextMenuTemplate').append(
        $('<menuitem>').attr({
          label: '閉じる'
        }));
    }


    $.contextMenu({
      selector: selectorType,
      items: $.contextMenu.fromMenu($('#contextMenuTemplate'))
    });

  }
}

//contextMenuの動作

//ns-rightに値を入れる
fCopy = function(e){
  id = 'rightInfo-' + e.id;
  $('#' + id).text(e.value);
}

//IPアドレスとSM入力欄を作成
createIP_SM = function(nodeNum, ifNum, kind) {

 if (kind === 'Router') {

   $('#contextMenuTemplate form .context-IPSMIF tr:last-child').after('<tr align="center"></tr>');

   //IF
   $('#contextMenuTemplate form .context-IPSMIF tr:last-child').append('<td>if' + ifNum + '：</td>');

   //IPアドレス入力欄
   $('#contextMenuTemplate form .context-IPSMIF tr:last-child').append($('<td/>').append(
     $('<input/>').attr({
       name: 'IPアドレス',
       type: 'text',
       size: '16',
       value: document.getElementById('rightInfo-IP' + nodeNum + '_' + ifNum).innerHTML,
       id: 'IP' + nodeNum + '_' + ifNum,
       class: 'context-IP IPSMIF-item-middle',
       onKeyUp: 'return fCopy(this);'
     })));

   //SM入力欄
   $('#contextMenuTemplate form .context-IPSMIF tr:last-child').append($('<td/>').append(
     $('<input/>').attr({
       name: 'SM',
       type: 'text',
       size: '2',
       value: document.getElementById('rightInfo-SM' + nodeNum + '_' + ifNum).innerHTML,
       id: 'SM' + nodeNum + '_' + ifNum,
       class: 'context-SM',
       onKeyUp: 'return fCopy(this);'
     })));
   /*
   //SM入力欄
   $('#contextMenuTemplate form').append('<li class="context-SM"></li>');
   $('#contextMenuTemplate form .context-SM:last-child').append('<label></label>');
   $('#contextMenuTemplate form .context-SM:last-child label').append(
     $('<input>').attr({
       name: 'SM',
       type: 'text',
       size: '2',
       value: document.getElementById('rightInfo-SM' + nodeNum + '_' + lanNum).innerHTML,
       id: 'context-rightInfo-SM' + nodeNum + '_' + lanNum,
       class: 'context-SM',
       onKeyUp: 'return fCopy(this);'
     }));


   //IPアドレス入力欄
   $('#contextMenuTemplate form').append('<li class="context-IP"></li>');
   $('#contextMenuTemplate form .context-IP:last-child').append('<label></label>');
   $('#contextMenuTemplate form .context-IP:last-child label').append(
     $('<input>').attr({
       name: 'IPアドレス',
       type: 'text',
       size: '16',
       value: document.getElementById('rightInfo-IP' + nodeNum + '_' + lanNum).innerHTML,
       id: 'context-rightInfo-IP' + nodeNum + '_' + lanNum,
       class: 'context-IP',
       onKeyUp: 'return fCopy(this);'
     }));
     */
 }

 else if (kind === 'PC') {

   $('#contextMenuTemplate form .context-IPSMIF tr').after('<tr align="center"></tr>');

   //IF
   $('#contextMenuTemplate form .context-IPSMIF tr:last-child').append($('<th/>').append('if0：'));

   //IPアドレス入力欄
   $('#contextMenuTemplate form .context-IPSMIF tr:last-child').append($('<th/>').append(
     $('<input>').attr({
       name: 'IPアドレス',
       type: 'text',
       size: '16',
       value: document.getElementById('rightInfo-IP' + nodeNum).innerHTML,
       id: 'IP' + nodeNum,
       class: 'context-IP IPSMIF-item-middle',
       onKeyUp: 'return fCopy(this);'
     })));

   //SM入力欄
   $('#contextMenuTemplate form .context-IPSMIF tr:last-child').append($('<th/>').append(
     $('<input>').attr({
       name: 'SM',
       type: 'text',
       size: '2',
       value: document.getElementById('rightInfo-SM' + nodeNum).innerHTML,
       id: 'SM' + nodeNum,
       class: 'context-SM IPSMIF-item',
       onKeyUp: 'return fCopy(this);'
     })));

 }
}

//Routingtable入力欄を作成
createRoutingTable = function(nodeNum, iNum) {
  //iNum += 1;
  $('#contextMenuTemplate .context-RoutingTable tr:last-child').after('<tr align="center"></tr>');

  $('#contextMenuTemplate .context-RoutingTable tr:last-child')
  .append('<td><input id="routingtable-IP' + nodeNum + '_' + iNum + '"  type="text" size="13" value="' + document.getElementById('rightInfo-routingtable-IP' + nodeNum + '_' + iNum).innerHTML + '" onKeyUp="return fCopy(this);"/>/' +
  '<input id="routingtable-SM' + nodeNum + '_' + iNum +'" type="text" size="1" value="' + document.getElementById('rightInfo-routingtable-SM' + nodeNum + '_' + iNum).innerHTML + '" onKeyUp="return fCopy(this);"/>→</td>');
  $('#contextMenuTemplate .context-RoutingTable tr:last-child')
  .append('<td><input id="routingtable-NHA' + nodeNum + '_' + iNum + '" type="text" size="13" value="' + document.getElementById('rightInfo-routingtable-NHA' + nodeNum + '_' + iNum).innerHTML + '" onKeyUp="return fCopy(this);"/></td>');
  $('#contextMenuTemplate .context-RoutingTable tr:last-child')
  .append('<td>if<input id="routingtable-IF' + nodeNum + '_' + iNum + '" type="text" size="1" value="' + document.getElementById('rightInfo-routingtable-IF' + nodeNum + '_' + iNum).innerHTML + '" onKeyUp="return fCopy(this);"></td>');

  if (iNum != 0) {
    $('#contextMenuTemplate .context-RoutingTable tr:last-child')
    .append('<img src="/assets/minus.jpg" id="minus' + nodeNum + '_' + iNum + '" class="Router' + nodeNum + '" onClick="return delRoutingTable(this)">');
  }


  // if ($('#context-rightInfo-IF-NHA' + nodeNum + '_' + iNum)[0].value == 'DirectConected') {
  //   e = $('#context-rightInfo-IF-NHA' + nodeNum + '_' + iNum)[0];
  //   $(e).attr('readonly', true);
  // }

}

//ルーティングテーブルを追加
 addRoutingTable = function(plus) {
  console.log('plusのクラス: ' + $(plus).attr('class'));
  $('ul form .context-RoutingTable tr:last-child').after('<tr align="center"></tr>');
  img = $('.ui-droppable img');

  for(i=0; i < img.length; i++){
    if (img[i].alt === $(plus).attr('class')) {
      element = img[i]
    }
  }

  if ($(element).attr('data-routingtableNum') === undefined) {
      $(element).attr('data-routingtablenum', 1);
      num = 1;
  }
  else {
      num = parseInt($(element).attr('data-routingtablenum'));
      num += 1;
      $(element).attr('data-routingtablenum', num);
  }

  //routingtableに追加
  $('ul form .context-RoutingTable tr:last-child')
  .append('<td><input id="routingtable-IP' + element.alt.slice(6) + '_' + num + '"  type="text" size="13" onKeyUp="return fCopy(this);"/>/' +
  '<input id="routingtable-SM' + element.alt.slice(6) + '_' + num +'" type="text" size="1" onKeyUp="return fCopy(this);"/>→</td>');
  $('ul form .context-RoutingTable tr:last-child')
  .append('<td><input id="routingtable-NHA' + element.alt.slice(6) + '_' + num + '" type="text" size="13" onKeyUp="return fCopy(this);"/></td>');
  $('ul form .context-RoutingTable tr:last-child')
  .append('<td>if<input id="routingtable-IF' + element.alt.slice(6) + '_' + num + '" type="text" size="1" onKeyUp="return fCopy(this);"></td>');
  $('ul form .context-RoutingTable tr:last-child')
  .append('<img src="/assets/minus.jpg" id="minus' + element.alt.slice(6) + '_' + num + '" class="' + element.alt + '" onClick="return delRoutingTable(this)">');

  //rightinfoに追加
  $('#ns-right dt:contains("'+ element.alt +'") + dd')
  .append('<p class="rightInfo-routingtable-IPSM"><span id="rightInfo-routingtable-IP' + element.alt.slice(6) + '_'  + num + '"></span>/<span id="rightInfo-routingtable-SM' + element.alt.slice(6) + '_'  + num +'"></span>' +
  '<br/>→<span id="rightInfo-routingtable-NHA' + element.alt.slice(6) + '_'  + num + '"></span>：IF<span id="rightInfo-routingtable-IF' + element.alt.slice(6) + '_'  + num + '"></span></p>');
}

//ルーティングテーブルを削除
delRoutingTable = function(minus) {
  console.log(minus.id);
  minusid = minus.id.slice(5);
  element = $('#ns-main img[alt="' + $(minus).attr('class') + '"]');
  num = $(element).attr('data-routingtablenum');
  $(element).attr('data-routingtablenum', num-1);
  $('ul #routingtable-IP' + minusid).parent().parent()[0].remove();
  // if ($('#routingtable-IP' + minus.id).length > 0) {
  //     $('#routingtable-IP' + minus.id).parent().parent()[0].remove();
  // }
  $('#rightInfo-routingtable-IP' + minusid).parent()[0].remove();

  //ルーティングテーブルとrightをつめる
  for(i=0, j=1; i < num; i++, j++){
    if ($('#rightInfo-routingtable-IP' + $(minus).attr('class').slice(6) + '_' + i).length == 0) {
      $('#rightInfo-routingtable-IP' + $(minus).attr('class').slice(6) + '_' + j).attr('id', 'rightInfo-routingtable-IP' + $(minus).attr('class').slice(6) + '_' + i);
      $('#rightInfo-routingtable-SM' + $(minus).attr('class').slice(6) + '_' + j).attr('id', 'rightInfo-routingtable-SM' + $(minus).attr('class').slice(6) + '_' + i);
      $('#rightInfo-routingtable-NHA' + $(minus).attr('class').slice(6) + '_' + j).attr('id', 'rightInfo-routingtable-NHA' + $(minus).attr('class').slice(6) + '_' + i);
      $('#rightInfo-routingtable-IF' + $(minus).attr('class').slice(6) + '_' + j).attr('id', 'rightInfo-routingtable-IF' + $(minus).attr('class').slice(6) + '_' + i);

    }
    if (($('ul #routingtable-IP' + $(minus).attr('class').slice(6) + '_' + i).length == 0)) {
      $('ul #routingtable-IP' + $(minus).attr('class').slice(6) + '_' + j).attr('id', 'routingtable-IP' + $(minus).attr('class').slice(6) + '_' + i);
      $('ul #routingtable-SM' + $(minus).attr('class').slice(6) + '_' + j).attr('id', 'routingtable-SM' + $(minus).attr('class').slice(6) + '_' + i);
      $('ul #routingtable-NHA' + $(minus).attr('class').slice(6) + '_' + j).attr('id', 'routingtable-NHA' + $(minus).attr('class').slice(6) + '_' + i);
      $('ul #routingtable-IF' + $(minus).attr('class').slice(6) + '_' + j).attr('id', 'routingtable-IF' + $(minus).attr('class').slice(6) + '_' + i);
      $('ul #minus' + $(minus).attr('class').slice(6) + '_' + j).attr('id', 'minus' + $(minus).attr('class').slice(6) + '_' + i);
    }
  }
}

//削除
nodeDel = function(e) {
  nodeName = $(e).attr('class'); //消去したいノードの名前
  delNode = $('[alt=' + nodeName + ']')[0]; //消去したいノードの要素
  delNodeClass = $(delNode).attr('class').split(' ');
  delNodeIf = [];
  mainCanvasHeight = $('#ns-main-canvas').attr('data-y') - 35;
  mainCanvasWidth = $('#ns-main-canvas').attr('data-x') - 35;

  split_lan = $('#ns-main-canvas').attr('class').split(/\s?L_/);

  //線を削除
  $('#ns-main-canvas')[0].getContext('2d').clearRect(0, 0, $('#ns-main').width(), $('#ns-main').height());

  //delnodeにつながっているインターフェースを削除
  for(i=0; i < split_lan.length; i++){
    if ($(delNode).hasClass('sP_' + split_lan[i])) {
      dataLanIf =  $('.eP_' + split_lan[i]).attr('data-lan-if').split(' ');

      for(j=0; j < dataLanIf.length; j++){
        dataLanIf[j] = dataLanIf[j].split('-');

        if (dataLanIf[j][0] == split_lan[i]) {
          //消去する要素の後の要素を取得
          changeElement = $('#rightInfo-IP' + $('.eP_' + split_lan[i])[0].alt.slice(6) + '_' + dataLanIf[j][1]).parent().nextAll();
          //rightInfoから削除
          $('#rightInfo-IP' + $('.eP_' + split_lan[i])[0].alt.slice(6) + '_' + dataLanIf[j][1]).parent().remove();
          //rightInfoの見かけの番号を-1
          for(k=0; k < changeElement.length; k++){
            if ($(changeElement[k]).children().hasClass('num')) {
              num = parseInt($(changeElement[k]).children()[0].innerHTML.slice(3)) - 1;
              element = $(changeElement[k]).children()[0]
              $(element).html('IP-' + num);
            }
          }
          //data-lannunを-1
          $('.eP_' + split_lan[i]).attr('data-ifnum', parseInt($('.eP_' + split_lan[i]).attr('data-ifnum')) - 1)
        }
      }
      $('#ns-main img').removeClass('eP_' + split_lan[i]);
      $('#ns-main-canvas').removeClass('L_' + split_lan[i]);
    }
    else if ($(delNode).hasClass('eP_' + split_lan[i])) {
      dataLanIf =  $('.sP_' + split_lan[i]).attr('data-lan-if').split(' ');

      for(j=0; j < dataLanIf.length; j++){
        dataLanIf[j] = dataLanIf[j].split('-');

        if (dataLanIf[j][0] == split_lan[i]) {
          //消去する要素の後の要素を取得
          changeElement = $('#rightInfo-IP' + $('.sP_' + split_lan[i])[0].alt.slice(6) + '_' + dataLanIf[j][1]).parent().nextAll();
          //rightInfoから削除
          $('#rightInfo-IP' + $('.sP_' + split_lan[i])[0].alt.slice(6) + '_' + dataLanIf[j][1]).parent().remove();
          //rightInfoの見かけの番号を-1
          for(k=0; k < changeElement.length; k++){
            if ($(changeElement[k]).children().hasClass('num')) {
              num = parseInt($(changeElement[k]).children()[0].innerHTML.slice(3)) - 1;
              element = $(changeElement[k]).children()[0]
              $(element).html('IP-' + num);
            }
          }
          //data-lannunを-1
          $('.sP_' + split_lan[i]).attr('data-ifnum', parseInt($('.sP_' + split_lan[i]).attr('data-ifnum')) - 1)
        }
      }
      $('#ns-main img').removeClass('sP_' + split_lan[i]);
      $('#ns-main-canvas').removeClass('L_' + split_lan[i]);
    }
  }

  $('#ns-main img:not([class*="P_"])').removeClass('lanLink');

  // lanLinkがないとき
  if(!($('#ns-main .ui-draggable').hasClass('lanLink'))) {
    $('#ns-main').off('mousedown');
    $('#ns-main').off('mouseup');
    $('html').off('mouseup');
  }

  //ns-rightから削除する
  $('#ns-right dt:contains("'+ nodeName +'"), #ns-right dt:contains("'+ nodeName +'") + dd').remove();

  // for(i=0; i < delNodeIf.length; i++){
  //   $('.rightInfo-IPSM:contains("IP-' + delNodeIf[i] + '") + p').remove();
  //   $('.rightInfo-IPSM:contains("IP-' + delNodeIf[i] + '") + p').remove();
  //   $('.rightInfo-IPSM:contains("IP-' + delNodeIf[i] + '") + p').remove();
  //   $('.rightInfo-IPSM:contains("IP-' + delNodeIf[i] + '")').remove();
  // }

  delNode.remove();

}

//bussのコンテキストメニュー
busscontextmenu = function(element) {
  // console.log(element);
}

bussDel = function(e) {}

//パケットアニメーション
packetAnimation = function(e) {
  animeData = $(e).attr('class').split('-');
  animationData = [];
  mainCanvasX = $('#ns-main-canvas').attr('data-x');
  mainCanvasY = $('#ns-main-canvas').attr('data-y');

  $('.animecanvasflag').remove();

  if (animeData[animeData.length-2].slice(0, 3) == 'bus') {
    animeData.splice(animeData.length-2, 1);
  }

  for(i=0, count=0; i < animeData.length; i++, count++){
    if (animeData[i].slice(0, 3) == 'bus') {
      animationData[count] = new Object();
      animationData[count].name = 'Start' + animeData[i];
      count++;
      animationData[count] = new Object();
      animationData[count].name = 'End' + animeData[i];
    }
    else {
      $('#ns-main img[alt="' + animeData[i] + '"]').each(function (j, e) {
        animationData[count] = new Object();
        animationData[count].name = e.alt;
        animationData[count].animecanvasX = e.x  - mainCanvasX;
        animationData[count].animecanvasY = e.y  - mainCanvasY;
        animationData[count].packetanimeX = e.x + 23;
        animationData[count].packetanimeY = e.y + 23;
      });
    }
    if (i == animeData.length-1) {
      animationData[count] = animeData[i];
    }
  }

  //busの座標
  for(i=0; i < animationData.length-1; i++){
    if (animationData[i].name.slice(0, 5) == 'Start') {
      animationData[i].animecanvasX = animationData[i-1].animecanvasX;
      animationData[i].animecanvasY = $('#ns-main div[alt="' + animationData[i].name.slice(5) + '"]')[0].offsetTop - mainCanvasY - 30;
      animationData[i].packetanimeX = animationData[i-1].packetanimeX;
      animationData[i].packetanimeY = $('#ns-main div[alt="' + animationData[i].name.slice(5) + '"]')[0].offsetTop - 3;
    }
    else if (animationData[i].name.slice(0, 3) == 'End'){
      animationData[i].animecanvasX = animationData[i+1].animecanvasX;
      animationData[i].animecanvasY = $('#ns-main div[alt="' + animationData[i].name.slice(3) + '"]')[0].offsetTop - mainCanvasY - 30;
      animationData[i].packetanimeX = animationData[i+1].packetanimeX;
      animationData[i].packetanimeY = $('#ns-main div[alt="' + animationData[i].name.slice(3) + '"]')[0].offsetTop - 3;
    }
  }

  //canvasに追加
  $("#ns-main").append(
    $("<div>").attr({
      class: "PacketAnime",
      style: "position: absolute; top: " + animationData[0].packetanimeY + "px; left: "+ animationData[0].packetanimeX +"px; width:30px; height:30px;"
    }));


  $('#ns-main').append('<canvas width="600" height="400" id="animecanvas"></canvas>');

  canvas = document.getElementById('animecanvas');
  context = canvas.getContext("2d");

  context.beginPath();
  context.arrow(animationData[0].animecanvasX, animationData[0].animecanvasY, animationData[1].animecanvasX, animationData[1].animecanvasY, [0, 1, -20, 5, -20, 12]);
  context.fill();

  moveAnimation(1)

  //描画
  moveAnimation = function(i) {

    $('.PacketAnime')
      .hide().fadeIn(200).animate({})
      .animate({
        left: animationData[i].packetanimeX,
        top: animationData[i].packetanimeY
      },{
        duration: 500,
        complete:function () {
          if (animationData[i+1] != undefined) {
            context.beginPath();
            context.arrow(animationData[i].animecanvasX, animationData[i].animecanvasY, animationData[i+1].animecanvasX, animationData[i+1].animecanvasY, [0, 1, -20, 5, -20, 12]);
            context.fill();
          }
          if (i == animationData.length-1) {
            $('#animecanvas').addClass('animecanvasflag');
            $(".PacketAnime").remove();
            if (animationData[i] == 1) {
              $('.animecanvasflag').remove();
              for(j=0; j < animationData.length-1; j++){
                if (animationData[j].name.slice(0, 2) == 'PC' || animationData[j].name.slice(0, 6) == 'Router') {
                  animationData[j].packetanimeX = animationData[j].packetanimeX - 35;
                  animationData[j].packetanimeY = animationData[j].packetanimeY - 35;
                  $("#ns-main").append(
                    $("<div>").attr({
                      class: "cssCircle",
                      style: "position: absolute; top: " + animationData[j].packetanimeY + "px; left: "+ animationData[j].packetanimeX +"px; width:100px; height:100px;"
                    }));
                  $('.cssCircle:last-child').append(
                    $('<img>').attr({
                      src: '/assets/circle.png'
                    }));
                }
              }
              $('.cssCircle').fadeOut(300,function(){
                $(this).fadeIn(400, function () {
                  $(this).fadeOut(200, function () {
                    $('.cssCircle').remove();
                  })
                })
              });
            }
            if (animationData[i] == 0) {

              $("#animecanvas").drawRect({
                strokeStyle: "red",
                strokeWidth: 1,
                x: animationData[i-1].animecanvasX,
                y: animationData[i-1].animecanvasY,
                width: 80,
                height: 80
              });

              style = $('#ns-main img[alt=' + animationData[i-1].name + ']').attr('style');

              animationData[i-1].packetanimeX = animationData[i-1].packetanimeX - 30;
              animationData[i-1].packetanimeY = animationData[i-1].packetanimeY - 30;

              $("#ns-main").append(
                $("<div>").attr({
                  class: "cssCross",
                  style: "position: absolute; top: " + animationData[i-1].packetanimeY + "px; left: "+ animationData[i-1].packetanimeX +"px; width:100px; height:100px;"
                }));

              $('#ns-main img[alt=' + animationData[i-1].name + ']').addClass('hurueru');

              $(".hurueru").css({
                'display': 'inline-block',
                'animation': 'hurueru .1s 9'
              });

              $('.cssCross').append(
                $('<img>').attr({
                  src: '/assets/cross.png'
                }));

              $('.cssCross').fadeOut(300,function(){
                $(this).fadeIn(400, function () {
                  $(this).fadeOut(200, function () {
                    $('.cssCross').remove();
                    $('#ns-main img[alt=' + animationData[i-1].name + ']').attr('style', style);
                    $('#ns-main img[alt=' + animationData[i-1].name + ']').removeClass('hurueru');
                  })
                })
              });
            }
          }
          else {
            moveAnimation(i+1);
          }
        }
    });
  }

}
;
//mainファイル

//他のファイルが読み込まれてからこのファイルを読み込む
$.when(
  $.ready,
  $.getScript("/assets/simuDec.js"),
  $.getScript("/assets/simuFunc.js"),
).then(function(){
  /*
   * ネットワークシミュレータのプログラム
   * メインのコードを書いている
   *
   * do: 最低限の動作を作成完了
   *     データを渡すアルゴリズムがまだ最低限の仕様なので、改良予定
   *
   * bg: 勝手に線が消える (時間を置くと消える･･･? しかも消えた線が勝手に復活する･･･ 原因不明 Canvasの仕様?)(中)
   *
   *primaryコード
   *0→中継ノード
   *1→ルーター
   *2→クライアント
   *3→サーバー
   全部jsonではきだす
   プロセス間通信
   ルーティングテーブル

   文字列を入れる

   12月まで
   １問題選択
   問題選択画面を出す（データベースに問題番号送信）
   正解した問題には目印をつける（問題を開いたときに取得）
   ２回答
   回答データ送信
   ３終了
   点数出力（？）
   ロールについて
   ページ開いたとき前回の成績を反映
   終了ボタンを押したときに成績を表示・
   node-if-lan
   divを追加する時
   ・main-canvasに追加する場合 -> x +
   */

    //初期位置に戻す
    $('html').scrollTop(0);
    $('html').scrollLeft(0);



  // 関数の定義


  //ns-nav Fnction

  // 全要素の削除
  fnAllReset = function() {
    // 変数のリセット
    NS.pcNode  = 0;
    NS.swNode  = 0;
    NS.svNode  = 0;
    NS.ruNode  = 0;
    NS.lanNode = 0;
    // コンソールとトポロジーの文字を削除
    $("#ns-right dl").html("");
    $("#ns-console").html("");
    // lanLinkがある時
    if($("#ns-main .ui-draggable").hasClass("lanLink")) {
      $("#ns-main").off("mousedown", fnLanMoveDown);
      $("#ns-main").off("mouseup", fnLanMoveUp);
      $("html").off("mouseup", fnLanMoveOutUp);
    }
    // 画像と線の削除
    $("#ns-main img").remove();
    $('.bus').remove();
    $('#ns-main-canvas').removeClass();
    $('#ns-main-canvas').attr('data-buslan', '');
    NS.mainCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);
  }

  // パケット画像の変更
  fnPacketChenge = function(set1, set2, set3) {
    if($("#"+ set1 +"-packet").attr("src") === "/assets/"+ set1 +"_1.png") {
      $("#"+ set1 +"-packet").attr("src", "/assets/"+ set1 +"_2.png");
      if($("#"+ set2 +"-packet").attr("src") === "/assets/"+ set2 +"_2.png") {
        $("#"+ set2 +"-packet").attr("src", "/assets/"+ set2 +"_1.png");
      }
      else if($("#"+ set3 +"-packet").attr("src") === "/assets/"+ set3 +"_2.png") {
        $("#"+ set3 +"-packet").attr("src", "/assets/"+ set3 +"_1.png");
      }
    }
    else {
      $("#"+ set1 +"-packet").attr("src", "/assets/"+ set1 +"_1.png");
    }
  }

  // パケットの追加
  fnPacketAdd = function() {
    var elthis = $(this);
    // get-nodeを付加する処理
    if($("#get-packet").attr("src") === "/assets/get_2.png") {
      // get-nodeがあるとき
      if(elthis.hasClass("get-node")) { }
      // send-nodeがあるとき
      else if(elthis.hasClass("send-node")) {
        elthis.removeClass("send-node");
        elthis.prev().remove();
        fnSetBadge(this, "get-node");
      }
      // get-node と send-nodeがないとき
      else {
        fnSetBadge(this, "get-node");
      }
    }
    // send-nodeを付加する処理
    else if($("#send-packet").attr("src") === "/assets/send_2.png") {
      // get-nodeがあるとき
      if(elthis.hasClass("get-node")) {
        $(".send-node").prev().remove();
        $("#ns-main img").removeClass("send-node");
        elthis.removeClass("get-node");
        elthis.prev().remove();
        fnSetBadge(this, "send-node");
      }
      // send-nodeがあるとき
      else if(elthis.hasClass("send-node")) { }
      // get-node と send-nodeがないとき
      else {
        $(".send-node").prev().remove();
        $("#ns-main img").removeClass("send-node");
        fnSetBadge(this, "send-node");
      }
    }
    // nodeをリセットする処理
    else if($("#reset-packet").attr("src") === "/assets/reset_2.png") {
      if(elthis.hasClass("get-node") || elthis.hasClass("send-node")) {
        elthis.prev().remove();
        elthis.removeClass("get-node");
        elthis.removeClass("send-node");
      }
    }
  }

  // GlayLayerを表示 (New)
  fnGlayOpen = function() {
    // glayLayerのフラグを true にする
    NS.bGlayFladg = true;
    // ID glayLayerの座標と大きさの指定
    $("#glayLayer").css({
      display: 'block',
    });
    $("#glayLayer").animate({
      top:    $("#ns-container").offset().top,
      left:   $("#ns-container").offset().left,
      height: $("#ns-container").height() - 4,
      width:  $("#ns-container").width() - 4,
    }, 500);
  }

  // 左矢印ボタンが押されたとき
  fnGlayInfoLeft = function() {
    $("#slideUl:not(:animated)")
    .css("margin-left", -1*$("#slideUl li").width())
    .prepend($("#slideUl li:last-child"))
    .animate({
      "margin-left" : 0
    }, function(){ });
  }

  // 右矢印ボタンが押されたとき
  fnGlayInfoRight = function() {
    $("#slideUl:not(:animated)").animate({
      "margin-left" : -1*$("#slideUl li").width()
    }, function(){
      $("#slideUl").css("margin-left", "0");
      $("#slideUl").append($("#slideUl li:first-child"));
    });
  }

  // 問題のタイトルを押されたとき (Update)
  fnGlayStudyTitleInfo = function() {
    $("#studyLeftTitle").text($(this).text());
  }

  // 閉じるボタンが押されたとき (Update)
  fnAllGlayClose = function() {
    // 変数のリセット
    NS.bGlayFladg = false;
    // イベントハンドラの削除
    $("#infoLeft").off('click', fnGlayInfoLeft);
    $("#infoRight").off('click', fnGlayInfoRight);
    $("#glayClose").off('click', fnAllGlayClose);
    $("#studyMenuButtonIn").off('click', fnGlayStudyInput);
    $("#studyMenuButtonOut").off('click', fnGlayStudyOutput);
    // GlayLayerを設定
    $("#glayLayer").css({'display':'none','height':0});
    $("#glayLayer").empty();
  }

  fnQuestionSelectClose = function() {
    // イベントハンドラの削除
    //$("#questionClose").off('click', fnAllGlayClose);
    // GlayLayerを設定
    $("#questionLayer").css({'display':'none','height':0});
    $("#questionLayer").empty();
    // $("#check").on('click', NS.IndicateNodeInfo);
    // $("#study").on('click', fnstudy);
    // $("#save").on('click', fnsave);
    // $("#load").on('click', fnload);
    // $("#quit").on('click', fnquit);
  }

  //lanボタンが押された時
  NS.changeLanMode = function () {
    fnAllGlayClose();
    fnQuestionSelectClose();
    var elHtml     = $("html");
    var elMain     = $("#ns-main");
    var elMainDrag = $("#ns-main .ui-draggable");
    // OFFのとき
    if($('#lan').attr("src") === "/assets/lanCable.png") {
      // 画像を ONに変更
      $('#lan').attr("src", "/assets/lanCable_2.png");
      // イベントハンドラーを付ける
      elMain.on("mousedown", fnLanDown);
      elMain.on("mouseup", fnLanUp);
      elHtml.on("mouseup", fnLanOutUp);
      // elMain.on("mousedown", fnBusDown);
      // elMain.on("mouseup", fnBusUp);
      // elHtml.on("mouseup", fnBusOutUp);
      // lanLinkがある時
      if(elMainDrag.hasClass("lanLink")) {
        elMain.off("mousedown", fnLanMoveDown);
        elMain.off("mouseup", fnLanMoveUp);
        elHtml.off("mouseup", fnLanMoveOutUp);
      //   elMain.off("mousedown", fnBusMoveDown);
      //   elMain.off("mouseup", fnBusMoveUp);
      //   elHtml.off("mouseup", fnBusMoveOutUp);
      }
      // カーソルの変更
      elMain.css("cursor", "crosshair");
      elMainDrag.css("cursor", "crosshair");
      // 画像のドラッグ防止
      elMainDrag.mouseup(function(e) { e.preventDefault(); });
      elMainDrag.mousedown(function(e) { e.preventDefault(); });
      // 画像にマウスが乗った時の動作
      elMainDrag.mouseenter(function(){
        // フラグの設定
        NS.lanFlag = true;
        $(this).addClass("lanOn");
        $(this).draggable("disable");
      }).mouseleave(function(){
        // フラグの設定
        NS.lanFlag = false;
        $(this).removeClass("lanOn");
        $(this).draggable("enable");
      });
      //busをoffにする
      $('#bus').prop('checked',false);
      $("#ns-main").off("mousedown", fnBusDown);
      $("#ns-main").off("mouseup", fnBusUp);
      $("html").off("mouseup", fnBusOutUp);
      $("input[name=busSwitch]").removeClass('busOn');
    }
    // ONのとき
    else if($('#lan').attr("src") === "/assets/lanCable_2.png") {
      // 画像を OFFに変更
      $('#lan').attr("src", "/assets/lanCable.png");
      // イベントハンドラーの削除
      elMain.off("mousedown", fnLanDown);
      elMain.off("mouseup", fnLanUp);
      elHtml.off("mouseup", fnLanOutUp);
      elMainDrag.off("mouseenter").off("mouseleave");
      // カーソルの変更
      elMain.css("cursor", "auto");
      elMainDrag.css("cursor", "pointer");
      // lanLinkがある時
      if(elMainDrag.hasClass("lanLink")) {
        elMain.on("mousedown", fnLanMoveDown);
        elMain.on("mouseup", fnLanMoveUp);
        elHtml.on("mouseup", fnLanMoveOutUp);
      }
    }
  }

  //トポロジーを再構成
  fnReconstructionTopology = function (Qdata) {


    $('#ns-main-canvas').attr('class', Qdata.lanInfo);
    $('#ns-main-canvas').attr('data-buslan', Qdata.busInfo);
    // 座標を計算する（winsow.offsetはスクロールしたときの座標を加味している）
    var positionX = NS.mainCanvasX;	// 要素のX座標
    var positionY = NS.mainCanvasY;	// 要素のY座標

    //main-canvasにnode出力
    for(i = 0; i < Qdata.nodeInfo.length; i++){
      //positionX += positionX / 105; //X軸位置調整
      //positionY += positionY / 58;  //Y軸位置調整
      var style_positionX = positionX + Qdata.nodeInfo[i].x;
      var style_positionY = positionY + Qdata.nodeInfo[i].y;

      if (Qdata.nodeInfo[i].name.substr(0,2) === 'PC') {
        NS.pcNode++;
        $('#ns-main').append(
          $('<img>').attr({
            src: "/assets/pc.png",
            alt: Qdata.nodeInfo[i].name,
            class: Qdata.nodeInfo[i].class,
            style: 'position: absolute; top: ' + style_positionY + 'px; left: ' + style_positionX + 'px;',
            'data-ifnum': Qdata.nodeInfo[i].ifnum,
            'data-lan-if': Qdata.nodeInfo[i].lanif,
            'data-linknum': Qdata.nodeInfo[i].linknum,
            'data-routingtablenum': Qdata.nodeInfo[i].routingtablenum,
            'oncontextmenu': 'return fncontextmenu(this)'
          }));

        $('#ns-right dl').append('<dt><img src= /assets/plus.jpg> <span>' + Qdata.nodeInfo[i].name + '</span></dt>' +
        '<dd><p class="rightInfo-IPSM">IP-0: <span id="rightInfo-IP' + Qdata.nodeInfo[i].name.slice(2) + '">' + Qdata.nodeInfo[i].ip + '</span> /<span id="rightInfo-SM' + Qdata.nodeInfo[i].name.slice(2) + '">' + Qdata.nodeInfo[i].sm + '</span></p>' +
        '<p class="rightInfo-routingtable-IPSM"><span id="rightInfo-PCroutingtable-IP' + Qdata.nodeInfo[i].name.slice(2) + '_0">' + Qdata.nodeInfo[i].routingtable[0].ip + '</span>/' +
        '<span id="rightInfo-PCroutingtable-SM' + Qdata.nodeInfo[i].name.slice(2) + '_0">' + Qdata.nodeInfo[i].routingtable[0].sm + '</span><br>→' +
        '<span id="rightInfo-PCroutingtable-NHA' + Qdata.nodeInfo[i].name.slice(2) + '_0">' + Qdata.nodeInfo[i].routingtable[0].nha + '</span>：IF' +
        '<span id="rightInfo-PCroutingtable-IF' + Qdata.nodeInfo[i].name.slice(2) + '_0">' + Qdata.nodeInfo[i].routingtable[0].if + '</span></p></dd>');

        //readolyクラスをつける
        // for(j = 0; j  < Qdata.nodeInfo[i].readonly.length; j++){
        //   $('#ns-main img:last-child').addClass(Qdata.data[i].readonly[j]);
        // }

      }
      else if (Qdata.nodeInfo[i].name.substr(0,6) === 'Router'){
        NS.ruNode++;
        $('#ns-main').append(
          $('<img>').attr({
            src: "/assets/router.png",
            alt: Qdata.nodeInfo[i].name,
            class: Qdata.nodeInfo[i].class,
            style: 'position: absolute; top: ' + style_positionY + 'px; left: ' + style_positionX + 'px;',
            'data-ifnum': Qdata.nodeInfo[i].ifnum,
            'data-lan-if': Qdata.nodeInfo[i].lanif,
            'data-linknum': Qdata.nodeInfo[i].linknum,
            'data-routingtablenum': Qdata.nodeInfo[i].routingtablenum,
            'oncontextmenu': 'return fncontextmenu(this)'
          }));

        $('#ns-right dl').append('<dt style=""><img src="/assets/plus.jpg"><span>' + Qdata.nodeInfo[i].name + '</span></dt><dd></dd>');


        $('#ns-right dl dd:last-child').append('<div class="rightInfo-IPSM"></div>');
        for(j=0; j < Qdata.nodeInfo[i].ip.length; j++){
          $('#ns-right dl dd:last-child').append('<p class="rightInfo-IPSM"><span id="' + j + '"class="num">IP-' + j + '</span>: <span id="rightInfo-IP' + Qdata.nodeInfo[i].name.slice(6) + '_' + j + '">' + Qdata.nodeInfo[i].ip[j] + '</span>' +
          '/<span id="rightInfo-SM' + Qdata.nodeInfo[i].name.slice(6) + '_' + j +'">' + Qdata.nodeInfo[i].sm[j] + '</span></p>');
        }

        for(j=0; j < Qdata.nodeInfo[i].routingtable.length; j++){
          $('#ns-right dl dd:last-child').append('<p class="rightInfo-routingtable-IPSM"><span id="rightInfo-routingtable-IP' + Qdata.nodeInfo[i].name.slice(6) + '_' + j + '">' + Qdata.nodeInfo[i].routingtable[j].ip + '</span>' +
          '/<span id="rightInfo-routingtable-SM' + Qdata.nodeInfo[i].name.slice(6) + '_' + j + '">' + Qdata.nodeInfo[i].routingtable[j].sm + '</span>' +
          '<br>→<span id="rightInfo-routingtable-NHA' + Qdata.nodeInfo[i].name.slice(6) + '_' + j + '">' + Qdata.nodeInfo[i].routingtable[j].nha + '</span>' +
          '：IF<span id="rightInfo-routingtable-IF' + Qdata.nodeInfo[i].name.slice(6) + '_' + j + '">' + Qdata.nodeInfo[i].routingtable[j].if + '</span></p></dd>');
        }



        //readolyクラスをつける
        // for(j=0; j  < Qdata.lanInfo[i].readonly.length; j++){
        //   $('#ns-main img:last-child').addClass(Qdata.data[i].readonly[j]);
        // }


      }
      else {
        $('#ns-main').append(
          $('<div>').attr({
            alt: Qdata.nodeInfo[i].name,
            class: Qdata.nodeInfo[i].class,
            style: 'position: absolute; top: ' + style_positionY + 'px; left: ' + style_positionX + 'px;  width: ' + Qdata.nodeInfo[i].width + 'px; height: ' + Qdata.nodeInfo[i].height + 'px;'
          }));
      }

      //ns-rightの情報を隠す
      $("#ns-right dd:last").css("display","none");

      //画像をドラッグできるようにする
      $("#ns-main img:last-child").draggable({
        containment: 'parent',
        zIndex: 2,
        // ドラッグ中
        drag: function(){
          if($(this).prev().hasClass("get-node2") || $(this).prev().hasClass("send-node2")){
            $(this).prev().offset({
              top:  this.offsetTop - 15,
              left: this.offsetLeft + 42,
            });
            $(this).prev().css('zIndex', 3);
          }
        },
        // // ドラッグ終了
        stop: function(){
          if($(this).prev().hasClass("get-node2") || $(this).prev().hasClass("send-node2")){
            $(this).prev().css('zIndex', 1);
          }
        },
      });


      //実際に配置されたときの配置を取得（slice()でpxを削除）
      // Qdata.nodeInfo[i].positionX = $('#ns-main img:last-child')[0].style.left.slice(0, -2);
      // Qdata.nodeInfo[i].positionY = $('#ns-main img:last-child')[0].style.top.slice(0, -2);
    }

    fnDraw();

    //ns-rightの情報を隠す
    $("#ns-right dd:last").css("display","none");

    //イベントハンドラを付けるためにLanModeを切り替える（2回切り替えて元に戻している）（改良して）
    NS.changeLanMode();
    NS.changeLanMode();
  }

  //問題を選択
  fnstudySelect = function () {

    //タイトルを取得
    NS.question_id = $(this).attr('data-qid');


    $.ajax({
      type: 'POST',
      dataType: 'text',
      url: '/assets/sample2.json',
      //url: 'NewNetworkSimulator/php/collect_questions.php',
      data:{question_id : NS.question_id, id : NS.urlparameter}
    }).done(function(data) {

      //取得したJSONをオブジェクトに戻す
      var Qdata = JSON.parse(data);
      //問題文を表示
      questiontext.txt.value = Qdata.text;
      //問題番号を表示
      $("#question span").html(Qdata.id);
      // 要素の全削除
      fnAllReset();
      $("#ns-console").append("<p>> 問題を取得しました </p>");
      //トポロジーを再現
      fnReconstructionTopology(Qdata);


    }).fail(function(XMLHttpRequest, textStatus) {
      $("#ns-console").append("<p>> エラーが発生しました</p>");
    }).always(function(){
      fnQuestionSelectClose();
      // イベントハンドラの追加と削除
      $("#questionClose").off('click', fnQuestionSelectClose);
      $("#studySelect").off('click', fnstudySelect);
      $(".qusetion-select-button").off('click', fnstudySelect);
      // $("#check").on('click', NS.IndicateNodeInfo);
      // $("#study").on('click', fnstudy);
      // $("#save").on('click', fnsave);
      // $("#load").on('click', fnload);
      // $("#quit").on('click', fnquit);
    });
  }

  //トポロジーをロード
  fnloadSelect = function () {
    //タイトル取得
    // var studyTitleValue = $("#studySelectTitle").val();

    NS.question_id = $(this).attr('data-qid');

    $.ajax({
      type: 'POST',
      dataType: 'text',
      url: '/assets/sample2.json',
      //moodleで動かす場合は上をコメントアウトして下を使う
      //url: 'NewNetworkSimulator/fntemporary_load.php',
      data:{question_id : NS.question_id, id : NS.urlparameter}
    }).done(function(data) {

      //取得したJSONをオブジェクトに戻す
      var Qdata = JSON.parse(data);
      //問題文を表示
      questiontext.txt.value = Qdata.text;
      //問題番号を表示
      $("#question span").html(Qdata.id);
      // 要素の全削除
      fnAllReset();
      $("#ns-console").append("<p>>トポロジーを読み込みました</p>");
      //トポロジーを再現
      fnReconstructionTopology(Qdata);

    }).fail(function(XMLHttpRequest, textStatus) {
      $("#ns-console").append("<p>> エラーが発生しました</p>");
    }).always(function(){ fnQuestionSelectClose(); });

  }

  //モードを切り替える
  fnchangeMode = function () {

    //全削除
    fnAllReset();

    //自由描画モードのとき
    if ($(".change_mode").hasClass('draw')) {

      //ns-navに追加
      $("#ns-nav :nth-of-type(8)")
      .after("<div class='tooltip tooltip_study add_nav'><img src='/assets/study.png' id='study' title='練習問題'><span>問題を表示します</span></div>" +
      "<div class='add_height_line' id='add_line'></div>" +
      "<div class='tooltip tooltip_save add_nav'><img src='/assets/save.png' id='save' title='セーブ'><span>現在のネットワーク構成を保存します</span></div>" +
      "<div class='add_height_line' id='add_line'></div>" +
      "<div class='tooltip tooltip_load add_nav'><img src='/assets/load.png' id='load' title='ロード'><span>セーブした問題のネットワーク構成を復元します</span></div>" +
      "<div class='add_height_line add_nav' id='add_line'></div>" +
      "<div class='tooltip tooltip_quit add_nav'><img src='/assets/quit.png' id='quit' title='終了'><span>問題演習を終了します</span></div>" +
      "<div class='add_height_line' id='line'></div>");

      //イベントハンドラを付ける
      $("#study").on('click', fnstudy);
      $("#save").on('click', fnsave);
      $("#load").on('click', fnload);
      $("#quit").on('click', fnquit);

      //dustのイベントハンドラを削除
      $("#dust").attr("src", "/assets/dust2.png");
      $("#dust").off('click', fnAllReset);

      //ns-leftのイベントハンドラを削除
      // $('.machinery').draggable('destroy')
      // $('.tgl').prop('disabled', true);
      // $('#lan').off();

      //問題を出力する場所を生成
      $("#ns-all").after("<div id='question'>問題：<span></span><form id='questiontext'>" +
      "<textarea name='txt' rows='3' cols='146' readonly></textarea></form></div>");

    }
    else if ($(".change_mode").hasClass('question')) {

      //追加したnavを削除
      $("#study").remove();
      $("#save").remove();
      $("#load").remove();
      $("#quit").remove();
      $(".add_height_line").remove();
      $("#question").remove();
      //dustにイベントハンドラを付ける
      $("#dust").attr("src", "/assets/dust.png");
      $("#dust").on('click', fnAllReset);
      // // machineryをドラッグ
      // $(".machinery").draggable({
      //   helper: 'clone',  // 要素を複製する
      //   revert: true,     // ドラッグ終了時に要素に戻る
      //   zIndex: 3,
      //   // ドラッグ開始
      //   start: function(e, ui) { $(this).addClass('dragout'); },
      //   // ドラッグ終了
      //   stop: function(e, ui) { $(this).removeClass('dragout'); },
      // });
      // // lanをクリック
      // $("#lan").click(function(){
      //   NS.changeLanMode();
      // });
      // // LANのスター型とバス型をクリック
      // $('.tgl').prop('disabled', false);


      fnQuestionSelectClose();
    }
  }

  //studyをクリック（問題一覧を表示）
  fnstudy = function () {
    studyTitleValue = 0;
    $.ajax({
      type: 'POST',
      dataType: 'text',
      url: '/assets/ques.json',
      // url: 'NewNetworkSimulator/php/collect_questions_title.php',
      data:{question_id :$('#question span').innerHTML, id : NS.urlparameter}
    }).done(function(data) {

      fnQuestionSelectClose();

      //取得したJSONをオブジェクトに戻す
      Qdata = JSON.parse(data);
      console.log(Qdata);


      // questionLayerを表示
      $("#questionLayer").css({
        display: 'block',
      });
      $("#questionLayer").animate({
        top:    $("#ns-main").offset().top,
        left:   $("#ns-main").offset().left,
        height: $("#ns-main").height(),
        width:  $("#ns-main").width(),
      },500);

      $("#questionLayer").append('<img src="/assets/batu.png" id="questionClose">'+
          '<div id="glayStudyMenu">'+
          '<div id="studyMenuOutput">'+
          '</div>'+
          '</div>'
        );

      $('#questionLayer').append('<div class="points" align="center">練習問題</div>');

      $('#studyMenuOutput').append('<div id="item-list"><ul></ul></div>');

      for(i=0; i < Qdata.length; i++){
        $('#studyMenuOutput #item-list ul').append('<button class="qusetion-select-button tr' + Qdata[i].grade + '" data-qid="' + Qdata[i].id + '"><p class="questiontext">' + Qdata[i].title + '</p></button>');
      }



    }).fail(function(XMLHttpRequest, textStatus) {
      $("#ns-console").append("<p>> エラーが発生しました</p>");
    }).always(function(){
      // イベントハンドラの追加と削除
      $("#questionClose").on('click', fnQuestionSelectClose);
      $("#studySelect").on('click', fnstudySelect);
      $(".qusetion-select-button").on('click', fnstudySelect);
      // $("#check").off('click', NS.IndicateNodeInfo);
      // $("#study").off('click', fnstudy);
      // $("#save").off('click', fnsave);
      // $("#load").off('click', fnload);
      // $("#quit").off('click', fnquit);
    });
  }

  //ここから
  //saveをクリック 解読するならここからがオススメ
  fnsave = function () {
    if ( typeof NSFCSA === "undefined" ) var NSFCSA = {};

      router = [];          //routerの構造体配列
      pc = [];              //pcの構造体配列
      bus = [];
      save = new Object();
      save.nodeInfo = [];
      save.pair = [];

      //コンストラクタのようなもの
      function router_const(){
        this.name = '';
        this.ip = [];
        this.sm = [];
        this.destinationRoute = [];
        this.if = [];
        this.lanLink = '';
        this.x = '';
        this.y = '';
        this.readonly = [];
      }

      function pc_const(){
        this.name = '';
        this.ip = '';
        this.sm = '';
        this.lanLink = '';
        this.x = '';
        this.y = '';
        this.readonly = [];
      }

      function bus_const() {
        this.name = '';
        this.x = '';
        this.y = '';
        this.width = '';
        this.height = '';
        this.class = '';
      }

    //lanLinkがあるとき
    if ($('#ns-main img').hasClass('lanLink')) {


      //Routerのname
      $('#ns-right dt:contains("Router") span:nth-of-type(1)').each(function(i, e){
        router[i] = new router_const();
        router[i].name = $(e).text();
      });

      //ip&sm
      for(i=0; i < router.length; i++){
        count = 0;
        $('#ns-right dt:contains("' + router[i].name + '") + dd p[class="rightInfo-IPSM"] span').each(function(j, e) {
          console.log(e);
          if (j % 3 == 1) {
            router[i].ip[count] = $(e).text();
          }
          else if (j % 3 == 2) {
            router[i].sm[count] = $(e).text();
            count++;
          }
        });
      }

      //ルーティングテーブルの数だけ生成
      for(i=0; i < router.length; i++){
        router[i].routingtable = [];
        count = 0;
        router[i].routingtable[count] = new Object();
        $('#ns-right dt:contains("' + router[i].name + '") + dd .rightInfo-routingtable-IPSM span').each(function (j, e) {
          if (j % 4 == 0) {
            router[i].routingtable[count].ip = e.textContent;
          }
          else if (j % 4 == 1) {
            router[i].routingtable[count].sm = e.textContent;
          }
          else if (j % 4 == 2) {
            router[i].routingtable[count].nha = e.textContent;
          }
          else {
            router[i].routingtable[count].if = e.textContent;
            count += 1;
            router[i].routingtable[count] = new Object();
          }
        });
        router[i].routingtable.pop();
      }

      //imgの情報
      for(i=0; i < router.length; i++){
        $('#ns-main img[alt="' + router[i].name + '"]').each(function (j, e) {
          router[i].class = $(e).attr('class');
          router[i].ifnum = $(e).attr('data-ifnum');
          router[i].lanif = $(e).attr('data-lan-if');
          router[i].linknum = $(e).attr('data-linknum');
          router[i].routingtablenum = $(e).attr('data-routingtablenum');
        });
      }


      //pcのname, ip, smを取得
      $("#ns-right dt:contains('PC') span:nth-of-type(1)").each(function(i, e){
        pc[i] = new pc_const();
        pc[i].name = $(e).text();
        //All_PC_node++;
      });

      $("#ns-right dt:contains('PC') + dd p:nth-of-type(1) span:nth-of-type(1)").each(function(i, e) {
        pc[i].ip = $(e).text();
      });

      $("#ns-right dt:contains('PC') + dd p:nth-of-type(1) span:nth-of-type(2)").each(function(i, e) {
        pc[i].sm = $(e).text();
      });

      //ルーティングテーブル
      for(i=0; i < pc.length; i++){
        pc[i].routingtable = [];
        count = 0;
        pc[i].routingtable[count] = new Object();
        $('#ns-right dt:contains("' + pc[i].name + '") + dd .rightInfo-routingtable-IPSM span').each(function (j, e) {
          if (j % 4 == 0) {
            pc[i].routingtable[count].ip = e.textContent;
          }
          else if (j % 4 == 1) {
            pc[i].routingtable[count].sm = e.textContent;
          }
          else if (j % 4 == 2) {
            pc[i].routingtable[count].nha = e.textContent;
          }
          else {
            pc[i].routingtable[count].if = e.textContent;
            count += 1;
            pc[i].routingtable[count] = new Object();
          }
        });
        pc[i].routingtable.pop();
      }

      //imgの情報
      for(i=0; i < pc.length; i++){
        $('#ns-main img[alt="' + pc[i].name + '"]').each(function (j, e) {
          pc[i].class = $(e).attr('class');
          pc[i].ifnum = $(e).attr('data-ifnum');
          pc[i].lanif = $(e).attr('data-lan-if');
          pc[i].linknum = $(e).attr('data-linknum');
          pc[i].routingtablenum = $(e).attr('data-routingtablenum');
        });
      }

      //busの情報
      $('#ns-main .bus').each(function (i, e) {
        bus[i] = new bus_const();
        bus[i].name = $(e).attr('alt');
        bus[i].class = $(e).attr('class')
        bus[i].x = e.style.left.replace("px", "") - NS.mainCanvasX;
        bus[i].y = e.style.top.replace("px", "") - NS.mainCanvasY;
        bus[i].width = e.style.width.replace("px", "");
        bus[i].height = e.style.height.replace("px", "");
      });

      //座標を取得
      $("#ns-main img").each(function(i, e) {
        for(j = 0, count = 0; j < router.length; j++){
          if (router[j].name === e.alt) {
            router[j].x = e.style.left.replace("px", "") - NS.mainCanvasX;
            router[j].y = e.style.top.replace("px", "") - NS.mainCanvasY;

            if ($(e).hasClass('RO_sp1')) {
              router[j].readonly[count] = 'RO_sp1';
              count++;
            }

            if ($(e).hasClass('RO_sp2')) {
              router[j].readonly[count] = 'RO_sp2';
              count++;
            }

            if ($(e).hasClass('RO_sm1')) {
              router[j].readonly[count] = 'RO_sm1';
              count++;
            }

            if ($(e).hasClass('RO_sm2')) {
              router[j].readonly[count] = 'RO_sm2';
              count++;
            }
          }
        }
        for(j = 0, count = 0; j < pc.length; j++){
          if (pc[j].name === e.alt) {
            pc[j].x = e.style.left.replace("px", "") - NS.mainCanvasX;
            pc[j].y = e.style.top.replace("px", "") - NS.mainCanvasY;

            //readonlyのセーブデータ
            if ($(e).hasClass('RO_sp1')) {
              pc[j].readonly[count] = 'RO_sp1';
              count++;
            }

            if ($(e).hasClass('RO_sm1')) {
              pc[j].readonly[count] = 'RO_sm1';
              count++;
            }
          }
        }
      });

      console.log(router);


      //saveDataを作成
      save.id = $("#question span")[0].textContent;
      save.text = questiontext.txt.value;

      //PCのセーブデータを作成
      for(i = 0; i < pc.length; i++){
        save.nodeInfo[i] = new Object();
        save.nodeInfo[i] = pc[i];
        // save.data[i].name = pc[i].name;
        // save.data[i].ip = pc[i].ip;
        // save.data[i].sm = pc[i].sm;
        // save.data[i].coordinateX = pc[i].x;
        // save.data[i].coordinateY = pc[i].y;
        // save.data[i].readonly = pc[i].readonly;
      }

      //Routerのセーブデータを作成
      for(i = pc.length, j = 0; i < pc.length + router.length; i++, j++){
        save.nodeInfo[i] = new Object();
        save.nodeInfo[i] = router[j];
        // save.data[i].name = router[j].name;
        // save.data[i].coordinateX = router[j].x;
        // save.data[i].coordinateY = router[j].y;
        // save.data[i].readonly = router[j].readonly;
        // save.data[i].ip = [];
        // save.data[i].sm = [];
        //
        // for(k=0; k < router[j].ip.length; k++){
        //   save.data[i].ip[k] = router[j].ip[k];
        //   save.data[i].sm[k] = router[j].sm[k];
        // }
        //
        // save.data[i].routingtable = [];
        // for(k=0; k < router[j].routingtable.length; k++){
        //   save.data[i].routingtable[k] = new Object();
        //   save.data[i].routingtable[k].if = router[j].routingtable[k].if;
        //   save.data[i].routingtable[k].ip = router[j].routingtable[k].ip;
        //   save.data[i].routingtable[k].sm = router[j].routingtable[k].sm;
        //   save.data[i].routingtable[k].nha = router[j].routingtable[k].nha;
        // }
      }

      //busのセーブデータ作成
      for(i=pc.length+router.length, j=0; i < pc.length + router.length + bus.length; i++, j++){
        save.nodeInfo[i] = new Object();
        save.nodeInfo[i] = bus[j];
      }


      //lanの情報を取得
      lan_info = $('#ns-main canvas').attr('class');
      save.lanInfo = $('#ns-main canvas').attr('class');
      save.busInfo =  $('#ns-main canvas').attr('data-buslan');


      JsonsaveData = JSON.stringify(save, null, " ");
      console.log(JsonsaveData);



      $.ajax({
        type: 'POST',
        dataType: 'text',
        url: '/assets/save_DB.php',
        // url: 'NewNetworkSimulator/php/save_DB.php',
        data:{postJsonData : JsonsaveData, id : NS.urlparameter, question_id : NS.question_id}
      }).done(function(data) {
        $("#ns-console").append("<p>>ノードの配置を保存しました  </p>");
      }).fail(function(XMLHttpRequest, textStatus) {
        $("#ns-console").append("<p>> エラーが発生しました</p>");
      }).always(function(){});
    }
  }

  //loadをクリック
  fnload = function () {
    $.ajax({
      type: 'POST',
      dataType: 'text',
      url: '/assets/ques.json',
      // url: 'NewNetworkSimulator/php/temporary_load_title.php',
      data:{id : NS.urlparameter}
    }).done(function(data) {


      fnQuestionSelectClose();

      //取得したJSONをオブジェクトに戻す
      Qdata = JSON.parse(data);
      console.log(Qdata);


      // questionLayerを表示
      $("#questionLayer").css({
        display: 'block',
      });
      $("#questionLayer").animate({
        top:    $("#ns-main").offset().top,
        left:   $("#ns-main").offset().left,
        height: $("#ns-main").height(),
        width:  $("#ns-main").width(),
      },500);

      $("#questionLayer").append('<img src="/assets/batu.png" id="questionClose">'+
          '<div id="glayStudyMenu">'+
          '<div id="studyMenuOutput">'+
          '</div>'+
          '</div>'
        );

      $('#studyMenuOutput').append('<div id="item-list"><ul></ul></div>');

      $('#questionLayer').append('<div class="points" align="center">ロード</div>');

      for(i=0; i < Qdata.length; i++){
        $('#studyMenuOutput #item-list ul').append('<button class="qusetion-load-button tr0" data-qid="' + Qdata[i].id + '"><p class="questiontext">' + Qdata[i].title + '</p></button>');
      }


      // イベントハンドラの追加
      $("#questionClose").on('click', fnQuestionSelectClose);
      $("#studySelect").on('click', fnstudySelect);
      $(".qusetion-load-button").on('click', fnloadSelect);
      // $("#study").off('click', fnstudy);
      // $("#save").off('click', fnsave);
      // $("#load").off('click', fnload);
      // $("#quit").off('click', fnquit);
    });
  }

  //quitボタンをクリック
  fnquit = function () {

    fnchangeMode();
    $('#mode_draw').prop('checked', true);
    $('.change_mode').removeClass('question');
    $('.change_mode').addClass('draw');

    $.ajax({
      type: 'POST',
      dataType: 'text',
      url: '/assets/quit.json',
      // url: 'NewNetworkSimulator/php/push_quit.php',
      data:{id : NS.urlparameter}
    }).done(function(Qdata) {

      console.log(Qdata);

      //取得したJSONをオブジェクトに戻す
      Qdata = JSON.parse(Qdata);

      console.log(Qdata);

      // GlayLayerを表示
      // questionLayerを表示
      $("#questionLayer").css({
        display: 'block',
      });
      $("#questionLayer").animate({
        top:    $("#ns-main").offset().top,
        left:   $("#ns-main").offset().left,
        height: $("#ns-main").height(),
        width:  $("#ns-main").width(),
      },500);

      $("#questionLayer").append('<img src="/assets/batu.png" id="questionClose">'+
          '<div id="glayStudyMenu">'+
          '<div id="studyMenuOutput">'+
          '</div>'+
          '</div>'
        );

      $('#questionLayer').append('<div class="points" align="center">points:' + Qdata[0].point + '</div>');

      $('#studyMenuOutput').append('<div id="item-list"><ul></ul></div>');

      for(i=1; i < Qdata.length; i++){
        $('#studyMenuOutput #item-list ul').append('<p class="quitText qtr' + Qdata[i].grade + '">' + Qdata[i].title + '</p>');
      }

      // イベントハンドラの追加
      $("#questionClose").on('click', fnQuestionSelectClose);


    }).fail(function(XMLHttpRequest, textStatus) {
      $("#ns-console").append("<p>> エラーが発生しました</p>");
    }).always(function(){});


  }


  //Nodeの情報を表示
  NS.IndicateNodeInfo = function () {

    var nodes = [];

    //nodeの情報を取得
    for(i = 0, num = 0; i < $("#ns-main img").length; i++){
      element = $("#ns-main img")[i];
      if ($(element).hasClass('send-node2') !== true && $(element).hasClass('get-node2') !== true) {
        nodes[num] = new Object();
        nodes[num].element = element;
        num++;
      }
    }

    for(i = 0; i < nodes.length; i++){
      info_height = 20;
      ddElements = $('#ns-right dt:contains(' + nodes[i].element.alt + ') + dd').clone();
      pElements =  $('#ns-right dt:contains(' + nodes[i].element.alt + ') + dd p').clone();

      if (nodes[i].element.alt.slice(0, 2) == 'PC') {
        info_height = 80;
        info_width = 170;
      }
      else {
        for(j=0; j < pElements.length; j++){
          if (pElements[j].className == 'rightInfo-IPSM') {
            info_height += 20;
          }
          else {
            info_height += 40;
          }
        }
        info_width = 170;
      }
      nodeX = nodes[i].element.x + 35 - NS.mainCanvasX;
      nodeY = nodes[i].element.y + 35 - NS.mainCanvasY;
      rightInfoX = $('#ns-right dt:contains("' + nodes[i].element.alt + '") img')[0].offsetLeft;
      rightInfoY = $('#ns-right dt:contains("' + nodes[i].element.alt + '") img')[0].offsetTop;


      $("#checkLayer").append(
        $('<div>').attr({
          class: 'info',
          style: 'position: absolute; top: ' + nodeY + 'px; left: ' + nodeX + 'px; width:' + info_width + 'px; height:' + info_height + 'px;'

        }));

      $("#checkLayer div:last-child").append("<p>" + nodes[i].element.alt + "</p>");
      $("#checkLayer div:last-child").append(ddElements)

    }
  }

  // ns-main Fnction

  // 画像を追加
  fnMainDrop = function(ui, obj) {
    // 機種の判別
    if(ui.draggable.attr("src") === "/assets/pc.png") {
      NS.dropNodeInt = NS.pcNode;
      NS.dropNodeName = "PC"+ NS.pcNode;
      NS.dropContextName = "context-menu-PC";
      NS.pcNode++;
    }
    else if(ui.draggable.attr("src") === "/assets/router.png") {
      NS.dropNodeInt = NS.ruNode;
      NS.dropNodeName = "Router"+ NS.ruNode;
      NS.dropContextName = "context-menu-Router";
      NS.ruNode++;
    }
    // ns-mainに画像を追加 (clssとstyleの設定の追加)
    $("#ns-main").append(
      $("<img>").attr({
      src: ui.draggable.attr("src"),
      alt: NS.dropNodeName,
      class: NS.dropContextName,
      'data-ifnum': 0,
      'data-lan-if': '',
      'data-routingtablenum':0,
      'data-linknum': 0,
      style: "position: absolute; top: "+ ui.offset.top +"px; left: "+ ui.offset.left +"px",
    }));
    $("#ns-main img:last-child").attr('oncontextmenu', 'return fncontextmenu(this)');
    // ns-mainの画像にdraggableを付ける
    $("#ns-main img:last-child").draggable({
      containment: 'parent',
      zIndex: 2,
      // ドラッグ中
      drag: function(){
        if($(this).prev().hasClass("get-node2") || $(this).prev().hasClass("send-node2")){
          $(this).prev().offset({
            top:  this.offsetTop - 15,
            left: this.offsetLeft + 42,
          });
          $(this).prev().css('zIndex', 3);
        }
      },
      // // ドラッグ終了
      stop: function(){
        if($(this).prev().hasClass("get-node2") || $(this).prev().hasClass("send-node2")){
          $(this).prev().css('zIndex', 1);
        }
      },
    });
    //context-menuに名前を追加
    //$(obj[0].lastChild).data().name = NS.dropNodeName;
    // LANが ONのとき画像を動かなくする
    if($("#lan").attr("src") === "/assets/lanCable_2.png") {
      var elMainImgLast = $("#ns-main img:last-child");
      elMainImgLast.css("cursor", "crosshair");
      elMainImgLast.mouseup(function(e) { e.preventDefault(); });
      elMainImgLast.mousedown(function(e) { e.preventDefault(); });
      elMainImgLast.mouseenter(function(){
        NS.lanFlag = true;
        $(this).addClass("lanOn");
        $(this).draggable("disable");
      }).mouseleave(function(){
        NS.lanFlag = false;
        $(this).removeClass("lanOn");
        $(this).draggable("enable");
      });
    }
    // ns-rightにトポロジを追加
    if(ui.draggable.attr("src") === "/assets/pc.png") {
      $("#ns-right dl").append("<dt><img src= /assets/plus.jpg><span>"+ ui.draggable.attr("alt") + NS.dropNodeInt +"</span></dt>" +
      "<dd><p class='rightInfo-IPSM'>IP-0: <span id='rightInfo-IP" + NS.dropNodeInt + "'></span> /<span id='rightInfo-SM" + NS.dropNodeInt + "'></span></p></dd>");

      $('#ns-right dt:contains("'+ ui.draggable.attr("alt") + NS.dropNodeInt +'") + dd')
      .append('<p class="rightInfo-routingtable-IPSM"><span id="rightInfo-PCroutingtable-IP' + NS.dropNodeInt + '_'  + '0' + '">DefaultGateway</span>/<span id="rightInfo-PCroutingtable-SM' + NS.dropNodeInt + '_'  + '0' +'"></span>' +
      '<br/>→<span id="rightInfo-PCroutingtable-NHA' + NS.dropNodeInt + '_'  + '0' + '"></span>：IF<span id="rightInfo-PCroutingtable-IF' + NS.dropNodeInt + '_'  + '0' + '"></span></p>');
    }
    else if(ui.draggable.attr("src") === "/assets/router.png") {
      $("#ns-right dl").append("<dt><img src= /assets/plus.jpg><span>"+ ui.draggable.attr("alt") + NS.dropNodeInt +"</span></dt><dd><div class='rightInfo-IPSM'></div></dd>");

      $('#ns-right dt:contains("'+ ui.draggable.attr("alt") + NS.dropNodeInt +'") + dd')
      .append('<p class="rightInfo-routingtable-IPSM"><span id="rightInfo-routingtable-IP' + NS.dropNodeInt + '_'  + '0' + '">DefaultGateway</span>/<span id="rightInfo-routingtable-SM' + NS.dropNodeInt + '_'  + '0' +'"></span>' +
      '<br/>→<span id="rightInfo-routingtable-NHA' + NS.dropNodeInt + '_'  + '0' + '"></span>：IF<span id="rightInfo-routingtable-IF' + NS.dropNodeInt + '_'  + '0' + '"></span></p>');
    }
    // dd要素(IPとSM)を隠す
    $("#ns-right dd:last").css("display","none");
    fnNameDraw(ui.draggable.attr('alt') + NS.dropNodeInt);
  }


  // ns-canvas Function

  // マウスのボタンが押されたときに処理を実行する関数
  fnLanDown = function(e) {
    // imgにマウスが乗っているとき
    if(NS.lanFlag && $("#lan").attr("src") === "/assets/lanCable_2.png") {
      // PCに線が引かれているとき
      if($(e.target).attr("src") === "/assets/pc.png" && $(e.target).hasClass("lanLink")) {
        $("#ns-console").append("<p>> PCにLANは1本しか引けません。</p>");
      }
      else {
        // canvasの追加
        NS.addCanvas = $('<canvas width="' + NS.canvasWidth + '" height="' + NS.canvasHeight + '"></canvas>').prependTo('#ns-main');
        NS.lanFlagPoint = true;
        // lanLinkがある場合
        if($(this).children(".lanOn").hasClass("lanLink")) {
          NS.lanFlaglink = true;
        }
        // Classの追加
        $(this).children(".lanOn").addClass("lanFirst lanLink sP_"+ NS.lanNode);
        //$('#ns-main-canvas').addClass("L_"+ NS.lanNode);
        // マウスを押した場所の座標
        NS.points = [{x:e.pageX - this.offsetLeft, y:e.pageY - this.offsetTop}];
        //busから線を引いた時のフラグ
        if ($('.sP_' + NS.lanNode).hasClass('bus')) {
          NS.busFlag = true;
        }
        // 関数 lanDragの呼び出し
        $("#ns-main").on("mousemove", fnLanDrag);
      }
    }
  }

  fnBusDown = function (e) {
    if($('#lan').attr('src') === '/assets/lanCable.png' && $('.mouseover').length == 0 && $('.lanFirst').length == 0 && $('.bus-mouseover').length == 0) {
      NS.points = [];
      NS.addCanvas = $('<canvas width="' + NS.canvasWidth + '" height="' + NS.canvasHeight + '"></canvas>').prependTo('#ns-main');
      $("#ns-main").on("mousemove", fnBusDrag);
      $('#ns-main').on('mouseup', fnBusUp);
      $("html").on("mouseup", fnBusOutUp);
      NS.busDrawFrag = true;
    }
  }

  // マウスが移動したときに処理を実行する関数
  fnLanDrag = function(e) {
    NS.addCtx = NS.addCanvas.get(0).getContext('2d');
    NS.points.push({x:e.pageX - this.offsetLeft, y:e.pageY - this.offsetTop});
    NS.addCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);
    NS.addCtx.beginPath();
    // 線の色の変更
    if(!($(e.target).hasClass("lanFirst")) && $(e.target).hasClass("lanOn")) {
      NS.addCtx.strokeStyle = '#2fb9fe';
    }
    else {
      NS.addCtx.strokeStyle = '#fb9003';
    }
    NS.addCtx.lineWidth = NS.lanWidth;
    NS.addCtx.moveTo(NS.points[0].x, NS.points[0].y);
    NS.addCtx.lineTo(NS.points[NS.points.length - 1].x, NS.points[NS.points.length - 1].y);
    NS.addCtx.stroke();
  }

  fnBusDrag = function (e) {
    NS.addCtx = NS.addCanvas.get(0).getContext('2d');
    NS.points.push({x:e.pageX - this.offsetLeft, y:e.pageY - this.offsetTop});
    NS.addCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);
    NS.addCtx.beginPath();
    NS.addCtx.strokeRect(NS.points[0].x, NS.points[0].y, NS.points[NS.points.length - 1].x - NS.points[0].x, 10);
  }

  // マウスのボタンが離されたときに処理を実行する関数
  fnLanUp = function(e) {
    if(NS.lanFlagPoint && $("#lan").attr("src") === "/assets/lanCable_2.png") {
      NS.lanFlagDelet = true;
      // マウスを押してドラッグしなかったとき || 画像の上に載ってないとき || 最初の画像のとき
      if(NS.points.length === 1 || (NS.lanFlag === false) || $(e.target).hasClass("lanFirst")) {
          if(NS.lanFlaglink === true) {
            $(".sP_"+ NS.lanNode).removeClass("sP_"+ NS.lanNode);
          }
          else {
            $(".sP_"+ NS.lanNode).removeClass("lanLink sP_"+ NS.lanNode);
          }
          $("#ns-main-canvas").removeClass("L_"+ NS.lanNode);
          NS.lanFlagDelet = false;
          NS.lanNode--;
      }
      else if (NS.busFlag == true && $(e.target).hasClass('bus')) {
        $("#ns-console").append("<p>> busとbusは繋げません</p>");
        if(NS.lanFlaglink === true) {
          $(".sP_"+ NS.lanNode).removeClass("sP_"+ NS.lanNode);
        }
        else {
          $(".sP_"+ NS.lanNode).removeClass("lanLink sP_"+ NS.lanNode);
        }
        $("#ns-main-canvas").removeClass("L_"+ NS.lanNode);
        NS.lanFlagDelet = false;
        NS.lanNode--;
      }
      // PCにもう線が引かれているとき
      else if($(e.target).hasClass("lanLink") && $(e.target).attr("src") === "/assets/pc.png") {
        if(NS.lanFlaglink === true) {
          $(".sP_"+ NS.lanNode).removeClass("sP_"+ NS.lanNode);
        }
        else {
          $(".sP_"+ NS.lanNode).removeClass("lanLink sP_"+ NS.lanNode);
        }
        $("#ns-main-canvas").removeClass("L_"+ NS.lanNode);
        $("#ns-console").append("<p>> PCにLANは1本しか引けません。</p>");
        NS.lanFlagDelet = false;
        NS.lanNode--;
      }
      // 同じ場所に線を引かないようにする
      else {
        for(var i = 0; i < NS.lanNode; i++) {
          if(($(".lanFirst").hasClass("sP_"+ i) && $(".lanOn").hasClass("eP_"+ i)) ||
             ($(".lanFirst").hasClass("eP_"+ i) && $(".lanOn").hasClass("sP_"+ i))) {
              $(".sP_"+ NS.lanNode).removeClass("sP_"+ NS.lanNode);
              $("#ns-main-canvas").removeClass("L_"+ NS.lanNode);
              $("#ns-console").append("<p>> 同じ所にLANは引けません。</p>");
              NS.lanFlagDelet = false;
              NS.lanNode--;
              break;
          }
        }
      }

      // 画像の真ん中に線を持ってくる動作アンドモア
      if(!($(e.target).hasClass("lanFirst")) && $(e.target).hasClass("lanOn") && NS.lanFlagDelet) {
        NS.lanArrWidth[NS.lanNode] = NS.lanWidth;
        $(".lanOn").addClass("lanLink eP_"+ NS.lanNode);

        // $('.sP_' + NS.lanNode).addClass('Lan' + NS.lanNode);
        // $('.eP_' + NS.lanNode).addClass('Lan' + NS.lanNode);

        $('#ns-main-canvas').addClass("L_"+ NS.lanNode);
        spifnum =  parseInt($('.sP_' + NS.lanNode).attr('data-ifnum'));
        spifnum += 1;
        epifnum =  parseInt($('.eP_' + NS.lanNode).attr('data-ifnum'));
        epifnum += 1;

        //buslanの追加
        if ($('.sP_' + NS.lanNode).hasClass('bus') ||  $('.eP_' + NS.lanNode).hasClass('bus')){
          if ($('#ns-main-canvas').attr('data-buslan') == undefined) {
            $('#ns-main-canvas').attr('data-buslan', 'B_' + NS.lanNode);
          }
          else {
            tmp = $('#ns-main-canvas').attr('data-buslan');
            tmp += ' ' + 'B_' + NS.lanNode;
            $('#ns-main-canvas').attr('data-buslan', tmp);
          }
        }

        //lanとifの結びつけ
        if ($('.sP_' + NS.lanNode).hasClass('bus') == false) {
          if ($('.sP_' + NS.lanNode).attr('data-lan-if') == '') {
            tmp =  $('.sP_' + NS.lanNode).attr('data-lan-if');
            tmp += NS.lanNode + '-' + $('.sP_' + NS.lanNode).attr('data-ifnum');
            $('.sP_' + NS.lanNode).attr('data-lan-if', tmp);
          }
          else if ($('.sP_' + NS.lanNode).attr('data-lan-if') != '') {
            tmp =  $('.sP_' + NS.lanNode).attr('data-lan-if');
            tmp += ' ';
            tmp += NS.lanNode + '-' + $('.sP_' + NS.lanNode).attr('data-ifnum');
            $('.sP_' + NS.lanNode).attr('data-lan-if', tmp);
          }
          tmp = $('.sP_' + NS.lanNode).attr('data-linknum');
          tmp = parseInt(tmp) + 1;
          $('.sP_' + NS.lanNode).attr('data-linknum', tmp);

        }
        if ($('.eP_' + NS.lanNode).hasClass('bus') == false) {
          if ($('.eP_' + NS.lanNode).attr('data-lan-if') == "") {
            tmp =  $('.eP_' + NS.lanNode).attr('data-lan-if');
            tmp += NS.lanNode + '-' + $('.eP_' + NS.lanNode).attr('data-ifnum');
            $('.eP_' + NS.lanNode).attr('data-lan-if', tmp);
          }
          else if ($('.eP_' + NS.lanNode).attr('data-lan-if') != "") {
            tmp =  $('.eP_' + NS.lanNode).attr('data-lan-if');
            tmp += ' ';
            tmp += NS.lanNode + '-' + $('.eP_' + NS.lanNode).attr('data-ifnum');
            $('.eP_' + NS.lanNode).attr('data-lan-if', tmp);
          }
          tmp = $('.eP_' + NS.lanNode).attr('data-linknum');
          tmp = parseInt(tmp) + 1;
          $('.eP_' + NS.lanNode).attr('data-linknum', tmp);
        }


        //rightinfoに追加
        //router->router
        if ($('.sP_' + NS.lanNode).attr('alt').substr(0, 6) === 'Router' && $('.eP_' + NS.lanNode).attr('alt').substr(0, 6) === 'Router') {

          $('#ns-right dl dt:contains("' + $('.sP_' + NS.lanNode)[0].alt + '") + dd .rightInfo-IPSM:last')
          .after('<p class="rightInfo-IPSM"><span id="' + $('.sP_' + NS.lanNode).attr('data-ifnum') + '" class="num">IP-' + $('.sP_' + NS.lanNode).attr('data-ifnum') + '</span>: <span id="rightInfo-IP' + $('.sP_' + NS.lanNode)[0].alt.slice(6) + '_' + $('.sP_' + NS.lanNode).attr('data-ifnum') + '"></span>/<span id="rightInfo-SM' +
          $('.sP_' + NS.lanNode)[0].alt.slice(6) + '_' + $('.sP_' + NS.lanNode).attr('data-ifnum') + '"></span></p>');
          $('.sP_' + NS.lanNode).attr('data-ifnum',spifnum);

          $('#ns-right dl dt:contains("' + $('.eP_' + NS.lanNode)[0].alt + '") + dd .rightInfo-IPSM:last')
          .after('<p class="rightInfo-IPSM"><span id="' + $('.eP_' + NS.lanNode).attr('data-ifnum') + '" class="num">IP-' + $('.eP_' + NS.lanNode).attr('data-ifnum') + '</span>: <span id="rightInfo-IP' + $('.eP_' + NS.lanNode)[0].alt.slice(6) + '_' + $('.eP_' + NS.lanNode).attr('data-ifnum') + '"></span>/<span id="rightInfo-SM' +
          $('.eP_' + NS.lanNode)[0].alt.slice(6) + '_' + $('.eP_' + NS.lanNode).attr('data-ifnum') + '"></span></p>');
          $('.eP_' + NS.lanNode).attr('data-ifnum', epifnum);

        }

        //pc,bus->router
        if ($('.sP_' + NS.lanNode).attr('alt').substr(0, 6) !== 'Router' && $('.eP_' + NS.lanNode).attr('alt').substr(0, 6) === 'Router') {

          $('#ns-right dl dt:contains("' + $('.eP_' + NS.lanNode)[0].alt + '") + dd .rightInfo-IPSM:last')
          .after('<p class="rightInfo-IPSM"><span id="' + $('.eP_' + NS.lanNode).attr('data-ifnum') + '" class="num">IP-' + $('.eP_' + NS.lanNode).attr('data-ifnum') + '</span>: <span id="rightInfo-IP' + $('.eP_' + NS.lanNode)[0].alt.slice(6) + '_' + $('.eP_' + NS.lanNode).attr('data-ifnum') + '"></span>/<span id="rightInfo-SM' +
          $('.eP_' + NS.lanNode)[0].alt.slice(6) + '_' + $('.eP_' + NS.lanNode).attr('data-ifnum') + '"></span></p>');
          $('.eP_' + NS.lanNode).attr('data-ifnum', epifnum);

        }

        //router->pc,bus
        if ($('.sP_' + NS.lanNode).attr('alt').substr(0, 6) === 'Router' && $('.eP_' + NS.lanNode).attr('alt').substr(0, 6) !== 'Router') {
          $('#ns-right dl dt:contains("' + $('.sP_' + NS.lanNode)[0].alt + '") + dd .rightInfo-IPSM:last')
          .after('<p class="rightInfo-IPSM"><span id="' + $('.sP_' + NS.lanNode).attr('data-ifnum') + '" class="num">IP-' + $('.sP_' + NS.lanNode).attr('data-ifnum') + '</span>: <span id="rightInfo-IP' + $('.sP_' + NS.lanNode)[0].alt.slice(6) + '_' + $('.sP_' + NS.lanNode).attr('data-ifnum') + '"></span>/<span id="rightInfo-SM' +
          $('.sP_' + NS.lanNode)[0].alt.slice(6) + '_' + $('.sP_' + NS.lanNode).attr('data-ifnum') + '"></span></p>');
          $('.sP_' + NS.lanNode).attr('data-ifnum',spifnum);
        }

        //描画
        fnIfDraw();
        fnLanDraw();
      }

      // 変数とフラグを設定
      NS.lanNode++;
      NS.points = [];
      NS.lanFlaglink = false;
      NS.lanFlagPoint = false;
      NS.busFlag = false;
      NS.addCanvas.remove();
      // イベントハンドラの削除
      $("#ns-main").off("mousemove", NS.lanDrag);
      $("#ns-main .ui-draggable").removeClass("lanFirst");
    }
  }

  fnBusUp = function (e) {
    if($('#lan').attr('src') === '/assets/lanCable.png' && $('.mouseover').length == 0) {
      //始点と終点の位置
      if (NS.points[NS.points.length - 1].x - NS.points[0].x > 0) {
        x = NS.points[0].x + NS.mainCanvasX;
        y = NS.points[0].y + NS.mainCanvasY;
        width = NS.points[NS.points.length - 1].x - NS.points[0].x;
      }
      else {
        x = NS.points[NS.points.length - 1].x + NS.mainCanvasX;
        y = NS.points[0].y + NS.mainCanvasY;
        width = NS.points[0].x - NS.points[NS.points.length - 1].x;
      }

      //divを追加
      $('#ns-main').append(
        $('<div>').attr({
          alt: 'bus' + NS.busNode,
          class: 'bus',
          'data-bus': '',
          style: 'position: absolute; top: ' + y + 'px; left: '+  x +'px; width:' + width + 'px; height:10px;',
          'oncontextmenu': 'return busscontextmenu(this)'
        }));

      $('.bus').draggable({
        containment: 'parent',
        scroll: false,
      });

      $('.bus').on('drag', fnLanMoveDrag);

      NS.points = [];
      NS.busNode++;
      NS.addCanvas.remove();
      NS.busDrawFrag = false;
      // イベントハンドラの削除
      $('#ns-main').off('mousemove', fnBusDrag);
      $('#ns-main').off('mouseup', fnBusUp);
    }
  }

  // 線を引いてる途中 ns-main以外でマウスを放した時
  fnLanOutUp = function(e) {
    if(NS.lanFlagPoint) {
      NS.addCanvas.remove();
      if(!(NS.lanFlaglink)) {
        $(".sP_"+ NS.lanNode).removeClass("lanLink");
      }
      $("#ns-main").off("mousemove", fnLanDrag);
      $("#ns-main .ui-draggable").removeClass("lanFirst");
      $(".sP_"+ NS.lanNode).removeClass("sP_"+ NS.lanNode);
      $("#ns-main-canvas").removeClass("L_"+ NS.lanNode);
      // 変数とフラグをリセット
      NS.points = [];
      NS.lanFlaglink = false;
      NS.lanFlagPoint = false;
    }
  }

  fnBusOutUp = function(e) {
    // NS.addCanvas.remove();
    // $("#ns-main").off("mousemove", fnBusDrag);
    // // 変数とフラグをリセット
    // NS.points = [];
  }

  // マウスを押したとき (線を動かす動作)
  fnLanMoveDown = function(e) {
    // if($(e.target).hasClass("lanLink")) {
    //   NS.elLanMoveThis = $(this);
    //   NS.lanFlagMove = true;
    //   NS.lanArrClass = $("#ns-main-canvas").attr("class").split(/\s?L_/);
    //   NS.elLanMoveThis.on("mousemove", fnLanMoveDrag);
    // }
    NS.elLanMoveThis = $(this);
    NS.lanFlagMove = true;
    NS.lanArrClass = $("#ns-main-canvas").attr("class").split(/\s?L_/);
    NS.elLanMoveThis.on("mousemove", fnLanMoveDrag);
  }

  // ドラッグしている時 (線を動かす動作)
  fnLanMoveDrag = function(e) {
    NS.mainCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);
    fnDraw();
  }

  // マウスを放した時 (線を動かす動作)
  fnLanMoveUp = function(e) {
    if(NS.lanFlagMove === true) {
      NS.lanFlagMove = false;
      NS.elLanMoveThis.off("mousemove", fnLanMoveDrag);
    }
  }

  // main以外でマウスを放した時 (線を動かす動作)
  // fnLanMoveOutUp = function(e) {
  //   if(NS.lanFlagMove === true) {
  //     NS.mainCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);
  //     for(var i = 1; i < NS.lanArrClass.length; i++) {
  //       //fnIfDraw(NS.lanArrClass[i]);
  //       fnLanDraw(NS.lanArrClass[i]);
  //      }
  //     NS.lanFlagMove = false;
  //     NS.elLanMoveThis.off("mousemove", fnLanMoveDrag);
  //   }
  // }


  //描画セット
  fnDraw = function () {
    fnIfDraw();
    fnLanDraw();
    fnNameDraw();
  }

  // 線の描画関数 (バス型要改良)
  fnLanDraw = function() {

    if ($('#ns-main-canvas').attr('class') != '') {
      NS.mainCtx.beginPath();
      lanNum = $('#ns-main-canvas').attr('class').split(' ');
      for(i=0; i < lanNum.length; i++){
        lanNum[i] = lanNum[i].slice(2);
      }

      //先にbusにつながっているlan
      if ($('#ns-main-canvas').attr('data-buslan') != undefined) {
        busLanNum = $('#ns-main-canvas').attr('data-buslan').split(' ');
        for(i=0; i < busLanNum.length; i++){
          busLanNum[i] = busLanNum[i].slice(2);
        }
      }
      else {
        busLanNum = '';
      }


      tmp = new Object();

      //busの数だけ描画
      if (busLanNum != '') {
        $('.bus').each(function (i, e){
          bus = new Object();
          bus.element = e;
          bus.x = e.offsetLeft + e.offsetWidth / 2;
          bus.y = e.offsetTop + e.offsetHeight / 2;
          nodes = [];

          //バスがいくつのノードとつながっているか
          for(j=0, count=0; j < busLanNum.length; j++){
            if ($(e).hasClass('sP_' + busLanNum[j])) {
              nodes[count] = new Object();
              nodes[count].element = $('.eP_' + busLanNum[j]);
              nodes[count].x = $('.eP_' + busLanNum[j])[0].x;
              nodes[count].y = $('.eP_' + busLanNum[j])[0].y;
              count++;
              for(k=0; k < lanNum.length; k++){
                if (lanNum[k] == busLanNum[j]) {
                  lanNum.splice(k, 1);
                  k--;
                }
              }
            }
            else if ($(e).hasClass('eP_' + busLanNum[j])) {
              nodes[count] = new Object();
              nodes[count].element = $('.sP_' + busLanNum[j]);
              nodes[count].x = $('.sP_' + busLanNum[j])[0].x;
              nodes[count].y = $('.sP_' + busLanNum[j])[0].y;
              count++;
              for(k=0; k < lanNum.length; k++){
                if (lanNum[k] == busLanNum[j]) {
                  lanNum.splice(k, 1);
                  k--;
                }
              }
            }
          }

          //バスの線より上か下か
          nodeUp = [];
          nodeDown = [];
          for(j=0, upCount=0, downCount=0; j < nodes.length; j++){
            if (bus.y - nodes[j].y >= 0) {
              nodeUp[upCount] = new Object();
              nodeUp[upCount] = nodes[j];
              upCount++;
            }
            else {
              nodeDown[downCount] = new Object();
              nodeDown[downCount] = nodes[j];
              downCount++;
            }
          }

          //右順にノードを並び替える
          for(j=0; j < nodes.length; j++){
            for(k=j+1; k < nodes.length; k++){
              if (nodes[j].x < nodes[k].x) {
                tmp = nodes[j];
                nodes[j] = nodes[k];
                nodes[k] = tmp;
              }
            }
          }

          //縦の線を描画
          for(j=0; j < nodes.length; j++){
            NS.mainCtx.moveTo(nodes[j].x - NS.mainCanvasWidth, nodes[j].y - NS.mainCanvasHeight);
            NS.mainCtx.lineTo(nodes[j].x - NS.mainCanvasWidth, bus.y - NS.mainCanvasY);
            NS.mainCtx.stroke();
          }

          //divを変形させる
          if (nodes.length > 1) {
            $(e).css({
              'left': nodes[nodes.length-1].x,
              'width': nodes[0].x - nodes[nodes.length-1].x + 70,
           });
          }
          else if(nodes.length == 1){
            $(e).css({
              'left': nodes[0].x,
              'width': 70,
           });
          }
        });
      }

      //node-to-nodeの描画
      for(i=0; i < lanNum.length; i++){
        NS.mainCtx.beginPath();
        NS.mainCtx.moveTo($(".sP_"+ lanNum[i])[0].offsetLeft - NS.mainCanvasWidth, $(".sP_"+ lanNum[i])[0].offsetTop - NS.mainCanvasHeight);
        NS.mainCtx.lineTo($(".eP_"+ lanNum[i])[0].offsetLeft - NS.mainCanvasWidth, $(".eP_"+ lanNum[i])[0].offsetTop - NS.mainCanvasHeight);
        NS.mainCtx.stroke();
      }
    }

  }

  //ifをcanvasに描画
  fnIfDraw = function () {

    NS.mainCtx.beginPath();
    ctx = document.getElementById('ns-main-canvas').getContext('2d');

    lanClass =  $('#ns-main-canvas').attr('class').split(/\s?L_/);

    for(lanClassNum=1; lanClassNum < lanClass.length; lanClassNum++){
      lanNum = lanClass[lanClassNum];

      //sPがbusでない
      if ($('.sP_' + lanNum).attr('data-lan-if') != undefined) {
        spSplit = $('.sP_' + lanNum).attr('data-lan-if').split(' ');
        spLanIf = [];
        for(i=0; i < spSplit.length; i++){
          spLanIf[i] = spSplit[i].split('-')
        }
        for(i=0; i < spLanIf.length; i++){
          if (spLanIf[i][0] == lanNum) {
            spIf = 'if' + spLanIf[i][1];
          }
        }
        spX = $('.sP_' + lanNum)[0].style.left.slice(0, -2) - NS.mainCanvasWidth;
        spY = $('.sP_' + lanNum)[0].style.top.slice(0, -2) - NS.mainCanvasHeight;
        spType = $('.sP_' + lanNum).attr('alt').substr(0, 6);
      }
      //sPがbus
      else {
        //busが上
        if ($('.eP_' + lanNum)[0].style.top.slice(0, -2) > $('.sP_' + lanNum)[0].style.top.slice(0, -2)) {
          spX = $('.eP_' + lanNum)[0].style.left.slice(0, -2) - NS.mainCanvasWidth + 25;
          spY = $('.sP_' + lanNum)[0].style.top.slice(0, -2) - NS.mainCanvasHeight;
        }
        //busが下
        else {
          spX = $('.eP_' + lanNum)[0].style.left.slice(0, -2) - NS.mainCanvasWidth + 25;
          spY = $('.sP_' + lanNum)[0].style.top.slice(0, -2) - NS.mainCanvasHeight;
        }
        spIf = ''
      }

      //ePがbusでない
      if ($('.eP_' + lanNum).attr('data-lan-if') != undefined) {
        epSplit = $('.eP_' + lanNum).attr('data-lan-if').split(' ');
        epLanIf = [];
        for(i=0; i < epSplit.length; i++){
          epLanIf[i] = epSplit[i].split('-')
        }
        for(i=0; i < epLanIf.length; i++){
          if (epLanIf[i][0] == lanNum) {
            epIf = 'if' + epLanIf[i][1];
          }
        }
        epX = $('.eP_' + lanNum)[0].style.left.slice(0, -2) - NS.mainCanvasWidth;
        epY = $('.eP_' + lanNum)[0].style.top.slice(0, -2) - NS.mainCanvasHeight;
        epType = $('.eP_' + lanNum).attr('alt').substr(0, 6);
      }
      //ePがbus
      else {
        //busが上
        if ($('.eP_' + lanNum)[0].style.top.slice(0, -2) < $('.sP_' + lanNum)[0].style.top.slice(0, -2)) {
          epX = $('.sP_' + lanNum)[0].style.left.slice(0, -2) - NS.mainCanvasWidth + 25;
          epY = $('.eP_' + lanNum)[0].style.top.slice(0, -2) - NS.mainCanvasHeight;
        }
        //busが下
        else {
          epX = $('.sP_' + lanNum)[0].style.left.slice(0, -2) - NS.mainCanvasWidth + 25;
          epY = $('.eP_' + lanNum)[0].style.top.slice(0, -2) - NS.mainCanvasHeight;
        }
        epIf = ''
      }

      if ($('.sP_' + lanNum).attr('data-lan-if') != undefined) {
        ifDraw(spX, spY, epX, epY, spType, spIf);
      }
      if ($('.eP_' + lanNum).attr('data-lan-if') != undefined) {
        ifDraw(epX, epY, spX, spY, epType, epIf);
      }
    }

    function ifDraw (aX, aY, bX, bY, type, ifname) {
      if (type === 'Router') {
        //楕円と直線の交点を求める
        var s = 50;
        var t = 30;
        var a = (bY-aY) / (bX-aX);
        var x = Math.sqrt((s*s * t*t) / (t*t + a*a * s*s));
        var y = a * x;

        if (bX-aX > 0) {
          x = x + aX;
          y = y + aY;
          ctx.fillText(ifname, x, y, 200);
        }
        else {
          x = aX - x;
          y = aY - y;
          ctx.fillText(ifname, x, y, 200);
        }

      }
      else {
        //円と直線の交点を求める
        var a = (bY-aY) / (bX-aX);
        var r = 50;
        var x = Math.sqrt(r*r / (1+a*a));
        var y = a * x;

        if (bX-aX > 0) {
          x = x + aX;
          y = y + aY;
          ctx.fillText(ifname, x, y, 200);
        }
        else {
          x = aX - x;
          y = aY - y;
          ctx.fillText(ifname, x, y, 200);
        }
      }
    }
  }


  //ノードの名前を表示
  fnNameDraw = function () {
    NS.mainCtx.beginPath();
    ctx = document.getElementById('ns-main-canvas').getContext('2d');
    $('#ns-main img').each(function (i, e) {
      if ($(e).attr('id') != 'questionClose') {
        if ($(e)[0].alt.slice(0, 2) == 'PC') {
          drawName = $(e)[0].alt;
          x = $('#ns-main img[alt="' + $(e)[0].alt + '"]')[0].x - NS.mainCanvasWidth - 10;
          y = $('#ns-main img[alt="' + $(e)[0].alt + '"]')[0].y - NS.mainCanvasHeight - 35;
          ctx.fillText(drawName, x, y, 200);
        }
        else if ($(e)[0].alt.slice(0, 2) == 'Ro'){
          drawName = 'Ro' + $(e)[0].alt.slice(6);
          x = $('#ns-main img[alt="' + $(e)[0].alt + '"]')[0].x - NS.mainCanvasWidth - 10;
          y = $('#ns-main img[alt="' + $(e)[0].alt + '"]')[0].y - NS.mainCanvasHeight - 20;
          ctx.fillText(drawName, x, y, 200);
        }
      }
    });
  }


  // ns-etc Fnction

  // contextMenuのcallback関数 (PC Router)
  fnConfunc = function(key, opt) {
    // 削除を押した時の動作
    if(key === "del") {
      NS.lanArrClass = $("#ns-main-canvas").attr("class").split(/\s?L_/);
      NS.mainCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);
      for(var i = 1; i < NS.lanArrClass.length; i++) {
        if(this.hasClass("sP_"+ NS.lanArrClass[i]))　{
          $("#ns-main img").removeClass("eP_"+ NS.lanArrClass[i]);
          $("#ns-main-canvas").removeClass("L_"+ NS.lanArrClass[i]);
          $("#ns-main img").removeClass("if_"+ NS.lanArrClass[i]);
        }
        else if(this.hasClass("eP_"+ NS.lanArrClass[i])) {
          $("#ns-main img").removeClass("sP_"+ NS.lanArrClass[i]);
          $("#ns-main-canvas").removeClass("L_"+ NS.lanArrClass[i]);
          $("#ns-main img").removeClass("if_"+ NS.lanArrClass[i]);
        }
        else {
          fnLanDraw(NS.lanArrClass[i]);
        }
      }
      if($(this).hasClass("get-node") || $(this).hasClass("send-node")) {
        $(this).prev().remove();
      }
      $(this).remove();
      $("#ns-main img:not([class*='P_'])").removeClass("lanLink");
      $("#ns-right dt:contains('"+ opt.$trigger[0].alt +"'), #ns-right dt:contains('"+ opt.$trigger[0].alt +"') + dd").remove();
      // lanLinkがないとき
      if(!($("#ns-main .ui-draggable").hasClass("lanLink"))) {
        $("#ns-main").off("mousedown", fnLanMoveDown);
        $("#ns-main").off("mouseup", fnLanMoveUp);
        $("html").off("mouseup", fnLanMoveOutUp);
      }
    }
  }



  // イベントの定義


  // window

  // ブラウザをリサイズ
  $(window).resize(function(){
    $('html').scrollTop(0);
    $('html').scrollLeft(0);
    var loadWidth        = $('#ns-main-canvas')[0].getBoundingClientRect().left - 35;
    var loadHeight       = $('#ns-main-canvas')[0].getBoundingClientRect().top - 35;
    var calCanvasWidth   = loadWidth - NS.mainCanvasWidth;
    var calCanvasHeight  = loadHeight - NS.mainCanvasHeight;
    NS.mainCanvasWidth  = loadWidth;
    NS.mainCanvasHeight = loadHeight;
    $("#ns-main img").each(function(i, val){
      $(val).offset({
        left:$(val).offset().left += calCanvasWidth,
        top:$(val).offset().top += calCanvasHeight
      });
    });
    $("#ns-main .bus").each(function(i, val){
      $(val).offset({
        left:$(val).offset().left += calCanvasWidth,
        top:$(val).offset().top += calCanvasHeight
      });
    });
    $("#glayLayer").css({
      'top': $("#ns-container").offset().top,
      'left': $("#ns-container").offset().left,
    });
    // bGlayFlag
    if(NS.bGlayFladg) {
      $("#glayLayer").css({
        'top':   $("#ns-container").offset().top,
        'left':  $("#ns-container").offset().left,
      });
    }
  });

  // GlayLayerの座標の指定 (New)
  $("#glayLayer").css({
    'top': $("#ns-container").offset().top,
    'left': $("#ns-container").offset().left,
    'width':  $("#ns-container").width() - 4,
  });

  //checkLayerの指定
  $("#checkLayer").css({
    'top': $("#ns-main").offset().top,
    'left': $("#ns-main").offset().left,
    'width':  $("#ns-main").width()
  });

  //questionLayerの指定
  $('#questionLayer').css({
    'top': $("#ns-main").offset().top,
    'left': $("#ns-main").offset().left,
    'width':  $("#ns-main").width()
  });

  // //読み込み時のアニメーション
  // $().introtzikas({
  //   line: '#fff', //ラインの色
  //   speedwidth: 1000, //幅の移動完了スピード
  //   speedheight: 1000, //高さの移動完了スピード
  //   bg: '#333' //背景色
  // });




  // ns-nav

  // Dustをクリック
  $("#dust").on('click', fnAllReset);

  //startをクリック
  $("#connect-start").click(function(){

    //変数宣言
    if ( typeof NSFCS === "undefined" ) var NSFCS = {};

      //コンストラクタのようなもの
      function router_const(){
        this.name = "";
        this.ip = [];
        this.sm = [];
        this.routingtable = [];
      }

      function pc_const(){
        this.name = "";
        this.ip = "";
        this.sm = "";
        this.link = "";
      }

    if ($('#ns-main img').hasClass('lanLink')) {

      router = []
      pc = []
      bus = []
      pc_num = 0
      sendData = new Object();

      //busのlanを取得
      if ($('#ns-main-canvas').attr('data-buslan') != undefined) {
        busLan = $('#ns-main-canvas').attr('data-buslan').split(' ');
      }
      else {
        busLan = '';
      }

      for (i=0; i < busLan.length; i++) {
        busLan[i] = busLan[i].slice(2);
      }

      //right-infoから情報回収
      //routerのname, ip, sm, nhaを取得
      $('#ns-right dt:contains("Router") span:nth-of-type(1)').each(function(i, e){
        router[i] = new router_const();
        router[i].name = $(e).text();
      });

      //ip&sm
      for(i=0; i < router.length; i++){
        count = 0;
        $('#ns-right dt:contains("' + router[i].name + '") + dd p[class="rightInfo-IPSM"] span').each(function(j, e) {
          if (j % 3 === 1) {
            router[i].ip[count] = $(e).text();
          }
          else if (j % 3 === 2){
            router[i].sm[count] = calculation_sm($(e).text());
            count++;
          }
        });
      }

      //ルーティングテーブルの数だけ生成
      for(i=0; i < router.length; i++){
        router[i].routingtable = [];
        count = 0;
        router[i].routingtable[count] = new Object();
        $('#ns-right dt:contains("' + router[i].name + '") + dd .rightInfo-routingtable-IPSM span').each(function (j, e) {
          if (j % 4 == 0) {
            router[i].routingtable[count].ip = e.textContent;
          }
          else if (j % 4 == 1) {
            router[i].routingtable[count].sm = e.textContent;
          }
          else if (j % 4 == 2) {
            router[i].routingtable[count].nha = e.textContent;
          }
          else {
            router[i].routingtable[count].if = e.textContent;
            count += 1;
            router[i].routingtable[count] = new Object();
          }
        });
        router[i].routingtable.pop();
      }



      //pcのname, ip, smを取得
      $("#ns-right dt:contains('PC') span:nth-of-type(1)").each(function(i, e){
        pc[i] = new pc_const();
        pc[i].name = $(e).text();
        pc_num++;
      });

      count = 0;
      $("#ns-right dt:contains('PC') + dd .rightInfo-IPSM span").each(function(i, e) {
        if (i % 2 === 0) {
          pc[count].ip = $(e).text();
        }
        else {
          pc[count].sm = calculation_sm($(e).text());
          count += 1;
        }
      });

      //ルーティングテーブルの数だけ生成
      for(i=0; i < pc.length; i++){
        pc[i].routingtable = [];
        count = 0;
        pc[i].routingtable[count] = new Object();
        $('#ns-right dt:contains("' + pc[i].name + '") + dd .rightInfo-routingtable-IPSM span').each(function (j, e) {
          if (j % 4 == 0) {
            pc[i].routingtable[count].ip = e.textContent;
          }
          else if (j % 4 == 1) {
            pc[i].routingtable[count].sm = e.textContent;
          }
          else if (j % 4 == 2) {
            pc[i].routingtable[count].nha = e.textContent;
          }
          else {
            pc[i].routingtable[count].if = e.textContent;
            count += 1;
            pc[i].routingtable[count] = new Object();
          }
        });
        pc[i].routingtable.pop();
      }

      //busの情報を取得
      $('#ns-main .bus').each(function (i, e) {
        bus[i] = new Object();
        bus[i].name = $(e).attr('alt');
      });

      //smの計算
      function calculation_sm(sm) {
        if (sm == '' || sm == 'none') {
          return '';
        }
        else {
          tmp = '';
          for(l = 0; l < 4; l++){
            split_sm = '';
            for(m = 0; m < 8; m++){
              if(sm > 0){
                split_sm += '1';
                sm--;
              }
              else{
                split_sm += '0';
              }
            }
            tmp += parseInt(split_sm, 2);
            if (l != 3) {
              tmp += '.';
            }
          }
          return tmp;
        }
      }

      //routerのlink
      for(i=0; i < router.length; i++){
        router[i].link = [];
        $('#ns-main img[alt="' + router[i].name + '"]').each(function (j, e){
          dataLanIf = $(e).attr('data-lan-if').split(' ');
          for(k=0; k < router[i].ip.length; k++){
            router[i].link[k] = [];
            for(l=0; l < dataLanIf.length; l++){
              if (k == dataLanIf[l][2]) {
                if ($(e).hasClass('sP_' + dataLanIf[l][0])) {
                  router[i].link[k][0] = $('.eP_' + dataLanIf[l][0])[0].alt;
                  //ノードの先のifを知る
                  if ($('.eP_' + dataLanIf[l][0]).hasClass('bus') == false) {
                    dataLanIf2 = $('.eP_' + dataLanIf[l][0]).attr('data-lan-if').split(' ');
                    for(m=0; m < dataLanIf2.length; m++){
                      dataLanIf2[m] = dataLanIf2[m].split('-');
                      if (dataLanIf2[m][0] == dataLanIf[l][0]) {
                        router[i].link[k][1] = dataLanIf2[m][1];
                      }
                    }
                  }
                  else {
                    router[i].link[k] = $('.eP_' + dataLanIf[l][0]).attr('alt');
                  }
                }
                else if ($(e).hasClass('eP_' + dataLanIf[l][0])) {
                  router[i].link[k][0] = $('.sP_' + dataLanIf[l][0])[0].alt;
                  //ノードの先のifを知る
                  if ($('.sP_' + dataLanIf[l][0]).hasClass('bus') == false) {
                    dataLanIf2 = $('.sP_' + dataLanIf[l][0]).attr('data-lan-if').split(' ');
                    for(m=0; m < dataLanIf2.length; m++){
                      dataLanIf2[m] = dataLanIf2[m].split('-');
                      if (dataLanIf2[m][0] == dataLanIf[l][0]) {
                        router[i].link[k][1] = dataLanIf2[m][1];
                      }
                    }
                  }
                  else {
                    router[i].link[k] = $('.sP_' + dataLanIf[l][0]).attr('alt');
                  }
                }
              }
            }
          }
        });
      }

      //pcのlink
      for(i=0; i < pc.length; i++){
        $('#ns-main img[alt="' + pc[i].name + '"]').each(function (j, e) {
          dataLanIf = $(e).attr('data-lan-if').split(' ');
          for(k=0; k < dataLanIf.length; k++){
            dataLanIf[k] = dataLanIf[k].split('-');
            if ($(e).hasClass('sP_' + dataLanIf[k][0])) {
              pc[i].link = [];
              pc[i].link[0] = $('.eP_' + dataLanIf[k][0])[0].alt;

              //ノードの先のifを知る
              if ($('.eP_' + dataLanIf[k][0]).hasClass('bus') == false) {
                dataLanIf2 = $('.eP_' + dataLanIf[k][0]).attr('data-lan-if').split(' ');
                for(m=0; m < dataLanIf2.length; m++){
                  dataLanIf2[m] = dataLanIf2[m].split('-');
                  if (dataLanIf2[m][0] == dataLanIf[k][0]) {
                    pc[i].link[1] = dataLanIf2[m][1];
                  }
                }
              }
              else {
                pc[i].link = $('.eP_' + dataLanIf[k][0]).attr('alt');
              }
            }
            else if ($(e).hasClass('eP_' + dataLanIf[k][0])) {
              pc[i].link = [];
              pc[i].link[0] = $('.sP_' + dataLanIf[k][0])[0].alt;

              //ノードの先のifを知る
              if ($('.sP_' + dataLanIf[k][0]).hasClass('bus') == false) {
                dataLanIf2 = $('.sP_' + dataLanIf[k][0]).attr('data-lan-if').split(' ');
                for(m=0; m < dataLanIf2.length; m++){
                  dataLanIf2[m] = dataLanIf2[m].split('-');
                  if (dataLanIf2[m][0] == dataLanIf[k][0]) {
                    pc[i].link[1] = dataLanIf2[m][1];
                  }
                }
              }
              else {
                pc[i].link = $('.sP_' + dataLanIf[k][0]).attr('alt');
              }
            }
          }
        });
      }

      //pcのroutingtableのlink
      for(i=0; i < pc.length; i++){
        $('#ns-main img[alt="' + pc[i].name + '"]').each(function (j, e){
          dataLanIf = $(e).attr('data-lan-if').split(' ');
          for(k=0; k < dataLanIf.length; k++){
            dataLanIf[k] = dataLanIf[k].split('-');
            for(l=0; l < pc[i].routingtable.length; l++){
              if (pc[i].routingtable[l].if == dataLanIf[k][1]) {
                if ($(e).hasClass('sP_' + dataLanIf[k][0])) {
                  pc[i].routingtable[l].link = [];
                  pc[i].routingtable[l].link[0] = $('.eP_' + dataLanIf[k][0])[0].alt;

                  //ノードの先のifを知る
                  if ($('.eP_' + dataLanIf[k][0]).hasClass('bus') == false) {
                    dataLanIf2 = $('.eP_' + dataLanIf[k][0]).attr('data-lan-if').split(' ');
                    for(m=0; m < dataLanIf2.length; m++){
                      dataLanIf2[m] = dataLanIf2[m].split('-');
                      if (dataLanIf2[m][0] == dataLanIf[k][0]) {
                        pc[i].routingtable[l].link[1] = dataLanIf2[m][1];
                      }
                    }
                  }
                  else {
                    pc[i].routingtable[l].link = $('.eP_' + dataLanIf[k][0]).attr('alt');
                  }
                }
                else if ($(e).hasClass('eP_' + dataLanIf[k][0])) {
                  pc[i].routingtable[l].link = [];
                  pc[i].routingtable[l].link[0] = $('.sP_' + dataLanIf[k][0])[0].alt;

                  //ノードの先のifを知る
                  if ($('.sP_' + dataLanIf[k][0]).hasClass('bus') == false) {
                    dataLanIf2 = $('.sP_' + dataLanIf[k][0]).attr('data-lan-if').split(' ');
                    for(m=0; m < dataLanIf2.length; m++){
                      dataLanIf2[m] = dataLanIf2[m].split('-');
                      if (dataLanIf2[m][0] == dataLanIf[k][0]) {
                        pc[i].routingtable[l].link[1] = dataLanIf2[m][1];
                      }
                    }
                  }
                  else {
                    pc[i].routingtable[l].link = $('.sP_' + dataLanIf[k][0]).attr('alt');
                  }
                }
              }
            }
          }
        });
      }

      //routerのroutingtableのlink
      for(i=0; i < router.length; i++){
        $('#ns-main img[alt="' + router[i].name + '"]').each(function (j, e){
          dataLanIf = $(e).attr('data-lan-if').split(' ');
          for(k=0; k < dataLanIf.length; k++){
            dataLanIf[k] = dataLanIf[k].split('-');
            for(l=0; l < router[i].routingtable.length; l++){
              if (router[i].routingtable[l].if == dataLanIf[k][1]) {
                if ($(e).hasClass('sP_' + dataLanIf[k][0])) {
                  router[i].routingtable[l].link = [];
                  router[i].routingtable[l].link[0] = $('.eP_' + dataLanIf[k][0])[0].alt;

                  //ノードの先のifを知る
                  if ($('.eP_' + dataLanIf[k][0]).hasClass('bus') == false) {
                    dataLanIf2 = $('.eP_' + dataLanIf[k][0]).attr('data-lan-if').split(' ');
                    for(m=0; m < dataLanIf2.length; m++){
                      dataLanIf2[m] = dataLanIf2[m].split('-');
                      if (dataLanIf2[m][0] == dataLanIf[k][0]) {
                        router[i].routingtable[l].link[1] = dataLanIf2[m][1];
                      }
                    }
                  }
                  else {
                    router[i].routingtable[l].link = $('.eP_' + dataLanIf[k][0]).attr('alt');
                  }
                }
                else if ($(e).hasClass('eP_' + dataLanIf[k][0])) {
                  router[i].routingtable[l].link = [];
                  router[i].routingtable[l].link[0] = $('.sP_' + dataLanIf[k][0])[0].alt;

                  //ノードの先のifを知る
                  if ($('.sP_' + dataLanIf[k][0]).hasClass('bus') == false) {
                    dataLanIf2 = $('.sP_' + dataLanIf[k][0]).attr('data-lan-if').split(' ');
                    for(m=0; m < dataLanIf2.length; m++){
                      dataLanIf2[m] = dataLanIf2[m].split('-');
                      if (dataLanIf2[m][0] == dataLanIf[k][0]) {
                        router[i].routingtable[l].link[1] = dataLanIf2[m][1];
                      }
                    }
                  }
                  else {
                    router[i].routingtable[l].link = $('.sP_' + dataLanIf[k][0]).attr('alt');
                  }
                }
              }
            }
          }
        });
      }

      //pcのルーティングテーブルのifが空の場合の処理
      for(i=0; i < pc.length; i++){
        for(j=0; j < pc[i].routingtable.length; j++){
          if (pc[i].routingtable[j].if == '') {
            pc[i].routingtable[j].link = [];
            pc[i].routingtable[j].link[0] = '';
            pc[i].routingtable[j].link[1] = '';
          }
        }
      }

      //routerのルーティングテーブルのifがからの場合の処理
      for(i=0; i < router.length; i++){
        for(j=0; j < router[i].routingtable.length; j++){
          if (router[i].routingtable[j].if == '') {
            router[i].routingtable[j].link = [];
            router[i].routingtable[j].link[0] = '';
            router[i].routingtable[j].link[1] = '';
          }
        }
      }



      //busのリンク
      for(i=0; i < bus.length; i++){
        bus[i].nodes = [];
        count = 0;
        for(j=0; j < busLan.length; j++){
          if ($('#ns-main div[alt=' + bus[i].name + ']').hasClass('sP_' + busLan[j])) {
            bus[i].nodes[count] = $('.eP_' + busLan[j]).attr('alt');
            count++;
          }
          else if ($('#ns-main div[alt=' + bus[i].name + ']').hasClass('eP_' + busLan[j])) {
            bus[i].nodes[count] = $('.sP_' + busLan[j]).attr('alt');
            count++;
          }
        }
      }

      console.log(pc);
      console.log(router);
      console.log(bus);

      sendData.pc_num = pc_num;

      //nodeInfo
      sendData.nodeInfo = [];

      //PCの情報
      for(i=0, j=0; i < pc.length; i++, j++){
        sendData.nodeInfo[i] = new Object();
        sendData.nodeInfo[i].name = pc[i].name;
        sendData.nodeInfo[i].ip = pc[i].ip;
        sendData.nodeInfo[i].sm = pc[i].sm
        sendData.nodeInfo[i].link = pc[i].link;
        sendData.nodeInfo[i].routingtable = [];
        for(k=0; k < pc[j].routingtable.length; k++){
          sendData.nodeInfo[i].routingtable[k] = new Object();
          sendData.nodeInfo[i].routingtable[k].ip = pc[j].routingtable[k].ip;
          sendData.nodeInfo[i].routingtable[k].sm = calculation_sm(pc[j].routingtable[k].sm);
          sendData.nodeInfo[i].routingtable[k].nha = pc[j].routingtable[k].nha;
          sendData.nodeInfo[i].routingtable[k].if = pc[j].routingtable[k].if;
          sendData.nodeInfo[i].routingtable[k].link = pc[j].routingtable[k].link;
        }
      }

      //Routerの情報
      for(i=pc.length, j=0; j < router.length; i++, j++){
        sendData.nodeInfo[i] = new Object();
        sendData.nodeInfo[i].name = router[j].name;
        sendData.nodeInfo[i].ip = router[j].ip;
        sendData.nodeInfo[i].sm = router[j].sm;
        sendData.nodeInfo[i].routingtable = [];
        sendData.nodeInfo[i].link = router[j].link;
        for(k=0; k < router[j].routingtable.length; k++){
          sendData.nodeInfo[i].routingtable[k] = new Object();
          sendData.nodeInfo[i].routingtable[k].ip = router[j].routingtable[k].ip;
          sendData.nodeInfo[i].routingtable[k].sm = calculation_sm(router[j].routingtable[k].sm);
          sendData.nodeInfo[i].routingtable[k].nha = router[j].routingtable[k].nha;
          sendData.nodeInfo[i].routingtable[k].if = router[j].routingtable[k].if;
          sendData.nodeInfo[i].routingtable[k].link = router[j].routingtable[k].link;
        }
      }

      //busの情報
      sendData.busInfo = bus;


      console.log(sendData);

      JsonSendData = JSON.stringify(sendData, null, ' ');
      // JsonSendData = JSON.stringify(sendData);
      console.log(JsonSendData);


      //questionモードのとき
      if ($('.question').length > 0) {
        $.ajax({
          type: 'POST',
          dataType: 'text',
          // url: 'NewNetworkSimulator/php/post_networkdata.php',
          url: '/assets/result.json',
          data: {postJsonData : NSFCS.JSONpostData}
        }).done(function (data) {
          resultData = JSON.parse(data);
          console.log(resultData);
          $("#ns-console").append("<p>>result･･･</p>");

          //間違いがない=true, 間違いがある=false
          correctFlag = true;

          //間違いがあるかないか
          for(i=0; i < resultData.length; i++){
            if (resultData[i][resultData[i].length-1] == 0) {
              correctFlag = false;
            }
          }

          //間違いがない場合
          if (correctFlag == true) {
            $("#ns-main").append(
              $("<div>").attr({
                class: "cssCircle",
                style: "position: absolute; top: " + NS.questionCanvasY + "px; left: "+ NS.questionCanvasX + "px;" + NS.canvasWidth + "; height:" + NS.canvasHeight + ";"
              }));
            $('.cssCircle:last-child').append(
              $('<img>').attr({
                src: '/assets/big_circle.png'
              }));
              $('.cssCircle').fadeOut(300,function(){
                $(this).fadeIn(400, function () {
                  $(this).fadeOut(200, function () {
                    $('.cssCircle').remove();
                  })
                })
              });
            //正誤をデータベースに送信
            $.ajax({
              type: 'POST',
              dataType: 'text',
              // url: 'NewNetworkSimulator/php/push_start.php',
              url: '/assets/result.json',
              data: {postData : 1, id : NS.urlparameter, question_id : $('#question span').innerHTML}
            });
          }
          //間違いがある場合
          else {
            //circleと同じアニメーション
            $("#ns-main").append(
              $("<div>").attr({
                class: "cssCircle",
                style: "position: absolute; top: " + NS.questionCanvasY + "px; left: "+ NS.questionCanvasX + "px;" + NS.canvasWidth + "; height:" + NS.canvasHeight + ";"
              }));
            $('.cssCircle:last-child').append(
              $('<img>').attr({
                src: '/assets/big_cross.png'
              }));
              $('.cssCircle').fadeOut(300,function(){
                $(this).fadeIn(400, function () {
                  $(this).fadeOut(200, function () {
                    $('.cssCircle').remove();
                  })
                })
              });
            $.ajax({
              type: 'POST',
              dataType: 'text',
              // url: 'NewNetworkSimulator/php/pust_start.php',
              url: '/assets/result.json',
              data: {postData : 0, id : NS.urlparameter, question_id : $('#question span').innerHTML}
            });
          }


          //resultをコンソールに出力
          for(i=0; i < resultData.length; i++){
            outputData = '';
            classData = '';
            for(j=0; j < resultData[i].length-1; j++){
              outputData += resultData[i][j];
              classData += resultData[i][j];
              if (j != resultData[i].length-2) {
                outputData += '->';
                classData += '-';
              }
            }
            if (resultData[i][j] == '1') {
              outputData += '：succses';
              classData += '-1';
            }
            if (resultData[i][j] == '0') {
              outputData += '：error';
              classData += '-0';
            }
            $('#ns-console').append('<p id="console-text" class="' + classData + '" onClick="return packetAnimation(this);">>' + outputData +  '</p>');
          }
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
          console.log(errorThrown);
          console.log(textStatus);
          $("#ns-console").append("<p>> エラーが発生したので処理を終了します。</p>");
        });
      }
      else {
        $.ajax({
          type: 'POST',
          dataType: 'text',
          // url: 'NewNetworkSimulator/php/post_networkdata.php',
          url: '/assets/result.json',
          data: {postJsonData : NSFCS.JSONpostData}
        }).done(function (data) {
          resultData = JSON.parse(data);
          console.log(resultData);
          $("#ns-console").append("<p>>result･･･</p>");

          //間違いがない=true, 間違いがある=false
          correctFlag = true;

          //間違いがあるかないか
          for(i=0; i < resultData.length; i++){
            if (resultData[i][resultData[i].length-1] == 0) {
              correctFlag = false;
            }
          }

          //間違いがない場合
          if (correctFlag == true) {
            $("#ns-main").append(
              $("<div>").attr({
                class: "cssCircle",
                style: "position: absolute; top: " + NS.questionCanvasY + "px; left: "+ NS.questionCanvasX + "px;" + NS.canvasWidth + "; height:" + NS.canvasHeight + ";"
              }));
            $('.cssCircle:last-child').append(
              $('<img>').attr({
                src: '/assets/big_circle.png'
              }));
              $('.cssCircle').fadeOut(300,function(){
                $(this).fadeIn(400, function () {
                  $(this).fadeOut(200, function () {
                    $('.cssCircle').remove();
                  })
                })
              });
          }
          //間違いがある場合
          else {
            //circleと同じアニメーション
            $("#ns-main").append(
              $("<div>").attr({
                class: "cssCircle",
                style: "position: absolute; top: " + NS.questionCanvasY + "px; left: "+ NS.questionCanvasX + "px;" + NS.canvasWidth + "; height:" + NS.canvasHeight + ";"
              }));
            $('.cssCircle:last-child').append(
              $('<img>').attr({
                src: '/assets/big_cross.png'
              }));
              $('.cssCircle').fadeOut(300,function(){
                $(this).fadeIn(400, function () {
                  $(this).fadeOut(200, function () {
                    $('.cssCircle').remove();
                  })
                })
              });
          }


          //resultをコンソールに出力
          for(i=0; i < resultData.length; i++){
            outputData = '';
            classData = '';
            for(j=0; j < resultData[i].length-1; j++){
              outputData += resultData[i][j];
              classData += resultData[i][j];
              if (j != resultData[i].length-2) {
                outputData += '->';
                classData += '-';
              }
            }
            if (resultData[i][j] == '1') {
              outputData += '：succses';
              classData += '-1';
            }
            if (resultData[i][j] == '0') {
              outputData += '：error';
              classData += '-0';
            }
            $('#ns-console').append('<p id="console-text" class="' + classData + '" onClick="return packetAnimation(this);">>' + outputData +  '</p>');
          }
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
          console.log(errorThrown);
          console.log(textStatus);
          $("#ns-console").append("<p>> エラーが発生したので処理を終了します。</p>");
        });
      }

      // $.ajax({
      //   type: 'POST',
      //   dataType: 'text',
      //   // url: 'NewNetworkSimulator/php/post_networkdata.php',
      //   url: '/assets/result.json',
      //   data: {postJsonData : NSFCS.JSONpostData}
      // }).done(function (data) {
      //   resultData = JSON.parse(data);
      //   console.log(resultData);
      //   $("#ns-console").append("<p>>result･･･</p>");
      //
      //   //間違いがない=true, 間違いがある=false
      //   correctFlag = true;
      //
      //   //間違いがあるかないか
      //   for(i=0; i < resultData.length; i++){
      //     if (resultData[i][resultData[i].length-1] == 0) {
      //       correctFlag = false;
      //     }
      //   }
      //
      //   //間違いがない場合
      //   if (correctFlag == true) {
      //     $("#ns-main").append(
      //       $("<div>").attr({
      //         class: "cssCircle",
      //         style: "position: absolute; top: " + NS.questionCanvasY + "px; left: "+ NS.questionCanvasX + "px;" + NS.canvasWidth + "; height:" + NS.canvasHeight + ";"
      //       }));
      //     $('.cssCircle:last-child').append(
      //       $('<img>').attr({
      //         src: '/assets/big_circle.png'
      //       }));
      //       $('.cssCircle').fadeOut(300,function(){
      //         $(this).fadeIn(400, function () {
      //           $(this).fadeOut(200, function () {
      //             $('.cssCircle').remove();
      //           })
      //         })
      //       });
      //     //正誤をデータベースに送信
      //     $.ajax({
      //       type: 'POST',
      //       dataType: 'text',
      //       // url: 'NewNetworkSimulator/php/push_start.php',
      //       url: '/assets/result.json',
      //       data: {postData : 1, id : NS.urlparameter, question_id : $('#question span').innerHTML}
      //     });
      //   }
      //   //間違いがある場合
      //   else {
      //     //circleと同じアニメーション
      //     $("#ns-main").append(
      //       $("<div>").attr({
      //         class: "cssCircle",
      //         style: "position: absolute; top: " + NS.questionCanvasY + "px; left: "+ NS.questionCanvasX + "px;" + NS.canvasWidth + "; height:" + NS.canvasHeight + ";"
      //       }));
      //     $('.cssCircle:last-child').append(
      //       $('<img>').attr({
      //         src: '/assets/big_cross.png'
      //       }));
      //       $('.cssCircle').fadeOut(300,function(){
      //         $(this).fadeIn(400, function () {
      //           $(this).fadeOut(200, function () {
      //             $('.cssCircle').remove();
      //           })
      //         })
      //       });
      //     $.ajax({
      //       type: 'POST',
      //       dataType: 'text',
      //       // url: 'NewNetworkSimulator/php/pust_start.php',
      //       url: '/assets/result.json',
      //       data: {postData : 0, id : NS.urlparameter, question_id : $('#question span').innerHTML}
      //     });
      //   }
      //
      //
      //   //resultをコンソールに出力
      //   for(i=0; i < resultData.length; i++){
      //     outputData = '';
      //     classData = '';
      //     for(j=0; j < resultData[i].length-1; j++){
      //       outputData += resultData[i][j];
      //       classData += resultData[i][j];
      //       if (j != resultData[i].length-2) {
      //         outputData += '->';
      //         classData += '-';
      //       }
      //     }
      //     if (resultData[i][j] == '1') {
      //       outputData += '：succses';
      //       classData += '-1';
      //     }
      //     if (resultData[i][j] == '0') {
      //       outputData += '：error';
      //       classData += '-0';
      //     }
      //     $('#ns-console').append('<p id="console-text" class="' + classData + '" onClick="return packetAnimation(this);">>' + outputData +  '</p>');
      //   }
      // }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
      //   console.log(errorThrown);
      //   console.log(textStatus);
      //   $("#ns-console").append("<p>> エラーが発生したので処理を終了します。</p>");
      // });

    }
  });


  //Modeをクリック
  $('.mode_draw').click(function () {
    if ($('.change_mode').hasClass('question')) {
      fnchangeMode();
      $('.change_mode').removeClass('question');
      $('.change_mode').addClass('draw');
    }
  });

  $('.mode_question').click(function () {
    if ($('.change_mode').hasClass('draw')) {
      fnchangeMode();
      $('.change_mode').removeClass('draw');
      $('.change_mode').addClass('question');
    }
  });

  //checkをクリック
  $("#check").on(({
    mousedown:function () {

      //onのとき
      if ($('#check').attr('src') == '/assets/check_2.png') {
        //画像をoffに変更
        $('#check').attr('src', '/assets/check.png');
        //checkLayerを閉じる
        $("#checkLayer").css({'display':'none','height':0});
        $("#checkLayer").empty();
      }
      else {
        //画像を変更
        $("#check").attr("src", "/assets/check_2.png");
        //checkLayerを表示
        $("#checkLayer").css({
          display: 'block',
        });
        $("#checkLayer").animate({
          top:    $("#ns-main").offset().top,
          left:   $("#ns-main").offset().left,
          height: $("#ns-main").height(),
          width:  $("#ns-main").width(),
        },{
          duration:400,
          complete:function () {
            $("#checkLayer").append('<canvas width="600" height="400" id="checkLayer-canvas"></canvas>');
            $("#ns-right dd").show();
            $("#ns-right dt img").attr("src", "/assets/minus.jpg");
            NS.IndicateNodeInfo();
          }
        });
      }
    }
    //,

    // mouseup:function () {
    //   //画像を変更
    //   $("#check").attr("src", "/assets/check.png");
    //   //checkLayerを閉じる
    //   $("#checkLayer").css({'display':'none','height':0});
    //   $("#checkLayer").empty();
    // },

    // mouseleave:function () {
    //   //画像を変更
    //   $("#check").attr("src", "/assets/check.png");
    //   //checkLayerを閉じる
    //   $("#checkLayer").css({'display':'none','height':0});
    //   $("#checkLayer").empty();
    // }
  }));


  // Helpをクリック (Update)
  $("#info").click(function(){
    // GlayLayerを表示
    fnGlayOpen();
    // 画像等の追加
    $("#glayLayer").append('<div id="slideGalley"><ul id="slideUl">'+
      '<li><img src="/assets/sample1.png"></li><li><img src="/assets/sample2.png"></li><li><img src="/assets/sample3.png"></li><li><img src="/assets/sample4.png"></li><li><img src="/assets/sample5.png"></li><li><img src="/assets/sample6.png"></li><li><img src="/assets/sample7.png"></li><li><img src="/assets/sample8.png"></li>'+
      '</ul></div>');
    $("#glayLayer").append('<img src="/assets/batu.png" id="glayClose">');
    $("#glayLayer").append('<img src="/assets/left.png" id="infoLeft">');
    $("#glayLayer").append('<img src="/assets/right.png" id="infoRight">');
    // イベントハンドラの追加
    $("#infoLeft").on('click', fnGlayInfoLeft);
    $("#infoRight").on('click', fnGlayInfoRight);
    $("#glayClose").on('click', fnAllGlayClose);
  });

  // Debugをクリック
  $("#cui").click(function(){
    $("#ns-console").append("<p>> デバックしました。</p>");
  });


  //問題ボタンの押した時
  $('.qusetion-select-button').click(function () {
  });


  // ns-left

  // machineryをドラッグ
  $(".machinery").draggable({
    helper: 'clone',  // 要素を複製する
    revert: true,     // ドラッグ終了時に要素に戻る
    zIndex: 3,
    // ドラッグ開始
    start: function(e, ui) { $(this).addClass('dragout'); },
    // ドラッグ終了
    stop: function(e, ui) { $(this).removeClass('dragout'); },
  });

  // lanをクリック
  $("#lan").click(function(){
    NS.changeLanMode();
  });

  //lanボタンをクリック（なぜか反応しない）
  // $('input[name=lanSwitch]').click(function(){
  //   console.log('a');
  //   var elHtml     = $("html");
  //   var elMain     = $("#ns-main");
  //   var elMainDrag = $("#ns-main .ui-draggable");
  //
  //   if ($('input[name=lanSwitch]').hasClass('lanDrawOn')) {
  //     // イベントハンドラーの削除
  //     elMain.off("mousedown", fnLanDown);
  //     elMain.off("mouseup", fnLanUp);
  //     elHtml.off("mouseup", fnLanOutUp);
  //     elMainDrag.off("mouseenter").off("mouseleave");
  //     // カーソルの変更
  //     elMain.css("cursor", "auto");
  //     elMainDrag.css("cursor", "pointer");
  //     // lanLinkがある時
  //     if(elMainDrag.hasClass("lanLink")) {
  //       elMain.on("mousedown", fnLanMoveDown);
  //       elMain.on("mouseup", fnLanMoveUp);
  //       elHtml.on("mouseup", fnLanMoveOutUp);
  //     }
  //
  //     $("input[name=busSwitch]").removeClass('lanDrawOn');
  //   }
  //   else {
  //     // イベントハンドラーを付ける
  //     elMain.on("mousedown", fnLanDown);
  //     elMain.on("mouseup", fnLanUp);
  //     elHtml.on("mouseup", fnLanOutUp);
  //     // lanLinkがある時
  //     if(elMainDrag.hasClass("lanLink")) {
  //       elMain.off("mousedown", fnLanMoveDown);
  //       elMain.off("mouseup", fnLanMoveUp);
  //       elHtml.off("mouseup", fnLanMoveOutUp);
  //     }
  //     // カーソルの変更
  //     elMain.css("cursor", "crosshair");
  //     elMainDrag.css("cursor", "crosshair");
  //     // 画像のドラッグ防止
  //     elMainDrag.mouseup(function(e) { e.preventDefault(); });
  //     elMainDrag.mousedown(function(e) { e.preventDefault(); });
  //     // 画像にマウスが乗った時の動作
  //     elMainDrag.mouseenter(function(){
  //       // フラグの設定
  //       NS.lanFlag = true;
  //       $(this).addClass("lanOn");
  //       $(this).draggable("disable");
  //     }).mouseleave(function(){
  //       // フラグの設定
  //       NS.lanFlag = false;
  //       $(this).removeClass("lanOn");
  //       $(this).draggable("enable");
  //     });
  //     $("input[name=lanSwitch]").addClass('lanDrawOn');
  //   }
  // });

  // LANのスター型とバス型をクリック
  $('input[name=busSwitch]').click(function(){

    //fnAllReset();
    // NS.lanArrClass = $("#ns-main-canvas").attr("class").split(/\s?L_/);
    // NS.mainCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);
    // for(var i = 1; i < NS.lanArrClass.length; i++) {
    //   fnLanDraw();
    //   //fnIfDraw(NS.lanArrClass[i]);
    // }

    //バスをoffにする
    if ($('input[name=busSwitch]').hasClass('busOn')) {
      $("#ns-main").off("mousedown", fnBusDown);
      $("#ns-main").off("mouseup", fnBusUp);
      $("html").off("mouseup", fnBusOutUp);
      $("input[name=busSwitch]").removeClass('busOn');
    }
    //バスをonにする
    else {
      // イベントハンドラーを付ける
      $("#ns-main").on("mousedown", fnBusDown);
      $("input[name=busSwitch]").addClass('busOn');

      //lanがonの時offに切り替え
      if ($('#lan').attr('src') == '/assets/lanCable_2.png') {
        NS.changeLanMode();
      }
    }
  });



  // ns-main

  // ns-mainにドロップ
  $("#ns-main").droppable({
    accept: '.machinery',
    tolerance: 'fit',
    // ドロップされたとき
    drop: function(e, ui){
      fnMainDrop(ui, $(this));
      NS.mainDropFlg = false;
    },
    // ドロップを受け入れる Draggable 要素がドラッグを終了したとき
    deactivate: function(e, ui){
      ui.draggable.draggable({ revert: NS.mainDropFlg });
      if(NS.mainDropFlg === false) {
        NS.mainDropFlg = true;
      }
    }
  });

  // ns-mainの画像の上にいるとき
  $("#ns-main").on("mouseover", "img", function(e){

    $(e.target).addClass('mouseover');

    $("#ns-right dt:contains('"+ $(this).attr("alt") +"'), #ns-right dt:contains('"+ $(this).attr("alt") +"') + dd").css({
      color: "#49cbf6",
    });
  }).on("mouseout", "img", function(e){
    $("#ns-right dt:contains('"+ $(this).attr("alt") +"'), #ns-right dt:contains('"+ $(this).attr("alt") +"') + dd").css({
      color: "",
    });
  });

  //busの上にある時
  $("#ns-main").on("mouseover", ".bus", function(e){
    //if ($('#lan').attr('src') === '/assets/lanCable.png') {
      $(e.target).addClass('bus-mouseover');
      $(e.target).draggable();
    //}
  });

  ////ns-mainの画像の上から外れた時
  $("#ns-main").on("mouseout", "img", function(e){

    $(e.target).removeClass('mouseover');

  });

  //ns-mainのバスの上から外れた時
  $("#ns-main").on("mouseout", ".bus", function(e){

    $(e.target).removeClass('bus-mouseover');

  });

  //バスのドラック後
  $("#ns-main").on("mouseup", ".bus", function(e){
    fnLanDraw();
  });


  //animecanvasを削除
  $('body').click(function () {
    $('.animecanvasflag').remove();
  });

  //描画中にns-main-canvasの外に出た時描画を中止する
  $('html').on('mouseover', function (e) {
    console.log('mouseover html: ');
    if ($(e.target).attr('id') != 'ns-main-canvas' && NS.busDrawFrag == true && $(e.target).hasClass('ui-draggable') == false) {
      NS.points = [];
      NS.addCanvas.remove();
      NS.busDrawFrag = false;
      // イベントハンドラの削除
      $('#ns-main').off('mousemove', fnBusDrag);
      $('#ns-main').off('mouseup', fnbusUp);
    }
    if ($(e.target).attr('id') != 'ns-main-canvas') {
      //console.log('ns-main-canvas外');
    }
    if (NS.lanFlagPoint === true) {
      console.log('lanPointがtrue');
    }

    if ($(e.target).attr('id') != 'ns-main-canvas' && NS.lanFlagPoint == true && $(e.target).hasClass('ui-draggable') == false) {
      console.log('消したるで');
      NS.addCanvas.remove();
      if(!(NS.lanFlaglink)) {
        $(".sP_"+ NS.lanNode).removeClass("lanLink");
      }
      $("#ns-main").off("mousemove", fnLanDrag);
      $("#ns-main .ui-draggable").removeClass("lanFirst");
      $(".sP_"+ NS.lanNode).removeClass("sP_"+ NS.lanNode);
      $("#ns-main-canvas").removeClass("L_"+ NS.lanNode);
      // 変数とフラグをリセット
      NS.points = [];
      NS.lanFlaglink = false;
      NS.lanFlagPoint = false;
    }
  });

  //マウスを動かしたら再描画
  $('#ns-main').on('mousemove', function (e) {
    if ($('#ns-main-canvas').attr('class') == '' && $('#ns-main img').length > 0) {
      NS.mainCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);
      fnNameDraw();
    }
  });

  //infoに乗った時indexを上げる
  $('.info').on(({
    mouseover:function () {
      console.log(e);
    }
  }));

  //busからmouseを離す
  $('.bus').on('click', function (e) {
    console.log('a');
  });

  $('.bus').mouseout(function () {
    console.log('1');
  })



  // ns-right

  // ns-rightのimgをクリック
  $("#ns-right").on("click", "img", function(){
    var elthis = $(this);
    if(elthis.attr("src") === "/assets/plus.jpg") {
      elthis.attr("src", "/assets/minus.jpg");
      elthis.parent("dt").next().show();
    }
    else if(elthis.attr("src") === "/assets/minus.jpg") {
      elthis.attr("src", "/assets/plus.jpg");
      elthis.parent("dt").next().hide();
    }
  });

  // ns-right-infoのimgをクリック
  $("#ns-right-info img").on("click", function(){
    if($(this).attr("src") === "/assets/open.png") {
      $("#ns-right dd").show();
      $("#ns-right dt img").attr("src", "/assets/minus.jpg");
    }
    if($(this).attr("src") === "/assets/close.png") {
      $("#ns-right dd").hide();
      $("#ns-right dt img").attr("src", "/assets/plus.jpg");
    }
  });


  //行動を保存する
  $('html').on('click', function (e) {

    $.ajax({
      type: 'POST',
      dataType: 'text',
      url: '/vendor/json/sample1.json',
      //url: 'NewNetworkSimulator/php/collect_questions.php',
      data:{id : NS.urlparameter, timeStamp: e.timeStamp, outerHTML: e.target.outerHTML}
    });
  });

});
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//




//先に読み込んでおきたいものを明示的に指定











;
