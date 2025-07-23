import { createHeaders, handleApiResponse, APP_ID } from "./api";
import { UserTicket } from "../types/ticket";

const TICKETS_API = "https://eletsa.cairns.co.za/php/tickets";

export const ticketsApi = {
  async fetchUserTickets(): Promise<UserTicket[]> {
    const response = await fetch(`${TICKETS_API}/api.php/tickets`, {
      method: "POST",
      headers: createHeaders(true),
      body: JSON.stringify({}), // Empty body for POST request
    });

    const data = await handleApiResponse(response);
    const tickets = Array.isArray(data) ? data : [data];

    // Convert string numbers to proper types where needed
    return tickets.map((ticket: any) => ({
      ...ticket,
      quantity: Number(ticket.quantity),
      used: Number(ticket.used),
    }));
  },
};