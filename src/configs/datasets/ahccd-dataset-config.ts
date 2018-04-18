import { DatasetSource } from './types';
import { VisualizationControlType, TimePeriodType, StageType, RCPType, ViewType, DatasetId, VariableId } from '@/types';

const ahccdDataset: DatasetSource = {
    id: DatasetId.AHCCD,
    views: {
        [ViewType.ChartView]: {
            controls: {
                [VisualizationControlType.Time]: {
                    default: TimePeriodType.January
                }
            }
        },
        [ViewType.MapView]: {
            controls: {
                [VisualizationControlType.Time]: {
                    visible: false,
                    default: TimePeriodType.Annual,
                    options: [TimePeriodType.Annual]
                }
            }
        }
    },

    variables: [VariableId.TMax, VariableId.TMean, VariableId.TMin, VariableId.Precipitation],

    mapTableColumns: [
        'Station Name',
        'Station ID',
        'Beginning Year',
        'Beginning Month',
        'Ending Year',
        'Ending Month',
        'Value'
    ],

    /* aliases: object = {
        station_name_nom: 'Station Name',
        stnid: 'Station ID',
        beg_yr_annee_deb: 'Beginning Year',
        beg_mon_mois_deb: 'Beginning Month',
        end_yr_annee_fin: 'Ending Year',
        end_mon_mois_fin: 'Ending Month',
        Annual_Annuel: 'Annual'
    }; */

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json'
};

export default ahccdDataset;
