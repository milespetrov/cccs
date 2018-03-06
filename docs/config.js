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
                title: 'Software Design',
                type: 'dropdown',
                items: [
                    { type: 'label', title: 'System Design' },
                    {
                        title: 'System Organization',
                        path: '/system/organization',
                        matchPath: /\/organization/
                    },
                    {
                        title: 'Technology Overview',
                        path: '/system/technology',
                        matchPath: /\/technology/
                    },
                    {
                        title: 'Design Strategies',
                        path: '/system/strategies',
                        matchPath: /\/strategies/
                    },
                    { type: 'sep' },
                    { type: 'label', title: 'UI Design' },
                    {
                        title: 'UI Specs',
                        path: '/design/ui_specs',
                        matchPath: /\/ui_specs/
                    },
                    {
                        title: 'Mockups',
                        path: '/design/mockups',
                        matchPath: /\/mockups/
                    },
                    { type: 'sep' },
                    { type: 'label', title: 'Developers Guide' },
                    {
                        title: 'Coding Standards',
                        path: '/guide/coding_standards',
                        matchPath: /\/coding_standards/
                    },
                    {
                        title: 'Code Organization',
                        path: '/guide/code_organization',
                        matchPath: /\/code_organization/
                    },
                    {
                        title: 'Tools, builds, and brances',
                        path: '/guide/tools_builds_branches',
                        matchPath: /\/tools_builds_branches/
                    },
                    { type: 'sep' },
                    { type: 'label', title: 'Solution Details' },
                    {
                        title: 'Routing and Bookmark',
                        path: '/solution/routing_bookmark',
                        matchPath: /\/routing_bookmark/
                    },
                    {
                        title: 'Localization Strategy',
                        path: '/solution/localization_strategy',
                        matchPath: /\/localization_strategy/
                    }
                ]
            }
        ]
    },
    plugins: [evanyou(), docuteIframe()]
});
