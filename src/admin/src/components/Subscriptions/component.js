import React from 'react';
import ReactDataGrid from 'react-data-grid';
import moment from 'moment';

import { Button, Modal, Pagination } from 'react-bootstrap';

import API from '../../helpers/api'; // eslint-disable-line
import Utils from '../../helpers/utils'; // eslint-disable-line

import constants from '../../constants';

const MONTHLY = constants.frequency.monthly // eslint-disable-line
const ANNUALLY = constants.frequency.annually // eslint-disable-line

const BANK_TRANSFER = constants.paymentMethod.bankTransfer // eslint-disable-line
const CREDIT_CARD = constants.paymentMethod.creditCard // eslint-disable-line

const EmptyRowsView = () => {
  return (<div>No data found</div>);
};

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
      page: 1,
      objDetails: null
    };
  }

  componentDidMount() {
    this.getList(this.state.page)
  }

  getList(page) {
    this.props.getSubscriptionList(page)
    this.setState({ page: page })
  }

  parseData(item, isList = true) {
    var self = this;

    let isAnnually = (item.expirationType === ANNUALLY)
    let theRate = isAnnually ? 12 : 1
    let theLabel = isAnnually ? 'year' : 'month'

    const id = `#${item.refid || (item._id.substring(0, 7) + '...')}`;

    const viewLink = (<a href="javascript: void(0);" onClick={() => {
      self.open(item);
    }}>{id}</a>);

    const data = {
      id: isList ? viewLink : id,
      plan: item.courseTitles.join(' & '),
      price: `$${item.fee * theRate}/${theLabel} via ${item.channel === CREDIT_CARD ? 'Credit Card' : item.channel}`,
      created: moment.unix(item.dateCreated / 1000).format('MMM D, YYYY'),
      nextPayment: moment.unix(item.expiryDate / 1000).format('MMM D, YYYY'),
      status: Utils.ucfirst(item.status)
    };
    return data;
  }

  rowGetter(i) {
    const item = this.props.subscription.list.subscriptions[i];
    return this.parseData(item);
  }

  changePage(page) {
    this.setState({ page })
    this.getList(page);
  }

  close() {
    this.setState({ objDetails: null });
  }

  open(item) {
    this.setState({ objDetails: item });
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
          minHeight={500}
          emptyRowsView={EmptyRowsView} />

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

        {this.renderDetailsDialog()}

      </div>
    );
  }

  renderDetailsDialog() {
    const showModal = this.state.objDetails !== null;
    if (!showModal) {
      return (<div></div>);
    }

    const renderDetailsRow = (label, value) => {
      return (
        <div className="row details-row">
          <div className="col-xs-12">
            <div className="form-group">
              <label>{label}: </label>
              <span className="">{value}</span>
            </div>
          </div>
        </div>
      );
    }

    const data = this.parseData(this.state.objDetails, false);

    return (
      <Modal show={showModal} onHide={() => this.close()}>
        <Modal.Header closeButton>
          <Modal.Title>Subscription Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {renderDetailsRow('ID', data.id)}
          {renderDetailsRow('Plan', data.plan)}
          {renderDetailsRow('Price', data.price)}
          {renderDetailsRow('Created', data.created)}
          {renderDetailsRow('Next Payment', data.nextPayment)}
          {renderDetailsRow('Status', data.status)}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => this.close()}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}