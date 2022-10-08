import { Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import Web3 from 'web3';
import { FPIAbi } from "../abi/abis";
import NoPic from '../NoPic.jpg';
import axios from "axios";

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
    const [ProductPic,  handleProductPic]  = useState();
    
    const Backend_url = process.env.REACT_APP_BACKEND_URL;

    const handleClick = () =>{

        console.log(ProductPic);
        var formData = new FormData();
        console.log(Object.fromEntries(formData))
        formData.append("FK", ProductPic);
        console.log(Object.fromEntries(formData))
        fetch(
			Backend_url + "/add",
			{
				method: 'POST',
				body: formData,
			}
		).then(r => {
            if(r.ok){
                r.text().then(a => {
                    console.log(a)
                    props.contAbi.methods.Register_Product(ProductName, ProductDesp, a).estimateGas()
                    .then(gas => {
                        console.log(gas);
                        console.log(props.myacc)
                        console.log(ProductName)
                        console.log(ProductDesp)
                        console.log(a);
                        props.contAbi.methods.Register_Product(ProductName, ProductDesp, a).send({
                            from: props.myacc,
                            gas: gas + 1000000
                        }).then(r => {
                            console.log("product registered");
                        }).catch(r => {
                            console.log(r);
                        })
                    });
                })
            }
        })

    }

    const fun = (e) => {
        console.log(e.target.files[0]);
        handleProductPic(e.target.files[0])
    }

    return (<div className="qweForm"> 
        <input type="text" className="qwe" placeholder="Product Name" value = {ProductName}  onChange={(e) => handleProductName(e.target.value)}></input>
        <br></br>
        <textarea type="text" className="qwe2" placeholder="Product Desp" onChange={(e) => handleProductDesp(e.target.value)}></textarea>
        <br></br>
        <input type="file" className="qwe3" onChange={(e) => fun(e)} ></input>
        <br></br>
        <Button className="qwe4"  variant="success"  onClick={handleClick} > Submit </Button>
    </div>)
}

export default function Menu(props){

    const [num, handleNum] = useState(0);

    const web3 = new Web3(Web3.givenProvider);
    const contAddr = process.env.REACT_APP_CONTRACT_ADDR;
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