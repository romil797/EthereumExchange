pragma solidity ^0.4.4;

contract QuestionPurchase {

    struct questionBundle{
        uint[] questionAccess;
		uint[] timeAccess;
    }

    mapping(address => questionBundle) questionList;

function purchase(uint questionId, uint qdate) public returns (uint) {
  for (uint i = 0; i < questionList[msg.sender].timeAccess.length; i++) {
    if (questionList[msg.sender].timeAccess[i] < now) {
  	  return 0;
	 }
  }
  questionList[msg.sender].questionAccess.push(questionId);
  questionList[msg.sender].timeAccess.push(qdate);
  return questionId;
}


//distributes token
//Retrieving the questions
    //broken
function getQuestionLength() constant returns (uint) {
  return questionList[msg.sender].questionAccess.length;
}

function getQuestionAtIndex(uint index) constant returns (uint){
    return questionList[msg.sender].questionAccess[index];
}

function getTimeAtIndex(uint index) constant returns (uint){
    return questionList[msg.sender].timeAccess[index];
}

}