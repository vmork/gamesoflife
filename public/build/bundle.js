
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.0' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    let _rules = {
        from0: {
            default: 0,
            to: {
                to1: {1: [3]} // go from 0 to 1 if (number of neighbors with state==1) == 3
            }
        },
        from1: {
            default: 1,
            to: {
                to0: {1: [0,1,4,5,6,7,8]}
            }
        }
    };

    let rows = writable(50);
    let cols = writable(50);
    let speed = writable(1);
    let nStates = writable(2);
    let rules = writable(_rules);
    // export let defaultRules = writable(_rules)

    /* src/Settings.svelte generated by Svelte v3.44.0 */

    const { Object: Object_1$1, console: console_1$1 } = globals;
    const file$1 = "src/Settings.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i][0];
    	child_ctx[20] = list[i][1];
    	child_ctx[21] = list;
    	child_ctx[22] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i][0];
    	child_ctx[24] = list[i][1];
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[27] = list[i][0];
    	child_ctx[28] = list[i][1];
    	return child_ctx;
    }

    // (107:8) {#if !expand[fromState]}
    function create_if_block(ctx) {
    	let ul;
    	let li;
    	let t0;
    	let input;
    	let t1;
    	let mounted;
    	let dispose;

    	function input_input_handler() {
    		/*input_input_handler*/ ctx[14].call(input, /*each_value*/ ctx[21], /*each_index*/ ctx[22]);
    	}

    	let each_value_1 = Object.entries(/*valFrom*/ ctx[20].to);
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			li = element("li");
    			t0 = text("Default: ");
    			input = element("input");
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(input, "type", "number");
    			attr_dev(input, "class", "svelte-1srh46e");
    			add_location(input, file$1, 108, 25, 3993);
    			add_location(li, file$1, 108, 12, 3980);
    			attr_dev(ul, "class", "svelte-1srh46e");
    			add_location(ul, file$1, 107, 8, 3962);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);
    			append_dev(ul, li);
    			append_dev(li, t0);
    			append_dev(li, input);
    			set_input_value(input, /*valFrom*/ ctx[20].default);
    			append_dev(ul, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			if (!mounted) {
    				dispose = listen_dev(input, "input", input_input_handler);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*Object, $rules*/ 4 && to_number(input.value) !== /*valFrom*/ ctx[20].default) {
    				set_input_value(input, /*valFrom*/ ctx[20].default);
    			}

    			if (dirty & /*Object, $rules, parseRuleInput, expand, toggleExpand*/ 198) {
    				each_value_1 = Object.entries(/*valFrom*/ ctx[20].to);
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(107:8) {#if !expand[fromState]}",
    		ctx
    	});

    	return block;
    }

    // (115:16) {#if !expand[fromState + toState]}
    function create_if_block_1(ctx) {
    	let ul;
    	let each_value_2 = Object.entries(/*valTo*/ ctx[24]);
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "svelte-1srh46e");
    			add_location(ul, file$1, 115, 16, 4353);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*Object, $rules, parseRuleInput*/ 132) {
    				each_value_2 = Object.entries(/*valTo*/ ctx[24]);
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(115:16) {#if !expand[fromState + toState]}",
    		ctx
    	});

    	return block;
    }

    // (117:20) {#each Object.entries(valTo) as [neighborState, required]}
    function create_each_block_2$1(ctx) {
    	let li;
    	let span;
    	let t0_value = /*neighborState*/ ctx[27] + "";
    	let t0;
    	let t1;
    	let input;
    	let input_value_value;
    	let t2;
    	let mounted;
    	let dispose;

    	function input_handler(...args) {
    		return /*input_handler*/ ctx[16](/*fromState*/ ctx[19], /*toState*/ ctx[23], /*neighborState*/ ctx[27], ...args);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = text(": \r\n                        ");
    			input = element("input");
    			t2 = space();
    			attr_dev(input, "type", "text");
    			input.value = input_value_value = /*required*/ ctx[28] + (/*required*/ ctx[28].length ? "," : "");
    			attr_dev(input, "class", "svelte-1srh46e");
    			add_location(input, file$1, 120, 24, 4587);
    			attr_dev(span, "class", "no-pointer svelte-1srh46e");
    			add_location(span, file$1, 118, 24, 4493);
    			add_location(li, file$1, 117, 24, 4463);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, span);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, input);
    			append_dev(li, t2);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", input_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*Object, $rules*/ 4 && t0_value !== (t0_value = /*neighborState*/ ctx[27] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*Object, $rules*/ 4 && input_value_value !== (input_value_value = /*required*/ ctx[28] + (/*required*/ ctx[28].length ? "," : "")) && input.value !== input_value_value) {
    				prop_dev(input, "value", input_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(117:20) {#each Object.entries(valTo) as [neighborState, required]}",
    		ctx
    	});

    	return block;
    }

    // (110:12) {#each Object.entries(valFrom.to) as [toState, valTo]}
    function create_each_block_1$1(ctx) {
    	let li;
    	let span;
    	let t0;
    	let t1_value = /*toState*/ ctx[23].slice(-1) + "";
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[15](/*fromState*/ ctx[19], /*toState*/ ctx[23]);
    	}

    	let if_block = !/*expand*/ ctx[1][/*fromState*/ ctx[19] + /*toState*/ ctx[23]] && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			li = element("li");
    			span = element("span");
    			t0 = text("To ");
    			t1 = text(t1_value);
    			t2 = text(":");
    			t3 = space();
    			if (if_block) if_block.c();
    			t4 = space();
    			attr_dev(span, "class", "svelte-1srh46e");
    			add_location(span, file$1, 111, 16, 4156);
    			add_location(li, file$1, 110, 16, 4134);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, span);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    			append_dev(li, t3);
    			if (if_block) if_block.m(li, null);
    			append_dev(li, t4);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*Object, $rules*/ 4 && t1_value !== (t1_value = /*toState*/ ctx[23].slice(-1) + "")) set_data_dev(t1, t1_value);

    			if (!/*expand*/ ctx[1][/*fromState*/ ctx[19] + /*toState*/ ctx[23]]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(li, t4);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(110:12) {#each Object.entries(valFrom.to) as [toState, valTo]}",
    		ctx
    	});

    	return block;
    }

    // (102:4) {#each Object.entries($rules) as [fromState, valFrom]}
    function create_each_block$1(ctx) {
    	let li;
    	let span;
    	let t0;
    	let t1_value = /*fromState*/ ctx[19].slice(-1) + "";
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[13](/*fromState*/ ctx[19]);
    	}

    	let if_block = !/*expand*/ ctx[1][/*fromState*/ ctx[19]] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			li = element("li");
    			span = element("span");
    			t0 = text("From ");
    			t1 = text(t1_value);
    			t2 = text(":");
    			t3 = space();
    			if (if_block) if_block.c();
    			t4 = space();
    			attr_dev(span, "class", "svelte-1srh46e");
    			add_location(span, file$1, 103, 8, 3811);
    			add_location(li, file$1, 102, 8, 3797);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, span);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    			append_dev(li, t3);
    			if (if_block) if_block.m(li, null);
    			append_dev(li, t4);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*Object, $rules*/ 4 && t1_value !== (t1_value = /*fromState*/ ctx[19].slice(-1) + "")) set_data_dev(t1, t1_value);

    			if (!/*expand*/ ctx[1][/*fromState*/ ctx[19]]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(li, t4);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(102:4) {#each Object.entries($rules) as [fromState, valFrom]}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let main;
    	let div0;
    	let t0;
    	let input0;
    	let t1;
    	let t2;
    	let t3;
    	let div1;
    	let t4;
    	let input1;
    	let t5;
    	let input2;
    	let t6;
    	let div2;
    	let t7;
    	let input3;
    	let t8;
    	let div5;
    	let div4;
    	let h1;
    	let t10;
    	let div3;
    	let button0;
    	let t12;
    	let button1;
    	let t14;
    	let ul;
    	let mounted;
    	let dispose;
    	let each_value = Object.entries(/*$rules*/ ctx[2]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			div0 = element("div");
    			t0 = text("Animation speed: ");
    			input0 = element("input");
    			t1 = space();
    			t2 = text(/*$speed*/ ctx[3]);
    			t3 = space();
    			div1 = element("div");
    			t4 = text("Rows: ");
    			input1 = element("input");
    			t5 = text("\r\n        Cols: ");
    			input2 = element("input");
    			t6 = space();
    			div2 = element("div");
    			t7 = text("Number of states: ");
    			input3 = element("input");
    			t8 = space();
    			div5 = element("div");
    			div4 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Rules:";
    			t10 = space();
    			div3 = element("div");
    			button0 = element("button");
    			button0.textContent = "Reset";
    			t12 = space();
    			button1 = element("button");
    			button1.textContent = "Randomize";
    			t14 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(input0, "type", "range");
    			attr_dev(input0, "min", "0.1");
    			attr_dev(input0, "max", "50");
    			attr_dev(input0, "step", "0.05");
    			attr_dev(input0, "class", "svelte-1srh46e");
    			add_location(input0, file$1, 78, 25, 2986);
    			attr_dev(div0, "class", "setting svelte-1srh46e");
    			add_location(div0, file$1, 77, 4, 2938);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "max", "250");
    			attr_dev(input1, "class", "svelte-1srh46e");
    			add_location(input1, file$1, 81, 14, 3115);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "max", "250");
    			attr_dev(input2, "class", "svelte-1srh46e");
    			add_location(input2, file$1, 82, 14, 3179);
    			attr_dev(div1, "class", "setting svelte-1srh46e");
    			add_location(div1, file$1, 80, 4, 3078);
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "min", "2");
    			attr_dev(input3, "max", "5");
    			attr_dev(input3, "class", "svelte-1srh46e");
    			add_location(input3, file$1, 85, 26, 3294);
    			attr_dev(div2, "class", "setting svelte-1srh46e");
    			add_location(div2, file$1, 84, 4, 3245);
    			attr_dev(h1, "class", "svelte-1srh46e");
    			add_location(h1, file$1, 89, 8, 3433);
    			add_location(button0, file$1, 91, 12, 3493);
    			add_location(button1, file$1, 94, 12, 3583);
    			attr_dev(div3, "class", "buttons svelte-1srh46e");
    			add_location(div3, file$1, 90, 8, 3458);
    			attr_dev(div4, "class", "top-row svelte-1srh46e");
    			add_location(div4, file$1, 88, 6, 3402);
    			attr_dev(ul, "class", "no-pad svelte-1srh46e");
    			add_location(ul, file$1, 100, 4, 3708);
    			attr_dev(div5, "class", "rules-section svelte-1srh46e");
    			add_location(div5, file$1, 87, 4, 3367);
    			add_location(main, file$1, 76, 0, 2926);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			append_dev(div0, t0);
    			append_dev(div0, input0);
    			set_input_value(input0, /*$speed*/ ctx[3]);
    			append_dev(div0, t1);
    			append_dev(div0, t2);
    			append_dev(main, t3);
    			append_dev(main, div1);
    			append_dev(div1, t4);
    			append_dev(div1, input1);
    			set_input_value(input1, /*$rows*/ ctx[4]);
    			append_dev(div1, t5);
    			append_dev(div1, input2);
    			set_input_value(input2, /*$cols*/ ctx[5]);
    			append_dev(main, t6);
    			append_dev(main, div2);
    			append_dev(div2, t7);
    			append_dev(div2, input3);
    			set_input_value(input3, /*$nStates*/ ctx[0]);
    			append_dev(main, t8);
    			append_dev(main, div5);
    			append_dev(div5, div4);
    			append_dev(div4, h1);
    			append_dev(div4, t10);
    			append_dev(div4, div3);
    			append_dev(div3, button0);
    			append_dev(div3, t12);
    			append_dev(div3, button1);
    			append_dev(div5, t14);
    			append_dev(div5, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "change", /*input0_change_input_handler*/ ctx[9]),
    					listen_dev(input0, "input", /*input0_change_input_handler*/ ctx[9]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[10]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[11]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[12]),
    					listen_dev(button0, "click", resetRules, false, false, false),
    					listen_dev(button1, "click", /*randomRules*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$speed*/ 8) {
    				set_input_value(input0, /*$speed*/ ctx[3]);
    			}

    			if (dirty & /*$speed*/ 8) set_data_dev(t2, /*$speed*/ ctx[3]);

    			if (dirty & /*$rows*/ 16 && to_number(input1.value) !== /*$rows*/ ctx[4]) {
    				set_input_value(input1, /*$rows*/ ctx[4]);
    			}

    			if (dirty & /*$cols*/ 32 && to_number(input2.value) !== /*$cols*/ ctx[5]) {
    				set_input_value(input2, /*$cols*/ ctx[5]);
    			}

    			if (dirty & /*$nStates*/ 1 && to_number(input3.value) !== /*$nStates*/ ctx[0]) {
    				set_input_value(input3, /*$nStates*/ ctx[0]);
    			}

    			if (dirty & /*Object, $rules, parseRuleInput, expand, toggleExpand*/ 198) {
    				each_value = Object.entries(/*$rules*/ ctx[2]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function sameOrDefault(prev, def) {
    }

    function randomInt(min, max) {
    	return Math.max(Math.floor(Math.random() * max), min);
    }

    function listRange(n) {
    	return [...Array(n)].map((_el, i) => i);
    }

    function resetRules() {
    	
    } // console.log($defaultRules)
    // $rules = $defaultRules

    function instance$1($$self, $$props, $$invalidate) {
    	let $nStates;
    	let $rules;
    	let $speed;
    	let $rows;
    	let $cols;
    	validate_store(nStates, 'nStates');
    	component_subscribe($$self, nStates, $$value => $$invalidate(0, $nStates = $$value));
    	validate_store(rules, 'rules');
    	component_subscribe($$self, rules, $$value => $$invalidate(2, $rules = $$value));
    	validate_store(speed, 'speed');
    	component_subscribe($$self, speed, $$value => $$invalidate(3, $speed = $$value));
    	validate_store(rows, 'rows');
    	component_subscribe($$self, rows, $$value => $$invalidate(4, $rows = $$value));
    	validate_store(cols, 'cols');
    	component_subscribe($$self, cols, $$value => $$invalidate(5, $cols = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Settings', slots, []);
    	let expand = {};

    	function toggleExpand(key) {
    		if (!expand[key]) {
    			$$invalidate(1, expand[key] = true, expand);
    		} else {
    			$$invalidate(1, expand[key] = !expand[key], expand);
    		}

    		console.log(key);
    	}

    	function parseRuleInput(e, from, to, neighbor) {
    		let val = e.target.value;
    		let newRule = val.split(",").filter(el => el != "" && !isNaN(Number(el))).map(num => Number(num));
    		set_store_value(rules, $rules[from].to[to][neighbor] = newRule, $rules);
    	}

    	function randomRules() {
    		for (let [fromState, fromVal] of Object.entries($rules)) {
    			for (let [toState, toVal] of Object.entries(fromVal.to)) {
    				for (let [nNeighbors, required] of Object.entries(toVal)) {
    					let allowed = [1, 2, 3, 4, 5, 6, 7, 8];
    					let randomRule = [];

    					listRange(randomInt(0, 8)).forEach(() => {
    						let num = allowed[randomInt(0, allowed.length)];
    						allowed = allowed.filter(el => el != num);
    						randomRule.push(num);
    					});

    					set_store_value(rules, $rules[fromState].to[toState][nNeighbors] = randomRule, $rules);
    				}
    			}
    		}
    	}

    	const getRules = () => {
    		return $rules;
    	};

    	const setRules = newRules => {
    		set_store_value(rules, $rules = newRules, $rules);
    	};

    	const writable_props = [];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Settings> was created with unknown prop '${key}'`);
    	});

    	function input0_change_input_handler() {
    		$speed = to_number(this.value);
    		speed.set($speed);
    	}

    	function input1_input_handler() {
    		$rows = to_number(this.value);
    		rows.set($rows);
    	}

    	function input2_input_handler() {
    		$cols = to_number(this.value);
    		cols.set($cols);
    	}

    	function input3_input_handler() {
    		$nStates = to_number(this.value);
    		nStates.set($nStates);
    	}

    	const click_handler = fromState => toggleExpand(fromState);

    	function input_input_handler(each_value, each_index) {
    		each_value[each_index][1].default = to_number(this.value);
    	}

    	const click_handler_1 = (fromState, toState) => toggleExpand(fromState + toState);
    	const input_handler = (fromState, toState, neighborState, e) => parseRuleInput(e, fromState, toState, neighborState);

    	$$self.$capture_state = () => ({
    		rules,
    		speed,
    		rows,
    		cols,
    		nStates,
    		expand,
    		toggleExpand,
    		parseRuleInput,
    		sameOrDefault,
    		randomInt,
    		listRange,
    		randomRules,
    		resetRules,
    		getRules,
    		setRules,
    		$nStates,
    		$rules,
    		$speed,
    		$rows,
    		$cols
    	});

    	$$self.$inject_state = $$props => {
    		if ('expand' in $$props) $$invalidate(1, expand = $$props.expand);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*Object, $nStates*/ 1) {
    			{
    				// detta suger lite (mycket)
    				let oldRules = getRules();

    				let newRules = {};
    				let decremented = Object.keys(oldRules).length > $nStates;
    				let range = [...Array($nStates)].map((_el, i) => i);

    				range.forEach(from => {
    					newRules[`from${from}`] = oldRules[`from${from}`] || { default: from, to: {} };
    					console.log(from);

    					range.forEach(to => {
    						if (from === to) {
    							return;
    						}

    						console.log(from);
    						newRules[`from${from}`].to[`to${to}`] = newRules[`from${from}`].to[`to${to}`] || {};

    						range.forEach(neighbors => {
    							newRules[`from${from}`].to[`to${to}`][neighbors] = newRules[`from${from}`].to[`to${to}`][neighbors] || [];

    							if (decremented) {
    								delete newRules[`from${from}`].to[`to${to}`][$nStates];
    							}
    						});
    					});

    					if (decremented) {
    						delete newRules[`from${from}`].to[`to${$nStates}`];
    					}
    				});

    				setRules(newRules);
    			}
    		}
    	};

    	return [
    		$nStates,
    		expand,
    		$rules,
    		$speed,
    		$rows,
    		$cols,
    		toggleExpand,
    		parseRuleInput,
    		randomRules,
    		input0_change_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		click_handler,
    		input_input_handler,
    		click_handler_1,
    		input_handler
    	];
    }

    class Settings extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Settings",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.44.0 */

    const { Object: Object_1, console: console_1 } = globals;
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[25] = list[i];
    	child_ctx[27] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[28] = list[i];
    	child_ctx[30] = i;
    	return child_ctx;
    }

    // (117:5) {#each row as cell, k}
    function create_each_block_2(ctx) {
    	let div;
    	let div_class_value;
    	let mounted;
    	let dispose;

    	function mouseenter_handler(...args) {
    		return /*mouseenter_handler*/ ctx[14](/*j*/ ctx[27], /*k*/ ctx[30], ...args);
    	}

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[15](/*j*/ ctx[27], /*k*/ ctx[30], ...args);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(`cell state-${/*cell*/ ctx[28]}`) + " svelte-vd2bmw"));
    			add_location(div, file, 117, 6, 3165);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "mouseenter", mouseenter_handler, false, false, false),
    					listen_dev(div, "click", click_handler, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*grid*/ 1 && div_class_value !== (div_class_value = "" + (null_to_empty(`cell state-${/*cell*/ ctx[28]}`) + " svelte-vd2bmw"))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(117:5) {#each row as cell, k}",
    		ctx
    	});

    	return block;
    }

    // (115:3) {#each grid as row, j}
    function create_each_block_1(ctx) {
    	let div;
    	let t;
    	let each_value_2 = /*row*/ ctx[25];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			attr_dev(div, "class", "row svelte-vd2bmw");
    			add_location(div, file, 115, 4, 3113);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*grid, hanldeClickOrDrag*/ 129) {
    				each_value_2 = /*row*/ ctx[25];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, t);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(115:3) {#each grid as row, j}",
    		ctx
    	});

    	return block;
    }

    // (134:4) {#each states as state}
    function create_each_block(ctx) {
    	let div1;
    	let div0;
    	let div0_class_value;
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[16](/*state*/ ctx[22]);
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t = space();
    			attr_dev(div0, "class", div0_class_value = "" + (null_to_empty(`state-${/*state*/ ctx[22]} color-box`) + " svelte-vd2bmw"));
    			add_location(div0, file, 135, 6, 3772);
    			attr_dev(div1, "class", "svelte-vd2bmw");
    			toggle_class(div1, "active", /*drawingState*/ ctx[3] === /*state*/ ctx[22]);
    			add_location(div1, file, 134, 5, 3684);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t);

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*states*/ 4 && div0_class_value !== (div0_class_value = "" + (null_to_empty(`state-${/*state*/ ctx[22]} color-box`) + " svelte-vd2bmw"))) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (dirty & /*drawingState, states*/ 12) {
    				toggle_class(div1, "active", /*drawingState*/ ctx[3] === /*state*/ ctx[22]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(134:4) {#each states as state}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let div3;
    	let div0;
    	let t0;
    	let div2;
    	let button0;
    	let t1_value = (/*running*/ ctx[1] ? "Pause" : "Play") + "";
    	let t1;
    	let button0_class_value;
    	let t2;
    	let button1;
    	let t4;
    	let button2;
    	let t6;
    	let div1;
    	let t7;
    	let div4;
    	let settings;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*grid*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*states*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	settings = new Settings({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			div3 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t0 = space();
    			div2 = element("div");
    			button0 = element("button");
    			t1 = text(t1_value);
    			t2 = space();
    			button1 = element("button");
    			button1.textContent = "Reset";
    			t4 = space();
    			button2 = element("button");
    			button2.textContent = "Random";
    			t6 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t7 = space();
    			div4 = element("div");
    			create_component(settings.$$.fragment);
    			attr_dev(div0, "class", "grid svelte-vd2bmw");
    			add_location(div0, file, 113, 2, 3023);
    			attr_dev(button0, "class", button0_class_value = "" + (null_to_empty(/*running*/ ctx[1] ? "red" : "green") + " svelte-vd2bmw"));
    			add_location(button0, file, 127, 3, 3414);
    			add_location(button1, file, 130, 3, 3527);
    			add_location(button2, file, 131, 3, 3574);
    			attr_dev(div1, "class", "draw-settings svelte-vd2bmw");
    			add_location(div1, file, 132, 3, 3623);
    			attr_dev(div2, "class", "grid-controls svelte-vd2bmw");
    			add_location(div2, file, 126, 2, 3383);
    			attr_dev(div3, "class", "main-area svelte-vd2bmw");
    			add_location(div3, file, 112, 1, 2997);
    			attr_dev(div4, "class", "settings-area svelte-vd2bmw");
    			add_location(div4, file, 141, 1, 3871);
    			attr_dev(main, "class", "svelte-vd2bmw");
    			add_location(main, file, 111, 0, 2989);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div3);
    			append_dev(div3, div0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			append_dev(div2, button0);
    			append_dev(button0, t1);
    			append_dev(div2, t2);
    			append_dev(div2, button1);
    			append_dev(div2, t4);
    			append_dev(div2, button2);
    			append_dev(div2, t6);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(main, t7);
    			append_dev(main, div4);
    			mount_component(settings, div4, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "keydown", /*keydown_handler*/ ctx[13], false, false, false),
    					listen_dev(div0, "mousedown", mousedown_handler, false, false, false),
    					listen_dev(button0, "click", /*playPause*/ ctx[4], false, false, false),
    					listen_dev(button1, "click", /*resetGrid*/ ctx[5], false, false, false),
    					listen_dev(button2, "click", /*randomGrid*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*grid, hanldeClickOrDrag*/ 129) {
    				each_value_1 = /*grid*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if ((!current || dirty & /*running*/ 2) && t1_value !== (t1_value = (/*running*/ ctx[1] ? "Pause" : "Play") + "")) set_data_dev(t1, t1_value);

    			if (!current || dirty & /*running*/ 2 && button0_class_value !== (button0_class_value = "" + (null_to_empty(/*running*/ ctx[1] ? "red" : "green") + " svelte-vd2bmw"))) {
    				attr_dev(button0, "class", button0_class_value);
    			}

    			if (dirty & /*drawingState, states*/ 12) {
    				each_value = /*states*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(settings.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(settings.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			destroy_component(settings);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const mousedown_handler = e => e.preventDefault();

    function instance($$self, $$props, $$invalidate) {
    	let $cols;
    	let $rows;
    	let $rules;
    	let $nStates;
    	let $speed;
    	validate_store(cols, 'cols');
    	component_subscribe($$self, cols, $$value => $$invalidate(9, $cols = $$value));
    	validate_store(rows, 'rows');
    	component_subscribe($$self, rows, $$value => $$invalidate(10, $rows = $$value));
    	validate_store(rules, 'rules');
    	component_subscribe($$self, rules, $$value => $$invalidate(18, $rules = $$value));
    	validate_store(nStates, 'nStates');
    	component_subscribe($$self, nStates, $$value => $$invalidate(11, $nStates = $$value));
    	validate_store(speed, 'speed');
    	component_subscribe($$self, speed, $$value => $$invalidate(12, $speed = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let grid = [...Array($rows)].map(() => [...Array($cols)].map(() => 0)); //2D array
    	let timeout;
    	let dt;
    	let running = false;
    	let states = [...Array($nStates)].map((el, i) => i);
    	let drawingState = 1;

    	function getNeighborStates(cellState, j, k) {
    		// object representing number of neighbors with each state
    		let neighborStates = Object.fromEntries(states.map(state => [state, 0]));

    		for (let jj = -1; jj <= 1; jj++) {
    			if (grid[j + jj] === undefined) {
    				continue;
    			}

    			for (let kk = -1; kk <= 1; kk++) {
    				let neighborState = grid[j + jj][k + kk];

    				if (neighborState === undefined || jj === 0 & kk === 0) {
    					continue;
    				}

    				neighborStates[neighborState] += 1;
    			}
    		}

    		return neighborStates;
    	}

    	function updateCell(cellState, j, k) {
    		let neighborStates = getNeighborStates(cellState, j, k);
    		const fromState = $rules[`from${cellState}`];

    		if (!fromState) {
    			console.log("no rule for ", cellState);
    			return cellState;
    		}

    		if (!fromState.to) {
    			return fromState.default;
    		}

    		for (let [toState, rule] of Object.entries(fromState.to)) {
    			let newState = Number(toState[toState.length - 1]);

    			for (let [neighborState, required] of Object.entries(rule)) {
    				// if (required.length === 0) { continue }
    				let nNeighbors = neighborStates[neighborState];

    				if (required.includes(nNeighbors)) {
    					return newState;
    				}
    			}
    		}

    		return fromState.default || cellState;
    	}

    	updateCell(1, 0, 0);

    	function run() {
    		$$invalidate(8, timeout = setTimeout(
    			() => {
    				if (!running) {
    					clearTimeout(timeout);
    					return;
    				}

    				// The temporary grid needs to be a deep copy of the original
    				let newGrid = [];

    				grid.forEach(row => {
    					let newRow = [];

    					row.forEach(cell => {
    						newRow.push(cell);
    					});

    					newGrid.push(newRow);
    				});

    				grid.forEach((row, j) => {
    					row.forEach((cellState, k) => {
    						newGrid[j][k] = updateCell(cellState, j, k);
    					});
    				});

    				$$invalidate(0, grid = newGrid);

    				if (running) {
    					run();
    				}
    			},
    			dt
    		));
    	}

    	function playPause() {
    		$$invalidate(1, running = !running);
    		run();
    	}

    	function resetGrid() {
    		$$invalidate(0, grid = [...Array($rows)].map(() => [...Array($cols)].map(() => 0)));
    		$$invalidate(1, running = false);
    	}

    	function randomGrid() {
    		$$invalidate(0, grid = [...Array($rows)].map(() => [...Array($cols)].map(() => Math.floor(Math.random() * states.length))));
    	}

    	function hanldeClickOrDrag(e, j, k, click = false) {
    		if (!(e.which === 1)) {
    			return;
    		} // left mouse not being pressed

    		$$invalidate(0, grid[j][k] = drawingState, grid);
    	}

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const keydown_handler = e => {
    		if (e.code === 'Space') {
    			playPause();
    		}
    	};

    	const mouseenter_handler = (j, k, e) => hanldeClickOrDrag(e, j, k);
    	const click_handler = (j, k, e) => hanldeClickOrDrag(e, j, k, true);
    	const click_handler_1 = state => $$invalidate(3, drawingState = state);

    	$$self.$capture_state = () => ({
    		onMount,
    		Settings,
    		rows,
    		cols,
    		speed,
    		nStates,
    		rules,
    		grid,
    		timeout,
    		dt,
    		running,
    		states,
    		drawingState,
    		getNeighborStates,
    		updateCell,
    		run,
    		playPause,
    		resetGrid,
    		randomGrid,
    		hanldeClickOrDrag,
    		$cols,
    		$rows,
    		$rules,
    		$nStates,
    		$speed
    	});

    	$$self.$inject_state = $$props => {
    		if ('grid' in $$props) $$invalidate(0, grid = $$props.grid);
    		if ('timeout' in $$props) $$invalidate(8, timeout = $$props.timeout);
    		if ('dt' in $$props) dt = $$props.dt;
    		if ('running' in $$props) $$invalidate(1, running = $$props.running);
    		if ('states' in $$props) $$invalidate(2, states = $$props.states);
    		if ('drawingState' in $$props) $$invalidate(3, drawingState = $$props.drawingState);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$rows, $cols*/ 1536) {
    			$$invalidate(0, grid = [...Array($rows)].map(() => [...Array($cols)].map(() => 0)));
    		}

    		if ($$self.$$.dirty & /*timeout, $speed*/ 4352) {
    			{
    				clearTimeout(timeout);
    				dt = Number(1000 / $speed);
    				run();
    			}
    		}

    		if ($$self.$$.dirty & /*$nStates*/ 2048) {
    			{
    				$$invalidate(2, states = [...Array($nStates)].map((el, i) => i));
    				resetGrid();
    			}
    		}
    	};

    	return [
    		grid,
    		running,
    		states,
    		drawingState,
    		playPause,
    		resetGrid,
    		randomGrid,
    		hanldeClickOrDrag,
    		timeout,
    		$cols,
    		$rows,
    		$nStates,
    		$speed,
    		keydown_handler,
    		mouseenter_handler,
    		click_handler,
    		click_handler_1
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
