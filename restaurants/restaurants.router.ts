import * as restify from 'restify';
import {NotFoundError} from 'restify-errors';

import {Restaurant} from './restaurants.model';
import {ModelRouter} from '../common/model-router';

class RestaurantsRouter extends ModelRouter<Restaurant> {

    constructor() {
        super(Restaurant);
    }

    envelope(document: any) {
        let resource = super.envelope(document);

        resource._links.menu = `${this.path}/${resource._id}/menu`;

        return resource;
    }

    findMenu(req, resp, next) {
        Restaurant.findById(req.params.id, "+menu")
        
        .then(restaurant => {
            if(!restaurant)
                throw new NotFoundError('Restaurant Not Found');
                
            resp.json(restaurant.menu);

            return next();
        })
        
        .catch(next);
    }

    replaceMenu(req, resp, next) {
        Restaurant.findById(req.params.id, "+menu")
        
        .then(restaurant => {
            if(!restaurant)
                throw new NotFoundError('Restaurant Not Found');
                
            restaurant.menu = req.body

            return restaurant.save();
        })

        .then(restaurant => {
            resp.json(restaurant.menu);

            return next();
        })
        
        .catch(next);
    }

    applyRoutes(app: restify.Server) {
        app.get(`${ this.path }`, this.findAll);

        app.get(`${ this.path }/:id`, [this.validateId, this.findById]);

        app.get(`${ this.path }/:id/menu`, [this.validateId, this.findMenu]);

        app.post(`${ this.path }`, this.save);

        app.put(`${ this.path }/:id`, [this.validateId, this.replace]);

        app.put(`${ this.path }/:id/menu`, [this.validateId, this.replaceMenu])

        app.patch(`${ this.path }/:id`, [this.validateId, this.update]);

        app.del(`${ this.path }/:id`, [this.validateId, this.delete]);
    }

}

export const restaurantsRouter = new RestaurantsRouter;