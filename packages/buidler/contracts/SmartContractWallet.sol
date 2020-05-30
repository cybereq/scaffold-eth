pragma solidity >=0.6.0 <0.7.0;

import "@nomiclabs/buidler/console.sol";

contract SmartContractWallet {

  address public owner;

  constructor(address _owner) public {
    owner = _owner;
    console.log("Smart Contract Wallet is owned by:",owner);
  }

  function withdraw() public {
    require(msg.sender==owner,"NOT THE OWNER!");
    console.log(msg.sender,"withdraws",(address(this)).balance);
    msg.sender.transfer((address(this)).balance);
  }

  function isOwner(address possibleOwner) public view returns (bool) {
  	return (possibleOwner==owner);
 }
  function updateOwner(address newOwner) public {
	  require(isOwner(msg.sender),"NOT THE OWNER!");
  	  owner = newOwner;
 }


 /*
	The “fallback” function gets called automatically whenever someone 
	interacts with our contract without specifying a function name to call. 
	For example, if they just send ETH directly to the contract address.

	Also, this is programmable money, let’s add some code to limit the amount of 
	total ETH to 0.005 ($1.00 at today’s price) just to be sure no one puts 
	a million dollars in our unaudited contract.

 **/

	uint constant public limit = 0.005 * 10**18;

  /*
    Notice how we have valuable feedback in the frontend with the message 
	from the second argument of the require() statement in our smart contract. 
	Use this to help you debug your smart contract along with the 
	console.log that shows up in your blockchain terminal:
  **/

	fallback() external payable {
    	require(((address(this)).balance) <= limit, "WALLET LIMIT REACHED");
    	console.log(msg.sender,"just deposited",msg.value);
}

/*
	Notice how we multiply by 10¹⁸ ? Solidity doesn’t support 
	floating points so everything is an integer. 1 ETH equals 10¹⁸ wei. 
	Further, if you send a transaction with the value 1, that means 1 wei, 
	the smallest possible unit in Ethereum. 

	

**/
	mapping(address => bool) public friends;

/*
	We want to keep track of friends’ addresses that are allowed 
	to interact with our contract. We use a mapping to store balances. 
	We can’t iterate over all the friends inside the contract but it allows 
	us quick read and write access to a bool for any given address. 

**/
	
	function updateFriend(address friendAddress, bool isFriend) public {
	 	require(isOwner(msg.sender),"NOT THE OWNER!");
	 	friends[friendAddress] = isFriend;
	 	console.log(friendAddress,"friend bool set to",isFriend);

	 	emit UpdateFriend(msg.sender,friendAddress,isFriend);
}
	event UpdateFriend(address sender, address friend, bool isFriend);
/*


	Notice how we are reusing a specific line of code that requires the 
	msg.sender is the owner? You could clean this up using a modifier. 
	Then, every time you need a function that can only be run by the owner 
	you can add an onlyOwner modifier to the function instead of this line. 
	(totally optional)


	If somehow we lost the private key for the owner and now we are locked 
	out of our smart contract wallet. We need to have one of our friends 
	trigger some kind of recovery.
	
	We also need to be sure that if a friend accidentally (or maliciously 😏) 
	triggers the recovery and we still have access to the owner account we can 
	cancel the recovery within some timeDelay in seconds.

**/
	uint public timeToRecover = 0;
	uint constant public timeDelay = 1440; //seconds
	address public recoveryAddress;

// 	Give the owner the ability to set the recoveryAddress:
	
	function setRecoveryAddress(address _recoveryAddress) public {
	  require(isOwner(msg.sender),"NOT THE OWNER!");
	  console.log(msg.sender,"set the recoveryAddress to",recoveryAddress);
	  recoveryAddress = _recoveryAddress;
		}

// 	Here we add a function for our friends to call to help us recover our funds:
	
	function friendRecover() public {
	  require(friends[msg.sender],"NOT A FRIEND");
	  timeToRecover = block.timestamp + timeDelay;
	  console.log(msg.sender,"triggered recovery",timeToRecover,recoveryAddress);
		}
/* 	If friendRecover() is accidentally triggered, we want our owner to be able to 
	cancel the recovery:

**/

	function cancelRecover() public {
	  require(isOwner(msg.sender),"NOT THE OWNER");
	  timeToRecover = 0;
	  console.log(msg.sender,"canceled recovery");
		}
	/* Finally, if we are in recovery mode and enough time has passed, 
	   anyone can destroy our contract and send all its ether to the
	   recoveryAddress.

**/
	function recover() public {
	  require(timeToRecover>0 && timeToRecover<block.timestamp,"NOT EXPIRED");
	  console.log(msg.sender,"triggered recover");
	  selfdestruct(payable(recoveryAddress));
		}

/* 
	Selfdestruct() will remove our proxy smart contract 
	from the blockchain and return all funds to the recoveryAddress.
	Warning, a smart contract with an owner that can call selfdestruct() at 
	any time really isn’t “decentralized”. Developers should be very mindful 
	about building mechanisms that no individual or organization can control 
	or censor.
**/



}
