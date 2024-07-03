import React from 'react';
import { Button } from 'react-bootstrap'; // Import Bootstrap button component

const Pagination = ({ goToNextPage, goToPrevPage }) => (
  <div className="d-flex justify-content-center mt-5">
    {goToPrevPage && (
      <Button variant="outline-dark" className="me-2" onClick={goToPrevPage}>
        Previous
      </Button>
    )}
    {goToNextPage && (
      <Button variant="outline-dark" onClick={goToNextPage}>
        Next
      </Button>
    )}
  </div>
);

export default Pagination;