const React = require('react');

module.exports = (name, { showProps, description } = {}) => props => {
  let contents = name;
  if (showProps) {
    contents = (
      <pre>
        {JSON.stringify(props, null, 2)}
      </pre>
    );
  }
  if (description) contents = `${name} (${description(props)})`;
  return (
    <div dataMockType={name} {...props}>
      {contents}
    </div>
  );
};
