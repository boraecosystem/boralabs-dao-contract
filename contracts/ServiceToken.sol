// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.1)

pragma solidity ^0.8.9;
 
// yarn
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract ServiceToken is ERC20, ReentrancyGuard, Ownable {

    uint256 public constant MINT_AMOUNT = 20 ether; // 20 ETH worth of tokens

    // Mapping to track the last mint time for each address
    mapping(address => uint256) public lastMintTime;

    constructor() ERC20("PLUS", "PLUS") {}

    // =========================================================================================== //
    // MINT
    // =========================================================================================== //
    function mint() external {
        require(block.timestamp >= lastMintTime[msg.sender] + 1 days, "Minting can only occur once a day");

        _mint(msg.sender, MINT_AMOUNT);
        lastMintTime[msg.sender] = block.timestamp;
    }

    function _mint(address account, uint256 amount) internal virtual override nonReentrant {
        super._mint(account, amount);
        emit SupplyChanged(_msgSender(), "MINT", account, amount, totalSupply());
    }

    // =========================================================================================== //
    // BURN
    // =========================================================================================== //
    function burn(uint256 amount) public {
        _burn(_msgSender(), amount);
    }

    function burnFrom(address account, uint256 amount) public {
        _spendAllowance(account, _msgSender(), amount);
        _burn(account, amount);
    }

    function _burn(address account, uint256 amount) internal virtual override onlyOwner {
        super._burn(account, amount);
        emit SupplyChanged(_msgSender(), "BURN", account, amount, totalSupply());
    }


    // owner
    function owner() public view virtual override returns (address){
        return super.owner();
    }

    event SupplyChanged(address indexed operator, string indexed cmdType, address indexed to, uint256 amount, uint256 afterTotalSupply);
}
