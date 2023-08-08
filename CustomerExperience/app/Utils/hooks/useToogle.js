import {useState} from 'react';

export default function useToggle(defaultValue) {
  const [value, setValue] = useState(defaultValue);

  function toggleValue(value_) {
    setValue(currentValue =>
      typeof value_ === 'boolean' ? value_ : !currentValue,
    );
  }
  return [value, toggleValue];
}
