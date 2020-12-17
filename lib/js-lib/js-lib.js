__js_debug__ = true;
if (!Function.prototype.bind) {
    Function.prototype.bind = function (thisArg) {
        var _this = this, slice = Array.prototype.slice, args = slice.call(arguments, 1);
        return function () {
            return _this.apply(thisArg, args.concat(slice.call(arguments)));
        };
    };
};

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchItem, fromIndex) {
        var len = this.length;
        if (len === 0) {
            return -1;
        }
        var from = (typeof fromIndex !== 'undefined') ? fromIndex : 0;
        if (from >= len) {
            return -1;
        }
        if (from < 0) {
            from = len - Math.abs(from);
            if (from < 0) {
                from = 0;
            }
        }
        for ( var i = from; i < this.length; ++i) {
            if (this[i] === searchItem) {
                return i;
            }
        }
        return -1;
    };
};

if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function (searchItem, fromIndex) {
        var len = this.length;
        if (len === 0) {
            return -1;
        }
        var from = (typeof fromIndex !== 'undefined') ? fromIndex : len;
        if (from >= 0) {
            from = Math.min(from, len - 1);
        }
        else {
            from = len - Math.abs(from);
        }
        for ( var i = from; i >= 0; --i) {
            if (this[i] === searchItem) {
                return i;
            }
        }
        return -1;
    };
};

if (!Array.prototype.forEach) {
    Array.prototype.forEach = function forEach (callback, thisArg) {
        var T = undefined, k;

        if (this == null) {
            throw new TypeError("this is null or not defined");
        }

        // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0; // Hack to convert O.length to a UInt32

        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if ({}.toString.call(callback) !== "[object Function]") {
            throw new TypeError(callback + " is not a function");
        }

        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (thisArg) {
            T = thisArg;
        }

        // 6. Let k be 0
        k = 0;

        // 7. Repeat, while k < len
        while (k < len) {

            var kValue;

            // a. Let Pk be ToString(k).
            // This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
            // This step can be combined with c
            // c. If kPresent is true, then
            if (Object.prototype.hasOwnProperty.call(O, k)) {

                // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                kValue = O[k];

                // ii. Call the Call internal method of callback with T as the this value and
                // argument list containing kValue, k, and O.
                callback.call(T, kValue, k, O);
            }
            // d. Increase k by 1.
            k++;
        }
        // 8. return undefined
    };
};

if (!Array.prototype.filter) {
    Array.prototype.filter = function (fun, thisp) {
        if (this == null)
            throw new TypeError();

        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun != "function")
            throw new TypeError();

        var res = [];
        var thisp = arguments[1];
        for ( var i = 0; i < len; i++) {
            if (i in t) {
                var val = t[i]; // in case fun mutates this
                if (fun.call(thisp, val, i, t))
                    res.push(val);
            }
        }

        return res;
    };
};

if (!Array.prototype.map) {
    Array.prototype.map = function (callback, thisArg) {

        var T, A, k;

        if (this == null) {
            throw new TypeError(" this is null or not defined");
        }

        // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if (typeof callback !== "function") {
            throw new TypeError(callback + " is not a function");
        }

        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (thisArg) {
            T = thisArg;
        }

        // 6. Let A be a new array created as if by the expression new Array(len) where Array is
        // the standard built-in constructor with that name and len is the value of len.
        A = new Array(len);

        // 7. Let k be 0
        k = 0;

        // 8. Repeat, while k < len
        while (k < len) {

            var kValue, mappedValue;

            // a. Let Pk be ToString(k).
            // This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
            // This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {

                // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                kValue = O[k];

                // ii. Let mappedValue be the result of calling the Call internal method of callback
                // with T as the this value and argument list containing kValue, k, and O.
                mappedValue = callback.call(T, kValue, k, O);

                // iii. Call the DefineOwnProperty internal method of A with arguments
                // Pk, Property Descriptor {Value: mappedValue, : true, Enumerable: true, Configurable: true},
                // and false.

                // In browsers that support Object.defineProperty, use the following:
                // Object.defineProperty(A, Pk, { value: mappedValue, writable: true, enumerable: true, configurable:
                // true });

                // For best browser support, use the following:
                A[k] = mappedValue;
            }
            // d. Increase k by 1.
            k++;
        }

        // 9. return A
        return A;
    };
};
// refrain to use $package operator since is not yet defined
(function () {
    if (typeof js === "undefined") {
        js = {};
    }
    if (typeof js.ua === "undefined") {
        js.ua = {};
    }
})();

/**
 * System IO. This utility class provides standard system dialogs and the global {@link #error(Object) error handler}
 * used to report erroneous conditions. System dialogs resemble built-in dialogs provided by {@link Window} object, but
 * they are asynchronous. User space code may override system dialogs and supply dialog boxes based on HTML template.
 * 
 * <pre>
 *  js.ua.System.alert = function(message) {
 *      // open dialog box based on HTML template  
 *  }
 * </pre>
 * 
 * Please note that all system dialogs provided by this utility are asynchronous. For this reason dialogs that should
 * return a value require callback and optional scope arguments. Also be aware that {@link #alert(String, Object...)}
 * will not block running thread, i.e. script engine will continue executing lines of source code after alert
 * invocation; this is in contrast with built-in {@link Window#alert(String)} function supplied by host environment.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 */
js.ua.System = {
    /**
     * Generic error message used in production code. Note that if debug is active detailed error message is used
     * instead of this one.
     * 
     * @type String
     */
    _ERROR_MESSAGE : "Temporary failure. Please refresh the page.",

    /**
     * Print message to system console.
     * 
     * @param String message message to print.
     */
    print : function (message) {
        if (typeof console !== "undefined") {
            console.log(message.replace(/<br \/>/g, " "));
        }
    },

    /**
     * Global error handler. Because a JavaScript application is basically event driven almost all its code is executed
     * in event listeners, timer or asynchronous requests callbacks. This global error handler is the point were all
     * errors are treated. It is fairy unsophisticated, just log the error and {@link #alert}; it uses
     * {@link #_getErrorMessage} to format alert message. Application layers may override this handler and offer more
     * robust error management.
     * 
     * @param Object er error object or formatted string.
     */
    error : function (er) {
        js.ua.System.print(js.ua.System._getErrorMessage(arguments));
        js.ua.System.alert(this._ERROR_MESSAGE);
    },

    /**
     * Displays an asynchronous alert box with the specified formatted message. Given message may be formatted as
     * supported by {@link js.lang.Operator#$format(String,Object...)} operator.
     * 
     * <pre>
     * 	js.ua.System.alert("Formatted %s.", "message");
     * 	// above code display alert dialog and return immediately
     * </pre>
     * 
     * Please note system alert is asynchronous, it returns immediately after alert dialog display. Finally, this method
     * is NOP if invoked with no arguments.
     * 
     * @param String message alert message,
     * @param Object... args optional values, if message is formatted.
     */
    alert : function (message) {
        if (arguments.length > 0) {
            if (arguments.length > 1) {
                message = $format(arguments);
            }
            window.setTimeout(function () {
                window.alert(message);
            }, 1);
        }
    },

    /**
     * Alias for {@link #alert(String,Object...)}. If user space code overrides system dialogs it should display the
     * <em>toast</em> with no button, for a limited period of time. Anyway, this library implementation delegates
     * standard {@link Window#alert(String)}.
     * 
     * <pre>
     * 	js.ua.System.toast("Formatted %s.", "message");
     * 	// above code display toast dialog and return immediately
     * </pre>
     * 
     * Please note system toast is asynchronous, it returns immediately after dialog display. Finally, this method is
     * NOP if invoked with no arguments.
     * 
     * @param String message toast message,
     * @param Object... args optional values, if message is formatted.
     */
    toast : function (message) {
        if (arguments.length > 0) {
            if (arguments.length > 1) {
                message = $format(arguments);
            }
            window.setTimeout(function () {
                window.alert(message);
            }, 1);
        }
    },

    /**
     * Displays a prompt dialog box with given message and callback and returns immediately.
     * 
     * <pre>
     * 	js.ua.System.prompt("Please enter a value.", function(value) {
     * 		if(value === undefined) {
     * 			// some action on user cancel
     * 		}
     * 		if(value == null) {
     * 			// some action on user ok but no text input
     * 		}
     * 		if(value) {
     * 			// value is not null and OK button was pressed
     * 		}
     * 	});
     * </pre>
     * 
     * Please note system toast is asynchronous, it returns immediately after dialog display.
     * <p>
     * Prompt dialog has two buttons: OK and cancel. On OK callback is invoked with the text input value, or null if
     * user enter no text. On cancel callback is invoked with undefined value. This way, a true boolean test on value
     * means user enter some text and OK button was pressed. Finally, this method is NOP if invoked with no arguments.
     * 
     * @param String message prompt message,
     * @param Function callback prompt value handler,
     * @param Object scope optional callback run-time scope, default to global scope.
     * @assert Message is not undefined, null or empty, callback argument is a function and scope argument is an object,
     *         if present.
     */
    prompt : function (message, callback, scope) {
        if (arguments.length > 0) {
            if (arguments.length > 1) {
                message = $format(arguments);
            }
            window.setTimeout(function () {
                var prompt = window.prompt(message);
                if (prompt == null) {
                    // user cancel; convert to undefined
                    prompt = undefined;
                }
                else {
                    // user pressed OK
                    if (prompt.length === 0) {
                        // user OK but no input; convert to null
                        prompt = null;
                    }
                }
                callback.call(scope || window, prompt);
            }, 1);
        }
    },

    /**
     * Displays a confirmation dialog with given message and callback then returns immediately.
     * 
     * <pre>
     * 	js.ua.System.confirm("Please confirm action...", function(ok) {
     * 		if(ok) {
     * 			// perform critical action
     * 		}
     * 	}); 
     * </pre>
     * 
     * Please note that confirm dialog is asynchronous, it returns immediately after dialog display. Since confirm is
     * asynchronous it has a callback function invoked with boolean true if user press OK button or false on cancel.
     * Finally, this method is NOP if invoked with no arguments.
     * 
     * @param String message ask for confirmation message,
     * @param Function callback confirmation handler,
     * @param Object scope optional callback run-time scope, default to global scope.
     * @assert Message is not undefined, null or empty, callback argument is a function and scope argument is an object,
     *         if present.
     */
    confirm : function (message, callback, scope) {
        if (arguments.length > 0) {
            if (arguments.length > 1) {
                message = $format(arguments);
            }
            window.setTimeout(function () {
                callback.call(scope || window, window.confirm(message));
            }, 1);
        }
    },

    /**
     * Get formatted error message. Prepare error message for displaying based on array of arguments. If array"s first
     * item is an error object uses its name and message to compile returned error message; otherwise array can contains
     * a variable number of items but first should be a string, possible formatted as accepted by
     * {@link js.lang.Operator#$format} pseudo-operator.
     * 
     * @param Array args arguments list.
     * @return String error message.
     */
    _getErrorMessage : function (args) {
        if (args[0] instanceof Error) {
            var er = args[0];
            var s = er.name;
            if (er.message) {
                s += ("\r\n" + er.message);
            }
            return s;
        }
        return $format(args);
    }
};

(function () {
    // Replace global error handler with with a more explicit one, if debugging active.
    if (typeof __js_debug__ !== "undefined") {
        js.ua.System.error = function (er) {
            var s = js.ua.System._getErrorMessage(arguments);
            js.ua.System.print(s);
            js.ua.System.alert(s);
        };
    }
})();
// refrain to use $package operator since is not yet defined
(function () {
    if (typeof js === "undefined") {
        js = {};
    }
    if (typeof js.lang === "undefined") {
        js.lang = {};
    }
})();

/**
 * Language pseudo-operators. This utility class implements language operators extension, globally accessible. It
 * supplies support for package declaration and class extension, hard dependencies declaration, global <b>C</b> like
 * string formatter, static and legacy blocks, assertion and logging.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 */
js.lang.Operator = {
    /**
     * Valid class name pattern.
     * 
     * @type RegExp
     */
    _CLASS_NAME_REX : /^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)*(\.[A-Z][a-zA-Z0-9_]*)+$/,

    /**
     * Valid package name pattern.
     * 
     * @type RegExp
     */
    _PACKAGE_NAME_REX : /^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)*$/,

    /**
     * Assert expression is true. Evaluate expression and if false throws {@link js.lang.AssertException}. If assertion
     * is disabled, by calling $assert.disable(), this operator does nothing, i.e. is replaced with an empty function.
     * Is possible to disable assertions for block of code like in snippet below:
     * 
     * <pre>
     * 	$assert.disable();
     * 	...
     * 	block of code executed with assertions disabled
     * 	...
     * 	$assert.enable();
     * </pre>
     * 
     * @param Boolean expression expression to evaluate,
     * @param String method method qualified name,
     * @param String message assertion failure reason,
     * @param Object... args optional message arguments, if formatted.
     * @note j(s)-lib building tool can be instructed to remove assertion statements all together from created archive.
     */
    $assert : function (expression, method, message) {
        if (Boolean(expression)) {
            return;
        }

        switch (arguments.length) {
        case 1:
            message = "Assertion fails";
            break;

        case 2:
            message = "Assertion fails on " + method;
            break;

        case 3:
            message = method + ": " + message;
            break;

        default:
            var args = [ message ];
            for ( var i = 3; i < arguments.length; ++i) {
                args.push(arguments[i]);
            }
            message = method + ": " + $format.apply(this, args);
        }
        throw new js.lang.AssertException(message);
    },

    /**
     * Static initializer. Classically, static fields initialization logic is executed at script loading phase. A buggy
     * initialization code may lead to uncaught exception and entire script loading failure. This operator takes care to
     * execute initialization logic in a safe context: any exceptions are caught and logged. Given static initializer
     * code should require no arguments and return void.
     * 
     * <p>
     * Note that initializer code is actually executed by {@link js.ua.Window} after DOM ready but before triggering
     * related events. This way static initialization occur after all classes completely loaded but before launching
     * application logic.
     * 
     * <p>
     * If asynchronous mode is not convenient one may force immediate execution but keep in mind user code is
     * responsible for dependency resolution using {@link #$include} operator.
     * 
     * <p>
     * Finally, static initializer code is executed in global scope.
     * 
     * @param Function code static initializer code,
     * @param Boolean... sync force synchronous mode, default to false.
     */
    $static : function (code, sync) {
        if (sync === true) {
            try {
                code();
            } catch (er) {
                js.ua.System.error("Static initialization fails. %s", er);
            }
        }
        else {
            js.lang.Operator.$static._initializers.push(code);
        }
    },

    /**
     * Preload DOM element class identified by given comma separated list of selectors. If given <code>selectors</code>
     * argument is a class constructor create a selector based on class qualified name like below:
     * 
     * <pre>
     * 	[data-class="comp.prj.ClassName"]
     * </pre>
     * 
     * Please note that this method just register selector into internal list. The actual preload operation is executed
     * from {@link js.ua.Window#_fireDomReady()}, just before return, but after <code>dom-ready</code> event was
     * fired.
     * 
     * @param Object selectors target element selectors or class constructor.
     * @note If given argument is a class constructor that class should implement <code>toString</code> method
     *       returning class qualified name.
     */
    $preload : function (selectors) {
        if (typeof selectors === "function") {
            selectors = "[data-class='" + selectors.prototype.toString() + "']";
        }
        js.lang.Operator.$preload._selectors.push(selectors);
    },

    /**
     * Package declaration. Every package should be declared before creating children classes. The notion of package is
     * not yet implemented in JavaScript and j(s)-script solution is actually a name space emulation using object
     * scopes. So, when one creates js.util package next code sequence is actually empowered:
     * 
     * <pre>
     * 	js = {};
     *	js.util = {};
     * </pre>
     * 
     * Note that behavior is not defined if user code corrupts package name space by assign a different value to
     * constituent objects, e.g. <code>js = value;</code>. Also do not declare local variable with packages root name
     * like <code>var js = value;</code>. This is known limitation with no solution for now and care must be taken to
     * avoid it. Finally, trying to declare a package already existing is ignored.
     * 
     * <pre>
     * $package("comp.prj");
     * 
     * comp.prj.Class = function() {
     *  // do not assign values to package component even if 3pty libraries
     *  js.util = "value";
     * 
     *  // do not declare local variable with package root name even if 3pty libraries
     *  var js = "value"; 
     * 
     *  // otherwise next call will fail
     *  js.lang.Types();
     * }
     * </pre>
     * 
     * Running j(s)-lint in build phase ensure above condition is early caught.
     * 
     * @param String name package name. A valid package name must contains only lower case letter and decimal digits but
     *        starts with letter.
     */
    $package : function (name) {
        var names, scope, i, j;

        if (!name || !js.lang.Operator._PACKAGE_NAME_REX.test(name)) {
            js.ua.System.error("Invalid package name |%s|.", name);
            return;
        }

        names = name.split(".");
        for (i = 0; i < names.length; i++) {
            scope = window;
            for (j = 0; j <= i; j++) {
                if (typeof scope[names[j]] === "undefined") {
                    scope[names[j]] = {
                        __package__ : names.slice(0, j + 1).join(".")
                    };
                }
                scope = scope[names[j]];
            }
        }
    },

    /**
     * Ensure class is declared, that is, create empty if missing. Class name should be fully qualified and this method
     * takes care to create package, if not already created. Both static and instantiable declaration styles are
     * supported, depending on supplied <em>staticDeclaration</em> parameter.
     * 
     * @param String className fully qualified class name,
     * @param Boolean staticDeclaration optional declaration style, static of instantiable, default to static.
     */
    $declare : function (className, staticDeclaration) {
        var names, name, scope, packageName, i;

        if (!className || !js.lang.Operator._CLASS_NAME_REX.test(className)) {
            js.ua.System.error("Invalid class name |%s|.", className);
            return;
        }
        if (typeof staticDeclaration === "undefined") {
            staticDeclaration = true;
        }

        names = className.split(".");
        for (i = 0; i < names.length; i++) {
            if (names[i].charAt(0) === names[i].charAt(0).toUpperCase()) {
                break;
            }
            scope = window;
            for (j = 0; j <= i; j++) {
                if (typeof scope[names[j]] === "undefined") {
                    scope[names[j]] = {
                        __package__ : names.slice(0, j + 1).join(".")
                    };
                }
                scope = scope[names[j]];
            }
        }

        for (; i < names.length; i++) {
            name = names[i];
            if (typeof scope[name] === "undefined") {
                if (staticDeclaration) {
                    scope[name] = {};
                }
                else {
                    scope[name] = function () {
                    };
                }
            }
            scope = scope[name];
        }
    },

    /**
     * Include class. This directive is used by builder tool to declare strong dependencies.
     * 
     * @param String className qualified class name.
     */
    $include : function (className) {
        if (!className || !js.lang.Operator._CLASS_NAME_REX.test(className)) {
            js.ua.System.error("Invalid class name |%s|.", className);
        }
    },

    /**
     * Class extension. This operator adds inheritance flavor using JavaScript prototype support. It actually adds
     * superclass prototype properties to subclass prototype but subclass takes priority, that is, subclass overrides
     * properties with the same name.
     * 
     * <pre>
     *	Control = function() {};
     *	Control.prototype = {};
     *	. . .
     *	Select = function() {};
     *	Select.prototype = {};
     . . .
     *	$extends(Select, Control);
     * </pre>
     * 
     * In above snippet Select class extends Control, i.e. copy Control prototype properties to Select prototype. Note
     * that at the moment $extends is executed both sub and super classes must have prototypes defined. Any change in
     * superclass prototype after extension is not reflected in subclasses.
     * <p>
     * Extension logic enhance subclass with <code>$super</code> operator; can be used to invoke super constructor or
     * overridden methods, see snippet below. Is not mandatory to call <code>$super</code> as first statement in
     * function body. Also <code>$super</code> method searches for specified overridden method on entire hierarchy up
     * to built-in Object. Silently log the event as error if super method not found. Finally <code>$super</code>
     * operator behavior is not specified if try to invoke not overridden methods.
     * 
     * <pre>
     *	phoenix.hc.EventInfoView = function(ownerDoc, node) {
     *		this.$super(ownerDoc, node);
     *		. . .
     *		this.set = function(info) {
     *			this.$super("set", info);
     *		};
     *	};
     * </pre>
     * 
     * First <code>$super</code> invokes super class constructor with <code>onwerDoc</code> and <code>node</code>
     * arguments, whereas the second invokes <code>set</code> method with <code>info</code> argument.
     * <code>$extends</code> operator is intended for behavior inheritance exposed via prototype. All properties
     * declared into super constructor remain private to superclass, unless <code>$super</code> constructor is
     * explicitly invoked.
     * <p>
     * Note that there is a convenient way to invoke super with actual arguments, like:
     * 
     * <pre>
     *	phoenix.hc.EventInfoView = function(ownerDoc, node) {
     *		this.$super(arguments);
     *		. . .
     *		this.set = function(info) {
     *			this.$super("set", arguments);
     *		};
     *	};
     * </pre>
     * 
     * @param Function subClass constructor function to be extended,
     * @param Function superClass inherited class.
     * @note <strong>Best practice:</strong> always prefer composition instead inheritance.
     */
    $extends : function (subClass, superClass) {
        if (typeof subClass === "undefined") {
            js.ua.System.error("Trying to extend undefined subclass.");
            return;
        }
        if (typeof subClass !== "function") {
            js.ua.System.error("Trying to extend invalid subclass %s.", subClass);
            return;
        }
        if (typeof superClass === "undefined") {
            js.ua.System.error("Undefined superclass when trying to extend %s.", subClass);
            return;
        }
        if (typeof superClass !== "function") {
            js.ua.System.error("Invalid superclass %s when trying to extend %s.", superClass, subClass);
            return;
        }

        var subClassPrototype = subClass.prototype;
        function F () {
        }
        F.prototype = superClass.prototype;
        subClass.prototype = new F();
        for ( var p in subClassPrototype) {
            subClass.prototype[p] = subClassPrototype[p];
        }

        if (navigator.userAgent.indexOf("MSIE") !== -1) {
            // IE refuses to list toString and valueOf in above for-each loop
            // so we need to add then manually
            if (subClassPrototype.hasOwnProperty("toString")) {
                subClass.prototype.toString = subClassPrototype.toString;
            }
            if (subClassPrototype.hasOwnProperty("valueOf")) {
                subClass.prototype.valueOf = subClassPrototype.valueOf;
            }
        }

        // there are rumors that constructor property is not reliable; just to be on safe side take care to properly
        // initialize it, in the case of prototype overwrite, but internally uses j(s)-lib specific __ctor__ property
        // NOTE: it is important to use $extends even declared class has no superclass; uses Object
        // if $extends is not used constructor properties are not properly initialized
        subClass.prototype.constructor = subClass;
        subClass.prototype.__ctor__ = subClass;
        subClass.__super__ = superClass;

        // if superclass function has a function named $extends it is called at this moment giving superclass
        // opportunity to execute some logic whenever it is extended
        if (typeof superClass.$extends === "function") {
            superClass.$extends.call(superClass, subClass);
        }

        /**
         * Arguments internal helper. If given <em>args</em> has only one item of "actual arguments" type just returns
         * it; otherwise returns given args. This pre-processing allows for passing actual arguments when invoke super
         * constructor or method, like below:
         * 
         * <pre>
         * 	this.$super(arguments);
         * 	. . .
         * 	this.$super("method", arguments);
         * </pre>
         */
        function getArguments (args) {
            if (args.length === 1 && typeof args[0] !== "undefined" && typeof args[0] !== "string" && typeof args[0].length !== "undefined" && typeof args[0].push === "undefined") {
                // if caller supplied its own actual arguments, given args contains only one item
                // that is "array like", i.e. it has length property but no built-in method like push
                // in such case returns "caller actual arguments" as arguments list
                return args[0];
            }
            return args;
        }

        // enhance subclass with $super accessor
        subClass.prototype.$super = function () {
            var caller, methodName, args, ctor, method, value;

            caller = subClass.prototype.$super.caller;
            if (typeof caller.__super__ === "function") {
                // if __super__, the secret link to superclass, is present the caller is a constructor
                caller.__super__.apply(this, getArguments(arguments));
                return;
            }

            // if __super__ is missing the caller should be an instance method
            // and first argument should be the method name
            methodName = arguments[0];
            args = getArguments($args(arguments, 1));

            if (this.hasOwnProperty(methodName)) {
                // special case: allow subclass to declare method in constructor
                ctor = this.__ctor__;
            }
            else {
                // search caller up on prototypes chain
                for (ctor = this.__ctor__; ctor; ctor = ctor.__super__) {
                    if (ctor.prototype.hasOwnProperty(methodName) && ctor.prototype[methodName] === caller) {
                        break;
                    }
                }
            }

            // here ctor variable holds a reference to constructor of caller method, no
            // matter method is declared in constructor or in prototype
            if (!(ctor && ctor.__super__)) {
                js.ua.System.error("Super method |%s| does not override a subclass method.", methodName);
                return;
            }
            method = ctor.__super__.prototype[methodName];
            if (typeof method === "undefined") {
                js.ua.System.error("Super method |%s| not found.", methodName);
                return;
            }
            if (typeof method !== "function") {
                js.ua.System.error("Super method |%s| is not a function.", methodName);
                return;
            }
            method.__super_call__ = true;
            value = method.apply(this, args);
            method.__super_call__ = false;
            return value;
        };
    },

    /**
     * Class implementation. This pseudo-operator is used by tools. It helps on documentation generation and to check
     * implementation consistency.
     * 
     * @param Function subClass
     * @param Object superInterface
     */
    $implements : function (subClass, superInterface) {
        for ( var methodName in superInterface) {
            if (typeof subClass.prototype[methodName] === "undefined") {
                js.ua.System.error("Missing method |%s| implementation from class |%s|.", methodName, subClass);
            }
        }
    },

    /**
     * Add functionality to target class but no related semantic. This method simply inject members, both public and
     * private for <code>mixin</code> into class prototype but takes care to not override existing target members.
     * 
     * @param Function targetClass target class to add functionality to,
     * @param Object mixin object storing reusable logic.
     */
    $mixin : function (targetClass, mixin) {
        if (typeof targetClass !== "function") {
            js.ua.System.error("Mixin target is not a class.");
            return;
        }
        if (typeof mixin !== "object") {
            js.ua.System.error("Mixin source is not an object.");
            return;
        }
        var target = targetClass.prototype;
        for ( var p in mixin) {
            if (mixin.hasOwnProperty(p) && typeof target[p] === "undefined") {
                target[p] = mixin[p];
            }
        }
    },

    /**
     * Convert function actual arguments to {@link Array}. Return a sub-array from given start index to arguments end.
     * If no start index supplied all arguments are included. Returns undefined if supplied <em>args</em> is not a
     * valid function arguments object.
     * 
     * @param Object args caller function arguments,
     * @param Number startIdx optional starting index.
     * @return Array array of given arguments, possible empty or undefined.
     */
    $args : function (args, startIdx) {
        // function arguments is actually an array like object having callee property
        if (typeof args === "undefined" || args == null || typeof args.callee !== "function") {
            js.ua.System.error("Invalid function call arguments: undefined, null or callee function missing.");
            return;
        }
        if (typeof startIdx === "undefined") {
            startIdx = 0;
        }
        var a = [];
        for ( var i = startIdx; i < args.length; i++) {
            a.push(args[i]);
        }
        return a;
    },

    /**
     * Legacy code variant. This operator offers means for code portability whenever user agents depart from W3C specs.
     * It evaluates expression - relevant for non-standard functionality and if true execute legacy code. This legacy
     * code align user agent implementation to standard, mostly using an emulation. Function to be executed should
     * required no arguments and return nothing; log to error if given legacy code is not a function or its execution
     * rise exceptions.
     * 
     * <pre>
     * 	$legacy(js.ua.Engine.TRIDENT, function() {
     * 		js.dom.Node.firstElementChild = function(node) {
     * 			. . .
     * 		}
     * 	});
     * </pre>
     * 
     * This operator is primarily for library benefits; user space code need not to concern about low level
     * compatibility issues.
     * 
     * @param Boolean expression expression to evaluate,
     * @param Function legacyCode legacy code.
     */
    $legacy : function (expression, legacyCode) {
        if (!expression) {
            return;
        }
        try {
            legacyCode();
        } catch (er) {
            js.ua.System.error("Legacy code execution fail. %s", er);
        }
    },

    // Refrain to use the same characters for flags and conversion. Current implementation may confuse them.
    // _FORMAT_PATTERN : /%%|%(?:(\d+)\$)?([-#a-zA-Z]+)?(\d+)?(?:\.(\d+))?([a-zA-Z])/g,

    /**
     * Format pattern.
     * 
     * @type RegExp
     */
    _FORMAT_PATTERN : /%%|%(?:(\d+)\$)?([-])?(\d+)?(?:\.(\d+))?([sSdeEoxX])/g,

    /**
     * Simple string formatter. It is a rather quick approach for unsophisticated formatting and is not regional aware;
     * is not intended to replace specialized format classes. This operator produces formatted output requiring a format
     * string and an argument list. The format string is a String which may contain fixed text and one or more embedded
     * format specifiers.
     * 
     * <pre>
     * 	$format("%s is %d years old.", "John Doe", 48);
     * </pre>
     * 
     * The format specifiers have the following syntax:
     * 
     * <pre>
     * 	%[index$][flags][width][.precision]conversion
     * </pre>
     * 
     * <ul>
     * <li>index, optional, is a integer indicating the position of the argument in the argument list. The first
     * argument is referenced by <b>1$</b>, the second by <b>2$</b>, etc.
     * 
     * <li>flags, optional, is a set of characters that modify the output format. The set of valid flags depends on the
     * conversion.
     * 
     * <li>width, optional, is a non-negative integer indicating the minimum number of characters to be written to the
     * output.
     * 
     * <li>precision, optional, is a non-negative integer usually used to restrict the number of characters. The
     * specific behavior depends on the conversion.
     * 
     * <li>conversion is a character indicating how the argument should be formatted. The set of valid conversions for
     * a given argument depends on the argument"s data type.
     * </ul>
     * 
     * <p>
     * Current implementation recognizes next conversion characters: <table>
     * <tr>
     * <td width=40><b>s,S</b>
     * <td width=90>string
     * <td>If argument is not a String convert it via toString(). Truncate output string to width, if defined; add
     * spaces to complete to precision length. If flag is "-" spaces are inserted at beginning.
     * <tr>
     * <td><b>d</b>
     * <td>integer
     * <td>If argument is a Number returns its rounded value as a String. Otherwise try first to convert argument to
     * Number. If fail returns NaN.
     * <tr>
     * <td><b>e,E</b>
     * <td>real
     * <td>If argument is a Number returns its value as a String. Otherwise try first to convert argument to Number. If
     * fail returns NaN.
     * <tr>
     * <td><b>o</b>
     * <td>octal
     * <td>If argument is a Number returns its value as a String using radix 8. Otherwise try first to convert argument
     * to Number. If fail returns NaN.
     * <tr>
     * <td><b>x,X</b>
     * <td>hexadecimal
     * <td>If argument is a Number returns its value as a String using radix 16. Otherwise try first to convert
     * argument to Number. If fail returns NaN. </table>
     * <p>
     * Upper case variants uses the lower case handler followed by toUpperCase(). If conversion is the percent character
     * just returns its value. i.e. <b>%%</b> produces a single <b>%</b>.
     * 
     * <p>
     * Argument from arguments list is identified by indices. There are two kind: explicit using "$" syntax and ordinary
     * index. Each format specifier which uses ordinary indexing is assigned a sequential implicit value which is
     * independent of the indices used by explicit indexing.
     * 
     * <p>
     * Format first argument should be a String. If not, returns immediately given argument value, after applying
     * toString(). Finally, this operator can be call with a function actual arguments, as below:
     * 
     * <pre>
     * 	function fn(format, args) {
     * 		$format(arguments);
     * 	}
     * </pre>
     * 
     * This allows for creation of functions with format like signature.
     * 
     * @param String format string format,
     * @param Object... args variable numbers of values.
     * @return String formatted string.
     */
    $format : function (format) {
        if (typeof format === "undefined") {
            return "undefined";
        }
        if (format == null) {
            return "null";
        }

        if (typeof format.callee === "function") {
            // if format is a function actual arguments, concluded by callee, it may be
            // followed by start index, which determine format string position in arguments list
            var args = [];
            var startIdx = arguments.length > 1 ? arguments[1] : 0;
            var endIdx = arguments.length > 2 ? arguments[2] : arguments[0].length;
            for ( var i = startIdx; i < endIdx; i++) {
                args.push(arguments[0][i]);
            }
            return this.$format.apply(this, args);
        }

        if (typeof format !== "string" && !(format instanceof String)) {
            return format.toString();
        }

        function string (value, flag, width, precision) {
            if (typeof value === "undefined") {
                return "undefined";
            }
            if (value == null) {
                return "null";
            }
            if (typeof value !== "string" && !(value instanceof String)) {
                if (typeof value === "function") {
                    if (typeof value.prototype !== "undefined" && typeof value.prototype.toString === "function") {
                        value = value.prototype.toString();
                    }
                    else {
                        value = "unknown";
                    }
                }
                else if (value instanceof Array) {
                    value = "Array[" + value.length + "]";
                }
                else if (value instanceof Error && typeof value.message !== "undefined") {
                    value = value.message;
                }
                else if (typeof value.trace === "function") {
                    value = value.trace();
                }
                else {
                    value = typeof value.toString === "function" ? value.toString() : "unknown";
                }
            }
            if (typeof width !== "undefined") {
                var i = value.length;
                if (flag === "-") {
                    for (; i < width; ++i) {
                        value = " " + value;
                    }
                }
                else {
                    for (; i < width; ++i) {
                        value = value + " ";
                    }
                }
            }
            if (typeof precision !== "undefined") {
                value = value.substr(0, precision);
            }
            return value;
        }

        function STRING (value, flag, width, precision) {
            if (value == null) {
                return "null";
            }
            return string(value, flag, width, precision).toUpperCase();
        }

        function integer (value, flag, width, precision, radix, noround) {
            if (value == null) {
                return "0";
            }
            if (typeof value !== "number" && !(value instanceof Number)) {
                js.ua.System.print("Expected number but get " + typeof value + " when trying to format integer value.");
                value = Number(value);
            }
            if (!noround) {
                value = Math.round(value);
            }
            var s = value.toString(radix ? radix : 10);
            for ( var i = s.length; i < width; ++i) {
                s = "0" + s;
            }
            return s;
        }

        function real (value, flag, width, precision) {
            return integer(value, flag, width, precision, 10, true);
        }

        function octal (value, flag, width, precision) {
            return integer(value, flag, width, precision, 8);
        }

        function hexadecimal (value, flag, width, precision) {
            return integer(value, flag, width, precision, 16);
        }

        function HEXADECIMAL (value, flag, width, precision) {
            return hexadecimal(value, flag, width, precision).toUpperCase();
        }

        var handlers = {
            s : string,
            S : STRING,
            d : integer,
            e : real,
            E : real,
            o : octal,
            x : hexadecimal,
            X : HEXADECIMAL
        };

        var args = [];
        for ( var i = 1; i < arguments.length; i++) {
            args.push(arguments[i]);
        }

        var ordinaryIndex = 0;
        js.lang.Operator._FORMAT_PATTERN.lastIndex = 0;
        return format.replace(js.lang.Operator._FORMAT_PATTERN, function (match, index, flag, width, precision, conversion, offset, format) {
            if (match === "%%") {
                return "%";
            }

            // there are browsers returning empty string instead of undefined for optional capture
            // example would be FF and IE8
            if (index === "") {
                index = undefined;
            }
            if (flag === "") {
                flag = undefined;
            }
            if (width === "") {
                width = undefined;
            }
            if (precision === "") {
                precision = undefined;
            }

            index = typeof index !== "undefined" ? Number(index) - 1 : ordinaryIndex++;
            if (typeof width !== "undefined") {
                width = Number(width);
            }
            if (typeof precision !== "undefined") {
                precision = Number(precision);
            }
            var handler = handlers[conversion];
            if (typeof handler === "undefined") {
                js.ua.System.print("No handler for conversion of <" + conversion + ">. Use string handler.");
                handler = handlers.s;
            }
            var value = args[index];
            if (typeof value === "undefined") {
                value = null;
            }
            return handler(value, flag, width, precision);
        });
    },

    /**
     * Send TRACE messsage to logger. This pseudo-operator format given message and delegates
     * {@link js.lang.Operator#$log(String,String,String)}.
     * 
     * @param String sourceName message source name,
     * @param String message message to log,
     * @param Object... args optional arguments if message is formatted.
     */
    $trace : function (sourceName, message) {
        $log("TRACE", sourceName, arguments.length > 2 ? $format(arguments, 1) : message);
    },

    /**
     * Send DEBUG messsage to logger. This pseudo-operator format given message and delegates
     * {@link js.lang.Operator#$log(String,String,String)}.
     * 
     * @param String sourceName message source name,
     * @param String message message to log,
     * @param Object... args optional arguments if message is formatted.
     */
    $debug : function (sourceName, message) {
        $log("DEBUG", sourceName, arguments.length > 2 ? $format(arguments, 1) : message);
    },

    /**
     * Send INFO messsage to logger. This pseudo-operator format given message and delegates
     * {@link js.lang.Operator#$log(String,String,String)}.
     * 
     * @param String sourceName message source name,
     * @param String message message to log,
     * @param Object... args optional arguments if message is formatted.
     */
    $info : function (sourceName, message) {
        $log("INFO", sourceName, arguments.length > 2 ? $format(arguments, 1) : message);
    },

    /**
     * Send WARN messsage to logger. This pseudo-operator format given message and delegates
     * {@link js.lang.Operator#$log(String,String,String)}.
     * 
     * @param String sourceName message source name,
     * @param String message message to log,
     * @param Object... args optional arguments if message is formatted.
     */
    $warn : function (sourceName, message) {
        $log("WARN", sourceName, arguments.length > 2 ? $format(arguments, 1) : message);
    },

    /**
     * Send ERROR messsage to logger. This pseudo-operator format given message and delegates
     * {@link js.lang.Operator#$log(String,String,String)}.
     * 
     * @param String sourceName message source name,
     * @param String message message to log,
     * @param Object... args optional arguments if message is formatted.
     */
    $error : function (sourceName, message) {
        $log("ERROR", sourceName, arguments.length > 2 ? $format(arguments, 1) : message);
    },

    /**
     * Send FATAL messsage to logger. This pseudo-operator format given message and delegates
     * {@link js.lang.Operator#$log(String,String,String)}.
     * 
     * @param String sourceName message source name,
     * @param String message message to log,
     * @param Object... args optional arguments if message is formatted.
     */
    $fatal : function (sourceName, message) {
        $log("FATAL", sourceName, arguments.length > 2 ? $format(arguments, 1) : message);
    },

    /**
     * Javascript engine instance start-up time.
     * 
     * @type Date
     */
    _timestamp : new Date().getTime(),

    /**
     * Low level logger. Consolidate log message from given arguments and current time and print it to system console.
     * If console does not exists this function does nothing. If message instance of {@link Error} try to extract error
     * message. Note that message could miss if, for example, log a TRACE message where we are interested in message
     * source only.
     * <p>
     * Source name argument identify the context generating logging event and usualy is the method qualified name, but
     * not limited to. Cross cutting sources, spread over many methods are also supported and encouraged.
     * 
     * @param String level message priority level,
     * @param String sourceName message source name,
     * @param String... message optional message to print on logger.
     */
    $log : function (level, sourceName, message) {
        if (typeof console === "undefined") {
            return;
        }
        var t = new Date().getTime() - js.lang.Operator._timestamp;
        var text = t + " " + level + " " + sourceName;
        if (message instanceof Error) {
            message = typeof message.message !== "undefined" ? message.message : message.toString();
        }
        if (typeof message !== "undefined") {
            text += (' ' + message);
        }
        console.log(text);
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.lang.Operator";
    }
};

(function () {
    var i;

    var snippet = "js.lang.Operator.$level.disable = function() {" + //
    "	$level = js.lang.Operator.$level.NOP;" + //
    "};" + //
    "js.lang.Operator.$level.NOP = function() {" + //
    "};" + //
    "(js.lang.Operator.$level.NOP.enable = js.lang.Operator.$level.enable = function() {" + //
    "	$level = js.lang.Operator.$level;" + //
    "})();";

    var levels = [ "assert", "trace", "debug", "info", "warn", "error", "fatal" ];
    for (i = 0; i < levels.length; ++i) {
        eval(snippet.replace(/level/g, levels[i]));
    }

    /**
     * Static blocks. Used by {@link js.lang.Operator#$static} pseudo-operator to keep track to self registered static
     * initializers code.
     */
    js.lang.Operator.$static._initializers = [];

    js.lang.Operator.$static.execute = function () {
        var staticBlocks = js.lang.Operator.$static._initializers;
        for (i = 0; i < staticBlocks.length; ++i) {
            try {
                staticBlocks[i]();
            } catch (er) {
                js.ua.System.error("Static block initialization fails. %s", er);
            }
        }
    };

    /**
     * Selectors for element instances to preload.
     */
    js.lang.Operator.$preload._selectors = [];

    // invoked from js.ua.Window#_fireDomReady, just before return, after dom-ready event was fired
    js.lang.Operator.$preload.execute = function () {
        var selectors = js.lang.Operator.$preload._selectors, it;
        for (i = 0; i < selectors.length; i++) {
            it = WinMain.doc.findByCss(selectors[i]).it();
            while (it.hasNext()) {
                it.next();
            }
        }
    };
})();

$static = js.lang.Operator.$static;
$preload = js.lang.Operator.$preload;
$package = js.lang.Operator.$package;
$declare = js.lang.Operator.$declare;
$include = js.lang.Operator.$include;
$extends = js.lang.Operator.$extends;
$implements = js.lang.Operator.$implements;
$mixin = js.lang.Operator.$mixin;
$args = js.lang.Operator.$args;
$format = js.lang.Operator.$format;
$legacy = js.lang.Operator.$legacy;
$log = js.lang.Operator.$log;
$package("js.event");

/**
 * Custom events manager. Working with custom events follows next three steps:
 * <ol>
 * <li>register custom event types using {@link #register}</li>
 * <li>events publisher clients adds / removes event listeners at will</li>
 * <li>publisher fires events with specific contextual information when internal state changes</li>
 * </ol>
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * @constructor Construct custom events instance.
 * 
 * @param Object parent, optional parent publisher.
 * @assert if <em>parent</em> argument is present it should be an event publisher.
 */
js.event.CustomEvents = function (parent) {
    if (typeof parent !== "undefined") {
        parent._customEvents = this;
    }

    /**
     * Events storage. Map event type to registered handlers.
     * 
     * @type Object
     */
    this._events = {};
};

js.event.CustomEvents.prototype = {
    /**
     * Register user defined events. Register one or many event types to this custom events instance. Ignore the event
     * type(s) that are already registered.
     * 
     * @param String... type one or more event types to register.
     * @assert at least one event type argument is supplied and none is already registered.
     */
    register : function () {
        $assert(arguments, "js.event.CustomEvents#register", "Missing arguments.");
        for ( var i = 0, type; i < arguments.length; ++i) {
            type = arguments[i];
            $assert(!(type in this._events), "js.event.CustomEvents#register", "Event type already registered.");
            if (!(type in this._events)) {
                this._events[type] = [];
            }
        }
    },

    /**
     * Unregister user defined events. Remove supplied types from registered events list. Ignore type argument(s) that
     * are not already registered.
     * 
     * @param String... type one or more event types to unregister.
     * @assert at least one event type argument is supplied and all are already registered.
     */
    unregister : function () {
        $assert(arguments, "js.event.CustomEvents#unregister", "Missing arguments.");
        for ( var i = 0, type; i < arguments.length; ++i) {
            type = arguments[i];
            if (!(type in this._events)) {
                $assert(false, "js.event.CustomEvents#unregister", "Event type is not registered.");
                continue;
            }
            delete this._events[type];
        }
    },

    /**
     * Add event listener. Register event listener to this events publisher. Listener function should have next
     * signature:
     * 
     * <pre>
     * 	void listener(Object... args)
     * </pre>
     * 
     * Listener will be invoked whenever requested event type will be fired, with arguments provided by
     * {@link #_fireEvent}.
     * 
     * @param String type even type,
     * @param Function listener event listener to register,
     * @param Object scope listener run-time scope.
     * @assert requested event type is registered, listener is a {@link Function} and scope is an {@link Object}.
     */
    addListener : function (type, listener, scope) {
        $assert(type in this._events, "js.event.CustomEvents#addListener", "Invalid event type.");
        $assert(listener, "js.event.CustomEvents#addListener", "Listener is undefined or null.");
        $assert(js.lang.Types.isFunction(listener), "js.event.CustomEvents#addListener", "Listener is not a function.");
        $assert(js.lang.Types.isObject(scope), "js.event.CustomEvents#addListener", "Scope is not an object.");

        var handlers = this._events[type];
        if (handlers) {
            handlers.push({
                type : type,
                listener : listener,
                scope : scope
            });
        }
    },

    /**
     * Remove event listener. Remove registered event listener from this event target. Calling this method with
     * arguments that does not identify any currently registered event listener has no effect.
     * 
     * @param String type event type,
     * @param Function listener listener to be removed.
     * @return js.event.CustomEvents this pointer.
     * @assert given event type is registered and listener is a {@link Function}.
     */
    removeListener : function (type, listener) {
        $assert(type in this._events, "js.event.CustomEvents#removeListener", "Type %s is not defined.", type);
        $assert(js.lang.Types.isFunction(listener), "js.event.CustomEvents#removeListener", "Listener is not a function.");
        var handlers = this._events[type];
        if (handlers) {
            js.util.Arrays.removeAll(handlers, function (handler) {
                $assert(!handler.running, "js.event.CustomEvents#removeListener", "Attempt to remove running listener for %s event.", handler.type);
                return !handler.running && handler.listener === listener;
            });
        }
        return this;
    },

    /**
     * Remove all listeners from user defined event.
     * 
     * @param String type event type.
     * @return js.event.CustomEvents this pointer.
     * @assert given type is registered and has listeners that are not running.
     */
    removeAllListeners : function (type) {
        $assert(type in this._events, "js.event.CustomEvents#removeAllListeners", "Type %s is not defined.", type);
        $assert(this.hasListener(type), "js.event.CustomEvents#removeAllListeners", "Type %s has no listeners.", type);
        var handlers = this._events[type];
        if (handlers) {
            js.util.Arrays.removeAll(handlers, function (handler) {
                $assert(!handler.running, "js.event.CustomEvents#removeAllListener", "Attempt to remove running listener for %s event.", handler.type);
                return !handler.running;
            });
        }
        return this;
    },

    /**
     * Return true if requested type is registered.
     * 
     * @param String type type name.
     * @return Boolean true if named type is registered.
     */
    hasType : function (type) {
        return type in this._events;
    },

    /**
     * Test if event has listeners. Returns true if there is at least one listener for given event type.
     * 
     * @param String type, event type.
     * @return Boolean true if there is at least one listener registered for given event type.
     * @assert given event type is registered.
     */
    hasListener : function (type) {
        $assert(type in this._events, "js.dom.CustomEvents#hasListener", "Invalid event type.");
        var handlers = this._events[type];
        return handlers !== null ? handlers.length !== 0 : false;
    },

    /**
     * Fire user defined event. Invoke all listeners for given event type; if event type is not registered via
     * {@link #register} this method does nothing and returns false. Pass given optional arguments to every invoked
     * listener.
     * 
     * @param String type, event type,
     * @param Object... args, event arguments.
     * @return Array array filled with listeners invocation results. If listener does not return an explicit value
     *         corresponding array item is undefined.
     */
    fire : function (type) {
        $assert(type, "js.dom.CustomEvents#fire", "Invalid event type.");
        var handlers = this._events[type];
        $assert(handlers !== null, "js.dom.CustomEvents#fire", "Trying to fire not registered event: %s.", type);
        if (handlers == null) {
            return;
        }

        var results = [];
        var it = new js.lang.Uniterator(handlers), h;
        while (it.hasNext()) {
            h = it.next();
            try {
                h.running = true;
                results.push(h.listener.apply(h.scope, $args(arguments, 1)));
                h.running = false;
            } catch (er) {
                js.ua.System.error(er);
            }
        }
        return results;
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.event.CustomEvents";
    },

    /**
     * Cleanup custom events. Remove all registered custom events listeners.
     */
    finalize : function () {
        $trace("js.event.CustomEvents#finalize");
        for ( var key in this._events) {
            if (js.lang.Types.isFunction(this._events[key].finalize)) {
                this._events[key].finalize();
            }
        }
        delete this._events;
    }
};
$extends(js.event.CustomEvents, Object);
$package("js.ua");

/**
 * Layout engine. Note that while j(s)-lib recognizes browsers implementations differences as a natural process it
 * doesn't support backward compatibility, that is, always bases on the latest versions. Web related specs are highly
 * dynamic, almost fluid and it is strongly recommended to keep browser updated for new features and security patches.
 */
js.ua.Engine = {
    /**
     * Firefox browser layout engine.
     * 
     * @type Boolean
     */
    GECKO : false,

    /**
     * Opera browser layout engine.
     * 
     * @type Boolean
     */
    PRESTO : false,

    /**
     * Internet explorer browser layout engine.
     * 
     * @type Boolean
     */
    TRIDENT : false,

    /**
     * Safari and Chrome browsers layout engine.
     * 
     * @type Boolean
     */
    WEBKIT : false,

    /**
     * Mobile devices WebKit layout engine.
     * 
     * @type Boolean
     */
    MOBILE_WEBKIT : false,

    /**
     * Browser specific CSS class used to select browser specific styles. It is added on document body allowing for
     * rules like:
     * 
     * <pre>
     *  body.trident selector {
     *      // internet explorer specific styles 
     *  }
     * </pre>
     * 
     * Recognized styles are listed below: <table>
     * <tr>
     * <td>Internet Explorer
     * <td> :
     * <td><b>trident
     * <tr>
     * <td>Chrome and Safari
     * <td> :
     * <td><b>webkit
     * <tr>
     * <td>Android Chrome
     * <td> :
     * <td><b>mobile-webkit
     * <tr>
     * <td>Mozilla Firefox
     * <td> :
     * <td><b>gecko
     * <tr>
     * <td>Opera
     * <td> :
     * <td><b>presto </table>
     * 
     * @type String
     */
    cssClass : null
};

/**
 * Engine enumeration static initializer. Detect user agent and initialize {@link js.ua.Engine} enumeration. Executes it
 * synchronously since library relies on engine enumeration to select legacy code branches. Please remember that a
 * synchronous static initializer is executed at script load not after DOM ready.
 */
$static(function () {
    // user agent samples:
    // Internet Explorer: Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; EmbeddedWB 14.52 from:
    // http://www.bsalsa.com/ EmbeddedWB 14.52; .NET CLR 1.1.4322; .NET CLR 2.0.50727)
    // Chrome: Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/525.19 (KHTML, like Gecko) Chrome/0.3.154.9
    // Safari/525.19
    // Safari: Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/525.19 (KHTML, like Gecko) Version/3.1.2
    // Safari/525.21
    // Firefox: Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.17) Gecko/20080829 Firefox/2.0.0.17
    // Opera: Opera/9.62 (Windows NT 5.1; U; en) Presto/2.1.1

    // layout engines tests order matters; do not alter it! especially WebKit MUST precede Gecko
    if (navigator.userAgent.indexOf("MSIE") !== -1) { // IE
        js.ua.Engine.TRIDENT = true;
        js.ua.Engine.cssClass = "trident";
    }
    else if (navigator.userAgent.indexOf("WebKit") !== -1) {
        if (navigator.userAgent.indexOf("Mobile") !== -1 || navigator.userAgent.indexOf("Android") !== -1) {
            js.ua.Engine.MOBILE_WEBKIT = true; // mobile devices
            js.ua.Engine.cssClass = "mobile-webkit";
        }
        else {
            js.ua.Engine.WEBKIT = true; // Safari, Chrome
            js.ua.Engine.cssClass = "webkit";
        }
    }
    else if (navigator.userAgent.indexOf("Gecko") !== -1) { // Firefox
        js.ua.Engine.GECKO = true;
        js.ua.Engine.cssClass = "gecko";
    }
    else if (navigator.userAgent.indexOf("Presto") !== -1) { // Opera
        js.ua.Engine.PRESTO = true;
        js.ua.Engine.cssClass = "presto";
    }
}, true);
$package("js.lang");

/**
 * Dynamic typing support, aka duck typing. This utility class helps identifying variables types on run-time. It is a
 * collection of predicates testing for JavaScript basic types like array or string. It also offers support for
 * validating an object against an interface.
 */
js.lang.Types = {
    /**
     * Test if array type. Given value argument is qualify as an array if it is an object and instance of {@link Array}
     * class. Also, function <em>arguments</em> is considered array.
     * 
     * @param Object value, value to test.
     * @return Boolean true if <em>value</em> argument is an array.
     */
    isArray : function (value) {
        return (typeof value === "object" && value instanceof Array) ||
        // function arguments is actually an array like object, it does not
        // implement any Array methods like splice, but having instead callee
        // anyway, we want to treat it as an array not an object
        (typeof value !== "undefined" && value !== null && typeof value.callee === "function");
    },

    /**
     * Test if object. Pass the test if given argument is an object, an array or a function. Note that instances of
     * {@link Array}, {@link Function}, {@link Boolean}, {@link Number} and {@link String} classes qualify both as
     * objects and their respective types. Actually in JavaScript almost all values are objects, except boolean, number
     * and string primitives. Note that null is not considered an object.
     * 
     * @param Object value, value to test.
     * @return Boolean true if <em>value</em> argument is an object.
     */
    isObject : function (value) {
        return value !== null && (typeof value === "object" || typeof value === "function");
    },

    /**
     * Test if function.
     * 
     * @param Object value, value to test.
     * @return Boolean true if <em>value</em> argument is a function.
     */
    isFunction : function (value) {
        return typeof value === "function";
    },

    /**
     * Test if string. Returns true if given argument is a primitive string or an object instance of {@link String}
     * class. Note that this method deviates from language specification; instances of String class are considered both
     * strings and objects.
     * 
     * @param Object value, value to test.
     * @return Boolean true if <em>value</em> argument is a string.
     */
    isString : function (value) {
        return typeof value === "string" || value instanceof String;
    },

    /**
     * Test if number. Test pass if value to be tested is a primitive number or an object of {@link Number} class. Also
     * <em>NaN</em> and <em>Infinity</em> are considered numbers. Note that this method deviates from language
     * specification; instances of Number class are considered both numbers and objects.
     * 
     * @param Object value, value to test.
     * @return Boolean true only if argument is a number.
     */
    isNumber : function (value) {
        return typeof value === "number" || value instanceof Number;
    },

    /**
     * Test if boolean. This test is successfully if given value is a primitive boolean or an object of {@link Boolean}
     * class. Note that this utility class deviates from language specification; instances of Boolean class are
     * considered both boolean and objects. For the purpose of this predicate undefined and null values are not
     * considered boolean false.
     * 
     * @param Object value value to test.
     * @return Boolean true if <em>value</em> argument is a boolean.
     */
    isBoolean : function (value) {
        return typeof value === "boolean" || value instanceof Boolean;
    },

    /**
     * Test if primitive. A primitive value is either a string, number or boolean. Note that this method consider
     * {@link String}, {@link Number}, {@link Boolean} and {@link Date} instances as primitive and that undefined and
     * null does not qualify.
     * 
     * @param Object value, value to test.
     * @return Boolean true if <em>value</em> argument is a primitive value.
     */
    isPrimitive : function (value) {
        return this.isString(value) || this.isNumber(value) || this.isBoolean(value) || this.isDate(value);
    },

    /**
     * Test if {@link Date} instance. If value is anything else than a date instance, including null or undefined,
     * returns false.
     * 
     * @param Object value value to test.
     * @return Boolean true if <em>value</em> argument is a Date instance.
     */
    isDate : function (value) {
        return value instanceof Date;
    },

    /**
     * Test if is or inherits from {@link js.dom.Element}.
     * 
     * @param Object value to check.
     * @return Boolean true if requested <em>value</em> is or inherits js.dom.Element.
     */
    isElement : function (value) {
        if (!value) {
            return false;
        }
        if (typeof value !== "function") {
            value = value.__ctor__;
            if (typeof value === "undefined") {
                return false;
            }
        }
        if (value === js.dom.Element) {
            return true;
        }
        if (this.isElement(value.__super__)) {
            return true;
        }
        return false;
    },

    /**
     * Test if {@link NodeList} instance. A value qualifies as native DOM node list if possess a numeric property
     * <em>length</em> and a method <em>item</em>.
     * 
     * @param Object value, value to test.
     * @return Boolean true if <em>value</em> argument is a NodeList instance.
     */
    isNodeList : function (value) {
        // last condition is for <select> node which has both length and item method
        return value && typeof value.length === "number" && typeof value.item === "function" && typeof value.nodeName === "undefined";
    },

    /**
     * Test if value is strict object. A value qualifies as strict object if is not Array, Function, Boolean, Number or
     * String and of course not a primitive.
     * 
     * @param Object value, value to test.
     * @return Boolean true if <em>value</em> argument can be used as map.
     */
    isStrictObject : function (value) {
        if (this.isArray(value)) {
            return false;
        }
        if (this.isFunction(value)) {
            return false;
        }
        if (this.isBoolean(value)) {
            return false;
        }
        if (this.isNumber(value)) {
            return false;
        }
        if (this.isString(value)) {
            return false;
        }
        return this.isObject(value);
    },

    _TYPE_NAME_PATTERN : /\[object\s+(\w+)\]/,

    getTypeName : function (value) {
        if (value == null) {
            return "Null";
        }
        if (typeof value === "undefined") {
            return "Undefined";
        }
        var typeName = Object.prototype.toString.call(value);
        var type = this._TYPE_NAME_PATTERN.exec(typeName);
        if (type !== null) {
            return type[1];
        }
        $debug("js.lang.Types#getTypeName", "Invalid type name |%s|. Return 'Unknown'.", typeName);
        return "Unknown";
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.lang.Types";
    }
};

/**
 * It seems IE NodeList item property is an object instead of a function. Also, this predicate should return true for
 * array augmented with item method. Finally, when nodelist is returned by query selector - that is not a living
 * nodelist, item is a string and, for mess to be completed, Node objects possess length and item properties - use
 * nodeName to exclude them.
 */
$legacy(js.ua.Engine.TRIDENT, function () {
    js.lang.Types.isNodeList = function (value) {
        return value && typeof value.length === "number" && typeof value.item !== "undefined" && typeof value.nodeName === "undefined";
    };
});
$package("js.net");

$include("js.lang.Types");

/**
 * Uniform Resource Locator. URL is a pointer to a <em>resource</em> on the World Wide Web. A resource can be
 * something as simple as a file or a directory, or it can be a reference to a more complicated object, such as a query
 * to a database or to a search engine. Recognized URL format is:
 * 
 * <pre>
 *	URL:= protocol "://" [host] [":" port] "/" path ["?" query] ["#" ref]
 *
 *	protocol:= "file" | "http" | "https" | "ftp"
 *	host:= host fully qualified domain name
 *	port:= optional port number - default to 80
 *	path:= resource name within host context
 *	query:= optional query parameters, name=value pairs separated by ampersand
 *	ref:= optional reference or fragment indicating resource part
 * </pre>
 * 
 * If a component is missing its value is null. Exception is port which defaults to 80. Following built-in objects
 * pattern there are two use cases: using with new operator create a new instance with all fields properly initialized
 * while when using as a function returns string value, useful for quick URL formatting, see snippet below:
 * 
 * <pre>
 * 	var url = new js.net.URL("http://www.youtube.com/video/watch/files.avi", {			
 * 		v : "p6K_VT6tcvs",			
 * 		feature : "relmfu"		
 * 	});
 * 	// here url is a js.net.URL instance with all fields properly initialized
 * </pre>
 * 
 * <pre>
 * 	var url = js.net.URL("http://www.youtube.com/video/watch/files.avi", {			
 * 		v : "p6K_VT6tcvs",			
 * 		feature : "relmfu"		
 * 	});
 * 	// here url is the string "http://www.youtube.com/video/watch/files.avi?v=p6K_VT6tcvs&feature=relmfu"
 * </pre>
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * 
 * @constructor Construct URL instance. If only one argument is present it should be a fully formatted URL, as a string
 *              with format as described by this class. If this constructor is invoked with two arguments first is URL,
 *              but without query parameters. Second argument, if present should be an object used as name=value hash;
 *              it will be appended to URL value as query part.
 * 
 * @param String url URL represented as a string,
 * @param Object parameters optional query parameters.
 */
js.net.URL = function () {
    $assert(js.lang.Types.isString(arguments[0]), "js.net.URL#URL", "URL is not a string.");

    if (!(this instanceof js.net.URL)) {
        var url = js.net.URL.normalize(arguments[0]);
        if (arguments.length > 1) {
            url += js.net.URL.formatQuery(arguments[1]);
        }
        $assert((function () {
            var rex = js.net.URL.prototype._FULL_URL_REX;
            rex.lastIndex = 0;
            var m = rex.exec(url);
            return m !== null && m.length === 7;
        })(), "js.net.URL#URL", "Malformed URL value: [%s]", url);
        return url;
    }

    if (arguments.length === 1) {
        this._FULL_URL_REX.lastIndex = 0;
        var m = this._FULL_URL_REX.exec(arguments[0]);
        $assert(m !== null && m.length === 7, "js.net.URL#URL", "Malformed URL value |%s|", arguments[0]);
        this._init(m);

        /**
         * Parsed query parameters or empty object. Object used as a hash of name=value pairs.
         * 
         * @type Object
         */
        this.parameters = this.query ? js.net.URL.parseQuery(this.query) : {};

        /**
         * URL string value.
         * 
         * @type String
         */
        this.value = arguments[0];
        return;
    }

    if (arguments.length === 2) {
        $assert(js.lang.Types.isObject(arguments[1]), "js.net.URL#URL", "Parameters is not an object.");

        this.parameters = arguments[1];
        var query = js.net.URL.formatQuery(this.parameters);
        this.value = arguments[0] + query;

        this._SHORT_URL_REX.lastIndex = 0;
        var m = this._SHORT_URL_REX.exec(arguments[0]);
        $assert(m !== null && m.length === 5, "js.net.URL#URL", "Malformed URL value |%s|", arguments[0]);
        m[5] = query.substr(1);
        this._init(m);
    }
};

/**
 * Get URL host. Try to extract host name from given URL. Returns empty string if protocol is file and null if URL is
 * not properly formatted, e.g. protocol part is missing.
 * 
 * @param String url string representing the URL.
 * @return String host name, possible empty or null. $assert <em>url</em> argument is not undefined, null or empty.
 */
js.net.URL.getHost = function (url) {
    $assert(url, "js.net.URL#getHost", "URL is undefined, null or empty.");
    if (url) {
        var startIndex = url.indexOf("://");
        if (startIndex !== -1) {
            if (url.substring(0, startIndex).toLowerCase() === "file") {
                // if protocol is file host name is empty string
                return "";
            }
            startIndex += 3;
            var endIndex = url.indexOf("/", startIndex);
            if (endIndex === -1) {
                endIndex = url.length;
            }
            return url.substring(startIndex, endIndex);
        }
    }
    return null;
};

/**
 * Parse query string. Extract name=value pairs from query string and initialize an object used as a hash.
 * 
 * @param String query, query string.
 * @return Object parsed query parameters.
 */
js.net.URL.parseQuery = function (query) {
    $assert(query, "js.net.URL#parseQuery", "Query is undefined, null or empty.");
    if (query) {
        var parameters = {};
        var a = query.split("&");
        for ( var i = 0, kv; i < a.length; i++) {
            kv = a[i].split("=");
            parameters[kv[0]] = kv[1];
        }
        return parameters;
    }
    return null;
};

/**
 * Format query string. This method takes a hash of name=value pairs and format it as query string, usable on URL query
 * part. Starting question mark is included. Every value from given parameters hash is converted to string using
 * JavaScript built-in conversion less boolean which is translated to 1 for true and 0 for false; please remember that
 * an array is converted into a comma separated string.
 * 
 * @param Object parameters, query parameters.
 * @return String formatted query string.
 */
js.net.URL.formatQuery = function (parameters) {
    $assert(parameters, "js.net.URL#formatQuery", "Parameters hash is undefined or null.");
    var a = [], v;
    if (parameters) {
        for ( var p in parameters) {
            v = parameters[p];
            if (v === true) {
                v = 1;
            }
            else if (v === false) {
                v = 0;
            }
            a.push(p + "=" + v);
        }
    }
    return a.length ? ("?" + a.join("&")) : "";
};

/**
 * Normalize URL. Return absolute URL, completing with parts from this page location if necessary. Uses next approach:
 * if given URL starts with schema just return it, since it is already absolute. Otherwise given URL should be a path.
 * If path is absolute, that is, starts with path separator, format a new URL using page location protocol, host, port
 * and the path. If given path is relative, uses location, remove file part - the part after last path separator and
 * append given relative path.
 * 
 * @param String url URL value to normalize.
 * @return String normalized URL.
 */
js.net.URL.normalize = function (url) {
    var rex = js.net.URL.prototype._SCHEMA_REX;
    rex.lastIndex = 0;
    if (rex.test(url)) {
        return url;
    }

    var ref = WinMain.url; // referrer

    if (url.charAt(0) === "/") {
        return $format("%s://%s:%d/%s", ref.protocol, ref.host, ref.port, url);
    }
    return ref.value.substring(0, ref.value.lastIndexOf("/") + 1) + url;
};

js.net.URL.prototype = {
    /**
     * Full URL pattern. Recognized format is described by this {@link js.net.URL class}.
     * 
     * @type RegExp
     */
    _FULL_URL_REX : /^(http|https|ftp|file):\/\/([^:\/]+)?(?::([0-9]{1,5}))?(?:(?:\/?)|(?:\/([^\/?#][^?#]*)))?(?:\?([^?#]*))?(?:#(.+)?)?$/gi,

    /**
     * Short URL pattern. Recognized format is protocol://host:port/path. This pattern is not usable if query or
     * reference are present. Uses {@link #_FULL_URL_REX} instead.
     * 
     * @type RegExp
     */
    _SHORT_URL_REX : /^(http|https|ftp|file):\/\/([^:\/]+)(?::([0-9]{1,5}))?(?:(?:\/?)|(?:\/([^\/?#][^?#]*)))?$/gi,

    /**
     * URL schema pattern.
     * 
     * @type RegExp
     */
    _SCHEMA_REX : /^[^:]+:\/\/.+$/gi,

    /**
     * Initialize this URL components.
     * 
     * @param Array matches, values resulted from pattern matching.
     */
    _init : function (matches) {
        /**
         * Protocol or null. This implementation recognize only file, http, https, ftp and file.
         * 
         * @type String
         */
        this.protocol = matches[1] ? matches[1] : null;

        /**
         * Host fully qualified domain name or null.
         * 
         * @type String
         */
        this.host = matches[2] ? matches[2] : null;

        /**
         * Port number, default to 80.
         * 
         * @type Number
         */
        this.port = Number(matches[3]) || 80;

        /**
         * Resource name within host context or null. Given next URL
         * 
         * <pre>
         * 	http://host:port/path/to/resource/file.ext?query#ref
         * </pre>
         * 
         * path string is <em>path/to/resource/file.ext</em>, no trailing slash.
         * 
         * @type String
         */
        this.path = matches[4] ? matches[4] : null;

        /**
         * Raw query string or null. Given next URL
         * 
         * <pre>
         * 	http://host:port/resource?name1=value1&name2=value2#ref
         * </pre>
         * 
         * query string is <em>name1=value1&name2=value2</em>, trailing question mark not included.
         * 
         * @type String
         */
        this.query = matches[5] ? matches[5] : null;

        /**
         * Reference - fragment part or null. This is the last URL part, after sharp separator - not included.
         * 
         * @type String
         */
        this.ref = matches[6] ? matches[6] : null;
    },

    /**
     * Compare this URL instance with given url argument for cross domain condition. Two URLs are cross domain if have
     * different protocol, host or port. Return true if given url argument is undefined or null. Note that this
     * predicate consider complete host name, not only base domain, e.g. <em>api.bbnet.ro</em> is cross domain with
     * <em>apps.bbnet.ro</em>.
     * 
     * @param String url url to test.
     * @return Boolean true is this URL instance and <code>url</code> argument are not on same domain.
     */
    isCrossDomain : function (url) {
        if (!url) {
            return true;
        }
        url = new js.net.URL(js.net.URL.normalize(url));
        if (this.protocol !== url.protocol) {
            return true;
        }
        if (this.host !== url.host) {
            return true;
        }
        if (this.port !== url.port) {
            return true;
        }
        return false;
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.net.URL";
    }
};
$extends(js.net.URL, Object);
$package("js.ua");

$include("js.net.URL");
$include("js.event.CustomEvents");

/**
 * User agent window. This class is a thin wrapper for {@link window.Window native window} object. There are two major
 * types: main window - global <b>WinMain</b>, created by bootstrap script and child windows. Every window has a parent
 * that create it via open method; since WinMain is on top of food chain its parent is null.
 * <p>
 * This class generates events related to window life-cycle like <em>dom-ready</em> and orientation change for mobile
 * user agents... see below. Window life-cycle related events have the window instance as only argument whereas
 * orientation change send a {@link js.ua.Orientation orientation} constant.<table>
 * <tr>
 * <td width=140><b>dom-ready</b>
 * <td>Script is completely loaded and parsed into user agent DOM. All classes are guaranteed to be fully initialized
 * when this event is triggered.
 * <tr>
 * <td><b>load</b>
 * <td>Entire page is loaded completely, including all images.
 * <tr>
 * <td><b>pre-unload</b>
 * <td>Fired before unload event. Listeners to this event may return boolean false to prevent unload process. If this
 * is the case a system dialog is opened asking for user confirmation; user can choose to continue unload or to stop it,
 * in which case <b>unload</b> event will not fire at all.
 * <tr>
 * <td><b>unload</b>
 * <td>This event is generated when page is unloaded due to moving to another URL, browser back, refresh or closing.
 * May be used for example to synchronously flush all application data back to server.
 * <tr>
 * <td><b>orientation-change</b>
 * <td>Generated when user agent device orientation is changed - available only for mobile devices equipped with
 * accelerometer. </table> Note that due to security constraints above events are not generated for child window created
 * with {@link #open}, unless if the same domain.
 * <p>
 * This utility class provides also methods for window reload and loading from new URL is provided.
 * <p>
 * <b>Developers note:</b> public life cycle is a subset, that is, there are couple internal steps. For a full
 * description of window initialization process see {@link #_fireDomReady} description.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * 
 * @constructor Construct window instance. Because, main window is instantiated in global scope, in order to avoid hard
 *              dependencies this constructor just declare instance fields. Actual initialization is performed on DOM
 *              ready, see {@link #_fireDomReady}.
 * 
 * Class initialization. Create window life-cycle events and attach listeners to DOM content loaded, page loaded, before
 * unload and unload events. Takes care to fire life-cycle events in the proper order.
 * @param Window nativeWindow native window,
 * @param Object... properties optional properties used for child configuration.
 * @assert native window is not undefined or null.
 */
js.ua.Window = function (nativeWindow, properties) {
    $assert(this instanceof js.ua.Window, "js.ua.Window#Window", "Invoked as function.");
    $assert(typeof nativeWindow !== "undefined" && nativeWindow !== null, "js.ua.Window#Window", "Native window is undefined or null.");

    if (typeof properties === "undefined") {
        properties = {};
    }

    /**
     * Window ID. Used internally for logging purposes.
     * 
     * @type String
     */
    this._id = "js-window#" + js.ua.Window._index++;

    /**
     * Native window.
     * 
     * @type Window
     */
    this._window = nativeWindow;

    /**
     * Parent window or null for WinMain.
     * 
     * @type js.ua.Window
     */
    this._parent = properties.parent || null;
    $assert(this._parent == null || this._parent instanceof js.ua.Window, "js.ua.Window#Window", "Parent is not of proper type.");

    /**
     * Window URL. This is the web reference of this window content, that is, the URL of source file.
     * 
     * @type js.net.URL
     */
    this.url = null;
    if (properties.crossDomain) {
        this.url = new js.net.URL(properties.url);
    }

    /**
     * Window document. An window has a {@link js.dom.Document document} containing the tree of
     * {@link js.dom.Element elements}. On window close document is disposed.
     * 
     * @type js.dom.Document
     */
    this.doc = null;

    /**
     * Main window page or null if not WinMain.
     * 
     * @type js.ua.Page
     */
    this.page = null;

    /**
     * Child windows list. All child windows created with {@link #open} are dependent, that is, they are automatically
     * closed when parent window closes. This array keep track of created child windows.
     * 
     * @type Array
     */
    this._dependentChildWindows = null;

    /**
     * Window state. Keep track of window life-cycle and assert methods are executed in proper state.
     * 
     * @type js.ua.Window.State
     */
    this._state = js.ua.Window.State.CREATED;
    $debug("js.ua.Window#Window", "Window %s has been created.", this._id);

    if (properties.crossDomain) {
        $debug("js.ua.Window#Window", "Cross domain child window: parent domain |%s| different from child |%s|.", this._parent.url.host, this.url.host);
        return;
    }

    /**
     * Window events. Note that because of security constraints these custom events are not defined for cross domain
     * child window.
     * 
     * @type js.event.CustomEvents
     */
    this._events = new js.event.CustomEvents();
    this._events.register("pre-dom-ready", "dom-ready", "load", "pre-unload", "unload", "orientation-change");

    this._addEventListener("DOMContentLoaded", this._domContentLoadedHandler, this);
    this._addEventListener("load", this._loadHandler, this);
    this._addEventListener("beforeunload", this._beforeUnloadHandler, this);
    this._addEventListener("unload", this._unloadHandler, this);
    if (typeof this._window.onorientationchange !== "undefined") {
        this._addEventListener("orientationchange", this._orientationChangeHandler, this);
    }
};

/**
 * Window index.
 * 
 * @type Number
 */
js.ua.Window._index = 0;

js.ua.Window.prototype = {
    /**
     * Page destroying confirmation message.
     * 
     * @type String
     */
    _DESTROY_CONFIRM : "Please confirm you want to leave the page.",

    /**
     * Create new child window. This method accept optional parameters used to build URL query and optional window
     * features as described by {@link js.ua.Window.Features}, in stated order.
     * 
     * <pre>
     *  WinMain.open("partners.htm", {
     *      id : this._scenarioId
     *  }, {
     *      width : 600,
     *      height : 400
     *  });
     * </pre>
     * 
     * In above example add <code>id</code> to URL using {@link js.net.URL#formatQuery} resulting
     * <code>partners.htm?id=1234</code>. The second supplied object is used to configure the window about to be
     * created. Note that both absolute and relative URLs are accepted. Also, if features are present parameters are
     * mandatory even if null or undefined.
     * 
     * @param String url window document web reference,
     * @param Object... parameters optional URL query parameters,
     * @param Object... features optional windows features.
     * @return js.ua.Window created child window or null if native window creation fails.
     */
    open : function (url, parameters, features) {
        if (parameters) { // if parameters are not undefined or null
            url += js.net.URL.formatQuery(parameters);
        }

        var name, value;
        if (typeof features === "undefined") {
            features = {};
        }
        var defaults = js.ua.Window.Features;
        for (name in defaults) {
            if (typeof features[name] === "undefined" && typeof defaults[name] !== "undefined") {
                features[name] = defaults[name];
            }
        }

        if (features.fullscreen) {
            delete features.top;
            delete features.left;
            delete features.width;
            delete features.height;
        }

        var specs = [];
        for (name in features) {
            value = features[name];
            if (name === "name" || name === "dependent" || typeof value === "undefined") {
                continue;
            }
            if (js.lang.Types.isBoolean(value)) {
                value = value ? "yes" : "no";
            }
            specs.push(name + "=" + value);
        }

        var childWindow, childNativeWindow;
        try {
            childNativeWindow = this._window.open(url, features.name, specs.join(","), false);
            if (childNativeWindow == null) {
                $error("js.ua.Window#open", "Fail to create native window:\r\n" + //
                "\t- url: %s\r\n" + //
                "\t- name: %s\r\n" + //
                "\t- specs: %s", url, features.name, specs.join(","));
                return null;
            }
            childWindow = new js.ua.Window(childNativeWindow, {
                parent : this,
                url : url,
                crossDomain : this.url.isCrossDomain(url)
            });
            if (features.dependent) {
                if (this._dependentChildWindows == null) {
                    this._dependentChildWindows = [];
                }
                this._dependentChildWindows.push(childWindow);
            }
        } catch (er) {
            childWindow = null;
            js.ua.System.error(er);
        }
        return childWindow;
    },

    /**
     * Close this window.
     */
    close : function () {
        $debug("js.ua.Window#close", "Close window |%s|", this._id);
        if (this._window.closed) {
            $debug("js.ua.Window#close", "Attempt to close already closed window |%s|", this._id);
            return;
        }
        this._window.close();
        // unload event is fired when native window closes
    },

    /**
     * Navigate this window to new location. This method loads window from the source identified by given web reference.
     * Takes care to properly serialize URL query parameters, if any.
     * 
     * <pre>
     * 	js.ua.Window.assign("http://www.youtube.com/video/watch/files.avi",
     *	{
     *		v: "p6K_VT6tcvs",
     *		feature: "relmfu"
     *	});
     * </pre>
     * 
     * Note that relative URL is accepted.
     * 
     * @param String url source file web reference,
     * @param Object... parameters optional URL query parameters hash.
     * @return js.ua.Window this object.
     */
    assign : function (url, parameters) {
        if (typeof parameters !== "undefined") {
            url += js.net.URL.formatQuery(parameters);
        }
        this._window.location.assign(url);
        return this;
    },

    /**
     * Like {@link #assign} but current window URL is replaced. Current window URL is replaced by the new one into
     * history, that is, user is not able to back to current page after replacing it.
     * 
     * @param String url source file web reference,
     * @param Object... parameters optional URL query parameters hash.
     * @return js.ua.Window this object.
     */
    replace : function (url, parameters) {
        if (typeof parameters !== "undefined") {
            url += js.net.URL.formatQuery(parameters);
        }
        this._window.location.replace(url);
        return this;
    },

    /**
     * Reload this window from its web source.
     * 
     * @return js.ua.Window this object.
     */
    reload : function () {
        this._window.location.reload();
        return this;
    },

    /**
     * Get window title.
     * 
     * @return String this window title.
     */
    getTitle : function () {
        $assert(this.doc !== null, "js.ua.System#getTitle", "Window document is null.");
        return document.title || "Untitled";
    },

    /**
     * Get this window client width.
     * 
     * @return Number this window width.
     */
    getWidth : function () {
        return Number(this._window.innerWidth);
    },

    /**
     * Get this window client height.
     * 
     * @return Number this window height.
     */
    getHeight : function () {
        return Number(this._window.innerHeight);
    },

    /**
     * Event type to window state map.
     * 
     * @type Object
     */
    _EVENT_STATES : null,

    /**
     * Attach event listener. Window utility class generates custom events related to window life cycle. Here is the
     * list of registered events:
     * <ul>
     * <li>dom-ready
     * <li>load
     * <li>pre-unload
     * <li>unload
     * <li>orientation-change
     * </ul>
     * For a complete events description see {@link js.ua.Window class description}.
     * 
     * @param String type event type,
     * @param Function listener listener to register,
     * @param Object scope listener run-time scope.
     * @return js.ua.Window this object.
     * @assert requested event type is registered, listener is a {@link Function} and scope is an {@link Object}, if
     *         present.
     */
    on : function (type, listener, scope) {
        $assert(this._state < js.ua.Window.State.FINALIZED, "js.ua.Window#on", "Can't add event listener after instance finalization.");
        if (this._EVENT_STATES == null) {
            this._EVENT_STATES = {
                "dom-ready" : js.ua.Window.State.DOM_READY,
                "load" : js.ua.Window.State.LOADED,
                "pre-unload" : js.ua.Window.State.BEFORE_UNLOADED,
                "unload" : js.ua.Window.State.UNLOADED
            };
        }
        if (this._state >= this._EVENT_STATES[type]) {
            // if related native event was already triggered execute listener right now
            listener.call(scope, this);
            return this;
        }
        this._events.addListener(type, listener, scope || js.ua.Window);
        return this;
    },

    /**
     * Detach event listener. Event type to remove must be a registered one, see {@link js.ua.Window class description}
     * for valid types.
     * 
     * @param String type event type,
     * @param Function listener attached event listener.
     * @return js.ua.Window this object.
     * @assert given event type is registered and listener is a {@link Function}.
     */
    un : function (type, listener) {
        $assert(this._state < js.ua.Window.State.FINALIZED, "js.ua.Window#un", "Can't remove event listener after instance finalization.");
        this._events.removeListener(type, listener);
        return this;
    },

    /**
     * Get orientation.
     * 
     * @return js.ua.Orientation
     */
    getOrientation : function () {
        return (this._window.orientation % 180 === 0) ? js.ua.Orientation.PORTRAIT : js.ua.Orientation.LANDSCAPE;
    },

    /**
     * DOM content loaded event listener. Remove itself then invoke {@link #_fireDomReady()}.
     */
    _domContentLoadedHandler : function () {
        $trace("js.ua.Window#_domContenLoadedHandler", this._id);
        this._removeEventListener("DOMContentLoaded", js.ua.Window.prototype._domContentLoadedHandler);
        this._fireDomReady();
    },

    /**
     * Window load event handler.
     */
    _loadHandler : function () {
        // DOM ready and page loaded events are registered to different triggers and I do not found and explicit
        // specification regarding their order; so it seems we are at user agent implementation mercy
        // also we have a potential race condition here if implementation uses different threads of execution for
        // 'DOMContentLoaded' and 'load' triggers
        // for theses reasons is possible this method to be enacted before _fireDomReady() set this._state to DOM_READY

        $assert(this._state === js.ua.Window.State.CREATED || this._state === js.ua.Window.State.DOM_READY, "js.ua.Window#_loadHandler", "Invalid state. Expected CREATED or DOM_READY but got %s.", this._stateName());
        $trace("js.ua.Window#_loadHandler", this._id);
        this._removeEventListener("load", js.ua.Window.prototype._loadHandler);

        // we need to ensure DOM ready event is fired, even at this lately stage
        // in other words: better later than never
        // anyway, if _fireDomReady was already executes next statement is NOP
        this._fireDomReady();

        $debug("js.ua.Window#_loadHandler", "Fire load event for %s.", this._id);
        this._events.fire("load", this);
        this._state = js.ua.Window.State.LOADED;
    },

    /**
     * Window before unload event handler.
     * <p>
     * Implementation note: in most use cases unload occurs after page load completes. Anyway, for a very heavy page and
     * no browser cache it can happen user to leave the page before load completes. For such at edge condition this
     * method takes care to execute {@link #_loadHandler()} so that {@link js.ua.Window} life cycle is respected.
     * 
     * @return String unload notification.
     */
    _beforeUnloadHandler : function () {
        if (this._state !== js.ua.Window.State.LOADED) {
            // takes care to fire page load event if unload comes before actual page loading completes
            this._loadHandler();
        }

        $assert(this._state === js.ua.Window.State.LOADED, "js.ua.Window#_beforeUnloadHandler", "Invalid state. Expected LOADED but got %s.", this._stateName());
        $debug("js.ua.Window#_beforeUnloadHandler", "Fire pre-unload event for %s.", this._id);
        this._removeEventListener("beforeunload", js.ua.Window.prototype._beforeUnloadHandler);

        var results = this._events.fire("pre-unload", this);
        var preventUnload = false;
        for ( var i = 0; i < results.length; ++i) {
            // event listener should return explicit false boolean in order to prevent unload
            preventUnload |= (results[i] === false);
        }

        this._state = js.ua.Window.State.BEFORE_UNLOADED;
        if (preventUnload) {
            return this._DESTROY_CONFIRM;
        }
    },

    /**
     * Window unload event handler.
     */
    _unloadHandler : function () {
        // there is a strange behavior on creating new window with open
        // on new created window unload event is triggered immediately after window creation
        if (this._state === js.ua.Window.State.CREATED) {
            $debug("js.ua.Window#_unloadHandler", "Ignore strange unload event on window creation.");
            return;
        }

        $assert(this._state === js.ua.Window.State.BEFORE_UNLOADED, "js.ua.Window#_unloadHandler", "Invalid state. Expected BEFORE_UNLOADED but got %s.", this._stateName());
        this._removeEventListener("unload", js.ua.Window.prototype._unloadHandler);

        $debug("js.ua.Window#_unloadHandler", "Fire unload event for %s.", this._id);
        this._events.fire("unload", this);

        if (this._dependentChildWindows !== null) {
            this._dependentChildWindows.forEach(function (childWindow) {
                $debug("js.ua.Window#finalize", "Force child window %s closing on parent finalization.", childWindow._id);
                childWindow.close();
            });
        }
        this._state = js.ua.Window.State.FINALIZED;
    },

    /**
     * Device orientation change event handler.
     */
    _orientationChangeHandler : function () {
        $debug("js.ua.Window#_orientationChangeHandler", "Fire orientation-change event for %s.", this._id);
        this._events.fire("orientation-change", this.getOrientation());
    },

    /**
     * Add window event listener.
     * 
     * @param String type event type,
     * @param Function listener event listener,
     * @param Object scope listener runtime scope.
     */
    _addEventListener : function (type, listener, scope) {
        var target = (type === "DOMContentLoaded") ? this._window.document : this._window;
        target.addEventListener(type, listener.bind(scope), false);
    },

    /**
     * Remove window event listener.
     * 
     * @param String type event type,
     * @param Function listener event listener.
     */
    _removeEventListener : function (type, listener) {
        var target = (type === "DOMContentLoaded") ? this._window.document : this._window;
        target.removeEventListener(type, listener, false);
    },

    /**
     * Finalize window loading process and generates document ready events. This method disable itself by replacing with
     * {@link js.lang.NOP} then execute next steps:
     * <ul>
     * <li>initialize this window instance URL, document and document body,
     * <li>add engine class to document body allowing for CSS hacking, see
     * {@link js.ua.Engine#cssClass browser specific CSS class},
     * <li>if main window, define global selectors <code>js.dom.Element $E(String selectors)</code> and
     * <code>js.dom.EList $L(String selectors)</code>,
     * <li>if main window, execute classes static initializers, see {@link js.lang.Operator $static pseudo-operator},
     * <li>fires <code>pre-dom-ready</code> event,
     * <li>if main window, create page instance,
     * <li>fires <code>dom-ready</code> event,
     * <li>if main window, preload requested element instances, see {@link js.lang.Operator $preload pseudo-operator},
     * <li>set this window instance state to {@link js.ua.Window.State DOM_READY}.
     * </ul>
     * 
     * @assert this window state is {@link js.ua.Window.State CREATED}.
     */
    _fireDomReady : function () {
        $assert(this._state === js.ua.Window.State.CREATED, "js.ua.Window#_fireDomReady", "Invalid state. Expected CREATED but got %s.", this._stateName());

        // do not use js.ua.Window.prototype._fireDomReady in order to avoid NOP-ing all window instances
        this._fireDomReady = js.lang.NOP;

        // complete this instance fields initialization, postponed by constructor in order to avoid hard dependencies
        $assert(this.url == null, "js.ua.Window#_fireDomReady", "Window URL is not null.");
        this.url = new js.net.URL(this._window.location.toString());
        this.doc = new js.dom.Document(this._window.document);
        this.doc.body = this.doc.getByTag("body");

        // as early as possible add engine class used to CSS hacking
        if (this.doc.body !== null) {
            this.doc.body.addCssClass(js.ua.Engine.cssClass);
        }
        var isWinMain = (this === WinMain);

        if (isWinMain) {
            $assert(typeof $E === "undefined", "js.ua.Window#_fireDomReady", "Global selector for first element already defined.");
            $assert(typeof $L === "undefined", "js.ua.Window#_fireDomReady", "Global selector for list of elements already defined.");

            /**
             * Global selector for first element identified by given CSS selector. Multiple comma separated selectors
             * are allowed in which case every selector is tested for match in the order from list till first element
             * found. Return null if no element found. Selectors argument can be formatted as supported by $format
             * operator in which case <em>args</em> should be supplied.
             * 
             * @param String selectors comma separated list of CSS selectors,
             * @param Object... args optional arguments if selectors is formatted.
             * @return js.dom.Element found element or null.
             * @assert <em>selectors</em> argument is not undefined, null or empty.
             */
            $E = function (selectors) {
                $assert(selectors, 'js.ua.Page#$E', 'Selectors is undefined, null or empty.');
                if (arguments.length > 1) {
                    selectors = $format(arguments);
                }
                return WinMain.doc.getElement(js.dom.Node.querySelector(window.document, selectors));
            };

            /**
             * Global selector for list of elements identified by given CSS selector. Multiple comma separated selectors
             * are allowed in which case every selector is tested for match in the order from list and results merged.
             * Return empty list if no element found. Selectors argument can be formatted as supported by $format
             * operator in which case <em>args</em> should be supplied.
             * 
             * @param String selectors comma separated list of CSS selectors,
             * @param Object... args optional arguments if selectors is formatted.
             * @return js.dom.EList found element list, possible empty.
             * @assert <em>selectors</em> argument is not undefined, null or empty.
             */
            $L = function (selectors) {
                $assert(selectors, 'js.ua.Page#$L', 'Selectors is undefined, null or empty.');
                if (arguments.length > 1) {
                    selectors = $format(arguments);
                }
                return WinMain.doc.getEList(js.dom.Node.querySelectorAll(window.document, selectors));
            };

            // run classes static initializers before firing any DOM ready related events
            $static.execute();
        }

        $debug("js.ua.Window#_fireDomReady", "Fire pre-dom-ready event for %s.", this._id);
        this._events.fire("pre-dom-ready", this);

        if (isWinMain) {
            // if user space code does not declare a subclass for page uses base page class, but only if this is WinMain
            if (this === WinMain && this.page == null) {
                $debug("js.ua.Window#_fireDomReady", "No user space page. Uses js.ua.Page instead.");
                this.page = new js.ua.Page();
            }
        }

        $debug("js.ua.Window#_fireDomReady", "Fire dom-ready event for for %s.", this._id);
        this._events.fire("dom-ready", this);

        if (isWinMain) {
            // after all classes are properly initialized preload requested element instances
            $preload.execute();
        }

        this._state = js.ua.Window.State.DOM_READY;
    },

    /**
     * Get state name.
     * 
     * @return String state name.
     */
    _stateName : function () {
        if (typeof js.ua.Window.STATE_NAMES === "undefined") {
            /**
             * Window state names. Mainly for debugging purposes.
             * 
             * @type Array
             */
            js.ua.Window.STATE_NAMES = [ "NONE", "CREATED", "DOM_READY", "LOADED", "BEFORE_UNLOADED", "UNLOADED", "FINALIZED" ];
        }
        return js.ua.Window.STATE_NAMES[this._state];
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.ua.Window";
    }
};
$extends(js.ua.Window, Object);

/**
 * Window life-cycle states.
 */
js.ua.Window.State = {
    /**
     * Neutral value.
     */
    NONE : 0,

    /**
     * Window created.
     */
    CREATED : 1,

    /**
     * DOM tree completely parsed.
     */
    DOM_READY : 2,

    /**
     * Window and all resources completely loaded.
     */
    LOADED : 3,

    /**
     * Just before unload.
     */
    BEFORE_UNLOADED : 4,

    /**
     * Unload process is about to finish.
     */
    UNLOADED : 5,

    /**
     * Window finalized. Window instance in this state can"t be used.
     */
    FINALIZED : 6
};

/**
 * Child window configurable features. This enumeration lists all features - and their default value, used by
 * {@link js.ua.Window#open} to configure newly created child window.
 */
js.ua.Window.Features = {
    /**
     * Window top position. Default undefined.
     * 
     * @type Number
     */
    top : undefined,

    /**
     * Window left position. Default undefined.
     * 
     * @type Number
     */
    left : undefined,

    /**
     * Window width. Default undefined.
     * 
     * @type Number
     */
    width : undefined,

    /**
     * Window height. Default undefined.
     * 
     * @type Number
     */
    height : undefined,

    /**
     * Is created window resizable? Default to false.
     * 
     * @type Boolean
     */
    resizable : false,

    /**
     * Is created window full screen? Default to false.
     * 
     * @type Boolean
     */
    fullscreen : false,

    /**
     * The menu bar is the main menu, usually on top of window window. Default to true.
     * 
     * @type Boolean
     */
    menubar : true,

    /**
     * Location is in fact address bar, that is, where the URL is displayed. Default to true.
     * 
     * @type Boolean
     */
    location : true,

    /**
     * The toolbar is the bar at the top of the window with buttons. Default to true.
     * 
     * @type Boolean
     */
    toolbar : true,

    /**
     * Directories bar holds a set of buttons for your favorite web sites. Default to true.
     * 
     * @type Boolean
     */
    directories : true,

    /**
     * Standard vertical and horizontal scroll bars. Default to true.
     * 
     * @type Boolean
     */
    scrollbars : true,

    /**
     * Status bar is where the browser displays messages for the user, usually on bottom of popup window. Default to
     * true.
     * 
     * @type Boolean
     */
    status : true,

    /**
     * A dependent child window will automatically close on parent closing. Default to true.
     * 
     * @type Boolean
     */
    dependent : true,

    /**
     * Window name, usable as value of a form"s target attribute. Instead of user defined name one may choose from next
     * predefined values:
     * <ul>
     * <li>_blank - URL is loaded into a new window; this is the default value,
     * <li>_parent - URL is loaded into the parent frame,
     * <li>_self - URL replaces the current page,
     * <li>_top - URL replaces any frame sets that may be loaded.
     * </ul>
     * 
     * @type String
     */
    name : "_blank"
};

/**
 * Uses IE attach and detach event listeners functions and emulate DOMContentLoaded W3C event.
 */
$legacy(!document.addEventListener || !document.removeEventListener, function () {
    js.ua.Window.prototype._addEventListener = function (type, listener, scope) {
        var doc = this._window.document;
        var _this = this;

        if (typeof this.__window_load_complete__ === "undefined") {
            this.__window_load_complete__ = false;
        }
        if (typeof this.__dom_ready_fired__ === "undefined") {
            this.__dom_ready_fired__ = false;
        }

        if (type !== "DOMContentLoaded") {
            if (type === "load" && doc.readyState === "complete") {
                $debug("js.ua.Window#_addEventListener", "Trying to register window load event after ready state complete.");
                _this.__window_load_complete__ = true;
                if (_this.__dom_ready_fired__) {
                    window.setTimeout(function () {
                        _this.__window_load_complete__ = false;
                        _this._loadHandler();
                    }, 10);
                }
            }
            else {
                this._window.attachEvent("on" + type, listener.bind(scope));
            }
            return this;
        }

        function fireDomReady () {
            if (!_this.__dom_ready_fired__) {
                _this.__dom_ready_fired__ = true;
                _this._fireDomReady();
                if (_this.__window_load_complete__) {
                    _this.__window_load_complete__ = false;
                    _this._loadHandler();
                }
            }
        }

        var docReadyStateHandler = function () {
            if (doc.readyState === "complete") {
                doc.detachEvent("onreadystatechange", docReadyStateHandler);
                fireDomReady();
            }
        };
        doc.attachEvent("onreadystatechange", docReadyStateHandler);

        if (this._window.top === this._window.self) { // not inside of iframe
            (function doScroll () {
                try {
                    doc.documentElement.doScroll("left");
                } catch (e) {
                    window.setTimeout(doScroll, 10);
                    return;
                }
                fireDomReady();
            })();
        }
        return this;
    };

    js.ua.Window.prototype._removeEventListener = function (type, listener) {
        if (type !== "DOMContentLoaded") {
            this._window.detachEvent(type, listener);
        }
        return this;
    };
});

/**
 * Fix for double invocation of before unload on IE. There are peculiar conditions related to page assign that lead to
 * double invocation of before unload handler. Sometimes Window.assign is on stack trace, suggesting that locatin.assign
 * invoke before unload and second invocation is on normal page unload process. This work around allows only first call,
 * hopefully is not called somewhere inside page session.
 */
$legacy(js.ua.Engine.TRIDENT, function () {
    js.ua.Window.__before_unload_handler__ = js.ua.Window.prototype._beforeUnloadHandler;
    js.ua.Window.prototype._beforeUnloadHandler = function () {
        if (this._state === js.ua.Window.State.LOADED) {
            js.ua.Window.__before_unload_handler__.call(this);
        }
    };
});
/**
 * Bootstrap script. Build tool is configured to insert this script on top of all library classes, so is executed first.
 * Takes care to include and initialize library logger, pseudo-operators and main window, via its static initializer.
 * The rest of library is processed considered every class dependencies.
 */

/**
 * Fake $include used by bootstrap script till pseudo-operators load.
 */
$include = function () {
};

/**
 * Include global scripts and classes.
 */
$include("js.lang.Operator");
$include("js.ua.System");
$include("js.ua.Window");

(function () {
    try {
        /**
         * Create browser main window visible into global space.
         */
        WinMain = new js.ua.Window(window);
    } catch (er) {
        js.ua.System.error(er);
    }
})();
$package("js.dom");

/**
 * Document element. This class implements the element, central piece of document model. In fact a document is just a
 * tree of elements. An element have child elements and/or text and may poses attributes and {@link js.dom.Style styles}.
 * 
 * <p>
 * This class supplies methods for child nodes handling - add, replace, insert, clone and remove, navigation - first and
 * last child, next and previous sibling, searching by XPath, CSS selectors, tag name and CSS class. Also provides
 * methods for attribute, CSS classes and text handling. Finally there is support for {@link js.event.DomEvents DOM} and
 * {@link js.event.CustomEvents custom} events (de)registration and user defined data.
 * 
 * <p>
 * Navigation methods and children getter are working only on elements, text nodes are ignored. So, for example,
 * getChildren() return empty list if this element has only text. Searching is performed as described in
 * {@link js.dom.Document document object}.
 * 
 * <p>
 * Every element has a special {@link #setValue formatted value setter}. It accepts any value converted to a
 * {@link String} by this class {@link #_format formatter}. The general contract of this method is
 * <em>formatted value setter</em>. What a <em>value</em> means depends on every class; for this one value is
 * considered the element text content. A subclass can choose to consider as value an attribute by overriding value
 * setter.
 * 
 * <p>
 * Element supports five types of accessors:
 * <ol>
 * <li>s(g)etAttr - attribute value as string
 * <li>s(g)etText - text content
 * <li>s(g)etHTML - inner HTML
 * <li>s(g)etValue - formatted value
 * <li>s(g)etObject - aggregated object
 * </ol>
 * 
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * @constructor Construct document element. This constructor accept two mandatory and valid arguments: owner document
 *              and native node to wrap. If any of them is undefined, null or not of proper type this instance
 *              construction can"t be completed and exception is thrown.
 * 
 * @param js.dom.Document ownerDoc owner document,
 * @param Node node native {@link Node} instance.
 * @assert owner document argument is a not null or undefined {@link js.dom.Document}, native node is not null or
 *         undefined and is of {@link Node ELEMENT_NODE} type.
 */
js.dom.Element = function (ownerDoc, node) {
    var dataCfg, pairs, value, i;

    $assert(this instanceof js.dom.Element, "js.dom.Element#Element", "Invoked as function.");
    $assert(ownerDoc, "js.dom.Element#Element", "Undefined or null owner document.");
    $assert(ownerDoc instanceof js.dom.Document, "js.dom.Element#Element", "Owner document is not an instance of js.dom.Document.");
    $assert(node, "js.dom.Element#Element", "Undefined or null node.");
    $assert(node.nodeType === Node.ELEMENT_NODE, "js.dom.Element#Element", "Invalid node type #%d", node.nodeType);

    /**
     * Document this element belongs to.
     * 
     * @type js.dom.Document
     */
    this._ownerDoc = ownerDoc;

    /**
     * Wrapped native DOM node object. Note that wrapped node keeps a back-reference to this element.
     * 
     * @type Node
     */
    this._node = node;
    js.dom.Node.setElement(node, this);

    /**
     * This element styles.
     * 
     * @type js.dom.Style
     */
    this.style = new js.dom.Style(this);

    /**
     * Optional format instance or null. May be used by {@link #setValue} to prepare value for display on user
     * interface. If this element is an input, format instance may be also used by {@link js.dom.Control#getValue} and
     * {@link js.dom.Control#isValid} to parse and test input value.
     * 
     * @type js.format.Format
     */
    this._format = js.format.Factory.getFormat(js.dom.Node.getFormatName(node));
    $assert(this._format == null || js.lang.Types.isObject(this._format), "js.dom.Element#Element", "Formatter is not an object.");

    /**
     * Element configuration. Configuration data is formatted as name/value pairs separated by semicolon, like standard
     * inline styles.
     * 
     * <pre>
     * 	&lt;table data-class="js.widget.Table" data-cfg="multi-select:true;"&gt;
     * </pre>
     * 
     * @type String
     */
    this._config = {};
    dataCfg = this.getAttr("data-cfg");
    if (dataCfg !== null) {
        pairs = js.util.Strings.parseNameValues(dataCfg);
        for (i = 0; i < pairs.length; i++) {
            value = pairs[i].value;
            if (value === "true") {
                value = true;
            }
            else if (value === "false") {
                value = false;
            }
            else if (!isNaN(value)) {
                value = Number(value);
            }
            this._config[js.util.Strings.toScriptCase(pairs[i].name)] = value;
        }
        this.removeAttr("data-cfg");
    }

    /**
     * DOM events manager.
     * 
     * @type js.event.DomEvents
     */
    this._domEvents = new js.event.DomEvents(this);

    /**
     * Element hash code. Hash code is used when need an object key and is a string value guaranteed to be unique only
     * on script engine session. Is not usable for object persistence between sessions.
     * 
     * @type String
     */
    this._hashCode = js.util.ID();
};

js.dom.Element.prototype = {
    /**
     * Low level access to W3C DOM Node interface.
     * 
     * @return Node wrapped native node.
     */
    getNode : function () {
        return this._node;
    },

    /**
     * Get owner document.
     * 
     * @return js.dom.Document this element owner document.
     */
    getOwnerDoc : function () {
        return this._ownerDoc;
    },

    /**
     * Add child element(s). Add child to this element children list end. If child to append is already part of document
     * tree, i.e. it has a parent, it is first removed - in which case add becomes move. Supports a variable number of
     * elements as arguments so is possible to add more than just one child in a single call. Child (children) to be
     * added must belong to the same {@link js.dom.Document document} that owns this element. If not, this method
     * performs {@link js.dom.Document#importElement} first. Note that import is always deep.
     * 
     * <p>
     * If a child argument is undefined or null or is not instance of js.dom.Element this method ignores the culprit.
     * 
     * @param js.dom.Element... child, one or more child element(s) to be appended.
     * @return js.dom.Element this element.
     * @assert positive arguments count, every argument is not undefined or null and is instance of js.dom.Element.
     */
    addChild : function () {
        $assert(arguments.length > 0, "js.dom.Element#addChild", "Missing element to add.");
        for (var i = 0, a; i < arguments.length; ++i) {
            a = arguments[i];
            $assert(a, "js.dom.Element#addChild", "Undefined or null argument.");
            if (a) {
                $assert(a instanceof js.dom.Element, "js.dom.Element#addChild", "Argument is not a js.dom.Element.");
                if (a instanceof js.dom.Element) {
                    if (!this._ownerDoc.equals(a._ownerDoc)) {
                        a = this._ownerDoc.importElement(a);
                    }
                    this._node.appendChild(a._node);
                }
            }
        }
        return this;
    },

    /**
     * Add element as first child to this element.
     * 
     * @param Object children element or elist to add.
     * @return js.dom.Element this element.
     */
    addChildFirst : function (children) {
        $assert(children, "js.dom.Element#addChildFirst", "Undefined or null argument.");
        var firstChild = this.getFirstChild();

        if (children instanceof js.dom.Element) {
            if (firstChild != null) {
                firstChild.insertBefore(children);
            }
            else {
                this.addChild(children);
            }
            return this;
        }

        if (children instanceof js.dom.EList) {
            var it = children.it();
            if (firstChild != null) {
                while (it.hasNext()) {
                    firstChild.insertBefore(it.next());
                }
            }
            else {
                while (it.hasNext()) {
                    this.addChild(it.next());
                }
            }
            return this;
        }

        $assert(false, "js.dom.Element#addChildFirst", "Argument is not element or elist.");
        return this;
    },

    /**
     * Replace child. Replace an existing child element with a new element. If <code>replacement</code> is part of the
     * tree of document that own this element it is first removed. If <code>replacement</code> or
     * <code>existing</code> are undefined or null this method does nothing. Perform
     * {@link js.dom.Document#import import} if <code>replacement</code> does not belong to the same document. Please
     * note that import is always deep.
     * 
     * @param js.dom.Element replacement element to be inserted,
     * @param js.dom.Element existing existing child to be replaced.
     * @return js.dom.Element this object.
     * @assert both arguments are not undefined or null.
     */
    replaceChild : function (replacement, existing) {
        $assert(replacement, "js.dom.Element#replaceChild", "Replacement element is undefined or null.");
        $assert(existing, "js.dom.Element#replaceChild", "Existing element is undefined or null.");
        if (replacement && existing) {
            if (!replacement._ownerDoc.equals(this._ownerDoc)) {
                replacement = this._ownerDoc.importElement(replacement);
            }
            this._node.replaceChild(replacement._node, existing._node);
        }
        return this;
    },

    /**
     * Insert element. Insert element before this one, that is, inserted element becomes previous sibling. If inserted
     * element already exist in owning document it is first removed. Perform {@link js.dom.Document#import import} if
     * element to insert does not belong to the same document. Please note that import is always deep.
     * 
     * @param js.dom.Element el child element to be inserted
     * @return js.dom.Element this element.
     * @assert element to insert is not undefined or null and this element has a parent.
     */
    insertBefore : function (el) {
        $assert(el, "js.dom.Element#insertBefore", "Element to insert is undefined or null.");
        if (el) {
            if (!el._ownerDoc.equals(this._ownerDoc)) {
                el = this._ownerDoc.importElement(el);
            }
            $assert(this._node.parentNode, "js.dom.Element#insertBefore", "This element has no parent.");
            if (this._node.parentNode) {
                this._node.parentNode.insertBefore(el._node, this._node);
            }
        }
        return this;
    },

    /**
     * Clone this element. If deep flag is true clone this element descendants too, otherwise a shallow copy is
     * performed. Returned clone has the same owning document but is not part of document tree till explicitly inserted.
     * Note that source node, i.e. this node, registered events are not cloned. Event listeners must be attached to the
     * newly created Element afterwards, if so desired. Finally, source user defined data is not cloned, even if deep
     * cloning.
     * 
     * @param Boolean deep optional deep cloning flag, default to false.
     * @return js.dom.Element the clone.
     * @assert <code>deep</code> flag, if present, should be {@link js.lang.Types#isBoolean boolean}.
     */
    clone : function (deep) {
        $assert(typeof deep === "undefined" || js.lang.Types.isBoolean(deep), "js.dom.Element#clone", "Deep flag is not boolean.");
        return this._ownerDoc.getElement(this._node.cloneNode(deep === true));
    },

    /**
     * Replace this element with replacement. If <code>replacement</code> is part of the tree of document that own
     * this element, removed it first. Perform {@link js.dom.Document#importElement import} if <code>replacement</code>
     * does not belong to the same document. Please note that import is always deep.
     * 
     * @param js.dom.Element replacement element to replace this one.
     * @assert replacement element is not undefined or null and this element has a parent.
     */
    replace : function (replacement) {
        $assert(replacement, "js.dom.Element#replace", "Replacement element is undefined or null.");
        if (replacement) {
            if (!replacement._ownerDoc.equals(this._ownerDoc)) {
                replacement = this._ownerDoc.importElement(replacement);
            }
            $assert(this._node.parentNode, "js.dom.Element#replace", "This element have not a parent.");
            if (this._node.parentNode) {
                this._node.parentNode.replaceChild(replacement._node, this._node);
            }
        }
    },

    /**
     * Self-remove. Remote itself from owner document tree ensuring all children back-references and event listener are
     * deleted. Anyway, if optional <code>clear</code> flag is false clean-up is not performed.
     * 
     * @param Boolean... clear optional flag, default to true.
     * @return js.dom.Element this object, but only if <code>clear</code> is false. Otherwise returns void since this
     *         element is not reusable once clean-up performed.
     * @assert <code>clear</code> argument is strictly false, if present.
     */
    remove : function (clear) {
        $assert(typeof clear === "undefined" || clear === false, "js.dom.Element#remove", "Clear flag is not false.");
        if (clear === false) {
            this._node.parentNode.removeChild(this._node);
            return this;
        }
        var tmpNodeRef = this._node;
        tmpNodeRef.parentNode.removeChild(tmpNodeRef);
        this._clean(this._node);
    },

    /**
     * Remove all children. Traverse all this element children and execute remove with clean-up on each.
     * 
     * @return js.dom.Element this object.
     */
    removeChildren : function () {
        var child, removed;
        while ((child = this._node.firstChild) !== null) {
            removed = false;
            if (child.nodeType === Node.ELEMENT_NODE) {
                var el = js.dom.Node.getElement(child);
                if (el !== null) {
                    el.remove();
                    removed = true;
                }
            }
            if (!removed) {
                this._node.removeChild(child);
            }
            child = this._node.firstChild;
        }
        return this;
    },

    /**
     * Get descendant by object class. Returns first descendant element identifiable by given object class. Returns null
     * if given <code>clazz</code> argument is not defined, null or empty. Class not found is considered a flaw in
     * logic and throws assertion; if assertion is disabled returns null.
     * 
     * @param Object clazz class name or constructor for class to search for.
     * @return js.dom.Element found element or null.
     * @assert <code>clazz</code> argument is not undefined, null, is of proper type and requested class exists.
     */
    getByClass : function (clazz) {
        var node = js.dom.Node.getElementByClass(this._node, clazz);
        $assert(node !== null, "js.dom.Element#getByClass", "Class |%s| not found.", clazz);
        return this._ownerDoc.getElement(node);
    },

    /**
     * Get this element descendant identified by XPath expression. Evaluate XPath expression and return first found
     * descendant; please note that if given XPath expression is relative to entire document returned element is not
     * necessarily this element descendant. Returns null if given <code>xpath</code> is not defined, null or empty or
     * if XPath evaluation has no result.
     * <p>
     * XPath expression <code>xpath</code> can be formatted as supported by $format pseudo-operator in which case
     * <code>args</code> arguments should be supplied.
     * 
     * @param String xpath XPath expression to evaluate,
     * @param Object... args optional arguments if <code>xpath</code> is formatted.
     * @return js.dom.Element first found descendant or null.
     * @assert <code>xpath</code> argument is not undefined, null or empty.
     * @note this method works only on XML documents.
     */
    getByXPath : function (xpath) {
        $assert(xpath, "js.dom.Element#getByXPath", "XPath expression is undefined, null or empty.");
        return this._ownerDoc.evaluateXPathNode(this._node, $format(arguments));
    },

    /**
     * Find this element descendants identified by XPath expression. Evaluate XPath expression and return found
     * descendants; please note that if given XPath expression is relative to entire document returned elements are not
     * necessarily this element descendants. Return empty list if given <code>xpath</code> is not defined, null or
     * empty or if XPath evaluation has no result.
     * <p>
     * XPath expression <code>xpath</code> can be formatted as supported by $format pseudo-operator in which case
     * <code>args</code> arguments should be supplied.
     * 
     * @param String xpath XPath expression to evaluate,
     * @param Object... args optional arguments if <code>xpath</code> is formatted.
     * @return js.dom.EList list of found descendants, possible empty.
     * @assert <code>xpath</code> argument is not undefined, null or empty.
     * @note this method works only on XML documents.
     */
    findByXPath : function (xpath) {
        $assert(xpath, "js.dom.Element#findByXPath", "XPath expression is undefined, null or empty.");
        return this._ownerDoc.evaluateXPathNodeList(this._node, $format(arguments));
    },

    /**
     * Get descendant by CSS selectors. Returns first descendant element identifiable by given CSS selector. Multiple
     * comma separated selectors are allowed in which case every selector is tested for match in the order from list
     * till first element found. Returns null if given <code>selectors</code> argument is not defined, null or empty
     * or CSS evaluation has no results.
     * <p>
     * Selectors argument can be formatted as supported by $format pseudo-operator in which case optional arguments
     * should be supplied.
     * 
     * @param String selectors CSS selectors to evaluate,
     * @param Object... args optional arguments if <code>selectors</code> is formatted.
     * @return js.dom.Element found element or null.
     * @assert <code>selectors</code> argument is not undefined, null or empty.
     */
    getByCss : function (selectors) {
        $assert(selectors, "js.dom.Element#getByCss", "CSS selectors is undefined, null or empty.");
        return this._ownerDoc.getElement(js.dom.Node.querySelector(this._node, $format(arguments)));
    },

    /**
     * Find descendants by CSS selectors. Returns a list of descendant elements, every one identifiable by given CSS
     * selector. Multiple comma separated selectors are allowed in which case every selector is tested for match in the
     * order from list and results merged. Returns empty list if given <code>selectors</code> argument is not defined,
     * null or empty or CSS evaluation has no results.
     * <p>
     * Selectors argument can be formatted as supported by $format pseudo-operator in which case optional arguments
     * should be supplied.
     * 
     * @param String selectors CSS selectors to evaluate,
     * @param Object... args optional arguments if selectors is formatted.
     * @return js.dom.EList list of found elements, possible empty.
     * @assert <code>selectors</code> argument is not undefined, null or empty.
     */
    findByCss : function (selectors) {
        $assert(selectors, "js.dom.Element#findByCss", "CSS selectors is undefined, null or empty.");
        return this._ownerDoc.getEList(js.dom.Node.querySelectorAll(this._node, $format(arguments)));
    },

    /**
     * Get descendant by tag. Search for descendants with given tag name and return the first found. Returns null if
     * there is no descendant with desired tag name or if <code>tag</code> argument is not defined, null or empty.
     * <p>
     * On XML documents tag name is case sensitive whereas in HTML is not. For consistency sake is recommended to always
     * consider tags name as case sensitive.
     * 
     * @param String tag tag name to search for.
     * @return js.dom.Element first descendant with specified tag name or null.
     * @assert <code>tag</code> argument is not undefined, null or empty.
     */
    getByTag : function (tag) {
        $assert(tag, "js.dom.Element#getByTag", "Tag name is undefined, null or empty.");
        return this._ownerDoc.getElement(js.dom.Node.getElementsByTagName(this._node, tag));
    },

    /**
     * Find descendants by tag. Return a {@link js.dom.EList list} of descendant elements with given tag name. If no
     * descendant found or if <code>tag</code> argument is not defined, null or empty returned list is empty.
     * <p>
     * On XML documents tag name is case sensitive whereas in HTML is not. For consistency sake is recommended to always
     * consider tags name as case sensitive.
     * 
     * @param String tag tag name to search for.
     * @return js.dom.EList list of descendants with specified tag, possible empty.
     * @assert <code>tag</code> argument is not undefined, null or empty.
     */
    findByTag : function (tag) {
        $assert(tag, "js.dom.Element#findByTag", "Tag name is undefined, null or empty.");
        return this._ownerDoc.getEList(js.dom.Node.getElementsByTagName(this._node, tag));
    },

    /**
     * Get descendant by CSS class. Search for descendants with given CSS class and return the first found. Returns null
     * if there is no descendant with desired CSS class or if <code>cssClass</code> argument is not defined, null or
     * empty.
     * 
     * @param String cssClass CSS class to search for.
     * @return js.dom.Element first descendant element with specified CSS class or null.
     * @assert <code>cssClass</code> is not undefined, null or empty.
     * @note to avoid confusion with language class reserved word, throughout j(s)-lib, element <em>class attribute</em>
     *       is named CSS class.
     */
    getByCssClass : function (cssClass) {
        $assert(cssClass, "js.dom.Element#getByCssClass", "CSS class is undefined, null or empty.");
        return this._ownerDoc.getElement(js.dom.Node.getElementsByClassName(this._node, cssClass));
    },

    /**
     * Find descendants by CSS class. Searches all this element descendants and returns those possessing given CSS
     * class. Returns empty list if there is no descendant with desired CSS class or if <code>cssClass</code> argument
     * is not defined, null or empty.
     * 
     * @param String cssClass CSS class to search for.
     * @return js.dom.EList a list of descendants with specified class, possible empty.
     * @assert <code>cssClass</code> is not undefined, null or empty.
     * @note to avoid confusion with language class reserved word, throughout j(s)-lib, element <em>class attribute</em>
     *       is named CSS class.
     */
    findByCssClass : function (cssClass) {
        $assert(cssClass, "js.dom.Element#findByCssClass", "CSS class is undefined, null or empty.");
        return this._ownerDoc.getEList(js.dom.Node.getElementsByClassName(this._node, cssClass));
    },

    /**
     * Get this element parent. Return null if this element has no parent element. Note that <code>parentNode</code>
     * property of underlying node can be document or document fragment in which case this method still return null.
     * 
     * @return js.dom.Element this element parent.
     */
    getParent : function () {
        if (this._node.parentNode == null) {
            return null;
        }
        return this._node.parentNode.nodeType === Node.ELEMENT_NODE ? this._ownerDoc.getElement(this._node.parentNode) : null;
    },

    /**
     * Get this element ancestor of given tag. Walk up through ancestor hierarchy till found one with specified tag.
     * Returns null if none found.
     * 
     * @param String tag ancestor tag name.
     * @return js.dom.Element ancestor of given tag or null.
     */
    getParentByTag : function (tag) {
        var el = this;
        while (el.getTag() !== tag) {
            el = el.getParent();
            if (el == null) {
                return null;
            }
        }
        return el;
    },

    /**
     * Get this element ancestor possessing requested CSS class. Walk up through ancestor hierarchy till found one
     * possessing specified CSS class. Returns null if none found.
     * 
     * @param String cssClass ancestor CSS class.
     * @return js.dom.Element ancestor of given CSS class or null.
     */
    getParentByCssClass : function (cssClass) {
        var el = this;
        while (!el.hasCssClass(cssClass)) {
            el = el.getParent();
            if (el == null) {
                return null;
            }
        }
        return el;
    },

    /**
     * Get child elements. Note this method returns a list of element objects, text nodes are not included. Return empty
     * list if this element has only text.
     * 
     * @return js.dom.EList list of child elements, possible empty.
     */
    getChildren : function () {
        return this._ownerDoc.getEList(this._node.children);
    },

    /**
     * Test for child elements presence. Return true if this element has child elements. Note that text nodes are not
     * counted, so return false if this element has only text.
     * 
     * @return Boolean true only if this element has at least one child element.
     */
    hasChildren : function () {
        return js.dom.Node.firstElementChild(this._node) !== null;
    },

    /**
     * Get first child element. Return first child element but does not consider text nodes. If this element has only
     * text returns null.
     * 
     * @return js.dom.Element first child element or null.
     */
    getFirstChild : function () {
        return this._ownerDoc.getElement(js.dom.Node.firstElementChild(this._node));
    },

    /**
     * Get last child element. Return last child element but does not consider text nodes. If this element has only text
     * returns null.
     * 
     * @return js.dom.Element last child element or null.
     */
    getLastChild : function () {
        return this._ownerDoc.getElement(js.dom.Node.lastElementChild(this._node));
    },

    /**
     * Get previous sibling element. Return previous sibling element but does not count text nodes.
     * 
     * @return js.dom.Element previous sibling element or null.
     */
    getPreviousSibling : function () {
        return this._ownerDoc.getElement(js.dom.Node.previousElementSibling(this._node));
    },

    /**
     * Get next sibling element or null. Return next sibling element but does not count text nodes.
     * 
     * @return js.dom.Element next sibling element or null.
     */
    getNextSibling : function () {
        return this._ownerDoc.getElement(js.dom.Node.nextElementSibling(this._node));
    },

    /**
     * Get lower case tag name. Return this element tag name, also known as node name.
     * 
     * @return String this element tag name.
     */
    getTag : function () {
        return this._node.tagName.toLowerCase();
    },

    /**
     * Set attribute(s). Set one or more attribute(s) values to this element. Arguments are supplied as name/value
     * string pairs. It is the user code responsibility to supply names and values in the proper order. If the number of
     * arguments is odd last name/value pair is ignored, being incomplete. If no name/value pair supplied - arguments
     * count less than 2, this method does nothing.
     * 
     * @param String... nameValuePairs variable numbers of name/value pairs.
     * @return js.dom.Element this object.
     * @assert the number of arguments is even, greater or equals 2.
     */
    setAttr : function () {
        $assert(arguments.length >= 2, "js.dom.Element#setAttr", "Missing attribute name and/or value.");
        $assert(arguments.length % 2 === 0, "js.dom.Element#setAttr", "Odd number of arguments.");
        if (arguments.length > 2) {
            for (var i = 0, l = arguments.length - 1; i < l;) {
                this.setAttr(arguments[i++], arguments[i++]);
            }
        }
        else if (arguments.length === 2) {
            $assert(js.lang.Types.isString(arguments[0]), "js.dom.Element#setAttr", "Attribute name is not a string.");
            $assert(js.lang.Types.isString(arguments[1]), "js.dom.Element#setAttr", "Attribute value is not a string.");
            this._node.setAttribute(arguments[0], arguments[1]);
        }
        return this;
    },

    /**
     * Get attribute value. Return named attribute value as string, possible empty. If attribute with given name does
     * not exist or <code>name</code> argument is undefined, null or empty this method returns null.
     * 
     * @param String name attribute name of which value to retrieve.
     * @return String requested attribute value or null.
     * @assert <code>name</code> argument is not undefined, null or empty.
     */
    getAttr : function (name) {
        $assert(name, "js.dom.Element#getAttr", "Attribute name is undefined, null or empty.");
        if (this._node.attributes.length > 0) {
            var attr = this._node.attributes.getNamedItem(name);
            if (attr !== null) {
                return attr.value;
            }
        }
        return null;
    },

    /**
     * Remove attribute. If named attribute does not exist this method does nothing. If a default value for the removed
     * attribute is defined in the DTD, a new attribute immediately appears with the default value.
     * 
     * @param String name the name of attribute to be removed,
     * @return js.dom.Element this object.
     * @assert <code>name</code> argument is not undefined, null or empty.
     */
    removeAttr : function (name) {
        $assert(name, "js.dom.Element#removeAttr", "Attribute name is undefined, null or empty.");
        if (name) {
            this._node.removeAttribute(name);
        }
        return this;
    },

    /**
     * Test for attribute presence. Return true if this element has an attribute with specified name. This does not
     * necessarily means that attribute should have a value. It can still contains empty strings.
     * 
     * @param String name the name of attribute.
     * @return Boolean true if attribute is present.
     * @assert <code>name</code> argument is not undefined, null or empty.
     */
    hasAttr : function (name) {
        if (this._node.attributes.length === 0) {
            return false;
        }
        $assert(name, "js.dom.Element#hasAttr", "Attribute name is undefined, null or empty.");
        return this._node.attributes.getNamedItem(name) !== null;
    },

    /**
     * Add text. Create a text node and append it at this element children list end. If given text is undefined, null or
     * empty this method does nothing. If text is not a string uses {@link Object#toString} to convert it.
     * 
     * @param String text text to add.
     * @return js.dom.Element this object.
     * @assert <code>text</code> argument is not undefined or null and is a non-empty {@link String}.
     */
    addText : function (text) {
        $assert(text, "js.dom.Element#addText", "Text is undefined, null or empty.");
        if (text) {
            // W3C DOM Document interface mandates string for createTextNode argument
            if (!js.lang.Types.isString(text)) {
                text = text.toString();
            }
            this._node.appendChild(this._ownerDoc._document.createTextNode(text));
        }
        return this;
    },

    /**
     * Set text. Replace this element text with given one. If this element has no text yet create a new text node with
     * given content and append it; if, au contraire, this element has its text scattered among many text nodes replace
     * all of them with a single one and set its text. Be aware this method is a setter; all this element text, if any,
     * will be replaced by given text. If given text is not a string uses {@link Object#toString} to convert it.
     * Finally, if text is undefined, null or empty this method delegates {@link #removeText}.
     * 
     * <p>
     * Note that this method operates only on owned text, child elements text is not affected. So, in below example,
     * emphasized text is not changed.
     * 
     * <pre>Some &lt;em&gt;emphasized&lt;/em&gt; text.</pre>
     * 
     * If in need to handle text with format one can use {@link #setHTML} instead.
     * 
     * @param String text text to set.
     * @return js.dom.Element this element.
     * @assert <code>text</code> argument is not undefined, null or empty.
     */
    setText : function (text) {
        $assert(typeof text !== "undefined" && text !== null && text !== "", "js.dom.Element#setText", "Text argument is undefined, null or empty.");
        if (!(typeof text !== "undefined" && text !== null && text !== "")) {
            return this.removeText();
        }
        if (!js.lang.Types.isString(text)) {
            text = text.toString();
        }

        // W3C DOM Text node interface requires text escaping and this method relies on user agent for that matter.

        // remove all text nodes but the first
        var textNode = this.removeText(true);
        if (textNode == null) {
            this._node.appendChild(this._ownerDoc._document.createTextNode(text));
        }
        else {
            textNode.nodeValue = text;
        }
        return this;
    },

    /**
     * Get text. Return this element direct text but do not include child elements. If this element has no text returns
     * an empty string.
     * 
     * @return String this element text, possible empty.
     */
    getText : function () {
        var text = "";
        var nodelist = this._node.childNodes;
        for (var i = 0; i < nodelist.length; i++) {
            var node = nodelist.item(i);
            if (node.nodeType === Node.TEXT_NODE) {
                text += node.nodeValue;
            }
        }
        return text;
    },

    /**
     * Remove text. Remove this element text; after this method execution {@link #getText} returns an empty string. Note
     * that this method operates only on owned text, child elements text is not touched.
     * 
     * @return js.dom.Element this object.
     */
    removeText : function () {
        // skip first text node, that is, remove all text nodes but first
        // this undocumented flag is for library internal use only
        var first = false, firstTextNode = null;
        if (arguments[0] === true) {
            first = true;
        }

        var nodelist = this._node.childNodes;
        for (var i = 0; i < nodelist.length; ++i) {
            var node = nodelist.item(i);
            if (node.nodeType === Node.TEXT_NODE) {
                if (first) {
                    firstTextNode = node;
                }
                else {
                    this._node.removeChild(node);
                    --i;
                }
                first = false;
            }
        }
        // if used internally by library returns first text node found, may be null
        return arguments[0] === true ? firstTextNode : this;
    },

    /**
     * Add CSS class. This method adds a new CSS class to this element; if class already exists just ignore it. If
     * optional <code>enabled</code> flag is supplied and if is false this method behaves like {@link #removeCssClass}.
     * This is handy indeed when in need to add or remove a CSS class based on an expression value, see below. Of
     * course, in absence of optional argument this method does what his name suggest.
     * 
     * <pre>
     *  // classic approach
     *  if(value < lowWaterMark) {
     *      el.addCssClass("low-water");
     *  }
     *  else {
     *      el.removeCssClass("low-water");
     *  }
     *  
     *  // add CSS class with enabled flag; same result as above verbose solution
     *  el.addCssClass("low-water", value < lowWaterMark);
     * </pre>
     * 
     * @param String cssClass, CSS class to be added,
     * @param Boolean... enabled optional enabled, default to true.
     * @return js.dom.Element this object.
     * @assert <code>cssClass</code> argument is not undefined, null or empty.
     */
    addCssClass : function (cssClass, enabled) {
        $assert(cssClass, "js.dom.Element#addCssClass", "CSS class is undefined, null or empty.");
        if (cssClass) {
            if (typeof enabled === "undefined") {
                enabled = true;
            }
            if (enabled) {
                this._node.classList.add(cssClass);
            }
            else {
                this._node.classList.remove(cssClass);
            }
        }
        return this;
    },

    /**
     * Remove CSS class. This method removes given class from this element. If requested class is missing, null or empty
     * this method does nothing.
     * 
     * @param String cssClass class to be removed.
     * @return js.dom.Element this object.
     * @assert <code>cssClass</code> argument is not undefined, null or empty.
     */
    removeCssClass : function (cssClass) {
        $assert(cssClass, "js.dom.Element#removeCssClass", "CSS class is undefined, null or empty.");
        if (cssClass) {
            this._node.classList.remove(cssClass);
        }
        return this;
    },

    /**
     * Toggle CSS class. This method add requested class if it is not present and remove it if already existing. If
     * required CSS class argument is undefined, null or empty this method does nothing.
     * 
     * @param String cssClass class to be added or removed.
     * @return js.dom.Element this object.
     * @assert <code>cssClass</code> argument is not undefined, null or empty.
     */
    toggleCssClass : function (cssClass) {
        $assert(cssClass, "js.dom.Element#toggleCssClass", "CSS class is undefined, null or empty.");
        if (cssClass) {
            this._node.classList.toggle(cssClass);
        }
        return this;
    },

    /**
     * Test for CSS class presence. This method check if this element possesses specified CSS class. If argument is not
     * supplied, null or empty this method returns false.
     * 
     * @param String cssClass CSS class to be tested.
     * @return Boolean true if this element has specified class.
     * @assert <code>cssClass</code> argument is not undefined, null or empty.
     */
    hasCssClass : function (cssClass) {
        $assert(cssClass, "js.dom.Element#hasCssClass", "CSS class is undefined, null or empty.");
        if (!cssClass) {
            return false;
        }
        return this._node.classList.contains(cssClass);
    },

    // ------------------------------------------------------------------------
    // j(s)-lib extensions to Baby DOM Element interface

    /**
     * Set this element formatted value. The general contract of this method is <em>formatted value setter</em>. What
     * a <code>value</code> means depends on every class; for this one value is considered the element text content,
     * this method actually delegating {@link #setText}. Also note that, usually, value is a primitive but can also be
     * an aggregate as time this class {@link #_format formatter} is able to convert it to a {@link String}. If given
     * value is undefined this method does nothing and if null delegates {@link #removeText}. If this element has no
     * formatter given <code>value</code> is used as it is.
     * 
     * @param Object value primitive or aggregated value suitable for this element.
     * @return js.dom.Element this object pointer.
     * @assert value argument is not undefined, is a primitive or supported by this class formatter and this element has
     *         no child.
     * @see js.dom.Element#getValue
     */
    setValue : function (value) {
        $assert(typeof value !== "undefined", "js.dom.Element#setValue", "Value is undefined.");
        $assert(!this.hasChildren(), "js.dom.Element#setValue", "Unsupported state: this element has children.");

        if (typeof value === "undefined") {
            return this;
        }
        if (value == null) {
            return this.removeText();
        }

        if (this._format !== null) {
            value = this._format.format(value);
        }
        $assert(js.lang.Types.isPrimitive(value), "js.dom.Element#setValue", "Expected primitive but got %s.", value);
        return this.setText(value);
    },

    /**
     * Get this element formatted value. Retrieve this element value as {@link String} but if this class has a
     * {@link #_format formatter} use it to convert string to whatever value type. This method consider as value element
     * text content and use {@link #getText} to get it; of course subclass can change that.
     * 
     * @return Object formatted value.
     * @assert this element has no child.
     * @see js.dom.Element#setValue
     */
    getValue : function () {
        $assert(!this.hasChildren(), "js.dom.Element#getValue", "Unsupported state: this element has children.");
        var v = this.getText();
        return this._format !== null ? this._format.parse(v) : v.length > 0 ? v : null;
    },

    /**
     * Templates engine value setter. This object setter is the primary means for integrating user defined types with
     * templates engine. Templates engine will pass control to this method and do not process any of this element
     * descendants; therefore it is this method responsibility to update user interface. But be warned: to not dare to
     * call $super. It will create a circular dependency because this method internally uses templates engine to
     * {@link js.dom.template.Template#subinject subinject} given object value.
     * <p>
     * This method argument is constrained to aggregated values but subclasses are free to use any value type. Although
     * this method is designed for templates engine integration there is no restriction in using it as general use
     * setter, explicitly invoked by user code.
     * 
     * @param Object value aggregated value, be it {@link Object} or {@link Array}.
     * @return js.dom.Element this object.
     * @assert this method is not called by subclass via $super.
     * @assert given argument is not primitive value and this element has children.
     */
    setObject : function (value) {
        $assert(!arguments.callee.__super_call__, "js.dom.Element#setObject", "$super call on setObject from subclass is not allowed! It creates circular dependencies.");
        $assert(!js.lang.Types.isPrimitive(value), "js.dom.Element#setObject", "Primitive value not supported.");
        $assert(js.lang.Types.isArray(value) || this.hasChildren(), "js.dom.Element#setObject", "Unsupported state: this element has no child.");
        this._ownerDoc._template.subinject(this, value);
        return this;
    },

    /**
     * Add inner HTML. Add given HTML fragment at the end of current existing inner HTML, that is create and append
     * elements denoted by argument. If <code>html</code> argument is undefined, null or empty this method is NOP.
     * 
     * @param String html HTML fragment.
     * @return js.dom.Element this object.
     * @assert HTML fragment is not undefined, null or empty.
     */
    addHTML : function (html) {
        $assert(html, "js.dom.Element#setHTML", "HTML fragment is undefined, null or empty.");
        if (html) {
            var range = this._ownerDoc.getDocument().createRange();
            range.selectNode(this._node);
            var fragment = range.createContextualFragment(html);
            this._node.appendChild(fragment);
        }
        return this;
    },

    /**
     * Set inner HTML. Set this element inner HTML but first remove all children, to ensure properly cleanup. If
     * <code>html</code> argument is undefined, null or empty this method just remove children.
     * 
     * @param String html HTML fragment.
     * @return js.dom.Element this object.
     * @assert HTML fragment is not undefined, null or empty.
     */
    setHTML : function (html) {
        $assert(html, "js.dom.Element#setHTML", "HTML fragment is undefined, null or empty.");
        // ensure all children are properly clean-up before set new HTML content
        this.removeChildren();
        if (html) {
            this._node.innerHTML = html;
        }
        return this;
    },

    /**
     * Get inner HTML. Return this element inner HTML. If this element has no children returns empty string.
     * 
     * @return String this element inner HTML, possible empty.
     */
    getHTML : function () {
        return this._node.innerHTML;
    },

    /**
     * Set focus on this element.
     * 
     * @return js.dom.Element this pointer.
     */
    focus : function () {
        this._node.focus();
        return this;
    },

    /**
     * Add event listener. Attach listener to requested event type. If event type is a custom one delegates
     * {@link js.event.CustomEvents} otherwise it should be a predefined DOM event and uses {@link js.event.DomEvents}
     * to register the listener. Note that custom event is tested first, so if user override a predefined DOM event type
     * custom event has priority.
     * 
     * @param String type DOM or custom event type,
     * @param Function listener event listener to register,
     * @param Object scope listener run-time scope,
     * @param Boolean... capture optional capture flag, default to false.
     * @return js.dom.Element this object.
     * @assert see assertions enforced by {@link js.event.DomEvents#addListener} and
     *         {@link js.event.CustomEvents#addListener}.
     */
    on : function (type, listener, scope, capture) {
        if (typeof this._customEvents !== "undefined" && this._customEvents.hasType(type)) {
            this._customEvents.addListener(type, listener, scope);
            return this;
        }
        if (typeof capture === "undefined") {
            capture = false;
        }
        this._domEvents.addListener(type, listener, scope, capture);
        return this;
    },

    /**
     * Remove event listener. Detach listener from requested event type. If event type is a custom one delegates
     * {@link js.event.CustomEvents} otherwise it should be a predefined DOM event and uses {@link js.event.DomEvents}
     * to actually remove the listener. Note that this method applies the same logic for priority as {@link #on}
     * companion; custom event is tested first.
     * 
     * @param String type DOM or custom event type,
     * @param Function listener event listener to remove,
     * @param Boolean... capture optional capture flag, default to false.
     * @return js.dom.Element this object.
     * @assert see assertions enforced by {@link js.event.DomEvents} and {@link js.event.CustomEvents}.
     */
    un : function (type, listener) {
        if (typeof this._customEvents !== "undefined" && this._customEvents.hasType(type)) {
            this._customEvents.removeListener(type, listener);
            return this;
        }
        if (typeof capture === "undefined") {
            capture = false;
        }
        this._domEvents.removeListener(type, listener, capture);
        return this;
    },

    /**
     * Set user defined data. Associate an object to a key on this node. The object can later be retrieved from this
     * node by calling {@link #getUserData(String...)} with the same key. If key already exists its storage will be
     * overridden.
     * 
     * @param String key key used to identified user defined data.
     * @param Object data user defined data; if null remove existing piece of data.
     * @return Object previous user data or null.
     */
    setUserData : function (key, data) {
        $assert(key, "js.dom.Element#setUserData", "Key is undefined, null or empty.");
        if (!key) {
            return null;
        }
        if (typeof this._userData === "undefined") {
            /**
             * User defined data storage. This is a map of {@link String} keys and {@link Object} values.
             * 
             * @type Object
             */
            this._userData = {};
        }
        var previousData = this._userData[key];
        if (typeof previousData === "undefined") {
            previousData = null;
        }
        if (data == null) {
            delete this._userData[key];
        }
        else {
            this._userData[key] = data;
        }
        return previousData;
    },

    /**
     * Get user defined data. Retrieves the data object associated to a key on a this element. The data object must
     * first have been set to this element by calling {@link #setUserData(String,Object)} with the same key. If optional
     * <code>key</code> is not supplied uses the string <em>value</em>.
     * 
     * @param String... key optional key attached to user defined data, default to <em>value</em>.
     * @return Object used defined data or null.
     */
    getUserData : function (key) {
        if (typeof key === "undefined") {
            key = "value";
        }
        $assert(key, "js.dom.Element#getUserData", "Key is null or empty.");
        if (!key) {
            return null;
        }
        if (typeof this._userData === "undefined") {
            return null;
        }
        var data = this._userData[key];
        return typeof data !== "undefined" ? data : null;
    },

    /**
     * Remove user defined data. Remove user define data associated with given key. Returns user data previously
     * associated with given key or null if there was none.
     * 
     * @param String key key used to identified user defined data.
     * @return Object previous user data or null.
     */
    removeUserData : function (key) {
        $assert(key, "js.dom.Element#removeUserData", "Key is undefined, null or empty.");
        if (!key) {
            return null;
        }
        if (typeof this._userData === "undefined") {
            return null;
        }
        var data = this._userData[key];
        if (typeof data === "undefined") {
            return null;
        }
        delete this._userData[key];
        return data;
    },

    /**
     * Bind element class or format to selected descendants.
     * 
     * @param String selectors comma separated selectors,
     * @param String typeName element class or format name.
     * @return js.dom.Element this object.
     * @assert both arguments are not undefined, null or empty and of proper type.
     */
    bind : function (selectors, typeName) {
        js.dom.Node.bind(this._node, selectors, typeName);
        return this;
    },

    /**
     * Get custom events.
     * 
     * @return js.event.CustomEvents this element custom events.
     */
    getCustomEvents : function () {
        if (typeof this._customEvents === "undefined") {
            /**
             * User defined events. By default are undefined, this custom events are lazy initialized when first
             * accessed via {@link #getCustomEvents} getter.
             * 
             * @type js.event.CustomEvents
             */
            this._customEvents = new js.event.CustomEvents(this);
        }
        return this._customEvents;
    },

    /**
     * Show this element. Remove <em>hidden</em> CSS class, if any present. This method has an optional flag that is
     * tested in order to decide if this element is actually displayed or hidden.
     * 
     * @param Boolean show optional showing flag, default to true.
     * @return js.dom.Element this object.
     */
    show : function (show) {
        if (typeof show === "undefined") {
            show = true;
        }
        return this[(show ? "remove" : "add") + "CssClass"]("hidden");
    },

    /**
     * Hide this element. Add <em>hidden</em> CSS class to this element. This is a convenient method; it does exactly
     * the same as {@link #show} with false argument.
     * 
     * @return js.dom.Element this object.
     */
    hide : function () {
        return this.addCssClass("hidden");
    },

    /**
     * Cleanup all child elements. This cleaner deletes all children nodes backward references, event handlers and user
     * defined data, if any. There are rumors DOM and JS engine have different garbage collectors and that is possible
     * to generate memory leak if don"t explicitly delete references from DOM to JS. I don"t know if true but I don"t
     * want to take that chance.
     * <p>
     * There is a guard argument used internally for recursive call counting. It is not used when invoke this method
     * from this class; it has value only when this method invokes itself.
     * 
     * @param Node node native node,
     * @param Number... guard optional, internal used recursivity guard.
     */
    _clean : function (node, guard) {
        if (typeof guard === "undefined") {
            guard = 0;
        }
        $assert(guard < 8, "js.dom.Element#_clean", "Too many recursive iterations.");
        if (guard === 8) {
            return;
        }
        var it = new js.dom.Node.Iterator(node);
        while (it.hasNext()) {
            guard++;
            this._clean(it.next(), guard);
            guard--;
        }

        var el = js.dom.Node.getElement(node);
        if (el !== null) {
            delete el._ownerDoc;
            delete el._node;
            delete el.style;
            if (el._format !== null) {
                delete el._format;
            }
            el._domEvents.finalize();
            delete el._domEvents;
            if (typeof el._customEvents !== "undefined") {
                el._customEvents.finalize();
                delete el._customEvents;
            }
            if (typeof el._userData !== "undefined") {
                for ( var p in el._userData) {
                    delete el._userData[p];
                }
                delete el._userData;
            }
            js.dom.Node.removeBackRef(node);
        }
    },

    /**
     * Return the path through document tree from root to current element.
     * 
     * @return String this element trace.
     */
    trace : function () {
        var sb = "";
        var el = this, index;
        while (el != null) {
            index = el._index();
            if (index != -1) {
                sb = "[" + index + "]" + sb;
            }
            sb = "/" + el.getTag() + sb;
            el = el.getParent();
        }
        return sb;
    },

    /**
     * Returns this element sibling index. Traverse all siblings and count only those with the same tag as this element.
     * Returns -1 if this element has no parent or has no sibling of the same tag.
     * 
     * @return Number this element index or -1.
     */
    _index : function () {
        var parent = this.getParent();
        if (parent == null) {
            return -1;
        }
        var n = parent._node.firstChild;
        var index = 0, twinsCount = 0, indexFound = false;
        while (n != null) {
            if (n === this._node) {
                indexFound = true;
            }
            if (n.nodeType === Node.ELEMENT_NODE && n.nodeName === this._node.nodeName) {
                ++twinsCount;
                if (!indexFound) {
                    ++index;
                }
            }
            n = n.nextSibling;
        }
        return twinsCount > 1 ? index : -1;
    },

    /**
     * Return unique hash code string value usable for hash maps. Note that hash code has page session life and is not
     * usable to persist objects between sessions.
     * 
     * @return String unique hash code.
     */
    hashCode : function () {
        return this._hashCode;
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.dom.Element";
    }
};
// this $extends call may seem not neccesarylly but without it js.dom.Element.prototype.__ctor__ hidden property is not
// initialized and instance constructor retrieval like e.__ctor__ may be undefined; as a direct concequence
// js.util.Types#isElement can't recognize instances of js.dom.Element
$extends(js.dom.Element, Object);

/**
 * Alias for {@link #getByCss}.
 * 
 * @type js.dom.Element
 */
js.dom.Element.prototype.$E = js.dom.Element.prototype.getByCss;

/**
 * Alias for {@link #findByCss}.
 * 
 * @type js.dom.EList
 */
js.dom.Element.prototype.$L = js.dom.Element.prototype.findByCss;

$legacy(js.ua.Engine.TRIDENT, function () {
    js.dom.Element.prototype.clone = function (deep) {
        $assert(typeof deep === "undefined" || js.lang.Types.isBoolean(deep), "js.dom.Element#clone", "Deep flag is not boolean.");
        var clone = this._node.cloneNode(deep === true);
        this._ieCloneWorkaround(this, clone, 0);
        return this._ownerDoc.getElement(clone);
    };

    /**
     * IE cloning workaround. IE does copy events listeners and augmented values on cloning so we need to traverse all
     * clone tree and remove listeners and back-references.
     * 
     * @param js.dom.Element originalElement original element, source of clone operations,
     * @param Node cloneNode native {@link Node}, resulted from original element cloning,
     * @param Number guard recursive iteration guard.
     */
    js.dom.Element.prototype._ieCloneWorkaround = function (originalElement, cloneNode, guard) {
        $assert(guard < 8, "js.dom.Element#_ieCloneWorkaround", "Too many recursive iterations.");
        if (guard === 8) {
            return;
        }

        // parallel traversal of original source elements and cloned nodes trees
        // uses cloned nodes as loop condition to cope with shallow cloning

        var originalElementsIt = originalElement.getChildren().it();
        var cloneNodesIt = new js.dom.Node.Iterator(cloneNode);
        while (cloneNodesIt.hasNext()) {
            ++guard;
            this._ieCloneWorkaround(originalElementsIt.next(), cloneNodesIt.next(), guard);
            --guard;
        }

        // detach events copied by cloning operation
        originalElement._domEvents.getHandlers().forEach(function (handler) {
            cloneNode.detachEvent("on" + handler.type, handler.domEventListener);
        });

        // IE copy augmented values when cloning so we need to delete back-references manually
        js.dom.Node.removeBackRef(cloneNode);
    };

    js.dom.Element.prototype.addHTML = function (html) {
        $assert(html, "js.dom.Element#setHTML", "HTML fragment is undefined, null or empty.");
        if (html) {
            this._node.insertAdjacentHTML("beforeEnd", html);
        }
        return this;
    };

    js.dom.Element.prototype.getChildren = function () {
        var nodeList = this._node.children;
        if (typeof nodeList === "undefined") {
            nodeList = new js.dom.NodeList();
        }
        return this._ownerDoc.getEList(nodeList);
    };
});

/**
 * IE and WebKit for mobiles have no support for class list.
 */
$legacy(js.ua.Engine.TRIDENT || js.ua.Engine.MOBILE_WEBKIT, function () {
    js.dom.Element.prototype.addCssClass = function (cssClass, enabled) {
        $assert(cssClass, "js.dom.Element#addCssClass", "CSS class is undefined, null or empty.");
        if (cssClass) {
            if (typeof enabled === "undefined") {
                enabled = true;
            }
            if (!enabled) {
                return this.removeCssClass(cssClass);
            }
            cssClass = js.util.Strings.trim(cssClass);
            if (!this.hasCssClass(cssClass)) {
                if (this._node.className.length === 0) {
                    this._node.className = cssClass;
                }
                else {
                    this._node.className = [ this._node.className, cssClass ].join(" ");
                }
            }
        }
        return this;
    };

    js.dom.Element.prototype.removeCssClass = function (cssClass) {
        $assert(cssClass, "js.dom.Element#removeCssClass", "CSS class is undefined, null or empty.");
        if (cssClass) {
            var re = new RegExp("(?:^|\\s+)" + js.util.Strings.escapeRegExp(cssClass) + "(?:\\s+|$)", "g");
            if (re.test(this._node.className)) {
                this._node.className = js.util.Strings.trim(this._node.className.replace(re, " "));
            }
        }
        return this;
    };

    js.dom.Element.prototype.toggleCssClass = function (cssClass) {
        $assert(cssClass, "js.dom.Element#toggleCssClass", "CSS class is undefined, null or empty.");
        if (cssClass) {
            this[this.hasCssClass(cssClass) ? "removeCssClass" : "addCssClass"](cssClass);
        }
        return this;
    };

    js.dom.Element.prototype.hasCssClass = function (cssClass) {
        $assert(cssClass, "js.dom.Element#hasCssClass", "CSS class is undefined, null or empty.");
        if (!cssClass) {
            return false;
        }
        var re = new RegExp("(?:^|\\s+)" + js.util.Strings.escapeRegExp(cssClass) + "(?:\\s+|$)", "g");
        return re.test(this._node.className);
    };
});
$package('js.dom');

/**
 * Anchor element. This simple anchor wrapper only adds specialized setter and getter
 * for hyper-reference taking care not to set empty values.
 *
 * @author Iulian Rotaru
 * @since 1.0
 * @constructor
 * Construct anchor element instance.
 *
 *
 * @param js.dom.Document ownerDoc, element owner document,
 * @param Node node, native {@link Node} instance.
 * @assert <em>ownerDoc</em> argument is not undefined or null and is instance of
 * {@link js.dom.Document}. Also <em>node</em> argument should be of <em>a</em> type.
 */
js.dom.Anchor = function(ownerDoc, node) {
    $assert(this instanceof js.dom.Anchor, 'js.dom.Anchor#Anchor', 'Invoked as function.');
    this.$super(ownerDoc, node);
    $assert(node.nodeName.toLowerCase() === 'a', 'js.dom.Anchor#Anchor', 'Node is not an anchor.');
};

js.dom.Anchor.prototype =
{
    /**
     * Set link hyper-reference. Set this link HREF attribute but takes care about
     * empty values. If argument is undefined, null or empty this setter does nothing.
     *
     * @param String href hyperlink reference.
     * @return js.dom.Anchor this object.
     * @assert <em>href</em> argument is not undefined, null or empty.
     */
    setHref: function(href) {
        $assert(href, 'js.dom.Anchor#setHref', 'HREF is undefined, null or empty.');
        if (href) {
            this.setAttr('href', href);
        }
        return this;
    },

    /**
     * Get hyper-reference.
     *
     * @return String this anchor hyper-reference.
     */
    getHref: function() {
        return this.getAttr('href');
    },

    /**
     * Returns a string representation of the object.
     *
     * @return String object string representation.
     */
    toString: function() {
        return 'js.dom.Anchor';
    }
};
$extends(js.dom.Anchor, js.dom.Element);
$package('js.dom');

/**
 * Document object builder. This utility class supplies factory methods for documents creation, parsing from string and
 * asynchronous loading from URL. Anyway, cross-domain security is applied so one can load documents only from current
 * domain.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 */
js.dom.Builder = {
	/**
	 * Create XML document. This method creates a new empty XML document and its root element. If given root tag is
	 * undefined, null or empty this method behavior is not defined.
	 * 
	 * @param String root document root tag.
	 * @return js.dom.Document newly created document object.
	 * @assert <em>root</em> argument is not undefined, null or empty.
	 */
	createXML : function(root) {
		$assert(root, 'js.dom.Builder#createXML', 'Root is undefined, null or empty.');
		return new js.dom.Document(window.document.implementation.createDocument('', root, null));
	},

	/**
	 * Parse XML string. Return a new document created by parsing given XML string. XML declaration is optional. If
	 * given XML string is undefined, null or empty this method behavior is not defined.
	 * 
	 * @param String xml XML content represented as a string.
	 * @return js.dom.Document newly created document object.
	 * @throws js.dom.DomException on missing DOM parser support or on parsing error.
	 * @assert <em>xml</em> argument is not undefined, null or empty.
	 */
	parseXML : function(xml) {
		$assert(xml, 'js.dom.Builder#parseXML', 'XML is undefined, null or empty.');
		return this._parse(xml, 'text/xml');
	},

	/**
	 * Parse HTML string. Return a new document created by parsing given HTML string. HTML DOCTYPE is optional. If given
	 * HTML string is undefined, null or empty this method behavior is not defined.
	 * 
	 * <p>
	 * Please note that DOM Parser is actually a XML parser and expect well formed source even if HTML. In fact content
	 * type used to parse HTML is <em>application/xhtml+xml</em> so this method may be better named
	 * <em>parseXHTML</em> but decided to stick with names from Baby DOM interface.
	 * 
	 * @param String html HTML content represented as a string.
	 * @return js.dom.Document newly created document object.
	 * @throws js.dom.DomException on missing DOM parser support or on parsing error.
	 * @assert <em>html</em> argument is not undefined, null or empty.
	 */
	parseHTML : function(html) {
		$assert(html, 'js.dom.Builder#parseHTML', 'HTML is undefined, null or empty.');
		return this._parse(html, 'application/xhtml+xml');
	},

	/**
	 * Helper for string parsing. Parse source string and return newly created document. Source should be well formed,
	 * even if HTML or exception will be thrown.
	 * 
	 * @param String source XML or HTML content source,
	 * @param String contentType content type.
	 * @return js.dom.Document newly created document object.
	 * @throws js.dom.DomException on missing XML parser support or on parsing error.
	 * @assert <em>source</em> argument is not undefined, null or empty.
	 */
	_parse : function(source, contentType) {
		$assert(source, 'js.dom.Builder#_parse', 'Source is undefined, null or empty.');
		var document = new DOMParser().parseFromString(source, contentType);
		if (typeof document === 'undefined') {
			throw new js.dom.DomException('Missing DOM parser support.');
		}
		var root = document.documentElement;
		// it seems there are browsers correctly using root node as parser error signal
		// and others using first child of root node
		// surprinsiglly chrome is in the second category
		if (root.nodeName === 'parsererror' || (root.firstChild && root.firstChild.nodeName === 'parsererror')) {
			throw new js.dom.DomException('Parse error.');
		}
		return new js.dom.Document(document);
	},

	/**
	 * Load XML document. Uses {@link #_load load helper} to perform XML loading.
	 * 
	 * @param String url source URL,
	 * @param Function callback call on document loaded,
	 * @param Object scope optional callback execution scope, default to global.
	 * @note cross-domain security is applied so one can load XML documents only from current domain.
	 */
	loadXML : function(url, callback, scope) {
		this._load(url, 'text/xml', callback, scope);
	},

	/**
	 * Load HTML document. Uses {@link #_load load helper} to perform HTML loading.
	 * 
	 * @param String url source URL,
	 * @param Function callback call on document loaded,
	 * @param Object scope optional callback execution scope, default to global.
	 * @note cross-domain security is applied so one can load HTML documents only from current domain.
	 */
	loadHTML : function(url, callback, scope) {
		this._load(url, 'application/xhtml+xml', callback, scope);
	},

	/**
	 * Helper for document loading. This method creates a new empty document and load asynchronously its content from
	 * specified URL, invoking callback with loaded document as argument, when ready. Callback signature should be
	 * 
	 * <pre>void callback(js.dom.Document)</pre>
	 * 
	 * If given URL is undefined, null or empty or callback is null or not a function this method behavior is not
	 * defined.
	 * 
	 * @param String url source URL,
	 * @param String contentType content type,
	 * @param Function callback call on document loaded,
	 * @param Object scope optional callback execution scope, default to global.
	 * @assert <em>url</em> argument is not undefined, null or empty and denote a hyper-reference that is not
	 *         cross-domain. Also <em>callback</em> should be not null and of type {@link Function}.
	 * @note cross-domain security is applied so one can load documents only from current domain.
	 */
	_load : function(url, contentType, callback, scope) {
		$assert(url, 'js.dom.Builder#_load', 'URL is undefined, null or empty.');
		$assert(js.lang.Types.isFunction(callback), 'js.dom.Builder#_load', 'Callback is not a function.');
		$assert(this._pageDomain === js.net.URL.getHost(url), 'js.dom.Builder#_load', 'Cross-domain URL.');
		if (!url || !js.lang.Types.isFunction(callback)) {
			return;
		}

		var xhr = new js.net.XHR();
		xhr.on('load', callback, scope);
		xhr.open('GET', url);
		xhr.send();
	},

	/**
	 * Returns a string representation of the object.
	 * 
	 * @return String object string representation.
	 */
	toString : function() {
		return 'js.dom.Builder';
	}
};

/**
 * Builder static initialization. Initialize current page domain used for cross-domain check.
 */
$static(function() {
	js.dom.Builder._pageDomain = js.net.URL.getHost(window.location.toString());
});

/**
 * IE has its own way to create and parse XML documents and to handle parssing errors.
 */
$legacy(js.ua.Engine.TRIDENT, function() {
	js.dom.Builder.createXML = function(root) {
		var doc = new ActiveXObject('MSXML2.DOMDocument');
		doc.async = false;
		doc.loadXML('<' + root + '/>');
		return new js.dom.Document(doc);
	};

	js.dom.Builder._parse = function(source, contentType) {
		$assert(source, 'js.dom.Builder#_parse', 'Source is undefined, null or empty.');
		var doc = new ActiveXObject('MSXML2.DOMDocument');
		doc.async = false;
		doc.loadXML(source);
		if (typeof doc === 'undefined') {
			throw new js.dom.DomException('js.dom.Builder#_parse', 'Missing DOM parser support.');
		}
		if (Number(doc.parseError.errorCode) !== 0) {
			throw new js.dom.DomException('js.dom.Builder#_parse', 'Parse error.');
		}
		return new js.dom.Document(doc);
	};
});
$package("js.dom");

/**
 * Generic user input control. This interface is implemented by all standard and user defined controls.
 * 
 * @author Iulian Rotaru
 * @since 1.3
 */
js.dom.ControlInterface = {
    /**
     * Get this control name, both standard and user defined are supported. This getter supports both standard controls
     * using <code>name</code> attribute or user defined controls that use <code>data-name</code>, in this order.
     * <p>
     * It is not legal to have both <code>name</code> and <code>data-name</code> attributes or neither; assertion is
     * thrown. If assertions are disabled returns null if none or value of <code>name</code> attribute if both are
     * present.
     * 
     * @return String this control name.
     * @assert this control has no both <code>name</code> and <code>data-name</code> attributes.
     */
    getName : function () {
    },

    /**
     * Set this control value. If this control has a format class uses it to convert given value into a string suitable
     * for user interface. If has multiple values - as returned by {@link isMultiple()}, <code>value</code> argument
     * should be an array; concatenates all array items using comma as separator applying formatter, if present, for
     * every item. If given value is null this method clear control value.
     * <p>
     * User defined control may override this method. For example a geographical map will move the mark to newly address
     * value.
     * <p>
     * It seems there are user agents that do not update user interface when an element become visible after
     * <code>display:none</code>. As a consequence set values may not be reflected on user interface. This library
     * recommendation is to ensure control is visible before using this setter.
     * 
     * @param Object value primitive value or array if this control supports multiple values.
     * @return js.dom.ControlInterface this object.
     */
    setValue : function (value) {
    },

    /**
     * Get this control value. Returns this control formatted value or null if no user input at all. If this control has
     * a format class uses it to parse the control value returning the resulted object. If no, control returns value as
     * string or null if empty.
     * <p>
     * If control has multiple values, split node raw value using comma as separator and returns values as {@link Array}.
     * If this control has a format class apply parse method to every item from array. If value is empty returns empty
     * array.
     * 
     * @return Object this element value, null or empty array.
     */
    getValue : function () {
    },

    /**
     * Reset this control value to initial state. Try to reload control value from default value attribute. If no
     * default value attribute found set this control value to empty. Also ensure <em>invalid</em> state is
     * cleaned-up.
     * 
     * @return js.dom.ControlInterface this object.
     */
    reset : function () {
    },

    /**
     * Check this control is valid and update <em>validity</em> state accordingly. A control is valid if it has a non
     * empty raw value; if this control has formatter, validity check is delegated to {@link js.format.Format#test}
     * method. Anyway, control is always considered valid if is optional and its raw value is empty.
     * <p>
     * This predicate has side effects: it updates control <em>validity</em> state before returning.
     * 
     * @return Boolean true if this control is valid.
     */
    isValid : function () {
    },

    /**
     * Set focus on this control and clean-up <em>validity</em> state, that is, reset to <code>valid</code>.
     * 
     * @return js.dom.ControlInterface this object.
     */
    focus : function () {
    },

    /**
     * Test if this control has multiple values.
     * 
     * @return Boolean true if this control has multiple values.
     */
    isMultiple : function () {
    },

    /**
     * Iterate this control multiple items. A control may support <code>multiple</code> comma separated values; for
     * example a list of email addresses separated by comma or multiple files selected from operating system dialog.
     * This iterator allows for these values traversal, one by one, in sequence.
     * <p>
     * Callback is invoked with a single argument, that is an anonymous object with <code>name</code>,
     * <code>value</code> public properties.
     * 
     * <pre>
     *  void callback(Item);
     *  Item {
     *      name,
     *      value
     *  };
     * </pre>
     * 
     * <p>
     * If this control does not have <code>multiple</code> values <code>callback</code> is invoked once with this
     * control name and value.
     * 
     * @param Function callback callback function to be executed for every item,
     * @param Object... scope optional callback runtime scope, default to global scope.
     */
    forEachItem : function (callback, scope) {
    }
};
$package("js.dom");

/**
 * Standard controls hierarchy root and base class for user defined controls. This class is a generic form control;
 * there are couple specializations supplied by this library like {@link FileInput} or {@link Checkbox}.
 * <p>
 * This class is also the base class for user defined controls. A user defined control is a generic block element, most
 * likely <code>div</code> that has <code>data-name</code> attribute. An example would be a geographical map used to
 * select localities. The value of such control would be locality name; on user interface locality is represented by
 * maps mark. If multiple is supported multiple marks are displayed and value is an {@link Array} of localities.
 * <p>
 * There are private low level access methods that subclass may override in order to supply specific functionalities. In
 * most cases subclass should not need to override other public, high level, methods. Here is the list:
 * <ul>
 * <li>{@link #_setValue(String)} - set this control raw value,
 * <li>{@link #_getValue()} - return control raw value,
 * <li>{@link #_getDefaultValue()} - return control default value or empty string,
 * <li>{@link #_clean()} - clean this control value,
 * <li>{@link #_focus()} - set focus on this control.
 * </ul>
 * <p>
 * A control has two CSS class marks: {@link #CSS_OPTIONAL} and {@link #CSS_INVALID}. By default, an empty control is
 * invalid; anyway if marked <code>optional</code> empty control is considered valid. A control becomes
 * <code>invalid</code> if {@link #isValid()} said so. On user interface it is marked using CSS styles, perhaps with a
 * red border. Please note that {@link #reset()} and {@link #focus()} methods clean-up <code>invalid</code> state.
 * <p>
 * There are two formatted value accessors: {@link #setValue(Object)}, respective {@link #getValue()}. If control has
 * a {@link js.format.Format} instance configured, it is delegated to pre/post process raw value control. If no
 * formatter, value should be convertible to {@link String}. Multiple values support is enabled if this control has an
 * attribute <code>multiple</code>. Subclass may override {@link #isMultiple()} to enable multiple values based on
 * specific conditions. If multiple values is enabled value accessors uses {@link Array} as value.
 * <p>
 * Finally, for multiple values traversal, control class provides items iterator - see
 * {@link #forEachItem(Function, Object...)}. It can be used in conjunction with {@link js.dom.ControlsIterable} to
 * uniformly traverse all values from a {@link js.dom.Form}. Control <code>forEachItem</code> method has consistent
 * behavior for both single and multiple values. If single value it invokes callback function only once.
 * 
 * <pre>
 *  var iterable = new js.dom.ControlsIterable(form);
 *  iterable.forEach(function (control) {
 *      control.forEachItem(function (item) {
 *          // do something with item.name and item.value
 *      }, this);
 *  });
 * </pre>
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * @constructor Construct generic control instance.
 * 
 * @param js.dom.Document ownerDoc element owner document,
 * @param Node node native node instance.
 * @assert assertions imposed by {@link js.dom.Element#Element(js.dom.Document, Node)}.
 */
js.dom.Control = function (ownerDoc, node) {
    $assert(this instanceof js.dom.Control, "js.dom.Control#Control", "Invoked as function.");
    this.$super(ownerDoc, node);
};

js.dom.Control.prototype = {
    /**
     * Mark CSS class to identify optional control.
     * 
     * @type String
     */
    CSS_OPTIONAL : "optional",

    /**
     * Mark CSS class to identify invalid control.
     * 
     * @type String
     */
    CSS_INVALID : "invalid",

    /**
     * Get this control name - both standard and user defined controls are supported. This getter supports both standard
     * controls using <code>name</code> attribute or user defined controls that use <code>data-name</code>, in this
     * order.
     * <p>
     * It is not legal to have both <code>name</code> and <code>data-name</code> attributes or neither; assertion is
     * thrown. If assertions are disabled returns null if none or value of <code>name</code> attribute if both are
     * present.
     * 
     * @return String this control name.
     * @assert this control has not both <code>name</code> and <code>data-name</code> attributes but still has one
     *         of them.
     */
    getName : function () {
        var name = this.getAttr("name");
        if (name == null) {
            name = this.getAttr("data-name");
        }
        else {
            $assert(!this._node.hasAttribute("data-name"), "js.dom.Control#getName", "Both <name> and <data-name> attributes present on control |%s|.", this);
        }
        $assert(name !== null, "js.dom.Control#getName", "Control |%s| has no name.", this);
        return name;
    },

    /**
     * Set this control formatted value. If this control has a format class uses it to convert given value into a string
     * suitable for user interface. If has multiple values - as returned by {@link isMultiple()}, <code>value</code>
     * argument should be an array; concatenates all array items using comma as separator applying formatter, if
     * present, for every item. If given value is null this method clear control value.
     * <p>
     * User defined control may override this method. For example a geographical map will move the mark to newly address
     * value.
     * <p>
     * It seems there are user agents that do not update user interface when an element become visible after
     * <code>display:none</code>. As a consequence set values may not be reflected on user interface. This library
     * recommendation is to ensure control is visible before using this setter.
     * 
     * @param Object value primitive value or array if this control supports multiple values.
     * @return js.dom.Control this object.
     * @assert <code>value</code> argument is not undefined or null and is of proper type and this control is visible.
     */
    setValue : function (value) {
        $assert(typeof value !== "undefined", "js.dom.Control#setValue", "Value is undefined.");
        if (typeof value === "undefined") {
            return this;
        }

        $assert(this.getAttr("type") === "hidden" || this.style.get("display") !== "none", "js.dom.Control#setValue", "Display is none.");
        if (value == null) {
            return this._clean();
        }

        if (!this.isMultiple()) {
            if (this._format !== null) {
                value = this._format.format(value);
            }
            $assert(js.lang.Types.isPrimitive(value), "js.dom.Control#setValue", "Expected primitive but got |%s|.", value);
            if (!js.lang.Types.isString(value)) {
                value = value.toString();
            }
        }
        else {
            $assert(js.lang.Types.isArray(value), "js.dom.Control#setValue", "Mutiple values control expected array but got |%s|.", value);
            if (value.length === 0) {
                return this._clean();
            }
            // here value is an array
            var array = value;
            value = "";
            for ( var i = 0; i < array.length; ++i) {
                if (i > 0) {
                    value += ',';
                }
                value += (this._format !== null ? this._format.format(array[i]) : array[i].toString());
            }
        }
        return this._setValue(value);
    },

    /**
     * Get this control formatted value. Returns this control formatted value or null if no user input at all. If this
     * control has a format class uses it to parse the control value returning the resulted object. If no, control
     * returns value as string or null if empty.
     * <p>
     * If control has multiple values, split node raw value using comma as separator and returns values as {@link Array}.
     * If this control has a format class apply parse method to every item from array. If value is empty returns empty
     * array.
     * 
     * @return Object this element value, null or empty array.
     */
    getValue : function () {
        var value = this._getValue();
        if (!this.isMultiple()) {
            return this._format !== null ? this._format.parse(value) : value.length > 0 ? value : null;
        }

        // if multiple values supported and this control is empty returns an empty array
        if (!value) {
            return [];
        }

        var values = value.split(",");
        for ( var i = 0; i < values.length; ++i) {
            values[i] = values[i].trim();
            if (this._format !== null) {
                values[i] = this._format.parse(values[i]);
            }
        }
        return values;
    },

    /**
     * Reset this control value to initial state. Try to reload control value from default value attribute. If no
     * default value attribute found set this control value to empty. Also ensure <em>validity</em> state is
     * cleaned-up by removing {@link #CSS_INVALID} CSS class.
     * 
     * @return js.dom.Control this object.
     */
    reset : function () {
        this.removeCssClass(this.CSS_INVALID);
        this._node.value = this._getDefaultValue();
        return this;
    },

    /**
     * Check this control is valid and update <em>validity</em> state accordingly. A control is valid if it has a non
     * empty raw value; if this control has formatter, validity check is delegated to {@link js.format.Format#test}
     * method. Anyway, control is always considered valid if it has {@link CSS_OPTIONAL} CSS class and its raw value is
     * empty.
     * <p>
     * This predicate has side effects: it updates control <em>validity</em> state. Before returning, this predicate
     * takes care to remove/add {@link #CSS_INVALID} CSS class if this control is valid, respective not valid.
     * 
     * @return Boolean true if this control is valid.
     */
    isValid : function () {
        var _this = this; // create closure for this control instance
        function valid (valid) {
            _this.addCssClass(_this.CSS_INVALID, !valid);
            return valid;
        }

        var value = this._getValue(), valid;
        if (this.hasCssClass(this.CSS_OPTIONAL) && !value) {
            // an optional and empty control is always valid
            return valid(true);
        }

        // here value can still be empty
        if (this._format !== null) {
            // if have formatter class delegates its test predicate
            return valid(this._format.test(value));
        }

        // if no formatter class a control is valid if its value is not empty
        return valid(Boolean(value));
    },

    /**
     * Set focus on this control and clean-up <em>validity</em> state, that is, reset to <code>valid</code>. Beside
     * moving focus on this control remove {@link #CSS_INVALID} CSS class to ensure a clean <em>validity</em> state.
     * 
     * @return js.dom.Control this object.
     */
    focus : function () {
        this.removeCssClass(this.CSS_INVALID);
        return this._focus();
    },

    /**
     * Test if this control has multiple values.
     * 
     * @return Boolean true if this control has multiple values.
     */
    isMultiple : function () {
        return this._node.hasAttribute("multiple") || this._node.hasAttribute("data-multiple");
    },

    /**
     * Iterate this control multiple items. A control may support <code>multiple</code> comma separated values; for
     * example a list of email addresses separated by comma or multiple files selected from operating system dialog.
     * This iterator allows for these values traversal, one by one, in sequence.
     * <p>
     * Callback is invoked with a single argument, that is an anonymous object with <code>name</code>,
     * <code>value</code> public properties.
     * 
     * <pre>
     *  void callback(Item);
     *  Item {
     *      name,
     *      value
     *  };
     * </pre>
     * 
     * <p>
     * If this control does not have <code>multiple</code> values <code>callback</code> is invoked once with this
     * control name and value.
     * 
     * @param Function callback callback function to be executed for every item,
     * @param Object... scope optional callback runtime scope, default to global scope.
     * @assert <code>callback</code> is a {@link Function} and <code>scope</code> is an {@link Object}, if present.
     */
    forEachItem : function (callback, scope) {
        $assert(js.lang.Types.isFunction(callback), "js.dom.Control#forEachItem", "Callback argument is not a function.");
        $assert(typeof scope === "undefined" || js.lang.Types.isStrictObject(scope), "js.dom.Control#forEachItem", "Scope argument is not an object.");

        if (!this.isMultiple()) {
            callback.call(scope || window, {
                name : this.getName(),
                value : this.getValue()
            });
            return;
        }

        var items = this._getValue().split(",");
        for ( var i = 0; i < items.length; ++i) {
            callback.call(scope || window, {
                name : this.getName() + "." + i,
                value : this._format !== null ? this._format.parse(items[i].trim()) : items[i].trim()
            });
        }
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.dom.Control";
    },

    // -----------------------------------------------------
    // protected low level methods that should be overridden by user defined controls

    /**
     * Set this control raw value.
     * 
     * @param String value raw value.
     * @return js.dom.Control this object.
     */
    _setValue : function (value) {
        this._node.value = value;
        return this;
    },

    /**
     * Return control raw value.
     * 
     * @return String raw value.
     */
    _getValue : function () {
        return this._node.value;
    },

    /**
     * Return control default value or empty string.
     * 
     * @return String default value or empty string.
     */
    _getDefaultValue : function () {
        return this._node.defaultValue ? this._node.defaultValue : "";
    },

    /**
     * Clean this control value.
     * 
     * @return js.dom.Control this object.
     */
    _clean : function () {
        this._node.value = "";
        return this;
    },

    /**
     * Set focus on this control.
     * 
     * @return js.dom.Control this object.
     */
    _focus : function () {
        this._node.focus();
        return this;
    }
};
$extends(js.dom.Control, js.dom.Element);
$implements(js.dom.Control, js.dom.ControlInterface);
$package('js.dom');

/**
 * Checkbox input. Form control that allows for one or many options to be selected.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * @constructor Construct checkbox instance.
 * 
 * @param js.dom.Document ownerDoc element owner document,
 * @param Node node native {@link Node} instance.
 * @assert <em>ownerDoc</em> argument is not undefined or null and is instance of {@link js.dom.Document} and
 *         <em>node</em> is an input of type checkbox.
 */
js.dom.Checkbox = function(ownerDoc, node) {
	$assert(this instanceof js.dom.Checkbox, 'js.dom.Checkbox#Checkbox', 'Invoked as function.');
	this.$super(ownerDoc, node);
	$assert(node.nodeName.toLowerCase() === 'input', 'js.dom.Checkbox#Checkbox', 'Node is not an input.');
	// $assert(node.getAttribute('type') === 'checkbox', 'js.dom.Checkbox#Checkbox', 'Node is not a checkbox.');
};

js.dom.Checkbox.prototype = {
	/**
	 * Set checked state. Override {@link js.dom.Control#setValue}.
	 * 
	 * @param Boolean checked newly value to set.
	 * @return js.dom.Checkbox this pointer.
	 */
	setValue : function(checked) {
		this._node.checked = checked;
		return this;
	},

	/**
	 * Check this checkbox. After this method execution {@link #checked} returns true.
	 * 
	 * @return js.dom.Checkbox this object.
	 */
	check : function() {
		this._node.checked = true;
		return this;
	},

	/**
	 * Uncheck this checkbox. After this method execution {@link #checked} returns false.
	 * 
	 * @return js.dom.Checkbox this object.
	 */
	uncheck : function() {
		this._node.checked = false;
		return this;
	},

	/**
	 * Test if this checkbox is selected. Returns true if this checkbox is selected or false otherwise.
	 * 
	 * @return Boolean this checkbox state.
	 */
	checked : function() {
		return this._node.checked;
	},

	/**
	 * Override control validation. Simply returns true since a checkbox is always valid.
	 * 
	 * @return Boolean always returns true.
	 */
	isValid : function() {
		return true;
	},

	/**
	 * Override control empty test. A checkbox is always considered empty so that form validation logic force it to
	 * valid if checkbox flagged as optional.
	 * 
	 * @return Boolean always returns true.
	 */
	isEmpty : function() {
		return true;
	},

	/**
	 * Returns a string representation of the object.
	 * 
	 * @return String object string representation.
	 */
	toString : function() {
		return 'js.dom.Checkbox';
	}
};
$extends(js.dom.Checkbox, js.dom.Control);
$package("js.dom");

/**
 * Iterate over an ordered collection of named controls. This class scan in depth-first order the descendants tree of a
 * given controls container and invoke a callback function for every {@link js.dom.Control} found. Descendants tree is
 * arbitrary large.
 * <p>
 * Please note that from this class perspective an {@link js.dom.Element} is considered control if has one of
 * <code>name</code> or <code>data-name</code> attributes.
 * 
 * @author Iulian Rotaru
 * @since 1.8
 * 
 * @constructor Construct controls iterable instance.
 * @param js.dom.Element controlsContainer controls container.
 */
js.dom.ControlsIterable = function (controlsContainer) {
    $assert(js.lang.Types.isElement(controlsContainer), "js.dom.ControlsIterable#ControlsIterable", "Controls container parameter is not a document element.");

    /**
     * Owner document for this controls collection.
     * 
     * @type js.dom.Document
     */
    this._ownerDoc = controlsContainer.getOwnerDoc();

    /**
     * Controls collection root native node is from where scanning starts.
     * 
     * @type Node
     */
    this._rootNode = controlsContainer.getNode();
};

js.dom.ControlsIterable.prototype = {
    /**
     * Execute callback function for each control but do not include hidden. Uses
     * {@link #_scan(Node, Boolean, Function, Object)} method to scan root node descendants in depth-first order and if
     * found a {@link js.dom.Control} invoke given <code>callback</code>. Callback function should have next
     * signature:
     * 
     * <pre>
     *  void callback(js.dom.Control);
     * </pre>
     * 
     * A descendant is considered control if has <code>name</code> or <code>data-name</code> attribute.
     * 
     * @param Function callback callback function invoked for every control,
     * @param Object... scope optional callback runtime execution scope, default to global scope.
     * @assert <code>callback</code> parameter is a {@link Function} and <code>scope</code> is an {@link Object},
     *         if present.
     */
    forEach : function (callback, scope) {
        $assert(js.lang.Types.isFunction(callback), "js.dom.ControlsIterable#forEach", "Callback parameter is not a function.");
        $assert(typeof scope === "undefined" || js.lang.Types.isStrictObject(scope), "js.dom.ControlsIterable#forEach", "Scope parameter is not an object.");
        this._scan(this._rootNode, false, callback, scope || window);
    },

    /**
     * Execute callback function for each control and do include hidden. The same as
     * {@link #forEach(Function, Object...)} but include hidden controls.
     * 
     * @param Function callback callback function invoked for every control,
     * @param Object... scope optional callback runtime execution scope, default to global scope.
     * @assert <code>callback</code> parameter is a {@link Function} and <code>scope</code> is an {@link Object},
     *         if present.
     */
    forEachAll : function (callback, scope) {
        $assert(js.lang.Types.isFunction(callback), "js.dom.ControlsIterable#forEachAll", "Callback parameter is not a function.");
        $assert(typeof scope === "undefined" || js.lang.Types.isStrictObject(scope), "js.dom.ControlsIterable#forEachAll", "Scope parameter is not an object.");
        this._scan(this._rootNode, true, callback, scope || window);
    },

    /**
     * Scan node for named controls, both standard and user defined. It is empowered by
     * {@link #forEach(Function, Object...)} or {@link #forEachAll(Function, Object...)} methods and scan recursively in
     * depth-first order for named controls. For every control found invoke <code>callback</code> in given
     * <code>scope</code> with control as argument.
     * 
     * @param Node node native node,
     * @param Boolean includeHidden flag to include hidden inputs,
     * @param Function callback function to execute for each control,
     * @param Object scope callback runtime execution scope.
     */
    _scan : function (node, includeHidden, callback, scope) {
        function isControl (node) {
            if (!includeHidden && node.attributes.getNamedItem("type") === "hidden") {
                return false;
            }
            return node.hasAttribute("name") || node.hasAttribute("data-name");
        }
        var nodeList = node.children;
        if (typeof nodeList === "undefined") {
            // IE has undefined children is none
            return;
        }
        for (var i = 0, n; i < node.children.length; i++) {
            n = node.children.item(i);
            // if is control invoke callback, otherwise continue branch depth-first scanning
            if (isControl(n)) {
                callback.call(scope, this._ownerDoc.getElement(n));
            }
            else {
                this._scan(n, includeHidden, callback, scope);
            }
        }
    },

    /**
     * This class string representation.
     * 
     * @return String this class string representation.
     */
    toString : function () {
        return "js.dom.ControlsIterable";
    }
};
$extends(js.dom.ControlsIterable, Object);
$package("js.dom");

/**
 * Document object. This class is a simplified morph of W3C DOM Document; basically is a tree of elements with a unique
 * root. It supplies getter for root element and methods for element creation, import and searching.
 * <p>
 * All search operations are performed using depth-first algorithm, i.e. starts from root and explores as far as
 * possible along each branch before backtracking. There are basically two kinds of search: <code>getBy</code> and
 * <code>findBy</code>. First always returns an {@link js.dom.Element} or null while the second returns
 * {@link js.dom.EList}, possible empty. One can use {@link js.dom.EList#isEmpty} to check if <code>findBy</code>
 * actually found something.
 * <p>
 * A document has a {@link js.dom.template.Template} instance used to inject dynamically content into the document's
 * elements. Method {@link #inject} is used just for that.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * @constructor Construct document object wrapping native W3C DOM document.
 * 
 * @param Document document native document.
 */
js.dom.Document = function (document) {
    $assert(this instanceof js.dom.Document, "js.dom.Document#Document", "Invoked as function.");
    $assert(document, "js.dom.Document#Document", "Undefined or null native document.");
    $assert(document.nodeType === Node.DOCUMENT_NODE, "js.dom.Document#Document", "Invalid document type #%d", document.nodeType);

    /**
     * Wrapped W3C DOM document object.
     * 
     * @type Document
     */
    this._document = document;

    /**
     * Templates processor. Used to inject values into the elements from this document.
     * 
     * @type js.dom.template.Template
     */
    this._template = js.dom.template.Template.getInstance(this);

    /**
     * DOM events manager.
     * 
     * @type js.event.DomEvents
     */
    this._domEvents = new js.event.DomEvents(this);
};

js.dom.Document.prototype = {
    /**
     * Low level access to W3C DOM Document interface.
     * 
     * @return Document wrapped native document.
     */
    getDocument : function () {
        return this._document;
    },

    /**
     * Determine if this document instance is XML, that is, not HTML document.
     * 
     * @return Boolean true if this document instance is XML.
     */
    isXML : function () {
        return false;
    },

    /**
     * Create element and set attributes. Create an element of requested tag owned by this document. Also set attributes
     * values if optional attribute name/value pairs are present; if a name/value is incomplete, i.e. odd number of
     * arguments, the last name without value is ignored. It is user code responsibility to supply attribute name and
     * value in proper order. Note that newly created element is not part of document tree until explicitly add or
     * insert it as a child to a parent. So, elements creation follows the same W3C DOM pattern: create the element then
     * add it as a child.
     * 
     * <pre>
     * var p = doc.createElement("p", "id", "paragraph-id", "title", "tooltip description");
     * body.addChild(p);
     * </pre>
     * 
     * <p>
     * Important note: if use this method to create subclasses of control MUST supply input type when calling this
     * method in order to return proper type. Otherwise generic control is returned.
     * 
     * <pre>
     * 	var checkbox = doc.createElement("input", "type", "checkbox");
     *	checkbox.check();
     * </pre>
     * 
     * @param String tag tag name for element to be created,
     * @param String... attrNameValuePairs optional pairs of attribute name followed by value.
     * @return js.dom.Element newly created element.
     * @assert <em>tag</em> argument is not undefined, null or empty and the number of <em>attrNameValuePairs</em>
     *         arguments is even.
     * @see js.dom.Element#setAttr
     */
    createElement : function (tag) {
        $assert(tag, "js.dom.Document#createElement", "Undefined, null or empty tag name.");
        $assert(arguments.length % 2 === 1, "js.dom.Document#createElement", "Invalid attributes name/value.");
        if (!tag) {
            return null;
        }
        var node = this._document.createElement(tag);
        if (arguments.length > 2) {
            var attrs = $args(arguments, 1);
            for (var i = 0, l = attrs.length - 1; i < l;) {
                node.setAttribute(attrs[i++], attrs[i++]);
            }
        }
        return this.getElement(node);
    },

    /**
     * Create element with specified class name.
     * 
     * @param String tag tag name for element to be created,
     * @param String className full qualified name for class.
     * @return js.dom.Element newly created element.
     */
    createElementForClass : function (tag, className) {
        $assert(tag, "js.dom.Document#createElementForClass", "Undefined, null or empty tag name.");
        $assert(className, "js.dom.Document#createElementForClass", "Undefined, null or empty class name.");
        if (!tag || !className) {
            return null;
        }

        var node = this._document.createElement(tag);
        js.dom.Node.setElementClassName(node, className);
        return this.getElement(node);
    },

    /**
     * Import element. Import an element that belongs to another document and return it. Note that the newly imported
     * element is not part of this document tree until explicitly appended or inserted to a parent element.
     * 
     * <pre>
     * 	var el = doc.importElement(foreignDoc.getByTag("Luke Skywalker"));
     * 	doc.getByTag("Darth Vader").addChild(el);
     * </pre>
     * 
     * Return null if element to be imported is not defined or null and just return it if already belong to this
     * document.
     * 
     * @param js.dom.Element el foreign element.
     * @return js.dom.Element newly imported element.
     * @assert element to be imported is not undefined or null and does not already belong to this document.
     */
    importElement : function (el) {
        $assert(el, "js.dom.Document#importElement", "Undefined or null foreign element.");
        if (!el) {
            return null;
        }
        $assert(!el._ownerDoc.equals(this), "js.dom.Document#importElement", "Element is not foreign.");
        if (el._ownerDoc.equals(this)) {
            return el;
        }
        return this.getElement(this._importNode(el._node));
    },

    /**
     * Utility method for foreign node importing. Create a new node into this document and deeply initialize it from
     * given foreign node. Please note that this method always perform a deep copy, that is, all foreign node
     * descendants and attributes are copied.
     * 
     * @param Node node foreign node.
     * @return Node this document node created from given foreign node.
     */
    _importNode : function (node) {
        return this._document.importNode(node, true);
    },

    /**
     * Retrieve the root of this document tree.
     * 
     * @return js.dom.Element this document root.
     */
    getRoot : function () {
        return this.getElement(this._document.documentElement);
    },

    /**
     * Get the element with specified ID. This method looks for an attribute with type ID, usually named <code>id</code>.
     * Attribute type is set at document validation using DTD or schema information. Trying to use this method on a
     * document without schema render not predictable results: there are implementations returning null but there are
     * some returning valid element.
     * 
     * @param String id element ID to look for.
     * @return js.dom.Element element with specified ID or null.
     * @assert <code>id</code> argument is not undefined, null or empty.
     */
    getById : function (id) {
        $assert(id, "js.dom.Document#getById", "ID is undefined or null.");
        var node = this._getNodeById(id);
        return node ? this.getElement(node) : null;
    },

    /**
     * Helper method for retrieving this document node identified by ID. If requested node does not exist this method
     * returns null or undefined, depending on browser implementation. Also if this document has no ID attribute
     * declaration, get node by ID support is messy: IE throws exception, Chrome and Safari return valid node whereas
     * Firefox and Opera return null.
     * 
     * @param String id the ID of desired node.
     * @return Node node identified by given <code>ID</code>.
     */
    _getNodeById : function (id) {
        return this._document.getElementById(id);
    },

    /**
     * Get descendant by object class. Returns first descendant element identifiable by given object class. Returns null
     * if given <code>clazz</code> argument is not defined, null or empty. Class not found is considered a flaw in
     * logic and throws assertion; if assertion is disabled returns null.
     * 
     * @param Object clazz class name or constructor for class to search for.
     * @return js.dom.Element found element or null.
     * @assert <code>clazz</code> argument is not undefined, null, is of proper type and requested class exists.
     */
    getByClass : function (clazz) {
        var node = js.dom.Node.getElementByClass(this._document, clazz);
        $assert(node !== null, "js.dom.Element#getByClass", "Class |%s| not found.", clazz);
        return this.getElement(node);
    },

    /**
     * Get element by tag. Search entire document for elements with given tag name and return the first found. Returns
     * null if <em>tag</em> argument is undefined, null or empty or there is no element with requested tag name. Note
     * that wild card asterisk (*) matches all tags in which case root element is returned.
     * 
     * <p>
     * On XML documents tag name is case sensitive whereas in HTML is not. For consistency sake is recommended to always
     * consider tags name as case sensitive.
     * 
     * @param String tag tag name to search for.
     * @return js.dom.Element first element with specified tag or null.
     * @assert <em>tag</em> argument is not undefined, null or empty.
     */
    getByTag : function (tag) {
        return this.getElement(js.dom.Node.getElementsByTagName(this._document, tag));
    },

    /**
     * Find elements by tag. Return all elements from this document having specified tag name. Returns empty list if
     * <em>tag</em> argument is undefined, null or empty or there is no element with requested tag name. Note that
     * wild card asterisk (*) matches all tags in which case all elements are returned.
     * 
     * <p>
     * On XML documents tag name is case sensitive whereas in HTML is not. For consistency sake is recommended to always
     * consider tags name as case sensitive.
     * 
     * @param String tag tag name to search for.
     * @return js.dom.EList list of found elements, possible empty.
     * @assert <em>tag</em> argument is not undefined, null or empty.
     */
    findByTag : function (tag) {
        return this.getEList(js.dom.Node.getElementsByTagName(this._document, tag));
    },

    /**
     * Get this document element identified by formatted XPath expression. Evaluate XPath expression and return first
     * found element. Returns null if given <em>xpath</em> argument is not defined, null or empty or if XPath
     * evaluation has no result.
     * <p>
     * XPath expression <em>xpath</em> can be formatted as supported by $format pseudo-operator in which case
     * <em>args</em> arguments should be supplied.
     * 
     * @param String xpath XPath expression to evaluate,
     * @param Object... args optional arguments if <em>xpath</em> is formatted.
     * @return js.dom.Element first found element or null.
     * @assert <em>xpath</em> argument is not undefined, null or empty.
     * @note this method works only on XML documents.
     */
    getByXPath : function (xpath) {
        $assert(xpath, "js.dom.Document#getByXPath", "XPath is undefined, null or empty.");
        return this.evaluateXPathNode(this._document, $format(arguments));
    },

    /**
     * Find this document elements identified by formatted XPath expression. Evaluate XPath expression and return found
     * elements. Return empty list if given <em>xpath</em> argument is not defined, null or empty or if XPath
     * evaluation has no result.
     * <p>
     * XPath expression <em>xpath</em> can be formatted as supported by $format pseudo-operator in which case
     * <em>args</em> arguments should be supplied.
     * 
     * @param String xpath XPath expression to evaluate,
     * @param Object... args optional arguments if <em>xpath</em> is formatted.
     * @return js.dom.EList list of found elements, possible empty.
     * @assert <em>xpath</em> argument is not undefined, null or empty.
     * @note this method works only on XML documents.
     */
    findByXPath : function (xpath) {
        $assert(xpath, "js.dom.Document#findByXPath", "XPath is undefined, null or empty.");
        return this.evaluateXPathNodeList(this._document, $format(arguments));
    },

    /**
     * Get element by CSS selectors. Evaluate CSS selectors and return first found element. Multiple comma separated
     * selectors are allowed in which case every selector is tested for match in the order from list till first element
     * found. Returns null if given <em>selectors</em> argument is not defined, null or empty or CSS evaluation has no
     * results.
     * 
     * <p>
     * CSS <em>selectors</em> can be formatted as supported by $format pseudo-operator in which case <em>args</em>
     * arguments should be supplied.
     * 
     * @param String selectors CSS selectors to evaluate,
     * @param Object... args optional arguments if <em>selectors</em> is formatted.
     * @return js.dom.Element first found element or null.
     * @assert <em>selectors</em> argument is not undefined, null or empty.
     */
    getByCss : function (selectors) {
        if (arguments.length > 1) {
            selectors = $format(arguments);
        }
        return this.getElement(js.dom.Node.querySelector(this._document, selectors));
    },

    /**
     * Find elements by CSS selectors. Evaluate CSS selectors and return found elements. Multiple comma separated
     * selectors are allowed in which case every selector is tested for match in the order from list and results
     * cumulated. Returns empty list if given <em>selectors</em> argument is not defined, null or empty or CSS
     * evaluation has no results.
     * 
     * <p>
     * CSS <em>selectors</em> can be formatted as supported by $format pseudo-operator in which case <em>args</em>
     * arguments should be supplied.
     * 
     * @param String selectors CSS selectors to evaluate,
     * @param Object... args optional arguments if <em>selectors</em> is formatted.
     * @return js.dom.EList list of found elements, possible empty.
     * @assert <em>selectors</em> argument is not undefined, null or empty.
     */
    findByCss : function (selectors) {
        if (arguments.length > 1) {
            selectors = $format(arguments);
        }
        return this.getEList(js.dom.Node.querySelectorAll(this._document, selectors));
    },

    /**
     * Get element by CSS class. Retrieve first element possessing given CSS class. Returns null if given CSS class is
     * not defined, null or empty or there is no element with such CSS class.
     * 
     * @param String cssClass CSS class to search for.
     * @return js.dom.Element found element or null.
     * @assert <em>cssClass</em> argument is not undefined, null or empty.
     */
    getByCssClass : function (cssClass) {
        return this.getElement(js.dom.Node.getElementsByClassName(this._document, cssClass));
    },

    /**
     * Find elements by CSS class. Retrieve elements possessing given CSS class. Returns empty list if given CSS class
     * is not defined, null or empty or there is no element with such CSS class.
     * 
     * @param String cssClass CSS class to search for.
     * @return js.dom.EList list of found elements, possible empty.
     * @assert <em>cssClass</em> argument is not undefined, null or empty.
     */
    findByCssClass : function (cssClass) {
        return this.getEList(js.dom.Node.getElementsByClassName(this._document, cssClass));
    },

    /**
     * Document tree string representation.
     * 
     * @return String document tree string representation.
     * @throws js.dom.DomException if serialization is not possible due to missing browser support.
     */
    serialize : function () {
        return new XMLSerializer().serializeToString(this._document);
    },

    // ------------------------------------------------------------------------
    // XPath evaluation utility methods

    /**
     * Constant for XPath result of type Node.
     */
    XPATH_NODE : 9,

    /**
     * Constant for XPath iterable collection of nodes.
     */
    XPATH_NODESET : 5,

    /**
     * Returns the element described by XPath expression in the given context node. This method delegates
     * {@link #_evaluate(Node,String,Number)}; if <code>xpath</code> expression is undefined, null or empty returns
     * null.
     * 
     * @param Node node native W3C DOM node, document or element,
     * @param String xpath XPath expression.
     * @return js.dom.Element the element described by XPath expression or null.
     * @note this method works only on XML documents.
     */
    evaluateXPathNode : function (node, xpath) {
        if (!xpath) {
            return null;
        }
        var node = this._evaluate(node, xpath, this.XPATH_NODE);
        return node ? this.getElement(node) : null;
    },

    /**
     * Returns the elements list described by XPath expression in the given context node. This method delegates
     * {@link #_evaluate(Node,String,Number)}; if <code>xpath</code> expression is undefined, null or empty returns
     * empty elements list.
     * 
     * @param Node node native W3C DOM node, document or element,
     * @param String xpath XPath expression.
     * @return js.dom.EList the elements list described by XPath expression, possible empty.
     * @note this method works only on XML documents.
     */
    evaluateXPathNodeList : function (node, xpath) {
        if (!xpath) {
            return this.getEList(null);
        }
        var xpathResult = this._evaluate(node, xpath, this.XPATH_NODESET);
        return this.getEList(xpathResult);
    },

    /**
     * Evaluate XPath expression in the context of given W3C DOM Node. DOM Node argument can be {@link Document} or
     * {@link Element} and type a numeric value standardized by W3C - see {@link #XPATH_NODE} and {@link #XPATH_NODESET}
     * constants. Returned value depends on requested type and is respectively {@link Node} or {@link NodeList}.
     * Returns null or empty node list if no element found.
     * <p>
     * Because of Internet Explorer non standard implementation HTML documents are not supported. There is assertion if
     * trying to use XPath evaluation on non XML documents. If assertions are disabled Internet Explorer rise exception
     * but all other standard compliant browsers will perform evaluation correctly.
     * 
     * @param Node node native W3C DOM node, document or element,
     * @param String xpath XPath expression,
     * @param Number type XPath result type.
     * @return Object evaluation result which can be {@link Node} or {@link NodeList}.
     * @assert this document is XML, document evaluate function exists, parameters are of right types and returned value
     *         is valid.
     * @note this method works only on XML documents.
     */
    _evaluate : function (node, xpath, type) {
        $assert(this.isXML(), "js.dom.Document#_evaluate", "XPath evaluation is working only on XML documents.");

        $assert(js.lang.Types.isFunction(this._document.evaluate), "js.dom.Document#_evaluate", "Missing XPath evaluation support.");
        $assert(node.nodeType === Node.DOCUMENT_NODE || node.nodeType === Node.ELEMENT_NODE, "js.dom.Document#_evaluate", "Invalid node type #%d", node.nodeType);
        $assert(xpath, "js.dom.Document#_evaluate", "Undefined, null or empty XPath expression.");
        $assert(js.lang.Types.isNumber(type), "js.dom.Document#_evaluate", "Type argument is not a number.");

        var xpathResult = this._document.evaluate(xpath, node, null, type, null);
        $assert(xpathResult, "js.dom.Document#_evaluate", "Null or undefined XPathResult.");
        $assert(xpathResult instanceof XPathResult, "js.dom.Document#_evaluate", "Object returned by XPath evaluation is not instance of XPathResult.");
        $assert(xpathResult.resultType === type, "js.dom.Document#_evaluate", "Object returned by XPath evaluation has unexpected result type.");

        if (type === this.XPATH_NODE) {
            node = xpathResult.singleNodeValue;
            if (node == null) {
                return null;
            }
            $assert(node.nodeType === Node.ELEMENT_NODE, "js.dom.Document#_evaluate", "Invalid result node type |%d|. Only NODE_ELEMENT supported.", node.nodeType);
            return node.nodeType === Node.ELEMENT_NODE ? node : null;
        }

        $assert(!xpathResult.invalidIteratorState, "js.dom.Document#evaluateXPathNodeList", "Invalid iterator state.");
        var elementsArray = [], node = xpathResult.iterateNext();
        // collect only element nodes from result; assert node type is element
        while (node !== null) {
            $assert(node.nodeType === Node.ELEMENT_NODE, "js.dom.Document#_evaluate", "Invalid result node type |%d|. Only NODE_ELEMENT supported.", node.nodeType);
            if (node.nodeType === Node.ELEMENT_NODE) {
                elementsArray.push(node);
            }
            node = xpathResult.iterateNext();
        }
        return new js.dom.NodeList(elementsArray);
    },

    // ------------------------------------------------------------------------
    // j(s)-lib extensions to Baby DOM Document interface

    /**
     * Add event listener. Attach listener to requested DOM event type.
     * 
     * @param String type DOM event type,
     * @param Function listener event listener to register,
     * @param Object scope listener run-time scope,
     * @param Boolean... capture optional capture flag, default to false.
     * @return js.dom.Document this object.
     * @assert see assertions enforced by {@link js.event.DomEvents#addListener(String, Function, Object, Boolean)}.
     * @note j(s)-lib extensions to Baby DOM Element interface.
     */
    on : function (type, listener, scope, capture) {
        if (typeof capture === "undefined") {
            capture = false;
        }
        this._domEvents.addListener(type, listener, scope, capture);
        return this;
    },

    /**
     * Remove event listener. Detach listener from requested DOM event type.
     * 
     * @param String type DOM event type,
     * @param Function listener event listener to remove,
     * @param Boolean... capture optional capture flag, default to false.
     * @return js.dom.Document this object.
     * @assert see assertions enforced by {@link js.event.DomEvents#removeListener(String, Function, Boolean)}.
     * @note j(s)-lib extensions to Baby DOM Element interface.
     */
    un : function (type, listener, capture) {
        if (typeof capture === "undefined") {
            capture = false;
        }
        this._domEvents.removeListener(type, listener, capture);
        return this;
    },

    /**
     * Get the element associated to node. Returns the element bound to given node. If none found create a new
     * {@link js.dom.Element} wrapping the node then returns it. Returns null is given node is undefined or null.
     * <p>
     * Created element belongs to a class. There are standard element classes identified by node tag and type attribute,
     * e.g. for <em>input</em> of type <em>checkbox</em> uses {@link js.dom.Checkbox} class. User defined classes
     * are allowed and configured via <em>data-class</em> custom attribute.
     * 
     * <pre>
     *	&lt;select data-class="comp.prj.Select" /&gt;
     * </pre>
     * 
     * User defined classes take precedence so this factory method will use <code>comp.prj.Select</code> instead of
     * standard {@link js.dom.Select} to create above form element.
     * <p>
     * This method uses {@link js.lang.Class#forName} to actually obtain the class and note that it implements lazy
     * loading.
     * 
     * @param Node node native W3C DOM Node.
     * @return js.dom.Element element wrapping given node or null.
     * @note j(s)-lib extensions to Baby DOM Document interface.
     */
    getElement : function (node) {
        // undocumented feat: if argument is node list extract first node
        if (js.lang.Types.isNodeList(node)) {
            node = node.item(0);
        }
        if (!node) {
            return null;
        }
        var el = js.dom.Node.getElement(node);
        if (el !== null) {
            return el;
        }

        var className = js.dom.Node.getElementClassName(node);
        if (className == null) {
            className = this._getStandardElementClassName(node);
        }
        $assert(js.lang.Types.isString(className), "js.dom.Document#getElement", "Class name |%s| is not a string.", className);

        // forName implements synchronous lazy loading so next call may block user interface
        var clazz = js.lang.Class.forName(className);
        $assert(clazz !== null, "js.dom.Document#getElement", "Undefined class |%s| for node |%s|.", className, js.dom.Node.toString(node));
        $assert(js.lang.Types.isElement(clazz), "js.dom.Document#getElement", "Element class must extend js.dom.Element.");
        return js.lang.Types.isElement(clazz) ? new clazz(this, node) : null;
    },

    /**
     * Create list of elements. Create a new list of elements wrapping native W3C DOM NodeList. If <em>nodeList</em>
     * argument has no items returned elist is empty. Also return an empty list if <em>nodeList</em> argument is
     * undefined or null.
     * 
     * @param NodeList nodeList native DOM nodes list.
     * @return js.dom.EList newly created elist, possible empty.
     * @assert <em>nodeList</em> argument is not undefined or null.
     * @note j(s)-lib extensions to Baby DOM Document interface.
     */
    getEList : function (nodeList) {
        $assert(nodeList, "js.dom.Document#getEList", "Node list is undefined or null.");
        if (!nodeList) {
            nodeList = new js.dom.NodeList();
        }
        return new js.dom.EList(this, nodeList);
    },

    /**
     * Register element class and format. Every document element may poses two custom attributes used to mark element
     * class name and used format, something like:
     * 
     * <pre>
     * 	&lt;div data-class="js.widget.ProgressBar"&gt;
     * 		&lt;div data-format="js.format.Percent"&gt;&lt;/div&gt;
     * 	&lt;/div&gt;
     * </pre>
     * 
     * Bind method allows for programmatically set these mark values. Note that this method should be invoked before
     * element creation; once instantiated is not possible to change element class nor its format instance.
     * 
     * <p>
     * Given CSS selectors are used to locate element(s) to bound to and type name identify the element class or format.
     * This method chooses the right custom attribute based on type inheritance or implementation. For this to work
     * given element class should inherits {@link js.dom.Element}; if fail this constrain binding is ignored. Finally,
     * is possible to bind a type to more elements in a single call.
     * 
     * @param String selectors document elements selectors,
     * @param String typeName element class or format name.
     * @assert both arguments are not undefined, null or empty. Also type name should designate either a class element
     *         or a format.
     * @note j(s)-lib extensions to Baby DOM Document interface.
     */
    bind : function (selectors, typeName) {
        js.dom.Node.bind(this._document, selectors, typeName);
    },

    /**
     * Get standard element class name. Returns the name of the class suitable for element instantiation given the node
     * tag name and type attribute.
     * 
     * @param Node node native DOM node.
     * @return String standard element class name suitable for given node.
     */
    _getStandardElementClassName : function (node) {
        switch (node.nodeName.toLowerCase()) {
        case "a":
            return "js.dom.Anchor";

        case "img":
            return "js.dom.Image";

        case "form":
            return "js.dom.Form";

        case "input":
            switch (node.getAttribute("type")) {
            case "checkbox":
                return "js.dom.Checkbox";
            case "radio":
                return "js.dom.Radio";
            case "file":
                return "js.dom.FileInput";
            }
            // fall throw next case

        case "textarea":
            return "js.dom.Control";

        case "select":
            return "js.dom.Select";

        case "option":
            return "js.dom.Element";

        case "iframe":
            return "js.dom.IFrame";

        default:
            return "js.dom.Element";
        }
    },

    /**
     * Inject value into element denoted by given selector. This method locates selected document element then delegates
     * {@link js.dom.template.Template#subinject}. If <code>selector</code> points to multiple elements this method
     * silently choose the first, considering depth-first order. If there is no element for given <code>selector</code>
     * this method does nothing without notice; anyway, if assertions are enabled, bad selector assertion is thrown.
     * 
     * @param String selector selector used to located desired element,
     * @param Object value any primitive or aggregated value suitable for selected element.
     * @returns js.dom.Document this object.
     * @assert <code>selector</code> points to an existing element.
     */
    inject : function (selector, value) {
        var el = this.getByCss(selector);
        $assert(el !== null, "js.dom.Document#inject", "Bad selector.");
        if (el !== null) {
            this._template.subinject(el, value);
        }
        return this;
    },

    /**
     * Test for document instances equality. Two documents are considered equals if wraps the same
     * {@link Document W3C native document}. Returns false if given argument is undefined, null or not a Document.
     * 
     * @param js.dom.Document doc document to match.
     * @return Boolean true if given document equals this one.
     * @assert given argument is not undefined or null and is a Document.
     */
    equals : function (doc) {
        $assert(doc, "js.dom.Document#equals", "Document is undefined or null.");
        $assert(doc instanceof js.dom.Document, "js.dom.Document#equals", "Bad argument type.");
        if (!(doc && doc instanceof js.dom.Document)) {
            return false;
        }
        return this._document === doc._document;
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.dom.Document";
    }
};
$extends(js.dom.Document, Object);

$legacy(js.ua.Engine.TRIDENT, function () {
    js.dom.Document.prototype._evaluate = function (node, xpath, type) {
        $assert(this.isXML(), "js.dom.Document#_evaluate", "XPath evaluation is working only on XML documents.");

        // select language compatibility; without it IE uses a private variant with couple differences
        this._document.setProperty("SelectionLanguage", "XPath");

        $assert(node.nodeType === Node.DOCUMENT_NODE || node.nodeType === Node.ELEMENT_NODE, "js.dom.Document#_evaluate", "Invalid node type #%d", node.nodeType);
        $assert(xpath, "js.dom.Document#_evaluate", "Undefined, null or empty XPath expression.");
        $assert(js.lang.Types.isNumber(type), "js.dom.Document#_evaluate", "Type argument is not a number.");

        if (node.nodeType === Node.ELEMENT_NODE) {
            // prefix xpath expression with path to node from document root
        }

        var nodeList = node.selectNodes(xpath);
        if (type === this.XPATH_NODE) {
            return nodeList.item(0);
        }
        $assert(type === this.XPATH_NODESET, "js.dom.Document#_evaluate", "Type argument |%d| is not supported.", type);
        return nodeList;
    };

    js.dom.Document.prototype._importNode = function (foreignNode) {
        switch (foreignNode.nodeType) {
        case Node.ELEMENT_NODE:
            var node = this._document.createElement(foreignNode.nodeName);
            for (var i = 0, attr; i < foreignNode.attributes.length; ++i) {
                attr = foreignNode.attributes.item(i);
                if (attr.nodeName !== "data-back-ref") {
                    node.setAttribute(attr.nodeName, attr.value);
                }
            }
            for (i = 0; i < foreignNode.childNodes.length; ++i) {
                node.appendChild(this._importNode(foreignNode.childNodes.item(i)));
            }
            return node;

        case Node.TEXT_NODE:
        case Node.CDATA_SECTION_NODE:
            return this._document.createTextNode(foreignNode.nodeValue);

        case Node.COMMENT_NODE:
            return this._document.createComment(foreignNode.nodeValue);
        }
    };

    js.dom.Document.prototype._getNodeById = function (id) {
        try {
            return this._document.getElementById(id);
        } catch (e) {
            return null;
        }
    };

    js.dom.Document.prototype.isXML = function () {
        return typeof this._document.xml !== "undefined";
    };

    js.dom.Document.prototype.serialize = function () {
        if (typeof this._document.xml !== "undefined") {
            return this._document.xml;
        }
        if (typeof this._document.html !== "undefined") {
            return this._document.html;
        }
        if (typeof XMLSerializer !== "undefined") {
            return new XMLSerializer().serializeToString(this._document);
        }
        throw new js.dom.DomException("js.dom.Document#serialize", "Missing DOM serializer support.");
    };
});

$legacy(js.ua.Engine.WEBKIT || js.ua.Engine.MOBILE_WEBKIT, function () {
    js.dom.Document.prototype.isXML = function () {
        return this._document.xmlVersion == true;
    };
});

$legacy(js.ua.Engine.GECKO, function () {
    js.dom.Document.prototype.isXML = function () {
        return this._document.contentType.indexOf("xml") !== -1;
    };
});

$legacy(js.ua.Engine.PRESTO, function () {
    js.dom.Document.prototype.isXML = function () {
        return typeof XMLDocument !== "undefined" && this._document instanceof XMLDocument;
    };
});
$package('js.lang');

/**
 * j(s)-lib generic exception. Thrown whenever a more specific exception is not available or suitable. This class is
 * also the root for exceptions hierarchy.
 * 
 * @constructor Construct a new exception instance. This class constructor accept a variable number of messages. It will
 *              display all of them joined by colon after converting to string, if necessarily. Note that null and
 *              functions are ignored.
 * 
 * @param Object... messages, variable number of messages.
 */
js.lang.Exception = function() {
	$assert(this instanceof js.lang.Exception, 'js.lang.Exception#Exception', 'Invoked as function.');

	/**
	 * Exception name.
	 * 
	 * @type String
	 */
	this.name = 'j(s)-lib exception';

	/**
	 * Exception message. Consolidated by joining all messages given as arguments. If no eligible arguments provided on
	 * constructor invocation message is empty string.
	 * 
	 * @type String
	 */
	this.message = js.lang.Types.isString(arguments[0]) ? $format(arguments) : "";
};

js.lang.Exception.prototype = {
	/**
	 * Returns a string representation of the object.
	 * 
	 * @return String object string representation.
	 */
	toString : function() {
		return 'js.lang.Exception';
	}
};
$extends(js.lang.Exception, Error);
$package('js.dom');

/**
 * DOM exception. Thrown whenever somethig goes wrong on js.dom package logic.
 */
js.dom.DomException = function() {
    $assert(this instanceof js.dom.DomException, 'js.dom.DomException#DomException', 'Invoked as function.');
    this.$super(arguments);

    /**
     * Exception name.
     * @type String
     */
    this.name = 'j(s)-lib DOM exception';
};

js.dom.DomException.prototype =
{
    /**
     * Returns a string representation of the object.
     *
     * @return String object string representation.
     */
    toString: function() {
        return 'js.dom.DomException';
    }
};
$extends(js.dom.DomException, js.lang.Exception);
$package("js.lang");

/**
 * Traverse a collection in natural order. Iterator usage is as follow:
 * 
 * <pre>
 *  var it = collection.it();
 *  while(it.hasNext()) {
 *      // do something with collection item returned by it.next()
 *  }
 * </pre>
 * 
 * On creation, an iterator internal state guarantees that {@link #next()} will return first collection item, of course
 * if underlying collection is not empty. In case collection is empty {@link #hasNext()} first call returns false and
 * above while loop is never executed.
 * 
 * @author Iulian Rotaru
 * @since 1.3
 */
js.lang.Iterator = {
    /**
     * Returns true if this iterator has more items.
     * 
     * @return Boolean true if iterator has more items.
     */
    hasNext : function () {
    },

    /**
     * Return the next collection item.
     * 
     * @return Object next collection item.
     */
    next : function () {
    }
};
$package("js.dom");

/**
 * List of elements. This class wraps a native {@link NodeList} instance and is returned by {@link js.dom.Document} and
 * {@link js.dom.Element} methods that need to return collection of elements. Be aware that native NodeList is a
 * <em>live
 * </em> object, that is, updated by JavaScript engine when DOM tree is changed, so refrain to cache this
 * objects. Also DO NOT alter its structure while iterating.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * @constructor Construct list of elements. This constructor requires two arguments: owner document and native NodeList
 *              instance to wrap. If given nodes list is empty or null created instance is empty. Note that
 *              <em>nodeList</em> argument should be present even if null. User code should explicitly indicate its
 *              intention to create an empty list.
 * 
 * @param js.dom.Document ownerDoc document owning elements from this list,
 * @param NodeList nodeList native node list instance.
 * @assert <em>nodeList</em> argument is not undefined.
 */
js.dom.EList = function (ownerDoc, nodeList) {
    $assert(this instanceof js.dom.EList, "js.dom.EList#EList", "Invoked as function.");
    $assert(ownerDoc, "js.dom.EList#EList", "Undefined or null owner document.");
    $assert(ownerDoc instanceof js.dom.Document, "js.dom.EList#EList", "Owner document is not an instance of js.dom.Document.");

    $assert(typeof nodeList !== "undefined", "js.dom.EList#EList", "Node list is undefined.");
    if (nodeList == null) {
        nodeList = new js.dom.NodeList();
    }
    $assert(js.lang.Types.isNodeList(nodeList), "js.dom.EList#EList", "Argument supplied as node list does not implement NodeList interface.");
    $assert(this._containsOnlyElements(nodeList), "js.dom.EList#EList", "Argument supplied as node list does not contains only NODE_ELEMENT.");

    /**
     * Owner document. Note that all elements from this list belongs to this document.
     * 
     * @type js.dom.Document
     */
    this._ownerDoc = ownerDoc;

    /**
     * Native NodeList <em>live</em> instance. If {@link #EList constructor} <em>nodeList</em> arguments was null
     * this node list is empty.
     * 
     * @type NodeList
     */
    this._nodeList = nodeList;
};

js.dom.EList.prototype = {
    /**
     * Get this list size.
     * 
     * @return Number this list size.
     */
    size : function () {
        return this._nodeList.length;
    },

    /**
     * Get element from index. Returns the element identified by given index or null if index is not valid.
     * 
     * @param Number index the index of element to retrieve.
     * @return js.dom.Element element from requested index.
     * @assert <em>index</em> argument does not exceed this list size.
     */
    item : function (index) {
        if (typeof index === "undefined") {
            index = 0;
        }
        $assert(index < this._nodeList.length, "js.dom.EList#item", "Index out of range.");
        return this._ownerDoc.getElement(this._nodeList.item(index));
    },

    /**
     * Is this list empty?
     * 
     * @return Boolean true if this elements list is empty.
     */
    isEmpty : function () {
        return this._nodeList.length === 0;
    },

    /**
     * Remove all elements. Remove this list elements from owner document using {@link js.dom.Element#remove}. Note
     * that element cleanup is performed.
     * 
     * @assert every element from this list should be not undefined or null.
     * @note because wrapped native node list is <em>live</em> after this method execution, {@link #isEmpty} returns
     *       true and {@link #it} returns an empty iterator.
     */
    remove : function () {
        // because NodeList may be live we need to cache all elements references first
        // note that not all node lists are live, e.g. querySelect returns static NodeList
        // but I decided to play safe and cache both cases, even if sub-optimal

        var nodes = [], i, el;
        for (i = 0; i < this._nodeList.length; ++i) {
            nodes.push(this._nodeList.item(i));
        }

        for (i = 0; i < nodes.length; ++i) {
            el = this._ownerDoc.getElement(nodes[i]);
            $assert(el, "js.dom.EList#remove", "List element is undefined or null.");
            if (el) {
                el.remove();
            }
        }

        // if this._nodeList is a live NodeList, it is already empty because its elements
        // was removed from document tree and next statement does not harm
        // if node list is static, i.e. not live, clear it by setting its length to zero
        // to sum-up, after this method exit this._nodeList is empty
        nodes.length = 0;
    },

    /**
     * Execute specified method for every element from this list. Traverse all this elements list and execute requested
     * method with given arguments. Ignore elements that does not own specified method.
     * 
     * @param String methodName the name of element"s method to be invoked,
     * @param Object... args optional runtime method arguments.
     * @return js.dom.EList this pointer.
     * @assert method name is not undefined, null or empty. Also every element from list should poses named method.
     */
    call : function (methodName) {
        $assert(methodName, "js.dom.EList#call", "Method name is undefined, null or empty.");
        var it = this.it(), el;
        while (it.hasNext()) {
            el = it.next();
            $assert(js.lang.Types.isFunction(el[methodName]), "js.dom.EList#call", "Element property is no a function.");
            if (js.lang.Types.isFunction(el[methodName])) {
                el[methodName].apply(el, $args(arguments, 1));
            }
        }
        return this;
    },

    // ------------------------------------------------------------------------
    // j(s)-lib extensions to Baby DOM EList interface

    forEach : function (callback, thisArg) {
        $assert(js.lang.Types.isFunction(callback), "js.dom.EList#forEach", "Callback is not a function.");
        if (typeof thisArg === "undefined") {
            thisArg = window;
        }
        for ( var i = 0; i < this.size(); i++) {
            callback.call(thisArg, this.item(i), i, this);
        }
    },

    /**
     * Add CSS class to this list elements. If CSS class argument is undefined, null or empty this method does nothing.
     * 
     * @param String cssClass CSS class to add.
     * @return js.dom.EList this object.
     * @assert <em>cssClass</em> arguments is not undefined, null or empty.
     * @note j(s)-lib extensions to Baby DOM EList interface.
     */
    addCssClass : function (cssClass) {
        this.call("addCssClass", cssClass);
        return this;
    },

    /**
     * Remove CSS class from this list elements. If CSS class argument is undefined, null or empty this method does
     * nothing.
     * 
     * @param String cssClass CSS class to remove.
     * @return js.dom.EList this object.
     * @assert <em>cssClass</em> arguments is not undefined, null or epmty.
     * @note j(s)-lib extensions to Baby DOM EList interface.
     */
    removeCssClass : function (cssClass) {
        this.call("removeCssClass", cssClass);
        return this;
    },

    /**
     * Toggle CSS class on this list elements. If CSS class argument is undefined, null or empty this method does
     * nothing.
     * 
     * @param String cssClass CSS class to toggle.
     * @return js.dom.EList this object.
     * @assert <em>cssClass</em> arguments is not undefined, null or epmty.
     * @note j(s)-lib extensions to Baby DOM EList interface.
     */
    toggleCssClass : function (cssClass) {
        this.call("toggleCssClass", cssClass);
        return this;
    },

    /**
     * Gets an iterator for this elist instance. Create and return a new instance of this class private iterator.
     * 
     * @return js.dom.EList.Iterator newly created iterator instance.
     * @note j(s)-lib extensions to Baby DOM EList interface.
     */
    it : function () {
        return new js.dom.EList.Iterator(this);
    },

    /**
     * Add event listener to this list elements.
     * 
     * @param String type event type,
     * @param Function listener event listener to register,
     * @param Object scope listener run-time scope,
     * @param Object arg optional argument to pass back to listener.
     * @return js.dom.EList this object.
     * @note j(s)-lib extensions to Baby DOM EList interface.
     */
    on : function (type, listener, scope, arg) {
        this.call("on", type, listener, scope, arg);
        return this;
    },

    /**
     * Remove event listener from this list elements.
     * 
     * @param String type event type,
     * @param Function listener event listener to remove.
     * @return js.dom.EList this object.
     * @note j(s)-lib extensions to Baby DOM EList interface.
     */
    un : function (type, listener) {
        this.call("un", type, listener);
        return this;
    },

    /**
     * Debugging predicate that test the nodes list contains only Node.ELEMENT_NODE.
     * 
     * @param NodeList nodeList nodes list to test,
     * @return Boolean true if <code>nodeList</code> contains only elements.
     */
    _containsOnlyElements : function (nodeList) {
        for ( var i = 0; i < nodeList.length; ++i) {
            if (nodeList.item(i).nodeType !== Node.ELEMENT_NODE) {
                return false;
            }
        }
        return true;
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.dom.EList";
    }
};
$extends(js.dom.EList, Object);

/**
 * EList iterator. {@link js.dom.EList} private implementation of iterator interface that iterate over EList"s
 * {@link js.dom.Element elements}.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * @constructor Construct EList iterator.
 * 
 * @param js.dom.EList elist parent elist.
 */
js.dom.EList.Iterator = function (elist) {
    /**
     * Parent EList instance on which this iterator operates.
     * 
     * @type js.dom.EList
     */
    this._elist = elist;

    /**
     * This iterator current index.
     * 
     * @type Number
     */
    this._index = 0;
};

js.dom.EList.Iterator.prototype = {
    /**
     * Returns true if the iteration has more {@link js.dom.Element elements}.
     * 
     * @return Boolean true if the iteration has more elements.
     */
    hasNext : function () {
        return this._index < this._elist.size();
    },

    /**
     * Get next element. Retrieve the next {@link js.dom.Element element} in the iteration.
     * 
     * @return js.dom.Element next element.
     */
    next : function () {
        return this._elist.item(this._index++);
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.dom.EList.Iterator";
    }
};
$extends(js.dom.EList.Iterator, Object);
$implements(js.dom.EList.Iterator, js.lang.Iterator);
$package("js.dom");

/**
 * File input control. Form control that allows for files uploading.
 * 
 * @author Iulian Rotaru
 * @constructor Construct file input instance.
 * 
 * @param js.dom.Document ownerDoc element owner document,
 * @param Node node native {@link Node} instance.
 * @assert <em>ownerDoc</em> argument is not undefined or null and is instance of {@link js.dom.Document}.
 */
js.dom.FileInput = function (ownerDoc, node) {
    $assert(this instanceof js.dom.FileInput, "js.dom.FileInput#FileInput", "Invoked as function.");
    this.$super(ownerDoc, node);
    $assert(node.nodeName.toLowerCase() === "input", "js.dom.FileInput#FileInput", "Node is not an input.");
    $assert(node.getAttribute("type") === "file", "js.dom.FileInput#FileInput", "Node is not a file.");
};

js.dom.FileInput.prototype = {
    /**
     * Disable file input value setter. Browsers forbid setting value for inputs of type file and for a good reason: a
     * malicious script can try to guess location on local filesystem and upload/overwrite sensitive files.
     * 
     * @param Object value unused value.
     * @assert always assert since this operation is not supported.
     */
    setValue : function (value) {
        $assert(false, "js.dom.FileInput#setValue", "Unsupported operation.");
    },

    /**
     * Overwrite form control item iterator to process files list. This method is a specialization of
     * {@link js.dom.Control#forEachItem(Function,Object...)}; item name is the file name and value is file itself.
     * 
     * @param Function callback callback function to be executed for every item,
     * @param Object... scope optional callback runtime scope, default to global scope.
     * @assert <code>callback</code> is a {@link Function} and <code>scope</code> is an {@link Object}, if present.
     */
    forEachItem : function (callback, scope) {
        $assert(js.lang.Types.isFunction(callback), "js.dom.FileInput#forEachItem", "Callback argument is not a function.");
        $assert(typeof scope === "undefined" || js.lang.Types.isStrictObject(scope), "js.dom.FileInput#forEachItem", "Scope argument is not an object.");

        var files = this._node.files;
        for ( var i = 0; i < files.length; ++i) {
            callback.call(scope || window, {
                name : files.item(i).name,
                value : files.item(i)
            });
        }
    },

    /**
     * Convenient files iterator. This method is a convenient alternative of {@link #forEachItem(Function,Object...)}
     * that uses {@link File} object as callback argument.
     * 
     * @param Function callback callback function to be executed for every file,
     * @param Object... scope optional callback runtime scope, default to global scope.
     * @assert <code>callback</code> is a {@link Function} and <code>scope</code> is an {@link Object}, if present.
     */
    forEachFile : function (callback, scope) {
        $assert(js.lang.Types.isFunction(callback), "js.dom.FileInput#forEachItem", "Callback argument is not a function.");
        $assert(typeof scope === "undefined" || js.lang.Types.isStrictObject(scope), "js.dom.FileInput#forEachItem", "Scope argument is not an object.");

        var files = this._node.files;
        for ( var i = 0; i < files.length; ++i) {
            callback.call(scope || window, files.item(i));
        }
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.dom.FileInput";
    }
};
$extends(js.dom.FileInput, js.dom.Control);
$package("js.dom");

/**
 * Form element. There are couple uses cases this class tries to cover:
 * <ol>
 * <li>Dumb Form - Synchronous, script-less form used to post rather plain data, for example login form,
 * <li>Post Data - Asynchronous post data from client to server - like posting a comment,
 * <li>File(s) Upload - Asynchronous upload single or multiple files,
 * <li>Mixed Form - Mix of post data and file(s) upload,
 * <li>Data Edit - Asynchronous load data from server, edit and save for standard CRUD operations.
 * </ol>
 * <p>
 * In the context of this class synchronous means server will return a resource and client need to render it, that is,
 * current page is replaced. The term is used in contrast with asynchronous {@link js.net.XHR}.
 * <p>
 * This class is specifically designed to be used with XHR for asynchronous form processing, see simplified sample code
 * below. Support to synchronous forms is almost not existent. This is not a limitation, is a conscious decision of good
 * practice. Page loading with all its chrome overhead is intrinsic not optimal and should be avoid. Anyway, if one
 * really needs to switch the page after form processing can simple use {@link js.ua.Window#assign(String, Object...)}.
 * 
 * <pre>
 *  var xhr = new js.net.XHR();
 *  xhr.on("progress", function(progress) {
 *      // uses progress.total and progress.loaded to update user interface
 *  });
 *  xhr.open("POST", "user-controller/upload-picture.xsp");
 *      
 *  var form = doc.getById("form");
 *  if(form.isValid()) {
 *      xhr.send(form);
 *  }
 * </pre>
 * 
 * Because XHR class uses browser support that properly encode the form using <code>multipart/form-data</code> it can
 * be used also to asynchronously upload files; it's enough to include {@link js.dom.FileInput} controls into the form.
 * Also XHR <code>progress</code> event is handy for form upload progress monitoring.
 * <p>
 * Form class also provides methods to initialize and retrieve control values from/to standard objects. This is useful
 * for data edit forms that loads form data from server, like in sample code below. On its turn getter can be handy for
 * form pre-processing before submit, see below.
 * 
 * <pre>
 *  comp.prj.Controller.getContract(contractId, function(contract) {
 *      form.setObject(contract);
 *  });
 * </pre>
 * 
 * <p>
 * There is an alternative way beside sending direct the form to server: retrieve form object using
 * {@link #getObject(Object...)} and send it as <code>application/json</code> using HTTP-RMI.
 * 
 * <pre>
 *  var contract = doc.getById("contract-form").getObject();
 *  // optional object pre-processing before sending on server
 *  comp.prj.Controller.saveContract(contract);
 * </pre>
 * 
 * Form validation - see {@link #isValid()}, delegates every control {@link js.dom.Control#isValid()} predicate that
 * updates its own <em>validity</em> state accordingly; after that, form uses event delegation to invoke
 * {@link js.dom.Control#focus()} which clean-up <em>validity</em> state when user focus on specific control. Finally,
 * note that this form encoding is silently forced to <code>multipart/form-data</code> and method to <code>POST</code>.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * @constructor Construct form data instance. Call super class constructor, initialize HTTP method and encoding type
 *              then register <code>focus</code> event {@link #_onFocus(js.event.Event) listener}.
 * @param js.dom.Document ownerDoc owner document,
 * @param Node node native node instance.
 * @assert assertions imposed by {@link js.dom.Element#Element(js.dom.Document, Node)}.
 */
js.dom.Form = function (ownerDoc, node) {
    $assert(this instanceof js.dom.Form, "js.dom.Form#Form", "Invoked as function.");
    this.$super(ownerDoc, node);
    this._node.method = js.net.Method.POST;
    this._setEnctype("multipart/form-data");

    // focus event does not bubble so we need to use capture to dispatch it first to this form element
    // on focus handler we take care to set focus on original target
    this.on("focus", this._onFocus, this, true);

    /**
     * This form controls iterable.
     * 
     * @type js.dom.ControlsIterable
     */
    this._iterable = new js.dom.ControlsIterable(this);
};

js.dom.Form.prototype = {
    /**
     * Initialize this form controls from the given object. For each control, hidden inputs included, tries to get a
     * value from given <code>object</code> using property path returned by {@link #_getOPPath(js.dom.Control)} and,
     * if there is one, set the control value. If value is found but null reset the control.
     * <p>
     * Form data convention is to use control name as object property path. In snippet below, input name is used as
     * object property path for {@link js.lang.OPP} that return wheel pressure value; after this method execution input
     * value will be <code>1.8</code>.
     * 
     * <pre>
     *  &lt;input name="wheels.1.pressure" /&gt;
     *  . . .
     *  var car = {
     *      wheels: [ 
     *      . . .
     *      {
     *          pressure: 1.8    
     *      }
     *      . . .
     *      ]
     *  };
     * </pre>
     * 
     * Because this method uses {@link js.lang.OPP} to retrieve values, given <code>object</code> argument can have
     * arbitrary complex graph, though the usual case is to use flat objects.
     * <p>
     * Finally, this method takes care to focus on first child control before returning.
     * 
     * @param Object object to get data from.
     * @return js.dom.Form this object.
     */
    setObject : function (object) {
        this._iterable.forEachAll(function (control) {
            var opp = this._getOPPath(control), value;
            if (opp !== null) {
                value = js.lang.OPP.get(object, opp);
                if (typeof value !== "undefined") {
                    control.setValue(value);
                }
            }
        }, this);
        return this.focus();
    },

    /**
     * Load object properties from this form controls. For each control, hidden inputs included, retrieve object
     * property path using {@link #_getOPPath(js.dom.Control)} and delegate
     * {@link js.lang.OPP#set(Object, String, Object)} to actually store formatted control value into object property.
     * Control value is that returned by {@link js.dom.Control#getValue()}.
     * <p>
     * For a discussion about mapping convention please see {@link #setObject(Object)}. Finally, if optional
     * <code>object</code> argument is missing a new object is created.
     * 
     * @param Object... object optional object to store value into.
     * @return Object initialized object.
     */
    getObject : function (object) {
        if (typeof object === "undefined") {
            object = {};
        }
        this._iterable.forEachAll(function (control) {
            var opp = this._getOPPath(control);
            if (opp !== null) {
                js.lang.OPP.set(object, opp, control.getValue());
            }
        }, this);
        return object;
    },

    /**
     * Get object property path associated with control. OPP, short for object property path is used by
     * {@link js.lang.OPP} utility to retrieve or store value from/to specified object property. Form data convention is
     * to use control name as OPP and arbitrary OPP length is supported. See {@link js.dom.Control#getName()} for
     * control name retrieval logic.
     * <p>
     * This method also implements logic for name conversion from HTTP like names to script case, e.g.
     * <code>user-name</code> become <code>userName</code>. Of course, if name is already script case is not
     * changed.
     * 
     * @param js.dom.Control control control to retrieve OPP from.
     * @return String object property path or null.
     */
    _getOPPath : function (control) {
        var name = control.getName();
        return name !== null ? js.util.Strings.toScriptCase(name) : null;
    },

    /**
     * Controls validation. For each control, hidden inputs excluded, invoke {@link js.dom.Control#isValid} and add
     * <code>invalid</code> CSS class if control validation fails. An empty control with <code>optional</code> CSS
     * class is considered valid. Anyway, if optional control has value aforementioned validation takes place.
     * 
     * @return Boolean true only if every single child control is valid.
     */
    isValid : function () {
        var valid = true;
        this._iterable.forEach(function (control) {
            valid = control.isValid() && valid;
        });
        return valid;
    },

    /**
     * Focus on first <code>autofocus</code> descendant control. Try to locate first control that have
     * <code>autofocus</code> attribute and apply {@link js.dom.Control#focus()} on it. If there are more
     * <code>autofocus</code> controls select the first found - in standard depth-first order and ignore the rest. If
     * no <code>autofocus</code> control found this method silently does nothing.
     * 
     * @return js.dom.Form this object.
     */
    focus : function () {
        var autofocusControl = this.getByCss("[autofocus]");
        if (autofocusControl !== null) {
            autofocusControl.focus();
        }
        return this;
    },

    /**
     * Get this form action.
     * 
     * @return String this form action or null.
     */
    getAction : function () {
        return this._node.action || null;
    },

    /**
     * Send this form synchronously. This method is a thin wrapper, it just delegates native form submit function.
     */
    submit : function () {
        this._node.submit();
    },

    /**
     * Reset all controls, excluding hidden inputs. Traverse all controls and invoke {@link js.dom.Control#reset()} for
     * every one. Also remove <code>invalid</code> CSS class. Note that hidden inputs are not affected. This may
     * depart from W3C specifications but is the de facto behavior. Finally, before returning this method takes care to
     * {@link #focus}.
     * 
     * @return js.dom.Form this object.
     */
    reset : function () {
        this._iterable.forEach(function (control) {
            control.reset();
        });
        return this.focus();
    },

    /**
     * Return built-in form data object initialized from this form controls. Although public, this method is intended to
     * be used internally by this library {@link XHR} implementation, especially handy for files upload. If argument of
     * {@link XMLHttpRequest#send(Object...)} method is of type {@link FormData} the user agent knows to create an
     * asynchronous HTTP request encoded <code>multipart/form-data</code>.
     * <p>
     * Note that returned form data fields are normalized, i.e. converted to string representation acceptable by server
     * side logic. For example {@link Date} is represented as ISO8601 string.
     * 
     * @return FormData initialized native form data.
     */
    toFormData : function () {
        /**
         * Convert <code>value</code> to string representation acceptable by server side logic. For example date is
         * representation by ISO8601 string.
         * 
         * @param Object value to normalize.
         * @returns normalized value.
         */
        function normalize (value) {
            if (value instanceof Date) {
                value = js.lang.JSON.stringify(value);
                if (value.charAt(0) === '"') {
                    value = value.substr(1, value.length - 2);
                }
            }
            return value;
        }

        var formData = new FormData();
        this._iterable.forEachAll(function (control) {
            control.forEachItem(function (item) {
                formData.append(item.name, normalize(item.value));
            }, this);
        });
        return formData;
    },

    /**
     * Add hidden named value to this form. If child control with given <code>name</code> already exists just set its
     * value, overriding the existing one. Otherwise creates a hidden input with given <code>name</code> and
     * <code>value</code> and insert it as first child of this form.
     * 
     * @param String name control name,
     * @param String value control value.
     * @return js.dom.Control created or updated hidden control.
     */
    addHidden : function (name, value) {
        var hidden = this.getByCss("input[name='%s']", name);
        if (hidden !== null) {
            hidden.setValue(value);
            return hidden;
        }
        hidden = this._ownerDoc.createElement("input", "type", "hidden", "name", name, "value", value);
        var el = this.getFirstChild();
        if (el !== null) {
            el.insertBefore(hidden);
        }
        else {
            this.addChild(hidden);
        }
        return hidden;
    },

    /**
     * Remove named hidden control. Control to be removed, identified by <code>name</code> should exist and of type
     * hidden. Otherwise assertion is thrown; if assertions are disabled and mentioned conditions are not met this
     * method does nothing.
     * 
     * @param String name hidden control name.
     * @return js.dom.Form this object.
     * @assert named control exists and is of type hidden.
     */
    removeHidden : function (name) {
        var hidden = this.getByCss("input[name='%s']", name);
        $assert(hidden !== null, "js.dom.Form#removeHidden", "Hidden control |%s| not found.", name);
        if (hidden == null) {
            return this;
        }
        var type = hidden.getAttr("type");
        $assert(type === "hidden", "js.dom.Form#removeHidden", "Invalid control |%s| type. Expected hidden but got |%s|.", name, type);
        if (type !== "hidden") {
            return this;
        }
        hidden.remove();
        return this;
    },

    /**
     * This form event delegate for <code>focus</code> DOM event. Focus event listener registered to this form and
     * configured for <code>capture</code> propagation. Because <code>focus</code> event does not bubble we need to
     * use capture in order to dispatch event directly to this event listener. This method uses
     * {@link js.event.Event#target} to acquire a reference to focused child control then ensure <code>invalid</code>
     * CSS class is removed and takes care to set focus on original control.
     * 
     * @param js.event.Event ev focus event.
     */
    _onFocus : function (ev) {
        ev.target.focus();
    },

    /**
     * Form encoding setter. This method is for internal use only. Form data does not allows for encoding change since
     * always use <code>multipart/form-data</code>.
     * 
     * @param String enctype encoding type, always <code>multipart/form-data</code>.
     * @assert encoding type is <code>multipart/form-data</code>
     */
    _setEnctype : function (enctype) {
        $assert(enctype === "multipart/form-data", "js.dom.Form#_setEnctype", "Form supports only multipart/form-data.");
        this._node.enctype = enctype;
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.dom.Form";
    }
};
$extends(js.dom.Form, js.dom.Element);

$legacy(js.ua.Engine.TRIDENT, function () {
    js.dom.Form.prototype._setEnctype = function (enctype) {
        this._node.encoding = enctype;
        return this;
    };
});
$package('js.dom');

/**
 * Inner frame.
 * 
 * @author Iulian Rotaru
 * @constructor Construct inner frame instance.
 * 
 * @param js.dom.Document ownerDoc, element owner document,
 * @param Node node, native {@link Node} instance.
 * @assert <em>ownerDoc</em> argument is not undefined or null and is instance of {@link js.dom.Document}.
 */
js.dom.IFrame = function(ownerDoc, node) {
	$assert(this instanceof js.dom.IFrame, 'js.dom.IFrame#IFrame', 'Invoked as function.');
	this.$super(ownerDoc, node);

	/**
	 * This inner frame window.
	 * 
	 * @type js.ua.Window
	 */
	this._window = null;

	/**
	 * This inner frame document.
	 * 
	 * @type js.dom.Document
	 */
	this._innerDoc = null;
};

js.dom.IFrame.prototype = {
	/**
	 * Set this inner frame source.
	 * 
	 * @return this pointer.
	 */
	setSrc : function(src) {
		this._node.src = src;
		return this;
	},

	/**
	 * Get this inner frame source.
	 * 
	 * @return this inner frame source.
	 */
	getSrc : function() {
		return this._node.src;
	},

	/**
	 * Get this inner frame window.
	 * 
	 * @return js.ua.Window this inner frame window.
	 */
	getWindow : function() {
		if (this._window == null) {
			this._window = new js.ua.Window(this._ownerDoc.getParentWindow(), this._node.contentWindow);
		}
		return this._window;
	},

	/**
	 * Get this inner frame document.
	 * 
	 * @return js.dom.Document this inner frame document.
	 */
	getInnerDoc : function() {
		if (this._innerDoc == null) {
			this._innerDoc = new js.dom.Document(this._node.contentWindow.document);
		}
		return this._innerDoc;
	},

	/**
	 * Get this inner frame location.
	 * 
	 * @return String this inner frame location.
	 */
	getLocation : function() {
		return this._node.contentWindow.location.toString();
	},

	/**
	 * Returns a string representation of the object.
	 * 
	 * @return String object string representation.
	 */
	toString : function() {
		return 'js.dom.IFrame';
	}
};
$extends(js.dom.IFrame, js.dom.Element);
$package('js.dom');

/**
 * Image element. Wrapper for HTML <em>img</em> tag, this class takes care to properly handle empty image sources that
 * can lead to strange behavior on browser considering empty URL as current page. It also contains a
 * {@link #_TRANSPARENT_DOT} used to nullify image content and {@link js.dom.Element#_format} handy for relative source
 * translations.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * @constructor Construct image element instance.
 * 
 * @param js.dom.Document ownerDoc owner document,
 * @param Node node native {@link Node} instance.
 * @assert <em>node</em> argument should be of <em>img</em> type.
 */
js.dom.Image = function (ownerDoc, node) {
    $assert(this instanceof js.dom.Image, 'js.dom.Image#Image', 'Invoked as function.');
    this.$super(ownerDoc, node);
    $assert(node.nodeName.toLowerCase() === 'img', 'js.dom.Image#Image', 'Node is not an image.');
};

js.dom.Image.prototype = {
    /**
     * Transparent dot stored using data URI scheme.
     * 
     * @type String
     */
    _TRANSPARENT_DOT : 'data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',

    /**
     * Clear image. There are times when need to empty an image, e.g. when part of a form that is reset. But we can't
     * simply erase image src because some browsers will display that missing image icon or worst will consider empty
     * src as current page. In order to have an working image reset we use a {@link #_TRANSPARENT_DOT}.
     * 
     * @return js.html.Image this object.
     */
    reset : function () {
        this._node.src = this._TRANSPARENT_DOT;
        return this;
    },

    /**
     * Set this image source. Set image source but takes care of empty values. There are browsers that consider empty
     * <em>src</em> as current page. As a consequence browser tries to load as image content the current page
     * resulting in multiple server side controller invocation for a single page. This may confuse server logic and
     * increases resources consumption. If given <em>src</em> is undefined, null, empty or contains only white spaces
     * delegates {@link #reset}.
     * <p>
     * Also if this image has a {@link js.dom.Element#_format formatter} uses it to preproces image source. This may be
     * handy when use relative sources and format add host part, but not limited to.
     * 
     * @param String src image source to set.
     * @return js.html.Image this object.
     */
    setSrc : function (src) {
        if (!src || /^\s+|(?:&nbsp;)+$/g.test(src)) {
            return this.reset();
        }
        if (this._format !== null) {
            src = this._format.format(src);
        }
        this._node.src = src;
        return this;
    },

    /**
     * Get image source. Please note that this method does not necessarily return the value of <em>src</em> attribute;
     * full URL is reasonable to expect even if <em>src</em> attribute is relative.
     * 
     * @return String this image source.
     */
    getSrc : function () {
        return this._node.src;
    },

    /**
     * Set this image width, in pixels.
     * 
     * @param Number width image width in pixels.
     * @return js.dom.Image this object.
     */
    setWidth : function (width) {
        $assert(js.lang.Types.isNumber(width), "js.dom.Image#setWidth", "Width attribute is not a number.");
        return this.setAttr("width", width.toString());
    },

    /**
     * Set this image height, in pixels.
     * 
     * @param Number height image height in pixels.
     * @return js.dom.Image this object.
     */
    setHeight : function (height) {
        $assert(js.lang.Types.isNumber(height), "js.dom.Image#setHeight", "Height attribute is not a number.");
        return this.setAttr("height", height.toString());
    },

    /**
     * Reload image from server. Force image reloading. In order to circumvent user agent cache this method adds a
     * random string to image source, like in snippet below:
     * 
     * <pre>
     * 	img/users/default.png?q1w2e3r4
     * </pre>
     * 
     * Please note that image source URL query part is overwritten, if exists.
     * 
     * @param String src image source URL to reload content from.
     * @return js.html.Image this object.
     * @assert image source is not undefined, null or empty.
     */
    reload : function (src) {
        $assert(src, "js.dom.Image#reload", "Image source is undefined, null or empty.");
        var i = src.indexOf('?');
        if (i !== -1) {
            src = src.substring(0, i);
        }
        this._node.src = src + '?' + Math.random().toString(36).substr(2);
        return this;
    },

    /**
     * Test if this image is valid. An image is valid if it has a source and that source is not the
     * {@link #_TRANSPARENT_DOT transparent dot}.
     * 
     * @return true is this image is valid.
     */
    isValid : function () {
        return this._node.src && this._node.src !== this._TRANSPARENT_DOT;
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return 'js.dom.Image';
    }
};
$extends(js.dom.Image, js.dom.Element);
$package("js.dom");

/**
 * Library private node utility. This utility class provides low level DOM nodes and back-reference handling methods.
 * Back-reference is the only augmentation j(s)-lib operates on native DOM {@link Node nodes} and is used to keep track
 * of associated {@link js.dom.Element}; this allows for bi-directional navigation between node and element.
 * 
 * <pre>
 * 	var el = getElement(); // retrieve an element from document tree
 *	var node = el.getNode(); // access underlying native node from j(s)-lib element
 *	. . .
 *	var el = js.dom.Node.getElement(node); // get node wrapper element, if any
 * </pre>
 * 
 * Although methods of this utility class are public it is designed for this library internal use and using it from user
 * space code is not recommended.
 */
js.dom.Node = {
    /**
     * Node's back-reference. Back reference is the only extension of native DOM {@link Node} used to identify the
     * element wrapping the node.
     * 
     * @type String
     */
    _BACK_REF : "__js_element__",

    /**
     * Set node element. This method is called from inside element constructor to create node-element binding, i.e. the
     * back-reference.
     * 
     * @param Node node native DOM node,
     * @param js.dom.Element el element to bind to node.
     * @throws TypeError if <code>node</code> argument is not defined or null.
     */
    setElement : function (node, el) {
        $assert(node.nodeType === Node.ELEMENT_NODE, "js.dom.Node#setElement", "Node is not element.");
        node[js.dom.Node._BACK_REF] = el;
    },

    /**
     * Retrieve node element. Get given node attached element. This getter returns null if given node has no element
     * attached. Note that node-element binding is lazily performed on element creation via a getter or finder method
     * from {@link js.dom.Document} or {@link js.dom.Element} and persist for entire Node's life.
     * 
     * @param Node node native DOM node.
     * @return js.dom.Element element attached to given node or null.
     * @throws TypeError if <code>node</code> argument is not defined or null.
     */
    getElement : function (node) {
        $assert(node.nodeType === Node.ELEMENT_NODE, "js.dom.Node#getElement", "Node is not element.");
        var el = node[js.dom.Node._BACK_REF];
        return el ? el : null;
    },

    /**
     * Remove back-reference. A back-reference is the binding from node to wrapping element; this method just delete it.
     * If given node has no element attached this method does nothing.
     * 
     * @param Node node native DOM node.
     * @throws TypeError if <code>node</code> argument is not defined or null.
     */
    removeBackRef : function (node) {
        $assert(node.nodeType === Node.ELEMENT_NODE, "js.dom.Node#removeBackRef", "Node is not element.");
        if (node[js.dom.Node._BACK_REF]) {
            delete node[js.dom.Node._BACK_REF];
        }
    },

    /**
     * Custom attribute used to store element's class.
     * 
     * @type String
     */
    _DATA_CLASS : "data-class",

    /**
     * Custom attribute used to store element's format class.
     * 
     * @type String
     */
    _DATA_FORMAT : "data-format",

    /**
     * Register element class or format to selected node(s).
     * 
     * @param Object context {@link Document} or {@link Node} used by selectors as search context,
     * @param String selectors comma separated selectors,
     * @param String className element or format class name.
     * @assert all arguments are not undefined, null or empty and of proper type.
     */
    bind : function (context, selectors, className) {
        $assert(js.lang.Types.isObject(context), "js.dom.Node#bind", "Context is not and object.");
        $assert(js.lang.Types.isString(selectors), "js.dom.Node#bind", "Selectors is not a string.");
        if (arguments.length === 2) {
            // undocumented case for library internal use only
            // bind element class to node but only if there is no one already registered
            var node = context;
            var clazz = selectors;
            if (!node.getAttribute(js.dom.Node._DATA_CLASS)) {
                node.setAttribute(js.dom.Node._DATA_CLASS, clazz);
            }
            return;
        }

        $assert(js.lang.Types.isString(className), "js.dom.Node#bind", "Class name is not a string.");
        var clazz = js.lang.Class.forName(className);

        var datasetName;
        if (js.lang.Types.isElement(clazz)) {
            datasetName = this._DATA_CLASS;
        }
        else {
            // if type is not an js.dom.Element it should be a formatter
            datasetName = this._DATA_FORMAT;
        }
        var nodeList = this.querySelectorAll(context, selectors);
        for (var i = 0; i < nodeList.length; ++i) {
            nodeList.item(i).setAttribute(datasetName, className);
        }
    },

    /**
     * Set the class name for given node element.
     * 
     * @param Node node native DOM node to set class name to,
     * @param String className fully qualified class name.
     */
    setElementClassName : function (node, className) {
        node.setAttribute(this._DATA_CLASS, className);
    },

    /**
     * Retrieve node element class name or null.
     * 
     * @param Node node native DOM node to get element class name for.
     * @return element class name or null.
     */
    getElementClassName : function (node) {
        var className = node.getAttribute(this._DATA_CLASS);
        return className ? className : null;
    },

    /**
     * Get node format name. Return null if this node has no format configured.
     * 
     * @param Node node native DOM node to get format for.
     * @return format name or null.
     */
    getFormatName : function (node) {
        var formatName = node.getAttribute(this._DATA_FORMAT);
        return formatName ? formatName : null;
    },

    /**
     * Retrieve first Node's child of given type. Search for a child of specified type and return first encountered.
     * Returns null if no children of requested type found. Also returns null if <code>node</code> argument is not
     * defined or null.
     * 
     * @param Node node native DOM node to search for children,
     * @param Number nodeType node type constant.
     * @return Node first child of requested type or null.
     * @assert both arguments are not undefined or null.
     */
    firstChild : function (node, nodeType) {
        $assert(node, "js.dom.Node#firstChild", "Node is undefined or null.");
        $assert(nodeType, "js.dom.Node#firstChild", "Node type is undefined or null.");
        return node ? js.dom.Node._getNeighbor(node.firstChild, nodeType || Node.ELEMENT_NODE, "next") : null;
    },

    /**
     * Get first element child. Returns first child node of type Node.ELEMENT_NODE or null if none found. Also returns
     * null if <code>node</code> argument is not defined or null.
     * 
     * @param Node node native DOM node to search for elements.
     * @return Node first child element or null.
     * @assert <code>node</code> argument is not undefined or null.
     */
    firstElementChild : function (node) {
        $assert(node, "js.dom.Node#firstElementChild", "Node is undefined or null.");
        return node ? node.firstElementChild : null;
    },

    /**
     * Retrieve last Node's child of given type. Search for a child of specified type and return the last encountered.
     * Returns null if no children of requested type found or <code>node</code> argument is not defined or null.
     * 
     * @param Node node native DOM node to search for children.
     * @param Number nodeType node type constant.
     * @return Node last child of requested type or null.
     * @assert <code>node</code> argument is not undefined or null.
     */
    lastChild : function (node, nodeType) {
        $assert(node, "js.dom.Node#lastChild", "Node is undefined or null.");
        $assert(nodeType, "js.dom.Node#lastChild", "Node type is undefined or null.");
        return node ? js.dom.Node._getNeighbor(node.lastChild, nodeType || Node.ELEMENT_NODE, "previous") : null;
    },

    /**
     * Get last element child. Returns last child node of type ELEMENT_NODE or null if none found. Also returns null if
     * <code>node</code> argument is not defined or null.
     * 
     * @param Node node native DOM node to search for elements.
     * @return Node last child element or null.
     * @assert <code>node</code> argument is not undefined or null.
     */
    lastElementChild : function (node) {
        $assert(node, "js.dom.Node#lastElementChild", "Node is undefined or null.");
        return node ? node.lastElementChild : null;
    },

    /**
     * Retrieve next Node's sibling of given type. Search forward for a sibling of specified type and return the first
     * encountered. Returns null if no siblings of requested type found or <code>node</code> argument is not defined
     * or null.
     * 
     * @param Node node native DOM node to search siblings for.
     * @param Number nodeType optional node type constant, default to ELEMENT_NODE.
     * @return Node next sibling of requested type or null.
     * @assert <code>node</code> argument is not undefined or null.
     */
    nextSibling : function (node, nodeType) {
        $assert(node, "js.dom.Node#nextSibling", "Node is undefined or null.");
        $assert(nodeType, "js.dom.Node#nextSibling", "Node is undefined or null.");
        return node ? js.dom.Node._getNeighbor(node.nextSibling, nodeType || Node.ELEMENT_NODE, "next") : null;
    },

    /**
     * Get next sibling element.
     * 
     * @param Node node native DOM node to search siblings for.
     */
    nextElementSibling : function (node) {
        $assert(node, "js.dom.Node#nextElementSibling", "Node is undefined or null.");
        return node ? node.nextElementSibling : null;
    },

    /**
     * Retrieve previous Node's sibling of given type. Search backward for a sibling of specified type and return the
     * first encountered. Returns null if no siblings of requested type found or <code>node</code> argument is not
     * defined or null.
     * 
     * @param Node node native DOM node to search siblings for.
     * @param Number nodeType node type constant.
     * @return Node previous sibling of requested type or null.
     * @assert <code>node</code> argument is not undefined or null.
     */
    previousSibling : function (node, nodeType) {
        $assert(node, "js.dom.Node#previousSibling", "Node is undefined or null.");
        $assert(nodeType, "js.dom.Node#previousSibling", "Node type is undefined or null.");
        return node ? js.dom.Node._getNeighbor(node.previousSibling, nodeType || Node.ELEMENT_NODE, "previous") : null;
    },

    /**
     * Get previous sibling element or null.
     * 
     * @param Node node native DOM node to search siblings for.
     * @return Node previous element or null.
     */
    previousElementSibling : function (node) {
        $assert(node, "js.dom.Node#previousElementSibling", "Node is undefined or null.");
        return node ? node.previousElementSibling : null;
    },

    /**
     * Get child elements count for given node. Note that this method counts only node of element type.
     * 
     * @param Node node native DOM node.
     * @assert <code>node</code> argument is not undefined or null.
     * @return child elements count.
     */
    childElementCount : function (node) {
        $assert(node, "js.dom.Node#childElementCount", "Node is undefined or null.");
        return node.childElementCount;
    },

    /**
     * Test if node has children of specified type. Search for a child of specified type and return true at first
     * encountered. Returns false if no children of requested type or <code>node</code> argument is not defined or
     * null.
     * 
     * @param Node node native DOM node to test for children.
     * @param Number nodeType optional node type constant, default to Node.ELEMENT_NODE.
     * @return Boolean true if node has at least a child of specified type.
     * @assert <code>node</code> argument is not undefined or null.
     */
    hasChildren : function (node, nodeType) {
        $assert(node, "js.dom.Node#hasChildren", "Node is undefined or null.");
        if (!node) {
            return false;
        }
        return js.dom.Node.firstChild(node, nodeType || Node.ELEMENT_NODE) !== null;
    },

    /**
     * Get first descendant node element by object class. Returns first descendant node element identifiable by given
     * object class. Returns null if given <code>clazz</code> argument is not defined, null or empty.
     * 
     * @param Object context {@link Document} or {@link Node} used as search context,
     * @param Object clazz class name or constructor for class to search for.
     * @return Node found native node element or null.
     * @assert both arguments are not undefined or null and <code>clazz</code> is {@link Function} or {@link String}.
     */
    getElementByClass : function (context, clazz) {
        $assert(context, "js.dom.Node#getElementsByClass", "Context is undefined or null.");
        $assert(clazz, "js.dom.Node#getElementsByClass", "Object class argument is undefined or null.");
        $assert(js.lang.Types.isFunction(clazz) || js.lang.Types.isString(clazz), "js.dom.Element#getByClass", "Object class argument is not function or string.");

        var className = js.lang.Types.isFunction(clazz) ? clazz.prototype.toString() : clazz;
        return js.dom.Node.querySelector(context, "[data-class='" + className + "']");
    },

    /**
     * Get child nodes with given tag name. Returns a <em>live</em> nodes list filled with descendants of given tag.
     * Returned nodes list is empty if there is no descendant of given tag or <code>node</code> argument is not
     * defined or null.
     * 
     * @param Object context {@link Document} or {@link Node} used as search context,
     * @param String tag tag name to search for.
     * @return NodeList node list, possible empty.
     * @assert both arguments are not undefined or null.
     */
    getElementsByTagName : function (context, tag) {
        $assert(context, "js.dom.Node#getElementsByTagName", "Context is undefined or null.");
        $assert(tag, "js.dom.Node#getElementsByTagName", "Tag is undefined, null or empty.");
        return context && tag ? context.getElementsByTagName(tag) : new js.dom.NodeList();
    },

    /**
     * Get elements with CSS class. Returns a list of elements possessing requested CSS class. Search is performed in a
     * given context, document or a root node. Return an empty list if <code>context</code> argument is undefined or
     * null or there is no element with requested class.
     * 
     * @param Object context {@link Document} or {@link Node} used as search context,
     * @param String cssClass CSS class to search for.
     * @return NodeList list of found elements, possible empty.
     * @assert both arguments are not undefined, null or empty.
     */
    getElementsByClassName : function (context, cssClass) {
        $assert(context, "js.dom.Node#getElementsByClassName", "Context is undefined or null.");
        if (!context) {
            return new js.dom.NodeList();
        }
        $assert(cssClass, "js.dom.Node#getElementsByClassName", "CSS class is undefined, null or empty.");
        $assert(typeof context.getElementsByClassName === "function", "js.dom.Node#getElementsByClassName", "Get elements by class name not supported.");
        return context.getElementsByClassName(cssClass);
    },

    /**
     * Retrieve first node matching CSS selectors or null.
     * 
     * @param Object context {@link Document} or {@link Node} used as search context,
     * @param String selectors comma separated list of selectors.
     * @return Node found node or null.
     */
    querySelector : function (context, selectors) {
        $assert(context, "js.dom.Node#querySelector", "Context is undefined or null.");
        if (!context) {
            return null;
        }
        $assert(selectors, "js.dom.Node#querySelector", "Selectors is undefined, null or empty.");
        if (!selectors) {
            return null;
        }
        $assert(typeof context.querySelector !== "undefined", "js.dom.Node#querySelector", "Unsupported query selector.");
        try {
            return context.querySelector(selectors);
        } catch (e) {
            // apparently querySelector throws exception only for syntax error on selectors
            // excerpt from MDN: Throws a SYNTAX_ERR exception if the specified group of selectors is invalid.
            $assert(false, "js.dom.Node#querySelector", "bad selectors: ", selectors);
            return null;
        }
    },

    /**
     * Retrieve all nodes matching CSS selectors, possible empty list.
     * 
     * @param Object context {@link Document} or {@link Node} used as search context,
     * @param String selectors comma separated list of selectors.
     * @return NodeList list of found nodes, possible empty.
     */
    querySelectorAll : function (context, selectors) {
        $assert(context, "js.dom.Node#querySelectorAll", "Context is undefined or null.");
        if (!context) {
            return new js.dom.NodeList();
        }
        $assert(selectors, "js.dom.Node#querySelectorAll", "Selectors is undefined, null or empty.");
        if (!selectors) {
            return new js.dom.NodeList();
        }
        $assert(typeof context.querySelectorAll !== "undefined", "js.dom.Node#querySelectorAll", "Unsupported query selector all.");
        try {
            return context.querySelectorAll(selectors);
        } catch (e) {
            // apparently querySelectorAll throws exception only for syntax error on selectors
            // excerpt from MDN: Throws a SYNTAX_ERR exception if the specified group of selectors is invalid.
            $assert(false, "js.dom.Node#querySelectorAll", "bad selectors: ", selectors);
            return new js.dom.NodeList();
        }
    },

    /**
     * Get neighbor sibling. Try to retrieve next or previous sibling of specified node type, searching in given
     * direction and starting from specified node. Starting node is considered as candidate. This means if it happens to
     * be of given type and predicate, if present, accept it then the <code>node</code> will be the returned value.
     * Returns null if <code>node</code> is undefined or null or no suitable siblings found in given direction.
     * 
     * <p>
     * If <code>predicate</code> is present is tested for every matching node and node actually accepted only if
     * predicate returns true. Predicate signature should be:
     * 
     * <pre>
     * 	Boolean predicate(Node node)
     * </pre>
     * 
     * @param Node node starting node,
     * @param Number nodeType node type constant,
     * @param String direction iteration direction, i.e. "next" or "previous",
     * @param Function predicate optional function returning a Boolean.
     * @return Node next or previous sibling of given node type or null.
     */
    _getNeighbor : function (node, nodeType, direction, predicate) {
        if (!predicate) {
            predicate = function () {
                return true;
            };
        }
        while (!!node) {
            if (node.nodeType === nodeType && predicate(node)) {
                return node;
            }
            node = node[direction + "Sibling"];
        }
        return null;
    },

    /**
     * Get node string representation.
     * 
     * @param Node node native DOM node.
     * @return String node string representation.
     */
    toString : function (node) {
        if (!node) {
            return "undefined node";
        }
        var s = node.nodeName.toLowerCase();
        if (s === "input") {
            s += ("[" + node.getAttribute("type") + "]");
        }
        return s;
    }
};

/**
 * Node's children iterator. Iterates child nodes of type {@link Node.ELEMENT_NODE}.
 * 
 * @constructor Construct {@link Node node}"s iterator.
 * 
 * @param Node node parent node.
 * @assert <code>node</code> argument is not undefined or null.
 */
js.dom.Node.Iterator = function (node) {
    $assert(node, "js.dom.Node.Iterator#Iterator", "Node is undefined or null.");

    /**
     * Current child node.
     * 
     * @type Node
     */
    this._child = js.dom.Node._getNeighbor(node ? node.firstChild : null, Node.ELEMENT_NODE, "next");
};

js.dom.Node.Iterator.prototype = {
    /**
     * Test if this iterator has more items to iterate. If this predicate returns true {@link #next()} is guaranteed to
     * return valid item.
     * 
     * @return Boolean true if there are more items to iterate.
     */
    hasNext : function () {
        return this._child !== null;
    },

    /**
     * Gets next item from this iterator and advances to the next.
     * 
     * @return Node node instance.
     */
    next : function () {
        if (this._child == null) {
            return null;
        }
        var node = this._child;
        this._child = js.dom.Node._getNeighbor(this._child.nextSibling, Node.ELEMENT_NODE, "next");
        return node;
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.dom.Node.Iterator";
    }
};
$extends(js.dom.Node.Iterator, Object);
$implements(js.dom.Node.Iterator, js.lang.Iterator);

/**
 * Define Node constants, if missing.
 */
$legacy(typeof Node === "undefined", function () {
    Node = {
        ELEMENT_NODE : 1,
        ATTRIBUTE_NODE : 2,
        TEXT_NODE : 3,
        CDATA_SECTION_NODE : 4,
        ENTITY_REFERENCE_NODE : 5,
        ENTITY_NODE : 6,
        PROCESSING_INSTRUCTION_NODE : 7,
        COMMENT_NODE : 8,
        DOCUMENT_NODE : 9,
        DOCUMENT_TYPE_NODE : 10,
        DOCUMENT_FRAGMENT_NODE : 11,
        NOTATION_NODE : 12
    };
});

/**
 * IE XML Node does not allow for augmentation so we cannot store j(s)-lib Element back reference as Node property. For
 * such condition we use a back references map that stores W3C DOM Node to j(s)-lib Element relation. Uses Node id as
 * hash code.
 */
$legacy(js.ua.Engine.TRIDENT, function () {
    js.dom.Node._backRefs = {};

    js.dom.Node.setElement = function (node, el) {
        try {
            node[js.dom.Node._BACK_REF] = el;
        } catch (e) {
            var backRef = node.getAttribute("data-back-ref");
            if (!backRef) {
                backRef = js.util.ID();
                node.setAttribute("data-back-ref", backRef);
            }
            js.dom.Node._backRefs[backRef] = el;
        }
    };

    js.dom.Node.getElement = function (node) {
        var el = node[js.dom.Node._BACK_REF];
        if (typeof el !== "undefined") {
            return el;
        }
        $assert(node.nodeType === Node.ELEMENT_NODE, "js.dom.Node#getElement", "Node is not element.");
        if (node.nodeType !== Node.ELEMENT_NODE) {
            return null;
        }
        var backRef = node.getAttribute("data-back-ref");
        if (!backRef) {
            return null;
        }
        el = js.dom.Node._backRefs[backRef];
        return el ? el : null;
    };

    js.dom.Node.removeBackRef = function (node) {
        if (node[js.dom.Node._BACK_REF]) {
            delete node[js.dom.Node._BACK_REF];
            return;
        }
        var backRef = node.getAttribute("data-back-ref");
        if (backRef && js.dom.Node._backRefs[backRef]) {
            delete js.dom.Node._backRefs[backRef];
        }
    };
});

/**
 * It seems IE returns comments node too when searching for wildcard tag name, i.e. "*" We need to avoid iterating over
 * comments node, n"est-ce pa?
 */
$legacy(js.ua.Engine.TRIDENT, function () {
    js.dom.Node.getElementsByTagName = function (node, tag) {
        $assert(node, "js.dom.Node#getElementsByTagName", "Node is undefined or null.");
        $assert(tag, "js.dom.Node#getElementsByTagName", "Tag is undefined, null or empty.");
        if (!node || !tag) {
            return new js.dom.NodeList();
        }
        if (tag !== "*") {
            return node.getElementsByTagName(tag);
        }
        // it seems IE includes comment nodes when get elements by wild card
        var nodeList = node.getElementsByTagName("*"), result = new js.dom.NodeList();
        for (var i = 0; i < nodeList.length; i++) {
            node = nodeList.item(i);
            if (node.nodeType === Node.ELEMENT_NODE) {
                result.push(node);
            }
        }
        return nodeList;
    };
});

/**
 * IE8 does not support Node child element related methods and getter by CSS class.
 */
$legacy(js.ua.Engine.TRIDENT, function () {
    js.dom.Node.firstElementChild = function (node) {
        $assert(node);
        return node ? js.dom.Node._getNeighbor(node.firstChild, Node.ELEMENT_NODE, "next") : null;
    };

    js.dom.Node.lastElementChild = function (node) {
        $assert(node, "js.dom.Node#lastElementChild", "Node is undefined or null.");
        return node ? js.dom.Node._getNeighbor(node.lastChild, Node.ELEMENT_NODE, "previous") : null;
    };

    js.dom.Node.nextElementSibling = function (node) {
        $assert(node, "js.dom.Node#nextElementSibling", "Node is undefined or null.");
        return node ? js.dom.Node._getNeighbor(node.nextSibling, Node.ELEMENT_NODE, "next") : null;
    };

    js.dom.Node.previousElementSibling = function (node) {
        $assert(node, "js.dom.Node#previousElementSibling", "Node is undefined or null.");
        return node ? js.dom.Node._getNeighbor(node.previousSibling, Node.ELEMENT_NODE, "previous") : null;
    };

    js.dom.Node.childElementCount = function (node) {
        $assert(node, "js.dom.Node#childElementCount", "Node is undefined or null.");
        var child = this.firstElementChild(node);
        var count = 0;
        while (child !== null) {
            ++count;
            child = this.nextElementSibling(child);
        }
        return count;
    };

    js.dom.Node.getElementsByClassName = function (node, cssClass) {
        $assert(node, "js.dom.Node#getElementsByClassName", "Node is undefined or null.");
        $assert(cssClass, "js.dom.Node#getElementByClassName", "CSS class is undefined, null or empty.");
        return node && cssClass ? node.querySelectorAll("." + cssClass) : new js.dom.NodeList();
    };
});
$package('js.dom');

/**
 * Node list.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * @constructor Construct node list.
 * 
 * @param Array array
 */
js.dom.NodeList = function (array) {
    var nodeList = typeof array !== 'undefined' ? array : [];

    nodeList.item = function (index) {
        return this[index];
    };

    return nodeList;
};
$extends(js.dom.NodeList, Object);
$package('js.dom');

/**
 * Radio option.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * @constructor Construct radio option instance.
 * 
 * @param js.dom.Document ownerDoc element owner document,
 * @param Node node native {@link Node} instance.
 * @assert <em>ownerDoc</em> argument is not undefined or null and is instance of {@link js.dom.Document} and
 *         <em>node</em> is an input of type checkbox.
 */
js.dom.Radio = function(ownerDoc, node) {
	$assert(this instanceof js.dom.Radio, 'js.dom.Radio#Radio', 'Invoked as function.');
	this.$super(ownerDoc, node);
	$assert(node.nodeName.toLowerCase() === 'input', 'js.dom.Radio#Radio', 'Node is not an input.');
	$assert(node.getAttribute('type') === 'radio', 'js.dom.Radio#Radio', 'Node is not a checkbox.');
};

js.dom.Radio.prototype = {
	setValue : function(value) {
		this._node.checked = (this._node.value === value);
		return this;
	},

	/**
	 * Returns a string representation of the object.
	 * 
	 * @return String object string representation.
	 */
	toString : function() {
		return 'js.dom.Radio';
	}
};
$extends(js.dom.Radio, js.dom.Checkbox);
$package('js.dom');

/**
 * Select element.
 * 
 * @author Iulian Rotaru
 * @constructor Construct select element instance.
 * 
 * @param js.dom.Document ownerDoc, element owner document,
 * @param Node node, native {@link Node} instance.
 * @assert <em>ownerDoc</em> argument is not undefined or null and is instance of {@link js.dom.Document}.
 */
js.dom.Select = function (ownerDoc, node) {
    $assert(this instanceof js.dom.Select, 'js.dom.Select#Select', 'Invoked as function.');
    this.$super(ownerDoc, node);
    $assert(node.nodeName.toLowerCase() === 'select', 'js.dom.Select#Select', 'Node is not a select.');

    /**
     * Custom events. Current implementation uses only a single custom event named <em>updated</em>. It is fired
     * whenever this select is changed due to loading, set options or selected option changed. It has a single argument:
     * currently selected option object with next properties: <em>value</em>, <em>text</em> and <em>data</em>.
     * First two are standard option properties whereas <em>data</em> is a reference to user defined object associated
     * with option.
     * 
     * @type js.event.CustomEvents
     */
    this._events = this.getCustomEvents();
    this._events.register("updated");

    this.on("change", this._onChange, this);
};

js.dom.Select.prototype = {
    _DEF_OPTION_CSS : "default-option",

    /**
     * Load this select options from server. Server should return a list of objects with at least <em>text</em>
     * property and optional <em>value</em>.
     * 
     * @param Object remoteClassStub remote class stub object,
     * @param String remoteMethod remote method name,
     * @param Object... args remote method invocation arguments.
     * @return js.dom.Select this object.
     */
    load : function (remoteClassStub, remoteMethod) {
        var args = $args(arguments, 2);
        args.push(this.setOptions);
        args.push(this);
        remoteClassStub[remoteMethod].apply(remoteClassStub, args);
        return this;
    },

    /**
     * Initialize this select options from given items list. For every given item create a new select option and
     * initialize it accordingly. This method support two kind of items: value/text pairs or full object. First case is
     * straightforward: just set option value and text from given value/text pair. The second is used to store objects
     * on this select but object should have at least two properties: <em>id</em> - stored as option value and
     * <em>name</em> stored as text. Object reference is stored internally and passed to user code as argument to
     * <em>updated</em> event, see {@link #_events} description. Also object reference can be retrieved using getter
     * {@link #getObject}.
     * 
     * @param Array items source array of items.
     * @return js.dom.Select this pointer.
     */
    setOptions : function (items) {
        // remove all children less those tagged as this._DEF_OPTION_CSS
        var child = this.getFirstChild(), nextSibling;
        while (child !== null) {
            nextSibling = child.getNextSibling();
            if (!child.hasCssClass(this._DEF_OPTION_CSS)) {
                child.remove();
            }
            child = nextSibling;
        }

        for ( var i = 0, item, option; i < items.length; i++) {
            item = items[i];
            option = this._ownerDoc._document.createElement('option');

            if (typeof item.id !== "undefined") {
                $assert(typeof item.name !== 'undefined', 'js.dom.Select#_onLoad', 'Item name is undefined.');
                option.text = item.name;
                option.value = item.id.toString();

                if (typeof this._data === "undefined") {
                    /**
                     * Data map. Stores used defined object references associated with this select options. Option
                     * value, which in this case is object id is used a key.
                     * 
                     * @type Object
                     */
                    this._data = {};
                }
                this._data[option.value] = item;
            }
            else {
                $assert(typeof item.text !== 'undefined', 'js.dom.Select#_onLoad', 'Item text is undefined.');
                option.text = item.text;
                option.value = typeof item.value !== 'undefined' ? item.value : item.text;
            }
            this._node.add(option, null);
        }

        this._events.fire("updated", this._getOption());
        return this;
    },

    setValue : function (value) {
        var i, opts, l;

        this._node.selectedIndex = 0;
        for (i = 0, opts = this._node.options, l = opts.length; i < l; i++) {
            if (opts[i].value == value || opts[i].text == value) {
                this._node.selectedIndex = i;
                break;
            }
        }
        return this;
    },

    clear : function () {
        this._node.selectedIndex = 0;
        return this;
    },

    reset : function () {
        this._node.selectedIndex = 0;
        return this;
    },

    /**
     * Get selected option value. If no option was selected consider the first. If option has no value returns its text
     * instead. Returns null if this select has no options at all.
     * 
     * @return String option value.
     */
    getValue : function () {
        return this._getOption().value;
    },

    /**
     * Get selected option text. If no option was selected consider the first. Returns null if this select has no
     * options at all.
     * 
     * @return String option text.
     */
    getText : function () {
        return this._getOption().text;
    },

    /**
     * Get selected option user defined object or null. Returns user defined object associated with current selected
     * option or null if this select was created without user defined data.
     * 
     * @return Object option user defined object.
     * @assert this select was created with user defined data.
     */
    getObject : function () {
        $assert(typeof this._data !== "undefined", "js.dom.Select#getObject", "No user defined data.");
        return this._getOption().data;
    },

    /**
     * Test if this control is empty. A select is empty if no option was selected, that is, {@link #getIndex} returns
     * -1.
     * 
     * @return Boolean true if this control is empty.
     */
    isEmpty : function () {
        return this.getIndex() === -1;
    },

    /**
     * Validity test. Select is valid if is not empty; in fact internally uses {@link #isEmpty} method, of course
     * negated.
     * 
     * @return Boolean true if a selection was made.
     */
    isValid : function () {
        return !this.isEmpty();
    },

    /**
     * Return selected option index, zero based. Return -1 if no option was selected.
     * 
     * @return Number selected option index or -1.
     */
    getIndex : function () {
        return this._node.selectedIndex;
    },

    /**
     * Test selected option value.
     * 
     * @param String value
     */
    equals : function (value) {
        return this._getOption().value == value;
    },

    /**
     * Event handler for <em>change</em> DOM event. It just fires <em>updated</em> custom event with selected option
     * as argument.
     * 
     * @param js.event.Event ev event instance.
     */
    _onChange : function (ev) {
        this._events.fire("updated", this._getOption());
    },

    /**
     * Get option value and text. Retrieve selected option; if no selection was made consider the first one. Returned
     * object is guaranteed to have <em>value</em> and <em>text</em> properties. If select option has only text
     * returned object has both properties set to text value. If this select has no options at all returned object has
     * both value and text set to null.
     * 
     * @return Object selected option or first.
     */
    _getOption : function () {
        var idx, option;

        // if this select is empty returns null option
        if (this._node.options.length === 0) {
            return {
                value : null,
                text : null,
                data : null
            };
        }

        idx = this._node.selectedIndex;
        // if no selection made consider the first option
        if (idx === -1) {
            idx = 0;
        }
        option = this._node.options[idx];
        return {
            value : option.value,
            text : option.text,
            data : typeof this._data !== "undefined" ? this._data[option.value] : null
        };
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return 'js.dom.Select';
    }
};
$extends(js.dom.Select, js.dom.Control);
$package("js.dom");

/**
 * CSS styles bound to an element. This class is a companion for document elements encapsulating methods for style
 * handling. Note that j(s)-lib good practice guide does not recommend using styles directly. Uses instead meaningful
 * CSS classes and external stylesheets.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * @constructor Construct CSS style instance for given element.
 * 
 * @param js.dom.Element el element to which this style is attached.
 */
js.dom.Style = function (el) {
    $assert(this instanceof js.dom.Style, "js.dom.Style#Style", "Invoked as function.");
    $assert(el, "js.dom.Style#Style", "Element is undefined or null.");

    /**
     * Native node to which style is attached.
     * 
     * @type Node
     */
    this._node = el._node;
};

js.dom.Style.prototype = {
    /**
     * Set style(s) value(s). This method set one or more style(s) value to this element. If set one single style both
     * name and value arguments must be supplied. Alternatively one may invoke this method with a single name/value
     * hash.
     * 
     * <pre>
     *	var styles = {
     *		"background-color":"blue",
     *		"border":"solid 1px green",
     *		"position":"relative"
     *	}
     *	el.style.set(styles);
     * </pre>
     * 
     * Note that style name must be a string, following the CSS notation. Both hyphened and camel style notations are
     * legal, e.g. <code>font-family</code> and <code>fontFamily</code>. Also value, if present must be a string
     * too, even for pure numerical values like opacity. When appropriate, value must contain the units, as
     * <em>100px</em>.
     * <p>
     * <strong>Best practice:</strong> do not abuse set style; uses instead meaningful classes and set styles using CSS
     * files.
     * 
     * @param String style name of style to be set or name/value hash,
     * @param String value the newly style value, ignored if first argument is a hash.
     * @return js.dom.Style this object.
     * @assert arguments are not undefined, null or empty.
     */
    set : function (style, value) {
        $assert(this._node.style, "js.dom.Style#set", "Element with no styles.");
        $assert(style, "js.dom.Style#set", "Style is undefined or null.");

        if (js.lang.Types.isObject(style)) {
            for ( var s in style) {
                this.set(s, style[s]);
            }
            return this;
        }
        $assert(js.lang.Types.isString(style), "js.dom.Style#set", "Style is undefined, null or empty.");
        $assert(js.lang.Types.isString(value), "js.dom.Style#set", "Value is undefined, null or empty.");
        this._node.style[js.util.Strings.toScriptCase(style)] = value;
        return this;
    },

    /**
     * Get element style. Style name must be a string, following the CSS notation. Both hyphened and camel style
     * notations are legal, e.g. <code>font-family</code> and <code>fontFamily</code>. Return null if style
     * argument is undefined, null or empty.
     * 
     * @param String style the name of the style to be retrieved.
     * @return String requested style value or null. Note that this method returns always a string, even for numerical
     *         style value like z-index.
     * @assert style argument is not undefined, null or empty.
     */
    get : function (style) {
        $assert(this._node.style, "js.dom.Style#get", "Element with no styles.");
        $assert(style, "js.dom.Style#get", "Style is undefined, null or empty.");
        if (!style) {
            return null;
        }

        style = js.util.Strings.toScriptCase(style);
        var v = this._getComputedStyle(style);
        var isNull = (typeof v === "undefined" || v.length === 0);
        if (js.ua.Engine.TRIDENT && style === "zIndex" && v === 0) {
            isNull = true;
        }
        if (isNull) {
            return null;
        }
        if (!js.lang.Types.isString(v)) {
            v = v.toString();
        }
        return v;
    },

    /**
     * Get computed style. Return the actual style this element may have including styles from linked stylesheets.
     * Returned value is not normalized; if requested style is missing this getter returns undefined or empty string,
     * browser dependent.
     * 
     * @param String style the name of the style to be retrieved.
     * @return String requested style, possible undefined or empty.
     */
    _getComputedStyle : function (style) {
        $assert(this._node.style, "js.dom.Style#_getComputedStyle", "Element with no styles.");
        // n.b. computed style returns a read-only style object
        return window.getComputedStyle(this._node).getPropertyValue(style);
    },

    /**
     * Remove element style. Remove specified style; further references to removed style return null. Style name must be
     * a string, following the CSS notation. Both dashed and camel style notations are legal, e.g.
     * <code>font-family</code> and <code>fontFamily</code>.
     * 
     * @param String style name of the style to be removed.
     * @return js.dom.Style this object.
     */
    remove : function (style) {
        $assert(this._node.style, "js.dom.Style#remove", "Element with no styles.");
        this._node.style[js.util.Strings.toScriptCase(style)] = "";
        return this;
    },

    /**
     * Check if element has a style. Returns true if element has requested style. If optional values list is given
     * compare each with style value and return true on first match; if none found return false.
     * 
     * @param String style the name of the style to check,
     * @param String... values optional values.
     * @return Boolean true if element has requested style and value, if given.
     * @assert style argument is not undefined, null or empty.
     */
    has : function (style) {
        $assert(this._node.style, "js.dom.Style#has", "Element with no styles.");
        $assert(style, "js.dom.Style#has", "Style argument is undefined, null or empty.");
        if (!this._node.style) {
            return false;
        }

        style = this._node.style[js.util.Strings.toScriptCase(style)];
        if (!style) {
            return false;
        }
        if (arguments.length === 1) {
            return Boolean(style);
        }
        for ( var i = 1; i < arguments.length; ++i) {
            if (style === arguments[i]) {
                return true;
            }
        }
        return false;
    },

    /**
     * Determine if element is visible. Check elements and all ancestors up to body if display none and visibility
     * hidden. Return
     * 
     * @return Boolean true if element is visible.
     */
    isVisible : function () {
        var n = this._node;
        while (n) {
            if (n.style.display.toLowerCase() === "none") {
                return false;
            }
            if (n.style.visibility.toLowerCase() !== "hidden") {
                return false;
            }
            if (n.nodeName.toLowerCase() === "body") {
                return true;
            }
            n = n.parentNode;
        }
        return false;
    },

    /**
     * Get element width. Element width does not includes padding, scroll, border or margins. Returned value is numeric
     * and consider only pixel units.
     * 
     * @return Number element width.
     * @note This method ignores old browsers and quirks mode.
     */
    getWidth : function () {
        return parseInt(this._getComputedStyle("width"), 10);
    },

    /**
     * Set element width. Accepted values for width are <code>auto</code>, <code>inherit</code> or a numeric one.
     * 
     * @param Object width element width.
     * @return js.dom.Style this object.
     * @assert <code>width</code> argument is valid.
     * @note This method ignores old browsers and quirks mode.
     */
    setWidth : function (width) {
        $assert(width === "auto" || width === "inherit" || js.lang.Types.isNumber(width), "js.dom.Style#setWidth", "Width is not a valid.");
        if (js.lang.Types.isNumber(width)) {
            width = width.toString(10) + "px";
        }
        return this.set("width", width);
    },

    /**
     * Get element height. Element height does not includes padding, scroll, border or margins. Returned value is
     * numeric and consider only pixel units.
     * 
     * @return Number element height.
     * @note This method ignores old browsers and quirks mode.
     */
    getHeight : function () {
        return parseInt(this._getComputedStyle("height"), 10);
    },

    /**
     * Set element height. Accepted values for height are <code>auto</code>, <code>inherit</code> or a numeric one.
     * 
     * @param Object height element height.
     * @return js.dom.Style this object.
     * @assert <code>height</code> argument is valid.
     * @note This method ignores old browsers and quirks mode.
     */
    setHeight : function (height) {
        $assert(height === "auto" || height === "inherit" || js.lang.Types.isNumber(height), "js.dom.Style#setHeight", "Height is not valid.");
        if (js.lang.Types.isNumber(height)) {
            height = height.toString(10) + "px";
        }
        return this.set("height", height);
    },

    /**
     * Get element border width. Returned value is an object with <code>top</code>, <code>right</code>,
     * <code>bottom</code> and <code>left</code> properties.
     * 
     * @return Object element border width.
     */
    getBorderWidth : function () {
        return {
            top : parseInt(this._getComputedStyle("border-top-width"), 10),
            right : parseInt(this._getComputedStyle("border-right-width"), 10),
            bottom : parseInt(this._getComputedStyle("border-bottom-width"), 10),
            left : parseInt(this._getComputedStyle("border-left-width"), 10)
        };
    },

    /**
     * Get element padding. Returned value is an object with <code>top</code>, <code>right</code>,
     * <code>bottom</code> and <code>left</code> properties.
     * 
     * @return Object element padding.
     */
    getPadding : function () {
        return {
            top : parseInt(this._getComputedStyle("padding-top"), 10),
            right : parseInt(this._getComputedStyle("padding-right"), 10),
            bottom : parseInt(this._getComputedStyle("padding-bottom"), 10),
            left : parseInt(this._getComputedStyle("padding-left"), 10)
        };
    },

    /**
     * Get element margin. Returned value is an object with <code>top</code>, <code>right</code>,
     * <code>bottom</code> and <code>left</code> properties.
     * 
     * @return Object element margin.
     */
    getMargin : function () {
        return {
            top : parseInt(this._getComputedStyle("margin-top"), 10),
            right : parseInt(this._getComputedStyle("margin-right"), 10),
            bottom : parseInt(this._getComputedStyle("margin-bottom"), 10),
            left : parseInt(this._getComputedStyle("margin-left"), 10)
        };
    },

    /**
     * Set element positioning style. Argument should be one of CSS2 positioning values:
     * <p>
     * <table>
     * <tr>
     * <td width=70><b>inherit</b>
     * <td>Inherit positioning style from parent.
     * <tr>
     * <td><b>static</b>
     * <td>A static positioned element is always positioned according to the normal flow of the page.
     * <tr>
     * <td><b>absolute</b>
     * <td>An absolute position element is positioned relative to the first parent element that has a position other
     * than static.
     * <tr>
     * <td><b>fixed</b>
     * <td>An element with fixed position is positioned relative to the viewport.
     * <tr>
     * <td><b>relative</b>
     * <td>A relative positioned element is positioned relative to its normal position. </table>
     * 
     * <p>
     * If <code>position</code> is undefined, null or empty this setter does nothing.
     * 
     * @param String position positioning style to set.
     * @return js.dom.Style this object.
     * @assert argument is not undefined, null or empty.
     */
    setPosition : function (position) {
        $assert(position, "js.dom.Style#setPosition", "Position is undefined, null or empty.");
        if (position) {
            this.set("position", position);
        }
        return this;
    },

    /**
     * Get element positioning style.
     * 
     * @return String element positioning style.
     */
    getPosition : function () {
        return this.get("position");
    },

    /**
     * Check if element is positioned. An element is positioned if has one of the next positioning styles:
     * <ul>
     * <li>absolute
     * <li>fixed
     * <li>relative
     * </ul>
     * Please remember that only positioned elements support position setters, like {@link #setTop}.
     * 
     * @return Boolean true if element positioned.
     */
    isPositioned : function () {
        var p = this.get("position");
        return p === "absolute" || p === "fixed" || p === "relative";
    },

    /**
     * Set element top position. Value to set should be a number; it will be rounded and <em>px</em> units used.
     * Trying to use this setter on a static element is considered a bug; remember that on static element top style is
     * ignored.
     * 
     * @param Number top top value.
     * @return js.dom.Style this object.
     * @assert element is positioned and top argument is a {@link Number}.
     */
    setTop : function (top) {
        $assert(this.isPositioned(), "js.dom.Style#setTop", "Trying to set position on not positioned element.");
        $assert(js.lang.Types.isNumber(top), "js.dom.Style#setTop", "Top value is not numeric.");
        return this.set("top", Math.round(top).toString(10) + "px");
    },

    /**
     * Set element right position. Value to set should be a number; it will be rounded and <em>px</em> units used.
     * Trying to use this setter on a static element is considered a bug; remember that on static element top style is
     * ignored.
     * 
     * @param Number right right value.
     * @return js.dom.Style this object.
     * @assert element is positioned and right argument is a {@link Number}.
     */
    setRight : function (right) {
        $assert(this.isPositioned(), "js.dom.Style#setRight", "Trying to set position on not positioned element.");
        $assert(js.lang.Types.isNumber(right), "js.dom.Style#setRight", "Right value is not numeric.");
        return this.set("right", Math.round(right).toString(10) + "px");
    },

    /**
     * Set element bottom position. Value to set should be a number; it will be rounded and <em>px</em> units used.
     * Trying to use this setter on a static element is considered a bug; remember that on static element top style is
     * ignored.
     * 
     * @param Number bottom bottom value.
     * @return js.dom.Style this object.
     * @assert element is positioned and bottom argument is a {@link Number}.
     */
    setBottom : function (bottom) {
        $assert(this.isPositioned(), "js.dom.Style#setBottom", "Trying to set position on not positioned element.");
        $assert(js.lang.Types.isNumber(bottom), "js.dom.Style#setBottom", "Bottom value is not numeric.");
        return this.set("bottom", Math.round(bottom).toString(10) + "px");
    },

    /**
     * Set element left position. Value to set should be a number; it will be rounded and <em>px</em> units used.
     * Trying to use this setter on a static element is considered a bug; remember that on static element top style is
     * ignored.
     * 
     * @param Number left left value.
     * @return js.dom.Style this object.
     * @assert element is positioned and left argument is a {@link Number}.
     */
    setLeft : function (left) {
        $assert(this.isPositioned(), "js.dom.Style#setLeft", "Trying to set position on not positioned element.");
        $assert(js.lang.Types.isNumber(left), "js.dom.Style#setLeft", "Left value is not numeric.");
        return this.set("left", Math.round(left).toString(10) + "px");
    },

    /**
     * Get element left position absolute to page. Returns the number of pixels on horizontal axe from page left side to
     * element top/left corner.
     * <p>
     * This method uses page as reference, not viewport. Remember that viewport is only the extend of the page that is
     * visible on device screen while the page is all document rendered in a virtual surface. Page and viewport
     * references are the same only when there is no scroll on any axe.
     * 
     * @return Number element absolute left position, in pixels.
     */
    getPageLeft : function () {
        var left = 0;
        for ( var n = this._node; n; n = n.offsetParent) {
            left += n.offsetLeft;
        }
        return left;
    },

    /**
     * Get element top position absolute to page. Returns the number of pixels on vertical axe from page top side to
     * element top/left corner.
     * <p>
     * See {@link #getPageLeft()} for a discussion about page vs. viewport.
     * 
     * @return Number element absolute top position, in pixels.
     */
    getPageTop : function () {
        var top = 0;
        for ( var n = this._node; n; n = n.offsetParent) {
            top += n.offsetTop;
        }
        return top;
    },

    /**
     * Swap and execute. Swap element styles and execute given callback function then restore original styles. Returns
     * the value returned by given callback function.
     * 
     * @param Object styles styles to update before function execution,
     * @param Function fn function to b executed in swapped context,
     * @param Object scope callback function run-time execution scope,
     * @param Object... args function actual arguments.
     * @return Object value returned by callback function.
     */
    swap : function (styles, fn, scope) {
        $assert(this._node.style, "js.dom.Style#swap", "Element with no styles.");
        var old = {};
        for ( var name in styles) {
            old[name] = this._node.style[name];
            this._node.style[name] = styles[name];
        }
        var value = fn.apply(scope, $args(arguments, 3));
        for ( var name in styles) {
            this._node.style[name] = old[name];
        }
        return value;
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.dom.Style";
    }
};
$extends(js.dom.Style, Object);

$legacy(js.ua.Engine.TRIDENT, function () {
    js.dom.Style.prototype._getComputedStyle = function (style) {
        if (window.getComputedStyle) {
            return window.getComputedStyle(this._node).getPropertyValue(style);
        }
        if (this._node.currentStyle) {
            return this._node.currentStyle[js.util.Strings.toScriptCase(style)];
        }
    };
});
$package("js.dom.template");

/**
 * Arabic numeral numbering format. It is the most simple numbering formatter and maybe the most common; it just
 * displays index value. Its format code is <b>n</b>.
 * 
 * <pre>
 *  &lt;ul data-olist="."&gt;
 *      &lt;li data-numbering="%n)"&gt;&lt;/li&gt;
 *  &lt;/ul&gt;
 * </pre>
 * 
 * As with any numbering formatter this also allows for additional text; above example will render 1), 2) ... . See
 * {@link NumberingOperator} for details about numbering format syntax.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * 
 * @constructor Construct Arabic numeral numbering format instance.
 */
js.dom.template.ArabicNumeralNumbering = function() {
};

js.dom.template.ArabicNumeralNumbering.prototype = {
	/**
	 * Format index as arabic numeral.
	 * 
	 * @param Number index index value.
	 * @return String formatted index.
	 */
	format : function(index) {
		return index.toString(10);
	},

	/**
	 * Returns a string representation of the object.
	 * 
	 * @return String object string representation.
	 */
	toString : function() {
		return "js.dom.template.ArabicNumeralNumbering";
	}
};
$extends(js.dom.template.ArabicNumeralNumbering, Object);
$package('js.dom.template');

/**
 * Templates operator. A X(HT)ML template define operators in an element context; an element may have none, one or more
 * declared operators. An operator declaration consist of operator code, its opcode, and exactly one operand - more
 * formally, all operators arity is one. In example below {@link js.dom.template.Opcode#SRC} is first operator opcode
 * and <em>picture</em> its operand.
 * 
 * <pre>
 *  &lt;img data-src="picture" data-title="description" /&gt;
 * </pre>
 * 
 * DOM is traversed using depth-first algorithm and every element operator executed, if any. All operators are fully
 * defined, that is, they do not depends on a context created by another operator. In a sense they are context free:
 * yields always the same result no matter evaluation context.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * @constructor Construct operator instance.
 * @param js.dom.template.Content content dynamic content.
 */
js.dom.template.Operator = function (content) {
    /**
     * Dynamic content reference.
     * 
     * @type js.dom.template.Content
     */
    this._content = content;
};

js.dom.template.Operator.prototype = {
    _OBJECT_SETTER : "setObject",

    /**
     * Execute operator. Execute operator logic into element context and returns a value; depending on specific operator
     * implementation not all declared parameters may be used and returned type may vary. Operand string can denote a
     * property path, an expression or a qualified class name, see every operator description.
     * <p>
     * A property path is used to access content values and can be absolute, prefixed with dot or relative to scope
     * object. An expression is operator specific and should contain also some means to identify a content values. The
     * point is, <em>scope</em>, <em>operand</em> tuple is used to somehow identify the content value(s) that will
     * be injected by operator.
     * <p>
     * This method delegates {@link #_exec(js.dom.Element, Object, String)} but intercepts
     * {@link js.dom.template.ContentException} logging a warning. All other errors are re-thrown. Note that on any
     * error processed element state is not defined, that is, best effort approach. Anyway, errors are expected only for
     * template bad syntax or improper value type and should be caught by building tools or vigilant coder.
     * 
     * @param js.dom.Element element element on which operator is declared,
     * @param Object scope scope object, used when operand is a property path,
     * @param String operand declared operand.
     * @assert all arguments are not undefined, null and are of proper type.
     */
    exec : function (element, scope, operand) {
        // precondition - only js.dom.Element has method setObject; all others from hierarchy inherit it
        // if a user defined type implements its own object setter templates operator is not longer executed
        // is the method implementor responsibility to call super or take what ever measure to initialize its sub-graph

        // if element is not js.dom.Element and if has its own object getter delegates operator execution to element
        // FIXIT low level access to class construction implementation
        // this logic in at this level because can be more operators using it, e.g. data-object, data-list, etc.
        if (element.__ctor__ !== js.dom.Element && element.__ctor__ && element.__ctor__.prototype.hasOwnProperty(this._OBJECT_SETTER)) {
            $assert(typeof this._content !== "undefined", "js.dom.template.Operator#exec", "User defined object setter for operator |%s| with no content.", this);
            $debug("js.dom.template.Operator#exec", "User defined |%s| object setter for operator |%s|.", element, this);
            element.setObject(this._content.getValue(scope, operand));
            return;
        }

        $assert(element instanceof js.dom.Element, "js.dom.template.Operator#exec", "Element is undefined, null or not of proper type.");
        $assert(js.lang.Types.isString(operand), "js.dom.template.Operator#exec", "Operand is undefined, null or not a string.");

        try {
            return this._exec(element, scope, operand);
        } catch (er) {
            if (er instanceof js.dom.template.ContentException) {
                $warn("js.dom.template.Operator#exec", "Undefined or invalid property:\r\n" + //
                "\t- element: %s\r\n" + //
                "\t- operator: %s\r\n" + //
                "\t- operand: %s\r\n" + // " +
                "\t- scope: %s\r\n" + // " +
                "\t- cause: %s", element, this, operand, scope, er.message);
                $assert(false, "js.dom.template.Operator#exec", "Templates engine exception.");
                return undefined;
            }
            throw er;
        }
    },

    /**
     * Operator internal workhorse. Delegated by {@link #exec(Element, Object, String)}; it has the same parameters
     * list.
     * 
     * @param js.dom.Element element element on which operator is declared,
     * @param Object scope scope object, used when operand is a property path,
     * @param String operand declared operand.
     * @throws js.dom.template.ContentException if operator tries to access an undefined value.
     */
    _exec : function (element, scope, operand) {
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.dom.template.Operator";
    }
};
$extends(js.dom.template.Operator, Object);
$package("js.dom.template");

/**
 * Set one or more element's attributes values. This operator is the main means to set element attributes value. There
 * are also specialized, convenient operators for common HTML attributes: id, value, src, href and title.
 * 
 * <pre>
 *  &lt;img data-attr="src:picture;title:description;" /&gt;
 * </pre>
 * 
 * Operand is an expression describing attribute name/property path, with next syntax:
 * 
 * <pre>
 *    expression := attrProperty (';' attrProperty)* ';'?
 *    attrProperty : = attrName ':' propertyPath
 * </pre>
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * 
 * @constructor Construct ATTR operator instance.
 * @param js.dom.template.Content content dynamic content.
 */
js.dom.template.AttrOperator = function(content) {
    this.$super(content);
};

js.dom.template.AttrOperator.prototype = {
	/**
	 * Execute ATTR operator. Expression argument is set of attribute name / property path pairs. Property path is used
	 * to retrieve content value that is converted to string and used as attribute value.
	 * 
	 * @param js.dom.Element element context element,
	 * @param Object scope scope object,
	 * @param String expression set of attribute name / property path pairs.
	 * @throws js.dom.template.ContentException if requested content value is undefined.
	 * @assert expression is well formed.
	 */
	_exec : function(element, scope, expression) {
		js.util.Strings.parseNameValues(expression).forEach(function(pairs) {
	        var propertyPath = pairs.value;
			$assert(propertyPath === "." || js.lang.Types.isObject(scope), "js.dom.template.AttrOperator#exec", "Operand is property path but scope is not an object.");
			var attrName = pairs.name;
			var value = this._content.getValue(scope, propertyPath);

			if (value == null) {
				$warn("js.dom.template.AttrOperator#_exec", "Null property |%s|. Remove %s attribute from element |%s|.", propertyPath, attrName, element);
				element.removeAttr(attrName);
			}
			else {
				if (attrName === "id" && js.lang.Types.isNumber(value)) {
					value = value.toString();
				}
				$assert(js.lang.Types.isString(value), "js.dom.template.AttrOperator#_exec", "Content value is not a string.");
				$debug("js.dom.template.AttrOperator#_exec", "Set element |%s| %s attribute from property |%s|.", element, attrName, propertyPath);
				element.setAttr(attrName, value);
			}
		}, this);
	},

	/**
	 * Returns a string representation of the object.
	 * 
	 * @return String object string representation.
	 */
	toString : function() {
		return "js.dom.template.AttrOperator";
	}
};
$extends(js.dom.template.AttrOperator, js.dom.template.Operator);
$package("js.dom.template");

/**
 * Conditional expression evaluator. A conditional expression has a mandatory property path, an operator opcode and an
 * operand. Property path is used to get content value and opcode to enact specific evaluation logic. Evaluation process
 * usually uses two parameters: content value determined by property path and operand from expression.
 * <p>
 * Usage pattern is as follow: create instance, parse expression and use returned property path to get content value
 * then evaluate it.
 * 
 * <pre>
 * var conditionalExpression = new js.dom.template.ConditionalExpression();
 * String propertyPath = conditionalExpression.parse(expression);
 * Object value = this.content.getValue(scope, propertyPath);
 * if(conditionalExpression.evaluate(value)) {
 *   // logic executed if conditional expression is true
 * }
 * </pre>
 * 
 * <h4>Conditional Expression Syntax</h4>
 * 
 * <pre>
 *  conditional-expression = [ not ] property-path [ opcode operand ]
 *  not = '!' ; ! prefix at expression start negate boolean result
 *  property-path = java-name
 *  opcode = '=' / '<' / '>' ; note that opcode cannot be any valid java-name character
 *  java-name = ( 'a'...'z' / '$' / '_' ) *( 'a'...'z' / 'A'...'Z' / '0'...'9' / '$' / '_' )
 * </pre>
 * 
 * Here are couple example of working conditional expressions and parsed components. Although only one negated
 * expression is presented please note that exclamation market prefix can be used with any operator. <table>
 * <tr>
 * <td><b>Expression
 * <td><b>True Condition
 * <td><b>Opcode
 * <td><b>Property Path
 * <td><b>Operand
 * <tr>
 * <td>flag
 * <td><code>flag</code> is a boolean value and is <code>true</code>
 * <td>NOT_EMPTY
 * <td>flag
 * <td>null
 * <tr>
 * <td>!description
 * <td><code>description</code> is a string and is null
 * <td>NOT_EMPTY
 * <td>description
 * <td>null
 * <tr>
 * <td>type=DIRECTORY
 * <td><code>type</code> is an enumeration and its values is <code>DIRECTORY</code>
 * <td>EQUALS
 * <td>type
 * <td>DIRECTORY
 * <tr>
 * <td>loadedPercent<0.9
 * <td><code>loadedPercent</code> is a double value [0, 1) and its values is less than 0.9
 * <td>LESS_THAN
 * <td>loadedPercent
 * <td>0.9
 * <tr>
 * <td>birthDay>1980-01-01T00:00:00Z
 * <td><code>birthDay</code> is a date and its value is after 1980, January 1-st
 * <td>GREATER_THAN
 * <td>birthDay
 * <td>1980-01-01T00:00:00Z </table>
 * <p>
 * See {@link js.dom.template.ConditionalExpression.Opcode} for supported operators.
 * 
 * @author Iulian Rotaru
 * @since 1.8
 * @constructor Construct conditional expression instance and initialize internal state from given expression.
 * @param js.dom.template.Content content content bound to templates engine instance,
 * @param Object scope current content scope,
 * @param String expression expression source string.
 * @assert arguments are not undefined or null.
 */
js.dom.template.ConditionalExpression = function (content, scope, expression) {
    $assert(content, "js.dom.template.ConditionalExpression#ConditionalExpression", "Content argument is undefined or null.");
    $assert(scope, "js.dom.template.ConditionalExpression#ConditionalExpression", "Scope argument is undefined or null.");
    $assert(expression, "js.dom.template.ConditionalExpression#ConditionalExpression", "Expression argument is undefined, null or empty.");

    /**
     * Source string for this conditional expression, mainly for debugging.
     * 
     * @type String
     */
    this._expression = expression;

    /**
     * Evaluated value negation flag. If true {@link #evaluate(Object)} applies boolean <code>not</code> on returned
     * value. This flag is true if expression starts with exclamation mark.
     * 
     * @type Boolean
     */
    this._not = false;

    /**
     * The property path of the content value to evaluate this conditional expression against. See package API for
     * object property path description. This value is extracted from given expression and is the only mandatory
     * component.
     * 
     * @type String
     */
    this._propertyPath = null;

    /**
     * Optional expression operator opcode, default to {@link js.dom.template.ConditionalExpression.Opcode#NOT_EMPTY}.
     * This opcode is used to select the proper expression {@link js.dom.template.ConditionalExpression.Processor}.
     * 
     * @type js.dom.template.ConditionalExpression.Opcode
     */
    this._opcode = js.dom.template.ConditionalExpression.Opcode.NONE;

    /**
     * Operator operand, mandatory only if {@link js.dom.template.ConditionalExpression.Processor#acceptNullOperand()}
     * requires it. This is the second term of expression evaluation logic; the first is the content value determined by
     * property path.
     * 
     * @type String
     */
    this._operand = null;

    /**
     * Expression evaluation value.
     * 
     * @type Boolean
     */
    this._value = false;

    this._parse();
    $assert(this._propertyPath === "." || js.lang.Types.isObject(scope), "js.dom.template.CssClassOperator#_exec", "Scope is not an object.");
    this._value = this._evaluate(content.getValue(scope, this._propertyPath));
};

js.dom.template.ConditionalExpression.prototype = {
    /**
     * Return this conditional expression boolean value.
     * 
     * @return this conditional expression value.
     */
    value : function () {
        return this._value;
    },

    /**
     * Parse stored expression string and initialize instance state. This method is in fact a morphological parser, i.e.
     * a lexer. It just identifies expression components and initialize internal state. Does not check validity; all
     * <em>insanity</em> tests are performed by {@link #_evaluate(Object)} counterpart.
     */
    _parse : function () {
        if (this._expression.charAt(0) === '!') {
            this._not = true;
            this._expression = this._expression.substring(1);
        }

        var builder = "";
        var state = js.dom.template.ConditionalExpression.State.PROPERTY_PATH;

        for ( var i = 0, c; i < this._expression.length; ++i) {
            c = this._expression.charAt(i);
            switch (state) {
            case js.dom.template.ConditionalExpression.State.PROPERTY_PATH:
                if (this._isPropertyPathChar(c)) {
                    builder += c;
                    break;
                }
                this._propertyPath = builder;
                builder = "";
                this._opcode = js.dom.template.ConditionalExpression.Opcode.forChar(c);
                state = js.dom.template.ConditionalExpression.State.OPERAND;
                break;

            case js.dom.template.ConditionalExpression.State.OPERAND:
                builder += c;
                break;

            default:
                $assert(false, "js.dom.template.ConditionalExpression#parse", "Illegal state.");
            }
        }

        if (state == js.dom.template.ConditionalExpression.State.PROPERTY_PATH) {
            this._opcode == js.dom.template.ConditionalExpression.Opcode.NONE;
            this._propertyPath = builder;
            this._opcode = js.dom.template.ConditionalExpression.Opcode.NOT_EMPTY;
        }
        else {
            if (builder) {
                // operand string builder may be empty if operand is missing, e.g. 'value='
                this._operand = builder;
            }
        }
    },

    /**
     * Pattern for Java identifiers.
     * 
     * @type RegExp
     */
    JAVA_IDENTIFIER : /[a-zA-Z0-9._$]/,

    /**
     * Test if character is a valid property path character. Returns true if <code>char</code> is letter, digit, dot,
     * underscore or dollar sign.
     * 
     * @param String char character to test.
     * @return Boolean true if <code>char</code> is a valid Java identifier part.
     */
    _isPropertyPathChar : function (char) {
        return this.JAVA_IDENTIFIER.test(char);
    },

    /**
     * Evaluate this conditional expression against given object value. Execute this conditional expression operator on
     * given <code>object</code> value and {@link #_operand} defined by expression. Evaluation is executed after
     * {@link #_parse(String)} counter part that already initialized this conditional expression internal state. This
     * method takes care to test internal state consistency and returns false if bad; so an invalid expression evaluates
     * to false.
     * 
     * @param Object object value to evaluate, possible null.
     * @return Boolean true if this conditional expression is positively evaluated.
     * @assert <code>object</code> argument is not undefined or null.
     */
    _evaluate : function (object) {
        $assert(typeof object !== "undefined", "js.dom.template.ConditionalExpression#evaluate", "Object argument is undefined or null.");

        if (this._opcode === js.dom.template.ConditionalExpression.Opcode.INVALID) {
            $warn("js.dom.template.ConditionalExpression#evaluate", "Invalid conditional expression |%s|. Not supported opcode.", this._expression);
            return false;
        }
        var processor = this._getProcessor(this._opcode);

        if (this._operand == null && !processor.acceptNullOperand()) {
            $warn("js.dom.template.ConditionalExpression#evaluate", "Invalid conditional expression |%s|. Missing mandatory operand for operator |%s|.", this._expression, this._opcode);
            return false;
        }
        if (!processor.acceptValue(object)) {
            $warn("js.dom.template.ConditionalExpression#evaluate", "Invalid conditional expression |%s|. Operator |%s| does not accept value type |%s|.", this._expression, this._opcode, object);
            return false;
        }
        if (this._operand !== null && !js.dom.template.ConditionalExpression.OperandFormatValidator.isValid(object, this._operand)) {
            $warn("js.dom.template.ConditionalExpression#evaluate", "Invalid conditional expression |%s|. Operand does not match value type |%s|.", this._expression, object);
            return false;
        }

        var value = processor.evaluate(object, this._operand);
        $assert(js.lang.Types.isBoolean(value), "js.dom.template.ConditionalExpression#evaluate", "Operator processor returned value is not boolean.");
        return this._not ? !value : value;
    },

    /**
     * Operator processors cache. Store processor instance for specific opcode.
     * 
     * @type Object
     */
    _processors : {},

    /**
     * Return processor suitable for requested operator. Returned processor instance is a singleton, that is, reused on
     * running script engine.
     * 
     * @param js.dom.template.ConditionalExpression.Opcode opcode of the requested operator.
     * @return js.dom.template.ConditionalExpression.Processor operator processor instance.
     */
    _getProcessor : function (opcode) {
        var processor = this._processors[opcode];

        if (typeof processor === "undefined") {
            switch (opcode) {
            case js.dom.template.ConditionalExpression.Opcode.NOT_EMPTY:
                processor = new js.dom.template.ConditionalExpression.NotEmptyProcessor();
                break;

            case js.dom.template.ConditionalExpression.Opcode.EQUALS:
                processor = new js.dom.template.ConditionalExpression.EqualsProcessor();
                break;

            case js.dom.template.ConditionalExpression.Opcode.LESS_THAN:
                processor = new js.dom.template.ConditionalExpression.LessThanProcessor();
                break;

            case js.dom.template.ConditionalExpression.Opcode.GREATER_THAN:
                processor = new js.dom.template.ConditionalExpression.GreaterThanProcessor();
                break;

            default:
                $assert(false, "js.dom.template.ConditionalExpression#_getProcessor", "Illegal state.");
            }
            this._processors[opcode] = processor;
        }

        return processor;
    },

    /**
     * Class string representation.
     * 
     * @return String class string representation.
     */
    toString : function () {
        return "js.dom.template.ConditionalExpression";
    }
};
$extends(js.dom.template.ConditionalExpression, Object);

/**
 * Operator opcodes supported by current conditional expression implementation. Operators always operates on content
 * value identified by {@link js.dom.template.ConditionalExpression#_propertyPath} and optional
 * {@link js.dom.template.ConditionalExpression#_operand}.
 * 
 * @author Iulian Rotaru
 * @since 1.8
 */
js.dom.template.ConditionalExpression.Opcode = {
    /**
     * Neutral value.
     */
    NONE : 0,

    /**
     * Invalid character code. Parser uses this opcode when discover a not supported character code for opcode.
     */
    INVALID : 1,

    /**
     * Value if not empty. A value is empty if is null, empty string, boolean false, zero value number, collection or
     * array with zero size. It is implemented by {@link js.dom.template.ConditionalExpression.NotEmptyProcessor}.
     */
    NOT_EMPTY : 2,

    /**
     * Value and operand are equal. It is implemented by {@link js.dom.template.ConditionalExpression.EqualsProcessor}.
     */
    EQUALS : 3,

    /**
     * Value is strictly less than operand. It is implemented by
     * {@link js.dom.template.ConditionalExpression.LessThanProcessor}.
     */
    LESS_THAN : 4,

    /**
     * Value is strictly greater than operand. It is implemented by
     * {@link js.dom.template.ConditionalExpression.GreaterThanProcessor}.
     */
    GREATER_THAN : 5
};

/**
 * Returns the opcode encoded by given character code. Current implementation encode opcode with a single character. If
 * given <code>code</code> is not supported returns INVALID.
 * 
 * @param String code opcode character code.
 * @return js.dom.template.ConditionalExpression.Opcode opcode specified by given <code>code</code> or INVALID.
 */
js.dom.template.ConditionalExpression.Opcode.forChar = function (code) {
    switch (code) {
    case '=':
        return js.dom.template.ConditionalExpression.Opcode.EQUALS;
    case '<':
        return js.dom.template.ConditionalExpression.Opcode.LESS_THAN;
    case '>':
        return js.dom.template.ConditionalExpression.Opcode.GREATER_THAN;
    }
    return js.dom.template.ConditionalExpression.Opcode.INVALID;
};

/**
 * Parser state machine.
 * 
 * @author Iulian Rotaru
 * @since 1.8
 */
js.dom.template.ConditionalExpression.State = {
    /**
     * Neutral value.
     */
    NONE : 0,

    /**
     * Building property path.
     */
    PROPERTY_PATH : 1,

    /**
     * Building operand.
     */
    OPERAND : 2
};

/**
 * Every conditional expression operator implements this processor interface. A processor implements the actual
 * evaluation logic, see {@link #evaluate(Object, String)}. Evaluation always occurs on a content value designated by
 * property path and an optional operand, both described by conditional expression. Value is always first and is
 * important on order based operators, e.g. on LESS_THAN value should be less than operand.
 * <p>
 * Operand can miss in which case evaluation consider only the value, for example, NOT_EMPTY test value emptiness.
 * <p>
 * Processor interface provides also predicates to test if implementation supports null operand and if certain value is
 * acceptable for processing.
 * 
 * @author Iulian Rotaru
 * @since 1.8
 */
js.dom.template.ConditionalExpression.Processor = {
    /**
     * Apply evaluation specific logic to given value and optional operand.
     * 
     * @param Object value value to evaluate, possible null,
     * @param String operand optional operand to evaluate value against, default to null.
     * @return Boolean evaluation logic result.
     */
    evaluate : function (value, operand) {
    },

    /**
     * Test if processor implementation accepts null operand. It is a templates exception if operator processor does not
     * accept null operand and expression do not include it.
     * 
     * @return Boolean true if this processor accepts null operand.
     */
    acceptNullOperand : function () {
    },

    /**
     * Test performed just before evaluation to determine if given value can be processed. Most common usage is to
     * consider value type; for example LESS_THAN operator cannot handle boolean values.
     * 
     * @param Object value value to determine if processable.
     * @return Boolean true if given <code>value</code> can be evaluated by this processor.
     */
    acceptValue : function (value) {
    }
};

/**
 * Operator processor for not empty value test.
 * 
 * @author Iulian Rotaru
 * @since 1.8
 * @constructor Construct processor instance for not empty value test.
 */
js.dom.template.ConditionalExpression.NotEmptyProcessor = function () {
};

js.dom.template.ConditionalExpression.NotEmptyProcessor.prototype = {
    /**
     * Return true is given content value is not empty. This method relies on language implicit conversion to
     * {@link Boolean} and assume that null values, zero numbers and empty strings and arrays are all converted to
     * <code>false</code>.
     * 
     * @param Object value content value of any primitive or compound type,
     * @param String operand unused operand.
     * @return Boolean true is <code>value</code> is not empty.
     */
    evaluate : function (value, operand) {
        if (js.lang.Types.isArray(value)) {
            return value.length > 0;
        }
        return Boolean(value);
    },

    /**
     * Not empty value processor uses only content value and does not require operand.
     * 
     * @return Boolean always true.
     */
    acceptNullOperand : function () {
        return true;
    },

    /**
     * Accepts all values and this predicate is always true.
     * 
     * @param Object value unused content value.
     * @return Boolean always true.
     */
    acceptValue : function (value) {
        return true;
    }
};
$extends(js.dom.template.ConditionalExpression.NotEmptyProcessor, Object);
$implements(js.dom.template.ConditionalExpression.NotEmptyProcessor, js.dom.template.ConditionalExpression.Processor);

/**
 * Equality operator processor.
 * 
 * @author Iulian Rotaru
 * @since 1.8
 * @constructor Construct equality processor instance.
 */
js.dom.template.ConditionalExpression.EqualsProcessor = function () {
};

js.dom.template.ConditionalExpression.EqualsProcessor.prototype = {
    /**
     * Implements equality test logic. This method uses language support to convert <code>operand</code> to an object
     * compatible with given <code>value</code> then perform not strict equality test. If content value is a
     * {@link Date} delegates {@link #_evaluateDates(Date, String)}.
     * 
     * @param Object value content value,
     * @param String operand expression operand.
     * @return Boolean true if <code>value</code> and <code>operand</code> are equal.
     */
    evaluate : function (value, operand) {
        if (value == null) {
            return operand === "null";
        }
        if (js.lang.Types.isBoolean(value)) {
            return operand === (value ? "true" : "false");
        }
        if (js.lang.Types.isDate(value)) {
            return this._evaluateDate(value, operand);
        }
        return value == operand;
    },

    /**
     * Test if date instance is equal with that described by given date format. Date format is ISO8601 but with optional
     * fields. Equals test is performed only on date field present in given <code>dateFormat</code>; other fields are
     * simply ignored.
     * 
     * @param Date date instance,
     * @param String dateFormat date format.
     * @return Boolean true if dates are equal.
     */
    _evaluateDate : function (date, dateFormat) {
        var dateItems = js.dom.template.ConditionalExpression.Dates.dateItems(date);
        var matcher = js.dom.template.ConditionalExpression.Dates.dateMatcher(dateFormat);
        for ( var i = 0, value; i < dateItems.length; ++i) {
            value = matcher[i + 1];
            if (!value) {
                break;
            }
            if (dateItems[i] !== parseInt(value)) {
                return false;
            }
        }
        return true;
    },

    /**
     * Always returns false because equals processor requires not null operand.
     * 
     * @return Boolean always false.
     */
    acceptNullOperand : function () {
        return false;
    },

    /**
     * Equals processor accepts all values and this predicate is always true.
     * 
     * @param Object value unused content value.
     * @return Boolean always true.
     */
    acceptValue : function (value) {
        return true;
    }
};
$extends(js.dom.template.ConditionalExpression.EqualsProcessor, Object);
$implements(js.dom.template.ConditionalExpression.EqualsProcessor, js.dom.template.ConditionalExpression.Processor);

/**
 * Base class for inequality comparisons.
 * 
 * @author Iulian Rotaru
 * @since 1.8
 * @constructor construct comparison processor instance.
 */
js.dom.template.ConditionalExpression.ComparisonProcessor = function () {
};

js.dom.template.ConditionalExpression.ComparisonProcessor.prototype = {
    /**
     * Apply specific comparison on given value and operand. This method convert <code>operand</code> to object and
     * delegate {@link #compare(Object, Object)} abstract method.
     * 
     * @param Object value content value,
     * @param String operand expression operand value.
     * @return Boolean value returned by delegated subclass.
     */
    evaluate : function (value, operand) {
        if (js.lang.Types.isNumber(value)) {
            return this.compare(value, Number(operand));
        }
        if (js.lang.Types.isDate(value)) {
            return this.compare(value, js.dom.template.ConditionalExpression.Dates.parse(operand));
        }
        return false;
    },

    /**
     * Comparator for content value and expression operand. Subclass should implement this abstract method and supply
     * specific logic.
     * 
     * @param Object value numeric value,
     * @param Object operand numeric operand.
     * @return Boolean true if value and operand fulfill comparator criterion.
     */
    compare : function (value, operand) {
    },

    /**
     * Test if processor implementation accepts null operand. All comparison processors always require not null operand
     * and return false.
     * 
     * @return Boolean always false.
     */
    acceptNullOperand : function () {
        return false;
    },

    /**
     * Test performed just before evaluation to determine if given value can be processed. Current implementations of
     * comparison processor accept numbers and dates.
     * 
     * @param Object value content value to test.
     * @return Boolean true if <code>value</code> is a {@link Number} or a {@link Date}.
     */
    acceptValue : function (value) {
        if (js.lang.Types.isNumber(value)) {
            return true;
        }
        if (js.lang.Types.isDate(value)) {
            return true;
        }
        return false;
    }
};
$extends(js.dom.template.ConditionalExpression.ComparisonProcessor, Object);
$implements(js.dom.template.ConditionalExpression.ComparisonProcessor, js.dom.template.ConditionalExpression.Processor);

/**
 * Comparison processor implementation for <code>LESS_THAN</code> operator.
 * 
 * @author Iulian Rotaru
 * @since 1.8
 * @constructor Construct processor instance for <code>LESS_THAN</code> operator.
 */
js.dom.template.ConditionalExpression.LessThanProcessor = function () {
};

js.dom.template.ConditionalExpression.LessThanProcessor.prototype = {
    /**
     * Return true if value is strictly less than operand.
     * 
     * @param Object value content value,
     * @param String operand operand value.
     * @return Boolean true if <code>value</code> is less than <code>operand</code>.
     */
    compare : function (value, operand) {
        return value < operand;
    }
};
$extends(js.dom.template.ConditionalExpression.LessThanProcessor, js.dom.template.ConditionalExpression.ComparisonProcessor);

/**
 * Comparison processor implementation for <code>GREATER_THAN</code> operator.
 * 
 * @author Iulian Rotaru
 * @since 1.8
 * @constructor Construct processor instance for <code>GREATER_THAN</code> operator.
 */
js.dom.template.ConditionalExpression.GreaterThanProcessor = function () {
};

js.dom.template.ConditionalExpression.GreaterThanProcessor.prototype = {
    /**
     * Return true if value is strictly greater than operand.
     * 
     * @param Object value content value,
     * @param String operand operand value.
     * @return Boolean true if <code>value</code> is greater than <code>operand</code>.
     */
    compare : function (value, operand) {
        return value > operand;
    }
};
$extends(js.dom.template.ConditionalExpression.GreaterThanProcessor, js.dom.template.ConditionalExpression.ComparisonProcessor);

/**
 * Utility class for operand format validation. Operand is a string and has a specific format that should be compatible
 * with value type. For example if value is a date operand should be ISO8601 date format. A null operand is not
 * compatible with any value.
 * <p>
 * Current validator implementation recognizes boolean, number and date types. All other value types are not on scope of
 * this validator and always return positive. For supported types see this class regular expression patterns.
 * 
 * @author Iulian Rotaru
 * @since 1.8
 */
js.dom.template.ConditionalExpression.OperandFormatValidator = {
    /**
     * Date format should be ISO8601 with UTC time zone, <code>dddd-dd-ddTdd:dd:ddZ</code>.
     * 
     * @type RegExp
     */
    DATE_PATTERN : /^\d{4}(?:-\d{2}(?:-\d{2}(?:T\d{2}(?::\d{2}(?::\d{2}(?:Z)?)?)?)?)?)?$/,

    /**
     * Signed numeric decimal number but not scientific notation.
     * 
     * @type RegExp
     */
    NUMBER_PATTERN : /^[+-]?\d+(?:\.\d+)?$/,

    /**
     * Boolean operand should be <code>true</code> or <code>false</code>, lower case.
     * 
     * @type RegExp
     */
    BOOLEAN_PATTERN : /^true|false$/,

    /**
     * Check operand format compatibility against value counterpart.
     * 
     * @param Object value content value to validate operand against,
     * @param String operand formatted string operand.
     * @return Boolean true if <code>operand</code> format is compatible with requested <code>value</code>.
     */
    isValid : function (value, operand) {
        if (!operand) {
            return false;
        }
        if (js.lang.Types.isBoolean(value)) {
            return this.BOOLEAN_PATTERN.test(operand);
        }
        if (js.lang.Types.isNumber(value)) {
            return this.NUMBER_PATTERN.test(operand);
        }
        if (js.lang.Types.isDate(value)) {
            return this.DATE_PATTERN.test(operand);
        }
        return true;
    }
};

/**
 * Utility class for dates related processing.
 * 
 * @author Iulian Rotaru
 * @since 1.8
 */
js.dom.template.ConditionalExpression.Dates = {
    /**
     * ISO8601 date format pattern but with optional fields. Only year is mandatory. Optional fields should be in
     * sequence; if an optional field is missing all others after it should also be missing.
     * 
     * @type RegExp
     */
    DATE_PATTERN : /(\d{4})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2})(?::(\d{2})(?::(\d{2})(?:Z)?)?)?)?)?)?/,

    /**
     * Get a regular expression matcher for ISO8601 date format but with optional fields.
     * 
     * @param String dateFormat date format to parse.
     * @return Array matcher initialized with values from given <code>dateFormat</code>.
     */
    dateMatcher : function (dateFormat) {
        // at this point date format is already validated and is safe to ignore null matcher
        var matcher = this.DATE_PATTERN.exec(dateFormat);
        $assert(matcher, "js.dom.template.ConditionalExpression.Dates#dateMatcher", "Unexpectable null matcher.");
        return matcher;
    },

    /**
     * Parse ISO8601 formatted date but accept optional fields. For missing fields uses sensible default values, that
     * is, minimum value specific to field. For example, default day of the month value is 1.
     * 
     * @param String dateFormat date format to parse.
     * @return Date date instance initialized from given <code>dateFormat</code>.
     */
    parse : function (dateFormat) {
        var matcher = this.dateMatcher(dateFormat);

        var year = this._group(matcher, 1);
        var month = this._group(matcher, 2);
        var day = this._group(matcher, 3);
        var hours = this._group(matcher, 4);
        var minutes = this._group(matcher, 5);
        var seconds = this._group(matcher, 6);
        var utc = Date.UTC(year, month, day, hours, minutes, seconds);

        return new Date(utc);
    },

    /**
     * Return normalized integer value for specified matcher group. If requested group value is null uses sensible
     * default values. Takes care to return 0 for January and 1 for default day of the month; all other fields defaults
     * to 0.
     * 
     * @param Array matcher regular expression matcher,
     * @param Number group group number.
     * @return Number integer value extracted from matcher or specific default value.
     */
    _group : function (matcher, group) {
        var value = matcher[group];
        if (group == 2) {
            // the second group is hard coded to month and should be normalized, January should be 0
            return this._parseInt(value, 1) - 1;
        }
        if (group == 3) {
            // the third group is hard coded to day of month and should default to 1
            return this._parseInt(value, 1);
        }
        // all other groups defaults to 0
        return this._parseInt(value, 0);
    },

    /**
     * Return integer value from given numeric string or given default if value is null.
     * 
     * @param String value numeric value, possible null,
     * @param Number defaultValue default value used when value is null.
     * @return Number integer value, parsed or default.
     */
    _parseInt : function (value, defaultValue) {
        return value ? parseInt(value) : defaultValue;
    },

    /**
     * Decompose date into its constituent items. Takes care to human normalize month value, that is, January is 1 not
     * 0.
     * 
     * @param Date date date value.
     * @return Array given <code>date</code> items.
     */
    dateItems : function (date) {
        var items = new Array(6);

        items[0] = date.getUTCFullYear();
        items[1] = date.getUTCMonth() + 1;
        items[2] = date.getUTCDate();
        items[3] = date.getUTCHours();
        items[4] = date.getUTCMinutes();
        items[5] = date.getUTCSeconds();

        return items;
    }
};
$package("js.dom.template");

/**
 * Model object adapter. Templates engine operates upon application model used as source for dynamic content. But model
 * object is, and must be, business oriented and is quite possible to have views with needs not covered directly by
 * model. This class is used exactly for that: it is an adapter for model used to synthesize properties not directly
 * supplied by it. So, strictly speaking, templates engine does not directly acts upon model object but on this content
 * adapter.
 * <p>
 * This class supplies getters for content values but all use {@link #getValue(Object, String)} which on its turn
 * retrieves properties from model. Now is the interesting part: if model property is missing this class searches for a
 * getter with a name synthesized from requested property name. And since this class does not offer per se any special
 * getter it relies on subclasses.
 * 
 * <pre>
 *  class Person {
 *      id;
 *  }
 * 
 *  class PersonContent extends Content {
 *      getLink() {
 *          return &quot;person-view.xsp?id&quot; + person.id;
 *      }
 *  }
 * 
 *  &lt;a data-href="link" /&gt;
 * </pre>
 * 
 * In above pseudo-code we have a link with <em>href</em> operator having <em>link</em> as operand, in this case a
 * property path. Operator requests from content instance a value with name <em>link</em>. Content adapter searches
 * person instance, the model in this case, and since link property is undefined tries a getter named <em>getLink</em>,
 * defined by subclass, this time with success.
 * <p>
 * Content adapter does use <em>property path</em> abstraction to denote a specific content value. This name hides two
 * concepts: property and path.
 * <ul>
 * <li>Property is used to designates a value inside an object. Is is more generic than object field since it covers
 * content synthetic getters too, as shown above. Also a property name can be a numeric index, if object instance is an
 * array. This way both object and array instances are accessible with the same property abstraction:
 * 
 * <pre>
 * content.getValue(object, &quot;id&quot;); // here object is an Object instance with a field named &quot;id&quot;
 * content.getValue(object, &quot;2&quot;); // object is an array or list and &quot;2&quot; is the index
 * </pre>
 * 
 * <li>In this class acception an object is a tree of values and property path is simply a list of path components
 * separated by dots. For example, in below snippet the property path <em>car.wheels.1.manufacturer</em> designates
 * the manufacturer of the second wheel from car while <em>car.model</em> designates, you guess, car model.
 * 
 * <pre>
 *  class Car {
 *      model;
 *      wheels[4];
 *  }
 *  class Wheel {
 *      manufacturer;
 *  }
 * </pre>
 * 
 * Property path can be absolute, when begin with dot, or relative. An absolute path refers to content adapter root,
 * that is, the wrapped model. A relative one uses a scope object; this scope object is always present where property
 * path is present too and there are operators that change this scope object.
 * </ul>
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * 
 * @constructor Construct template content.
 * @param Object model model object to inject.
 * @assert model argument is not undefined, null or empty.
 */
js.dom.template.Content = function(model) {
	$assert(model, "js.dom.template.Content#Content", "Model is undefined or null.");
	/**
	 * Model object.
	 * 
	 * @type Object
	 */
	this._model = model ? model : {};
};

$static(function() {
	/**
	 * Empty iterator returned when requested content value is null.
	 * 
	 * @type js.lang.Uniterator
	 */
	js.dom.template.Content._EMPTY_ITERATOR = new js.lang.Uniterator([]);

	/**
	 * Empty map returned whenever a valid map is not found.
	 * 
	 * @type Object
	 */
	js.dom.template.Content._EMPTY_MAP = {};
});

js.dom.template.Content.prototype = {
	/**
	 * Get content model.
	 * 
	 * @return Object model.
	 */
	getModel : function() {
		return this._model;
	},

	/**
	 * Get content value as iterable. Returns the value retrieved by {@link #getValue(Object,String)} as uniterator. If
	 * found value is null log a warning and returns empty iterator. Content value should be an {@link Array} otherwise
	 * this method rise content exception.
	 * 
	 * @param Object scope scope object, used if property path is relative,
	 * @param String propertyPath property path.
	 * @return js.lang.Uniterator iterator instance.
	 * @throws js.dom.template.ContentException if found content value is undefined or is not an array.
	 */
	getIterable : function(scope, propertyPath) {
		var value = this.getValue(scope, propertyPath);
		if (value == null) {
			$warn("js.dom.template.Content#getIterable", "Null content value for property |%s|. Returns empty iterator.", propertyPath);
			return js.dom.template.Content._EMPTY_ITERATOR;
		}
		if (!js.lang.Types.isArray(value)) {
			throw new js.dom.template.ContentException(propertyPath, "Invalid content type. Expected array but got |%s|.", value);
		}
		return new js.lang.Uniterator(value);
	},

	/**
	 * Get content value as map. Delegates {@link #getValue(Object,String)} to actually retrieve content value that
	 * should be an object, used by templates engine as hash. If value is not a pure object, usable as map, as defined
	 * by {@link js.lang.Types#isStrictObject(Object)} this method throws content exception. If found value is null log a
	 * warning and returns empty map.
	 * 
	 * @param Object scope scope object, used if property path is relative,
	 * @param String propertyPath property path.
	 * @return Object content value object, possible empty.
	 * @throws js.dom.template.ContentException if found content value undefined or is not usable as map.
	 */
	getMap : function(scope, propertyPath) {
		var value = this.getValue(scope, propertyPath);
		if (value == null) {
			$warn("js.dom.template.Content#getMap", "Null content value for property |%s|. Returns empty map.", propertyPath);
			return js.dom.template.Content._EMPTY_MAP;
		}
		if (!js.lang.Types.isStrictObject(value)) {
			throw new js.dom.template.ContentException(propertyPath, "Invalid content type. Expected map but got |%s|.", value);
		}
		return value;
	},

	/**
	 * Test if content value is empty. Delegates {@link #getValue(Object,String)} and returns true if found value
	 * fulfill one of the next conditions:
	 * <ul>
	 * <li>null
	 * <li>boolean false
	 * <li>number equals with 0
	 * <li>empty string
	 * <li>array of length 0
	 * </ul>
	 * Note that undefined value is suspected as bug and throws error; it is not considered empty value.
	 * 
	 * @param Object scope scope object, used if property path is relative,
	 * @param String propertyPath property path.
	 * @return true if value is empty.
	 * @throws js.dom.template.ContentException if found content value is undefined.
	 */
	isEmpty : function(scope, propertyPath) {
		var value = this.getValue(scope, propertyPath);
		if (value == null) {
			return true;
		}
		if (typeof value.length !== "undefined") {
			return value.length === 0;
		}
		if (js.lang.Types.isFunction(value.size)) {
			return value.size() === 0;
		}
		if (js.lang.Types.isFunction(value.isEmpty)) {
			return value.isEmpty();
		}
		return !value;
	},

	/**
	 * Get content value. This method supports both overloads: relative or absolute object property path. If property
	 * path is relative searching context should be present.
	 * 
	 * @param Object context optional search context, defaults to entire model,
	 * @param String propertyPath object property path, relative or absolute.
	 * @return Object requested value or null.
	 */
	getValue : function(context, propertyPath) {
		$assert(arguments.length === 1 || arguments.length === 2, "js.dom.template.Content#getValue", "Invalid arguments count.");

		if (propertyPath === ".") {
			return context;
		}
		if (propertyPath.charAt(0) === ".") {
			return this._getAbsoluteValue(propertyPath);
		}
		return this._getRelativeValue(context, propertyPath);
	},

	/**
	 * Get absolute value.
	 * 
	 * @param String propertyPath object property path.
	 * @assert argument is not undefined or null and is a {@link String}.
	 */
	_getAbsoluteValue : function(propertyPath) {
		$assert(propertyPath && js.lang.Types.isString(propertyPath), "js.dom.template.Content#_getAbsoluteValue", "Property path is undefined, null, empty or not string.");
		$assert(propertyPath.charAt(0) === ".", "js.dom.template.Content#_getAbsoluteValue", "Property path is not absolute.");
		return this._getRelativeValue(this._model, propertyPath.substr(1));
	},

	/**
	 * Retrieve value relative to given context.
	 * 
	 * @param Object context object on which value should be searched,
	 * @param String propertyPath object property path.
	 * @assert both arguments are not undefined or null and are of proper type.
	 * @throws js.dom.template.ContentException if requested value is undefined.
	 */
	_getRelativeValue : function(context, propertyPath) {
		$assert(context && js.lang.Types.isObject(context), "js.dom.template.Content#_getRelativeValue", "Context is undefined, null or not object.");
		$assert(propertyPath && js.lang.Types.isString(propertyPath), "js.dom.template.Content#_getRelativeValue", "Property path is undefined, null, empty or not string.");

		var o = context;
		var pathElements = propertyPath.split(".");
		for ( var i = 0;;) {
			o = this._getObjectProperty(o, pathElements[i]);
			if (++i === pathElements.length) {
				return o;
			}
			if (o == null) {
				return null;
			}
			if (!js.lang.Types.isObject(o)) {
				throw new js.dom.template.ContentException(propertyPath, "Undefined content value.");
			}
		}
		return o;
	},

	/**
	 * Get object property. Get identified property from object. If undefined try getter from this content adapter
	 * instance; getter name is concatenated from <em>get</em> and property name as title case.
	 * 
	 * @param Object object object to retrieve property from,
	 * @param String property property name.
	 * @throws js.dom.template.ContentException if requested property is undefined.
	 */
	_getObjectProperty : function(object, property) {
		$assert(js.lang.Types.isObject(object), "js.dom.template.Content#_getObjectProperty", "Object is not of proper type.");
		$assert(js.lang.Types.isString(property), "js.dom.template.Content#_getObjectProperty", "Property name is not a string.");
		
		// takes care to normalize property name since it can be CSS like hyphen case
		property = js.util.Strings.toScriptCase(property);
		var value = object[property];
		if (typeof value !== "undefined") {
			return value;
		}
		var getterName = "get" + property.charAt(0).toUpperCase() + property.substr(1);
		var getter = this[getterName];
		if (js.lang.Types.isFunction(getter)) {
			return getter.call(this, object);
		}
		throw new js.dom.template.ContentException(property, "Undefined content value.");
	},

	/**
	 * Returns a string representation of the object.
	 * 
	 * @return String object string representation.
	 */
	toString : function() {
		return "js.dom.template.Content";
	}
};
$extends(js.dom.template.Content, Object);
$package('js.dom.template');

/**
 * Undefined property exception thrown when content instance can't find requested property.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * @constructor Construct undefined property exception instance.
 * @param String propertyPath suspected content property path,
 * @param String message cause explanation,
 * @param Object... args optional arguments if message is formatted.
 */
js.dom.template.ContentException = function(propertyPath, message) {
	$assert(this instanceof js.dom.template.ContentException, 'js.dom.template.ContentException#ContentException', 'Invoked as function.');
	this.$super($format(arguments, 1));

	/**
	 * Exception name.
	 * 
	 * @type String
	 */
	this.name = 'Undefined property exception';

	/**
	 * Suspected content property path.
	 * 
	 * @type String
	 */
	this.propertyPath = propertyPath;
};

js.dom.template.ContentException.prototype = {
	/**
	 * Returns a string representation of the object.
	 * 
	 * @return String object string representation.
	 */
	toString : function() {
		return 'js.dom.template.ContentException';
	}
};
$extends(js.dom.template.ContentException, js.lang.Exception);
$package("js.dom.template");

/**
 * Add or remove CSS class based on property value.
 * 
 * <pre>
 *  &lt;section data-css-class="type:directory;" /&gt;
 * </pre>
 * 
 * Operand is the property path used to get content value.
 * 
 * @author Iulian Rotaru
 * @since 1.2.5
 * 
 * @constructor Construct CSS_CLASS operator instance.
 * @param js.dom.template.Content content dynamic content.
 */
js.dom.template.CssClassOperator = function (content) {
    this.$super(content);
};

js.dom.template.CssClassOperator.prototype = {
    /**
     * Execute ID operator. Uses property path to extract content value, convert it to string and set <em>id</em>
     * attribute.
     * 
     * @param js.dom.Element element context element,
     * @param Object scope scope object,
     * @param String expression CSS class expression.
     * @throws js.dom.template.ContentException if requested content value is undefined.
     * @assert content value is string or number.
     */
    _exec : function (element, scope, expression) {
        js.util.Strings.parseNameValues(expression).forEach(function (pair) {
            var expression = pair.name;
            var cssClass = pair.value;

            var conditionalExpression = new js.dom.template.ConditionalExpression(this._content, scope, expression);
            if (conditionalExpression.value()) {
                $debug("js.dom.template.CssClassOperator#_exec", "Add CSS class |%s| to element |%s|.", cssClass, element);
                element.addCssClass(cssClass);
            }
            else {
                $debug("js.dom.template.CssClassOperator#_exec", "Remove CSS class |%s| from element |%s|.", cssClass, element);
                element.removeCssClass(cssClass);
            }
        }, this);
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.dom.template.CssClassOperator";
    }
};
$extends(js.dom.template.CssClassOperator, js.dom.template.Operator);
$package("js.dom.template");

/**
 * Exclude element and its descendants from resulting document. What exclusion means is implementation dependent: one
 * may choose to hide somehow - maybe display:none, another to simple remove the branch completely from resulting
 * document. The point is, the marked branch must not be visible to end user. This operator is not so much a conditional
 * one since test is performed on a boolean literal rather than some content value. Branch exclusion is actually decided
 * on development phase. A good usage example may be email template: head meta is used for email initialization but not
 * included into delivery.
 * 
 * <pre>
 *  &lt;head data-exclude="true"&gt;
 *      &lt;meta name="from" content="from@server.com" /&gt;
 *      &lt;meta name="subject" content="subject" /&gt;
 *  &lt;/head&gt;
 * </pre>
 * 
 * Operand is a boolean literal. Nothing special: <em>true</em> or <em>false</em>.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * 
 * @constructor Construct exclude operator instance.
 */
js.dom.template.ExcludeOperator = function() {
};

js.dom.template.ExcludeOperator.prototype = {
	/**
	 * Execute EXCLUDE operator. Returns branch enabled flag, that is, true to indicate branch is to be included in
	 * resulting document. Since exclude operator has opposite logic we need to negate given boolean expression; so, if
	 * operand is 'true' meaning the branch should be excluded this method returns false.
	 * 
	 * @param js.dom.Element element context element, unused,
	 * @param Object scope scope object, unused,
	 * @param Boolean booleanExpression boolean expression, 'true' or 'false'.
	 * @return branch enabled flag, that is, false if templates engine should continue processing the branch.
	 */
	_exec : function(element, scope, booleanExpression) {
		// returned value is interpreted as branch enabled
		// boolean expression argument is true if branch should be excluded, so we need to inverse it
		return !(booleanExpression.toLowerCase() === "true");
	},

	/**
	 * Returns a string representation of the object.
	 * 
	 * @return String object string representation.
	 */
	toString : function() {
		return "js.dom.template.ExcludeOperator";
	}
};
$extends(js.dom.template.ExcludeOperator, js.dom.template.Operator);
$package("js.dom.template");

/**
 * Unconditional jump to element with ID specified by this operator literal value. This operator is not part of
 * j(s)-templates interface; it is an extension used for internal engine speed optimization. Usually is handled by
 * building tool, eliminating from scanning process document subtrees known to not have templates operators. For example
 * is used on building tests page into <code>html</code> tag to jump directly to scratch area resulting a speed gain
 * for running tests of about 300%.
 * 
 * <pre>
 *  &lt;div data-goto="templates-root-id"&gt;
 *      // document sections known to not have templates operators
 *      &lt;section id="templates-root-id"&gt;
 *          . . .
 *      &lt;/section&gt;
 *  &lt;/div&gt;
 * </pre>
 * 
 * Operand is a string literal representing the ID of the element to jump to. When templates engine executes above goto
 * operator it literally replace the <em>div</em> element with target <em>section</em>, into processing pipe. All
 * others descendants are ignored, even if they contain templates operators.
 * 
 * <pre>
 *       2 - 3                     6
 *      /                         /
 * 0 - 1       6      :=     0 - 5  
 *      \     /                   \
 *       4 - 5                     7
 *            \
 *             7
 * </pre>
 * 
 * In above example element <b>1</b> has a goto operator with <b>5</b> as target element. Equivalent processing tree
 * is shown in the right and one may note that only element <b>5</b> and its descendants are processed; all others are
 * skipped.
 * <p>
 * Please note that server side templates engine does not implement this operator and is natural since it needs to
 * serialize all template document.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * 
 * @constructor Construct goto operator instance.
 */
js.dom.template.GotoOperator = function () {
};

js.dom.template.GotoOperator.prototype = {
    /**
     * Execute GOTO operator. Just store return the target element ID.
     * 
     * @param js.dom.Element element context element, unused,
     * @param Object scope scope object, unused,
     * @param String elementID element ID to jump to.
     * @return target element ID.
     */
    _exec : function (element, scope, elementID) {
        return elementID;
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.dom.template.GotoOperator";
    }
};
$extends(js.dom.template.GotoOperator, js.dom.template.Operator);
$package("js.dom.template");

/**
 * Set <em>href</em> attribute value.
 * 
 * <pre>
 *  &lt;a data-href="url"&gt;Follow the link...&lt;/a&gt;
 * </pre>
 * 
 * Operand is the property path used to get content value.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * 
 * @constructor Construct HREF operator instance.
 * @param js.dom.template.Content content dynamic content.
 */
js.dom.template.HrefOperator = function (content) {
    this.$super(content);
};

js.dom.template.HrefOperator.prototype = {
    /**
     * Execute HREF operator. Uses property path to extract content value, convert it to string and set <em>href</em>
     * attribute.
     * 
     * @param js.dom.Element element context element, unused,
     * @param Object scope scope object,
     * @param String propertyPath property path.
     * @throws js.dom.template.ContentException if requested content value is undefined.
     * @assert <code>element</code> has no <code>href</code> attribute.
     */
    _exec : function (element, scope, propertyPath) {
        $assert(!element.hasAttr("href"), "js.dom.template.IdOperator#exec", "Invalid element |%s|. It has both static 'href' attribute and HREF operator.", element);
        $assert(propertyPath === "." || js.lang.Types.isObject(scope), "js.dom.template.HrefOperator#exec", "Operand is property path but scope is not an object.");

        var href = this._content.getValue(scope, propertyPath);
        if (href == null) {
            $warn("js.dom.template.HrefOperator#_exec", "Null property |%s|. Remove href attribute from element |%s|.", propertyPath, element);
            element.removeAttr("href");
        }
        else {
            $assert(js.lang.Types.isString(href), "js.dom.template.HrefOperator#_exec", "Content value is not a string.");
            $debug("js.dom.template.HrefOperator#_exec", "Set element |%s| href attribute from property |%s|.", element, propertyPath);
            element.setAttr("href", href);
        }
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.dom.template.HrefOperator";
    }
};
$extends(js.dom.template.HrefOperator, js.dom.template.Operator);
$package("js.dom.template");

/**
 * Set element inner HTML, useful for text formatted with HTML tags.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * 
 * @constructor Construct HTML operator instance.
 * @param js.dom.template.Content content dynamic content.
 */
js.dom.template.HtmlOperator = function (content) {
    this.$super(content);
};

js.dom.template.HtmlOperator.prototype = {
    /**
     * Execute HTML operator. Uses property path to retrieve content value, convert it to string and set element inner
     * HTML.
     * 
     * @param js.dom.Element element context element,
     * @param Object scope scope object,
     * @param String propertyPath property path.
     * @return Object always returns null to indicate full content processing.
     * @throws js.dom.template.ContentException if requested content value is undefined.
     * @assert element has no children and content value is a string.
     */
    _exec : function (element, scope, propertyPath) {
        if (scope == null) {
            $warn("js.dom.template.HtmlOperator#_exec", "Null scope for property |%s|. Remove children from element |%s|.", propertyPath, element);
            element.removeChildren();
            return null;
        }

        $assert(propertyPath === "." || js.lang.Types.isObject(scope), "js.dom.template.HtmlOperator#_exec", "Operand is property path but scope is not an object.");
        $assert(!element.hasChildren(), "js.dom.template.HtmlOperator#_exec", "Element |%s| has children. Cannot set inner HTML.", element);
        var html = this._content.getValue(scope, propertyPath);

        if (html == null) {
            $warn("js.dom.template.HtmlOperator#_exec", "Null property |%s|. Remove children from element |%s|.", propertyPath, element);
            element.removeChildren();
        }
        else {
            $assert(js.lang.Types.isString(html), "js.dom.template.HtmlOperator#_exec", "Content value is not a string.");
            $debug("js.dom.template.HtmlOperator#_exec", "Set element |%s| inner HTML from property |%s|.", element, propertyPath);
            element.setHTML(html);
        }
        return undefined;
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.dom.template.HtmlOperator";
    }
};
$extends(js.dom.template.HtmlOperator, js.dom.template.Operator);
$package("js.dom.template");

/**
 * Set <em>id</em> attribute value.
 * 
 * <pre>
 *  &lt;section data-id="id" /&gt;
 * </pre>
 * 
 * Operand is the property path used to get content value.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * 
 * @constructor Construct ID operator instance.
 * @param js.dom.template.Content content dynamic content.
 */
js.dom.template.IdOperator = function (content) {
    this.$super(content);
};

js.dom.template.IdOperator.prototype = {
    /**
     * Execute ID operator. Uses property path to extract content value, convert it to string and set <em>id</em>
     * attribute.
     * 
     * @param js.dom.Element element context element,
     * @param Object scope scope object,
     * @param String propertyPath property path.
     * @throws js.dom.template.ContentException if requested content value is undefined.
     * @assert <code>element</code> has no <code>id</code> attribute, content value is string or number and
     *         <code>scope</code> is an {@link Object}.
     */
    _exec : function (element, scope, propertyPath) {
        $assert(!element.hasAttr("id"), "js.dom.template.IdOperator#exec", "Invalid element |%s|. It has both static 'id' attribute and ID operator.", element);
        $assert(propertyPath === "." || js.lang.Types.isObject(scope), "js.dom.template.IdOperator#exec", "Operand is property path but scope is not an object.");

        var id = this._content.getValue(scope, propertyPath);
        if (id == null) {
            $warn("js.dom.template.IdOperator#_exec", "Null property |%s|. Remove id attribute from element |%s|.", propertyPath, element);
            element.removeAttr("id");
        }
        else {
            if (js.lang.Types.isNumber(id)) {
                id = id.toString();
            }
            $assert(js.lang.Types.isString(id), "js.dom.template.IdOperator#_exec", "ID operand should be string or numeric.");
            $debug("js.dom.template.IdOperator#_exec", "Set element |%s| id attribute from property |%s|.", element, propertyPath);
            element.setAttr("id", id);
        }
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.dom.template.IdOperator";
    }
};
$extends(js.dom.template.IdOperator, js.dom.template.Operator);
$package("js.dom.template");

/**
 * Include branch if content value is not empty. Operand is the property path; uses it to get content value and test if
 * is empty. If value is not empty, that is <em>if</em> content, branch is included. See {@link Content#isEmpty} for
 * definition of empty value.
 * 
 * <pre>
 *  &lt;div data-if="flag"&gt;  
 *  . . .
 *  &lt;/div&gt;
 * </pre>
 * 
 * If <em>flag</em> is empty div and all its descendants are excluded from resulting document. This operator is the
 * counterpart of {@link IfNotOperator} acting with opposite logic. These two operators can be combined to emulate
 * if/else:
 * 
 * <pre>
 *  &lt;div data-if="flag"&gt;  
 *      // this branch is included if flag is not empty
 *  &lt;/div&gt;
 *  &lt;div data-ifnot="flag"&gt;  
 *      // this branch is included if flag is empty
 *  &lt;/div&gt;
 * </pre>
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * 
 * @constructor Construct IF operator instance.
 * @param js.dom.template.Content content dynamic content.
 */
js.dom.template.IfOperator = function (content) {
    this.$super(content);
};

js.dom.template.IfOperator.prototype = {
    /**
     * Execute IF operator. Uses property path to extract content value and return true if not empty. Returned value
     * acts as branch enabled flag.
     * 
     * @param js.dom.Element element context element, unused,
     * @param Object scope scope object,
     * @param String expression conditional expression.
     * @return true if content value is not empty.
     * @throws js.dom.template.ContentException if requested content value is undefined.
     */
    _exec : function (element, scope, expression) {
        var conditionalExpression = new js.dom.template.ConditionalExpression(this._content, scope, expression);
        return conditionalExpression.value();
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.dom.template.IfOperator";
    }
};
$extends(js.dom.template.IfOperator, js.dom.template.Operator);
$package('js.dom.template');

/**
 * Index used by ordered lists and maps to keep items track for numbering. It is created before entering list or map
 * iteration and incremented before every item processing. Note that first item index value is 1, not zero; also every
 * ordered list or map has its own index. All indexes are kept into a stack to allows for nesting.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * 
 * @constructor Construct index instance.
 */
js.dom.template.Index = function() {
	/**
	 * Index value. First item is 1.
	 * 
	 * @type Number
	 */
	this.value = 0;
};

js.dom.template.Index.prototype = {
	/**
	 * Increment this index value.
	 */
	increment : function() {
		++this.value;
	},

	/**
	 * Returns a string representation of the object.
	 * 
	 * @return String object string representation.
	 */
	toString : function() {
		return "js.dom.template.Index";
	}
};
$extends(js.dom.template.Index, Object);
$package("js.dom.template");

/**
 * Populate element using first child as item template. Extract content list designated by defined property path then
 * uses first element as item template and repeat it for every item from list. Assert if child is missing; if more
 * children, they are simple ignored. When processing items this operator does a temporary scope object switch. Every
 * child element is processed into list item object scope. List item can be primitives, arbitrary complex object or
 * nested lists or maps. There is no restriction on nesting level.
 * 
 * <pre>
 *  &lt;ul data-list="persons"&gt;
 *      &lt;li data-text="name"&gt;&lt;/li&gt;
 *  &lt;/ul&gt;
 *  
 *  List&lt;Person&gt; persons;
 *  class Person {
 *      String name;
 *  }
 * </pre>
 * 
 * This operator operand is the property path designating the list.
 * <p>
 * Item template operators are processed recursively by engine logic. Anyway, child element operator can miss, in which
 * case default is applied as follows: if template element has children is assumed to have {@link Opcode#OBJECT}
 * operator, otherwise {@link Opcode#TEXT}.
 * 
 * <pre>
 *  &lt;ul data-list="."&gt;
 *      &lt;li&gt; . . . &lt;/li&gt;
 *  &lt;/ul&gt;
 * </pre>
 * 
 * Note that this operator belongs to {@link Type#CONTENT} group and only one content operator is allowed per element.
 * See the {@link Type#CONTENT the list} of mutually excluding content operators.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * 
 * @constructor Construct LIST operator instance.
 * @param js.dom.template.Template template parent template,
 * @param js.dom.template.Content content dynamic content instance.
 */
js.dom.template.ListOperator = function (template, content) {
    /**
     * Parent template.
     * 
     * @type js.dom.template.Template
     */
    this._template = template;

    this.$super(content);
};

js.dom.template.ListOperator.prototype = {
    /**
     * Item template user data key. Used to store and retrieve this list template to/from element user data.
     * 
     * @type String
     */
    _ITEM_TEMPLATE : "item-template",

    _ITEM_VALUE : "value",

    /**
     * Execute LIST operator. Extract content list then repeat context element first child for every list item.
     * 
     * @param js.dom.Element element context element,
     * @param Object scope scope object,
     * @param String propertyPath property path.
     * @return always returns null to signal full processing.
     * @assert parameters are not undefined or null and of proper type and element has at least one child.
     */
    _exec : function (element, scope, propertyPath) {
        var itemTemplate = element.getUserData(this._ITEM_TEMPLATE);
        if (itemTemplate == null) {
            itemTemplate = element.getFirstChild();
            $assert(itemTemplate !== null, "js.dom.template.ListOperator#exec", "Invalid list element |%s|. Missing item template.", element);
            itemTemplate.remove(false);
            element.setUserData(this._ITEM_TEMPLATE, itemTemplate);
        }
        element.removeChildren();
        if (scope == null) {
            // on a null scope returns but after preparing item template and removing children
            return null;
        }

        $assert(propertyPath === "." || js.lang.Types.isObject(scope), "js.dom.template.ListOperator#exec", "Operand is property path but scope is not an object.");
        $debug("js.dom.template.ListOperator#_exec", "Process element |%s| for property |%s|.", element, propertyPath);

        var it = this._content.getIterable(scope, propertyPath), itemElement, value;
        while (it.hasNext()) {
            value = it.next();
            itemElement = itemTemplate.clone(true);
            itemElement.setUserData(this._ITEM_VALUE, value);
            element.addChild(itemElement);
            this._template._injectItem(itemElement, value);
        }
        return undefined;
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.dom.template.ListOperator";
    }
};
$extends(js.dom.template.ListOperator, js.dom.template.Operator);
$package('js.dom.template');

/**
 * Upper case Roman number index. Transform index into its Roman number representation. Its format code is <b>I</b>.
 * 
 * <pre>
 *  &lt;ul data-olist="."&gt;
 *      &lt;li data-numbering="%I)"&gt;&lt;/li&gt;
 *  &lt;/ul&gt;
 * </pre>
 * 
 * After templates rendering <em>li</em> elements text content will be I), II) ... . See {@link NumberingOperator} for
 * details about numbering format syntax.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * @constructor Construct upper case Roman numeric formatter instance.
 */
js.dom.template.UpperCaseRomanNumbering = function () {
};

js.dom.template.UpperCaseRomanNumbering.prototype = {
    /**
     * Roman numerals constants.
     * 
     * @type Array
     */
    Numeral : [ {
        roman : 'I',
        decimal : 1
    }, {
        roman : 'IV',
        decimal : 4
    }, {
        roman : 'V',
        decimal : 5
    }, {
        roman : 'IX',
        decimal : 9
    }, {
        roman : 'X',
        decimal : 10
    }, {
        roman : 'XL',
        decimal : 40
    }, {
        roman : 'L',
        decimal : 50
    }, {
        roman : 'XC',
        decimal : 90
    }, {
        roman : 'C',
        decimal : 100
    }, {
        roman : 'CD',
        decimal : 400
    }, {
        roman : 'D',
        decimal : 500
    }, {
        roman : 'CM',
        decimal : 900
    }, {
        roman : 'M',
        decimal : 1000
    } ],

    /**
     * Format index as upper case Roman numeral.
     * 
     * @param Number index index value.
     * @return String formatted index.
     */
    format : function (index) {
        var s = '';
        for ( var i = this.Numeral.length - 1; i >= 0; i--) {
            while (index >= this.Numeral[i].decimal) {
                s += this.Numeral[i].roman;
                index -= this.Numeral[i].decimal;
            }
        }
        return s;
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return 'js.dom.template.UpperCaseRomanNumbering';
    }
};
$extends(js.dom.template.UpperCaseRomanNumbering, Object);
$package('js.dom.template');

/**
 * Roman numeric index, lower case. Lower case variant of {@link UpperCaseRomanNumbering}. Its format code is <b>i</b>.
 * 
 * <pre>
 *  &lt;ul data-olist="."&gt;
 *      &lt;li data-numbering="%i)"&gt;&lt;/li&gt;
 *  &lt;/ul&gt;
 * </pre>
 * 
 * After templates rendering <em>li</em> elements text content will be i), ii) ... . See {@link NumberingOperator} for
 * details about numbering format syntax.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * @constructor Construct lower case Roman numeric formatter instance.
 */
js.dom.template.LowerCaseRomanNumbering = function() {
};

js.dom.template.LowerCaseRomanNumbering.prototype = {
	/**
	 * Format index as lower case Roman numeral.
	 * 
	 * @param Number index index value.
	 * @return String formatted index.
	 */
	format : function(index) {
		return this.$super('format', index).toLowerCase();
	},

	/**
	 * Returns a string representation of the object.
	 * 
	 * @return String object string representation.
	 */
	toString : function() {
		return "js.dom.template.LowerCaseRomanNumbering";
	}
};
$extends(js.dom.template.LowerCaseRomanNumbering, js.dom.template.UpperCaseRomanNumbering);
$package('js.dom.template');

/**
 * Upper case string list index. This class uses the set of English upper case characters to represent given index. If
 * index overflow the {@link #dictionary} repeat the character, e.g. 1 is A, 27 is AA, 53 is AAA and so on, where 26 is
 * dictionary size. Its format code is <b>S</b>.
 * 
 * <pre>
 *  &lt;ul data-olist="."&gt;
 *      &lt;li data-numbering="%S)"&gt;&lt;/li&gt;
 *  &lt;/ul&gt;
 * </pre>
 * 
 * After templates rendering <em>li</em> elements text content will be A), B) ... . See {@link NumberingOperator} for
 * details about numbering format syntax.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * @constructor Construct upper case string index formatter instance.
 */
js.dom.template.UpperCaseStringNumbering = function () {
};

js.dom.template.UpperCaseStringNumbering.prototype = {
    /**
     * Set of English upper case letters.
     */
    _dictionary : "ABCDEFGHIJKLMNOPQRSTUVWXYZ",

    /**
     * Format index as upper case string. Transform index into a upper case string following next rules:
     * <ul>
     * <li>be dictionary the set of English upper case characters,
     * <li>if index is smaller that dictionary length uses index directly to extract the character and return it,
     * <li>divide index by dictionary length,
     * <li>be chars count the quotient plus one,
     * <li>be index equals remainder,
     * <li>extract char from dictionary using index and return it repeated chars count times.
     * </ul>
     * 
     * @param Number index index value.
     * @return String formatted index.
     */
    format : function (index) {
        --index; // lists index value starts with 1
        var charsCount = Math.floor(index / this._dictionary.length) + 1;
        index = index % this._dictionary.length;
        var c = this._dictionary.charAt(index);
        var s = "";
        for ( var i = 0; i < charsCount; ++i) {
            s += c;
        }
        return s;
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return 'js.dom.template.UpperCaseStringNumbering';
    }
};
$extends(js.dom.template.UpperCaseStringNumbering, Object);
$package('js.dom.template');

/**
 * Lower case string list index. Lower case variant of {@link UpperCaseStringNumbering}. Its format code is <b>s</b>.
 * 
 * <pre>
 *  &lt;ul data-olist="."&gt;
 *      &lt;li data-numbering="%s)"&gt;&lt;/li&gt;
 *  &lt;/ul&gt;
 * </pre>
 * 
 * After templates rendering <em>li</em> elements text content will be a), b) ... . See {@link NumberingOperator} for
 * details about numbering format syntax.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * @constructor Construct lower case string index formatter instance.
 */
js.dom.template.LowerCaseStringNumbering = function() {
};

js.dom.template.LowerCaseStringNumbering.prototype = {
	/**
	 * Format index as lower case string.
	 * 
	 * @param Number index index value.
	 * @return String formatted index.
	 */
	format : function(index) {
		return this.$super('format', index).toLowerCase();
	},

	/**
	 * Returns a string representation of the object.
	 * 
	 * @return String object string representation.
	 */
	toString : function() {
		return "js.dom.template.LowerCaseStringNumbering";
	}
};
$extends(js.dom.template.LowerCaseStringNumbering, js.dom.template.UpperCaseStringNumbering);
$package("js.dom.template");

/**
 * Populate element using first two children as key/value templates. Extract content map designated by declared property
 * path then uses first two elements as key/value templates and repeat them for every map entry. Missing child element
 * templates is fatal error so context element should have at least two child elements. If more, they are simple
 * ignored. When processing map entries this operator does a temporary scope object switch. Every child element is
 * processed into respective object scope. Map key/value pair can be primitives, arbitrary complex object or nested
 * lists or maps. There is no restriction on nesting level.
 * 
 * <pre>
 *  &lt;dl data-map="map"&gt;
 *      &lt;dt data-text="."&gt;&lt;/dt&gt;
 *      &lt;dd data-text="."&gt;&lt;/dd&gt;
 *  &lt;/dl&gt;
 *  
 *  Map&lt;String, String&gt; map;
 * </pre>
 * 
 * This operator operand is the property path designating the map.
 * <p>
 * Map entry templates operators are processed recursively by engine logic. Anyway, child element operator can miss, in
 * which case default is applied as follows: if template element has children is assumed to have {@link Opcode#OBJECT}
 * operator, otherwise {@link Opcode#TEXT}. So above sample can be rewritten:
 * 
 * <pre>
 *  &lt;dl data-map="map"&gt;
 *      &lt;dt&gt;&lt;/dt&gt;
 *      &lt;dd&gt;&lt;/dd&gt;
 *  &lt;/dl&gt;
 * </pre>
 * 
 * <p>
 * Note that this operator belongs to {@link Type#CONTENT} group and only one content operator is allowed per element.
 * See the {@link Type#CONTENT the list} of mutually excluding content operators.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * 
 * @constructor Construct MAP operator instance.
 * @param js.dom.template.Template template parent template,
 * @param Object content dynamic content.
 */
js.dom.template.MapOperator = function (template, content) {
    /**
     * Parent template.
     * 
     * @type js.dom.template.Template
     */
    this._template = template;

    this.$super(content);
};

js.dom.template.MapOperator.prototype = {
    /**
     * Key template user data key. Used to store and retrieve this map key template to/from element user data.
     * 
     * @type String
     */
    _KEY_TEMPLATE : "key-template",

    /**
     * Value template user data key. Used to store and retrieve this map value template to/from element user data.
     * 
     * @type String
     */
    _VALUE_TEMPLATE : "value-template",

    /**
     * Execute MAP operator. Extract content map using given property path and serialize every map entry using first two
     * child elements as key/value templates.
     * 
     * @param js.dom.Element element context element,
     * @param Object scope scope object,
     * @param String propertyPath property path.
     * @return always returns null to signal full processing.
     * @throws js.dom.template.ContentException if requested content value is undefined.
     * @assert element has at least two children used as key/value pairs.
     */
    _exec : function (element, scope, propertyPath) {
        var keyTemplate = element.getUserData(this._KEY_TEMPLATE), valueTemplate;
        if (keyTemplate == null) {
            keyTemplate = element.getFirstChild();
            $assert(keyTemplate !== null, "js.dom.template.MapOperator#_exec", "Invalid map element |%s|. Missing key template.", element);
            keyTemplate.remove(false);
            element.setUserData(this._KEY_TEMPLATE, keyTemplate);

            valueTemplate = element.getFirstChild();
            $assert(valueTemplate !== null, "js.dom.template.MapOperator#_exec", "Invalid MAP element |%s|. Missing value template.", element);
            valueTemplate.remove(false);
            element.setUserData(this._VALUE_TEMPLATE, valueTemplate);
        }
        else {
            valueTemplate = element.getUserData(this._VALUE_TEMPLATE);
        }
        element.removeChildren();
        if (scope == null) {
            // on a null scope returns but after preparing key and value templates and removing children
            return null;
        }

        $assert(propertyPath === "." || js.lang.Types.isObject(scope), "js.dom.template.MapOperator#exec", "Operand is property path but scope is not an object.");
        $debug("js.dom.template.MapOperator#_exec", "Process element |%s| for property |%s|.", element, propertyPath);

        var map = this._content.getMap(scope, propertyPath), keyElement, valueElement;
        for ( var key in map) {
            keyElement = keyTemplate.clone(true);
            valueElement = valueTemplate.clone(true);
            element.addChild(keyElement, valueElement);
            this._template._injectItem(keyElement, key);
            this._template._injectItem(valueElement, map[key]);
        }
        return undefined;
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.dom.template.MapOperator";
    }
};
$extends(js.dom.template.MapOperator, js.dom.template.Operator);
$package("js.dom.template");

/**
 * Set element text content accordingly numbering format and item index. It is usable inside elements with ordered lists
 * and maps operators which are responsible for index creation and increment; this operators deals only with formatting.
 * Trying to use it outside index scope will rise exception.
 * 
 * <pre>
 *  &lt;ul data-olist="."&gt;
 *      &lt;li data-numbering="D.2.%s)"&gt&lt;/li&gt;
 *  &lt;/ul&gt;
 * </pre>
 * 
 * After template execution <em>li</em> elements text content will be: D.2.a) D.2.b) ... D.2.i). Operand is an format
 * describing numbering format with next syntax:
 * 
 * <pre>
 *  numberingFormat := character* (indexFormat character*)+
 *  character := any less "%"
 *  indexFormat := "%" formatCode
 *  formatCode := "s" | "S" | "i" | "I" | "n"
 * </pre>
 * 
 * As observe, syntax allows for multiple index formating usable for nested list. Below sample will expand in a series
 * like: A.1, A.2 ... , B.1, B.2 ... .
 * 
 * <pre>
 *  &lt;section data-olist="outer"&gt;
 *      &lt;ul data-olist="inner"&gt;
 *          &lt;li data-numbering="%S.%n"&gt;&lt;/li&gt;
 *      &lt;/ul&gt;
 *  &lt;/section&gt;
 * </pre>
 * 
 * Because only ordered list have index, mixing order and unordered list is supported, although not really a use case.
 * 
 * <pre>
 *  &lt;ul data-olist="."&gt;
 *      &lt;li&gt;
 *          &lt;h1 data-numbering="%I"&gt;&lt;/h1&gt;
 *          &lt;ul data-list="."&gt; // unordered list between two with numbering
 *              &lt;li&gt;
 *                  &lt;h2&gt;&lt;/h2&gt;
 *                  &lt;ul data-olist="."&gt;
 *                      &lt;li&gt;
 *                          &lt;h3 data-numbering="%I.%S"&gt;&lt;/h3&gt;
 *                      &lt;/li&gt;
 *                  &lt;/ul&gt;
 *              &lt;/li&gt;
 *          &lt;/ul&gt;
 *      &lt;/li&gt;
 *  &lt;/ul&gt;
 * </pre>
 * 
 * Because of mixed unordered list, h3 elements will have a series like: I.A, I.B, I.A, I.B, II.A, II.B, II.A, II.B ... .
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * 
 * @constructor Construct NUMBERING operator instance.
 * @param js.dom.template.Template template parent template,
 * @param js.dom.template.Content content dynamic content instance.
 */
js.dom.template.NumberingOperator = function (template, content) {
    /**
     * Parent template.
     * 
     * @type js.dom.template.Template
     */
    this._template = template;

    this.$super(content);
};

js.dom.template.NumberingOperator.prototype = {
    /**
     * Insert formatted numbering as element text content. This operator must run inside a context prepared by a
     * surrounding ordered list or map. For this reason template indexes stack must not be empty.
     * 
     * @param js.dom.Element element element declaring numbering operator,
     * @param Object scope unused scope object,
     * @param String format numbering format, see class description for syntax.
     * @return always returns null to signal full processing.
     * @assert parent template indexes stack is not empty and declared format code is valid.
     */
    _exec : function (element, scope, format) {
        // scope can be null but this operator doesnot use it

        var indexes = this._template._indexes;
        $assert(indexes.length > 0, "js.dom.template.NumberingOperator#_exec", "Required ordered collection index is missing. Numbering operator cancel execution.");
        element.setText(this._getNumbering(indexes, format));
        return undefined;
    },

    /**
     * Parse numbering format and inject index values. First argument,the stack of indexes, is global per template
     * instance and format is the operand literal value. For nested numbering, format may contain more than one single
     * format code; this is the reason first argument is the entire indexes stack, not only current index. Given a stack
     * with four indexes those values are 1, 2, 3 and 4 and "%S - %I.%n-%s)" the format, resulting formatted string is
     * "A - II.3-d)".
     * 
     * @param Array indexes template global indexes storage,
     * @param String format numbering format.
     * @return String formatted numbering.
     */
    _getNumbering : function (indexes, format) {
        var sb = "";
        var i = format.length;
        var j = i;
        var indexPosition = indexes.length - 1;
        for (;;) {
            i = format.lastIndexOf('%', i);
            if (i === -1 && j > 0) {
                sb = format.substring(0, j) + sb;
                break;
            }
            if (i + 2 < format.length) {
                sb = format.substring(i + 2, j) + sb;
            }
            if (i + 1 === format.length) {
                continue;
            }

            var numberingFormat = this._getNumberingFormat(format.charAt(i + 1));
            sb = numberingFormat.format(indexes[indexPosition--].value) + sb;
            if (i === 0) {
                break;
            }
            j = i;
            i--;
        }
        return sb;
    },

    /**
     * Factory method for numbering format implementations. If format code is not recognized throws templates exception;
     * anyway validation tool catches this condition. See {@link NumberingFormat} for the list of valid format codes.
     * 
     * @param String formatCode single char format code.
     * @return Object requested numbering format instance.
     * @assert format code is valid.
     */
    _getNumberingFormat : function (formatCode) {
        switch (formatCode) {
        case 'n':
            return new js.dom.template.ArabicNumeralNumbering();
        case 's':
            return new js.dom.template.LowerCaseStringNumbering();
        case 'S':
            return new js.dom.template.UpperCaseStringNumbering();
        case 'i':
            return new js.dom.template.LowerCaseRomanNumbering();
        case 'I':
            return new js.dom.template.UpperCaseRomanNumbering();
        }
        $assert(false, "js.dom.template.NumberingOperator#_getNumberingFormat", "Invalid numbering format code |%s|.", formatCode);
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.dom.template.NumberingOperator";
    }
};
$extends(js.dom.template.NumberingOperator, js.dom.template.Operator);
$package("js.dom.template");

/**
 * Set element descendants to object properties. Being below snippet, templates engine loads person instance from
 * content, update h2 element text content to person name and img source to person picture.
 * 
 * <pre>
 *  &lt;section data-object="person"&gt;
 *      &lt;h1 data-text="name"&gt;&lt;/h1&gt;
 *      &lt;img data-src="picture" /&gt;
 *  &lt;/section&gt;
 *  
 *  var Person {
 *      name: "name",
 *      picture: "picture.png"
 *  }
 * </pre>
 * 
 * This operator's operand is a property path designating the object which properties are to be injected. One may notice
 * h1 and img elements operators uses property paths relative to person instance. This is because templates engine
 * temporarily changes scope object to person instance while processing element's descendants. Anyway, keep in mind that
 * only descendant's are processed in the person scope; if defining element has conditional or attribute operators they
 * are evaluated in currently existing scope. In below sample, section title is set to parent not child name.
 * 
 * <pre>
 *  &lt;section data-object="child" data-title="name"&gt;
 *      &lt;h1 data-text="name"&gt;&lt;/h1&gt;
 *  &lt;/section&gt;
 * 
 *  var Parent {
 *      name: "parent",
 *      child: child
 *  }
 *  var Child {
 *      name: "child"
 *  }
 * </pre>
 * 
 * Note that this operator belongs to {@link Type#CONTENT} group and only one content operator is allowed per element.
 * See the {@link Type#CONTENT the list} of mutually excluding content operators.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * 
 * @constructor Construct OBJECT operator instance.
 * @param js.dom.template.Content content dynamic content.
 */
js.dom.template.ObjectOperator = function (content) {
    this.$super(content);
};

js.dom.template.ObjectOperator.prototype = {
    /**
     * Execute object operator. This operator just returns the new object scope to be used by templates engine. If
     * requested object is null warn the event and return the null value. Templates engine consider returned null as
     * fully processed branch signal.
     * 
     * @param js.dom.Element element unused context element,
     * @param Object scope scope object,
     * @param String propertyPath object property path.
     * @return Object new scope object or null.
     * @throws js.dom.template.ContentException if requested content value is undefined.
     */
    _exec : function (element, scope, propertyPath) {
        if (scope == null) {
            return null;
        }
        $assert(propertyPath === "." || js.lang.Types.isStrictObject(scope), "js.dom.template.ObjectOperator#exec", "Operand is property path but scope is not an object.");
        var value = this._content.getValue(scope, propertyPath);
        if (value == null) {
            $warn("js.dom.template.ObjectOperator#_exec", "Null scope for property |%s| on element |%s|.", propertyPath, element);
        }
        else if ((propertyPath === "." && js.lang.Types.isFunction(value)) || (propertyPath !== "." && !js.lang.Types.isStrictObject(value))) {
            throw new js.dom.template.ContentException(propertyPath, "Invalid content type. Expected strict object but got |%s|.", js.lang.Types.getTypeName(value));
        }
        return value;
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.dom.template.ObjectOperator";
    }
};
$extends(js.dom.template.ObjectOperator, js.dom.template.Operator);
$package("js.dom.template");

/**
 * Ordered variant of {@link ListOperator}. Ordered list operator works in tandem with {@link NumberingOperator} to
 * create a ordered list, i.e. every list item has an index with specified {@link NumberingFormat format}. This class
 * takes care of index creation, increment index before every item processing while numbering operators deals only with
 * format. If numbering operator is missing this operator acts exactly as unordered list; anyway, validation tool warns
 * this condition.
 * 
 * <pre>
 *  &lt;section data-olist="chapters"&gt;
 *      &lt;h1&gt;&lt;span data-numbering="%n."&gt;&lt;/span&gt; &lt;span data-text="title"&gt;&lt;/span&gt;&lt;/h1&gt;
 *      &lt;p data-text="content"&gt;&lt;/p&gt;
 *  &lt;/section&gt;
 * </pre>
 * 
 * Note that this operator belongs to {@link Type#CONTENT} group and only one content operator is allowed per element.
 * See the {@link Type#CONTENT the list} of mutually excluding content operators.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * 
 * @constructor Construct OLIST operator instance.
 * @param js.dom.template.Template template parent template,
 * @param js.dom.template.Content content dynamic content instance.
 */
js.dom.template.OListOperator = function (template, content) {
    /**
     * Parent template.
     * 
     * @type js.dom.template.Template
     */
    this._template = template;

    this.$super(content);
};

js.dom.template.OListOperator.prototype = {
    /**
     * Item template user data key. Used to store and retrieve this list template to/from element user data.
     * 
     * @type String
     */
    _ITEM_TEMPLATE : "item-template",

    /**
     * Execute OLIST operator. Behaves like {@link js.dom.template.ListOperator#_xec(js.dom.Element, Object, String)}
     * counterpart but takes care to create index and increment it before every item processing.
     * 
     * @param js.dom.Element element context element,
     * @param Object scope scope object,
     * @param String propertyPath property path,
     * @return always returns null to signal full processing.
     * @throws js.dom.template.ContentException if requested content value is undefined.
     * @assert element has at least one child.
     */
    _exec : function (element, scope, propertyPath) {
        var itemTemplate = element.getUserData(this._ITEM_TEMPLATE);
        if (itemTemplate == null) {
            itemTemplate = element.getFirstChild();
            $assert(itemTemplate !== null, "js.dom.template.OListOperator#exec", "Invalid list element |%s|. Missing item template.", element);
            itemTemplate.remove(false);
            element.setUserData(this._ITEM_TEMPLATE, itemTemplate);
        }
        element.removeChildren();
        if (scope == null) {
            // on a null scope returns but after preparing item template and removing children
            return null;
        }

        var indexes = this._template._indexes;
        var index = new js.dom.template.Index();
        indexes.push(index);

        $assert(propertyPath === "." || js.lang.Types.isObject(scope), "js.dom.template.OListOperator#exec", "Operand is property path but scope is not an object.");
        $debug("js.dom.template.OListOperator#_exec", "Process element |%s| with property |%s|.", element, propertyPath);

        var it = this._content.getIterable(scope, propertyPath), itemElement;
        while (it.hasNext()) {
            index.increment();
            itemElement = itemTemplate.clone(true);
            element.addChild(itemElement);
            this._template._injectItem(itemElement, it.next());
        }
        indexes.pop();
        return undefined;
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.dom.template.OListOperator";
    }
};
$extends(js.dom.template.OListOperator, js.dom.template.Operator);
$package("js.dom.template");

/**
 * Ordered variant of {@link MapOperator}. Ordered map operator works in tandem with {@link NumberingOperator} to
 * create a ordered map, i.e. every map key/value pairs has an index with specified {@link NumberingFormat format}.
 * This class takes care of index creation, increment index before every key/value pair processing while numbering
 * operators deals only with format. If numbering operator is missing this operator acts exactly as unordered map;
 * anyway, validation tool warns this condition.
 * 
 * <pre>
 *  &lt;dl&gt;
 *      &lt;dt&gt;&lt;span data-numbering="%n."&gt;&lt;/span&gt; &lt;span data-text="term"&gt;&lt;/span&gt;&lt;/dt&gt;
 *      &lt;dd data-text="definition"&gt;&lt;/dd&gt;
 *  &lt;/dl&gt;
 * </pre>
 * 
 * Note that this operator belongs to CONTENT group and only one content operator is allowed per element. See the
 * {@link Type#CONTENT the list} of mutually excluding content operators.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * 
 * @constructor Construct OMAP operator instance.
 * @param js.dom.template.Template template parent template,
 * @param Object content dynamic content.
 */
js.dom.template.OMapOperator = function (template, content) {
    /**
     * Parent template.
     * 
     * @type js.dom.template.Template
     */
    this._template = template;

    this.$super(content);
};

js.dom.template.OMapOperator.prototype = {
    /**
     * Key template user data key. Used to store and retrieve this map key template to/from element user data.
     * 
     * @type String
     */
    _KEY_TEMPLATE : "key-template",

    /**
     * Value template user data key. Used to store and retrieve this map value template to/from element user data.
     * 
     * @type String
     */
    _VALUE_TEMPLATE : "value-template",

    /**
     * Execute OMAP operator. Behaves like {@link js.dom.template.MapOperator#_exec(js.dom.Element, Object, String)}
     * counterpart but takes care to create index and increment it before every key / value pair processing.
     * 
     * @param js.dom.Element element context element,
     * @param Object scope scope object,
     * @param String propertyPath property path.
     * @return always returns null to signal full processing.
     * @throws js.dom.template.ContentException if requested content value is undefined.
     * @assert element has at least two children used as key/value pairs.
     */
    _exec : function (element, scope, propertyPath) {
        var keyTemplate = element.getUserData(this._KEY_TEMPLATE), valueTemplate;
        if (keyTemplate == null) {
            keyTemplate = element.getFirstChild();
            $assert(keyTemplate !== null, "js.dom.template.OMapOperator#_exec", "Invalid map element |%s|. Missing key template.", element);
            keyTemplate.remove(false);
            element.setUserData(this._KEY_TEMPLATE, keyTemplate);

            valueTemplate = element.getFirstChild();
            $assert(valueTemplate !== null, "js.dom.template.OMapOperator#_exec", "Invalid MAP element |%s|. Missing value template.", element);
            valueTemplate.remove(false);
            element.setUserData(this._VALUE_TEMPLATE, valueTemplate);
        }
        else {
            valueTemplate = element.getUserData(this._VALUE_TEMPLATE);
        }
        element.removeChildren();
        if (scope == null) {
            // on a null scope returns but after preparing key and value templates and removing children
            return null;
        }

        var indexes = this._template._indexes;
        var index = new js.dom.template.Index();
        indexes.push(index);

        $assert(propertyPath === "." || js.lang.Types.isObject(scope), "js.dom.template.OMapOperator#exec", "Operand is property path but scope is not an object.");
        $debug("js.dom.template.OMapOperator#_exec", "Process element |%s| for property |%s|.", element, propertyPath);

        var map = this._content.getMap(scope, propertyPath), keyElement, valueElement;
        for ( var key in map) {
            index.increment();
            keyElement = keyTemplate.clone(true);
            valueElement = valueTemplate.clone(true);
            element.addChild(keyElement, valueElement);
            this._template._injectItem(keyElement, key);
            this._template._injectItem(valueElement, map[key]);
        }
        indexes.pop();
        return undefined;
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.dom.template.OMapOperator";
    }
};
$extends(js.dom.template.OMapOperator, js.dom.template.Operator);
$package("js.dom.template");

/**
 * Operators code enumeration. Operators are defined into template elements using standard attribute syntax. This
 * enumeration provides {@link #fromAttrName(String)} factory method just for that: extract opcode from attribute name.
 * Also every operator's code belongs to a {@link Type}; it can be retrieved using {@link Opcode#type()} getter.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 */
js.dom.template.Opcode = {
    /**
     * Neutral value.
     */
    NONE : 1,

    /**
     * Set one or more element's attributes values.
     */
    ATTR : 2,

    /**
     * Add or remove CSS class based on property value.
     */
    CSS_CLASS : 3,

    /**
     * Set element <em>id</em> attribute value.
     */
    ID : 4,

    /**
     * Set element <em>src</em> attribute value.
     */
    SRC : 5,

    /**
     * Set element <em>href</em> attribute value.
     */
    HREF : 6,

    /**
     * Set element <em>title</em> attribute value.
     */
    TITLE : 7,

    /**
     * Set element <em>value</em> attribute value.
     */
    VALUE : 8,

    /**
     * Set element text content.
     */
    TEXT : 9,

    /**
     * Set element inner HTML.
     */
    HTML : 10,

    /**
     * Set element descendants to content object properties.
     */
    OBJECT : 11,

    /**
     * Populate element using first child as item template.
     */
    LIST : 12,

    /**
     * Ordered variant of {@link #LIST}.
     */
    OLIST : 13,

    /**
     * Populate element using first two children as key/value templates.
     */
    MAP : 14,

    /**
     * Ordered variant of {@link #MAP}.
     */
    OMAP : 15,

    /**
     * Set element text content accordingly numbering format and item index.
     */
    NUMBERING : 16,

    /**
     * Include branch if content value is not empty.
     */
    IF : 17,

    /**
     * Exclude branch from resulting document based on boolean literal.
     */
    EXCLUDE : 18,

    /**
     * Unconditional jump to element with ID specified by this operator literal value.
     */
    GOTO : 19,

    /**
     * Prefix used to differentiate operators syntax from native.
     * 
     * @type String
     */
    _OPCODE_PREFIX : "data-",

    /**
     * Parse attribute name and return the operator's code. If attribute is not a valid operator returns {@link #NONE}.
     * 
     * @param String attrName attribute name.
     * @return js.dom.template.Opcode opcode extracted from attribute name or NONE.
     */
    fromAttrName : function (attrName) {
        if (attrName.indexOf(this._OPCODE_PREFIX) !== 0) {
            return this.NONE;
        }
        var opcode = attrName.substring(this._OPCODE_PREFIX.length).toUpperCase().replace(/-/g, '_');
        if (!(opcode in this)) {
            return this.NONE;
        }
        return this[opcode];
    },

    /**
     * Test if element has named operator.
     * 
     * @param js.dom.Element element element to test for operator presence,
     * @param String operatorName operator name to search for.
     * @return Boolean true if given element has requested operator.
     */
    hasOperator : function (element, operatorName) {
        return element.hasAttr(this._OPCODE_PREFIX + operatorName.toLowerCase());
    },

    type : function (opcode) {
        var t = this._types[opcode];
        return (typeof t === "undefined") ? js.dom.template.Opcode.Type.NONE : t;
    }
};

/**
 * An operator belongs to a given category, defined by this type. Templates engine algorithm does not use opcodes
 * directly. In order to keep it generic the algorithm uses groups of opcodes defined by this enumeration. This way,
 * adding new operators does not inflect on engine algorithm.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 */
js.dom.template.Opcode.Type = {
    NONE : 1,
    JUMP : 2,
    CONDITIONAL : 3,
    CONTENT : 4,
    ATTRIBUTE : 5,

    name : function (type) {
        if (!this._names) {
            this._names = [ "NONE", "JUMP", "CONDITIONAL", "CONTENT", "ATTRIBUTE" ];
        }
        return this._names[type - 1] || this._names[0];
    }
};

$static(function () {
    // WARNING: take care to update opcode types hash table when add new operators
    var Opcode = js.dom.template.Opcode;

    Opcode._types = {};
    Opcode._types[Opcode.NONE] = Opcode.Type.NONE;
    Opcode._types[Opcode.ATTR] = Opcode.Type.ATTRIBUTE;
    Opcode._types[Opcode.CSS_CLASS] = Opcode.Type.ATTRIBUTE;
    Opcode._types[Opcode.ID] = Opcode.Type.ATTRIBUTE;
    Opcode._types[Opcode.SRC] = Opcode.Type.ATTRIBUTE;
    Opcode._types[Opcode.HREF] = Opcode.Type.ATTRIBUTE;
    Opcode._types[Opcode.TITLE] = Opcode.Type.ATTRIBUTE;
    Opcode._types[Opcode.VALUE] = Opcode.Type.ATTRIBUTE;
    Opcode._types[Opcode.TEXT] = Opcode.Type.CONTENT;
    Opcode._types[Opcode.HTML] = Opcode.Type.CONTENT;
    Opcode._types[Opcode.OBJECT] = Opcode.Type.CONTENT;
    Opcode._types[Opcode.LIST] = Opcode.Type.CONTENT;
    Opcode._types[Opcode.OLIST] = Opcode.Type.CONTENT;
    Opcode._types[Opcode.MAP] = Opcode.Type.CONTENT;
    Opcode._types[Opcode.OMAP] = Opcode.Type.CONTENT;
    Opcode._types[Opcode.NUMBERING] = Opcode.Type.CONTENT;
    Opcode._types[Opcode.IF] = Opcode.Type.CONDITIONAL;
    Opcode._types[Opcode.EXCLUDE] = Opcode.Type.CONDITIONAL;
    Opcode._types[Opcode.GOTO] = Opcode.Type.JUMP;
});
$package('js.dom.template');

/**
 * Operator factory. There is a single operator factory on templates engine instance. It holds a pool of operator
 * instances that are reused in the context of templates engine instance.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * @constructor Construct operator factory instance.
 * 
 * @param js.dom.template.Template template parent template instance.
 * @assert parent template is not undefined, null and is of proper type.
 */
js.dom.template.OperatorFactory = function (template) {
    $assert(template instanceof js.dom.template.Template, "js.dom.template.OperatorFactory#OperatorFactory", "Content is undefined, null or not of proper type.");

    /**
     * Parent template.
     * 
     * @type js.dom.template.Template
     */
    this._template = template;
};

js.dom.template.OperatorFactory.prototype = {
    /**
     * Initialize operator factory instance. Create and cache all implemented operator instances.
     * 
     * @param js.dom.template.Content content dynamic content to inject into template.
     * @assert content is not undefined, null and is of proper type.
     */
    init : function (content) {
        $assert(content instanceof js.dom.template.Content, "js.dom.template.OperatorFactory#init", "Content is undefined, null or not of proepr type.");

        var Opcode = js.dom.template.Opcode;
        this[Opcode.GOTO] = new js.dom.template.GotoOperator(content);
        this[Opcode.EXCLUDE] = new js.dom.template.ExcludeOperator(content);
        this[Opcode.IF] = new js.dom.template.IfOperator(content);
        this[Opcode.ATTR] = new js.dom.template.AttrOperator(content);
        this[Opcode.ID] = new js.dom.template.IdOperator(content);
        this[Opcode.SRC] = new js.dom.template.SrcOperator(content);
        this[Opcode.HREF] = new js.dom.template.HrefOperator(content);
        this[Opcode.TITLE] = new js.dom.template.TitleOperator(content);
        this[Opcode.VALUE] = new js.dom.template.ValueOperator(content);
        this[Opcode.CSS_CLASS] = new js.dom.template.CssClassOperator(content);
        this[Opcode.OBJECT] = new js.dom.template.ObjectOperator(content);
        this[Opcode.TEXT] = new js.dom.template.TextOperator(content);
        this[Opcode.HTML] = new js.dom.template.HtmlOperator(content);
        this[Opcode.NUMBERING] = new js.dom.template.NumberingOperator(this._template, content);
        this[Opcode.LIST] = new js.dom.template.ListOperator(this._template, content);
        this[Opcode.OLIST] = new js.dom.template.OListOperator(this._template, content);
        this[Opcode.MAP] = new js.dom.template.MapOperator(this._template, content);
        this[Opcode.OMAP] = new js.dom.template.OMapOperator(this._template, content);
    },

    /**
     * Get operator instance.
     * 
     * @param js.dom.template.Opcode opcode requested opcode.
     * @return Function operator instance.
     */
    getInstance : function (opcode) {
        var operator = this[opcode];
        $assert(typeof operator !== "undefined", "js.dom.template.OperatorFactory#getInstance", "Operator |%s| is not implemented.", opcode);
        return operator;
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.dom.template.OperatorFactory";
    }
};
$extends(js.dom.template.OperatorFactory, Object);
$package('js.dom.template');

/**
 * Templates element operators list. Scan templates element attributes, looking for operators syntax and store meta-data
 * about operators found. There are semantic restrictions on element operators list, see below; this class takes care to
 * enforce them and throws templates exception if semantic restriction is broken. Operators are grouped into types, see
 * {@link js.dom.template.Opcode.Type} and this class stores meta-data using the same structure.
 * 
 * <h4>Operators list constrains</h4>
 * <ul>
 * <li>at most one conditional operator, see {@link js.dom.template.Opcode.Type#CONDITIONAL} for a list of mutually
 * excluding conditional operators,
 * <li>at most one content operator, see {@link js.dom.template.Opcode.Type#CONTENT} for a list of mutually excluding
 * content operators,
 * <li>at most one formatter instance declared; this constrain is actually enforced by XML syntax that does not allow
 * for multiple attributes with the same name,
 * <li>format instance mandates {@link js.dom.template.TextOperator} or {@link js.dom.template.ValueOperator} presence.
 * </ul>
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * 
 * @constructor Construct operators list instance.
 */
js.dom.template.OperatorsList = function () {
};

js.dom.template.OperatorsList.prototype = {
    /**
     * Initialize element operators list. Scan element attributes looking for operators syntax and initialize internal
     * meta-data.
     * 
     * @param js.dom.Element element element to scan for operators.
     */
    initElement : function (element) {
        /**
         * Jump operator meta-data.
         */
        this._jumpOperator = null;

        /**
         * Conditional operator meta-data.
         */
        this._conditionalOperator = null;

        /**
         * Formatting instance meta-data.
         */
        this._formattingOperator = null;

        /**
         * Content operator meta-data.
         */
        this._contentOperator = null;

        /**
         * Attribute operators meta-data list.
         */
        this._attributeOperators = [];

        var Opcode = js.dom.template.Opcode;
        var attrs = element.getNode().attributes, i = 0, meta;
        for ( var attr, attrName, attrValue, opcode, type; i < attrs.length; i++) {
            attr = attrs[i];
            attrName = attr.nodeName;
            attrValue = attr.value;

            opcode = Opcode.fromAttrName(attrName);
            if (opcode === Opcode.NONE) {
                continue;
            }
            $assert(attrValue.length !== 0, "js.dom.template.OperatorsList#initElement", "Empty operand on element |%s| for opcode |%s|.", element, opcode);

            meta = {
                opcode : opcode,
                operand : attrValue
            };

            type = Opcode.type(opcode);
            switch (type) {
            case Opcode.Type.JUMP:
                this._insanityCheck(element, this._jumpOperator, type);
                this._jumpOperator = meta;
                break;

            case Opcode.Type.CONDITIONAL:
                this._insanityCheck(element, this._conditionalOperator, type);
                this._conditionalOperator = meta;
                break;

            case Opcode.Type.FORMATTING:
                this._insanityCheck(element, this._formattingOperator, type);
                this._formattingOperator = meta;
                break;

            case Opcode.Type.CONTENT:
                this._insanityCheck(element, this._contentOperator, type);
                this._contentOperator = meta;
                break;

            case Opcode.Type.ATTRIBUTE:
                this._attributeOperators.push(meta);
                break;

            default:
                $assert(false, "js.dom.template.OperatorsList#initElement", "Invalid operators list on element |%s|. Unknown opcode type |%s|.", element, Opcode.Type.name(type));
            }
        }
    },

    /**
     * Initialize list item operators list. Delegates {@link #initElement(js.dom.Element)}. If item element has no
     * content operator chose one as follow: if element has children set content operator to
     * {@link js.dom.template.Opcode#OBJECT}, otherwise to {@link js.dom.template.Opcode#TEXT}.
     * 
     * @param js.dom.Element element element to scan for operators.
     */
    initItem : function (element) {
        this.initElement(element);
        if (this._contentOperator == null) {
            var opcode = element.hasChildren() ? js.dom.template.Opcode.OBJECT : js.dom.template.Opcode.TEXT;
            this._contentOperator = {
                opcode : opcode,
                operand : "."
            };
        }
    },

    /**
     * Initialize operators list for subtree root element. Delegates {@link #initElement(js.dom.Element)}. Subtree
     * child elements property path are relative to subtree root element. For this reason root property path must be
     * self, i.e. the dot. This initializer ensure this constrain.
     * 
     * @param js.dom.Element element subtree root element.
     * @assert element has content operator; also, if content operator is present it can't be
     *         {@link js.dom.template.Opcode#TEXT}, {@link js.dom.template.Opcode#HTML} or
     *         {@link js.dom.template.Opcode#NUMBERING}.
     */
    initSubtree : function (element) {
        this.initElement(element);
        if (this._contentOperator !== null) {
            $assert(this._contentOperator.opcode !== js.dom.template.Opcode.TEXT, "js.dom.template.OperatorsList#initSubtree", "Subtree initializer forbids TEXT operator.");
            $assert(this._contentOperator.opcode !== js.dom.template.Opcode.HTML, "js.dom.template.OperatorsList#initSubtree", "Subtree initializer forbids HTML operator.");
            $assert(this._contentOperator.opcode !== js.dom.template.Opcode.NUMBERING, "js.dom.template.OperatorsList#initSubtree", "Subtree initializer forbids NUMBERING operator.");
            this._contentOperator.operand = ".";
            return;
        }
        $assert(false, "js.dom.template.OperatorsList#initSubtree", "Subtree initializer mandates content operator.");
    },

    /**
     * Return true if this operators list contains a jump operator.
     * 
     * @return true if jump operator is present.
     */
    hasJumpOperator : function () {
        return this._jumpOperator !== null;
    },

    /**
     * Return true if this operators list contains a conditional operator.
     * 
     * @return true if conditional operator is present.
     */
    hasConditionalOperator : function () {
        return this._conditionalOperator !== null;
    },

    /**
     * Return true if this operators list contains a content operator.
     * 
     * @return true if content operator is present.
     */
    hasContentOperator : function () {
        return this._contentOperator !== null;
    },

    /**
     * Get jump operator meta-data.
     * 
     * @return jump operator meta-data.
     * @assert jump operator is not null.
     */
    getJumpOperatorMeta : function () {
        $assert(this._jumpOperator !== null, "js.dom.template.OperatorsList#getJumpOperatorMeta", "Jump operator is null.");
        return this._jumpOperator;
    },

    /**
     * Get conditional operator meta-data.
     * 
     * @return conditional operator meta-data.
     * @assert conditional operator is not null.
     */
    getConditionalOperatorMeta : function () {
        $assert(this._conditionalOperator !== null, "js.dom.template.OperatorsList#getConditionalOperatorMeta", "Conditional operator is null.");
        return this._conditionalOperator;
    },

    /**
     * Get content operator meta-data.
     * 
     * @return content operator meta-data.
     * @assert content operator is not null.
     */
    getContentOperatorMeta : function () {
        $assert(this._contentOperator !== null, "js.dom.template.OperatorsList#getContentOperatorMeta", "Content operator is null.");
        return this._contentOperator;
    },

    /**
     * Get attribute operators meta-data list, possible empty.
     * 
     * @return attribute operators meta-data.
     */
    getAttributeOperatorsMeta : function () {
        return this._attributeOperators;
    },

    /**
     * Throws assertion if operator of given type is already declared.
     * 
     * @param Element element context element,
     * @param Object meta operator meta-data,
     * @param Opcode.Type type operator type.
     * @assert meta is null.
     */
    _insanityCheck : function (element, meta, type) {
        $assert(meta == null, "js.dom.template.OperatorsList#_insanityCheck", "Invalid operators list on element |%s|. Only one %s operator is allowed.", element, js.dom.template.Opcode.Type.name(type));
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.dom.template.OperatorsList";
    }
};
$extends(js.dom.template.OperatorsList, Object);
$package("js.dom.template");

/**
 * Set <em>src</em> attribute value.
 * 
 * <pre>
 *  &lt;img data-src="picture" /&gt;
 * </pre>
 * 
 * Operand is the property path used to get content value.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * 
 * @constructor Construct SRC operator instance.
 * @param js.dom.template.Content content dynamic content.
 */
js.dom.template.SrcOperator = function (content) {
    this.$super(content);
};

js.dom.template.SrcOperator.prototype = {
    /**
     * Execute SRC operator. Uses property path to extract content value, convert it to string and set <em>src</em>
     * attribute. If context element has <em>setSrc</em> method uses it, otherwise uses generic attribute setter.
     * 
     * @param js.dom.Element element context element,
     * @param Object scope scope object,
     * @param String propertyPath property path.
     * @throws js.dom.template.ContentException if requested content value is undefined.
     * @assert <code>element</code> has no <code>src</code> attribute, <code>element</code> is of type supporting
     *         <code>src</code> attribute and <code>scope</code> is an {@link Object}.
     */
    _exec : function (element, scope, propertyPath) {
        $assert(!element.hasAttr("src"), "js.dom.template.IdOperator#exec", "Invalid element |%s|. It has both static 'src' attribute and SRC operator.", element);
        $assert((function () {
            var elementsWithSrc = [ "iframe", "script", "img", "input", "textarea", "video", "audio" ];
            return elementsWithSrc.indexOf(element.getTag()) !== -1;
        })(), "js.dom.template.SrcOperator#exec", "SRC operator is not supported on element |%s|.", element);
        $assert(propertyPath === "." || js.lang.Types.isObject(scope), "js.dom.template.SrcOperator#exec", "Operand is property path but scope is not an object.");

        var value = this._content.getValue(scope, propertyPath);
        if (value == null) {
            $warn("js.dom.template.SrcOperator#_exec", "Null property |%s|. Remove src attribute from element |%s|.", propertyPath, element);
            element.removeAttr("src");
        }
        else {
            $assert(js.lang.Types.isString(value), "js.dom.template.SrcOperator#_exec", "Content value is not a string.");
            $debug("js.dom.template.SrcOperator#_exec", "Set element |%s| src attribute from property |%s|.", element, propertyPath);
            if (js.lang.Types.isFunction(element.setSrc)) {
                element.setSrc(value);
            }
            else {
                element.setAttr("src", value);
            }
        }
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.dom.template.SrcOperator";
    }
};
$extends(js.dom.template.SrcOperator, js.dom.template.Operator);
$package('js.dom.template');

/**
 * Templates engine. This is the interface of templates engine package. Using it is straightforward: get instance using
 * the {@link #getInstance factory method} and call {@link #inject(Object)}. Note that, since a templates engine
 * instance operates upon a {@link js.dom.Document j(s)-dom document}, factory method requires a document instance as
 * argument.
 * 
 * <pre>
 * var doc = Builder.parseHTML(...);
 * var template = js.dom.template.Template.getInstance(doc);
 * template.inject(value);
 * </pre>
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * 
 * @constructor Construct templates engine instance.
 * 
 * @param js.dom.Document doc template document.
 * @assert given document is not undefined or null and is of proper type.
 */
js.dom.template.Template = function (doc) {
    $assert(doc, "js.dom.template.Template#Template", "Document is undefined or null.");
    $assert(doc instanceof js.dom.Document, "js.dom.template.Template#Template", "Document is not of proper type.");

    /**
     * Template document.
     * 
     * @type js.dom.Document
     */
    this._doc = doc;

    /**
     * Operator factory.
     * 
     * @type js.dom.template.OperatorFactory
     */
    this._operatorFactory = new js.dom.template.OperatorFactory(this);

    /**
     * Operators list.
     * 
     * @type js.dom.template.OperatorsList
     */
    this._operators = new js.dom.template.OperatorsList();

    /**
     * Indexes stack for ordered lists. Every ordered list has its own index instance and in order to cope with nested
     * lists we used this stack. For the same reason, although indexes are used only by {@link ListOperator}, indexes
     * stack is global per template engine instance.
     * 
     * @type Array
     */
    this._indexes = [];
};

/**
 * Templates engine factory.
 * 
 * @param js.dom.Document doc template document.
 * @return js.dom.template.Template templates engine instance.
 */
js.dom.template.Template.getInstance = function (doc) {
    return new js.dom.template.Template(doc);
};

js.dom.template.Template.prototype = {
    /**
     * Inject value into template document.
     * 
     * @param Object value to inject.
     */
    inject : function (value) {
        $assert(value, "js.dom.template.Template#inject", "Value is undefined or null.");
        var content = this._init(value);
        this._injectElement(this._doc.getRoot(), content.getModel());
    },

    /**
     * Inject value into specified element subtree.
     * 
     * @param js.dom.Element element injection point,
     * @param Object value value to inject.
     */
    subinject : function (element, value) {
        $assert(element, "js.dom.template.Template#subinject", "Element is undefined or null.");
        $assert(element instanceof js.dom.Element, "js.dom.template.Template#subinject", "Element is not of proper type.");
        $assert(value, "js.dom.template.Template#subinject", "Value is undefined or null.");
        var content = this._init(value);
        this._operators.initSubtree(element);
        this._inject(element, content.getModel());
    },

    /**
     * Initialize template engine instance.
     * 
     * @param Object value value to inject.
     * @return js.dom.template.Content content instance.
     */
    _init : function (value) {
        var content = value instanceof js.dom.template.Content ? value : new js.dom.template.Content(value);
        this._operatorFactory.init(content);
        return content;
    },

    _injectElement : function (element, scope) {
        this._operators.initElement(element);
        this._inject(element, scope);
    },

    _injectItem : function (element, scope) {
        this._operators.initItem(element);
        this._inject(element, scope);
    },

    _inject : function (element, scope) {
        $assert(element, "js.dom.template.Template#_inject", "Element is undefined or null.");
        $assert(element instanceof js.dom.Element, "js.dom.template.Template#_inject", "Element is not of proper type.");

        if (this._operators.hasJumpOperator()) {
            var id = this._execOperator(element, scope, this._operators.getJumpOperatorMeta());
            // replace current element and its operators list with goto target element
            // but only if target element exists
            var gotoElement = this._doc.getById(id);
            if (gotoElement) {
                element = gotoElement;
                this._operators.initElement(element);
            }
        }

        if (scope !== null && this._operators.hasConditionalOperator()) {
            var branchEnabled = this._execOperator(element, scope, this._operators.getConditionalOperatorMeta());
            if (!branchEnabled) {
                $debug("js.dom.template.Template#_inject", "Element |%s| rejected by conditional operator.", element);
                element.addCssClass("hidden");
                return;
            }
            element.removeCssClass("hidden");
        }

        if (scope !== null) {
            this._operators.getAttributeOperatorsMeta().forEach(function (meta) {
                this._execOperator(element, scope, meta);
            }, this);
        }

        if (this._operators.hasContentOperator()) {
            scope = this._execOperator(element, scope, this._operators.getContentOperatorMeta());
            if (typeof scope === "undefined") {
                return;
            }
            if (scope == null && this._operators.getContentOperatorMeta().opcode !== js.dom.template.Opcode.OBJECT) {
                // content operator returns null if fully processed, that is, document tree branch is ended
                return;
            }
        }

        var it = element.getChildren().it(), el;
        while (it.hasNext()) {
            this._injectElement(it.next(), scope);
        }
    },

    /**
     * Execute operator.
     * 
     * @param js.dom.Element element
     * @param Object scope
     * @param Object meta
     * @return Object
     */
    _execOperator : function (element, scope, meta) {
        var operator = this._operatorFactory.getInstance(meta.opcode);
        return operator.exec(element, scope, meta.operand);
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.dom.template.Template";
    }
};
$extends(js.dom.template.Template, Object);
$package("js.dom.template");

/**
 * Set element text content. Extract content value declared by this operator operand and set context element text
 * content. Content value type is not constrained to string, this operator taking care to convert it. Note that this
 * operator uses context element format instance, if one was declared.
 * 
 * <pre>
 *  &lt;span data-text="birthday" data-format="js.format.LongDate"&gt;&lt;/span&gt;
 * </pre>
 * 
 * Operand is the property path used to get content value.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * 
 * @constructor Construct TEXT operator instance.
 * @param js.dom.template.Content content dynamic content.
 */
js.dom.template.TextOperator = function (content) {
    this.$super(content);
};

js.dom.template.TextOperator.prototype = {
    /**
     * Execute TEXT operator. Uses property path to extract content value, convert it to string and set element text
     * content. Note that this operator operates on element without children.
     * 
     * @param js.dom.Element element context element,
     * @param Object scope scope object,
     * @param String propertyPath property path.
     * @return always returns null to signal full processing.
     * @throws js.dom.template.ContentException if requested content value is undefined.
     */
    _exec : function (element, scope, propertyPath) {
        if (scope == null) {
            $warn("js.dom.template.TextOperator#_exec", "Null scope on property |%s|. Remove element |%s| text content.", propertyPath, element);
            element.removeText();
            return null;
        }

        $assert(propertyPath === "." || js.lang.Types.isObject(scope), "js.dom.template.TextOperator#exec", "Operand is property path but scope is not an object.");
        $assert(!element.hasChildren(), "js.dom.template.TextOperator#_exec", "Element |%s| has children.", element);

        var value = this._content.getValue(scope, propertyPath);
        if (value == null || value === '') {
            $warn("js.dom.template.TextOperator#_exec", "Null or empty property |%s|. Remove element |%s| text content.", propertyPath, element);
            element.removeText();
        }
        else {
            $debug("js.dom.template.TextOperator#_exec", "Set text content to element |%s| from property |%s|.", element, propertyPath);
            element.setValue(value);
        }
        return undefined;
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.dom.template.TextOperator";
    }
};
$extends(js.dom.template.TextOperator, js.dom.template.Operator);
$package("js.dom.template");

/**
 * Set <em>title</em> attribute value.
 * 
 * <pre>
 *  &lt;section data-title="description" /&gt;
 * </pre>
 * 
 * Operand is the property path used to get content value.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * 
 * @constructor Construct TITLE operator instance.
 * @param js.dom.template.Content content dynamic content.
 */
js.dom.template.TitleOperator = function (content) {
    this.$super(content);
};

js.dom.template.TitleOperator.prototype = {
    /**
     * Execute TITLE operator. Uses property path to extract content value, convert it to string and set <em>title</em>
     * attribute.
     * 
     * @param js.dom.Element element context element,
     * @param Object scope scope object,
     * @param String propertyPath property path,
     * @throws js.dom.template.ContentException if requested content value is undefined.
     * @assert <code>element</code> has no <code>title</code> attribute, <code>scope</code> is an {@link Object}
     *         and content value is a string.
     */
    _exec : function (element, scope, propertyPath) {
        $assert(!element.hasAttr("title"), "js.dom.template.IdOperator#exec", "Invalid element |%s|. It has both static 'title' attribute and TITLE operator.", element);
        $assert(propertyPath === "." || js.lang.Types.isObject(scope), "js.dom.template.TitleOperator#exec", "Operand is property path but scope is not an object.");

        var value = this._content.getValue(scope, propertyPath);
        if (value == null) {
            $warn("js.dom.template.TitleOperator#_exec", "Null property |%s|. Remove title attribute from element |%s|.", propertyPath, element);
            element.removeAttr("title");
        }
        else {
            $assert(js.lang.Types.isString(value), "js.dom.template.TitleOperator#_exec", "Content value is not a string.");
            $debug("js.dom.template.TitleOperator#_exec", "Set element |%s| title attribute from property |%s|.", element, propertyPath);
            element.setAttr("title", value);
        }
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.dom.template.TitleOperator";
    }
};
$extends(js.dom.template.TitleOperator, js.dom.template.Operator);
$package("js.dom.template");

/**
 * Form control and generic value setter. Value operator is used to set value attribute, if context element is a form
 * control or as generic value setter if context element is a generic <em>div</em>. In both cases operand is the
 * property path used to get content value.
 * 
 * <h4>Form control value setter</h4>
 * Extract content value declared by this operator operand and set the element <em>value</em>. Note that this
 * operator uses element format, if one is declared. If this is the case, content value can be of any type, as long
 * declared formatter can deal with it; otherwise value should be a string.
 * 
 * <pre>
 *  &lt;input data-value="name" data-format="js.format.LongDate" /&gt;
 * </pre>
 * 
 * <h4>Generic value setter</h4>
 * Allows for generic extension, content value is simply passed to context element, which must implement a value setter
 * with next signature:
 * 
 * <pre>
 * 	Element setValue(Object value)
 * </pre>
 * 
 * Note that context element should be a generic <em>div</em> as in example below. Value processing is entirely under
 * element control and value can have any type, even null or undefined. A good example may be a chart using a collection
 * of scores: templates engine load scores from content but chart is created by element value setter.
 * 
 * <pre>
 * 	&lt;div class="chart" data-value="scores" data-class="appraisal.employee.ScoresChart"&gt;&lt;/div&gt;
 * </pre>
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * 
 * @constructor Construct VALUE operator instance.
 * @param js.dom.template.Content content dynamic content.
 */
js.dom.template.ValueOperator = function (content) {
    this.$super(content);
};

js.dom.template.ValueOperator.prototype = {
    /**
     * Generic elements.
     * 
     * @type Array
     */
    GENERIC_ELEMENTS : [ "div" ],

    /**
     * Execute VALUE operator. Uses property path to extract content value, convert it to string and set element
     * <em>value</em> attribute.
     * 
     * @param js.dom.Element element context element,
     * @param Object scope scope object,
     * @param String propertyPath property path.
     * @throws js.dom.template.ContentException if requested content value is undefined.
     * @assert element is a form control or a generic <em>div</em>.
     */
    _exec : function (element, scope, propertyPath) {
        $assert(!element.hasAttr("value"), "js.dom.template.IdOperator#exec", "Invalid element |%s|. It has both static 'value' attribute and VALUE operator.", element);
        $assert(propertyPath === "." || js.lang.Types.isObject(scope), "js.dom.template.ValueOperator#_exec", "Operand is property path but scope is not an object.");

        var value = this._content.getValue(scope, propertyPath);

        // if context element is a generic element just pass value to its value setter
        if (js.util.Arrays.contains(this.GENERIC_ELEMENTS, element.getTag())) {
            $assert(js.lang.Types.isFunction(element.setValue), "js.dom.template.ValueOperator#_exec", "Invalid generic element: missing value setter.");
            element.setValue(value);
            return;
        }

        $assert(element instanceof js.dom.Control, "js.dom.template.ValueOperator#_exec", "Element |%s| is not a control.", element);
        if (value == null) {
            $warn("js.dom.template.ValueOperator#_exec", "Null property |%s|. Reset value for element |%s|.", propertyPath, element);
            element.reset();
        }
        else {
            $assert(element._format !== null || js.lang.Types.isPrimitive(value), "js.dom.template.ValueOperator#_exec", "Formatter is null and content value is not a primitive.");
            $debug("js.dom.template.ValueOperator#_exec", "Set element |%s| value from property |%s|.", element, propertyPath);
            element.setValue(value);
        }
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.dom.template.ValueOperator";
    }
};
$extends(js.dom.template.ValueOperator, js.dom.template.Operator);
$package("js.event");

/**
 * DOM events manager. Provides methods for events listeners registering and removing to/from native DOM events. Takes
 * care to remove all forgotten listeners at this instance finalization.
 * 
 * @author Iulian Rotaru
 * @constructor Construct DOM events manager instance.
 * 
 * @param Object targetNode {@link js.dom.Element} or {@link js.dom.Document} to register events to.
 * @assert <em>targetNode</em> argument is not undefined nor null and is of proper type.
 */
js.event.DomEvents = function (targetNode) {
    $assert(targetNode, "js.event.DomEvents#DomEvents", "Target node is undefined or null.");
    $assert(targetNode instanceof js.dom.Element || targetNode instanceof js.dom.Document, "js.event.DomEvents#DomEvents", "Given argument is not of proper type.");

    /**
     * Associated target node.
     * 
     * @type js.event.TargetNode
     */
    this._targetNode = new js.event.TargetNode(targetNode);

    /**
     * Registered event handlers.
     * 
     * @type Array
     */
    this._handlers = [];
};

js.event.DomEvents.prototype = {
    /**
     * Check if event is a valid DOM event type.
     * 
     * @param String type event type to test.
     * @return Boolean true if event type is a valid DOM event.
     */
    hasType : function (type) {
        $assert(type, "js.event.DomEvents#hasType", "Event type is undefined, null or empty.");
        return type in js.event.Types;
    },

    /**
     * Get registered event handlers.
     * 
     * @return [] registered event handlers.
     */
    getHandlers : function () {
        return this._handlers;
    },

    /**
     * Add event listener. Register event listener to this event target. Listener function should have next signature:
     * 
     * <pre>
     * 	void listener(js.event.Event ev)
     * </pre>
     * 
     * It will be invoked whenever requested event type will be triggered on this event target with event contextual
     * information as only argument. If event type, listener and capture flag are defining an already registered event
     * this method rise assertion or silently does nothing if assertions are disabled.
     * 
     * @param String type event type,
     * @param Function listener event listener to register,
     * @param Object scope listener run-time scope,
     * @param Boolean capture capture flag.
     * @assert event <code>type</code> is valid - see {@link js.event.Types}, <code>listener</code> is a
     *         {@link Function}, <code>scope</code> is an {@link Object} and <code>capture</code> is a boolean
     *         value. Also current parameters are not defining an already registered event.
     */
    addListener : function (type, listener, scope, capture) {
        $assert(type in js.event.Types, "js.event.DomEvents#addListener", "Unrecognized event type #%s.", type);
        $assert(js.lang.Types.isFunction(listener), "js.event.DomEvents#addListener", "Event listener is not a function.");
        $assert(js.lang.Types.isObject(scope), "js.event.DomEvents#addListener", "Scope is not an object.");
        $assert(js.lang.Types.isBoolean(capture), "js.event.DomEvents#addListener", "Capture flag is not a boolean value.");
        if (!(type in js.event.Types)) {
            return;
        }

        var handler = new js.event.Handler(this._targetNode, type, listener, scope, capture);
        // standard browsers silently discard multiple registration for listeners with the same parameters but IE allows
        if (js.util.Arrays.contains(this._handlers, handler)) {
            $assert("js.event.DomEvents#addListener", "Event |%s:%s| already registered.", type, capture ? "capture" : "bubbling");
            return;
        }
        this._addListener(handler);
        this._handlers.push(handler);
    },

    /**
     * Remove event listener. Remove registered event listener from this event target. Calling this method with
     * arguments that does not identify any currently registered event listener has no effect.
     * 
     * @param String type event type,
     * @param Function listener event listener to remove,
     * @param Boolean capture capture flag.
     * @assert event <code>type</code> is valid - see {@link js.event.Types}, <code>listener</code> is a function
     *         and <code>capture</code> is a boolean value.
     */
    removeListener : function (type, listener, capture) {
        $assert(type in js.event.Types, "js.event.DomEvents#removeListener", "Unrecognized event type #%s.", type);
        $assert(js.lang.Types.isFunction(listener), "js.event.DomEvents#removeListener", "Event listener is not a function.");
        $assert(js.lang.Types.isBoolean(capture), "js.event.DomEvents#removeListener", "Capture flag is not a boolean value.");
        if (!(type in js.event.Types)) {
            return;
        }
        var _this = this;
        js.util.Arrays.removeAll(this._handlers, function (handler) {
            if (handler.type === type && handler.listener === listener && handler.capture === capture) {
                _this._removeListener(handler);
                return true;
            }
            return false;
        });
    },

    /**
     * Helper for add event listener.
     * 
     * @param js.event.Handler handler event handler.
     */
    _addListener : function (handler) {
        handler.node.addEventListener(handler.type, handler.domEventListener, handler.capture);
    },

    /**
     * Helper for remove event listener.
     * 
     * @param js.event.Handler handler event handler.
     */
    _removeListener : function (handler) {
        handler.node.removeEventListener(handler.type, handler.domEventListener, handler.capture);
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.event.DomEvents";
    },

    /**
     * Final instance clean-up. Remove all still registered listeners from underlying document; also remove internal
     * used handlers.
     */
    finalize : function () {
        js.util.Arrays.clear(this._handlers, this._removeListener, this);
        delete this._targetNode;
        delete this._handlers;
    }
};
$extends(js.event.DomEvents, Object);

/**
 * Old IE add and remove event listeners are named attach, respective detach.
 */
$legacy(typeof document.addEventListener === "undefined", function () {
    js.event.DomEvents.prototype._addListener = function (handler) {
        // attach event allows for multiple registration of the same event but is handled before reaching this point
        handler.node.attachEvent("on" + handler.type, handler.domEventListener);
    };

    js.event.DomEvents.prototype._removeListener = function (handler) {
        handler.node.detachEvent("on" + handler.type, handler.domEventListener);
    };
});

/**
 * Firefox mouse wheel event is named DOMMouseScroll.
 */
$legacy(js.ua.Engine.GECKO, function () {
    js.event.DomEvents.prototype._addListener = function (handler) {
        var type = handler.type;
        if (type === "mousewheel") {
            type = "DOMMouseScroll";
        }
        handler.node.addEventListener(type, handler.domEventListener, handler.capture);
        return true;
    };
});
$package('js.event');

/**
 * Document event contextual information. Object passed to event listener when a particular event fires. It wraps
 * contextual information about an event in process.
 * 
 * @author Iulian Rotaru
 * @constructor Construct event instance.
 * 
 * @param js.dom.Document doc, document on which this event is processed,
 * @param String type, event type. One of events listed on {@link js.event.Types}.
 * @assert given arguments are not undefined, null or empty, <em>doc</em> is an instance of js.dom.Document and
 *         <em>type</em> is a string.
 */
js.event.Event = function (doc, type) {
    $assert(doc, 'js.dom.Event#Event', 'Document is undefined or null.');
    $assert(doc instanceof js.dom.Document, 'js.dom.Event#Event', 'Document is not an instance of js.dom.Document');
    $assert(js.lang.Types.isString(type), 'js.dom.Event#Event', 'Invalid event type.');

    /**
     * Owning document.
     * 
     * @type js.dom.Document
     */
    this._doc = doc;

    /**
     * Event type.
     * 
     * @type String
     */
    this.type = type;
};

js.event.Event.prototype = {
    /**
     * Initialize this event object state.
     * 
     * @param Event domEvent DOM native event.
     * @return js.event.Event this object.
     */
    init : function (domEvent) {
        /**
         * Event timestamp.
         * 
         * @type Number
         */
        this.timeStamp = domEvent.timeStamp;

        this._init(domEvent || window.event);

        /**
         * <b>Shift</b> key pressed. True only if a Shift key was pressed while event occurs.
         * 
         * @type Boolean
         */
        this.shiftKey = domEvent.shiftKey;

        /**
         * <b>Alt</b> key pressed. True only if a Alt key was pressed while event occurs.
         * 
         * @type Boolean
         */
        this.altKey = domEvent.altKey;

        /**
         * <b>Ctrl</b> key pressed. True only if a Ctrl key was pressed while event occurs.
         * 
         * @type Boolean
         */
        this.ctrlKey = domEvent.ctrlKey;

        if (this.type === 'mousewheel') {
            /**
             * Wheel movement. Valid only for mousewheel event, otherwise not specified. A number with sign codifying
             * both movement speed and direction: positive values means forward.
             * 
             * @type Number
             */
            this.wheel = 0;
            if (domEvent.wheelDelta) {
                this.wheel = domEvent.wheelDelta / 120;
                if (js.ua.Engine.PRESTO) {
                    this.wheel = -this.wheel;
                }
            }
            else if (domEvent.detail) {
                this.wheel = -domEvent.detail / 3;
            }
        }

        /**
         * This event default behavior was prevented.
         * 
         * @type Boolean
         */
        this.prevented = false;

        /**
         * This event was stopped.
         * 
         * @type Boolean
         */
        this.stopped = false;
        return this;
    },

    /**
     * Internal initialization helper.
     * 
     * @param Event domEvent native DOM event.
     */
    _init : function (domEvent) {
        $assert(typeof domEvent.srcElement !== "undefined" || typeof domEvent.originalTarget !== "undefined", "js.event.Event#_init", "Missing support for event original target.");

        /**
         * Native event.
         * 
         * @type Event
         */
        this._domEvent = domEvent;

        /**
         * Target element. The element toward which the event is targeted.
         * 
         * @type js.dom.Element
         */
        this.target = domEvent.target.nodeType === Node.ELEMENT_NODE ? this._doc.getElement(domEvent.target) : null;

        /**
         * Page horizontal coordinates. Event position relative to page, measured in pixels. Remember that in
         * j(s)-library aceeption page is entire area occupied by document, not only the visible viewport.
         * 
         * @type Number
         */
        this.pageX = domEvent.pageX;

        /**
         * Page vertical coordinates. Event position relative to page, measured in pixels. Remember that in j(s)-library
         * the page is entire area occupied by document, not only the visible viewport.
         * 
         * @type Number
         */
        this.pageY = domEvent.pageY;

        /**
         * Key number. Valid only for keyboard events, otherwise not specified.
         * 
         * @type Number
         * @see js.event.Key Keyboard codes.
         */
        this.key = Number(domEvent.keyCode) || Number(domEvent.which);
    },

    /**
     * Prevent default event processing.
     */
    prevent : function () {
        if (this._domEvent.cancelable) {
            this.prevented = true;
        }
    },

    /**
     * Stop event propagation.
     */
    stop : function () {
        this.stopped = true;
    },

    /**
     * Halt event, that is, stop event propagation and prevent default event processing.
     */
    halt : function () {
        this.stop();
        this.prevent();
    },

    /**
     * Return true if this event is a mouse event and right button was pressed. This predicate returns meaningful data
     * only if invoked for mouse events.
     * 
     * @return Boolean if this is a right mouse event.
     */
    isRightClick : function () {
        return this._domEvent.button === 2;
    },

    /**
     * Return true if this event is a mouse event and left button was pressed. This predicate returns meaningful data
     * only if invoked for mouse events.
     * 
     * @return Boolean if this is a left mouse event.
     */
    isLeftClick : function () {
        return this._domEvent.button === 0;
    },

    /**
     * Return true if this event is a mouse event and wheel was pressed. This predicate returns meaningful data only if
     * invoked for mouse events.
     * 
     * @return Boolean if this is a wheel mouse event.
     */
    isMiddleClick : function () {
        return this._domEvent.button === 1;
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return 'js.event.Event';
    }
};
$extends(js.event.Event, Object);

/**
 * IE event target, page coordinates and key code are different. Also cancelable property is missing.
 */
$legacy(js.ua.Engine.TRIDENT, function () {
    js.event.Event.prototype._init = function (domEvent) {
        this.target = this._doc.getElement(domEvent.srcElement);
        this.pageX = domEvent.clientX + this._doc._document.body.scrollLeft + this._doc._document.documentElement.scrollLeft;
        this.pageY = domEvent.clientY + this._doc._document.body.scrollTop + this._doc._document.documentElement.scrollTop;
        this.key = domEvent.keyCode;
    };

    js.event.Event.prototype.prevent = function () {
        this.prevented = true;
    };
});
$package("js.event");

/**
 * Event handler. This private class encapsulates parameters for event management being used by attach and detach
 * methods from {@link js.event.DomEvents} class. It creates a wrapper for event listener that allows for scope
 * handling.
 * 
 * @author Iulian Rotaru
 * 
 * @constructor Construct event handler instance. If optional capture flag is supplied
 * 
 * @param js.event.TargetNode targetNode target node,
 * @param String type event type,
 * @param Function listener event listener,
 * @param Object scope listener run-time scope,
 * @param Boolean capture capture flag.
 */
js.event.Handler = function (targetNode, type, listener, scope, capture) {
    /**
     * DOM native node wrapped by this event handler.
     * 
     * @type Node
     */
    this.node = targetNode.node;

    /**
     * Event type.
     * 
     * @type String
     */
    this.type = type;

    /**
     * Event listener.
     * 
     * @type Function
     */
    this.listener = listener;

    /**
     * Event listener run-time scope.
     * 
     * @type Object
     */
    this._scope = scope;

    /**
     * Event capture propagation. If true event propagation occurs from surface to bottom, i.e. parent element first.
     * More specifically, consider the case o a form with and input, see below sample code. If capture is false, that
     * is, event propagation is <code>bubbling</code>, event will be dispatched to input first then to form element.
     * Otherwise, if capture is true form is first then its child input. This is handy for event delegation: register
     * the event to parent that uses capture to get fired event before children.
     * 
     * <pre>
     *  &lt;form&gt;
     *      &lt;input type="text" /&gt;
     *  &lt;/form&gt;
     * </pre>
     * 
     * @type Booolean
     */
    this.capture = capture;

    /**
     * Event context information.
     * 
     * @type js.event.Event
     */
    this._event = new js.event.Event(targetNode.ownerDoc, type);

    /**
     * Low level DOM event listener.
     * 
     * @type Function
     */
    this.domEventListener = this._handle.bind(this);
};

/**
 * Default idle timeout value, minutes.
 * 
 * @type Number
 */
js.event.Handler.DEF_IDLE_TIMEOUT = 10;

/**
 * Idle timeout. User idle state is detected via DOM events dispatcher: if no DOM event is generated into a given
 * interval user is considered idle.
 * 
 * @type js.util.Timeout
 */
js.event.Handler.idleTimeout = null;
$static(function () {
    js.event.Handler.idleTimeout = new js.util.Timeout(js.event.Handler.DEF_IDLE_TIMEOUT * 60 * 1000, function () {
        WinMain.page.onIdleTimeout();
    });
    js.event.Handler.idleTimeout.start();
});

js.event.Handler.prototype = {
    /**
     * Handle low level DOM event and reset idle timeout.
     * 
     * @param Event domEvent native DOM event.
     */
    _handle : function (domEvent) {
        if (js.event.Handler.idleTimeout !== null) {
            js.event.Handler.idleTimeout.start();
        }
        if (!this._preHandle(domEvent)) {
            return;
        }
        var ev = this._event.init(domEvent);
        try {
            this.listener.call(this._scope, ev);
        } catch (er) {
            js.ua.System.error(er);
        }
        if (ev.prevented === true) {
            this._prevent(domEvent);
        }
        if (ev.stopped === true) {
            this._stop(domEvent);
        }
    },

    /**
     * @param Event domEvent native DOM event.
     * @return Boolean false if this event should be canceled.
     */
    _preHandle : function (domEvent) {
        // if (domEvent.eventPhase !== js.event.Event.AT_TARGET) {
        // return false;
        // }
        return true;
    },

    /**
     * Prevent event default behavior.
     * 
     * @param Event domEvent, native DOM event.
     */
    _prevent : function (domEvent) {
        domEvent.preventDefault();
    },

    /**
     * Stop event propagation.
     * 
     * @param Event domEvent, native DOM event.
     */
    _stop : function (domEvent) {
        domEvent.stopPropagation();
    },

    /**
     * Equality test. Check whether or not supplied arguments equals this event handler. Two event handlers are
     * considered equals if they wrap the same native {@link Node} instance, have the same event type and event
     * listener.
     * 
     * @param js.event.Handler handler event handler to compare with.
     * @return Boolean true if given argument equals this event handler.
     * @assert given argument is instance of js.event.Handler
     */
    equals : function (handler) {
        $assert(handler instanceof js.event.Handler, "js.dom.Handler#equals", "Handler to compare is undefined or null.");
        return handler.node === this.node && handler.type === this.type && handler.listener === this.listener;
    },
    
    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.event.Handler";
    }
};
$extends(js.event.Handler, Object);

/**
 * IE prevent default and stop propagation is signaled differently.
 */
$legacy(js.ua.Engine.TRIDENT, function () {
    js.event.Handler.prototype._prevent = function (domEvent) {
        domEvent.returnValue = false;
    };

    js.event.Handler.prototype._stop = function (domEvent) {
        domEvent.cancelBubble = true;
    };
});

/**
 * It seems Opera IFrame and mobile WebKit trigger <b>load</b> event for blank location, i.e. source "about:blank".
 * Such condition is not for interest for application code and should be avoid.
 */
$legacy(js.ua.Engine.TRIDENT || js.ua.Engine.PRESTO || js.ua.Engine.MOBILE_WEBKIT, function () {
    js.event.Handler.prototype._preHandle = function (domEvent) {
        // if (domEvent.eventPhase !== js.event.Event.AT_TARGET) {
        // return false;
        // }
        if (this.type === "load" && this.node.nodeName.toLowerCase() === "iframe" && this.node.contentWindow.location.toString() === "about:blank") {
            return false;
        }
        return true;
    };
});
$package('js.event');


/**
 * Keyboard codes.
 */
js.event.Key =
{
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    BREAK: 19,
    CAPS_LOCK: 20,
    ESCAPE: 27,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    INSERT: 45,
    DELETE: 46,
    0: 48,
    1: 49,
    2: 50,
    3: 51,
    4: 52,
    5: 53,
    6: 54,
    7: 55,
    8: 56,
    9: 57,
    COLON: 59,
    PLUS: 61,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    NUM0: 96,
    NUM1: 97,
    NUM2: 98,
    NUM3: 99,
    NUM4: 100,
    NUM5: 101,
    NUM6: 102,
    NUM7: 103,
    NUM8: 104,
    NUM9: 105,
    NUM_MULTIPLY: 106,
    NUM_PLUS: 107,
    NUM_MINUS: 109,
    NUM_POINT: 110,
    NUM_DIVIDE: 111,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    NUM_LOCK: 144,
    SCROLL_LOCK: 145,
    LESS_THAN: 188,
    MINUS: 189,
    GREATER_THAN: 190,
    QUESTION: 191,
    TILDE: 192,
    LEFT_BRACKET: 219,
    DIVIDE: 220,
    RIGHT_BRACKET: 221,
    QUOTATION: 222
};
$package('js.event');

/**
 * Target node. Event listeners can be registered on both {@link js.dom.Element elements} - and
 * {@link js.dom.Document documents}, collectively named target nodes.
 * 
 * @param Object node element or document.
 */
js.event.TargetNode = function (node) {
    /**
     * Native node.
     * 
     * @type Node
     */
    this.node = node instanceof js.dom.Document ? node._document : node._node;

    /**
     * Owner document.
     * 
     * @type js.dom.Document
     */
    this.ownerDoc = node instanceof js.dom.Document ? node : node._ownerDoc;
};

js.event.TargetNode.prototype = {
    /**
     * Returns a string representation of the object.
     * 
     * @return String target node string representation.
     */
    toString : function () {
        return 'js.event.TargetNode';
    }
};
$extends(js.event.TargetNode, Object);
$package("js.event");

/**
 * Valid event types map.
 */
js.event.Types = {
    /** The action has been aborted. */
    abort : "HTMLEvents",

    /** Before unload. Fired just before unload. */
    beforeunload : "HTMLEvents",

    /** Focus has moved away from the target. */
    blur : "HTMLEvents",

    /**
     * The user agent can resume playback of the media data, but estimates that if playback were to be started now, the
     * media resource could not be rendered at the current playback rate up to its end without having to stop for
     * further buffering of content.
     */
    canplay : "MediaEvents",

    /**
     * The user agent estimates that if playback were to be started now, the media resource could be rendered at the
     * current playback rate all the way to its end without having to stop for further buffering.
     */
    canplaythrough : "MediaEvents",

    /** A value in a form has been changed. */
    change : "HTMLEvents",

    /** Event raised when mouse is clicked. */
    click : "MouseEvents",

    /** Mouse is double-clicked. */
    dblclick : "MouseEvents",

    /** The duration attribute has just been updated. */
    durationchange : "MediaEvents",

    /** A media element whose networkState was previously not in the NETWORK_EMPTY state has just switched to that state. */
    emptied : "MediaEvents",

    /** Playback has stopped because the end of the media resource was reached. */
    ended : "MediaEvents",

    /** There has been an error. */
    error : "HTMLEvents",

    /** Focus has been set on the target. */
    focus : "HTMLEvents",

    /** Fired synchronously when the value of an <input> or <textarea> element is changed. */
    input : "HTMLEvents",

    /** A key has been pressed. */
    keydown : "UIEvents",

    /** A key has been pressed and released. */
    keypress : "UIEvents",

    /** A key has been released. */
    keyup : "UIEvents",

    /** The element/window has loaded. */
    load : "HTMLEvents",

    /** The user agent can render the media data at the current playback position for the first time. */
    loadeddata : "MediaEvents",

    /** The user agent has just determined the duration and dimensions of the media resource. */
    loadedmetadata : "MediaEvents",

    /** The user agent begins looking for media data, as part of the resource selection algorithm. */
    loadstart : "MediaEvents",

    /** Mouse button is pressed down. */
    mousedown : "MouseEvents",

    /** Mouse cursor moves. */
    mousemove : "MouseEvents",

    /** Mouse cursor leaves target. */
    mouseout : "MouseEvents",

    /** Mouse cursor moves over the target. */
    mouseover : "MouseEvents",

    /** Mouse button is released. */
    mouseup : "MouseEvents",

    /** Mouse wheel has been moved. */
    mousewheel : "SyntheticEvents",

    /** Device orientation changed. This event applies only to mobile devices equipped with accelerometer. */
    orientationchange : "HTMLEvents",

    /** Paste event. */
    paste : "UIEvents",

    /** Playback has been paused. Fired after the pause() method has returned. */
    pause : "MediaEvents",

    /**
     * Playback has begun. Fired after the play() method has returned, or when the autoplay attribute has caused
     * playback to begin.
     */
    play : "MediaEvents",

    /** Playback has started. */
    playing : "MediaEvents",

    /** The user agent is fetching media data. */
    progress : "MediaEvents",

    /** Either the defaultPlaybackRate or the playbackRate attribute has just been updated. */
    ratechange : "MediaEvents",

    /** A form has been reset. */
    reset : "HTMLEvents",

    /** A element/window has been resized. */
    resize : "HTMLEvents",

    /** Window/frame has been scrolled. */
    scroll : "HTMLEvents",

    /** The seeking IDL attribute changed to false. */
    seeked : "MediaEvents",

    /**
     * The seeking IDL attribute changed to true and the seek operation is taking long enough that the user agent has
     * time to fire the event.
     */
    seeking : "MediaEvents",

    /** An element has been selected. */
    select : "HTMLEvents",

    /** The user agent is trying to fetch media data, but data is unexpectedly not forthcoming. */
    stalled : "MediaEvents",

    /** A form has been submitted. */
    submit : "HTMLEvents",

    /**
     * The user agent is intentionally not currently fetching media data, but does not have the entire media resource
     * downloaded.
     */
    suspend : "MediaEvents",

    /**
     * The current playback position changed as part of normal playback or in an especially interesting way, for example
     * discontinuously.
     */
    timeupdate : "MediaEvents",

    /** The element/window has been unloaded. */
    unload : "HTMLEvents",

    /**
     * Either the volume attribute or the muted attribute has changed. Fired after the relevant attribute's setter has
     * returned.
     */
    volumechange : "MediaEvents",

    /**
     * Playback has stopped because the next frame is not available, but the user agent expects that frame to become
     * available in due course.
     */
    waiting : "MediaEvents"
};
$package("js.format");

/**
 * Generic formatter with methods to format, parse and test values.
 * 
 * @author Iulian Rotaru
 * @since 1.3
 */
js.format.Format = {
    /**
     * Format value instance into a string representation suitable for user interface.
     * 
     * @param Object object value instance.
     * @return String value string representation.
     */
    format : function (object) {
    },

    /**
     * Parse value string representation and return value instance.
     * 
     * @param String string value string representation.
     * @return Object value instance.
     */
    parse : function (string) {
    },

    /**
     * Test if value string representation can be parsed without errors. If this predicate returns true parse is
     * guaranteed to run successfully.
     * 
     * @param String string value string representation.
     * @return Boolean if given <code>string</code> can be successfully parsed.
     */
    test : function (string) {
    }
};
$package("js.format");

/**
 * Date/time formatters base class. This is the base class for predefined date/time formatter classes supplied by this
 * library. If none is suitable one may decide to create his own class.
 * <p>
 * Here is a code snippet for creating user defined date format class:
 * 
 * <pre>
 * CustomDateFormat = function() {
 *  this.$super(new js.format.DateFormat("yyyy-MM-dd HH:mm:ss"));
 * };
 * $extends(CustomDateFormat, js.format.AbstractDateTime);
 * </pre>
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * @constructor Construct date/time format instance.
 * 
 * @param js.format.DateFormat dateFormat date/time format utility.
 */
js.format.AbstractDateTime = function (dateFormat) {
    $assert(dateFormat instanceof js.format.DateFormat, "js.format.AbstractDateTime#AbstractDateTime", "Argument is not a date format utility.");

    /**
     * Date format utility.
     * 
     * @type js.format.DateFormat
     */
    this._dateFormat = dateFormat;
};

js.format.AbstractDateTime.prototype = {
    /**
     * Format date. Format given date instance using internal {@link #_dateFormat} and return string date. Returns empty
     * string if <em>date</em> argument is null or is not a date instance.
     * 
     * @param Date date date instance to format.
     * @return String formated date or empty string.
     * @assert date argument is a date instance.
     */
    format : function (date) {
        if (date == null) {
            return "";
        }
        $assert(js.lang.Types.isDate(date), "js.format.AbstractDateTime#format", "Argument is not a date.");
        if (!js.lang.Types.isDate(date)) {
            return "";
        }
        return this._dateFormat.format(date);
    },

    /**
     * Parse date string. Parse given date string and return newly created date instance. Returns null is argument is
     * not a no empty string.
     * 
     * @param String source date string to parse.
     * @return Date date instance.
     * @assert source argument is non empty string.
     */
    parse : function (source) {
        if (!source) {
            return null;
        }
        $assert(js.lang.Types.isString(source), "js.format.AbstractDateTime#parse", "Source is not a string.");
        if (!js.lang.Types.isString(source)) {
            return null;
        }
        return this._dateFormat.parse(source);
    },

    /**
     * Test if date string is well formatted.
     * 
     * @param String source date string.
     * @return Boolean true if given date string is well formatted.
     */
    test : function (source) {
        return this._dateFormat.test(source);
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.format.AbstractDateTime";
    }
};
$extends(js.format.AbstractDateTime, Object);
$implements(js.format.AbstractDateTime, js.format.Format);
$package("js.format");

/**
 * Bit rate formatter. Implemented format is a number with two fraction digits and bit rate unit separated by space like
 * <em>23.56 Kbps</em>. Supported units are listed on {@link js.format.BitRate.Unit}.
 * 
 * @author Iulian Rotaru
 * @since 1.1
 * @constructor Construct bit rate formatter instance.
 */
js.format.BitRate = function () {
    /**
     * Number format. Used to handle numeric part of this bit rate format instance.
     * 
     * @type js.format.NumberFormat
     */
    this._numberFormat = new js.format.NumberFormat();
    this._numberFormat.setGroupingUsed(true);
    this._numberFormat.setMinimumFractionDigits(2);
    this._numberFormat.setMaximumFractionDigits(2);
};

/**
 * Bit rate measurement units.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 */
js.format.BitRate.Unit = {
    /**
     * Bytes per second, displayed as <em>bps</em>.
     * 
     * @type String
     */
    1 : "bps",

    /**
     * Kilobytes per second, displayed as <em>Kbps</em>. A kilobyte has 1000 bytes.
     * 
     * @type String
     */
    1000 : "Kbps",

    /**
     * Megabytes per second, displayed as <em>Mbps</em>. A megabyte has 1000 kilobytes.
     * 
     * @type String
     */
    1000000 : "Mbps",

    /**
     * Gigabytes per second, displayed as <em>Gbps</em>. A gigabyte has 1000 megabytes.
     * 
     * @type String
     */
    1000000000 : "Gbps",

    /**
     * Terabytes per second, displayed as <em>Tbps</em>. A terabyte has 1000 gigabytes.
     * 
     * @type String
     */
    1000000000000 : "Tbps"
};

js.format.BitRate.prototype = {
    /**
     * Valid input expression.
     * 
     * @type RegExp
     */
    _VALID_INPUT : function () {
        var units = [];
        for ( var u in js.format.BitRate.Unit) {
            units.push(js.format.BitRate.Unit[u]);
        }
        return new RegExp("^([^ ]+)\\s+(" + units.join("|") + ")$", "gi");
    }(),

    /**
     * Format bit rate.
     * 
     * @param Number bitRate bit rate value to format.
     * @return String formatted bit rate.
     * @assert bit rate argument is a non strict positive number.
     */
    format : function (bitRate) {
        $assert(js.lang.Types.isNumber(bitRate), "js.format.BitRate#format", "Bit rate is not a number.");
        $assert(bitRate >= 0, "js.format.BitRate#format", "Bit rate is not positive or zero.");
        if (!bitRate) {
            return this._format(0, "1");
        }

        // workaround for precision to 5 digits
        // maximum numeric part value is 999.99 in current number format settings
        // if bitrate is 999995 is reasonable to expect 1.0 Mbps but because bitrate < Mbps threshold
        // selected unit is Kbps and after numeric part rounding formatted string is 1,000.00 Kbps
        // which is correct but not as expected; the same is true for Gbps and Tbps
        // next logic takes care to choose next units if round increases value, so Kbps -> Mbps

        var adjustToNextUnit = false;
        if (bitRate.toString().indexOf("99999") !== -1) {
            adjustToNextUnit = Math.round("0." + bitRate.toString().substr(5)) === 1;
        }

        var threshold = 0, t = 0;
        for (t in js.format.BitRate.Unit) {
            if (bitRate < t) {
                if (!adjustToNextUnit) {
                    break;
                }
                adjustToNextUnit = false;
            }
            threshold = t;
        }
        if (threshold === 0) {
            // threshold is zero if bit rate is greater or equals largest threshold
            // uses that largest threshold to format bit rate
            threshold = t;
        }
        return this._format(bitRate / Number(threshold), threshold);
    },

    /**
     * Internal format helper.
     * 
     * @param Number bitRate bit rate value,
     * @param Number threshold unit threshold value.
     * @return String bit rate string representation.
     */
    _format : function (bitRate, threshold) {
        return this._numberFormat.format(bitRate) + " " + js.format.BitRate.Unit[threshold];
    },

    /**
     * Parse bit rate string representation. Parse bit rate source string and convert resulted value to standard units.
     * 
     * @param String string source bit rate.
     * @return Number bit rate value in standard <em>bps</em> units.
     * @assert source argument is well formatted.
     */
    parse : function (string) {
        this._VALID_INPUT.lastIndex = 0;
        var m = this._VALID_INPUT.exec(string);
        $assert(m !== null && m.length === 3, "js.format.BitRate#parse", "Invalid bit rate format.");

        var value = this._numberFormat.parse(m[1]);
        var unit = m[2].toLowerCase();
        if (unit.length > 3) {
            unit = js.util.Strings.toTitleCase(unit);
        }
        for ( var t in js.format.BitRate.Unit) {
            if (js.format.BitRate.Unit[t] === unit) {
                return value * Number(t);
            }
        }
    },

    /**
     * Test if string is a valid bit rate value.
     * 
     * @param String string input to test.
     * @return Boolean true if string argument is a valid bit rate value.
     */
    test : function (string) {
        this._VALID_INPUT.lastIndex = 0;
        var m = this._VALID_INPUT.exec(string);
        return (m !== null && typeof m[1] !== "undefined") ? this._numberFormat.test(m[1]) : false;
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.format.BitRate";
    }
};
$extends(js.format.BitRate, Object);
$implements(js.format.BitRate, js.format.Format);
$package("js.format");

/**
 * Currency format. Recognized format has a numeric part with grouping and two fraction digits and a currency string
 * separated by space, e.g. <em>12.35 LEI</em>.
 * 
 * @author Iulian Rotaru
 * @constructor Construct currency format instance.
 */
js.format.Currency = function () {
    var symbols = js.format.Currency[js.ua.Regional.country];
    if (typeof symbols === "undefined") {
        symbols = js.format.Currency.US;
    }

    /**
     * Number format. Used to handle numeric part of this currency format instance.
     * 
     * @type js.format.NumberFormat
     */
    this._numberFormat = new js.format.NumberFormat(symbols.pattern);
    this._numberFormat.setGroupingUsed(true);
    this._numberFormat.setMinimumFractionDigits(2);
    this._numberFormat.setMaximumFractionDigits(2);
};

js.format.Currency.prototype = {
    /**
     * Format currency.
     * 
     * @param Number currency number to be formatted as currency.
     * @return String string representation.
     * @assert <em>currency</em> argument is a numeric value.
     */
    format : function (currency) {
        $assert(js.lang.Types.isNumber(currency), "js.format.Currency#format", "Currency is not a number.");
        return this._numberFormat.format(currency);
    },

    /**
     * Parse currency string.
     * 
     * @param String string currency string value.
     * @return Number numeric currency value.
     */
    parse : function (string) {
        return this._numberFormat.parse(string);
    },

    /**
     * Test if string value represent a valid currency.
     * 
     * @param String string currency string value to test.
     * @return Boolean true if argument is a valid currency.
     */
    test : function (string) {
        return this._numberFormat.test(string);
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.format.Currency";
    }
};
$extends(js.format.Currency, Object);
$implements(js.format.Currency, js.format.Format);

/**
 * United States currency configuration.
 */
js.format.Currency.US = {
    /**
     * Currency pattern, including currency symbol.
     * 
     * @type String
     */
    pattern : "$#"
};

/**
 * Romanian currency configuration.
 */
js.format.Currency.RO = {
    /**
     * Currency pattern, including currency symbol.
     * 
     * @type String
     */
    pattern : "# LEI"
};
$package("js.format");

/**
 * Date/time format utility. DateFormat is a class for formatting and parsing dates in a locale-sensitive manner. Using
 * date format class is a two steps process: create date format instance supplying desired format patterns and call
 * {@link #format}, {@link #parse} or {@link #test} methods.
 * 
 * <pre>
 * var format = new js.format.DateFormat("yyyy-MM-dd HH:mm:ss");
 * var string = format.format(new Date());
 * </pre>
 * 
 * Anyway, is always a good practice to use one of predefined classes present into this package in order to have
 * applications with uniform date representation.
 * <p>
 * This class is a port of java.text.DateFormat class. There is an excellent documentation on API for Java class; here
 * we limit to couple examples: <table>
 * <tr>
 * <td><b>Date and Time Pattern
 * <td><b>Result
 * <tr>
 * <td>"yyyy.MM.dd 'at' HH:mm:ss z"
 * <td>2001.07.04 at 12:08:56 +0200
 * <tr>
 * <td>"EEE, MMM d, ''yy"
 * <td>Wed, Jul 4, '01
 * <tr>
 * <td>"h:mm a"
 * <td>12:08 PM
 * <tr>
 * <td>"hh 'o''clock' a, zzzz"
 * <td>12 o'clock PM, +0200
 * <tr>
 * <td>"yyyyy.MMMMM.dd hh:mm aaa"
 * <td>2001.July.04 12:08 PM
 * <tr>
 * <td>"EEE, d MMM yyyy HH:mm:ss Z"
 * <td>Wed, 4 Jul 2001 12:08:56 -0700
 * <tr>
 * <td>"yyMMddHHmmssZ"
 * <td>010704120856-0700
 * <tr>
 * <td>"yyyy-MM-dd'T'HH:mm:ss.SSSZ"
 * <td>2001-07-04T12:08:56.235-0700</table>
 * 
 * <p>
 * There are couple limitations on Java porting. Here are the known ones:
 * <ul>
 * <li>textual patterns can"t be adjacent
 * <li>z - short and full time zone is processed as RFC822 format
 * <li>G - era designator is not implemented
 * <li>w - week in year is not implemented
 * <li>W - week in month is not implemented
 * <li>D - day in year is not implemented
 * <li>F - day of week in month is not implemented
 * <li>u - day number of week
 * <li>k, K - hour in day in format (1-24) is not implemented
 * <li>X - ISO 8601 time zone is not implemented
 * </ul>
 * Also, time zone logic is based on {@link Date#getTimezoneOffset} and there are not confirmed rumors it is not dealing
 * well with daylight saving.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * @constructor Construct date/time format instance.
 * 
 * @param String pattern date/time format pattern.
 */
js.format.DateFormat = function (pattern) {
    $assert(js.lang.Types.isString(pattern), "js.format.DateFormat#DateFormat", "Pattern is not a string.");

    /**
     * Date format pattern. See class description for details.
     * 
     * @type String
     */
    this._pattern = pattern;

    /**
     * Locale-sensitive date format symbols. Stores date-time formatting data, such as the names of the months and the
     * names of the days of the week.
     * 
     * @type js.format.DateFormatSymbols
     */
    this._symbols = new js.format.DateFormatSymbols();

    /**
     * Valid date input expression compiled from {@link #_pattern format pattern}.
     * 
     * @type RegExp
     */
    this._validInput = null;
    this._compile();
};

/**
 * Short date format.
 * 
 * @type Number
 */
js.format.DateFormat.SHORT = 1;

/**
 * Medium date format.
 * 
 * @type Number
 */
js.format.DateFormat.MEDIUM = 2;

/**
 * Long date format.
 * 
 * @type Number
 */
js.format.DateFormat.LONG = 3;

/**
 * Full date format.
 * 
 * @type Number
 */
js.format.DateFormat.FULL = 4;

/**
 * Date format styles.
 */
js.format.DateFormat.DATE_STYLES = {
    /**
     * Short date format.
     * 
     * @type String
     */
    1 : "shortDate",

    /**
     * Medium date format.
     * 
     * @type String
     */
    2 : "mediumDate",

    /**
     * Long date format.
     * 
     * @type String
     */
    3 : "longDate",

    /**
     * Full date format.
     * 
     * @type String
     */
    4 : "fullDate"
};

/**
 * Time format styles.
 */
js.format.DateFormat.TIME_STYLES = {
    /**
     * Short time format.
     * 
     * @type String
     */
    1 : "shortTime",

    /**
     * Medium time format.
     * 
     * @type String
     */
    2 : "mediumTime",

    /**
     * Long time format.
     * 
     * @type String
     */
    3 : "longTime",

    /**
     * Full time format.
     * 
     * @type String
     */
    4 : "fullTime"
};

js.format.DateFormat.getDateTimeInstance = function (dateStyle, timeStyle) {
    var symbols = new js.format.DateFormatSymbols();
    var datePattern = symbols.patterns[this.DATE_STYLES[dateStyle]];
    var timePattern = symbols.patterns[this.TIME_STYLES[timeStyle]];
    return new js.format.DateFormat(datePattern + " " + timePattern);
};

js.format.DateFormat.getDateInstance = function (style) {
    var symbols = new js.format.DateFormatSymbols();
    var datePattern = symbols.patterns[this.DATE_STYLES[style]];
    return new js.format.DateFormat(datePattern);
};

js.format.DateFormat.getTimeInstance = function (style) {
    var symbols = new js.format.DateFormatSymbols();
    var timePattern = symbols.patterns[this.TIME_STYLES[style]];
    return new js.format.DateFormat(timePattern);
};

/**
 * Pattern formatters. Utility class supplying formatters for every date pattern construct.
 */
js.format.DateFormat.PatternFormatters = {
    /**
     * Locale sensitive date formatting symbols.
     * 
     * @type js.format.DateFormatSymbols
     */
    symbols : null,

    /**
     * Date instance to apply formats to.
     * 
     * @type Date
     */
    date : null,

    /**
     * Truncated year, alias for {@link #yy}.
     * 
     * @return String truncated year.
     */
    y : function () {
        return this.truncateYear(this.date.getFullYear());
    },

    /**
     * Truncated year, <em>14</em> for <em>2014</em>.
     * 
     * @return String truncated year.
     */
    yy : function () {
        return this.truncateYear(this.date.getFullYear());
    },

    /**
     * Full year, alias for {@link #yyyy}.
     * 
     * @return String full year.
     */
    yyy : function () {
        return this.date.getFullYear().toString();
    },

    /**
     * Full year, <em>2014</em>.
     * 
     * @return String full year.
     */
    yyyy : function () {
        return this.date.getFullYear().toString();
    },

    /**
     * Unformatted month ordinal, January is <em>1</em>.
     * 
     * @return String unformatted month ordinal.
     */
    M : function () {
        return (this.date.getMonth() + 1).toString();
    },

    /**
     * Two digits month ordinal, January is <em>01</em>.
     * 
     * @return String two digits month ordinal.
     */
    MM : function () {
        return this.pad(this.date.getMonth() + 1, 2);
    },

    /**
     * Locale sensitive month short name.
     * 
     * @return String month short name.
     */
    MMM : function () {
        return this.symbols.shortMonths[this.date.getMonth()];
    },

    /**
     * Locale sensitive month full name.
     * 
     * @return String month full name.
     */
    MMMM : function () {
        return this.symbols.fullMonths[this.date.getMonth()];
    },

    /**
     * Unformatted day of month ordinal, first day is <em>1</em>.
     * 
     * @return String day ordinal.
     */
    d : function () {
        return this.date.getDate();
    },

    /**
     * Two digits day of the month ordinal, first day is <em>01</em>
     * 
     * @return String day ordinal.
     */
    dd : function () {
        return this.pad(this.date.getDate(), 2);
    },

    /**
     * Locale sensitive short week day name, alias for {@link #EEE}.
     * 
     * @return String short week day.
     */
    E : function () {
        return this.symbols.shortWeekDays[this.date.getDay()];
    },

    /**
     * Locale sensitive short week day name, alias for {@link #EEE}.
     * 
     * @return String short week day.
     */
    EE : function () {
        return this.symbols.shortWeekDays[this.date.getDay()];
    },

    /**
     * Locale sensitive short week day name.
     * 
     * @return String short week day.
     */
    EEE : function () {
        return this.symbols.shortWeekDays[this.date.getDay()];
    },

    /**
     * Locale sensitive full week day name.
     * 
     * @return String full week day.
     */
    EEEE : function () {
        return this.symbols.fullWeekDays[this.date.getDay()];
    },

    /**
     * Unformatted half day hour, [0..11].
     * 
     * @return String half day hour.
     */
    h : function () {
        var h = this.date.getHours() % 12;
        if (h === 0) {
            h = 12;
        }
        return h.toString();
    },

    /**
     * Two digits half day hour, [00..11]
     * 
     * @return String half day hour.
     */
    hh : function () {
        return this.pad(js.format.DateFormat.PatternFormatters["h"]());
    },

    /**
     * Unformatted full day hour, [0..23].
     * 
     * @return String full day hour.
     */
    H : function () {
        return this.date.getHours().toString();
    },

    /**
     * Two digits full day hour, [00..23]
     * 
     * @return String full day hour.
     */
    HH : function () {
        return this.pad(this.date.getHours(), 2);
    },

    /**
     * Unformatted minute, [0..59]
     * 
     * @return String unformatted minute.
     */
    m : function () {
        return this.date.getMinutes().toString();
    },

    /**
     * Two digits minute, [00..59]
     * 
     * @return String two digits minute.
     */
    mm : function () {
        return this.pad(this.date.getMinutes(), 2);
    },

    /**
     * Unformatted second, [0..59]
     * 
     * @return String unformatted second.
     */
    s : function () {
        return this.date.getSeconds().toString();
    },

    /**
     * Two digits second, [00..59]
     * 
     * @return String two digits second.
     */
    ss : function () {
        return this.pad(this.date.getSeconds(), 2);
    },

    /**
     * Tenth of second, one single digit.
     * 
     * @return String tenth of second.
     */
    S : function () {
        var S = this.date.getMilliseconds();
        return this.pad(S > 99 ? Math.round(S / 100) : S, 1);
    },

    /**
     * Hundredth of second, two digits.
     * 
     * @return String hundredth of second.
     */
    SS : function () {
        var S = this.date.getMilliseconds();
        return this.pad(S > 9 ? Math.round(S / 10) : S, 2);
    },

    /**
     * Thousandth of second, three digits.
     * 
     * @return String thousandth of second.
     */
    SSS : function () {
        return this.pad(this.date.getMilliseconds(), 3);
    },

    /**
     * AM/PM marker.
     * 
     * @return String AM/PM marker.
     */
    a : function () {
        return this.date.getHours() < 12 ? "AM" : "PM";
    },

    /**
     * Short time zone, alias for {@link #zzz}.
     * 
     * @return String short time zone.
     */
    z : function () {
        return this.shortTZ(this.date);
    },

    /**
     * Short time zone, alias for {@link #zzz}.
     * 
     * @return String short time zone.
     */
    zz : function () {
        return this.shortTZ(this.date);
    },

    /**
     * Short time zone.
     * 
     * @return String short time zone.
     */
    zzz : function () {
        return this.shortTZ(this.date);
    },

    /**
     * Long time zone.
     * 
     * @return String long time zone.
     */
    zzzz : function () {
        return this.fullTZ(this.date);
    },

    /**
     * RFC822 time zone, <em>+0200</em>.
     * 
     * @return String RFC822 time zone.
     */
    Z : function () {
        return this.rfc822TZ(this.date);
    },

    /**
     * Convert numeric value to zero padded string of specified length. Convert given numeric value to string and insert
     * '0' at start till resulting string length reaches desired length.
     * 
     * @param Number val numeric value,
     * @param Number len desired padded string length.
     * @return String given numeric value as padded string.
     */
    pad : function (val, len) {
        val = String(val);
        len = len || 2;
        while (val.length < len) {
            val = "0" + val;
        }
        return val;
    },

    /**
     * Truncate year value to two digits representation. Returns short year format; this is last the two digits, that
     * is, decades and years, e.g. 14 for 2014 input.
     * 
     * @param Number fullYear full year value.
     * @return String truncated year value.
     * @assert year argument is in (current year - 80, current year + 20] range.
     */
    truncateYear : function (fullYear) {
        var currentYear = new Date().getFullYear();
        $assert(currentYear - 80 < fullYear && fullYear <= currentYear + 20, "js.format.DateFormat#format", "Year is not in proper range.");
        return fullYear.toString().substr(2);
    },

    // i do not have a reliable algorithm to determine client time zone id or display name since it depends on country,
    // beside date time zone offset; also take care there are rumors time zone offset is not dealing well with daylight
    // saving; for now uses rfc822 format for all time zone format

    /**
     * Return date value short time zone. Current implementation delegates {@link #rfc822TZ}.
     * 
     * @param Date date value.
     * @return String short time zone.
     */
    shortTZ : function (date) {
        return this.rfc822TZ(date);
    },

    /**
     * Get date value full time zone. Current implementation delegates {@link #rfc822TZ}.
     * 
     * @param Date date value.
     * @return String full time zone.
     */
    fullTZ : function (date) {
        return this.rfc822TZ(date);
    },

    /**
     * Get date value time zone in RFC822 format.
     * 
     * @param Date date value.
     * @return String time zone in RFC822 format.
     */
    rfc822TZ : function (date) {
        var tz = date.getTimezoneOffset();
        var s = tz < 0 ? "+" : "-";
        var h = Math.abs(Math.round(tz / 60));
        var m = Math.abs(Math.round(tz % 60));
        return s + this.pad(h) + this.pad(m);
    }
};

js.format.DateFormat.prototype = {
    /**
     * Format constructs patterns.
     * 
     * @type RegExp
     */
    _FORMAT_PATTERNS : /y{1,4}|M{1,4}|d{1,2}|E{1,4}|h{1,2}|H{1,2}|m{1,2}|s{1,2}|S{1,3}|a|z{1,4}|Z/g,

    /**
     * Pattern chars.
     * 
     * @type String
     */
    _PATTERN_CHARS : "yMdEhHmsSazZ",

    /**
     * Format date instance accordingly {@link #_pattern}.
     * 
     * @param Date date date instance to format.
     * @return String formatted date.
     * @assert date argument is a valid {@link Date} instance.
     */
    format : function (date) {
        $assert(js.lang.Types.isDate(date), "js.format.DateFormat#format", "Date argument is not a valid Date instance.");
        var formatters = js.format.DateFormat.PatternFormatters;
        formatters.symbols = this._symbols;
        formatters.date = date;

        this._FORMAT_PATTERNS.lastIndex = 0;
        return this._pattern.replace(this._FORMAT_PATTERNS, function ($0) {
            return formatters[$0]();
        });
    },

    /**
     * Parse date string accordingly {@link #_pattern}.
     * 
     * @param String source date string source.
     * @return Date newly created date instance.
     * @assert source string is a valid {@link String} instance.
     */
    parse : function (source) {
        $assert(js.lang.Types.isString(source), "js.format.DateFormat#parse", "Source is not a string.");
        var sourceIndex = 0;

        var pattern = this._pattern;
        var patternChars = this._PATTERN_CHARS;
        var patternIndex = 0;
        var symbols = this._symbols;

        function isDigit (c) {
            return c >= "0" && c <= "9";
        }
        function isPattern (c) {
            return patternChars.indexOf(c) !== -1;
        }
        function text () {
            skipPattern();
            return parseText();
        }
        function number () {
            return Number(parseNumber(skipPattern()));
        }
        function year () {
            var patternLength = skipPattern();
            var year = parseNumber(patternLength);
            if (patternLength > 2) {
                return year;
            }

            $assert(year < 100, "js.format.DateFormat#parse", "Year is greater than 99.");
            var nowFullYear = new Date().getFullYear();
            var nowYear = nowFullYear % 100;
            var century = Math.floor(nowFullYear / 100);
            if (nowYear >= 80) {
                if (year <= nowYear - 80) {
                    ++century;
                }
            }
            else {
                if (year > nowYear + 20) {
                    --century;
                }
            }
            return 100 * century + year;
        }
        function month () {
            var patternLength = skipPattern();
            if (patternLength <= 2) {
                return parseNumber(patternLength) - 1;
            }

            var rex = new RegExp(parseText(), "gi");
            var i = index(symbols.fullMonths, rex);
            if (i === -1) {
                i = index(symbols.shortMonths, rex);
            }
            $assert(i !== -1, "js.format.DateFormat#parse", "Invalid month name.");
            return i;
        }
        function weekDay () {
            var s = text();
            var rex = new RegExp(s, "gi");
            var i = index(symbols.fullWeekDays, rex);
            if (i === -1) {
                i = index(symbols.shortWeekDays, rex);
            }
            $assert(i !== -1, "js.format.DateFormat#parse", "Invalid week day.");
        }
        function ampmMarker () {
            ++patternIndex;
            var ampm = source.substr(sourceIndex, 2).toLowerCase();
            // silently ignore index beyond source length
            sourceIndex += 2;
            return ampm;
        }

        function skipPattern () {
            var c = pattern.charAt(patternIndex);
            var patternLength = 1;
            while (patternIndex < pattern.length && c === pattern.charAt(++patternIndex)) {
                ++patternLength;
            }
            return patternLength;
        }
        function parseNumber (patternLength) {
            var inputLengthHint = isPattern(pattern.charAt(patternIndex)) ? patternLength : Number.POSITIVE_INFINITY;
            if (patternIndex === pattern.length) {
                inputLengthHint = Number.POSITIVE_INFINITY;
            }
            var text = "";
            while (sourceIndex < source.length && isDigit(source.charAt(sourceIndex)) && inputLengthHint-- > 0) {
                text += source.charAt(sourceIndex++);
            }
            return Number(text);
        }
        function parseText () {
            var text = "";
            var endOfText = patternIndex < pattern.length ? pattern.charAt(patternIndex) : null;
            while (sourceIndex < source.length && source.charAt(sourceIndex) !== endOfText) {
                text += source.charAt(sourceIndex++);
            }
            return text;
        }
        function index (names, rex) {
            for ( var i = 0; i < names.length; ++i) {
                // rex.lastIndex = 0;
                if (rex.test(names[i])) {
                    return i;
                }
            }
            return -1;
        }

        // date components value initialized to epoch
        var y = 1970, M = 0, d = 1, h = 0, m = 0, s = 0, S = 0;
        var pm = false;
        for (; patternIndex < pattern.length;) {
            switch (pattern.charAt(patternIndex)) {
            case "y":
                y = year();
                break;
            case "M":
                M = month();
                break;
            case "d":
                d = number();
                break;
            case "H":
                h = number();
                break;
            case "h":
                h = number();
                break;
            case "m":
                m = number();
                break;
            case "s":
                s = number();
                break;
            case "S":
                S = number();
                break;
            case "a":
                pm = ampmMarker() === "pm";
                break;
            case "E":
                weekDay();
                break;
            case "z":
                text();
                break;
            case "Z":
                text();
                break;
            default:
                $assert(source.charAt(sourceIndex) === pattern.charAt(patternIndex), "js.format.DateFormat#parse", "Source and pattern does not match.");
                ++patternIndex;
                ++sourceIndex;
            }
        }
        if (pm) {
            h = (h + 12) % 24;
        }
        return new Date(y, M, d, h, m, s, S);
    },

    /**
     * Test source string for valid date format, accordingly {@link #_pattern}. If this predicate returns true
     * {@link #parse} is guaranteed to return valid date instance.
     * 
     * @param String source date string to test.
     * @return Boolean true if source is a valid date format.
     */
    test : function (source) {
        this._validInput.lastIndex = 0;
        return this._validInput.test(source);
    },

    /**
     * Compile this formatter pattern. Process {@link #_pattern format pattern} and create a regular expression usable
     * by {@link #test} predicate; resulted expression is stored into {@link #_validInput}.
     */
    _compile : function () {
        var pattern = this._pattern;
        var index = 0;
        var rex = "";

        function year () {
            var subPatternLength = skipSubPattern();
            $assert(subPatternLength <= 4, "js.format.DateFormat#_compile", "Invalid year.");
            return subPatternLength > 2 ? "\\d{1,4}" : "\\d{2}";
        }
        function month () {
            var subPatternLength = skipSubPattern();
            $assert(subPatternLength <= 4, "js.format.DateFormat#_compile", "Invalid month.");
            return subPatternLength <= 2 ? "\\d{1,2}" : subPatternLength === 3 ? "\\w{3}" : "\\w{3,}";
        }
        function weekDay () {
            var subPatternLength = skipSubPattern();
            $assert(subPatternLength <= 4, "js.format.DateFormat#_compile", "Invalid week day.");
            return subPatternLength === 3 ? "\\w{3}" : "\\w{3,}";
        }
        function number (maxDigitsCount) {
            if (typeof maxDigitsCount === "undefined") {
                maxDigitsCount = 2;
            }
            $assert(skipSubPattern() <= maxDigitsCount, "js.format.DateFormat#_compile", "Invalid number format.");
            return "\\d{1," + maxDigitsCount + "}";
        }
        function ampmMarker () {
            $assert(skipSubPattern() === 1, "js.format.DateFormat#_compile", "Invalid AM/PM marker.");
            return "am|pm";
        }
        function generalTZ () {
            $assert(skipSubPattern() <= 4, "js.format.DateFormat#_compile", "Invalid time zone.");
            return "[+-]?\\d{4}";
        }
        function rfc822TZ () {
            $assert(skipSubPattern() === 1, "js.format.DateFormat#_compile", "Invalid time zone.");
            return "[+-]?\\d{4}";
        }
        function skipSubPattern () {
            // skip over current sub-pattern; returns sub-pattern length
            var c = pattern.charAt(index);
            var subPatternLength = 1;
            while (index < pattern.length && c === pattern.charAt(++index)) {
                ++subPatternLength;
            }
            return subPatternLength;
        }

        for ( var c; index < pattern.length;) {
            c = pattern.charAt(index);
            switch (c) {
            case "y":
                rex += year();
                break;
            case "M":
                rex += month();
                break;
            case "d":
            case "H":
            case "h":
            case "m":
            case "s":
                rex += number();
                break;
            case "S":
                rex += number(3);
                break;
            case "a":
                rex += ampmMarker();
                break;
            case "E":
                rex += weekDay();
                break;
            case "z":
                rex += generalTZ();
                break;
            case "Z":
                rex += rfc822TZ();
                break;
            default:
                $assert(!/[a-zA-Z]/.test(c), "js.format.DateFormat#_compile", "Invalid pattern.");
                rex += js.util.Strings.escapeRegExp(c);
                ++index;
            }
        }
        this._validInput = new RegExp("^" + rex + "$", "gi");
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.format.DateFormat";
    }
};
$extends(js.format.DateFormat, Object);
$implements(js.format.DateFormat, js.format.Format);
$package('js.format');

/**
 * Encapsulate regional sensitive date-time formatting data.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * @constructor Construct symbols instance.
 */
js.format.DateFormatSymbols = function () {
    return js.format.DateFormatSymbols._symbols;
};
$extends(js.format.DateFormatSymbols, Object);

js.format.DateFormatSymbols._symbols = {
    patterns : {
        fullDate : "@string/full-date",
        fullTime : "@string/full-time",
        longDate : "@string/long-date",
        longTime : "@string/long-time",
        mediumDate : "@string/medium-date",
        mediumTime : "@string/medium-time",
        shortDate : "@string/short-date",
        shortTime : "@string/short-time"
    },

    fullMonths : [ "@string/full-jan", "@string/full-feb", "@string/full-mar", "@string/full-apr", "@string/full-may", "@string/full-jun", "@string/full-jul", "@string/full-aug", "@string/full-sep", "@string/full-oct", "@string/full-nov", "@string/full-dec" ],
    shortMonths : [ "@string/short-jan", "@string/short-feb", "@string/short-mar", "@string/short-apr", "@string/short-may", "@string/short-jun", "@string/short-jul", "@string/short-aug", "@string/short-sep", "@string/short-oct", "@string/short-nov", "@string/short-dec" ],
    fullWeekDays : [ "@string/full-su", "@string/full-mo", "@string/full-tu", "@string/full-we", "@string/full-th", "@string/full-fr", "@string/full-sa" ],
    shortWeekDays : [ "@string/short-su", "@string/short-mo", "@string/short-tu", "@string/short-we", "@string/short-th", "@string/short-fr", "@string/short-sa" ],
    tinyWeekDays : [ "@string/tiny-su", "@string/tiny-mo", "@string/tiny-tu", "@string/tiny-we", "@string/tiny-th", "@string/tiny-fr", "@string/tiny-sa" ]
};
$package('js.format');

/**
 * Format instances factory. Because regional settings are immutable on client, format instances are singletons, that
 * is, a single instance for given format class. This factory takes care to not instantiate more.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 */
js.format.Factory = {
	/**
	 * Format instances pool.
	 * 
	 * @type Object
	 */
	_pool : {},

	/**
	 * Get format instance for class. Instance to retrieve is identified by given class name argument which designates a
	 * class that may implement <em>format</em>, <em>parse</em> and <em>test</em> methods. Returns null if class
	 * name argument is null.
	 * 
	 * @param String className the name of format class.
	 * @return Object format instance of requested class or null.
	 */
	getFormat : function(className) {
		if (className == null) {
			return null;
		}
		var instance = this._pool[className];
		if (typeof instance !== 'undefined') {
			return instance;
		}

		var clazz = js.lang.Class.forName(className);
		$assert(js.lang.Types.isFunction(clazz), 'js.format.Factory#getFormat', 'Formatter class is not a function.');

		instance = new clazz();
		this._pool[className] = instance;
		return instance;
	}
};
$package("js.format");

/**
 * File size formatter. File size has a numeric part with two fraction digits and file size units, separated by space,
 * e.g. <em>756.43 KB</em>. Supported units are listed on {@link js.format.FileSize.Unit}.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * @constructor Construct file size formatter instance.
 */
js.format.FileSize = function () {
    /**
     * Number format. Used to handle numeric part of this file size format instance.
     * 
     * @type js.format.NumberFormat
     */
    this._numberFormat = new js.format.NumberFormat();
    this._numberFormat.setGroupingUsed(true);
    this._numberFormat.setMinimumFractionDigits(2);
    this._numberFormat.setMaximumFractionDigits(2);

    var units = [];
    for ( var t in js.format.FileSize.Unit) {
        units.push(js.format.FileSize.Unit[t]);
    }
    /**
     * Valid input expression.
     * 
     * @type RegExp
     */
    this._validInput = new RegExp("^([^ ]+)\\s+(" + units.join("|") + ")$", "gi");
};

/**
 * File size measurement units.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 */
js.format.FileSize.Unit = {
    /**
     * Bytes, displayed as <em>B</em>.
     * 
     * @type String
     */
    1 : "B",

    /**
     * Kilobytes, displayed as <em>KB</em>. A kilobyte has 1024 bytes.
     * 
     * @type String
     */
    1024 : "KB",

    /**
     * Megabytes, displayed as <em>MB</em>. A megabyte has 1024 kilobytes.
     * 
     * @type String
     */
    1048576 : "MB",

    /**
     * Gigabytes, displayed as <em>GB</em>. A gigabyte has 1024 megabytes.
     * 
     * @type String
     */
    1073741824 : "GB",

    /**
     * Terabytes, displayed as <em>TB</em>. A terabyte has 1024 gigabytes.
     * 
     * @type String
     */
    1099511627776 : "TB"
};

js.format.FileSize.prototype = {
    /**
     * Valid input expression.
     * 
     * @type RegExp
     */
    _VALID_INPUT : function () {
        var units = [];
        for ( var u in js.format.FileSize.Unit) {
            units.push(js.format.FileSize.Unit[u]);
        }
        return new RegExp("^([^ ]+)\\s+(" + units.join("|") + ")$", "gi");
    }(),

    /**
     * Format file size.
     * 
     * @param Number fileSize file size to format.
     * @return String formatted file size.
     * @assert file size argument is a positive number.
     */
    format : function (fileSize) {
        $assert(js.lang.Types.isNumber(fileSize), "js.format.FileSize#format", "File size is not a number.");
        $assert(fileSize >= 0, "js.format.FileSize#format", "File size is not positive.");
        if (!fileSize) {
            return this._format(0, "1");
        }

        var threshold = 0, t = 0;
        for (t in js.format.FileSize.Unit) {
            if (fileSize < t) {
                break;
            }
            threshold = t;
        }
        if (threshold === 0) {
            // threshold is zero if file size is greater or equals largest threshold
            // uses that largest threshold to format file size
            threshold = t;
        }
        return this._format(fileSize / Number(threshold), threshold);
    },

    /**
     * Internal format helper.
     * 
     * @param Number fileSize file size to format.
     * @param Number threshold unit threshold value.
     * @return String formatted file size.
     */
    _format : function (fileSize, threshold) {
        return this._numberFormat.format(fileSize) + " " + js.format.FileSize.Unit[threshold];
    },

    /**
     * Parse file size string representation. Parse file size source string and convert resulted value to standard
     * units.
     * 
     * @param String string source file size.
     * @return Number file size value in standard <em>B</em> units.
     * @assert source argument is well formatted.
     */
    parse : function (string) {
        this._VALID_INPUT.lastIndex = 0;
        var m = this._VALID_INPUT.exec(string);
        $assert(m !== null && m.length === 3, "js.format.FileSize#parse", "Invalid file size format.");

        var value = this._numberFormat.parse(m[1]);
        var unit = m[2].toUpperCase();
        for ( var t in js.format.FileSize.Unit) {
            if (js.format.FileSize.Unit[t] === unit) {
                return value * Number(t);
            }
        }
    },

    /**
     * Test if string is a valid file size.
     * 
     * @param String string input to test.
     * @return Boolean true if string value is a valid file size.
     */
    test : function (string) {
        this._VALID_INPUT.lastIndex = 0;
        var m = this._VALID_INPUT.exec(string);
        return (m !== null && typeof m[1] !== "undefined") ? this._numberFormat.test(m[1]) : false;
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.format.FileSize";
    }
};
$extends(js.format.FileSize, Object);
$implements(js.format.FileSize, js.format.Format);
$package('js.format');

js.format.FullDate = function() {
    this.$super(js.format.DateFormat.getDateInstance(js.format.DateFormat.FULL));
};
$extends(js.format.FullDate, js.format.AbstractDateTime);
$package('js.format');

js.format.FullDateTime = function() {
    this.$super(js.format.DateFormat.getDateTimeInstance(js.format.DateFormat.FULL, js.format.DateFormat.FULL));
};
$extends(js.format.FullDateTime, js.format.AbstractDateTime);
$package('js.format');

js.format.FullTime = function() {
    this.$super(js.format.DateFormat.getTimeInstance(js.format.DateFormat.FULL));
};
$extends(js.format.FullTime, js.format.AbstractDateTime);
$package('js.format');

js.format.LongDate = function() {
    this.$super(js.format.DateFormat.getDateInstance(js.format.DateFormat.LONG));
};
$extends(js.format.LongDate, js.format.AbstractDateTime);
$package('js.format');

js.format.LongDateTime = function() {
    this.$super(js.format.DateFormat.getDateTimeInstance(js.format.DateFormat.LONG, js.format.DateFormat.LONG));
};
$extends(js.format.LongDateTime, js.format.AbstractDateTime);
$package('js.format');

js.format.LongTime = function() {
    this.$super(js.format.DateFormat.getTimeInstance(js.format.DateFormat.LONG));
};
$extends(js.format.LongTime, js.format.AbstractDateTime);
$package('js.format');

js.format.MediumDate = function() {
    this.$super(js.format.DateFormat.getDateInstance(js.format.DateFormat.MEDIUM));
};
$extends(js.format.MediumDate, js.format.AbstractDateTime);
$package('js.format');

js.format.MediumDateTime = function() {
    this.$super(js.format.DateFormat.getDateTimeInstance(js.format.DateFormat.MEDIUM, js.format.DateFormat.MEDIUM));
};
$extends(js.format.MediumDateTime, js.format.AbstractDateTime);
$package('js.format');

js.format.MediumTime = function() {
    this.$super(js.format.DateFormat.getTimeInstance(js.format.DateFormat.MEDIUM));
};
$extends(js.format.MediumTime, js.format.AbstractDateTime);
$package('js.format');

js.format.Number = function () {
    /**
     * Number format used internally to render numeric values.
     * 
     * @type js.format.NumberFormat
     */
    this._numberFormat = new js.format.NumberFormat();
    this._numberFormat.setGroupingUsed(true);
    this._numberFormat.setMinimumFractionDigits(2);
    this._numberFormat.setMaximumFractionDigits(2);
};

js.format.Number.prototype = {
    format : function (number) {
        return this._numberFormat.format(number);
    },

    parse : function (string) {
        return this._numberFormat.parse(string);
    },

    test : function (string) {
        return this._numberFormat.test(string);
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return 'js.format.Number';
    }
};
$extends(js.format.Number, Object);
$implements(js.format.Number, js.format.Format);
$package('js.format');

/**
 * Number format utility. Known limitations: lack of support for scientific notation.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * @constructor COnstruct number format instance.
 * 
 * @param String pattern optional number format pattern.
 */
js.format.NumberFormat = function (pattern) {
    var l = js.ua.Regional.language;
    var c = js.ua.Regional.country;
    var key = l.charAt(0).toUpperCase() + l.charAt(1) + '_' + c;

    var symbols = js.format.NumberFormat[key];
    if (typeof symbols === 'undefined') {
        symbols = js.format.NumberFormat.En_US;
    }

    /**
     * Number format pattern.
     * 
     * @type String
     */
    this._pattern = pattern;

    /**
     * Decimal separator.
     * 
     * @type String
     */
    this._decimalSeparator = symbols.decimalSeparator;

    /**
     * Grouping separator.
     * 
     * @type String
     */
    this._groupingSeparator = symbols.groupingSeparator;

    /**
     * Grouping usage. Default to false.
     * 
     * @type Boolean
     */
    this._groupingUsed = false;

    /**
     * Minimum fraction digits.
     * 
     * @type Number
     */
    this._minimumFractionDigits = 0;

    /**
     * Maximum fraction digits.
     * 
     * @type Number
     */
    this._maximumFractionDigits = Number.POSITIVE_INFINITY;

    /**
     * Minimum integer digits.
     * 
     * @type Number
     */
    this._minimumIntegerDigits = 0;

    /**
     * Maximum integer digits.
     * 
     * @type Number
     */
    this._maximumIntegerDigits = Number.POSITIVE_INFINITY;

    /**
     * Valid input expression.
     * 
     * @type RegExp
     */
    this._validInput = null;
    this._compile();
};

js.format.NumberFormat.prototype = {
    /**
     * Set whether or not grouping will be used in this format.
     * 
     * @param Boolean value
     * @return js.format.NumberFormat this object.
     * @assert value argument is not undefined or null and is a {@link Boolean}.
     */
    setGroupingUsed : function (value) {
        $assert(js.lang.Types.isBoolean(value), 'js.format.NumberFormat#setGroupingUsed', 'Value is not boolean.');
        this._groupingUsed = value;
        return this;
    },

    /**
     * Sets the minimum number of digits allowed in the fraction portion of a number. minimumFractionDigits must be <=
     * maximumFractionDigits. If the new value for minimumFractionDigits exceeds the current value of
     * maximumFractionDigits, then maximumIntegerDigits will also be set to the new value.
     * 
     * @param Number value the minimum number of fraction digits to be shown.
     * @return js.format.NumberFormat this object.
     * @assert value argument is not undefined or null and is a {@link Number}.
     */
    setMinimumFractionDigits : function (value) {
        $assert(js.lang.Types.isNumber(value), 'js.format.NumberFormat#setMinimumFractionDigits', 'Value is not a number.');
        this._minimumFractionDigits = value;
        if (this._minimumFractionDigits > this._maximumFractionDigits) {
            this._maximumFractionDigits = this._minimumFractionDigits;
        }
        return this;
    },

    /**
     * 
     * @param Number value
     * @return js.format.NumberFormat this object.
     * @assert value argument is not undefined or null and is a {@link Number}.
     */
    setMaximumFractionDigits : function (value) {
        $assert(js.lang.Types.isNumber(value), 'js.format.NumberFormat#setMaximumFractionDigits', 'Value is not a number.');
        this._maximumFractionDigits = value;
        if (this._maximumFractionDigits < this._minimumFractionDigits) {
            this._minimumFractionDigits = this._maximumFractionDigits;
        }
        return this;
    },

    /**
     * 
     * @param Number value
     * @return js.format.NumberFormat this object.
     * @assert value argument is not undefined or null and is a {@link Number}.
     */
    setMinimumIntegerDigits : function (value) {
        $assert(js.lang.Types.isNumber(value), 'js.format.NumberFormat#setMinimumIntegerDigits', 'Value is not a number.');
        this._minimumIntegerDigits = value;
        if (this._minimumIntegerDigits > this._maximumIntegerDigits) {
            this._maximumIntegerDigits = this._minimumIntegerDigits;
        }
        return this;
    },

    /**
     * 
     * @param Number value
     * @return js.format.NumberFormat this object.
     * @assert value argument is not undefined or null and is a {@link Number}.
     */
    setMaximumIntegerDigits : function (value) {
        $assert(js.lang.Types.isNumber(value), 'js.format.NumberFormat#setMaximumIntegerDigits', 'Value is not a number.');
        this._maximumIntegerDigits = value;
        if (this._maximumIntegerDigits < this._minimumIntegerDigits) {
            this._minimumIntegerDigits = this._maximumIntegerDigits;
        }
        return this;
    },

    /**
     * Format number.
     * 
     * @param Number number number to format.
     * @return String formatted number.
     */
    format : function (number) {
        var formattedNumber = this._formatNumericPart(number);
        return typeof this._pattern === 'undefined' ? formattedNumber : this._injectNumericPart(formattedNumber);
    },

    _formatNumericPart : function (number) {
        $assert(js.lang.Types.isNumber(number), 'js.format.NumberFormat#_formatNumericPart', 'Argument is not a number.');

        var value = number.toString();
        var parts = value.split('.');
        var integerPart = parts[0], i;
        var fractionalPart = parts.length > 1 ? parts[1] : '';

        if (fractionalPart.length > this._maximumFractionDigits) {
            if (this._maximumFractionDigits === 0) {
                integerPart = (Number(integerPart) + Math.round('0.' + fractionalPart)).toString();
                fractionalPart = '';
            }
            else {
                fractionalPart = this._round(fractionalPart, this._maximumFractionDigits);
                if (fractionalPart.length > this._maximumFractionDigits) {
                    fractionalPart = fractionalPart.substr(fractionalPart.length - this._maximumFractionDigits);
                    integerPart = (Number(integerPart) + 1).toString();
                }
            }
        }
        for (i = fractionalPart.length; i < this._minimumFractionDigits; ++i) {
            fractionalPart += '0';
        }

        for (i = integerPart.length; i < this._minimumIntegerDigits; ++i) {
            integerPart = '0' + integerPart;
        }
        if (integerPart.length > this._maximumIntegerDigits) {
            integerPart = this._round(integerPart, this._maximumIntegerDigits);
        }
        if (this._groupingUsed) {
            var rex = /(\d+)(\d{3})/;
            while (rex.test(integerPart)) {
                integerPart = integerPart.replace(rex, '$1' + this._groupingSeparator + '$2');
            }
        }

        value = integerPart;
        if (fractionalPart) {
            value += (this._decimalSeparator + fractionalPart);
        }
        return value;
    },

    /**
     * Parse numeric string. If given string is empty return 0 since is considered optional numeric value.
     * 
     * @param String string numeric string to parse.
     * @return Number number value extracted from given string.
     */
    parse : function (string) {
        if (string.length === 0) {
            return 0;
        }
        if (typeof this._pattern !== 'undefined') {
            string = this._extractNumericPart(string);
        }
        return this._parseNumericPart(string);
    },

    _parseNumericPart : function (string) {
        $assert(string, 'js.format.NumberFormat#_parseNumericPart', 'Argument is not a string.');
        if (!string) {
            return null;
        }
        if (this._groupingUsed) {
            var rex = new RegExp(js.util.Strings.escapeRegExp(this._groupingSeparator), 'g');
            string = string.replace(rex, '');
        }
        if (this._decimalSeparator !== '.') {
            string = string.replace(this._decimalSeparator, '.');
        }
        return Number(string);
    },

    /**
     * Check numeric string validity. If this number format has no pattern this method falls to
     * {@link #_testNumericPart}.
     * 
     * @param String text numeric string to check for validity.
     * @return Boolean true if given string is a valid numeric value.
     */
    test : function (text) {
        if (typeof this._pattern === 'undefined') {
            return this._testNumericPart(text);
        }

        var patternIndex = 0;
        var pattern = this._pattern;
        var textIndex = 0;
        var c;

        function skipNumericPart () {
            c = pattern.charAt(++patternIndex);
            while (textIndex < text.length && c !== text.charAt(textIndex)) {
                ++textIndex;
            }
            return textIndex;
        }

        for (; patternIndex < pattern.length; ++patternIndex, ++textIndex) {
            if (pattern.charAt(patternIndex) === '#') {
                if (!this._testNumericPart(text.substring(textIndex, skipNumericPart()))) {
                    return false;
                }
            }
            if (!js.util.Strings.equalsIgnoreCase(pattern.charAt(patternIndex), text.charAt(textIndex))) {
                return false;
            }
        }
        return true;
    },

    _testNumericPart : function (text) {
        if (!js.lang.Types.isString(text) || text.length === 0) {
            return false;
        }
        function isDigit (c) {
            return c >= '0' && c <= '9';
        }
        var i = 0;
        if (text.charAt(0) === '+' || text.charAt(0) === '-') {
            ++i;
        }
        for ( var c; i < text.length; ++i) {
            c = text.charAt(i);
            if (isDigit(c) || c === this._decimalSeparator) {
                continue;
            }
            if (this._groupingUsed && c === this._groupingSeparator) {
                continue;
            }
            return false;
        }
        return true;
    },

    /**
     * Inject numeric part. Inject formatted numeric part into this number format pattern and return resulted string.
     * 
     * @param String numericPart formatted numeric part.
     * @return String formatted pattern with numeric part injected.
     */
    _injectNumericPart : function (numericPart) {
        return this._pattern.replace('#', numericPart);
    },

    /**
     * Extract numeric part. Extract numeric part from given source string. Source should be formatted accordingly this
     * number format pattern. For example, assuming pattern is <em># LEI</em> and if given source is
     * <em>123,45 LEI</em> this method returns <em>123,45</em>.
     * 
     * @param String source source string.
     * @return String numeric part from given source string or null if pattern does not match.
     */
    _extractNumericPart : function (source) {
        $assert(this._validInput !== null, 'js.format.NumberFormat#_extractNumericPart', 'Invalid input.');
        this._validInput.lastIndex = 0;
        var m = this._validInput.exec(source);
        $assert(m !== null, 'js.format.NumberFormat#_extractNumericPart', 'Source does not match.');
        if (m == null) {
            return null;
        }
        $assert(typeof m[1] !== 'undefined', 'js.format.NumberFormat#_extractNumericPart', 'Source does not match.');
        if (typeof m[1] === "undefined") {
            return null;
        }
        return m[1];
    },

    _round : function (number, digitsCount) {
        if (digitsCount === 0) {
            return '';
        }
        var s = number.substr(0, digitsCount) + '.' + number.substr(digitsCount);
        s = Math.round(Number(s)).toString();
        while (s.length < digitsCount) {
            s = '0' + s;
        }
        return s;
    },

    _compile : function () {
        if (typeof this._pattern !== 'undefined') {
            var rex = '([0-9' + this._decimalSeparator + this._groupingSeparator + ']+)';
            this._validInput = new RegExp('^' + js.util.Strings.escapeRegExp(this._pattern).replace('#', rex) + '$', 'g');
        }
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return 'js.format.NumberFormat';
    }
};
$extends(js.format.NumberFormat, Object);
$implements(js.format.NumberFormat, js.format.Format);

js.format.NumberFormat.En_US = {
    decimalSeparator : '.',
    groupingSeparator : ',',
    infinity : 'infinity'
};

js.format.NumberFormat.De_CH = {
    decimalSeparator : '\'',
    groupingSeparator : '.',
    infinity : 'unendlich'
};

js.format.NumberFormat.Ro_RO = {
    decimalSeparator : ',',
    groupingSeparator : '.',
    infinity : 'infinit'
};
$package('js.format');

js.format.Percent = function () {
    var l = js.ua.Regional.language;
    var c = js.ua.Regional.country;
    var key = l.charAt(0).toUpperCase() + l.charAt(1) + '_' + c;

    var symbols = js.format.Percent[key];
    if (typeof symbols === 'undefined') {
        symbols = js.format.Percent.En_US;
    }

    /**
     * Number format. Used to handle numeric part of this currency format instance.
     * 
     * @type js.format.NumberFormat
     */
    this._numberFormat = new js.format.NumberFormat(symbols.pattern);
    this._numberFormat.setGroupingUsed(true);
    this._numberFormat.setMinimumFractionDigits(2);
    this._numberFormat.setMaximumFractionDigits(2);
};

js.format.Percent.prototype = {
    format : function (percent) {
        $assert(js.lang.Types.isNumber(percent), 'js.format.Percent#format', 'Percent is not a number.');
        return this._numberFormat.format(100 * percent);
    },

    /**
     * 
     * @param String string
     */
    parse : function (string) {
        return this._numberFormat.parse(string) / 100;
    },

    test : function (string) {
        return this._numberFormat.test(string);
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return 'js.format.Percent';
    }
};
$extends(js.format.Percent, Object);
$implements(js.format.Percent, js.format.Format);

/**
 * United States english percent configuration.
 */
js.format.Percent.En_US = {
    pattern : '#%'
};

/**
 * Romanian percent configuration.
 */
js.format.Percent.Ro_RO = {
    pattern : '#%'
};
$package('js.format');

js.format.ShortDate = function() {
    this.$super(js.format.DateFormat.getDateInstance(js.format.DateFormat.SHORT));
};
$extends(js.format.ShortDate, js.format.AbstractDateTime);
$package('js.format');

js.format.ShortDateTime = function() {
    this.$super(js.format.DateFormat.getDateTimeInstance(js.format.DateFormat.SHORT, js.format.DateFormat.SHORT));
};
$extends(js.format.ShortDateTime, js.format.AbstractDateTime);
$package('js.format');

js.format.ShortTime = function() {
    this.$super(js.format.DateFormat.getTimeInstance(js.format.DateFormat.SHORT));
};
$extends(js.format.ShortTime, js.format.AbstractDateTime);
$package('js.format');

js.format.StandardDate = function() {
    this.$super(new js.format.DateFormat("yyyy-MM-dd"));
};
$extends(js.format.StandardDate, js.format.AbstractDateTime);
$package('js.format');

js.format.StandardDateTime = function() {
    this.$super(new js.format.DateFormat("yyyy-MM-dd HH:mm:ss"));
};
$extends(js.format.StandardDateTime, js.format.AbstractDateTime);
$package('js.format');

js.format.StandardTime = function() {
    this.$super(new js.format.DateFormat("HH:mm:ss"));
};
$extends(js.format.StandardTime, js.format.AbstractDateTime);
$package('js.fx');

/**
 * Animation instance. Animation is simply a collection of effects executed concurrently or sequential. Every effect
 * changes an {@link js.dom.Element} style from a starting to and ending value; for more details about animation
 * properties see {@link js.fx.Descriptor}. A classic use case is to create animation object giving effects descriptors
 * to constructor and start it when consider appropriate, like in snippet below:
 * 
 * <pre>
 * var anim = new js.fx.Anim({
 * 	el : image,
 * 	style : 'opacity',
 * 	from : 1,
 * 	to : 0
 * });
 * anim.start();
 * </pre>
 * 
 * @constructor Construct animation object. Create and store effect instances for every given descriptor; uses sensible
 *              default value for descriptor missing properties.
 * 
 * @param js.fx.Descriptor... descriptors
 * @assert there is at least one descriptor argument.
 */
js.fx.Anim = function () {
    $assert(arguments.length >= 1, 'js.fx.Anim#Anim', 'Missing descriptors.');
    var i, descriptor, defaultProperties, property;

    /**
     * This animation effects queue.
     * 
     * @type Array
     */
    this._fxs = [];

    defaultProperties = {};
    for (i = 0; i < arguments.length; i++) {
        descriptor = arguments[i];
        $assert(descriptor, 'js.fx.Anim#Anim', 'Descriptor object is undefined or null.');
        if (descriptor.defaultProperties) {
            delete descriptor.defaultProperties;
            defaultProperties = descriptor;
            continue;
        }
        if (typeof descriptor.at !== "undefined") {
            continue;
        }

        for (property in defaultProperties) {
            if (typeof descriptor[property] === "undefined") {
                descriptor[property] = defaultProperties[property];
            }
        }
        $assert(descriptor.el, 'js.fx.Anim#Anim', 'Descriptor <element> is undefined or null.');
        $assert(descriptor.style, 'js.fx.Anim#Anim', 'Descriptor <style> is undefined or null.');
        $assert(typeof descriptor.from !== 'undefined' && descriptor.from !== null, 'js.fx.Anim#Anim', 'Descriptor <from> is undefined or null.');
        $assert(typeof descriptor.to !== 'undefined' && descriptor.to !== null, 'js.fx.Anim#Anim', 'Descriptor <to> is undefined or null.');

        this._fxs.push(new js.fx.Effect(descriptor));
    }

    /**
     * Callback for animation frame request. This constant is in fact {@link #_render} method bound to this instance.
     * 
     * @type Function
     */
    this._FRAME_REQUEST_CALLBACK = this._render.bind(this);

    /**
     * Animation frame request ID. It has not null value only while animation is running.
     * 
     * @type Number
     */
    this._animationFrameRequestId = null;

    /**
     * Animation start timestamp. This value marks the moment animation started as number of milliseconds from
     * navigation start. It has an accuracy of thousandth of a millisecond and has not null value only while animation
     * is running.
     * 
     * @type DOMHighResTimeStamp
     */
    this._startTimestamp = null;

    /**
     * Custom events. Current implementation supports only one event type, namely <em>anim-stop</em>; it has no
     * parameters.
     * 
     * @type js.event.CustomEvents
     */
    this._events = new js.event.CustomEvents();
    this._events.register("anim-stop");
};

js.fx.Anim.prototype = {
    /**
     * Add event listener.
     * 
     * @param String type custom event type,
     * @param Function listener event listener to register,
     * @param Object... scope optional listener run-time scope, default to global scope.
     * @return js.fx.Anim this object.
     */
    on : function (type, listener, scope) {
        this._events.addListener(type, listener, scope || window);
        return this;
    },

    /**
     * Remove event listener.
     * 
     * @param String type custom event type,
     * @param Function listener event listener to remove,
     * @return js.fx.Anim this object.
     */
    un : function (type, listener) {
        this._events.removeListener(type, listener);
        return this;
    },

    /**
     * Start animation. Set all this animation effects to running state and request for animation frame. This is the
     * kicking point; rendering logic will keep requesting additional animation frames as time there are running
     * effect(s).
     */
    start : function () {
        this._fxs.forEach(function (fx) {
            fx.running = true;
        });
        this._startTimestamp = null;
        this._animationFrameRequestId = this._requestAnimationFrame(this._FRAME_REQUEST_CALLBACK);
    },

    /**
     * Stop animation. Force all this animation effects running state to false and cancel pending animation frame
     * request, if any. This method is here for completion; is not expected to be used too often.
     */
    stop : function () {
        if (this._animationFrameRequestId !== null) {
            this._fxs.forEach(function (fx) {
                fx.running = false;
            });
            if (this._animationFrameRequestId !== null) {
                this._cancelAnimationFrame(this._animationFrameRequestId);
            }
            this._animationFrameRequestId = null;
        }
    },

    /**
     * Request from animation frame.
     * 
     * @param Function frameRequestCallback rendering logic implementation.
     */
    _requestAnimationFrame : function (frameRequestCallback) {
        return window.requestAnimationFrame(frameRequestCallback);
    },

    /**
     * Cancel previous registered animation frame request.
     * 
     * @param Number animationFrameRequestId ID returned by previous call to {@link _requestAnimationFrame}.
     */
    _cancelAnimationFrame : function (animationFrameRequestId) {
        window.cancelAnimationFrame(animationFrameRequestId);
    },

    /**
     * Render animation effects, active at this particular time stamp. This is animation engine core: for every
     * animation effect compute style value using transform function, depending on current time stamp. If relative time
     * stamp exceed duration effect running state is set to false; if there is at least one still running effect request
     * for a new animation frame. When all effect done fires <em>anim-stop</em> event.
     * 
     * @param Number timestamp current time stamp.
     */
    _render : function (timestamp) {
        var runningFxs;

        if (this._startTimestamp == null) {
            this._startTimestamp = timestamp;
        }
        timestamp -= this._startTimestamp;

        runningFxs = 0;
        this._fxs.forEach(function (fx) {
            var t, value;
            if (!fx.running) {
                return;
            }

            t = timestamp - fx.offset;
            if (t < 0) {
                return;
            }
            value = Math.round(fx.ttf(t, fx.origin, fx.magnitude, fx.duration));
            fx.el.style.set(fx.style, value + fx.units);
            if (t > fx.duration) {
                fx.running = false;
            }
            else {
                runningFxs++;
            }
        }, this);

        if (runningFxs > 0) {
            this._requestAnimationFrame(this._FRAME_REQUEST_CALLBACK);
            return;
        }

        // ensure every effect reach final value to cope with frame loss
        this._fxs.forEach(function (fx) {
            fx.el.style.set(fx.style, (fx.magnitude + fx.origin) + fx.units);
        });
        this._events.fire("anim-stop");
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return 'js.fx.Anim';
    }
};
$extends(js.fx.Anim, Object);

$legacy(typeof window.requestAnimationFrame !== "function", function () {
    if (typeof webkitRequestAnimationFrame === "function") {
        js.fx.Anim.prototype._requestAnimationFrame = function (frameRequestCallback) {
            return window.webkitRequestAnimationFrame(frameRequestCallback);
        };

        js.fx.Anim._cancelAnimationFrame = function (animationFrameRequestId) {
            window.webkitCancelAnimationFrame(animationFrameRequestId);
        };
    }
    else {
        js.fx.Anim.prototype._requestAnimationFrame = function (callback) {
            // since we are in degraded mode uses only 30 FPS
            return window.setTimeout(function () {
                callback(new Date().getTime() - js.lang.Operator._timestamp);
            }, 33);
        };

        js.fx.Anim._cancelAnimationFrame = function (timeoutId) {
            window.clearTimeout(timeoutId);
        };
    }
});
$package('js.fx');

/**
 * Animation global properties.
 */
js.fx.Config = {
    /**
     * Styles with values measured in pixels. Used by engine to add units to style value, if necessary.
     * 
     * @type RexExp
     */
    PX_UNITS : /width|height|top|bottom|left|right|margin|marginTop|marginRight|marginBottom|marginLeft|padding|paddingTop|paddingRight|paddingBottom|paddingLeft/i,

    /**
     * Default effect duration. Used whenever animation duration is not explicitly configured.
     * 
     * @type Number
     */
    DEF_DURATION : 1000
};
$package('js.fx');

/**
 * Animation effect descriptor. An effect is the transition of an {@link js.dom.Element} style from a starting value to
 * an ending one, lasting for certain amount of time. Every effect has a temporal transfer function that controls style
 * value evolution over the time. Note that only style with numerical value are supported.
 */
js.fx.Descriptor = {
	/**
	 * Element on with effect is applied.
	 * 
	 * @type js.dom.Element
	 */
	el : null,

	/**
	 * Offset in milliseconds. This is the delay transition actually start, allowing for multiple effects executed
	 * concurrently or sequential, depending on the value of this offset. Defaults to 0.
	 * 
	 * @type Number
	 */
	offset : null,

	/**
	 * Effect duration, in milliseconds. Default to 1000, that is, a second.
	 * 
	 * @type Number
	 */
	duration : null,

	/**
	 * Element style, subject of this effect. Only styles with numerical value are supported.
	 * 
	 * @type String
	 */
	style : null,

	/**
	 * Style value measurement units. If missing uses pixels for styles declared in {@link js.fx.Config PX_UNITS}.
	 * 
	 * @type String
	 */
	units : null,

	/**
	 * Style starting value.
	 * 
	 * @type Number
	 */
	from : null,

	/**
	 * Style ending value.
	 * 
	 * @type Number
	 */
	to : null,

	/**
	 * Temporal transfer function, default to {@link js.fx.TTF.Linear}. This function controls the element style value
	 * changes over the time.
	 * 
	 * @type js.fx.TTF
	 */
	ttf : null
};
$package("js.fx");

/**
 * Animation effect runtime structure. An effect is animation atom: it is a change in an element style from a start to
 * an end value, occurring in a given time interval. This class encapsulates data needed to run an effect. Effect
 * instance is updated by animation engine and is not meant to be reusable.
 * 
 * @constructor Create animation effect instance from given animation descriptor. Takes care to set proper default
 *              values for those not supplied by user code, via descriptor, as follows:
 *              <ul>
 *              <li>0 for offset,
 *              <li>{@link js.fx.Config DEF_DURATION} for duration,
 *              <li>{@link js.fx.TTF.Linear} for transform functions,
 *              <li><em>px</em> for units, if style qualifies, or empty.
 *              </ul>
 *              The rest of properties are mandatory and assert is rose if descriptor miss to include them:
 *              <em>element</em>, <em>style</em>, <em>from</em> and <em>to</em> values.
 * @param js.fx.Descriptor descriptor effect descriptor.
 * @assert mandatory properties are present on descriptor argument and start and end values are not equals.
 */
js.fx.Effect = function (descriptor) {
    $assert(js.lang.Types.isElement(descriptor.el), "js.fx.Effect#Effect", "Element argument is not a valid j(s)-lib element.");
    $assert(js.lang.Types.isString(descriptor.style), "js.fx.Effect#Effect", "Style argument should be a not empty string.");
    $assert(js.lang.Types.isNumber(descriptor.from), "js.fx.Effect#Effect", "Not numeric start value.");
    $assert(js.lang.Types.isNumber(descriptor.to), "js.fx.Effect#Effect", "Not numeric end value.");
    $assert(descriptor.from !== descriptor.to, "js.fx.Effect#Effect", "Same value for start and end.");

    /**
     * Flag to indicate effect running state. Initial value is false.
     * 
     * @type Boolean
     */
    this.running = false;

    /**
     * Time interval from animation start with which effect start is delayed, measured in milliseconds. Default value is
     * 0.
     * 
     * @type Number
     */
    this.offset = descriptor.offset || 0;

    /**
     * Effect duration, in milliseconds. Default value is {@link js.fx.Config DEF_DURATION}.
     * 
     * @type Number
     */
    this.duration = descriptor.duration || js.fx.Config.DEF_DURATION;

    /**
     * Temporal transfer function, default to {@link js.fx.TTF.Linear}. This function controls the element style value
     * changes over the time.
     * 
     * @type js.fx.TTF
     */
    this.ttf = descriptor.ttf || js.fx.TTF.Linear;

    /**
     * Element style, subject of this effect. Only styles with numerical value are supported.
     * 
     * @type String
     */
    this.style = descriptor.style;

    /**
     * Style value measurement units. If missing uses pixels for styles declared in {@link js.fx.Config PX_UNITS}.
     * 
     * @type String
     */
    this.units = descriptor.units || (js.fx.Config.PX_UNITS.test(this.style) ? 'px' : '');

    /**
     * Effect origin, that is, initial value.
     * 
     * @type Number
     */
    this.origin = descriptor.from;

    /**
     * Effect magnitude is the difference between end and start values. It can be both positive or negative but not
     * zero.
     * 
     * @type Number
     */
    this.magnitude = descriptor.to - descriptor.from;

    /**
     * Element on with effect is applied.
     * 
     * @type js.dom.Element
     */
    this.el = descriptor.el;
};
$extends(js.fx.Effect, Object);
$package('js.fx');

/**
 * Temporal transform functions.
 * 
 * All TTF has the same formal parameters and return value:
 * 
 * <pre>
 *  Number ttf(Number timestamp, Number origin, Number magnitude, Number duration);
 * </pre>
 * 
 * where: <em>timestamp</em> is current time stamp value, that is, temporal reference, <em>origin</em> element style
 * initial value, <em>magnitude</em> element style start and end delta value and <em>duration</em> effect duration.
 * Returns the computed value dependent on timestamp but pondered by the other arguments.
 */
js.fx.TTF = {};

/**
 * Linear transform. Computed value varies proportional with timestamp value, that is, variation speed is constant.
 * 
 * @constructor
 * @param Number timestamp current time stamp value, that is, temporal reference,
 * @param Number origin element style initial value,
 * @param Number magnitude element style start and end delta value,
 * @param Number duration effect effective duration.
 */
js.fx.TTF.Linear = function (timestamp, origin, magnitude, duration) {
    var tgalpha = magnitude / duration;
    return origin + tgalpha * timestamp;
};
$extends(js.fx.TTF.Linear, Object);

/**
 * Exponential transform. Start slowly and accelerates to the effect end.
 * 
 * @constructor
 * @param Number timestamp current time stamp value, that is, temporal reference,
 * @param Number origin element style initial value,
 * @param Number magnitude element style start and end delta value,
 * @param Number duration effect effective duration.
 */
js.fx.TTF.Exponential = function (timestamp, origin, magnitude, duration) {
    timestamp /= duration;
    return origin + magnitude * timestamp * timestamp;
};
$extends(js.fx.TTF.Exponential, Object);

/**
 * Logarithmic transform. Start with great speed and decrease to 0 to effect end.
 * 
 * @constructor
 * @param Number timestamp current time stamp value, that is, temporal reference,
 * @param Number origin element style initial value,
 * @param Number magnitude element style start and end delta value,
 * @param Number duration effect effective duration.
 */
js.fx.TTF.Logarithmic = function (timestamp, origin, magnitude, duration) {
    return origin - magnitude * (timestamp /= duration) * (timestamp - 2);
};
$extends(js.fx.TTF.Logarithmic, Object);

/**
 * Swing transform. This is a cyclic transformation, repeated four times. It generates a sinusoidal path but with
 * decreasing amplitude.
 * 
 * @constructor
 * @param Number timestamp current time stamp value, that is, temporal reference,
 * @param Number origin element style initial value,
 * @param Number magnitude element style start and end delta value,
 * @param Number duration effect effective duration.
 */
js.fx.TTF.Swing = function (timestamp, origin, magnitude, duration) {
    var CYCLES = 4;
    var radians = CYCLES * 2 * Math.PI;
    var deltaR = radians / duration;
    var deltaM = magnitude / duration;
    return origin - Math.sin(timestamp * deltaR) * (magnitude - timestamp * deltaM);
};
$extends(js.fx.TTF.Swing, Object);
$package('js.lang');

/**
 * Assertion exception. Thrown on a failing assertion.
 *
 * @constructor
 * Construct assertion exception.
 *
 * @param String message
 */
js.lang.AssertException = function() {
    $assert(this instanceof js.lang.AssertException, 'js.lang.AssertException#AssertException', 'Invoked as function.');
    this.$super(arguments);

    /**
     * Exception name.
     * @type String
     */
    this.name = 'j(s)-lib assertion';
};

js.lang.AssertException.prototype =
{
    /**
     * Returns a string representation of the object.
     *
     * @return String object string representation.
     */
    toString: function() {
        return 'js.lang.AssertException';
    }
};
$extends(js.lang.AssertException, js.lang.Exception);
$package("js.lang");

/**
 * Class utility.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 */
js.lang.Class = {
	/**
	 * Server side script class loader request URI.
	 * 
	 * @type String
	 */
	_CLASS_LOADER_URL : "js/core/JsClassLoader/loadClass.rmi",

	/**
	 * Loaded classes cache.
	 * 
	 * @type Object
	 */
	_cache : {},

	/**
	 * Returns the named class.
	 * 
	 * @param String className qualified class name.
	 * @return Function named class or null.
	 * @assert class name is not undefined, null or empty and is a {@link String}.
	 */
	forName : function(className) {
		$assert(className, "js.lang.Class#forName", "Undefined, null or empty class name.");
		$assert(js.lang.Types.isString(className), "js.lang.Class#forName", "Expected string but got %s.", js.lang.Types.getTypeName(className));

		var clazz = this._cache[className];
		if (typeof clazz !== "undefined") {
			return clazz;
		}

		try {
			clazz = eval(className);
			// if package exists but class from package is missing class is undefined
		} catch (er) {
			// because evaluation works on a well formed class name and only tries
			// to get a reference - i.e. does not execute any code, there is no
			// reason for exception beside not found, which is proceeded below
		}
		if (typeof clazz === "undefined") {
			$debug("js.lang.Class#forName", "Class %s not found. Try to load it from server.", className);
			clazz = this._loadClass(className);
		}
		this._cache[className] = clazz;
		return clazz;
	},

	/**
	 * Load class from server.
	 * 
	 * @param String className class name.
	 * @return Function loaded classes or null.
	 */
	_loadClass : function(className) {
		// do not use js.net package in order to avoid circular dependencies
		var xhr = new XMLHttpRequest();

		xhr.open("POST", this._CLASS_LOADER_URL, false);
		xhr.timeout = 4000;
		xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
		xhr.setRequestHeader("Accept", "text/javascript");

		try {
			xhr.send(js.lang.JSON.stringify(className));
			// we do not need sanity check since script comes from the same domain
			eval(xhr.responseText);
			return eval(className);
		} catch (er) {
			$error("js.lang.Class#loadClass", er);
		}
		return null;
	},

	/**
	 * Get class resource. Load named resources for class identified by its qualified name.
	 * 
	 * @param String className qualified class name,
	 * @param String resourceName resource name to retrieve.
	 * @return Object resource instance.
	 */
	getResource : function(className, resourceName) {

	},

	/**
	 * Returns a string representation of the object.
	 * 
	 * @return String object string representation.
	 */
	toString : function() {
		return "js.lang.Class";
	}
};
$package('js.lang');

/**
 * JSON support. Extend native JSON object with support for {@link Date} object de-serialization.
 */
js.lang.JSON = {
    /**
     * Parse JSON constructs. This parser method accepts a string that conform with JSON grammar and produce a value.
     * 
     * @param String json string containing JSON constructs needed to be parsed.
     * @return Object value described by given <em>json</em> string.
     * @assert <em>json</em> argument is not undefined, null or empty.
     */
    parse : function (json) {
        $assert(json, 'js.lang.JSON#parse', 'JSON string is undefined, null or empty.');
        return JSON.parse(json, function (key, value) {
            if (js.lang.Types.isString(value)) {
                var d = js.lang.JSON._json2date(value);
                if (d !== null) {
                    return d;
                }
            }
            return value;
        });
    },

    /**
     * Serialize a given value to a string in JSON format. Value to stringify is usually an {@link Object} or
     * {@link Array} but it can also be a {@link String}, {@link Boolean}, {@link Number} or null. Note that
     * accordingly JSON specifications strings are double quoted. So, if one uses this method to stringify a date - that
     * is converted to a string, should take care to remove quotations.
     * 
     * @param Object value object to be serialized as JSON
     * @return String a string in JSON format representing given value.
     * @assert <em>value</em> argument is not undefined.
     */
    stringify : function (value) {
        $assert(typeof value !== 'undefined', 'js.lang.JSON#stringify', 'Value is undefined.');
        return JSON.stringify(value);
    },

    /**
     * Regular expression describing the date format. It is based on ISO8601 date representation; e.g.
     * 1964-03-15T13:40:00.000Z
     * 
     * @type RegExp
     */
    _REX_DATE : /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{3}))?Z$/i,

    /**
     * Convert a ISO8601 date string into a {@link Date} object. j(s)-lib uses that format for conveying dates instances
     * between server and client. This method is used by {@link #parse} reviver to convert date strings.
     * 
     * @param String json date represented as a string in ISO8601 format.
     * @return Date date object initialized from given string representation.
     */
    _json2date : function (json) {
        // if given argument is not a valid json date it can have arbitrary length, including large
        // i'm pretty sure regexp#match is smart enough to quickly exit and i do not filter json argument by length

        this._REX_DATE.lastIndex = 0;
        var m = json.match(this._REX_DATE);
        if (m == null) {
            return null;
        }
        if (typeof m[7] === 'undefined') {
            // WebKit and Presto doesn't use milliseconds while Trident and Gecko does
            // defaults milliseconds to zero if missing
            m[7] = 0;
        }
        m.shift(); // m[0] is matched string, i.e. the ISO8601 date representation
        m[1] -= 1; // convert month ordinal into index

        // serialized JSON date is UTC date, that why ends with 'Z'
        // first uses Date#UTC to get the UTC time - number of milliseconds from epoch
        // then create a local date instance
        // so, if UTC time is 0 create date instance if Thu Jan 01 1970 02:00:00 GMT+0200, in my case
        return new Date(Date.UTC.apply(Date.UTC, m));
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return 'js.lang.JSON';
    }
};

$legacy(js.ua.Engine.TRIDENT, function () {
    Date.prototype.toJSON = function () {
        function f (n) {
            return n < 10 ? '0' + n : n;
        }
        return this.getUTCFullYear() + '-' + f(this.getUTCMonth() + 1) + '-' + f(this.getUTCDate()) + 'T' + f(this.getUTCHours()) + ':' + f(this.getUTCMinutes()) + ':' + f(this.getUTCSeconds()) + 'Z';
    };
});
$package('js.lang');

/**
 * No operation function. This is not only a fancy name, it allows for reusing of the same no operation anonymous
 * function.
 */
js.lang.NOP = function () {
};
$extends(js.lang.NOP, Object);
$package("js.lang");

/**
 * Handle properties for objects with not restricted complex graph. This utility class store or retrieve values to/from
 * objects. Using this class is straightforward: just invoke this utility {@link #get(Object, String) getter} or
 * {@link #set(Object, String, Object) setter}, as in sample code. First statement retrieve car second wheel pressure,
 * the second set engine first torque to 456. For details see methods description.
 * 
 * <pre>
 *  var pressure = js.lang.OPP.get(car, "wheels.1.pressure");
 *  js.lang.OPP.set(car, "engine.specs.torque.0", 456);
 * </pre>
 * 
 * At its core this class uses object property path abstraction, for short OPP. Basically, an object is considered as a
 * graph of value properties and OPP is the path to specific property; a value property is a primitive, that is, is not
 * an {@link Object} or an {@link Array}. An example may help:
 * 
 * <pre>
 *  var car = {
 *      model: 'Corsa 1.2',
 *      engine: {
 *          model: 'ECO',
 *          specs : {
 *              capacity : 1200,
 *              torque : [ 495, 656 ]
 *          }
 *      }
 *      wheels:[ {
 *              pressure: 1.2,
 *              radial: 14
 *          },  {
 *              pressure: 1.4,
 *              radial: 16
 *          }
 *      ]
 *  };
 * </pre>
 * 
 * Being above <code>car</code> object, the table below lists object property paths and related values. OPP is
 * hierarchical, following object structure. It is composed from all encountered property names separated by dot; for
 * arrays property name is the index. <table>
 * <tr>
 * <td><b>model
 * <td>Corsa 1.2
 * <tr>
 * <td><b>engine.model
 * <td>ECO
 * <tr>
 * <td><b>engine.specs.capacity
 * <td>1200
 * <tr>
 * <td><b>engine.specs.torque.0
 * <td>495
 * <tr>
 * <td><b>engine.specs.torque.1
 * <td>656
 * <tr>
 * <td><b>wheels.0.pressure
 * <td>1.2
 * <tr>
 * <td><b>wheels.0.radial
 * <td>14
 * <tr>
 * <td><b>wheels.1.pressure
 * <td>1.4
 * <tr>
 * <td><b>wheels.1.radial
 * <td>1.6 </table>
 */
js.lang.OPP = {
    /**
     * Get object property value. Return the value of object property identified by given object property path. Return
     * undefined if property not found; note that null is a valid value. Usually returned value is a terminal one, that
     * is, object tree leaf; anyway, if OPP is not full a sub-object can be returned.
     * 
     * @param Object obj object of which property value is to retrieve,
     * @param String opp object property path.
     * @return Object object property value or undefined.
     */
    get : function (obj, opp) {
        return this._get(obj, opp.split("."), 0);
    },

    /**
     * Helper for value getter. This method is the workhorse for {@link #get(Object, String)}. It uses OPP represented
     * as an array and traverse it recursively till completion. If, at some point, a path components is not found breaks
     * iteration prematurely returning undefined.
     * 
     * @param Object obj object of which property value to retrieve,
     * @param Array opp object property path as an array,
     * @param Number i path component index.
     * @return Object object property value or undefined.
     * @assert object is valid and property path is an {@link Array}.
     */
    _get : function (obj, opp, i) {
        $assert(i === opp.length || js.lang.Types.isObject(obj), "js.lang.OPP#_get", "Invalid property. Expected Object but got primitive.");
        $assert(js.lang.Types.isArray(opp), "js.lang.OPP#_get", "OPP argument is not an array.");
        if (typeof obj !== "undefined" && obj !== null && i < opp.length) {
            obj = this._get(obj[opp[i++]], opp, i);
        }
        return obj;
    },

    /**
     * Set object property value. Set object property, creating it if missing. Anyway, this method creates only terminal
     * object, that is, property designated by given full OPP. All other objects from path should exist, even empty.
     * This method just convert OPP into array and delegates {@link #_set} method for real work.
     * 
     * @param Object obj object to set property value to,
     * @param String opp object property path,
     * @param Object value value to set.
     * @assert see {@link #_set} assertions.
     */
    set : function (obj, opp, value) {
        this._set(obj, opp.split("."), 0, value);
    },

    /**
     * Helper for value setter. This method is delegated by {@link #set} method. It uses OPP represented as an array and
     * traverse it recursively till completion. Once the end of property path is reached just set the given value,
     * creating the property is missing.
     * <p>
     * Anyway, if a path component denotes an undefined or null property breaks iteration prematurely and rise
     * assertion. If assertion is disabled this method silently does nothing. In both cases target object is not
     * altered.
     * 
     * @param Object obj object to set value to,
     * @param Array opp object property path as an array,
     * @param Number i path component index,
     * @param Object value value to set.
     * @assert object is valid, property path argument is an {@link Array} and value is defined.
     */
    _set : function (obj, opp, i, value) {
        $assert(typeof obj === "object", "js.lang.OPP#_set", "Target object is undefined or not of Object type.");
        $assert(js.lang.Types.isArray(opp), "js.lang.OPP#_set", "OPP is not an array.");
        $assert(typeof value !== "undefined", "js.lang.OPP#_set", "Value is undefined.");

        // iterate till OPP right most element
        if (i === opp.length - 1) {
            obj[opp[i]] = value;
            return;
        }

        obj = obj[opp[i]];
        $assert(obj !== null && typeof obj === "object", "js.lang.OPP#_set", "Path component |%d| from |%s| points to undefined, null or not Object type.", i, opp.join('.'));
        if (obj == null || typeof obj !== "object") {
            return;
        }
        ++i;
        obj = this._set(obj, opp, i, value);
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.lang.OPP";
    }
};
$package("js.lang");

/**
 * Universal iterator. Offers unique interface for single and aggregated values. Iterates over any kind of values:
 * primitive, {@link Object}, {@link Array} or {@link NodeList}.
 * 
 * <pre>
 * 	var value; // undefined, null, primitive, Object, Array or NodeList
 *	var it = new js.lang.Uniterator(value);
 *	while(it.hasNext()) {
 *		// do something with it.next()
 *	}
 * </pre>
 * 
 * In above snippet there are couple conditions to mention:
 * <ul>
 * <li>undefined - single iteration with undefined value
 * <li>null - single iteration with null value
 * <li>primitive - single iteration with primitive value
 * <li>Object - single iteration with Object value
 * <li>Array - Array.length iterations with Array items values
 * <li>NodeList - NodeList.length iterations with NodeList items values
 * </ul>
 * 
 * <p>
 * Undefined values semantic is left to user code. j(s)-lib recommendation is to use undefined as a bug indicator, but
 * built-in array store and retrieve undefined as valid value. Uniterator follows Array behavior and iterates over
 * undefined values; for this reason never rely on {@link #next} to exit from iteration loop but use {@link #hasNext}
 * which is guaranteed to work properly even in the presence of undefined values.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * @constructor Construct universal iterator. Value argument is mandatory; it should be present, even if undefined.
 *              Anyway, if argument is missing created iterator is empty.
 * 
 * @param Object value value to iterate over.
 * @assert argument is present, even if undefined.
 */
js.lang.Uniterator = function (value) {
    $assert(this instanceof js.lang.Uniterator, "js.lang.Uniterator#Uniterator", "Invoked as function.");
    $assert(arguments.length === 1, "js.lang.Uniterator#Uniterator", "Missing argument.");
    if (arguments.length !== 1) {
        value = js.lang.Uniterator._EMPTY_ARRAY;
    }
    else if (typeof value === "undefined") {
        value = js.lang.Uniterator._UNDEF_ARRAY;
    }
    else if (value == null) {
        value = js.lang.Uniterator._NULL_ARRAY;
    }
    else if (js.lang.Types.isFunction(value.it)) {
        return value.it();
    }

    if (!js.lang.Types.isNodeList(value)) {
        if (!js.lang.Types.isArray(value)) {
            value = [ value ];
        }
        value.item = function (index) {
            return this[index];
        };
    }

    /**
     * Internal storage.
     * 
     * @type Object
     */
    this._items = value;

    /**
     * Current item index.
     * 
     * @type Number
     */
    this._index = 0;
};

/**
 * Empty array. Array with no items, i.e. zero length.
 * 
 * @type Array
 */
js.lang.Uniterator._EMPTY_ARRAY = [];

/**
 * Undefined array. Array with a single, undefined item.
 * 
 * @type Array
 */
js.lang.Uniterator._UNDEF_ARRAY = [ undefined ];

/**
 * Null array. Array with a single, null item.
 * 
 * @type Array
 */
js.lang.Uniterator._NULL_ARRAY = [ null ];

js.lang.Uniterator.prototype = {
    /**
     * Returns true if the iteration has more elements. Always test for iteration end before invoking {@link #next},
     * which may return undefined, null, zero or even boolean false as valid values.
     * <p>
     * This predicate has no side effects so is legal to call it many times for a given iteration.
     * 
     * @return Boolean true if the iterator has more elements.
     */
    hasNext : function () {
        return this._index < this._items.length;
    },

    /**
     * Returns the next element in the iteration. Always call this method after testing for iteration out of range with
     * {@link #hasNext}. Failing to do so yields not specified results, most probably undefined.
     * 
     * @return Object the next element in the iteration.
     * @assert iteration index is not out of range.
     */
    next : function () {
        $assert(this._index < this._items.length, "js.lang.Uniterator#next", "Iteration out of range.");
        return this._items.item(this._index++);
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.lang.Uniterator";
    }
};
$extends(js.lang.Uniterator, Object);
$implements(js.lang.Uniterator, js.lang.Iterator);
$package('js.net');

/**
 * HTTP request method. HTTP 1.1 defines nine methods, also referred to as <em>verbs</em>,
 * indicating the desired action to be performed on the identified resource. Anyway
 * j(s)-lib implementation does not uses CONNECT, TRACE and TRACK considered unsafe.
 *
 * @author Iulian Rotaru
 * @since 1.0
 */
js.net.Method =
{
    /**
     * The DELETE method requests that the origin server delete the resource identified
     * by the Request-URI.
     * @type String
     */
    DELETE: 'DELETE',

    /**
     * The GET method means retrieve whatever information (in the form of an entity)
     * is identified by the Request-URI.
     * @type String
     */
    GET: 'GET',

    /**
     * The HEAD method is identical to GET except that the server MUST NOT return
     * a message-body in the response.
     * @type String
     */
    HEAD: 'HEAD',

    /**
     * The OPTIONS method represents a request for information about the communication
     * options available on the request/response chain identified by the Request-URI.
     * @type String
     */
    OPTIONS: 'OPTIONS',

    /**
     * The POST method is used to request that the origin server accept the entity
     * enclosed in the request as a new subordinate of the resource identified by
     * the Request-URI in the Request-Line.
     * @type String
     */
    POST: 'POST',

    /**
     * The PUT method requests that the enclosed entity be stored under the supplied
     * Request-URI.
     * @type String
     */
    PUT: 'PUT'
};
$package('js.net');

/**
 * XMLHttpRequest ready state. These are possible states a built-in {@link XMLHttpRequest}
 * may have; is not related to {@link js.net.XHR} state.
 *
 * @author Iulian Rotaru
 * @since 1.0
 */
js.net.ReadyState =
{
    /**
     * The object has been constructed.
     * @type Number
     */
    UNSENT: 0,

    /**
     * The open method has been successfully invoked.
     * @type Number
     */
    OPENED: 1,

    /**
     * All redirects (if any) have been followed and all HTTP headers of the final response have been received.
     * @type Number
     */
    HEADERS_RECEIVED: 2,

    /**
     * The response entity body is being received.
     * @type Number
     */
    LOADING: 3,

    /**
     * The data transfer has been completed or something went wrong during the transfer.
     * @type Number
     */
    DONE: 4
};
$package("js.net");

/**
 * HTTP-RMI client. Invoke requested method on remote server. Remote class and method names should target and existing
 * server method declared as remote. Parameters are processed by position so their names is not important. Missing
 * parameters are send as null.
 * 
 * <pre>
 * var rmi = new js.net.RMI();
 * rmi.setMethod("comp.prj.Service", "remoteMethod");
 * rmi.setParameters(transactionID, remoteSpace);
 * rmi.exec(callback, scope);
 * </pre>
 * 
 * <p>
 * This class provides an error hook usable when special clean-up logic should be executed if RMI transaction fails. For
 * example it can be used to hide a progress or loading indicator as in snippet below. Please note that user defined
 * error handler got error message and is handler responsibility to display it, if desirable.
 * 
 * <pre>
 *  rmi.setErrorHandler(function(er) {
 *      loadingMessage.hide();
 *  }, this);
 * </pre>
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * @constructor Construct RMI transaction instance. This constructor allows for two optional arguments. First,
 *              <code>remoteContextURL</code> is used when this RMI instance is used cross domain, i.e. server is
 *              CORS. The second, <code>forceSynchronousMode</code> forces internal request transaction to work
 *              synchronously, if is true.
 *              <p>
 *              If no arguments supplied uses default values, that is, null for remote context URL and false for force
 *              synchronous mode. If a single argument, process it by type: remote context URL is a {@link String}
 *              whereas force synchronous mode is a {@link Boolean}; if two arguments process them by order.
 * @param String... remoteContextURL optional remote context URL for cross domain RMI, default to null,
 * @param Boolean... forceSynchronousMode force synchronous mode, optional, default to false.
 * @assert the number of arguments is at most two and are of proper types and order.
 */
js.net.RMI = function () {
    $assert(this instanceof js.net.RMI, "js.net.RMI#RMI", "Invoked as function.");

    /**
     * Remote context URL used when RMI is performed cross domain. It is initialized from optional constructor
     * arguments. Default to null.
     * 
     * @type String
     */
    this._remoteContextURL = null;

    /**
     * Force XHR synchronous mode flag. Initialized from optional constructor arguments. Default to false.
     * 
     * @type Boolean
     */
    this._forceSynchronousMode = false;

    if (arguments.length > 0) {
        if (arguments.length === 1) {
            if (js.lang.Types.isString(arguments[0])) {
                this._remoteContextURL = arguments[0];
            }
            else {
                $assert(js.lang.Types.isBoolean(arguments[0]), "js.net.RMI#RMI", "Invalid argument type |%s|. Expected String or Boolean.", typeof arguments[0]);
                this._forceSynchronousMode = arguments[0];
            }
        }
        else {
            $assert(arguments.length < 3, "js.net.RMI#RMI", "Invalid number of arguments |%d|.", arguments.length);

            $assert(js.lang.Types.isString(arguments[0]), "js.net.RMI#RMI", "Invalid remote context URL argument type |%s|.", typeof arguments[0]);
            this._remoteContextURL = arguments[0];

            $assert(js.lang.Types.isBoolean(arguments[1]), "js.net.RMI#RMI", "Invalid force synchronous mode argument type |%s|.", typeof arguments[1]);
            this._forceSynchronousMode = arguments[1];
        }
    }

    /**
     * Remote class name.
     * 
     * @type String
     */
    this._className = null;

    /**
     * Remote method name.
     * 
     * @type String
     */
    this._methodName = null;

    /**
     * Remote method parameter(s).
     * 
     * @type Object
     */
    this._parameters = null;

    /**
     * Callback function executed at RMI completion.
     * 
     * @type Function
     */
    this._callback = null;

    /**
     * Callback run-time execution scope.
     * 
     * @type Object
     */
    this._scope = null;

    /**
     * Callback function executed on RMI transaction error.
     * 
     * @type Function
     */
    this._errorHandler = null;

    /**
     * Error handler run-time execution scope.
     * 
     * @type Object
     */
    this._errorHandlerScope = null;

    /**
     * Server asynchronous request.
     * 
     * @type js.net.XHR
     */
    this._xhr = null;
};

/**
 * Local loop value.
 * 
 * @type Object
 */
js.net.RMI._loopValues = {};

/**
 * Activate local loop.
 * 
 * @param String remoteClass remote class name,
 * @param String remoteMethod remote method name,
 * @param Object value emulated return value.
 */
js.net.RMI.setLoop = function (remoteClass, remoteMethod, value) {
    this._loopValues[remoteClass + "$" + remoteMethod] = value;
};

/**
 * Remove local loop.
 * 
 * @param String remoteClass remote class name,
 * @param String remoteMethod remote method name.
 */
js.net.RMI.removeLoop = function (remoteClass, remoteMethod) {
    delete this._loopValues[remoteClass + "$" + remoteMethod];
};

/**
 * Loop state. Check if there is a configured local loop for given request.
 * 
 * @param js.net.RMI rmi RMI instance.
 * @return Boolean true if this request has local loop active.
 */
js.net.RMI._hasLoop = function (rmi) {
    return typeof this._loopValues[rmi._className + "$" + rmi._methodName] !== "undefined";
};

/**
 * Get local loop value. Return the loop value associated with given request or undefined if there is no configured.
 * 
 * @param js.net.RMI rmi RMI instance.
 * @return Object request loop value or undefined.
 */
js.net.RMI._getLoopValue = function (rmi) {
    return this._loopValues[rmi._className + "$" + rmi._methodName];
};

js.net.RMI.prototype = {
    /**
     * Set remote method. Every remote method belongs to a remote class so this setter actually sets both remote class
     * and its method. If any argument is undefined, null or empty this setter does nothing.
     * 
     * @param String className remote class name,
     * @param String methodName remote method name.
     * @return js.net.RMI this object.
     * @assert any argument is not undefined, null or empty and is a {@link String}.
     */
    setMethod : function (className, methodName) {
        $assert(className && js.lang.Types.isString(className), "js.net.RMI#setMethod", "Class name is undefined, null, empty or not a string.");
        $assert(methodName && js.lang.Types.isString(methodName), "js.net.RMI#setMethod", "Method name is undefined, null, empty or not a string.");
        if (className && methodName) {
            this._className = className;
            this._methodName = methodName;
        }
        return this;
    },

    /**
     * Set remote method parameter(s). Set one or more parameters for remote method. Note that parameters are processed
     * by position so this setter arguments order should respect remote method signature. Is not legal to call this
     * setter multiple times. Null value is accepted but undefined is considered bug indicator.
     * 
     * @param Object... parameters remote method parameter(s).
     * @return js.net.RMI this object.
     * @assert at least one argument is present and none is undefined.
     */
    setParameters : function (parameters) {
        $assert(arguments.length > 0, "js.net.RMI#setParameters", "Missing argument.");
        $assert(typeof parameters !== "undefined", "js.net.RMI#setParameters", "Undefined parameter(s).");
        if (typeof parameters === "undefined") {
            return this;
        }

        if (parameters !== null && typeof parameters.callee === "function") {
            var startIdx = arguments.length > 1 ? arguments[1] : 0;
            if (startIdx >= arguments[0].length) {
                return this;
            }
            var args = [];
            for ( var i = startIdx; i < arguments[0].length; i++) {
                args.push(arguments[0][i]);
            }
            this.setParameters.apply(this, args);
            return this;
        }

        // remote parameters are send using HTTP request message body encoded as JSON array
        // anyway, DOM documents and forms are special cases, they are encoded as XML or multipart
        // if last cases, parameters to send are actually an object but not an array
        if (arguments.length >= 1 && (arguments[0] instanceof js.dom.Document || arguments[0] instanceof js.dom.Form)) {
            this._parameters = arguments[0];
            return this;
        }

        this._parameters = [];
        for ( var i = 0; i < arguments.length; ++i) {
            $assert(typeof arguments[i] !== "undefined", "js.net.RMI#addParameter", "Argument is undefined.");
            if (typeof arguments[i] !== "undefined") {
                this._parameters.push(arguments[i]);
            }
        }
        return this;
    },

    /**
     * Set error handler executed if this RMI transaction fails.
     * 
     * @param Function errorHandler error handler,
     * @param Object... errorHandlerScope optional error handler execution scope, default to global scope.
     * @return js.net.RMI this object.
     * @assert <code>errorHandler</code> parameter is a {@link Function} and <code>scope</code> is an {@link Object},
     *         if present.
     */
    setErrorHandler : function (errorHandler, errorHandlerScope) {
        $assert(js.lang.Types.isFunction(errorHandler), "js.net.RMI#setErrorHandler", "Error handler parameter is not a function.");
        $assert(typeof errorHandlerScope === "undefined" || js.lang.Types.isObject(errorHandlerScope), "js.net.RMI#setErrorHandler", "Error handler scope parameter is not an object.");

        this._errorHandler = errorHandler;
        this._errorHandlerScope = errorHandlerScope;
        return this;
    },

    /**
     * Execute this RMI transaction.
     * 
     * @param Function... callback optional callback function, no default value,
     * @param Object... scope optional callback run-time execution scope, default to global scope.
     * @return Object remote value if synchronous mode or undefined.
     * @assert <code>callback</code> and <code>scope</code> parameters are or proper type, if exist.
     */
    exec : function (callback, scope) {
        $assert(typeof callback === "undefined" || js.lang.Types.isFunction(callback), "js.net.RMI#exec", "Callback parameter is not a function.");
        $assert(typeof scope === "undefined" || js.lang.Types.isObject(scope), "js.net.RMI#exec", "Scope parameter is not an object.");

        this._callback = callback;
        this._scope = scope || window;
        if (js.net.RMI._hasLoop(this)) {
            try {
                return this._onLoad(js.net.RMI._getLoopValue(this));
            } catch (er) {
                js.ua.System.error(er);
                return null;
            }
        }

        // class and method names are conveyed using HTTP request URI
        // so, "comp.prj.Class" and "method" becomes "comp/prj/Class/method.rmi"
        // if this RMI is performed cross domain insert remote context at url begin
        // in this case request URI may be: http://host/context/comp/prj/Class/method.rmi
        var requestURI = "";
        if (this._remoteContextURL !== null) {
            requestURI += this._remoteContextURL;
            requestURI += '/';
        }
        requestURI += (this._className.replace(/\./g, "/") + "/" + this._methodName + ".rmi");
        $debug("js.net.RMI#exec", "RMI call on %s(%s).", requestURI, this._parameters !== null ? this._parameters.toString() : "");

        this._xhr = new js.net.XHR();
        this._xhr.on("load", this._onLoad, this);
        if (this._errorHandler !== null) {
            this._xhr.on("error", this._errorHandler, this._errorHandlerScope || window);
        }
        this._xhr.open(js.net.Method.POST, requestURI, !this._forceSynchronousMode);
        var remoteValue = this._xhr.send(this._parameters);
        return this._forceSynchronousMode ? remoteValue : undefined;
    },

    /**
     * Server response handler.
     * 
     * @param Object value remote method return value.
     */
    _onLoad : function (value) {
        if (this._callback) {
            this._callback.call(this._scope, value);
        }
        this.finalize();
    },

    finalize : function () {
        delete this._callback;
        delete this._scope;
        delete this._xhr;
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.net.RMI";
    }
};
$extends(js.net.RMI, Object);
$package("js.net");

/**
 * Web socket.
 * <pre>
 *  var websocket = new js.net.WebSocket("ws://bbs/bbs", "baby-socket");
 *  websocket.on("open", function() {
 *      websocket._sock.send(JSON.stringify({
 *          caller : "+40 (721) 556-070"
 *      }));
 *  });
 * </pre>
 * <p>
 * <a id="events-description" /> Web Socket transaction events. <table>
 * <tr>
 * <td><b>open</b>
 * <td>Fired after web socket is opened.
 * <tr>
 * <td><b>close</b>
 * <td>Fired after web socket is closed.
 * <tr>
 * <td><b>message</b>
 * <td>This event has a single argument: data object from server.
 * <tr>
 * <td><b>error</b>
 * <td>Fired on server side and networking failures. Note that this event is not triggered when application code from
 * server throws exception.</table>
 * 
 * @since 1.0
 * @constructor Construct web socket instance.
 * @param String url optional web socket URL,
 * @param String subProtocol.
 * @assert At least <em>subProtocol</em> argument is present and is not undefined, null or empty. The same for
 *         <em>url</em>, if present.
 */
js.net.WebSocket = function () {
    $assert(arguments.length, "js.net.WebSocket#WebSocket", "Missing argument(s).");
    var url, subProtocol;
    if (arguments.length === 2) {
        url = arguments[0];
        subProtocol = arguments[1];
    }
    else {
        var u = WinMain.url;
        url = $format("ws://%s:%d/%s/sock.wsp", u.host, u.port, u.path);
        subProtocol = arguments[0];
    }
    $assert(url, "js.net.WebSocket#WebSocket", "URL is undefined, null or empty.");
    $assert(subProtocol, "js.net.WebSocket#WebSocket", "Sub-protocol is undefined, null or empty.");

    /**
     * Web socket events.
     * 
     * @type js.event.CustomEvents
     */
    this._events = new js.event.CustomEvents();
    this._events.register("open", "close", "message", "error");

    /**
     * Built-in web socket instance.
     * 
     * @type WebSocket
     */
    this._sock = new WebSocket(url, subProtocol);
    this._sock.onopen = this._onopen.bind(this);
    this._sock.onclose = this._onclose.bind(this);
    this._sock.onmessage = this._onmessage.bind(this);
    this._sock.onerror = this._onerror.bind(this);
};

js.net.WebSocket.prototype = {
    /**
     * Add event listener. Listener function should have next signature:
     * 
     * <pre>
     * 	void listener(Object... args)
     * </pre>
     * 
     * where <em>args</em> are specific for every event type. See <a href="#events-description">events description</a>.
     * 
     * @param String type event type,
     * @param Function listener event listener to register,
     * @param Object scope listener run-time scope.
     * @return js.net.WebSocket this pointer.
     */
    on : function (type, listener, scope) {
        this._events.addListener(type, listener, scope || window);
        return this;
    },

    /**
     * Send data object to server.
     * 
     * @param Object data object to be sent.
     * @return js.net.WebSocket this pointer.
     */
    send : function (data) {
        this._sock.send(JSON.stringify(data));
        return this;
    },

    /**
     * Close this web socket instance.
     */
    close : function () {
        this._sock.close();
    },

    /**
     * Internal handler for open event.
     */
    _onopen : function () {
        this._events.fire("open");
    },

    /**
     * Internal handler for close event.
     */
    _onclose : function () {
        this._events.fire("close");
    },

    /**
     * Internal handler for message event.
     */
    _onmessage : function (message) {
        var data = JSON.parse(message.data);
        this._events.fire("message", data);
    },

    /**
     * Internal handler for error event.
     */
    _onerror : function () {
        this._events.fire("error");
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.net.WebSocket";
    }
};
$extends(js.net.WebSocket, Object);
$package("js.net");

/**
 * XML HTTP Request. This class name is a little misleading: it actually encapsulates both request and related server
 * response. Takes care to prepare HTTP request package with application data, serialized as string, send it to server
 * and wait for response package. Deserialize server data accordingly response content type.
 * 
 * <p>
 * This class is a wrapper for built-in {@link XMLHttpRequest} closely following its usage pattern:
 * <ol>
 * <li>create instance
 * <li>add event listeners
 * <li>open connection
 * <li>set request headers
 * <li>send data
 * </ol>
 * Steps 2 and 4 are optionally but order is mandatory. This class tracks its internal state and assert if trying to
 * abuse it in any way. An usage sample follows:
 * 
 * <pre>
 * var xhr = new js.net.XHR();
 * xhr.on("progress", this._onProgress, this);
 * xhr.on("load", this._onLoad, this);
 * xhr.open("POST", "form-processor.xsp");
 * xhr.setHeader("X-Application", "j(s)-app");
 * xhr.send(form);
 * </pre>
 * 
 * <a id="events-description" /> XHR transaction events, a subset of XMLHttpRequest Level 2. This implementation doesn't
 * consider <b>loadstart</b> and <b>abort</b> since they are triggered by user code actions.
 * 
 * <p>
 * <table>
 * <tr>
 * <td><b>progress</b>
 * <td>Triggered periodically if current XHR transaction sends a form. It has only one argument: a progress object that
 * is an extension of W3C Progress Event interface.
 * <tr>
 * <td><b>error</b>
 * <td>Fired on server side and networking failures. Note that this event is not triggered when application code from
 * server throws exception.
 * <tr>
 * <td><b>timeout</b>
 * <td>Fired if transaction is not completed in specified amount of time. Because form transfer duration can vary from
 * seconds to minutes timeout mechanism is actually enabled only when send objects and XML documents. Also if user code
 * set this XHR transaction timeout value to zero this event is not triggered. Timeout event has no argument.
 * <tr>
 * <td><b>load</b>
 * <td>Fired when request successfully completed. This event has only one argument, namely the object arrived from
 * server.
 * <tr>
 * <td><b>loadend</b>
 * <td>Request aborted or completed, either in error, timeout or successfully. This event has no argument. </table>
 * 
 * <p>
 * Self-destruction. This class releases used resources after loadend event was fired. User code must be aware of this
 * feature and don't try to access this XHR response attributes outside load event handler. Also, this class is not
 * reentrant. Do not try to reuse XHR instances; create a new one for every transaction.
 * 
 * @constructor Construct HTTP request transaction.
 */
js.net.XHR = function () {
    $assert(this instanceof js.net.XHR, "js.net.XHR#XHR", "Invoked as function.");

    /**
     * Asynchronous request worker.
     * 
     * @type XMLHttpRequest
     */
    this._request = new XMLHttpRequest();

    /**
     * This request instance state machine.
     * 
     * @type js.net.XHR.StateMachine
     */
    this._state = js.net.XHR.StateMachine.CREATED;

    /**
     * Synchronous mode flag. All XHR transaction are asynchronous, i.e. {@link #send} returns immediately and user code
     * should use events to acquire server response. So this flag is false by default. Anyway, there are marginal use
     * cases where a synchronous response is more appropriate.
     * 
     * @type Boolean
     */
    this._synchronousMode = false;

    /**
     * Request timeout in milliseconds.
     * 
     * @type js.util.Timeout
     */
    this._timeout = new js.util.Timeout(0);
    this._timeout.setCallback(this._onTimeout, this);

    /**
     * Asynchronous request events.
     * 
     * @type js.event.CustomEvents
     */
    this._events = new js.event.CustomEvents();
    this._events.register("progress", "error", "timeout", "load", "loadend");
};

/**
 * Default synchronous mode timeout.
 * 
 * @type Number
 */
js.net.XHR.SYNC_TIMEOUT = 4000;

/**
 * Valid header name and value.
 * 
 * @type RegExp
 */
js.net.XHR.VALID_HEADER = /^[A-Z0-9\-\/\s,\.]+$/gi;

js.net.XHR.prototype = {
    /**
     * Add event listener. Listener function should have next signature:
     * 
     * <pre>
     * 	void listener(Object... args)
     * </pre>
     * 
     * where <em>args</em> are specific for every event type. See <a href="#events-description">events description</a>.
     * 
     * @param String type event type,
     * @param Function listener event listener to register,
     * @param Object scope listener run-time scope.
     * @return js.net.XHR this object.
     */
    on : function (type, listener, scope) {
        $assert(this._state === js.net.XHR.StateMachine.CREATED, "js.net.XHR#on", "Illegal state.");
        if (type === "progress") {
            this._request.upload.addEventListener("progress", function (ev) {
                this._events.fire("progress", ev);
            }.bind(this));
        }
        this._events.addListener(type, listener, scope || window);
        return this;
    },

    /**
     * Set transaction timeout. A timeout value of zero disable transaction timeout that can hang indefinitely. If
     * timeout value is not positive this method does nothing.
     * 
     * @param Number timeout transaction timeout in milliseconds.
     * @return js.net.XHR this object.
     * @assert given argument is a positive {@link Number}.
     */
    setTimeout : function (timeout) {
        $assert(js.lang.Types.isNumber(timeout), "js.net.XHR#setTimeout", "Timeout is not a number.");
        $assert(timeout >= 0, "js.net.XHR#setTimeout", "Timeout is not strict positive.");
        this._timeout.set(timeout);
        return this;
    },

    /**
     * Set request header. This setter is usable only after request is {@link #open opened} but before {@link #send}.
     * Header name and value should be valid as described by {@link js.net.XHR#VALID_HEADER} pattern. Assert request is
     * in proper state and arguments are valid. Anyway, if assert is disabled values are sent to native request as they
     * are and rise exception if invalid.
     * 
     * @param String header header name,
     * @param String value header value.
     * @return js.net.XHR this object.
     * @throws InvalidStateError if request is not in proper state.
     * @throws SyntaxError if header or value is invalid.
     * @assert request is in proper state and arguments are valid.
     */
    setHeader : function (header, value) {
        /**
         * @param String str
         * @return Boolean
         */
        function isValid (str) {
            js.net.XHR.VALID_HEADER.lastIndex = 0;
            return str && js.net.XHR.VALID_HEADER.test(str);
        }
        $assert(this._state === js.net.XHR.StateMachine.OPENED, "js.net.XHR#setHeader", "Illegal state.");
        $assert(isValid(header), "js.net.XHR#setHeader", "Header name is invalid.");
        $assert(isValid(value), "js.net.XHR#setHeader", "Header value is invalid.");
        return this._setHeader(header, value);
    },

    /**
     * Request header setter.
     * 
     * @param String header header name,
     * @param String value header value.
     * @return js.net.XHR this object.
     */
    _setHeader : function (header, value) {
        this._request.setRequestHeader(header, value);
        return this;
    },

    /**
     * Get response header. Note that response header is valid only after request is successfully complete. Returns null
     * if requested header is not found.
     * 
     * @param String header, header name to be retrieved.
     * @return String the value of requested header or null.
     */
    getHeader : function (header) {
        $assert(this._state === js.net.XHR.StateMachine.DONE, "js.net.XHR#getHeader", "Illegal state.");
        return this._request.getResponseHeader(header);
    },

    /**
     * Get response status. Note that response status is valid only after request is successfully complete.
     * 
     * @return Number response status code as integer value.
     */
    getStatus : function () {
        $assert(this._state === js.net.XHR.StateMachine.DONE, "js.net.XHR#getStatus", "Illegal state.");
        return window.parseInt(this._request.status, 10);
    },

    /**
     * Get response status text. Useful only for debug; application developer is encouraged to use localized, less
     * technically and meaningful messages. Note that response status text is valid only after request is successfully
     * complete.
     * 
     * @return String response status English description.
     */
    getStatusText : function () {
        $assert(this._state === js.net.XHR.StateMachine.DONE, "js.net.XHR#getStatusText", "Illegal state.");
        return this._request.statusText;
    },

    /**
     * Open connection with server. Open connection with server and initialize default request header values. These
     * values can be overridden by calling {@link #setHeader}.
     * 
     * @param js.net.Method method HTTP method,
     * @param String url remote resource URL,
     * @param Boolean... async optional asynchronous operation mode, default to true,
     * @param String... user optional user name for authentication,
     * @param String... password optional password, mandatory if user present.
     * @return js.net.XHR this object.
     * @assert all arguments are not undefined, null or empty and of proper type, if present.
     */
    open : function (method, url, async, user, password) {
        $assert(this._state === js.net.XHR.StateMachine.CREATED, "js.net.XHR#open", "Illegal state.");
        this._state = js.net.XHR.StateMachine.OPENED;

        $assert(method, "js.net.XHR#open", "Undefined or null method.");
        $assert(url, "js.net.XHR#open", "Undefined or null URL.");
        $assert(typeof async === "undefined" || js.lang.Types.isBoolean(async), "js.net.XHR#open", "Asynchronous flag is not boolean.");
        $assert(typeof user === "undefined" || js.lang.Types.isString(user), "js.net.XHR#open", "User is not string.");
        $assert(typeof password === "undefined" || js.lang.Types.isString(password), "js.net.XHR#open", "Password is not string.");

        if (typeof async === "undefined") {
            async = true;
        }
        /**
         * Synchronous mode flag. All XHR transaction are asynchronous, i.e. after send returns immediately and invoker
         * should use events to acquire server response. So this flag is false by default. Anyway, there are marginal
         * use cases where a synchronous response is more appropriate.
         * 
         * @type Boolean
         */
        this._synchronousMode = !async;
        if (this._synchronousMode && this._timeout.get() === 0) {
            this._timeout.set(js.net.XHR.SYNC_TIMEOUT);
        }
        if (async) {
            this._request.onreadystatechange = this._onReadyStateChange.bind(this);
        }
        this._request.open(method, url, async, user, password);

        this._request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        this._request.setRequestHeader("Cache-Control", "no-cache");
        this._request.setRequestHeader("Cache-Control", "no-store");
        this._request.setRequestHeader("Accept", "application/json, text/xml, text/plain");
        return this;
    },

    /**
     * Send request to server. This method takes specific preparation actions considering the type of given data, e.g.
     * set proper request content type. Anyway, data is optional and can be undefined or null.
     * 
     * @param Object... optional data, undefined and null accepted.
     * @return Object server response if this transaction is synchronously.
     */
    send : function (data) {
        $assert(this._state === js.net.XHR.StateMachine.OPENED, "js.net.XHR#send", "Illegal state.");
        this._state = js.net.XHR.StateMachine.SENDING;

        // send void --------------------------------------
        if (typeof data === "undefined" || data == null) {
            // do not set Content-Type if data is null or undefined
            this._timeout.start();
            this._request.send();
        }

        // send string ------------------------------------
        else if (js.lang.Types.isString(data)) {
            this._request.setRequestHeader("Content-Type", "text/plain; charset=UTF-8");
            this._timeout.start();
            this._request.send(data);
        }

        // send document ----------------------------------
        else if (data instanceof js.dom.Document) {
            this._request.setRequestHeader("Content-Type", "text/xml; charset=UTF-8");
            this._timeout.start();
            this._request.send(data.getDocument());
        }

        // send form --------------------------------------
        else if (data instanceof js.dom.Form) {
            // relies on browser to set the proper multipart content type and boundaries
            this._request.send(data.toFormData());
            // upload duration may naturally vary from seconds to minutes and is hardly predictable
            // for this reason sending forms doesn't use timeout but relies on abort and progress events
        }

        // send file --------------------------------------
        else if (data instanceof File) {
            var formData = new FormData();
            formData.append(data.name, data);
            this._request.send(formData);
        }

        // send object ------------------------------------
        else {
            this._request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
            this._timeout.start();
            this._request.send(js.lang.JSON.stringify(data));
        }

        if (this._synchronousMode) {
            this._timeout.stop();
            var res = this._processResponse();
            this.finalize();
            return res;
        }
    },

    /**
     * Abort.
     */
    abort : function () {
        // here we face a race condition
        // send has executed; as a consequence a separate thread is created for XHR transaction
        // we are in current thread executing abort but there is no guaranty meanwhile transaction
        // thread was not already executed finalization from ready state handler

        try {
            this._request.onreadystatechange = null;
            this._timeout.stop();
            this._request.abort();
            this._state = js.net.XHR.StateMachine.ABORTED;
            this._events.fire("loadend");
            this.finalize();
        } catch (er) {
            $error("js.net.XHR#abort", er);
        }
    },

    /**
     * Ready state handler. Actually waits for {@link js.net.ReadyState DONE} and takes next actions:
     * <ul>
     * <li>stop timer, if this instance has one
     * <li>if not on abort executes next 2 steps
     * <li>invoke {@link #_processResponse}, responsible for server response processing
     * <li>if server side is not in error fires <b>load</b> event
     * <li>in any case fires <b>loadend</b> event and cleanup this instance
     * </ul>
     * Any raised exception, other than server side error is signaled via global error handler, which usually just
     * alert.
     */
    _onReadyStateChange : function () {
        if (this._request.readyState === js.net.ReadyState.DONE) {
            try {
                this._timeout.stop();
                var response = this._processResponse();
                if (typeof response !== "undefined") {
                    this._events.fire("load", response);
                }
            } catch (er) {
                js.ua.System.error(er);
            } finally {
                try {
                    this._events.fire("loadend");
                } catch (er) {
                    $error("js.net.XHR#_onReadyStateChange", "Error on loadend listeners: %s.", er);
                }
                this.finalize();
            }
        }
    },

    /**
     * Process server response. Is invoked by {@link #_onReadyStateChange ready state handler}; if request is
     * synchronously ready state handler is not used and this method is invoked directly by {@link #send}. In any case
     * server response is fully loaded, both headers and data.
     * <p>
     * First check server status; on server error fires <b>error</b> event and returns undefined. If there is no error
     * event listener delegates {@link js.ua.Window#error global error handler}.
     * <p>
     * Then choose the proper logic to parse server data, based on received content type and return parser product. If
     * content type is text/xml returned object is an instance of {@link js.dom.Document}; if application/json returns
     * an application {@link Object}. Otherwise returns a {@link String}.
     * <p>
     * Finally, this method takes care about redirection, usually occurring on server side session timeout.
     * XMLHttpRequest specs mandates that 301, 302, 303, 307, and 308 codes to be processed transparently by user agent.
     * Excerpt from $4.6.7:
     * <ol>
     * <li>Set the request URL to the URL conveyed by the Location header.
     * <li>If the source origin and the origin of request URL are same origin transparently follow the redirect while
     * observing the same-origin request event rules.
     * </ol>
     * This means this method will never be invoked for redirection, if use HTTP standard redirect codes. Instead
     * j(s)-lib uses 200 with X-JSLIB-Location header and does a {@link js.ua.Window#assign} on given location.
     * 
     * @return Object string, object or XML document sent back by server.
     */
    _processResponse : function () {
        var er, contentType;

        // j(s)-lib server side HTTP response status code can be only:
        // 200 - success or redirect with X-JSLIB-Location
        // 400 - client request fail to obey a business constrain, e.g. employee SSN is not unique
        // 500 - internal server error

        if (this._request.status === 500) {
            er = JSON.parse(this._request.responseText);
            $debug("js.net.XHR#_processResponse", "Server side error: %s: %s", er.cause, er.message);
            if (this._events.hasListener("error")) {
                this._events.fire("error", er);
            }
            else {
                js.ua.System.error(er.cause + "\n" + er.message);
            }
            this._state = js.net.XHR.StateMachine.ERROR;
            return undefined;
        }

        contentType = this._request.getResponseHeader("Content-Type");
        if (this._request.status === 400) {
            $assert(contentType.indexOf("json") !== -1, "js.net.XHR#_processResponse", "Bad content type for business constrain exception.");
            er = js.lang.JSON.parse(this._request.responseText);
            $debug("js.net.XHR#_processResponse", "Broken business constrain: 0x%4X", er.errorCode);
            WinMain.page.onBusinessFail(er);
            this._state = js.net.XHR.StateMachine.ERROR;
            return undefined;
        }

        if (this._request.status !== 200) {
            $error("js.net.XHR#_processResponse", "Invalid server response status code |%s|.", this._request.status);
            throw new js.lang.Exception("Invalid server response.");
        }

        this._state = js.net.XHR.StateMachine.DONE;
        var redirect = this._request.getResponseHeader("X-JSLIB-Location");
        // XMLHttpRequest mandates null for not existing response header but there is at least one browser that returns
        // empty string; so we need to test for both conditions
        if (redirect) {
            $debug("js.net.XHR#_processResponse", "Server side redirect to |%s|.", redirect);
            WinMain.assign(redirect);
            return undefined;
        }

        // process server response considering its content type
        if (contentType && contentType.indexOf("xml") !== -1) {
            return new js.dom.Document(this._request.responseXML);
        }
        if (contentType && contentType.indexOf("json") !== -1) {
            return js.lang.JSON.parse(this._request.responseText);
        }
        // content type is neither JSON or XML; process it as text
        return this._request.responseText;
    },

    /**
     * Timeout handler.
     */
    _onTimeout : function () {
        this._events.fire("timeout");
        this.abort();
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.net.XHR";
    },

    /**
     * Finalize this instance. Dispose used resources so that this object become invalid. The behavior of this class is
     * not specified if attempt to use any of its methods after finalization. Note that this class implements
     * self-destruction; finalize is internally invoked after firing loadend event.
     */
    finalize : function () {
        delete this._events;
        delete this._request;
        delete this._timeout;
    }
};
$extends(js.net.XHR, Object);

/**
 * XHR state machine.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 */
js.net.XHR.StateMachine = {
    /**
     * XHR instance just created.
     */
    CREATED : 0,

    /**
     * Open method was invoked.
     */
    OPENED : 1,

    /**
     * Sending pending.
     */
    SENDING : 2,

    /**
     * User abort.
     */
    ABORTED : 3,

    /**
     * Completed with success.
     */
    DONE : 4,

    /**
     * Completed with server error.
     */
    ERROR : 5
};
$package("js.ua");

/**
 * Client support for cookies. This implementation follows RFC2109 regarding cookie format but relies on user agent for
 * actual storage and retrieving. Supplies method to set, get, test for existence and remove cookies and handy names and
 * values sanity check.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * @see RFC2109 RFC2109 - HTTP State Management Mechanism
 */
js.ua.Cookies = {
    /**
     * Formatted cookie maximum length. This refers to formatted cookie string, that is, including cookie value and all
     * optional attributes, if present.
     * 
     * @type Number
     */
    MAX_LENGTH : 4096,

    /**
     * Create or update a cookie. Create a formatted cookie string starting from given arguments and store it to user
     * agent cookies repository. If cookie already exists update its attributes. This setter tries to ensure given
     * arguments are proper and assert if not. Anyway, if assertions are disabled we are at the mercy of user agent
     * implementation.
     * <p>
     * Value is not limited to string; boolean, number, date and even object and array are allowed. This method
     * serialize given value storing also type informations so that it can be restored on {@link #get get cookie}.
     * Please keep in mind maximum cookie length is applied and refrain to store large arrays or objects, although there
     * is no restriction regarding the complexity of object graph.
     * 
     * @param String name cookie name,
     * @param Object value cookie value,
     * @param Date expires expiration date, if missing cookie will expire at session end,
     * @param String path cookie path, default to current document path,
     * @param String domain domain name, default to current document domain,
     * @param Boolean secure HTTPS required, default to false. If true cookie transmission requires HTTPS.
     * @assert all arguments should be valid, if present.
     */
    set : function (name, value, expires, path, domain, secure) {
        $assert(typeof name !== "undefined" && this.isValidName(name), "js.ua.Cookies#set", "Invalid cookie name |%s|.", name);
        $assert(typeof expires === "undefined" || js.lang.Types.isDate(expires), "js.ua.Cookies#set", "Expires is not date type.");
        $assert(typeof path === "undefined" || this.isValidValue(path), "js.ua.Cookies#set", "Path is not string.");
        $assert(typeof domain === "undefined" || this.isValidValue(domain), "js.ua.Cookies#set", "Domain is not string.");
        $assert(typeof secure === "undefined" || js.lang.Types.isBoolean(secure), "js.ua.Cookies#set", "Secure is not boolean.");

        // convert value to string and store type information as comments suffix
        // suffix is as follow:
        // -b boolean
        // -n number
        // -d date
        // -s string
        // -o object
        // -a array
        var comment = "j(s)-lib-";
        if (js.lang.Types.isBoolean(value)) {
            comment += "b";
            value = value ? "true" : "false";
        }
        else if (js.lang.Types.isNumber(value)) {
            comment += "n";
            value = value.toString();
        }
        else if (js.lang.Types.isDate(value)) {
            comment += "d";
            value = js.lang.JSON.stringify(value);
        }
        else if (js.lang.Types.isString(value)) {
            $assert(this.isValidValue(value), "js.ua.Cookies#set", "Invalid cookie value.");
            comment += "s";
        }
        else if (js.lang.Types.isArray(value)) {
            comment += "a";
            value = js.lang.JSON.stringify(value);
        }
        else {
            comment += "o";
            value = js.lang.JSON.stringify(value);
        }

        var cookie = name + "=" + escape(value) + ("; comment=" + comment) + (expires ? "; expires=" + expires.toGMTString() : "") + (path ? "; path=" + path : "") + (domain ? "; domain=" + domain : "") + (secure ? "; secure" : "");
        this._setCookie(cookie);
    },

    /**
     * Get cookie value. Return cookie value or null if cookie not found. If optional value is supplied and named cookie
     * is missing store that <em>value</em> then return it. Returning value type is determined by
     * {@link #set cookie setter}. User code should know the type associated with named cookie and use it accordingly.
     * 
     * <pre>
     *	js.ua.Cookies.set("date", new Date(...));
     *	...
     *	var d = js.ua.Cookies.get("date");
     *	// here d is of Date type
     * </pre>
     * 
     * @param String name the name of cookie to retrieve,
     * @param String value optional value returned on missing cookie,
     * @param Date expires optional expires date used only on missing cookie.
     * @return Object requested cookie value or null.
     * @assert <em>name</em> argument is not undefined, null or empty.
     */
    get : function (name, value, expires) {
        $assert(name, "js.ua.Cookies#get", "Name is undefined, null or empty.");
        $assert(typeof value === "undefined" || this.isValidValue(value), "js.ua.Cookies#get", "Invalid cookie value.");
        $assert(typeof expires === "undefined" || js.lang.Types.isDate(expires), "js.ua.Cookies#get", "Expires is not date type.");

        var cookies = this._getCookies();
        var rex = new RegExp("(?:^|.*;\\s*)" + name + "\\s*\\=\\s*([^;]+)(?:;\\s*comment=j\\(s\\)\\-lib\\-([bndsoa]))?.*");
        var match = rex.exec(cookies);
        if (match !== null && match.length > 1) {
            value = unescape(match[1]);
            switch (match[2]) {
            case "b":
                return value === "true" ? true : false;
            case "n":
                return Number(value);
            case "d":
            case "o":
            case "a":
                return js.lang.JSON.parse(value);
            }
            return value;
        }
        if (typeof value !== "undefined") {
            this.set(name, value, expires);
            return value;
        }
        return null;
    },

    /**
     * Test for named cookie presence. Search user agent cookies repository for a cookie with requested name and return
     * true if found.
     * 
     * @param String name the name of cookie to look for.
     * @return Boolean true if named cookie exists.
     */
    has : function (name) {
        $assert(name, "js.ua.Cookies#has", "Name is undefined, null or empty.");
        var cookies = this._getCookies();
        var rex = new RegExp("(?:^|;\\s*)" + name + "\\s*\\=");
        return rex.test(cookies);
    },

    /**
     * Delete a cookie. This method sets cookie"s expiration date to epoch. User agent cookies repository manager takes
     * care to actually remove expired cookies.
     * 
     * @param String name the name of cookie to remove.
     */
    remove : function (name) {
        if (this.has(name)) {
            var cookie = name + "=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/";
            this._setCookie(cookie);
        }
    },

    /**
     * Get user agent cookie support enabling state.
     * 
     * @return Boolean true if user agent has cookie enabled.
     */
    isEnabled : function () {
        return navigator.cookieEnabled;
    },

    /**
     * Invalid cookie name pattern.
     * 
     * @type RegExp
     */
    _INVALID_NAME : /^(?:comment|expires|max\-age|path|domain|secure|version)$|^\$|[;=\s]+/,

    /**
     * Cookie name (in)sanity check. Accordingly RFC2109 a cookie name can"t begin with dollar ($); this is in fact the
     * only restriction. Anyway, in practice we need to avoid confusing cookies parsers so a valid name can"t be a
     * reserved name nor contain semicolon (;), equals (=) or white spaces. All cookie"s attribute names are considered
     * reserved:
     * <ul>
     * <li>comment
     * <li>expires
     * <li>max-age
     * <li>path
     * <li>domain
     * <li>secure
     * <li>version
     * </ul>
     * Also, a cookie name can"t be undefined, null or empty and must be a {@link String}.
     * 
     * <p>
     * This predicate is mostly for internal use but is public. Application code may use it to check cookie names
     * provided by user input.
     * 
     * @param String name cookie name to test if valid.
     * @return Boolean true only if cookie name is valid.
     */
    isValidName : function (name) {
        if (!name || !js.lang.Types.isString(name)) {
            return false;
        }
        this._INVALID_NAME.lastIndex = 0;
        return !this._INVALID_NAME.test(name);
    },

    /**
     * Value (in)sanity check. This test applies not only to cookie value but also to all cookie attributes: none of
     * them can contain semicolon (;) used as key/value separator. Also, value can"t be undefined, null or empty and
     * must be a {@link String}.
     * 
     * <p>
     * This predicate is mostly for internal use but is public. Application code may use it to check values provided by
     * user input.
     * 
     * @param String value value to test for validity.
     * @return Boolean true only if value is valid.
     */
    isValidValue : function (value) {
        if (!value || !js.lang.Types.isString(value)) {
            return false;
        }
        return value.indexOf(";") === -1;
    },

    /**
     * Cookie setter. Stores given cookie on user agent repository. Argument should be a full formatted cookie, that is,
     * includes cookie value and all optional attributes, if present, properly separated by semicolon. RFC2109 imposes a
     * maximum value for cookie length, see {@link #MAX_LENGTH}; this method relies on user agent to deal with too
     * large cookies.
     * 
     * @param String cookie formatted cookie.
     * @assert cookie length does not exceed allowed value.
     */
    _setCookie : function (cookie) {
        $assert(cookie.length < this.MAX_LENGTH);
        document.cookie = cookie;
    },

    /**
     * Retrieve all cookies. Return all cookies from current session as a single {@link String} using <b>;\s*name</b>
     * as cookie separator and <b>;\s*</b> for key/value pairs separator.
     * 
     * @return String all cookies formatted as a single String.
     */
    _getCookies : function () {
        return document.cookie;
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.ua.Cookies";
    }
};

/**
 * It seems Chrome has a bug related to cookie enabled state, at least this results from google closure library.
 */
$legacy(js.ua.Engine.WEBKIT, function () {
    js.ua.Cookies.isEnabled = function () {
        // use UUID to ensure name does not collide with some one used by application code
        var name = js.util.UUID();
        this.set(name, "fake-value");
        if (this.get(name) == null) {
            return false;
        }
        this.remove(name);
        return true;
    };
});
$package('js.ua');

/**
 * User agent device orientation. This enumeration has meaning only for mobile devices equipped with accelerometer.
 */
js.ua.Orientation = {
	/**
	 * Neutral value.
	 */
	NONE : 0,

	/**
	 * Landscape mode.
	 */
	LANDSCAPE : 1,

	/**
	 * Portrait mode.
	 */
	PORTRAIT : 2
};
    $package("js.ua");

/**
 * HTML page. The page is entire area where actual HTML rendering occurs; in CSS specs is named <em>canvas</em> but
 * j(s)-lib named it <em>page</em> in order to avoid name clash with synonymous HTML element. Do not confuse with CSS
 * page from for printing media; j(s)-lib page is a continuous, virtual space that may exceed screen dimensions - in
 * which case user agent provides means for scrolling.
 * 
 * <p>
 * Application code should create user defined page class extending this base class. Nothing special but this class
 * {@link #$extends extension handler} takes care to instantiate the page before actual DOM ready event. This way, user
 * defined class constructor is running in a properly initialized environment.
 * 
 * <pre>
 *	$package("comp.prj");
 *
 *	comp.prj.Page = function() {
 *		this.$super();
 *		// page initialization code
 *	}
 *
 * 	comp.prj.Page.prototype = {
 * 		// user page specific logic
 * 	}
 * 	$extends(comp.prj.Page, js.ua.Page);
 * </pre>
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * @constructor Construct page instance. Extract server side injected content, resolve HTML bindings and initialize
 *              {@link js.ua.Regional}.
 */
js.ua.Page = function () {
    $assert(this instanceof js.ua.Page, "js.ua.Page#Page", "Invoked as function.");

    var el = WinMain.doc.getById(this.SSI_CONTENT);
    if (el !== null) {
        /**
         * Server side injected content.
         * 
         * @type Object
         */
        this._content = js.lang.JSON.parse(el.getText());
        el.remove();
    }
    var bindings = this.bindings();
    for ( var selector in bindings) {
        WinMain.doc.bind(selector, bindings[selector]);
    }
    js.ua.Regional.init();
};

/**
 * Page constructor. Page specific constructor, i.e. the last, most specific page class, no matter how deep page classes
 * hierarchy is.
 * 
 * @type Function
 */
js.ua.Page._ctor = js.ua.Page;

/**
 * Page extension handler. Executed once by {@link js.lang.Operator#$extends} after user defined page extension is
 * actually performed. Register an anonymous listener for DOM ready event; when fired, create main page.
 * 
 * @param Function pageSubClass user defined page subclass.
 */
js.ua.Page.$extends = function (pageSubClass) {
    pageSubClass.$extends = function (pageSubClass) {
        js.ua.Page._ctor = pageSubClass;
    };

    $assert(js.ua.Page._ctor === js.ua.Page, "js.ua.Page.$extends", "Only one user defined page supported.");
    js.ua.Page._ctor = pageSubClass;

    WinMain.on("pre-dom-ready", function () {
        $assert(WinMain.page == null, "js.ua.Page.$extends", "WinMain.page should be null.");
        WinMain.page = new js.ua.Page._ctor();
        $debug("js.ua.Page#init", "Create main page %s.", js.ua.Page._ctor);
    });
};

/**
 * Page manager. Utility class taking care about browser page life cycle. It tries to locate a global object named
 * <em>Page</em> and augments it with reference to page parameters, extracted from invoking URL and methods for user
 * alert, prompt and confirm. Also this class is the global error handler.
 */
js.ua.Page.prototype = {
    /**
     * Container element used to transport server side injected content.
     * 
     * @type String
     */
    SSI_CONTENT : "js.SSI-CONTENT",

    /**
     * Application defined bindings. Returns an hash with CSS selectors as key and element class or format name as
     * value. This implementation returns an empty object but subclass may override it with something like below:
     * 
     * <pre>
     * 	return {
     * 		".progress": "js.widget.TextProgress",
     * 		".paging": "js.widget.Paging",
     * 		".user > .email": "app.format.Email",
     * 		".user > .phone": "app.format.Phone"
     * 	}
     * </pre>
     * 
     * Note that element class should inherit {@link js.dom.Element} and format implements Format interface. Otherwise
     * culprit binding is ignored. Also, CSS selectors may designate many elements in which case all are bound to the
     * same type; is legal to have many elements with the same class and/or format instance.
     * 
     * @return Object application bindings.
     */
    bindings : function () {
        return new Object();
    },

    /**
     * Set idle timeout value. Given value is measured in minutes and a value of 0 disable idle state watch dog.
     * 
     * @param Number value idle timeout value, minutes.
     * @assert idle timeout value is a positive number.
     */
    setIdleTimeout : function (value) {
        $assert(js.lang.Types.isNumber(value), "js.ua.Page#setIdleTimeout", "Value is not a number.");
        $assert(value >= 0, "js.ua.Page#setIdleTimeout", "Value is not a positive number.");
        js.event.Handler.idleTimeout.set(value * 60 * 1000);
    },

    /**
     * Default idle timeout handler. This method does nothing but record the event to debug logger. Subclasses may
     * override this method and take appropriate actions, e.g. logout or alert the user.
     */
    onIdleTimeout : function () {
        $debug("js.ua.Page#onIdleTimeout", "Idle timeout detected.");
    },

    /**
     * Business constrains exception handler.
     * 
     * @param Object er business constraints exception.
     */
    onBusinessFail : function (er) {
        js.ua.System.error("Broken business constrain: 0x%4X", er.errorCode);
    },

    /**
     * Work in progress. This is an experimental feature: Alt key shortcuts for buttons.
     */
    _registerButtonKeys : function () {
        var buttonKeys = {};
        var it = $L("button[data-key]").it(), button;
        while (it.hasNext()) {
            button = it.next();
            buttonKeys[button.getAttr("data-key").charCodeAt(0)] = button.getNode();
        }

        $E("body").focus().on("keydown", function (ev) {
            if (ev.altKey && ev.key !== 18) {
                if (ev.key in buttonKeys) {
                    var evt = document.createEvent("MouseEvents");
                    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                    buttonKeys[ev.key].dispatchEvent(evt);
                }
                ev.halt();
            }
        });
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.ua.Page";
    }
};
$extends(js.ua.Page, Object);
$package('js.ua');

/**
 * User regional settings. Global accessible, is used by regional-sensitive classes to adapt their own behavior. It is
 * initialized on {@link js.ua.Page} creation.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 */
js.ua.Regional = {
    /**
     * Language cookie name.
     * 
     * @type String
     */
    LANGUAGE_COOKIE : 'js.LANGUAGE',

    /**
     * Country cookie name.
     * 
     * @type String
     */
    COUNTRY_COOKIE : 'js.COUNTRY',

    /**
     * Time zone cookie name.
     * 
     * @type String
     */
    TIMEZONE_COOKIE : 'js.TIMEZONE',

    /**
     * User language, lower case two-letter ISO-639 code. Default to <em>en</em> when language can't be loaded from
     * cookie or browser locale.
     * 
     * @type String
     */
    language : 'en',

    /**
     * User country, upper case two-letter ISO-3166 code. Default to <em>US</em> when country can't be loaded from
     * cookie or browser locale.
     * 
     * @type String
     */
    country : 'US',

    /**
     * User time zone. Retrieved from server via cookie. Default to <em>UTC</em> when time zone cookie is missing.
     * 
     * @type String
     */
    timeZone : 'UTC',

    /**
     * Initialize regional properties. This method tries to load regional settings from server via cookie or browser
     * locale. If fails default values are preserved.
     */
    init : function () {
        var locale = this._getUserAgentLocale();
        if (!locale) {
            locale = this.language + '-' + this.country;
        }
        if (js.lang.Types.isString(locale)) {
            locale = locale.split('-');
            if (locale.length !== 2) {
                locale = [ this.language, this.country ];
            }
        }

        var language = js.ua.Cookies.get(this.LANGUAGE_COOKIE);
        if (language == null) {
            language = locale[0];
        }
        if (language) {
            this.language = language.toLowerCase();
        }

        var country = js.ua.Cookies.get(this.COUNTRY_COOKIE);
        if (country == null) {
            country = locale[1];
        }
        if (this.country) {
            this.country = country.toUpperCase();
        }

        var timeZone = js.ua.Cookies.get(this.TIMEZONE_COOKIE);
        if (timeZone !== null) {
            this.timeZone = timeZone;
        }
    },

    /**
     * Get user agent locale.
     * 
     * @return String user agent locale.
     */
    _getUserAgentLocale : function () {
        return navigator.language;
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return 'js.ua.Regional';
    }
};

$legacy(js.ua.Engine.TRIDENT, function () {
    js.ua.Regional._getUserAgentLocale = function () {
        return navigator.userLanguage;
    };
});
$package('js.util');

/**
 * Abstract timer. This class is the base for {@link js.util.Timeout one-shot} and {@link js.util.Timer periodic}
 * timers. Subclasses must implement {@link #_start} and {@link #_stop} methods.
 * 
 * @constructor Construct timer instance.
 * 
 * @param Number value timer value, default to 0,
 * @param Function callback optional callback function,
 * @param Object scope callback run-time scope.
 * @assert value is a positive {@link Number}.
 */
js.util.AbstractTimer = function(value, callback, scope) {
	$assert(typeof value === 'undefined' || (js.lang.Types.isNumber(value) && value >= 0), 'js.util.AbstractTimer#AbstractTimer', 'Value is not positive number.');

	if (typeof value === 'undefined') {
		value = 0;
	}

	/**
	 * Timer value, in milliseconds. This value controls when timer event(s) occur.
	 * 
	 * @type Number
	 */
	this._value = value;

	/**
	 * Timer ID. Provided by subclass on {@link #_start} call.
	 * 
	 * @type Object
	 */
	this._id = null;

	if (typeof callback !== 'undefined') {
		this.setCallback(callback, scope);
	}
};

js.util.AbstractTimer.prototype = {
	/**
	 * Set this timer value. Subclass uses this value as interval or timeout, accordingly. Stop this timer if given
	 * value is 0.
	 * 
	 * @param Number value this timer value expressed in milliseconds.
	 * @return js.util.AbstractTimer this object.
	 * @assert <em>value</em> argument is a positive {@link Number}.
	 */
	set : function(value) {
		$assert(js.lang.Types.isNumber(value), 'js.util.AbstractTimer#set', 'Value is not a number.');
		$assert(value >= 0, 'js.util.AbstractTimer#set', 'Value is not positive.');
		if (js.lang.Types.isString(value)) {
			value = Number(value);
		}
		if (value === 0) {
			this.stop();
		}
		if (value >= 0) {
			this._value = value;
		}
		return this;
	},

	/**
	 * Get this timer value.
	 * 
	 * @return Number this timer value, in milliseconds.
	 */
	get : function() {
		return this._value;
	},

	/**
	 * Set callback. Set this timer callback and optional run-time scope; if scope argument is missing uses global scope
	 * instead. Callback signature should be:
	 * 
	 * <pre>
	 * 	void callback();
	 * </pre>
	 * 
	 * If callback is not a function or scope is not an object this method behavior is not defined.
	 * 
	 * @param Function callback function to invoke when timeout expires or timer tick,
	 * @param Object scope optional callback execution scope.
	 * @return js.util.AbstractTimer this object.
	 * @assert <em>callback</em> argument is a function and <em>scope</em>, if present, is an object.
	 */
	setCallback : function(callback, scope) {
		$assert(js.lang.Types.isFunction(callback), 'js.util.AbstractTimer#setCallback', 'Callback is not function.');
		$assert(typeof scope === 'undefined' || js.lang.Types.isObject(scope), 'js.util.AbstractTimer#setCallback', 'Scope is not object.');

		/**
		 * User space callback.
		 * 
		 * @type Function
		 */
		this._callback = callback;

		/**
		 * Callback execution scope. Optional, default to global scope.
		 * 
		 * @type Object
		 */
		this._scope = scope || window;

		return this;
	},

	/**
	 * Start this timer. If this timer is already started reset it, that is perform a fresh start. This method delegates
	 * subclass {@link #_start}, with {@link #_handler} as argument, to actually create native timer object. Anyway, if
	 * this timer value is zero this method does nothing.
	 * 
	 * @return js.util.AbstractTimer this object.
	 */
	start : function() {
		if (this._value > 0) {
			if (this._id !== null) {
				this._stop(this._id);
				this._id = null;
			}
			this._id = this._start(this._handler.bind(this), this._value);
		}
		return this;
	},

	/**
	 * Internal handler. Invoke registered callback in safe context. If something goes wrong invoke {@link #stop} and
	 * send caught error to {@link js.ua.System#error global error handler}. This handler is registered by subclass
	 * {@link #_start} with native timer objects.
	 */
	_handler : function() {
		try {
			if (this._callback) {
				this._callback.call(this._scope);
			}
			this._tick();
		} catch (er) {
			this.stop();
			js.ua.System.error(er);
		}
	},

	/**
	 * Stop this timer. Trying to stop an already stopped timer is NOP.
	 * 
	 * @return js.util.AbstractTimer this object.
	 */
	stop : function() {
		if (this._id !== null) {
			this._stop(this._id);
			this._id = null;
		}
		return this;
	},

	/**
	 * Is timer ticking?
	 * 
	 * @return Boolean true if this timer is working.
	 */
	isTicking : function() {
		return this._id !== null;
	},

	/**
	 * Abstract timer start. Subclass must create and start a new timer and return underlying ID, uniquely identifying
	 * newly created timer. It also register given internal handler to native timer object.
	 * 
	 * @param Function handler internal timer handler,
	 * @param Number value abstract time value, measured in milliseconds.
	 * @return Object started timer ID.
	 */
	_start : function(handler, value) {
	},

	/**
	 * Abstract timer stop. Subclass must stop the timer identified by <em>timerID</em> and release all used
	 * resources. This abstract class guarantees that <em>timerID</em> is the same provided by subclass on
	 * {@link #_start} call.
	 * 
	 * @param Object timerID ID of the timer to stop.
	 */
	_stop : function(timerID) {
	},

	/**
	 * Internal callback invoked after handler processing. Subclass may implement it to update internal state.
	 */
	_tick : function() {
	},

	/**
	 * Returns a string representation of the object.
	 * 
	 * @return String object string representation.
	 */
	toString : function() {
		return 'js.util.AbstractTimer';
	}
};
$extends(js.util.AbstractTimer, Object);
$package("js.util");

/**
 * Array utility class. Provides handy methods that operate on built-in {@link Array}.
 */
js.util.Arrays = {
    /**
     * Add expanded item(s) to array. The same as {@link Array#push} but expand given items, that is, if an item is a
     * built-in {@link Array} or {@link NodeList} or has iterator, all that item elements are added one by one, in
     * sequence. Otherwise item is added as it is.
     * 
     * <pre>
     * 	js.util.Arrays.pushAll(array, 2012, ["maya", "calendar"], "end");
     *	// array === [2012, "maya", "calendar", "end"]
     * </pre>
     * 
     * Note that this method is not recursive. If an expanded item is an array on its turn it is added as it is, i.e.
     * expands only first level.
     * 
     * <pre>
     * 	js.util.Arrays.pushAll(array, 2012, [["december", 21], "maya", "calendar"], "end");
     *	// array === [2012, ["december", 21], "maya", "calendar", "end"]
     * </pre>
     * 
     * @param Array array target array to add items to,
     * @param Object... items, variable number of items to be added.
     * @assert at least one argument is present.
     */
    pushAll : function (array) {
        $assert(js.lang.Types.isArray(array), "js.util.Arrays#pushAll", "Argument is not an array.");
        $assert(arguments.length > 1, "js.util.Arrays#pushAll", "Array is empty.");
        for ( var i = 1, it; i < arguments.length; ++i) {
            it = new js.lang.Uniterator(arguments[i]);
            while (it.hasNext()) {
                array.push(it.next());
            }
        }
    },

    /**
     * Remove array item(s). This method accepts a variable number of criteria, every one being a value to match or a
     * predicate to test. Process every criterion one by one, in arguments list order, delegating internal
     * {@link #_remove remove helper}. If a criterion is a predicate it should have next signature:
     * 
     * <pre>
     *	Boolean predicate(Object item, Number index)
     * </pre>
     * 
     * <p>
     * Be aware that this method, even invoked with more criteria still remove one single item per criterion, that is,
     * the first item fulfilling that criterion. If in need to remove all items for a particular criterion uses
     * {@link #removeAll}.
     * 
     * @param Array array array to remove items from,
     * @param Object... criteria one or more criteria.
     * @assert <em>array</em> argument is actually an {@link Array} and there is at least one criterion.
     */
    remove : function (array) {
        $assert(js.lang.Types.isArray(array), "js.util.Arrays#remove", "Argument is not an array.");
        $assert(arguments.length > 1, "js.util.Arrays#remove", "Array is empty.");
        for ( var i = 1; i < arguments.length; ++i) {
            js.util.Arrays._remove(array, arguments[i], true);
        }
    },

    /**
     * Remove items using expanded criteria. The same as {@link #remove} only this method <b>remove all items</b>
     * fulfilling criteria. Also if a criterion is an array / iterable expands it, i.e. process every criterion one by
     * one. Note that this method is not recursive, it expands only first level. Arrays within array are not expanded.
     * 
     * @param Array array array to remove items from,
     * @param Object... criteria one or more criteria.
     * @assert <em>array</em> argument is actually an {@link Array} and there is at least one criterion.
     */
    removeAll : function (array) {
        $assert(js.lang.Types.isArray(array), "js.util.Arrays#removeAll", "Argument is not array.");
        $assert(arguments.length > 1, "js.util.Arrays#removeAll", "Array is empty.");
        for ( var i = 1, it; i < arguments.length; ++i) {
            it = new js.lang.Uniterator(arguments[i]);
            while (it.hasNext()) {
                js.util.Arrays._remove(array, it.next(), false);
            }
        }
    },

    /**
     * Remove helper. Search for items fulfilling criteria and remove them; if more candidates and <em>firstOnly</em>
     * argument is true remove only first encountered. Null criteria is valid in which case remove null item(s).
     * 
     * <p>
     * Criteria can be an object or a predicate. If object uses strict equality comparison (===) to match against array
     * items. If predicate it should have next signature:
     * 
     * <pre>
     *	Boolean predicate(Object item, Number index)
     * </pre>
     * 
     * <p>
     * Because strict equality differentiates between primitive values and corresponding objects this remove method
     * behaves accordingly. That is, if criteria is "1" it does not remove an item 1, new Number(1) or even new
     * String("1").
     * 
     * @param Array array array on which remove operation will be performed,
     * @param Object criterion object to be removed or predicate to be tested,
     * @param Boolean firstOnly if true remove only first item.
     * @throws TypeError if array is undefined or null.
     */
    _remove : function (array, criterion, firstOnly) {
        function doit (a, i) {
            delete a[i]; // this hopefully gives a hint to garbage collector
            a.splice(i, 1);
        }

        var i;
        if (js.lang.Types.isFunction(criterion)) {
            for (i = 0; i < array.length; ++i) {
                if (criterion(array[i], i)) {
                    doit(array, i--);
                    if (firstOnly) {
                        break;
                    }
                }
            }
        }
        else {
            for (i = 0;;) {
                i = array.indexOf(criterion, i);
                if (i === -1) {
                    break;
                }
                doit(array, i);
                if (firstOnly) {
                    break;
                }
            }
        }
    },

    /**
     * Clear array. Remove all this array items calling a finalizer function for every item before actually removing.
     * Finalizer is used to perform auxiliary per item clean-up. There are two variants: finalizer item property
     * identified by its name (string variant) or external function with the next signature.
     * 
     * <pre>
     * 	void finalizer(Object item, Number index)
     * </pre>
     * 
     * To conclude, if given finalizer is a string and if current item has a function with given name that function is
     * invoked. If requested finalizer is a function it is simply invoked for every item. If no finalizer supplied per
     * item clean-up is not performed.
     * 
     * @param Array array array to clean-up,
     * @param Object finalizer optional function to be invoked before item removing,
     * @param Object scope optional scope for finalizer execution, default current item.
     * @assert <em>array</em> argument is actually an {@link Array}.
     */
    clear : function (array, finalizer, scope) {
        $assert(js.lang.Types.isArray(array), "js.util.Arrays#clear", "Argument is not an array.");
        for ( var i = 0, item, fn; i < array.length; ++i) {
            item = array[i];
            fn = finalizer;
            if (js.lang.Types.isString(fn)) {
                fn = item[fn];
            }
            if (js.lang.Types.isFunction(fn)) {
                fn.call(scope || item, item, i);
            }
            delete array[i]; // this hopefully will give a hint to garbage collector
        }
        array.length = 0;
    },

    /**
     * Returns true if this collection contains the specified value. Compare every this collection item with given value
     * using {@link #_equals} and returns true on first match.
     * 
     * @param Array array source array to search,
     * @param Object searchedValue, value to search for.
     * @return Boolean true only if this collection does include searched for value.
     * @assert searched value is not undefined.
     */
    contains : function (array, searchedValue) {
        $assert(js.lang.Types.isArray(array), "js.util.Arrays#contains", "Argument is not an array.");
        $assert(typeof searchedValue !== "undefined", "js.util.Arrays#contains", "Value to search is undefined or null.");
        for ( var i = 0, l = array.length; i < l; ++i) {
            if (this._equals(array[i], i, searchedValue)) {
                return true;
            }
        }
        return false;
    },

    /**
     * Equality test helper. Used internally to compare a given item with a value to match. Be aware that collection
     * does not differentiate a primitive value from its associated object, that is, "1" and new String("1") match. Also
     * two {@link Date} instances are equals if they have the same time value, even if actually different objects.
     * 
     * @param Object item, item to test for equality,
     * @param Number index, item index,
     * @param Object valueToMatch, value to match.
     * @return Boolean true if given item match value
     * @note <em>index</em> argument is not used. It is present only for compatibility with remove predicate
     *       signature.
     */
    _equals : function (item, index, valueToMatch) {
        if (item == null) {
            return valueToMatch == null;
        }
        if (valueToMatch == null) {
            return false;
        }
        if (js.lang.Types.isFunction(item.equals)) {
            return item.equals(valueToMatch);
        }
        return item.valueOf() === valueToMatch.valueOf();
    },

    /**
     * Collector iterator. This method works only on iterable containing objects. Iterates over all this iterable
     * objects and retrieve the value of named field. If given <em>memberName</em> argument denotes a method collect
     * the value returned by that method invocation. Note that the method should be a getter returning a value and no
     * arguments.
     * 
     * <pre>
     *	var ids = tasks.collect("id"); // task"s id field value
     *	var emails = persons.collect("getEmail"); // person"s email using getter method
     * </pre>
     * 
     * Returns empty array if this iterable items are not objects or does not have a member with requested name.
     * 
     * @param Array array source array to collect from,
     * @param String memberName the name of member to collect, field or getter.
     * @return Array array of properties collected.
     * @assert member name argument is not undefined, null or empty, every this iterable item is an {@link Object}
     *         possessing requested member.
     */
    collect : function (array, memberName) {
        $assert(js.lang.Types.isArray(array), "js.util.Arrays#collect", "Argument is not an array.");
        $assert(memberName, "js.util.Arrays#collect", "Member name is undefined, null or empty.");
        var a = [], it = new js.lang.Uniterator(array), item, value;
        while (it.hasNext()) {
            item = it.next();
            $assert(js.lang.Types.isObject(item), "js.util.Arrays#collect", "Item is not an object.");
            if (js.lang.Types.isObject(item)) {
                value = item[memberName];
                if (js.lang.Types.isFunction(value)) {
                    value = value.call(item);
                }
                $assert(typeof value !== "undefined", "js.util.Arrays#collect", "Value is undefined.");
                if (typeof value !== "undefined") {
                    a.push(value);
                }
            }
        }
        return a;
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.util.Arrays";
    }
};
$package("js.util");

/**
 * Generic cache. This class is a generic cache; it needs external factory method in order to become concrete instance.
 * Supplied factory method should have next signature:
 * 
 * <pre>
 * 	Object factoryMethod(Object key)
 * </pre>
 * 
 * It is invoked on cache miss and should return the value associated with the key. Note that null may be a valid value
 * for a key and undefined signal missing association.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * @constructor Construct cache instance.
 * 
 * @param Function factoryMethod values factory method.
 * @assert factory method argument is a {@link Function}.
 */
js.util.Cache = function (factoryMethod) {
    $assert(js.lang.Types.isFunction(factoryMethod), "js.util.Cache#Cache", "Factory method is not a function.");

    /**
     * Cache storage. Map of key/values.
     * 
     * @type Object
     */
    this._map = {};

    /**
     * Factory method. Used to create value on cache miss.
     * 
     * @type Function
     */
    this._factoryMethod = factoryMethod;
};

js.util.Cache.prototype = {
    /**
     * Retrieve value from cache. Returns the value associated with given key. Null is a valid key value; if key has no
     * associated value this getter returns undefined.
     * 
     * @param Object key key to uniquely identified the value.
     * @return Object key associated value.
     * @assert <em>key</em> argument is not undefined.
     */
    get : function (key) {
        $assert(typeof key !== "undefined", "js.util.Cache#get", "Undefined key.");
        // convert key to string before using it in order to avoid conditions like 1964 !== new Number(1964)
        key = key !== null ? key.toString() : "null";
        var value = this._map[key];
        if (typeof value !== "undefined") {
            return value;
        }
        value = this._factoryMethod(key);
        if (typeof value === "undefined") {
            return;
        }
        this._map[key] = value;
        return value;
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.util.Cache";
    }
};
$extends(js.util.Cache, Object);
$package("js.util");

/**
 * Application scope unique identifier. Returns an identifier guaranteed to be unique across application instance. This
 * class follows built-in objects usage pattern: if used with new operator construct an ID instance and when used as
 * function returns internal value as primitive.
 * 
 * <pre>
 * 	// used with new operator
 *	var id = new js.util.ID(); // create a new ID object, instance of js.util.ID
 *	var value = id.valueOf(); // ID value, primitive string value
 *
 *	// used as function
 *	var id = js.util.ID(); // ID value, primitive string value
 * </pre>
 * 
 * @constructor Construct ID instance. Initialize internal value to a new generated identifier value. If called as
 *              function initialized internal value is returned as a primitive string, the same value returned by
 *              {@link #valueOf()} method.
 */
js.util.ID = function () {
    ++js.util.ID._seed;

    /**
     * ID value. Note that it is a primitive string value not a {@link String} object.
     * 
     * @type String
     */
    this._value = js.util.ID._seed.toString(36);

    if (this === js.util) {
        // if used as function this points to package scope
        return this._value;
    }
};

/**
 * ID seed. ID values are generated in sequence using this seed as index.
 * 
 * @type Number
 */
js.util.ID._seed = 0;

js.util.ID.prototype = {
    /**
     * Get the primitive value of this ID instance.
     * 
     * @return String primitive value of this ID instance.
     */
    valueOf : function () {
        return this._value;
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.util.ID";
    }
};
$extends(js.util.ID, Object);
$package('js.util');

/**
 * Convenient pseudo-random integer value generator. Create random generator instance then use {@link #next} method to
 * get pseudo-random integer values.
 * 
 * <pre>
 *	var rand = new js.util.Rand(100, 200);
 *	var n = rand.next(); // get a number in range [100...200)
 * </pre>
 * 
 * Alternatively, one can use this class constructor as a function to directly get a single random numeric integer
 * value.
 * 
 * <pre>
 * 	var n = js.util.Rand(10); // get a number in range [0...10)
 * </pre>
 * 
 * Although distribution uniformity is guaranteed this class cannot generate unique values in given range - see
 * {@link #_next(Number,Number)}. Do not use this class for unique integer values.
 * 
 * @constructor Construct random generator instance. If used as function returns next pseudo-random integer value.
 *              Generated values range is controlled by <code>start</code> and <code>length</code> arguments. Every
 *              value is guaranteed to be greater or equals with start and strictly less than sum of start and length,
 *              i.e. [start...start+length). If only argument is supplied is considered to be value range, and start is
 *              zero. If both arguments are missing start is 0 and length is Number.MAX_VALUE.
 * 
 * @param Number... start optional starting value, 0 if missing,
 * @param Number... length optional length of the values' range, maximum number value if missing.
 */
js.util.Rand = function () {
    var start, length;

    if (arguments.length === 0) {
        start = 0;
        length = Number.MAX_VALUE;
    }
    else if (arguments.length === 1) {
        length = arguments[0];
        start = 0;
    }
    else {
        start = arguments[0];
        length = arguments[1];
    }

    /**
     * Range start value.
     * 
     * @type Number
     */
    this._start = start;

    /**
     * Range length.
     * 
     * @type Number
     */
    this._length = length;

    if (this === js.util) {
        // if used as function this points to package scope
        return js.util.Rand.prototype._next(this._start, this._length);
    }
};

js.util.Rand.prototype = {
    /**
     * Get next pseudo-random integer value.
     * 
     * @return Number random integer value in range controlled by constructor arguments.
     */
    next : function () {
        return this._next(this._start, this._length);
    },

    /**
     * Utility method for random integer generation in given range. This method generates a random integer value in
     * interval [start, start+length). Internally, this method uses a logic like this:
     * 
     * <pre>
     *  start + Math.floor(Math.random() * length)
     * </pre>
     * 
     * Now, because <code>Math.random() * length</code> generates real numbers with infinite possible values -
     * implementation has a finite number of possible values but large enough, and rounding process has a far less
     * number of possible values uniqueness in given range is not possible.
     * 
     * @param Number start range start,
     * @param Number length range length
     * @return Number random integer value.
     */
    _next : function (start, length) {
        return start + Math.floor(Math.random() * length);
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return 'js.util.Rand';
    }
};
$extends(js.util.Rand, Object);
$package('js.util');

/**
 * Handy methods for strings manipulations.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 */
js.util.Strings = {
    /**
     * Remove white spaces from string extremities. Recognized white spaces are: <table>
     * <tr>
     * <td>space</td>
     * <td>&nbsp;</td>
     * </tr>
     * <tr>
     * <td>tab</td>
     * <td>\t</td>
     * </tr>
     * <tr>
     * <td>carriage return</td>
     * <td>\r</td>
     * </tr>
     * <tr>
     * <td>new line</td>
     * <td>\n</td>
     * </tr>
     * <tr>
     * <td>form feed</td>
     * <td>\f</td>
     * </tr>
     * </table>
     * 
     * @param String str string to trim.
     * @return String trimed string.
     * @assert given string is not undefined, null or empty.
     */
    trim : function (str) {
        $assert(str, 'js.util.Strings#trim', 'String is undefined, null or empty.');
        return str.trim();
    },

    REGEXP_PATTERN : /([\/|\.|\*|\?|\||\(|\)|\[|\]|\{|\}|\\|\^|\$])/g,

    /**
     * Escape RegExp reserved characters. Prepare a string for usage with RegExp by prefixing all reserved characters
     * with backslash. Returns a string value derived from given string argument.
     * 
     * @param String str string to escape.
     * @return String a new string value usable in the context of a regular expression.
     * @assert given string is not undefined, null or empty.
     */
    escapeRegExp : function (str) {
        $assert(str, 'js.util.Strings#escapeRegExp', 'String is undefined, null or empty.');
        js.util.Strings.REGEXP_PATTERN.lastIndex = 0;
        return str.replace(js.util.Strings.REGEXP_PATTERN, '\\$1');
    },

    /**
     * Case insensitive strings equality test. If both string arguments are null or empty this predicate returns true
     * and false if even a single argument is undefined.
     * 
     * @param String reference string used as reference for comparison,
     * @param String target string to compare to.
     * @return Boolean only if string arguments are case insensitive equals.
     * @assert both arguments are not undefined.
     */
    equalsIgnoreCase : function (reference, target) {
        $assert(typeof reference !== 'undefined', 'js.util.Strings#equalsIgnoreCase', 'Undefined reference string.');
        if (typeof reference === 'undefined') {
            return false;
        }
        $assert(typeof target !== 'undefined', 'js.util.Strings#equalsIgnoreCase', 'Undefined target string.');
        if (typeof target === 'undefined') {
            return false;
        }

        if (reference == null && target == null) {
            return true;
        }
        if (reference == null || target == null) {
            return false;
        }
        return reference.toLocaleLowerCase() === target.toLocaleLowerCase();
    },

    /**
     * Prefix test. Test if given string starts with requested prefix. Comparison is case-sensitive. Returns false if
     * <em>str</em> is undefined, null or empty.
     * 
     * @param String str string to test for prefix presence,
     * @param String prefix string to test against.
     * @return Boolean true if <em>str</em> does start with <em>prefix</em>.
     * @assert <em>prefix</em> argument is not undefined, null or empty.
     */
    startsWith : function (str, prefix) {
        $assert(prefix, 'js.util.Strings#startsWith', 'Prefix is undefined, null or empty.');
        if (!str) {
            return false;
        }
        return str.indexOf(prefix) === 0;
    },

    /**
     * Suffix test. Test if string ends with given suffix. Comparison is case-sensitive. Returns false if <em>str</em>
     * is undefined, null or empty.
     * 
     * @param String str string to test for suffix presence,
     * @param String suffix string to test against.
     * @return Boolean true if <em>str</em> does end with <em>suffix</em>.
     * @assert <em>suffix</em> argument is not undefined, null or empty.
     */
    endsWith : function (str, suffix) {
        $assert(suffix, 'js.util.Strings#endsWith', 'Suffix is undefined, null or empty.');
        if (!str) {
            return false;
        }
        return (str.length >= suffix.length) && str.lastIndexOf(suffix) === str.length - suffix.length;
    },

    /**
     * Inclusion test. Test if string contains with given value. Comparison is case-sensitive. Returns false if
     * <em>str</em> is undefined, null or empty.
     * 
     * @param String str string to test for value inclusion,
     * @param String value string to test against.
     * @return Boolean true if <em>str</em> does include <em>value</em>.
     * @assert both arguments are not undefined, null or empty.
     */
    contains : function (str, value) {
        $assert(str, 'js.util.Strings#contains', 'String is undefined, null or empty.');
        $assert(value, 'js.util.Strings#contains', 'Value is undefined, null or empty.');
        return str ? str.indexOf(value) !== -1 : false;
    },

    /**
     * To title case. This string extension change the first letter to capital and the others to lower, i.e. title case.
     * Return empty string if given string argument is undefined, null or empty.
     * 
     * @param String str string to convert.
     * @return String the new converted string.
     * @assert given string is not undefined, null or empty.
     */
    toTitleCase : function (str) {
        $assert(str, 'js.util.Strings#toTitleCase', 'String is undefined, null or empty.');
        return str ? (str.charAt(0).toUpperCase() + str.substr(1).toLowerCase()) : '';
    },

    /**
     * To hyphen case. Convert camel to hyphen case, that is replace upper case with hyphen followed by lower case.
     * Anyway, first character is forced to lower case and not prefixed by hyphen, see example below.
     * 
     * <pre>
     * 	toHyphenCase -> to-hyphen-case
     * 	ToHyphenCase -> to-hyphen-case
     * </pre>
     * 
     * Return empty string if given string argument is undefined, null or empty.
     * 
     * @param String str string to convert.
     * @return String newly created hyphen case string.
     * @assert given string is not undefined, null or empty.
     */
    toHyphenCase : function (str) {
        $assert(str, 'js.util.Strings#toHyphenCase', 'String is undefined, null or empty.');
        if (!str) {
            return '';
        }
        var s = str.charAt(0).toLowerCase();
        s += str.substr(1).replace(/([A-Z][^A-Z]*)/g, function ($0, $1) {
            return '-' + $1.toLowerCase();
        });
        return s;
    },

    /**
     * To script case. Convert hyphened CSS style names to camel case suitable for script, e.g. get-user-name become
     * getUserName. This method can also be used for CSS style names to script conversion; also takes care of float -
     * convert to cssFloat or styleFloat depending on layout engine. Return empty string if given string argument is
     * undefined, null or empty.
     * 
     * @param String str string to convert.
     * @return String the new converted string.
     * @assert given string is not undefined, null or empty.
     */
    toScriptCase : function (str) {
        $assert(str, 'js.util.Strings#toScriptCase', 'String is undefined, null or empty.');
        if (!str) {
            return '';
        }
        if (str.valueOf() == 'float') {
            return js.ua.Engine.TRIDENT ? 'styleFloat' : 'cssFloat';
        }
        if (str.indexOf('-') === -1) {
            return str.valueOf();
        }
        return str.replace(/\-(\w)/g, function ($0, $1) {
            return $1.toUpperCase();
        });
    },

    /**
     * Chars count. Returns the number of occurrence of requested character. Returns 0 if string to scan is undefined,
     * null or empty.
     * 
     * @param String str string to scan for character occurrence,
     * @param String ch character to count.
     * @return Number the number of character occurrence in string.
     * @assert both arguments are not undefined, null or empty.
     */
    charsCount : function (str, ch) {
        $assert(str, 'js.util.Strings#charsCount', 'String is undefined, null or empty.');
        $assert(ch, 'js.util.Strings#charsCount', 'Character is undefined, null or empty.');
        if (!str) {
            return 0;
        }
        var count = 0;
        for ( var i = 0; i < str.length; ++i) {
            if (str.charAt(i) === ch) {
                ++count;
            }
        }
        return count;
    },

    /**
     * Get substring after separator.
     * 
     * @param String str source string,
     * @param String separator separator string.
     * @return String substring after separator.
     */
    last : function (str, separator) {
        return str.substr(str.lastIndexOf(separator) + 1);
    },

    /**
     * Valid package name pattern. Note that, in order to reuse code, this constant is an alias to
     * {@link js.lang.Operator._PACKAGE_NAME_REX}.
     * 
     * @type RexExp
     */
    _PACKAGE_NAME_REX : js.lang.Operator._PACKAGE_NAME_REX,

    /**
     * Test if name is a valid package name.
     * 
     * @param String name name to test.
     * @return Boolean true only if name is a valid package name.
     */
    isPackageName : function (name) {
        this._PACKAGE_NAME_REX.lastIndex = 0;
        return name && this._PACKAGE_NAME_REX.test(name);
    },

    /**
     * Valid class name pattern. Note that, in order to reuse code, this constant is an alias to
     * {@link js.lang.Operator._CLASS_NAME_REX}.
     * 
     * @type RexExp
     */
    _CLASS_NAME_REX : js.lang.Operator._CLASS_NAME_REX,

    /**
     * Test if string is a qualified class name.
     * 
     * @param String name name to test.
     * @return Boolean true only if name is a string and follows qualified class name pattern.
     */
    isQualifiedClassName : function (name) {
        this._CLASS_NAME_REX.lastIndex = 0;
        return name && this._CLASS_NAME_REX.test(name);
    },

    /**
     * Parse given string for name / value pairs separated by semicolon. Name and value are separated by colon.
     * 
     * @param String expression expression to parse.
     * @return Array array of name / value pairs.
     */
    parseNameValues : function (expression) {
        // sample expression: "name0:value0;name1:value1;"

        $assert(expression, "js.util.Strings#parseNameValues", "Expression argument is undefined, null or empty.");
        var pairs = [];
        if (!expression) {
            return pairs;
        }

        var semicolonIndex = 0, colonIndex, name;
        for (;;) {
            colonIndex = expression.indexOf(':', semicolonIndex);
            if (colonIndex === -1) {
                break;
            }
            name = expression.substring(semicolonIndex, colonIndex);

            ++colonIndex;
            semicolonIndex = expression.indexOf(';', colonIndex);
            if (semicolonIndex === -1) {
                semicolonIndex = expression.length;
            }
            $assert(colonIndex !== semicolonIndex, "js.util.Strings#parseNameValues", "Invalid expression |%s|. Empty value near |%s|.", expression, name);

            pairs.push({
                name : name,
                value : expression.substring(colonIndex, semicolonIndex)
            });
            ++semicolonIndex;
        }

        $assert(pairs.length > 0, "js.util.Strings#parseNameValues", "Invalid expression |%s|. Missing pair separator.", expression);
        return pairs;
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return 'js.util.Strings';
    }
};

/**
 * IE miss trim support from built-in String.
 */
$legacy(js.ua.Engine.TRIDENT, function () {
    js.util.Strings.TRIM_PATTERN = /^\s+|\s+$/g;

    js.util.Strings.trim = function (str) {
        $assert(str, 'js.util.Strings#trim', 'String is undefined, null or empty.');
        js.util.Strings.TRIM_PATTERN.lastIndex = 0;
        return str.replace(js.util.Strings.TRIM_PATTERN, '');
    };
});
$package('js.util');

/**
 * One-shot timer. Support both instantiation with new operator and invocation like function. If used as function
 * creates a timeout object, set its callback and return it after starting.
 * 
 * <p>
 * Usage with new operator:
 * 
 * <pre>
 * 	var t = new js.util.Timeout(1000, this._onTimeout, this);
 * 	t.setCallback(this._onTimeout, this); // alternative callback setter
 * 	t.start();
 *	. . .
 *	t.stop(); // stop used to cancel pending timeout
 * </pre>
 * 
 * <p>
 * Function invocation usage:
 * 
 * <pre>
 * 	var t = js.util.Timeout(1000, this._onTimeout, this);
 *	. . .
 *	t.stop(); // stop used to cancel pending timeout
 * </pre>
 * 
 * Please note that when used as a function timeout is started automatically. If timeout should start at some point in
 * the future use new operator.
 * 
 * @constructor Construct timer instance. If this constructor is used as function returns created timer instance.
 * 
 * @param Number timeout, timeout value, in milliseconds,
 * @param Function callback, function to be called when timeout expires,
 * @param Object scope, callback execution scope.
 * @assert <em>timeout</em> argument is present and is a Number.
 */
js.util.Timeout = function(timeout, callback, scope) {
	$assert(js.lang.Types.isNumber(timeout), 'js.util.Timeout#Timeout', 'Timeout is not a number.');
	if (!(this instanceof js.util.Timeout)) {
		// if constructor invoked as function this points to package scope
		var t = new js.util.Timeout(timeout, callback, scope);
		t.start();
		return t;
	}
	this.$super(timeout, callback, scope);
};

js.util.Timeout.prototype = {
	/**
	 * Implements {@link js.util.AbstractTimer#_start}.
	 * 
	 * @param Function handler
	 * @param Number value
	 * @return Object
	 */
	_start : function(handler, value) {
		return window.setTimeout(handler, value);
	},

	/**
	 * Implements {@link js.util.AbstractTimer#_stop}.
	 * 
	 * @param Object timerID
	 */
	_stop : function(timerID) {
		window.clearTimeout(timerID);
	},

	/**
	 * Implements {@link js.util.AbstractTimer#_tick}.
	 */
	_tick : function() {
		this._id = null;
	},

	/**
	 * Returns a string representation of the object.
	 * 
	 * @return String object string representation.
	 */
	toString : function() {
		return 'js.util.Timeout';
	}
};
$extends(js.util.Timeout, js.util.AbstractTimer);
$package('js.util');

/**
 * Periodic timer. Supports both instantiation with new operator and invocation like function. If used as function
 * creates a timer object, set its callback and return it after starting.
 * 
 * <p>
 * Usage with new operator:
 * 
 * <pre>
 * 	var t = new js.util.Timer(1000, this._onTimer, this);
 * 	t.setCallback(this._onTimer, this); // alternative callback setter
 * 	t.start();
 *	. . .
 *	t.stop(); // stop used to cancel pending timer
 * </pre>
 * 
 * <p>
 * Function invocation usage:
 * 
 * <pre>
 * 	var t = js.util.Timer(1000, this._onTimer, this);
 *	. . .
 *	t.stop(); // stop used to cancel pending timeout
 * </pre>
 * 
 * Please note that when used as a function timer is started automatically. If timer should start at some point in the
 * future use new operator.
 * 
 * @constructor
 * 
 * @param Number interval, timer interval, in milliseconds,
 * @param Function callback, function to invoke on every tick,
 * @param Object scope, callback execution scope.
 */
js.util.Timer = function(interval, callback, scope) {
	$assert(js.lang.Types.isNumber(interval), 'js.util.Timer#Timer', 'Interval is not a number.');

	if (!(this instanceof js.util.Timer)) {
		var t = new js.util.Timer(interval, callback, scope);
		t.start();
		return t;
	}

	this.$super(interval, callback, scope);
};

js.util.Timer.prototype = {
	/**
	 * Implements {@link js.util.AbstractTimer#_start}.
	 * 
	 * @param Function handler
	 * @param Number value
	 * @return Object
	 */
	_start : function(handler, value) {
		return window.setInterval(handler, value);
	},

	/**
	 * Implements {@link js.util.AbstractTimer#_stop}.
	 * 
	 * @param Object timerID
	 */
	_stop : function(timerID) {
		window.clearInterval(timerID);
	},

	/**
	 * Returns a string representation of the object.
	 * 
	 * @return String object string representation.
	 */
	toString : function() {
		return 'js.util.Timer';
	}
};
$extends(js.util.Timer, js.util.AbstractTimer);
$package("js.util");

/**
 * A class that represents an universally unique identifier. Produced value follows recommendation of RFC4122, version
 * 4. Uses an 3-pty algorithm.
 * 
 * <pre>
 *	Math.uuid.js (v1.4)
 *	http://www.broofa.com
 *	mailto:robert@broofa.com
 *	Copyright (c) 2010 Robert Kieffer
 *	Dual licensed under the MIT and GPL licenses.
 * </pre>
 * 
 * This class follows built-in objects usage pattern: if used with new operator construct an UUID instance and when used
 * as function returns internal value as primitive.
 * 
 * <pre>
 * 	// used with new operator
 *	var uuid = new js.util.UUID(); // create a new UUID object, instance of js.util.UUID
 *	var value = uuid.valueOf(); // UUID value, primitive string value
 *
 *	// used as function
 *	var uuid = js.util.UUID(); // UUID value, primitive string value
 * </pre>
 * 
 * @author Iulian Rotaru
 * 
 * @constructor Construct UUID object. Initialize its internal value to a new random generated UUID. If called as
 *              function initialized internal value is returned as a primitive string, the same value returned by
 *              {@link #valueOf} method.
 */
js.util.UUID = function () {
    var uuid = [], chars = js.util.UUID.CHARS;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // fill in random data
    // at i==19 set the high bits of clock sequence as per rfc4122, sec. 4.1.5
    for ( var i = 0, r; i < 36; i++) {
        if (!uuid[i]) {
            r = 0 | Math.random() * 16;
            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
    }

    /**
     * Random UUID value. Note that it is a primitive string value not a {@link String} object.
     * 
     * @type String
     */
    this._value = uuid.join('');

    if (this === js.util) {
        // if used as function this points to package scope
        return this._value;
    }
};

/**
 * Symbols dictionary used for UUID generation.
 * 
 * @type Array
 */
js.util.UUID.CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split('');

js.util.UUID.prototype = {
    /**
     * Get the primitive value of this UUID instance.
     * 
     * @return String primitive value of this UUID instance.
     */
    valueOf : function () {
        return this._value;
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.util.UUID";
    }
};
$extends(js.util.UUID, Object);
