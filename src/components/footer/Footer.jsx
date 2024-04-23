import React, { useState } from 'react';
import TeamSlider from '../ourteam/TeamSlider';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;
const Footer = () => {
    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactMessage, setContactMessage] = useState('');

    const contactSubmitHandler = async (e) => {
        e.preventDefault();

        if (!contactEmail || !contactMessage || !contactName)
            return toast.warning('Please enter credentials!!');
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const body = {
            name: contactName,
            email: contactEmail,
            message: contactMessage,
        };
        try {
            const { data } = await axios.post(`${API_URL}/query`, body, config);
            // console.log(data);
            toast.success(data.message);
        } catch (err) {
            // console.log(err.stack);
            toast.error('Please try later!!!');
        }
    };
    return (
        <footer style={{ backgroundColor: 'inherit' }}>
            <section
                id="contactus-container"
                style={{
                    width: '100%',
                    // margin: "auto",
                    padding: '0 10vw',
                    backgroundColor: 'black',
                    // height: "60vh",
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '10px',
                        flexWrap: 'wrap',
                    }}
                >
                    <form
                        onSubmit={contactSubmitHandler}
                        style={{
                            marginTop: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            minWidth: '300px',
                            width: '55%',
                            paddingBottom: '60px',
                        }}
                    >
                        <h2
                            style={{
                                fontSize: '34px',
                                // backgroundClip: "text",
                                color: 'pink',
                            }}
                        >
                            Contact Us
                        </h2>
                        <input
                            type="text"
                            placeholder="Name"
                            name="contactName"
                            id="contactName"
                            value={contactName}
                            required
                            style={{
                                padding: '4px 10px',
                                backgroundColor: 'black',
                                color: 'pink',
                                fontSize: '20px',
                                borderTop: 'none',
                                borderLeft: 'none',
                                borderRight: 'none',
                                borderBottom: '3px solid pink',
                                outline: 'none',
                            }}
                            onChange={(e) => setContactName(e.target.value)}
                        />
                        <input
                            type="gmail"
                            placeholder="Email"
                            name="contactEmail"
                            id="contactEmail"
                            value={contactEmail}
                            required
                            style={{
                                padding: '4px 10px',
                                backgroundColor: 'black',
                                color: 'pink',
                                fontSize: '20px',
                                borderTop: 'none',
                                borderLeft: 'none',
                                borderRight: 'none',
                                borderBottom: '3px solid pink',
                                outline: 'none',
                            }}
                            onChange={(e) => setContactEmail(e.target.value)}
                        />

                        <textarea
                            name="contactMessage"
                            id="contactMessage"
                            cols="16"
                            rows="5"
                            placeholder="Message"
                            value={contactMessage}
                            required
                            style={{
                                padding: '0.2rem 0.6rem',
                                backgroundColor: 'black',
                                color: 'pink',
                                fontSize: '1.4rem',
                                borderTop: 'none',
                                borderLeft: 'none',
                                borderRight: 'none',
                                borderBottom: '3px solid pink',
                                // outline: "none",
                            }}
                            onChange={(e) => setContactMessage(e.target.value)}
                        ></textarea>

                        <button
                            type="submit"
                            style={{
                                backgroundColor: 'pink',
                                padding: '4px 30px',
                                color: 'black',
                                fontWeight: 'bold',
                                justifySelf: 'flex-end',
                                margin: 'auto',
                                border: 'none',
                                borderRadius: '10px',
                            }}
                        >
                            Submit
                        </button>
                    </form>
                    
                </div>
            </section>
        </footer>
    );
};

export default Footer;
