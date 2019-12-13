import React from 'react';


// <Field name={name} label={label} value={value} onChange={onChange} placeholder={placeholder} type="text" error=""/>

const Field = ({name, label, value, onChange, placeholder="", type = "text", error= ""}) => 
     (
       
<div className="form-group">
          <label htmlFor={name}>{label}</label>
          <input
          onChange={onChange}
            type={type}
            className={"form-control " + (error &&"is-invalid" )}
            placeholder={placeholder || label}
            name={name}
            id={name}
            value={value}
          ></input>
          {error && <p className="invalid-feedback">{error}</p>}
        </div>
    );


export default Field;