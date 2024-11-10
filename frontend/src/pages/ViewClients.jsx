import React, { useState, useEffect } from "react";
import apiUtil from "../utils/apiUtil";

function ViewClients() {
  const [clients, setClients] = useState(null);

  useEffect(() => {
    // The API call happens here, and it will only run once when the component mounts
    apiUtil
      .fetchAllClients()
      .then((data) => {
        setClients(data.clients); // Set clients data into state
        console.log(data); // Optionally, you can log the data here
      })
      .catch((error) => {
        console.log(error); // Handle errors
      });
  }, []); // Empty dependency array ensures the effect runs only once

  if (!clients) {
    return <div>Loading...</div>; // Render a loading state until clients data is fetched
  }

  return (
    <div>
      {/* Render the client data */}
      <h1>Clients List</h1>
      <ul>
        {clients.map((client) => (
          <li key={client.id}>{client.name}</li> // Assuming each client has an `id` and `name`
        ))}
      </ul>
    </div>
  );
}

export default ViewClients;
