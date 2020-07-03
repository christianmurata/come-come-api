import 'jest';
import * as mongoose from 'mongoose';
import * as request from 'supertest';

let id_review: any;
let address: string = (<any>global).address;

test('post /reviews', () => {
    const date: Date = new Date();
    const user = mongoose.Types.ObjectId();
    const restaurant = mongoose.Types.ObjectId();

    return request(address)

    .post('/reviews')

    .send({
        date: date,
        rating: 5,
        comments: "Teste de qualidade",
        user,
        restaurant
    })

    .then(response => {
        expect(response.status).toBe(200);
        expect(response.body._id).toBeDefined();
        expect(response.body.date).toBe(date.toISOString());
        expect(response.body.comments).toBe("Teste de qualidade");
        expect(response.body.rating).toBe(5);
        expect(response.body.user).toBe(user.toHexString());
        expect(response.body.restaurant).toBe(restaurant.toHexString());

        id_review = response.body._id;
    })
});

test('get /reviews', () => {
    return request(address)

    .get('/reviews')

    .then(response => {

        console.log(response.body.items);

        expect(response.status).toBe(200);
        expect(response.body.items).toBeInstanceOf(Array);
    })

    .catch(fail);
});

test.skip('get /reviews/:id', () => {
    return request(address)

    .get(`/reviews/${id_review}`)

    .then(response => {
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    })

    .catch(fail);
});