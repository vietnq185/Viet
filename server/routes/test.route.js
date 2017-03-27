/*eslint-disable*/

import express from 'express';

import escape from 'pg-escape';
import UserModel from '../models/user.model';

const router = express.Router(); // eslint-disable-line new-cap

// test
router.get('/', (req, res, next) => {
  return res.send('OK');


  /*const user = new UserModel();
  const values = ['%88%', 'Dung'];
  user.reset()
    .where('t1."firstName"=$2')
    .where("t1._id::varchar LIKE $1")
    .findOne(values)
    .then(r => res.send(r)).catch(e => next(e));*/

  /*const user = new UserModel();
  const values = ['%88%', 'Dung', 'user'];
  user.reset()
    .select('t2.title AS item_title, t1.*')
    .join('"items" AS t2', 't1._id = t2.user', 'LEFT OUTER')
    .where('t1."firstName"=$2')
    .where("t1._id::varchar LIKE $1")
    .groupBy('t1._id, t1."firstName", t2.title')
    .having('t1."role" = $3')
    .orderBy('t1."firstName"')
    .limit(10)
    .offset(1)
    .findAll(values)
    .then(r => res.send(r)).catch(e => next(e));*/

  // Test fincCoutn with JOIN
  /*const user = new UserModel();
  const values = ['%88%', 'Dung', 'user'];
  user.reset()
    .select('t2.title AS item_title, t1.*')
    .join('"items" AS t2', 't1._id = t2.user', 'LEFT OUTER')
    .where('t1."firstName"=$2')
    .where("t1._id::varchar LIKE $1")
    .groupBy('t1._id, t1."firstName", t2.title')
    .having('t1."role" = $3')
    .orderBy('t1."firstName"')
    .limit(10)
    .offset(1)
    .findCount(values)
    .then(r => res.send(r)).catch(e => next(e));*/

  // Test fincCoutn without JOIN
  /*const user = new UserModel();
  const values = ['%88%', 'Dung'];
  user.reset()
    .where('t1."firstName"=$2')
    .where("t1._id::varchar LIKE $1")
    .findCount(values)
    .then(r => res.send(r)).catch(e => next(e));*/

  /*const user = new UserModel();
  const values = ['%88%', 'Dung', 'user'];
  const keyFields = ['_id', 'dateCreated', 'item_title'];
  const valuesFields = ['_id', 'username', 'firstName', 'lastName'];
  user.reset()
    .select('t2.title AS item_title, t1.*')
    .join('"items" AS t2', 't1._id = t2.user', 'LEFT OUTER')
    .where('t1."firstName"=$2')
    .where("t1._id::varchar LIKE $1")
    .groupBy('t1._id, t1."firstName", t2.title')
    .having('t1."role" = $3')
    .orderBy('t1."firstName"')
    .limit(10)
    .offset(1)
    .getDataPair(values, keyFields, valuesFields)
    .then(r => res.send(r)).catch(e => next(e));*/

  /*const user = new UserModel();
  user.insert({ _id: ('4089688e-cdba-4ad1-8b84-d7' + parseInt(new Date().getTime() / 1000)), firstName: "--NGOC''injection", lastName: 'DAM', phone: '0909091101' })
    .then(r => res.send(r))
    .catch(e => next(e));*/

  /*const user = new UserModel();
  const updateData = { firstName: "--NGOC''injection updated" + new Date().getTime(), lastName: 'DAM updated', phone: '0909091101' };
  const values = ['%NGOC%'];
  user
    .where('t1."firstName" LIKE $1')
    .update(updateData, values)
    .then(r => res.send(r))
    .catch(e => next(e));*/

  /*const user = new UserModel();
  const values = ['05648f66-b9cb-48ab-bd92-de5b59392dbd'];
  user.where("_id=$1")
    .delete(values)
    .then(r => res.send(r))
    .catch(e => next(e));*/

});

export default router;
