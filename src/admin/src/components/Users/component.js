/* eslint-disable */
import React from 'react';
import ReactDataGrid from 'react-data-grid';
const { Row } = ReactDataGrid;
import moment from 'moment';

import { Button, Modal, Pagination, Panel, ButtonToolbar } from 'react-bootstrap';

import API from '../../helpers/api'; // eslint-disable-line
import Utils from '../../helpers/utils'; // eslint-disable-line

import * as authActions from '../../reducers/auth';

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
      cursor: 'pointer'
    };
  }

  getRowBackground() {
    return this.props.idx % 2 ? 'green' : 'blue';
  }

  onViewDetails(evt) {
    console.info("evt.target: ", evt.target, this.row);
    if (evt.target['data-type']) console.info("evt.target['data-type']: ", evt.target['data-type']);
    this.props.viewDetails(this.row.props.idx);
  }

  render() {
    return (<div onClick={(evt) => this.onViewDetails(evt)} style={this.getRowStyle()}><Row ref={node => this.row = node} {...this.props} /></div>);
  }
}

export default class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        // { key: '_id', name: 'ID' },
        { key: 'firstName', name: 'FirstName', resizable: true },
        { key: 'lastName', name: 'Last Name', resizable: true },
        { key: 'email', name: 'Email', resizable: true },
        { key: 'role', name: 'Role', resizable: true },
        { key: 'status', name: 'Status', resizable: true },
        { key: 'linkCode', name: 'Link Code', width: 120 },
        //{ key: 'dateCreated', name: 'Created' },
        { key: 'deleteRow', name: '', width: 70 },
      ],
      page: 1,
      objDetails: null,
      updateMsg: '',
      filter: {},
      deleteId: '',
      deleteMsg: '',
      deleteSuccess: false
    };
    this.listMap = {};
  }

  componentDidMount() {
    this.getList(this.state.page)
  }

  getList(page) {
    this.props.getUserList({ page, ...this.state.filter })
    this.setState({ page: page })
  }

  parseData(item, isList = true) {
    const data = Utils.copy(item);

    data.status = data.status.join(", ");
    data.dateCreated = moment.unix(data.dateCreated / 1000).format('MMM D, YYYY');

    if (isList) {
      data.deleteRow = (
        <span>
          <i onClick={(evt) => this.open(this.listMap[item._id])} className="fa fa-lg fa-edit" style={{ cursor: 'pointer' }} title='view'></i>&nbsp;&nbsp;&nbsp;
          <i onClick={(evt) => this.deleteItem(item._id)} className="fa fa-lg fa-remove" style={{ cursor: 'pointer', color: 'red' }} title='delete'></i>
        </span>
      );
    }

    return data;
  }

  rowGetter(i) {
    const item = this.props.user.list.data[i];
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

  open(i) {
    const item = this.props.user.list.data[i];
    this.setState({ objDetails: item, updateMsg: '' });
  }

  deleteItem(deleteId) {
    this.setState({ deleteId, deleteMsg: '', deleteSuccess: false });
  }

  render() {
    console.info('Users components => props: ', this.props);
    console.info('Users components => state: ', this.state);

    // rowRenderer={<RowRenderer viewDetails={this.open.bind(this)} />}

    return (
      <div>

        <h3>Users</h3>

        {this.renderFilters()}

        <ReactDataGrid
          columns={this.state.columns}
          rowGetter={(i) => this.rowGetter(i)}
          rowsCount={this.props.user.list.data.length}
          minHeight={600}
          emptyRowsView={EmptyRowsView} />

        <div className="text-center">
          <Pagination
            prev
            next
            first
            last
            ellipsis
            boundaryLinks
            items={this.props.user.list.totalPages}
            maxButtons={5}
            activePage={this.state.page}
            onSelect={(page) => this.changePage(page)} />
        </div>

        {this.renderDetailsDialog()}

        {this.renderDeleteConfirmationDialog()}

      </div>
    );
  }

  // render delete confirmation - START
  cancelDelete() {
    this.setState({ deleteId: '', deleteMsg: '', deleteSuccess: false });
  }

  confirmDelete() {
    const self = this;
    const { deleteId } = this.state;
    return authActions.checkAccessToken().then((jwt) => {
      return API.deleteUser(jwt.accessToken || '', deleteId).then((result) => {
        console.info('deleteUser => result: ', result)
        self.setState({ deleteSuccess: true, deleteMsg: 'User updated successfully!' })
        self.getList(self.state.page)
      }).catch((error) => {
        console.info('deleteUser => error: ', error)
        self.setState({ deleteSuccess: false, deleteMsg: error })
      })
    }).catch((error) => {
      console.info('deleteUser => checkAccessToken => error: ', error)
      self.setState({ deleteSuccess: false, deleteMsg: error })
    });
  }

  renderDeleteConfirmationDialog() {
    const self = this;  // eslint-disable-line
    const { deleteId, deleteSuccess, deleteMsg } = this.state;
    const showModal = (typeof deleteId === 'string' && deleteId.length > 0);
    if (!showModal) {
      return (<div></div>);
    }

    let confirmationMessage = (
      <Modal show={showModal} onHide={() => this.cancelDelete()}>
        <Modal.Header closeButton>
          <Modal.Title>Delete user confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure to delete this user?</p>
          <div className={['form-group', deleteMsg ? 'has-error' : 'hide'].join(' ')}>
            <span className='help-block'>{deleteMsg}</span>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => this.cancelDelete()}>Cancel</Button>
          <Button onClick={() => this.confirmDelete()} bsStyle='primary'>Confirm</Button>
        </Modal.Footer>
      </Modal>
    );

    if (deleteSuccess) {
      confirmationMessage = (
        <Modal show={showModal} onHide={() => this.cancelDelete()}>
          <Modal.Header closeButton>
            <Modal.Title>User deleted</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className={['form-group', deleteMsg ? 'has-error' : 'hide'].join(' ')}>
              <span className='help-block'>{deleteMsg}</span>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.cancelDelete()}>Close</Button>
          </Modal.Footer>
        </Modal>
      );
    }

    return confirmationMessage;
  }
  // render delete confirmation - END

  // render filter - START
  filterChange(evt) {
    const filter = Utils.copy(this.state.filter);
    filter[evt.target.name] = evt.target.value;
    this.setState({ filter });
  }

  renderFilters() {
    const filterFotter = (
      <ButtonToolbar>
        <Button onClick={() => this.setState({ filter: {} })}>Clear</Button>
        <Button onClick={() => this.getList()} bsStyle="primary">Search</Button>
      </ButtonToolbar>
    );
    return (
      <Panel footer={filterFotter}>
        {this.renderFilterRow(
          <input className='form-control' type='text' name='name' label='Customer name' value={this.state.filter.name || ''} onChange={this.filterChange.bind(this)} />,
          <input className='form-control' type='text' name='email' label='Customer email' value={this.state.filter.email || ''} onChange={this.filterChange.bind(this)} />
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
  renderDetailsDialog() {
    const self = this;  // eslint-disable-line
    const { objDetails } = this.state;
    const showModal = objDetails !== null;
    if (!showModal) {
      return (<div></div>);
    }

    const renderDetailsRow = (label, formattedValue, key = null) => {
      return (
        <div key={Utils.uuid()} className="row admin-details-row">
          <div className="col-xs-12">
            <div className="form-group">
              <label className="pull-left">{label}:&nbsp;</label>
              <div className="pull-left">{formattedValue}</div>
            </div>
          </div>
        </div>
      );
    }

    const data = this.parseData(this.state.objDetails, false);

    return (
      <Modal show={showModal} onHide={() => this.close()}>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.state.columns.map(col => {
            if (col.key === 'deleteRow') return '';
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