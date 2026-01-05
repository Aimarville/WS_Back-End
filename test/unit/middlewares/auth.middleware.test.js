const { isAuthenticated } = require("../../../src/middleware/authMiddleware");

describe("Middleware isAuthenticated", () => {
    test ("401 bueltatu sesiorik ez badago", () => {
        const req = {session: null};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        isAuthenticated(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });
    test("test() deitzen du erabiltzailea autentifikatuta badago", () => {
        const req = {session: {userId: 1}};
        const res = {};
        const next = jest.fn();

        isAuthenticated(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});

