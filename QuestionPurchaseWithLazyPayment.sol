pragma solidity ^0.4.4;
//note, Truffle 
import "http://github.com/pipermerriam/ethereum-alarm-clock/blob/master/contracts/SchedulerInterface.sol";
import "http://github.com/pipermerriam/ethereum-alarm-clock/blob/master/contracts/Scheduler.sol";

contract QuestionPurchase {

    struct questionBundle{
        uint[] questionAccess;
    }

    mapping(address => questionBundle) questionList;

function purchase(uint questionId) public returns (uint) {

   SchedulerInterface scheduler = SchedulerInterface();

    uint lockedUntil;
    address recipient;
    function DelayedPayment(address _recipient, uint date){
        lockedUntil = block.timestamp() + date;
        recipient = _recipient;

    uint[3] memory uintArgs = [
    20000,
    0,
    lockedUntil,
    ];
    schedule.scheduleTransaction.value(2 ether)(
        address(this),
        "",
        255,
        uintArgs)
    }

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