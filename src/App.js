import React, { useEffect, useState } from 'react';
import Header from './components/Header';

export default function App() {
  const baseUrl = 'https://1fb87be3-ae42-40dc-ba1f-6356d68c8c57.id.repl.co';
  const [guests, setGuests] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  // const [isAttending, setIsAttending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, [guests]);

  // Fetch the guestlist from an API

  async function getList() {
    setIsLoading(true);
    const response = await fetch(`${baseUrl}/guests`);
    const allGuests = await response.json();
    setGuests([...allGuests]);
    // setIsLoading(false);
    // console.log(allGuests);
  }
  useEffect(() => {
    getList().catch((error) => console.log(error));
  }, []);

  // console.log(guests);

  // when Submit button is clicked:
  // function handleSubmit(e) {
  //   e.preventDefault();

  // Add guest from API, POST method
  async function addGuest() {
    const response = await fetch(`${baseUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        attending: false,
      }),
    });
    const createdGuest = await response.json();
    // console.log(createdGuest);
    const guestListCopy = [...guests, createdGuest];
    // setGuests(guestListCopy);
    setGuests([...guests, guestListCopy]);
    // 👇️ clearing input values after submit
    // setFirstName('');
    // setLastName('');
  }

  async function handleSubmit(event) {
    event.preventDefault(); // Prevents the page to reload when submitting the form
    await addGuest();
    // 👇️ clearing input values after submit
    setFirstName('');
    setLastName('');
  }

  // Update guest status (attending/not attending)
  async function updateGuestStatus(id, status) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: !status }),
    });
    const updatedGuest = await response.json();
    // const guestStatus = [...guests];
    const updatedList = guests.filter((guest) => {
      return guest.id !== updatedGuest.id;
    });
    setGuests([...guests], updatedList);
    // setGuests(updatedList);
    addGuest().catch(() => console.log('Error'));
  }

  // Delete a guest
  function handleRemove(id) {
    // console.log(id);
    const deleteGuest = async () => {
      const response = await fetch(`${baseUrl}/guests/${id}`, {
        method: 'DELETE',
      });
      const deletedGuest = await response.json();
      // 1. create a copy
      const guestListUpdated = [...guests];
      // console.log(deletedGuest);

      // 2. update the value
      const newGuestList = guestListUpdated.filter(
        (guest) => guest.id !== deletedGuest.id,
      );

      // 3. set new state
      setGuests(newGuestList);
      console.log(newGuestList);
    };
    deleteGuest().catch((error) => {
      console.error(error);
    });
  }

  // console.log(guests);

  // removeGuest().catch((error) => {
  //   console.error(error);
  // });

  // addGuest().catch((error) => {
  //   console.log(error);
  // });

  return (
    <div>
      <Header />
      <h1>Guest list</h1>
      <form data-test-id="guest" onSubmit={handleSubmit}>
        <label>
          First name
          <input
            value={firstName}
            placeholder="First name"
            disabled={isLoading}
            required
            onChange={(event) => {
              setFirstName(event.currentTarget.value);
            }}
          />
        </label>
        <label>
          Last name
          <input
            value={lastName}
            placeholder="Last name"
            disabled={isLoading}
            required
            onChange={(event) => {
              setLastName(event.currentTarget.value);
            }}
          />
        </label>
        <button disabled={isLoading}>Add guest</button>
      </form>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="outputContainer">
          {guests.length === 0 ? (
            <p>Guest list is empty, please enter a name</p>
          ) : (
            guests.map((guest) => (
              <div key={`guest--${guest.id}`} data-test-id="guest">
                <div>
                  <div>
                    <input
                      aria-label={`${guest.firstName} ${guest.lastName} attending status`}
                      checked={guest.attending}
                      type="checkbox"
                      onChange={() => {
                        updateGuestStatus(guest.id, guest.attending).catch(
                          (error) => console.log(error),
                        );
                      }}
                    />
                    <span>
                      {guest.attending === true ? 'attending' : 'not attending'}
                    </span>
                  </div>
                  <p>
                    {guest.firstName} {guest.lastName}
                  </p>
                  <button
                    aria-label={`remove ${guest.firstName}${guest.lastName}`}
                    onClick={() => {
                      handleRemove(guest.id);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
