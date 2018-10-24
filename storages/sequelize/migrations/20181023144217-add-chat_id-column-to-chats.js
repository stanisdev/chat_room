module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('MessageStatuses', 'chat_id', {
        type: Sequelize.INTEGER,
        allowNull: false,
      })
      .then(() => {
        return queryInterface.addConstraint('MessageStatuses', ['chat_id'], {
          type: 'foreign key',
          name: 'MessageStatuses_ibfk_4',
          references: {
            table: 'Chats',
            field: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        });
      });
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('MessageStatuses', 'chat_id');
  },
};
