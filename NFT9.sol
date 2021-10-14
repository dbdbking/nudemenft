// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import 'base64-sol/base64.sol';

contract NUDEMENFT is ERC721Enumerable, Ownable {
  using Strings for uint256;

  string public baseURI="https://nudemenft.com";
  string public baseAniURI = "https://nudemenft.com";
  uint256 public cost = 0.05 ether;
  uint256 public maxSupply = 9999;
  uint256 public maxMintAmount = 10;
  bool public paused = false;
  mapping(address => bool) public whitelisted;
  mapping(uint256 => uint256) public seeds;

  constructor() ERC721("NUDEMENFT", "NUDE") {
    mint(msg.sender, 10);
  }

  // internal
  function _baseURI() internal view virtual override returns (string memory) {
    return baseURI;
  }

  // public
  function mint(address _to, uint256 _mintAmount) public payable {
    uint256 supply = totalSupply();
    require(!paused,"Minting Paused");
    require(_mintAmount > 0);
    require(_mintAmount <= maxMintAmount,"Max Mint/Tx Exceeded");
    require(supply + _mintAmount <= maxSupply,"Not Enough Supply");

    if (msg.sender != owner()) {
        if(whitelisted[msg.sender] != true) {
          require(msg.value >= cost * _mintAmount,"Ether Not Enough");
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
  
  function walletDetailsOfOwner(address _owner)
    public
    view
    returns (uint256[] memory, uint256[] memory)
  {
    uint256 ownerTokenCount = balanceOf(_owner);
    uint256[] memory tokenIds = new uint256[](ownerTokenCount);
    uint256[] memory s = new uint256[](ownerTokenCount);
    for (uint256 i; i < ownerTokenCount; i++) {
      tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
      s[i] = seeds[tokenIds[i]];
    }
    return (tokenIds, s);
  }
  
  function contractURI() public view returns (string memory) {
        return string(abi.encodePacked(baseURI, "/metadata.json"));
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

    return(formatTokenURI(tokenId,seeds[tokenId]));

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

  function setBaseAniURI(string memory _newBaseAniURI) public onlyOwner {
    baseAniURI = _newBaseAniURI;
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
        string memory aniURL = string(abi.encodePacked('"animation_url":"',baseAniURI,'/?s=',seed.toString(),'",'));
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
        if (num>5000000000) attrL= "100";
        else attrL= (num%100).toString();
         
        num = strToUint(attrT);
        attrT= (num%10001).toString();

        num = strToUint(attrS);
        if (num>5000000000) attrS= "100";
        else attrS= (num%100).toString();
        
        num = strToUint(attrP);
        if (num>5000000000) attrP= "4";
        else attrP= (5+num%5).toString();
        

        return string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
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
}