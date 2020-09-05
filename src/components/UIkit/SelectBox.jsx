import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  formControl:{
    marginBottom:16,
    minWidth: 128,
    width: "100%",
  }
})

const SelectBox = (props) => {
  const classes = useStyles();
  // console.log(props.options);
  // console.log(props.options.map);
  // console.log(props.value);
  // console.log(props.select);
  

  return(
    <FormControl className={classes.formControl}>
      <InputLabel>{props.label}</InputLabel>
      <Select
        required={props.required} value={props.value}
        onChange={(e) => props.select(e.target.value)}
      >
        {props.options.map((value) => {
          return <MenuItem key={value.id} value={value.id}>{value.name}</MenuItem>
        })}
      </Select>
    </FormControl>
  )
}

export default SelectBox;