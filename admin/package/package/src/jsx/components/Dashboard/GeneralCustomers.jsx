import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

function PendingReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const sort = 10;
  const activePag = useRef(0);
  const [test, settest] = useState(0);

  // Fetch pending reviews
  const fetchPendingReviews = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/review/pending", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setReviews(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Erreur de chargement des reviews");
      setLoading(false);
    }
  };

  const updateReviewStatus = async (reviewId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/review/${reviewId}/state`,
        { etat: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      toast.success(`Review ${newStatus ? "approuvée" : "rejetée"}`);
      fetchPendingReviews();
    } catch (error) {
      toast.error("Erreur de mise à jour");
    }
  };


  const updateReview = async (reviewId, newStatus) => {
    try {
      await axios.delete(`http://localhost:5000/api/review/delete/${reviewId}`);
      toast.success(`Review ${newStatus ? "approuvée" : "rejetée"}`);
      fetchPendingReviews();
    } catch (error) {
      toast.error("Erreur de mise à jour");
    }
  };


  useEffect(() => {
    fetchPendingReviews();
  }, []);

  // Pagination functions (keep your existing logic)
  const chageData = (frist, sec) => {
    // ... votre logique existante ...
  };

  const onClick = (i) => {
    // ... votre logique existante ...
  };

  if (loading) return <div className="text-center py-5">Chargement...</div>;

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h4 className="card-title">Reviews en attente</h4>
            <Dropdown>
              <Dropdown.Toggle variant="primary" id="dropdown-basic">
                <i className="fas fa-filter me-2" /> Filtres
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => fetchPendingReviews()}>
                  Toutes
                </Dropdown.Item>
                <Dropdown.Item onClick={() => {/* Filtrer par date */}}>
                  Plus récentes
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Auteur</th>
                    <th>Description</th>
                    <th>Note</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        Aucune review en attente
                      </td>
                    </tr>
                  ) : (
                    reviews.map((review) => (
                      <tr key={review._id}>
                        <td>#{review._id.slice(-6)}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                  src={`http://localhost:5000/reviews/${review.image}`}
                  alt={review.user.firstName}
                              className="rounded-circle me-3"
                              width="40"
                              height="40"
                            />
                            {review.user.firstName} {review.user.lastName}
                          </div>
                        </td>
                        <td className="text-truncate" style={{ maxWidth: "200px" }}>
                          {review.description}
                        </td>
                        <td>
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`fas fa-star ${
                                i < review.rating ? "text-warning" : "text-secondary"
                              }`}
                            />
                          ))}
                        </td>
                        <td>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <div className="d-flex">
                            <button
                              className="btn btn-success btn-sm me-2"
                              onClick={() => updateReviewStatus(review._id, true)}
                            >
                              <i className="fas fa-check" /> Approuver
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => updateReview(review._id, false)}
                            >
                              <i className="fas fa-times" /> Rejeter
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination (keep your existing markup) */}
            <div className="d-sm-flex text-center justify-content-between align-items-center mt-3">
              <div className="dataTables_info">
                Showing {activePag.current * sort + 1} to{" "}
                {Math.min((activePag.current + 1) * sort, reviews.length)} of{" "}
                {reviews.length} entries
              </div>
              <div className="dataTables_paginate paging_simple_numbers">
                <Link
                  className="paginate_button previous disabled"
                  to="#"
                  onClick={() =>
                    activePag.current > 0 && onClick(activePag.current - 1)
                  }
                >
                  Previous
                </Link>
                <span>
                  {Array.from({ length: Math.ceil(reviews.length / sort) }).map(
                    (_, i) => (
                      <Link
                        key={i}
                        to="#"
                        className={`paginate_button ${
                          activePag.current === i ? "current" : ""
                        }`}
                        onClick={() => onClick(i)}
                      >
                        {i + 1}
                      </Link>
                    )
                  )}
                </span>
                <Link
                  className="paginate_button next"
                  to="#"
                  onClick={() =>
                    activePag.current + 1 < Math.ceil(reviews.length / sort) &&
                    onClick(activePag.current + 1)
                  }
                >
                  Next
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PendingReviews;