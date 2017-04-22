CREATE TABLE plans (
    _id uuid NOT NULL,
    "courseIds" uuid[] NOT NULL,
    fee double precision DEFAULT 0,
    description text,
    "keyBenefits" character varying(255)[] DEFAULT (ARRAY[]::character varying[])::character varying(255)[],
    active boolean DEFAULT true,
    "dateCreated" bigint,
    CONSTRAINT plans_pkey PRIMARY KEY (_id),
    CONSTRAINT plans_course_ids_ukey UNIQUE ("courseIds")
);

ALTER TABLE plans OWNER TO postgres;

INSERT INTO plans(_id, "courseIds", fee, description, "keyBenefits") VALUES 
(
    '121bbca5-3f43-4374-a176-243a095cf852'::uuid, ARRAY['406add37-2263-4a70-96aa-2b2c30f3e92b'::uuid], 60, 
    'You can learn all about Measurement, Algebra, Geometry, Statistics, Numbers and more...',
    ARRAY['Unlock 10 more premium Worksheets', '24/7 support from teacher', 'Hints available at any questions']
),
(
    '7d17b4c0-feee-47d9-aa7a-3679a4237401'::uuid, ARRAY['bfc9e8b4-80e4-4ba1-ba81-54385950cc3f'::uuid], 60, 
    'You can learn all about Cycles, Intractions, Diversity, Enger, System and more...',
    ARRAY['Unlock 10 more premium Worksheets', '24/7 support from teacher', 'Hints available at any questions']
),
(
    '55148ffa-6ca0-4930-bb09-cd2a1158d655'::uuid, ARRAY['406add37-2263-4a70-96aa-2b2c30f3e92b'::uuid,'bfc9e8b4-80e4-4ba1-ba81-54385950cc3f'::uuid], 100, 
    'You can learn all concepts about Math & Science',
    ARRAY['Unlock 10 more premium Worksheets', '24/7 support from teacher', 'Hints available at any questions']
);


CREATE TABLE cclist (
    _id uuid NOT NULL,
    "userId" uuid NOT NULL,
    "name" text,
    "ccnum" text,
    "ccmonth" text,
    "ccyear" text,
    "cvv" text,
    active boolean DEFAULT true,
    "dateCreated" bigint,
    CONSTRAINT cclist_pkey PRIMARY KEY (_id)
);

ALTER TABLE subscriptions ADD COLUMN "parentId" uuid NOT NULL;
ALTER TABLE subscriptions ADD COLUMN "planId" uuid NOT NULL;
ALTER TABLE subscriptions ADD COLUMN "expirationType" character varying(255) COLLATE pg_catalog."default" DEFAULT 'monthly'::character varying;
ALTER TABLE subscriptions ADD COLUMN "expiryDate" bigint;
ALTER TABLE subscriptions ADD COLUMN "cardId" uuid;

ALTER TABLE subscriptions ADD COLUMN "discount" double precision DEFAULT 0;
ALTER TABLE subscriptions ADD COLUMN "fee" double precision DEFAULT 0;

ALTER TABLE subscriptions ADD COLUMN "lastPaymentDate" bigint;
ALTER TABLE subscriptions ADD COLUMN "expiryDateFrom" bigint;

CREATE TABLE payment_history (
    _id uuid NOT NULL,
    "subscriptionId" uuid NOT NULL,
    "paymentMethod" character varying(255) COLLATE pg_catalog."default" DEFAULT 'stripe'::character varying,
    "txnid" character varying(255) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
    "paymentStatus" character varying(255) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
    "paymentDate" bigint,
    CONSTRAINT payment_history_pkey PRIMARY KEY (_id)
);

ALTER TABLE subscriptions DROP CONSTRAINT subscriptions_user_fkey CASCADE;
ALTER TABLE subscriptions DROP CONSTRAINT subscriptions_creator_fkey CASCADE;
ALTER TABLE subscriptions DROP CONSTRAINT "subscriptions_externalUser_fkey" CASCADE;

ALTER TABLE items DROP CONSTRAINT items_course_fkey CASCADE;
ALTER TABLE items DROP CONSTRAINT items_creator_fkey CASCADE;
ALTER TABLE items DROP CONSTRAINT items_order_fkey CASCADE;
ALTER TABLE items DROP CONSTRAINT "items_parentItem_fkey" CASCADE;
ALTER TABLE items DROP CONSTRAINT items_user_fkey CASCADE;

ALTER TABLE subscriptions ADD COLUMN refid SERIAL UNIQUE;