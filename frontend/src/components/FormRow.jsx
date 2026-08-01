const FormRow = ({ name, type, labelText, placeholder }) => {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={name}
        className="block font-body text-sm font-medium text-on-surface"
      >
        {labelText || name}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        required
        placeholder={placeholder}
        className="input-field"
      />
    </div>
  );
};

export default FormRow;
