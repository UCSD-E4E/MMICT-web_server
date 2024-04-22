import express from "express";
import { userRouter } from './users';
import { uploadRoute } from './upload';

const router = express.Router();

const defaultRoutes = [
    {
        path: '/users',
        route: userRouter,
    },
    {
        path: '/',
        route: uploadRoute,
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

export default router;
