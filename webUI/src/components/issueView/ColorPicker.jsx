import React from 'react';
import '../../styles/issueView/ColorPicker.css';

const ColorPicker = ({ selectedColor, onSelectColor, showColorOptions, setShowColorOptions }) => {
  const colors = ["#418553", "#00ff00", "#0000ff", "#a212e0", "#e0c812", "#e01238"];

  return (
    <div className="color-picker" style={{ backgroundColor: selectedColor }} onClick={() => setShowColorOptions(!showColorOptions)}>
      {showColorOptions && (
        <div className="color-options">
          {colors.map((color, index) => (
            <div
              key={index}
              className="color-option"
              style={{ backgroundColor: color }}
              onClick={(e) => {
                e.stopPropagation(); 
                onSelectColor(color);
              }}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
