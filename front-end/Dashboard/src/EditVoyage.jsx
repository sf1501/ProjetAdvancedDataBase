import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';


export default function EditVoyage(props) {
  const [show, setShow] = useState(false);
  const [nom_voyage, setNomVoyage] = useState(props.voyage.nom_voyage);
  const [type, setType] = useState(props.voyage.type);
  const [depart, setDepart] = useState(props.voyage.depart);
  const [arrive, setArrive] = useState(props.voyage.arrive);
  const [voie, setVoie] = useState(props.voyage.voie);
  const [id_train, setIdTrain] = useState(props.voyage.id_train);
  const [gare_depart, setGareDepart] = useState(props.voyage.gare_depart);
  const [gare_arrive, setGareArrive] = useState(props.voyage.gare_arrive);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const types = [
    { value: 'TGV', label: 'TGV' },
    { value: 'TER', label: 'TER' },
    { value: 'OUIGO', label: 'OUIGO' }
  ];

  const patchData = async (data) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/voyage/${props.voyage.id_voyage}`, {
        method: 'PATCH',
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({defaultValues: {
    nom_voyage: props.voyage.nom_voyage, // set the default value for the input
    type: props.voyage.type,
    depart: props.voyage.depart,
    arrive: props.voyage.arrive,
    voie: props.voyage.voie,
    type: props.voyage.type,
    id_train: props.voyage.id_train,
    gare_depart: props.voyage.gare_depart,
    gare_arrive: props.voyage.gare_arrive,
    // delay: props.voyage.delay,

},});

  const onSubmit = (data) => {
    patchData(data).then((res) => console.log(res));
    // deleteData().then((res) => alert(res));
    // window.location.reload();
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

        {/* <form>
          <p>nom_voyage</p>
          <input {...register('nom_voyage')} 
          onChange={(event) => setNomVoyage(event.target.value)}
          />
          <p>type</p>
          <input {...register('type')} 
          />
          <p>depart</p>
          <input {...register('depart')} 
          />
          <p>arrive</p>
          <input {...register('arrive')} 
          />
          <p>voie</p>
          <input {...register('voie')} 
          />
          <p>type</p>
          <input {...register('type')} 
          />
          <p>id_train</p>
          <input {...register('id_train')} 
          />
          <p>gare_depart</p>
          <input {...register('gare_depart')} 
          />
          <p>gare_arrive</p>
          <input {...register('gare_arrive')} 
          />
          <p>delay</p>
          <input {...register('delay')} 
          />
        </form> */}

          {/* <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Nom voyage</Form.Label>
              <Form.Control
                type="nom_voyage"
                defaultValue={props.voyage.nom_voyage}
                >

              </Form.Control>
            </Form.Group>
            
          </Form> */}
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
