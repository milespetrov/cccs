# Routing

## URL

```
/climate-data/:view?query
```

### View

Examples: `/map/?query`, `/chart/?query`

| View Name | Description            |
| :-------- | ---------------------- |
| map       | Map visualization      |
| chart     | Chart visualization    |
| location  | Locations results page |

### Query Parameters

An example query string: `?t=Annual,v=tmax,d=ahccd,f=6014353`

#### Time Period

Specifies the time period to be used in the visualization.

* Type: `string`

* Default: `Let the time period selector handle the default`

* Key: `t`

* Usage:

```html
/climate-data/:view?t=Annual
```

For the purpose of shortening the bookmark, time periods can be mapped to numbers (1 to 17).

#### Variable

Specifies the currently selected variable to be used in the visualization.

* Type: `string`
* Default: `Let the variable selector handle the default`
* Key: `v`
* Usage:

```html
/climate-data/:view?v=tmax
```

For the purpose of shortening the bookmark, variable ids can be mapped to numbers.

#### Dataset

Specifies the currently selected dataset providing data for the selected variable to be used in the visualization.

* Type: `string`
* Default: `Let the dataset selector handle the default`
* Key: `d`
* Usage:

```html
/climate-data/:view?d=ahccd
```

For the purpose of shortening the bookmark, dataset ids can be mapped to numbers.

#### RCP Model

Specifies the currently RCP models to be used in the visualization. This is only on the bookmark if the dataset allows it; CMIP5, DCS, etc.

* Type: `string`
* Default: `Let the RCP selector handle the default`
* Key: `r`
* Usage:

```html
/climate-data/:view?r=4.5
```

For the purpose of shortening the bookmark, RCP model ids can be mapped to numbers.

#### Feature

Specifies the currently selected map feature id to provide data for the `Chart` visualization.

* Type: `string`
* Default: `null`
* Key: `f`
* Usage:

```html
/climate-data/:view?f=6014353
```

#### Center Point

Specifies the `lat/long` center point of the `Map` visualization. This is used the center the Map visualization and the `Back to map` button in the `Chart` view.

* Type: `string`
* Default: `null`
* Key: `cp`
* Usage:

```html
/climate-data/:view?cp=-95.4135979036534,57.24796047965218
```

#### Feature Point

Specifies the `lat/long` center point of the currently selected map feature. This is used the center the `Location Preview` map in the `Chart` view.

* Type: `string`
* Default: `null`
* Key: `fp`
* Usage:

```html
/climate-data/:view?fp=-95.4135979036534,57.24796047965218
```

#### Zoom Level

Specifies the current zoom level of the `Map` visualization.

* Type: `number`
* Default: `null`
* Key: `z`
* Usage:

```html
/climate-data/:view?z=5
```

#### Chart Series

Specifies which chart series are toggled on in the `Chart` visualization.

* Type: `number[]`
* Default: `null`
* Key: `cs`
* Usage:

```html
/climate-data/:view?cs=0,3,6
```

#### Chart Range

Specifies the user defined chart range of the `Chart` visualization.

* Type: `string`
* Default: `null`
* Key: `cr`
* Usage:

```html
/climate-data/:view?cr=1920,2015
```

#### Base map

Specifies the current selected base map in the `Map` visualization.

* Type: `string`
* Default: `null`
* Key: `bm`
* Usage:

```html
/climate-data/:view?bm=grayscale
```

For the purpose of shortening the bookmark, basemap ids can be mapped to numbers.

## Working with routing

### General rules

Everything above will be shown on the bookmark at all times; provided there is a value for it in the store. The **one** exception to this is `RCP Model`. To not confuse the user, `RCP Model` will only be shown when the current dataset has `RCP` values.

#### What tools are used

View routing is handled by the `$router`, this takes a view and a query object and handles the building of the "fake" URL.

Since `vuex` is used to store state within the site we only ever update the route with values from the store. That means at no point should anything be manually added to the route, only the store.

### Parsing

Reading the URL will be done by `app.vue`. The bookmark will be read, and each of the values that are present will be passed to the store using `updateStore(...)`. The rest of the application gets the information from the store.

### Defaults

Any defaults should be handled by the selectors. For query parameters that don't have a selector, a `null` value will remain until the related info has shown up. For instance, `Basemap` will be `null` until the map loads with a base map, which we will then pass to the router (and the store).

### Updating the route

To update the route you call `updateRoute()`. This should be done exactly once per action (that modifies a query parameter or view). For instance if the variable is changed, and that ends up changing the dataset; both of those values are passed to the store then `updateRoute()` is called. This allows the user to undo one action with one press of the browsers back button and maintains consistent state.

Example: Changing a variable. If the user changes their variable selection which in turn changes the dataset selected, **both** should be modified before `updateRoute()` is called.

## Testing

### Goals

* Ensure all values present in the route get added to the store
* Ensure no unexpected defaults are applied

### Tools

`vue-test-utils` :

* Documentation - https://vue-test-utils.vuejs.org/en/
* Repo - https://github.com/vuejs/vue-test-utils

This is the official Vue tester and provides support for `$router` and `vuex`.
