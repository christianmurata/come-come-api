import * as restify from 'restify';

import { User } from './users.model';
import { ModelRouter } from '../common/model-router';

class UsersRouter extends ModelRouter<User> {

    constructor() {
        super(User);

        this.on('beforeRender', document => {
            document.password = undefined;
        });
    }

    findByEmail = (req, resp, next) => {
        if(!req.query.email)
            return next();

        User.findByEmail(req.query.email)

        .then(user => user ? [user] : [])

        .then(this.renderAll(resp, next, {
            pageSize: this.limit,
            url: req.url
        }))

        .catch(next);
    }

    applyRoutes(app: restify.Server) {
        app.get(`${ this.path }`, restify.plugins.conditionalHandler([
            { version: '1.0.0', handler: this.findAll },
            { version: '2.0.0', handler: [this.findByEmail, this.findAll] },
        ]));

        app.get(`${ this.path }/:id`, [this.validateId, this.findById]);

        app.post(`${ this.path }`, this.save);

        app.put(`${ this.path }/:id`, [this.validateId, this.replace]);

        app.patch(`${ this.path }/:id`, [this.validateId, this.update]);

        app.del(`${ this.path }/:id`, [this.validateId, this.delete]);
    }

}

export const usersRouter = new UsersRouter;