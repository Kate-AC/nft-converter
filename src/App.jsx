import styled from 'styled-components';
import MetaMask from './MetaMask';
import UploadForm from './UploadForm';
import { MetaMaskContextProvider, MetaMaskContextConsumer } from './MetaMaskContext';

const AppStyled = styled.div`
  .app {
  }
`;

const App = () => {
  return (
    <AppStyled>
      <MetaMaskContextProvider>
        <div className='app'>
          <MetaMask />
          <MetaMaskContextConsumer>
            {
              value => !value.address.length > 0 ? '' : <UploadForm />
            }
          </MetaMaskContextConsumer>
        </div>
      </MetaMaskContextProvider>
    </AppStyled>
  );
}

export default App;
