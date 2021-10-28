import styled from 'styled-components';
import MetaMask from './MetaMask';
import { useState, useEffect, useContext } from 'react';
import MetaMaskContext from './MetaMaskContext';
import { NFTStorage, File, toGatewayURL } from "nft.storage";
import axios from 'axios';

const NFTConverterStyled = styled.div.attrs(props => ({
  status: props.status
}))`
  .nft-converter {
    &__submit {
      cursor: pointer;
      box-sizing: border-box;
      border: none;
      border-radius: 3px;
      background-color: ${props => props.status === 'static' ? '#1f94ed' : '#ccc'};
      color: #fff;
      padding: 8px;
      width: 180px;
      margin: 10px 0;
    }

    &__response {
      div {
        margin: 10px 0;
      }
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

const storeMetaData = async (attrs) => {
  const endPoint = toGatewayURL('https://api.nft.storage');
  const token = process.env.REACT_APP_NFT_STORAGE_TOKEN;

  const storage = new NFTStorage({endPoint, token});

  const metadata = await storage.store({
    name: attrs.title,
    description: attrs.description,
    image: new File(
      [attrs.imageSrc],
      [attrs.title, '.', attrs.mimeType.split('/')[1]].join(''),
      {
        type: attrs.mimeType,
      }
    ),
    signer: 'NFTConverter',
    attribute: attrs.attribute,
    address: '',
  });

  const url = new URL(metadata.url);

  return `https://dweb.link/ipfs/${url.hostname}${url.pathname}`;
}

const mintNFT = async (myAddress, metaData) => {
  const baseUrl = process.env.REACT_APP_CHAIN_NETWORK;
  const apiKey = process.env.REACT_APP_HOKUSAI_API_KEY;
  const contractId = process.env.REACT_APP_HOKUSAI_CONTRACT_ID;

  return axios
    .post(
      `${baseUrl}/v1/nfts/${contractId}/mint?key=${apiKey}`,
      {
        to: myAddress,
        tokenUri: metaData
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then(response => {
      const { data } = response;
      return data;
    })
    .catch(error => {
      throw new Error(error);
    });
}

const NFTConverter = (props) => {
  const {address, setAddress} = useContext(MetaMaskContext);
  const [status, setStatus] = useState('static');
  const [metaData, setMetaData] = useState('');
  const [token, setToken] = useState('');

  const transaction = async (e) => {
    try {
    console.log(props.nftData);
    setStatus('converting');

    const storedData = await storeMetaData(props.nftData);
    setMetaData(storedData);
    const token = await mintNFT(address, storedData);
    setToken(token.txHash);

    setStatus('done');
    } catch (e) {
      console.log(e);
      window.alert('Error. Please see console.');
    }
  }

  const getText = () => {
    if (status === 'converting') {
      return '変換中';
    }

    if (status === 'done') {
      return '変換完了';
    }

    return '変換する';
  }

  return (
    <NFTConverterStyled status={status}>
      <div className='nft-converter'>
        <button
          className={[
            'nft-converter__submit',
            status === 'converting' ? 'converting' : ''
          ].join(' ')}
          type='button'
          onClick={
            e => status === 'static' ? transaction(e) : null
          }
        >
          {getText()}
        </button>
        {
          metaData === '' ? '' : (
            <div className='nft-converter__response'>
              <div>MetaDataUrl: {metaData}</div>
              <div>ImageUrl: https://ipfs.io/ipfs/[ここに追加]</div>
            </div>
          )
        }
        {
          token === '' ? '' : (
            <div className='nft-converter__response'>
              <div>MintedToken: {token}</div>
              <div>
                <a
                  href={process.env.REACT_APP_CHAIN_NETWORK}
                  target='_blank'
                >
                  ここからトークンを検索
                </a>
              </div>
            </div>
          )
        }
      </div>
    </NFTConverterStyled>
  );
}

export default NFTConverter;
