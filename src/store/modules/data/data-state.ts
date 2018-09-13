import { BreadCrumbEntity } from '@/types';

export interface DataState {
    urlSuffixes: object | null;
    dataQueryUrl: string | null;
    dataCatalogueUrl: string | null;
    languageToggleDomain: string | null;
    breadCrumbUrls: BreadCrumbEntity[];
}
