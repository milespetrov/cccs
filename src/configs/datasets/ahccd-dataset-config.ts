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

    legend: {
        [VariableId.TMax] : 'Temperature <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAZhJREFUKJGd0rFrE2EYx/HvkfeSnL0kttbAGZsiiqGUQkG3ugiCLpqlf4LYXQuldXAUJaDgILqXDi4WStUsESXpEDNUCSHgYmPuxJBrer02vql6HdSj0RDFZ3uGz8PveXgE/1niYOPdQkOfvLYj29PbHUY0QSMWFisEYg+UGwW7J/Qyp07UWoFcy3RHI+EA0RBsdxitteTZkPh83buTuqTMVde6oHePUMXk5ZFDIjlhaP7UIeB4FNzOXnTddLPe7dSYMl/96MNKffxmLEwyPqD23EcPqpw8qusly30IXPahs+teGYsP9j2GHlQJKOFzXVE1VT3cV/2s4QixiykSL6rUBcA39px/gZoQW28dYwisH7C501kHJv4GTUeWLMuq+1Efr8nchdOcBxJ93Jen72rPANuHT8r280d5ojNTyXkg3gO133zYXLhfGsiDxIeAufCa/PvGxuzddPKMAmkUjgFNTyG7WGyvXl3+5Egpi78m+Z9j23YxU6CeKdhfgVfAd0ABgoZhlKWU5YMRun4VMIGl33NalvVH9n1vMIv6VIoBgAAAAABJRU5ErkJggg==">',
        [VariableId.TMean] : 'Temperature <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAZhJREFUKJGd0rFrE2EYx/HvkfeSnL0kttbAGZsiiqGUQkG3ugiCLpqlf4LYXQuldXAUJaDgILqXDi4WStUsESXpEDNUCSHgYmPuxJBrer02vql6HdSj0RDFZ3uGz8PveXgE/1niYOPdQkOfvLYj29PbHUY0QSMWFisEYg+UGwW7J/Qyp07UWoFcy3RHI+EA0RBsdxitteTZkPh83buTuqTMVde6oHePUMXk5ZFDIjlhaP7UIeB4FNzOXnTddLPe7dSYMl/96MNKffxmLEwyPqD23EcPqpw8qusly30IXPahs+teGYsP9j2GHlQJKOFzXVE1VT3cV/2s4QixiykSL6rUBcA39px/gZoQW28dYwisH7C501kHJv4GTUeWLMuq+1Efr8nchdOcBxJ93Jen72rPANuHT8r280d5ojNTyXkg3gO133zYXLhfGsiDxIeAufCa/PvGxuzddPKMAmkUjgFNTyG7WGyvXl3+5Egpi78m+Z9j23YxU6CeKdhfgVfAd0ABgoZhlKWU5YMRun4VMIGl33NalvVH9n1vMIv6VIoBgAAAAABJRU5ErkJggg==">',
        [VariableId.TMin] : 'Temperature <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAZhJREFUKJGd0rFrE2EYx/HvkfeSnL0kttbAGZsiiqGUQkG3ugiCLpqlf4LYXQuldXAUJaDgILqXDi4WStUsESXpEDNUCSHgYmPuxJBrer02vql6HdSj0RDFZ3uGz8PveXgE/1niYOPdQkOfvLYj29PbHUY0QSMWFisEYg+UGwW7J/Qyp07UWoFcy3RHI+EA0RBsdxitteTZkPh83buTuqTMVde6oHePUMXk5ZFDIjlhaP7UIeB4FNzOXnTddLPe7dSYMl/96MNKffxmLEwyPqD23EcPqpw8qusly30IXPahs+teGYsP9j2GHlQJKOFzXVE1VT3cV/2s4QixiykSL6rUBcA39px/gZoQW28dYwisH7C501kHJv4GTUeWLMuq+1Efr8nchdOcBxJ93Jen72rPANuHT8r280d5ojNTyXkg3gO133zYXLhfGsiDxIeAufCa/PvGxuzddPKMAmkUjgFNTyG7WGyvXl3+5Egpi78m+Z9j23YxU6CeKdhfgVfAd0ABgoZhlKWU5YMRun4VMIGl33NalvVH9n1vMIv6VIoBgAAAAABJRU5ErkJggg==">',
        [VariableId.Precipitation] : 'Precipitation <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAZ1JREFUKJGd0k8og3EYB/Dvu7F378w7NmT+jCXJwckuioMiLrg4Oor7kjIH9yWJg2i5iZJy8D9Fq+WAMn/ybzXan5+lvfHOeN+82+uAtc0aeW6/pz6/vs/Tk4N/Vk7yY8wvMxEJA9JrtPc9GqmkaOZRzerWpBimp2ooLiO03svmB59vT+CfqnI1+VDls5BeI1Vh4rMoVLR12Ct32s3UQQrs98g0d3u5ryk0mIrrGpL+1QOlFRCiL2zgyr1jvZPrJ6opfwJK3stRmtWZNIaSjPOo87QoNNVoQ+fHMwC6ElCI8t1FtfVZl6HO00KhUDanRKVppiCr+ipGX6RDXUc5rrcDn1HjMf4vUEkzz0b+VE+ATyhwYTeAhl8cXkLBY0JIIBHVvTS3Z25pawVQnsUJN7urmwC4BPSsL28dNc2ylr7BEQCZVvtG3Ee22/lJ13fj+wCCpxM219OdZ6h91N4oU1QPgDIA4TjknbOVhQ2nrZ8XRfEwHYLjuEPOMR44cYxLAJwA4gAoACqj0XghiuJFcoSUWwUQBLCYnpMQ8iP7B4nzmJV1CU1/AAAAAElFTkSuQmCC">'
    },

    mapTableColumns: [
        'Station Name',
        'Station ID',
        'Beginning Year',
        'Beginning Month',
        'Ending Year',
        'Ending Month',
        'Value'
    ],

    mapConfigPath: 'config-base.json',
    layersConfigPath: 'config-snippets.json'
};

export default ahccdDataset;
