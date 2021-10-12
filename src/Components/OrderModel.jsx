import React, { Component, useRef, useEffect, useCallback, useState } from 'react'
import { useSpring, animated } from 'react-spring';
// import Select from 'react-select';
import styled from 'styled-components'
import CloseIcon from '@material-ui/icons/Close';
import AuthService from '../Services/AuthService';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));




const Background = styled.div`
    /* width: 52%;
    height: 67%; */
    width: 200%;
    height: 200%;
    background: rgba(0,0,0,0.8);
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
`

const ModalWrapper = styled.div`
    width: 800px;
    height: 500px;
    box-shadow: 0 5px 16px rgba(0,0,0,0.2);
    background: #fff;
    color: #000;
    display: grid;
    grid-template-columns: 1fr;
    position: relative;
    z-index: 99999;
    border-radius: 10px;
`

const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    line-height: 1.8;
    color: #141414;

    p {
        margin-bottom: 1rem;
    }

    button {
        padding: 10px 24px;
        background: #141414;
        color: #fff;
        border: none;
    }
`


const CloseModalButton = styled(CloseIcon)`
    cursor: pointer;
    position: absolute;
    top: 20px;
    right: 20px;
    width: 32px;
    height: 32px;
    padding: 0;
    z-index: 99999;
`



export const Modal = ({ showModal, setShowModal }) => {
    const modalRef = useRef()
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [quantity, setQuantity] = useState("");
    const [role, setRole] = useState("");
    const [message, setMessage] = useState("");
    const [selectedSubjects, setSelectedSubjects] = useState("");
    const [options, setOptions] = useState([]);
    const classes = useStyles();

    const onChangeUsername = e => {
        setUsername(e.target.value);
    }

    const onChangeEmail = e => {
        setEmail(e.target.value);
    }

    const onChangeQuantity = e => {
        setQuantity(e.target.value);
    }

    const onChangeRole = e => {
        setRole(e.target.value);
    }

    const onSubjectSelect = e => {
        setSelectedSubjects(e.map(item => item.value));
    }



    const animation = useSpring({
        config: {
            duration: 250
        },
        opacity: showModal ? 1 : 0,
        transform: showModal ? 'translateY(0%)' : 'translateY(-100%)'
    })

    const closeModal = e => {
        if(modalRef.current === e.target) {
            setShowModal(false);
        }
    }

    const keyPress = useCallback(
        e => {
            if(e.key === 'Escape' && showModal) {
                setShowModal(false);
            }
        },
        [setShowModal, showModal]
    );

    const addOrder = e => {
        e.preventDefault();

        //this.form.validateAll();
        AuthService.register(username, email, role, quantity)
        .then(
            () => {
                console.log("Order Added Successfully")
            },
            error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                    
                setMessage(resMessage);
            }
        );        
    }

    useEffect(
        () => {
            document.addEventListener('keydown', keyPress);
            return () => document.removeEventListener('keydown', keyPress);
        }, [keyPress]
    )

    return (
        <>
        {showModal ? (
            <Background ref={modalRef} onClick={closeModal}>
                <animated.div style={animation}>
                <ModalWrapper showModal={showModal}>
                    <ModalContent>
                        <Grid container
                            direction="row"
                            justifyContent="space-evenly"
                            alignItems="center">
                        <Grid >
                        <FormControl variant="outlined" className='classes.formControl'>
                        <InputLabel htmlFor="demo-customized-select-native">Crust</InputLabel>
                        <Select 
                            options={options}
                            onChange={onSubjectSelect}
                            className="basic-multi-select"
                            isMulti
                        />
                        </FormControl>
                        </Grid>
                        &nbsp;
                        
                        
                        <Grid>
                        <FormControl variant="outlined" className='classes.formControl'>
                        <InputLabel htmlFor="demo-customized-select-native">Toppings</InputLabel>
                        <Select 
                            
                            options={options}
                            onChange={onSubjectSelect}
                            className="basic-multi-select"
                            isMulti
                        />
                        </FormControl>
                        </Grid>
                        &nbsp;
                        <Grid >
                        <FormControl variant="outlined" className='classes.formControl'>
                        <InputLabel htmlFor="demo-customized-select-native">Size</InputLabel>
                        <Select 
                            options={options}
                            onChange={onSubjectSelect}
                            className="basic-multi-select"
                            isMulti
                        >
                        <option aria-label="None" value="" />
                        <option value={1}>Small</option>
                        <option value={2}>Medium</option>
                        <option value={3}>Large</option>
                        </Select>
                        </FormControl>
                        </Grid>
                        &nbsp;
                        <Grid >
                        <FormControl variant="outlined" className='classes.formControl'>
                        <input 
                            type="Number"
                            name="quantity"
                            placeholder="Quantity"
                            value={quantity}
                            onChange={onChangeQuantity}
                        />
                        </FormControl>
                        </Grid>
                        </Grid>
                        <br></br>
                        <div>
                        <button onClick={addOrder}>
                            Add Another Pizza
                        </button>
                        </div>
                        <br></br>
                        <div>
                        <button onClick={addOrder}>
                            Add Order
                        </button>
                        </div>
                    </ModalContent>
                    <CloseModalButton onClick={() => setShowModal(prev => !prev)} />
                </ModalWrapper>
                </animated.div>
            </Background>
        ) : null}
        </>
    )
}