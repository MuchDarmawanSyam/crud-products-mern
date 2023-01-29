import { Sequelize } from "sequelize";
import db from "../config/database.js";

const {DataTypes} = Sequelize;
const Product = db.define('product', {
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    url: DataTypes.STRING
}, {
    freezeTableName: true
});

export default Product;

// Jika tabel product tidak terdapat dalam database
(async()=>{
    await db.sync();
})();