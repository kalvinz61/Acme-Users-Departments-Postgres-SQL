const pg = require('pg');
const uuid = require('uuid');

const client = new pg.Client(process.env.DATABSE_URL || 'postgress://localhost/acme_user');

client.connect();

const sync = async () => {
  const SQL = `
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  DROP TABLE IF EXISTS users;
  DROP TABLE IF EXISTS departments;
      CREATE TABLE departments(
        id UUID Primary Key default uuid_generate_v1(),
        name varchar(100)
    ); 
    CREATE TABLE users(
    id UUID Primary Key Default uuid_generate_v1(),
    name varchar(100),
    department_id UUID REFERENCES departments(id)
);
    `;
  await client.query(SQL);
  const [HR, Sales, Marketing, IT] = await Promise.all([
    createDepartment({ name: 'HR dept' }),
    createDepartment({ name: 'Sales dept' }),
    createDepartment({ name: 'Marketing dept' }),
    createDepartment({ name: 'IT dept' })
  ]);

  const [Lucy, Larry] = await Promise.all([
    createUser({ name: 'Lucy' }),
    createUser({ name: 'Larry' })
  ]);
};

const createDepartment = async ({ name }) => {
  const SQL = `INSERT INTO departments(name) values($1) returning *`;
  return (await client.query(SQL, [name])).rows[0];
};
const createUser = async ({ name }) => {
  const SQL = `INSERT INTO users(name) values($1) returning *`;
  return (await client.query(SQL, [name])).rows[0];
};
const findAllUsers = async () => {
  const SQL = `Select * from users`;
  return (await client.query(SQL)).rows;
};
const findAllDepartments = async () => {
  const SQL = `Select * from departments`;
  return (await client.query(SQL)).rows;
};

module.exports = {
  sync,
  createDepartment,
  findAllUsers,
  findAllDepartments
};
