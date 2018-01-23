const _ = require('lodash');
_.defaults(process.env, {
  POSTGRES_URL: 'localhost',
  POSTGRES_USER: 'postgres',
  POSTGRES_DB: 'postgres',
  POSTGRES_PORT: 5432,
  POSTGRES_PASSWORD: ''
});

const Sequelize = require('sequelize');
const { POSTGRES_PASSWORD, POSTGRES_URL, POSTGRES_USER, POSTGRES_DB, POSTGRES_PORT } = process.env;

const sequelize = new Sequelize(POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, {
  dialect: 'postgres',
  port: POSTGRES_PORT,
  host: POSTGRES_URL,
});

const csv = `
team
id	name
1	Real SLC

account
id	name
1	Tyson the coach
2	Miles the older kid
3	Henry the smaller kid
4	Kevin the father of Henry
5	Ana the helper

account_role
id	granted_to_id	in_behalf_of_id	role_id
1	2	2	4
2	3	3	5
3	4	3	4

role
id	name
1	teamCoach
2	teamHelper
3	teamPlayer
4	userEdit
5	userView

permission
id	name	type
1	UPDATE_ROSTER	team
2	ADMIN	team
3	VIEW_GAMES	team
4	UPDATE_NAME	account
5	UPDATE_AVATAR	account
6	VIEW	account

role_permission
id	role_id	permission_id
1	1	1
2	1	2
3	1	3
4	2	1
5	2	3
6	3	3
7	4	4
8	4	5
9	5	6
10	4	6

team_role
id	user_id	role_id	team_id
1	1	1	1
2	1	3	1
3	2	3	1
4	3	3	1
5	5	2	1
`;

main().catch(console.error);
async function main(){
  for(let str of csv.split(/^\s*$/gm)){
    const table = str.split('\n').slice(1, 2).pop().trim();
    const columns = str.split('\n').slice(2, 3).pop().split(/\t+/).filter(v => v);
    const data = str.split('\n').slice(3).map(r => r.split(/\t+/).filter(v => v)).filter(v => v.length);

    await sequelize.query(`DROP TABLE IF EXISTS ${table};`);
    await sequelize.query(`CREATE TABLE ${table} (
      ${columns.map(c => c + (c.includes('id') ? ' bigint' : ' varchar(40)')).join(',\n')}
    );`);
    for(let row of data){
      await sequelize.query(`INSERT INTO ${table} (${columns.join(', ')}) VALUES (${row.map(v => isNumeric(v) ? v : `'${v}'`).join(', ')});`)
    }
  }

  const [ results, metaData ] = await sequelize.query("SELECT * FROM account;");

  console.log("Selecting all the users...", results);

  await sequelize.close();
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
