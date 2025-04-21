import React, { useState } from "react";
import { FaStar, FaRegStar, FaHeart, FaRegHeart, FaComment, FaReply, FaTimes } from "react-icons/fa";
import BlurContainer from "../components/blurContainer";
import Button from "../components/button";
import toast from 'react-hot-toast';
import axios from 'axios';


const ReviewsPage = () => {
  
const [reviews, setReviews] = useState([]);
  onst [newComments, setNewComments] = useState({});
  const [activeModal, setActiveModal] = useState({
    type: null, 
    reviewId: null,
    comment: null
  });

  const handleLike = (id) => {
    setReviews(
      reviews.map((r) =>
        r.id === id
          ? { ...r, likes: r.liked ? r.likes - 1 : r.likes + 1, liked: !r.liked }
          : r
      )
    );const [newReview, setNewReview] = useState({ description: "", image: "", rating: 0 });
  c
  };

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

  const handleComment = (reviewId) => {
    const commentText = newComments[reviewId]?.trim();
    if (!commentText) return;

    const newComment = { 
      id: Date.now(), 
      user: "Vous", 
      avatar: "https://i.pravatar.cc/150?img=5",
      text: commentText, 
      replies: [] 
    };
    
    setReviews(
      reviews.map((r) =>
        r.id === reviewId ? { ...r, comments: [...r.comments, newComment] } : r
      )
    );
    setNewComments({ ...newComments, [reviewId]: "" });
  };

  const handleReply = (replyText) => {
    if (!replyText.trim()) return;

    const newReply = { 
      id: Date.now(), 
      user: "Vous", 
      avatar: "https://i.pravatar.cc/150?img=5",
      text: replyText 
    };

    setReviews(
      reviews.map(review => {
        if (review.id === activeModal.reviewId) {
          return {
            ...review,
            comments: review.comments.map(comment => {
              if (comment.id === activeModal.comment.id) {
                return {
                  ...comment,
                  replies: [...comment.replies, newReply]
                };
              }
              return comment;
            })
          };
        }
        return review;
      })
    );
    
    closeModal();
  };

  const handlePostReview = async () => {
    if (!newReview.rating) return;

    const hasText = newReview.description.trim() !== "";
    const hasImage = !!newReview.image;
    if (!hasText && !hasImage) return;

    const newEntry = {
      id: reviews.length + 1,
      user: "Vous",
      avatar: "https://i.pravatar.cc/150?img=5",
      description: newReview.description,
      image: newReview.image,
      rating: newReview.rating,
      likes: 0,
      comments: [],
      liked: false,
    };

    setReviews([...reviews, newEntry]);
    setNewReview({ description: "", image: "", rating: 0 });
  };

  const getCurrentReview = () => {
    return reviews.find(r => r.id === activeModal.reviewId);
  };


  const [file , setfile] = useState()
  const [description , setdescription] = useState()
  const [rating , setrating] = useState()
  const [password , setpassword] = useState()
  const [passwordrep , setpasswordrep] = useState()
  const [email , setemail] = useState()

  const upload = async () => {
    try {
      const formadata = new FormData()
  
      if (!description  || description.length === 0) {
        toast.error(
          <b>
            verifier  Longeur de Description 
          </b>)
          return; 
      }
      else  {
        formadata.append("description", description);
      }
     
      if (rating === undefined || !email.includes("@")   || !email.includes(".")||  !/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) {
        toast.error(
          <b>
            Email Invalide
          </b>)
          return;
      }
     else {
        formadata.append("email", email);
      }
  
      if (!password || password.length !== 8) {
        toast.error(
          <b>
            Mot de passe Invalid
          </b>)
          return ; 
      }
      else {
        formadata.append("password", password);
      }
      if (password !== passwordrep) {
        toast.error(
          <b>
            Le mot de passe ne correspond pas
          </b>)
          return ; 
      }
      if(file) {
          formadata.append("file", file);
         }
         else {
          toast.error(
            <b>
              file  Invalide
            </b>)
            return ; 
        }
        if (!sexe || (sexe !== "Famme" && sexe !== "Homme")) {
          toast.error(
            <b>
              Sexe Invalid
            </b>)
            return ; 
        }
        else {
          formadata.append("Sexe", sexe);
  
        }
         await axios.post(process.env.API_URL+"/responsable/createresponsable",
      formadata , config
      ).then((response) => {
        console.log("responsable",response.data)
        toast.success(
          <b>
            créer un responsable avec succès
          </b>
        );
        navigate("/list")    });
  
    } catch (error) {
      if (error.response.data.msg === "Invalid Authentication"){
        localStorage.removeItem('accessToken');
        navigate("/")
      }
      }
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center py-10 px-4 sm:px-6 lg:px-16 bg-cover bg-center"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative z-10 w-full max-w-4xl text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 pt-24">
          Avis des Clients
        </h1>

        {/* Formulaire d'ajout d'avis */}
        <BlurContainer className="w-full p-6 rounded-2xl bg-black bg-opacity-60 mb-8">
          <h2 className="text-white text-xl mb-4">Ajoutez votre avis</h2>
          <textarea
            className="w-full p-2 rounded-md mb-2 bg-gray-800 text-white"
            placeholder="Décrivez votre expérience..."
            value={newReview.description}
            onChange={(e) =>
            {
              console.log(e.target.value)
              setdescription(e.target.value)
            }
            }
          />
          <input
            type="file"
            accept="image/*"
            className="mb-2 text-white"
            onChange={(e) =>{
              setfile(e.target.files[0])
              console.log(e.target.files[0])
            }
              
            }
          />
          <div className="flex space-x-1 mb-4 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => 
                {
                  console.log(start)
                  setrating(star)
                }
                  }
                className="text-2xl"
              >
                {star <= newReview.rating ? (
                  <FaStar className="text-yellow-500" />
                ) : (
                  <FaRegStar className="text-gray-400" />
                )}
              </button>
            ))}
          </div>
          <Button
            onClick={upload}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-full transition"
          >
            Publier
          </Button>
        </BlurContainer>

        Liste des avis
        <div className="w-full space-y-6">
          {reviews.map((review) => (
            <BlurContainer
              key={review.id}
              className="p-6 rounded-xl bg-black bg-opacity-70"
            >
              <div className="flex items-start mb-4">
                <img 
                  src={review.avatar} 
                  alt={review.user} 
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div className="text-left">
                  <div className="text-white font-semibold">{review.user}</div>
                  <div className="flex items-center mb-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-500 text-sm" />
                    ))}
                  </div>
                </div>
              </div>
              
              <p className="text-white mb-4 text-left">{review.description}</p>
              
              {review.image && (
                <img
                  src={review.image}
                  alt="Review"
                  className="rounded-lg w-full mb-4 max-h-80 object-cover"
                />
              )}
              
              <div className="flex items-center space-x-6 text-white mb-4 border-t border-gray-700 pt-3">
                <button 
                  onClick={() => handleLike(review.id)}
                  className="flex items-center space-x-1 hover:text-red-400 transition"
                >
                  {review.liked ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart />
                  )}
                  <span>{review.likes}</span>
                </button>
                <button 
                  onClick={() => openCommentsModal(review.id)}
                  className="flex items-center space-x-1 hover:text-blue-400 transition"
                >
                  <FaComment />
                  <span>{review.comments.length}</span>
                </button>
              </div>

              {/* Comment input (only shows 1 comment preview) */}
              {review.comments.length > 0 && (
                <div className="text-left text-white mb-4">
                  <div className="bg-gray-800 bg-opacity-60 p-3 rounded-md">
                    <div className="flex items-start mb-1">
                      <img 
                        src={review.comments[0].avatar} 
                        alt={review.comments[0].user} 
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <div>
                        <div className="font-semibold text-sm">{review.comments[0].user}</div>
                        <p className="text-sm">{review.comments[0].text}</p>
                      </div>
                    </div>
                    {review.comments[0].replies.length > 0 && (
                      <div className="ml-10 mt-2">
                        <div className="bg-gray-700 bg-opacity-60 p-2 rounded-md">
                          <div className="flex items-start">
                            <img 
                              src={review.comments[0].replies[0].avatar} 
                              alt={review.comments[0].replies[0].user} 
                              className="w-6 h-6 rounded-full mr-2"
                            />
                            <div>
                              <div className="font-semibold text-xs">{review.comments[0].replies[0].user}</div>
                              <p className="text-xs">{review.comments[0].replies[0].text}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {review.comments.length > 1 && (
                      <button 
                        onClick={() => openCommentsModal(review.id)}
                        className="text-xs text-blue-400 hover:text-blue-300 mt-2"
                      >
                        Voir les {review.comments.length - 1} commentaires supplémentaires
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Comment input */}
              <div className="flex items-center gap-2">
                <img 
                  src="https://i.pravatar.cc/150?img=5" 
                  alt="Vous" 
                  className="w-8 h-8 rounded-full"
                />
                <input
                  type="text"
                  placeholder="Ajouter un commentaire..."
                  value={newComments[review.id] || ""}
                  onChange={(e) =>
                    setNewComments({ ...newComments, [review.id]: e.target.value })
                  }
                  className="flex-1 px-3 py-2 rounded-full bg-gray-700 text-white text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleComment(review.id)}
                />
                <Button
                  onClick={() => handleComment(review.id)}
                  className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition"
                >
                  Envoyer
                </Button>
              </div>
            </BlurContainer>
          ))}
        </div>
      </div>

      {/* Comments Modal */}
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
              {getCurrentReview()?.comments.map(comment => (
                <div key={comment.id} className="bg-gray-800 p-4 rounded-md">
                  <div className="flex items-start">
                    <img 
                      src={comment.avatar} 
                      alt={comment.user} 
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-white">{comment.user}</div>
                      <p className="text-white text-sm mt-1">{comment.text}</p>
                      
                      <button 
                        onClick={() => openReplyModal(activeModal.reviewId, comment)}
                        className="text-xs text-blue-400 hover:text-blue-300 mt-2 flex items-center"
                      >
                        <FaReply className="mr-1" /> Répondre
                      </button>
                      
                      {comment.replies.length > 0 && (
                        <div className="ml-6 mt-3 space-y-3">
                          {comment.replies.map(reply => (
                            <div key={reply.id} className="bg-gray-700 p-3 rounded-md">
                              <div className="flex items-start">
                                <img 
                                  src={reply.avatar} 
                                  alt={reply.user} 
                                  className="w-8 h-8 rounded-full mr-2"
                                />
                                <div>
                                  <div className="font-semibold text-sm text-white">{reply.user}</div>
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
            
            <div className="flex items-center gap-2 mt-6 sticky bottom-0 bg-black bg-opacity-90 py-3">
              <img 
                src="https://i.pravatar.cc/150?img=5" 
                alt="Vous" 
                className="w-10 h-10 rounded-full"
              />
              <input
                type="text"
                placeholder="Ajouter un commentaire..."
                value={newComments[activeModal.reviewId] || ""}
                onChange={(e) =>
                  setNewComments({ ...newComments, [activeModal.reviewId]: e.target.value })
                }
                className="flex-1 px-4 py-2 rounded-full bg-gray-700 text-white"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleComment(activeModal.reviewId);
                    e.target.value = "";
                  }
                }}
              />
              <Button
                onClick={() => {
                  handleComment(activeModal.reviewId);
                  document.querySelector('#commentInput').value = "";
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition"
                id="commentInput"
              >
                Envoyer
              </Button>
            </div>
          </BlurContainer>
        </div>
      )}

      {/* Reply Modal */}
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
                  src={activeModal.comment.avatar} 
                  alt={activeModal.comment.user} 
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div>
                  <div className="font-semibold text-sm text-white">{activeModal.comment.user}</div>
                  <p className="text-sm text-white">{activeModal.comment.text}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="https://i.pravatar.cc/150?img=5" 
                alt="Vous" 
                className="w-8 h-8 rounded-full"
              />
              <input
                type="text"
                placeholder="Écrire une réponse..."
                id="replyInput"
                className="flex-1 px-3 py-2 rounded-full bg-gray-700 text-white text-sm"
                autoFocus
              />
            </div>
            
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
                  handleReply(replyText);
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