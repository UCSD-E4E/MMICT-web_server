import express from "express";
import { authRouter } from './auth';
import { userRouter } from './users';
import { uploadRoute } from './upload';
import { deleteRoute } from './delete';
import { downloadRoute } from './download';

const router = express.Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRouter,
    },
    {
        path: '/users',
        route: userRouter,
    },
    {
        path: '/',
        route: uploadRoute,
    },
    {
        path: '/classify',
        route: deleteRoute,
    },
    {
        path: '/classify',
        route: downloadRoute,
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
