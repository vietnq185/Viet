START TRANSACTION;

DROP TABLE IF EXISTS `plans`;
CREATE TABLE IF NOT EXISTS `plans` (
    _id uuid NOT NULL,
    courses text[] DEFAULT ARRAY[]::text[],
    fee double precision DEFAULT 0,
    "dateCreated" bigint
);

INSERT INTO plans VALUES(uuid_in(md5(random()::text || now()::text)::cstring), [1], 60, 60, 100);


COMMIT;