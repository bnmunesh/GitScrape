module.exports = (sequelize, DataTypes) => {
    const Repository = sequelize.define('Repository', {
      repo_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      private: DataTypes.BOOLEAN,
     
      html_url: DataTypes.STRING,
      description: DataTypes.STRING,
      url: DataTypes.STRING,
      forks_url: DataTypes.STRING,
      contributors_url: DataTypes.STRING,

      git_created_at: DataTypes.DATE,
      git_updated_at: DataTypes.DATE,
      git_pushed_at: DataTypes.DATE,

      ssh_url: DataTypes.STRING,
      clone_url: DataTypes.STRING,
      size: DataTypes.BIGINT,

      archived: DataTypes.BOOLEAN,
      disabled: DataTypes.BOOLEAN,
    
      visibility: DataTypes.STRING,
      forks: DataTypes.INTEGER,
      open_issues: DataTypes.INTEGER,
      watchers: DataTypes.INTEGER,
      default_branch: DataTypes.STRING
    }, {
      timestamps: false,    
    });
  
    return Repository;
  };