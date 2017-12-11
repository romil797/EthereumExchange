pragma solidity ^0.4.4;

contract QuestionPurchase {

    struct questionBundle{
        uint[] questionAccess;
    }

    mapping(address => questionBundle) questionList;



function purchase(uint questionId) public returns (uint) {

  questionList[msg.sender].questionAccess.push(questionId);

  return questionId;
}


//distributes token
//Retrieving the adopters
    //broken
function getQuestionLength() constant returns (uint) {
  return questionList[msg.sender].questionAccess.length;
}

function getQuestionAtIndex(uint index) constant returns (uint){
    return questionList[msg.sender].questionAccess[index];
}


}