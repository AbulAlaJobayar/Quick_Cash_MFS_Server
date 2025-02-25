import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";

const router=Router()
const moduleRoute=[
    {
        path:"/users",
        route:userRoutes
    },
    {
        path:"/auth",
        route:AuthRoutes
    },
]
moduleRoute.forEach((route)=>router.use(route.path,route.route))

export default router