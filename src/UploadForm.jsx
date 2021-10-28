import styled from 'styled-components';
import MetaMask from './MetaMask';
import { useState, useEffect, useContext } from 'react';
import { MetaMaskContext } from './MetaMaskContext';
import NFTConverter from './NFTConverter';
import mime from 'mime-types';

const UploadFormStyled = styled.div`
  .upload-form {
    padding: 20px;

    &__input {
      margin-bottom: 10px;
    }

    &__thumb {
      max-width: 300px;
      margin-bottom: 10px;

      img {
        width: 100%;
      }
    }

    &__item {
      label {
        display: inline-block;
        width: 100px;
      }
      input {
        height: 1.4rem;
        border: solid 1px #999;
      }
    }
  }
`;

const UploadForm = () => {
  const [thumbImageSrc, setThumbImageSrc] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [mimeType, setMimeType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attribute, setAttribute] = useState('');

  const fileSelectEvent = (e) => {
    const fileReader = new FileReader();
    const thumbFileReader = new FileReader();
    const file = e.target.files[0];

    fileReader.onload = (e) => {
      setImageSrc(e.target.result);
      setMimeType(mime.lookup(file.name));
    }
    thumbFileReader.onload = (e) => setThumbImageSrc(e.target.result);

    fileReader.readAsArrayBuffer(file);
    thumbFileReader.readAsDataURL(file);
  }

  return (
    <UploadFormStyled>
      <div className='upload-form'>
        <form>
          <div className='upload-form__input'>
            <input
              onChange={fileSelectEvent}
              type='file'
              encType='multipart/form-data'
            />
          </div>
          <div className='upload-form__thumb'>
            <img src={thumbImageSrc} />
          </div>
          {
            imageSrc.length < 1 ? '' : (
              <>
                <div className='upload-form__item'>
                  <label>タイトル:</label>
                  <input name='title' onChange={e => setTitle(e.target.value)} value={title} />
                </div>
                <div className='upload-form__item'>
                  <label>説明:</label>
                  <input name='description' onChange={e => setDescription(e.target.value)} value={description} />
                </div>
                <div className='upload-form__item'>
                  <label>付帯情報:</label>
                  <input name='attribute' onChange={e => setAttribute(e.target.value)} value={attribute} />
                </div>
                <NFTConverter
                  nftData={{
                    title: title,
                    description: description,
                    attribute: attribute,
                    mimeType: mimeType,
                    imageSrc: imageSrc
                  }}
                />
              </>
            )
          }
        </form>
      </div>
    </UploadFormStyled>
  );
}

export default UploadForm;
