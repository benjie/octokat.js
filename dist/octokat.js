(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Octokat = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array ? array.length : 0;
  return length ? array[length - 1] : undefined;
}

module.exports = last;

},{}],2:[function(require,module,exports){
var arrayFilter = require('../internal/arrayFilter'),
    baseCallback = require('../internal/baseCallback'),
    baseFilter = require('../internal/baseFilter'),
    isArray = require('../lang/isArray');

/**
 * Iterates over elements of `collection`, returning an array of all elements
 * `predicate` returns truthy for. The predicate is bound to `thisArg` and
 * invoked with three arguments: (value, index|key, collection).
 *
 * If a property name is provided for `predicate` the created `_.property`
 * style callback returns the property value of the given element.
 *
 * If a value is also provided for `thisArg` the created `_.matchesProperty`
 * style callback returns `true` for elements that have a matching property
 * value, else `false`.
 *
 * If an object is provided for `predicate` the created `_.matches` style
 * callback returns `true` for elements that have the properties of the given
 * object, else `false`.
 *
 * @static
 * @memberOf _
 * @alias select
 * @category Collection
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [predicate=_.identity] The function invoked
 *  per iteration.
 * @param {*} [thisArg] The `this` binding of `predicate`.
 * @returns {Array} Returns the new filtered array.
 * @example
 *
 * _.filter([4, 5, 6], function(n) {
 *   return n % 2 == 0;
 * });
 * // => [4, 6]
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': true },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * // using the `_.matches` callback shorthand
 * _.pluck(_.filter(users, { 'age': 36, 'active': true }), 'user');
 * // => ['barney']
 *
 * // using the `_.matchesProperty` callback shorthand
 * _.pluck(_.filter(users, 'active', false), 'user');
 * // => ['fred']
 *
 * // using the `_.property` callback shorthand
 * _.pluck(_.filter(users, 'active'), 'user');
 * // => ['barney']
 */
function filter(collection, predicate, thisArg) {
  var func = isArray(collection) ? arrayFilter : baseFilter;
  predicate = baseCallback(predicate, thisArg, 3);
  return func(collection, predicate);
}

module.exports = filter;

},{"../internal/arrayFilter":6,"../internal/baseCallback":10,"../internal/baseFilter":13,"../lang/isArray":49}],3:[function(require,module,exports){
var arrayEach = require('../internal/arrayEach'),
    baseEach = require('../internal/baseEach'),
    createForEach = require('../internal/createForEach');

/**
 * Iterates over elements of `collection` invoking `iteratee` for each element.
 * The `iteratee` is bound to `thisArg` and invoked with three arguments:
 * (value, index|key, collection). Iteratee functions may exit iteration early
 * by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length" property
 * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
 * may be used for object iteration.
 *
 * @static
 * @memberOf _
 * @alias each
 * @category Collection
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @param {*} [thisArg] The `this` binding of `iteratee`.
 * @returns {Array|Object|string} Returns `collection`.
 * @example
 *
 * _([1, 2]).forEach(function(n) {
 *   console.log(n);
 * }).value();
 * // => logs each value from left to right and returns the array
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(n, key) {
 *   console.log(n, key);
 * });
 * // => logs each value-key pair and returns the object (iteration order is not guaranteed)
 */
var forEach = createForEach(arrayEach, baseEach);

module.exports = forEach;

},{"../internal/arrayEach":5,"../internal/baseEach":12,"../internal/createForEach":30}],4:[function(require,module,exports){
/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Native method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates a function that invokes `func` with the `this` binding of the
 * created function and arguments from `start` and beyond provided as an array.
 *
 * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/Web/JavaScript/Reference/Functions/rest_parameters).
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var say = _.restParam(function(what, names) {
 *   return what + ' ' + _.initial(names).join(', ') +
 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
 * });
 *
 * say('hello', 'fred', 'barney', 'pebbles');
 * // => 'hello fred, barney, & pebbles'
 */
function restParam(func, start) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        rest = Array(length);

    while (++index < length) {
      rest[index] = args[start + index];
    }
    switch (start) {
      case 0: return func.call(this, rest);
      case 1: return func.call(this, args[0], rest);
      case 2: return func.call(this, args[0], args[1], rest);
    }
    var otherArgs = Array(start + 1);
    index = -1;
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = rest;
    return func.apply(this, otherArgs);
  };
}

module.exports = restParam;

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
/**
 * A specialized version of `_.some` for arrays without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

module.exports = arraySome;

},{}],8:[function(require,module,exports){
var keys = require('../object/keys');

/**
 * A specialized version of `_.assign` for customizing assigned values without
 * support for argument juggling, multiple sources, and `this` binding `customizer`
 * functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {Function} customizer The function to customize assigned values.
 * @returns {Object} Returns `object`.
 */
function assignWith(object, source, customizer) {
  var index = -1,
      props = keys(source),
      length = props.length;

  while (++index < length) {
    var key = props[index],
        value = object[key],
        result = customizer(value, source[key], key, object, source);

    if ((result === result ? (result !== value) : (value === value)) ||
        (value === undefined && !(key in object))) {
      object[key] = result;
    }
  }
  return object;
}

module.exports = assignWith;

},{"../object/keys":57}],9:[function(require,module,exports){
var baseCopy = require('./baseCopy'),
    keys = require('../object/keys');

/**
 * The base implementation of `_.assign` without support for argument juggling,
 * multiple sources, and `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return source == null
    ? object
    : baseCopy(source, keys(source), object);
}

module.exports = baseAssign;

},{"../object/keys":57,"./baseCopy":11}],10:[function(require,module,exports){
var baseMatches = require('./baseMatches'),
    baseMatchesProperty = require('./baseMatchesProperty'),
    bindCallback = require('./bindCallback'),
    identity = require('../utility/identity'),
    property = require('../utility/property');

/**
 * The base implementation of `_.callback` which supports specifying the
 * number of arguments to provide to `func`.
 *
 * @private
 * @param {*} [func=_.identity] The value to convert to a callback.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {number} [argCount] The number of arguments to provide to `func`.
 * @returns {Function} Returns the callback.
 */
function baseCallback(func, thisArg, argCount) {
  var type = typeof func;
  if (type == 'function') {
    return thisArg === undefined
      ? func
      : bindCallback(func, thisArg, argCount);
  }
  if (func == null) {
    return identity;
  }
  if (type == 'object') {
    return baseMatches(func);
  }
  return thisArg === undefined
    ? property(func)
    : baseMatchesProperty(func, thisArg);
}

module.exports = baseCallback;

},{"../utility/identity":60,"../utility/property":61,"./baseMatches":20,"./baseMatchesProperty":21,"./bindCallback":26}],11:[function(require,module,exports){
/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property names to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @returns {Object} Returns `object`.
 */
function baseCopy(source, props, object) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];
    object[key] = source[key];
  }
  return object;
}

module.exports = baseCopy;

},{}],12:[function(require,module,exports){
var baseForOwn = require('./baseForOwn'),
    createBaseEach = require('./createBaseEach');

/**
 * The base implementation of `_.forEach` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object|string} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

module.exports = baseEach;

},{"./baseForOwn":15,"./createBaseEach":28}],13:[function(require,module,exports){
var baseEach = require('./baseEach');

/**
 * The base implementation of `_.filter` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function baseFilter(collection, predicate) {
  var result = [];
  baseEach(collection, function(value, index, collection) {
    if (predicate(value, index, collection)) {
      result.push(value);
    }
  });
  return result;
}

module.exports = baseFilter;

},{"./baseEach":12}],14:[function(require,module,exports){
var createBaseFor = require('./createBaseFor');

/**
 * The base implementation of `baseForIn` and `baseForOwn` which iterates
 * over `object` properties returned by `keysFunc` invoking `iteratee` for
 * each property. Iteratee functions may exit iteration early by explicitly
 * returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

module.exports = baseFor;

},{"./createBaseFor":29}],15:[function(require,module,exports){
var baseFor = require('./baseFor'),
    keys = require('../object/keys');

/**
 * The base implementation of `_.forOwn` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;

},{"../object/keys":57,"./baseFor":14}],16:[function(require,module,exports){
var toObject = require('./toObject');

/**
 * The base implementation of `get` without support for string paths
 * and default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} path The path of the property to get.
 * @param {string} [pathKey] The key representation of path.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path, pathKey) {
  if (object == null) {
    return;
  }
  if (pathKey !== undefined && pathKey in toObject(object)) {
    path = [pathKey];
  }
  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[path[index++]];
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;

},{"./toObject":46}],17:[function(require,module,exports){
var baseIsEqualDeep = require('./baseIsEqualDeep'),
    isObject = require('../lang/isObject'),
    isObjectLike = require('./isObjectLike');

/**
 * The base implementation of `_.isEqual` without support for `this` binding
 * `customizer` functions.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {Function} [customizer] The function to customize comparing values.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA] Tracks traversed `value` objects.
 * @param {Array} [stackB] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, baseIsEqual, customizer, isLoose, stackA, stackB);
}

module.exports = baseIsEqual;

},{"../lang/isObject":52,"./baseIsEqualDeep":18,"./isObjectLike":43}],18:[function(require,module,exports){
var equalArrays = require('./equalArrays'),
    equalByTag = require('./equalByTag'),
    equalObjects = require('./equalObjects'),
    isArray = require('../lang/isArray'),
    isTypedArray = require('../lang/isTypedArray');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparing objects.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA=[]] Tracks traversed `value` objects.
 * @param {Array} [stackB=[]] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = arrayTag,
      othTag = arrayTag;

  if (!objIsArr) {
    objTag = objToString.call(object);
    if (objTag == argsTag) {
      objTag = objectTag;
    } else if (objTag != objectTag) {
      objIsArr = isTypedArray(object);
    }
  }
  if (!othIsArr) {
    othTag = objToString.call(other);
    if (othTag == argsTag) {
      othTag = objectTag;
    } else if (othTag != objectTag) {
      othIsArr = isTypedArray(other);
    }
  }
  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && !(objIsArr || objIsObj)) {
    return equalByTag(object, other, objTag);
  }
  if (!isLoose) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
    }
  }
  if (!isSameTag) {
    return false;
  }
  // Assume cyclic values are equal.
  // For more information on detecting circular references see https://es5.github.io/#JO.
  stackA || (stackA = []);
  stackB || (stackB = []);

  var length = stackA.length;
  while (length--) {
    if (stackA[length] == object) {
      return stackB[length] == other;
    }
  }
  // Add `object` and `other` to the stack of traversed objects.
  stackA.push(object);
  stackB.push(other);

  var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);

  stackA.pop();
  stackB.pop();

  return result;
}

module.exports = baseIsEqualDeep;

},{"../lang/isArray":49,"../lang/isTypedArray":53,"./equalArrays":32,"./equalByTag":33,"./equalObjects":34}],19:[function(require,module,exports){
var baseIsEqual = require('./baseIsEqual'),
    toObject = require('./toObject');

/**
 * The base implementation of `_.isMatch` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Array} matchData The propery names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparing objects.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = toObject(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var result = customizer ? customizer(objValue, srcValue, key) : undefined;
      if (!(result === undefined ? baseIsEqual(srcValue, objValue, customizer, true) : result)) {
        return false;
      }
    }
  }
  return true;
}

module.exports = baseIsMatch;

},{"./baseIsEqual":17,"./toObject":46}],20:[function(require,module,exports){
var baseIsMatch = require('./baseIsMatch'),
    getMatchData = require('./getMatchData'),
    toObject = require('./toObject');

/**
 * The base implementation of `_.matches` which does not clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    var key = matchData[0][0],
        value = matchData[0][1];

    return function(object) {
      if (object == null) {
        return false;
      }
      return object[key] === value && (value !== undefined || (key in toObject(object)));
    };
  }
  return function(object) {
    return baseIsMatch(object, matchData);
  };
}

module.exports = baseMatches;

},{"./baseIsMatch":19,"./getMatchData":36,"./toObject":46}],21:[function(require,module,exports){
var baseGet = require('./baseGet'),
    baseIsEqual = require('./baseIsEqual'),
    baseSlice = require('./baseSlice'),
    isArray = require('../lang/isArray'),
    isKey = require('./isKey'),
    isStrictComparable = require('./isStrictComparable'),
    last = require('../array/last'),
    toObject = require('./toObject'),
    toPath = require('./toPath');

/**
 * The base implementation of `_.matchesProperty` which does not clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to compare.
 * @returns {Function} Returns the new function.
 */
function baseMatchesProperty(path, srcValue) {
  var isArr = isArray(path),
      isCommon = isKey(path) && isStrictComparable(srcValue),
      pathKey = (path + '');

  path = toPath(path);
  return function(object) {
    if (object == null) {
      return false;
    }
    var key = pathKey;
    object = toObject(object);
    if ((isArr || !isCommon) && !(key in object)) {
      object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
      if (object == null) {
        return false;
      }
      key = last(path);
      object = toObject(object);
    }
    return object[key] === srcValue
      ? (srcValue !== undefined || (key in object))
      : baseIsEqual(srcValue, object[key], undefined, true);
  };
}

module.exports = baseMatchesProperty;

},{"../array/last":1,"../lang/isArray":49,"./baseGet":16,"./baseIsEqual":17,"./baseSlice":24,"./isKey":41,"./isStrictComparable":44,"./toObject":46,"./toPath":47}],22:[function(require,module,exports){
/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;

},{}],23:[function(require,module,exports){
var baseGet = require('./baseGet'),
    toPath = require('./toPath');

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new function.
 */
function basePropertyDeep(path) {
  var pathKey = (path + '');
  path = toPath(path);
  return function(object) {
    return baseGet(object, path, pathKey);
  };
}

module.exports = basePropertyDeep;

},{"./baseGet":16,"./toPath":47}],24:[function(require,module,exports){
/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  start = start == null ? 0 : (+start || 0);
  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = (end === undefined || end > length) ? length : (+end || 0);
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

module.exports = baseSlice;

},{}],25:[function(require,module,exports){
/**
 * Converts `value` to a string if it's not one. An empty string is returned
 * for `null` or `undefined` values.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  return value == null ? '' : (value + '');
}

module.exports = baseToString;

},{}],26:[function(require,module,exports){
var identity = require('../utility/identity');

/**
 * A specialized version of `baseCallback` which only supports `this` binding
 * and specifying the number of arguments to provide to `func`.
 *
 * @private
 * @param {Function} func The function to bind.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {number} [argCount] The number of arguments to provide to `func`.
 * @returns {Function} Returns the callback.
 */
function bindCallback(func, thisArg, argCount) {
  if (typeof func != 'function') {
    return identity;
  }
  if (thisArg === undefined) {
    return func;
  }
  switch (argCount) {
    case 1: return function(value) {
      return func.call(thisArg, value);
    };
    case 3: return function(value, index, collection) {
      return func.call(thisArg, value, index, collection);
    };
    case 4: return function(accumulator, value, index, collection) {
      return func.call(thisArg, accumulator, value, index, collection);
    };
    case 5: return function(value, other, key, object, source) {
      return func.call(thisArg, value, other, key, object, source);
    };
  }
  return function() {
    return func.apply(thisArg, arguments);
  };
}

module.exports = bindCallback;

},{"../utility/identity":60}],27:[function(require,module,exports){
var bindCallback = require('./bindCallback'),
    isIterateeCall = require('./isIterateeCall'),
    restParam = require('../function/restParam');

/**
 * Creates a `_.assign`, `_.defaults`, or `_.merge` function.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return restParam(function(object, sources) {
    var index = -1,
        length = object == null ? 0 : sources.length,
        customizer = length > 2 ? sources[length - 2] : undefined,
        guard = length > 2 ? sources[2] : undefined,
        thisArg = length > 1 ? sources[length - 1] : undefined;

    if (typeof customizer == 'function') {
      customizer = bindCallback(customizer, thisArg, 5);
      length -= 2;
    } else {
      customizer = typeof thisArg == 'function' ? thisArg : undefined;
      length -= (customizer ? 1 : 0);
    }
    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, customizer);
      }
    }
    return object;
  });
}

module.exports = createAssigner;

},{"../function/restParam":4,"./bindCallback":26,"./isIterateeCall":40}],28:[function(require,module,exports){
var getLength = require('./getLength'),
    isLength = require('./isLength'),
    toObject = require('./toObject');

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    var length = collection ? getLength(collection) : 0;
    if (!isLength(length)) {
      return eachFunc(collection, iteratee);
    }
    var index = fromRight ? length : -1,
        iterable = toObject(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

module.exports = createBaseEach;

},{"./getLength":35,"./isLength":42,"./toObject":46}],29:[function(require,module,exports){
var toObject = require('./toObject');

/**
 * Creates a base function for `_.forIn` or `_.forInRight`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var iterable = toObject(object),
        props = keysFunc(object),
        length = props.length,
        index = fromRight ? length : -1;

    while ((fromRight ? index-- : ++index < length)) {
      var key = props[index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

module.exports = createBaseFor;

},{"./toObject":46}],30:[function(require,module,exports){
var bindCallback = require('./bindCallback'),
    isArray = require('../lang/isArray');

/**
 * Creates a function for `_.forEach` or `_.forEachRight`.
 *
 * @private
 * @param {Function} arrayFunc The function to iterate over an array.
 * @param {Function} eachFunc The function to iterate over a collection.
 * @returns {Function} Returns the new each function.
 */
function createForEach(arrayFunc, eachFunc) {
  return function(collection, iteratee, thisArg) {
    return (typeof iteratee == 'function' && thisArg === undefined && isArray(collection))
      ? arrayFunc(collection, iteratee)
      : eachFunc(collection, bindCallback(iteratee, thisArg, 3));
  };
}

module.exports = createForEach;

},{"../lang/isArray":49,"./bindCallback":26}],31:[function(require,module,exports){
var bindCallback = require('./bindCallback');

/**
 * Creates a function for `_.forOwn` or `_.forOwnRight`.
 *
 * @private
 * @param {Function} objectFunc The function to iterate over an object.
 * @returns {Function} Returns the new each function.
 */
function createForOwn(objectFunc) {
  return function(object, iteratee, thisArg) {
    if (typeof iteratee != 'function' || thisArg !== undefined) {
      iteratee = bindCallback(iteratee, thisArg, 3);
    }
    return objectFunc(object, iteratee);
  };
}

module.exports = createForOwn;

},{"./bindCallback":26}],32:[function(require,module,exports){
var arraySome = require('./arraySome');

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparing arrays.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA] Tracks traversed `value` objects.
 * @param {Array} [stackB] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
  var index = -1,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isLoose && othLength > arrLength)) {
    return false;
  }
  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index],
        result = customizer ? customizer(isLoose ? othValue : arrValue, isLoose ? arrValue : othValue, index) : undefined;

    if (result !== undefined) {
      if (result) {
        continue;
      }
      return false;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (isLoose) {
      if (!arraySome(other, function(othValue) {
            return arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
          })) {
        return false;
      }
    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB))) {
      return false;
    }
  }
  return true;
}

module.exports = equalArrays;

},{"./arraySome":7}],33:[function(require,module,exports){
/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    stringTag = '[object String]';

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag) {
  switch (tag) {
    case boolTag:
    case dateTag:
      // Coerce dates and booleans to numbers, dates to milliseconds and booleans
      // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
      return +object == +other;

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case numberTag:
      // Treat `NaN` vs. `NaN` as equal.
      return (object != +object)
        ? other != +other
        : object == +other;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings primitives and string
      // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
      return object == (other + '');
  }
  return false;
}

module.exports = equalByTag;

},{}],34:[function(require,module,exports){
var keys = require('../object/keys');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparing values.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA] Tracks traversed `value` objects.
 * @param {Array} [stackB] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
  var objProps = keys(object),
      objLength = objProps.length,
      othProps = keys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isLoose) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isLoose ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  var skipCtor = isLoose;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key],
        result = customizer ? customizer(isLoose ? othValue : objValue, isLoose? objValue : othValue, key) : undefined;

    // Recursively compare objects (susceptible to call stack limits).
    if (!(result === undefined ? equalFunc(objValue, othValue, customizer, isLoose, stackA, stackB) : result)) {
      return false;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (!skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      return false;
    }
  }
  return true;
}

module.exports = equalObjects;

},{"../object/keys":57}],35:[function(require,module,exports){
var baseProperty = require('./baseProperty');

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

module.exports = getLength;

},{"./baseProperty":22}],36:[function(require,module,exports){
var isStrictComparable = require('./isStrictComparable'),
    pairs = require('../object/pairs');

/**
 * Gets the propery names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = pairs(object),
      length = result.length;

  while (length--) {
    result[length][2] = isStrictComparable(result[length][1]);
  }
  return result;
}

module.exports = getMatchData;

},{"../object/pairs":59,"./isStrictComparable":44}],37:[function(require,module,exports){
var isNative = require('../lang/isNative');

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = object == null ? undefined : object[key];
  return isNative(value) ? value : undefined;
}

module.exports = getNative;

},{"../lang/isNative":51}],38:[function(require,module,exports){
var getLength = require('./getLength'),
    isLength = require('./isLength');

/**
 * Checks if `value` is array-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value));
}

module.exports = isArrayLike;

},{"./getLength":35,"./isLength":42}],39:[function(require,module,exports){
/** Used to detect unsigned integer values. */
var reIsUint = /^\d+$/;

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

module.exports = isIndex;

},{}],40:[function(require,module,exports){
var isArrayLike = require('./isArrayLike'),
    isIndex = require('./isIndex'),
    isObject = require('../lang/isObject');

/**
 * Checks if the provided arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
      ? (isArrayLike(object) && isIndex(index, object.length))
      : (type == 'string' && index in object)) {
    var other = object[index];
    return value === value ? (value === other) : (other !== other);
  }
  return false;
}

module.exports = isIterateeCall;

},{"../lang/isObject":52,"./isArrayLike":38,"./isIndex":39}],41:[function(require,module,exports){
var isArray = require('../lang/isArray'),
    toObject = require('./toObject');

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  var type = typeof value;
  if ((type == 'string' && reIsPlainProp.test(value)) || type == 'number') {
    return true;
  }
  if (isArray(value)) {
    return false;
  }
  var result = !reIsDeepProp.test(value);
  return result || (object != null && value in toObject(object));
}

module.exports = isKey;

},{"../lang/isArray":49,"./toObject":46}],42:[function(require,module,exports){
/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

},{}],43:[function(require,module,exports){
/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],44:[function(require,module,exports){
var isObject = require('../lang/isObject');

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

module.exports = isStrictComparable;

},{"../lang/isObject":52}],45:[function(require,module,exports){
var isArguments = require('../lang/isArguments'),
    isArray = require('../lang/isArray'),
    isIndex = require('./isIndex'),
    isLength = require('./isLength'),
    keysIn = require('../object/keysIn');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A fallback implementation of `Object.keys` which creates an array of the
 * own enumerable property names of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function shimKeys(object) {
  var props = keysIn(object),
      propsLength = props.length,
      length = propsLength && object.length;

  var allowIndexes = !!length && isLength(length) &&
    (isArray(object) || isArguments(object));

  var index = -1,
      result = [];

  while (++index < propsLength) {
    var key = props[index];
    if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = shimKeys;

},{"../lang/isArguments":48,"../lang/isArray":49,"../object/keysIn":58,"./isIndex":39,"./isLength":42}],46:[function(require,module,exports){
var isObject = require('../lang/isObject');

/**
 * Converts `value` to an object if it's not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Object} Returns the object.
 */
function toObject(value) {
  return isObject(value) ? value : Object(value);
}

module.exports = toObject;

},{"../lang/isObject":52}],47:[function(require,module,exports){
var baseToString = require('./baseToString'),
    isArray = require('../lang/isArray');

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `value` to property path array if it's not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Array} Returns the property path array.
 */
function toPath(value) {
  if (isArray(value)) {
    return value;
  }
  var result = [];
  baseToString(value).replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
}

module.exports = toPath;

},{"../lang/isArray":49,"./baseToString":25}],48:[function(require,module,exports){
var isArrayLike = require('../internal/isArrayLike'),
    isObjectLike = require('../internal/isObjectLike');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Native method references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is classified as an `arguments` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  return isObjectLike(value) && isArrayLike(value) &&
    hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
}

module.exports = isArguments;

},{"../internal/isArrayLike":38,"../internal/isObjectLike":43}],49:[function(require,module,exports){
var getNative = require('../internal/getNative'),
    isLength = require('../internal/isLength'),
    isObjectLike = require('../internal/isObjectLike');

/** `Object#toString` result references. */
var arrayTag = '[object Array]';

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/* Native method references for those with the same name as other `lodash` methods. */
var nativeIsArray = getNative(Array, 'isArray');

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(function() { return arguments; }());
 * // => false
 */
var isArray = nativeIsArray || function(value) {
  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
};

module.exports = isArray;

},{"../internal/getNative":37,"../internal/isLength":42,"../internal/isObjectLike":43}],50:[function(require,module,exports){
var isObject = require('./isObject');

/** `Object#toString` result references. */
var funcTag = '[object Function]';

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in older versions of Chrome and Safari which return 'function' for regexes
  // and Safari 8 which returns 'object' for typed array constructors.
  return isObject(value) && objToString.call(value) == funcTag;
}

module.exports = isFunction;

},{"./isObject":52}],51:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isObjectLike = require('../internal/isObjectLike');

/** Used to detect host constructors (Safari > 5). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (isFunction(value)) {
    return reIsNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reIsHostCtor.test(value);
}

module.exports = isNative;

},{"../internal/isObjectLike":43,"./isFunction":50}],52:[function(require,module,exports){
/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],53:[function(require,module,exports){
var isLength = require('../internal/isLength'),
    isObjectLike = require('../internal/isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dateTag] = typedArrayTags[errorTag] =
typedArrayTags[funcTag] = typedArrayTags[mapTag] =
typedArrayTags[numberTag] = typedArrayTags[objectTag] =
typedArrayTags[regexpTag] = typedArrayTags[setTag] =
typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
function isTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
}

module.exports = isTypedArray;

},{"../internal/isLength":42,"../internal/isObjectLike":43}],54:[function(require,module,exports){
var assignWith = require('../internal/assignWith'),
    baseAssign = require('../internal/baseAssign'),
    createAssigner = require('../internal/createAssigner');

/**
 * Assigns own enumerable properties of source object(s) to the destination
 * object. Subsequent sources overwrite property assignments of previous sources.
 * If `customizer` is provided it's invoked to produce the assigned values.
 * The `customizer` is bound to `thisArg` and invoked with five arguments:
 * (objectValue, sourceValue, key, object, source).
 *
 * **Note:** This method mutates `object` and is based on
 * [`Object.assign`](http://ecma-international.org/ecma-262/6.0/#sec-object.assign).
 *
 * @static
 * @memberOf _
 * @alias extend
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {*} [thisArg] The `this` binding of `customizer`.
 * @returns {Object} Returns `object`.
 * @example
 *
 * _.assign({ 'user': 'barney' }, { 'age': 40 }, { 'user': 'fred' });
 * // => { 'user': 'fred', 'age': 40 }
 *
 * // using a customizer callback
 * var defaults = _.partialRight(_.assign, function(value, other) {
 *   return _.isUndefined(value) ? other : value;
 * });
 *
 * defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
 * // => { 'user': 'barney', 'age': 36 }
 */
var assign = createAssigner(function(object, source, customizer) {
  return customizer
    ? assignWith(object, source, customizer)
    : baseAssign(object, source);
});

module.exports = assign;

},{"../internal/assignWith":8,"../internal/baseAssign":9,"../internal/createAssigner":27}],55:[function(require,module,exports){
module.exports = require('./assign');

},{"./assign":54}],56:[function(require,module,exports){
var baseForOwn = require('../internal/baseForOwn'),
    createForOwn = require('../internal/createForOwn');

/**
 * Iterates over own enumerable properties of an object invoking `iteratee`
 * for each property. The `iteratee` is bound to `thisArg` and invoked with
 * three arguments: (value, key, object). Iteratee functions may exit iteration
 * early by explicitly returning `false`.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @param {*} [thisArg] The `this` binding of `iteratee`.
 * @returns {Object} Returns `object`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.forOwn(new Foo, function(value, key) {
 *   console.log(key);
 * });
 * // => logs 'a' and 'b' (iteration order is not guaranteed)
 */
var forOwn = createForOwn(baseForOwn);

module.exports = forOwn;

},{"../internal/baseForOwn":15,"../internal/createForOwn":31}],57:[function(require,module,exports){
var getNative = require('../internal/getNative'),
    isArrayLike = require('../internal/isArrayLike'),
    isObject = require('../lang/isObject'),
    shimKeys = require('../internal/shimKeys');

/* Native method references for those with the same name as other `lodash` methods. */
var nativeKeys = getNative(Object, 'keys');

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
var keys = !nativeKeys ? shimKeys : function(object) {
  var Ctor = object == null ? undefined : object.constructor;
  if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
      (typeof object != 'function' && isArrayLike(object))) {
    return shimKeys(object);
  }
  return isObject(object) ? nativeKeys(object) : [];
};

module.exports = keys;

},{"../internal/getNative":37,"../internal/isArrayLike":38,"../internal/shimKeys":45,"../lang/isObject":52}],58:[function(require,module,exports){
var isArguments = require('../lang/isArguments'),
    isArray = require('../lang/isArray'),
    isIndex = require('../internal/isIndex'),
    isLength = require('../internal/isLength'),
    isObject = require('../lang/isObject');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  if (object == null) {
    return [];
  }
  if (!isObject(object)) {
    object = Object(object);
  }
  var length = object.length;
  length = (length && isLength(length) &&
    (isArray(object) || isArguments(object)) && length) || 0;

  var Ctor = object.constructor,
      index = -1,
      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
      result = Array(length),
      skipIndexes = length > 0;

  while (++index < length) {
    result[index] = (index + '');
  }
  for (var key in object) {
    if (!(skipIndexes && isIndex(key, length)) &&
        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keysIn;

},{"../internal/isIndex":39,"../internal/isLength":42,"../lang/isArguments":48,"../lang/isArray":49,"../lang/isObject":52}],59:[function(require,module,exports){
var keys = require('./keys'),
    toObject = require('../internal/toObject');

/**
 * Creates a two dimensional array of the key-value pairs for `object`,
 * e.g. `[[key1, value1], [key2, value2]]`.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the new array of key-value pairs.
 * @example
 *
 * _.pairs({ 'barney': 36, 'fred': 40 });
 * // => [['barney', 36], ['fred', 40]] (iteration order is not guaranteed)
 */
function pairs(object) {
  object = toObject(object);

  var index = -1,
      props = keys(object),
      length = props.length,
      result = Array(length);

  while (++index < length) {
    var key = props[index];
    result[index] = [key, object[key]];
  }
  return result;
}

module.exports = pairs;

},{"../internal/toObject":46,"./keys":57}],60:[function(require,module,exports){
/**
 * This method returns the first argument provided to it.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'user': 'fred' };
 *
 * _.identity(object) === object;
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;

},{}],61:[function(require,module,exports){
var baseProperty = require('../internal/baseProperty'),
    basePropertyDeep = require('../internal/basePropertyDeep'),
    isKey = require('../internal/isKey');

/**
 * Creates a function that returns the property value at `path` on a
 * given object.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': { 'c': 2 } } },
 *   { 'a': { 'b': { 'c': 1 } } }
 * ];
 *
 * _.map(objects, _.property('a.b.c'));
 * // => [2, 1]
 *
 * _.pluck(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
}

module.exports = property;

},{"../internal/baseProperty":22,"../internal/basePropertyDeep":23,"../internal/isKey":41}],62:[function(require,module,exports){
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
      chainer.chain('', null, TREE_OPTIONS, data);
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
},{"./chainer":63,"./deprecate":64,"./grammar/tree-options":67,"./helpers/hypermedia":70,"./plus":88,"./requester":89,"./verb-methods":90}],63:[function(require,module,exports){
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


},{"./grammar/object-matcher":65,"./grammar/tree-options":67,"./plus":88,"./verb-methods":90}],64:[function(require,module,exports){
module.exports = function(message) {
  return typeof console !== "undefined" && console !== null ? typeof console.warn === "function" ? console.warn("Octokat Deprecation: " + message) : void 0 : void 0;
};


},{}],65:[function(require,module,exports){
module.exports = {
  'repos': /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/repos\/[^\/]+\/[^\/]+$/,
  'gists': /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/gists\/[^\/]+$/,
  'issues': /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/repos\/[^\/]+\/[^\/]+\/(issues|pulls)[^\/]+$/,
  'users': /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/users\/[^\/]+$/,
  'orgs': /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/orgs\/[^\/]+$/,
  'repos.comments': /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/repos\/[^\/]+\/[^\/]+\/comments\/[^\/]+$/
};


},{}],66:[function(require,module,exports){
module.exports = {
  'application/vnd.github.drax-preview+json': /^(https?:\/\/[^\/]+)?(\/api\/v3)?(\/licenses|\/licenses\/([^\/]+)|\/repos\/([^\/]+)\/([^\/]+))$/,
  'application/vnd.github.v3.star+json': /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/users\/([^\/]+)\/starred$/,
  'application/vnd.github.mirage-preview+json': /^(https?:\/\/[^\/]+)?(\/api\/v3)?(\/authorizations|\/authorizations\/clients\/([^\/]{20})|\/authorizations\/clients\/([^\/]{20})\/([^\/]+)|\/authorizations\/([\d]+)|\/applications\/([^\/]{20})\/tokens|\/applications\/([^\/]{20})\/tokens\/([^\/]+))$/
};


},{}],67:[function(require,module,exports){
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


},{}],68:[function(require,module,exports){
module.exports = /^(https:\/\/status.github.com\/api\/(status.json|last-message.json|messages.json)$)|(https?:\/\/[^\/]+)?(\/api\/v3)?\/(zen|octocat|users|organizations|issues|gists|emojis|markdown|meta|rate_limit|feeds|events|notifications|notifications\/threads(\/[^\/]+)|notifications\/threads(\/[^\/]+)\/subscription|gitignore\/templates(\/[^\/]+)?|user(\/\d+)?|user(\/\d+)?\/(|repos|orgs|followers|following(\/[^\/]+)?|emails(\/[^\/]+)?|issues|starred|starred(\/[^\/]+){2}|teams)|orgs\/[^\/]+|orgs\/[^\/]+\/(repos|issues|members|events|teams)|teams\/[^\/]+|teams\/[^\/]+\/(members(\/[^\/]+)?|memberships\/[^\/]+|repos|repos(\/[^\/]+){2})|users\/[^\/]+|users\/[^\/]+\/(repos|orgs|gists|followers|following(\/[^\/]+){0,2}|keys|starred|received_events(\/public)?|events(\/public)?|events\/orgs\/[^\/]+)|search\/(repositories|issues|users|code)|gists\/(public|starred|([a-f0-9]{20}|[0-9]+)|([a-f0-9]{20}|[0-9]+)\/forks|([a-f0-9]{20}|[0-9]+)\/comments(\/[0-9]+)?|([a-f0-9]{20}|[0-9]+)\/star)|repos(\/[^\/]+){2}|repos(\/[^\/]+){2}\/(readme|tarball(\/[^\/]+)?|zipball(\/[^\/]+)?|compare\/([^\.{3}]+)\.{3}([^\.{3}]+)|deployments(\/[0-9]+)?|deployments\/[0-9]+\/statuses(\/[0-9]+)?|hooks|hooks\/[^\/]+|hooks\/[^\/]+\/tests|assignees|languages|teams|tags|branches(\/[^\/]+){0,2}|contributors|subscribers|subscription|stargazers|comments(\/[0-9]+)?|downloads(\/[0-9]+)?|forks|milestones|milestones\/[0-9]+|milestones\/[0-9]+\/labels|labels(\/[^\/]+)?|releases|releases\/([0-9]+)|releases\/([0-9]+)\/assets|releases\/latest|releases\/tags\/([^\/]+)|releases\/assets\/([0-9]+)|events|notifications|merges|statuses\/[a-f0-9]{40}|pages|pages\/builds|pages\/builds\/latest|commits|commits\/[a-f0-9]{40}|commits\/[a-f0-9]{40}\/(comments|status|statuses)?|contents\/|contents(\/[^\/]+)*|collaborators(\/[^\/]+)?|(issues|pulls)|(issues|pulls)\/(events|events\/[0-9]+|comments(\/[0-9]+)?|[0-9]+|[0-9]+\/events|[0-9]+\/comments|[0-9]+\/labels(\/[^\/]+)?)|pulls\/[0-9]+\/(files|commits)|git\/(refs|refs\/(.+|heads(\/[^\/]+)?|tags(\/[^\/]+)?)|trees(\/[^\/]+)?|blobs(\/[a-f0-9]{40}$)?|commits(\/[a-f0-9]{40}$)?)|stats\/(contributors|commit_activity|code_frequency|participation|punch_card))|licenses|licenses\/([^\/]+)|authorizations|authorizations\/((\d+)|clients\/([^\/]{20})|clients\/([^\/]{20})\/([^\/]+))|applications\/([^\/]{20})\/tokens|applications\/([^\/]{20})\/tokens\/([^\/]+)|enterprise\/(settings\/license|stats\/(issues|hooks|milestones|orgs|comments|pages|users|gists|pulls|repos|all))|staff\/indexing_jobs|users\/[^\/]+\/(site_admin|suspended)|setup\/api\/(start|upgrade|configcheck|configure|settings(authorized-keys)?|maintenance))(\?.*)?$/;


},{}],69:[function(require,module,exports){
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
},{}],70:[function(require,module,exports){
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


},{"../deprecate":64,"./querystring":74}],71:[function(require,module,exports){
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


},{}],72:[function(require,module,exports){
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


},{}],73:[function(require,module,exports){
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


},{}],74:[function(require,module,exports){
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


},{}],75:[function(require,module,exports){
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


},{"./base":62,"./deprecate":64,"./plugins/authorization":76,"./plugins/cache-handler":77,"./plugins/camel-case":78,"./plugins/fetch-all":79,"./plugins/hypermedia":80,"./plugins/pagination":81,"./plugins/path-validator":82,"./plugins/preview-apis":83,"./plugins/promise/library-first":84,"./plugins/read-binary":85,"./plugins/simple-verbs":86,"./plugins/use-post-instead-of-patch":87}],76:[function(require,module,exports){
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


},{"../helpers/base64":69}],77:[function(require,module,exports){
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


},{}],78:[function(require,module,exports){
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


},{"../plus":88}],79:[function(require,module,exports){
var FetchAll, fetchNextPage, getMore, pushAll;

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
        return requester.request('GET', path, query, null, function(err, items) {
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


},{}],80:[function(require,module,exports){
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


},{"../deprecate":64}],81:[function(require,module,exports){
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


},{}],82:[function(require,module,exports){
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


},{"../grammar/url-validator":68}],83:[function(require,module,exports){
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


},{"../grammar/preview-headers":66}],84:[function(require,module,exports){
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


},{"../../helpers/promise-find-library":71,"../../helpers/promise-find-native":72,"../../helpers/promise-node":73}],85:[function(require,module,exports){
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


},{"../helpers/querystring":74}],86:[function(require,module,exports){
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


},{"../helpers/querystring":74}],87:[function(require,module,exports){
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


},{}],88:[function(require,module,exports){
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


},{}],89:[function(require,module,exports){
var Requester, ajax, filter, forEach, plus, userAgent;

filter = require('lodash/collection/filter');

forEach = require('lodash/collection/forEach');

plus = require('./plus');

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
    this._emitter = this._clientOptions.emitter;
    this._pluginMiddleware = filter(plugins, function(arg) {
      var requestMiddleware;
      requestMiddleware = arg.requestMiddleware;
      return requestMiddleware;
    });
  }

  Requester.prototype.request = function(method, path, data, options, cb) {
    var acc, ajaxConfig, headers, mimeType, ref;
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
      'Accept': this._clientOptions.acceptHeader,
      'User-Agent': userAgent || void 0
    };
    acc = {
      method: method,
      path: path,
      headers: headers,
      options: options,
      clientOptions: this._clientOptions
    };
    forEach(this._pluginMiddleware, function(plugin) {
      var mimeType, ref;
      ref = plugin.requestMiddleware(acc) || {}, method = ref.method, headers = ref.headers, mimeType = ref.mimeType;
      if (method) {
        acc.method = method;
      }
      if (mimeType) {
        acc.mimeType = mimeType;
      }
      return plus.extend(acc.headers, headers);
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
    if ((ref = this._emitter) != null) {
      ref.emit('start', method, path, data, options);
    }
    return ajax(ajaxConfig, (function(_this) {
      return function(err, val) {
        var emitterRate, jqXHR, json, rateLimit, rateLimitRemaining, rateLimitReset;
        jqXHR = err || val;
        if (_this._emitter) {
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
          _this._emitter.emit('request', emitterRate, method, path, data, options, jqXHR.status);
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


},{"./plus":88,"lodash/collection/filter":2,"lodash/collection/forEach":3}],90:[function(require,module,exports){
var VerbMethods, extend, filter, forOwn, toPromise, toQueryString,
  slice = [].slice;

filter = require('lodash/collection/filter');

forOwn = require('lodash/object/forOwn');

extend = require('lodash/object/extend');

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
    var i, j, len, len1, plugin, promisePlugins, ref, ref1;
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
    ref = filter(plugins, function(arg) {
      var verbs;
      verbs = arg.verbs;
      return verbs;
    });
    for (i = 0, len = ref.length; i < len; i++) {
      plugin = ref[i];
      extend(this._syncVerbs, plugin.verbs);
    }
    this._asyncVerbs = {};
    ref1 = filter(plugins, function(arg) {
      var asyncVerbs;
      asyncVerbs = arg.asyncVerbs;
      return asyncVerbs;
    });
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      plugin = ref1[j];
      extend(this._asyncVerbs, plugin.asyncVerbs);
    }
  }

  VerbMethods.prototype.injectVerbMethods = function(path, obj) {
    var allPromises, newPromise, ref;
    if (this._promisePlugin) {
      ref = this._promisePlugin.promiseCreator, newPromise = ref.newPromise, allPromises = ref.allPromises;
    }
    obj.url = path;
    forOwn(this._syncVerbs, (function(_this) {
      return function(verbFunc, verbName) {
        return obj[verbName] = function() {
          var args, makeRequest;
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          makeRequest = function() {
            var cb, data, method, options, originalArgs, ref1;
            cb = arguments[0], originalArgs = 2 <= arguments.length ? slice.call(arguments, 1) : [];
            ref1 = verbFunc.apply(null, [path].concat(slice.call(originalArgs))), method = ref1.method, path = ref1.path, data = ref1.data, options = ref1.options;
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


},{"./helpers/querystring":74,"lodash/collection/filter":2,"lodash/object/extend":55,"lodash/object/forOwn":56}]},{},[75])(75)
});