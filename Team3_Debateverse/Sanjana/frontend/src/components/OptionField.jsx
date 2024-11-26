export const OptionField = ({ options, onAddOption, onRemoveOption, onChangeOption, maxOptions }) => {
    // Your component logic here
    return (
      <div>
        {options.map((option, index) => (
          <div key={index}>
            <input
              type="text"
              value={option}
              onChange={(e) => onChangeOption(index, e.target.value)}
            />
            <button onClick={() => onRemoveOption(index)}>Remove</button>
          </div>
        ))}
        {options.length < maxOptions && <button onClick={onAddOption}>Add Option</button>}
      </div>
    );
  };
  
  export default OptionField;
  