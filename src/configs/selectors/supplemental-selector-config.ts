import { SupplementalLayers, SupplementalSelectorConfig } from './types';
import { SupplementalId } from '@/types';

export const supplementalSelectorConfig: SupplementalSelectorConfig = {
    id: 'supplementalSelector',
    items: [SupplementalId.NP, SupplementalId.NTSN, SupplementalId.CDD, SupplementalId.ATRIS]
};

export const supplementalLayersEn: SupplementalLayers = {
    "NP": {
        id: 'NP',
        name: 'National Parks and National Park_Reserves of Canada Legislative Boundaries',
        layerType: 'esri-feature',
        url: 'https://proxyinternet.nrcan-rncan.gc.ca/arcgis/rest/services/CLSS-SATC/CLSS_Administrative_Boundaries/MapServer/1',
        catalogueUrl: 'https://open.canada.ca/data/en/dataset/9e1507cd-f25c-4c64-995b-6563bf9d65bd'
    },
    "NTSN": {
        id: 'NTSN',
        name: 'National Transportation Systems Network',
        layerType: 'ogc-wms',
        url: 'https://maps.geogratis.gc.ca/wms/canvec_en?request=getcapabilities&service=wms&layers=transport&version=1.3.0&legend_format=image/png&feature_info_type=text/html',
        catalogueUrl: 'https://open.canada.ca/data/en/dataset/2dac78ba-8543-48a6-8f07-faeef56f9895',
        sublayers: [
            {
                id: 'transport'
            }
        ],
    },
    "CDD": {
        id: 'CDD',
        name: 'Canadian Disaster Database',
        layerType: 'esri-map-image',
        url: 'https://maps-cartes.dev.ec.gc.ca/arcgis/rest/services/CCDS/CDD_BDC/MapServer',
        sublayers: [
            {
                index: 3,
                state: {
                    visibility: true,
                    opacity: 1
                }
            }
        ]
    },
    "ATRIS": {
        id: 'ATRIS',
        name: 'GEO_ATRIS_LAYERS_E-206a',
        layerType: 'esri-map-image',
        url: 'https://services.sac-isc.gc.ca/geomatics/rest/services/ATRIS_PRD/GEO_ATRIS_E/MapServer',
        sublayers: [
            {
                index: 0,
                state: {
                    visibility: true,
                    opacity: 1
                }
            }
        ]
    }
};

export const supplementalLayersFr: SupplementalLayers = {
    "NP": {
        id: 'NP',
        name: 'Limites legislatives des parcs nationaux et des reserves a vocation de parc national du Canada',
        layerType: 'esri-feature',
        url: 'https://proxyinternet.nrcan-rncan.gc.ca/arcgis/rest/services/CLSS-SATC/SATC_Limites_administratives/MapServer/1',
        catalogueUrl: 'https://open.canada.ca/data/en/dataset/9e1507cd-f25c-4c64-995b-6563bf9d65bd'
    },
    "NTSN": {
        id: 'NTSN',
        name: 'Réseau national de systèmes de transport',
        layerType: 'ogc-wms',
        url: 'https://cartes.geogratis.gc.ca/wms/canvec_fr?request=getcapabilities&service=wms&layers=transport&version=1.3.0&legend_format=image/png&feature_info_type=text/html',
        catalogueUrl: 'https://open.canada.ca/data/en/dataset/2dac78ba-8543-48a6-8f07-faeef56f9895',
        sublayers: [
            {
                id: 'transport'
            }
        ]
    },
    "CDD": {
        id: 'CDD',
        name: 'Base de Données Canadienne sur les Catastrophes',
        layerType: 'esri-map-image',
        url: 'https://maps-cartes.dev.ec.gc.ca/arcgis/rest/services/CCDS/CDD_BDC/MapServer',
        sublayers: [
            {
                index: 0,
                state: {
                    visibility: true,
                    opacity: 1
                }
            }
        ]
    },
    "ATRIS": {
        id: 'ATRIS',
        name: 'GEO_ATRIS_LAYERS_E-206a  ',
        layerType: 'esri-map-image',
        url: 'https://services.sac-isc.gc.ca/geomatics/rest/services/ATRIS_PRD/GEO_ATRIS_F/MapServer',
        sublayers: [
            {
                index: 0,
                state: {
                    visibility: true,
                    opacity: 1
                }
            }
        ]
    }
}
