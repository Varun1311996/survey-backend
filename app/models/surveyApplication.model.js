module.exports = (sequelize, Sequelize) => {
   
  const Survey = sequelize.define("surveyresponses", {
     
    name: {
      type: Sequelize.STRING
    },
    username: {
      type: Sequelize.STRING
    },
    data: {
      type: Sequelize.TEXT,
      get() {
        return (
          JSON.parse(this.getDataValue('data'))
        )
      },
      set(value) {
        this.setDataValue('data', JSON.stringify(value))
      }
    }
  });

  return Survey;
};
