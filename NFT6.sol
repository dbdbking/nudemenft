// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NUDEMENFT is ERC721Enumerable, Ownable {
  using Strings for uint256;

  string public baseURI;
  string public baseExtension = ".json";
  uint256 public cost = 0.05 ether;
  uint256 public maxSupply = 10000;
  uint256 public maxMintAmount = 20;
  bool public paused = false;
  mapping(address => bool) public whitelisted;
  mapping(uint256 => uint256) public seeds;

  constructor(
      
  ) ERC721("NUDEMENFT", "NUDE") {
    setBaseURI("https://nudemenft.com");
    mint(msg.sender, 10);
  }

  // internal
  function _baseURI() internal view virtual override returns (string memory) {
    return baseURI;
  }

  // public
  function mint(address _to, uint256 _mintAmount) public payable {
    uint256 supply = totalSupply();
    require(!paused);
    require(_mintAmount > 0);
    require(_mintAmount <= maxMintAmount);
    require(supply + _mintAmount <= maxSupply);

    if (msg.sender != owner()) {
        if(whitelisted[msg.sender] != true) {
          require(msg.value >= cost * _mintAmount);
        }
    }

    for (uint256 i = 1; i <= _mintAmount; i++) {
      uint256 tid = supply + i;
      _safeMint(_to, tid);
      seeds[tid] = uint256(keccak256(abi.encodePacked(uint256(bytes32(blockhash(block.number - 1))), tid)));
    }
  }
  

  function walletOfOwner(address _owner)
    public
    view
    returns (uint256[] memory)
  {
    uint256 ownerTokenCount = balanceOf(_owner);
    uint256[] memory tokenIds = new uint256[](ownerTokenCount);
    for (uint256 i; i < ownerTokenCount; i++) {
      tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
    }
    return tokenIds;
  }

  function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override
    returns (string memory)
  {
    require(
      _exists(tokenId),
      "ERC721Metadata: URI query for nonexistent token"
    );


    uint256 seed = seeds[tokenId];

    //string memory currentBaseURI = _baseURI();
    //string memory seed = string(abi.encodePacked(bytes32ToString(seeds[tokenId])));

    return(formatTokenURI(tokenId,seed));

    //return string(abi.encodePacked("tokenID:",tokenId.toString()," seed:", substring(seed.toString(),0,5), currentBaseURI,  baseExtension));
    
    /*
    return bytes(currentBaseURI).length > 0
        ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), baseExtension))
        : "";
        */
  }

  //only owner
  function setCost(uint256 _newCost) public onlyOwner() {
    cost = _newCost;
  }

  function setmaxMintAmount(uint256 _newmaxMintAmount) public onlyOwner() {
    maxMintAmount = _newmaxMintAmount;
  }

  function setBaseURI(string memory _newBaseURI) public onlyOwner {
    baseURI = _newBaseURI;
  }

  function setBaseExtension(string memory _newBaseExtension) public onlyOwner {
    baseExtension = _newBaseExtension;
  }

  function pause(bool _state) public onlyOwner {
    paused = _state;
  }
 
 function whitelistUser(address _user) public onlyOwner {
    whitelisted[_user] = true;
  }
 
  function removeWhitelistUser(address _user) public onlyOwner {
    whitelisted[_user] = false;
  }

  function withdraw() public payable onlyOwner {
    (bool success, ) = payable(msg.sender).call{value: address(this).balance}("");
    require(success);
  }
  
  
  /// helper funcfunction

  //substring function 
  
  function substring(string memory str, uint startIndex, uint endIndex) private pure returns (string memory) {
    bytes memory strBytes = bytes(str);
    bytes memory result = new bytes(endIndex-startIndex);
    for(uint i = startIndex; i < endIndex; i++) {
        result[i-startIndex] = strBytes[i];
    }
    return string(result);
  }
    
    
  function strToUint(string memory _str) private pure returns(uint256 res) {
    for (uint256 i = 0; i < bytes(_str).length; i++) {
        res += (uint8(bytes(_str)[i]) - 48) * 10**(bytes(_str).length - i - 1);
    }
    return (res);
  }


  function formatTokenURI(uint256 tid, uint256 seed) private view returns (string memory) {
        string memory seedStr = seed.toString();
        string memory attrA = substring(seedStr,1,11);
        string memory attrD = substring(seedStr,11,21);
        string memory attrU = substring(seedStr,21,31);
        string memory attrL = substring(seedStr,31,41);
        string memory attrT = substring(seedStr,41,51);
        string memory attrS = substring(seedStr,51,61);
        string memory attrP = substring(seedStr,61,71);
        string memory extURL = string(abi.encodePacked('"external_url":"',baseURI,'/?s=',seed.toString(),'",'));
        string memory aniURL = string(abi.encodePacked('"animation_url":"',baseURI,'/?s=',seed.toString(),'",'));
        string memory imgURL = string(abi.encodePacked('"image":"',baseURI,'/img/',tid.toString(),'.png"'));
        string memory name =string(abi.encodePacked('"name":"Nudemen #',tid.toString()));

        uint256 num;
        
        num = strToUint(attrA);
        if (num>1000000000) attrA= (num%90).toString();
        else attrA= (90+num%21).toString();
        
        num = strToUint(attrD);
        if (num>1000000000) attrD="0";
        else attrD="1";
         
        num = strToUint(attrU);
        if (num>5000000000) attrU= "0";
        else attrU= (1+num%100).toString();
        
        num = strToUint(attrL);
        if (num>5000000000) attrL= "1";
        else attrL= (num%100).toString();
         
        num = strToUint(attrT);
        attrT= (num%10001).toString();

        num = strToUint(attrS);
        if (num>5000000000) attrS= "1";
        else attrS= (num%100).toString();
        
        num = strToUint(attrP);
        if (num>5000000000) attrP= "4";
        else attrP= (5+num%5).toString();
        

        return string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    encode(
                        bytes(
                            abi.encodePacked(
                            '{',name,'","description":"xxx","attributes":[{"trait_type":"A","value":"',
                            attrA,'"},{"trait_type":"D","value":"',
                            attrD,'"},{"trait_type":"U","value":"',
                            attrU,'"},{"trait_type":"L","value":"',
                            attrL,'"},{"trait_type":"T","value":"',
                            attrT,'"},{"trait_type":"S","value":"',
                            attrS,'"},{"trait_type":"P","value":"',
                            attrP,'"}],',extURL,aniURL,imgURL,'}'
                            )
                        )
                    )
                )
            );
    }

    string internal constant TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    
    function encode(bytes memory data) internal pure returns (string memory) {
        if (data.length == 0) return '';
        
        // load the table into memory
        string memory table = TABLE;

        // multiply by 4/3 rounded up
        uint256 encodedLen = 4 * ((data.length + 2) / 3);

        // add some extra buffer at the end required for the writing
        string memory result = new string(encodedLen + 32);

        assembly {
            // set the actual output length
            mstore(result, encodedLen)
            
            // prepare the lookup table
            let tablePtr := add(table, 1)
            
            // input ptr
            let dataPtr := data
            let endPtr := add(dataPtr, mload(data))
            
            // result ptr, jump over length
            let resultPtr := add(result, 32)
            
            // run over the input, 3 bytes at a time
            for {} lt(dataPtr, endPtr) {}
            {
               dataPtr := add(dataPtr, 3)
               
               // read 3 bytes
               let input := mload(dataPtr)
               
               // write 4 characters
               mstore(resultPtr, shl(248, mload(add(tablePtr, and(shr(18, input), 0x3F)))))
               resultPtr := add(resultPtr, 1)
               mstore(resultPtr, shl(248, mload(add(tablePtr, and(shr(12, input), 0x3F)))))
               resultPtr := add(resultPtr, 1)
               mstore(resultPtr, shl(248, mload(add(tablePtr, and(shr( 6, input), 0x3F)))))
               resultPtr := add(resultPtr, 1)
               mstore(resultPtr, shl(248, mload(add(tablePtr, and(        input,  0x3F)))))
               resultPtr := add(resultPtr, 1)
            }
            
            // padding with '='
            switch mod(mload(data), 3)
            case 1 { mstore(sub(resultPtr, 2), shl(240, 0x3d3d)) }
            case 2 { mstore(sub(resultPtr, 1), shl(248, 0x3d)) }
        }
        
        return result;
    }

}