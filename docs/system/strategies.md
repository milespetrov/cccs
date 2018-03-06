# Design Strategies

## Dependencies

There are four core dependencies and various Node Modules in the portal app:

*   [WET](#wet)
*   [RAMP](#ramp)
*   [DQV and Highcharts](#dqv-and-highcharts)
*   [Geosearch](#geosearch)
*   [Node Modules](#node-modules)

### WET

The mandated Canada.ca template is provided by **WET** which loads a number of internal dependencies. There is no (there doesn't seem to be a) direct way to change or prevent any of the **WET** dependencies from loading.

**WET** is added to the global scope under `window.wb`.

#### Details

Source: https://github.com/wet-boew/wet-boew

Notable dependencies:

*   **jQuery** [loaded immediately and added to the global scope]
*   **jQuery Datatables** [loaded on demand if a table with the appropriate classes is present on the page]
*   **IE polyfills** [if running in IE]
*   other WET plugins like **Lightbox** are loaded on demand [so far CIP doesn't trigger any]

### RAMP

RAMP's internal dependencies are mostly scoped and are not added to the global scope, with an exception of **jQuery** and **jQuery Datatables** plugin. Apparently, **AngularJs** library leaks **jQuery** to the global scope.

#### Details

Source: https://github.com/fgpv-vpgf/fgpv-vpgf

Notable dependencies:

*   **AngularJS**
*   **jQuery** [included* in RAMP bundle and leaked to the global scope by AngularJS]
*   **jQuery Datatables** [included in RAMP]
*   **RxJs Observable** [included in RAMP bundles]
*   **ESRI JS API** [loaded automatically]
*   IE polyfills\*\* [if running in IE]
*   other smaller dependencies

\*A special version of RAMP without including jQuery is built to facilitate portal development. See [Multiple Define](#multiple-define) for mode details.

### DQV and Highcharts

**DQV** expects the **Highcharts** library and any additional modules being loaded by host page. There is a very loose dependency on a specific version of **Highcharts** - it's expected to work with any 5.x and 6.x versions.

**DQV** is added to the global scope under `window.DQV`.

#### Details

Source: https://github.com/RAMP-PCAR/dqvue

Notable dependencies:

*   **Vue.js** [a full version with template compiler]

### Geosearch

**Geosearch** uses a single dependency of **node-fetch**. No concerns here.

#### Details

Source: https://github.com/RAMP-PCAR/geosearch

### Node Modules

There are two types of NPM modules used: **development dependencies** and **runtime dependencies**. Only runtime dependencies will be included in the final bundle, and the rest is needed to create that bundle.

App NPM modules are added using **^** (caret) which updates minor and patch versions (not major). After the first installation is complete, a `package-lock.json` file is created with a full, reproducible dependency tree listed out. All subsequent installs will use that dependency tree instead of calculating it anew from the `package.json`. This does prevent automatic updates when new versions of dependencies are released. Any dependency updates should be done manually.

Advantaged of lockfiles (they do mention left-pad): https://yarnpkg.com/blog/2016/11/24/lockfiles-for-all/ (tldr - lockfiles are good for your sanity).

#### Details

Notable development dependencies:

*   **POI** - Webpack metabuilder (boilerplate for Webpack configs, it provides hot reloading, testing harness, typescript support, minification, vue single-file component loading)

Notable runtime dependencies:

*   **Vue.js**
    *   **Vue Class Component** and **Vue Property Decorators** - class decorators for single-file components
*   **Vue Router** - provides routing support to Vue apps
*   **Vuex** - a Flux-like Vue store for state management
    *   **Vuex-class** - class decorators for Vuex
*   **Vue-i18n** - localization library for Vue apps

## Challenges and Reuse

The portal app is a hodgepodge of several different frameworks and a number of plugins - some frameworks cannot be scoped, some plugins expect stuff to be available on global scope - it's a mess.

### Multiple Define

As far as we could tell, **jQuery Datables** being loaded by **WET** interfere with **ESRI JS API** module loading. Somewhere in minified and obfuscated **ESRI** code, a `Multiple Define` error is thrown originating in **Datatables** which prevents **RAMP** from loading properly.

A possible solution would be to remove **Datatables** from the **RAMP** bundle and either have them load before (check that **WET** doesn't load another copy) or rely on the versions loaded by **WET**.

See the Githbub issue for more details: https://github.com/fgpv-vpgf/fgpv-vpgf/issues/2554

### Shared Dependencies

<p class="danger">
  Compiling major dependencies (RAMP, Geosearch, DQV) as part of the portal app can break things. The optimization performed introduces changes into the code of the dependencies invalidating any tests run on it separately. Do not attempt unless you have high confidence the optimization wont' break anything.
</p>

There is a number of sub-dependencies that are shared or can be shared among the main components. Right now, these dependencies are included multiple times and increase the amount of JS code downloaded to the client. If the following duplications are resolved, it will lower the total size of the unminified code by ~1MB (a guess).

*   **Vue.js** is present in
    *   Portal app [uses runtime only]
    *   DQV [uses full version]
*   **jQuery** is present in
    *   WET
    *   RAMP
*   **jQuery Datatables** is present in
    *   WET
    *   RAMP
*   **RxJS Observable** is present in
    *   RAMP
    *   DQV
    *   Portal app

#### Vue.js

Both portal app and **DQV** can potentially use a single instance of **Vue.js** library (this needs to be a full version, with the template compiler since **DQV** needs that). I think this can be done bu pulling **DQV** source code into the portal app and compiling together (this should import **Vue.js** only once) when creating a production build (not necessary for dev builds).

Need to test that this actually works as expected.

#### jQuery

This library should be completely removed from **RAMP** and be loaded by the host page. **WET** already loads it, and most pages **RAMP** is expected to run will be WET pages.

#### jQuery Datatables

This plugin should also be removed from **RAMP**, since **WET** already tries to load it anyway. This might even solve the [Multiple Define](#multiple-define) problem.

#### RxJS Observable

Same solution as with **Vue.js** - pull the source code in and compile when making a production build.
