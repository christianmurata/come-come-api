import * as jestCli from 'jest-cli';

import { User } from './users/users.model';
import { Server } from './server/server';
import { Review } from './reviews/reviews.model';
import { Restaurant } from './restaurants/restaurants.model';
import { environment } from './common/environment';
import { usersRouter } from './users/users.router';
import { reviewsRouter } from './reviews/reviews.router';
import { restaurantsRouter } from './restaurants/restaurants.router';

let server: Server;

const beforeAllTests = () => {
    environment.db.url = process.env.DB_URL || 'mongodb://localhost/come-come-api-test';
    environment.server.port = process.env.SERVER_PORT || 3001;

    server = new Server();
    
    return server.bootstrap([usersRouter, reviewsRouter, restaurantsRouter])
    
    .then(() => {
        User.remove({}).exec();
        Review.remove({}).exec();
        Restaurant.remove({}).exec();
    })

    .catch(error => {
        console.log('Server failed to Start');
        console.error(error);
    
        process.exit(1);
    });
}

const afterAllTests = () => {
    return server.shutdown();
}

beforeAllTests()

.then(() => jestCli.run())
.then(() => afterAllTests())
.catch(console.error);