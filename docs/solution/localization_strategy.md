# Localization

Localization is the process of adapting software for a specific region or language by adding locale-specific components and translating text. These text strings are rendered in certain parts of the interface using their translation keys and based on the currently selected language. 

## General Idea

All locale strings are kept in a single `.csv` file (not in `src` directory), which is converted to JSON format during the the build step, and further broken in a number of `.json` files - one file per language. These files are loaded by the app and are passed to the `i18n` Vue plugin to update templates.

## Implementation Options

There are several ways translations can be loaded in the app.

### Bundle Them All

Bundle all translations with the app production bundle. This can be done by a Webpack loader file that converts `.csv` to `.json` and adds the result as an asset.

| Pros                                     | Cons                                     |
| ---------------------------------------- | ---------------------------------------- |
| all translations are available immediately after the initial load | large resultant bundle size - depending on the number of translations |
| language switching happens instantaneously |                                          |

### Split Them Up

Copy `.json` translation files to the `src` directory and lazy loaded with Webpack. Lazy loading converts `.json` files to JS modules and splits the translations from the main JS bundle to be loaded on demand.

Lazy loading will looks like this:

```ts
const messages = await import(/* webpackChunkName: 'i18n/lang-[request]' */ `./lang/${lang}`);
```

| Pros                          | Cons                                     |
| ----------------------------- | ---------------------------------------- |
| smaller resultant bundle size | a slight delay on initial load while translations are being loaded; need to deal with unstyled content; |
|                               | a slight delay when switching language   |
|                               | more HTTP requests                       |

### Two Bundles (or more)

Create several production builds - one per language. On initial page load, detect the current language and load an appropriate bundle. Similar to `Bundle Them All` approach. If the language is changed, a different app bundle needs to be downloaded.

| Pros                                     | Cons                                     |
| ---------------------------------------- | ---------------------------------------- |
| smaller than `Bundle Them All` resultant bundle size | larger than `Split Them Up` resultant bundle size - depending on the number of translations |
|                                          | a full page reload when switching language |

### The Return of the Bundle

Start with the `Bundle Them All` option until the number of translations increases dramatically so that the app bundle size is affected significantly, then switch to one of the `Split Them Up` or `Two Bundles` options.

| Pros                                     | Cons                                     |
| ---------------------------------------- | ---------------------------------------- |
| less work upfront                        | more work later                          |
| all Pros of `Bundle Them All`            | all Pros of `Split Them All` or `Two Bundles` |
| relatively easy to switch to a different implementation option |                                          |

It is recommended to start with this option as the most flexible to allow for future changes as the amount of translations becomes clear as development progresses.

## Library

[Vue-18n](https://github.com/kazupon/vue-i18n) library is used for template localization.

This seems to be the most popular localization solution for Vue (~100k monthly NPM downloads, ~2k Github stars) and it provides all the standard feature one can expect from a front-end localization library: formatting, pluralization, data/time localization, number localization, etc.

### Example

#### Source

```vue
<template>
  <div id="app">
      <p>{{ $t("message.hello") }}</p>
  </div>
</template>

<script>
import Vue from 'vue';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

// Ready translated locale messages
const messages = {
    en: {
        message: {
            hello: 'hello world'
        }
    },
    ja: {
        message: {
            hello: 'こんにちは、世界'
        }
    }
};

// Create VueI18n instance with options
const i18n = new VueI18n({
    locale: 'ja', // set locale
    messages // set locale messages
});

// Create a Vue instance with `i18n` option
new Vue({ i18n }).$mount('#app');
</script>
```

#### Output

```html
<div id="#app">
  <p>こんにちは、世界</p>
</div>
```

For more information, see their [documentation](http://kazupon.github.io/vue-i18n/en/).

## Translations

All the locale strings are stored in a `.cvs` file which serves as an authoritative source for all translations. Any modifications done to the file will translate directly output bundle by the build process - no manual steps needed.

### Sample File

Any number of languages can be added to the translation file by adding more columns to the end of the file. Each new language requires two columns - one for the "dirty" bit and another for the translated strings.

| description                    | key                    | !en-CA | en-CA   | !fr-CA | fr-CA    |
| ------------------------------ | ---------------------- | ------ | ------- | ------ | -------- |
| Language code (ISO 639-2/T)    | lang.code.iso.639.2    | 1      | eng     | 1      | fra      |
| Language direction             | lang.dir               | 1      | ltr     | 1      | ltr      |
| Language name (English)        | lang.en                | 1      | English | 1      | French   |
| Language name (French)         | lang.fr                | 0      | anglais | 1      | français |
| Language name (native)         | lang.native            | 1      | English | 0      | Français |
| Appbar tooltip for layers icon | appbar.tooltip.layers  | 1      | Layers  | 1      | Couches  |
| Appbar headline for layers     | appbar.headline.layers | 0      | Layers  | 1      | Couches  |

It seems easiest to modify the `.csv` file in Excel. Add line breaks by pressing `Alt` + `Enter`.

### File Structure

| Field Name       | Description                              |
| ---------------- | ---------------------------------------- |
| description      | Describes the intended purpose of the string to help with adding new translations for people not familiar with the code. The description should be filled in by a developer when adding a new string. |
| key              | A string key used by the localization library to insert the locale strings into the pages. |
| ![language code] | A "dirty" bit identifies invalid translation strings (initial translation was made by automated translator - Google Translate) or strings that were added as placeholders when a new language or string was added. Flip the "dirty" bit when adding a correct translation. (0 - invalid, 1 - valid) |
| [language-code]  | An actual translation string.            |
