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
team_real	Real SLC		
			
account			
id	name		
tyson	Tyson the coach		
miles	Miles the older kid		
henry	Henry the smaller kid		
kevin	Kevin the father of Henry		
ana	Ana the helper		
			
user_role			
id	granted_to	in_behalf_of	role_id
tyson	miles	miles	userEdit
miles	henry	henry	userView
henry	kevin	henry	userVIew
			
role			
id			
teamCoach			
teamHelper			
teamPlayer			
userEdit			
userView			
			
team_role			
user_id	role_id		
tyson	teamCoach		
tyson	teamPlayer		
miles	teamPlayer		
henry	teamPlayer		
ana	teamHelper		
			
permission			
id			
TEAM_UPDATE_ROSTER			
TEAM_ADMIN			
TEAM_VIEW_GAMES			
USER_UPDATE_NAME
USER_UPDATE_AVATAR			
PROXY_FULL_			
			
role_permission			
role_id	permission_id		
teamCoach	TEAM_UPDATE_ROSTER		
teamCoach	TEAM_ADMIN		
teamCoach	TEAM_VIEW_GAMES		
teamPlayer	TEAM_UPDATE_ROSTER		
teamPlayer	TEAM_VIEW_GAMES		
			
team_roster			
team_id	user_id		
team_real	tyson		
team_real	miles		
team_real	henry		
team_real	ana		
`;

main().catch(console.error);
async function main(){
  for(let str of csv.split(/^\s*$/gm)){
    const table = str.split('\n').slice(1, 2).pop().trim();
    const columns = str.split('\n').slice(2, 3).pop().split(/\t+/).filter(v => v);
    const data = str.split('\n').slice(3).map(r => r.split(/\t+/).filter(v => v)).filter(v => v.length);

    await sequelize.query(`DROP TABLE IF EXISTS ${table};`);
    await sequelize.query(`CREATE TABLE ${table} (\n${columns.map(c => '  ' + c + ' varchar(40)').join(',\n')}\n);`);
    for(let row of data){
      await sequelize.query(`INSERT INTO ${table} (${columns.join(', ')}) VALUES (${row.map(v => `'${v}'`).join(', ')});`)
    }
  }

  const [ results, metaData ] = await sequelize.query("SELECT * FROM account;");

  console.log("Selecting all the users...", results);

  await sequelize.close();
}
