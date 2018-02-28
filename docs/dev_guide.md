---
search: english
---

# Developers Guide

Showing the ropes.

## Coding Standards

<p class="tip">

The following is mostly based on [typescript-book styleguide](https://github.com/basarat/typescript-book/blob/master/docs/styleguide/styleguide.md) and [Typescript Contributors' coding guidelines](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines#null-and-undefined).

</p>

Key Sections:

* [Python Style Guide](#python-style-guide)
* [Vue.js Style Guide](#vue-js-style-guide)
* [Variable](#variable-and-function)
* [Class](#class)
* [Interface](#interface)
* [Type](#type)
* [Namespace](#namespace)
* [Enum](#enum)
* [`null` vs. `undefined`](#null-vs-undefined)
* [Formatting](#formatting)
* [Single vs. Double Quotes](#quotes)
* [Tabs vs. Spaces](#spaces)
* [Use semicolons](#semicolons)
* [Annotate Arrays as `Type[]`](#array)
* [File Names](#file-names)
* [`type` vs `interface`](#type-vs-interface)
* [Null is Bad](#null-is-bad)

### Python Style Guide

Read here: [Python PEP 8 Style Guide](https://www.python.org/dev/peps/pep-0008/).

### Vue.js Style Guide

Vue.js provides an official style guide for Vue-specific code. Read here: https://vuejs.org/v2/style-guide/ .

The rest refers to Typescript conventions in general.

### Variable and Function

* Use `camelCase` for variable and function names

> Reason: Conventional JavaScript

**Bad**

```ts
var FooVar;
function BarFunc() {}
```

**Good**

```ts
var fooVar;
function barFunc() {}
```

### Class

* Use `PascalCase` for class names.

> Reason: This is actually fairly conventional in standard JavaScript.

**Bad**

```ts
class foo {}
```

**Good**

```ts
class Foo {}
```

* Use `camelCase` of class members and methods

> Reason: Naturally follows from variable and function naming convention.

**Bad**

```ts
class Foo {
    Bar: number;
    Baz() {}
}
```

**Good**

```ts
class Foo {
    bar: number;
    baz() {}
}
```

### Interface

* Use `PascalCase` for name.

> Reason: Similar to class

* Use `camelCase` for members.

> Reason: Similar to class

* **Don't** prefix with `I`

> Reason: Unconventional. `lib.d.ts` defines important interfaces without an `I` (e.g. Window, Document etc).

**Bad**

```ts
interface IFoo {}
```

**Good**

```ts
interface Foo {}
```

### Type

* Use `PascalCase` for name.

> Reason: Similar to class

* Use `camelCase` for members.

> Reason: Similar to class

### Namespace

* Use `PascalCase` for names

> Reason: Convention followed by the TypeScript team. Namespaces are effectively just a class with static members. Class names are `PascalCase` => Namespace names are `PascalCase`

**Bad**

```ts
namespace foo {

}
```

**Good**

```ts
namespace Foo {

}
```

### Enum

* Use `PascalCase` for enum names

> Reason: Similar to Class. Is a Type.

**Bad**

```ts
enum color {}
```

**Good**

```ts
enum Color {}
```

* Use `PascalCase` for enum member

> Reason: Convention followed by TypeScript team i.e. the language creators e.g `SyntaxKind.StringLiteral`. Also helps with translation (code generation) of other languages into TypeScript.

**Bad**

```ts
enum Color {
    red
}
```

**Good**

```ts
enum Color {
    Red
}
```

### Null vs. Undefined

* Prefer not to use either for explicit unavailability

> Reason: these values are commonly used to keep a consistent structure between values. In TypeScript you use _types_ to denote the structure

**Bad**

```ts
let foo = { x: 123, y: undefined };
```

**Good**

```ts
let foo: { x: number; y?: number } = { x: 123 };
```

* Use `undefined` in general (do consider returning an object like `{ valid: boolean, value?: Foo }` instead)

**Bad**

```ts
return null;
```

**Good**

```ts
return undefined;
```

* Use `null` where its a part of the API or conventional

> Reason: It is conventional in Node.js e.g. `error` is `null` for NodeBack style callbacks.

**Bad**

```ts
cb(undefined);
```

**Good**

```ts
cb(null);
```

* Use _truthy_ check for **objects** being `null` or `undefined`

**Bad**

```ts
if (error === null)
```

**Good**

```ts
if (error)
```

* Use `== undefined` / `!= undefined` (not `===` / `!==`) to check for `null` / `undefined` on primitives as it works for both `null`/`undefined` but not other falsy values (like `''`,`0`,`false`) e.g.

**Bad**

```ts
if (error !== null)
```

**Good**

```ts
if (error != undefined)
```

PS: [More about `null`](#null-is-Bad)

### Null is Bad

JavaScript (and by extension TypeScript) has two bottom types : `null` and `undefined`. They are _intended_ to mean different things:

* Something hasn't been initialized : `undefined`
* Something is currently unavailable: `null`

Most other languages only have one (commonly called `null`). Since by default JavaScript will evaluate an uninitialized variable / parameter / property to `undefined` (you don't get a choice) we recommend you just use that for your own _unavailable_ status and don't bother with `null`.

#### Real world discussions

TypeScript team doesn't use `null` : [TypeScript coding guidelines](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines#null-and-undefined) and it hasn't caused any problems. Douglas Crockford thinks [`null` is a bad idea](https://www.youtube.com/watch?v=PSGEjv3Tqo0&feature=youtu.be&t=9m21s) and we should all just use `undefined`

#### Dealing with `null` style code bases

If your code base interacts with other APIs that might give you a `null` you check with `== undefined` (instead of `===`). Using this is safe even for other potentially _falsy_ values.

```ts
/// Image you are doing `foo == undefined` where foo can be one of:
console.log(undefined == undefined); // true
console.log(null == undefined); // true
console.log(0 == undefined); // false
console.log('' == undefined); // false
console.log(false == undefined); // false
```

#### Additional tips

##### Limit explicit use of `undefined`

Also because TypeScript gives you the opportunity to _document_ your structures separately from values instead of stuff like:

```ts
function foo() {
    // if Something
    return { a: 1, b: 2 };
    // else
    return { a: 1, b: undefined };
}
```

you should use a type annotation:

```ts
function foo(): { a: number; b?: number } {
    // if Something
    return { a: 1, b: 2 };
    // else
    return { a: 1 };
}
```

##### Node style callbacks

Node style callback functions (e.g. `(err,somethingElse)=>{ /* something */ }`) are generally called with `err` set to `null` if there isn't an error. You generally just use a truthy check for this anyways:

```ts
fs.readFile('someFile', 'utf8', (err, data) => {
    if (err) {
        // do something
    }
    // no error
});
```

When creating your own APIs it's _okay_ to use `null` in this case for consistency. In all sincerity for your own APIs you should look at promises, in that case you actually don't need to bother with absent error values (you handle them with `.then` vs. `.catch`).

##### Don't use `undefined` as a means of denoting _validity_

For example an awful function like this:

```ts
function toInt(str: string) {
    return str ? parseInt(str) : undefined;
}
```

can be much better written like this:

```ts
function toInt(str: string): { valid: boolean; int?: number } {
    const int = parseInt(str);
    if (isNaN(int)) {
        return { valid: false };
    } else {
        return { valid: true, int };
    }
}
```

### Formatting

Use [Prettier](https://github.com/prettier/prettier) code formatter.

If you are using VSCode, there is a Prettier [extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) available. Add the following to your VSCode settings to use single quotes and four spaces per tab.

```json
{
    "prettier.tabWidth": 4,
    "prettier.singleQuote": true
}
```

If you code looks crappy after formatting, try refactoring.

### Quotes

* Prefer single quotes (`'`) unless escaping.

> Reason: More JavaScript teams do this (e.g. [airbnb](https://github.com/airbnb/javascript), [standard](https://github.com/feross/standard), [npm](https://github.com/npm/npm), [node](https://github.com/nodejs/node), [google/angular](https://github.com/angular/angular/), [facebook/react](https://github.com/facebook/react)). Its easier to type (no shift needed on most keyboards). [Prettier team recommends single quotes as well](https://github.com/prettier/prettier/issues/1105)

> Double quotes are not without merit: Allows easier copy paste of objects into JSON. Allows people to use other languages to work without changing their quote character. Allows you to use apostrophes e.g. `He's not going.`. But I'd rather not deviate from where the JS Community is fairly decided.

* When you can't use double quotes, try using back ticks (\`).

> Reason: These generally represent the intent of complex enough strings.

### Spaces

* Use `4` spaces. Not tabs.

> Reason: More JavaScript teams do this (e.g. [airbnb](https://github.com/airbnb/javascript), [idiomatic](https://github.com/rwaldron/idiomatic.js), [standard](https://github.com/feross/standard), [npm](https://github.com/npm/npm), [node](https://github.com/nodejs/node), [google/angular](https://github.com/angular/angular/), [facebook/react](https://github.com/facebook/react)). The TypeScript/VSCode teams use 4 spaces but are definitely the exception in the ecosystem.

### Semicolons

* Use semicolons.

> Reasons: Explicit semicolons helps language formatting tools give consistent results. Missing ASI (automatic semicolon insertion) can trip new devs e.g. `foo() \n (function(){})` will be a single statement (not two). Recommended by TC39 as well.

### Array

* Annotate arrays as `foos:Foo[]` instead of `foos:Array<Foo>`.

> Reasons: Its easier to read. Its used by the TypeScript team. Makes easier to know something is an array as the mind is trained to detect `[]`.

#### Creating Arrays

Creating an empty array is super easy:

```ts
const foo: string[] = [];
```

If you want to create an array pre-filled with some content use the ES6 `Array.prototype.fill`:

```ts
const foo: string[] = new Array(3).fill('');
console.log(foo); // ['','',''];
```

### File names

Name files with `kebab`. E.g. `accordian.tsx`, `my-control.tsx`, `utils.ts`, `map.ts` etc.

> Reason: Recommended by [Vue style guide](https://vuejs.org/v2/style-guide/#Single-file-component-filename-casing-strongly-recommended).

### type vs. interface

* Use `type` when you _might_ need a union or intersection:

```ts
type Foo = number | { someProperty: number };
```

* Use `interface` when you want `extends` or `implements` e.g

```ts
interface Foo {
    foo: string;
}
interface FooBar extends Foo {
    bar: string;
}
class X implements FooBar {
    foo: string;
    bar: string;
}
```

* Otherwise use whatever makes you happy that day.

## Tools, builds and branches

[ to be written ]

## Code Organization

### Vue Files

Vue files contain 3 parts:

* HTML template; this can contain regular `html`, tags for other `vue` modules, or special `vue` directives such as `v-for` or `v-if`
* Typescript; contains the "controller" portion of the module, the functionality is defined here
* Styles; this is where you should put `scoped scss` styles

### assets/

This folder contains static assets, such as config files for maps or images for various pages. This folder gets copied over during the build with no modification.

#### configs/

This folder contains the config files for maps. Each dataset has an overall config file for the map as well as a file containing all of the layer snippets.

#### images/

Contains images used on the static pages.

### docs/

This folder contains all of the source files for the webapp docs.

#### config.js

Determines the layout of the docs site.

#### \*.md

The various documentation pages.

### src/

The core of the app, this contains everything `vue` related.

#### app.vue

The main entry point to the app, handles bringing together the various sub-views.

#### api/

This folder has one file; `main.ts` which contains definitions and functions which are needed over the whole app.

#### components/

Here is where anything below `app.vue` goes. Generally, responsibilities of components are separated as much as possible, if a sub-section of a component starts getting large it is usually a good sign it should have its own file.

If there are many similar subsections that get reused it might be a good idea to create a sub-folder to group them.

##### vis-controls/

A sub-folder for the various selectors. `selectors.ts` is used as a module index that allows all of the selectors to be imported at once.

#### configs/

Contains config-building modules. Things such as chart config builders for each dataset/variable.

##### chart/

Typescript modules to build `DQV` chart configs. Builder modules should only contain portions that are not shared between variables.

#### globals/

Modules that provide definitions for the rest of the app to use.

##### mappings.ts

Contains mappings between ids and numbers, ids and display names, etc.

##### mixin.ts

Contains an extendable class which provides the `updateRoute()` function.

##### controls.ts

Definitions for what selectors to show per dataset.

#### lang/

English and French translations for labels, titles, etc.

#### store/

The `vuex` store. This module handles state manipulation.

##### app.ts

The state manipulation functions.

* `getters`
    * Nothing fancy here just regular getters for state variables; can return objects, single values, etc.
* `actions`
    * Takes an input value, performs any needed transformations or checks and then calls a `commit` to the correct mutator.
* `mutators`
    * Directly sets the state variable to the provided value, should not be used outside of `app.ts`.

##### state.ts

`interface` definition for the `AppState` object.

#### styles/

Styles to override vendor `css` or for overarching reusable components. Styles for a single component should be contained in their respective `.vue` file.

### static/

All of the static pages surrounding the webapp are kept here. These are pages like the main landing, climate basics and its various sub-pages.

#### static.css

This file contains all of the styles for the static pages. The static folder does not go through a rigorous build process which means `sass` is not used for these.

### test/

This folder contains all of our tests. This should be separated by test "type"; unit, end-to-end, etc.

#### unit/

Put unit tests for components here. This folder also contains unit tests for the `$router` and `vuex` store.
