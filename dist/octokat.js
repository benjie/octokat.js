(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Octokat = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * A specialized version of `_.forEach` for arrays without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;

},{}],2:[function(require,module,exports){
/**
 * A specialized version of `_.filter` for arrays without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array.length,
      resIndex = -1,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[++resIndex] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;

},{}],3:[function(require,module,exports){
(function (global){
var Chainer, OctokatBase, Requester, TREE_OPTIONS, VerbMethods, applyHypermedia, deprecate, plus, uncamelizeObj,
  slice = [].slice;

plus = require('./plus');

deprecate = require('./deprecate');

TREE_OPTIONS = require('./grammar/tree-options');

Chainer = require('./chainer');

VerbMethods = require('./verb-methods');

Requester = require('./requester');

applyHypermedia = require('./helpers/hypermedia');

uncamelizeObj = function(obj) {
  var i, j, key, len, o, ref, value;
  if (Array.isArray(obj)) {
    return (function() {
      var j, len, results;
      results = [];
      for (j = 0, len = obj.length; j < len; j++) {
        i = obj[j];
        results.push(uncamelizeObj(i));
      }
      return results;
    })();
  } else if (obj === Object(obj)) {
    o = {};
    ref = Object.keys(obj);
    for (j = 0, len = ref.length; j < len; j++) {
      key = ref[j];
      value = obj[key];
      o[plus.uncamelize(key)] = uncamelizeObj(value);
    }
    return o;
  } else {
    return obj;
  }
};

OctokatBase = function(clientOptions) {
  var disableHypermedia, instance, plugins, request, verbMethods;
  if (clientOptions == null) {
    clientOptions = {};
  }
  plugins = clientOptions.plugins || [];
  disableHypermedia = clientOptions.disableHypermedia;
  if (disableHypermedia == null) {
    disableHypermedia = false;
  }
  instance = {};
  request = function(method, path, data, options, cb) {
    var ref, requester;
    if (options == null) {
      options = {
        raw: false,
        isBase64: false,
        isBoolean: false
      };
    }
    if (data && !(typeof global !== "undefined" && global !== null ? (ref = global['Buffer']) != null ? ref.isBuffer(data) : void 0 : void 0)) {
      data = uncamelizeObj(data);
    }
    requester = new Requester(instance, clientOptions, plugins);
    return requester.request(method, path, data, options, function(err, val) {
      var context, obj;
      if (err) {
        return cb(err);
      }
      if (options.raw) {
        return cb(null, val);
      }
      if (!disableHypermedia) {
        context = {
          data: val,
          requester: requester,
          instance: instance,
          clientOptions: clientOptions
        };
        obj = instance._parseWithContext(path, context);
        return cb(null, obj);
      } else {
        return cb(null, val);
      }
    });
  };
  verbMethods = new VerbMethods(plugins, {
    request: request
  });
  (new Chainer(verbMethods)).chain('', null, TREE_OPTIONS, instance);
  instance.me = instance.user;
  instance.parse = function(data) {
    var context;
    context = {
      requester: {
        request: request
      },
      data: data,
      instance: instance,
      clientOptions: clientOptions
    };
    return instance._parseWithContext('', context);
  };
  instance._parseWithContext = function(path, context) {
    var chainer, data, datum, j, k, len, len1, plugin, requester, url;
    data = context.data, requester = context.requester;
    url = data.url || path;
    if (context.options == null) {
      context.options = {};
    }
    for (j = 0, len = plugins.length; j < len; j++) {
      plugin = plugins[j];
      if (plugin.responseMiddleware) {
        plus.extend(context, plugin.responseMiddleware(context));
      }
    }
    data = context.data;
    verbMethods = new VerbMethods(plugins, requester);
    chainer = new Chainer(verbMethods);
    if (url) {
      chainer.chain(url, true, {}, data);
      chainer.chainChildren(url, data);
    } else {
      chainer.chain('', null, {}, data);
      if (Array.isArray(data)) {
        for (k = 0, len1 = data.length; k < len1; k++) {
          datum = data[k];
          chainer.chainChildren(datum.url, datum);
        }
      }
    }
    return data;
  };
  instance._fromUrlWithDefault = function() {
    var args, defaultFn, path;
    path = arguments[0], defaultFn = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
    path = applyHypermedia.apply(null, [path].concat(slice.call(args)));
    verbMethods.injectVerbMethods(path, defaultFn);
    return defaultFn;
  };
  instance.fromUrl = function() {
    var args, defaultFn, path;
    path = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    defaultFn = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      deprecate('call ....fetch() explicitly instead of ...()');
      return defaultFn.fetch.apply(defaultFn, args);
    };
    return instance._fromUrlWithDefault.apply(instance, [path, defaultFn].concat(slice.call(args)));
  };
  instance._fromUrlCurried = function(path, defaultFn) {
    var fn;
    fn = function() {
      var templateArgs;
      templateArgs = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (defaultFn && templateArgs.length === 0) {
        return defaultFn.apply(fn);
      } else {
        return instance.fromUrl.apply(instance, [path].concat(slice.call(templateArgs)));
      }
    };
    if (!/\{/.test(path)) {
      verbMethods.injectVerbMethods(path, fn);
    }
    return fn;
  };
  instance.status = instance.fromUrl('https://status.github.com/api/status.json');
  instance.status.api = instance.fromUrl('https://status.github.com/api.json');
  instance.status.lastMessage = instance.fromUrl('https://status.github.com/api/last-message.json');
  instance.status.messages = instance.fromUrl('https://status.github.com/api/messages.json');
  return instance;
};

module.exports = OctokatBase;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./chainer":4,"./deprecate":5,"./grammar/tree-options":8,"./helpers/hypermedia":11,"./plus":29,"./requester":30,"./verb-methods":31}],4:[function(require,module,exports){
var Chainer, OBJECT_MATCHER, TREE_OPTIONS, VerbMethods, plus,
  slice = [].slice;

TREE_OPTIONS = require('./grammar/tree-options');

OBJECT_MATCHER = require('./grammar/object-matcher');

plus = require('./plus');

VerbMethods = require('./verb-methods');

module.exports = Chainer = (function() {
  function Chainer(_verbMethods) {
    this._verbMethods = _verbMethods;
  }

  Chainer.prototype.chain = function(path, name, contextTree, fn) {
    var fn1;
    if (fn == null) {
      fn = (function(_this) {
        return function() {
          var args, separator;
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          if (!args.length) {
            throw new Error('BUG! must be called with at least one argument');
          }
          if (name === 'compare') {
            separator = '...';
          } else {
            separator = '/';
          }
          return _this.chain(path + "/" + (args.join(separator)), name, contextTree);
        };
      })(this);
    }
    this._verbMethods.injectVerbMethods(path, fn);
    if (typeof fn === 'function' || typeof fn === 'object') {
      fn1 = (function(_this) {
        return function(name) {
          delete fn[plus.camelize(name)];
          return Object.defineProperty(fn, plus.camelize(name), {
            configurable: true,
            enumerable: true,
            get: function() {
              return _this.chain(path + "/" + name, name, contextTree[name]);
            }
          });
        };
      })(this);
      for (name in contextTree || {}) {
        fn1(name);
      }
    }
    return fn;
  };

  Chainer.prototype.chainChildren = function(url, obj) {
    var context, i, k, key, len, re, ref;
    for (key in OBJECT_MATCHER) {
      re = OBJECT_MATCHER[key];
      if (re.test(obj.url)) {
        context = TREE_OPTIONS;
        ref = key.split('.');
        for (i = 0, len = ref.length; i < len; i++) {
          k = ref[i];
          context = context[k];
        }
        this.chain(url, k, context, obj);
      }
    }
    return obj;
  };

  return Chainer;

})();

module.exports = Chainer;


},{"./grammar/object-matcher":6,"./grammar/tree-options":8,"./plus":29,"./verb-methods":31}],5:[function(require,module,exports){
module.exports = function(message) {
  return typeof console !== "undefined" && console !== null ? typeof console.warn === "function" ? console.warn("Octokat Deprecation: " + message) : void 0 : void 0;
};


},{}],6:[function(require,module,exports){
module.exports = {
  'repos': /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/repos\/[^\/]+\/[^\/]+$/,
  'gists': /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/gists\/[^\/]+$/,
  'issues': /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/repos\/[^\/]+\/[^\/]+\/(issues|pulls)\/[^\/]+$/,
  'users': /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/users\/[^\/]+$/,
  'orgs': /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/orgs\/[^\/]+$/,
  'repos.comments': /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/repos\/[^\/]+\/[^\/]+\/comments\/[^\/]+$/
};


},{}],7:[function(require,module,exports){
module.exports = {
  'application/vnd.github.drax-preview+json': /^(https?:\/\/[^\/]+)?(\/api\/v3)?(\/licenses|\/licenses\/([^\/]+)|\/repos\/([^\/]+)\/([^\/]+))$/,
  'application/vnd.github.v3.star+json': /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/users\/([^\/]+)\/starred$/,
  'application/vnd.github.mirage-preview+json': /^(https?:\/\/[^\/]+)?(\/api\/v3)?(\/authorizations|\/authorizations\/clients\/([^\/]{20})|\/authorizations\/clients\/([^\/]{20})\/([^\/]+)|\/authorizations\/([\d]+)|\/applications\/([^\/]{20})\/tokens|\/applications\/([^\/]{20})\/tokens\/([^\/]+))$/
};


},{}],8:[function(require,module,exports){
module.exports = {
  'zen': false,
  'octocat': false,
  'organizations': false,
  'issues': false,
  'emojis': false,
  'markdown': false,
  'meta': false,
  'rate_limit': false,
  'feeds': false,
  'events': false,
  'notifications': {
    'threads': {
      'subscription': false
    }
  },
  'gitignore': {
    'templates': false
  },
  'user': {
    'repos': false,
    'orgs': false,
    'followers': false,
    'following': false,
    'emails': false,
    'issues': false,
    'starred': false,
    'teams': false
  },
  'orgs': {
    'repos': false,
    'issues': false,
    'members': false,
    'events': false,
    'teams': false
  },
  'teams': {
    'members': false,
    'memberships': false,
    'repos': false
  },
  'users': {
    'repos': false,
    'orgs': false,
    'gists': false,
    'followers': false,
    'following': false,
    'keys': false,
    'starred': false,
    'received_events': {
      'public': false
    },
    'events': {
      'public': false,
      'orgs': false
    },
    'site_admin': false,
    'suspended': false
  },
  'search': {
    'repositories': false,
    'issues': false,
    'users': false,
    'code': false
  },
  'gists': {
    'public': false,
    'starred': false,
    'star': false,
    'comments': false,
    'forks': false
  },
  'repos': {
    'readme': false,
    'tarball': false,
    'zipball': false,
    'compare': false,
    'deployments': {
      'statuses': false
    },
    'hooks': {
      'tests': false
    },
    'assignees': false,
    'languages': false,
    'teams': false,
    'tags': false,
    'branches': false,
    'contributors': false,
    'subscribers': false,
    'subscription': false,
    'stargazers': false,
    'comments': false,
    'downloads': false,
    'forks': false,
    'milestones': {
      'labels': false
    },
    'labels': false,
    'releases': {
      'assets': false,
      'latest': false,
      'tags': false
    },
    'events': false,
    'notifications': false,
    'merges': false,
    'statuses': false,
    'pulls': {
      'merge': false,
      'comments': false,
      'commits': false,
      'files': false,
      'events': false,
      'labels': false
    },
    'pages': {
      'builds': {
        'latest': false
      }
    },
    'commits': {
      'comments': false,
      'status': false,
      'statuses': false
    },
    'contents': false,
    'collaborators': false,
    'issues': {
      'events': false,
      'comments': false,
      'labels': false
    },
    'git': {
      'refs': {
        'heads': false,
        'tags': false
      },
      'trees': false,
      'blobs': false,
      'commits': false
    },
    'stats': {
      'contributors': false,
      'commit_activity': false,
      'code_frequency': false,
      'participation': false,
      'punch_card': false
    }
  },
  'licenses': false,
  'authorizations': {
    'clients': false
  },
  'applications': {
    'tokens': false
  },
  'enterprise': {
    'settings': {
      'license': false
    },
    'stats': {
      'issues': false,
      'hooks': false,
      'milestones': false,
      'orgs': false,
      'comments': false,
      'pages': false,
      'users': false,
      'gists': false,
      'pulls': false,
      'repos': false,
      'all': false
    }
  },
  'staff': {
    'indexing_jobs': false
  },
  'setup': {
    'api': {
      'start': false,
      'upgrade': false,
      'configcheck': false,
      'configure': false,
      'settings': {
        'authorized-keys': false
      },
      'maintenance': false
    }
  }
};


},{}],9:[function(require,module,exports){
module.exports = /^(https:\/\/status.github.com\/api\/(status.json|last-message.json|messages.json)$)|(https?:\/\/[^\/]+)?(\/api\/v3)?\/(zen|octocat|users|organizations|issues|gists|emojis|markdown|meta|rate_limit|feeds|events|notifications|notifications\/threads(\/[^\/]+)|notifications\/threads(\/[^\/]+)\/subscription|gitignore\/templates(\/[^\/]+)?|user(\/\d+)?|user(\/\d+)?\/(|repos|orgs|followers|following(\/[^\/]+)?|emails(\/[^\/]+)?|issues|starred|starred(\/[^\/]+){2}|teams)|orgs\/[^\/]+|orgs\/[^\/]+\/(repos|issues|members|events|teams)|teams\/[^\/]+|teams\/[^\/]+\/(members(\/[^\/]+)?|memberships\/[^\/]+|repos|repos(\/[^\/]+){2})|users\/[^\/]+|users\/[^\/]+\/(repos|orgs|gists|followers|following(\/[^\/]+){0,2}|keys|starred|received_events(\/public)?|events(\/public)?|events\/orgs\/[^\/]+)|search\/(repositories|issues|users|code)|gists\/(public|starred|([a-f0-9]{20}|[0-9]+)|([a-f0-9]{20}|[0-9]+)\/forks|([a-f0-9]{20}|[0-9]+)\/comments(\/[0-9]+)?|([a-f0-9]{20}|[0-9]+)\/star)|repos(\/[^\/]+){2}|repos(\/[^\/]+){2}\/(readme|tarball(\/[^\/]+)?|zipball(\/[^\/]+)?|compare\/([^\.{3}]+)\.{3}([^\.{3}]+)|deployments(\/[0-9]+)?|deployments\/[0-9]+\/statuses(\/[0-9]+)?|hooks|hooks\/[^\/]+|hooks\/[^\/]+\/tests|assignees|languages|teams|tags|branches(\/[^\/]+){0,2}|contributors|subscribers|subscription|stargazers|comments(\/[0-9]+)?|downloads(\/[0-9]+)?|forks|milestones|milestones\/[0-9]+|milestones\/[0-9]+\/labels|labels(\/[^\/]+)?|releases|releases\/([0-9]+)|releases\/([0-9]+)\/assets|releases\/latest|releases\/tags\/([^\/]+)|releases\/assets\/([0-9]+)|events|notifications|merges|statuses\/[a-f0-9]{40}|pages|pages\/builds|pages\/builds\/latest|commits|commits\/[a-f0-9]{40}|commits\/[a-f0-9]{40}\/(comments|status|statuses)?|contents\/|contents(\/[^\/]+)*|collaborators(\/[^\/]+)?|(issues|pulls)|(issues|pulls)\/(events|events\/[0-9]+|comments(\/[0-9]+)?|[0-9]+|[0-9]+\/events|[0-9]+\/comments|[0-9]+\/labels(\/[^\/]+)?)|pulls\/[0-9]+\/(files|commits)|git\/(refs|refs\/(.+|heads(\/[^\/]+)?|tags(\/[^\/]+)?)|trees(\/[^\/]+)?|blobs(\/[a-f0-9]{40}$)?|commits(\/[a-f0-9]{40}$)?)|stats\/(contributors|commit_activity|code_frequency|participation|punch_card))|licenses|licenses\/([^\/]+)|authorizations|authorizations\/((\d+)|clients\/([^\/]{20})|clients\/([^\/]{20})\/([^\/]+))|applications\/([^\/]{20})\/tokens|applications\/([^\/]{20})\/tokens\/([^\/]+)|enterprise\/(settings\/license|stats\/(issues|hooks|milestones|orgs|comments|pages|users|gists|pulls|repos|all))|staff\/indexing_jobs|users\/[^\/]+\/(site_admin|suspended)|setup\/api\/(start|upgrade|configcheck|configure|settings(authorized-keys)?|maintenance))(\?.*)?$/;


},{}],10:[function(require,module,exports){
(function (global){
var base64encode;

if (typeof window !== "undefined" && window !== null) {
  base64encode = window.btoa;
} else if (typeof global !== "undefined" && global !== null ? global['Buffer'] : void 0) {
  base64encode = function(str) {
    var buffer;
    buffer = new global['Buffer'](str, 'binary');
    return buffer.toString('base64');
  };
} else {
  throw new Error('Native btoa function or Buffer is missing');
}

module.exports = base64encode;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],11:[function(require,module,exports){
var deprecate, toQueryString,
  slice = [].slice;

toQueryString = require('./querystring');

deprecate = require('../deprecate');

module.exports = function() {
  var args, fieldName, fieldValue, i, j, k, len, len1, m, match, optionalNames, optionalParams, param, templateParams, url;
  url = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
  if (args.length === 0) {
    templateParams = {};
  } else {
    if (args.length > 1) {
      deprecate('When filling in a template URL pass all the field to fill in 1 object instead of comma-separated args');
    }
    templateParams = args[0];
  }
  i = 0;
  while (m = /(\{[^\}]+\})/.exec(url)) {
    match = m[1];
    param = '';
    switch (match[1]) {
      case '/':
        fieldName = match.slice(2, match.length - 1);
        fieldValue = templateParams[fieldName];
        if (fieldValue) {
          if (/\//.test(fieldValue)) {
            throw new Error("Octokat Error: this field must not contain slashes: " + fieldName);
          }
          param = "/" + fieldValue;
        }
        break;
      case '+':
        fieldName = match.slice(2, match.length - 1);
        fieldValue = templateParams[fieldName];
        if (fieldValue) {
          param = fieldValue;
        }
        break;
      case '?':
        optionalNames = match.slice(2, -1).split(',');
        optionalParams = {};
        for (j = 0, len = optionalNames.length; j < len; j++) {
          fieldName = optionalNames[j];
          optionalParams[fieldName] = templateParams[fieldName];
        }
        param = toQueryString(optionalParams);
        break;
      case '&':
        optionalNames = match.slice(2, -1).split(',');
        optionalParams = {};
        for (k = 0, len1 = optionalNames.length; k < len1; k++) {
          fieldName = optionalNames[k];
          optionalParams[fieldName] = templateParams[fieldName];
        }
        param = toQueryString(optionalParams, true);
        break;
      default:
        fieldName = match.slice(1, match.length - 1);
        if (templateParams[fieldName]) {
          param = templateParams[fieldName];
        } else {
          throw new Error("Octokat Error: Required parameter is missing: " + fieldName);
        }
    }
    url = url.replace(match, param);
    i++;
  }
  return url;
};


},{"../deprecate":5,"./querystring":15}],12:[function(require,module,exports){
var allPromises, injector, newPromise, ref,
  slice = [].slice;

if (typeof window !== "undefined" && window !== null) {
  if (window.Q) {
    newPromise = (function(_this) {
      return function(fn) {
        var deferred, reject, resolve;
        deferred = window.Q.defer();
        resolve = function(val) {
          return deferred.resolve(val);
        };
        reject = function(err) {
          return deferred.reject(err);
        };
        fn(resolve, reject);
        return deferred.promise;
      };
    })(this);
    allPromises = function(promises) {
      return window.Q.all(promises);
    };
  } else if (window.angular) {
    newPromise = null;
    allPromises = null;
    injector = angular.injector(['ng']);
    injector.invoke(function($q) {
      newPromise = function(fn) {
        var deferred, reject, resolve;
        deferred = $q.defer();
        resolve = function(val) {
          return deferred.resolve(val);
        };
        reject = function(err) {
          return deferred.reject(err);
        };
        fn(resolve, reject);
        return deferred.promise;
      };
      return allPromises = function(promises) {
        return $q.all(promises);
      };
    });
  } else if ((ref = window.jQuery) != null ? ref.Deferred : void 0) {
    newPromise = (function(_this) {
      return function(fn) {
        var promise, reject, resolve;
        promise = window.jQuery.Deferred();
        resolve = function(val) {
          return promise.resolve(val);
        };
        reject = function(val) {
          return promise.reject(val);
        };
        fn(resolve, reject);
        return promise.promise();
      };
    })(this);
    allPromises = (function(_this) {
      return function(promises) {
        var ref1;
        return (ref1 = window.jQuery).when.apply(ref1, promises).then(function() {
          var promises;
          promises = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          return promises;
        });
      };
    })(this);
  }
}

module.exports = {
  newPromise: newPromise,
  allPromises: allPromises
};


},{}],13:[function(require,module,exports){
var allPromises, newPromise;

if (typeof Promise !== "undefined" && Promise !== null) {
  newPromise = (function(_this) {
    return function(fn) {
      return new Promise(function(resolve, reject) {
        if (resolve.fulfill) {
          return fn(resolve.resolve.bind(resolve), resolve.reject.bind(resolve));
        } else {
          return fn.apply(null, arguments);
        }
      });
    };
  })(this);
  allPromises = (function(_this) {
    return function(promises) {
      return Promise.all(promises);
    };
  })(this);
}

module.exports = {
  newPromise: newPromise,
  allPromises: allPromises
};


},{}],14:[function(require,module,exports){
var Promise, allPromises, newPromise, req;

req = require;

Promise = this.Promise || req('es6-promise').Promise;

newPromise = function(fn) {
  return new Promise(fn);
};

allPromises = function(promises) {
  return Promise.all(promises);
};

module.exports = {
  newPromise: newPromise,
  allPromises: allPromises
};


},{}],15:[function(require,module,exports){
var toQueryString;

toQueryString = function(options, omitQuestionMark) {
  var key, params, ref, value;
  if (!options || options === {}) {
    return '';
  }
  params = [];
  ref = options || {};
  for (key in ref) {
    value = ref[key];
    if (value) {
      params.push(key + "=" + (encodeURIComponent(value)));
    }
  }
  if (params.length) {
    if (omitQuestionMark) {
      return "&" + (params.join('&'));
    } else {
      return "?" + (params.join('&'));
    }
  } else {
    return '';
  }
};

module.exports = toQueryString;


},{}],16:[function(require,module,exports){
var ALL_PLUGINS, HypermediaPlugin, Octokat, OctokatBase, deprecate;

deprecate = require('./deprecate');

OctokatBase = require('./base');

HypermediaPlugin = require('./plugins/hypermedia');

ALL_PLUGINS = [require('./plugins/promise/library-first'), require('./plugins/path-validator'), require('./plugins/authorization'), require('./plugins/preview-apis'), require('./plugins/use-post-instead-of-patch'), require('./plugins/simple-verbs'), require('./plugins/fetch-all'), require('./plugins/read-binary'), require('./plugins/pagination'), require('./plugins/cache-handler'), HypermediaPlugin, require('./plugins/camel-case')];

Octokat = function(clientOptions) {
  var instance;
  if (clientOptions == null) {
    clientOptions = {};
  }
  if (clientOptions.plugins == null) {
    clientOptions.plugins = ALL_PLUGINS;
  }
  if (clientOptions.disableHypermedia) {
    deprecate('Please use the clientOptions.plugins array and just do not include the hypermedia plugin');
    clientOptions.plugins = clientOptions.plugins.filter(function(plugin) {
      return plugin !== HypermediaPlugin;
    });
  }
  instance = new OctokatBase(clientOptions);
  return instance;
};

module.exports = Octokat;


},{"./base":3,"./deprecate":5,"./plugins/authorization":17,"./plugins/cache-handler":18,"./plugins/camel-case":19,"./plugins/fetch-all":20,"./plugins/hypermedia":21,"./plugins/pagination":22,"./plugins/path-validator":23,"./plugins/preview-apis":24,"./plugins/promise/library-first":25,"./plugins/read-binary":26,"./plugins/simple-verbs":27,"./plugins/use-post-instead-of-patch":28}],17:[function(require,module,exports){
var Authorization, base64encode;

base64encode = require('../helpers/base64');

module.exports = new (Authorization = (function() {
  function Authorization() {}

  Authorization.prototype.requestMiddleware = function(arg) {
    var auth, password, ref, token, username;
    ref = arg.clientOptions, token = ref.token, username = ref.username, password = ref.password;
    if (token || (username && password)) {
      if (token) {
        auth = "token " + token;
      } else {
        auth = 'Basic ' + base64encode(username + ":" + password);
      }
      return {
        headers: {
          'Authorization': auth
        }
      };
    }
  };

  return Authorization;

})());


},{"../helpers/base64":10}],18:[function(require,module,exports){
var CacheHandler;

module.exports = new (CacheHandler = (function() {
  function CacheHandler() {
    this._cachedETags = {};
  }

  CacheHandler.prototype.get = function(method, path) {
    return this._cachedETags[method + " " + path];
  };

  CacheHandler.prototype.add = function(method, path, eTag, data, status) {
    return this._cachedETags[method + " " + path] = {
      eTag: eTag,
      data: data,
      status: status
    };
  };

  CacheHandler.prototype.requestMiddleware = function(arg) {
    var cacheHandler, clientOptions, headers, method, path;
    clientOptions = arg.clientOptions, method = arg.method, path = arg.path;
    headers = {};
    cacheHandler = clientOptions.cacheHandler || this;
    if (cacheHandler.get(method, path)) {
      headers['If-None-Match'] = cacheHandler.get(method, path).eTag;
    } else {
      headers['If-Modified-Since'] = 'Thu, 01 Jan 1970 00:00:00 GMT';
    }
    return {
      headers: headers
    };
  };

  CacheHandler.prototype.responseMiddleware = function(arg) {
    var cacheHandler, clientOptions, data, eTag, jqXHR, method, path, ref, request, status;
    clientOptions = arg.clientOptions, request = arg.request, status = arg.status, jqXHR = arg.jqXHR, data = arg.data;
    if (!jqXHR) {
      return;
    }
    if (jqXHR) {
      method = request.method, path = request.path;
      cacheHandler = clientOptions.cacheHandler || this;
      if (status === 304) {
        ref = cacheHandler.get(method, path), data = ref.data, status = ref.status;
      } else {
        if (method === 'GET' && jqXHR.getResponseHeader('ETag')) {
          eTag = jqXHR.getResponseHeader('ETag');
          cacheHandler.add(method, path, eTag, data, jqXHR.status);
        }
      }
      return {
        data: data,
        status: status
      };
    }
  };

  return CacheHandler;

})());


},{}],19:[function(require,module,exports){
var CamelCase, plus;

plus = require('../plus');

module.exports = new (CamelCase = (function() {
  function CamelCase() {}

  CamelCase.prototype.responseMiddleware = function(arg) {
    var data;
    data = arg.data;
    data = this.replace(data);
    return {
      data: data
    };
  };

  CamelCase.prototype.replace = function(data) {
    if (Array.isArray(data)) {
      return this._replaceArray(data);
    } else if (typeof data === 'function') {
      return data;
    } else if (data instanceof Date) {
      return data;
    } else if (data === Object(data)) {
      return this._replaceObject(data);
    } else {
      return data;
    }
  };

  CamelCase.prototype._replaceObject = function(orig) {
    var acc, i, key, len, ref, value;
    acc = {};
    ref = Object.keys(orig);
    for (i = 0, len = ref.length; i < len; i++) {
      key = ref[i];
      value = orig[key];
      this._replaceKeyValue(acc, key, value);
    }
    return acc;
  };

  CamelCase.prototype._replaceArray = function(orig) {
    var arr, i, item, key, len, ref, value;
    arr = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = orig.length; i < len; i++) {
        item = orig[i];
        results.push(this.replace(item));
      }
      return results;
    }).call(this);
    ref = Object.keys(orig);
    for (i = 0, len = ref.length; i < len; i++) {
      key = ref[i];
      value = orig[key];
      this._replaceKeyValue(arr, key, value);
    }
    return arr;
  };

  CamelCase.prototype._replaceKeyValue = function(acc, key, value) {
    return acc[plus.camelize(key)] = this.replace(value);
  };

  return CamelCase;

})());


},{"../plus":29}],20:[function(require,module,exports){
var FetchAll, fetchNextPage, getMore, pushAll, toQueryString;

toQueryString = require('../helpers/querystring');

pushAll = function(target, source) {
  return target.push.apply(target, source);
};

getMore = function(fetchable, requester, acc, cb) {
  var doStuff;
  doStuff = function(err, items) {
    if (err) {
      return cb(err);
    }
    pushAll(acc, items);
    return getMore(items, requester, acc, cb);
  };
  if (!fetchNextPage(fetchable, requester, doStuff)) {
    return cb(null, acc);
  }
};

fetchNextPage = function(obj, requester, cb) {
  if (typeof obj.next_page === 'string') {
    requester.request('GET', obj.next_page, null, null, cb);
    return true;
  } else if (obj.next_page) {
    obj.next_page.fetch(cb);
    return true;
  } else if (typeof obj.nextPage === 'string') {
    requester.request('GET', obj.nextPage, null, null, cb);
    return true;
  } else if (obj.nextPage) {
    obj.nextPage.fetch(cb);
    return true;
  } else {
    return false;
  }
};

module.exports = new (FetchAll = (function() {
  function FetchAll() {}

  FetchAll.prototype.asyncVerbs = {
    fetchAll: function(requester, path) {
      return function(cb, query) {
        return requester.request('GET', "" + path + (toQueryString(query)), null, null, function(err, items) {
          var acc;
          if (err) {
            return cb(err);
          }
          acc = [];
          pushAll(acc, items);
          return getMore(items, requester, acc, cb);
        });
      };
    }
  };

  return FetchAll;

})());


},{"../helpers/querystring":15}],21:[function(require,module,exports){
var HyperMedia, deprecate,
  slice = [].slice;

deprecate = require('../deprecate');

module.exports = new (HyperMedia = (function() {
  function HyperMedia() {}

  HyperMedia.prototype.replace = function(instance, data) {
    if (Array.isArray(data)) {
      return this._replaceArray(instance, data);
    } else if (typeof data === 'function') {
      return data;
    } else if (data instanceof Date) {
      return data;
    } else if (data === Object(data)) {
      return this._replaceObject(instance, data);
    } else {
      return data;
    }
  };

  HyperMedia.prototype._replaceObject = function(instance, orig) {
    var acc, i, key, len, ref, value;
    acc = {};
    ref = Object.keys(orig);
    for (i = 0, len = ref.length; i < len; i++) {
      key = ref[i];
      value = orig[key];
      this._replaceKeyValue(instance, acc, key, value);
    }
    return acc;
  };

  HyperMedia.prototype._replaceArray = function(instance, orig) {
    var arr, i, item, key, len, ref, value;
    arr = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = orig.length; i < len; i++) {
        item = orig[i];
        results.push(this.replace(instance, item));
      }
      return results;
    }).call(this);
    ref = Object.keys(orig);
    for (i = 0, len = ref.length; i < len; i++) {
      key = ref[i];
      value = orig[key];
      this._replaceKeyValue(instance, arr, key, value);
    }
    return arr;
  };

  HyperMedia.prototype._replaceKeyValue = function(instance, acc, key, value) {
    var defaultFn, fn, newKey;
    if (/_url$/.test(key)) {
      if (/^upload_url$/.test(key)) {
        defaultFn = function() {
          var args;
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          deprecate('call .upload({name, label}).create(data, contentType)' + ' instead of .upload(name, data, contentType)');
          return defaultFn.create.apply(defaultFn, args);
        };
        fn = function() {
          var args;
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          return instance._fromUrlWithDefault.apply(instance, [value, defaultFn].concat(slice.call(args)))();
        };
      } else {
        defaultFn = function() {
          deprecate('instead of directly calling methods like .nextPage(), use .nextPage.fetch()');
          return this.fetch();
        };
        fn = instance._fromUrlCurried(value, defaultFn);
      }
      newKey = key.substring(0, key.length - '_url'.length);
      acc[newKey] = fn;
      if (!/\{/.test(value)) {
        return acc[key] = value;
      }
    } else if (/_at$/.test(key)) {
      return acc[key] = value ? new Date(value) : null;
    } else {
      return acc[key] = this.replace(instance, value);
    }
  };

  HyperMedia.prototype.responseMiddleware = function(arg) {
    var data, instance;
    instance = arg.instance, data = arg.data;
    data = this.replace(instance, data);
    return {
      data: data
    };
  };

  return HyperMedia;

})());


},{"../deprecate":5}],22:[function(require,module,exports){
var Pagination;

module.exports = new (Pagination = (function() {
  function Pagination() {}

  Pagination.prototype.responseMiddleware = function(arg) {
    var data, discard, href, i, jqXHR, len, links, part, ref, ref1, rel;
    jqXHR = arg.jqXHR, data = arg.data;
    if (!jqXHR) {
      return;
    }
    if (Array.isArray(data)) {
      data = data.slice(0);
      links = jqXHR.getResponseHeader('Link');
      ref = (links != null ? links.split(',') : void 0) || [];
      for (i = 0, len = ref.length; i < len; i++) {
        part = ref[i];
        ref1 = part.match(/<([^>]+)>;\ rel="([^"]+)"/), discard = ref1[0], href = ref1[1], rel = ref1[2];
        data[rel + "_page_url"] = href;
      }
      return {
        data: data
      };
    }
  };

  return Pagination;

})());


},{}],23:[function(require,module,exports){
var PathValidator, URL_VALIDATOR;

URL_VALIDATOR = require('../grammar/url-validator');

module.exports = new (PathValidator = (function() {
  function PathValidator() {}

  PathValidator.prototype.requestMiddleware = function(arg) {
    var err, path;
    path = arg.path;
    if (!URL_VALIDATOR.test(path)) {
      err = "Octokat BUG: Invalid Path. If this is actually a valid path then please update the URL_VALIDATOR. path=" + path;
      return console.warn(err);
    }
  };

  return PathValidator;

})());


},{"../grammar/url-validator":9}],24:[function(require,module,exports){
var DEFAULT_HEADER, PREVIEW_HEADERS, PreviewApis;

PREVIEW_HEADERS = require('../grammar/preview-headers');

DEFAULT_HEADER = function(url) {
  var key, val;
  for (key in PREVIEW_HEADERS) {
    val = PREVIEW_HEADERS[key];
    if (val.test(url)) {
      return key;
    }
  }
};

module.exports = new (PreviewApis = (function() {
  function PreviewApis() {}

  PreviewApis.prototype.requestMiddleware = function(arg) {
    var acceptHeader, path;
    path = arg.path;
    acceptHeader = DEFAULT_HEADER(path);
    if (acceptHeader) {
      return {
        headers: {
          'Accept': acceptHeader
        }
      };
    }
  };

  return PreviewApis;

})());


},{"../grammar/preview-headers":7}],25:[function(require,module,exports){
var PreferLibraryOverNativePromises, allPromises, newPromise, ref, ref1, ref2;

ref = require('../../helpers/promise-find-library'), newPromise = ref.newPromise, allPromises = ref.allPromises;

if (!(newPromise && allPromises)) {
  ref1 = require('../../helpers/promise-find-native'), newPromise = ref1.newPromise, allPromises = ref1.allPromises;
}

if (!((typeof window !== "undefined" && window !== null) || newPromise)) {
  ref2 = require('../../helpers/promise-node'), newPromise = ref2.newPromise, allPromises = ref2.allPromises;
}

if ((typeof window !== "undefined" && window !== null) && !newPromise) {
  if (typeof console !== "undefined" && console !== null) {
    if (typeof console.warn === "function") {
      console.warn('Octokat: A Promise API was not found. Supported libraries that have Promises are jQuery, angularjs, and es6-promise');
    }
  }
} else if ((typeof window === "undefined" || window === null) && !newPromise) {
  throw new Error('Could not find a promise lib for node. Seems like a bug');
}

module.exports = new (PreferLibraryOverNativePromises = (function() {
  function PreferLibraryOverNativePromises() {}

  PreferLibraryOverNativePromises.prototype.promiseCreator = {
    newPromise: newPromise,
    allPromises: allPromises
  };

  return PreferLibraryOverNativePromises;

})());


},{"../../helpers/promise-find-library":12,"../../helpers/promise-find-native":13,"../../helpers/promise-node":14}],26:[function(require,module,exports){
var ReadBinary, toQueryString;

toQueryString = require('../helpers/querystring');

module.exports = new (ReadBinary = (function() {
  function ReadBinary() {}

  ReadBinary.prototype.verbs = {
    readBinary: function(path, query) {
      return {
        method: 'GET',
        path: "" + path + (toQueryString(query)),
        options: {
          isRaw: true,
          isBase64: true
        }
      };
    }
  };

  ReadBinary.prototype.requestMiddleware = function(arg) {
    var isBase64, options;
    options = arg.options;
    isBase64 = options.isBase64;
    if (isBase64) {
      return {
        headers: {
          Accept: 'application/vnd.github.raw'
        },
        mimeType: 'text/plain; charset=x-user-defined'
      };
    }
  };

  ReadBinary.prototype.responseMiddleware = function(arg) {
    var converted, data, i, isBase64, j, options, ref;
    options = arg.options, data = arg.data;
    isBase64 = options.isBase64;
    if (isBase64) {
      converted = '';
      for (i = j = 0, ref = data.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        converted += String.fromCharCode(data.charCodeAt(i) & 0xff);
      }
      return {
        data: converted
      };
    }
  };

  return ReadBinary;

})());


},{"../helpers/querystring":15}],27:[function(require,module,exports){
var SimpleVerbs, toQueryString,
  slice = [].slice;

toQueryString = require('../helpers/querystring');

module.exports = new (SimpleVerbs = (function() {
  function SimpleVerbs() {}

  SimpleVerbs.prototype.verbs = {
    fetch: function(path, query) {
      return {
        method: 'GET',
        path: "" + path + (toQueryString(query))
      };
    },
    read: function(path, query) {
      return {
        method: 'GET',
        path: "" + path + (toQueryString(query)),
        options: {
          isRaw: true
        }
      };
    },
    remove: function(path, data) {
      return {
        method: 'DELETE',
        path: path,
        data: data,
        options: {
          isBoolean: true
        }
      };
    },
    create: function(path, data, contentType) {
      if (contentType) {
        return {
          method: 'POST',
          path: path,
          data: data,
          options: {
            isRaw: true,
            contentType: contentType
          }
        };
      } else {
        return {
          method: 'POST',
          path: path,
          data: data
        };
      }
    },
    update: function(path, data) {
      return {
        method: 'PATCH',
        path: path,
        data: data
      };
    },
    add: function(path, data) {
      return {
        method: 'PUT',
        path: path,
        data: data,
        options: {
          isBoolean: true
        }
      };
    },
    contains: function() {
      var args, path;
      path = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      return {
        method: 'GET',
        path: path + "/" + (args.join('/')),
        options: {
          isBoolean: true
        }
      };
    }
  };

  return SimpleVerbs;

})());


},{"../helpers/querystring":15}],28:[function(require,module,exports){
var UsePostInsteadOfPatch;

module.exports = new (UsePostInsteadOfPatch = (function() {
  function UsePostInsteadOfPatch() {}

  UsePostInsteadOfPatch.prototype.requestMiddleware = function(arg) {
    var method, ref, usePostInsteadOfPatch;
    (ref = arg.clientOptions, usePostInsteadOfPatch = ref.usePostInsteadOfPatch), method = arg.method;
    if (usePostInsteadOfPatch && method === 'PATCH') {
      return {
        method: 'POST'
      };
    }
  };

  return UsePostInsteadOfPatch;

})());


},{}],29:[function(require,module,exports){
var filter, forEach, plus;

filter = require('lodash/internal/arrayFilter');

forEach = require('lodash/internal/arrayEach');

plus = {
  camelize: function(string) {
    if (string) {
      return string.replace(/[_-]+(\w)/g, function(m) {
        return m[1].toUpperCase();
      });
    } else {
      return '';
    }
  },
  uncamelize: function(string) {
    if (!string) {
      return '';
    }
    return string.replace(/([A-Z])+/g, function(match, letter) {
      if (letter == null) {
        letter = '';
      }
      return "_" + (letter.toLowerCase());
    });
  },
  dasherize: function(string) {
    if (!string) {
      return '';
    }
    string = string[0].toLowerCase() + string.slice(1);
    return string.replace(/([A-Z])|(_)/g, function(m, letter) {
      if (letter) {
        return '-' + letter.toLowerCase();
      } else {
        return '-';
      }
    });
  },
  extend: function(target, source) {
    var i, key, len, ref, results;
    if (source) {
      ref = Object.keys(source);
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        key = ref[i];
        results.push(target[key] = source[key]);
      }
      return results;
    }
  },
  forOwn: function(obj, iterator) {
    var i, key, len, ref, results;
    ref = Object.keys(obj);
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      key = ref[i];
      results.push(iterator(obj[key], key));
    }
    return results;
  },
  filter: filter,
  forEach: forEach
};

module.exports = plus;


},{"lodash/internal/arrayEach":1,"lodash/internal/arrayFilter":2}],30:[function(require,module,exports){
var Requester, ajax, eventId, extend, filter, forEach, ref;

ref = require('./plus'), filter = ref.filter, forEach = ref.forEach, extend = ref.extend;

ajax = function(options, cb) {
  var XMLHttpRequest, name, ref1, req, value, xhr;
  if (typeof window !== "undefined" && window !== null) {
    XMLHttpRequest = window.XMLHttpRequest;
  } else {
    req = require;
    XMLHttpRequest = req('xmlhttprequest').XMLHttpRequest;
  }
  xhr = new XMLHttpRequest();
  xhr.dataType = options.dataType;
  if (typeof xhr.overrideMimeType === "function") {
    xhr.overrideMimeType(options.mimeType);
  }
  xhr.open(options.type, options.url);
  if (options.data && options.type !== 'GET') {
    xhr.setRequestHeader('Content-Type', options.contentType);
  }
  ref1 = options.headers;
  for (name in ref1) {
    value = ref1[name];
    xhr.setRequestHeader(name, value);
  }
  xhr.onreadystatechange = function() {
    var name1, ref2;
    if (4 === xhr.readyState) {
      if ((ref2 = options.statusCode) != null) {
        if (typeof ref2[name1 = xhr.status] === "function") {
          ref2[name1]();
        }
      }
      if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304 || xhr.status === 302) {
        return cb(null, xhr);
      } else {
        return cb(xhr);
      }
    }
  };
  return xhr.send(options.data);
};

eventId = 0;

module.exports = Requester = (function() {
  function Requester(_instance, _clientOptions, plugins) {
    var base, base1, base2;
    this._instance = _instance;
    this._clientOptions = _clientOptions != null ? _clientOptions : {};
    if ((base = this._clientOptions).rootURL == null) {
      base.rootURL = 'https://api.github.com';
    }
    if ((base1 = this._clientOptions).useETags == null) {
      base1.useETags = true;
    }
    if ((base2 = this._clientOptions).usePostInsteadOfPatch == null) {
      base2.usePostInsteadOfPatch = false;
    }
    if (typeof this._clientOptions.emitter === 'function') {
      this._emit = this._clientOptions.emitter;
    }
    this._pluginMiddleware = filter(plugins, function(arg) {
      var requestMiddleware;
      requestMiddleware = arg.requestMiddleware;
      return requestMiddleware;
    });
  }

  Requester.prototype.request = function(method, path, data, options, cb) {
    var acc, ajaxConfig, headers, mimeType;
    if (options == null) {
      options = {
        isRaw: false,
        isBase64: false,
        isBoolean: false,
        contentType: 'application/json'
      };
    }
    if (options == null) {
      options = {};
    }
    if (options.isRaw == null) {
      options.isRaw = false;
    }
    if (options.isBase64 == null) {
      options.isBase64 = false;
    }
    if (options.isBoolean == null) {
      options.isBoolean = false;
    }
    if (options.contentType == null) {
      options.contentType = 'application/json';
    }
    if (!/^http/.test(path)) {
      path = "" + this._clientOptions.rootURL + path;
    }
    headers = {
      'Accept': this._clientOptions.acceptHeader || 'application/json'
    };
    if (typeof window === "undefined" || window === null) {
      headers['User-Agent'] = 'octokat.js';
    }
    acc = {
      method: method,
      path: path,
      headers: headers,
      options: options,
      clientOptions: this._clientOptions
    };
    forEach(this._pluginMiddleware, function(plugin) {
      var mimeType, ref1;
      ref1 = plugin.requestMiddleware(acc) || {}, method = ref1.method, headers = ref1.headers, mimeType = ref1.mimeType;
      if (method) {
        acc.method = method;
      }
      if (mimeType) {
        acc.mimeType = mimeType;
      }
      return extend(acc.headers, headers);
    });
    method = acc.method, headers = acc.headers, mimeType = acc.mimeType;
    if (options.isRaw) {
      headers['Accept'] = 'application/vnd.github.raw';
    }
    ajaxConfig = {
      url: path,
      type: method,
      contentType: options.contentType,
      mimeType: mimeType,
      headers: headers,
      processData: false,
      data: !options.isRaw && data && JSON.stringify(data) || data,
      dataType: !options.isRaw ? 'json' : void 0
    };
    if (options.isBoolean) {
      ajaxConfig.statusCode = {
        204: (function(_this) {
          return function() {
            return cb(null, true);
          };
        })(this),
        404: (function(_this) {
          return function() {
            return cb(null, false);
          };
        })(this)
      };
    }
    eventId++;
    if (typeof this._emit === "function") {
      this._emit('start', eventId, {
        method: method,
        path: path,
        data: data,
        options: options
      });
    }
    return ajax(ajaxConfig, (function(_this) {
      return function(err, val) {
        var emitterRate, jqXHR, json, rateLimit, rateLimitRemaining, rateLimitReset;
        jqXHR = err || val;
        if (_this._emit) {
          if (jqXHR.getResponseHeader('X-RateLimit-Limit')) {
            rateLimit = parseFloat(jqXHR.getResponseHeader('X-RateLimit-Limit'));
            rateLimitRemaining = parseFloat(jqXHR.getResponseHeader('X-RateLimit-Remaining'));
            rateLimitReset = parseFloat(jqXHR.getResponseHeader('X-RateLimit-Reset'));
            emitterRate = {
              remaining: rateLimitRemaining,
              limit: rateLimit,
              reset: rateLimitReset
            };
            if (jqXHR.getResponseHeader('X-OAuth-Scopes')) {
              emitterRate.scopes = jqXHR.getResponseHeader('X-OAuth-Scopes').split(', ');
            }
          }
          _this._emit('end', eventId, {
            method: method,
            path: path,
            data: data,
            options: options
          }, jqXHR.status, emitterRate);
        }
        if (!err) {
          if (jqXHR.status === 302) {
            return cb(null, jqXHR.getResponseHeader('Location'));
          } else if (!(jqXHR.status === 204 && options.isBoolean)) {
            if (jqXHR.responseText && ajaxConfig.dataType === 'json') {
              data = JSON.parse(jqXHR.responseText);
            } else {
              data = jqXHR.responseText;
            }
            acc = {
              clientOptions: _this._clientOptions,
              data: data,
              options: options,
              jqXHR: jqXHR,
              status: jqXHR.status,
              request: acc,
              requester: _this,
              instance: _this._instance
            };
            data = _this._instance._parseWithContext('', acc);
            return cb(null, data, jqXHR.status, jqXHR);
          }
        } else {
          if (options.isBoolean && jqXHR.status === 404) {

          } else {
            err = new Error(jqXHR.responseText);
            err.status = jqXHR.status;
            if (jqXHR.getResponseHeader('Content-Type') === 'application/json; charset=utf-8') {
              if (jqXHR.responseText) {
                json = JSON.parse(jqXHR.responseText);
              } else {
                json = '';
              }
              err.json = json;
            }
            return cb(err);
          }
        }
      };
    })(this));
  };

  return Requester;

})();


},{"./plus":29}],31:[function(require,module,exports){
var VerbMethods, extend, filter, forOwn, ref, toPromise, toQueryString,
  slice = [].slice;

ref = require('./plus'), filter = ref.filter, forOwn = ref.forOwn, extend = ref.extend;

toQueryString = require('./helpers/querystring');

toPromise = function(orig, newPromise) {
  return function() {
    var args, last;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    last = args[args.length - 1];
    if (typeof last === 'function') {
      args.pop();
      return orig.apply(null, [last].concat(slice.call(args)));
    } else if (newPromise) {
      return newPromise(function(resolve, reject) {
        var cb;
        cb = function(err, val) {
          if (err) {
            return reject(err);
          }
          return resolve(val);
        };
        return orig.apply(null, [cb].concat(slice.call(args)));
      });
    } else {
      throw new Error('You must specify a callback or have a promise library loaded');
    }
  };
};

module.exports = VerbMethods = (function() {
  function VerbMethods(plugins, _requester) {
    var i, j, len, len1, plugin, promisePlugins, ref1, ref2;
    this._requester = _requester;
    if (!this._requester) {
      throw new Error('Octokat BUG: request is required');
    }
    promisePlugins = filter(plugins, function(arg) {
      var promiseCreator;
      promiseCreator = arg.promiseCreator;
      return promiseCreator;
    });
    if (promisePlugins) {
      this._promisePlugin = promisePlugins[0];
    }
    this._syncVerbs = {};
    ref1 = filter(plugins, function(arg) {
      var verbs;
      verbs = arg.verbs;
      return verbs;
    });
    for (i = 0, len = ref1.length; i < len; i++) {
      plugin = ref1[i];
      extend(this._syncVerbs, plugin.verbs);
    }
    this._asyncVerbs = {};
    ref2 = filter(plugins, function(arg) {
      var asyncVerbs;
      asyncVerbs = arg.asyncVerbs;
      return asyncVerbs;
    });
    for (j = 0, len1 = ref2.length; j < len1; j++) {
      plugin = ref2[j];
      extend(this._asyncVerbs, plugin.asyncVerbs);
    }
  }

  VerbMethods.prototype.injectVerbMethods = function(path, obj) {
    var allPromises, newPromise, ref1;
    if (this._promisePlugin) {
      ref1 = this._promisePlugin.promiseCreator, newPromise = ref1.newPromise, allPromises = ref1.allPromises;
    }
    obj.url = path;
    forOwn(this._syncVerbs, (function(_this) {
      return function(verbFunc, verbName) {
        return obj[verbName] = function() {
          var args, makeRequest;
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          makeRequest = function() {
            var cb, data, method, options, originalArgs, ref2;
            cb = arguments[0], originalArgs = 2 <= arguments.length ? slice.call(arguments, 1) : [];
            ref2 = verbFunc.apply(null, [path].concat(slice.call(originalArgs))), method = ref2.method, path = ref2.path, data = ref2.data, options = ref2.options;
            return _this._requester.request(method, path, data, options, cb);
          };
          return toPromise(makeRequest, newPromise).apply(null, args);
        };
      };
    })(this));
    return forOwn(this._asyncVerbs, (function(_this) {
      return function(verbFunc, verbName) {
        return obj[verbName] = function() {
          var args, makeRequest;
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          makeRequest = verbFunc(_this._requester, path);
          return toPromise(makeRequest, newPromise).apply(null, args);
        };
      };
    })(this));
  };

  return VerbMethods;

})();


},{"./helpers/querystring":15,"./plus":29}]},{},[16])(16)
});