-- List of players on team
select
  a.id as player_id,
  a.name as player_name,
  t.name
from
  team t,
  team_role tr,
  account a,
  role r
where
  t.id = tr.team_id
  and
  tr.user_id = a.id
  and
  tr.role_id = r.id
  and
  r.name = 'teamPlayer';

--rough userPermissionView
select
  a1.id as account_id,
  a1.name as account_name,
  a2.id as account_id_in_behalf_of,
  a2.name as account_name_in_behalf_of,
  p.name as permission
from
  account a1,
  account a2,
  account_role ar,
  role r,
  role_permission rp,
  permission p
where
  r.id = ar.role_id
  and
  a1.id = ar.granted_to_id
  and
  a2.id = ar.in_behalf_of_id
  and
  rp.role_id = r.id
  and
  p.id = rp.permission_id
  and
  p.type = 'account'
order by account_id;

--teamPermissionView step 1 (permissions based team role)
select DISTINCT
  foo.user_name,
  foo.permission_name
from
  (
select
  a.name as user_name,
  p.name as permission_name
from
  account a,
  team_role tr,
  role r,
  role_permission rp,
  permission p
where
  a.id = tr.user_id
  and
  r.id = tr.role_id
  and
  rp.role_id = r.id
  and
  p.type = 'team'
  and
  rp.permission_id = p.id) as foo;










--Work in progress



-- find proxy roles
select
  a1.id as account_id,
  a1.name as account_name,
  a2.id as account_id_in_behalf_of,
  a2.name as account_name_in_behalf_of,
  p2.name as permission,
  t.name
from
  account a1,
  account a2,
  account_role ar,
  role r,
  role_permission rp,
  permission p1,
  team_role tr,
  role_permission rp2,
  permission p2,
  team t
where
  r.id = ar.role_id
  and
  a1.id = ar.granted_to_id
  and
  a2.id = ar.in_behalf_of_id
  and
  rp.role_id = r.id
  and
  p1.id = rp.permission_id
  and
  ar.in_behalf_of_id <> ar.granted_to_id
  and
  p1.type = 'account'
  AND
  tr.user_id = ar.in_behalf_of_id
  and
  rp2.role_id = tr.role_id
  and
  p2.id = rp2.permission_id
  AND
  t.id = tr.team_id
  AND
  p2.type = 'team'
order by account_id;


select
  a1.id as account_id,
  a1.name as account_name,
  a2.id as account_id_in_behalf_of,
  a2.name as account_name_in_behalf_of
from
  account a1,
  account a2,
  account_role ar
where
  ar.granted_to_id = a1.id
  and
  ar.in_behalf_of_id = a2.id
  and
  ar.in_behalf_of_id <> ar.granted_to_id

;






--teamPermissionView
select
  tr.user_id,
  p.name
from
  team_role tr,
  role r,
  role_permission rp,
  permission p
where
  tr.role_id = r.id
  and
  rp.role_id = r.id
  and
  p.id = rp.permission_id;


