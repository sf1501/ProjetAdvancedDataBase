import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';


export default function EditVoyage(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const types = [
    { value: 'TGV', label: 'TGV' },
    { value: 'TER', label: 'TER' },
    { value: 'OUIGO', label: 'OUIGO' }
  ];

  const patchData = async (data) => {
    try {
      const response = await fetch(import.meta.env.VITE_BACKEND +`/voyage`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const jsonResponse = await response.json();
      console.log(jsonResponse)
      return(jsonResponse)
    } catch (error) {
      console.error(error);
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({defaultValues: {
    id_voyage: props.voyage.id_voyage,
    nom_voyage: props.voyage.nom_voyage, // set the default value for the input
    type: props.voyage.type,
    depart: props.voyage.depart,
    arrive: props.voyage.arrive,
    voie: props.voyage.voie,
    id_train: props.voyage.id_train,
    gare_depart: props.voyage.gare_depart,
    gare_arrive: props.voyage.gare_arrive,
    delai: props.voyage.delai,

},});

  const onSubmit = (data) => {
    patchData(data).then((res) => alert(JSON.stringify(res)));
     window.location.reload();
  };

  return (

    <>
      <Button variant="primary" onClick={handleShow}>
        Edit
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit trains voyages</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
            <Form.Group>
                <Form.Label>id_voyage</Form.Label>
                <Form.Control
                type="text"
                name="id_voyage"
                {...register('id_voyage')} 
                />
            </Form.Group>
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
            <Form.Group>
                <Form.Label>delai</Form.Label>
                <Form.Control
                type="text"
                name="delai"
                {...register('delai')} 
                />
            </Form.Group>
            </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit(onSubmit)}>
            Save Changes
          </Button>
        </Modal.Footer>

      </Modal>
    </>
  );
}
