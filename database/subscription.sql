CREATE TABLE plans (
    _id uuid NOT NULL,
    "courseIds" uuid[] NOT NULL,
    fee double precision DEFAULT 0,
    active boolean DEFAULT true,
    "dateCreated" bigint,
    CONSTRAINT plans_pkey PRIMARY KEY (_id),
    CONSTRAINT plans_course_ids_ukey UNIQUE ("courseIds")
);


ALTER TABLE plans OWNER TO postgres;

INSERT INTO plans(_id, "courseIds", fee) VALUES 
('121bbca5-3f43-4374-a176-243a095cf852'::uuid, ARRAY['406add37-2263-4a70-96aa-2b2c30f3e92b'::uuid], 60),
('7d17b4c0-feee-47d9-aa7a-3679a4237401'::uuid, ARRAY['bfc9e8b4-80e4-4ba1-ba81-54385950cc3f'::uuid], 60),
('55148ffa-6ca0-4930-bb09-cd2a1158d655'::uuid, ARRAY['406add37-2263-4a70-96aa-2b2c30f3e92b'::uuid,'bfc9e8b4-80e4-4ba1-ba81-54385950cc3f'::uuid], 100);
