// import './App.css';
// import React, { useEffect, useState } from 'react';
// import Form from './components/Form';
// import GuestListVisible from './components/GuestListVisible';
// import Header from './components/Header';

// export default function App() {
//   const baseUrl = 'http://localhost:4000';
//   const [showGuests, setShowGuests] = useState([]);
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   // const [isLoading, setIsLoading] = useState(false);

//   // Fetch the guestlist from an API
//   //
//   async function getList() {
//     const response = await fetch(`${baseUrl}/guests/`);
//     const allGuests = await response.json();
//     setShowGuests(allGuests);
//     // setIsLoading(false);
//     // console.log(allGuests);
//   }
//   useEffect(() => {
//     getList().catch((error) => console.log(error));
//   }, []);

//   // console.log(showGuests);

//   // when Submit button is clicked:
//   // function handleSubmit(e) {
//   //   e.preventDefault();

//   // Add guest from API

//   async function getGuest() {
//     const response = await fetch(`${baseUrl}/guests`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         firstName: firstName,
//         lastName: lastName,
//         attending: false,
//       }),
//     });
//     const createdGuest = await response.json();
//     console.log(createdGuest);
//     setShowGuests(createdGuest);
//   }

//   // async function handleSubmit(event) {
//   //   await getGuest();
//   //   event.preventDefault();
//   // }

//   // getGuest().catch((error) => {
//   //   console.log(error);
//   // });

//   // const addGuest = (text) => {
//   //   let id = 1;
//   //   if (showGuests.length > 0) {
//   //     id = showGuests[0].id + 1;
//   //   }
//   //   let showGuest = { id: id, text: text };
//   // //   let newGuests = [showGuest, ...showGuests];
//   //   console.log(newGuests);
//   //   setShowGuests(newGuests);
//   // };

//   return (
//     <>
//       {/* 1. Header */}
//       <Header />
//       {/* 2. Input form and button */}
//       <Form
//         firstName={firstName}
//         setFirstName={setFirstName}
//         lastName={lastName}
//         setLastName={setLastName}
//       />
//       {/* 3. List of guests */}
//       <GuestListVisible showGuests={showGuests} setShowGuests={setShowGuests} />
//     </>
//   );
// }
