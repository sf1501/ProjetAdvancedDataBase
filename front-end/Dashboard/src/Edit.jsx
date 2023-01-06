import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';


export default function Edit(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const planets = [
    { value: 'Mercure', label: 'Mercure' },
    { value: 'Venus', label: 'Venus' },
    { value: 'Terre', label: 'Terre' },
    { value: 'Mars', label: 'Mars' },
    { value: 'Jupiter', label: 'Jupiter' },
    { value: 'Saturne', label: 'Saturne' },
    { value: 'Uranus', label: 'Uranus' },
    { value: 'Neptune', label: 'Neptune' }
  ];

  // const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({defaultValues: {
      // firstName: props.row.name,
      firstName: props.row.name,
      lastName: '',
  },}
  );


  // React.useEffect(() => {
  //   async function fetchData() {
  //     const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  //     const data = await response.json();
  //     setTitle(data[0].title); // update state with title from first API response object

  //   }
  //   fetchData();
  // }, []);

  React.useEffect(() => {
    async function fetchData() {
      const response = await fetch('http://127.0.0.1:8000/');
      const data = await response.json();
      setName(data[0].name); // update state with title from first API response object
    }
    fetchData();
  }, []);
  


  return (

    <>
      <Button variant="primary" onClick={handleShow}>
        Edit
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit trains schedule</Modal.Title>
        </Modal.Header>
        <Modal.Body>


        <form onSubmit={handleSubmit((data) => console.log(data))}>
          <p>firstName</p>
          <input {...register('firstName')} 
          
          // placeholder={title}
          />

          <p>lastName</p>
          <input {...register('lastName', { required: true })} />
          {errors.lastName && <p>Last name is required.</p>}
          <p>Age</p>
          <input {...register('age', { pattern: /\d+/ })} />
          {errors.age && <p>Please enter number for age.</p>}
          <input type="submit" />
        </form>
          <Form>
            <Form.Group className="mb-3" controlId="editForm.ControlInputName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                // value={name}
                defaultValue={name}
                // defaultValue={title}
                // value={props.row.name}
                // onChange={(event) => setName(event.target.value)}
                // placeholder={props.row.name}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Departure station</Form.Label>
              <Form.Control
                as="select" 
                type="departure_station"
                defaultValue={props.row.departure_station}
                // placeholder={props.row.departure_station}
                >
                {planets.map(planet => (
                    <option key={planet.value} value={planet.value}>
                        {planet.label}
                    </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Destination station</Form.Label>
              <Form.Control
                as="select" 
                type="destination_station"
                defaultValue={props.row.destination_station}
                // placeholder={props.row.destination_station}
                >
                {planets.map(planet => (
                        <option key={planet.value} value={planet.value}>
                            {planet.label}
                        </option>
                    ))}
              </Form.Control>   
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Departure time</Form.Label>
              <Form.Control
                type="departure_time"
                placeholder={props.row.departure_time}

              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Arrival time</Form.Label>
              <Form.Control
                type="arrival_time"
                placeholder={props.row.arrival_time}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Delay</Form.Label>
              <Form.Control
                type="delay"
                placeholder={props.row.delay}
                autoFocus
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>

      </Modal>
    </>
  );
}
