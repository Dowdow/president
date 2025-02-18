import React from 'react';
import { useDispatch } from 'react-redux';
import { setError } from '../actions/error';

export default function Error({ message }) {
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(setError(null));
  };

  return (
    <div className="fixed top-0 left-0 right-0 flex justify-between items-center w-2/5 mx-auto p-2 border-x-2 border-b-2 border-black bg-skin-gradient rounded-b-lg">
      <span>{message}</span>
      <button type="button" onClick={handleClose} className="cursor-pointer">Close</button>
    </div>
  );
}
