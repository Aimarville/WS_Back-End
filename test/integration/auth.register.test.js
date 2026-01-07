const request = require('supertest');
const app = require('../../app');
const User = require('../../src/models/User');

jest.mock('../../src/models/User');

describe ('POST /auth/register', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('201 kodea: erabiltzailea zuzen erregistratu da', async () => {
        //ez aurkitzeko inor korreo berdinarekin
        User.findOne.mockResolvedValue(null);
        User.prototype.save = jest.fn();

        const res = await request(app).post('/auth/register').send({
            name:'Iker',
            lastname: 'Villegas',
            email: 'ikervillegas@gmail.com',
            password: '12345679'
        })
        expect(res.statusCode).toBe(201);
    });
    test('400 kodea: erabiltzailea jadanik existitzen da', async () => {
        User.findOne.mockResolvedValue({ email: 'ikervillegas@gmail.com'});
        const res = await request(app).post('/auth/register').send({
            name:'Iker',
            lastname: 'Villegas',
            email: 'ikervillegas@gmail.com',
            password: '12345679'
        });
        expect(res.statusCode).toBe(400);
    });
});