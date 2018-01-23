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
			
user_role			
id	granted_to	in_behalf_of	role_id
1	2	2	4
2	3	3	5
3	4	3	5
			
role			
id	name		
1	teamCoach		
2	teamHelper		
3	teamPlayer		
4	userEdit		
5	userView		
			
permission			
id	name		
1	TEAM_UPDATE_ROSTER		
2	TEAM_ADMIN		
3	TEAM_VIEW_GAMES		
4	USER_UPDATE_NAME		
5	USER_UPDATE_AVATAR		
6	PROXY_FULL_		
			
role_permission			
id	role_id	permission_id	
1	1	1	
2	1	2	
3	1	3	
4	2	1	
5	2	3	
			
team_roster			
id	team_id	user_id	
1	1	1	
2	1	2	
3	1	3	
4	1	5	
			
team_role			
id	user_id	role_id	
1	1	1	
2	1	3	
3	2	3	
4	3	3	
5	5	2	
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
