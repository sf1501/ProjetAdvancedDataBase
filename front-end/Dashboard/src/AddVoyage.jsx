import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';

export default function AddVoyage() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

//   const [count, setCount] = useState(1)

  const types = [
    { value: 'TGV', label: 'TGV' },
    { value: 'TER', label: 'TER' },
    { value: 'OUIGO', label: 'OUIGO' }
  ];
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const postData = async (data) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/addVoyage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const jsonResponse = await response.json();
      console.log(jsonResponse);
    } catch (error) {
      console.error(error);
    }
  }

  const onSubmit = (data) => {
    // () => setCount((count) => count + 1);
    // data.id_voyage = count;
    data.id_voyage = 4;
    // alert(JSON.stringify(data));
    postData(data).then((res) => console.log(res));
    window.location.reload();
  };

  return (
    <>
      <Button variant="success" onClick={handleShow}>
        Add
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add a train schedule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
            <Form.Group>
                <Form.Label>nom_voyage</Form.Label>
                <Form.Control
                type="text"
                name="nom_voyage"
                {...register('nom_voyage')} 
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>type</Form.Label>
                <Form.Control
                as="select" 
                type="text"
                name="type"
                
                {...register('type')} 
                >
                {types.map(type => (
                    <option key={type.value} value={type.value}>
                        {type.label}
                    </option>
                ))}
                </Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Label>depart</Form.Label>
                <Form.Control
                type="text"
                name="depart"
                {...register('depart')} 
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>arrive</Form.Label>
                <Form.Control
                type="text"
                name="arrive"
                {...register('arrive')} 
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>voie</Form.Label>
                <Form.Control
                type="text"
                name="voie"
                {...register('voie')} 
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>type</Form.Label>
                <Form.Control
                type="text"
                name="id_train"
                {...register('id_train')} 
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>id_train</Form.Label>
                <Form.Control
                type="text"
                name="id_train"
                {...register('id_train')} 
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>gare_depart</Form.Label>
                <Form.Control
                type="text"
                name="gare_depart"
                {...register('gare_depart')} 
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>gare_arrive</Form.Label>
                <Form.Control
                type="text"
                name="gare_arrive"
                {...register('gare_arrive')} 
                />
            </Form.Group>
            </Form>
            
            
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success" onClick={handleSubmit(onSubmit)}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
