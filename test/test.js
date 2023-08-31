// const { expect } = require("chai");

// describe("EventContract", function () {
//   let EventContract;
//   let eventContract;
//   let owner;
//   let addr1;
//   let addr2;

//   beforeEach(async function () {
//     [owner, addr1, addr2] = await ethers.getSigners();

//     EventContract = await ethers.getContractFactory("EventContract");
//     eventContract = await EventContract.deploy();
//     await eventContract.deployed();
//   });

//   it("Should create an event", async function () {
//     const name = "Test Event";
//     const date = Math.floor(Date.now() / 1000) + 3600; // One hour from now
//     const price = ethers.utils.parseEther("0.1"); // 0.1 ETH
//     const ticketCount = 100;

//     await eventContract.createEvent(name, date, price, ticketCount);

//     const event = await eventContract.events(0);

//     expect(event.organizer).to.equal(owner.address);
//     expect(event.name).to.equal(name);
//     expect(event.date).to.equal(date);
//     expect(event.price).to.equal(price);
//     expect(event.ticketCount).to.equal(ticketCount);
//     expect(event.ticketRemaining).to.equal(ticketCount);
//   });

//   it("Should allow buying tickets and transferring tickets", async function () {
//     const name = "Test Event";
//     const date = Math.floor(Date.now() / 1000) + 3600; // One hour from now
//     const price = ethers.utils.parseEther("0.1"); // 0.1 ETH
//     const ticketCount = 100;
//     const quantity = 5;

//     await eventContract.createEvent(name, date, price, ticketCount);

//     await eventContract.connect(addr1).byeTicket(0, quantity, {
//       value: price.mul(quantity),
//     });

//     expect(await eventContract.tickets(addr1.address, 0)).to.equal(quantity);

//     await eventContract.transferTicket(0, quantity, addr2.address);

//     expect(await eventContract.tickets(addr1.address, 0)).to.equal(
//       quantity - quantity
//     );
//     expect(await eventContract.tickets(addr2.address, 0)).to.equal(quantity);
//   });
// });


const { expect } = require("chai");

describe("EventContract", function () {
  let EventContract;
  let eventContract;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    EventContract = await ethers.getContractFactory("EventContract");
    eventContract = await EventContract.deploy();
    await eventContract.deployed();
  });

  it("Should create an event", async function () {
    const name = "Test Event";
    const date = Math.floor(Date.now() / 1000) + 3600; // One hour from now
    const price = ethers.utils.parseEther("0.1"); // 0.1 ETH
    const ticketCount = 100;

    await eventContract.createEvent(name, date, price, ticketCount);

    const event = await eventContract.events(0);

    
    expect(event.organizer).to.equal(owner.address);
    expect(event.name).to.equal(name);
    expect(event.date).to.equal(date);
    expect(event.price).to.equal(price);
    expect(event.ticketCount).to.equal(ticketCount);
    expect(event.ticketRemaining).to.equal(ticketCount);
  });

  it("Should allow buying tickets and transferring tickets", async function () {
    const name = "Test Event";
    const date = Math.floor(Date.now() / 1000) + 3600; // One hour from now
    const price = ethers.utils.parseEther("0.1"); // 0.1 ETH
    const ticketCount = 100;
    const quantity = 5;

    await eventContract.createEvent(name, date, price, ticketCount);

    await eventContract.connect(addr1).byeTicket(0, quantity, {
      value: price.mul(quantity),
    });

    expect(await eventContract.tickets(addr1.address, 0)).to.equal(quantity);

    await eventContract.connect(addr1).transferTicket(0, quantity, addr2.address);

    expect(await eventContract.tickets(addr1.address, 0)).to.equal(0);
    expect(await eventContract.tickets(addr2.address, 0)).to.equal(quantity);
  });

  it("Should handle buying more than 0 tickets and transferring different amounts", async function () {
    const name = "Test Event";
    const date = Math.floor(Date.now() / 1000) + 3600; // One hour from now
    const price = ethers.utils.parseEther("0.1"); // 0.1 ETH
    const ticketCount = 100;
    const quantity1 = 10;
    const quantity2 = 20;

    await eventContract.createEvent(name, date, price, ticketCount);

    await eventContract.connect(addr1).byeTicket(0, quantity1, {
      value: price.mul(quantity1),
    });

    await eventContract.connect(addr2).byeTicket(0, quantity2, {
      value: price.mul(quantity2),
    });

    await eventContract.connect(addr1).transferTicket(0, quantity1, addr2.address);

    expect(await eventContract.tickets(addr1.address, 0)).to.equal(0);
    expect(await eventContract.tickets(addr2.address, 0)).to.equal(
      quantity1 + quantity2
    );
  });

  it("Should handle insufficient funds", async function () {
    const name = "Test Event";
    const date = Math.floor(Date.now() / 1000) + 3600; // One hour from now
    const price = ethers.utils.parseEther("0.1"); // 0.1 ETH
    const ticketCount = 100;
    const quantity = 5;

    await eventContract.createEvent(name, date, price, ticketCount);

    // Attempt to buy tickets with insufficient funds
    await expect(
      eventContract.connect(addr1).byeTicket(0, quantity, {
        value: price.mul(quantity).sub(1), // Insufficient funds
      })
    ).to.be.revertedWith("Ether is not enough");

    // No tickets should be assigned
    expect(await eventContract.tickets(addr1.address, 0)).to.equal(0);
  });
});
