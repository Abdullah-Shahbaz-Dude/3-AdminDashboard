import PropTypes from "prop-types";

const Button = ({
  children,
  disabled,
  onClick,
  className = "submit-button",
  ...props
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={className}
    aria-disabled={disabled}
    {...props}
  >
    {children}
  </button>
);

Button.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Button;
