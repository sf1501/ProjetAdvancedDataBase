import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';

export default function DeleteVoyage(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

//   const deleteData = async (data) => {
//     try {
//       const response = await fetch(`http://127.0.0.1:8000/voyage/${props.voyage.id_voyage}`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//       });
//       const jsonResponse = await response.json();
//       console.log(jsonResponse);
//     } catch (error) {
//       console.error(error);
//     }
//   }
  const deleteData = async (data) => {
    try {
        const endpoint = `http://192.168.151.55:8000/voyage/${props.voyage.id_voyage}`;
        console.log(endpoint);
        const response = await fetch(endpoint, {
        // const response = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
          method: 'DELETE'
        });
      const jsonResponse = await response.json();
      return(jsonResponse);
      } catch (error) {
      console.error(error);
    }
  }

//   const deleteData = async () => {
//     // const endpoint = `http://127.0.0.1:8000/voyage`;
//     const endpoint = `http://127.0.0.1:8000/voyage/${props.voyage.id_voyage}`;
//     console.log(endpoint);
//     const response = await fetch(endpoint, {
//     // const response = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
//       method: 'DELETE'
//     });
    
//   };


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = () => {
    // postData(data).then((res) => console.log(res));
    
    deleteData().then((res) => alert(res));
    // deleteData().then((res) => alert(res));
    handleClose();
    window.location.reload();
  };

  return (
    <>
      <Button variant="danger" onClick={handleShow}>
        Delete
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete a voyage</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {/* <form onSubmit={handleSubmit(onSubmit)}> */}
            <form>
            {/* <form onSubmit={handleSubmit((data) => console.log(data))}> */}
            {/* <form onSubmit={handleSubmit}> */}
                <p>Voulez-vous vraiment supprimer ce voyage?</p>
            </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {/* <Button variant="danger" onClick={deleteData}> */}
          <Button variant="danger" onClick={handleSubmit(onSubmit)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
