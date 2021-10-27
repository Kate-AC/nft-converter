import React, { useState, useContext, createContext } from 'react';

const MetaMaskContext = createContext();

const MetaMaskContextProvider = (props) => {
  const [address, setAddress] = useState('');

  const metaMaskData = {
    address: address,
    setAddress: setAddress
  }

  return (
    <MetaMaskContext.Provider value={metaMaskData}>
      {props.children}
    </MetaMaskContext.Provider>
  );
}

const MetaMaskContextConsumer = MetaMaskContext.Consumer;

export default MetaMaskContext;

export {
  MetaMaskContextProvider,
  MetaMaskContextConsumer,
}