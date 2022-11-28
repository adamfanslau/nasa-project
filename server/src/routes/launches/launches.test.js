const request = require('supertest');
const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');

describe('Launches API v1', () => {
    beforeAll(async () => {
        await mongoConnect();
    });

    afterAll(async () => {
        await mongoDisconnect();
    });

    describe('Test GET /v1/launches', () => {
        test('It should respond with 200 success', async () => {
            const response = await request(app)
                .get('/v1/launches')
                .expect('Content-Type', /json/)
                .expect(200);
        });
    });
    
    describe('Test POST /v1/launch', () => {
        const completeLaunchData = {
            mission: 'Kepler Exploration X',
            rocket: 'Explorer ES1',
            launchDate: 'December 27, 2030',
            target: 'Kepler-442 b'
        };
    
        const launchDataWithoutDate = {
            mission: 'Kepler Exploration X',
            rocket: 'Explorer ES1',
            target: 'Kepler-442 b'
        };
    
        const launchDataWithIncorrectDate = {
            mission: 'Kepler Exploration X',
            rocket: 'Explorer ES1',
            launchDate: 'blah blah blah',
            target: 'Kepler-442 b'
        };
    
        test('It should respond with 201 success', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(completeLaunchData)
                .expect('Content-Type', /json/)
                .expect(201);
    
            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(responseDate).toBe(requestDate);
    
            expect(response.body).toMatchObject(launchDataWithoutDate);
        });
    
        test('It should catch missing required properties', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400);
    
            expect(response.body).toStrictEqual({
                error: 'Missing required launch property!'
            });
        });
    
        test('It should catch invalid dates', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithIncorrectDate)
                .expect('Content-Type', /json/)
                .expect(400);
    
            expect(response.body).toStrictEqual({
                error: 'Invalid date format!'
            });
        });
    });
});
