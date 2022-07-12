module.exports = (app) => {
    let router = require("express").Router();
    const surveyApp = require("../controllers/survey.controller.js");
    router.post("/", surveyApp.create); //To create a survey
    router.get("/:id", surveyApp.findOne); //fetch unique survey with id
    router.delete("/", surveyApp.deleteAll); //Deletes all surveys
    router.get("/", surveyApp.findAll); //Fetch all surveys
    router.put("/:id", surveyApp.update); //updates survey with unique id
    router.delete("/:id", surveyApp.delete); // deletes survey with unique id
    app.use('/api/surveys+', router);
  };