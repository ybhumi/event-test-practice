// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EventContract{

    struct Event{
        address organizer;
        string name;
        uint date;
        uint price;
        uint ticketCount;
        uint ticketRemaining;
        
    }

    mapping(uint => Event) public events; //details of events
    mapping(address => mapping(uint => uint)) public tickets;
    uint public nextId;
    
    function createEvent(string memory name, uint date, uint price, uint ticketCount) public {
        require(block.timestamp < date,"You cannot create an event for past date");
        require(ticketCount >0, "ticket count must be graeter than zero");
        //ticketcount is taken again instaed of ticket remnainng is coz duering creation number of ticketcpunt is same as ticket remaining coz  notng is sold yet
        events[nextId] = Event(msg.sender, name,date,price,ticketCount,ticketCount);
        nextId++;
    }

    function byeTicket(uint id, uint quantity) public payable{
        require(events[id].date != 0 , "event doesnt exits");
         require(events[id].date>block.timestamp,"Event has already occured");
          Event storage _event = events[id]; //this will point the id or key of event mapping (struct stored)
          require(msg.value==(_event.price *quantity),"Ether is not enough"); //price of one ticket * no of tickets he is buying    
          require(_event.ticketRemaining>=quantity,"not enough tickets left");
           _event.ticketRemaining-=quantity;//substract frm remaining ticket, the quantify of tickets brought
              tickets[msg.sender][id]+=quantity; //sender brough ticket for this id nd this much quantity

    }

    function transferTicket(uint id, uint quantity, address to) public{
         require(events[id].date != 0 , "event doesnt exits");
         require(events[id].date>block.timestamp,"Event has already occured");
         require(tickets[msg.sender][id]>=quantity,"You do not have enough tickets");
         tickets[msg.sender][id]-=quantity; //decrease amount of ticket from msg.sender
        tickets[to][id]+=quantity; //increase the no of tickets to the buyer
 }



    }

    

        


