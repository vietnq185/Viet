--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.1
-- Dumped by pg_dump version 9.6.2

-- Started on 2017-05-09 22:45:39 ICT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 188 (class 1259 OID 5287736)
-- Name: activities; Type: TABLE; Schema: public; Owner: hwphxleoyqmhto
--

CREATE TABLE activities (
    _id uuid NOT NULL,
    data jsonb DEFAULT '{}'::jsonb,
    type character varying(255) DEFAULT ''::character varying,
    "dateCreated" bigint,
    "internalTags" character varying(255)[] DEFAULT (ARRAY[]::character varying[])::character varying(255)[],
    description text,
    "user" uuid
);


ALTER TABLE activities OWNER TO hwphxleoyqmhto;

--
-- TOC entry 196 (class 1259 OID 5341406)
-- Name: all_time_stats; Type: TABLE; Schema: public; Owner: hwphxleoyqmhto
--

CREATE TABLE all_time_stats (
    _id uuid NOT NULL,
    type character varying(255) DEFAULT 'UNDEFINED_TYPE'::character varying,
    "totalKQuestionCount" integer DEFAULT 0,
    "totalAttemptCount" integer DEFAULT 0,
    "totalAnswerCount" integer DEFAULT 0,
    "rightAnswerCount" integer DEFAULT 0,
    "wrongAnswerCount" integer DEFAULT 0,
    "totalScore" integer DEFAULT 0,
    "totalDuration" double precision DEFAULT 0,
    "masteryScore" double precision DEFAULT 0,
    "otherStats" jsonb DEFAULT '{}'::jsonb,
    "totalAttemptCreatedCount" integer DEFAULT 0,
    course uuid,
    concept uuid,
    content uuid,
    kquestion uuid,
    "user" uuid
);


ALTER TABLE all_time_stats OWNER TO hwphxleoyqmhto;

--
-- TOC entry 198 (class 1259 OID 5341489)
-- Name: answers; Type: TABLE; Schema: public; Owner: hwphxleoyqmhto
--

CREATE TABLE answers (
    _id uuid NOT NULL,
    "selectionChoices" jsonb[] DEFAULT ARRAY[]::jsonb[],
    "textInputs" jsonb[] DEFAULT ARRAY[]::jsonb[],
    score double precision DEFAULT 0,
    "helpValue" double precision DEFAULT 0,
    "helpUsages" jsonb[] DEFAULT ARRAY[]::jsonb[],
    duration double precision DEFAULT 0,
    "dateCreated" bigint,
    status character varying(255) DEFAULT 'scored'::character varying,
    "dateScored" bigint,
    "indexInAttempt" integer DEFAULT 0,
    concepts character varying(255)[] DEFAULT (ARRAY[]::character varying[])::character varying(255)[],
    metadata jsonb DEFAULT '{}'::jsonb,
    creator uuid,
    kquestion uuid,
    attempt uuid
);


ALTER TABLE answers OWNER TO hwphxleoyqmhto;

--
-- TOC entry 197 (class 1259 OID 5341450)
-- Name: attempts; Type: TABLE; Schema: public; Owner: hwphxleoyqmhto
--

CREATE TABLE attempts (
    _id uuid NOT NULL,
    "creatorName" character varying(255),
    "userName" character varying(255),
    duration integer,
    concepts character varying(255)[] DEFAULT (ARRAY[]::character varying[])::character varying(255)[],
    "finalScore" double precision DEFAULT 0,
    "maxScore" double precision DEFAULT 0,
    archived boolean DEFAULT false,
    attachments jsonb[] DEFAULT ARRAY[]::jsonb[],
    "dateCreated" bigint,
    type character varying(255) DEFAULT 'PRACTICE'::character varying,
    "questionTypes" integer[] DEFAULT ARRAY[]::integer[],
    status character varying(255) DEFAULT 'scored'::character varying,
    "dateScored" bigint,
    title text,
    "totalAnswerCount" integer DEFAULT 0,
    "finishedAnswerCount" integer DEFAULT 0,
    metadata jsonb DEFAULT '{}'::jsonb,
    creator uuid,
    "user" uuid,
    content uuid,
    course uuid
);


ALTER TABLE attempts OWNER TO hwphxleoyqmhto;

--
-- TOC entry 199 (class 1259 OID 5341522)
-- Name: concept_scores; Type: TABLE; Schema: public; Owner: hwphxleoyqmhto
--

CREATE TABLE concept_scores (
    _id uuid NOT NULL,
    score jsonb,
    "betaDistributionMode" double precision DEFAULT 0,
    "creatorName" character varying(255),
    "dateCreated" bigint,
    creator uuid,
    concept uuid,
    course uuid
);


ALTER TABLE concept_scores OWNER TO hwphxleoyqmhto;

--
-- TOC entry 193 (class 1259 OID 5341338)
-- Name: concepts; Type: TABLE; Schema: public; Owner: hwphxleoyqmhto
--

CREATE TABLE concepts (
    _id uuid NOT NULL,
    title character varying(255),
    description text,
    "creatorName" character varying(255),
    "dateCreated" bigint,
    "dateModified" bigint,
    priority double precision DEFAULT 0,
    status character varying(255) DEFAULT 'internal'::character varying,
    metadata jsonb DEFAULT '{}'::jsonb,
    creator uuid,
    "upperConcept" uuid
);


ALTER TABLE concepts OWNER TO hwphxleoyqmhto;

--
-- TOC entry 203 (class 1259 OID 5341621)
-- Name: content_kquestions; Type: TABLE; Schema: public; Owner: hwphxleoyqmhto
--

CREATE TABLE content_kquestions (
    _id uuid NOT NULL,
    "dimensionIndex" integer DEFAULT 0,
    "numPoints" double precision DEFAULT 1,
    "questionIndex" integer DEFAULT 0,
    "contentRef" uuid,
    "questionRef" uuid
);


ALTER TABLE content_kquestions OWNER TO hwphxleoyqmhto;

--
-- TOC entry 194 (class 1259 OID 5341359)
-- Name: contents; Type: TABLE; Schema: public; Owner: hwphxleoyqmhto
--

CREATE TABLE contents (
    _id uuid NOT NULL,
    "urlName" text,
    title text,
    description text,
    "imageHomePage" text,
    "imageStartPage" text,
    "imageThumbnail" text,
    tags text[] DEFAULT ARRAY[]::text[],
    "userStatus" text DEFAULT 'self'::text,
    "creatorName" text,
    "dateCreated" bigint,
    "dateModified" bigint,
    "datePublished" bigint,
    concepts text[] DEFAULT ARRAY[]::text[],
    "internalTags" text[] DEFAULT ARRAY[]::text[],
    status text DEFAULT 'self'::text,
    "reviewStatus" text,
    type character varying(255) DEFAULT 'kquiz'::character varying,
    metadata jsonb,
    current_review_round integer DEFAULT 0,
    creator uuid
);


ALTER TABLE contents OWNER TO hwphxleoyqmhto;

--
-- TOC entry 189 (class 1259 OID 5287752)
-- Name: courses; Type: TABLE; Schema: public; Owner: hwphxleoyqmhto
--

CREATE TABLE courses (
    _id uuid NOT NULL,
    title character varying(255),
    description text,
    "creatorName" character varying(255),
    "dateCreated" bigint,
    "dateModified" bigint,
    metadata jsonb DEFAULT '{}'::jsonb,
    creator uuid
);


ALTER TABLE courses OWNER TO hwphxleoyqmhto;

--
-- TOC entry 190 (class 1259 OID 5287766)
-- Name: devices; Type: TABLE; Schema: public; Owner: hwphxleoyqmhto
--

CREATE TABLE devices (
    _id uuid NOT NULL,
    provider character varying(255) DEFAULT 'apple'::character varying,
    "deviceToken" character varying(255) DEFAULT ''::character varying,
    metadata jsonb,
    "user" uuid
);


ALTER TABLE devices OWNER TO hwphxleoyqmhto;

--
-- TOC entry 200 (class 1259 OID 5341546)
-- Name: external_users; Type: TABLE; Schema: public; Owner: hwphxleoyqmhto
--

CREATE TABLE external_users (
    _id uuid NOT NULL,
    "dateCreated" bigint,
    "dateModified" bigint,
    channel character varying(255) DEFAULT 'stripe'::character varying,
    status character varying(255) DEFAULT 'created'::character varying,
    "externalRef" text,
    metadata jsonb,
    history jsonb[],
    "user" uuid,
    creator uuid
);


ALTER TABLE external_users OWNER TO hwphxleoyqmhto;

--
-- TOC entry 191 (class 1259 OID 5287781)
-- Name: items; Type: TABLE; Schema: public; Owner: hwphxleoyqmhto
--

CREATE TABLE items (
    _id uuid NOT NULL,
    "dateCreated" bigint,
    "dateModified" bigint,
    title character varying(255),
    type character varying(255) DEFAULT 'COURSE_REGISTRATION'::character varying,
    "expirationType" character varying(255) DEFAULT 'LIFETIME'::character varying,
    value double precision DEFAULT 0,
    fee double precision DEFAULT 0,
    "periodTimeStart" bigint,
    "periodTimeEnd" bigint,
    status character varying(255) DEFAULT 'created'::character varying,
    "externalRef" text,
    metadata jsonb,
    history jsonb[],
    course uuid,
    "parentItem" uuid,
    creator uuid,
    "user" uuid
);


ALTER TABLE items OWNER TO hwphxleoyqmhto;

--
-- TOC entry 195 (class 1259 OID 5341379)
-- Name: kquestions; Type: TABLE; Schema: public; Owner: hwphxleoyqmhto
--

CREATE TABLE kquestions (
    _id uuid NOT NULL,
    title text,
    description text,
    image text,
    "diffLevel" double precision DEFAULT 0.25,
    tags text[] DEFAULT ARRAY[]::text[],
    "internalTags" text[] DEFAULT ARRAY[]::text[],
    status text DEFAULT 'self'::text,
    "userStatus" text DEFAULT 'self'::text,
    type integer DEFAULT 11,
    "selectionChoices" jsonb[] DEFAULT ARRAY[]::jsonb[],
    "textInputAnswers" jsonb[] DEFAULT ARRAY[]::jsonb[],
    "bucketChoices" jsonb[] DEFAULT ARRAY[]::jsonb[],
    "pairsAnswer" jsonb,
    explanation jsonb,
    solution jsonb[] DEFAULT ARRAY[]::jsonb[],
    hints jsonb[] DEFAULT ARRAY[]::jsonb[],
    concepts character varying(255)[] DEFAULT (ARRAY[]::character varying[])::character varying(255)[],
    subjects character varying(255)[] DEFAULT (ARRAY[]::character varying[])::character varying(255)[],
    "creatorName" text,
    "dateCreated" bigint,
    "dateModified" bigint,
    "datePublished" bigint,
    "lastModifiedBy" text,
    metadata jsonb DEFAULT '{}'::jsonb,
    creator uuid
);


ALTER TABLE kquestions OWNER TO hwphxleoyqmhto;

--
-- TOC entry 205 (class 1259 OID 5341678)
-- Name: messages; Type: TABLE; Schema: public; Owner: hwphxleoyqmhto
--

CREATE TABLE messages (
    _id uuid NOT NULL,
    "creatorName" text,
    "dateCreated" bigint,
    "dateModified" bigint,
    type character varying(255) DEFAULT 'TASK_MESSAGE'::character varying,
    text text,
    attachments jsonb[] DEFAULT ARRAY[]::jsonb[],
    metadata jsonb,
    history jsonb[],
    answer uuid,
    attempt uuid,
    content uuid,
    kquestion uuid,
    creator uuid,
    "reviewTask" uuid,
    "upperMessage" uuid
);


ALTER TABLE messages OWNER TO hwphxleoyqmhto;

--
-- TOC entry 202 (class 1259 OID 5341594)
-- Name: orders; Type: TABLE; Schema: public; Owner: hwphxleoyqmhto
--

CREATE TABLE orders (
    _id uuid NOT NULL,
    "dateCreated" bigint,
    "dateModified" bigint,
    channel character varying(255) DEFAULT 'subscription'::character varying,
    value double precision DEFAULT 0,
    fee double precision DEFAULT 0,
    status character varying(255) DEFAULT 'created'::character varying,
    "externalRef" text,
    metadata jsonb,
    history jsonb[],
    subscription uuid,
    creator uuid,
    "user" uuid
);


ALTER TABLE orders OWNER TO hwphxleoyqmhto;

--
-- TOC entry 204 (class 1259 OID 5341639)
-- Name: review_tasks; Type: TABLE; Schema: public; Owner: hwphxleoyqmhto
--

CREATE TABLE review_tasks (
    _id uuid NOT NULL,
    title text,
    description text,
    tags text[] DEFAULT ARRAY[]::text[],
    status text DEFAULT 'new'::text,
    "creatorName" text,
    "reviewerName" text,
    "dateCreated" bigint,
    "dateModified" bigint,
    "internalTags" text[] DEFAULT ARRAY[]::text[],
    type character varying(255) DEFAULT 'COLLECTION_REVIEW'::character varying,
    "reviewScore" integer DEFAULT 0,
    "reviewRound" integer DEFAULT 0,
    metadata jsonb,
    content uuid,
    kquestion uuid,
    creator uuid,
    reviewer uuid,
    "upperTask" uuid
);


ALTER TABLE review_tasks OWNER TO hwphxleoyqmhto;

--
-- TOC entry 201 (class 1259 OID 5341566)
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: hwphxleoyqmhto
--

CREATE TABLE subscriptions (
    _id uuid NOT NULL,
    "dateCreated" bigint,
    "dateModified" bigint,
    channel character varying(255) DEFAULT 'stripe'::character varying,
    type character varying(255) DEFAULT 'user_plan'::character varying,
    frequency character varying(255) DEFAULT 'monthly'::character varying,
    "planCode" character varying(255) DEFAULT 'user_plan_monthly_basic_1'::character varying,
    status character varying(255) DEFAULT 'created'::character varying,
    "externalRef" text,
    metadata jsonb,
    history jsonb[],
    "externalUser" uuid,
    "user" uuid,
    creator uuid
);


ALTER TABLE subscriptions OWNER TO hwphxleoyqmhto;

--
-- TOC entry 206 (class 1259 OID 5341723)
-- Name: time_stats; Type: TABLE; Schema: public; Owner: hwphxleoyqmhto
--

CREATE TABLE time_stats (
    _id uuid NOT NULL,
    "timeUnit" character varying(255) DEFAULT 'day'::character varying,
    "timeValue" character varying(255),
    type character varying(255) DEFAULT 'UNDEFINED_TYPE'::character varying,
    "totalKQuestionCount" integer DEFAULT 0,
    "totalAttemptCount" integer DEFAULT 0,
    "totalAnswerCount" integer DEFAULT 0,
    "rightAnswerCount" integer DEFAULT 0,
    "wrongAnswerCount" integer DEFAULT 0,
    "totalScore" integer DEFAULT 0,
    "totalDuration" double precision DEFAULT 0,
    "onlineDuration" double precision DEFAULT 0,
    "idleDuration" double precision DEFAULT 0,
    "otherStats" jsonb DEFAULT '{}'::jsonb,
    "averageDifficulty" double precision DEFAULT 0,
    "masteryScore" double precision DEFAULT 0,
    "conceptOvercomeTime" bigint DEFAULT 0,
    concept uuid,
    content uuid,
    kquestion uuid,
    course uuid,
    "user" uuid
);


ALTER TABLE time_stats OWNER TO hwphxleoyqmhto;

--
-- TOC entry 207 (class 1259 OID 5341771)
-- Name: transactions; Type: TABLE; Schema: public; Owner: hwphxleoyqmhto
--

CREATE TABLE transactions (
    _id uuid NOT NULL,
    "dateCreated" bigint,
    "dateModified" bigint,
    channel character varying(255) DEFAULT 'stripe'::character varying,
    type character varying(255) DEFAULT 'charge'::character varying,
    purpose character varying(255) DEFAULT 'pay_order'::character varying,
    value double precision DEFAULT 0,
    fee double precision DEFAULT 0,
    "netValue" double precision DEFAULT 0,
    status character varying(255) DEFAULT 'created'::character varying,
    "externalRef" text,
    metadata jsonb,
    history jsonb[],
    "contentRef" uuid,
    "order" uuid,
    creator uuid,
    "user" uuid
);


ALTER TABLE transactions OWNER TO hwphxleoyqmhto;

--
-- TOC entry 192 (class 1259 OID 5287815)
-- Name: user_roles; Type: TABLE; Schema: public; Owner: hwphxleoyqmhto
--

CREATE TABLE user_roles (
    _id uuid NOT NULL,
    "dateCreated" bigint,
    "dateModified" bigint,
    role character varying(255) DEFAULT 'guardian'::character varying,
    "targetModel" character varying(255) DEFAULT 'user'::character varying,
    "user" uuid,
    "targetRef" uuid
);


ALTER TABLE user_roles OWNER TO hwphxleoyqmhto;

--
-- TOC entry 187 (class 1259 OID 5287714)
-- Name: users; Type: TABLE; Schema: public; Owner: hwphxleoyqmhto
--

CREATE TABLE users (
    _id uuid NOT NULL,
    email character varying(255),
    role character varying(255) DEFAULT 'user'::character varying,
    salt character varying(255),
    "firstName" character varying(255) DEFAULT ''::character varying,
    "lastName" character varying(255) DEFAULT ''::character varying,
    phone character varying(255) DEFAULT ''::character varying,
    "profilePicture" character varying(255) DEFAULT ''::character varying,
    "coverPicture" character varying(255) DEFAULT ''::character varying,
    "userQuote" character varying(255) DEFAULT ''::character varying,
    "hashedPassword" character varying(255),
    "userToken" character varying(255) DEFAULT ''::character varying,
    provider character varying(255),
    facebook jsonb,
    "facebookId" character varying(255),
    "facebookToken" character varying(255),
    google jsonb,
    "googleId" character varying(255),
    "googleToken" character varying(255),
    username character varying(255),
    status character varying(255)[] DEFAULT (ARRAY[]::character varying[])::character varying(255)[],
    "lastLoginDate" character varying(255),
    "lastActivityDate" bigint,
    metadata jsonb DEFAULT '{}'::jsonb,
    "dateCreated" bigint,
    "linkCode" character varying(255)
);


ALTER TABLE users OWNER TO hwphxleoyqmhto;

--
-- TOC entry 3120 (class 2606 OID 5287746)
-- Name: activities activities_pkey; Type: CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY activities
    ADD CONSTRAINT activities_pkey PRIMARY KEY (_id);


--
-- TOC entry 3136 (class 2606 OID 5341424)
-- Name: all_time_stats all_time_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY all_time_stats
    ADD CONSTRAINT all_time_stats_pkey PRIMARY KEY (_id);


--
-- TOC entry 3140 (class 2606 OID 5341506)
-- Name: answers answers_pkey; Type: CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY answers
    ADD CONSTRAINT answers_pkey PRIMARY KEY (_id);


--
-- TOC entry 3138 (class 2606 OID 5341468)
-- Name: attempts attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY attempts
    ADD CONSTRAINT attempts_pkey PRIMARY KEY (_id);


--
-- TOC entry 3142 (class 2606 OID 5341530)
-- Name: concept_scores concept_scores_pkey; Type: CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY concept_scores
    ADD CONSTRAINT concept_scores_pkey PRIMARY KEY (_id);


--
-- TOC entry 3130 (class 2606 OID 5341348)
-- Name: concepts concepts_pkey; Type: CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY concepts
    ADD CONSTRAINT concepts_pkey PRIMARY KEY (_id);


--
-- TOC entry 3150 (class 2606 OID 5341628)
-- Name: content_kquestions content_kquestions_pkey; Type: CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY content_kquestions
    ADD CONSTRAINT content_kquestions_pkey PRIMARY KEY (_id);


--
-- TOC entry 3132 (class 2606 OID 5341373)
-- Name: contents contents_pkey; Type: CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY contents
    ADD CONSTRAINT contents_pkey PRIMARY KEY (_id);


--
-- TOC entry 3122 (class 2606 OID 5287760)
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (_id);


--
-- TOC entry 3124 (class 2606 OID 5287775)
-- Name: devices devices_pkey; Type: CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY devices
    ADD CONSTRAINT devices_pkey PRIMARY KEY (_id);


--
-- TOC entry 3144 (class 2606 OID 5341555)
-- Name: external_users external_users_pkey; Type: CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY external_users
    ADD CONSTRAINT external_users_pkey PRIMARY KEY (_id);


--
-- TOC entry 3126 (class 2606 OID 5287793)
-- Name: items items_pkey; Type: CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY items
    ADD CONSTRAINT items_pkey PRIMARY KEY (_id);


--
-- TOC entry 3134 (class 2606 OID 5341400)
-- Name: kquestions kquestions_pkey; Type: CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY kquestions
    ADD CONSTRAINT kquestions_pkey PRIMARY KEY (_id);


--
-- TOC entry 3154 (class 2606 OID 5341687)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (_id);


--
-- TOC entry 3148 (class 2606 OID 5341605)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (_id);


--
-- TOC entry 3152 (class 2606 OID 5341652)
-- Name: review_tasks review_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY review_tasks
    ADD CONSTRAINT review_tasks_pkey PRIMARY KEY (_id);


--
-- TOC entry 3146 (class 2606 OID 5341578)
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (_id);


--
-- TOC entry 3156 (class 2606 OID 5341745)
-- Name: time_stats time_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY time_stats
    ADD CONSTRAINT time_stats_pkey PRIMARY KEY (_id);


--
-- TOC entry 3158 (class 2606 OID 5341785)
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (_id);


--
-- TOC entry 3128 (class 2606 OID 5287824)
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (_id);


--
-- TOC entry 3114 (class 2606 OID 5287735)
-- Name: users users_email_provider_key; Type: CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_email_provider_key UNIQUE (email, provider);


--
-- TOC entry 3116 (class 2606 OID 5287731)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (_id);


--
-- TOC entry 3118 (class 2606 OID 5287733)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 3159 (class 2606 OID 5287747)
-- Name: activities activities_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY activities
    ADD CONSTRAINT activities_user_fkey FOREIGN KEY ("user") REFERENCES users(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3173 (class 2606 OID 5341430)
-- Name: all_time_stats all_time_stats_concept_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY all_time_stats
    ADD CONSTRAINT all_time_stats_concept_fkey FOREIGN KEY (concept) REFERENCES concepts(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3174 (class 2606 OID 5341435)
-- Name: all_time_stats all_time_stats_content_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY all_time_stats
    ADD CONSTRAINT all_time_stats_content_fkey FOREIGN KEY (content) REFERENCES contents(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3172 (class 2606 OID 5341425)
-- Name: all_time_stats all_time_stats_course_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY all_time_stats
    ADD CONSTRAINT all_time_stats_course_fkey FOREIGN KEY (course) REFERENCES courses(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3175 (class 2606 OID 5341440)
-- Name: all_time_stats all_time_stats_kquestion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY all_time_stats
    ADD CONSTRAINT all_time_stats_kquestion_fkey FOREIGN KEY (kquestion) REFERENCES kquestions(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3176 (class 2606 OID 5341445)
-- Name: all_time_stats all_time_stats_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY all_time_stats
    ADD CONSTRAINT all_time_stats_user_fkey FOREIGN KEY ("user") REFERENCES users(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3183 (class 2606 OID 5341517)
-- Name: answers answers_attempt_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY answers
    ADD CONSTRAINT answers_attempt_fkey FOREIGN KEY (attempt) REFERENCES attempts(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3181 (class 2606 OID 5341507)
-- Name: answers answers_creator_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY answers
    ADD CONSTRAINT answers_creator_fkey FOREIGN KEY (creator) REFERENCES users(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3182 (class 2606 OID 5341512)
-- Name: answers answers_kquestion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY answers
    ADD CONSTRAINT answers_kquestion_fkey FOREIGN KEY (kquestion) REFERENCES kquestions(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3179 (class 2606 OID 5341479)
-- Name: attempts attempts_content_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY attempts
    ADD CONSTRAINT attempts_content_fkey FOREIGN KEY (content) REFERENCES contents(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3180 (class 2606 OID 5341484)
-- Name: attempts attempts_course_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY attempts
    ADD CONSTRAINT attempts_course_fkey FOREIGN KEY (course) REFERENCES courses(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3177 (class 2606 OID 5341469)
-- Name: attempts attempts_creator_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY attempts
    ADD CONSTRAINT attempts_creator_fkey FOREIGN KEY (creator) REFERENCES users(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3178 (class 2606 OID 5341474)
-- Name: attempts attempts_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY attempts
    ADD CONSTRAINT attempts_user_fkey FOREIGN KEY ("user") REFERENCES users(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3185 (class 2606 OID 5341536)
-- Name: concept_scores concept_scores_concept_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY concept_scores
    ADD CONSTRAINT concept_scores_concept_fkey FOREIGN KEY (concept) REFERENCES concepts(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3186 (class 2606 OID 5341541)
-- Name: concept_scores concept_scores_course_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY concept_scores
    ADD CONSTRAINT concept_scores_course_fkey FOREIGN KEY (course) REFERENCES courses(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3184 (class 2606 OID 5341531)
-- Name: concept_scores concept_scores_creator_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY concept_scores
    ADD CONSTRAINT concept_scores_creator_fkey FOREIGN KEY (creator) REFERENCES users(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3168 (class 2606 OID 5341349)
-- Name: concepts concepts_creator_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY concepts
    ADD CONSTRAINT concepts_creator_fkey FOREIGN KEY (creator) REFERENCES users(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3169 (class 2606 OID 5341354)
-- Name: concepts concepts_upperConcept_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY concepts
    ADD CONSTRAINT "concepts_upperConcept_fkey" FOREIGN KEY ("upperConcept") REFERENCES concepts(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3195 (class 2606 OID 5341629)
-- Name: content_kquestions content_kquestions_contentRef_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY content_kquestions
    ADD CONSTRAINT "content_kquestions_contentRef_fkey" FOREIGN KEY ("contentRef") REFERENCES contents(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3196 (class 2606 OID 5341634)
-- Name: content_kquestions content_kquestions_questionRef_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY content_kquestions
    ADD CONSTRAINT "content_kquestions_questionRef_fkey" FOREIGN KEY ("questionRef") REFERENCES kquestions(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3170 (class 2606 OID 5341374)
-- Name: contents contents_creator_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY contents
    ADD CONSTRAINT contents_creator_fkey FOREIGN KEY (creator) REFERENCES users(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3160 (class 2606 OID 5287761)
-- Name: courses courses_creator_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY courses
    ADD CONSTRAINT courses_creator_fkey FOREIGN KEY (creator) REFERENCES users(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3161 (class 2606 OID 5287776)
-- Name: devices devices_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY devices
    ADD CONSTRAINT devices_user_fkey FOREIGN KEY ("user") REFERENCES users(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3188 (class 2606 OID 5341561)
-- Name: external_users external_users_creator_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY external_users
    ADD CONSTRAINT external_users_creator_fkey FOREIGN KEY (creator) REFERENCES users(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3187 (class 2606 OID 5341556)
-- Name: external_users external_users_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY external_users
    ADD CONSTRAINT external_users_user_fkey FOREIGN KEY ("user") REFERENCES users(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3162 (class 2606 OID 5287794)
-- Name: items items_course_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY items
    ADD CONSTRAINT items_course_fkey FOREIGN KEY (course) REFERENCES courses(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3164 (class 2606 OID 5287804)
-- Name: items items_creator_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY items
    ADD CONSTRAINT items_creator_fkey FOREIGN KEY (creator) REFERENCES users(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3163 (class 2606 OID 5287799)
-- Name: items items_parentItem_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY items
    ADD CONSTRAINT "items_parentItem_fkey" FOREIGN KEY ("parentItem") REFERENCES items(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3165 (class 2606 OID 5287809)
-- Name: items items_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY items
    ADD CONSTRAINT items_user_fkey FOREIGN KEY ("user") REFERENCES users(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3171 (class 2606 OID 5341401)
-- Name: kquestions kquestions_creator_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY kquestions
    ADD CONSTRAINT kquestions_creator_fkey FOREIGN KEY (creator) REFERENCES users(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3202 (class 2606 OID 5341688)
-- Name: messages messages_answer_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY messages
    ADD CONSTRAINT messages_answer_fkey FOREIGN KEY (answer) REFERENCES answers(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3203 (class 2606 OID 5341693)
-- Name: messages messages_attempt_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY messages
    ADD CONSTRAINT messages_attempt_fkey FOREIGN KEY (attempt) REFERENCES attempts(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3204 (class 2606 OID 5341698)
-- Name: messages messages_content_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY messages
    ADD CONSTRAINT messages_content_fkey FOREIGN KEY (content) REFERENCES contents(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3206 (class 2606 OID 5341708)
-- Name: messages messages_creator_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY messages
    ADD CONSTRAINT messages_creator_fkey FOREIGN KEY (creator) REFERENCES users(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3205 (class 2606 OID 5341703)
-- Name: messages messages_kquestion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY messages
    ADD CONSTRAINT messages_kquestion_fkey FOREIGN KEY (kquestion) REFERENCES kquestions(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3207 (class 2606 OID 5341713)
-- Name: messages messages_reviewTask_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY messages
    ADD CONSTRAINT "messages_reviewTask_fkey" FOREIGN KEY ("reviewTask") REFERENCES review_tasks(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3208 (class 2606 OID 5341718)
-- Name: messages messages_upperMessage_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY messages
    ADD CONSTRAINT "messages_upperMessage_fkey" FOREIGN KEY ("upperMessage") REFERENCES messages(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3193 (class 2606 OID 5341611)
-- Name: orders orders_creator_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY orders
    ADD CONSTRAINT orders_creator_fkey FOREIGN KEY (creator) REFERENCES users(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3192 (class 2606 OID 5341606)
-- Name: orders orders_subscription_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY orders
    ADD CONSTRAINT orders_subscription_fkey FOREIGN KEY (subscription) REFERENCES subscriptions(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3194 (class 2606 OID 5341616)
-- Name: orders orders_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY orders
    ADD CONSTRAINT orders_user_fkey FOREIGN KEY ("user") REFERENCES users(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3197 (class 2606 OID 5341653)
-- Name: review_tasks review_tasks_content_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY review_tasks
    ADD CONSTRAINT review_tasks_content_fkey FOREIGN KEY (content) REFERENCES contents(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3199 (class 2606 OID 5341663)
-- Name: review_tasks review_tasks_creator_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY review_tasks
    ADD CONSTRAINT review_tasks_creator_fkey FOREIGN KEY (creator) REFERENCES users(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3198 (class 2606 OID 5341658)
-- Name: review_tasks review_tasks_kquestion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY review_tasks
    ADD CONSTRAINT review_tasks_kquestion_fkey FOREIGN KEY (kquestion) REFERENCES kquestions(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3200 (class 2606 OID 5341668)
-- Name: review_tasks review_tasks_reviewer_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY review_tasks
    ADD CONSTRAINT review_tasks_reviewer_fkey FOREIGN KEY (reviewer) REFERENCES users(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3201 (class 2606 OID 5341673)
-- Name: review_tasks review_tasks_upperTask_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY review_tasks
    ADD CONSTRAINT "review_tasks_upperTask_fkey" FOREIGN KEY ("upperTask") REFERENCES review_tasks(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3191 (class 2606 OID 5341589)
-- Name: subscriptions subscriptions_creator_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY subscriptions
    ADD CONSTRAINT subscriptions_creator_fkey FOREIGN KEY (creator) REFERENCES users(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3189 (class 2606 OID 5341579)
-- Name: subscriptions subscriptions_externalUser_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY subscriptions
    ADD CONSTRAINT "subscriptions_externalUser_fkey" FOREIGN KEY ("externalUser") REFERENCES external_users(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3190 (class 2606 OID 5341584)
-- Name: subscriptions subscriptions_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY subscriptions
    ADD CONSTRAINT subscriptions_user_fkey FOREIGN KEY ("user") REFERENCES users(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3209 (class 2606 OID 5341746)
-- Name: time_stats time_stats_concept_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY time_stats
    ADD CONSTRAINT time_stats_concept_fkey FOREIGN KEY (concept) REFERENCES concepts(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3210 (class 2606 OID 5341751)
-- Name: time_stats time_stats_content_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY time_stats
    ADD CONSTRAINT time_stats_content_fkey FOREIGN KEY (content) REFERENCES contents(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3212 (class 2606 OID 5341761)
-- Name: time_stats time_stats_course_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY time_stats
    ADD CONSTRAINT time_stats_course_fkey FOREIGN KEY (course) REFERENCES courses(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3211 (class 2606 OID 5341756)
-- Name: time_stats time_stats_kquestion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY time_stats
    ADD CONSTRAINT time_stats_kquestion_fkey FOREIGN KEY (kquestion) REFERENCES kquestions(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3213 (class 2606 OID 5341766)
-- Name: time_stats time_stats_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY time_stats
    ADD CONSTRAINT time_stats_user_fkey FOREIGN KEY ("user") REFERENCES users(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3214 (class 2606 OID 5341786)
-- Name: transactions transactions_contentRef_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY transactions
    ADD CONSTRAINT "transactions_contentRef_fkey" FOREIGN KEY ("contentRef") REFERENCES orders(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3216 (class 2606 OID 5341796)
-- Name: transactions transactions_creator_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY transactions
    ADD CONSTRAINT transactions_creator_fkey FOREIGN KEY (creator) REFERENCES users(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3215 (class 2606 OID 5341791)
-- Name: transactions transactions_order_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY transactions
    ADD CONSTRAINT transactions_order_fkey FOREIGN KEY ("order") REFERENCES orders(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3217 (class 2606 OID 5341801)
-- Name: transactions transactions_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY transactions
    ADD CONSTRAINT transactions_user_fkey FOREIGN KEY ("user") REFERENCES users(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3167 (class 2606 OID 5287830)
-- Name: user_roles user_roles_targetRef_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY user_roles
    ADD CONSTRAINT "user_roles_targetRef_fkey" FOREIGN KEY ("targetRef") REFERENCES users(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3166 (class 2606 OID 5287825)
-- Name: user_roles user_roles_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hwphxleoyqmhto
--

ALTER TABLE ONLY user_roles
    ADD CONSTRAINT user_roles_user_fkey FOREIGN KEY ("user") REFERENCES users(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3340 (class 0 OID 0)
-- Dependencies: 9
-- Name: public; Type: ACL; Schema: -; Owner: hwphxleoyqmhto
--

REVOKE ALL ON SCHEMA public FROM postgres;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;
GRANT ALL ON SCHEMA public TO hwphxleoyqmhto;


-- Completed on 2017-05-09 22:47:01 ICT

--
-- PostgreSQL database dump complete
--

