import { useState, useEffect } from 'react';
import { Col, ListGroup, Row, Form, Button } from 'react-bootstrap';
import { showCustomErrorAlert, showCustomSuccessAlert } from '../Helper';
import { fetchDataFromApi } from '../ApiHelper';
import { ButtonLoader } from '../components/Loaders';

interface AuthUser {
    id: string;
    username: string;
    role: string;
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    phone: string;
    address: string;
    token: string;
    refreshToken: string;
}

export const Account = () => {
    const [user, setUser] = useState<AuthUser | null>(null);

    useEffect(() => {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData) as AuthUser);
      }
    }, []);

    const handleProfileDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (user) {
        setUser({
          ...user,
          [e.target.name]: e.target.value
        });
      }
    };

    const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
    const submitProfileForm = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (user) {
          setIsSubmittingProfile(true)

          const formData = {
            "username": user.username,
            "email": user.email,
            "phone": user.phone,
            "address": user.address,
            "firstname": user.firstName,
            "middlename": user.middleName,
            "lastname": user.lastName
          }
          
          try {
              const response = await fetchDataFromApi('auth/update', 'POST', formData);
              if (response.status) {
                  localStorage.setItem('user', JSON.stringify(user));
                  setIsSubmittingProfile(false);
                  showCustomSuccessAlert(response.message);
              } else {
                setIsSubmittingProfile(false);
                  showCustomErrorAlert(response.message);
              }
          } catch (error) {
            setIsSubmittingProfile(false)
          }          
        }
    };

    // update password
    const [password, setPassword] = useState({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword({
        ...password,
        [e.target.name]: e.target.value
      });
    };

    const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
    const handleSubmitPassword = async(e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (password.newPassword !== password.confirmPassword) {
        showCustomErrorAlert('Passwords do not match!');
        return;
      }

      setIsSubmittingPassword(true)
      const newPassword = {
        "current_password": password.currentPassword,
        "new_password": password.newPassword,
        "confirm_password": password.confirmPassword,
      };

      try {
        const response = await fetchDataFromApi('auth/update-password', 'POST', newPassword);
        if (response.status) {
          setIsSubmittingPassword(false);
          showCustomSuccessAlert(response.message);
          window.location.reload();
        } else {
          setIsSubmittingPassword(false);
          showCustomErrorAlert(response.message);
        }
      } catch (error) {
        setIsSubmittingPassword(false)
      } 
    };

    return (
      <>
        <Row>
          <Col sm={12} md={3}>
            <div className='border bg-light p-3 fixed-sidebar'>
              <ListGroup>
                  <ListGroup.Item action href="#profile">Your Profile</ListGroup.Item>
                  <ListGroup.Item action href="#passwords">Change Password</ListGroup.Item>
              </ListGroup>
            </div>
          </Col>

          <Col sm={12} md={9}>
            {/* Profile Row */}
            <Row id='profile' className='mb-5'>
              <div className='p-4 bg-light rounded'>
              <h1 className='mb-4'>Update Profile</h1>
              <Form onSubmit={submitProfileForm}>
                  <Col md={6} className='mb-3'>
                  <Form.Group controlId="formUsername">
                    <Form.Label>Username<span className='text-danger'>*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={user?.username}
                      onChange={handleProfileDataChange}
                      readOnly
                    />
                  </Form.Group>
                  </Col>

                  <Row className='mb-3'>
                  <Col md={4}>
                  <Form.Group controlId="formFirstName">
                      <Form.Label>First Name<span className='text-danger'>*</span></Form.Label>
                      <Form.Control
                          type="text"
                          name="firstName"
                          value={user?.firstName}
                          onChange={handleProfileDataChange}
                      />
                  </Form.Group>
                  </Col>

                  <Col md={4}>
                  <Form.Group controlId="formLastName">
                      <Form.Label>Last Name<span className='text-danger'>*</span></Form.Label>
                      <Form.Control
                          type="text"
                          name="lastName"
                          value={user?.lastName}
                          onChange={handleProfileDataChange}
                      />
                  </Form.Group>
                  </Col>

                  <Col md={4}>
                  <Form.Group controlId="formMiddleName">
                      <Form.Label>Middle Name<span className='text-danger'>*</span></Form.Label>
                      <Form.Control
                          type="text"
                          name="middleName"
                          value={user?.middleName}
                          onChange={handleProfileDataChange}
                      />
                  </Form.Group>
                  </Col>
                  </Row>

                  <Row className='mb-3'>
                  <Col md={6}>
                  <Form.Group controlId="formEmail">
                      <Form.Label>Email<span className='text-danger'>*</span></Form.Label>
                      <Form.Control
                          type="email"
                          name="email"
                          value={user?.email}
                          onChange={handleProfileDataChange}
                      />
                  </Form.Group>
                  </Col>

                  <Col md={6}>
                  <Form.Group controlId="formPhone">
                      <Form.Label>Phone<span className='text-danger'>*</span></Form.Label>
                      <Form.Control
                          type="text"
                          name="phone"
                          value={user?.phone}
                          onChange={handleProfileDataChange}
                      />
                  </Form.Group>
                  </Col>
                  </Row>

                  <Form.Group controlId="formAddress">
                      <Form.Label>Address<span className='text-danger'>*</span></Form.Label>
                      <Form.Control
                          type="text"
                          name="address"
                          value={user?.address}
                          onChange={handleProfileDataChange}
                      />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="mt-3" disabled={isSubmittingProfile}>
                    {isSubmittingProfile ? (<ButtonLoader/>) : ("Update Profile")}
                  </Button>
              </Form>
              </div>
              
            </Row>

            {/* Password Row */}
            <Row id='passwords' className='mb-5'>
            <div className='p-4 bg-light rounded'>
                <h1 className='mb-4'>Update Password</h1>
                <Form onSubmit={handleSubmitPassword}>
                    <Col md={6} className='mb-3'>
                    <Form.Group controlId="formPassword">
                      <Form.Label>Current Password<span className='text-danger'>*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="currentPassword"
                        value={password.currentPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </Form.Group>
                    </Col>

                    <Col md={6} className='mb-3'>
                    <Form.Group controlId="formNewPassword">
                      <Form.Label>New Password<span className='text-danger'>*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="newPassword"
                        value={password.newPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </Form.Group>
                    </Col>

                    <Col md={6} className='mb-3'>
                    <Form.Group controlId="formConfirmPassword">
                      <Form.Label>Confirm Password<span className='text-danger'>*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="confirmPassword"
                        value={password.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </Form.Group>
                    </Col>

                    <Button variant="primary" type="submit" className="mt-3" disabled={isSubmittingPassword}>
                        {isSubmittingPassword ? (<ButtonLoader/>) : ("Update Password")}
                    </Button>
                </Form>
                </div>
            </Row>
          </Col>
      </Row>
    </>
  );
};