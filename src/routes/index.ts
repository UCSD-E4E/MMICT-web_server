import express from "express";
import { authRouter } from './auth';
import { userRouter } from './users';
import { uploadRoute } from './upload';
import { imageRouter } from './image';

const router = express.Router();

const defaultRoutes = [
    {
        path: '/images',
        route: imageRouter
    },
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
    }
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
