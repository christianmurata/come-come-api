import * as restify from 'restify';

import { Router } from './common/router';

class MainRouter extends Router {

    listRoutes(req, resp, next) {
        resp.json({
            users: '/users',
            reviews: '/reviews',
            restaurants: '/restaurants'
        });
    }

    applyRoutes(app: restify.Server) {
        app.get('/', this.listRoutes);
    }

}

export const mainRouter = new MainRouter;