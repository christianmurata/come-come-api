import * as restify from 'restify';
import * as mongoose from 'mongoose';

import { Review } from './reviews.model';
import { ModelRouter } from '../common/model-router';

class ReviewsRouter extends ModelRouter<Review> {
    
    constructor(){
        super(Review);
    }

    protected prepareOne(query: mongoose.DocumentQuery<Review, Review>): mongoose.DocumentQuery<Review, Review> {
        return query
                .populate('user', 'name')
                .populate('restaurant', 'name');
    }

    envelope(document: any) {
        let resource = super.envelope(document);
        const id_restaurant = document.restaurant._id || document.restaurant;

        resource._links.menu = `/restaurants/${id_restaurant}`;

        return resource;
    }

    applyRoutes(app: restify.Server) {
        app.get(`${ this.path }`, this.findAll);

        app.get(`${ this.path }/:id`, [ this.validateId, this.findById ]);

        app.post(`${ this.path }`, this.save);
    }

}

export const reviewsRouter = new ReviewsRouter;