import React from 'react';
import './App.css';

const InputBlock = (props) => {
  const { input } = props
  const { key, name, type, value, handler } = input
  return (
    <div className="input-block" key={key}>
      <label className="input-data">
        <span className="input-name">{name}</span>
        <input
          required
          type={type}
          id={key}
          className="input-value"
          value={value}
          onChange={handler}
        />
      </label>
    </div>
  )
}

export default InputBlock