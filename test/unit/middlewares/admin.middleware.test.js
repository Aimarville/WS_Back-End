const { isAdmin } = require("../../../src/middleware/adminMiddleware");

describe("Middleware isAdmin", () => {
    test ("403 bueltatu erabiltzailea admin ez bada", () => {
        const req = {session: {userId: {role: 'user'}}};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        isAdmin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });
    test("next() deitzen du erabiltzailea admin bada", () => {
        const req = {session: {userId: {role: 'admin'}}};
        const res = {};
        const next = jest.fn();

        isAdmin(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});