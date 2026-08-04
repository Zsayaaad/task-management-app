const FormRow = ({ name, type, labelText, placeholder, defaultValue }) => {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={name}
        className="block font-body text-sm font-medium text-on-surface"
      >
        {labelText || name} <span className="text-danger">*</span>
      </label>
      <input
        type={type}
        id={name}
        name={name}
        required
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="input-field"
      />
    </div>
  );
};

export default FormRow;
