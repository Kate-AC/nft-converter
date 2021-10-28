import styled from 'styled-components';
import Web3 from 'web3';
import { useState, useEffect, useContext } from 'react';
import MetaMaskContext from './MetaMaskContext';

const MetaMaskStyled = styled.div.attrs(props => ({
 connected: props.connected
}))`
  .meta-mask {
    color: #fff;
    background-color: ${props => props.connected ? '#43cc0c' : '#e61515'};
    padding: 1rem;

    &__status {
      margin: 0;
    }

    &__item {
      label {
        margin-right: 10px;
      }
    }
  }
`;

const MetaMask = () => {
  const {address, setAddress} = useContext(MetaMaskContext);

  useEffect(() => {
    if (window.ethereum === undefined) return;

    const web3 = new Web3(window.ethereum);
    (async () => {
      const addressList = await window.ethereum.enable();
      setAddress(addressList[0]);
    })();
  }, [window.ethereum]);

  return (
    <MetaMaskStyled connected={address.length > 0}>
      <div className='meta-mask'>
        <h2 className='meta-mask__status'>
          {address.length > 0 ? '接続済み' : '未接続'}
        </h2>
        <div className='meta-mask__item'>
          <label>Your address:</label>
          <span>{address}</span>
        </div>
      </div>
    </MetaMaskStyled>
  );
}

export default MetaMask;
