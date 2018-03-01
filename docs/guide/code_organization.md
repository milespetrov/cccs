# Code Organization

Plan coming together.

## Vue Files

Vue files contain 3 parts:

* HTML template; this can contain regular `html`, tags for other `vue` modules, or special `vue` directives such as `v-for` or `v-if`
* Typescript; contains the "controller" portion of the module, the functionality is defined here
* Styles; this is where you should put `scoped scss` styles

## assets/

This folder contains static assets, such as config files for maps or images for various pages. This folder gets copied over during the build with no modification.

### configs/

This folder contains the config files for maps. Each dataset has an overall config file for the map as well as a file containing all of the layer snippets.

### images/

Contains images used on the static pages.

## docs/

This folder contains all of the source files for the webapp docs.

### config.js

Determines the layout of the docs site.

### \*.md

The various documentation pages.

## src/

The core of the app, this contains everything `vue` related.

### app.vue

The main entry point to the app, handles bringing together the various sub-views.

### api/

This folder has one file; `main.ts` which contains definitions and functions which are needed over the whole app.

### components/

Here is where anything below `app.vue` goes. Generally, responsibilities of components are separated as much as possible, if a sub-section of a component starts getting large it is usually a good sign it should have its own file.

If there are many similar subsections that get reused it might be a good idea to create a sub-folder to group them.

#### vis-controls/

A sub-folder for the various selectors. `selectors.ts` is used as a module index that allows all of the selectors to be imported at once.

### configs/

Contains config-building modules. Things such as chart config builders for each dataset/variable.

#### chart/

Typescript modules to build `DQV` chart configs. Builder modules should only contain portions that are not shared between variables.

### globals/

Modules that provide definitions for the rest of the app to use.

#### mappings.ts

Contains mappings between ids and numbers, ids and display names, etc.

#### mixin.ts

Contains an extendable class which provides the `updateRoute()` function.

#### controls.ts

Definitions for what selectors to show per dataset.

### lang/

English and French translations for labels, titles, etc.

### store/

The `vuex` store. This module handles state manipulation.

#### app.ts

The state manipulation functions.

* `getters`
    * Nothing fancy here just regular getters for state variables; can return objects, single values, etc.
* `actions`
    * Takes an input value, performs any needed transformations or checks and then calls a `commit` to the correct mutator.
* `mutators`
    * Directly sets the state variable to the provided value, should not be used outside of `app.ts`.

#### state.ts

`interface` definition for the `AppState` object.

### styles/

Styles to override vendor `css` or for overarching reusable components. Styles for a single component should be contained in their respective `.vue` file.

## static/

All of the static pages surrounding the webapp are kept here. These are pages like the main landing, climate basics and its various sub-pages.

### static.css

This file contains all of the styles for the static pages. The static folder does not go through a rigorous build process which means `sass` is not used for these.

## test/

This folder contains all of our tests. This should be separated by test "type"; unit, end-to-end, etc.

### unit/

Put unit tests for components here. This folder also contains unit tests for the `$router` and `vuex` store.
