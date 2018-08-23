import { DatasetApi } from './types';
import { AppState } from '@/store';
import { DatasetId, VariableId } from '@/types';
import { i18n } from '@/lang';

/**
 *
 *
 * @class AHCCDApi
 * @extends {DatasetApi}
 */
class AHCCDApi extends DatasetApi {
    constructor(state: AppState) {
        super(state, DatasetId.AHCCD);
    }

    /**
     * Returns a dataset config url based on the curent state.
     *
     * @readonly
     * @type {string}
     * @memberof AHCCDApi
     */
    get fetchUrl(): string {
        if (this.state.variableId === 'stations') {
            return `${this.baseUrl}/${this.id}/${this.version}/config-${this.state.variableId}.json`;
        } else {
            return `${this.baseUrl}/${this.id}/${this.version}/config-${this.state.variableId}-${
                this.state.timePeriodId
            }.json`;
        }
    }

    tooltip = true;

    /**
     * Returns a string to be displayed on a tooltip in ramp
     *
     * @param data the data returned by ramp on-hover
     * @returns {string} the tooltip string to be displayed
     */
    getTooltip(data: any): string {
        // trend value formatting
        let displayTrend;
        if (data.trend_value) {
            if (data.trend_value > 0) {
                displayTrend = '+' + data.trend_value;
            } else {
                displayTrend = data.trend_value;
            }
            displayTrend += ' ' + i18n.t(`units.ahccd.${this.state.variableId}.shortName`);
        } else {
            displayTrend = i18n.t('ahccd.tooltips.no_trend');
        }

        const tooltips = {
            variables: `<div class='rv-tooltip-content'><span class='rv-tooltip-text'>
                ${i18n.t('ahccd.tooltips.station_title')}: ${data.station_name}
                <br />${i18n.t('ahccd.tooltips.value_title')}: ${displayTrend}</span></div>`,

            stations: `<div class='rv-tooltip-content'><span class='rv-tooltip-text'>${i18n.t(
                'ahccd.tooltips.station_title'
            )}: ${data.station_name}</span></div>`
        };

        return this.state.variableId === VariableId.ClimateStations ? tooltips.stations : tooltips.variables;
    }
}

class CanGrdApi extends DatasetApi {
    constructor(state: AppState) {
        super(state, DatasetId.CANGRD);
    }

    /**
     * Returns a dataset config url based on the curent state.
     *
     * @readonly
     * @type {string}
     * @memberof CanGrdApi
     */
    get fetchUrl(): string {
        return `${this.baseUrl}/${this.id}/${this.version}/config-${this.state.variableId}-${
            this.state.timePeriodId
        }.json`;
    }
}

class CAPAApi extends DatasetApi {
    constructor(state: AppState) {
        super(state, DatasetId.CAPA);
    }

    /**
     * Returns a dataset config url based on the curent state.
     *
     * @readonly
     * @type {string}
     * @memberof CAPAApi
     */
    get fetchUrl(): string {
        return `${this.baseUrl}/${this.id}/${this.version}/config-${this.state.variableId}.json`;
    }
}

class CMIP5Api extends DatasetApi {
    constructor(state: AppState) {
        super(state, DatasetId.CMIP5);
    }

    /**
     * Returns a dataset config url based on the curent state.
     *
     * @readonly
     * @type {string}
     * @memberof CMIP5Api
     */
    get fetchUrl(): string {
        return `${this.baseUrl}/${this.id}/${this.version}/config-${this.state.variableId}-${this.state.timePeriodId}-${
            this.state.rcpId
        }.json`;
    }
}

class DailyApi extends DatasetApi {
    constructor(state: AppState) {
        super(state, DatasetId.ClimateDaily);
    }

    /**
     * Returns a dataset config url based on the curent state.
     *
     * @readonly
     * @type {string}
     * @memberof DailyApi
     */
    get fetchUrl(): string {
        return `${this.baseUrl}/${DatasetId.ClimateDaily}/${this.version}/config-${this.state.variableId}.json`;
    }

    tooltip = true;

    getTooltip(data: any): string {
        return `<div class='rv-tooltip-content'><span class='rv-tooltip-text'>${i18n.t(
            'normal.tooltips.station_name_title'
        )}: ${data.STATION_NAME}<br />${i18n.t('normal.tooltips.prov_title')}: ${
            i18n.locale === 'en' ? data.ENG_PROV_NAME : data.FRE_PROV_NAME
        }<br />${i18n.t('normal.tooltips.wmo_title')}: ${data.WMO_IDENTIFIER || '-'}<br />${i18n.t(
            'normal.tooltips.tc_title'
        )}: ${data.TC_IDENTIFIER || '-'}</span></div>`;
    }
}

class MonthlyApi extends DatasetApi {
    constructor(state: AppState) {
        super(state, DatasetId.ClimateMonthly);
    }

    /**
     * Returns a dataset config url based on the curent state.
     *
     * @readonly
     * @type {string}
     * @memberof MonthlyApi
     */
    get fetchUrl(): string {
        return `${this.baseUrl}/${DatasetId.ClimateMonthly}/${this.version}/config-${this.state.variableId}.json`;
    }

    tooltip = true;

    getTooltip(data: any): string {
        return `<div class='rv-tooltip-content'><span class='rv-tooltip-text'>${i18n.t(
            'normal.tooltips.station_name_title'
        )}: ${data.STATION_NAME}<br />${i18n.t('normal.tooltips.prov_title')}: ${
            i18n.locale === 'en' ? data.ENG_PROV_NAME : data.FRE_PROV_NAME
        }<br />${i18n.t('normal.tooltips.wmo_title')}: ${data.WMO_IDENTIFIER || '-'}<br />${i18n.t(
            'normal.tooltips.tc_title'
        )}: ${data.TC_IDENTIFIER || '-'}</span></div>`;
    }
}

class DCSApi extends DatasetApi {
    constructor(state: AppState) {
        super(state, DatasetId.DCS);
    }

    /**
     * Returns a dataset config url based on the curent state.
     *
     * @readonly
     * @type {string}
     * @memberof DCSApi
     */
    get fetchUrl(): string {
        return `${this.baseUrl}/${this.id}/${this.version}/config-${this.state.variableId}-${this.state.timePeriodId}-${
            this.state.rcpId
        }.json`;
    }
}

class HydroApi extends DatasetApi {
    constructor(state: AppState) {
        super(state, DatasetId.Hydrometric);
    }

    tooltip = true;

    /**
     * Returns a string to be displayed on a tooltip in ramp
     *
     * @param data the data returned by ramp on-hover
     * @returns {string} the tooltip string to be displayed
     */
    getTooltip(data: any): string {
        return `<div class='rv-tooltip-content'><span class='rv-tooltip-text'>${data.STATION_NAME} (${
            data.PROV_TERR_STATE_LOC
        })</span></div>`;
    }

    /**
     * Returns a dataset config url based on the curent state.
     *
     * @readonly
     * @type {string}
     * @memberof HydroApi
     */
    get fetchUrl(): string {
        return `${this.baseUrl}/${this.id}/${this.version}/config-${this.state.variableId}.json`;
    }
}

class NormalApi extends DatasetApi {
    constructor(state: AppState) {
        super(state, DatasetId.ClimateNormal);
    }

    /**
     * Returns a dataset config url based on the curent state.
     *
     * @readonly
     * @type {string}
     * @memberof NormalApi
     */
    get fetchUrl(): string {
        if (
            this.state.variableId === 'stations' ||
            this.state.variableId === 'monthly' ||
            this.state.variableId === 'daily'
        ) {
            return `${this.baseUrl}/${this.id}/${this.version}/config-${this.state.variableId}.json`;
        } else {
            return `${this.baseUrl}/${this.id}/${this.version}/config-${this.state.variableId}-${
                this.state.timePeriodId
            }.json`;
        }
    }

    tooltip = true;

    /**
     * Returns a string to be displayed on a tooltip in ramp
     *
     * @param data the data returned by ramp on-hover
     * @returns {string} the tooltip string to be displayed
     */
    getTooltip(data: any): string {
        const tooltips = {
            variables: `<div class='rv-tooltip-content'><span class='rv-tooltip-text'>
                ${i18n.t('normal.tooltips.station_name_title')}: ${data.STATION_NAME}
                <br />${i18n.t('normal.tooltips.value_title')}: ${data.VALUE} ${i18n.t(
                `units.normal.${this.state.variableId}.shortName`
            )}</span></div>`,

            stations: `<div class='rv-tooltip-content'><span class='rv-tooltip-text'>${i18n.t(
                'normal.tooltips.station_name_title'
            )}: ${data.STATION_NAME}<br />${i18n.t('normal.tooltips.prov_title')}: ${
                i18n.locale === 'en' ? data.ENG_PROV_NAME : data.FRE_PROV_NAME
            }<br />${i18n.t('normal.tooltips.wmo_title')}: ${data.WMO_IDENTIFIER || '-'}<br />${i18n.t(
                'normal.tooltips.tc_title'
            )}: ${data.TC_IDENTIFIER || '-'}</span></div>`
        };

        return this.state.variableId === VariableId.ClimateStations ? tooltips.stations : tooltips.variables;
    }
}

/**
 * A helper function to create a new DatasetAPI instance from the supplied Dataste type.
 * Returns a function accepting the current app state which in turns return an actual instance of the DatasetAPI.
 *
 * @param {new (state: AppState) => DatasetApi} datasetType
 * @returns
 */
function wrap(datasetType: new (state: AppState) => DatasetApi) {
    return (state: AppState) => new datasetType(state);
}

export default {
    [DatasetId.AHCCD]: wrap(AHCCDApi),
    [DatasetId.CANGRD]: wrap(CanGrdApi),
    [DatasetId.CAPA]: wrap(CAPAApi),
    [DatasetId.ClimateDaily]: wrap(DailyApi),
    [DatasetId.ClimateMonthly]: wrap(MonthlyApi),
    [DatasetId.ClimateNormal]: wrap(NormalApi),
    [DatasetId.CMIP5]: wrap(CMIP5Api),
    [DatasetId.DCS]: wrap(DCSApi),
    [DatasetId.Hydrometric]: wrap(HydroApi)
};
