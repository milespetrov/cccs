docute.init({
    landing: 'landing.html',
    debug: true,
    // repo: 'user/repo',
    tocVisibleDepth: 3,
    nav: {
        default: [
            {
                title: 'Home',
                path: '/home'
            },
            {
                title: 'UI Specs',
                path: '/ui_specs'
            },
            {
                title: 'Developers Guide',
                path: '/dev_guide'
            }
        ]
    },
    plugins: [evanyou()]
});
