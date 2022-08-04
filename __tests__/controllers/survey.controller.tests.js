const {jest} = require('@jest/globals')

// mock out Sequelize
const sequelize = jest.mock('sequelize');
//mock out database model
const db = require('../../app/models');
db.survey = {};
const app = require('../../server.js');
const request = require('supertest');

describe('survey controller', () => {

  var testSurvey = {
    name: "Automated Testing Survey",
   
  };

  describe('get surveys list', () => {
    it('calls findAll without query', async () => {
      db.survey.findAll = jest.fn().mockResolvedValue(Promise.resolve([]));
      await request(app)
        .get('/api/surveys')
        .expect(200)
        .then((response) => {
          expect(db.survey.findAll).toHaveBeenCalled();
        });
    });

    it('calls findAll with query', async () => {
      db.survey.findAll = jest.fn().mockResolvedValue(Promise.resolve([]));
      await request(app)
        .get('/api/surveys?name=survey')
        .expect(200)
        .then((response) => {
          expect(db.survey.findAll).toHaveBeenCalledWith({
            where: {
              title: {
                [db.Sequelize.Op.like]: "%Automated%"
              }
            }
          });
        });
    });

    it('responds with results from findAll', async () => {
      db.survey.findAll = jest.fn().mockResolvedValue(
        Promise.resolve([testTutorial]));
      await request(app)
        .get('/api/surveys')
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveLength(1);
          expect(response.body[0]).toMatchObject(testTutorial);
        });
    });

    it('responds with 500 and message on error', async () => {
      db.survey.findAll = jest.fn().mockImplementation(() =>
        Promise.reject(new Error("Fake error from test")));
      await request(app)
        .get('/api/surveys')
        .expect(500)
        .then((response) => {
          expect(response.body.message).toBe("Fake error from test");
        });
    });
  });
});