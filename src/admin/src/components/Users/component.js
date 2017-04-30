import React from 'react';
import ReactDataGrid from 'react-data-grid';
const { Row } = ReactDataGrid;
import moment from 'moment';

import { Button, Modal, Pagination } from 'react-bootstrap';

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
    console.info('RowRenderer props: ', this.props);
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
        { key: 'role', name: 'Role' },
        { key: 'status', name: 'Status' },
        //{ key: 'dateCreated', name: 'Created' },
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
    this.props.getUserList(page)
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
    console.info('open => index: ', i);
    const item = this.props.user.list.data[i];
    console.info('open => item: ', item);
    this.setState({ objDetails: item, updateMsg: '' });
  }

  onRowClick() {
    console.info('onRowClick: ', arguments);
  }

  render() {
    console.info('Users components => props: ', this.props);

    return (
      <div>

        <h3>Users</h3>

        <ReactDataGrid
          columns={this.state.columns}
          rowGetter={(i) => this.rowGetter(i)}
          rowsCount={this.props.user.list.data.length}
          minHeight={500}
          onRowClick={this.onRowClick.bind(this)}
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