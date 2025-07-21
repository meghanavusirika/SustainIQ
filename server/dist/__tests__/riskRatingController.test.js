"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const riskRating_1 = __importDefault(require("../routes/riskRating"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/risk-rating', riskRating_1.default);
describe('Risk Rating API', () => {
    it('should return a risk score for a valid company', async () => {
        const res = await (0, supertest_1.default)(app)
            .get('/api/risk-rating/score')
            .query({ company: 'Apple' });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('company');
        expect(res.body).toHaveProperty('riskScore');
        expect(typeof res.body.riskScore).toBe('number');
    });
    it('should return 400 for missing company parameter', async () => {
        const res = await (0, supertest_1.default)(app)
            .get('/api/risk-rating/score');
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });
});
