import React from 'react';

import { Button } from 'react-bootstrap';  // eslint-disable-line

import Utils from '../../helpers/utils';  // eslint-disable-line

export default class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
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
      o_arr[opt.key] = opt;
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

  render() {
    console.info('Options components => props: ', this.props, this.o_arr);
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
            {this.props.option.list.map(item => {
              return (
                <tr key={item.key}>
                  <td>{item.description}</td>
                  <td>
                    {this.renderControl(item)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className={['form-group', this.props.option.updateResult.errMsg ? 'has-error' : 'hide'].join(' ')}>
          <span className='help-block'>{this.props.option.updateResult.errMsg}</span>
        </div>
        {(this.props.option.list.length === 0 ? '' : (<Button bsStyle="success" onClick={() => this.updateOptions()}>Save</Button>))}
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
        return (<textarea ref={name} name={name} className="form-control">{value}</textarea>);
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