const request = require('supertest');
const app = require('../../app');
const Player = require('../../src/models/Player');

// Jokalarien modeloa mockeatu
jest.mock('../../src/models/Player');

describe('GET /api/players', () => {

    test('200 kodea: Jokalari zerrenda bueltatzen du', async () => {
        Player.find.mockImplementation(() => ({ //Kontrolatzailean jarri dugulako limit eta skip izan behar duela
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue([
                { name: 'Player 1' },
                { name: 'Player 2' }
            ])
        }));

        const res = await request(app).get('/api/players');

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

});
