/*eslint-disable*/

import express from 'express';

import escape from 'pg-escape';
import UserModel from '../models/user.model';

const router = express.Router(); // eslint-disable-line new-cap

// test
router.get('/', (req, res, next) => {
  return res.send('OK');

  const user = new UserModel();
  const id = 'aa989120-9a71-411f-bf8e-01f3f40286b5';
  const firstName = 'Dung';

  // user.reset().where(`"firstName"=${escape('%L', firstName)}`).findCount().then(r => res.send(r)).catch(e => next(e));
  // user.reset().where(`"firstName"=${escape('%L', firstName)}`).find(id).then(r => res.send(r)).catch(e => next(e));
  // user.reset().where(`"firstName"=${escape('%L', firstName)}`).getDataPair(['_id', 'firstName'], ['_id', 'firstName', 'lastName']).then(r => res.send(r)).catch(e => next(e));

  /*user.reset()
    .select('t1.*')
    .join('"items" AS t2', 't1._id = t2.user', 'LEFT OUTER')
    // .where(`"firstName"=${escape('%L', firstName)}`)  // postgres treat column name as lower string, so put it into double qoute to keep format
    .where("t1._id::varchar LIKE '%88%'") // currently, _id is uuid type; need to cast to varchar before use with LIKE operator: _id::varchar
    .groupBy('t1._id, t1."firstName"')
    .having('t1."role" = \'user\'')
    .orderBy('t1."firstName"')
    .limit(10)
    .offset(1)
    .findAll()
    .then(r => res.send(r))
    .catch(e => next(e));*/

  /*user.insert({ _id: '4089688e-cdba-4ad1-8b84-d7c102982e53', firstName: "--NGOC''injection", lastName: 'DAM', phone: '0909091101' })
    .then(r => res.send(r))
    .catch(e => next(e));*/

  /*user
    .where("\"firstName\"::varchar LIKE '%NGOCaaaaaaaaaaaaaaaaaaaa%'")
    .update({ firstName: "--NGOC''injection updated" + new Date().getTime(), lastName: 'DAM updated', phone: '0909091101' })
    .then(r => res.send(r))
    .catch(e => next(e));*/

  /*user
    .where("_id='45848200-7b48-4ed6-8416-7a99778d48d2'")
    .delete()
    .then(r => res.send(r))
    .catch(e => next(e));*/
});

export default router;
