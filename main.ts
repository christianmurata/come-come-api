import { Server } from './server/server';
import { mainRouter } from './main.router';
import { usersRouter } from './users/users.router';
import { reviewsRouter } from './reviews/reviews.router';
import { restaurantsRouter } from './restaurants/restaurants.router';

const server = new Server();
const routes = [mainRouter, usersRouter, reviewsRouter, restaurantsRouter];

server.bootstrap(routes).then(server => {
    console.log('Server is listening on: ', server.app.address())
})

.catch(error => {
    console.log('Server failed to Start');
    console.error(error);

    process.exit(1);
});