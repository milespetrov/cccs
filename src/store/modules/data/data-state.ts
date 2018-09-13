import { BreadCrumbEntity } from '@/types';

export interface DataState {
    urlSuffixes: object | null;
    dataQueryUrl: string | null;
    dataCatalogueUrl: string | null;
    breadCrumbUrls: BreadCrumbEntity[];
}
