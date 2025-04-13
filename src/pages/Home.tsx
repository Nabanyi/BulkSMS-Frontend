import { Col, Form, ListGroup, Button, Row, Modal, Table } from 'react-bootstrap';
import { FormEvent, useEffect, useState } from 'react';
import { fetchDataFromApi } from '../ApiHelper';
import TruncatedText from '../components/TruncatedText';
import { ButtonLoader, CircularSpinner } from '../components/Loaders';
import { formatDateTime, showCustomErrorAlert, showCustomSuccessAlert } from '../Helper';
import Swal from 'sweetalert2';

interface ContactResponse{
    id: string;
    name: string;
    description: string;
    header: string;
    content: string;
}

interface Contact{
    id: string;
    name: string;
    description: string;
    header: any;
    content: any;
    count: number;
}

interface Campaign{
    id: string;
    message: string;
    scheduled: string;
    scheduledDate: string;
    contact: string;
    contactName: string;
    status: string;
}

export const Home = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedContact, setSelectedContact] = useState<any>(null);
    
    const showContactDetails = (contact: any) => {
        setSelectedContact(contact);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedContact(null);
    };

    const deleteContact = async(e:any, contactId: string) => {
        e.stopPropagation();
        
        try {
            await Swal.fire({
                title: 'Delete Contact',
                text: 'Are you sure you want to delete this contact?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes, Delete!',
                cancelButtonText: 'No, Cancel!',
                showLoaderOnConfirm: true,
                allowOutsideClick: () => !Swal.isLoading(),
                customClass: {
                    confirmButton: 'btn btn-danger',
                    cancelButton: 'btn btn-secondary',
                },
                preConfirm: async () => {
                    try {
                        const response = await fetchDataFromApi(`contact/delete/${contactId}`, 'GET');

                        if (response.status) {
                            removeContactById(contactId);
                            showCustomSuccessAlert(response.message)
                        } else {
                            throw new Error(response.message);
                        }
                    } catch (error) {
                        Swal.showValidationMessage(`Request failed: ${error}`);
                    }
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    const removeContactById = (idToRemove: string) => {
        setContacts((prevData) => prevData.filter((contact) => contact.id !== idToRemove));
    };

    // Create Contact Methods
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createContactFormData, setCreateContactFormData] = useState({name: '', description: '', phoneColumn: ''});
    const [createContactData, setCreateContactData] = useState<any>(null);
    const onCreateContactInputChange = (e: any) => {
        setCreateContactFormData({
            ...createContactFormData,
            [e.target.name]: e.target.value
        });
    };
    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
    };

    const [header, setHeader] = useState<string[]>([]);
    const handleFileInputClick = () => {
        const fileInput = document.getElementById('file') as HTMLInputElement;
        if (fileInput) {
            fileInput.click();
        }
    };

    const handleFileChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event: any) => {
                const fileContent = event.target.result;
                const rows = fileContent.split('\n').map((row: string) => row.split(','));
                const headers = rows[0].map((header: string) =>
                    header.trim().replace(/\s+/g, '_').toLowerCase()
                );

                setCreateContactData(rows.slice(1));
                setHeader(headers);
            };
            reader.readAsText(file);
        }
    };

    const [savingContact, setSavingContact] = useState(false);
    const handleSaveContacts = async () => {
        setSavingContact(true);

        const data = {
            name: createContactFormData.name,
            description: createContactFormData.description,
            header: JSON.stringify(header),
            content: JSON.stringify(createContactData)
        }

        try {
            const response = await fetchDataFromApi('contact/create', 'POST', data);
            if (response.status) {
                showCustomSuccessAlert(response.message);
                setShowCreateModal(false);
                setCreateContactFormData({name: '', description: '', phoneColumn: ''});
                setCreateContactData(null);
                getContacts();
            } else {
                showCustomErrorAlert(response.message);
            }
            setSavingContact(false);
        } catch (error) {
            setSavingContact(false);
            console.error('Error saving contacts:', error);
        }
    };
    // ======Create Contact Methods END

    // Create campaign methods
    const [showCreateCampaignModal, setShowCreateCampaignModal] = useState(false);
    const handleCloseCreateCampaignModal = () => {
        setShowCreateCampaignModal(false);
    };
    const [createCampaignFormData, setCreateCampaignFormData] = useState({phone_column:'', contact: '', message: '', scheduledDate: '', scheduled: '', status: 'Pending'});
    const onCreateCampaignInputChange = (e: any) => {
        setCreateCampaignFormData({
            ...createCampaignFormData,
            [e.target.name]: e.target.value
        });
    };

    const [customHeader, setCustomHeader] = useState<string[]>([]);
    const onCampaignContactChange = (e: any) => {
        const contactId = e.target.value;
        const selectedContact = contacts.find((c) => c.id == contactId);

        if (selectedContact) {
            console.log(selectedContact.header);
            setCustomHeader(selectedContact.header || []);
        } else {
            console.warn(`Contact with ID ${contactId} not found.`);
            setCustomHeader([]);
        }

        setCreateCampaignFormData({
            ...createCampaignFormData,
            contact: contactId,
        });
    };

    const handleAddHeadToMessage = (e: any) => {
        const headValue = e.target.getAttribute('data-head'); // Get the value of data-head
        if (headValue) {
            const updatedMessage = `${createCampaignFormData.message}{${headValue}}`; // Append {data-head value} to the message
            setCreateCampaignFormData({
                ...createCampaignFormData,
                message: updatedMessage, // Update the message in the form data
            });
        }
    };

    const [savingCampaign, setSavingCampaign] = useState(false);
    async function submitCreateCampaign(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        setSavingCampaign(true);
        const scheduledDate = formatDateTime(createCampaignFormData.scheduledDate);

        const formData = {
            phone_column: createCampaignFormData.phone_column,
            contact: createCampaignFormData.contact,
            message: createCampaignFormData.message,
            scheduledDate: scheduledDate,
            scheduled: createCampaignFormData.scheduled,
            status: createCampaignFormData.status
        }

        try {
            const response = await fetchDataFromApi('campaign/create', 'POST', formData);

            if (response.status) {
                showCustomSuccessAlert(response.message);
                setShowCreateCampaignModal(false);
                setCreateCampaignFormData({ phone_column:'', contact: '', message: '', scheduledDate: '', scheduled: '', status: 'Pending' });
                getCampaigns();
            } else {
                showCustomErrorAlert(response.message);
            }

            setSavingCampaign(false);
        } catch (error) {
            setSavingCampaign(false);
            console.error('Error creating campaign:', error);
        }
    }
    // ======Create campaign methods END

    // Get Contacts and Campaigns
    const [loadingCampaigns, setLoadingCampaigns] = useState(true);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const getCampaigns = async () => {
        setLoadingCampaigns(true);
        try {
            const response = await fetchDataFromApi('campaign/get', 'GET');
            if (response.status) {
                const result: Campaign[] = response.result;
                setCampaigns(result);
            } else {
                console.log(response.message);
            }
            setLoadingCampaigns(false);
        } catch (error) {
            console.log(false)
            setLoadingCampaigns(false);
        }
    }

    const [loadingContacts, setLoadingContacts] = useState(true);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const getContacts = async () => {
        setLoadingContacts(true);
        try {
            const response = await fetchDataFromApi('contact/get', 'GET');
            if (response.status) {
                const result: ContactResponse[] = response.result;
                
                let contacts: Contact[] = [];
                result.forEach((contact) => {
                    contacts.push({
                        id: contact.id,
                        name: contact.name,
                        description: contact.description,
                        header: JSON.parse(contact.header),
                        content: JSON.parse(contact.content),
                        count: JSON.parse(contact.content).length
                    });
                });
                
                setContacts(contacts);
            } else {
                console.log(response.message);
            }
            setLoadingContacts(false);
        } catch (error) {
            console.log(false)
            setLoadingContacts(false);
        }
    }

    useEffect(() => {
        getContacts();
        getCampaigns();
    }, [])

    return (
        <>
        <Row>
            <Col xs={3} className='border rounded bg-light p-3'>
                <div className="d-flex justify-content-between mb-1">
                    <h4>Contacts</h4>
                    <Button variant='primary' onClick={() => setShowCreateModal(true)} className='align-self-center' size='sm'><i className="bx bx-plus"></i></Button>
                </div>

                <div id='contactWrapper'>
                    {loadingContacts && <div className='text-center mt-3'><CircularSpinner/></div>}
                    {!loadingContacts && contacts.length === 0 && <p className='text-center text-muted'>No contacts found</p>}
                    {!loadingContacts && contacts.length != 0 && 
                    <ListGroup variant="flush">
                        {contacts.map((contact, index) => (
                            <ListGroup.Item
                                key={index}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                className='cursor-pointer'
                                onClick={() => showContactDetails(contact)}
                            >
                                <p style={{fontSize: "18px", fontWeight: "bolder"}}>{contact.name}</p>
                                <TruncatedText maxLength={50} text={contact.description}/>
                                <div className="d-flex justify-content-between mt-2">
                                    <span className='text-muted small'>{contact.count} contacts</span>
                                    <span 
                                        className='deleteContact bx bx-trash rounded text-white bg-danger p-1 small cursor-pointer' 
                                        style={{ opacity: hoveredIndex === index ? 1 : 0 }}
                                        onClick={(e) => deleteContact(e, contact.id)}
                                    ></span>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                    }
                </div>
            </Col>

            <Col xs={9}>
                <div className="d-flex justify-content-between mb-1">
                    <h4>Campaigns</h4>
                    <Button variant='primary' onClick={() => setShowCreateCampaignModal(true)} className='align-self-center' size='sm'><i className="bx bx-plus"></i></Button>
                </div>

                <div id='campaignWrapper' className="bg-light rounded p-2">
                    {loadingCampaigns && <div className='text-center mt-3'><CircularSpinner/></div>}
                    {!loadingCampaigns && contacts.length === 0 && <p className='text-center text-muted'>No Campaigns found</p>}
                    {!loadingCampaigns && contacts.length != 0 && 
                    <table className="table table-striped table-hover word-wrap-table table-xlg">
                        <thead className='table-light'>
                            <tr>
                                <th style={{ width: "5%" }}>#</th>
                                <th style={{ width: "20%" }}>Contact</th>
                                <th style={{ width: "40%" }}>Message</th>
                                <th style={{ width: "15%" }}>Status</th>
                                <th style={{ width: "20%" }}>Date</th>
                            </tr>
                        </thead>
                        <tbody className="table-group-divider">
                            {campaigns.map((campaign, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{campaign.contactName}</td>
                                    <td>{campaign.message}</td>
                                    <td>
                                        <span className={`badge ${campaign.status === 'Completed' ? 'bg-success' : 'bg-warning'}`}>
                                            {campaign.status}
                                        </span>
                                    </td>
                                    <td>{campaign.scheduledDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    }
                </div>
            </Col>
        </Row>

        {/* Modal for Contact Details */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg" scrollable={true} centered>
            <Modal.Header closeButton>
                <Modal.Title>Contact Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {selectedContact && (
                    <>
                        <h5>{selectedContact.name}</h5>
                        <p>{selectedContact.description}</p>
                        <p><strong>Contact Count:</strong> {selectedContact.count}</p>

                        <Table striped hover>
                        <thead>
                            <tr>
                            {selectedContact.header.map((head:any, index:number) => (
                                <th key={index}>{head}</th>
                            ))}
                            </tr>
                        </thead>
                        <tbody>
                            {selectedContact.content.map((contact: any, index: number) => (
                                <tr key={index}>
                                    {selectedContact.header.map((head: string, index:number) => (
                                        <td key={index}>{contact[index]}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                        </Table>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>

        {/* Add Contact Modal */}
        <Modal show={showCreateModal} onHide={handleCloseCreateModal} size="lg" scrollable={true} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add Contact</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row className='mb-3'>
                        <Col md={6}>
                            <Form.Group controlId="name">
                                <Form.Label>Name<span className='text-danger'>*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={createContactFormData.name}
                                    onChange={onCreateContactInputChange}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group controlId="description">
                                <Form.Label>Brief Description<span className='text-danger'>*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="description"
                                    value={createContactFormData.description}
                                    onChange={onCreateContactInputChange}
                                />
                            </Form.Group>

                            <Form.Control onChange={(e) => handleFileChange(e)} type="file" id='file' size="sm" style={{display: "none"}} />
                        </Col>
                    </Row>
                   
                    <Row>
                        <Col md={12}>
                            <div style={{height: "280px", overflow:"auto"}}>
                                {createContactData && (
                                    <Table striped hover>
                                    <thead>
                                        <tr>
                                            {header.map((head, index) => (
                                                <th key={index}>{head}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {createContactData && createContactData.map((contact: any, index: number) => (
                                            <tr key={index}>
                                                {header.map((head, index) => (
                                                    <td key={index}>{contact[index]}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                    </Table>
                                )}

                                <div className="text-center mt-2">
                                    <Button onClick={handleFileInputClick} variant='secondary' id='chooseFile'><i className="bx bx-folder"></i> Choose File</Button>
                                </div>
                            </div>

                            <div className="text-center mt-2">
                                <Button onClick={handleSaveContacts} className='me-3' type='button' variant='primary' disabled={savingContact}> {savingContact ? <ButtonLoader/> : 'Create Contact'}</Button>
                                <Button onClick={handleCloseCreateModal} type="button" variant='light'> Close</Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>

        {/* Create Campaign Modal */}
        <Modal show={showCreateCampaignModal} onHide={handleCloseCreateCampaignModal} size="lg" centered>
            <Modal.Body className='p-4'>
                <h1 className='text-center mb-5'>Create Campaign</h1>
                <Form onSubmit={submitCreateCampaign}>
                    <Row className='mb-3'>
                        <Col md={6}>
                            <Form.Group controlId="contact">
                                <Form.Label>Contact<span className='text-danger'>*</span></Form.Label>
                                <Form.Select
                                    name='contact'
                                    onChange={(e) => onCampaignContactChange(e)}
                                    value={createCampaignFormData.contact}
                                    required
                                    aria-label="Contact">
                                    <option value="">Choose contact...</option>
                                    {contacts.map((contact, index) => (
                                        <option key={index} value={contact.id}>{contact.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group controlId="scheduled">
                                <Form.Label>Scheduled Type<span className='text-danger'>*</span></Form.Label>
                                <Form.Select
                                    name='scheduled'
                                    onChange={onCreateCampaignInputChange}
                                    value={createCampaignFormData.scheduled}
                                    required
                                    aria-label="scheduled">
                                    <option value="">Choose type...</option>
                                    <option value="save">Save for Later</option>
                                    <option value="scheduled">Schedule</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className='mb-3'>
                        <Col md={12}>
                            <Form.Group controlId="message">
                                <Form.Label>Message<span className='text-danger'>*</span></Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="message"
                                    onChange={onCreateCampaignInputChange}
                                    value={createCampaignFormData.message}
                                    required
                                />
                            </Form.Group>

                            <div className='mt-2'>
                                {customHeader.length > 0 && (
                                    customHeader.map((head, index) => (
                                        <span onClick={handleAddHeadToMessage} className='addHeadToMessage bg-primary-light badge cursor-pointer me-2' data-head={head}>{head}</span>
                                    ))
                                )}
                            </div>
                        </Col>
                    </Row>

                    <Row>
                    <Col md={6}>
                            <Form.Group controlId="phone_column">
                                <Form.Label>Phone Column<span className='text-danger'>*</span></Form.Label>
                                <Form.Select
                                    name='phone_column'
                                    onChange={onCreateCampaignInputChange}
                                    value={createCampaignFormData.phone_column}
                                    required
                                    aria-label="phone_column">
                                    <option value="">Choose column...</option>
                                    {customHeader.map((head, index) => (
                                        <option key={index} value={head}>{head}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group controlId="message">
                                <Form.Label>Scheduled Date<span className='text-danger'>*</span></Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="scheduledDate"
                                    onChange={onCreateCampaignInputChange}
                                    value={createCampaignFormData.scheduledDate}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                   
                    <Row>
                        <Col md={12} className='text-center mt-3'>
                            <Form.Group controlId="formFirstName">
                                <Button variant='primary' type="submit" className='me-2' disabled={savingCampaign}> {savingCampaign ? <ButtonLoader/> : 'Create Campaign'}</Button>
                                <Button variant='secondary' onClick={handleCloseCreateCampaignModal}>Close</Button>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
        </>
    )
}