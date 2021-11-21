CREATE TYPE permission AS ENUM ('READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES');

CREATE TABLE IF NOT EXISTS public."Roles"
(
    id uuid PRIMARY KEY NOT NULL,
    name character varying(20) COLLATE pg_catalog."default" NOT NULL,
    permissions permission[] NOT NULL DEFAULT ARRAY[]::permission[]
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Roles"
    OWNER to postgres;

INSERT INTO public."Roles" (
    id,
    name,
    permissions
)
VALUES
    (
        'f3f9c817-fc50-4e6f-8481-4e6989918979',
        'readonly-user',
        ARRAY['READ']::permission[]

    ),
    (
        '12d07f0f-66e8-4268-8a07-4a0a49e309a5',
        'user',
        ARRAY['READ', 'WRITE', 'SHARE']::permission[]
    ),
    (
        'd638865b-4251-4ccc-819b-25f151963d83',
        'login03',
        ARRAY['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES']::permission[]
    );
