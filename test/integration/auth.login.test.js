const request = require('supertest');
const app = require('../../app');
const User = require('../../src/models/User');

jest.mock('../../src/models/User');

describe('POST /auth/login', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Erabiltzailea ez bada existizen errorea errenderizatzen du', async () => {
        User.findOne.mockResolvedValue(null);

        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'eznaizexistitzen@gmail.com',
                password: 'password123'
            });

        expect(res.statusCode).toBe(200); //render 200 bueltatzn du eskaera ondo prozesatuta dagoelako
        expect(res.text).toContain('Kredentzialak ez dira baliozkoak');
    });

    test('Errorea errederizatzen du pasahitza okerra bada', async () => {
        User.findOne.mockResolvedValue({
            comparePassword: jest.fn().mockResolvedValue(false)
        });

        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'iker@gmail.com',
                password: 'passwordinbentatua'
            });

        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('Kredentzialak ez dira baliozkoak');
    });

    test('Login zuzena da eta /admira eramaten du', async () => {
        User.findOne.mockResolvedValue({
            _id: '123',
            role: 'admin',
            comparePassword: jest.fn().mockResolvedValue(true)
        });

        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'iker@gmail.com',
                password: 'password123'
            });

        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/admin');
    });

});
