import { Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import Web3 from 'web3';
import { FPIAbi } from "../abi/abis";
import NoPic from '../NoPic.jpg';
import Alert from 'react-bootstrap/Alert'

function PersonalDetailsShow(props){

    const [First_Name, handleFirstName] = useState("");
    const [Last_Name,  handleLastName]  = useState("");
    const [Picstr,     handlePicstr]    = useState(""); 

    useEffect(() => {
        props.contAbi.methods.Check_My_Info().call({
            from : props.myacc
        })
        .then((r) => {
            console.log(r);
            handleFirstName(r[0]);
            handleLastName(r[1]);
            handlePicstr(r[2]);
        })
    })

    const Backend_url = process.env.REACT_APP_BACKEND_URL;

    const fun = () => {
        props.handleEditMode(true);
    }

    return (<div className="PersonalDetails">
        <img className="MN" src={Picstr === "" ? NoPic : Backend_url + "/show/" + Picstr} alt="Profile Pic" />
        <div className="MN2">
            <Button variant="light" disabled={true} className="NM" > {First_Name === "" ? "[Not Avaliable]" : First_Name} </Button>
            <Button variant="light" disabled={true} className="NM" > {Last_Name === "" ? "[Not Avaliable]" : Last_Name} </Button>
            <br></br>
            <Button variant="warning" className="NMR" onClick={fun} >Edit Profile</Button>
        </div>
    </div>)
}

function PersonalDetailsEdit(props){

    const [First_Name, handleFirstName] = useState("");
    const [Last_Name,  handleLastName]  = useState("");
    const [Picstr,     handlePicstr]    = useState();
    const [SubBool,    handleSubBool]   = useState(false);
    const [SubText,    handleSubText]   = useState("Submit")

    const makeTxn = (F, L, P) => {
        props.contAbi.methods.Register_Me(F, L, P).estimateGas()
        .then(gas => {
            console.log(props.myacc)
            props.contAbi.methods.Register_Me(F, L, P).send({
                from: props.myacc,
                gas: gas + 1000000
            })
            .then(e => {
                props.handleEditMode(false);
            })
            .catch(e => {
                handleSubText("Try Again");
                handleSubBool(false)
            })
        })
    }

    const Backend_url = process.env.REACT_APP_BACKEND_URL;

    const fun = () => {
        handleSubBool(true)
        if(Picstr === undefined){
            makeTxn(First_Name, Last_Name, "");
        }
        else{
            var formData = new FormData();
            formData.append("FK", Picstr);
            fetch(
                Backend_url + "/add",
                {
                    method: 'POST',
                    body: formData,
                }
            ).then(r => {
                if(r.ok){
                    r.text().then(a => {
                        makeTxn(First_Name, Last_Name, a);
                    })
                }
            })
        }
    }

    return (<div className="PersonalDetails">
    <input className="MN" type="file" onChange={e => handlePicstr(e.target.files[0])} ></input>
    <div className="MN2">
        <input className="NM" placeholder="First Name" onChange={e => handleFirstName(e.target.value)} ></input> 
        <input className="NM" placeholder="Last Name" onChange={e => handleLastName(e.target.value)}  ></input> 
        <br></br>
        <Button variant="warning" className="NMR" onClick={fun} disabled={SubBool} >{SubText}</Button>
    </div>
</div>)
}

function PersonalDetails(props){

    const [EditMode, handleEditMode] = useState(false);

    return (!EditMode?
        <PersonalDetailsShow myacc = {props.myacc} contAbi = {props.contAbi} handleEditMode = {handleEditMode} />:
        <PersonalDetailsEdit myacc = {props.myacc} contAbi = {props.contAbi} handleEditMode = {handleEditMode} />)
} 

function ProductCard(props){

    const [ProductName, handleProductName] = useState("");
    const [ProductDesp, handleProductDesp] = useState("");
    const [ProductImg,  handleProductImg] = useState("");

    useEffect(() => {
        props.contAbi.methods.Get_Asset_of_No(props.productid).call()
        .then(r => {
            handleProductName(r[0]);
            handleProductDesp(r[1]);
            handleProductImg(r[2]);
        })
    }, [])

    const Backend_url = process.env.REACT_APP_BACKEND_URL;

    return (<div className="ProductCard">
        <img className="PCI" alt="Product Pic"  src = {ProductImg !== ""?Backend_url+"/show/"+ProductImg:NoPic} ></img>
        <Alert variant="info" className="PCD1" >{ProductName!== ""?ProductName:"[Not Available]"}</Alert>
        <Alert variant="info" className="PCD2"> {ProductDesp!== ""?ProductDesp.substring(0, 50) + "...":"[Not Available]"} </Alert>
        <Button variant="success" className="PCD3" >More Info</Button>
    </div>)
}

function Profile(props){

     
    const [ProdArray, handleProdArray] = useState([]);

    useEffect(() => {
        //Runs only on the first render
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
        <PersonalDetails myacc = {props.myacc} contAbi = {props.contAbi}  ></PersonalDetails>
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

    const [DisBool, handleDisBool] = useState(false);
    const [InfoTxn, handleInfoTxn] = useState("");
    
    const Backend_url = process.env.REACT_APP_BACKEND_URL;

    const makeTxn = (Name, Desp, Pic) => {
        handleInfoTxn("making Transaction")
        props.contAbi.methods.Register_Product(Name, Desp, Pic).estimateGas()
        .then(gas => {
            props.contAbi.methods.Register_Product(ProductName, ProductDesp, Pic).send({
                from: props.myacc,
                gas: gas + 1000000
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