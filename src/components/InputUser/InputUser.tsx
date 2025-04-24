import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

const filter = createFilterOptions<any>();

const InputUser: React.FC<any> = function ({
  setAddressee,
  setValue,
  value,
  users
}) {
  const [dialogValue, setDialogValue] = React.useState({
    name: '',
    id: ''
  });

  return (
    <Autocomplete
      value={value}
      sx={{
        m: 1
      }}
      onChange={(event, newValue) => {
        if (typeof newValue === 'string') {
          // timeout to avoid instant validation of the dialog's form.
          setTimeout(() => {
            // toggleOpen(true);
            setDialogValue({
              ...dialogValue,
              name: newValue
            });
          });
        } else if (newValue && newValue.inputValue) {
          // toggleOpen(true);
          setDialogValue({
            ...dialogValue,
            name: newValue.inputValue
          });
        } else {
          setValue(newValue);
        }
        setAddressee(newValue);
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        if (params.inputValue !== '') {
          filtered.push({
            inputValue: params.inputValue,
            name: `Incorrect "${params.inputValue}"`
          });
        }

        return filtered;
      }}
      id="free-solo-dialog-demo"
      options={users}
      getOptionLabel={(option) => {
        // e.g value selected with enter, right from the input
        if (typeof option === 'string') {
          return option;
        }
        if (option.inputValue) {
          return option.inputValue;
        }
        return option.name; //
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      // eslint-disable-next-line react/jsx-props-no-spreading
      renderOption={(props, option) => <li {...props}>{option.name}</li>}
      freeSolo
      renderInput={(params) => (
        <TextField
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...params}
          variant="standard"
          label="Addressee"
          required
        />
      )}
    />
  );
};

export default InputUser;
