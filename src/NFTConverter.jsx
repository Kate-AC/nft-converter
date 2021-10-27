import styled from 'styled-components';
import MetaMask from './MetaMask';
import { useState, useEffect, useContext } from 'react';
import { MetaMaskContext } from './MetaMaskContext';
import { NFTStorage, File, toGatewayURL } from "nft.storage";

const NFTConverterStyled = styled.div`
  .nft-converter {
    &__submit {
      cursor: pointer;
      box-sizing: border-box;
      border: none;
      border-radius: 3px;
      background-color: #1f94ed;
      color: #fff;
      padding: 8px;
      width: 180px;
    }
  }

  @keyframes fadeOut {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  .converting {
    animation-name: fadeOut;
    animation-duration: .5s;
    animation-timing-function: linear;
    animation-delay: 0s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }
`;

const NFT_STORAGE = toGatewayURL("https://api.nft.storage");
const NFT_STORAGE_API_KEY = '';

const storeMetaData = async (src) => {
  console.log(NFT_STORAGE);
  console.log(NFT_STORAGE_API_KEY)
  const token = '';

  const storage = new NFTStorage({ NFT_STORAGE, token });

  const metadata = await storage.store({
    name: "aaaa",
    description:
      "Using the nft.storage metadata API to create ERC-1155 compatible metadata.",
    image: new File(
      [src],
      'hoge.jpeg',
      {
        type: "image/jpeg",
      }
    ),
    signer: 'NFTConverter',
    address: '',
  });

  const url = new URL(metadata.url);
  console.log(
    `HTTPS URL for the metadata: https://dweb.link/ipfs/${url.hostname}${url.pathname}`
  );
}

const NFTConverter = (props) => {
  const [converting, setConverting] = useState(false);
  const [status, setStatus] = useState(false);

  const transaction = (e) => {
    console.log(e);
    console.log(props.nftData);
  }

  return (
    <NFTConverterStyled>
      <div className='nft-converter'>
        <div className='converting'>変換中</div>
        <button
          className='nft-converter__submit'
          type='button'
          onClick={e => transaction(e)}
        >
          変換する
        </button>
      </div>
    </NFTConverterStyled>
  );
}

export default NFTConverter;
