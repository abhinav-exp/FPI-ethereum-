import './App.css';
import {Button} from 'react-bootstrap';
import useMetaMask from './hooks/useMetaMask';

function App() {
  // if(window.ethereum === undefined)
  // {
  //   return (<div>
  //     Please install metamask
  //   </div>)
  // }

  const { connect, disconnect, isActive, account } = useMetaMask()

  return (
    <div>
      <Button className= "secondary" onClick={connect}>
      Connect to MetaMask
      </Button>
    <div>
      Connected account { isActive ? account : "" }
    </div>
    <Button className="danger" onClick={disconnect}>
      Disconnected MetaMask
    </Button>
    </div>
  );
}

export default App;
