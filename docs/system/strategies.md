# Design Strategies

This section describes strategies for including module dependencies, library and code reuse, challenges of bringing together multiple codebases, and some options of handling shared dependencies.

## Dependencies

There are four core dependencies and various Node Modules in the portal app:

*   [WET](#wet)
*   [RAMP](#ramp)
*   [DQV and Highcharts](#dqv-and-highcharts)
*   [Geosearch](#geosearch)
*   [Node Modules](#node-modules)

### WET

The mandated Canada.ca template is provided by **WET** which loads a number of internal dependencies. There is no (there doesn't seem to be a) direct way to change or prevent any of the **WET** dependencies from loading.

It is a best approach to treat **WET** as a black box dependency which cannot be modified and is liable to arbitrary changes.

**WET** is added to the global scope under `window.wb`.

#### Details

Source: https://github.com/wet-boew/wet-boew

Notable dependencies:

*   **jQuery** [loaded immediately and added to the global scope]
*   **jQuery Datatables** [loaded on demand if a table with the appropriate classes is present on the page]
*   **IE polyfills** [if running in IE]
*   other WET plugins like **Lightbox** are loaded on demand [so far CIP doesn't trigger any]

### RAMP

RAMP's internal dependencies are mostly scoped and are not added to the global scope, with an exception of **jQuery** and **jQuery Datatables** plugin. There is some evidence that **AngularJs** library leaks **jQuery** to the global scope.

#### Details

Source: https://github.com/fgpv-vpgf/fgpv-vpgf

Notable dependencies:

*   **AngularJS**
*   **jQuery** [included* in RAMP bundle and leaked to the global scope by AngularJS]
*   **jQuery Datatables** [included in RAMP]
*   **RxJs Observable** [included in RAMP bundles]
*   **ESRI JS API** [loaded automatically]
*   **IE polyfills** [if running in IE]
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

**Geosearch** uses a single dependency of **node-fetch**. There are no identified concerns right now.

#### Details

Source: https://github.com/RAMP-PCAR/geosearch

### Node Modules

There are two types of NPM modules used: **development dependencies** and **runtime dependencies**. Only runtime dependencies will be included in the final bundle, and the rest is needed to create that bundle.

App NPM modules are added using **^** (caret) which updates minor and patch versions (not major). After the first installation is complete, a `package-lock.json` file is created with a full, reproducible dependency tree listed out. All subsequent installs will use that dependency tree instead of calculating it anew from the `package.json`. This does prevent automatic updates when new versions of dependencies are released, however. Any dependency updates should be done manually.

Advantaged of lockfiles (they do mention left-pad): https://yarnpkg.com/blog/2016/11/24/lockfiles-for-all/ .

#### Details

Notable development dependencies:

*   **POI** - Webpack metabuilder (boilerplate for Webpack configs, it provides hot reloading, testing harness, typescript support, minification, vue single-file component loading, etc.)

Notable runtime dependencies:

*   **Vue.js**
    *   **Vue Class Component** and **Vue Property Decorators** - class decorators for single-file components
*   **Vue Router** - provides routing support to Vue apps
*   **Vuex** - a Flux-like Vue store for state management
    *   **Vuex-class** - class decorators for Vuex
*   **Vue-i18n** - localization library for Vue apps

## Challenges, Reuse, and Optimization

The portal app is an assemblage of several different frameworks and a number of plugins - some frameworks cannot be scoped, some plugins expect stuff to be available on global scope. There are certain challenges in keeping dependencies from interfering with each other.

### Multiple Define

It transpires that **jQuery Datables** being loaded by **WET** interfere with **ESRI JS API** module loading. Somewhere in minified and obfuscated **ESRI** code, a `Multiple Define` error is thrown originating in **Datatables** which prevents **RAMP** from loading properly.

A possible solution would be to remove **Datatables** from the **RAMP** bundle and either have them load before (check that **WET** doesn't load another copy) or rely on the versions loaded by **WET**.

See the Githbub issue for more details: https://github.com/fgpv-vpgf/fgpv-vpgf/issues/2554

### Shared Dependencies

<p class="danger">
  Compiling major dependencies (RAMP, Geosearch, DQV) as part of the portal app can break things. The optimization performed introduces changes into the code of the dependencies invalidating any tests run on it separately. Optimizations should be avoided unless there is a high degree of confidence that the resultant build will remain stable.
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
*   **IE polyfills** are present in 
    *   WET
    *   RAMP

#### Vue.js

Both portal app and **DQV** can potentially use a single instance of **Vue.js** library (this needs to be a full version, with the template compiler since **DQV** needs that). I think this can be done bu pulling **DQV** source code into the portal app and compiling together (this should import **Vue.js** only once) when creating a production build (not necessary for dev builds).

Need to test that this actually works as expected.

#### jQuery

This library should be completely removed from **RAMP** and be loaded by the host page. **WET** already loads it, and most pages **RAMP** is expected to run will be WET pages.

#### jQuery Datatables

This plugin should also be removed from **RAMP**, since **WET** already tries to load it anyway. This might even solve the [Multiple Define](#multiple-define) problem.

#### RxJS Observable

Same solution as with **Vue.js** - pull the source code in and compile when making a production build.

#### IE polyfills

Both **WET** and **RAMP** include a set of **IE polyfills**. Such polyfills tend to be quite heavy and loading more than necessary will have a detrimental effect on the already slow browser. 

There is already an effort underway to significantly reduce the size of the **IE polyfills** for **RAMP** by replacing the library providing utf text encoding. See this Github issue for details: https://github.com/fgpv-vpgf/fgpv-vpgf/issues/2569

Another approach would be to remove any polyfills from **RAMP** which are already provided through **WET** (two polyfill bundles can be created: one for use with **WET** and another for use with a standalone instance of **RAMP**). This is likely the most safe optimization since it doesn't not modify **RAMP** builds.