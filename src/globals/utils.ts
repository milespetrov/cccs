/**
 * Formats a latlong into degrees minutes seconds
 *
 * Taken from RAMP source
 *
 * @param long longitude coordinate
 * @param lat latitude coordinate
 */
export function formatLatLong(long: number, lat: number): { x: string; y: string } {
    const degreeSymbol = String.fromCharCode(176);

    const dy = Math.floor(Math.abs(lat)) * (lat < 0 ? -1 : 1);
    const my = Math.floor(Math.abs((lat - dy) * 60));
    const sy = Math.round((Math.abs(lat) - Math.abs(dy) - my / 60) * 3600);

    const dx = Math.floor(Math.abs(long)) * (long < 0 ? -1 : 1);
    const mx = Math.floor(Math.abs((long - dx) * 60));
    const sx = Math.round((Math.abs(long) - Math.abs(dx) - mx / 60) * 3600);

    const newY = `${Math.abs(dy)}${degreeSymbol} ${padZero(my)}' ${padZero(sy)}"`;
    const newX = `${Math.abs(dx)}${degreeSymbol} ${padZero(mx)}' ${padZero(sx)}"`;

    return { x: newX, y: newY };

    /**
     * Pad value with leading 0 to make sure there is always 2 digits if number is below 10.
     *
     * @function padZero
     * @private
     * @param {Number} val value to pad with 0
     * @return {String} string with always 2 characters
     */
    function padZero(val: number) {
        return val >= 10 ? `${val}` : `0${val}`;
    }
}
