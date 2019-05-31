module.exports = [
    [
        /\/api\/site\/(\d+)\/(\w+)(?:\/(\d+))?/,
        'api/site/:2/:3?site_id=:1'
    ],
    [
        /\/api\/metric\/(\d+)\/(\w+)(?:\/(\d+))?/,
        'api/metric/:2/:3?site_id=:1'
    ]
];
