---
search: english
---

# CCPED UI Behaviour Specifications

## Change Log

* 0.0.1 - [2018-01-08]
    * Initial draft
* 0.0.2 - [2018-01-09]
    * added image captions
    * added links to interactive mockups
    * added `Overall Design` section
    * updated `Common > External Visualization Controls` section
    * added `Business Rules` to some sections
    * updated `Map View > Visualization` section
* 0.2.0 - [2018-02-21]
    * updated `WET Header/Footer` section
    * moved `Location Search` to `Top Level Navigation`
    * moved `Variable Selector` to `External Visualization Controls`
    * added `Location Preview` sections
    * updated both visualization sections
    * updated most images
    * added link to the latest mockups

<p class="tip">
    This document is based on the CCPED Interactive Mockups: [link1](https://projects.invisionapp.com/share/JPET2QZBQ#/screens/267564155), [link2](https://projects.invisionapp.com/share/DGEYN5GPQ#/screens/269323797), [link3](https://projects.invisionapp.com/share/84FLZAMEHJN#/screens/276586379_Ca-8-a-1).
</p>

## Overall Design

Climate Portal comprises three independent parts developed separately but sharing the same design to appear as cohesive whole.

The overall design of the site assumes the use of the [Canada.ca](https://wet-boew.github.io/themes-dist/GCWeb/index-en.html) template which does not use the full width of the page for content. The header section of the template is standardized and cannot be used for portal navigation; the portal navigation menus are placed immediately after the Canada.ca header which is consistent with others portal-like sites ([Job Bank](https://www.jobbank.gc.ca/home-eng.do?lang=eng)) linked from Canada.ca.

All pages except the portal landing page will use the left-side menu for navigation (Climate Basics), data selection (Explore Data) or filtering (Data Catalogue).

## Explore Data Page Sections

Explore data page visualizes user-selected climate data in either a chart or a map form, providing means for interacting with visualizations and switching between visualization modes.

The page is roughly broken into five section:

* WET,
* top level navigation,
* location preview,
* visualization controls, and
* visualization.

WET and top level navigation sections are shared across all Climate Portal pages.

The map visualization is loaded as the page loads in both (chart and map) views. In the chart view, the bulk of the map visualization is hidden and only a non-interactive sliver is visible at the top of the page (`Location Preview` component doubling as a header). When switching to the chart view, the hidden part of the map is revealed, but the `Location Preview` top portion is blurred out to emphasize and draw the user's attention to the larger portion of the map. The `Location Preview` map is non-interactive.

Other sections differ based on the visualization mode.

![](https://i.imgur.com/dfsyVBR.png 'Chart View')

![](https://i.imgur.com/jjvIaXN.png 'Map View')

### Common

#### WET Header / Footer

The surrounding WET template cannot be changed and contains elements common for all Canada.ca pages.

##### Display Rules

* French/English toggle in the upper-left corner reloads the entire page in the corresponding language

* "Breadcrumbs" reflect the currently loaded page under the `Climate Information Portal` app/page?

    [Home]() > [Environment and natural resources]() > [Climate Information Portal]()

#### Top Level Navigation

This section provides location search component and links landing pages of the three main segments of the site (Climate Basics, Data, and Catalogue), and some of their sub-sections.

![](https://i.imgur.com/aER02Hp.png 'Top Level Navigation')

##### Display Rules

* Links to the sub-sections are provided through drop down menus which open on hover

![](https://i.imgur.com/TrHfja6.png 'Top Level Navigation Options')

* Segment's title is highlighted when its child page is displayed

![](https://i.imgur.com/Mo4aOzX.png 'Top Level Navigation Highlight')

* The search is only available on the `Explore Data` pages
* The search control should return the same results (via geogratis) and provide the same filtering options as the search control on the overall landing page
* The search should not return an excessive number of results - results should be pre-filtered by type, removing less useful items
* A use can search by typing in a location's name, postal code (FSA only?), or coordinates (format needed)
* When a user starts to type a query, a `Clear Search` button is displayed in the search box
* When a list of results is returned, it is displayed under the search control with an additional filter bar on top letting a user to filter the results by province and type (City, Village, Town, etc.)
* The results are displayed in the form of `[location,] [city,]? [province] ----- [type]` where the search query is highlighted in inside the `location` string
* The filter values can be reset by clicking in the `Clear Filters` button

![](https://i.imgur.com/O68OAsK.png 'Location Search - Results, Filters')

* If the search returns no results, a message is displayed to a user

![](https://i.imgur.com/7KMJdv7.png 'Location Search - No Results View')

* If the search returns no results, an additional query is run to find possible suggestions (via geogratis) which can be used instead of the original value; this is useful if a user mistypes the query

![](https://i.imgur.com/5KAUbro.png 'Location Search - Suggestions')

* When a user selects a result from the list,

    * the search query displayed in the search controls changes to the location name of the selected result
    * the results list closes
    * depending on the current view
        * map-view: the main `Visualization Map` centers and zooms to the point of the selected result
        * chart-view: the `Location Preview` map centers only (not zooms) on the point of the selected result

* The center of the map control is marked with a pin/crosshairs icon

![](https://i.imgur.com/kFIYzHX.png 'Location Search - Crosshairs')

#### External Visualization Controls

The main visualization has controls like the variable selector, series legend, time range slider and data view table. These give a user ability to interact with the visualization by changing the way data is displayed.

![](https://i.imgur.com/uHNSGX5.png 'External Visualization Controls')

##### Display Rules

* A user can select to see data generated under different emission models
    * This control is always visible but is disabled when a historic (observation-based) variable/dataset is selected
    * The dropdown control displays a list of models on the left, and a short description of the currently selected model. This description can include links to external sites or Climate Basics pages

![](https://i.imgur.com/4q3HzAC.png 'Emission Model Selector')

* A user can select to see data for a specific within-year time period

![](https://i.imgur.com/Pt2FjSE.png)

* A user can select a variable (with a default dataset for future and historic data) and change the type of data visualized. It serves as a type of table of contents displaying a list of all variables available for viewing.
    * Variables are grouped
    * Variable groups can be collapsed (?)

![](https://i.imgur.com/s43nc3m.png 'Variable Selector')

* Each variable can have up-to two options: `Historic` and `Future` data. These options will map to a default dataset which has corresponding data.
* The currently selected variable is highlighted
* After a variable is selected, the dataset selector is updated with list of datasets containing data for this variable
* After a variable is selected, the current visualization gets updated
* A user can switch between datasets available for this variable

![](https://i.imgur.com/gBedhqn.png 'Dataset Selector')

* The currently selected dataset is highlighted
* Datasets available for the currently selected variable are grouped into `Future` and `Historic` lists
    * Do we want to group them in UI as well (?)
    * Can the groups be collapsed (?)
* Selecting a dataset from the group other that is currently selected, will also update the variable selector's highlighted option

##### Business Rules

* AHCCD
    * Emission model selector is disabled
    * Within-year time periods: Annual, Seasonal (Summer, Fall, Winter, Spring, Annual), Monthly (12 months)
        * **Annual** is default view
* CIMP5
    * Emission model: RCP2.6, RCP4.5, and RCP8.5
    * Within-year time periods: Annual and Seasonal (Summer, Fall, Winter, Spring, Annual)
* DS
    * Emission models selector is disabled
    * Within-year time periods: Annual and Seasonal (Summer, Fall, Winter, Spring, Annual)
* CanGrid
    * Emission models selector is disabled
    * Within-year time periods: Annual, Seasonal (Summer, Fall, Winter, Spring, Annual), Monthly (12 months)

### Chart View

#### Location Preview

This section displays a narrow map slice centered on the source location of the chart visualization displayed. This component links chart and map views, providing contextual clues to the user that this is a single application with different modes.

![](https://i.imgur.com/ShXGqWz.png 'Location Preview - Chart View')

##### Display Rules

* The map is clearly visible but is not interactive
* The map is centered on the source location of the visualization
* A pin/icon marks the center of the map
* Coordinates of the current map center are displayed on the left side of the `Location Preview` section under the title (in both views)

![](https://i.imgur.com/F8bXLOP.png 'Location Search - Coordinates')

#### External Visualization Controls - Download

Currently displayed data can be download using controls in the external controls section.

See more details under the `Common` section.

![](https://i.imgur.com/iQlIYJV.png 'External Visualization Control - Chart View')

![](https://i.imgur.com/8jIoOYZ.png 'Download Options - Chart View')

##### Display Rules

* A user can download data displayed on a chart in several formats

    * As an image - `.png`, `.jpeg`, `.pdf`, `.svg`
        * `.png` and `.jpeg` images will be the same visual size as the chart visualization
        * `.pdf` and `.svg` images will be vector-based
    * As a comma-separated file
        * `.csv` (and `.xslt`?)
        * a user can download
        * full time range
        * only the visible time range (when the time range is constrained by the time slider)
    * As a printed page
        * an image of the chart will be sent to the user's printer
    * As a `.netcdf` file from the data catalogue

#### Visualization Description [optional]

An description (of the variable selected?) is displayed before, after and to the right of the main visualization. This can include text, images, tables, links to other sites or other parts of CCPED. This is not yet a confirmed feature.

![](https://i.imgur.com/uxgv2PW.png 'Visualization Description - Chart View')

##### Display Rules

Need to be defined after the feature is confirmed.

#### Visualization Toggle

The visualization toggle lets the user to switch from the Chart View to the Map View while maintaining the map extent, selected variable, and other external visualization settings.

![](https://i.imgur.com/5j5axjJ.png 'Visualization Toggle - Chart View')

##### Display Rules

* The toggle is a rectangular clickable map image displayed above the main visualization
    * The map image should dynamically reflect the current center of the location search mini-map at the second zoom level
* When a user clicks on the toggle, the main visualization (Chart) is replaced by the Map View
    * The selected variable is preserved
    * The center point of the location search mini-map is used to center the Map View
    * External visualization settings (emission model, time period, etc.) are preserved where appropriate

#### Visualization

The data for the selected variable, time period and emission model (where applicable) is displayed in a chart with options to toggle line series, zoom in on a specific time range, and view data in a table format.

Specific requirements for chart visualizations (additional time series, trend values/lines, etc.) are specified in the BRD.

![](https://i.imgur.com/pNfeinG.png 'Chart Visualization')

##### Display Rules

* The visualization title specifies the name of features selected (and its coordinates?)
    * Hovering over chart lines display a tooltip with the values (see BRD)
* The chart legend is displayed to the right of the chart (see BRD)
    * Some of the legend items may be disabled initially
    * Some of the legend items may not be disabled by the user
* A double-sided slider is displayed underneath the chart to let a user constrain time range
    * The slider can be manipulated using keyboard
    * A minimum time range can be specified (see BRD)
    * When the time range is change from the default, a `Zoom Reset` button is displayed in the upper-right corner of the chart
    * Pressing `Esc` when a slider handle has focus resets the time range to its default values
* A table view of the displayed chart data is rendered underneath the time slider
    * The table is initially collapsed
    * The table auto-updates when a user toggles legend items
    * The table auto-updates when a user constrains time range
* [Point data only](approved?) When several points are in proximity of the location search center point, their data is visualized in a stacked chart

![](https://i.imgur.com/jVfZonX.png 'Stacked Chart Visualization')

##### Business Rules

* Common
    * Minimum time period is 20 years
* AHCCD
    * time series of the actual values will be shown~~, along with the trend/smoothing lines~~
    * [temperature] 2 trend **values** (i.e. not a trend line, but rather the value associated with it) shown: one for the whole time period (1948-2015 where available) and one for the user defined period
    * [precipitation] 1 trend **value** is shown for the whole period of record (1848-2015) and **a 9-point binomial** smoothing line
    * Main graph points will display **absolute values** in tooltips
* CMIP5
    * Main chart line is **50th Percentile** (median) as well as other percentiles that will come in pairs 25th/75th, and 10th/90th (not confirmed); percentile pairs toggle on/off together
* DCS
    * Main chart line is **50th Percentile** (median) as well as other percentiles that will come in pairs 25th/75th, and 10th/90th (not confirmed); percentile pairs toggle on/off together
* CanGrid
    * The time series of anomalies will be shown, along with the trend/smoothing lines
    * [temperature]
        * absolute anomalies will be shown
        * 2 trend **values** (i.e. not a trend line, but rather the value associated with it) shown: one for the whole time period (1948-2015 where available) and one for the user defined period
    * [precipitation]
        * relative anomalies will be shown (TBC? check BRD)
        * 1 trend **value** is shown for the whole period of record (1848-2015) and a **9-point binomial** smoothing line

### Map View

#### Location Preview

This section displays a narrow map slice which is actually a part of the main map visualization.

![](https://i.imgur.com/eVuGYFM.png 'Location Preview - Map View')

##### Display Rules

* The map is faded out / blurred and is not interactive
* This section has no function and serves only as a cool-looking decorative header to the page, and to provide consistent layout relative to other portal pages

#### External Visualization Controls - Download

Currently displayed data can be download using controls in the external controls section.

See more details under the `Common` section.

![](https://i.imgur.com/iQlIYJV.png 'External Visualization Controls - Map View')

![](https://i.imgur.com/Dd2azel.png 'Download Options - Map View')

##### Display Rules

* A user can download data displayed on the map as a `.png` image
* The image is generated by RAMP and can be customized as following
    * Image size
        * Default - the actual size of the map visible on the screen
        * Small - 720dp
        * Medium - 1080dp
        * Custom - a user can specify a custom image size whose height does not exceed 2160px
        * Width/height ratio of the resultant map image will be the same as the ratio of the visible map
    * Export elements
        * Title (can be specified by a user)
        * Map
        * North arrow
        * Legend
        * Footnote (might not be available - needs to be specified in the map config file)

#### Visualization Toggle

The visualization toggle lets the user to switch from the Map View to the Chart View while maintaining the map center point , selected variable, and other external visualization settings.

![](https://i.imgur.com/R8ssgxP.png 'Visualization Toggle - Map View')

##### Display Rules

* The toggle is a rectangular clickable chart image displayed in the upper-right corner of the map visualization
* If a feature (polygon/point) is selected, the toggles display a scaled-down image of an actual chart
    * Only a single data series is visible on the chart
    * Additional information like trend value or actual value can be displayed on top of or below the chart image
    * Coordinates of the selected feature are displayed above the chart image
    * The mini-chart is interactive - hovering over the like will display a tooltip with current value (approved?)
* If a user clicks the collapse button in the upper-right corner of the toggle, the chart image is replaced by a small chart icon
    * If a user clicks the collapsed toggle again, it will expand to its default state
* When a user clicks on the expanded toggle, the main visualization (Map) is replaced by the Chart View
    * The selected variable is preserved
    * The center point of the map is used to center the mini-map of the location search section
    * External visualization settings (emission model, time period, etc.) are preserved where appropriate
* If there is no feature selected, the toggle is collapsed into the chart icon

#### Visualization

Data for the selection variable is displayed in an interactive map (pan, zoom, home extent, full-screen, image export, identify, basemap selection, etc.). See RAMP for more details.

![](https://i.imgur.com/G3UAnu1.png 'Map Visualization')

##### Display Rules

* The map takes the full width of the page
    * Canada.ca precedent: http://bit.ly/drought10
* RAMP controls like app bar and map navigation cluster are pulled into the main content area as defined by the WET layout
    * All RAMP dialogs will open in the same area
* The `Location Preview` map is a part of the map visualization - there is only one map on the page at any time
* A user can select a time period (see BRD for details) of the displayed data using a slider at the bottom of the map
    * The slider is not shown for point-based variables [?]
* A table view of the displayed chart data is rendered at the bottom of the map
    * The table is initially collapsed
    * The table auto-updates when a user use the time slider
* A side-menu button is located in the upper-left corner of the map
* A panel can be shown on the map displaying some description information along with the colour ramp for the currently selected variable (see RAMP for details)
* If a panel needs to be shown, the side-menu button is replaced by an application bar containing the side-menu button and a toggle button opening the panel

![](https://i.imgur.com/R6mh8Mz.png 'Application Bar - Map View')

* Additional layers like City and Province boundaries can be displayed in this panel underneath the variable description

![](https://i.imgur.com/hgSFJYx.png 'Layer Panel - Map View')

* When a user hovers over a point or polygon, a tooltip is displayed
* When a user clicks a point or polygon,
    * a marker will be placed on the map to mark location of the click
    * the feature clicked will be highlighted on the map; all other features will be de-emphasized
    * the Visualization toggle will display a small version of the chart for the selected feature
* When a user clicks on a marker added by a previous click, the visualization will switch to the Chart Mode

##### Business Rules

* AHCCD

    * A hover tooltip displays: ~~trend value and~~ station name
    * A mini-chart displays: time series

* CMIP5

    * Time periods
        * 2001-2020
        * 2021-2040
        * 2041-2060
        * 2061-2080
        * 2081-2100
    * A hover tooltip displays:
        * anomaly
        * grid coordinates (lover-left point)
    * A mini-chart displays: time series of the 50th Percentile (median)

- DS
    * A hover tooltip displays:
        * anomaly
        * grid coordinates (lover-left point)
    * A mini-chart displays:
        * time series of the 50th Percentile (median)
- CanGrid
    * A hover tooltip displays:
        * trend over the entire period
        * grid coordinates (lover-left point)
    * Only time period 1948-2014 for all of Canada will be used
        * Time slider control will be set to that period and locked
    * A mini-chart displays: time series
