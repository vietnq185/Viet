import React from 'react';

import { Button, Nav, NavItem, Tab, Tabs } from 'react-bootstrap';  // eslint-disable-line

import Utils from '../../helpers/utils';  // eslint-disable-line

import TinyEditor from '../TinyEditor';

export default class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: props.activeTab || 1
    }
    this.o_arr = {};  // this object will look like this: { tab_id => [opt1, opt2,..], ... }
    this.oTabLabels = {
      1: 'General',
      2: 'Email templates',
    };
  }

  componentDidMount() {
    this.props.getOptionList()
  }

  componentWillReceiveProps(nextProps) {
    this.o_arr = this.parseOArr(nextProps)
  }

  parseOArr(props) {
    const o_arr = {};
    for (let i = 0; i < props.option.list.length; i++) {
      const opt = props.option.list[i];
      const { tab_id } = opt;
      if (typeof o_arr[tab_id] === 'undefined') {
        o_arr[tab_id] = [];
      }
      o_arr[tab_id].push(opt);
    }
    return o_arr;
  }

  updateOptions() {
    const data = {};
    for (let key in this.refs) {
      if (this.refs.hasOwnProperty(key)) {
        const obj = this.refs[key];
        switch (obj.type) {
          case 'checkbox':
            data[key] = (obj.checked ? '1|0::1' : '1|0::0');
            break;
          default:
            data[key] = (obj.value || '');
        }
      }
    }
    this.props.updateOptions(data);
  }

  handleSelect(selectedTab) {
    this.setState({
      activeTab: selectedTab
    });
  }

  render() {
    var self = this;

    console.info('Options components => props: ', this.props);
    console.info('Options components => o_arr: ', this.o_arr);

    const tabsArr = Object.keys(this.o_arr).map(num => parseInt(num, 10));
    tabsArr.sort((a, b) => {
      return a - b;
    });

    return (
      <div>

        <h3>Options</h3>

        <Tabs activeKey={this.state.activeTab} onSelect={this.handleSelect.bind(this)} id="optionTabs">
          {tabsArr.map(tabId => {
            return (
              <Tab key={`option_tab_${tabId}`} eventKey={tabId} title={(self.oTabLabels[tabId] || '')} style={{ padding: '10px' }}>
                {self.renderTab(tabId)}
              </Tab>);
          })}
        </Tabs>

        <div className={['form-group', this.props.option.updateResult.errMsg ? 'has-error' : 'hide'].join(' ')}>
          <span className='help-block'>{this.props.option.updateResult.errMsg}</span>
        </div>
        {(this.props.option.list.length === 0 ? '' : (<Button bsStyle="success" onClick={() => this.updateOptions()}>Save</Button>))}

      </div>
    );
  }

  renderTab(tabId) {
    const self = this;
    const data = this.o_arr[tabId] || [];
    return (
      <div className='table-responsive'>
        <table className='table'>
          <thead>
            <tr>
              <th>Option</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => {
              return (
                <tr key={item.key}>
                  <td>{item.description}</td>
                  <td>
                    {self.renderControl(item)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  renderControl(item) {
    const name = `value-${item['type']}-${item['key']}`;
    const value = item.value ? item.value : '';
    const label = item.label ? item.label : '';
    switch (item.type) {
      case 'string':
        return (<input type="text" ref={name} name={name} defaultValue={value} className="form-control" />);
        break; // eslint-disable-line
      case 'text':
        const pattern = new RegExp(/^mail_(.*)_ARRAY_message$/gi);
        if (pattern.test(item.key)) {
          return (<TinyEditor ref={name} value={value} id={`myCoolEditor_${item.key}`} />);
        }
        return (<textarea ref={name} name={name} defaultValue={value} className="form-control"></textarea>);
        break; // eslint-disable-line
      case 'int':
        return (<input type="text" ref={name} name={name} defaultValue={value} className="form-control" />);
        break; // eslint-disable-line
      case 'float':
        return (<input type="text" ref={name} name={name} defaultValue={value} className="form-control" />);
        break; // eslint-disable-line
      case 'bool':
        return (<input type="checkbox" ref={name} name={name} defaultValue="1|0::1" defaultChecked={value === '1|0::1'} className="form-control" />);
        break; // eslint-disable-line
      case 'enum':
        const defaultArr = value.split('::');
        const enumArr = defaultArr[0].split('|');
        let enumLabels = label ? label.split('|') : [];
        return (
          <select ref={name} name={name} defaultValue={value} className="form-control">
            {enumArr.map((el, idx) => {
              return (<option key={`${el}_${idx}`} value={`${defaultArr[0]}::${el}`}>{(enumLabels[idx] || el)}</option>);
            })}
          </select>
        );
        break; // eslint-disable-line
      default:
        return '';
    }
  }
}