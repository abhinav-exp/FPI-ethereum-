// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
pragma experimental ABIEncoderV2;

contract FPI{
    struct Person{
        string First_Name;
        string Last_Name;
        uint Date;
        string PicId;
    }
    struct Product{
        string Name;
        string Description;
        string[] PicIds;
        address[] Owners;
    }

    mapping(address => Person) public Registered_Persons;
    Product[] public Registered_Products;
    mapping(address => mapping(uint => bool)) public PersonToProduct;

    function addressToString(address _addr) public pure returns(string memory) {
        bytes32 value = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(51);
        str[0] = "0";
        str[1] = "x";
        for (uint i = 0; i < 20; i++) {
            str[2+i*2] = alphabet[uint(uint8(value[i + 12] >> 4))];
            str[3+i*2] = alphabet[uint(uint8(value[i + 12] & 0x0f))];
        }
        return string(str);
    }   

    function Check_My_Info() public view returns (string[3] memory) {
        address addr = msg.sender;
        if(Registered_Persons[addr].Date == 0){
            return ["", "", ""];
        }
        else {
            return [Registered_Persons[addr].First_Name, Registered_Persons[addr].Last_Name, Registered_Persons[addr].PicId];
        }
    }

    function Register_Me(string memory F, string memory L, string memory P) public {
        address addr = msg.sender;
        Registered_Persons[addr] = Person(F, L, block.timestamp, P);
    }

    function Check_Addr_Info(address addr) public view returns (string[3] memory) {
        if(Registered_Persons[addr].Date == 0){
            return ["", "", ""];
        }
        else {
            return [Registered_Persons[addr].First_Name, Registered_Persons[addr].Last_Name, Registered_Persons[addr].PicId];
        }
    }

    function Register_Product(string memory N, string memory D) public {
        string[] memory P;
        address[] memory O = new address[](1);
        O[0] = msg.sender;
        Product memory temp = Product(N, D, P, O);
        Registered_Products.push(temp);
        PersonToProduct[msg.sender][Registered_Products.length - 1] = true;
    }

    function Get_My_Assets_Nos() public view returns (uint[] memory) {
        address addr = msg.sender;
        uint n = 0;
        for(uint i=0; i<Registered_Products.length; i++)
        {
            if(PersonToProduct[addr][i] == true)
            {
                n++;
            }
        }
        uint[] memory ans = new uint[](n);
        uint j = 0;
        for(uint i=0; i<Registered_Products.length; i++)
        {
            if(PersonToProduct[addr][i] == true)
            {
                ans[j] = i;
                j++;
            } 
        }
        return ans;
    }

    function Get_Asset_of_No(uint num) public view returns (string[4] memory){
        Product memory T = Registered_Products[num];
        address lastestOwner = T.Owners[T.Owners.length - 1];
        if(T.PicIds.length == 0){
            return [T.Name, T.Description, "", addressToString(lastestOwner)];
        }
        else{
            return [T.Name, T.Description, T.PicIds[T.PicIds.length - 1], addressToString(lastestOwner)];
        }
    }

    function Transfer_Product(uint ProductNo, address SendTo) public returns(bool) {
        Product memory P = Registered_Products[ProductNo];
        address LastOwner = P.Owners[P.Owners.length - 1];
        if(msg.sender != LastOwner)
            return false;
        delete PersonToProduct[LastOwner][ProductNo];
        Registered_Products[ProductNo].Owners.push(SendTo);
        PersonToProduct[SendTo][ProductNo] = true;
        return true;
    }
}