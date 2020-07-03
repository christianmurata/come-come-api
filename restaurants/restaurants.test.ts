import 'jest';
import * as request from 'supertest';

let id_restaurant: any;
let address: string = (<any>global).address;

test('post /restaurants', () => {
    return request(address)

    .post('/restaurants')

    .send({
        name: 'Restaurant test'
    })

    .then(response => {
        expect(response.status).toBe(200);
        expect(response.body._id).toBeDefined();
        expect(response.body.name).toBe('Restaurant test');

        id_restaurant = response.body._id;
    })

    .catch(fail);
});

test('get /restaurants', () => {
    return request(address)

    .get('/restaurants')

    .then(response => {
        expect(response.status).toBe(200);
        expect(response.body.items).toBeInstanceOf(Array);
    })

    .catch(fail);
});

test('get /restaurants/:id', () => {
    return request(address)

    .get(`/restaurants/${id_restaurant}`)

    .then(response => {
        expect(response.status).toBe(200);
        expect(response.body._id).toBeDefined();
        expect(response.body.name).toBeDefined();
    })

    .catch(fail);
});

test('get /restaurants/:id/menu', () => {
    return request(address)

    .get(`/restaurants/${id_restaurant}/menu`)

    .then(response => {
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    })

    .catch(fail);
});

test('put /restaurants/:id', () => {
    return request(address)

    .put(`/restaurants/${id_restaurant}`)

    .send({
        name: 'Restaurant test - put'
    })

    .then(response => {
        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Restaurant test - put');
        expect(response.body._id).toBeDefined();
    })

    .catch(fail);
});

test('put /restaurants/:id/menu', () => {
    return request(address)

    .put(`/restaurants/${id_restaurant}/menu`)

    .send([
        {
            name: 'coca cola',
            price: 2.5
        },

        {
            name: 'x-burguer',
            price: 25.00
        }
    ])

    .then(response => {
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    })

    .catch(fail);
});

test('patch /restaurants/:id', () => {
    return request(address)

    .patch(`/restaurants/${id_restaurant}`)

    .send({
        name: 'Restaurant test - patch'
    })

    .then(response => {
        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Restaurant test - patch');
        expect(response.body._id).toBeDefined();
    })

    .catch(fail);
});

test('delete /restaurant/:id', () => {
    return request(address)

    .del(`/restaurants/${id_restaurant}`)

    .then(response => {
        expect(response.status).toBe(204);
    })

    .catch(fail);
});