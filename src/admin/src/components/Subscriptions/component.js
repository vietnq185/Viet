import React from 'react';
import ReactDataGrid from 'react-data-grid';
import moment from 'moment';

import { Button, Modal, Pagination } from 'react-bootstrap';

import API from '../../helpers/api'; // eslint-disable-line
import Utils from '../../helpers/utils'; // eslint-disable-line

import constants from '../../constants';

import * as authActions from '../../reducers/auth';

const MONTHLY = constants.frequency.monthly // eslint-disable-line
const ANNUALLY = constants.frequency.annually // eslint-disable-line

const BANK_TRANSFER = constants.paymentMethod.bankTransfer // eslint-disable-line
const CREDIT_CARD = constants.paymentMethod.creditCard // eslint-disable-line

const STATUSES = constants.subscriptionStatuses // eslint-disable-line

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
      objDetails: null,
      updateMsg: ''
    };
    this.listMap = {};
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
    this.listMap[item._id] = i;
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
    this.setState({ objDetails: item, updateMsg: '' });
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

  // details page - START
  changeStatus(evt) {
    const self = this;
    const { objDetails } = this.state;
    const newStatus = evt.target.value;
    console.log('evt.target.value: ', newStatus);

    return authActions.checkAccessToken().then((jwt) => {
      return API.changeSubscriptionStatus(jwt.accessToken || '', objDetails._id, newStatus).then((result) => {
        console.info('changeSubscriptionStatus => result: ', result)
        self.props.subscription.list.subscriptions[self.listMap[objDetails._id]].status = newStatus;
        objDetails.status = newStatus;
        self.setState({ objDetails, updateMsg: 'Data updated successfully!' })
        //this.getList(this.state.page)
      }).catch((error) => {
        console.info('changeSubscriptionStatus => error: ', error)
        self.setState({ updateMsg: error })
      })
    }).catch((error) => {
      console.info('changeSubscriptionStatus => checkAccessToken => error: ', error)
      self.setState({ updateMsg: error })
    });
    //
  }

  renderDetailsDialog() {
    const self = this;
    const { objDetails } = this.state;
    const showModal = objDetails !== null;
    if (!showModal) {
      return (<div></div>);
    }

    const renderDetailsRow = (label, formattedValue, key = null) => {
      let valueControl = (<div className="pull-left">{formattedValue}</div>);
      if (key && key === 'status') {
        valueControl = (
          <div className="pull-left">
            <select className="form-control" ref="status" value={objDetails.status} onChange={(evt) => self.changeStatus(evt)}>
              {STATUSES.map(stat => {
                return (
                  <option key={`status_${stat}`} value={stat}>{Utils.ucfirst(stat)}</option>
                );
              })}
            </select>
          </div>
        );
      }
      return (
        <div key={Utils.uuid()} className="row admin-details-row">
          <div className="col-xs-12">
            <div className="form-group">
              <label className="pull-left">{label}:&nbsp;</label>
              {valueControl}
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
          {this.state.columns.map(col => {
            return renderDetailsRow(col.name, data[col.key], col.key);
          })}
          <div className={['form-group', this.state.updateMsg ? 'has-error' : 'hide'].join(' ')}>
            <span className='help-block'>{this.state.updateMsg}</span>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => this.close()}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
  // details page - END
}