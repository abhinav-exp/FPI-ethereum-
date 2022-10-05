import {Button} from 'react-bootstrap';
import useMetaMask from '../hooks/useMetaMask';
import Alert from 'react-bootstrap/Alert'
import Menu from './Menu';

export default function MainScreen(){
    const { connect, disconnect, isActive, account } = useMetaMask()

    return (
    (isActive === false) ? 
    (<div className='mainscreen'>
        <Alert variant='danger' className='middletext' > If you have not installed metamask on Browser, Please do </Alert>
        <Alert variant='warning' className='middletext' >This project only works on "  " Network</Alert>
        <Button variant= "danger"  onClick={connect}> Connect to MetaMask </Button>
    </div>) : 
    (<div className='mainscreen'>
        <div className='InfoBar'>
            <Alert variant='success' className='middletext' > Connected account { account } </Alert>
            <Alert variant='warning' className='middletext' >This project only works on "  " Network</Alert>
            <Alert variant='info' className='middletext' >In order to change connected Accounts, Please open up metamask</Alert>
            <Button variant= "danger" onClick={disconnect}>
            Disconnected MetaMask
            </Button>
        </div>
        <Menu myaccount = {account} ></Menu>
    </div>)
    );
}