# Coding Standards

Coding conventions are **style guidelines for programming**. They typically specify naming and declaration rules for variables and functions, rules for the use of white space, indentation, and comments, and programming practices and principles.

Adhering to coding conventions increase code quality by:

- Improves code readability, especially of code written by multiple developers
- Make code maintenance easier

<p class="tip">

The following is based on [typescript-book styleguide](https://github.com/basarat/typescript-book/blob/master/docs/styleguide/styleguide.md) and [Typescript Contributors' coding guidelines](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines#null-and-undefined).

</p>

Key Sections:

* [Python Style Guide](#python-style-guide)
* [Vue.js Style Guide](#vue-js-style-guide)
* [Typescript Style Guide](#typescript-style-guide)

## Python Style Guide

Python is used in all CIP data APIs. The standard Python PEP 8 Style Guide should be followed.

Read here: [Python PEP 8 Style Guide](https://www.python.org/dev/peps/pep-0008/).

## Vue.js Style Guide

The portal app uses **Vue.js** as the framework for building the user interface and providing scaffolding to the  single-page application.

**Vue.js** provides an official style guide for Vue-specific code. Read here: https://vuejs.org/v2/style-guide/ .

## Typescript Style Guide

Typescript is a typed superset of JavaScript that compiles to plain JavaScript.

Types enable JavaScript developers to use highly-productive development tools and practices like static checking and code refactoring when developing JavaScript applications.

Types are optional, and type inference allows a few type annotations to make a big difference to the static verification of your code. Types let you define interfaces between software components and gain insights into the behavior of existing JavaScript libraries.



The following are Typescript-specific guidelines:

- [Variable](#variable-and-function)
- [Class](#class)
- [Interface](#interface)
- [Type](#type)
- [Namespace](#namespace)
- [Enum](#enum)
- [`null` vs. `undefined`](#null-vs-undefined)
- [Formatting](#formatting)
- [Single vs. Double Quotes](#quotes)
- [Tabs vs. Spaces](#spaces)
- [Use semicolons](#semicolons)
- [Annotate Arrays as `Type[]`](#array)
- [File Names](#file-names)
- [`type` vs `interface`](#type-vs-interface)
- [Null is Bad](#null-is-bad)

### Variable and Function

Use `camelCase` for variable and function names

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

##### Class names

Use `PascalCase` for class names.

> Reason: This is actually fairly conventional in standard JavaScript.

**Bad**

```ts
class foo {}
```

**Good**

```ts
class Foo {}
```

##### Class members

Use `camelCase` of class members and methods

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

##### Names

Use `PascalCase` for name.

> Reason: Similar to class

##### Members

Use `camelCase` for members.

> Reason: Similar to class

##### Name prefix

**Don't** prefix with `I`

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

##### Names

Use `PascalCase` for name.

> Reason: Similar to class

##### Members

Use `camelCase` for members.

> Reason: Similar to class

### Namespace

Use `PascalCase` for names

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

##### Names

Use `PascalCase` for enum names

> Reason: Similar to Class. Is a Type.

**Bad**

```ts
enum color {}
```

**Good**

```ts
enum Color {}
```

##### Members

Use `PascalCase` for enum member

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

##### Explicit Unavailability

Prefer not to use either for explicit unavailability

> Reason: these values are commonly used to keep a consistent structure between values. In TypeScript you use _types_ to denote the structure

**Bad**

```ts
let foo = { x: 123, y: undefined };
```

**Good**

```ts
let foo: { x: number; y?: number } = { x: 123 };
```

##### Returns

Use `undefined` in general (do consider returning an object like `{ valid: boolean, value?: Foo }` instead)

**Bad**

```ts
return null;
```

**Good**

```ts
return undefined;
```

##### Conventions

Use `null` where its a part of the API or conventional

> Reason: It is conventional in Node.js e.g. `error` is `null` for NodeBack style callbacks.

**Bad**

```ts
cb(undefined);
```

**Good**

```ts
cb(null);
```

##### Truthy check

Use _truthy_ check for **objects** being `null` or `undefined`

**Bad**

```ts
if (error === null)
```

**Good**

```ts
if (error)
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

##### Single quotes

Prefer single quotes (`'`) unless escaping.

> Reason: More JavaScript teams do this (e.g. [airbnb](https://github.com/airbnb/javascript), [standard](https://github.com/feross/standard), [npm](https://github.com/npm/npm), [node](https://github.com/nodejs/node), [google/angular](https://github.com/angular/angular/), [facebook/react](https://github.com/facebook/react)). Its easier to type (no shift needed on most keyboards). [Prettier team recommends single quotes as well](https://github.com/prettier/prettier/issues/1105)

> Double quotes are not without merit: Allows easier copy paste of objects into JSON. Allows people to use other languages to work without changing their quote character. Allows you to use apostrophes e.g. `He's not going.`. But I'd rather not deviate from where the JS Community is fairly decided.

##### Double quotes

When you can't use double quotes, try using back ticks (\`).

> Reason: These generally represent the intent of complex enough strings.

### Spaces

Use `4` spaces. Not tabs.

> Reason: More JavaScript teams do this (e.g. [airbnb](https://github.com/airbnb/javascript), [idiomatic](https://github.com/rwaldron/idiomatic.js), [standard](https://github.com/feross/standard), [npm](https://github.com/npm/npm), [node](https://github.com/nodejs/node), [google/angular](https://github.com/angular/angular/), [facebook/react](https://github.com/facebook/react)). The TypeScript/VSCode teams use 4 spaces but are definitely the exception in the ecosystem.

### Semicolons

Use semicolons.

> Reasons: Explicit semicolons helps language formatting tools give consistent results. Missing ASI (automatic semicolon insertion) can trip new devs e.g. `foo() \n (function(){})` will be a single statement (not two). Recommended by TC39 as well.

### Array

Annotate arrays as `foos:Foo[]` instead of `foos:Array<Foo>`.

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

##### Union and intersection

Use `type` when you _might_ need a union or intersection:

```ts
type Foo = number | { someProperty: number };
```

##### Extending and implementing

Use `interface` when you want `extends` or `implements` e.g

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
