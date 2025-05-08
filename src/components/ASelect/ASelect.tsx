import React, { FC } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { IMultiSelect } from './type';

export const ASelect: FC<IMultiSelect> = ({ options, selected, onSelect }) => {
  const handleChange = (event: SelectChangeEvent) => {
    onSelect(event.target.value);
  };

  return (
    <FormControl sx={{ m: 0, display: 'block' }}>
      <InputLabel id="demo-simple-select-label">Name</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        sx={{ width: '100%' }}
        value={selected}
        onChange={handleChange}
        required
      >
        {options.map((user) => (
          <MenuItem key={user.id} value={user.id}>
            {user.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
