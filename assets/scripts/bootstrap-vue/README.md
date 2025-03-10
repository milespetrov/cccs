# Bootstrap-Vue

This folder contains the contents of the `/es/` folder of `bootstrap-vue`, version `v1.5.1`, enhanced to patch an [accessibility bug](https://github.com/bootstrap-vue/bootstrap-vue/issues/1715).

The issue was patched on `v2.0.0`, but that version requires Vue `v2.6.0` or higher which breaks things here.

Orig sauce: [NPM](https://www.npmjs.com/package/bootstrap-vue/v/1.5.1), [GitHub](https://github.com/bootstrap-vue/bootstrap-vue/tree/v1.5.1).

To ensure the dependencies of the package are available, the following libs need to be in our `package.json`:

```text
"vue-functional-data-merge": "2.0.5"
```
