import React, { useState, useEffect } from "react";
import { FaStar, FaRegStar, FaHeart, FaRegHeart, FaComment, FaReply, FaTimes } from "react-icons/fa";
import BlurContainer from "../components/blurContainer";
import Button from "../components/button";
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const ReviewsPage = () => {
  const [allreviews, setAllReviews] = useState([]);
  const [activeModal, setActiveModal] = useState({
    type: null, 
    reviewId: null,
    comment: null
  });
  const [file, setFile] = useState();
  const [description, setDescription] = useState();
  const [rating, setRating] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [commentText, setCommentText] = useState("");

  const accessToken = localStorage.getItem('token');
  const config = {
    headers: {
      'Authorization': `Bearer ${accessToken}`, 
    }
  };


  const getAllReviews = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/review/getreviews", config);
      setAllReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Erreur lors du chargement des avis");
    }
  };

  const getCurrentUser = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/review/me", config);
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  useEffect(() => {
    getAllReviews();
    getCurrentUser();
  }, []);

  const openCommentsModal = (reviewId) => {
    setActiveModal({
      type: 'comments',
      reviewId,
      comment: null
    });
  };

  const openReplyModal = (reviewId, comment) => {
    setActiveModal({
      type: 'reply',
      reviewId,
      comment
    });
  };

  const closeModal = () => {
    setActiveModal({
      type: null,
      reviewId: null,
      comment: null
    });
  };

  const likeReview = async (reviewId) => {
    try {
      await axios.put(`http://localhost:5000/api/review/like/${reviewId}`, {}, config);
      getAllReviews();
    } catch (error) {
      console.error("Error liking review:", error);
      toast.error("Erreur lors du like");
    }
  };

  const addComment = async (reviewId) => {
    if (!commentText.trim()) return;
    
    try {
      await axios.post(`http://localhost:5000/api/review/comment/${reviewId}`, {
        text: commentText
      }, config);
      
      setCommentText("");
      getAllReviews(); 
      
      if (activeModal.type === 'comments') {
        closeModal();
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Erreur lors de l'ajout du commentaire");
    }
  };

  const addReply = async (replyText) => {
    if (!replyText.trim()) return;

    try {
      await axios.post(
        `http://localhost:5000/api/review/comment/${activeModal.reviewId}/reply/${activeModal.comment._id}`,
        { text: replyText },
        config
      );
      
      closeModal();
      getAllReviews(); 
    } catch (error) {
      console.error("Error adding reply:", error);
      toast.error("Erreur lors de l'ajout de la réponse");
    }
  };

  const uploadReview = async () => {
    try {
      const formData = new FormData();
      
      if (!rating || rating === 0) {
        toast.error("Veuillez donner une note");
        return;
      }
      formData.append("rating", rating);

      if (!description || description.trim().length === 0) {
        toast.error("Veuillez écrire une description");
        return;
      }
      formData.append("description", description);

      if (!file) {
        toast.error("Veuillez sélectionner une image");
        return;
      }
      formData.append("file", file);

      await axios.post("http://localhost:5000/api/review/createdrec", formData, config);
      
      toast.success("Avis créé avec succès");
      setDescription("");
      setRating(0);
      setFile(null);
      getAllReviews(); 
    } catch (error) {
      console.error("Error creating review:", error);
      toast.error("Erreur lors de la création de l'avis");
    }
  };
  const getCurrentReview = () => {
    return allreviews.find(r => r._id === activeModal.reviewId);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center py-10 px-4 sm:px-6 lg:px-16 bg-cover bg-center"
      style={{ backgroundImage: "url('/bg.jpg')" }}>
      
      <Toaster position="top-right" />
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative z-10 w-full max-w-4xl text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 pt-24">
          Avis des Clients
        </h1>

        {currentUser && (
          <BlurContainer className="w-full p-6 rounded-2xl bg-black bg-opacity-60 mb-8">
            <h2 className="text-white text-xl mb-4">Ajoutez votre avis</h2>
            <textarea
              className="w-full p-2 rounded-md mb-2 bg-gray-800 text-white"
              placeholder="Décrivez votre expérience..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              className="mb-2 text-white"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <div className="flex space-x-1 mb-4 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="text-2xl"
                >
                  {star <= rating ? (
                    <FaStar className="text-yellow-500" />
                  ) : (
                    <FaRegStar className="text-gray-400" />
                  )}
                </button>
              ))}
            </div>
            <Button
              onClick={uploadReview}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-full transition"
            >
              Publier
            </Button>
          </BlurContainer>
        )}

        {/* Liste des avis */}
        <div className="w-full space-y-6">
          {allreviews.map((review) => (
            <BlurContainer key={review._id} className="p-6 rounded-xl bg-black bg-opacity-70">
              {/* En-tête de la review */}
              <div className="flex items-start mb-4">
                <img 
                  src={`http://localhost:5000/reviews/${review.user.profilePic}`}
                  alt={review.user.firstName} 
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div className="text-left">
                  <div className="text-white font-semibold">{review.user.firstName} {review.user.lastName}</div>
                  <div className="flex items-center mb-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-500 text-sm" />
                    ))}
                  </div>
                  <div className="text-white text-sm">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              {/* Contenu de la review */}
              <p className="text-white mb-4 text-left">{review.description}</p>
              
              {/* Image de la review */}
              {review.image && (
                <img
                  src={`http://localhost:5000/reviews/${review.image}`}
                  alt="Review"
                  className="rounded-lg w-full mb-4 max-h-80 object-cover"
                />
              )}
              
              {/* Actions (like, comment) */}
              <div className="flex items-center space-x-6 text-white mb-4 border-t border-gray-700 pt-3">
                <button 
                  onClick={() => likeReview(review._id)}
                  className="flex items-center space-x-1 hover:text-red-400 transition"
                >
                  {review.likes.some(like => like._id === currentUser?._id) ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart />
                  )}
                  <span>{review.likes.length}</span>
                </button>
                <button 
                  onClick={() => openCommentsModal(review._id)}
                  className="flex items-center space-x-1 hover:text-blue-400 transition"
                >
                  <FaComment />
                  <span>{review.comments.length}</span>
                </button>
              </div>

              {/* Aperçu du premier commentaire */}
              {review.comments.length > 0 && (
                <div className="text-left text-white mb-4">
                  <div className="bg-gray-800 bg-opacity-60 p-3 rounded-md">
                    <div className="flex items-start mb-1">
                      <img 
                        src={`http://localhost:5000/reviews/${review.comments[0].user.profilePic}`}
                        alt={review.comments[0].user.firstName} 
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <div>
                        <div className="font-semibold text-sm">
                          {review.comments[0].user.firstName} {review.comments[0].user.lastName}
                        </div>
                        <p className="text-sm">{review.comments[0].text}</p>
                      </div>
                    </div>
                    
                    {review.comments.length > 1 && (
                      <button 
                        onClick={() => openCommentsModal(review._id)}
                        className="text-xs text-blue-400 hover:text-blue-300 mt-2"
                      >
                        Voir les {review.comments.length - 1} commentaires supplémentaires
                      </button>
                    )}
                  </div>
                </div>
              )}

              {currentUser && (
                <div className="flex items-center gap-2">
                  <img 
                    src={`http://localhost:5000/reviews/${currentUser.profilePic}`}
                    alt="Vous" 
                    className="w-8 h-8 rounded-full"
                  />
                  <input
                    type="text"
                    placeholder="Ajouter un commentaire..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-full bg-gray-700 text-white text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && addComment(review._id)}
                  />
                  <Button
                    onClick={() => addComment(review._id)}
                    className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition"
                  >
                    Envoyer
                  </Button>
                </div>
              )}
            </BlurContainer>
          ))}
        </div>
      </div>

      {activeModal.type === 'comments' && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <BlurContainer className="w-full max-w-2xl p-6 rounded-xl bg-black bg-opacity-80 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-black bg-opacity-90 py-2 z-10">
              <h3 className="text-white text-lg font-semibold">Commentaires</h3>
              <button 
                onClick={closeModal}
                className="text-white hover:text-gray-300"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="space-y-4">
              {getCurrentReview()?.comments.map((comment) => (
                <div key={comment._id} className="bg-gray-800 p-4 rounded-md">
                  <div className="flex items-start">
                    <img 
                      src={`http://localhost:5000/reviews/${comment.user.profilePic}`}
                      alt={comment.user.firstName} 
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-white">
                        {comment.user.firstName} {comment.user.lastName}
                      </div>
                      <p className="text-white text-sm mt-1">{comment.text}</p>
                      
                      <button 
                        onClick={() => openReplyModal(activeModal.reviewId, comment)}
                        className="text-xs text-blue-400 hover:text-blue-300 mt-2 flex items-center"
                      >
                        <FaReply className="mr-1" /> Répondre
                      </button>
                      
                      {comment.replies.length > 0 && (
                        <div className="ml-6 mt-3 space-y-3">
                          {comment.replies.map((reply) => (
                            <div key={reply._id} className="bg-gray-700 p-3 rounded-md">
                              <div className="flex items-start">
                                <img 
                                  src={`http://localhost:5000/reviews/${reply.user.profilePic}`}
                                  alt={reply.user.firstName} 
                                  className="w-8 h-8 rounded-full mr-2"
                                />
                                <div>
                                  <div className="font-semibold text-sm text-white">
                                    {reply.user.firstName} {reply.user.lastName}
                                  </div>
                                  <p className="text-sm text-white mt-1">{reply.text}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {currentUser && (
              <div className="flex items-center gap-2 mt-6 sticky bottom-0 bg-black bg-opacity-90 py-3">
                <img 
                  src={`http://localhost:5000/reviews/${currentUser.profilePic}`}
                  alt="Vous" 
                  className="w-10 h-10 rounded-full"
                />
                <input
                  type="text"
                  placeholder="Ajouter un commentaire..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-full bg-gray-700 text-white"
                  onKeyPress={(e) => e.key === 'Enter' && addComment(activeModal.reviewId)}
                />
                <Button
                  onClick={() => addComment(activeModal.reviewId)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition"
                >
                  Envoyer
                </Button>
              </div>
            )}
          </BlurContainer>
        </div>
      )}

      {activeModal.type === 'reply' && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <BlurContainer className="w-full max-w-md p-6 rounded-xl bg-black bg-opacity-80">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-lg font-semibold">Répondre au commentaire</h3>
              <button 
                onClick={closeModal}
                className="text-white hover:text-gray-300"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="bg-gray-800 p-3 rounded-md mb-4">
              <div className="flex items-start">
                <img 
                  src={`http://localhost:5000/reviews/${activeModal.comment.user.profilePic}`}
                  alt={activeModal.comment.user.firstName} 
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div>
                  <div className="font-semibold text-sm text-white">
                    {activeModal.comment.user.firstName} {activeModal.comment.user.lastName}
                  </div>
                  <p className="text-sm text-white">{activeModal.comment.text}</p>
                </div>
              </div>
            </div>
            
            {currentUser && (
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src={`http://localhost:5000/reviews/${currentUser.profilePic}`}
                  alt="Vous" 
                  className="w-8 h-8 rounded-full"
                />
                <input
                  type="text"
                  placeholder="Écrire une réponse..."
                  id="replyInput"
                  className="flex-1 px-3 py-2 rounded-full bg-gray-700 text-white text-sm"
                  autoFocus
                  onChange={(e) => setCommentText(e.target.value)}
                />
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              <Button
                onClick={closeModal}
                className="text-sm bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-full transition"
              >
                Annuler
              </Button>
              <Button
                onClick={() => {
                  const replyText = document.getElementById('replyInput').value;
                  addReply(replyText);
                }}
                className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition"
              >
                Répondre
              </Button>
            </div>
          </BlurContainer>
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;