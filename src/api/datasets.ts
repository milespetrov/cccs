import { DatasetApi } from './types';
import { AppState } from '@/store/modules/app';
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
            return `${this.baseUrl}/${this.id}/config-${this.state.variableId}.json`;
        } else {
            return `${this.baseUrl}/${this.id}/config-${this.state.variableId}-${this.state.timePeriodId}.json`;
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
        if (data.trend_value__valeur_tendance) {
            if (data.trend_value__valeur_tendance > 0) {
                displayTrend = '+' + parseFloat(data.trend_value__valeur_tendance).toFixed(1);
            } else {
                displayTrend = parseFloat(data.trend_value__valeur_tendance).toFixed(1);
            }
            displayTrend += ' ' + i18n.t(`units.ahccd.${this.state.variableId}.shortName`);
        } else {
            displayTrend = i18n.t('ahccd.tooltips.no_trend');
        }

        const tooltips = {
            variables: `<div class='rv-tooltip-content'><span class='rv-tooltip-text'>
                ${i18n.t('ahccd.tooltips.station_title')}: ${data.station_name__nom_station}
                <br />${i18n.t('ahccd.tooltips.value_title')}: ${displayTrend}</span></div>`,

            stations: `<div class='rv-tooltip-content'><span class='rv-tooltip-text'>${i18n.t(
                'ahccd.tooltips.station_title'
            )}: ${data.station_name__nom_station}</span></div>`
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
        return `${this.baseUrl}/${this.id}/config-${this.state.variableId}-${this.state.timePeriodId}.json`;
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
        return `${this.baseUrl}/${this.id}/config-${this.state.variableId}.json`;
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
        return `${this.baseUrl}/${this.id}/config-${this.state.variableId}-${this.state.timePeriodId}-${
            this.state.rcpId
        }.json`;
    }
}

class CMIP6Api extends DatasetApi {
    constructor(state: AppState) {
        super(state, DatasetId.CMIP6);
    }

    /**
     * Returns a dataset config url based on the curent state.
     *
     * @readonly
     * @type {string}
     * @memberof CMIP6Api
     */
    get fetchUrl(): string {
        return `${this.baseUrl}/${this.id}/config-${this.state.variableId}-${this.state.timePeriodId}-${
            this.state.sspId
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
        return `${this.baseUrl}/${DatasetId.ClimateDaily}/config-${this.state.variableId}.json`;
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
        return `${this.baseUrl}/${DatasetId.ClimateMonthly}/config-${this.state.variableId}.json`;
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
        const growingSeasonVars: string[] = [VariableId.GrowingSeasonWarm, VariableId.GrowingSeasonCool, VariableId.GrowingSeasonOverwinter]
        return `${this.baseUrl}/${this.id}/config-${this.state.variableId}${growingSeasonVars.includes(this.state.variableId!) ? '' : '-' +this.state.timePeriodId}-${
            this.state.rcpId
        }.json`;
    }
}

class DCSu6Api extends DatasetApi {
    constructor(state: AppState) {
        super(state, DatasetId.DCSu6);
    }

    /**
     * Returns a dataset config url based on the curent state.
     *
     * @readonly
     * @type {string}
     * @memberof DCS6Api
     */
    get fetchUrl(): string {
        const growingSeasonVars: string[] = [VariableId.GrowingSeasonWarm, VariableId.GrowingSeasonCool, VariableId.GrowingSeasonOverwinter]
        return `${this.baseUrl}/${this.id}/config-${this.state.variableId}${growingSeasonVars.includes(this.state.variableId!) ? '' : '-' +this.state.timePeriodId}-${
            this.state.sspId
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
        return `${this.baseUrl}/${this.id}/config-${this.state.variableId}.json`;
    }
}

class LTCEApi extends DatasetApi {
    constructor(state: AppState) {
        super(state, DatasetId.LTCE);
    }

    tooltip = true;

    /**
     * Returns a string to be displayed on a tooltip in ramp
     *
     * @param data the data returned by ramp on-hover
     * @returns {string} the tooltip string to be displayed
     */
    getTooltip(data: any): string {

        const mappings = {
            'tmaxh': 'HIGH_MAX_TEMP',
            'tmaxl': 'LOW_MAX_TEMP',
            'tminh': 'HIGH_MIN_TEMP',
            'tminl': 'LOW_MIN_TEMP',
            'precip': 'PRECIPITATION',
            'snd': 'SNOWFALL'
        }

        const tooltips = {
            variables: `<div class='rv-tooltip-content'><span class='rv-tooltip-text'>
                ${i18n.t('ltce.tooltips.station_title')}: ${ i18n.locale === "en" ? data.VIRTUAL_STATION_NAME_E : data.VIRTUAL_STATION_NAME_F }
                <br />${i18n.t('ltce.tooltips.value_title')}: ${data[`FIRST_${mappings[this.state.variableId!]}`]} ${i18n.t(`units.ltce.${this.state.variableId}.shortName`)}</span></div>`,

            stations: `<div class='rv-tooltip-content'><span class='rv-tooltip-text'>${i18n.t(
                'ltce.tooltips.station_title'
            )}: ${ i18n.locale === "en" ? data.VIRTUAL_STATION_NAME_E : data.VIRTUAL_STATION_NAME_F }</span></div>`
        };

        return this.state.variableId!.includes('station') ? tooltips.stations : tooltips.variables;


        //return `<div class='rv-tooltip-content'><span class='rv-tooltip-text'>${data.VIRTUAL_STATION_NAME_E}</span></div>`;
    }

    /**
     * Returns a dataset config url based on the curent state.
     *
     * @readonly
     * @type {string}
     * @memberof LTCEApi
     */
    get fetchUrl(): string {
        return `${this.baseUrl}/${this.id}/config-${this.state.variableId}.json`;
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
            [VariableId.ClimateStations, VariableId.Daily, VariableId.Monthly, VariableId.Hourly].includes(<VariableId>(
                this.state.variableId
            ))
        ) {
            return `${this.baseUrl}/${this.id}/config-${this.state.variableId}.json`;
        } else {
            return `${this.baseUrl}/${this.id}/config-${this.state.variableId}-${this.state.timePeriodId}.json`;
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
                <br />${i18n.t('normal.tooltips.value_title')}: ${parseFloat(data.VALUE).toFixed(1)} ${i18n.t(
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

        return [VariableId.ClimateStations, VariableId.Daily, VariableId.Monthly, VariableId.Hourly].includes(<VariableId>(
            this.state.variableId
        ))
            ? tooltips.stations
            : tooltips.variables;
    }
}

class SPEIApi extends DatasetApi {
    constructor(state: AppState) {
        super(state, DatasetId.SPEI);
    }

    /**
     * Returns a dataset config url based on the curent state.
     *
     * @readonly
     * @type {string}
     * @memberof SPEIApi
     */
    get fetchUrl(): string {
        return `${this.baseUrl}/${this.id}/config-${this.state.variableId}-${
            this.state.timePeriodId
        }-${this.state.rcpId}.json`;
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
    [DatasetId.CMIP6]: wrap(CMIP6Api),
    [DatasetId.DCS]: wrap(DCSApi),
    [DatasetId.DCSu6]: wrap(DCSu6Api),
    [DatasetId.Hydrometric]: wrap(HydroApi),
    [DatasetId.LTCE]: wrap(LTCEApi),
    [DatasetId.SPEI]: wrap(SPEIApi)
};
