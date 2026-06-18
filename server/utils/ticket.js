import randomstring from "randomstring";
function generateTicketToken() {
  return randomstring.generate(32);
}

function issueTicket(){
  let ticket = {
    ticketToken: generateTicketToken(),
    attendanceStatus: "not_marked",
    checkedInAt: null,
    checkInMethod: null,
  }
  return ticket
}

export { issueTicket};