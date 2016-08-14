(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Octokat = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Chainer, injectVerbMethods, plus,
  slice = [].slice;

plus = require('./plus');

injectVerbMethods = require('./verb-methods');

Chainer = function(plugins, request, path, name, contextTree, fn) {
  var fn1;
  if (fn == null) {
    fn = function() {
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
      return Chainer(plugins, request, path + "/" + (args.join(separator)), name, contextTree);
    };
  }
  injectVerbMethods(plugins, request, path, fn);
  if (typeof fn === 'function' || typeof fn === 'object') {
    fn1 = function(name) {
      delete fn[plus.camelize(name)];
      return Object.defineProperty(fn, plus.camelize(name), {
        configurable: true,
        enumerable: true,
        get: function() {
          return Chainer(plugins, request, path + "/" + name, name, contextTree[name]);
        }
      });
    };
    for (name in contextTree || {}) {
      fn1(name);
    }
  }
  return fn;
};

module.exports = Chainer;


},{"./plus":13,"./verb-methods":15}],2:[function(require,module,exports){
module.exports = function(message) {
  return typeof console !== "undefined" && console !== null ? typeof console.warn === "function" ? console.warn("Octokat Deprecation: " + message) : void 0 : void 0;
};


},{}],3:[function(require,module,exports){
var DEFAULT_HEADER, OBJECT_MATCHER, PREVIEW_HEADERS, TREE_OPTIONS, URL_VALIDATOR;

URL_VALIDATOR = /^(https:\/\/status.github.com\/api\/(status.json|last-message.json|messages.json)$)|(https?:\/\/[^\/]+)?(\/api\/v3)?\/(zen|octocat|users|organizations|issues|gists|emojis|markdown|meta|rate_limit|feeds|events|notifications|notifications\/threads(\/[^\/]+)|notifications\/threads(\/[^\/]+)\/subscription|gitignore\/templates(\/[^\/]+)?|user|user\/(repos|orgs|followers|following(\/[^\/]+)?|emails(\/[^\/]+)?|issues|starred|starred(\/[^\/]+){2}|teams)|orgs\/[^\/]+|orgs\/[^\/]+\/(repos|issues|members|events|teams)|teams\/[^\/]+|teams\/[^\/]+\/(members(\/[^\/]+)?|memberships\/[^\/]+|repos|repos(\/[^\/]+){2})|users\/[^\/]+|users\/[^\/]+\/(repos|orgs|gists|followers|following(\/[^\/]+){0,2}|keys|starred|received_events(\/public)?|events(\/public)?|events\/orgs\/[^\/]+)|search\/(repositories|issues|users|code)|gists\/(public|starred|([a-f0-9]{20}|[0-9]+)|([a-f0-9]{20}|[0-9]+)\/forks|([a-f0-9]{20}|[0-9]+)\/comments(\/[0-9]+)?|([a-f0-9]{20}|[0-9]+)\/star)|repos(\/[^\/]+){2}|repos(\/[^\/]+){2}\/(readme|tarball(\/[^\/]+)?|zipball(\/[^\/]+)?|compare\/([^\.{3}]+)\.{3}([^\.{3}]+)|deployments(\/[0-9]+)?|deployments\/[0-9]+\/statuses(\/[0-9]+)?|hooks|hooks\/[^\/]+|hooks\/[^\/]+\/tests|hooks\/[^\/]+\/pings|assignees|languages|teams|tags|branches(\/[^\/]+){0,2}|contributors|subscribers|subscription|stargazers|comments(\/[0-9]+)?|downloads(\/[0-9]+)?|forks|milestones|milestones\/[0-9]+|milestones\/[0-9]+\/labels|labels(\/[^\/]+)?|releases|releases\/([0-9]+)|releases\/([0-9]+)\/assets|releases\/latest|releases\/tags\/([^\/]+)|releases\/assets\/([0-9]+)|events|notifications|merges|statuses\/[^\/]+|pages|pages\/builds|pages\/builds\/latest|commits|commits\/[^\/]+|commits\/[^\/]+\/(comments|status|statuses)?|contents\/|contents(\/[^\/]+)*|collaborators(\/[^\/]+)?|(issues|pulls)|(issues|pulls)\/(events|events\/[0-9]+|comments(\/[0-9]+)?|[0-9]+|[0-9]+\/events|[0-9]+\/comments|[0-9]+\/labels(\/[^\/]+)?)|pulls\/[0-9]+\/(files|commits|merge)|git\/(refs|refs\/(.+|heads(\/[^\/]+)?|tags(\/[^\/]+)?)|trees(\/[^\/]+)?|blobs(\/[a-f0-9]{40}$)?|commits(\/[a-f0-9]{40}$)?)|stats\/(contributors|commit_activity|code_frequency|participation|punch_card))|licenses|licenses\/([^\/]+)|authorizations|authorizations\/((\d+)|clients\/([^\/]{20})|clients\/([^\/]{20})\/([^\/]+))|applications\/([^\/]{20})\/tokens|applications\/([^\/]{20})\/tokens\/([^\/]+)|enterprise\/(settings\/license|stats\/(issues|hooks|milestones|orgs|comments|pages|users|gists|pulls|repos|all))|staff\/indexing_jobs|users\/[^\/]+\/(site_admin|suspended)|setup\/api\/(start|upgrade|configcheck|configure|settings(authorized-keys)?|maintenance))(\?.*)?$/;

TREE_OPTIONS = {
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
      'tests': false,
      'pings': false
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

OBJECT_MATCHER = {
  'repos': /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/repos\/[^\/]+\/[^\/]+$/,
  'gists': /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/gists\/[^\/]+$/,
  'issues': /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/repos\/[^\/]+\/[^\/]+\/(issues|pulls)[^\/]+$/,
  'users': /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/users\/[^\/]+$/,
  'orgs': /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/orgs\/[^\/]+$/,
  'repos.comments': /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/repos\/[^\/]+\/[^\/]+\/comments\/[^\/]+$/
};

PREVIEW_HEADERS = {
  'application/vnd.github.drax-preview+json': /^(https?:\/\/[^\/]+)?(\/api\/v3)?(\/licenses|\/licenses\/([^\/]+)|\/repos\/([^\/]+)\/([^\/]+))$/,
  'application/vnd.github.v3.star+json': /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/users\/([^\/]+)\/starred$/,
  'application/vnd.github.mirage-preview+json': /^(https?:\/\/[^\/]+)?(\/api\/v3)?(\/authorizations|\/authorizations\/clients\/([^\/]{20})|\/authorizations\/clients\/([^\/]{20})\/([^\/]+)|\/authorizations\/([\d]+)|\/applications\/([^\/]{20})\/tokens|\/applications\/([^\/]{20})\/tokens\/([^\/]+))$/
};

DEFAULT_HEADER = function(url) {
  var key, val;
  for (key in PREVIEW_HEADERS) {
    val = PREVIEW_HEADERS[key];
    if (val.test(url)) {
      return key;
    }
  }
};

module.exports = {
  URL_VALIDATOR: URL_VALIDATOR,
  TREE_OPTIONS: TREE_OPTIONS,
  OBJECT_MATCHER: OBJECT_MATCHER,
  DEFAULT_HEADER: DEFAULT_HEADER
};


},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
var deprecate, toQueryString,
  slice = [].slice;

toQueryString = require('./helper-querystring');

deprecate = require('./deprecate');

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


},{"./deprecate":2,"./helper-querystring":7}],6:[function(require,module,exports){
var Promise, allPromises, injector, newPromise, ref, req, toPromise,
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
  } else if (window.Promise) {
    newPromise = (function(_this) {
      return function(fn) {
        return new window.Promise(function(resolve, reject) {
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
        return window.Promise.all(promises);
      };
    })(this);
  } else {
    if (typeof console !== "undefined" && console !== null) {
      if (typeof console.warn === "function") {
        console.warn('Octokat: A Promise API was not found. Supported libraries that have Promises are jQuery, angularjs, and es6-promise');
      }
    }
  }
} else {
  req = require;
  Promise = this.Promise || req('es6-promise').Promise;
  newPromise = function(fn) {
    return new Promise(fn);
  };
  allPromises = function(promises) {
    return Promise.all(promises);
  };
}

toPromise = function(orig) {
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

module.exports = {
  newPromise: newPromise,
  allPromises: allPromises,
  toPromise: toPromise
};


},{}],7:[function(require,module,exports){
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


},{}],8:[function(require,module,exports){
(function (global){
var ALL_PLUGINS, Chainer, MIDDLEWARE_CACHE_HANDLER, MIDDLEWARE_REQUEST_PLUGINS, MIDDLEWARE_RESPONSE_PLUGINS, OBJECT_MATCHER, Octokat, Request, SIMPLE_VERBS_PLUGIN, TREE_OPTIONS, applyHypermedia, deprecate, injectVerbMethods, plus, reChainChildren, ref, toPromise, uncamelizeObj,
  slice = [].slice;

plus = require('./plus');

deprecate = require('./deprecate');

ref = require('./grammar'), TREE_OPTIONS = ref.TREE_OPTIONS, OBJECT_MATCHER = ref.OBJECT_MATCHER;

Chainer = require('./chainer');

injectVerbMethods = require('./verb-methods');

Request = require('./request');

toPromise = require('./helper-promise').toPromise;

applyHypermedia = require('./helper-hypermedia');

SIMPLE_VERBS_PLUGIN = require('./plugin-simple-verbs');

MIDDLEWARE_REQUEST_PLUGINS = require('./plugin-middleware-request');

MIDDLEWARE_RESPONSE_PLUGINS = require('./plugin-middleware-response');

MIDDLEWARE_CACHE_HANDLER = require('./plugin-cache-handler');

ALL_PLUGINS = MIDDLEWARE_REQUEST_PLUGINS.concat([SIMPLE_VERBS_PLUGIN, MIDDLEWARE_RESPONSE_PLUGINS.READ_BINARY, MIDDLEWARE_RESPONSE_PLUGINS.PAGED_RESULTS, MIDDLEWARE_CACHE_HANDLER, MIDDLEWARE_RESPONSE_PLUGINS.HYPERMEDIA, MIDDLEWARE_RESPONSE_PLUGINS.CAMEL_CASE]);

reChainChildren = function(plugins, request, url, obj) {
  var context, j, k, key, len, re, ref1;
  for (key in OBJECT_MATCHER) {
    re = OBJECT_MATCHER[key];
    if (re.test(obj.url)) {
      context = TREE_OPTIONS;
      ref1 = key.split('.');
      for (j = 0, len = ref1.length; j < len; j++) {
        k = ref1[j];
        context = context[k];
      }
      Chainer(plugins, request, url, k, context, obj);
    }
  }
  return obj;
};

uncamelizeObj = function(obj) {
  var i, j, key, len, o, ref1, value;
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
    ref1 = Object.keys(obj);
    for (j = 0, len = ref1.length; j < len; j++) {
      key = ref1[j];
      value = obj[key];
      o[plus.uncamelize(key)] = uncamelizeObj(value);
    }
    return o;
  } else {
    return obj;
  }
};

Octokat = function(clientOptions) {
  var disableHypermedia, instance, plugins, request;
  if (clientOptions == null) {
    clientOptions = {};
  }
  plugins = clientOptions.plugins || ALL_PLUGINS;
  disableHypermedia = clientOptions.disableHypermedia;
  if (disableHypermedia == null) {
    disableHypermedia = false;
  }
  instance = {};
  request = function(method, path, data, options, cb) {
    var _request, ref1;
    if (options == null) {
      options = {
        raw: false,
        isBase64: false,
        isBoolean: false
      };
    }
    if (data && !(typeof global !== "undefined" && global !== null ? (ref1 = global['Buffer']) != null ? ref1.isBuffer(data) : void 0 : void 0)) {
      data = uncamelizeObj(data);
    }
    _request = Request(instance, clientOptions, plugins);
    return _request(method, path, data, options, function(err, val) {
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
          requestFn: _request,
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
  Chainer(plugins, request, '', null, TREE_OPTIONS, instance);
  instance.me = instance.user;
  instance.parse = function(data) {
    var context;
    context = {
      requestFn: request,
      data: data,
      instance: instance,
      clientOptions: clientOptions
    };
    return instance._parseWithContext('', context);
  };
  instance._parseWithContext = function(path, context) {
    var data, datum, j, l, len, len1, plugin, requestFn, url;
    data = context.data, requestFn = context.requestFn;
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
    if (url) {
      Chainer(plugins, requestFn, url, true, {}, data);
      reChainChildren(plugins, requestFn, url, data);
    } else {
      Chainer(plugins, requestFn, '', null, TREE_OPTIONS, data);
      if (Array.isArray(data)) {
        for (l = 0, len1 = data.length; l < len1; l++) {
          datum = data[l];
          reChainChildren(plugins, requestFn, datum.url, datum);
        }
      }
    }
    return data;
  };
  instance._fromUrlWithDefault = function() {
    var args, defaultFn, path;
    path = arguments[0], defaultFn = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
    path = applyHypermedia.apply(null, [path].concat(slice.call(args)));
    injectVerbMethods(plugins, request, path, defaultFn);
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
      injectVerbMethods(plugins, request, path, fn);
    }
    return fn;
  };
  instance.status = toPromise(function(cb) {
    return request('GET', 'https://status.github.com/api/status.json', null, null, cb);
  });
  instance.status.api = toPromise(function(cb) {
    return request('GET', 'https://status.github.com/api.json', null, null, cb);
  });
  instance.status.lastMessage = toPromise(function(cb) {
    return request('GET', 'https://status.github.com/api/last-message.json', null, null, cb);
  });
  instance.status.messages = toPromise(function(cb) {
    return request('GET', 'https://status.github.com/api/messages.json', null, null, cb);
  });
  return instance;
};

module.exports = Octokat;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./chainer":1,"./deprecate":2,"./grammar":3,"./helper-hypermedia":5,"./helper-promise":6,"./plugin-cache-handler":9,"./plugin-middleware-request":10,"./plugin-middleware-response":11,"./plugin-simple-verbs":12,"./plus":13,"./request":14,"./verb-methods":15}],9:[function(require,module,exports){
var CacheMiddleware;

module.exports = new (CacheMiddleware = (function() {
  function CacheMiddleware() {
    this._cachedETags = {};
  }

  CacheMiddleware.prototype.get = function(method, path) {
    return this._cachedETags[method + " " + path];
  };

  CacheMiddleware.prototype.add = function(method, path, eTag, data, status) {
    return this._cachedETags[method + " " + path] = {
      eTag: eTag,
      data: data,
      status: status
    };
  };

  CacheMiddleware.prototype.requestMiddleware = function(arg) {
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

  CacheMiddleware.prototype.responseMiddleware = function(arg) {
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

  return CacheMiddleware;

})());


},{}],10:[function(require,module,exports){
var AUTHORIZATION, DEFAULT_HEADER, PATH_TEST, PREVIEW_APIS, URL_VALIDATOR, USE_POST_INSTEAD_OF_PATCH, base64encode, ref;

ref = require('./grammar'), URL_VALIDATOR = ref.URL_VALIDATOR, DEFAULT_HEADER = ref.DEFAULT_HEADER;

base64encode = require('./helper-base64');

PATH_TEST = {
  requestMiddleware: function(arg) {
    var err, path;
    path = arg.path;
    if (!URL_VALIDATOR.test(path)) {
      err = "Octokat BUG: Invalid Path. If this is actually a valid path then please update the URL_VALIDATOR. path=" + path;
      return console.warn(err);
    }
  }
};

USE_POST_INSTEAD_OF_PATCH = {
  requestMiddleware: function(arg) {
    var method, ref1, usePostInsteadOfPatch;
    (ref1 = arg.clientOptions, usePostInsteadOfPatch = ref1.usePostInsteadOfPatch), method = arg.method;
    if (usePostInsteadOfPatch && method === 'PATCH') {
      return {
        method: 'POST'
      };
    }
  }
};

PREVIEW_APIS = {
  requestMiddleware: function(arg) {
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
  }
};

AUTHORIZATION = {
  requestMiddleware: function(arg) {
    var auth, password, ref1, token, username;
    ref1 = arg.clientOptions, token = ref1.token, username = ref1.username, password = ref1.password;
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
  }
};

module.exports = [PATH_TEST, USE_POST_INSTEAD_OF_PATCH, PREVIEW_APIS, AUTHORIZATION];


},{"./grammar":3,"./helper-base64":4}],11:[function(require,module,exports){
var CAMEL_CASE, CamelCase, HYPERMEDIA, HyperMedia, OBJECT_MATCHER, PAGED_RESULTS, PagedResults, READ_BINARY, ReadBinary, TREE_OPTIONS, applyHypermedia, deprecate, plus, ref, toPromise, toQueryString,
  slice = [].slice;

plus = require('./plus');

deprecate = require('./deprecate');

toPromise = require('./helper-promise').toPromise;

toQueryString = require('./helper-querystring');

applyHypermedia = require('./helper-hypermedia');

ref = require('./grammar'), TREE_OPTIONS = ref.TREE_OPTIONS, OBJECT_MATCHER = ref.OBJECT_MATCHER;

CAMEL_CASE = new (CamelCase = (function() {
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
    } else if (data === Object(data)) {
      return this._replaceObject(data);
    } else {
      return data;
    }
  };

  CamelCase.prototype._replaceObject = function(orig) {
    var acc, j, key, len, ref1, value;
    acc = {};
    ref1 = Object.keys(orig);
    for (j = 0, len = ref1.length; j < len; j++) {
      key = ref1[j];
      value = orig[key];
      this._replaceKeyValue(acc, key, value);
    }
    return acc;
  };

  CamelCase.prototype._replaceArray = function(orig) {
    var arr, item, j, key, len, ref1, value;
    arr = (function() {
      var j, len, results;
      results = [];
      for (j = 0, len = orig.length; j < len; j++) {
        item = orig[j];
        results.push(this.replace(item));
      }
      return results;
    }).call(this);
    ref1 = Object.keys(orig);
    for (j = 0, len = ref1.length; j < len; j++) {
      key = ref1[j];
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

PAGED_RESULTS = new (PagedResults = (function() {
  function PagedResults() {}

  PagedResults.prototype.responseMiddleware = function(arg) {
    var data, discard, href, j, jqXHR, len, links, part, ref1, ref2, rel;
    jqXHR = arg.jqXHR, data = arg.data;
    if (!jqXHR) {
      return;
    }
    if (Array.isArray(data)) {
      data = data.slice(0);
      links = jqXHR.getResponseHeader('Link');
      ref1 = (links != null ? links.split(',') : void 0) || [];
      for (j = 0, len = ref1.length; j < len; j++) {
        part = ref1[j];
        ref2 = part.match(/<([^>]+)>;\ rel="([^"]+)"/), discard = ref2[0], href = ref2[1], rel = ref2[2];
        data[rel + "_page_url"] = href;
      }
      return {
        data: data
      };
    }
  };

  return PagedResults;

})());

HYPERMEDIA = new (HyperMedia = (function() {
  function HyperMedia() {}

  HyperMedia.prototype.replace = function(instance, requestFn, data) {
    if (Array.isArray(data)) {
      return this._replaceArray(instance, requestFn, data);
    } else if (typeof data === 'function') {
      return data;
    } else if (data === Object(data)) {
      return this._replaceObject(instance, requestFn, data);
    } else {
      return data;
    }
  };

  HyperMedia.prototype._replaceObject = function(instance, requestFn, orig) {
    var acc, j, key, len, ref1, value;
    acc = {};
    ref1 = Object.keys(orig);
    for (j = 0, len = ref1.length; j < len; j++) {
      key = ref1[j];
      value = orig[key];
      this._replaceKeyValue(instance, requestFn, acc, key, value);
    }
    return acc;
  };

  HyperMedia.prototype._replaceArray = function(instance, requestFn, orig) {
    var arr, item, j, key, len, ref1, value;
    arr = (function() {
      var j, len, results;
      results = [];
      for (j = 0, len = orig.length; j < len; j++) {
        item = orig[j];
        results.push(this.replace(instance, requestFn, item));
      }
      return results;
    }).call(this);
    ref1 = Object.keys(orig);
    for (j = 0, len = ref1.length; j < len; j++) {
      key = ref1[j];
      value = orig[key];
      this._replaceKeyValue(instance, requestFn, arr, key, value);
    }
    return arr;
  };

  HyperMedia.prototype._replaceKeyValue = function(instance, requestFn, acc, key, value) {
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
      return acc[key] = this.replace(instance, requestFn, value);
    }
  };

  HyperMedia.prototype.responseMiddleware = function(arg) {
    var data, instance, requestFn;
    instance = arg.instance, requestFn = arg.requestFn, data = arg.data;
    data = this.replace(instance, requestFn, data);
    return {
      data: data
    };
  };

  return HyperMedia;

})());

READ_BINARY = new (ReadBinary = (function() {
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
    var converted, data, i, isBase64, j, options, ref1;
    options = arg.options, data = arg.data;
    isBase64 = options.isBase64;
    if (isBase64) {
      converted = '';
      for (i = j = 0, ref1 = data.length; 0 <= ref1 ? j < ref1 : j > ref1; i = 0 <= ref1 ? ++j : --j) {
        converted += String.fromCharCode(data.charCodeAt(i) & 0xff);
      }
      return {
        data: converted
      };
    }
  };

  return ReadBinary;

})());

module.exports = {
  CAMEL_CASE: CAMEL_CASE,
  PAGED_RESULTS: PAGED_RESULTS,
  HYPERMEDIA: HYPERMEDIA,
  READ_BINARY: READ_BINARY
};


},{"./deprecate":2,"./grammar":3,"./helper-hypermedia":5,"./helper-promise":6,"./helper-querystring":7,"./plus":13}],12:[function(require,module,exports){
var toQueryString,
  slice = [].slice;

toQueryString = require('./helper-querystring');

module.exports = {
  verbs: {
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
  }
};


},{"./helper-querystring":7}],13:[function(require,module,exports){
var plus;

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
  }
};

module.exports = plus;


},{}],14:[function(require,module,exports){
var DEFAULT_CACHE_HANDLER, DEFAULT_HEADER, Request, _cachedETags, ajax, base64encode, plus, userAgent;

plus = require('./plus');

base64encode = require('./helper-base64');

DEFAULT_HEADER = require('./grammar').DEFAULT_HEADER;

if (typeof window === "undefined" || window === null) {
  userAgent = 'octokat.js';
}

ajax = function(options, cb) {
  var XMLHttpRequest, name, ref, req, value, xhr;
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
  ref = options.headers;
  for (name in ref) {
    value = ref[name];
    xhr.setRequestHeader(name, value);
  }
  xhr.onreadystatechange = function() {
    var name1, ref1;
    if (4 === xhr.readyState) {
      if ((ref1 = options.statusCode) != null) {
        if (typeof ref1[name1 = xhr.status] === "function") {
          ref1[name1]();
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

_cachedETags = {};

DEFAULT_CACHE_HANDLER = {
  get: function(method, path) {
    return _cachedETags[method + " " + path];
  },
  add: function(method, path, eTag, data, status) {
    return _cachedETags[method + " " + path] = new ETagResponse(eTag, data, status);
  }
};

Request = function(instance, clientOptions, ALL_PLUGINS) {
  var emitter, requestFn;
  if (clientOptions == null) {
    clientOptions = {};
  }
  if (clientOptions.rootURL == null) {
    clientOptions.rootURL = 'https://api.github.com';
  }
  if (clientOptions.useETags == null) {
    clientOptions.useETags = true;
  }
  if (clientOptions.usePostInsteadOfPatch == null) {
    clientOptions.usePostInsteadOfPatch = false;
  }
  emitter = clientOptions.emitter;
  requestFn = function(method, path, data, options, cb) {
    var acc, ajaxConfig, headers, i, len, mimeType, plugin, ref;
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
      path = "" + clientOptions.rootURL + path;
    }
    headers = {
      'Accept': clientOptions.acceptHeader,
      'User-Agent': userAgent || void 0
    };
    acc = {
      method: method,
      path: path,
      clientOptions: clientOptions,
      headers: headers,
      options: options
    };
    for (i = 0, len = ALL_PLUGINS.length; i < len; i++) {
      plugin = ALL_PLUGINS[i];
      if (plugin.requestMiddleware) {
        ref = plugin.requestMiddleware(acc) || {}, method = ref.method, headers = ref.headers, mimeType = ref.mimeType;
        if (method) {
          acc.method = method;
        }
        if (mimeType) {
          acc.mimeType = mimeType;
        }
        plus.extend(acc.headers, headers);
      }
    }
    method = acc.method, headers = acc.headers, mimeType = acc.mimeType;
    if (options.isRaw) {
      headers['Accept'] = 'application/vnd.github.raw';
    }
    if (cacheHandler.get(method, path)) {
      headers['If-None-Match'] = cacheHandler.get(method, path).eTag;
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
    if (emitter != null) {
      emitter.emit('start', method, path, data, options);
    }
    return ajax(ajaxConfig, function(err, val) {
      var emitterRate, jqXHR, json, rateLimit, rateLimitRemaining, rateLimitReset;
      jqXHR = err || val;
      if (emitter) {
        rateLimit = parseFloat(jqXHR.getResponseHeader('X-RateLimit-Limit'));
        rateLimitRemaining = parseFloat(jqXHR.getResponseHeader('X-RateLimit-Remaining'));
        rateLimitReset = parseFloat(jqXHR.getResponseHeader('X-RateLimit-Reset'));
        emitterRate = {
          rate: {
            remaining: rateLimitRemaining,
            limit: rateLimit,
            reset: rateLimitReset
          }
        };
        if (jqXHR.getResponseHeader('X-OAuth-Scopes')) {
          emitterRate.scopes = jqXHR.getResponseHeader('X-OAuth-Scopes').split(', ');
        }
        emitter.emit('request', emitterRate, method, path, data, options, jqXHR.status);
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
            clientOptions: clientOptions,
            data: data,
            options: options,
            jqXHR: jqXHR,
            status: jqXHR.status,
            request: acc,
            requestFn: requestFn,
            instance: instance
          };
          data = instance._parseWithContext('', acc);
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
    });
  };
  return requestFn;
};

module.exports = Request;


},{"./grammar":3,"./helper-base64":4,"./plus":13}],15:[function(require,module,exports){
var injectVerbMethods, toPromise, toQueryString,
  slice = [].slice;

toPromise = require('./helper-promise').toPromise;

toQueryString = require('./helper-querystring');

injectVerbMethods = function(plugins, request, path, obj) {
  var i, len, plugin, results, verbFunc, verbName;
  if (!request) {
    throw new Error('Octokat BUG: request is required');
  }
  results = [];
  for (i = 0, len = plugins.length; i < len; i++) {
    plugin = plugins[i];
    results.push((function() {
      var ref, results1;
      ref = plugin.verbs || {};
      results1 = [];
      for (verbName in ref) {
        verbFunc = ref[verbName];
        results1.push((function(verbName, verbFunc) {
          obj.url = path;
          return obj[verbName] = function() {
            var args, makeRequest;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            makeRequest = function() {
              var cb, data, method, options, originalArgs, ref1;
              cb = arguments[0], originalArgs = 2 <= arguments.length ? slice.call(arguments, 1) : [];
              ref1 = verbFunc.apply(null, [path].concat(slice.call(originalArgs))), method = ref1.method, path = ref1.path, data = ref1.data, options = ref1.options;
              return request(method, path, data, options, cb);
            };
            return toPromise(makeRequest).apply(null, args);
          };
        })(verbName, verbFunc));
      }
      return results1;
    })());
  }
  return results;
};

module.exports = injectVerbMethods;


},{"./helper-promise":6,"./helper-querystring":7}]},{},[8])(8)
});