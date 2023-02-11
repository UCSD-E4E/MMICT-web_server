const express = require('express');
const userRoute = require('./users');

const router = express.Router();

const defaultRoutes = [
    // {
    //     path: '/auth',
    //     route: authRoute,
    // },
    {
        path: '/users',
        route: userRoute,
    },
];

// const devRoutes = [
//     // routes available only in development mode
//     {
//         path: '/docs',
//         route: docsRoute,
//     },
// ];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
