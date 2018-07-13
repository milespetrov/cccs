function parser(stuff) {
    return stuff;

    /* return stuff.split('\n').reduce((map, line) => {
        const [key, value] = line.split('=');
        map[(key || '').trim()] = (value || '').trim().replace(`'`, '');
        return map;
    }, {}); */
}
