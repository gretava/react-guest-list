import './App.css';
import React, { useEffect, useState } from 'react';
import Header from './components/Header';

export default function App() {
  const baseUrl = 'http://localhost:4000';
  const [guests, setGuests] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  // const [isAttending, setIsAttending] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);

  // Fetch the guestlist from an API

  async function getList() {
    const response = await fetch(`${baseUrl}/guests`);
    const allGuests = await response.json();
    setGuests(allGuests);
    // setIsLoading(false);
    // console.log(allGuests);
  }
  useEffect(() => {
    getList().catch((error) => console.log(error));
  }, []);

  // console.log(showGuests);

  // when Submit button is clicked:
  // function handleSubmit(e) {
  //   e.preventDefault();

  // Add guest from API

  async function addGuest() {
    const response = await fetch(`${baseUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        // attending: false,
      }),
    });
    const createdGuest = await response.json();
    // console.log(createdGuest);
    const guestListCopy = [...guests, createdGuest];
    setGuests(guestListCopy);
  }

  function handleSubmit(event) {
    event.preventDefault(); // Prevents the page to reload when submitting the form

    // 👇️ clearing input values after submit
    setFirstName('');
    setLastName('');
  }

  // Update guest status (attending/not attending)
  async function updateGuestStatus(id, attending) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: !attending }),
    });
    const updatedGuest = await response.json();
    // const guestStatus = [...guests];
    const updatedList = updatedGuest.filter((guest) => {
      return guest.id !== updatedGuest.id;
    });
    setGuests([...guests], updatedList);
  }

  // Delete a guest

  async function handleRemove(id) {
    // console.log(id);
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();
    // 1. create a copy
    // const guestListUpdated = [...guests];
    console.log(deletedGuest);

    // 2. update the value
    const newGuestList = guests.filter((guest) => guest.id !== id);

    // 3. set new state
    setGuests(newGuestList);
    // console.log(newGuestList);
  }

  // console.log(guests);

  // removeGuest().catch((error) => {
  //   console.error(error);
  // });

  // addGuest().catch((error) => {
  //   console.log(error);
  // });

  return (
    <>
      <Header />

      <form data-test-id="guest" onSubmit={handleSubmit}>
        <label>
          First name
          <input
            value={firstName}
            name="First name"
            required
            onChange={(event) => setFirstName(event.target.value)}
          />
        </label>
        <label>
          Last name
          <input
            value={lastName}
            name="Last name"
            required
            onChange={(event) => setLastName(event.target.value)}
          />
        </label>

        <button
          onClick={(event) => {
            addGuest().catch((error) => {
              console.log(error);
            });
          }}
        >
          Add guest
        </button>
      </form>
      <>
        <h1>Guest list</h1>
        {guests.map((guest) => (
          <div key={`guest-${guest.id}`} data-test-id="guest">
            {guest.firstName} {guest.lastName}
            <button
              // aria-label={`remove ${guest.firstName}${guest.lastName}`}
              onClick={() => handleRemove(guest.id)}
            >
              Remove
            </button>
            <label>
              Attending?
              <input
                aria-label={`attending ${guest.firstName} ${guest.lastName}`}
                checked={guest.attending}
                type="checkbox"
                onChange={(event) => {
                  updateGuestStatus(guest.id).catch((error) =>
                    console.log(error),
                  );
                }}
              />
              <span>
                {guest.attending === true ? 'attending' : 'not attending'}
              </span>
            </label>
          </div>
        ))}
      </>
    </>
  );
}
