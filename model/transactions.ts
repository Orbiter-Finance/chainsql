import { Model, Sequelize, DataTypes } from "sequelize";

export interface TransactionsAttributes {
  id: string;
  type: string;
  debitAsset: string;
  creditAsset: string;
  debitAmount: string;
  creditAmount: string;
  transactionHash: string;
  status: string;
  createdAt: string;
  confirmedAt: string;
  clientId: string;
  fromAddress: string;
  toAddress: string;
}

// order of InferAttributes & InferCreationAttributes is important.
export class Transactions
  extends Model<TransactionsAttributes>
  implements TransactionsAttributes
{
  declare id: string;
  declare type: string;
  declare debitAsset: string;
  declare creditAsset: string;
  declare debitAmount: string;
  declare creditAmount: string;
  declare transactionHash: string;
  declare status: string;
  declare createdAt: string;
  declare confirmedAt: string;
  declare clientId: string;
  declare fromAddress: string;
  declare toAddress: string;

  static bootstrap(sequelize: Sequelize): typeof Transactions {
    Transactions.init(
      {
        id: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: true,
        },
        type: {
          type: DataTypes.STRING,
        },
        debitAsset: {
          type: DataTypes.STRING,
        },
        creditAsset: {
          type: DataTypes.STRING,
        },
        debitAmount: {
          type: DataTypes.STRING,
        },
        creditAmount: {
          type: DataTypes.STRING,
        },
        transactionHash: {
          type: DataTypes.STRING,
        },
        status: {
          type: DataTypes.STRING,
        },
        createdAt: {
          type: DataTypes.STRING,
        },
        confirmedAt: {
          type: DataTypes.STRING,
        },

        clientId: {
          type: DataTypes.STRING,
        },
        fromAddress: {
          type: DataTypes.STRING,
        },
        toAddress: {
          type: DataTypes.STRING,
        },
      },
      {
        sequelize,
        tableName: "transactions",
        timestamps: false,
      }
    );
    return Transactions;
  }
}
