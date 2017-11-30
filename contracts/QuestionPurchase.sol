pragma solidity ^0.4.4;

contract QuestionPurchase {
	address[16] public purchasers;
	// Adopting a pet
function purchase(uint questionId) public returns (uint) {
  require(questionId >= 0 && questionId <= 15);

  purchasers[questionId] = msg.sender;

  return questionId;
}

// Retrieving the adopters
function getPurchasers() public returns (address[16]) {
  return purchasers;
}


}