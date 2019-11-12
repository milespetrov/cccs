"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CustomExport =
/*#__PURE__*/
function () {
  function CustomExport() {
    _classCallCheck(this, CustomExport);

    this.feature = 'export';
  }

  _createClass(CustomExport, [{
    key: "preInit",
    value: function preInit() {
      console.log('Sample export plugin pre-init check.');
    }
  }, {
    key: "init",
    value: function init(api) {
      this.api = api;
      CustomExport.instances[this.api.id] = this;
    }
    /**
     * Creates a stack of export images and returns them to RAMP.
     *
     * An export plugin should return a collection of promises each resolving with with a graphic and its offset
     * { graphic: <canvas>, offset: [<left>, <top>] }[]
     * - the first graphic is considered to be the base graphic and its offset should be [0,0]
     * - all other graphics will be offset relative to the base graphic
     * - when all promises have resolved, export is considered to be generated
     * - if any of the promises fail, the export is considered to have failed and a standard error message will be displayed
     *
     * The plugin is free to rearrange `legendBlocks` as it sees fit as long as its structure remains valid.
     *
     * @param {ExportPluginOptions} { legendBlocks, mapSize } `legendBlocks` is a hierarchy of legend block representing the current legend; `mapSize` indicates the size of the map image visible on the screen
     * @returns {Promise<HTMLCanvasElement>[]}
     * @memberof CustomExport
     */

  }, {
    key: "generateExportStack",
    value: function generateExportStack(_ref) {
      var legendBlocks = _ref.legendBlocks,
          mapSize = _ref.mapSize;
      var promises = []; // create a base image and colour it white

      var baseImage = RAMP.utils.createCanvas(mapSize.width + 100, mapSize.height + 100);
      var baseImageCtx = baseImage.getContext('2d');
      baseImageCtx.fillStyle = '#ffffff';
      baseImageCtx.fillRect(0, 0, baseImage.width, baseImage.height); // create underlying base canvas

      promises.push(Promise.resolve({
        graphic: baseImage
      })); //

      var mapImageSize = {
        width: mapSize.width * 0.85 - 20,
        height: mapSize.height - 20
      };
      var sourceX = (mapSize.width - mapImageSize.width) / 2;
      var sourceY = (mapSize.height - mapImageSize.height) / 2; // svg export graphic needs to be generated first because generating a server-side map image hides svg layers (unless using local printing)
      // TODO: prevent map generators from accepting export sizes

      var apiGenerators = this.api.exportGenerators;
      var pointsImage = apiGenerators.mapSVG().then(function (data) {
        var canvas = RAMP.utils.createCanvas(mapImageSize.width, mapImageSize.height); // crop the map image returned by the generator to fit into the layout
        // https://www.html5canvastutorials.com/tutorials/html5-canvas-image-crop/

        canvas.getContext('2d').drawImage(data.graphic, sourceX, sourceY, mapImageSize.width, mapImageSize.height, 0, 0, mapImageSize.width, mapImageSize.height);
        return {
          graphic: canvas,
          offset: [10, 60]
        };
      });
      var mapImage = apiGenerators.mapImage({
        backgroundColour: '#bfe8fe'
      }).then(function (data) {
        var canvas = RAMP.utils.createCanvas(mapImageSize.width, mapImageSize.height); // crop the map image returned by the generator to fit into the layout
        // https://www.html5canvastutorials.com/tutorials/html5-canvas-image-crop/

        canvas.getContext('2d').drawImage(data.graphic, sourceX, sourceY, mapImageSize.width, mapImageSize.height, 0, 0, mapImageSize.width, mapImageSize.height);
        return {
          graphic: canvas,
          offset: [10, 60]
        };
      });
      var northArrowImage = apiGenerators.northArrow().then(function (data) {
        return {
          graphic: data.graphic,
          offset: [40, 90]
        };
      });
      var scaleBarImage = apiGenerators.scaleBar().then(function (data) {
        return {
          graphic: data.graphic,
          offset: [mapImageSize.width - 10 - 120, mapImageSize.height - 10]
        };
      }); // we can pass in a modified copy of the legendBlocks if needed, in order to include/exclude certain layers from legend generation

      legendBlocks._entries = [legendBlocks._entries[2]];
      var legendImage = apiGenerators.legend({
        columnWidth: mapSize.width * 0.2 - 20 - 10,
        width: mapSize.width * 0.2 - 20 - 10,
        height: mapImageSize.height,
        legendBlocks: legendBlocks
      }).then(function (data) {
        return {
          graphic: data.graphic,
          offset: [mapImageSize.width + 10, 50]
        };
      });

      var dataset = new RegExp('[?&]d=([^&]*)').exec(window.location.href)[1];
      var datasets = {
        ahccd: "Adjusted historical climate data",
        cangrd: "Changes in temperature and precipitation",
        capa: "Precipitation estimates",
        cmip5: "Future climate simulations",
        dcs: "High resolution future climate simulations",
        normal: "Average, monthly and daily data",
        hydro: "River levels and flow"
      };
      var titleImage = apiGenerators.htmlMarkup("<span style=\"font-size: 30px;\"><b>Climate data viewer - ".concat(datasets[dataset], "</b></span>")).then(function (data) {
        return {
          graphic: data.graphic,
          offset: [(mapSize.width/2) - (data.graphic.width/2) + 50, 0]
        };
      });

      promises.push(mapImage, pointsImage, northArrowImage, scaleBarImage, legendImage, titleImage);

      if (['cmip5','dcs'].indexOf(dataset) !== -1) {
        var descriptionImage = apiGenerators.footNote('The projected change is relative to the 1986-2005 average.').then(function (data) {
          return {
            graphic: data.graphic,
            offset: [10, mapImageSize.height + 90]
          };
        });
        var slices = [
          '2021-2040',
          '2041-2060',
          '2061-2080',
          '2081-2100'
        ]
        var timeSlice = new RegExp('[?&]ts=([0-9])').exec(window.location.href);
        if (timeSlice) {
          timeSlice = timeSlice[1];
        } else {
          timeSlice = 3;
        }
        var timePeriodImage = new Promise(function(resolve, reject) {
          legendImage.then(function (promiseResult) {
            apiGenerators.htmlMarkup("<span><b>Time Period: </b> ".concat(slices[parseInt(timeSlice)], "</span>")).then(function (data) {
              resolve( {
                graphic: data.graphic,
                offset: [mapImageSize.width + 30, promiseResult.graphic.height + 40]
              });
            })
          })
        });
        var scenarios = {
          rcp85: 'High',
          rcp45: 'Medium',
          rcp26: 'Low'
        }
        var rcp = new RegExp('[?&]r=([^&]*)').exec(window.location.href)[1];
        var rcpImage = new Promise(function(resolve, reject) {
          legendImage.then(function (promiseResult) {
            apiGenerators.htmlMarkup("<span><b>Emission scenario: </b>".concat(scenarios[rcp], "</span>")).then(function (data) {
              resolve({
                graphic: data.graphic,
                offset: [mapImageSize.width + 30, promiseResult.graphic.height + 100]
              });
            })
          })
        });
        promises.push(descriptionImage, timePeriodImage, rcpImage);
      }
      if (dataset !== 'hydro' && dataset !== 'capa') {
        var times = {
          annual: 'Annual',
          spring: 'Spring',
          summer: 'Summer',
          fall: 'Autumn',
          winter: 'Winter',
          jan: 'January',
          feb: 'February',
          mar: 'March',
          apr: 'April',
          may: 'May',
          jun: 'June',
          jul: 'July',
          aug: 'August',
          sep: 'September',
          oct: 'October',
          nov: 'November',
          dec: 'December'
        }
        var timePeriod = new RegExp('[?&]t=([^&]*)').exec(window.location.href)[1];
        var timeOfYearImage = new Promise(function(resolve, reject) {
          legendImage.then(function (promiseResult) {
            apiGenerators.htmlMarkup("<span><b>Time of year: </b> ".concat(times[timePeriod], '</span>')).then(function (data) {
              resolve({
                graphic: data.graphic,
                offset: [mapImageSize.width + 30, promiseResult.graphic.height + 70]
              })
            })
          })
        });
        promises.push(timeOfYearImage)
      }
      if (dataset === 'capa') {
        var months = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December'
        ]
        var timeSlider = new RegExp('[?&]ts=([^&]*)').exec(window.location.href)[1]
        var date = new Date(parseInt(timeSlider));
        var dateImage = new Promise(function (resolve, reject) {
          legendImage.then(function (promiseResult) {
            apiGenerators.htmlMarkup("<span style=\"width: 150px; position = absolute;\"><b>Time Period: </b> ".concat(months[date.getUTCMonth()], ' ', date.getUTCDate(), ', ', date.getUTCFullYear(), ', ', date.getUTCHours(), ':00 UTC', "</span>")).then(function (data) {
              resolve({
                graphic: data.graphic,
                offset: [mapImageSize.width + 30, promiseResult.graphic.height + 40]
              });
            })
          })
        });
        promises.push(dateImage);
      }
      
      return promises;
    }
  }]);

  return CustomExport;
}();


CustomExport.instances = {};
CustomExport.prototype.translations = {
  'en-CA': {
    title: 'Export'
  },
  'fr-CA': {
    title: "Export"
  }
};
window.customExport = CustomExport;