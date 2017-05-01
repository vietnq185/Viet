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

ALTER TABLE subscriptions ADD COLUMN "stripeCustomerId" character varying(255) COLLATE pg_catalog."default";
ALTER TABLE subscriptions ADD COLUMN "stripeSubscriptionId" character varying(255) COLLATE pg_catalog."default";

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

ALTER TABLE users ADD COLUMN "linkCode" SERIAL UNIQUE;

ALTER TABLE subscriptions ADD COLUMN "nextPeriodStart" bigint;
ALTER TABLE subscriptions ADD COLUMN "nextPeriodEnd" bigint;
ALTER TABLE subscriptions ADD COLUMN "nextChannel" character varying(255) COLLATE pg_catalog."default";
ALTER TABLE subscriptions ADD COLUMN "nextExpirationType" character varying(255) COLLATE pg_catalog."default";

ALTER TABLE subscriptions ADD COLUMN "cancelMetadata" jsonb;



CREATE TYPE option_type AS ENUM ('string','text','int','float','enum','bool');
CREATE TABLE IF NOT EXISTS "options" (
  "foreign_id" bigint NOT NULL DEFAULT '0',
  "key" character varying(255) NOT NULL DEFAULT '' COLLATE pg_catalog."default",
  "tab_id" bigint DEFAULT NULL,
  "value" text,
  "label" text,
  "description" text,
  "type" option_type NOT NULL DEFAULT 'string',
  "order" bigint DEFAULT NULL,
  "is_visible" character varying(10) DEFAULT 'T' COLLATE pg_catalog."default",
  "style" character varying(500) DEFAULT NULL COLLATE pg_catalog."default",
  "is_public" character varying(10) DEFAULT 'F' COLLATE pg_catalog."default",
  CONSTRAINT options_pkey PRIMARY KEY ("foreign_id","key")
);

INSERT INTO "options" ("foreign_id", "key", "tab_id", "value", "label", "description", "type", "order", "is_visible", "style", "is_public") VALUES

(1, 'o_stripe_secret', 1, NULL, NULL, 'Stripe secret', 'string', 1, 1, NULL, 'F'),

(1, 'o_allow_discount', 1, '1|0::1', NULL, 'Enable discount', 'bool', 2, 1, NULL, 'T'),
(1, 'o_discount_percent', 1, '20', NULL, 'Discount percent', 'float', 3, 1, NULL, 'T'),
(1, 'o_discount_limit', 1, '200', NULL, 'Discount for first XXX persons', 'float', 4, 1, NULL, 'T'),

(1, 'o_smtp_host', 1, NULL, NULL, 'SMTP Host', 'string', 5, 1, NULL, 'F'),
(1, 'o_smtp_port', 1, '25', NULL, 'SMTP Port', 'int', 6, 1, NULL, 'F'),
(1, 'o_smtp_user', 1, NULL, NULL, 'SMTP Username', 'string', 7, 1, NULL, 'F'),
(1, 'o_smtp_pass', 1, NULL, NULL, 'SMTP Password', 'string', 8, 1, NULL, 'F');

INSERT INTO "options" ("foreign_id", "key", "tab_id", "value", "label", "description", "type", "order", "is_visible", "style", "is_public") VALUES
(1, 'o_admin_email', 1, NULL, NULL, 'Admin email', 'string', 9, 1, NULL, 'F');


INSERT INTO "options" ("foreign_id", "key", "tab_id", "value", "label", "description", "type", "order", "is_visible", "style", "is_public") VALUES

(1, 'mail_forgot_password_ARRAY_subject', 2, NULL, NULL,  'Forgot password email subject', 'string',10, 1, NULL, 'F'),
(1, 'mail_forgot_password_ARRAY_message', 2, NULL, NULL, 'Forgot password email message', 'text', 11, 1, NULL, 'F');
