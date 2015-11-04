;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['lodash'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('lodash'));
  } else {
    root._ = factory(root._);
  }
}(this, function(_) {

    
    

    _.mixin({

        /**
         * Returns indexes for elements which do not match between two arrays.
         *
         * @param {array} arr1 Source array
         * @param {array} arr2 Target array
         * @return {array} Array of indexes for changed elements.
         */
        changed: function(arr1, arr2) {
            _.checkArray(arr1);
            _.checkArray(arr2);

            return _.indexesOf(arr1, function(val, key) {
                return val !== arr2[key];
            });
        }
    });

    


    
    

    _.mixin({

        /**
         * Iterate elements in an array skipping any at given keys.
         *
         * @param {array} arr Source array
         * @param {array} keys Keys array
         * @param {function} func Function called on allowed elements.
         * @return {array} Source array.
         */
        exceptKeys: function(arr, keys, func) {
            _.checkArray(arr);
            _.checkArray(keys);
            _.checkFunction(func);

            _.each(arr, function(value, key) {
                if (!_.includes(keys, key)) {
                    func(value, key);
                }
            });
        }
    });

    


    

    _.mixin({

        /**
         * Returns an array of indexes where elements pass the validator.
         *
         * @param {array} arr Target array
         * @param {function} validator Validation method.
         * @return {array} Array of indexes where element matched.
         */
        indexesOf: function(arr, validator) {
            _.checkArray(arr);
            _.checkFunction(validator);

            var keys = [];

            _.each(arr, function(value, key) {
                if (validator(value, key)) {
                    keys.push(key);
                }
            });

            return keys;
        }
    });

    


    // Inject internal deps
    
    

    _.mixin({

        /**
         * Lightens an RGB color.
         *
         * @param {object} color Object with "r", "g", "b" properties.
         * @param {int} lightenBy Value to lighten a color by.
         * @return {object} Color with RGB values
         */
        lighten: function(color, lightenBy) {
            lightenBy = lightenBy || 200;
            var newRed = color.r + lightenBy;
            var newGreen = color.g + lightenBy;
            var newBlue = color.b + lightenBy;

            return {
                r: _.clamp(newRed, 255),
                g: _.clamp(newGreen, 255),
                b: _.clamp(newBlue, 255)
            };
        }
    });

    


    _.mixin({

        /**
         * Generates a color via random RGB values.
         *
         * @return {object} Object with RGB values
         */
        randomColor: function() {
            return {
                r: _.random(0, 255),
                g: _.random(0, 255),
                b: _.random(0, 255)
            };
        }
    });

    


    

    _.mixin({

        /**
         * Clamps a number to a given maximum, or minimum/maximum range.
         *
         * @param {int} value Numeric value
         * @param {int} a Maximum value. Minimum value if "b" defined.
         * @param {int} b Maximum value, if "a" defined.
         * @return {int} Resulting number.
         */
        clamp: function(value, a, b) {
            _.checkNumber(value);
            _.checkNumber(a);

            // Treat second argument as a max if no min defined
            var max = (_.isNumber(b) ? b : a);
            var min;
            if (_.isNumber(b)) {
                min = a;
            }

            if (value > max) {
                value = max;
            }

            if (_.isNumber(min) && value < min) {
                value = min;
            }

            return value;
        }
    });

    


    

    _.mixin({

        /**
         * Clones source and wraps with _.chain. Destroys original.
         *
         * @param {object|array} source Source chainable.
         * @return {object} Lodash chain.
         */
        cage: function(source) {
            var clone = _.cloneDeep(source);

            if (_.isObject(source)) {
                _.each(source, function(val, key) {
                    delete source[key];
                });
            }

            if (_.isArray(source)) {
                _.remove(source, function() {
                    return true;
                });
            }

            return _.chain(clone);
        }
    });

    


    

    _.mixin({

        /**
         * Creates an immutable property on an object.
         *
         * @param {object} obj Target object
         * @param {string} name Property name.
         * @param {mixed} value Property value.
         * @return {object} Target object with immutable property.
         */
        const: function(obj, name, value) {
            _.checkObject(obj);
            _.checkString(name);

            Object.defineProperty(obj, name, {
                value: value,
                enumerable: true,
                configurable: false,
                writable: false
            });

            return obj;
        }
    });

    


    
    
    

    _.mixin({

        /**
         * Creates a new object with constants taken from an
         * object or nested object's properties.
         * (via _.constant)
         *
         * @param {object} obj Source object
         * @return {object} Resulting object
         */
        finalize: function(obj) {
            _.checkObject(obj);

            var replacement = {};

            _.each(obj, function(value, key) {
                // Finalize nested object
                if (_.isPlainObject(value)) {
                    value = _.finalize(value);
                } else if (_.isArray(value)) {
                    // Finalize objects within array
                    _.each(value, function(element, index) {
                        if (_.isPlainObject(element)) {
                            value[index] = _.finalize(element);
                        }
                    });
                }

                _.const(replacement, key, value);
            });

            return replacement;
        }
    });

    


    

    _.mixin({

        /**
         * Parses query string into key/value object.
         *
         * @param {string} queryStr Query string.
         * @return {pbject} Key/value map.
         */
        fromQueryString: function(queryStr) {
            _.checkString(queryStr);

            var obj = {};
            var segments = queryStr.split('&');

            _.each(segments, function(segment) {
                var split = segment.split('=');
                obj[split[0]] = decodeURIComponent(split[1]);
            });

            return obj;
        }
    });

    


    

    _.mixin({

        /**
         * If _.has returns true, run a validator on value.
         *
         * @param {mixed} obj Collection for _.has
         * @param {string|number} prop Propert/key name.
         * @param {function} validator Function to validate value.
         * @return {boolean} Whether collection has prop, and it passes validation
         */
        hasOfType: function(obj, prop, validator) {
            _.checkKey(prop);
            _.checkFunction(validator);

            var result = false;

            if (_.has(obj, prop)) {
                result = validator(_.get(obj, prop));
            }

            return result;
        }
    });

    


    _.mixin({

        /**
         * Determines if a value is a collection - either an array or an object.
         *
         * @param {mixed} value Value to check
         * @return {boolean} Whether value is an array or object
         */
        isCollection: function(value) {
            return (_.isArray(value) || _.isPlainObject(value));
        }
    });

    


    

    _.mixin({

        /**
         * Map a function to filtered array elements.
         *
         * @param {array} arr Array
         * @param {function} validator Validation method for each element.
         * @param {function} func Function to call on each valid element.
         * @return {array} Modified array
         */
        mapFiltered: function(arr, validator, func) {
            _.checkArray(arr);
            _.checkFunction(func);
            _.checkFunction(validator);

            return _.map(_.filter(arr, validator), func);
        }
    });

    


    
    

    _.mixin({

        /**
         * Merge prototype properties from source to target.
         *
         * @param {object|function} target Target object.
         * @param {object|function} source Object/function to mixin.
         * @return {array} Modified array
         */
        mixInto: function(target, source) {
            _.check(target, _.hasPrototype);
            _.check(source, _.hasPrototype);

            if (!_.isPlainObject(target)) {
                target = _.getPrototype(target);
            }

            return _.assign(target, _.getPrototype(source));
        }
    });

    


    // Inject internal deps
    
    

    _.mixin({

        /**
         * Run _.omit recursively down a collection.
         *
         * @param {array|object} obj Collection
         * @param {array} keys Array of property/key names to omit
         * @return {array|object} Modified collection.
         */
        omitDeep: function(obj, keys) {
            _.checkCollection(obj);
            _.checkArray(keys);

            return _.recurse(obj, function(item) {
                if (_.isPlainObject(item)) {
                    item = _.omit(item, keys);
                }

                return item;
            });
        }
    });

    


    

    _.mixin({

        /**
         * Invoke a function recursively on every element in a collection.
         *
         * @param {object|array} col Collection
         * @param {function} func Function to invoke
         * @return {object|array} Modified collection
         */
        recurse: function(col, func) {
            _.checkObject(col);
            _.checkFunction(func);

            col = func(col);

            _.each(col, function(item, key) {
                if (_.isObject(item)) {
                    col[key] = _.recurse(item, func);
                } else {
                    col[key] = func(item);
                }
            });

            return col;
        }
    });

    


    

    _.mixin({

        /**
         * Gives a setter for `prop` only to the first requesting caller.
         *
         * Creates request[Prop]Setter and get[Prop] methods
         * on the source object. The first caller to request[Prop]Setter
         * gets it and therefore is the only one allowed to invoke it.
         *
         * Any caller may use the getter.
         *
         * @param {object} obj Target object.
         * @param {string} prop Property name.
         * @return {obj} Modified object.
         */
        requestSetter: function(obj, prop) {
            _.checkObject(obj);
            _.checkString(prop);

            var capped = _.capitalize(prop);

            return (function() {
                var setter;
                var value = obj[prop];
                delete obj[prop];

                obj['request' + capped + 'Setter'] = function() {
                    if (setter) {
                        throw new Error('Setter has already been given.');
                    }

                    setter = function(newValue) {
                        value = newValue;
                    };

                    return setter;
                };

                obj['get' + capped] = function() {
                    return value;
                };

                return obj;
            }());
        }
    });

    


    
    
    

    _.mixin({

        /**
         * Recursively invokes "toObject" on objects which support the method.
         *
         * Many complex objects from libraries like Collections.js, Mongoose,
         * support to a toObject method for converting to plain objects.
         *
         * @param {object} obj Original object.
         * @return {object} Plain object.
         */
        toObject: function(obj) {
            return _.recurse(obj, function(item) {
                if (_.hasOfType(item, 'toObject', _.isFunction)) {
                    item = item.toObject();
                }

                return item;
            });
        }
    });

    


    

    _.mixin({

        /**
         * Converts an object's key/values to a query string.
         *
         * @param {object} obj Source key/value collection
         * @return {string} Query string
         */
        toQueryString: function(obj) {
            _.checkPlainObject(obj);

            var segments = [];

            _.each(obj, function(value, key) {
                segments.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
            });

            return segments.join('&');
        }
    });

    


    

    _.mixin({

        /**
         * Validates a source object's properties against a defined model.
         * If the validation passes, the property is accepted, otherwise
         * a default value will be used.
         *
         * @param {Object} models Description object of accepted properties
         * @param {Object} source Object to filter through validators
         * @param {Boolean} strict Only properties defined in the model allowed through
         * @return {Object} A new object
         */
        validatedAssign: function(models, source, strict) {
            _.checkPlainObject(models);
            _.checkPlainObject(source);

            strict = _.isBoolean(strict) ? strict : true;

            var result = {};
            _.each(models, function(model, key) {
                // Determine final value
                var takenValue = _.has(model, 'default') ? model.default : model;
                if (_.has(source, key)) {
                    // Use the given validator
                    if (_.has(model, 'validator')) {
                        // Ensure callable
                        if (!_.isFunction(model.validator)) {
                            throw new TypeError('Invalid validator function for ' + key + '.');
                        }

                        // Validate
                        if (model.validator(source[key])) {
                            takenValue = source[key];
                        }
                    } else if (_.isPlainObject(model)) {
                        // compare their types
                        takenValue = _.validatedAssign(model, source[key]);
                    } else if (typeof model === typeof source[key]) {
                        // Allow if they're the same type
                        takenValue = source[key];
                    }
                }
                result[key] = takenValue;
            });

            if (strict !== true) {
                _.each(source, function(value, key) {
                    if (!_.has(result, key)) {
                        result[key] = value;
                    }
                });
            }

            return result;
        }
    });

    


    

    _.mixin({

        /**
         * Shorthand object creation when sole property is a variable, or a path.
         *
         * @param {string|number} path Property
         * @param {mixed} value Value
         * @return {object} Resulting object
         */
        with: function(path, value) {
            _.checkKey(path);

            var obj = {};
            var paths = path.split('.');
            var l = paths.length;
            var pointer = obj;

            _.each(paths, function(path, index) {
                if (index === l - 1) {
                    pointer[path] = value;
                } else {
                    pointer[path] = {};
                }

                pointer = pointer[path];
            });

            return obj;
        }
    });

    


    _.mixin({

        /**
         * Generates a random alphanumeric key.
         *
         * @param {int} length Desired length.
         * @return {string} Key
         */
        generateKey: function(length) {
            var text = '';
            var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

            for (var i = 0, l = (length || 16); i < l; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        }
    });

    


    _.mixin({

        /**
         * Returns true if val is a string, and is not empty.
         *
         * @param {object} val A value.
         * @return {boolean} True if a string, and non-empty.
         */
        isNonEmptyString: function(val) {
            return _.isString(val) && val.trim() !== '';
        }
    });

    


    

    _.mixin({

        /**
         * Returns a url-safe "slug" form of a string.
         *
         * @param {string} str String value.
         * @return {string} URL-safe form of a string.
         */
        slugify: function(str) {
            _.checkString(str);

            return str.trim().toLowerCase().replace(/ /g, '-').replace(/([^a-zA-Z0-9\._-]+)/, '');
        }
    });

    


    var getType = function(validator, baseDefault, value, userDefault) {
        var result;

        if (validator(value)) {
            result = value;
        } else if (validator(userDefault)) {
            result = userDefault;
        } else {
            result = baseDefault;
        }

        return result;
    };

    _.mixin({

        /**
         * Returns value if a array, otherwise a default array.
         *
         * @param {mixed} value Source value
         * @param {number} userDefault Customd default if value is invalid type.
         * @return {number} Final array.
         */
        getArray: function(value, userDefault) {
            return getType(_.isArray, [], value, userDefault);
        },

        /**
         * Returns value if a boolean, otherwise a default boolean.
         *
         * @param {mixed} value Source value
         * @param {number} userDefault Customd default if value is invalid type.
         * @return {number} Final boolean.
         */
        getBoolean: function(value, userDefault) {
            return getType(_.isBoolean, false, value, userDefault);
        },

        /**
         * Returns value if a number, otherwise a default number.
         *
         * @param {mixed} value Source value
         * @param {number} userDefault Customd default if value is invalid type.
         * @return {number} Final number.
         */
        getNumber: function(value, userDefault) {
            return getType(_.isNumber, 0, value, userDefault);
        },

        /**
         * Returns value if a string, otherwise a default string.
         *
         * @param {mixed} value Source value
         * @param {number} userDefault Customd default if value is invalid type.
         * @return {number} Final string.
         */
        getString: function(value, userDefault) {
            return getType(_.isString, '', value, userDefault);
        }
    });

    


    _.mixin({

        /**
         * Returns the prototype for the given object.
         *
         * @param {object} obj Source object
         * @return {object} Found prototype or null.
         */
        getPrototype: function(obj) {
            var prototype;

            if (!_.isUndefined(obj) && !_.isNull(obj)) {
                if (!_.isObject(obj)) {
                    prototype = obj.constructor.prototype;
                } else if (_.isFunction(obj)) {
                    prototype = obj.prototype;
                } else {
                    prototype = Object.getPrototypeOf(obj);
                }
            }

            return prototype;
        }
    });

    


    
    
    

    _.mixin({

        /**
         * Returns whether or not a prototype exists or a given property exists on the prototype.
         *
         * @param {object} obj Source object
         * @param {string} prop Prototype property.
         * @return {boolean} If prototype exists on the object.
         */
        hasPrototype: function(obj, prop) {
            var result = _.getPrototype(obj);

            if (result && _.isNonEmptyString(prop)) {
                result = result[prop];
            }

            return _.toBool(result);
        }
    });

    


    
    
    

    _.mixin({

        /**
         * Returns whether an object has a prototype property of the given type.
         *
         * @param {object} obj Source object
         * @param {string} prop Prototype property.
         * @param {function} validator Validation function.
         * @return {boolean} If prototype property exists and is the correct type.
         */
        hasPrototypeOfType: function(obj, prop, validator) {
            _.checkKey(prop);
            _.checkFunction(validator);

            var proto = _.getPrototype(obj);
            var result = false;

            if (proto) {
                result = validator(proto[prop]);
            }

            return result;
        }
    });

    


    

    _.mixin({

        /**
         * Throw a TypeError if value doesn't match one of any provided validation methods.
         *
         * @param {mixed} value Value
         * @return {void}
         */
        check: function(value) {
            var validators = _.filter(Array.prototype.slice.call(arguments, 1), _.isFunction);
            if (_.isEmpty(validators)) {
                throw new TypeError('You must provide at least one validation method.');
            }

            var valid = false;

            _.each(validators, function(validator) {
                if (validator(value)) {
                    valid = true;

                    // Exit each
                    return false;
                }
            });

            if (!valid) {
                throw new TypeError('Argument is not any of the accepted types.');
            }
        },

        /**
         * Throw a TypeError if value isn't an array.
         *
         * @param {mixed} arr Value
         * @return {void}
         */
        checkArray: function(arr) {
            if (!_.isArray(arr)) {
                throw new TypeError('Argument must be an array.');
            }
        },

        /**
         * Throw a TypeError if value isn't a boolean.
         *
         * @param {mixed} bool Value
         * @return {void}
         */
        checkBoolean: function(bool) {
            if (!_.isBoolean(bool)) {
                throw new TypeError('Argument must be a boolean.');
            }
        },

        /**
         * Throw a TypeError if value isn't an array or object.
         *
         * @param {mixed} col Value
         * @return {void}
         */
        checkCollection: function(col) {
            if (!_.isArray(col) && !_.isPlainObject(col)) {
                throw new TypeError('Argument must be an array or object.');
            }
        },

        /**
         * Throw a TypeError if value isn't a function.
         *
         * @param {mixed} func Value
         * @return {void}
         */
        checkFunction: function(func) {
            if (!_.isFunction(func)) {
                throw new TypeError('Argument must be a function.');
            }
        },

        /**
         * Throw a TypeError if value isn't a number/string.
         *
         * @param {mixed} val Value
         * @return {void}
         */
        checkKey: function(val) {
            if (!_.isNonEmptyString(val) && !_.isNumber(val)) {
                throw new TypeError('Argument must be a string or number.');
            }
        },

        /**
         * Throw a TypeError if value _.isEmpty
         *
         * @param {mixed} val Value
         * @return {void}
         */
        checkNonEmpty: function(val) {
            if (_.isEmpty(val)) {
                throw new TypeError('Argument may not be empty.');
            }
        },

        /**
         * Throw a TypeError if value isn't a number.
         *
         * @param {mixed} num Value
         * @return {void}
         */
        checkNumber: function(num) {
            if (!_.isNumber(num)) {
                throw new TypeError('Argument must be a number.');
            }
        },

        /**
         * Throw a TypeError if value isn't an object.
         *
         * @param {mixed} obj Value
         * @return {void}
         */
        checkObject: function(obj) {
            if (!_.isObject(obj)) {
                throw new TypeError('Argument must be an object.');
            }
        },

        /**
         * Throw a TypeError if value isn't a plain object.
         *
         * @param {mixed} obj Value
         * @return {void}
         */
        checkPlainObject: function(obj) {
            if (!_.isPlainObject(obj)) {
                throw new TypeError('Argument must be a plain object.');
            }
        },

        /**
         * Throw a TypeError if value isn't a string.
         *
         * @param {mixed} str Value
         * @return {void}
         */
        checkString: function(str) {
            if (!_.isString(str)) {
                throw new TypeError('Argument must be a string.');
            }
        }
    });

    


    _.mixin({

        /**
         * Converts a value to a boolean to work properly within explicit comparisons.
         *
         * @param {mixed} value Source value
         * @return {boolean} Resulting boolean
         */
        toBool: function(value) {
            return Boolean(value);
        }
    });

    

return _;
}));
