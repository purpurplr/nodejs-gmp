CREATE TABLE IF NOT EXISTS public."Users"
(
    id uuid PRIMARY KEY NOT NULL,
    login character varying(20) COLLATE pg_catalog."default" NOT NULL,
    password character varying(50) COLLATE pg_catalog."default" NOT NULL,
    age smallint NOT NULL,
    "deletedAt" date
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Users"
    OWNER to postgres;

INSERT INTO public."Users" (
    id,
    login,
    password,
    age
)
VALUES
    (
        '4d44d853-5b8f-439b-9f09-60d57b4b3b22',
        'login01',
        'password01',
        43
    ),
    (
        'd010d8d5-40d5-4cce-a5f1-adfbcb0296ae',
        'login02',
        'password02',
        44
    ),
    (
        'c2829393-a133-4d57-9fb6-edd6cdd293b8',
        'login03',
        'password03',
        45
    );
