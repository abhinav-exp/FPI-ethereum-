import {Button} from 'react-bootstrap';
import useMetaMask from '../hooks/useMetaMask';
import Alert from 'react-bootstrap/Alert'

export default function MainScreen(){
    const { connect, disconnect, isActive, account } = useMetaMask()

    return (
    (isActive === false) ? 
    (<div className='mainscreen'>
        <Alert variant='danger' > If you have not installed metamask on Browser, Please do </Alert>
        <Button variant= "danger" onClick={connect}> Connect to MetaMask </Button>
    </div>) : 
    (<div className='mainscreen'>
        <div>
        Connected account { account }
        </div>
        <Button variant= "danger" onClick={disconnect}>
        Disconnected MetaMask
        </Button>
    </div>)
    );
}