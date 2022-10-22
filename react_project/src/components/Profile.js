import { useState, useEffect } from "react";
import Alert from 'react-bootstrap/Alert'
import { Button } from "react-bootstrap";
import NoPic from '../NoPic.jpg';

const ExtraGas = parseInt(process.env.REACT_APP_EXTRA_AMOUNT) 

function PersonalDetailsShow(props){

    const [First_Name, handleFirstName] = useState("");
    const [Last_Name,  handleLastName]  = useState("");
    const [Picstr,     handlePicstr]    = useState(""); 

    useEffect(() => {
        props.contAbi.methods.Check_My_Info().call({
            from : props.myacc
        })
        .then((r) => {
            // console.log(r);
            handleFirstName(r[0]);
            handleLastName(r[1]);
            handlePicstr(r[2]);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.myacc])

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
                gas: gas + ExtraGas
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    })

    const Backend_url = process.env.REACT_APP_BACKEND_URL;

    const MI = () => {
        props.handleEnquiry(props.productid)
        props.handleNum(1);
    }

    return (<div className="ProductCard">
        <img className="PCI" alt="Product Pic"  src = {ProductImg !== ""?Backend_url+"/show/"+ProductImg:NoPic} ></img>
        <Alert variant="info" className="PCD1" >{ProductName!== ""?ProductName.substring(0, 30):"[Not Available]"}</Alert>
        <Alert variant="info" className="PCD2"> {ProductDesp!== ""?ProductDesp.substring(0, 50) + "...":"[Not Available]"} </Alert>
        <Button variant="success" className="PCD3" onClick = {MI} >More Info</Button>
    </div>)
}

export default function Profile(props){

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
      }, [props.myacc]); 

    return (<div>
        <PersonalDetails myacc = {props.myacc} contAbi = {props.contAbi}  ></PersonalDetails>
        <div className="ProductList">
            {ProdArray.map(e => { 
                return (<ProductCard contAbi = {props.contAbi} productid = {e} 
                    handleEnquiry = {props.handleEnquiry} handleNum = {props.handleNum} ></ProductCard>) 
            })}
        </div>
    </div>)
}