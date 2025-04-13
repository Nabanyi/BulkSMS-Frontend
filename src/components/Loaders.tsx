import { Spinner } from "react-bootstrap";

export const ButtonLoader = () => {
  return (
    <><i className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></i> Loading</>
  );
}

export const BtnSpinner = () => {
  return (
    <i className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></i>
  );
}

export const CircularSpinner = () => {
  return (
    <Spinner className='text-primary' animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}