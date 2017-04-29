import React from 'react';
import ReactDataGrid from 'react-data-grid';
import moment from 'moment';

import { Pagination } from 'react-bootstrap';

import API from '../../helpers/api'; // eslint-disable-line
import Utils from '../../helpers/utils'; // eslint-disable-line

import constants from '../../constants';

const MONTHLY = constants.frequency.monthly // eslint-disable-line
const ANNUALLY = constants.frequency.annually // eslint-disable-line

const BANK_TRANSFER = constants.paymentMethod.bankTransfer // eslint-disable-line
const CREDIT_CARD = constants.paymentMethod.creditCard // eslint-disable-line

export default class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { key: 'id', name: 'ID' },
        { key: 'plan', name: 'Plan' },
        { key: 'price', name: 'Price' },
        { key: 'created', name: 'Created' },
        { key: 'nextPayment', name: 'Next Payment' },
        { key: 'status', name: 'Status' },
      ],
      page: 1
    };
  }

  componentDidMount() {
    this.getList(this.state.page)
  }

  getList(page) {
    this.props.getSubscriptionList(page)
    this.setState({ page: page })
  }

  rowGetter(i) {
    const item = this.props.subscription.list.subscriptions[i];

    let isAnnually = (item.expirationType === ANNUALLY)
    let theRate = isAnnually ? 12 : 1
    let theLabel = isAnnually ? 'year' : 'month'

    const data = {
      id: (`#${item.refid || (item._id.substring(0, 7) + '...')}`),
      plan: item.courseTitles.join(' & '),
      price: `$${item.fee * theRate}/${theLabel} via ${item.channel === CREDIT_CARD ? 'Credit Card' : item.channel}`,
      created: moment.unix(item.dateCreated / 1000).format('MMM D, YYYY'),
      nextPayment: moment.unix(item.expiryDate / 1000).format('MMM D, YYYY'),
      status: Utils.ucfirst(item.status)
    };
    return data;
  }

  changePage(page) {
    this.setState({ page })
    this.getList(page);
  }

  render() {
    console.info('Subscriptions components => props: ', this.props);

    return (
      <div>

        <h3>Subscriptions</h3>

        <ReactDataGrid
          columns={this.state.columns}
          rowGetter={(i) => this.rowGetter(i)}
          rowsCount={this.props.subscription.list.subscriptions.length}
          minHeight={500} />

        <div className="text-center">
          <Pagination
            prev
            next
            first
            last
            ellipsis
            boundaryLinks
            items={this.props.subscription.list.totalPages}
            maxButtons={5}
            activePage={this.state.page}
            onSelect={(page) => this.changePage(page)} />
        </div>

      </div>
    );
  }
}