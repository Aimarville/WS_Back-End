const { validatePlayerUpdate } = require("../../../src/middleware/validatorMiddleware");
const { body } = require('express-validator');

    describe("Middleware validatePlayerUpdate", () => {
        test("400 bueltatu datuak falta badira", async() => {
            const req = {
                body: {}
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            // Array bat denez exekutatu maualki
            await body('name').notEmpty().run(req);
            await body('teamId').notEmpty().run(req);
            await body('leagueId').notEmpty().run(req);

            //Eta azken middleware-a exekutatu
            await validatePlayerUpdate[validatePlayerUpdate.length -1](req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(next).not.toHaveBeenCalled();
        });

        test ("next() deitzen du datuak zuzenak badira", () => {
            const req = {
                body : {
                    name:"Paco",
                    teamId: 1,
                    leagueId: 3,
                }
            }

            const res ={
                status: jest.fn().mockReturnThis(),
                json: jest.fn
            };
            const next = jest.fn();

            // Balidazio guztiak exekutatuko ditugu
            for (const middleware of validatePlayerUpdate) {
                middleware(req, res, next);
            }

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });
    });