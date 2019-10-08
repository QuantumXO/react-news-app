
import './_input.sass'

import React from 'react'
import classnames from 'classnames'

export default function Input(props) {

  const {type, name, classes, label, value, handleChangeFunc, placeholder, error, id, disabled = false} = props;

  const inputClasses = classnames('form__field', {
    'error': error,
    'textarea': type === 'textarea',
  }, classes);

  return (
    <div className="form__group">
      {label && <label htmlFor={name} className="form__label">{label}</label>}

      {type !== 'textarea' ? (
        <input
          type={type}
          name={name}
          id={id ? id : name}
          value={value || ''}
          disabled={disabled}
          className={inputClasses}
          placeholder={placeholder}
          onChange={handleChangeFunc || null}
        />
      ) : (
        <textarea
          cols="30"
          rows="10"
          name={name}
          id={id ? id : name}
          disabled={disabled}
          value={value || ''}
          placeholder={placeholder}
          className={inputClasses}
          onChange={handleChangeFunc || null}
        />
      )}

      {error && <p className="form__error error">{error}</p>}
    </div>
  )
}
