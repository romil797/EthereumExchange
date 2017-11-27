pragma solidity ^0.4.0;

//schematic for questionExchange smart contract
contract questionExchange {


    //extensible question type
    enum questionType {coding, systemDesign, consultingCase,
        marketingCase, behavioral, accounting, valuation,
        investmentPitch}

    enum difficulty {easy, medium, hard}

    struct interviewQuestion{
        address owner;
        uint price;
        string questionDetails;
        string company;
        DateTime dateObtained;
        difficulty questionDifficulty;
        uint reputation;
    }

    interviewQuestion[] questionBase = new interviewQuestion[]();

    struct interviewAppointment{
        DateTime interviewDate;
        string company;
    }

    event InterviewAppointmentSet(address from, DateTime date, string company);

    //connects to pricing sol Library
    function priceAdjustment(){};

    //implements token
    address public minter;
    mapping (address => uint) public balances;

    event Sent(address from, address to, uint amount);

    function questionExchange(){
        minter = msg.sender();
    }

    function mint(address receiver, uint amount) {
        if (msg.sender != minter) return;
        balances[receiver] += amount;
    }

    function send(address receiver, uint amount) {
        if (balances[msg.sender] < amount) return;
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        Sent(msg.sender, receiver, amount);
    }

    function purchaseQuestion(int index){
        interviewQuestion curr = questionBase[index];
        send(curr.owner, curr.price);
    }

    //implement function to buy tokens to buy questions
    function acquireToken(){}

    function addQuestion(address owner, uint ask, string company, difficulty diff){
    questionBase.push(interviewQuestion(owner,ask,company, block.timestamp(), diff, 0));
}


    //need to implement lazy payment structure


}
