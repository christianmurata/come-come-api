import 'jest';
import * as request from 'supertest';

let address: string = (<any>global).address;

const usuario = {
    _id: null,
    name: 'Usuario 1',
    email: 'usuario1@gmail.com',
    password: '123456',
    cpf: '408.709.730-70'
};

test('get /users', () => {
    return request(address)

    .get('/users')

    .then(response => {
        expect(response.status).toBe(200);
        expect(response.body.items).toBeInstanceOf(Array);
    })

    .catch(fail);
});

test('post /users', () => {
    return request(address)

    .post('/users')

    .send({
        name: usuario.name,
        email: usuario.email,
        password: usuario.password,
        cpf: usuario.cpf
    })

    .then(response => {
        expect(response.status).toBe(200);
        expect(response.body._id).toBeDefined();
        expect(response.body.name).toBe(usuario.name);
        expect(response.body.email).toBe(usuario.email);
        expect(response.body.cpf).toBe(usuario.cpf);
        expect(response.body.password).toBeUndefined();

        usuario._id = response.body._id;
    })

    .catch(fail);
});

test('get /users/aaaaaa - not found', () => {
    return request(address)

    .get('/users/aaaaaa')

    .then(response => {
        expect(response.status).toBe(404);
    })

    .catch(fail);
});

test('patch /users/:id', () => {
    return request(address)
    
    .patch(`/users/${usuario._id}`)

    .send({
        name: `${usuario.name} - patch` 
    })

    .then(response => {
        expect(response.status).toBe(200);
        expect(response.body._id).toBeDefined();
        expect(response.body.name).toBe(`${usuario.name} - patch`);
        expect(response.body.email).toBe(usuario.email);
        expect(response.body.password).toBeUndefined();
    })

    .catch(fail);
});

test('delete /users/:id', () => {
    return request(address)

    .del(`/users/${usuario._id}`)

    .then(response => {
        expect(response.status).toBe(204);
    })

    .catch(fail);
});