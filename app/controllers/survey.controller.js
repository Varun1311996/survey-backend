const db = require("../models");
const Survey = db.survey;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    if (!req.query.title) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
    const survey = {
      title: req.query.title,
      userId: req.query.userId,
      data:req.body,
    };
    Survey.create(survey)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        console.log(err);
        res.status(500).send({
          message:
            err.message || "error occurred while creating survey."
        });
      });
  };
 

exports.deleteAll = (req, res) => {
  Survey.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Surveys  deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "error occurred while removing all surveys."
      });
    });
};
exports.findOne = (req, res) => {
  const id = req.params.id;
  Survey.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `No survey found with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error getting survey with id=" + id
      });
    });
};

exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
  Survey.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "error occurred while retrieving surveys."
      });
    });
};
exports.update = (req, res) => {

  const survey = {
    title: req.query.title!=undefined ? req.query.title:null,
    userId: req.query.userId!=undefined ? req.query.userId:null,
    data:req.body!=undefined? req.body:null,  
  };
  const id = req.params.id;
  Survey.update(survey, {
    where: { id: id } 
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Survey was updated successfully."
        });
      } else {
        res.send({
          message: `Unable to update Survey with id=${id}. Survey is not found or request body must be empty field!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Survey with id=" + id
      });
    });
};
exports.delete = (req, res) => {
  const id = req.params.id;
  Survey.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Survey was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Survey with id=${id}. Survey doesn't exist!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Unable to delete Survey with id=" + id
      });
    });
};