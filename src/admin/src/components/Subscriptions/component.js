import React from 'react';
import ReactDataGrid from 'react-data-grid';
const { Row } = ReactDataGrid;
import moment from 'moment';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import { Button, Modal, Pagination, Panel, ButtonToolbar } from 'react-bootstrap';

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

class RowRenderer extends React.Component {

  setScrollLeft(scrollBy) {
    // if you want freeze columns to work, you need to make sure you implement this as apass through
    this.row.setScrollLeft(scrollBy);
  }

  getRowStyle() {
    return {
      //color: this.getRowBackground()
      cursor: 'pointer',
      display: 'block',
      height: 'auto'
    };
  }

  getRowBackground() {
    return this.props.idx % 2 ? 'green' : 'blue';
  }

  onViewDetails() {
    this.props.viewDetails(this.row.props.idx);
  }

  render() {
    return (<span onClick={() => this.onViewDetails()} style={this.getRowStyle()}><Row ref={node => this.row = node} {...this.props} /></span>);
  }
}

export default class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { key: 'id', name: 'ID', resizable: true, sortable: false, filterable: false },
        { key: 'customer', name: 'customer', resizable: true, sortable: false, filterable: true },
        { key: 'plan', name: 'Plan', resizable: true, sortable: false, filterable: true },
        { key: 'price', name: 'Price', resizable: true, sortable: false, filterable: false },
        { key: 'created', name: 'Created', resizable: true, sortable: false, filterable: false },
        { key: 'nextPayment', name: 'Next Payment', resizable: true, sortable: false, filterable: false },
        { key: 'status', name: 'Status', resizable: true, sortable: false, filterable: true },
      ],
      page: 1,
      objDetails: null,
      updateMsg: '',
      filter: {}
    };
    this.listMap = {};
    this.dateFormat = "DD-MM-YYYY";
  }

  componentDidMount() {
    this.getList(this.state.page)
    this.props.getPlanList();
  }

  getList(page = 1) {

    const obj = {};
    if (this.state.filter.createdDateFrom) {
      obj.createdDateFrom = this.state.filter.createdDateFrom.valueOf();
    }
    if (this.state.filter.createdDateTo) {
      obj.createdDateTo = this.state.filter.createdDateTo.valueOf();
    }
    if (this.state.filter.nextPaymentDateFrom) {
      obj.nextPaymentDateFrom = this.state.filter.nextPaymentDateFrom.valueOf();
    }
    if (this.state.filter.nextPaymentDateTo) {
      obj.nextPaymentDateTo = this.state.filter.nextPaymentDateTo.valueOf();
    }

    this.props.getSubscriptionList({ page, ...this.state.filter, ...obj })
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

    const customer = (
      <span style={{ display: 'block' }}>
        <span style={{ display: 'block', marginBottom: '5px' }}>{item.firstName}&nbsp;{item.lastName}</span>
        <span style={{ display: 'block' }}>{item.email}</span>
      </span>
    );

    const data = {
      id: isList ? viewLink : id,
      customer,
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

  viewDetails(idx) {
    const item = this.props.subscription.list.subscriptions[idx];
    this.open(item);
  }

  render() {
    console.info('Subscriptions components => props: ', this.props);

    console.info('Subscriptions components => state: ', this.state);

    return (
      <div>

        <h3>Subscriptions</h3>

        {this.renderFilters()}

        <ReactDataGrid
          columns={this.state.columns}
          rowGetter={(i) => this.rowGetter(i)}
          rowsCount={this.props.subscription.list.subscriptions.length}
          minHeight={600}
          rowRenderer={<RowRenderer viewDetails={this.viewDetails.bind(this)} />}
          rowHeight={60}
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

  // render filter - START
  filterChange(evt) {
    const filter = Object.assign({}, this.state.filter);
    filter[evt.target.name] = evt.target.value;
    this.setState({ filter });
  }

  handleDateChange(key, date) {
    const filter = Object.assign({}, this.state.filter);
    filter[key] = date; //evt.target.value;
    this.setState({ filter });
  }

  renderFilters() {
    const self = this;
    const filterFotter = (
      <div className='text-center'>
        <Button onClick={() => this.setState({ filter: {} })}>Clear</Button>&nbsp;<Button onClick={() => this.getList()} bsStyle="primary">Search</Button>
      </div>
    );
    const allowList = ['pending', 'trailing', 'active', 'overdue', 'cancelled'];
    return (
      <Panel footer={filterFotter}>
        {this.renderFilterRow(
          <input className='form-control' type='text' name='refid' label='Subscription ID' value={this.state.filter.refid || ''} onChange={this.filterChange.bind(this)} />,
          <select className='form-control' name='planId' label='Plan' value={this.state.filter.planId || ''} onChange={this.filterChange.bind(this)}>
            <option key='plan_all' value=''> --- All --- </option>
            {self.props.subscription.planList.map(item => {
              return <option key={`plan_${item._id}`} value={item._id}>{item.courseTitles.join(' & ')}</option>
            })}
          </select>
        )}
        {this.renderFilterRow(
          <input className='form-control' type='text' name='name' label='Customer name' value={this.state.filter.name || ''} onChange={this.filterChange.bind(this)} />,
          <div className='row' label='Created date'>
            <div className='col-xs-6'>
              <span>From:&nbsp;</span>
              <DatePicker className='form-control' calendarClassName='calendar'
                selected={this.state.filter.createdDateFrom || ''}
                onChange={(date, evt) => this.handleDateChange('createdDateFrom', date)}
                monthsShown={1}
                dateFormat={this.dateFormat} />
            </div>
            <div className='col-xs-6'>
              <span>To:&nbsp;</span>
              <DatePicker className='form-control' calendarClassName='calendar'
                selected={this.state.filter.createdDateTo || ''}
                onChange={(date, evt) => this.handleDateChange('createdDateTo', date)}
                monthsShown={1}
                dateFormat={this.dateFormat} />
            </div>
          </div>
        )}
        {this.renderFilterRow(
          <input className='form-control' type='text' name='email' label='Customer email' value={this.state.filter.email || ''} onChange={this.filterChange.bind(this)} />,
          <div className='row' label='Next payment date'>
            <div className='col-xs-6'>
              <span>From:&nbsp;</span>
              <DatePicker className='form-control' calendarClassName='calendar'
                selected={this.state.filter.nextPaymentDateFrom || ''}
                onChange={(date, evt) => this.handleDateChange('nextPaymentDateFrom', date)}
                monthsShown={1}
                dateFormat={this.dateFormat} />
            </div>
            <div className='col-xs-6'>
              <span>To:&nbsp;</span>
              <DatePicker className='form-control' calendarClassName='calendar'
                selected={this.state.filter.nextPaymentDateTo || ''}
                onChange={(date, evt) => this.handleDateChange('nextPaymentDateTo', date)}
                monthsShown={1}
                dateFormat={this.dateFormat} />
            </div>
          </div>
        )}
        {this.renderFilterRow(
          <select className='form-control' name='status' label='Status' value={this.state.filter.status || ''} onChange={this.filterChange.bind(this)}>
            <option key='all_statuses' value=''> --- All --- </option>
            {allowList.map(stat => {
              return <option key={`status_${stat}`} value={stat}>{Utils.ucfirst(stat)}</option>
            })}
          </select>,
          <span></span>
        )}
      </Panel>
    );
  }

  renderFilterRow(left, right) {
    return (
      <div className='row'>
        <div className='col-sm-6 col-xs-12'>
          <div className={['form-group'].join(' ')}>
            <label>{left.props.label}</label>
            {left}
          </div>
        </div>
        <div className='col-sm-6 col-xs-12'>
          <div className={['form-group'].join(' ')}>
            <label>{right.props.label}</label>
            {right}
          </div>
        </div>
      </div>
    );
  }
  // render filter - END

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