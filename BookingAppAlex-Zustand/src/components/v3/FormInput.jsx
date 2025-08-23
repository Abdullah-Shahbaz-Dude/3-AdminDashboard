import PropTypes from "prop-types";
import sanitizeHtml from "sanitize-html";

const FormInput = ({
  register,
  name,
  errors,
  placeholder,
  type = "text",
  rules,
  rows,
  cols,
}) => (
  <div className="form-group">
    {type === "textarea" ? (
      <textarea
        {...register(name, {
          ...rules,
          // setValueAs: (value) => sanitizeHtml(value),
          setValueAs: (value) =>
            sanitizeHtml(value, {
              allowedTags: [], // No HTML tags allowed
              allowedAttributes: {}, // No attributes allowed
            }),
        })}
        placeholder={placeholder}
        className="form-input"
        aria-invalid={errors[name] ? "true" : "false"}
        rows={rows || 5}
        cols={cols || 50}
      />
    ) : (
      <input
        {...register(name, {
          ...rules,
          setValueAs: (value) => sanitizeHtml(value),
        })}
        type={type}
        placeholder={placeholder}
        className="form-input"
        aria-invalid={errors[name] ? "true" : "false"}
      />
    )}
    {errors[name] && <p className="error-text">{errors[name].message}</p>}
  </div>
);

FormInput.propTypes = {
  register: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  errors: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  rules: PropTypes.object,
  rows: PropTypes.number,
  cols: PropTypes.number,
};

export default FormInput;
