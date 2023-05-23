import express from "express";
import { authRouter } from './auth';
import { userRouter } from './users';
import { uploadRoute } from './upload';
import { deleteRoute } from './delete';

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
        path: '/upload',
        route: uploadRoute,
    },
    {
        path: '/delete',
        route: deleteRoute,
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
