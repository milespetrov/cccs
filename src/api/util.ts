import { DatasetId } from '@/types';

// default number of cached responses per key
const CACHE_DEPTH = 3;

interface CachedResponce {
    url: string;
    data: any;
}

/**
 * Get item from the session storage given its key.
 *
 * @template T
 * @param {string} key
 * @returns {(T | null)}
 */
function getSessionItem<T>(key: string): T | null {
    // if `sessionStorage` is not supported, do nothing
    if (!window.sessionStorage) {
        return null;
    }

    const item = window.sessionStorage.getItem(key);
    if (!item) {
        return null;
    }

    return JSON.parse(item) as T;
}

/**
 * Stores an item in the session storage given its key.
 * If the session storage is full, all items are deleted.
 *
 * @param {string} key
 * @param {object} item
 */
function setSessionItem(key: string, item: object): void {
    // if `sessionStorage` is not supported, do nothing
    if (!window.sessionStorage) {
        return;
    }

    try {
        window.sessionStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
        console.warn('Session storage quote reached or exceeded');
        window.sessionStorage.clear();
    }
}

/**
 * Retrieves a JSON object given its url or fetches its cache from the session storage.
 *
 * @export
 * @template T
 * @param {string} url url of the JSON object to be loaded
 * @param {DatasetId} apiId dataset id
 * @param {string} key an arbitrary key which is combined with the apiId to cache item
 * @param {number} [depth=CACHE_DEPTH] the number of responses of the given combination of apiId and key to cache
 * @returns {Promise<T>}
 */
export async function getJSON<T>(url: string, apiId: DatasetId, key: string, depth: number = CACHE_DEPTH): Promise<T> {
    // TODO: Add flag to better control when to cache, turning off because of how many config changes we have

    /* const itemKey = `${apiId}-${key}`;

    // get cached responses for this `apiId` and `key` or create a new array of not defined yed
    const dataCache = getSessionItem<CachedResponce[]>(itemKey) || [];
    const response = dataCache.find(r => r.url === url);

    // if cached response is found, return it
    if (response) {
        return response.data as T;
    } */

    const data: T = await $.getJSON(url);

    /* // store response in the dataCache
    dataCache.unshift({ url, data });
    // keeps the number of cached responses under the limit
    dataCache.splice(depth);

    // save the cached responses in the session storage
    setSessionItem(itemKey, dataCache); */

    return data;
}
