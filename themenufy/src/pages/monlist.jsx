import React, { useState, useEffect } from "react";
import { FaStar, FaRegStar, FaHeart, FaRegHeart, FaComment, FaReply, FaTimes, FaEdit, FaTrash, FaCrown } from "react-icons/fa";
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
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [commentText, setCommentText] = useState("");
  
  // États pour l'édition
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [editingReview, setEditingReview] = useState(null);
  const [editReviewText, setEditReviewText] = useState("");
  const [editRating, setEditRating] = useState(0);

  const accessToken = localStorage.getItem('token');
  const config = {
    headers: {
      'Authorization': `Bearer ${accessToken}`, 
    }
  };

  const getAllReviews = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/review/getreviewsByuser", config);
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

  const updateComment = async (reviewId, commentId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/review/${reviewId}/comments/${commentId}`,
        { text: editCommentText },
        config
      );
      setEditingComment(null);
      getAllReviews();
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error("Erreur lors de la modification du commentaire");
    }
  };

  const deleteComment = async (reviewId, commentId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/review/${reviewId}/comments/${commentId}`,
        config
      );
      getAllReviews();
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Erreur lors de la suppression du commentaire");
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


  const updateReview = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/review/${editingReview}`,
        {
          description: editReviewText,
          rating: editRating
        },
        config
      );
      setEditingReview(null);
      getAllReviews();
      toast.success("Avis modifié avec succès");
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Erreur lors de la modification de l'avis");
    }
  };

  const deleteReview = async (reviewId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet avis ?")) {
      try {
        await axios.delete(
          `http://localhost:5000/api/review/${reviewId}`,
          config
        );
        getAllReviews();
        toast.success("Avis supprimé avec succès");
      } catch (error) {
        console.error("Error deleting review:", error);
        toast.error("Erreur lors de la suppression de l'avis");
      }
    }
  };




  const deleteReply = async (reviewId , commentId ,  replyId ) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet avis ?")) {
      try {
        await axios.delete(
          `http://localhost:5000/api/review/${reviewId}/comments/${commentId}/replies/${replyId}`,
          config
        );
        getAllReviews();
        toast.success("Avis supprimé avec succès");
      } catch (error) {
        console.error("Error deleting review:", error);
        toast.error("Erreur lors de la suppression de l'avis");
      }
    }
  };

  const [editingReply, setEditingReply] = useState({
    reviewId: null,
    commentId: null,
    replyId: null,
    text: ''
  });
  const getCurrentReview = () => {
    return allreviews.find(r => r._id === activeModal.reviewId);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center py-10 px-4 sm:px-6 lg:px-16 bg-cover bg-center"
      style={{ backgroundImage: "url('/bg.jpg')" }}>
      
      <Toaster position="top-right" />
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative z-10 w-full max-w-4xl text-center">


        {currentUser && (
          <BlurContainer className="w-full p-6 rounded-2xl bg-black bg-opacity-60 mb-8">
          </BlurContainer>
        )}
            
                  {/* En-tête de la page */}
      <section className="text-white py-16">
        <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold sm:text-4xl">  Mes Liste des avis </h2>
          <p className="mt-4 text-lg"></p>
        </div>
      </section>

        {/* Liste des avis */}
        <div className="w-full space-y-6">
          {allreviews.map((review) => (
            <BlurContainer key={review._id} className="p-6 rounded-xl bg-black bg-opacity-70 relative">
              {/* Boutons d'action pour le propriétaire de la review */}
              {currentUser?._id === review.user._id && (
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button 
                    onClick={() => {
                      setEditingReview(review._id);
                      setEditReviewText(review.description);
                      setEditRating(review.rating);
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    onClick={() => deleteReview(review._id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
              
              <div className="flex items-start mb-4">
                <div className="flex items-start">
                  <div className="relative">
                    <img 
                      src={`http://localhost:5000/reviews/${review.user.profilePic}`}
                      alt={review.user.firstName} 
                      className="w-12 h-12 rounded-full mr-3"
                    />
                    {review.user.isTopReviewer && (
                      <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold px-1 rounded-full flex items-center">
                        <FaCrown className="mr-1" size={10} />
                        TOP
                      </div>
                    )}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center">
                      <div className="text-white font-semibold">
                        {review.user.firstName} {review.user.lastName}
                      </div>
                    </div>
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
              </div>
              
              <p className="text-white mb-4 text-left">{review.description}</p>
              
              {review.image && (
                <img
                  src={`http://localhost:5000/reviews/${review.image}`}
                  alt="Review"
                  className="rounded-lg w-full mb-4 max-h-80 object-cover"
                />
              )}
              
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

              {/* Affichage du premier commentaire */}
              {review.comments.length > 0 && (
                <div className="text-left text-white mb-4">
                  <div className="bg-gray-800 bg-opacity-60 p-3 rounded-md relative">
                    {review.comments[0].user._id === currentUser?._id && (
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <button 
                          onClick={() => {
                            setEditingComment(review.comments[0]._id);
                            setEditCommentText(review.comments[0].text);
                          }}
                          className="text-xs text-gray-400 hover:text-white"
                        >
                          Modifier
                        </button>
                        <button 
                          onClick={() => deleteComment(review._id, review.comments[0]._id)}
                          className="text-xs text-gray-400 hover:text-red-500"
                        >
                          Supprimer
                        </button>
                      </div>
                    )}
                    
                    {editingComment === review.comments[0]._id ? (
                      <div className="mb-2">
                        <input
                          type="text"
                          value={editCommentText}
                          onChange={(e) => setEditCommentText(e.target.value)}
                          className="w-full p-2 bg-gray-700 text-white rounded"
                        />
                        <div className="flex justify-end mt-2 space-x-2">
                          <button 
                            onClick={() => setEditingComment(null)}
                            className="px-3 py-1 bg-gray-600 rounded text-sm"
                          >
                            Annuler
                          </button>
                          <button 
                            onClick={() => updateComment(review._id, review.comments[0]._id)}
                            className="px-3 py-1 bg-blue-500 rounded text-sm"
                          >
                            Enregistrer
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start">
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
                    )}
                    
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

      {/* Modal des commentaires */}
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
                <div key={comment._id} className="bg-gray-800 p-4 rounded-md relative">
                  {comment.user._id === currentUser?._id && (
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button 
                        onClick={() => {
                          setEditingComment(comment._id);
                          setEditCommentText(comment.text);
                        }}
                        className="text-xs text-gray-400 hover:text-white"
                      >
                        Modifier
                      </button>
                      <button 
                        onClick={() => deleteComment(activeModal.reviewId, comment._id)}
                        className="text-xs text-gray-400 hover:text-red-500"
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                  
                  {editingComment === comment._id ? (
                    <div className="mb-2">
                      <input
                        type="text"
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                        className="w-full p-2 bg-gray-700 text-white rounded"
                      />
                      <div className="flex justify-end mt-2 space-x-2">
                        <button 
                          onClick={() => setEditingComment(null)}
                          className="px-3 py-1 bg-gray-600 rounded text-sm"
                        >
                          Annuler
                        </button>
                        <button 
                          onClick={() => updateComment(activeModal.reviewId, comment._id)}
                          className="px-3 py-1 bg-blue-500 rounded text-sm"
                        >
                          Enregistrer
                        </button>
                      </div>
                    </div>
                  ) : (
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
      <div key={reply._id} className="bg-gray-700 p-3 rounded-md relative">
        {reply.user._id === currentUser?._id && (
          <div className="absolute top-2 right-2 flex space-x-2">
            <button 
              onClick={() => {
                setEditingReply({
                  reviewId: activeModal.reviewId,
                  commentId: comment._id,
                  replyId: reply._id,
                  text: reply.text
                });
              }}
              className="text-xs text-gray-400 hover:text-white"
            >
              Modifier
            </button>
            <button 
              onClick={() => {
                if (window.confirm("Êtes-vous sûr de vouloir supprimer cette réponse ?")) {
                  deleteReply(activeModal.reviewId, comment._id, reply._id);
                }
              }}
              className="text-xs text-gray-400 hover:text-red-500"
            >
              Supprimer
            </button>
          </div>
        )}
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
                  )}
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
      {editingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <BlurContainer className="w-full max-w-md p-6 rounded-xl bg-black bg-opacity-80">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-lg font-semibold">Modifier l'avis</h3>
              <button 
                onClick={() => setEditingReview(null)}
                className="text-white hover:text-gray-300"
              >
                <FaTimes />
              </button>
            </div>
            
            <textarea
              className="w-full p-2 rounded-md mb-4 bg-gray-800 text-white"
              value={editReviewText}
              onChange={(e) => setEditReviewText(e.target.value)}
            />
            
            <div className="flex space-x-1 mb-4 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setEditRating(star)}
                  className="text-2xl"
                >
                  {star <= editRating ? (
                    <FaStar className="text-yellow-500" />
                  ) : (
                    <FaRegStar className="text-gray-400" />
                  )}
                </button>
              ))}
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => setEditingReview(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-full"
              >
                Annuler
              </Button>
              <Button
                onClick={updateReview}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full"
              >
                Enregistrer
              </Button>
            </div>
          </BlurContainer>
        </div>
      )}
      {/* Modal de modification de réponse */}
{editingReply.replyId && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
    <BlurContainer className="w-full max-w-md p-6 rounded-xl bg-black bg-opacity-80">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white text-lg font-semibold">Modifier la réponse</h3>
        <button 
          onClick={() => setEditingReply({
            reviewId: null,
            commentId: null,
            replyId: null,
            text: ''
          })}
          className="text-white hover:text-gray-300"
        >
          <FaTimes />
        </button>
      </div>
      
      <textarea
        className="w-full p-2 rounded-md mb-4 bg-gray-800 text-white"
        value={editingReply.text}
        onChange={(e) => setEditingReply({...editingReply, text: e.target.value})}
        autoFocus
      />
      
      <div className="flex justify-end space-x-2">
        <Button
          onClick={() => setEditingReply({
            reviewId: null,
            commentId: null,
            replyId: null,
            text: ''
          })}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-full"
        >
          Annuler
        </Button>
        <Button
          onClick={async () => {
            try {
              await axios.put(
                `http://localhost:5000/api/review/${editingReply.reviewId}/comments/${editingReply.commentId}/replies/${editingReply.replyId}`,
                { text: editingReply.text },
                config
              );
              setEditingReply({
                reviewId: null,
                commentId: null,
                replyId: null,
                text: ''
              });
              getAllReviews();
              toast.success("Réponse modifiée avec succès");
            } catch (error) {
              console.error("Error updating reply:", error);
              toast.error("Erreur lors de la modification de la réponse");
            }
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full"
        >
          Enregistrer
        </Button>
      </div>
    </BlurContainer>
  </div>
)}
    </div>


  );
};
export default ReviewsPage;