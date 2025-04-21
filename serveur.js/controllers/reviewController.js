const Review = require('../models/ReviewSchema');
const multer = require("multer");

const mongoose = require('mongoose')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "reviews/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({
  storage: storage,
});


const review = {
  getReviewsByUsers: async (req, res) => {
    try {
      const reviews = await Review.find({ user: req.user.id })
        .populate('user')
        .populate('likes')
        .populate('comments.user')
        .populate('comments.replies.user')
        .sort({ createdAt: -1 });
  
      res.status(200).json(reviews);
    } catch (err) {
      console.error('Error fetching user reviews:', err.message);
      res.status(500).send('Server error');
    }
  } , 
  getReviews: async (req, res) => {
    try {
      const reviews = await Review.find({})
        .populate('user')
        .populate('likes')
        .populate('comments.user')
        .populate('comments.replies.user')
        .sort({ createdAt: -1 });
  
      res.status(200).json(reviews);
    } catch (err) {
      console.error('Error fetching user reviews:', err.message);
      res.status(500).send('Server error');
    }
  }
 ,   
      createReview :  async (req, res) => {
        try {
            upload.single("file")(req, res, async function (err) {
                if (err) {
                  return res.status(400).json({ error: "File upload failed" });
                }
        const { description, rating } = req.body;
          const newReview = new Review({
            user : req.user.id , 
            description,
            rating,
            image : req.file.filename
          });
      
          const review = await newReview.save();
          res.json(review);
        }  )} catch (err) {
          console.error(err.message);
          res.status(500).send('Server error');
        }
      },


      addComment : async (req, res) => {

        const { text } = req.body;
        try {
          const review = await Review.findById(req.params.id);
          const newComment = {
            user: req.user.id,
            text
          };
      
          review.comments.unshift(newComment);
          await review.save();
          res.json(review.comments);
        } catch (err) {
          console.error(err.message);
          res.status(500).send('Server error');
        }
      },


      likeReview  :  async (req, res) => {
        try {
          const review = await Review.findById(req.params.id);
                if (review.likes.some(like => like.toString() === req.user.id)) {
            review.likes = review.likes.filter(like => like.toString() !== req.user.id);
          } else {
            review.likes.unshift(req.user.id);
          }
          await review.save();
          res.json(review.likes);
        } catch (err) {
          console.error(err.message);
          res.status(500).send('Server error');
        }
      } , 

      addReply : async (req, res) => {
        try {
          const { text } = req.body;
          const { id, commentId } = req.params;

           console.log(req.body)
      
          if (!text || text.trim().length === 0) {
            return res.status(400).json({ msg: 'Le texte de la réponse est requis' });
          }
                const review = await Review.findById(id);
          if (!review) {
            return res.status(404).json({ msg: 'Review non trouvée' });
          }
                const comment = review.comments.find(c => c._id.toString() === commentId);
          if (!comment) {
            return res.status(404).json({ msg: 'Commentaire non trouvé' });
          }
                const newReply = {
            user: req.user.id,
            text: text.trim()
          };
      
          comment.replies.unshift(newReply);
      
          await review.save();
      
          await Review.populate(review, {
            path: 'comments.replies.user',
            select: 'firstName lastName profilePic'
          });
      
          const updatedComment = review.comments.find(c => c._id.toString() === commentId);
          res.json(updatedComment.replies);
      
        } catch (err) {
          console.error(err.message);
                    if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'ID non valide' });
          }
      
          res.status(500).send('Erreur serveur');
        }
      }
} 

module.exports = review;
