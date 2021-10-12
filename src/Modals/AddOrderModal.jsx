import React, { Component, useRef, useEffect, useCallback, useState } from 'react'
import { useSpring, animated } from 'react-spring';
import styled from 'styled-components'
import CloseIcon from '@material-ui/icons/Close';
import OrderService from '../Services/OrderService';
import FlashMessage from '../Components/FlashMessage';
import validateInfo from '../Validation/AddOrderValidation';
import '../App.css'
import CrustService from '../Services/CrustService';
import ToppingService from '../Services/ToppingService';
import UserService from '../Services/UserService';
import authService from '../Services/AuthService';

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
    width: 1000px;
    height: 660px;
    box-shadow: 0 5px 16px rgba(0,0,0,0.2);
    background: #fff;
    color: #000;
    display: grid;
    grid-template-columns: 1fr 1.5fr;
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
    padding-left: 20px;

    p {
        margin-bottom: 1rem;
    }

    /* button {
        padding: 10px 24px;
        background: #141414;
        color: #fff;
        border: none;
    } */
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

const ContentColumn = styled.div`
    width: 50%;
`


export const AddOrderModal = ({ showModal, setShowModal }) => {
    const modalRef = useRef()
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [delivery, setDelivery] = useState("");
    const [message, setMessage] = useState("");
    const [snackbarSuccess, setSnackbarSuccess] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarType, setSnackbarType] = useState("");
    const [crusts, setCrusts] = useState([]);
    const [toppings, setToppings] = useState([]);
    const [deliveryRiders, setDeliveryRiders] = useState([]);
    const user = authService.getCurrentUser();

    const [itemList, setItemList] = useState([{ crust: "", topping: "", size: "", quantity: null }]);

    const onChangeName = e => {
        setName(e.target.value);
    }

    const onChangeAddress = e => {
        setAddress(e.target.value);
    }

    const onChangeDelivery = e => {
        setDelivery(e.target.value);
    }

    const [values, setValues] = useState({
        name: "",
        address: ""
    })

    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    // const onChangeCrust = e => {
    //     setCrusts(e.target.value);
    // }

    // const onChangeTopping = e => {
    //     setToppings(e.target.value);
    // }

    // handle input change
  const handleItemChange = (e, index) => {
    const { name, value } = e.target;
// const handleItemChange = (name, value, index) => {
//     const name = name;
//     const value = value;
    const list = [...itemList];
    list[index][name] = value;
    setItemList(list);
  };
 
  // handle click event of the Remove button
  const handleRemoveClick = index => {
    const list = [...itemList];
    list.splice(index, 1);
    setItemList(list);
  };
 
  // handle click event of the Add button
  const handleAddClick = () => {
    setItemList([...itemList, { crust: "", topping: "", size: "", quantity: null }]);
  };

    // const [values, setValues] = useState({
    //     name: "",
    //     smallPrice: null,
    //     veg: ""
    // })

    // const [errors, setErrors] = useState({})
    // const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = e => {
        e.preventDefault();

        setValues({
            ...values,
            name: name,
            address: address
        })

        setErrors(validateInfo(values));
        setIsSubmitting(true);

        // setValues({
        //     ...values,
        //     name: name,
        //     smallPrice: smallPrice,
        //     veg: veg
        // })

        // setErrors(validateInfo(values));
        // setIsSubmitting(true);

        if(Object.keys(errors).length === 0 && isSubmitting) {
            OrderService.addOrder(name, address, itemList, delivery, user.username)
        .then(
            () => {
                setShowModal(false);
                setSnackbarMessage("Order added Successfully");
                setSnackbarType("success");
                setSnackbarSuccess(true);
                setValues({
                    ...values,
                    name: "",
                    address: ""
                })
                setName("")
                setAddress("")
        },
        error => {
            const resMessage =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            setSnackbarMessage("ERROR: Unable to add order. " + resMessage);
            setSnackbarType("error");
            setSnackbarSuccess(true);
        }
    );
        setSnackbarSuccess(false);
    }
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

    useEffect(
        () => {
            document.addEventListener('keydown', keyPress);
            return () => document.removeEventListener('keydown', keyPress);
        }, [keyPress]
    )

    useEffect(() => {
        CrustService.getCrustsList().then(
            response => {
                setCrusts(Object.values(response.data));
            },
            error => {
                console.log(
                    (error.response && error.response.data) ||
                    error.message ||
                    error.toString())
            }
        );
    })

    useEffect(() => {
        ToppingService.getToppingsList().then(
            response => {
                setToppings(Object.values(response.data));
            },
            error => {
                console.log(
                    (error.response && error.response.data) ||
                    error.message ||
                    error.toString())
            }
        );
    })

    useEffect(() => {
        UserService.getDeliveryUsersList().then(
            response => {
                setDeliveryRiders(Object.values(response.data));
            },
            error => {
                console.log(
                    (error.response && error.response.data) ||
                    error.message ||
                    error.toString())
            }
        );
    })

    return (
        <>
        {showModal ? (
            <Background ref={modalRef} onClick={closeModal}>
                <animated.div style={animation}>
                <ModalWrapper showModal={showModal}>
                    <ModalContent>
                        <form onSubmit={handleSubmit}>
                            <h2>
                                Add a New Order
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
                                    style={{ width:"125%" }}
                                    className="form-input"
                                    placeholder="John Doe"
                                    defaultValue={name}
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
                                    Delivery Address
                                </label>
                                <input 
                                    type="text"
                                    name="address"
                                    style={{ width:"125%" }}
                                    className="form-input"
                                    placeholder="212/B Backer Street, London"
                                    defaultValue={address}
                                    onChange={onChangeAddress}
                                    />
                                    <div className="form-error">
                                    {errors.address && <span>{errors.address}</span>}
                                    </div>
                            </div>
                            <label htmlFor="delivery"
                                    className="form-label"
                                >
                                    Delivery Rider
                            </label><br/>
                            <select style={{ width:"100%" }} className="selectDelivery" name="topping" value={delivery} onChange={onChangeDelivery}>
                                {deliveryRiders.map(rider => (
                                    <option key={rider.id} value={rider.username}>
                                        {rider.username}
                                    </option>
                                ))}
                            </select>
                            <button className="form-input-btn"
                                style={{ width:"100%" }}
                                type="submit" onClick={handleSubmit}
                            >
                                Add Order
                            </button>
                        </form>
                    </ModalContent>

                    <ModalContent>
                    <form style={{ marginRight: "-30px" }}>
                    <label
                        style={{ fontSize:"15px" }}
                        className="form-label"
                    >
                        Add Pizza List
                    </label>
                    <table>
                        <tr className="form-label">
                            <td>Crust</td>
                            <td style={{ paddingLeft:"95px" }}>Topping</td>
                            <td style={{ paddingLeft:"83px" }}>Size</td>
                            <td style={{ paddingLeft:"102px" }}>Quantity</td>
                        </tr>
                    </table>
                    {itemList.map((x, i) => {
                        return (
                        <div className="box">
                            <select className="selectCrust" name="crust" value={x.crust} onChange={e => handleItemChange(e, i)}>
                                {crusts.map(crust => (
                                    <option key={crust.id} value={crust.name}>
                                        {crust.name}
                                    </option>
                                ))}
                            </select>
                            <select className="selectTopping" name="topping" value={x.topping} onChange={e => handleItemChange(e, i)}>
                                {toppings.map(topping => (
                                    <option key={topping.id} value={topping.name}>
                                        {topping.name}
                                    </option>
                                ))}
                            </select>
                            <select className="selectSize" name="size" value={x.size} onChange={e => handleItemChange(e, i)}>
                                <option value="lol">Choose size</option>
                                <option value="small">Small</option>
                                <option value="medium">Medium</option>
                                <option value="large">Large</option>
                            </select>
                            <input
                            type="number"
                            oninput={(x.quantity = Math.round(x.quantity))}
                            // oninput={x.quantitye=x.quantity.slice(0,2)}
                            onkeyup={(x.quantity<1) ? (x.quantity= x.quantity * -1):null}
                            // onKeyPress={(x.quantity.length==2) ? false : true}
                            maxLength="2"
                            className="selectQuantity"
                            name="quantity"
                            value={x.quantity}
                            onChange={e => handleItemChange(e, i)}
                            />
                            {/* <input
                            name="crust"
                            placeholder="Enter Crust Name"
                            value={x.crust}
                            onChange={e => handleItemChange(e, i)}
                            />
                            <input
                            className="ml10"
                            name="topping"
                            placeholder="Enter Topping Name"
                            value={x.topping}
                            onChange={e => handleItemChange(e, i)}
                            />
                            <input
                            className="ml10"
                            name="size"
                            placeholder="Enter Size"
                            value={x.size}
                            onChange={e => handleItemChange(e, i)}
                            />
                            <input
                            className="ml10"
                            name="quantity"
                            placeholder="Enter Quantity"
                            value={x.quantity}
                            onChange={e => handleItemChange(e, i)}
                            /> */}
                            <div>
                            {itemList.length !== 1 && <button
                                className="form-item-remove-btn"
                                onClick={() => handleRemoveClick(i)}>Remove</button>}
                            {itemList.length - 1 === i && itemList.length - 1 < 5 && <button 
                                className="form-item-add-btn"
                                onClick={handleAddClick}>Add</button>}
                            </div>
                        </div>
                        );
                    })}
                    {/* <div style={{ marginTop: 20 }}>{JSON.stringify(itemList)}</div> */}
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