import { Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import Web3 from 'web3';
import { FPIAbi } from "../abi/abis";
import NoPic from '../NoPic.jpg';

function NotRegistered(){
    return (<div className="PersonalDetails">
        <img src={NoPic} />
        <Button variant="light" disabled={true} > Not Registered </Button>
        <Button variant="warning">Register</Button>
    </div>)
} 

function ProductCard(props){

    const [ProductName, handleProductName] = useState("");
    const [ProductDesp, handleProductDesp] = useState("");

    useEffect(() => {
        props.contAbi.methods.Get_Asset_of_No(props.productid).call()
        .then(r => {
            console.log(r);
        })
    }, [])

    return (<div className="ProductCard"> r </div>)
}

function Profile(props){

    const [First_Name, handleFirstName] = useState("");
    const [Last_Name,  handleLastName]  = useState("");
    const [Picstr,     handlePicstr]    = useState("");  
    const [ProdArray, handleProdArray] = useState([]);

    useEffect(() => {
        //Runs only on the first render
        props.contAbi.methods.Check_My_Info().call({
            from : props.myacc
        })
        .then((r) => {
            console.log(r);
            handleFirstName(r[0]);
            handleLastName(r[1]);
            handlePicstr(r[2]);
        })
        props.contAbi.methods.Get_My_Assets_Nos().call({
            from : props.myacc
        })
        .then((r) => {
            handleProdArray(r);
            console.log(r);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []); 

    return (<div>
        <NotRegistered></NotRegistered>
        <div className="ProductList">
            {ProdArray.map(e => { 
                return (<ProductCard contAbi = {props.contAbi} productid = {e} ></ProductCard>) 
            })}
        </div>
    </div>)
}

function InfoAsset(){
    return (<div>Info Asset</div>)
}

function RegisterProduct(props){
    const [ProductName, handleProductName] = useState("");
    const [ProductDesp, handleProductDesp] = useState("");
    
    const handleClick = () =>{
        
        props.contAbi.methods.Register_Product(ProductName, ProductDesp).estimateGas()
        .then(gas => {
            console.log(gas);
            console.log(props.myacc)
            props.contAbi.methods.Register_Product(ProductName, ProductDesp).send({
                from: props.myacc,
                gas: gas + 1000000
            }).then(r => {
                console.log("product registered");
            }).catch(r => {
                console.log(r);
            })
        });

    }

    return (<div> 
        <input type="text" placeholder="Product Name" value = {ProductName}  onChange={(e) => handleProductName(e.target.value)}></input>
        <br></br>
        <textarea type="text" placeholder="Product Desp" onChange={(e) => handleProductDesp(e.target.value)}></textarea>
        <br></br>
        <Button variant="success"  onClick={handleClick} > Submit </Button>
    </div>)
}

export default function Menu(props){

    const [num, handleNum] = useState(0);

    const web3 = new Web3(Web3.givenProvider);
    const contAddr = '0x45b041bF33a86DcBE092FD50aa68216F1E3Afc16';
    const FPIContract = new web3.eth.Contract(FPIAbi, contAddr);

    const V = [
        <Profile         myacc = {props.myaccount} contAbi = {FPIContract} ></Profile>, 
        <InfoAsset></InfoAsset>, 
        <RegisterProduct myacc = {props.myaccount} contAbi = {FPIContract} ></RegisterProduct>
    ]

    return (<div className="Menu">
        <Button variant={(num === 0)? "primary" : "light"} className="perc30" onClick={() => handleNum(0)}> Profile </Button>
        <Button variant={(num === 1)? "primary" : "light"} className="perc30" onClick={() => handleNum(1)}> Info Asset </Button>
        <Button variant={(num === 2)? "primary" : "light"} className="perc30" onClick={() => handleNum(2)}> Register Product </Button>
        {V[num]}
    </div>);
}