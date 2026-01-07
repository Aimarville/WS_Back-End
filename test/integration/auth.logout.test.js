const request = require('supertest');
const app = require('../../app');

describe('GET /auth/logout', () => {

    test('200 kodea: ondo exekutatu da', async () => {

        const res = await request(app)
            .get('/auth/logout')
            .set('Cookie', ['connect.sid=fake-session-id']); //id fake bat saio bat simulatzen duena

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            message: 'Saioa ondo itxi da'
        });
    });

});
