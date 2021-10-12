import React, { Component, useRef, useEffect, useCallback, useState } from 'react'
import { useSpring, animated } from 'react-spring';
import styled from 'styled-components'
import CloseIcon from '@material-ui/icons/Close';
import OrderService from '../Services/OrderService';
import FlashMessage from '../Components/FlashMessage';
import validateInfo from '../Validation/OrderValidation.js';
import '../App.css'

const Background = styled.div`
    width: 200%;
    height: 200%;
    background: rgba(0,0,0,0.8);
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
`

const ModalWrapper = styled.div`
    width: 500px;
    height: 660px;
    box-shadow: 0 5px 16px rgba(0,0,0,0.2);
    background: #fff;
    color: #000;
    display: grid;
    grid-template-columns: 1fr;
    position: relative;
    z-index: 99999;
    border-radius: 10px;
    margin-right: 18vw;
    margin-bottom: 15vh;
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


export const UpdateOrderModal = ({ showModal, setShowModal, orderDetails }) => {
    const modalRef = useRef()
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [message, setMessage] = useState("");
    const [snackbarSuccess, setSnackbarSuccess] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarType, setSnackbarType] = useState("");

    const onChangeName = e => {
        setName(e.target.value);
    }

    const onChangeAddress = e => {
        setAddress(e.target.value);
    }


    const [values, setValues] = useState({
        name: "",
        address: ""
    })

    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        setValues({
            ...values,
            name: orderDetails.name,
            address: orderDetails.address
        })
    }, [orderDetails]);

    const handleSubmit = e => {
        e.preventDefault();

        setValues({
            ...values,
            name: name,
            address: address
        })

        setErrors(validateInfo(values));
        setIsSubmitting(true);

        if(Object.keys(errors).length === 0 && isSubmitting) {
            OrderService.updateOrder(orderDetails.id , name, address)
    .then(
        () => {
            setShowModal(false);
            setSnackbarMessage("Order updated Successfully");
            setSnackbarType("success");
            setSnackbarSuccess(true);
        },
        error => {
            const resMessage =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            setSnackbarMessage("ERROR: Unable to update order. " + resMessage);
            setSnackbarType("error");
            setSnackbarSuccess(true);
        }
    );
    setSnackbarSuccess(false);
    }}

    const animation = useSpring({
        config: {
            duration: 250
        },
        opacity: showModal ? 1 : 0,
        transform: showModal ? 'translateY(0%)' : 'translateY(-100%)'
    })

    const closeModal = e => {
        if(modalRef.current === e.target) {
            setValues({
                ...values,
                name: "",
                address: ""
            })
            setShowModal(false);
        }
    }

    const keyPress = useCallback(
        e => {
            if(e.key === 'Escape' && showModal) {
                setValues({
                    ...values,
                    name: "",
                    address: ""
                })
                setShowModal(false);
            }
        },
        [setShowModal, showModal]
    );

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
                        <form className="form" onSubmit={handleSubmit}>
                            <h2>
                                Update Order
                            </h2>
                            <div className="form-inputs">
                                <label htmlFor="name"
                                    className="form-label"
                                >
                                    Customer Name
                                </label>
                                <input 
                                    type="text"
                                    name="name"
                                    className="form-input"
                                    defaultValue={values.name}
                                    onChange={onChangeName}
                                    />
                                    <div className="form-error">
                                    {errors.name && <span>{errors.name}</span>}
                                    </div>
                            </div>
                            <div className="form-inputs">
                                <label htmlFor="address"
                                    className="form-label"
                                >
                                    Address
                                </label>
                                <input 
                                    type="text"
                                    name="address"
                                    className="form-input"
                                    // pattern="\d*"
                                    defaultValue={values.address}
                                    onChange={onChangeAddress}
                                    />
                                    <div className="form-error">
                                    {errors.address && <span>{errors.address}</span>}
                                    </div>
                            </div>
        
                            <button className="form-input-btn"
                                type="submit" onClick={handleSubmit}
                            >
                                Update Order
                            </button>
                        </form>

                    </ModalContent>
                    <CloseModalButton onClick={() => setShowModal(prev => !prev)} />
                </ModalWrapper>
                </animated.div>
            </Background>
        ) : null}

        {
            snackbarSuccess ? <FlashMessage message={snackbarMessage} type={snackbarType} /> : ""
        }
        </>
    )
}