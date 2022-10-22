import { Button } from "react-bootstrap";
import { useState } from "react";
import Web3 from 'web3';
import { FPIAbi } from "../abi/abis";
import Alert from 'react-bootstrap/Alert'
import Profile from "./Profile";
import InfoAsset from "./InfoAsset";

const ExtraGas = parseInt(process.env.REACT_APP_EXTRA_AMOUNT) 

function RegisterProduct(props){
    const [ProductName, handleProductName] = useState("");
    const [ProductDesp, handleProductDesp] = useState("");
    const [ProductPic,  handleProductPic]  = useState();

    const [DisBool, handleDisBool] = useState(false);
    const [InfoTxn, handleInfoTxn] = useState("");
    
    const Backend_url = process.env.REACT_APP_BACKEND_URL;

    const makeTxn = (Name, Desp, Pic) => {
        handleInfoTxn("making Transaction")
        props.contAbi.methods.Register_Product(Name, Desp, Pic).estimateGas()
        .then(gas => {
            props.contAbi.methods.Register_Product(ProductName, ProductDesp, Pic).send({
                from: props.myacc,
                gas: gas + ExtraGas
            }).then(r => {
                handleInfoTxn("Transaction Successful")
            }).catch(r => {
                handleInfoTxn("Tranaction Failed")
                handleDisBool(false)
            })
        });
    }

    const handleClick = () =>{
        handleDisBool(true);
        handleInfoTxn("Loading ... ")
        if(ProductPic === undefined)
        {
            makeTxn(ProductName, ProductDesp, "");
        }
        else
        {
            var formData = new FormData();
            formData.append("FK", ProductPic);
            fetch(
                Backend_url + "/add",
                {
                    method: 'POST',
                    body: formData,
                }
            ).then(r => {
                if(r.ok){
                    r.text().then(a => {
                        makeTxn(ProductName, ProductDesp, a);
                    })
                }
                handleInfoTxn("Error while uploading Image");
            })
        }

    }

    const fun = (e) => {
        console.log(e.target.files[0]);
        handleProductPic(e.target.files[0])
    }

    return (<form className="qweForm"> 
        <input type="text" className="qwe" placeholder="Product Name" onChange={(e) => handleProductName(e.target.value)} required></input>
        <br></br>
        <textarea type="text" className="qwe2" placeholder="Product Desp" onChange={(e) => handleProductDesp(e.target.value)}></textarea>
        <br></br>
        <input type="file" className="qwe3" onChange={(e) => fun(e)} ></input>
        <br></br>
        <Button className="qwe4" type="submit"  variant="success" disabled={DisBool} onClick={handleClick} > Submit </Button>

        <Alert className="qwe5" hidden = {(InfoTxn === "")}>{InfoTxn}</Alert>
    </form>)
}

export default function Menu(props){

    const [num, handleNum] = useState(0);
    const [enquiry, handleEnquiry] = useState(0);

    const web3 = new Web3(Web3.givenProvider);
    const contAddr = process.env.REACT_APP_CONTRACT_ADDR;
    const FPIContract = new web3.eth.Contract(FPIAbi, contAddr);

    const V = [
        <Profile         myacc = {props.myaccount} contAbi = {FPIContract} 
            handleEnquiry = {handleEnquiry} handleNum = {handleNum} ></Profile>, 
        <InfoAsset       myacc = {props.myaccount} contAbi = {FPIContract} 
            enquiry = {enquiry} handleEnquiry = {handleEnquiry} ></InfoAsset>, 
        <RegisterProduct myacc = {props.myaccount} contAbi = {FPIContract} ></RegisterProduct>
    ]

    return (<div className="Menu">
        <Button variant={(num === 0)? "primary" : "light"} className="perc30" onClick={() => handleNum(0)}> Profile </Button>
        <Button variant={(num === 1)? "primary" : "light"} className="perc30" onClick={() => handleNum(1)}> Info Asset </Button>
        <Button variant={(num === 2)? "primary" : "light"} className="perc30" onClick={() => handleNum(2)}> Register Product </Button>
        {V[num]}
    </div>);
}