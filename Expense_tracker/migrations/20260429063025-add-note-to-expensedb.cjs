'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Change 'expensedb' to 'Expenses'
    await queryInterface.addColumn('Expenses', 'note', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    // Change 'expensedb' to 'Expenses' here too
    await queryInterface.removeColumn('Expenses', 'note');
  }
};
