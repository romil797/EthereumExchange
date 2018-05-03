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

function reviewQuestions(uint[] helpful) public returns (uint) {
	uint[] memory expired;
	uint j = 0;
	for (uint i = 0; i < questionList[msg.sender].timeAccess.length; i++) {
	    if (questionList[msg.sender].timeAccess[i] <= now) {
  			expired[j] = i;
			j += 1;
		}
	}
	uint[] memory newQuestionAc;
	uint[] memory newTimeAc;
	//j = 0;
	//for (i = 0; i < questionList[msg.sender].timeAccess.length; i++) {
	    //if (questionList[msg.sender].timeAccess[i] > now) {
  			//questionList[msg.sender].questionAccess[j] = questionList[msg.sender].questionAccess[i];
			//questionList[msg.sender].timeAccess[j] = questionList[msg.sender].timeAccess[i];
		//	j += 1;
		//}
	//}
	questionList[msg.sender].questionAccess.length = 0;
	questionList[msg.sender].timeAccess.length = 0;
	return 0;

}

//distributes token
//Retrieving the questions
    //broken
function getQuestionLength() constant returns (uint) {
  return questionList[msg.sender].questionAccess.length;
}

function getQuestionAtIndex(uint index) constant returns (uint, uint){
    return (questionList[msg.sender].questionAccess[index], questionList[msg.sender].timeAccess[index]);
}

function getTimeAtIndex(uint index) constant returns (uint){
    return questionList[msg.sender].timeAccess[index];
}

}