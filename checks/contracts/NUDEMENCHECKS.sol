// SPDX-License-Identifier: MIT
// Nudemen Checks 
// K10

pragma solidity 0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import 'base64-sol/base64.sol';

contract NUDEMENFT {
     function walletOfOwner(address _owner) public view returns (uint256[] memory) {}
}

contract NUDEMENCHECKS is ERC721Enumerable, Ownable {
  using Strings for uint256;
  using Counters for Counters.Counter;
  string public baseURI="https://nudemenft.com/checks";
  string public baseAniURI = "ipfs://QmRZdvzxow4BHEJGkXnCWYttStsMK6AWzDJ4cLB2Ggg7Uh";  //update
  uint256 public cost = 0.05 ether;
  uint256 public maxSupply = 999;
  uint256 public maxMintPerTx = 10;
  bool public paused = true;
  mapping(uint256 => uint256) public seeds;
  mapping(uint256 => uint256) public claimed;
  Counters.Counter private supply;
  NUDEMENFT nmnft;
  
  constructor() ERC721("NUDEMENCHECKS", "NUDECKS") {
    privateMint(10,msg.sender);
    nmnft = NUDEMENFT(0x32A5C961ed3b41F512952C5Bb824B292B4444dD6); //update
  }
  
  function claim(uint256 nudemeNFT_id) public{
      require(!paused,"Minting Paused");
      require(!claimed[nudemeNFT_id],"Token already claimed");
      uint256[] memory tids=nmnft.walletOfOwner(msg.sender);
      bool hasToken = false;
    
      for (uint i=0; i < tids.length; i++) {
         if (nudemeNFT_id == tids[i]) {
            hasToken = true;
         }
      }
      require(hasToken, "NudemeNFT not found in your wallet");

      _mintCore(msg.sender,1);
      claimed[nudemeNFT_id]=1;
  }
  
  
  function mint(uint256 _mintAmount) public payable{
    require(!paused,"Mint Paused");
    require(msg.value >= cost * _mintAmount,"Insufficient fund");
    _mintCore(msg.sender,_mintAmount);

  }

 function check(uint256 nudemeNFT_id) public {
    return(claimed[nudemeNFT_id]);
 } 
  

 function privateMint(uint256 _mintAmount, address _receiver) public onlyOwner {
    _mintCore(_receiver,_mintAmount);
  }

  modifier mintMod(uint256 _mintAmount) {
    require(_mintAmount > 0 && _mintAmount <= maxMintPerTx, "Mint amount exceeded");
    require(supply.current()+ _mintAmount <= maxSupply,"Max NFT supply exceeded");
    _;
  }

 function _mintCore(address _receiver, uint256 _mintAmount) internal mintMod(_mintAmount){
     for (uint256 i = 1; i <= _mintAmount; i++) {
      supply.increment();
      uint256 tid = supply.current();
      _safeMint(_receiver, tid);
      seeds[tid] = uint256(keccak256(abi.encodePacked(uint256(bytes32(blockhash(block.number - 1))), tid)));
    }
  }


  function walletOfOwner(address _owner) public view returns (uint256[] memory)
  {
    uint256 ownerTokenCount = balanceOf(_owner);
    uint256[] memory tokenIds = new uint256[](ownerTokenCount);
    for (uint256 i; i < ownerTokenCount; i++) {
      tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
    }
    return tokenIds;
  }
  
  function walletDetailsOfOwner(address _owner) public view returns (uint256[] memory, uint256[] memory)
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

  function tokenURI(uint256 tokenId) public view virtual override returns (string memory)
  {
    require(
      _exists(tokenId),
      "URI query for nonexistent token"
    );

    return(formatTokenURI(tokenId,seeds[tokenId]));

  }
  
  function tokenAniURI(uint256 tokenId) public view returns (string memory)
  {
    require(
      _exists(tokenId),
      "URI query for nonexistent token"
    );
    return string(abi.encodePacked(baseAniURI,'/?s=',seeds[tokenId].toString()));
  }

  function totalSupply() public view returns (uint256) {
    return supply.current();
  }

  function setCost(uint256 _newCost) public onlyOwner() {
    cost = _newCost;
  }

  function setMaxMintPerTx(uint256 _new) public onlyOwner() {
    maxMintPerTx = _new;
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

  function withdraw() public payable onlyOwner {
    (bool success, ) = payable(msg.sender).call{value: address(this).balance}("");
    require(success);
  }
  
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
        if (num>500000000) attrA= (num%6).toString();
        else attrA= "10"; //pepe

        num = strToUint(attrD);
        if (num>1000000000) attrD="0";
        else attrD="1";
        
        num = strToUint(attrU);
        attrU= (num%101).toString();
        
        num = strToUint(attrL);
        if (num>7000000000) attrL= "100";
        else attrL= (num%100).toString();
         
        num = strToUint(attrT);
        attrT= (num%10001).toString();

        num = strToUint(attrS);
        if (num>7000000000) attrS= "100";
        else attrS= (num%100).toString();
        
        num = strToUint(attrP);
        if (num>7000000000) attrP= "4";
        else attrP= (5+num%5).toString();
        

        return string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                            '{',name,'","description":"Nudemen Checks","attributes":[{"trait_type":"Artwork","value":"',
                            attrA,'"},{"trait_type":"Dimness","value":"',
                            attrD,'"},{"trait_type":"Uniformity","value":',
                            attrU,'},{"trait_type":"Laziness","value":',
                            attrL,'},{"trait_type":"Timing","value":',
                            attrT,'},{"trait_type":"Spacing","value":",
                            attrS,'},{"trait_type":"Posture","value":"',
                            attrP,'"}],',extURL,aniURL,imgURL,'}'
                            )
                        )
                    )
                )
            );
  }
}
//end
