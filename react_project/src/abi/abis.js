export const FPIAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "PersonToProduct",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "Registered_Persons",
    "outputs": [
      {
        "internalType": "string",
        "name": "First_Name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "Last_Name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "Date",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "PicId",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "Registered_Products",
    "outputs": [
      {
        "internalType": "string",
        "name": "Name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "Description",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_addr",
        "type": "address"
      }
    ],
    "name": "addressToString",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "pure",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "Check_My_Info",
    "outputs": [
      {
        "internalType": "string[3]",
        "name": "",
        "type": "string[3]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "F",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "L",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "P",
        "type": "string"
      }
    ],
    "name": "Register_Me",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "addr",
        "type": "address"
      }
    ],
    "name": "Check_Addr_Info",
    "outputs": [
      {
        "internalType": "string[3]",
        "name": "",
        "type": "string[3]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "N",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "D",
        "type": "string"
      }
    ],
    "name": "Register_Product",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "Get_My_Assets_Nos",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "num",
        "type": "uint256"
      }
    ],
    "name": "Get_Asset_of_No",
    "outputs": [
      {
        "internalType": "string[4]",
        "name": "",
        "type": "string[4]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "ProductNo",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "SendTo",
        "type": "address"
      }
    ],
    "name": "Transfer_Product",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]