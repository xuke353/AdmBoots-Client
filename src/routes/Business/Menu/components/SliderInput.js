import React from 'react';
import { InputNumber, Slider } from 'antd';

class SliderInput extends React.Component {
  onChange = (changedValue) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(changedValue);
    }
  };

  render() {
    const { value } = this.props;
    return (
      <span style={{ display: 'flex' }}>
        <Slider
          tooltipVisible={false}
          style={{ flex: '1' }}
          value={value}
          onChange={this.onChange}
          min={0}
          max={100}
        />
        <div style={{ width: '60px', flex: 'none', marginLeft: '10px' }}>
          <InputNumber
            value={value}
            onChange={this.onChange}
            min={0}
            max={100}
          />
        </div>
      </span>
    );
  }
}
export default SliderInput;
