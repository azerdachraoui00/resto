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
          console.log("back  ready")
            upload.single("file")(req, res, async function (err) {
                if (err) {
                  return res.status(400).json({ error: "File upload failed" });
                }
        const { description, rating } = req.body;
        console.log(req.body)
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
      console.log(text)
        try {
          const review = await Review.findById(req.params.id);
      console.log(review)
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

      addReply  :  async (req, res) => {
        const { text } = req.body;
      
        try {
          const review = await Review.findById(req.params.id);
          const comment = review.comments.find(
            comment => comment.id === req.params.commentId
          );
      
          const newReply = {
            user: req.user.id,
            text
          };
      
          comment.replies.unshift(newReply);
          await review.save();
          res.json(comment.replies);
        } catch (err) {
          console.error(err.message);
          res.status(500).send('Server error');
        }
      }    , 
      likeReview  :  async (req, res) => {
        try {
          console.log(req.params.id)
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
      }
} 

module.exports = review;
