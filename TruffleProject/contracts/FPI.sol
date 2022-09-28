pragma solidity ^0.5.0;

contract FPI{
    struct Person{
        string First_Name;
        string Last_Name;
        uint Date;
    }
    struct Product{
        string Name;
        string Description;
        string[] PicIds;
        address[] Owners;
    }

    mapping(address => Person) Registered_Persons;
    Product[] Registered_Products;
    mapping(uint => uint[]) PersonToProduct;

    function Register_User()
    {

    }

    function Register_Product()
    {

    }

    function Transfer_Product()
    {

    }

    function Enquiry_Product()
    {

    }

}