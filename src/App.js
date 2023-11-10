import React, { useEffect, useState } from 'react';
import { HiTrash } from 'react-icons/hi';
import styles from './App.module.scss';

export default function App() {
  const [guests, setGuests] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const baseUrl = 'https://1fb87be3-ae42-40dc-ba1f-6356d68c8c57.id.repl.co';

  useEffect(() => {
    setIsLoading(false);
  }, [guests]);

  // Fetch the guestlist from an API
  async function getList() {
    setIsLoading(true);
    const response = await fetch(`${baseUrl}/guests`);
    const allGuests = await response.json();
    setGuests([...allGuests]);
  }
  useEffect(() => {
    getList().catch((error) => console.log(error));
  }, []);

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
    const guestListCopy = [...guests, createdGuest];
    setGuests(guestListCopy);
    // 👇️ clearing input values after submit
    setFirstName('');
    setLastName('');
  }

  async function handleSubmit(event) {
    event.preventDefault(); // Prevents the page to reload when submitting the form
    await addGuest();
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
    const guestStatus = [...guests];
    const updatedList = guestStatus.filter((guest) => {
      return guest.id !== updatedGuest.id;
    });
    setGuests([...updatedList, updatedGuest]);
    console.log(guests);
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

  return (
    <div className={styles.box}>
      <h1>Your Party Guest List</h1>
      <form data-test-id="guest" onSubmit={handleSubmit}>
        <input
          className={styles.nameInput}
          value={firstName}
          placeholder="Enter first name"
          disabled={isLoading}
          required
          onChange={(event) => {
            setFirstName(event.currentTarget.value);
          }}
        />
        <input
          className={styles.nameInput}
          value={lastName}
          placeholder="Enter last name"
          disabled={isLoading}
          required
          onChange={(event) => {
            setLastName(event.currentTarget.value);
          }}
        />
        <button className={styles.addBtn} disabled={isLoading}>
          Add guest
        </button>
      </form>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {guests.length === 0 ? (
            <p>Guest list is empty, please enter a name</p>
          ) : (
            guests.map((guest) => (
              <div key={`guest--${guest.id}`} data-test-id="guest">
                <div className={styles.guestName}>
                  <p>
                    {guest.firstName} {guest.lastName}{' '}
                  </p>
                  <div className={styles.checkbox}>
                    <input
                      aria-label={`${guest.firstName} ${guest.lastName} attending status`}
                      checked={guest.attending}
                      type="checkbox"
                      onChange={(event) =>
                        updateGuestStatus(
                          guest.id,
                          guest.attending,
                          event.currentTarget.checked,
                        )
                      }
                    />
                    <span>{guest.attending === true ? 'yes' : 'no'}</span>

                    <button
                      className={styles.deleteBtn}
                      aria-label={`remove ${guest.firstName}${guest.lastName}`}
                      onClick={() => {
                        handleRemove(guest.id);
                      }}
                    >
                      <HiTrash size="1.4rem" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
