import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

class File extends Model {
  public id!: number;
  public filename!: string;
  public filepath!: string;
  public filesize!: number;
  public user_id!: number;
}

File.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filepath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filesize: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'File',
  }
);

export default File;
