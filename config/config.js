console.log(process.env.DB_USER,"print the env details")
console.log(process.env.DB_PASS,"print the env details")
console.log(process.env.DB_NAME,"print the env details")
console.log(process.env.DB_HOST,"print the env details")

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
  },
};
