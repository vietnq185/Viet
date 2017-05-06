import React from 'react';
import ReactDataGrid from 'react-data-grid';
const { Row } = ReactDataGrid;
import moment from 'moment';

import { Button, Modal, Pagination, Panel, ButtonToolbar } from 'react-bootstrap';

import API from '../../helpers/api'; // eslint-disable-line
import Utils from '../../helpers/utils'; // eslint-disable-line

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

  onViewDetails() {
    this.props.viewDetails(this.row.props.idx);
  }

  render() {
    return (<div onClick={() => this.onViewDetails()} style={this.getRowStyle()}><Row ref={node => this.row = node} {...this.props} /></div>);
  }
}

export default class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        //{ key: '_id', name: 'ID'},
        { key: 'firstName', name: 'FirstName' },
        { key: 'lastName', name: 'Last Name' },
        { key: 'email', name: 'Email' },
        { key: 'role', name: 'Role' },
        { key: 'status', name: 'Status' },
        //{ key: 'dateCreated', name: 'Created' },
      ],
      page: 1,
      objDetails: null,
      updateMsg: '',
      filter: {}
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

  render() {
    console.info('Users components => props: ', this.props);

    return (
      <div>

        <h3>Users</h3>

        {this.renderFilters()}

        <ReactDataGrid
          columns={this.state.columns}
          rowGetter={(i) => this.rowGetter(i)}
          rowsCount={this.props.user.list.data.length}
          minHeight={600}
          rowRenderer={<RowRenderer viewDetails={this.open.bind(this)} />}
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

      </div>
    );
  }

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