CREATE TABLE IF NOT EXISTS public."User_Roles" (
  user_id uuid REFERENCES "Users" (id),
  role_id uuid REFERENCES "Roles" (id),
  CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role_id)
);

ALTER TABLE IF EXISTS public."User_Roles"
    OWNER to postgres;
